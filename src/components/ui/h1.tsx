import React from "react";
import {cn} from "@/lib/utils";

const H1 = ({children, className, ...props}: {
    children: React.ReactNode,
    className?: string,
    [key: string]: unknown
}) => {
    return <h1
        className={cn("text-3xl pb-2 px-2 my-4 font-bold border-b-2 border-neutral", className)} {...props}>{children}</h1>;
}

export default H1;