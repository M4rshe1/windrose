import React from 'react';
import {TourSection, TourSectionStatus, TourSectionToFile} from "@prisma/client";
import {vehicles} from "@/lib/vehicles";
import {Check, GitCommitVertical, MoreHorizontal, PenLine, Play, Trash} from "lucide-react";
import Link from "next/link";
import {distanceReadable, timeReadable} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {DateTimeSelect} from "@/components/DateTimeSelect";
import {revalidatePath} from "next/cache";
import db from "@/lib/db";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import StepsStatusDropdown from "@/components/StepsStatusDropdown";

interface images extends TourSectionToFile {
    file: File
}

interface Item extends TourSection {
    images: images[]
}

export function StepsItem({item, index, disabled, metric, tourName, ownerName}: {
    item: Item,
    index: number,
    disabled: boolean,
    metric: boolean
    tourName: string
    ownerName: string
}) {
    async function handleDelete() {
        'use server'
        console.log(item.id);
    }

    async function handleDateTimeChange(date: Date | null) {
        "use server"
        if (date && !disabled) {
            await db.tourSection.update({
                where: {
                    id: item.id
                },
                data: {
                    datetime: date
                }
            })
            revalidatePath(`/${ownerName}/${tourName}/steps`)
        }
    }

    async function changeStatusAction(status: TourSectionStatus) {
        "use server"
        console.log(status);
    }

    return (
        <div>
            <div className={'flex items-center justify-between border-2 border-neutral rounded-lg bg-base-100 group'}>
                <div className={'flex items-center p-2 gap-2'}>
                    <div className={'w-8 aspect-square grid place-items-center'}>
                        {
                            index === 0 ? <Play size={20}/> :
                                vehicles.find(vehicle => vehicle.value === item.vehicle)?.icon ||
                                <GitCommitVertical size={20}/>
                        }
                    </div>
                    <div className={'flex flex-col gap-1'}>
                        <div className={'flex items-center gap-2'}>

                            <p className={' font-semibold'}>
                                {item.name}
                            </p>
                            <p
                                className={`px-1 text-xs font-semibold rounded-full ${item.status === TourSectionStatus.VISITED ? 'bg-success/30 text-success' : item.status === TourSectionStatus.PLANNED ? 'bg-info/30 text-info' : 'bg-warning/50 text-warning'}`}
                            >
                                {item.status}
                            </p>
                        </div>
                        <div className={'flex lg:items-center lg:flex-row flex-col lg:gap-2 whitespace-nowrap'}>
                            <p className={'text-sm opacity-70'}>
                                {item.datetime?.toLocaleDateString(
                                    'en-US',
                                    {
                                        year: 'numeric',
                                        month: 'long',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                    }
                                )}
                            </p>
                            <p>
                                {
                                    (item.duration || item.distance) && <span
                                        className={'w-1.5 h-1.5 bg-base-content rounded-full opacity-70 lg:block hidden'}></span>
                                }
                                <span className={'text-sm opacity-70'}>
                                    {item.distance && distanceReadable(item.distance, metric)}
                                </span>
                                {
                                    (item.duration || item.distance) && <span className={'text-sm'}> in </span>
                                }
                                <span className={'text-sm opacity-70'}>
                                    {item.duration && timeReadable(item.duration)}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                {
                    !disabled &&
                    <div
                        className={'flex items-center gap-2 mr-4 transition ease-in-out duration-200 tooltip opacity-0 group-hover:opacity-100 max-lg:opacity-100'}>
                        <StepsStatusDropdown status={item.status} setStatus={changeStatusAction} className={'tooltip'} data-tip={'Change Status'}/>
                        <Link data-tip={'Edit'}
                              className={'tooltip'}
                              href={`${item.id}`}>
                            <Button variant={'outline'} size={'sm'}>
                                <PenLine size={20}/>
                            </Button>
                        </Link>
                        <DateTimeSelect data-tip={"Change Date"} onDateTimeChangeAction={handleDateTimeChange}
                                        defaultValue={item.datetime as Date} className={'tooltip max-lg:hidden'}/>
                        <Button data-tip={'Delete'} variant={'outline'} size={'sm'} onClick={handleDelete}
                                className={'hover:bg-error hover:text-error-content tooltip'}
                        >
                            <Trash size={20}/>
                        </Button>
                    </div>
                }
            </div>
        </div>
    );
}
