import {Bike, Bus, CableCar, Car, LucideIcon, Plane, Ship, Train} from "lucide-react";
import {IconMotorbike, IconSpeedboat, IconWalk, TablerIcon} from "@tabler/icons-react";

interface Vehicle {
    label: string,
    value: string,
    icon: TablerIcon | LucideIcon | null
}

export const VEHICLES: Vehicle[] = [
    {
        label: 'Car',
        value: 'CAR',
        icon: Car
    },
    {
        label: 'Motorcycle',
        value: 'MOTORCYCLE',
        icon: IconMotorbike
    },
    {
        label: 'Bicycle',
        value: 'BICYCLE',
        icon: Bike
    },
    {
        label: 'Bus',
        value: 'BUS',
        icon: Bus
    },
    {
        label: 'Train',
        value: 'TRAIN',
        icon: Train
    },
    {
        label: 'Plane',
        value: 'PLANE',
        icon: Plane
    },
    {
        label: 'Boat',
        value: 'BOAT',
        icon: IconSpeedboat
    },
    {
        label: 'Walking',
        value: 'WALKING',
        icon: IconWalk
    },
    {
        label: 'Ferry',
        value: 'FERRY',
        icon: Ship
    },
    {
        label: 'Other',
        value: 'OTHER',
        icon: null
    },
    {
        label: 'Cable Car',
        value: 'CABLE_CAR',
        icon: CableCar
    }
];