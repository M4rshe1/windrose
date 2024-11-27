import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function stringToDashCase(str: string | null | undefined | number): string {
  if (str === null || str === undefined) {
    return "";
  }
  return str.toString().replace(/[^a-zA-Z0-9 -]/g, "").trim().replace(/ +/g, "-").toLowerCase();}

export function getMinioLinkFromKey(key: string): string {
  return `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${process.env.MINIO_BUCKET}/${key}`;
}