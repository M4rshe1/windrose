"use client";

import React, {ChangeEvent, KeyboardEvent, useCallback, useEffect, useRef, useState} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {Search} from 'lucide-react';
import {locationIQAction} from "@/actions/locationIQAction";
import IconInput from "@/components/iconInput";
import {LocationIQResponse} from "@/lib/locationIQ";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

export interface MapProps {
    lat: number;
    lon: number;
    zoom?: number;
    onChange?: (location: LocationIQResponse) => void;
}

const MapInput = ({lat, lon, zoom = 5, onChange}: MapProps) => {
    const [map, setMap] = useState<null | L.Map>(null);
    const [marker, setMarker] = useState<L.Marker | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [autocompleteResults, setAutocompleteResults] = useState<LocationIQResponse[]>([]);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const autocompleteRef = useRef<HTMLDivElement | null>(null);
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [unsavedChanges, setUnsavedChanges] = useState(false);

    const updateMarker = useCallback(
        (newLat: number, newLon: number) => {
            if (!map) return;
            if (marker) {
                marker.remove();
            }

            const icon = L.divIcon({
                html: `<div class="text-black"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>`,
                className: 'custom-pin',
                iconSize: [24, 24],
                iconAnchor: [12, 24],
            });

            const newMarker = L.marker([newLat, newLon], {draggable: true, icon}).addTo(map);
            newMarker.on('dragend', () => {
                setUnsavedChanges(true);
            });

            setMarker(newMarker);
            map.panTo([newLat, newLon]);
        },
        [map, marker]
    );

    useEffect(() => {
        const loadScriptsAndInitialize = async () => {
            try {
                const streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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
                updateMarker(lat, lon);
            }
        });
    }, [lat, lon, zoom, updateMarker, map, isFirstRender]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (!searchQuery.trim()) return;
            try {
                const data = await locationIQAction('autocomplete', {query: searchQuery});
                if (!data?.error) setAutocompleteResults(data);
            } catch {
            }
        }, 200);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    useEffect(() => {
        if (autocompleteRef.current && focusedIndex >= 0) {
            const focusedElement = autocompleteRef.current.children[focusedIndex] as HTMLElement;
            if (focusedElement) {
                focusedElement.scrollIntoView({block: 'nearest', behavior: 'smooth'});
            }
        }
    }, [focusedIndex]);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setFocusedIndex((prevIndex) => (prevIndex + 1) % autocompleteResults.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setFocusedIndex((prevIndex) => (prevIndex - 1 + autocompleteResults.length) % autocompleteResults.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (focusedIndex >= 0 && focusedIndex < autocompleteResults.length) {
                const selectedResult = autocompleteResults[focusedIndex];
                setSearchQuery('');
                setAutocompleteResults([]);
                updateMarker(Number(selectedResult.lat), Number(selectedResult.lon));
            }
        }
    };

    async function saveLocation(location?: LocationIQResponse) {
        if (location) {
            onChange?.(location);
            return
        }

        if (!marker) return;
        const latlng = marker.getLatLng();
        const data = await locationIQAction('reverse', {lat: latlng.lat, lon: latlng.lng});
        if (!data?.error) {
            setUnsavedChanges(false);
            onChange?.(data);
        }
    }

    return (
        <div className="relative w-full h-full">
            <div id="map" className="w-full h-full z-0"/>
            <Button
                onClick={() => saveLocation()}
                variant={"default"}
                className={cn("absolute bottom-4 right-4 flex gap-2", unsavedChanges ? "opacity-100" : "pointer-events-none opacity-0")}>
                Save
            </Button>
            <div className="absolute top-4 right-4 flex gap-2">
                <div className="flex gap-2 flex-col">
                    <IconInput
                        type="text"
                        value={searchQuery}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setSearchQuery(e.target.value);
                            setFocusedIndex(-1);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="Search location..."
                        className={"bg-base-100"}
                        Icon={Search}
                    />
                </div>
            </div>
            {autocompleteResults.length > 0 && (
                <div className={"h-full"}>
                    <div
                        ref={autocompleteRef}
                        className="absolute top-14 right-4 w-full bg-base-100 border-2 border-neutral rounded-md sc p-1 space-y-1 h-full max-w-xs overflow-y-auto max-h-64"
                    >
                        {autocompleteResults.map((result: LocationIQResponse, index) => (
                            <div
                                key={index}
                                className={`p-2 hover:bg-base-200 border rounded-md border-neutral cursor-pointer ${
                                    index === focusedIndex ? 'border-primary' : ''
                                }`}
                                onMouseEnter={() => setFocusedIndex(index)}
                                onClick={async () => {
                                    setSearchQuery('');
                                    setAutocompleteResults([]);
                                    updateMarker(Number(result.lat), Number(result.lon));
                                    await saveLocation(result);
                                }}
                            >
                                <p className="text-base-content font-semibold text-sm">{result.display_place}</p>
                                <p className="text-xs text-base-content">{result.display_address}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MapInput;
