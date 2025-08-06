import React, { useMemo } from "react";
import { cn, formatDate } from "@/lib/utils";
import { useYear } from "./schedule/year-context";
export interface YearTileProps
    extends React.HTMLAttributes<HTMLDivElement> {
        yearStart: string;
        yearEnd: string;
        onClick: () => void;
    }

const YearTile = React.forwardRef<HTMLDivElement, YearTileProps>(
    ({ className, yearStart, yearEnd, onClick }, ref) => {
        const { setYear } = useYear();
        const shortStart = useMemo(() => formatDate(yearStart, { year: "numeric" }), [yearStart]);
        const shortEnd = useMemo(() => formatDate(yearEnd, { year: "numeric" }), [yearEnd]);
        const formattedStart = useMemo(() => formatDate(yearStart, { month: "short", day: "numeric", year: "numeric" }), [yearStart]);
        const formattedEnd = useMemo(() => formatDate(yearEnd, { month: "short", day: "numeric", year: "numeric" }), [yearEnd]);
        const year = useMemo(() => {
            return `${shortStart} ${shortStart === shortEnd ? "" : `- ${shortEnd}`}`;
        }, [shortStart, shortEnd]);
        
        return (
            <div ref={ref} onClick={() => {
                onClick();
                setYear(year)
            }} className={cn("flex flex-col py-4 px-2 w-full h-16 hover:bg-blue-500 hover:cursor-pointer", className)}>
                <span>{year}</span>
                <span className="text-sm">{formattedStart} - {formattedEnd}</span>
            </div>
        )
    });
YearTile.displayName = "YearTile";

export { YearTile }