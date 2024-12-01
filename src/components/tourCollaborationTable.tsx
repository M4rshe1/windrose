"use client"

import {useEffect, useState} from "react";
import {TourToUserRole} from "@prisma/client";
import {DataTable} from "@/components/collaborationTable/data-table";
import {columns} from "@/components/collaborationTable/columns";
import {AddCollaboratorDialog} from "@/components/addCollaboratorDialog";

const TourCollaborationTable = ({tour}: { tour: any }) => {
    const [users, setUsers] = useState(tour.TourToUser.filter((ttu: any) => ttu.role !== TourToUserRole.OWNER).map((ttu: any) => {
            return {
                userId: ttu.user.id,
                name: ttu.user.name,
                username: ttu.user.username,
                tourName: tour.name,
                role: ttu.role,
                mentioned: ttu.mentioned,
                tourId: ttu.tourId,
                ownerUsername: tour.TourToUser.find((ttu: any) => ttu.role === TourToUserRole.OWNER).user.username
            }
        }
    ));


    useEffect(() => {
        setUsers(tour.TourToUser.filter((ttu: any) => ttu.role !== TourToUserRole.OWNER).map((ttu: any) => {
                return {
                    userId: ttu.user.id,
                    name: ttu.user.name,
                    username: ttu.user.username,
                    tourName: tour.name,
                    mentioned: ttu.mentioned,
                    role: ttu.role,
                    tourId: ttu.tourId,
                    ownerUsername: tour.TourToUser.find((ttu: any) => ttu.role === TourToUserRole.OWNER).user.username
                }
            }
        ));
    }, [tour.TourToUser]);

    return (
        <div className={'flex items-center gap-2 flex-col w-full'}>
            <div className={'flex items-center justify-end w-full'}>
                <AddCollaboratorDialog tour={tour}/>
            </div>
            <div className={'w-full'}>
                <DataTable columns={columns} data={users}/>
            </div>
        </div>
    );
}

export default TourCollaborationTable;