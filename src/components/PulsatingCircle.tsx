import React from "react";
import {cn} from "@/lib/utils";

const PulsatingCircle = ({background = "", ...props}) => {
    return (
        <div className="flex items-center justify-center m-2">
            <div className="relative flex items-center justify-center">
                <div
                    className={cn("absolute h-3 w-3 rounded-full animate-ping", background)}
                    {...props}
                ></div>
                <div
                    className={cn("h-2 w-2 rounded-full", background)}
                    {...props}
                ></div>
            </div>
        </div>
    );
};

export default PulsatingCircle;
