"use client"

import {ColumnDef} from "@tanstack/react-table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {MoreHorizontal, Trash, UserPen, UserRoundPlus, UserRoundSearch} from "lucide-react";
import {TourToUserRole} from "@prisma/client";

type Collaborator = {
    id: string
    name: string
    username: string
    role: TourToUserRole
}

export const columns: ColumnDef<Collaborator>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "username",
        header: "Username",
    },
    {
        accessorKey: "role",
        header: "Role",
    },
    {
        id: "actions",
        cell: ({row}) => {
            const collaborator = row.original

            const roles = [
                {
                    role: TourToUserRole.EDITOR,
                    label: 'Editor',
                    icon: UserPen
                },
                {
                    role: TourToUserRole.FELLOW,
                    label: 'Fellow',
                    icon: UserRoundPlus
                },
                {
                    role: TourToUserRole.VIEWER,
                    label: 'Viewer',
                    icon: UserRoundSearch
                },
            ].filter((role) => role.role !== collaborator.role)

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className={"bg-base-200"}>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {roles.map((role) => (
                            <DropdownMenuItem key={role.role}>
                                <role.icon/>
                                Set role {role.label}
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem className={"hover:bg-error hover:text-error-content"}>
                            <Trash/>
                            Remove
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]