import {BreadcrumbPortal} from "@/components/breadcrumbBar";
import React from "react";
import H1 from "@/components/ui/h1";
import {cn, getMinioLinkFromKey} from "@/lib/utils";
import { auth } from "@/auth"

import db from "@/lib/db";
import CreateTourForm from "@/components/createTourForm";

const NewTourPage = async () => {
    const session = await auth()
    const [user] = await Promise.all([
        db.user.findUnique({
            where: {id: session?.user?.id},
            include: {
                image: {
                    select: {
                        fileKey: true
                    }
                },
            }
        }),
    ])

    return (
        <>
            <BreadcrumbPortal items={
                [
                    {
                        title: 'New Tour', url: '/new'
                    }
                ]
            }/>
            <div className="flex flex-1 flex-col gap-4 p-4 lg:max-w-screen-lg max-w-lg w-full mx-auto ">
                <div className={cn(`flex flex-col gap-2 w-full`)}>
                    <H1>New Tour
                        <p className={cn('text-sm font-normal')}>
                            A tour is a collection of locations, images, and stories that you can share with others.
                        </p>
                    </H1>
                    <CreateTourForm
                        options={
                            [
                                {
                                    value: user?.id as string,
                                    label: user?.name as string,
                                    image: getMinioLinkFromKey(user?.image?.fileKey as string)
                                }
                            ]
                        }
                    />
                </div>
            </div>
        </>
    )
}

export default NewTourPage