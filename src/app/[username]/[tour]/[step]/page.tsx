import {BreadcrumbPortal} from "@/components/breadcrumbBar";
import {TourSettingsSecondaryNav} from "@/components/secondaryNavs";
import {cn} from "@/lib/utils";
import React from "react";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/authOptions";
import db from "@/lib/db";
import {UserRole} from "@prisma/client";
import H1 from "@/components/ui/h1";

const Page = async (props: { params: Promise<{ username: string, tour: string, step: string }> }) => {
    const session = await getServerSession(authOptions);
    const params = await props.params;
    const [tour, user, section, settings] = await Promise.all([
        db.tour.findFirst({
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
                        user: true
                    }
                },
                sections: true
            }
        }), db.user.findUnique({
            where: {
                username: params.username
            }
        }),
        db.tourSection.findUnique({
            where: {
                id: params.step,
                tour: {
                    name: params.tour,
                    TourToUser: {
                        some: {
                            user: {
                                username: params.username
                            },
                            role: 'OWNER'
                        }
                    },
                }
            },
            include: {
                images: {
                    include: {
                        file: true
                    }
                }
            }
        }),
        db.setting.findMany({
            where: {
                key: {
                    in: ['MAX_SECTION_IMAGES_FREE', 'MAX_SECTION_IMAGES_PREMIUM']
                }
            }
        })
    ]);


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
                        title: section?.name || 'Unnamed Step'
                        , url: `/${params.username}/${params.tour}/${params.step}`
                    }
                ]
            }/>

            <TourSettingsSecondaryNav activeTab={''} params={params} sectionCount={tour?.sections.length as number}
                                      userRole={userRole}/>
            <div className="flex flex-1 flex-col gap-4 p-4 lg:max-w-screen-lg max-w-lg w-full mx-auto ">
                <div className={cn(`flex flex-col gap-2 w-full`)}>
                    <H1>{section?.name || 'Unnamed Step'}</H1>
                </div>
            </div>
        </>)
}

export default Page