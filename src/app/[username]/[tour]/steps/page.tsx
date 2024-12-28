import {BreadcrumbPortal} from "@/components/breadcrumbBar";
import {TourSettingsSecondaryNav} from "@/components/secondaryNavs";
import {cn} from "@/lib/utils";
import React from "react";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/authOptions";
import db from "@/lib/db";
import {Setting, TourToUserRole, UserRole} from "@prisma/client";
import H1 from "@/components/ui/h1";
import {StepsContainer} from "@/components/stepsContainer";
import {Plus} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";

const Page = async (props: { params: Promise<{ username: string, tour: string }>, searchParams: Promise<{
        sort?: 'ASC' | 'DESC'
    }>} ) => {
    const searchParams = await props.searchParams;
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
            sections: {
                include: {
                    country: true,
                }
            }
        },
    });

    const user = await db.user.findUnique({
        where: {
            username: params.username
        }
    });

    const settings = await db.setting.findMany({
        where: {
            key: {
                in: ['MAX_SECTION_IMAGES_PREMIUM', 'MAX_SECTION_IMAGES_FREE']
            }
        }
    })

    const maxSections = session?.user.role === UserRole.USER ?
        settings?.find((s: Setting) => s.key === 'MAX_SECTION_IMAGES_FREE')?.value :
        session?.user.role === UserRole.PREMIUM ?
            settings?.find((s: Setting) => s.key === 'MAX_SECTION_IMAGES_PREMIUM')?.value :
            Infinity


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

            <TourSettingsSecondaryNav activeTab={"Steps"} params={params} sectionCount={tour?.sections.length as number}
                                      userRole={userRole}
                                      mentionsCount={tour?.TourToUser.filter(ttu => ttu.mentioned || ttu.role === TourToUserRole.OWNER).length as number}
            />
            <div className="flex flex-1 flex-col gap-4 p-4 lg:max-w-screen-lg max-w-lg w-full mx-auto ">
                <div className={cn(`flex flex-col gap-2 w-full`)}>
                    <H1>
                        Steps
                    </H1>

                    <div className={'flex items-center justify-end gap-2'}>
                        <Link
                            href={`/${params.username}/${params.tour}/steps?sort=${(searchParams?.sort === 'ASC' || !searchParams?.sort) ? 'DESC' : 'ASC'}`}>
                            <Button size={'sm'} variant={'outline'} className={'ml-2'}>
                                {(searchParams?.sort === 'ASC' || !searchParams?.sort) ? 'Start -> Finish' : 'Finish -> Start'}
                            </Button>
                        </Link>
                        {
                            isAllowed &&
                            <Link href={`/${params.username}/${params.tour}/new`}>
                                <Button size={'sm'} variant={'default'} className={'ml-2'}
                                        disabled={maxSections !== undefined && (tour?.sections.length || 0) >= Number(maxSections)}
                                >
                                    <Plus/> Add Step
                                </Button>
                            </Link>
                        }
                    </div>
                    <div className={'flex flex-col w-full gap-2'}>
                        <StepsContainer disabled={!isAllowed} tour={tour} metric={user?.metric as boolean}
                                        sort={searchParams?.sort || 'ASC'}/>
                    </div>
                </div>
            </div>
        </>)
}

export default Page