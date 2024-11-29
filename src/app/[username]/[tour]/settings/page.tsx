import {BreadcrumbPortal} from "@/components/breadcrumbBar";
import {cn, getMinioLinkFromKey} from "@/lib/utils";
import React from "react";
import H1 from "@/components/ui/h1";
import H2 from "@/components/ui/h2";
import db from "@/lib/db";
import {TourSettingsSecondaryNav} from "@/components/secondaryNavs";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/authOptions";
import {TourToUserRole, UserRole} from "@prisma/client";
import TourStatusInput from "@/components/tourStatusInput";
import HeroInput from "@/components/heroInput";
import {Label} from "@/components/ui/label";
import SubtitleInput from "@/components/subtitleInput";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import TourDangerSettings from "@/components/TourDangerSettings";
import TourCollaborationTable from "@/components/tourCollaborationTable";

const TourSettings = async (props: { params: Promise<{ username: string, tour: string }> }) => {
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
                        }
                    }
                }
            },
            heroImage: true
        }
    });

    const isAllowed = tour?.TourToUser.find(ttu => ttu.user.id === session?.user?.id && (ttu.role === TourToUserRole.OWNER || ttu.role === TourToUserRole.EDITOR)) || session?.user?.role === UserRole.ADMIN;
    if (!session || !session?.user || !isAllowed) return redirect(`/${params.username}/${params.tour}`);

    const sectionCount = await db.tourSection.aggregate({
        _count: true,
        where: {
            tourId: tour?.id
        }
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

    const setDescription = async (description: string) => {
        "use server"
        await db.tour.update({
            where: {
                id: tour?.id as string
            },
            data: {
                description: description
            }
        })
    }

    async function setTourDisplayName(displayName: string) {
        "use server"
        await db.tour.update({
            where: {
                id: tour?.id as string
            },
            data: {
                displayName: displayName
            }
        })
        return revalidatePath(`/${params.username}/${params.tour}/settings`)
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
                        title: 'Settings', url: `/${params.username}/${params.tour}/settings`
                    }
                ]
            }/>

            <TourSettingsSecondaryNav activeTab={"Settings"} params={params} sectionCount={sectionCount._count}
                                      userRole={userRole}/>
            <div className="flex flex-1 flex-col gap-4 p-4 lg:max-w-screen-lg max-w-lg w-full mx-auto ">
                <div className={cn(`flex flex-col gap-2 w-full`)}>
                    <H1>General</H1>
                    <div className={cn(`grid lg:grid-cols-[1fr_auto] grid-cols-1 gap-8`)}>
                        <div className={cn('flex flex-col gap-3')}>
                            <HeroInput tour={tour}
                                       image={tour?.heroImage?.fileKey ? getMinioLinkFromKey(tour?.heroImage?.fileKey as string) : ""}/>
                            <SubtitleInput labelText={`Name`} type={`text`} name={`displayName`}
                                           id={`displayName`}
                                           defaultValue={tour?.displayName as string}
                                           onBlurAction={setTourDisplayName}
                                           className={cn(`w-full`)}
                            />
                        </div>
                        <div className={cn('flex flex-col gap-3')}>
                            <Label htmlFor={`status`} className={cn('block')}>Status</Label>
                            <TourStatusInput tour={tour?.status as string}/>
                        </div>
                    </div>
                    <SubtitleInput labelText={`Description`} type={`text`} name={`description`}
                                   id={`description`}
                                   defaultValue={tour?.description as string}
                                   onBlurAction={setDescription}
                                   className={cn(`w-full`)}
                                   subText={`(Optional) A short description of the tour.`}
                    />
                    {
                        (userRole == TourToUserRole.OWNER || userRole == UserRole.ADMIN) && <>
                            <H2>Collaboration</H2>
                            <TourCollaborationTable tour={tour}/>
                            <H2 className={cn(`text-error`)} id={"delete"}>Danger Zone</H2>
                            <TourDangerSettings tour={tour}/>
                        </>
                    }
                </div>
            </div>
        </>
    )
}

export default TourSettings;