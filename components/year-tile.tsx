"use client";
import React, { useMemo } from "react";
import { cn, formatDate, parseISODate, parseLocalDate } from "@/lib/utils";
import { useSchedule } from "./schedule/schedule-context";
import { Database } from "@/database.types";

type YearRecord = Database["public"]["Tables"]["academic_years"]["Row"];

export interface YearTileProps
    extends React.HTMLAttributes<HTMLDivElement> {
        yearStart: string;
        yearEnd: string;
        year: YearRecord;
    }

const YearTile = React.forwardRef<HTMLDivElement, YearTileProps>(
    ({ className, yearStart, yearEnd, year }, ref) => {
        const { setYear, yearId, setYearId, setYearStart, setYearEnd } = useSchedule();
        const shortStart = useMemo(() => formatDate(yearStart, { year: "numeric" }), [yearStart]);
        const shortEnd = useMemo(() => formatDate(yearEnd, { year: "numeric" }), [yearEnd]);
        const formattedStart = useMemo(() => formatDate(yearStart, { month: "short", day: "numeric", year: "numeric" }), [yearStart]);
        const formattedEnd = useMemo(() => formatDate(yearEnd, { month: "short", day: "numeric", year: "numeric" }), [yearEnd]);
        const yearString = useMemo(() => {
            return `${shortStart} ${shortStart === shortEnd ? "" : `- ${shortEnd}`}`;
        }, [shortStart, shortEnd]);
        
        return (
            <div 
                ref={ref} 
                onClick={() => {
                    setYearId(year.id);
                    setYearStart(year.year_start);
                    setYearEnd(year.year_end);
                    setYear(yearString)
                }} 
                className={cn(`flex flex-col py-4 px-2 w-full h-16 hover:bg-blue-500 hover:cursor-pointer ${yearId === year.id ? "bg-blue-500" : ""}`, className)}
            >
                <span>{yearString}</span>
                <span className="text-sm">{formattedStart} - {formattedEnd}</span>
            </div>
        )
    });
YearTile.displayName = "YearTile";

export { YearTile }