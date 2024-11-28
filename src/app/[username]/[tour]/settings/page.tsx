import {BreadcrumbPortal} from "@/components/breadcrumbBar";
import {cn} from "@/lib/utils";
import React from "react";
import H1 from "@/components/ui/h1";
import H2 from "@/components/ui/h2";
import db from "@/lib/db";

const TourSettings = async ({params}: {params: {username: string, tour: string}}) => {
    const tour = await db.tour.findFirst({
        where: {
            name: params.tour,
            TourToUser: {
                some: {
                    user: {
                        username: params.username
                    },
                    role: 'OWNER'
                }
            }
        }
    });

    const user = await db.user.findUnique({
        where: {
            username: params.username
        }
    });


    return (
        <>
            <BreadcrumbPortal items={
                [
                    {
                        title: user?.name as string, url: `/${params.username}`
                    },
                    {
                        title: tour?.displayName as string, url: `/${params.username}/${params.tour}`
                    },
                    {
                        title: 'Settings', url: `/${params.username}/${params.tour}/settings`
                    }
                ]
            }/>
            <div className="flex flex-1 flex-col gap-4 p-4 lg:max-w-screen-lg max-w-lg w-full mx-auto ">
                <div className={cn(`flex flex-col gap-2 w-full`)}>
                    <H1>Settings</H1>
                    <H2
                        className={cn(`text-error`)}>Danger Zone</H2>
                </div>
            </div>
        </>
    )
}

export default TourSettings;