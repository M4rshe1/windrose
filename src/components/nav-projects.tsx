"use client"

import {Archive, Edit, Folder, type LucideIcon, MoreHorizontal, Trash2,} from "lucide-react"

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

export function NavProjects({
                                projects, username
                            }: {
    projects: {
        name: string
        url: string
        icon: LucideIcon
    }[],
    username: string
}) {
    const {isMobile} = useSidebar()

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Recent Tours</SidebarGroupLabel>
            <SidebarMenu>
                {projects.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild>
                            <a href={item.url}>
                                <item.icon/>
                                <span>{item.name}</span>
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
                                    <Edit/>
                                    <span>Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-warning hover:text-warning-content">
                                    <Archive/>
                                    <span>Archive</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem className="hover:bg-error hover:text-error-content">
                                    <Trash2/>
                                    <span>Delete Tour</span>
                                </DropdownMenuItem>
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
