import {BreadcrumbPortal} from "@/components/breadcrumbBar";
import {TourSettingsSecondaryNav} from "@/components/secondaryNavs";
import {cn, distanceReadable, getMinioLinkFromKey, timeReadable} from "@/lib/utils";
import React from "react";
import { auth } from "@/auth"

import db from "@/lib/db";
import {Country, TourStatus, TourToUserRole, UserRole} from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import {CalendarClock, Clock, Flag, Goal, LandPlot, Play, Route} from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import {TOUR_STATUS} from "@/lib/status";
import PulsatingCircle from "@/components/PulsatingCircle";
import TourSectionItem, {Section} from "@/components/tourSectionItem";
import RouteMapServerComponentWrapper from "@/components/RouteMapServerComponentWrapper";
import {GeoJSON} from "geojson";
import ScrollIntoViewButton from "@/components/scrollIntoViewButton";

const Page = async (props: { params: Promise<{ username: string, tour: string }> }) => {
    const session = await auth()
    const params = await props.params;
    const tour = await db.tour.findFirst({
        where: {
            name: params.tour,
            TourToUser: {
                some: {
                    user: {
                        username: params.username
                    },
                    role: TourToUserRole.OWNER
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
            heroImage: true,
            sections: {
                include: {
                    country: true,
                    images: {
                        include: {
                            file: true
                        }
                    }
                }
            },
            Tags: true
        }
    });

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

    const totalDistance = tour?.sections.reduce((acc, section) => acc + (section.distance || 0), 0) || 0;
    const sortedSections = tour?.sections.sort((a, b) => (a.datetime as Date).getTime() - (b.datetime as Date).getTime())
    const uniqueCountries: Country[] = []
    tour?.sections.map(section => {
        const country = uniqueCountries.find(country => country?.code === section.country?.code)
        if (!country) {
            uniqueCountries.push(section.country as Country)
        }
    })


    const stats = [
        {
            icon: Route,
            title: 'Steps',
            value: sectionCount._count,
            link: `/${params.username}/${params.tour}/steps`
        },
        {
            icon: Flag,
            title: 'Countries',
            value: new Set(tour?.sections.map(section => section.country?.name).filter(Boolean)).size,
        },
        {
            icon: LandPlot,
            title: 'traveled',
            value: distanceReadable(totalDistance, session?.user?.metric || true),
        },
        {
            icon: Clock,
            title: 'driving',
            value: timeReadable(tour?.sections.reduce((acc, section) => acc + (section.duration || 0), 0) || 0, {
                days: "total",
                hours: "rest",
                minutes: "rest",
            }),
        },
        {
            icon: Play,
            title: 'started',
            value: new Date(tour?.sections?.[0]?.datetime as Date).toLocaleDateString(),
            link: `#section-0`
        },
        {
            icon: Goal,
            title: 'finished',
            value: new Date(tour?.sections?.[tour?.sections.length - 1]?.datetime as Date).toLocaleDateString(),
            link: `#section-${tour?.sections.length ? tour?.sections.length - 1 : 0}`
        },
        {
            icon: CalendarClock,
            title: 'days',
            value: Math.ceil((new Date(tour?.sections?.[tour?.sections.length - 1]?.datetime as Date).getTime() - new Date(tour?.sections?.[0]?.datetime as Date).getTime()) / (1000 * 60 * 60 * 24)),
        }
    ]

    const colors = {
        ON_TOUR: 'bg-warning',
        PLANNING: 'bg-info',
        FINISHED: 'bg-success'
    }

    let distance = 0;


    return (
        <>
            <BreadcrumbPortal items={
                [
                    {
                        title: user?.name as string, url: `/${params.username}`
                    },
                    {
                        title: tour?.displayName as string, url: `/${params.username}/${params.tour}`
                    }
                ]
            }/>

            <TourSettingsSecondaryNav activeTab={"Overview"} params={params} sectionCount={sectionCount._count}
                                      userRole={userRole}
                                      mentionsCount={tour?.TourToUser.filter(ttu => ttu.mentioned || ttu.role === TourToUserRole.OWNER).length as number}
            />
            <div className="flex flex-1 flex-col gap-4 p-4 lg:max-w-screen-lg max-w-lg w-full mx-auto ">
                <div className={cn(`flex flex-col gap-2 w-full`)}>
                    <div
                        className={cn("rounded-lg overflow-hidden bg-base-300 relative grid place-items-center w-full aspect-video")}>
                        <div className={'col-start-1 row-start-1'}>
                            No Hero Image
                        </div>
                        {
                            tour?.heroImage &&
                            <Image src={
                                getMinioLinkFromKey(tour.heroImage.fileKey)
                            } alt={`Hero`} width={1920} height={1080}
                                   className={'col-start-1 row-start-1'}/>
                        }
                        <div className={
                            cn("absolute m-auto text-white font-bold text-4xl bg-black/50 p-2 rounded mx-2")
                        }>
                            {tour?.displayName}
                        </div>
                        <div className={
                            cn("absolute bottom-0 right-0 font-bold text-xl p-2 rounded-tl bg-black/50 flex items-center gap-2")

                        }>
                            <PulsatingCircle size={1} background={
                                colors[tour?.status as TourStatus] || 'bg-info'
                            }/>
                            {TOUR_STATUS.find(status => status.value === tour?.status)?.label}
                        </div>
                    </div>
                </div>
                <div className={cn("grid grid-cols-1 lg:grid-cols-[4fr_2fr] gap-4")}>
                    <div
                        className={"max-w-full flex flex-col"}>
                        <div className={
                            cn("flex flex-col gap-2 w-full aspect-video mb-4")
                        }>
                            {
                                sortedSections &&
                                sortedSections?.length > 0 &&
                                !sortedSections?.some((section) => !section.lat || !section.lng) ?
                                    <RouteMapServerComponentWrapper
                                        geometries={sortedSections
                                            .filter(section => section.geojson)
                                            .map(section => section.geojson as unknown as GeoJSON) ?? []}
                                        lat={tour?.sections[0].lat as number} lon={tour?.sections[0].lng as number}
                                        markers={tour?.sections.map(section => ({
                                            lat: section.lat as number,
                                            lon: section.lng as number,
                                        }))}/> :
                                    <div className={cn("flex flex-col gap-2 bg-base-200 rounded-lg p-4")}>
                                        <div className={cn("text-lg font-bold")}>
                                            Route
                                        </div>
                                        <div className={cn("text-base italic opacity-60")}>
                                            There is no route available, it is missing location data.
                                        </div>
                                    </div>
                            }
                        </div>

                        {
                            sortedSections?.map((section, index) => {
                                distance += sortedSections?.[index + 1]?.distance || 0;
                                return <TourSectionItem
                                    section={section as Section} key={section.id} index={index}
                                    distance={sortedSections?.[index + 1]?.distance || 0}
                                    distanceUntilNow={distance}
                                    metric={session?.user?.metric || true}
                                    length={sortedSections.length}
                                />
                            })
                        }
                    </div>
                    <div className={
                        cn("flex flex-col gap-4 w-full")
                    }>
                        <div className={'flex flex-col h-min gap-2 bg-base-200 rounded-lg p-4'}>
                            <div className={cn("text-lg font-bold")}>
                                About
                            </div>
                            <div className={cn("text-base")}>
                                {
                                    tour?.description ? tour.description : <span
                                        className={cn("opacity-60 italic")}>
                                    No Description
                                </span>
                                }
                            </div>

                            <div className={cn("flex flex-wrap gap-2")}>
                                {
                                    tour?.Tags.map(tag => (
                                        <Link key={tag.id}
                                              href={`/explore?tags=${tag.tag}`}
                                              className={cn("bg-primary/10 text-primary rounded-full px-2 py-0.5 text-sm hover:bg-primary hover:text-primary-content transition duration-200 ease-in-out")}>
                                            {tag.tag}
                                        </Link>
                                    ))
                                }
                            </div>
                            <div
                                className={cn("flex flex-col text-sm")}>
                                {
                                    stats.map(stat => (
                                        <ScrollIntoViewButton
                                            link={stat.link}
                                            key={stat.title}
                                            className={cn("flex items-center gap-2 hover:text-primary transition duration-200 ease-in-out", stat.link ? 'hover:link' : 'pointer-events-none')}>
                                            <stat.icon size={16}/>
                                            <p>
                                            <span
                                                className={cn("font-semibold")}>
                                                {stat.value}
                                            </span>
                                                {' '}
                                                {stat.title}
                                            </p>
                                        </ScrollIntoViewButton>
                                    ))
                                }
                            </div>
                            <div className={cn("flex w-full h-0.5 bg-base-100")}></div>
                            <Link
                                className={cn("text-lg font-bold hover:underline hover:text-primary transition duration-200 ease-in-out")}
                                href={`/${params.username}/${params.tour}/mentions`}
                            >
                                Mentions{' '}
                                <span
                                    className={cn("bg-base-100 text-xs rounded-full px-2 py-0.5")}>{tour?.TourToUser.filter(ttu => ttu.mentioned || ttu.role === TourToUserRole.OWNER).length}</span>
                            </Link>
                            <div className={cn("flex flex-wrap gap-2")}>
                                {
                                    tour?.TourToUser
                                        .filter(ttu => ttu.mentioned || ttu.role === TourToUserRole.OWNER)
                                        .map(ttu => (
                                            <Link
                                                href={`/${ttu.user.username}`}
                                                key={ttu.user.username}
                                                data-tip={ttu.user.name as string}
                                                className={cn("flex gap-2 items-center tooltip before:bg-base-300 before:text-base-content after:text-base-300")}>
                                                {
                                                    ttu.user.image ?
                                                        <Image src={getMinioLinkFromKey(ttu.user.image?.fileKey)}
                                                               alt={ttu.user.name as string}
                                                               width={32} height={32} className={cn("rounded-full")}/>
                                                        :
                                                        <div
                                                            className={cn("w-8 h-8 rounded-full bg-base-100 flex items-center justify-center")}>
                                                    <span>
                                                        {ttu.user.name?.charAt(0)}
                                                    </span>
                                                        </div>
                                                }
                                            </Link>
                                        ))
                                }
                            </div>
                            <div className={cn("flex w-full h-0.5 bg-base-100 ")}></div>
                            <div className={cn("text-lg font-bold flex items-center gap-1")}>
                                Countries{' '}
                                <span
                                    className={cn("bg-base-100 text-xs rounded-full px-2 py-0.5")}>{uniqueCountries?.length}</span>
                            </div>
                            <div className={"flex flex-col gap-2"}>
                                <div className={cn("flex flex-wrap gap-y-1 gap-x-2")}>
                                    {
                                        uniqueCountries?.length > 0 ?
                                            uniqueCountries?.map((country) => (
                                                <Link
                                                    href={`/explore?countries=${country?.code}`}
                                                    key={country?.code}
                                                    className={cn("flex items-center hover:text-primary hover:link transition duration-200 ease-in-out")}>
                                                    <div
                                                        className={cn("flex gap-1 items-center")}
                                                    >
                                                        <ReactCountryFlag countryCode={country?.code} svg/>
                                                        <span className={"text-sm"}>
                                                    {country?.name}
                                                </span>
                                                    </div>
                                                </Link>
                                            ))
                                            :
                                            <span className={cn("opacity-60 italic text-sm")}>
                                            No Countries
                                        </span>
                                    }
                                </div>
                            </div>
                        </div>
                       
                    </div>
                </div>
            </div>
        </>)
}

export default Page