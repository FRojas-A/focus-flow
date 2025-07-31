import * as React from "react";
import { Tile } from "./ui/tile";

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
    <Tile ref={ref} tileColor={tileColor} {...props} className={className}>
        <div className="flex flex-col justify-center w-auto">
            <div className="text-xl text-black ">{taskName}</div>
            <div className="text-sm text-slate-600">{subject}</div>
        </div>
        <div className="flex flex-col justify-center items-end w-fit h-full">
            <div className="text-sm text-black">{dueDate}</div>
            <div className="text-sm text-slate-600">{progress}%</div>
        </div>
    </Tile>
    ));

TaskTile.displayName = "TaskTile";

export { TaskTile }