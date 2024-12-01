import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/authOptions";
import {TourToUserRole} from "@prisma/client";
import db from "@/lib/db";
import {redirect} from "next/navigation";

const NewStep = async (props: { params: Promise<{ username: string, tour: string }> }) => {
    const params = await props.params;
    const session = await getServerSession(authOptions);

    const tour = await db.tour.findFirst({
        where: {
            name: params.tour,
            TourToUser: {
                some: {
                    AND: [
                        {
                            user: {
                                username: params.username
                            },
                            role: TourToUserRole.OWNER
                        },
                        {
                            user: {
                                username: session?.user?.username
                            },
                            role: TourToUserRole.OWNER
                        }
                    ]
                }
            },
        }
    });

    if (!tour) {
        return redirect(`/${params.username}/${params.tour}`);
    }

    const step = await db.tourSection.create({
        data: {
            tourId: tour.id,
            datetime: new Date(),
        }
    });

    return redirect(`/${params.username}/${params.tour}/${step.id}`);
}

export default NewStep;