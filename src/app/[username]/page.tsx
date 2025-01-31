import db from "@/lib/db";
import {BreadcrumbPortal} from "@/components/breadcrumbBar";
import React from "react";
import { auth } from "@/auth"

import {UserSecondaryNav} from "@/components/secondaryNavs";
import TourCard from "@/components/tourCard";
import Link from "next/link";
import ProfileHeader from "@/components/ProfileHeader";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {cn} from "@/lib/utils";
import PinnedToursFormPopup from "@/components/PinnedToursFormPopup";

export default async function ProfilePage(props: { params: Promise<{ username: string }> }) {
    const params = await props.params;
    
    const session = await auth()
    const [user, tours] = await Promise.all([
        db.user.findUnique({
            where: {username: params.username},
            include: {
                image: {select: {fileKey: true}},
                Saved: true,
                Social: true
            }
        }),
        db.tour.findMany({
            where: {
                TourToUser: {
                    some: {
                        user: {
                            username: params.username
                        }
                    }
                }
            },
            include: {
                heroImage: true,
                sections: {
                    include: {
                        country: true
                    }
                },
                TourToUser: {
                    where: {
                        role: "OWNER"
                    },
                    include: {
                        user: {
                            include: {
                                image: true
                            }
                        }
                    }
                }
            }
        })
    ]);

    async function pinToursServerAction(pins: string[]) {
        "use server"
        if (!session?.user) return redirect("/login");

        const unpinned = await db.tourToUser.updateMany({
            where: {
                userId: session?.user?.id,
                tourId: {
                    notIn: pins
                }
            },
            data: {
                pinned: false
            }
        });

        const pinned = await db.tourToUser.updateMany({
            where: {
                userId: session?.user?.id,
                tourId: {
                    in: pins
                }
            },
            data: {
                pinned: true
            }
        });
        return revalidatePath(`/[username]`, "page");
    }

    if (user === null) return redirect("/error/404");

    const pinnedTours = tours?.filter(tour => tour?.TourToUser?.some(ttu => ttu?.pinned && ttu?.user?.username === params?.username));

    return (
        <>
            <BreadcrumbPortal items={[{title: user?.name as string, url: `/${params.username}`}]}/>
            <UserSecondaryNav activeTab="Overview" username={params.username}
                              isProfileOwner={session?.user?.username === params.username}
                              tours={tours.length || 0}/>

            <div className="flex flex-1 flex-col gap-4 p-4 mt-8 lg:max-w-screen-lg max-w-lg w-full mx-auto">
                <ProfileHeader tours={tours} user={user} params={params} session={session}/>

                <div
                    className={cn("flex items-center justify-between")}>
                    <h2 className="text-xl font-bold mt-4">Pinned Tours</h2>
                    {
                        session?.user?.username === params.username &&
                        <PinnedToursFormPopup tours={tours} pinToursAction={pinToursServerAction} username={session?.user?.username as string}/>
                    }
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {pinnedTours.map((tour) => (
                        <TourCard key={tour.id} username={params.username} tour={tour}
                                  metric={session?.user?.metric || true}
                        />
                    ))}
                    {
                        pinnedTours?.length === 0 && (
                            <p className={"italic"}>This user hasn&#39;t pinned any tours yet.<br/>
                                But there are <Link href={`/${params.username}/tours`}
                                                    className={"text-primary hover:underline"}>{tours?.length - pinnedTours?.length} other
                                    tours</Link> you could look at.</p>
                        )
                    }
                </div>
            </div>
        </>
    );
}
