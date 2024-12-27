'use server'

import db from "@/lib/db";
import LocationIQ from "@/lib/locationIQ";

export async function recalculateDirectionsAround(tourId: string, sectionId: string) {
    const sections = await db.tourSection.findMany({
        where: {
            tourId: tourId
        },
        orderBy: {
            datetime: 'asc'
        }
    })
    const locationIQ = new LocationIQ()
    const sectionIndex = sections.findIndex(s => s.id === sectionId)
    const currentSection = sections[sectionIndex]
    if (sectionIndex === -1) return;
    if (sectionIndex > 0) {
        const previousSection = sections[sectionIndex - 1]
        if (previousSection.lat && previousSection.lng) {
            const directions = await locationIQ.directions([
                {lat: previousSection.lat as number, lon: previousSection.lng as number},
                {lat: currentSection.lat as number, lon: currentSection.lng as number}
            ])
            if ("routes" in directions && directions.routes.length > 0) {
                await db.tourSection.update({
                    where: {
                        id: currentSection.id
                    },
                    data: {
                        duration: directions.routes[0].duration,
                        distance: directions.routes[0].distance
                    }
                })
            }
        }
    } else {
        await db.tourSection.update({
            where: {
                id: currentSection.id
            },
            data: {
                duration: null,
                distance: null
            }
        })
    }

    if (sectionIndex < sections.length - 1) {
        const nextSection = sections[sectionIndex + 1]
        if (nextSection.lat && nextSection.lng) {
            const directions = await locationIQ.directions([
                {lat: currentSection.lat as number, lon: currentSection.lng as number},
                {lat: nextSection.lat as number, lon: nextSection.lng as number}
            ])
            if ("routes" in directions && directions.routes.length > 0) {
                await db.tourSection.update({
                    where: {
                        id: nextSection.id
                    },
                    data: {
                        duration: directions.routes[0]?.duration,
                        distance: directions.routes[0]?.distance
                    }
                })
            }
        }
    }
}