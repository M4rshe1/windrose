import React from "react";
import {cn} from "@/lib/utils";

const H2 = ({children, className, ...props}: {
    children: React.ReactNode,
    className?: string,
    [key: string]: unknown
}) => {
    return <h2
        className={cn("text-2xl pb-1 px-2 my-3 font-bold border-b-2 border-neutral whitespace-nowrap", className)} {...props}>{children}</h2>;
}

export default H2;