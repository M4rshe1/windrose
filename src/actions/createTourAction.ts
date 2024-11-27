'use server'
import {getServerSession, Session} from "next-auth";
import {authOptions} from "@/lib/authOptions";
import db from "@/lib/db";
import {checkTourNameAction} from "@/actions/checkTourNameAction";
import {TourToUserRole} from "@prisma/client";
import {redirect} from "next/navigation";

export async function createTourAction(ownerId: string, name: string, description: string, displayName: string, visibility: string): Promise<boolean> {

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
            private: visibility === 'private',
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

    if (user.username) {
        return redirect(`/${user.username}/${name}`);
    } else {
        return redirect(`/${ownerId}/${name}`);
    }
}