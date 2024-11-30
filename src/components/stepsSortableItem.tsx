'use client'

import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {TourSection, TourSectionToFile} from "@prisma/client";
import {vehicles} from "@/lib/vehicles";
import {GitCommitVertical, GripVertical, PenLine, Play, Trash} from "lucide-react";
import Link from "next/link";

interface images extends TourSectionToFile {
    file: File
}

interface Item extends TourSection {
    images: images[]
}

export function StepsSortableItem({item, index, disabled}: { item: Item, index: number, disabled: boolean }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: item.id, animateLayoutChanges: () => false});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style}>
            <div className={'flex items-center justify-between border-2 border-neutral rounded-lg bg-base-100 group'}>
                <div className={'flex items-center p-2 gap-2'}>
                    <div className={'w-8 aspect-square grid place-items-center'}>
                        {
                            index === 0 ? <Play size={20}/> :
                                vehicles.find(vehicle => vehicle.value === item.vehicle)?.icon || <GitCommitVertical size={20}/>
                        }
                    </div>
                    <p className={' font-semibold'}>
                        {item.name}
                    </p>

                    <p className={'text-sm opacity-70'}>
                        {item.datetime?.toLocaleDateString(
                            'en-US',
                            {
                                year: 'numeric',
                                month: 'long',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                            }
                        )}
                    </p>
                </div>
                {
                    !disabled &&
                    <div className={'flex items-center gap-2 mr-1'}>
                        <div className={'flex items-center gap-2 mr-2'}>
                            <Link data-tip={'Edit'}
                                  className={'py-2 px-1 hover:bg-base-200 rounded-md transition ease-in-out duration-200 hover:shadow tooltip opacity-0 group-hover:opacity-100'}
                                  href={`${item.id}`}>
                                <PenLine size={20}/>
                            </Link>
                            <div data-tip={'Delete'}
                                  className={'cursor-pointer py-2 px-1 hover:bg-error hover:text-error-content rounded-md transition ease-in-out duration-200 hover:shadow tooltip opacity-0 group-hover:opacity-100'}
                            >
                                <Trash size={20}/>
                            </div>
                        </div>
                        <div
                            className={'py-2 px-1 hover:bg-base-200 rounded-md transition ease-in-out duration-200 hover:shadow active:bg-base-300'} {...attributes} {...listeners}>
                            <GripVertical size={20}/>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}