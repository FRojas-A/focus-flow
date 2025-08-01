"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

export default function Nav() {
    const pathname = usePathname();
    const hideOnPath = ["/auth"];
    const shouldHide = pathname === "/" || hideOnPath.some(path => pathname.startsWith(path));
    if (shouldHide) return null;

    return (
        <div className="flex flex-col justify-between h-screen w-16 top-0 sticky">
            <div>
                <div id="logo" className="size-16">LOGO</div>
                <div className="flex flex-col pt-3">
                    <div className="size-16">
                        <Link href={"/dashboard"}>Dashboard</Link>
                    </div>
                    <div className="size-16">
                        <Link href={"/tasks"} >Tasks</Link>
                    </div>
                    <div className="size-16">
                        <Link href={"/exams"} >Exams</Link>
                    </div>
                    <div className="size-16">
                        <Link href={"/schedule"} >Schedule</Link>
                    </div>
                    <div className="size-16">
                        <Link href={"/search"}>Search</Link>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center pb-3">
                <div className="size-16 p-2">PROFILE PIC</div>
                <div className="px-2 w-fit">Frank</div>
            </div>
        </div>
    )
}