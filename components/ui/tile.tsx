import { cn } from "@/lib/utils";
import * as React from "react";

export interface TileProps
    extends React.HTMLAttributes<HTMLDivElement> {
        tileColor: string;
    }

const Tile = React.forwardRef<HTMLDivElement, TileProps>(
    ({ className, tileColor, ...props }, ref) => (
    <div 
        ref={ref} 
        className={cn("flex w-auto h-16 bg-white shadow-md m-4", className)}
    >
        <div className="flex justify-between w-full p-2 border-l-4" style={{ borderLeftColor: tileColor }} {...props} />
    </div>
));
Tile.displayName = "Tile";

export { Tile };