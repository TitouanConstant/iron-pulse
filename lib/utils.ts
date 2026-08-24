import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateFr(dateStringOrObj: string | Date): string {
  const date = typeof dateStringOrObj === 'string' ? new Date(dateStringOrObj) : dateStringOrObj;
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatTimeFr(dateStringOrObj: string | Date): string {
  const date = typeof dateStringOrObj === 'string' ? new Date(dateStringOrObj) : dateStringOrObj;
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
