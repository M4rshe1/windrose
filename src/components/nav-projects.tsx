"use client"

import {Edit, Folder, MoreHorizontal, Settings, Trash2,} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import {Tour} from "@/actions/getUserToursAction";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import * as React from "react";
import Link from "next/link";
import {cn} from "@/lib/utils";

export function NavProjects({
                                tours, username
                            }: {
    tours: Tour[],
    username: string
}) {
    const {isMobile} = useSidebar()

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Recent Tours</SidebarGroupLabel>
            <SidebarMenu>
                {tours.map((tour: Tour) => (
                    <SidebarMenuItem key={tour.name} className={cn('group/tour')}>
                        <SidebarMenuButton asChild>
                            <a href={`/${tour.owner.username}/${tour.name}`}>
                                <Avatar className="h-6 w-6 bg-base-300">
                                    <AvatarImage src={tour.owner.image as string}
                                                 alt={tour.owner.name as string}/>
                                    <AvatarFallback className="rounded-lg">
                                    </AvatarFallback>
                                </Avatar>
                                <div className={cn('relative h-5')}>
                                     <span
                                         className={cn('truncate text-sm absolute transition-all duration-300 ease-in-out', 'group-hover/tour:translate-y-[-100%] group-hover/tour:opacity-0')}>{tour.owner.name}/{tour.displayName}</span>
                                    <span
                                        className={cn('truncate text-sm absolute transition-all duration-300 ease-in-out opacity-0', 'translate-y-[100%] group-hover/tour:translate-y-0 group-hover/tour:opacity-100')}>{tour.owner.username}/{tour.name}</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuAction showOnHover>
                                    <MoreHorizontal/>
                                    <span className="sr-only">More</span>
                                </SidebarMenuAction>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-48 bg-base-200"
                                side={isMobile ? "bottom" : "right"}
                                align={isMobile ? "end" : "start"}
                            >
                                <DropdownMenuItem className="hover:bg-base-100">
                                    <Folder/>
                                    <span>Go to Tour</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-base-100">
                                    <Link href={`/${tour.owner.username}/${tour.name}/edit`}>
                                        <Edit/>
                                        <span>Edit</span>
                                    </Link>
                                </DropdownMenuItem>
                                <Link href={`/${tour.owner.username}/${tour.name}/settings`}>
                                    <DropdownMenuItem className="hover:bg-base-100">
                                        <Settings/>
                                        <span>Settings</span>
                                    </DropdownMenuItem>
                                </Link>
                                <DropdownMenuSeparator/>
                                <Link href={`/${tour.owner.username}/${tour.name}/settings/delete`}>
                                    <DropdownMenuItem className="hover:bg-error hover:text-error-content">
                                        <Trash2/>
                                        <span>Delete Tour</span>
                                    </DropdownMenuItem>
                                </Link>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <a href={`/${username}/tours`}>
                            <MoreHorizontal/>
                            <span>All Tours</span>
                        </a>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    )
}
