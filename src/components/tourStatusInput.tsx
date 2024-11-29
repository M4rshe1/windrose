"use client";

import SelectWithIcons from "@/components/selectWithIcons";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {TourStatus} from "@prisma/client";
import {Goal, NotebookPen, Waypoints} from "lucide-react";
import {confirmModal} from "@/components/confirmModal";
import {updateTourStatusAction} from "@/actions/updateTourStatusAction";

const TourStatusInput = ({tour}: {
    tour: any,
}) => {
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

    async function handleStatusSave(formData: FormData) {
        const status = formData.get('status') as string;
        console.log(formData)
        if (await confirmModal({
            title: 'Change Tour Status',
            text: `This will also change the status of all the sections in this tour. Are you sure you want to continue?`,
            buttonTrue: "Confirm",
            buttonFalse: "Cancel"
        })) {
            await updateTourStatusAction(tour.id, status);
        }
    }


    return (
        <form action={handleStatusSave} className="flex gap-2">
            <SelectWithIcons options={options} className={cn('w-48')} name={'status'} defaultValue={tour.status} label={"Status"}/>
            <Button className={cn('w-24 text-primary-content')} type={'submit'}>
                Save
            </Button>
        </form>
    )
}

export default TourStatusInput;