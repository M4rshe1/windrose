"use client";

import {Button} from "@/components/ui/button";
import SelectWithIcons from "@/components/selectWithIcons";
import {TourToUserRole, TourVisibility} from "@prisma/client";
import {Globe, Lock, User} from "lucide-react";
import {getMinioLinkFromKey} from "@/lib/utils";
import {confirmModal} from "@/components/confirmModal";
import {updateTourVisabilityAction} from "@/actions/updateTourVisabilityAction";
import SearchSelect from "@/components/SearchSelect";
import {useState} from "react";
import {deleteTourAction} from "@/actions/deleteTourAction";
import {updateTourOwner} from "@/actions/updateTourOwner";
import {redirect} from "next/navigation";

const TourDangerSettings = ({tour}: { tour: any }) => {
    const [owner, setOwner] = useState(tour.TourToUser.find((ttu: any) => ttu.role === TourToUserRole.OWNER).user.username);
    const [visibility, setVisibility] = useState(tour.visibility);
    const usersInTour = tour.TourToUser.filter((ttu: any) => ttu.role !== TourToUserRole.OWNER);
    const formatedUsers = usersInTour.map((ttu: any) => {
        return {
            value: ttu.user.username,
            label: ttu.user.name,
            image: ttu.user.image?.key ? getMinioLinkFromKey(ttu.user.image.key) : null
        }
    });

    async function handleChangeVisibility() {
        if (await confirmModal(
            {
                title: 'Change Tour Visibility',
                text: `This will change the visibility of the tour to ${visibility} and all its steps. Are you sure you want to continue?`,
                buttonTrue: "Confirm",
                buttonFalse: "Cancel",
                confirmValue: tour.name
            }
        )) {
            await updateTourVisabilityAction(tour.id, visibility as string);
        }
    }

    async function handleTransferOwnership() {
        const name = formatedUsers.find((user: any) => user.value === owner).label;
        if (await confirmModal(
            {
                title: 'Transfer Tour Ownership',
                text: `This will transfer the ownership of the tour to ${name} (${owner}).Are you sure you want to continue?`,
                buttonTrue: "Confirm",
                buttonFalse: "Cancel",
                confirmValue: owner
            }
        )) {
            await updateTourOwner(tour.id, owner);
        }
    }

    async function handleDeleteTour() {
        if (await confirmModal(
            {
                title: 'Delete Tour',
                text: `This will delete the tour and all its sections. Are you sure you want to continue?`,
                buttonTrue: "Confirm",
                buttonFalse: "Cancel",
                confirmValue: tour.name
            }
        )) {
            await deleteTourAction(tour.id);
            redirect(`/${tour.user.username}`);
        }
    }


    return (
        <div
            className={'border-2 border-error rounded-lg [&>*]:p-4 [&>*]:justify-between [&>*]:flex [&>*]:items-center [&>*]:gap-4'}>
            <div>
                <div>
                    <p className={'font-semibold'}>
                        Delete the tour and all its steps.
                    </p>
                    <span className={'text-sm'}>
                        This action cannot be undone. Please be certain.
                    </span>
                </div>
                <Button variant={"error"} onClick={handleDeleteTour}>
                    Delete Tour
                </Button>
            </div>
            <div>
                <div>
                    <p className={'font-semibold'}>
                        Transfer ownership of the tour.
                    </p>
                    <span className={'text-sm'}>
                        Transfer the tour to another user. They will be able to edit and delete the tour.
                    </span>
                </div>
                <div className="flex gap-2">
                    <SearchSelect options={formatedUsers} name={"owner"} onChangeAction={setOwner} placeholder={"Owner"}
                                  defaultValue={owner}/>
                    <Button variant={"error"} onClick={handleTransferOwnership}
                            disabled={owner === tour.TourToUser.find((ttu: any) => ttu.role === TourToUserRole.OWNER).user.username}
                    >
                        Transfer Ownership
                    </Button>
                </div>
            </div>
            <div>
                <div>
                    <p className={'font-semibold'}>
                        Change the visibility of the tour,
                        currently {tour.visibility.slice(0, 1).toUpperCase() + tour.visibility.slice(1).toLowerCase()}.
                    </p>
                    <span className={'text-sm'}>
                        Change the visibility of the tour to public, followers only or private.
                    </span>
                </div>
                <div className="flex gap-2">
                    <SelectWithIcons options={
                        [
                            {
                                label: 'Public',
                                value: TourVisibility.PUBLIC,
                                icon: Globe
                            },
                            {
                                label: 'Follower',
                                value: TourVisibility.FOLLOWERS,
                                icon: User
                            },
                            {
                                label: 'Private',
                                value: TourVisibility.PRIVATE,
                                icon: Lock
                            }
                        ]
                    } name={'visibility'} label={'Visibility'} value={visibility}
                                     onValueChange={(value: string) => setVisibility(value)}
                    />
                    <Button variant={'error'} onClick={handleChangeVisibility} disabled={visibility == tour.visibility}>
                        Change Visibility
                    </Button>
                </div>

            </div>
        </div>
    );
}

export default TourDangerSettings;