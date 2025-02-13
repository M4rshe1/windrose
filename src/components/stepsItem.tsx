import React from 'react';
import {Country, TourSection, TourSectionStatus, TourSectionToFile, TourStatus} from "@prisma/client";
import {VEHICLES} from "@/lib/vehicles";
import {GitCommitVertical, LucideIcon, Play} from "lucide-react";
import {distanceReadable, timeReadable} from "@/lib/utils";
import {revalidatePath} from "next/cache";
import db from "@/lib/db";
import StepsItemDropdown from "@/components/StepsItemDropdown";
import minioClient from "@/lib/minioClient";
import {DateTimeSelect} from "@/components/DateTimeSelect";
import {calculateDirections, getNextSection} from "@/lib/directions";
import ReactCountryFlag from "react-country-flag";
import {auth} from "@/auth";
import {TablerIcon} from "@tabler/icons-react";

interface images extends TourSectionToFile {
    file: File
}

export interface Item extends TourSection {
    images: images[]
    country: Country
}

export function StepsItem({item, index, disabled, metric, tour, sort, length}: {
    item: Item,
    index: number,
    sort: "ASC" | "DESC",
    length: number,
    disabled: boolean,
    metric: boolean,
    tour: {
        name: string,
        owner: string,
        status: string,
        id: string
    }
}) {
    async function handleDelete() {
        "use server"
        const session = await auth()
        if (!session?.user?.id) return
        const images = await db.file.findMany({
            where: {
                TourSectionToFile: {
                    some: {
                        tourSectionId: item.id,
                        tourSection: {
                            tour: {
                                name: tour.name,
                                TourToUser: {
                                    some: {
                                        userId: session?.user?.id as string,
                                        role: {
                                            in: ["OWNER", "EDITOR"]
                                        }
                                    }
                                }
                            }
                        }
                    },
                }
            },
            select: {
                fileKey: true
            }
        })


        for (const image of images) {
            await minioClient.removeObject(process.env.NEXT_PUBLIC_MINIO_BUCKET as string, image.fileKey);
        }

        await db.tourSection.delete({
            where: {
                id: item.id,
                tour: {
                    name: tour.name,
                    TourToUser: {
                        some: {
                            userId: session?.user?.id as string,
                            role: {
                                in: ["OWNER", "EDITOR"]
                            }
                        }
                    }
                }
            }
        })
        await db.tourSectionToFile.deleteMany({
            where: {
                id: {
                    in: item.images.map(image => image.id)
                },
                tourSection: {
                    tour: {
                        name: tour.name,
                        TourToUser: {
                            some: {
                                userId: session?.user?.id as string,
                                role: {
                                    in: ["OWNER", "EDITOR"]
                                }
                            }
                        }
                    }
                }
            }
        })
        revalidatePath(`/${tour.owner}/${tour.name}/steps`)

    }

    async function handleDateTimeChange(date: Date | null, nights: number = 0) {
        "use server"
        if (!date || disabled) return
        const nextSection = await getNextSection(tour.id, item.id)

        await db.tourSection.update({
            where: {
                id: item.id
            },
            data: {
                datetime: date,
                nights: nights
            }
        })

        const newNextSection = await getNextSection(tour.id, item.id)
        await Promise.all([
            calculateDirections(tour.id, item.id),
            calculateDirections(tour.id, nextSection?.id),
            calculateDirections(tour.id, newNextSection?.id)
        ])

        revalidatePath(`/${tour.owner}/${tour.name}/steps`)
    }

    async function changeStatusAction(status: TourSectionStatus) {
        "use server"
        if (disabled) return
        if (status === TourSectionStatus.VISITED) {
            await db.tourSection.updateMany({
                where: {
                    tour: {
                        name: tour.name,
                        TourToUser: {
                            some: {
                                user: {
                                    username: tour.owner
                                }
                            }
                        }
                    },
                    OR: [
                        {
                            datetime: {
                                lt: item.datetime as Date
                            },
                            status: {
                                notIn: [TourSectionStatus.SKIPPED]
                            }
                        },
                        {
                            datetime: item.datetime as Date,
                        }
                    ],
                },
                data: {
                    status: status,
                }
            })
        } else {
            await db.tourSection.update({
                where: {
                    id: item.id
                },
                data: {
                    status: status,
                }
            })
        }
        let statusToSet: null | TourStatus = null
        if (tour.status === TourStatus.PLANNING && (status === TourSectionStatus.VISITED || status === TourSectionStatus.SKIPPED)) {
            statusToSet = TourStatus.ON_TOUR
        } else if (tour.status === TourStatus.FINISHED && (status === TourSectionStatus.PLANNED || status === TourSectionStatus.VISITED || status === TourSectionStatus.SKIPPED)) {
            statusToSet = TourStatus.ON_TOUR
        }

        if (statusToSet) {
            await db.tour.update({
                where: {
                    name: tour.name,
                    TourToUser: {
                        some: {
                            user: {
                                username: tour.owner
                            }
                        }
                    }
                },
                data: {
                    status: statusToSet
                }
            })
        }


        revalidatePath(`/${tour.owner}/${tour.name}/steps`)

    }

    let Icon: LucideIcon | TablerIcon 
    if (index === 0 && sort == "ASC" || index === length - 1 && sort == "DESC") {
        Icon = Play
    } else {
        Icon = VEHICLES.find(vehicle => vehicle.value === item.vehicle)?.icon || GitCommitVertical
    }

    return (
        <div>
            <div className={'flex items-center justify-between border-2 border-neutral rounded-lg bg-base-100 group'}>
                <div className={'flex items-center p-2 gap-2'}>
                    <div className={'w-8 aspect-square grid place-items-center'}>
                        <Icon size={24} className={'text-primary'}/>
                    </div>
                    <div className={'flex flex-col gap-1'}>
                        <div className={'flex items-center gap-2'}>
                            <p className={'font-semibold flex items-center gap-1'}>
                                {
                                    item?.country?.code &&
                                    <ReactCountryFlag countryCode={item?.country?.code} svg/>
                                }
                                {item.name || 'Unnamed'}
                            </p>
                            <p
                                className={`px-1 text-xs font-semibold rounded-full ${item.status === TourSectionStatus.VISITED ? 'bg-success/30 text-success' : item.status === TourSectionStatus.PLANNED ? 'bg-info/30 text-info' : 'bg-warning/50 text-warning'}`}
                            >
                                {item.status}
                            </p>
                            {
                                (index === 0 && sort == "ASC" || index === length - 1 && sort == "DESC") &&
                                <p className={'text-xs font-semibold text-info'}>
                                    Start
                                </p>
                            }
                            {
                                (index === 0 && sort == "DESC" || index === length - 1 && sort == "ASC") &&
                                <p className={'text-xs font-semibold text-success'}>
                                    Finish
                                </p>
                            }

                        </div>
                        <div className={'flex lg:items-center lg:flex-row flex-col lg:gap-2 whitespace-nowrap'}>
                            <p className={'text-sm opacity-70 flex lg:items-center max-lg:flex-col'}>
                                {
                                    item.nights ? <>
                                        {
                                            <span>
                                                {
                                                    item.datetime?.toLocaleDateString(
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
                                                    new Date(new Date(item.datetime as Date).setDate(new Date(item.datetime as Date).getDate() + item.nights))
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
                                            item.datetime?.toLocaleDateString(
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
                            {
                                (item.duration || item.distance) && <span
                                    className={'w-1.5 h-1.5 bg-base-content rounded-full opacity-70 lg:block hidden'}></span>
                            }
                            <p>
                                <span className={'text-sm opacity-70'}>
                                    {item.distance && distanceReadable(item.distance, metric)}
                                </span>
                                {
                                    (item.duration || item.distance) && <span className={'text-sm'}> in </span>
                                }
                                <span className={'text-sm opacity-70'}>
                                    {item.duration && timeReadable(item.duration, {
                                        days: "total",
                                        hours: "rest",
                                        minutes: "rest",
                                        label: "short",
                                        type: "seconds",
                                    })}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                {
                    !disabled &&
                    <div
                        className={'flex items-center gap-2 mr-4 transition ease-in-out duration-200 opacity-0 group-hover:opacity-100 max-lg:opacity-100'}>
                        <DateTimeSelect defaultValueDate={item.datetime as Date}
                                        defaultValueNights={item.nights || 0}
                                        onDateTimeChangeAction={handleDateTimeChange}
                                        label={"Date and Time"}/>

                        <StepsItemDropdown status={item.status} updateStatusAction={changeStatusAction}
                                           deleteStepAction={handleDelete} item={item}
                        />
                    </div>
                }
            </div>
        </div>
    );
}
