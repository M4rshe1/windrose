"use client"

import * as React from "react"
import {useEffect, useState} from "react"
import {Brush, Command, Newspaper, Plus, Settings,} from "lucide-react"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import {Button} from "@/components/ui/button";
import {redirect} from "next/navigation";
import {themes} from "@/lib/theme";
import {cn} from "@/lib/utils";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {getUserToursAction, Tour} from "@/actions/getUserToursAction";

export function HeaderCommand() {
    const [open, setOpen] = useState(false)
    const [data, setData] = useState<Tour[] | null>(null)

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    useEffect(() => {
        if (open && data === null) {
            getUserToursAction().then((tours) => {
                setData(tours)
            })
        }
    }, [open, data]);

    function changeTheme(key: string) {
        document.cookie = `theme=${key}; path=/;`;
        document.location.reload();
    }

    const actions = [
        {
            name: 'New Tour',
            icon: Plus,
            action: () => redirect('/new')
        },
        {
            name: 'Settings',
            icon: Settings,
            action: () => redirect('/settings')
        },
        {
            name: 'Notifications',
            icon: Newspaper,
            action: () => redirect('/notifications')
        }
    ]

    return (
        <>
            <Button variant={'outline'} size={'sm'} onClick={() => setOpen(true)}>
                <div className={'lg:inline hidden'}>
                    Press{" "}
                    <kbd
                        className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-neutral bg-base-200 px-1.5 font-mono text-[10px] font-medium opacity-100">
                        <span className="text-xs">⌘</span>K
                    </kbd>{" "}
                    to search
                </div>
                <div className={'lg:hidden flex items-center gap-1'}>
                    <Command/>
                    <span>
                    K
                    </span>
                </div>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..."/>
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Actions">
                        {actions.map((action, index) => (
                            <CommandItem
                                onSelect={() => {
                                    setOpen(false)
                                    action.action()
                                }}
                                key={index}
                            >
                                <action.icon/>
                                <span>{action.name}</span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                    <CommandSeparator/>
                    <CommandGroup heading="Tours">
                        {data?.map((tour: Tour, index: number) => (
                            <CommandItem
                                className={'group/tour'}
                                onSelect={() => {
                                    setOpen(false)
                                    redirect(`/${tour.owner.username}/${tour.name}`
                                    )
                                }}
                                key={index}
                            >
                                <Avatar className="h-6 w-6 bg-base-300">
                                    <AvatarImage src={tour.owner.image as string}
                                                 alt={tour.owner.name as string}/>
                                    <AvatarFallback className="rounded-lg">
                                    </AvatarFallback>
                                </Avatar>
                                <div className={cn('relative h-5')}>
                                     <span
                                         className={cn('truncate text-sm absolute transition-all duration-300 ease-in-out', ' group-data-[selected=true]/tour:translate-y-[-100%] group-data-[selected=true]/tour:opacity-0')}>{tour.owner.name} / {tour.displayName}</span>
                                    <span
                                        className={cn('truncate text-sm absolute transition-all duration-300 ease-in-out opacity-0', 'translate-y-[100%]  group-data-[selected=true]/tour:translate-y-0  group-data-[selected=true]/tour:opacity-100')}>{tour.owner.username} / {tour.name}</span>
                                </div>
                            </CommandItem>
                        ))}
                        {
                            !data?.length || <CommandItem>No tours found.</CommandItem>
                        }
                    </CommandGroup>
                    <CommandGroup heading="Themes" data-choose-theme>
                        {
                            themes.map((theme, index) => (
                                <CommandItem key={index}
                                             value={theme.key}
                                             onSelect={() => {
                                                 setOpen(false)
                                                 changeTheme(theme.key)
                                             }}
                                >
                                    <Brush className={theme.dark ? `text-sky-800` : `text-amber-500`}/>
                                    <span className={`flex items-center`}>{theme.name}</span>
                                    <CommandShortcut>
                                        <div className={'flex items-center gap-1 bg-transparent'}
                                             data-theme={theme.key}>
                                            <span className={cn('aspect-square w-3 rounded-lg bg-primary')}/>
                                            <span className={cn('aspect-square w-3 rounded-lg bg-secondary')}/>
                                            <span className={cn('aspect-square w-3 rounded-lg bg-accent')}/>
                                            <span className={cn('aspect-square w-3 rounded-lg bg-base-300')}/>
                                        </div>
                                    </CommandShortcut>
                                </CommandItem>
                            ))
                        }
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}