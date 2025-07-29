import * as React from "react";
import { Tile } from "./ui/tile";
import { cn } from "@/lib/utils";

interface TaskProps {
    taskName: string;
    subject: string;
    dueDate: string;
    progress: number;
    tileColor: string
}

const TaskTile = React.forwardRef<
    HTMLDivElement,
    TaskProps &
    React.HTMLAttributes<HTMLDivElement>
>(({ className, taskName, subject, dueDate, progress, tileColor, ...props }, ref) => (
    <Tile ref={ref} tileColor={tileColor} {...props}>
        <div className={cn("flex flex-col justify-center w-auto", className)}>
            <div className="text-lg text-black font-semibold">{taskName}</div>
            <div className="text-sm text-slate-600 font-medium">{subject}</div>
        </div>
        <div className="flex flex-col justify-center items-end w-fit h-full">
            <div className="text-sm text-black font-semibold">{dueDate}</div>
            <div className="text-sm text-slate-600 font-medium">{progress}%</div>
        </div>
    </Tile>
    ));

TaskTile.displayName = "TaskTile";

export { TaskTile }