"use client";

import dynamic from 'next/dynamic';
import React from 'react';
import {MapProps} from "@/components/routeMap";

const DynamicMapInput = dynamic(() => import('@/components/routeMap'), {ssr: false});

export default function RouteMapServerComponentWrapper(props: MapProps) {
    return (
        <div className="w-full h-full">
            <DynamicMapInput {...props} />
        </div>
    );
}
