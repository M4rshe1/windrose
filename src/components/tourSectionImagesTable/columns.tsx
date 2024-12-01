"use client"

import {ColumnDef} from "@tanstack/react-table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {MoreHorizontal, Trash} from "lucide-react";
import {File} from "@prisma/client";
import {cn, getMinioLinkFromKey} from "@/lib/utils";
import Image from "next/image";
import {deleteSectionImageAction} from "@/actions/deleteSectionImageAction";
import Link from "next/link";

type Image = {
    fileKey: string
    file: File
    filename: string
    id: string,
    reval: string
}

export const columns: ColumnDef<Image>[] = [
    {
        accessorKey: "fileKey",
        header: "Image",
        cell: ({row}) => {
            const image = row.original
            const link = getMinioLinkFromKey(image.fileKey)
            return (
                <div className={'relative flex justify-start h-16 '}>
                    <div className={'h-16 relative'}>
                        <Link href={link} target={"_blank"}>
                            <Image src={link} alt="image"
                                   className={cn("object-contain object-center rounded-sm h-16 max-w-min",)}
                                   width={480} height={360}/>
                        </Link>
                    </div>
                </div>
            )
        }
    },
    {
        accessorKey: "filename",
        header: "Filename",
    },
    {
        id: "actions",
        cell: ({row}) => {
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
                        <DropdownMenuItem className={"hover:bg-error hover:text-error-content"} onClick={
                            async () => {
                                await deleteSectionImageAction(row.original.id, row.original.reval)
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