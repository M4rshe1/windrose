"use client"

import {IconBrandSafari} from "@tabler/icons-react"

import * as React from "react"
import {Frame, Info, LifeBuoy, Map, PieChart, Send, Settings2, SquareTerminal} from "lucide-react"
import {IconBrandGithub} from "@tabler/icons-react"

import {NavMain} from "@/components/nav-main"
import {NavProjects} from "@/components/nav-projects"
import {NavSecondary} from "@/components/nav-secondary"
import {NavUser} from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";
import {Session} from "next-auth";
import {UserRole} from "@prisma/client";


export function AppSidebar({session, ...props}: { session: Session, [key: string]: unknown }) {
    const username = session.user.username || session.user.id
    const data = {
        user: {
            name: session.user.name as string,
            email: session.user.email as string,
            avatar: session.user.image as string,
            username: username,
            isAdmin: session.user.role === UserRole.ADMIN,
            isPremium: session.user.role === UserRole.PREMIUM,
        },
        navMain: [
            {
                title: "Dashboard",
                url: "/",
                icon: SquareTerminal,
                items: [
                    {
                        title: "Tours",
                        url: `/${username}/tours`,
                    },
                    {
                        title: "Timeline",
                        url: `/${username}/timeline`,
                    },
                    {
                        title: "Notifications",
                        url: "/notifications",
                    },
                ],
            },
            {
                title: "Tours",
                url: `/${username}/tours`,
                icon: Map,
                items: [
                    {
                        title: "New",
                        url: "/new",
                    },
                    {
                        title: "Explorer",
                        url: "/explore",
                    },
                    {
                        title: "Saved",
                        url: `/${username}/saved`,
                    },
                ],
            },
            {
                title: "Settings",
                url: "/settings",
                icon: Settings2,
                items: [
                    {
                        title: "Appearance",
                        url: "/settings/appearance",
                    },
                    {
                        title: "Billing",
                        url: "/settings/billing",
                    },
                    {
                        title: "Account",
                        url: "/settings/account",
                    },
                    {
                        title: "Profile",
                        url: "/settings/profile",
                    },
                    {
                        title: "Sessions",
                        url: "/settings/sessions",
                    },
                    {
                        title: "Notifications",
                        url: "/settings/notifications",
                    }
                ],
            },
        ],
        navSecondary: [
            {
                title: "About",
                url: "/about",
                icon: Info,
            },
            {
                title: "Github",
                url: "https://github.com/m4rshe1/windrose",
                target: "_blank",
                icon: IconBrandGithub
            },
            {
                title: "Support",
                url: "https://github.com/m4rshe1/windrose/issues",
                target: "_blank",
                icon: LifeBuoy,
            },
            {
                title: "Feedback",
                url: "https://github.com/m4rshe1/windrose/issues",
                target: "_blank",
                icon: Send,
            },
        ],
        projects: [
            {
                name: "Design Engineering",
                url: "#",
                icon: Frame,
            },
            {
                name: "Sales & Marketing",
                url: "#",
                icon: PieChart,
            },
            {
                name: "Travel",
                url: "#",
                icon: Map,
            },
        ],
    }
    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg"
                                           className={'hover:bg-base-100 transition-all duration-300 ease-in-out'}
                                           asChild>
                            <Link href="/">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <IconBrandSafari/>
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">Windrose</span>
                                    <span className="truncate text-xs">Document your travels</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain}/>
                <NavProjects projects={data.projects} username={data.user.username}/>
                <NavSecondary items={data.navSecondary} className="mt-auto"/>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user}/>
            </SidebarFooter>
        </Sidebar>
    )
}
