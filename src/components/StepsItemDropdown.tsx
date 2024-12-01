'use client'

import {TourSectionStatus} from "@prisma/client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Check, Goal, LandPlot, MoreHorizontal, PencilRuler, SkipForward, Trash} from "lucide-react";
import React from "react";
import {cn} from "@/lib/utils";
import Link from "next/link";
import {Item} from "@/components/stepsItem";


const StepsItemDropdown = ({status, updateStatusAction, deleteStepAction, className, item, ...props}: {
    status: TourSectionStatus,
    updateStatusAction: (status: TourSectionStatus) => void,
    deleteStepAction: () => void,
    className?: string,
    item: Item,
    [props: string]: unknown
}) => {
    return <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="outline" size={'sm'} className={className}
                    {...props}
            >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4"/>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className={"bg-base-200 space-y-1"}>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Link href={`${item.id}`}>
                <DropdownMenuItem className={cn('font-semibold')}>
                    <PencilRuler/>
                    Edit
                </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator/>
            <DropdownMenuItem onClick={() => updateStatusAction(TourSectionStatus.PLANNED)}
                              disabled={TourSectionStatus.PLANNED === status}
                              className={cn('flex items-center font-semibold text-info-content bg-info hover:bg-info/70')}>
                <LandPlot/>
                {TourSectionStatus.PLANNED}
                {
                    TourSectionStatus.PLANNED === status && <Check/>
                }
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateStatusAction(TourSectionStatus.SKIPPED)}
                              disabled={TourSectionStatus.SKIPPED === status}
                              className={cn('flex items-center font-semibold text-warning-content bg-warning hover:bg-warning/70')}>
                <SkipForward/>
                {TourSectionStatus.SKIPPED}
                {
                    TourSectionStatus.SKIPPED === status && <Check/>
                }
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateStatusAction(TourSectionStatus.VISITED)}
                              disabled={TourSectionStatus.VISITED === status}
                              className={cn('flex items-center font-semibold text-success-content bg-success hover:bg-success/70')}>
                <Goal/>
                {TourSectionStatus.VISITED}
                {
                    TourSectionStatus.VISITED === status && <Check/>
                }
            </DropdownMenuItem>
            <DropdownMenuSeparator/>
            <DropdownMenuItem onClick={deleteStepAction}
                              className={cn('font-semibold hover:text-error-content hover:bg-error/70')}>
                <Trash/>
                Delete
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
}

export default StepsItemDropdown;