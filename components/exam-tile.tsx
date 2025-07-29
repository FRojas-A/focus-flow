import { cn } from "@/lib/utils";
import * as React from "react";
import { Tile } from "./ui/tile";

interface ExamTile {
    examName: string;
    examDay: string;
    duration: string;
    subject: string,
    tileColor: string;
}

const ExamTile = React.forwardRef<
    HTMLDivElement, 
    ExamTile &
    React.HTMLAttributes<HTMLDivElement>
> (({ className, examName, examDay, duration, tileColor }, ref) => (
    <Tile ref={ref} className={cn("", className)} tileColor={tileColor} >
        <div className="flex flex-col justify-center w-auto">
            <div className="text-lg font-semibold text-black">{examName}</div>
            <div className="text-sm text-slate-600 font-medium">{examDay}</div>
        </div>
        <div className="flex flex-col justify-center items-end w-fit h-full">
            <div className="text-sm font-medium text-black">{duration}</div>
        </div>
    </Tile>
))
ExamTile.displayName = "ExamTile";

export { ExamTile }