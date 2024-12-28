import React from "react";
import {cn} from "@/lib/utils";

const PulsatingCircle = ({background = "", size = 0, ...props}) => {
    const sizes = [
        {
            circle: "h-2",
            pulse: "h-3"
        },
        {
            circle: "h-4",
            pulse: "h-5"
        },
        {
            circle: "h-6",
            pulse: "h-7"
        },
        {
            circle: "h-8",
            pulse: "h-9"
        },
        {
            circle: "h-10",
            pulse: "h-11"
        },
        {
            circle: "h-12",
            pulse: "h-13"
        },
        {
            circle: "h-14",
            pulse: "h-15"
        },
        {
            circle: "h-16",
            pulse: "h-17"
        },
        {
            circle: "h-18",
            pulse: "h-19"
        },
        {
            circle: "h-20",
            pulse: "h-21"
        },
    ]
    
    
    return (
        <div className="flex items-center justify-center m-2">
            <div className="relative flex items-center justify-center">
                <div
                    className={cn("absolute aspect-square rounded-full animate-ping", background, sizes[size].pulse)}
                ></div>
                <div
                    className={cn("aspect-square rounded-full", background, sizes[size].circle)}
                    {...props}
                ></div>
            </div>
        </div>
    );
};

export default PulsatingCircle;
