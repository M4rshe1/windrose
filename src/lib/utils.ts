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

export function distanceReadable(meters: number, metric: boolean): string {
    if (meters < 1000) {
        return `${metric ? meters : meters * 3.28084} ${metric ? "m" : "ft"}`;
    }
    return `${(metric ? meters / 1000 : meters / 1609.34).toFixed(2)}${metric ? "km" : "mi"}`;
}

export function timeReadable(seconds: number, accuracy: number = 2): string {
    if (seconds < 60) {
        return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes < 60) {
        return accuracy > 1 ? `${minutes}m` : `${minutes}m ${remainingSeconds}s`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours < 24) {
        return accuracy > 2 ? `${hours}h` : `${hours}h ${remainingMinutes}m ${remainingSeconds}s`;
    }

    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return accuracy > 3 ? `${days}d` : `${days}d ${remainingHours}h ${remainingMinutes}m ${remainingSeconds}s`;
}