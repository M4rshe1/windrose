import React from 'react';
import {Item, StepsItem} from './stepsItem';


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
                    <StepsItem key={index} item={section} disabled={disabled} metric={metric} index={index} sort={sort} length={items.length} tour={{
                        name: tour.name,
                        owner: tour.TourToUser.find((ttu: { role: string; }) => ttu.role === "OWNER").user.username,
                        status: tour.status,
                        id: tour.id,
                    }}/>
                )
            }
        </>
    );


}