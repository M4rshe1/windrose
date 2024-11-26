import React from "react";

const PulsatingCircle = ({ color = "#3b82f6" }) => {
    return (
        <div className="flex items-center justify-center m-2">
            <div className="relative flex items-center justify-center">
                <div
                    className="absolute h-3 w-3 rounded-full animate-ping"
                    style={{ backgroundColor: color }}
                ></div>
                <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: color }}
                ></div>
            </div>
        </div>
    );
};

export default PulsatingCircle;
