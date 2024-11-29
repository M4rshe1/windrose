'use server'
import {getServerSession, Session} from "next-auth";
import {authOptions} from "@/lib/authOptions";
import db from "@/lib/db";
import {checkTourNameAction} from "@/actions/checkTourNameAction";
import {TourStatus, TourToUserRole, TourVisibility} from "@prisma/client";
import {redirect} from "next/navigation";

export async function createTourAction(ownerId: string, name: string, description: string, displayName: string, visibility: TourVisibility
, status: TourStatus): Promise<boolean> {

    const session: Session | null = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return false;
    }

    const user = await db.user.findUnique({
        where: {
            id: session.user.id
        }
    });

    if (!user) {
        return false;
    }

    const tourNameIsValid = await checkTourNameAction(name);

    if (!tourNameIsValid) {
        return false;
    }

    const result = await db.tour.create({
        data: {
            name: name,
            description: description,
            displayName: displayName,
            visibility: visibility,
            status: status,
            TourToUser: {
                create: {
                    role: TourToUserRole.OWNER,
                    userId: ownerId
                }
            }
        }
    });

    if (!result) {
        return false;
    }

    await db.tourSection.create({
        data: {
            tourId: result.id,
            name: 'Starting Point',
            order: 0,
            description: 'This is the first section of your tour. You can edit this section to add more information about your tour.',
        }
    });

    if (user.username) {
        return redirect(`/${user.username}/${name}`);
    } else {
        return redirect(`/${ownerId}/${name}`);
    }
}