"use client"

import * as React from "react"
import {useEffect, useState} from "react"
import {Brush, Command, Plus, Settings, Terminal,} from "lucide-react"

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
import {Session} from "next-auth";
import {Button} from "@/components/ui/button";
import {redirect} from "next/navigation";
import {themes} from "@/lib/theme";
import {cn, getMinioLinkFromKey} from "@/lib/utils";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export function HeaderCommand({session}: { session: Session }) {
    const [open, setOpen] = useState(false)
    const [data, setData] = useState({tours: []})

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
        if (open && data.tours.length === 0) {
            fetch(`/api/private/tours?userid=${session.user.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setData(data)
                })
        }
    }, [open, session, data]);

    function changeTheme(key: string) {
        localStorage.setItem('theme', key)
        document.location.reload()
    }

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
                        <CommandItem
                            onSelect={() => {
                                setOpen(false)
                                redirect('/new')
                            }}
                        >
                            <Plus/>
                            <span>New Tour</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() => {
                                setOpen(false)
                                redirect('/map')
                            }}
                        >
                            <Settings/>
                            <span>Settings</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator/>
                    <CommandGroup heading="Tours">
                        {data?.tours?.map((tour: any, index: number) => (
                            <CommandItem
                                onSelect={() => {
                                    setOpen(false)
                                    redirect(`/${tour.owner.name}/${tour.name}`
                                    )
                                }}
                                key={index}
                            >
                                <Avatar className="h-6 w-6 bg-base-300">
                                    <AvatarImage src={tour.owner.image}
                                                 alt={tour.owner.name}/>
                                    <AvatarFallback className="rounded-lg">
                                        {getMinioLinkFromKey(tour.owner.image.fileKey)}
                                    </AvatarFallback>
                                </Avatar>
                                <p>

                                    <span className={'font-semibold'}>{tour.owner.name}</span>
                                    <span> / </span>
                                    <span className={'font-semibold'}>{tour.displayName}</span>
                                    <span className={'text-xs'}>&nbsp;({tour.name})</span>

                                </p>

                            </CommandItem>
                        ))}
                        {
                            data.tours.length === 0 && <CommandEmpty>No tours found.</CommandEmpty>
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
                                    <Brush/>
                                    <span>{theme.name}</span>
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