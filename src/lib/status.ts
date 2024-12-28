import {Goal, MapPinCheck, MapPinPlus, MapPinX, NotebookPen, Waypoints} from "lucide-react";
import {TourSectionStatus, TourStatus} from "@prisma/client";

export const TOUR_STATUS = [
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

export const SECTION_STATUS = [
    {
        label: 'Planned', value: TourSectionStatus.PLANNED, icon: MapPinPlus
    },
    {
        label: 'Skipped', value: TourSectionStatus.SKIPPED, icon: MapPinX
    },
    {
        label: 'Visited', value: TourSectionStatus.VISITED, icon: MapPinCheck
    },
]