"use client"

import {useEffect, useState} from "react";
import {TourToUserRole} from "@prisma/client";
import {DataTable} from "@/components/collaborationTable/data-table";
import {columns} from "@/components/collaborationTable/columns";
import {Button} from "@/components/ui/button";

const TourCollaborationTable = ({tour}: { tour: any }) => {
    const [users, setUsers] = useState(tour.TourToUser.filter((ttu: any) => ttu.role !== TourToUserRole.OWNER).map((ttu: any) => {
            return {
                userId: ttu.user.id,
                name: ttu.user.name,
                username: ttu.user.username,
                role: ttu.role
            }
        }
    ));

    useEffect(() => {
        setUsers(tour.TourToUser.filter((ttu: any) => ttu.role !== TourToUserRole.OWNER).map((ttu: any) => {
                return {
                    id: ttu.user.id,
                    name: ttu.user.name,
                    username: ttu.user.username,
                    role: ttu.role,
                    tourId: ttu.tourId
                }
            }
        ));
    }, [tour.TourToUser]);

    return (
        <div className={'flex items-center gap-2 flex-col w-full'}>
            <div className={'flex items-center justify-end w-full'}>
                <Button variant={'default'}>Add Collaborator</Button>
            </div>
            <div className={'w-full'}>
                <DataTable columns={columns} data={users}/>
            </div>
        </div>
    );
}

export default TourCollaborationTable;