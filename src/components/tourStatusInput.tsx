"use client";

import SelectWithIcons from "@/components/selectWithIcons";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {TourStatus} from "@prisma/client";
import {Goal, NotebookPen, Waypoints} from "lucide-react";
import {confirmModal} from "@/components/confirmModal";
import {updateTourStatusAction} from "@/actions/updateTourStatusAction";
import {useState} from "react";
import {Label} from "@/components/ui/label";
import PulsatingCircle from "@/components/PulsatingCircle";

const TourStatusInput = ({tour}: {
    tour: any,
}) => {
    const [status, setStatus] = useState(tour.status);
    const options = [
        {
            label: 'Not Started', value: TourStatus.PLANNING, icon: NotebookPen

        },
        {
            label: 'On Tour', value: TourStatus.ON_TOUR, icon: Waypoints
        },
        {
            label: 'Finished', value: TourStatus.FINISHED, icon: Goal
        },
    ]

    async function handleStatusSave() {
        if (await confirmModal({
            title: 'Change Tour Status',
            text: `This could also change the status of all the steps in the tour. Are you sure you want to continue?`,
            buttonTrue: "Confirm",
            buttonFalse: "Cancel"
        })) {
            await updateTourStatusAction(tour.id, status);
        }
    }


    return (
        <div className="flex gap-2 flex-col">
            <Label htmlFor={'status'} className={cn('flex items-center')}>Status
                <PulsatingCircle color={status === TourStatus.ON_TOUR ? '#ffc400' : status === TourStatus.FINISHED ? '#12c924' : '#1b68e3'}/>
            </Label>
            <div className={cn('flex items-center gap-2')}>
            <SelectWithIcons options={options} className={cn('w-48')} name={'status'} defaultValue={status}
                             onValueChange={(value: string) => setStatus(value as TourStatus)} label={"Status"}/>
            <Button className={cn('w-24 text-primary-content')} onClick={handleStatusSave}
                    disabled={status === tour.status}
            >
                Save
            </Button>
            </div>
        </div>
    )
}

export default TourStatusInput;