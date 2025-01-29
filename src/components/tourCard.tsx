import {TourStatus} from "@prisma/client";
import {cn, distanceReadable, getMinioLinkFromKey} from "@/lib/utils";
import Image from "next/image";
import PulsatingCircle from "@/components/PulsatingCircle";
import Link from "next/link";
import {ExtendedTour} from "@/lib/userProfileInterfaces";


const TourCard = ({tour, metric, username}: { tour: ExtendedTour; metric: boolean, username: string }) => {
    return (
        <Link
            href={`/${username}/${tour.name}`}
            className={`flex flex-col gap-4 p-4 border-2 hover:shadow-md hover:border-primary border-neutral rounded-lg cursor-pointer hover:shadow-lg transition-all duration-300 ease-in-out relative`}
        >
            <div className="flex gap-4">
                <div className="w-32 h-32 bg-neutral rounded-lg overflow-hidden relative">
                    {tour?.heroImage?.fileKey && (
                        <Image
                            src={getMinioLinkFromKey(tour?.heroImage?.fileKey)}
                            alt={tour.displayName}
                            layout="fill"
                            objectFit="cover"
                        />
                    )}
                </div>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold">{tour.displayName}</h1>
                    <p className="text-neutral-500">{tour.description}</p>
                </div>
            </div>
            <div className="flex gap-4">
                <span>
                    <strong>
                        {
                            distanceReadable(
                                tour.sections.reduce(
                                    (acc, section) => acc + (section?.distance || 0),
                                    0
                                ),
                                metric
                            )
                        }
                    </strong>{" "}
                    Distance
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
