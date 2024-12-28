import {BreadcrumbPortal} from "@/components/breadcrumbBar";
import {TourSettingsSecondaryNav} from "@/components/secondaryNavs";
import {cn, getMinioLinkFromKey} from "@/lib/utils";
import React from "react";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/authOptions";
import db from "@/lib/db";
import {TourToUserRole, UserRole} from "@prisma/client";
import H1 from "@/components/ui/h1";
import Image from "next/image";
import Link from "next/link";

const Page = async (props: {
    params: Promise<{ username: string, tour: string }>
}) => {
    const session = await getServerSession(authOptions);
    const params = await props.params;
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
            },
        },
        include: {
            TourToUser: {
                include: {
                    user: {
                        include: {
                            image: true
                        },
                    },
                }
            },
            sections: true
        },
    });

    const user = await db.user.findUnique({
        where: {
            username: params.username
        }
    });

    let userRole: string
    if (session?.user?.role == UserRole.ADMIN) {
        userRole = UserRole.ADMIN;
    } else {
        userRole = tour?.TourToUser.find(ttu => ttu.user.username === session?.user?.username)?.role as string;
    }
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
                        title: 'Mentions', url: `/${params.username}/${params.tour}/mentions`
                    }
                ]
            }/>

            <TourSettingsSecondaryNav activeTab={"Mentions"} params={params}
                                      sectionCount={tour?.sections.length as number}
                                      userRole={userRole}
                                      mentionsCount={tour?.TourToUser.filter(ttu => ttu.mentioned || ttu.role === TourToUserRole.OWNER).length as number}
            />
            <div className="flex flex-1 flex-col gap-4 p-4 lg:max-w-screen-lg max-w-lg w-full mx-auto ">
                <div className={cn(`flex flex-col gap-2 w-full`)}>
                    <H1>
                        Mentions
                    </H1>
                    <div
                        className={cn(`grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4`)}>
                        {
                            tour?.TourToUser.filter(ttu => ttu.mentioned || ttu.role === TourToUserRole.OWNER)
                                .map((ttu) => {
                                    return (
                                        <Link
                                            href={`/${ttu.user.username}`}
                                            key={ttu.user.username}
                                            className={cn(`flex flex-col gap-2 p-4 border-2 border-neutral rounded-md hover:border-primary transition duration-200 ease-in-out hover:shadow-md`, {
                                                'border-secondary': ttu.role === TourToUserRole.OWNER
                                            })}>
                                            <div className={cn(`flex items-center gap-2`)}>
                                                <div
                                                    className={cn(`w-12 h-12 rounded-full bg-neutral text-neutral-content flex items-center justify-center relative`)}
                                                >
                                                    {
                                                        ttu.user.image?.fileKey ?
                                                            <Image
                                                                src={getMinioLinkFromKey(ttu.user.image?.fileKey as string)}
                                                                alt={ttu.user.name as string} width={48} height={48}
                                                                className={cn(`w-12 h-12 rounded-full`)}/>
                                                            : <span>{ttu.user.name?.charAt(0)}</span>
                                                    }
                                                </div>
                                                <div className={cn(`flex flex-col gap-1`)}>
                                                    <div className={cn(`flex items-center gap-2`)}>
                                                        <h2>{ttu.user.name}</h2>
                                                    </div>
                                                    <p
                                                        className={cn(`italic opacity-70`)}
                                                    >{ttu.user.username}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                })
                        }
                    </div>
                </div>
            </div>
        </>)
}

export default Page