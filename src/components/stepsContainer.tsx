import React from 'react';
import {StepsItem} from './stepsItem';
import {TourSection, TourSectionToFile} from "@prisma/client";

interface images extends TourSectionToFile {
    file: File
}

interface Item extends TourSection {
    images: images[]
}

export function StepsContainer({tour, disabled, metric, sort}: {
    tour: any,
    disabled: boolean,
    metric: boolean,
    sort: "ASC" | "DESC"
}) {
    const items = tour.sections.sort((a: { datetime: number; }, b: { datetime: number; }) => {
        if (sort === "ASC") {
            return a.datetime - b.datetime
        } else {
            return b.datetime - a.datetime
        }
    })

    return (
        <>
            {
                items.map((section: Item, index: number) =>
                    <StepsItem key={index} item={section} disabled={disabled} metric={metric} index={index} tour={{
                        name: tour.name,
                        owner: tour.TourToUser.find((ttu: { role: string; }) => ttu.role === "OWNER").user.username,
                        status: tour.status
                    }}/>
                )
            }
        </>
    );


}