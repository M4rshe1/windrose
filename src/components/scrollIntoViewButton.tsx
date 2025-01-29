"use client";

import React from "react";
import {redirect} from "next/navigation";

const ScrollIntoViewButton = ({children, link, ...props}: { children: React.ReactNode, [key: string]: unknown, link: string | null | undefined}) => {
    return (
        <div
            {...props}
            onClick={() => {
                if (!link) return
                if (link.startsWith('#')) {
                    document.querySelector(link)?.scrollIntoView({behavior: 'smooth'})
                    return;
                }
                redirect(link)
            }}
        >
            {children}
        </div>
    );
}

export default ScrollIntoViewButton;
