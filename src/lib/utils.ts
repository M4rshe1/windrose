import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function stringToDashCase(str: string): string {
  return str.replace(/[^a-zA-Z0-9 ]/g, "").replace(/ +/g, "-");
}