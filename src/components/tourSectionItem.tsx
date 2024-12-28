import {Country, File as PrismaFile, TourSection, TourSectionStatus, TourSectionToFile} from "@prisma/client";
import {cn, distanceReadable, getMinioLinkFromKey} from "@/lib/utils";
import {Carousel, CarouselContent, CarouselItem} from "@/components/ui/carousel";
import Image from "next/image";
import React from "react";

interface images extends TourSectionToFile {
    file: PrismaFile
}

export interface Section extends TourSection {
    images: images[]
    country: Country
}

const TourSectionItem = ({section, index, distance, metric, length}: {
    section: Section,
    index: number,
    distance: number,
    metric: boolean,
    length: number
}) => {
    return (
        <div
            className={"w-full grid grid-cols-[4rem_1fr] auto-rows-[16rem] items-start"}
        >{
            index !== 0 ?
                <>
                    <TourSectionItemNumber distance={distance} index={index}
                                           metric={metric}
                                           status={section.status}
                                           length={length}
                                           section={section}
                    />
                    <div>

                        <TourSectionItemImagesCarousel images={section.images.map(image => image.file)}/>
                        <TourSectionItemText section={section}/>
                    </div>
                </> : (
                    <>
                        <TourSectionItemNumber distance={distance} index={index}
                                               metric={metric}
                                               status={section.status}
                                               length={length}
                                               section={section}
                        />
                        <TourSectionItemText section={section}/>
                    </>
                )
        }
        </div>
    )
}

const TourSectionItemText = ({section}: { section: Section }) => {
    return (
        <div>
            <h2
                className={"text-2xl font-bold mt-2 flex items-end gap-1"}
            >
                {section.name}
                {section?.duration && section?.distance &&
                    <span className={'text-lg opacity-70 flex items-center gap-1'}>
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
                            </span>
                }
            </h2>
            <p>{section.description}</p>
        </div>
    )
}

const TourSectionItemImagesCarousel = ({images}: { images: PrismaFile[] }) => {
    console.log(images)
    return (
        <div
            className={"w-full"}
        >
            <Carousel className="w-full max-w-full">
                <CarouselContent>
                    {images.map((image, index) => (
                        <CarouselItem key={index}>
                            <div className="p-1">
                                <Image
                                    src={getMinioLinkFromKey(image.fileKey)}
                                    alt={image.fileName}
                                    layout="responsive"
                                    width={1000}
                                    height={1000}
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {/*<CarouselPrevious/>*/}
                {/*<CarouselNext/>*/}
            </Carousel>
        </div>
    )
}

const TourSectionItemNumber = ({section, distance, index, metric, status, length}: {
    section: Section,
    distance: number,
    index: number,
    metric: boolean,
    status: TourSectionStatus,
    length: number
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
                index !== 0 &&
                <div
                    className={cn("absolute -top-1/2 left-1/2 pb-6 pl-12 transform -translate-x-1/2 translate-y-1/2 text-success/50 font-bold -rotate-90 whitespace-nowrap")}>
                    +{section?.distance && distanceReadable(section.distance, metric, 0)}
                </div>
            } 
            {
                index > 1 &&
                <div
                    className={cn("absolute -top-1/2 left-1/2 pt-6 pl-12 transform -translate-x-1/2 translate-y-1/2 opacity-50 font-bold -rotate-90 whitespace-nowrap")}>
                    {distanceReadable(distance, metric, 0)}
                </div>
            }
        </div>
    )
}

export default TourSectionItem;