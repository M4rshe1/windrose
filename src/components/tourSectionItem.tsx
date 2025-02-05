import {Country, File as PrismaFile, TourSection, TourSectionStatus, TourSectionToFile} from "@prisma/client";
import {cn, distanceReadable, getMinioLinkFromKey} from "@/lib/utils";
import React from "react";
import InfiniteCarousel from "@/components/infinity-craousel";
import {VEHICLES} from "@/lib/vehicles";

interface images extends TourSectionToFile {
    file: PrismaFile
}

export interface Section extends TourSection {
    images: images[]
    country: Country
}

const TourSectionItem = ({section, index, distance, distanceUntilNow, metric, length}: {
    section: Section,
    index: number,
    distance: number,
    distanceUntilNow: number,
    metric: boolean,
    length: number
}) => {
    const images = section.images.map(image => image.file);

    return (
        <div
            id={`section-${index}`}
            className={"w-full grid grid-cols-[4rem_1fr] items-start auto-rows-[minmax(10rem,auto)] gap-4"}
        >{
            index !== 0 ?
                <>
                    <TourSectionItemNumber distanceUntilNow={distanceUntilNow} index={index}
                                           distance={distance}
                                           metric={metric}
                                           status={section.status}
                                           length={length}
                    />
                    <div className={"max-w-full"}>

                        <TourSectionItemText section={section}/>
                        {
                            section.images.length > 0 &&
                            <TourSectionItemImagesCarousel images={images}/>
                        }
                    </div>
                </> : (
                    <>
                        <TourSectionItemNumber distanceUntilNow={distanceUntilNow} index={index}
                                               distance={distance}
                                               metric={metric}
                                               status={section.status}
                                               length={length}
                        />
                        <TourSectionItemText section={section}/>
                    </>
                )
        }
        </div>
    )
}

const TourSectionItemText = ({section}: { section: Section }) => {
    const Vehicle = VEHICLES.find(vehicle => vehicle.value === section.vehicle)?.icon;
    return (
        <div>
            <div
                className={"flex flex-col items-start"}
            >

                <h2
                    className={"text-2xl font-bold mt-2 flex items-center gap-2"}
                >
                    {section.name}
                    {
                        Vehicle &&   
                    <span
                        className={"text-sm opacity-70"}
                    >
                        <Vehicle/>
                    </span>
                    }
                </h2>
                    <p className={'text-sm opacity-70 flex items-center gap-1 font-normal'}>
                        {
                            section.nights ? <>
                                {
                                    <span>
                                                {
                                                    section.datetime?.toLocaleDateString(
                                                        'en-US',
                                                        {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: '2-digit',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            hour12: false
                                                        }
                                                    )
                                                }
                                        <span className={'lg:hidden'}> until</span>
                                            </span>
                                }
                                <span className={'max-lg:hidden'}>&nbsp;-&nbsp;</span>
                                {
                                    <span>
                                                {
                                                    new Date(new Date(section.datetime as Date).setDate(new Date(section.datetime as Date).getDate() + section.nights))
                                                        .toLocaleDateString(
                                                            'en-US',
                                                            {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: '2-digit',
                                                                hour12: false
                                                            }
                                                        )
                                                }
                                            </span>

                                }
                            </> : <>
                                {
                                    section.datetime?.toLocaleDateString(
                                        'en-US',
                                        {
                                            year: 'numeric',
                                            month: 'long',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false
                                        }
                                    )
                                }
                            </>
                        }
                    </p>
            </div>

            <p>{section.description}</p>
        </div>
    )
}

const TourSectionItemImagesCarousel = ({images}: { images: PrismaFile[] }) => {
    return (
        <div
            className={"mt-2 max-h-48 aspect-video rounded overflow-hidden"}
        >
            {
                images.length > 0 &&
                <InfiniteCarousel images={images.map(image => getMinioLinkFromKey(image.fileKey))}/>
            }
        </div>
    )
}

const TourSectionItemNumber = ({distanceUntilNow, distance, index, metric, status, length}: {
    distanceUntilNow: number,
    distance: number,
    index: number,
    metric: boolean,
    status: TourSectionStatus,
    length: number,
}) => {
    return (
        <div
            className={"w-full h-full relative flex items-center justify-center"}
        >
            {
                index !== length - 1 &&
                <div
                    className={cn("absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-full bg-base-200")}>
                </div>
            }
            <div
                className={cn("absolute top-0 left-1/2 transform -translate-x-1/2 rounded-full flex items-center justify-center flex-col aspect-square h-12 text-2xl bg-base-200 border-2",
                    status == TourSectionStatus.PLANNED ? "border-info" : status == TourSectionStatus.SKIPPED ? "border-warning" : "border-success"
                )}>
                <p>
                    {index + 1}
                </p>
            </div>
            {
                index !== length - 1 &&
                <div
                    className={cn("absolute top-1/2 left-1/2 pb-6 transform pr-12 -translate-x-1/2 -translate-y-1/2 text-primary font-bold -rotate-90 whitespace-nowrap")}>
                    +{distanceReadable(distance, metric, 0)}
                </div>
            }
            {
                index !== length - 1 &&
                <div
                    className={cn("absolute top-1/2 left-1/2 pt-6 transform pr-12 -translate-x-1/2 -translate-y-1/2 opacity-50 font-bold -rotate-90 whitespace-nowrap")}>
                    {distanceReadable(distanceUntilNow, metric, 0)}
                </div>
            }
        </div>
    )
}

export default TourSectionItem;