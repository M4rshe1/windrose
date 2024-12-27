"use server"

import LocationIQ from "@/lib/locationIQ";

interface LocationIQOptions {
    query?: string;
    lat?: number;
    lon?: number;
    limit?: number;
    dedupe?: 1 | 0;
    points?: { lat: number, lon: number }[];
}

export async function locationIQAction(action: string, options: LocationIQOptions) {
    const locationIq = new LocationIQ();
    switch (action) {
        case 'search':
            return await locationIq.search(options.query as string);
        case 'reverse':
            return await locationIq.reverse(options.lat as number, options.lon as number);
        case 'autocomplete':
            return await locationIq.autocomplete(options.query as string, options.limit, options.dedupe);
        case 'directions':
            return await locationIq.directions(options.points as { lat: number, lon: number }[]);
        default:
            throw new Error(`Unknown action: ${action}`);
    }
    
}