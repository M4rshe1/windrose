'use client'

import {cn} from "@/lib/utils";
import React from "react";

const Form = ({children, className, serverAction}: Readonly<{
    children: React.ReactNode;
    className?: string;
    serverAction?: (formData: FormData) => void;
}>) => {
    return (
        <form
            className={cn(`flex flex-col gap-2 w-full`, className)}
            action={serverAction ?? undefined}
        >
            {children}
        </form>
    );
}

export default Form