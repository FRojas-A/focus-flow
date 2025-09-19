"use client";
import React from "react";
import { cn, formatDate, parseLocalDate } from "@/lib/utils";
import { Database } from "@/database.types";

type YearRecord = Database["public"]["Tables"]["academic_years"]["Row"];

export interface YearTileProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
        year: YearRecord;
        selected?: boolean;
        onSelectYear: (year: YearRecord) => void;
    }

const YearTile = React.forwardRef<HTMLButtonElement, YearTileProps>(
    ({ className, year, selected = false, onSelectYear, ...rest }, ref) => {
        const yearStart = parseLocalDate(year.year_start).toISOString();
        const yearEnd = parseLocalDate(year.year_end).toISOString();
        const shortStart = formatDate(yearStart, { year: "numeric" });
        const shortEnd = formatDate(yearEnd, { year: "numeric" });
        const formattedStart = formatDate(yearStart, { month: "short", day: "numeric", year: "numeric" });
        const formattedEnd = formatDate(yearEnd, { month: "short", day: "numeric", year: "numeric" });
        const yearString = `${shortStart}${shortStart === shortEnd ? "" : ` - ${shortEnd}`}`;

        return (
            <button
                type="button"
                ref={ref}
                onClick={() => onSelectYear(year)}
                aria-pressed={selected}
                data-testid={`year-tile-${year.id}`}
                className={cn(
                    "flex flex-col py-4 px-2 w-full h-16 text-left hover:bg-blue-500 hover:cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
                    selected ? "bg-blue-500" : "",
                    className
                )}
                {...rest}
            >
                <span>{yearString}</span>
                <span className="text-sm">{formattedStart} - {formattedEnd}</span>
            </button>
        );
    }
);
YearTile.displayName = "YearTile";

export { YearTile }