"use client";

import React, { useCallback, useEffect, useState} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {GeoJSON} from "geojson";


export interface MapProps {
    geometries: GeoJSON[];
    lat: number;
    lon: number;
    zoom?: number;
    markers?: { lat: number, lon: number, icon: React.ReactNode }[];
}

const MapInput = ({geometries, lat, lon, zoom = 5, markers}: MapProps) => {
    const [map, setMap] = useState<null | L.Map>(null);
    const [isFirstRender, setIsFirstRender] = useState(true);

    const createMarker = useCallback((lat: number, lon: number) => {
            if (!map) return;
            const icon = L.divIcon({
                html: `<div class="text-black"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>`,
                className: 'custom-pin',
                iconSize: [24, 24],
                iconAnchor: [12, 24],
            });

             L.marker([lat, lon], {icon}).addTo(map);
    }, [map]);

    const createRoute = useCallback((geoJson: GeoJSON) => {
        if (!map) return;
        L.geoJSON(geoJson, {
            style: {
                color: 'blue',
                weight: 5,
                opacity: 0.65,
            },
        }).addTo(map);
    }, [map]);
    
    
    useEffect(() => {
        const loadScriptsAndInitialize = async () => {
            try {
                const streets = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://carto.com/">carto.com</a> contributors',
                });

                const mapInstance = L.map('map', {
                    center: [lat, lon],
                    zoom: zoom,
                    scrollWheelZoom: true,
                    layers: [streets],
                    zoomControl: true,
                });

                setMap(mapInstance);

                // Add a click listener to update the marker position
                // mapInstance.on('click', (e) => {
                //     updateMarker(e.latlng.lat, e.latlng.lng);
                //    
                // });

                return () => mapInstance.remove();
            } catch {
                // console.error('Failed to initialize map:', error);
            }
        };
            

        loadScriptsAndInitialize().then(() => {
            if (map && isFirstRender) {
                setIsFirstRender(false);
                map.panTo([lat, lon]);
                markers?.map(marker => {
                    createMarker(marker.lat, marker.lon);
                });
                geometries.map(geoJson => {
                    createRoute(geoJson);
                });
            }
        });
    }, [lat, lon, zoom, map, isFirstRender, markers, createMarker, geometries, createRoute]);

    return (
        <div className="relative w-full h-full">
            <div id="map" className="w-full h-full z-0"/>
        </div>
    );
};

export default MapInput;
