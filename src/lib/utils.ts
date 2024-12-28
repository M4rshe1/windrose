import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function stringToDashCase(str: string | null | undefined | number): string {
    if (str === null || str === undefined) {
        return "";
    }
    return str.toString().replace(/[^a-zA-Z0-9 -]/g, "").trim().replace(/ +/g, "-").toLowerCase();
}

export function getMinioLinkFromKey(key: string): string {
    return `http://${process.env.NEXT_PUBLIC_MINIO_ENDPOINT}:${process.env.NEXT_PUBLIC_MINIO_PORT}/${process.env.NEXT_PUBLIC_MINIO_BUCKET}/${key}`;
}

export function hideFullToken(token: string): string {
    return token.slice(0, 6) + " *** " + token.slice(-6);
}

export function distanceReadable(meters: number, metric: boolean, round: number = 2): string {
    if (meters < 1000) {
        return `${metric ? meters : meters * 3.28084} ${metric ? "m" : "ft"}`;
    }
    return `${(metric ? meters / 1000 : meters / 1609.34).toFixed(round)}${metric ? "km" : "mi"}`;
}

interface TimeReadableOptions {
    days?: "total";
    hours?: "rest" | "total";
    minutes?: "rest" | "total";
    seconds?: "rest" | "total";
    label?: "none" | "short" | "long";
    type?: "seconds" | "minutes" | "hours" | "days";
    includeZero?: boolean;
}

export function timeReadable(input: number, outputFormat?: TimeReadableOptions): string {
    if (!outputFormat?.minutes || !outputFormat?.hours || !outputFormat?.days || !outputFormat?.seconds) {
        outputFormat = {
            days: "total",
            hours: "rest",
            minutes: "rest",
            seconds: "rest",
            label: "short",
            type: "seconds",
            includeZero: false,
            ...outputFormat,
        };
    }

    const format: TimeReadableOptions = {
        label: "short",
        type: "seconds",
        includeZero: false,
        ...outputFormat,
    };

    const seconds =
        format.type === "seconds"
            ? input
            : format.type === "minutes"
                ? input * 60
                : format.type === "hours"
                    ? input * 60 * 60
                    : format.type === "days"
                        ? input * 60 * 60 * 24
                        : 0;

    const days = Math.round(seconds / (60 * 60 * 24));
    const hours = Math.round(seconds / (60 * 60));
    const restHours = Math.round((seconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.round(seconds / 60);
    const restMinutes = Math.round((seconds % (60 * 60)) / 60);
    const restSeconds = Math.round(seconds % 60);

    const labels = {
        seconds: format.label === "short" ? "s" : format.label === "long" ? "seconds" : "",
        minutes: format.label === "short" ? "m" : format.label === "long" ? "minutes" : "",
        hours: format.label === "short" ? "h" : format.label === "long" ? "hours" : "",
        days: format.label === "short" ? "d" : format.label === "long" ? "days" : "",
    };

    const parts: string[] = [];
    Object.entries(format).forEach(([key, value]) => {
        if (value === "total") {
            parts.push(
                key === "seconds" && (seconds > 0 || format.includeZero)
                    ? `${seconds}${labels.seconds}`
                    : key === "minutes" && (minutes > 0 || format.includeZero)
                        ? `${minutes}${labels.minutes}`
                        : key === "hours" && (hours > 0 || format.includeZero)
                            ? `${hours}${labels.hours}`
                            : key === "days" && (days > 0 || format.includeZero)
                                ? `${days}${labels.days}`
                                : ""
            );
        } else if (value === "rest") {
            parts.push(
                key === "seconds" && (restSeconds > 0 || format.includeZero)
                    ? `${restSeconds}${labels.seconds}`
                    : key === "minutes" && (restMinutes > 0 || format.includeZero)
                        ? `${restMinutes}${labels.minutes}`
                        : key === "hours" && (restHours > 0 || format.includeZero)
                            ? `${restHours}${labels.hours}`
                            : ""
            );
        }
    });

    return parts.join(" ");
}

export function gmapsLink(lat: number, lon: number): string {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
}
   