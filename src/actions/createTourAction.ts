'use server'
import { auth } from "@/auth"

import {checkTourNameAction} from "@/actions/checkTourNameAction";
import db from "@/lib/db";
import {TourStatus, TourToUserRole, TourVisibility} from "@prisma/client";
import {redirect} from "next/navigation";

export async function createTourAction(ownerId: string, name: string, description: string, displayName: string, visibility: TourVisibility
, status: TourStatus): Promise<boolean> {

    const session = await auth()
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

    const tour = await db.tour.create({
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

    if (!tour) {
        return false;
    }

    await db.tourSection.create({
        data: {
            tourId: tour.id,
            name: 'Starting Point',
            description: 'This is the first section of your tour. You can edit this section to add more information about your tour.',
            datetime: new Date(),
        }
    });

    if (user.username) {
        return redirect(`/${user.username}/${name}`);
    } else {
        return redirect(`/${ownerId}/${name}`);
    }
}