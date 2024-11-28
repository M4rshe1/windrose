"use client"

import {Bell, ChevronsUpDown, CreditCard, LogOut, Settings, Sparkles,} from "lucide-react"

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
import {cn} from "@/lib/utils";

export function NavUser({
                            user,
                        }: {
    user: {
        name: string
        email: string
        avatar: string
        username: string
        isPremium: boolean
        isAdmin: boolean
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
                            className="data-[state=open]:bg-base-300 hover:bg-base-100 transition-all duration-200 ease-in-out group/username"
                        >
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar} alt={user.name}/>
                                <AvatarFallback className="rounded-lg">
                                    {user.name.split(' ').map((name: string) => name[0].toUpperCase()).join('')}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <div className={cn('relative h-5')}>
                                     <span
                                         className={cn('truncate font-semibold absolute transition-all duration-300 ease-in-out', 'group-hover/username:translate-y-[-100%] group-hover/username:opacity-0')}>{user.name}</span>
                                    <span
                                        className={cn('truncate font-semibold absolute transition-all duration-300 ease-in-out opacity-0', 'translate-y-[100%] group-hover/username:translate-y-0 group-hover/username:opacity-100')}>{user.username}</span>
                                </div>
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
                                  className="flex items-center rounded-md gap-2 px-1 py-1.5 text-left text-sm border-lg hover:bg-base-100 transition-all duration-200 ease-in-out group/username">
                                <Avatar className="h-8 w-8 rounded-full">
                                    <AvatarImage src={user.avatar} alt={user.name}/>
                                    <AvatarFallback className="rounded-lg">
                                        {
                                            user.name.split(' ').map((name: string) => name[0].toUpperCase()).join('')
                                        }
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <div className={cn('relative h-5')}>
                                    <span
                                        className={cn('truncate font-semibold absolute transition-all duration-300 ease-in-out', 'group-hover/username:translate-y-[-100%] group-hover/username:opacity-0')}>{user.name}</span>
                                        <span
                                            className={cn('truncate font-semibold absolute transition-all duration-300 ease-in-out opacity-0', 'translate-y-[100%] group-hover/username:translate-y-0 group-hover/username:opacity-100')}>{user.username}</span>
                                    </div>
                                    <span className="truncate text-xs">{user.email}</span>
                                </div>
                            </Link>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuGroup>
                            <Link
                                href={user.isAdmin ? '/admin' : user.isPremium ? '/settings/billing' : '/pro'}>
                                <FancyBorder className={'rounded'}>
                                    <DropdownMenuItem className="bg-base-200">
                                        <Sparkles/>
                                        {
                                            user.isAdmin ? 'Admin Mode: Infinite' : user.isPremium ? 'Manage Subscription' : 'Upgrade to Pro'
                                        }
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
