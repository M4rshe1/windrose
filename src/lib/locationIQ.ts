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
        if (!process.env.LOCATIONIQ_ACCESS_TOKEN)
            throw new Error("Missing LOCATIONIQ_ACCESS_TOKEN")

        this.apiKey = process.env.LOCATIONIQ_ACCESS_TOKEN as string
    }

    async reverse(lat: number, lon: number) {
        if (!lat || !lon || !this.apiKey) throw new Error("Missing lat or lon")
        const response = await fetch(`https://us1.locationiq.com/v1/reverse?key=${this.apiKey}&lat=${lat}&lon=${lon}&format=json`)
        return response.json()
    }

    async autocomplete(query: string, limit: number = 5, dedupe: 1 | 0 = 1): Promise<LocationIQResponse[] | ErrorResponse> {
        if (!query || !this.apiKey) throw new Error("Missing query")
        const response = await fetch(`https://api.locationiq.com/v1/autocomplete?key=${this.apiKey}&q=${query}&format=json&limit=${limit}&dedupe=${dedupe}`)
        return response.json()
    }

    async search(query: string) {
        if (!query || !this.apiKey) throw new Error("Missing query")
        const response = await fetch(`https://api.locationiq.com/v1/search?key=${this.apiKey}&q=${query}&format=json`)
        return response.json()
    }

    async directions(points: { lat: number, lon: number }[], profile: 'driving' = 'driving'): Promise<RouteResponse | ErrorResponse> {
        if (!points || !this.apiKey) throw new Error("Missing points")

        const maxPoints = 25;
        const chunks = [];
        for (let i = 0; i < points.length; i += maxPoints) {
            chunks.push(points.slice(i, i + maxPoints));
        }

        const data = await Promise.all(chunks.map(async chunk => {
            const response = await fetch(`https://api.locationiq.com/v1/directions/${profile}/${chunk.map(p => `${p.lon},${p.lat}`).join(';')}?key=${this.apiKey}&steps=true&geometries=polyline&overview=full`);
            return response.json();
        }));
        console.log(data)
        const error = data.find(d => d.error);
        const code = data.find(d => d.code !== 'Ok')?.code;
        if (error) return error;
        if (code !== 'Ok' && error != undefined) return { error: code };

        
        const routes = data.map(d => d.routes).flat();
        const waypoints = data.map(d => d.waypoints).flat();
        return { code: 'Ok', routes, waypoints };
    }
}