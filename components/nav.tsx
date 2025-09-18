"use client";
import { Aperture, HomeIcon, NotebookText, BookOpen, Calendar1, Search, Settings, CalendarDays } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

export default function Nav() {
    const pathname = usePathname();
    const hideOnPath = ["/auth"];
    const shouldHide = pathname === "/" || hideOnPath.some(path => pathname.startsWith(path));
    if (shouldHide) return null;

    return (
        <div className="flex flex-col justify-between h-screen w-16 top-0 sticky bg-slate-700">
            <div className="overflow-hidden">
                <div id="logo" className="size-16 flex justify-center items-center">
                    <Aperture />
                </div>
                <div className="flex flex-col pt-3 bg-slate-900">
                    <div className="size-16">
                        <Link className="size-16 flex justify-center items-center hover:scale-125 transition-all duration-75" href={"/dashboard"} title="Dashboard">
                            <HomeIcon />
                        </Link>
                    </div>
                    <div className="size-16">
                        <Link className="size-16 flex justify-center items-center hover:scale-125 transition-all duration-75" href={"/calendar"} title="Calendar">
                            <Calendar1 />
                        </Link>
                    </div>
                    <div className="size-16">
                        <Link className="size-16 flex justify-center items-center hover:scale-125 transition-all duration-75" href={"/tasks"} title="Tasks">
                            <NotebookText />
                        </Link>
                    </div>
                    <div className="size-16">
                        <Link className="size-16 flex justify-center items-center hover:scale-125 transition-all duration-75" href={"/exams"} title="Exams">
                            <BookOpen />
                        </Link>
                    </div>
                    <div className="size-16">
                        <Link className="size-16 flex justify-center items-center hover:scale-125 transition-all duration-75" href={"/schedule"} title="Schedule">
                            <CalendarDays />
                        </Link>
                    </div>
                    <div className="size-16">
                        <Link className="size-16 flex justify-center items-center hover:scale-125 transition-all duration-75" href={"/search"} title="Search">
                            <Search />
                        </Link>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center pb-3">
                {/* TODO: turn into page */}
                <div className="size-16 p-2 flex justify-center items-center hover:scale-125 transition-all duration-75" title="Settings"><Settings /></div>
                <div className="px-2 w-fit">Frank</div>
            </div>
        </div>
    )
}