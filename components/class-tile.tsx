import { cn } from "@/lib/utils";
import * as React from "react";
import { Tile } from "./ui/tile";

interface ClassTile {
    startTime: string;
    endTime: string;
    classDays: string[];
    subject: string,
    tileColor: string;
}

const ClassTile = React.forwardRef<
    HTMLDivElement, 
    ClassTile &
    React.HTMLAttributes<HTMLDivElement>
> (({ className, startTime, endTime, classDays, tileColor, subject }, ref) => (
    <Tile ref={ref} className={cn("", className)} tileColor={tileColor} >
        <div className="flex flex-col justify-center w-auto">
            <div className="text-lg font-semibold text-black">{subject}</div>
            <div className="text-sm text-slate-600 font-medium">{startTime}{"-"}{endTime}{" "}{classDays.join(", ")}</div>
        </div>
    </Tile>
))
ClassTile.displayName = "ClassTile";

export { ClassTile }