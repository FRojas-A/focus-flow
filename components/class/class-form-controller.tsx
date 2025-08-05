"use client";
import { useState } from "react";
import ClassForm from "./class-form";

export default function ClassFormController({ children }: {children: React.ReactNode } ) {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            {/* set onclick to child instead of on container */}
            <div onClick={() => setIsOpen(!isOpen)}>
                {children}
            </div>
            {isOpen && <ClassForm />}
            {/* overlay */}
        </div>
    )
}