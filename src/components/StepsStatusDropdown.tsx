'use client'

import {TourSectionStatus} from "@prisma/client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Check, MoreHorizontal} from "lucide-react";
import React from "react";
import {cn} from "@/lib/utils";

const StepsStatusDropdown = ({status, setStatus, className, ...props}: {
    status: TourSectionStatus,
    setStatus: (status: TourSectionStatus) => void,
    className?: string,
    [props: string]: any
}) => {
    const colors = {
        [TourSectionStatus.PLANNED]: 'text-info-content bg-info hover:bg-info/70',
        [TourSectionStatus.SKIPPED]: 'text-warning-content bg-warning hover:bg-warning/70',
        [TourSectionStatus.VISITED]: 'text-success-content bg-success hover:bg-success/70',
    }

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
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            {Object.values(TourSectionStatus).map((statusOption) => (
                <DropdownMenuItem key={statusOption} onClick={() => setStatus(statusOption)}
                                  disabled={statusOption === status} className={cn('flex items-center justify-between font-semibold',
                    colors[statusOption])}>
                    {statusOption}
                    {
                        statusOption === status && <Check/>
                    }
                </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
    </DropdownMenu>
}

export default StepsStatusDropdown;