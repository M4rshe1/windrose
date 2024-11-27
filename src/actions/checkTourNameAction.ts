'use server'
import {getServerSession, Session} from "next-auth";
import {authOptions} from "@/lib/authOptions";
import db from "@/lib/db";
import {TourToUserRole} from "@prisma/client";

const FORBIDDEN_TOUR_NAMES: string[] = ['tours', 'timeline'];

export async function checkTourNameAction(name: string): Promise<boolean> {
    const session: Session | null = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return false;
    }

    if (!name) {
        return false;
    }

    if (FORBIDDEN_TOUR_NAMES.includes(name)) {
        return true;
    }

    const user = await db.tour.findFirst({
        where: {
            name: name,
            TourToUser: {
                some: {
                    userId: session.user.id,
                    role: TourToUserRole.OWNER
                }
            }
        }
    });

    return !user;
}
