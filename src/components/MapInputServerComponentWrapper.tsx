"use client";

import dynamic from 'next/dynamic';
import React from 'react';
import {MapProps} from "@/components/mapInput";

// Dynamically import MapInput with SSR disabled
const DynamicMapInput = dynamic(() => import('@/components/mapInput'), {ssr: false});

export default function MapInputServerComponentWrapper({ lat, lon, zoom, onChange }: MapProps) {
    return (
        <div className="w-full h-full">
            <DynamicMapInput lat={lat} lon={lon} zoom={zoom} onChange={onChange} />
        </div>
    );
}
