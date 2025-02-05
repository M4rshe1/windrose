import db from "@/lib/db";
import {BreadcrumbPortal} from "@/components/breadcrumbBar";
import React from "react";
import { auth } from "@/auth"

import {UserSecondaryNav} from "@/components/secondaryNavs";
import TourCard from "@/components/tourCard";
import ProfileHeader from "@/components/ProfileHeader";
import {redirect} from "next/navigation";

export default async function ProfileToursPage(props: { params: Promise<{ username: string }> }) {
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
                        },
                        OR: [
                            {
                                role: {
                                    in: ["OWNER", "EDITOR"]
                                }
                            },
                            {
                                mentioned: true
                            }
                        ]
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

    if (user === null) return redirect("/error/404");

    return (
        <>
            <BreadcrumbPortal items={[{title: user?.name as string, url: `/${params.username}`}]}/>
            <UserSecondaryNav activeTab="Tours" username={params.username}
                              isProfileOwner={session?.user?.username === params.username}
                              tours={tours.length || 0}/>

            <div className="flex flex-1 flex-col gap-4 p-4 mt-8 lg:max-w-screen-lg max-w-lg w-full mx-auto">
                <ProfileHeader user={user} tours={tours} params={params} session={session}/>

                <h2 className="text-xl font-bold mt-4">Tours</h2>
                <div className="grid grid-cols-1 gap-4">
                    {tours
                        .map((tour) => (
                            <TourCard key={tour.id} username={params.username} tour={tour}
                                      metric={session?.user?.metric || true}
                            />
                        ))}
                </div>
            </div>
        </>
    );
}
