import {TourStatus} from "@prisma/client";
import {cn, distanceReadable, getMinioLinkFromKey} from "@/lib/utils";
import Image from "next/image";
import PulsatingCircle from "@/components/PulsatingCircle";
import Link from "next/link";
import {ExtendedTour} from "@/lib/userProfileInterfaces";
import * as React from "react";


const TourCard = ({tour, metric, username}: {
    tour: ExtendedTour;
    metric: boolean,
    username: string
}) => {
    const owner = tour.TourToUser.find(ttu => ttu.role === "OWNER")?.user;
    return (
        <Link
            href={`/${owner?.username}/${tour.name}`}
            className={`flex group/tour flex-col gap-4 p-4 border-2 hover:border-primary border-neutral rounded-lg cursor-pointer hover:shadow-lg transition-all duration-300 ease-in-out relative`}
        >
            <div className="flex gap-4">
                <div className="w-32 h-32 bg-neutral rounded-lg overflow-hidden relative">
                    {tour?.heroImage?.fileKey && (
                        <Image
                            src={getMinioLinkFromKey(tour?.heroImage?.fileKey)}
                            alt={tour.displayName}
                            fill
                            className={`object-cover`}
                        />
                    )}
                </div>
                <div className="flex-1">
                    <div
                        className={cn("flex items-center justify-between")}
                    >

                        <h1 className="text-2xl font-bold ">
                            <div className={cn('relative h-5')}>
                                     <span
                                         className={cn('truncate text-sm absolute transition-all duration-300 ease-in-out', 'group-hover/tour:translate-y-[-100%] group-hover/tour:opacity-0')}>
                                         {
                                             owner?.username == username ? `${tour.displayName}` : `${owner?.name}/${tour.displayName}`
                                         }
                                     </span>
                                <span
                                    className={cn('truncate text-sm absolute transition-all duration-300 ease-in-out opacity-0', 'translate-y-[100%] group-hover/tour:translate-y-0 group-hover/tour:opacity-100')}>
                                    {
                                        owner?.username == username ? `${tour.name}` : `${owner?.username}/${tour.name}`
                                    }
                                </span>
                            </div>
                        </h1>
                    </div>
                    <p className="text-neutral-500">{tour.description}</p>
                </div>
            </div>
            <div className="flex gap-4">
                    <span className={`font-semibold`}>
                        {
                            distanceReadable(
                                tour.sections.reduce(
                                    (acc, section) => acc + (section?.distance || 0),
                                    0
                                ),
                                metric
                            )
                        }
                    </span>
            </div>
            <div
                className={cn("absolute top-2 right-2 rounded-full")}
            >
                <PulsatingCircle size={0}
                                 background={tour.status === TourStatus.PLANNING ? "bg-info" : tour.status === TourStatus.ON_TOUR ? "bg-warning" : "bg-success"}/>
            </div>
        </Link>
    );
};

export default TourCard;
