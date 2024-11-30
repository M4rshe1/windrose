import {BreadcrumbPortal} from "@/components/breadcrumbBar";
import {TourSettingsSecondaryNav} from "@/components/secondaryNavs";
import {cn} from "@/lib/utils";
import React from "react";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/authOptions";
import db from "@/lib/db";
import {TourToUserRole, UserRole} from "@prisma/client";
import H1 from "@/components/ui/h1";
import {StepsDNDContext} from "@/components/stepsDNDContext";

const Page = async (props: { params: Promise<{ username: string, tour: string }> }) => {
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

    const sections = await db.tourSection.findMany({
        where: {
            tourId: tour?.id
        },
        include: {
            images: {
                include: {
                    file: true
                }
            }
        }
    });

    const user = await db.user.findUnique({
        where: {
            username: params.username
        }
    });


    let userRole: string
    let isAllowed: boolean
    if (session?.user?.role == UserRole.ADMIN) {
        userRole = UserRole.ADMIN;
        isAllowed = true;
    } else {
        userRole = tour?.TourToUser.find(ttu => ttu.user.username === session?.user?.username)?.role as string;
        isAllowed = userRole === TourToUserRole.OWNER || userRole === TourToUserRole.EDITOR;
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
                        title: 'Steps', url: `/${params.username}/${params.tour}/steps`
                    }
                ]
            }/>

            <TourSettingsSecondaryNav activeTab={"Steps"} params={params} sectionCount={sections.length}
                                      userRole={userRole}/>
            <div className="flex flex-1 flex-col gap-4 p-4 lg:max-w-screen-lg max-w-lg w-full mx-auto ">
                <div className={cn(`flex flex-col gap-2 w-full`)}>
                    <H1>Steps</H1>
                    <div className={'flex flex-col w-full gap-2'}>
                        <StepsDNDContext tourId={tour?.id as string} disabled={!isAllowed} order={tour?.sectionOrder as string[]} sections={sections || []}/>
                    </div>
                </div>
            </div>
        </>)
}

export default Page