"use client"

import {useEffect, useState} from "react";
import {TourToUserRole} from "@prisma/client";
import {DataTable} from "@/components/collaborationTable/data-table";
import {columns} from "@/components/collaborationTable/columns";

const TourCollaborationTable = ({tour}: { tour: any }) => {
    const [users, setUsers] = useState(tour.TourToUser.filter((ttu: any) => ttu.role !== TourToUserRole.OWNER).map((ttu: any) => {
            return {
                id: ttu.user.id,
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
                    role: ttu.role
                }
            }
        ));
    }, [tour.TourToUser]);

    return (
        <div>
            <DataTable columns={columns} data={users}/>
        </div>
    );
}

export default TourCollaborationTable;