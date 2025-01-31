"use client";

import React, {useCallback, useEffect, useState} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {GeoJSON} from "geojson";


export interface MapProps {
    geometries: GeoJSON[];
    lat: number;
    lon: number;
    zoom?: number;
    markers?: { lat: number, lon: number }[];
}

const MapInput = ({geometries, lat, lon, zoom = 5, markers}: MapProps) => {
    const [map, setMap] = useState<null | L.Map>(null);
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [routeLayer, setRouteLayer] = useState<L.GeoJSON | null>(null);

    const createMarker = useCallback((lat: number, lon: number, index: number) => {
        if (!map) return;
        const icon = L.divIcon({
            html: `<div id="map-${index}" class="text-black relative"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg><div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full text-xs bg-black text-white rounded-full px-1">${index + 1}</div></div>`,
            className: 'custom-pin',
            iconSize: [24, 24],
            iconAnchor: [12, 24],
        });

        const marker = L.marker([lat, lon], {icon}).addTo(map);

        marker.on('click', () => {
            const section = document.getElementById(`section-${index}`);
            if (section) {
                section.scrollIntoView({behavior: 'smooth'});
            }
        });
    }, [map]);

    const createRoute = useCallback((geoJson: GeoJSON) => {
        if (!map) return;
        let layer
        if (routeLayer) {
            layer = routeLayer;
        } else {
            layer = L.geoJSON().addTo(map);
            setRouteLayer(layer);
        }

        layer?.addData(geoJson);
    }, [map, routeLayer]);


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

                return () => mapInstance.remove();
            } catch {
                // console.error('Failed to initialize map:', error);
            }
        };


        loadScriptsAndInitialize().then(() => {
            if (map && isFirstRender) {
                setIsFirstRender(false);
                map.panTo([lat, lon]);
                markers?.map((marker, index) => {
                    createMarker(marker.lat, marker.lon, index);
                });
                geometries.map(geoJson => {
                    createRoute(geoJson);
                });
                if (routeLayer)
                    map.fitBounds(routeLayer?.getBounds());
            }
        });
    }, [lat, lon, zoom, map, isFirstRender, markers, createMarker, geometries, createRoute, routeLayer]);

    return (
        <div className="relative w-full h-full">
            <div id="map" className="w-full h-full z-0"/>
        </div>
    );
};

export default MapInput;
