export interface AutocompleteResponse {
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
        name: string;
        country: string;
        country_code: string;
    };
}

export interface ErrorResponse {
    error: string;
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

    async autocomplete(query: string, limit: number = 5, dedupe: 1 | 0 = 1): Promise<AutocompleteResponse[] | ErrorResponse> {
        if (!query || !this.apiKey) throw new Error("Missing query")
        const response = await fetch(`https://api.locationiq.com/v1/autocomplete?key=${this.apiKey}&q=${query}&format=json&limit=${limit}&dedupe=${dedupe}`)
        return response.json()
    }

    async search(query: string) {
        if (!query || !this.apiKey) throw new Error("Missing query")
        const response = await fetch(`https://api.locationiq.com/v1/search?key=${this.apiKey}&q=${query}&format=json`)
        return response.json()
    }

    async directions(points: { lat: number, lon: number }[], profile: 'driving' = 'driving') {
        if (!points || !this.apiKey) throw new Error("Missing points")

        const maxPoints = 25;
        const chunks = [];
        for (let i = 0; i < points.length; i += maxPoints) {
            chunks.push(points.slice(i, i + maxPoints));
        }

        return await Promise.all(chunks.map(async chunk => {
            const response = await fetch(`https://api.locationiq.com/v1/directions/${profile}/${chunk.map(p => `${p.lon},${p.lat}`).join(';')}?key=${this.apiKey}&format=json&steps=true&geometries=polyline&overview=full`);
            return response.json();
        }));
    }
}