"use client"

import {ColumnDef} from "@tanstack/react-table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {MoreHorizontal, Trash, UserMinus, UserPen, UserPlus, UserRoundSearch} from "lucide-react";
import {TourToUserRole} from "@prisma/client";
import {updateCollaborationAction} from "@/actions/updateCollaborationAction";
import {deleteCollaborationAction} from "@/actions/deleteCollaborationAction";

type Collaborator = {
    userId: string
    ownerUsername: string
    tourName: string
    name: string
    mentioned: boolean
    username: string
    role: TourToUserRole
    tourId: string
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
        accessorKey: "mentioned",
        header: "Mentioned",
        cell: ({row}) => {
            return row.original.mentioned ? 'Yes' : 'No'
        },
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
                        {roles.map((role, index: number) => (
                            <DropdownMenuItem key={index} onClick={
                                async () => {
                                    await updateCollaborationAction(collaborator.tourId, collaborator.userId, role.role, collaborator.mentioned, `/${collaborator.ownerUsername}/${collaborator.tourName}/settings`)
                                }
                            }>
                                <role.icon/>
                                Set role {role.label}
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={
                            async () => {
                                await updateCollaborationAction(collaborator.tourId, collaborator.userId, collaborator.role, !collaborator.mentioned, `/${collaborator.ownerUsername}/${collaborator.tourName}/settings`)
                            }
                        }>{
                            collaborator.mentioned ? <UserMinus/> : <UserPlus/>
                        }
                            {collaborator.mentioned ? 'Unmention' : 'Mention'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem className={"hover:bg-error hover:text-error-content"} onClick={
                            async () => {
                                await deleteCollaborationAction(collaborator.tourId, collaborator.userId, `/${collaborator.ownerUsername}/${collaborator.tourName}/settings`)
                            }
                        }>
                            <Trash/>
                            Remove
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]