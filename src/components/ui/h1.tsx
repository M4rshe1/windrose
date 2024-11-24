import React from "react";
import {cn} from "@/lib/utils";

const H1 = ({children}: { children: React.ReactNode }) => {
    return <h1 className={cn("text-3xl pb-4 px-2 font-bold border-b-2 border-neutral")}>{children}</h1>;
}

export default H1;