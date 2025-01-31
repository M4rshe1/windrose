'use server'

import { auth } from "@/auth"

import db from "@/lib/db";
import {revalidatePath} from "next/cache";
import {TourToUserRole, UserRole} from "@prisma/client";

export async function deleteSectionImageAction(fileId: string, reval: string) {
    const session = await auth()

    if (!session) {
        return false
    }

    await db.file.deleteMany({
        where: {
            id: fileId,
            TourSectionToFile: {
                some: {
                    tourSection: {
                        tour: {
                            TourToUser: {
                                some: {
                                    OR: [
                                        {
                                            user: {
                                                id: session.user.id
                                            },
                                            role: {
                                                in: [TourToUserRole.OWNER, TourToUserRole.EDITOR]
                                            }
                                        },
                                        {
                                            user: {
                                                role: UserRole.ADMIN,
                                                id: session.user.id
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        }
    })
    revalidatePath(reval)
    return true
}