import {BreadcrumbPortal} from "@/components/breadcrumbBar";
import {TourSettingsSecondaryNav} from "@/components/secondaryNavs";
import {cn, distanceReadable, timeReadable} from "@/lib/utils";
import React from "react";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/authOptions";
import db from "@/lib/db";
import {TourToUserRole, UserRole} from "@prisma/client";
import H1 from "@/components/ui/h1";
import H2 from "@/components/ui/h2";
import TourStepImageInput from "@/components/tourStepImageInput";
import {revalidatePath} from "next/cache";
import {Infinity as InfinityIcon} from "lucide-react";
import MapInputServerComponentWrapper from "@/components/MapInputServerComponentWrapper";
import {redirect} from "next/navigation";
import LocationIQ, {LocationIQResponse} from "@/lib/locationIQ";
import SubtitleInput from "@/components/subtitleInput";

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

    async function deleteImageAction(fileId: string) {
        "use server"
        await db.file.delete({
            where: {
                id: fileId,
                TourSectionToFile: {
                    some: {
                        tourSectionId: params.step
                    }
                }
            }
        })
        revalidatePath(`/${params.username}/${params.tour}/${params.step}`)
    }

    async function UpdateLocation(location: LocationIQResponse) {
        "use server"
        const sections = await db.tourSection.findMany({
            where: {
                tourId: tour?.id
            },
            orderBy: {
                datetime: 'asc'
            }
        })
        const locationIQ = new LocationIQ()
        const dataPrevious = {duration: null, distance: null} as { duration: number | null, distance: number | null }
        const sectionIndex = sections.findIndex(s => s.id === params.step)
        console.log(sectionIndex)
        if (sectionIndex === -1) return;
        if (sectionIndex > 0) {
            const previousSection = sections[sectionIndex - 1]
            console.log(previousSection)
            if (previousSection.lat && previousSection.lng) {
                const directions = await locationIQ.directions([
                    {lat: previousSection.lat as number, lon: previousSection.lng as number},
                    {lat: parseFloat(location.lat), lon: parseFloat(location.lon)}
                ])
                console.log(directions)
                if ("routes" in directions && directions.routes.length > 0) {
                    dataPrevious.duration = directions.routes[0].duration
                    dataPrevious.distance = directions.routes[0].distance
                }
            }
        }

        await db.tourSection.update({
            where: {
                id: params.step
            },
            data: {
                lat: parseFloat(location.lat),
                lng: parseFloat(location.lon),
                name: location.display_place || location.display_name.split(',')[0],
                ...dataPrevious
            }
        })

        if (sectionIndex < sections.length - 1) {
            const nextSection = sections[sectionIndex + 1]
            if (nextSection.lat && nextSection.lng) {
                const directions = await locationIQ.directions([
                    {lat: parseFloat(location.lat), lon: parseFloat(location.lon)},
                    {lat: nextSection.lat as number, lon: nextSection.lng as number}
                ])
                if ("routes" in directions && directions.routes.length > 0) {
                    await db.tourSection.update({
                        where: {
                            id: nextSection.id
                        },
                        data: {
                            duration: directions.routes[0].duration,
                            distance: directions.routes[0].distance
                        }
                    })
                }
            }
        }
        revalidatePath(`/${params.username}/${params.tour}/${params.step}`)
    }

    async function setTourSectionDescription(description: string) {
        "use server"
        await db.tourSection.update({
            where: {
                id: params.step
            },
            data: {
                description: description
            }
        })
    }

    const maxImages = session?.user.role === UserRole.ADMIN ?
        Infinity :
        session?.user.role === UserRole.PREMIUM ? settings.find(setting => setting.key === 'MAX_SECTION_IMAGES_PREMIUM')?.value :
            settings.find(setting => setting.key === 'MAX_SECTION_IMAGES_FREE')?.value;

    let userRole: string
    if (session?.user?.role == UserRole.ADMIN) {
        userRole = UserRole.ADMIN;
    } else {
        userRole = tour?.TourToUser.find(ttu => ttu.user.username === session?.user?.username)?.role as string;
    }

    if (userRole !== UserRole.ADMIN && userRole !== TourToUserRole.EDITOR && userRole !== TourToUserRole.OWNER) {
        return redirect(`/${params.username}/${params.tour}/steps`)
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
                <div className={cn(`flex items-center gap-2 w-full`)}>
                    <H1 className={'w-full'}>{section?.name || 'Unnamed Step'}
                        {section?.duration && section?.distance &&
                            <span className={'text-lg opacity-70 flex items-center gap-1'}>
                                {timeReadable(section?.duration as number)} / {distanceReadable(section?.distance as number, session?.user?.metric || true)}
                            </span>
                        }
                        {
                            (!section?.lat || !section?.lng) &&
                            <span className={'text-lg text-error flex items-center gap-1'}>
                            Missing location
                        </span>
                        }
                    </H1>

                </div>
                <div className={'aspect-video w-full'}>
                    <MapInputServerComponentWrapper lat={section?.lat || 51.52402063531574}
                                                    lon={section?.lng as number || -0.1586415330899539} zoom={5}
                                                    onChange={UpdateLocation}/>
                </div>
                <SubtitleInput labelText={`Description`} type={`text`} name={`description`}
                               id={`description`}
                               defaultValue={section?.description as string}
                               onBlurAction={setTourSectionDescription}
                               subText={`(Optional) Tell us something about your experience at this location.`}
                               className={cn(`w-full`)}
                               limit={200}
                />
                <H2 className={'flex items-end gap-1'}>Images
                    {maxImages &&
                        <span className={'text-lg opacity-70 flex items-center--'}>
                            {section?.images.length} /&nbsp;{maxImages === Infinity ?
                            <InfinityIcon/> : maxImages as React.ReactNode}
                        </span>
                    }

                </H2>
                <TourStepImageInput images={section?.images.map(image => image.file) || []}
                                    deleteImage={deleteImageAction}
                                    maxImages={maxImages as number}
                                    sectionId={params.step}
                                    reval={`/${params.username}/${params.tour}/${params.step}`}
                />
            </div>
        </>)
}

export default Page