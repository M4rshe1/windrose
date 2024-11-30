import {Bike, Bus, CableCar, Car, Plane, Ship, Train} from "lucide-react";
import {IconMotorbike, IconSpeedboat, IconWalk} from "@tabler/icons-react";
import React from "react";

interface Vehicle {
    label: string,
    value: string,
    icon: React.ReactNode | null
}

export const vehicles: Vehicle[] = [
    {
        label: 'Car',
        value: 'CAR',
        icon: <Car size={20}/>
    },
    {
        label: 'Motorcycle',
        value: 'MOTORCYCLE',
        icon: <IconMotorbike size={20}/>
    },
    {
        label: 'Bicycle',
        value: 'BICYCLE',
        icon: <Bike size={20}/>
    },
    {
        label: 'Bus',
        value: 'BUS',
        icon: <Bus size={20}/>
    },
    {
        label: 'Train',
        value: 'TRAIN',
        icon: <Train size={20}/>
    },
    {
        label: 'Plane',
        value: 'PLANE',
        icon: <Plane size={20}/>
    },
    {
        label: 'Boat',
        value: 'BOAT',
        icon: <IconSpeedboat size={20}/>
    },
    {
        label: 'Walking',
        value: 'WALKING',
        icon: <IconWalk size={20}/>
    },
    {
        label: 'Ferry',
        value: 'FERRY',
        icon: <Ship size={20}/>
    },
    {
        label: 'Other',
        value: 'OTHER',
        icon: null
    },
    {
        label: 'Cable Car',
        value: 'CABLE_CAR',
        icon: <CableCar size={20}/>
    }
];