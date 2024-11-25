"use client"

import {BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Settings, Sparkles,} from "lucide-react"

import {Avatar, AvatarFallback, AvatarImage,} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,} from "@/components/ui/sidebar"
import Link from "next/link";
import {signOut} from "next-auth/react";
import {redirect} from "next/navigation";
import FancyBorder from "@/components/ui/fancyBorder";

export function NavUser({
                            user,
                        }: {
    user: {
        name: string
        email: string
        avatar: string
        username: string
    }
}) {
    const {isMobile} = useSidebar()

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-base-300 hover:bg-base-100 transition-all duration-200 ease-in-out"
                        >
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar} alt={user.name}/>
                                <AvatarFallback className="rounded-lg">
                                    {user.name.split(' ').map((name: string) => name[0].toUpperCase()).join('')}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{user.name}</span>
                                <span className="truncate text-xs">{user.email}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4"/>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-base-200"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <Link href={`/${user.username}`}
                                  className="flex items-center gap-2 px-1 py-1.5 text-left text-sm border-lg hover:bg-base-100 transition-all duration-200 ease-in-out">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={user.avatar} alt={user.name}/>
                                    <AvatarFallback className="rounded-lg">
                                        {
                                            user.name.split(' ').map((name: string) => name[0].toUpperCase()).join('')
                                        }
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{user.name}</span>
                                    <span className="truncate text-xs">{user.email}</span>
                                </div>
                            </Link>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuGroup>
                            <Link href={"/pro"}>
                                <FancyBorder className={'rounded'}>
                                    <DropdownMenuItem className="bg-base-200">
                                        <Sparkles/>
                                        Upgrade to Pro
                                    </DropdownMenuItem>
                                </FancyBorder>
                            </Link>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator/>
                        <DropdownMenuGroup>
                            <Link href={"/settings"}>
                                <DropdownMenuItem>
                                    <Settings/>
                                    Settings
                                </DropdownMenuItem>
                            </Link>
                            <Link href={"/settings/billing"}>
                                <DropdownMenuItem>
                                    <CreditCard/>
                                    Billing
                                </DropdownMenuItem>
                            </Link>
                            <Link href={"/notifications"}>

                                <DropdownMenuItem>
                                    <Bell/>
                                    Notifications
                                </DropdownMenuItem>
                            </Link>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator/>

                        <DropdownMenuItem className={`hover:bg-error hover:text-error-content`} onClick={() => {
                            signOut().then(() => {
                                return redirect('/')
                            })
                        }}>

                            <LogOut/>
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
