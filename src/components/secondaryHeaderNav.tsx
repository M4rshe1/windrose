"use client"

import {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import {cn} from "@/lib/utils";
import Link from "next/link";
import {LucideIcon} from "lucide-react";
import {TablerIcon} from "@tabler/icons-react";

interface SecondaryHeaderNavProps {
    items: {
        title: string;
        url: string;
        active?: boolean;
        icon?: LucideIcon | TablerIcon,
        badge?: number | string
    }[]
}

export const SecondaryNavPortal = ({items}: SecondaryHeaderNavProps) => {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)

        return () => setMounted(false)
    }, [])

    return mounted
        ? ReactDOM.createPortal(
            <SecondaryHeaderNav items={items}/>,
            document.getElementById('secondary-header-nav') as HTMLElement
        )
        : null
};

export const SecondaryHeaderNav = ({items}: SecondaryHeaderNavProps) => {
    return (
        <div className={cn('w-full overflow-x-auto')}>
            <div className={cn('flex items-center gap-4 px-6 max-w-full w-min')}>
                {
                    items.map((item, index) => (
                        <Link href={item.url} key={index} className={cn("flex flex-col items-center shrink-0")}>
                        <span
                            className={cn("px-3 py-1 m-1 hover:bg-base-200 transition duration-300 ease-in-out rounded-md flex items-center gap-2 text-sm whitespace-nowrap")}>
                            {
                                item.icon &&
                                <item.icon className={cn("w-4 h-4")}/>
                            }
                            {item.title}
                            {
                                item.badge != undefined ?
                                    <span
                                        className={cn("bg-base-300 text-xs rounded-full px-2 py-0.5")}>{item.badge}</span>
                                    : null
                            }
                        </span>
                            <div className={cn("h-1 w-full rounded-t-md", item.active && "bg-primary")}>
                            </div>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}