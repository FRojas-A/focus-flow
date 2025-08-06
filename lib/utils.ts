import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY;

export const parseISODate = (dateString: string) => {
    if (!dateString) return ""
    return new Date(dateString).toISOString().substring(0, 10);
}

export const parseLocalDate = (dateString: string) => {
    const [ year, month, day] = dateString.split("-");
    return new Date(Number(year), Number(month) - 1, Number(day));
}

export const formatDate = (dateString: string, options?: Intl.DateTimeFormatOptions): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options)
}