'use server'

import db from "@/lib/db";
import LocationIQ from "@/lib/locationIQ";

export async function calculateDirections(tourId: string, sectionId: string | undefined) {
    if (!sectionId) return;
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
                        duration: directions.routes[0]?.duration,
                        distance: directions.routes[0]?.distance
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
}

export async function getPreviousSection(tourId: string, sectionId: string) {
    const sections = await db.tourSection.findMany({
        where: {
            tourId: tourId
        },
        orderBy: {
            datetime: 'asc'
        }
    })
    const sectionIndex = sections.findIndex(s => s.id === sectionId)
    if (sectionIndex === -1) return;
    if (sectionIndex > 0) {
        return null
    }
    return null
}

export async function getNextSection(tourId: string, sectionId: string) {
    const sections = await db.tourSection.findMany({
        where: {
            tourId: tourId
        },
        orderBy: {
            datetime: 'asc'
        }
    })
    const sectionIndex = sections.findIndex(s => s.id === sectionId)
    if (sectionIndex === -1) return;
    if (sectionIndex < sections.length - 1) {
        return sections[sectionIndex + 1]
    }
    return null
}

