import db from "@/lib/db";
import {BreadcrumbPortal} from "@/components/breadcrumbBar";
import React from "react";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/authOptions";
import {UserSecondaryNav} from "@/components/secondaryNavs";
import TourCard from "@/components/tourCard";
import Link from "next/link";
import ProfileHeader from "@/components/ProfileHeader";
import {redirect} from "next/navigation";

export default async function ProfilePage(props: { params: Promise<{ username: string }> }) {
    const params = await props.params;
    const session = await getServerSession(authOptions);
    const user = await db.user.findUnique({
        where: {username: params.username},
        include: {
            image: {select: {fileKey: true}},
            TourToUser: {
                include: {
                    tour: {
                        include: {
                            heroImage: {select: {fileKey: true}},
                            sections: {
                                include: {country: true}
                            }
                        },
                    }

                }
            },
            Saved: true,
            Social: true
        }
    });
    
    if (user === null) return redirect("/error/404");

    return (
        <>
            <BreadcrumbPortal items={[{title: user?.name as string, url: `/${params.username}`}]}/>
            <UserSecondaryNav activeTab="Overview" username={params.username}
                              isProfileOwner={session?.user?.username === params.username}
                              tours={user?.TourToUser.length || 0}/>

            <div className="flex flex-1 flex-col gap-4 p-4 mt-8 lg:max-w-screen-lg max-w-lg w-full mx-auto">
                <ProfileHeader user={user} params={params} session={session}/>

                <h2 className="text-xl font-bold mt-4">Pinned Tours</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {user?.TourToUser.filter(tour => tour.pinned)
                        .map(({tour}) => (
                            <TourCard key={tour.id} username={params.username} tour={tour}
                                      metric={session?.user?.metric || true}/>
                        ))}
                    {
                        user?.TourToUser.filter(tour => tour.pinned).length === 0 && (
                            <p className={"italic"}>This user hasn&#39;t pinned any tours yet.<br/>
                                But there are <Link href={`/${params.username}/tours`}
                                                    className={"text-primary hover:underline"}>{user?.TourToUser.length - user?.TourToUser.filter(tour => tour.pinned).length} other
                                    tours</Link> you could look at.</p>
                        )
                    }
                </div>
            </div>
        </>
    );
}
