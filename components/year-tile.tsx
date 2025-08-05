import { cn, formatDate } from "@/lib/utils";
import React from "react";

export interface YearTileProps
    extends React.HTMLAttributes<HTMLDivElement> {
        yearStart: string;
        yearEnd: string;
        onClick: () => void;
    }

const YearTile = React.forwardRef<HTMLDivElement, YearTileProps>(
    ({ className, yearStart, yearEnd, onClick }, ref) => {
        const shortStart = formatDate(yearStart, { year: "numeric" });
        const shortEnd = formatDate(yearEnd, { year: "numeric" });
        const formattedStart = formatDate(yearStart, { month: "short", day: "numeric", year: "numeric" })
        const formattedEnd = formatDate(yearEnd, { month: "short", day: "numeric", year: "numeric" })
        return (
            <div ref={ref} onClick={onClick} className={cn("flex flex-col py-4 px-2 w-full h-16 hover:bg-blue-500 hover:cursor-pointer", className)}>
                <span>{shortStart} {shortStart === shortEnd ? "" : `- ${shortEnd}`}</span>
                <span className="text-sm">{formattedStart} - {formattedEnd}</span>
            </div>
        )
    });
YearTile.displayName = "YearTile";

export { YearTile }