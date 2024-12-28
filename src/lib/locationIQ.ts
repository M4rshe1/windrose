import fs from 'fs'

export interface LocationIQResponse {
    place_id: string;
    osm_id: string;
    osm_type: string;
    licence: string;
    lat: string;
    lon: string;
    boundingbox: [string, string, string, string];
    class: string;
    type: string;
    display_name: string;
    display_place: string;
    display_address: string;
    address: {
        name?: string;
        road?: string;
        village?: string;
        municipality?: string;
        county?: string;
        state?: string;
        postcode?: string;
        country?: string;
        country_code?: string;
    };
}


export interface ErrorResponse {
    error: string;
}

export interface RouteResponse {
    code: string;
    routes: Route[];
    waypoints: Waypoint[];
    error?: string;
}

export interface Route {
    geometry: string;
    legs: Leg[];
    weight_name: string;
    weight: number;
    duration: number;
    distance: number;
}

export interface Leg {
    steps: Step[];
    summary: string;
    weight: number;
    duration: number;
    distance: number;
}

export interface Step {
    geometry: string;
    maneuver: Maneuver;
    mode: string;
    driving_side: string;
    name: string;
    intersections: Intersection[];
    weight: number;
    duration: number;
    distance: number;
}

export interface Maneuver {
    bearing_after: number;
    bearing_before: number;
    location: [number, number];
    modifier: string;
    type: string;
}

export interface Intersection {
    classes?: string[];
    out: number;
    entry: boolean[];
    bearings: number[];
    location: [number, number];
}

export interface Waypoint {
    hint: string;
    distance: number;
    name: string;
    location: [number, number];
}



export default class LocationIQ {
    private readonly apiKey: string

    constructor() {
        // if (!process.env.LOCATIONIQ_ACCESS_TOKEN)
        //     throw new Error("Missing LOCATIONIQ_ACCESS_TOKEN")

        this.apiKey = "pk.104cf69b99205b3391a67e16758f0346"
    }

    async reverse(lat: number, lon: number) {
        if (!lat || !lon || !this.apiKey) throw new Error("Missing lat or lon")
        const url = new URL(`https://us1.locationiq.com/v1/reverse`)
        url.searchParams.append('key', this.apiKey)
        url.searchParams.append('lat', lat.toString())
        url.searchParams.append('lon', lon.toString())  
        url.searchParams.append('format', 'json')
        url.searchParams.append('accept-language', 'en')
        const response = await fetch(url.toString())
        return response.json()
    }

    async autocomplete(query: string, limit: number = 5, dedupe: 1 | 0 = 1): Promise<LocationIQResponse[] | ErrorResponse> {
        if (!query || !this.apiKey) throw new Error("Missing query")
        const url = new URL(`https://api.locationiq.com/v1/autocomplete`)
        url.searchParams.append('key', this.apiKey)
        url.searchParams.append('q', query)
        url.searchParams.append('format', 'json')
        url.searchParams.append('limit', limit.toString())
        url.searchParams.append('dedupe', dedupe.toString())
        url.searchParams.append('accept-language', 'en')
        const response = await fetch(url.toString())
        return response.json()
    }

    async search(query: string) {
        if (!query || !this.apiKey) throw new Error("Missing query")
        const url = new URL(`https://api.locationiq.com/v1/search`)
        url.searchParams.append('key', this.apiKey)
        url.searchParams.append('q', query)
        url.searchParams.append('format', 'json')
        url.searchParams.append('accept-language', 'en')
        const response = await fetch(url.toString())
        return response.json()
    }

    async directions(points: { lat: number, lon: number }[], profile: 'driving' = 'driving'): Promise<RouteResponse | ErrorResponse> {
        if (!points || !this.apiKey) throw new Error("Missing points")

        const maxPoints = 24;
        const chunks = [];
        for (let i = 0; i < points.length; i += maxPoints) {
            chunks.push(points.slice(i, i + maxPoints));
        }
        
        const data: RouteResponse[]  = await Promise.all(chunks.map(async chunk => {
            const url = new URL(`https://api.locationiq.com/v1/directions/${profile}/${chunk.map(p => `${p.lon},${p.lat}`).join(';')}`)
            url.searchParams.append('key', this.apiKey)
            url.searchParams.append('steps', 'true')
            url.searchParams.append('geometries', 'polyline')
            url.searchParams.append('overview', 'full')
            const response = await fetch(url.toString())
            return await response.json();
        }));
        
        fs.writeFileSync('data.json', JSON.stringify(data, null, 2))
        const error = data.find(d => d.error);
        const code = data.find(d => d.code !== 'Ok')?.code;
        if (error) return error;
        if (code !== 'Ok' && error != undefined) return { error: code as string };

        const distance = data.map(d => d.routes[0].distance).reduce((a, b) => a + b, 0);
        const duration = data.map(d => d.routes[0].duration).reduce((a, b) => a + b, 0);
        const geometry = data.map(d => d.routes[0].geometry).join(';');
        const legs = data.map(d => d.routes[0].legs).flat();
        const routes = data.map(d => d.routes).flat();
        routes[0].distance = distance;
        routes[0].duration = duration
        routes[0].geometry = geometry;
        routes[0].legs = legs;
        const waypoints = data.map(d => d.waypoints).flat();
        return { code: 'Ok', routes, waypoints };
    }
}