import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps {
    count?: number;
    className?: string;
    title?: boolean;
    repeatCount?: number;
    repeatClassName?: string;
}

const SkeletonItem = () => {
    return (
        <div className="h-3 w-full animate-pulse rounded bg-gray-400"></div>
    )
}

const SkeletonTitle = () => {
    return (
        <div className="h-5 w-32 animate-pulse rounded bg-gray-400"></div>
    )
}

export default function Skeleton({ count = 1, className, title = false, repeatCount = 0, repeatClassName = "", ...rest }: SkeletonProps) {
    return (
        <div className={cn("flex flex-col gap-3 w-full", className)}>
            {repeatCount > 0 ? Array.from({ length: repeatCount }).map((_, index) => {
                return (
                    <div key={index} className={cn("flex flex-col gap-2", repeatClassName)}>
                        {title && <SkeletonTitle />}
                        {Array.from({ length: count }).map((_, index) => <SkeletonItem key={index} /> )}
                    </div>
                )
            }) : Array.from({ length: count }).map((_, index) => {
                return (
                    <>
                        {title && <SkeletonTitle />}
                        {Array.from({ length: count }).map((_, index) => <SkeletonItem key={index} /> )}
                    </>
                )
            })}
        </div>
    )
}