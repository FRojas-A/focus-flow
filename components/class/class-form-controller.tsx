"use client";
import { cloneElement, ReactElement, useState } from "react";
import ClassForm from "./class-form";
import { useYear } from "../schedule/year-context";

export default function ClassFormController({ children }: {children: ReactElement<React.ButtonHTMLAttributes<HTMLButtonElement>> } ) {

    const [isOpen, setIsOpen] = useState(false);
    const [modifiedTerms, setModifiedTerms] = useState<Set<number>>(new Set());
    const [error, setError] = useState<string | null>(null);
    const { setTerms, setTermId, setTermStart, setTermEnd } = useYear();
    const isDisabled = children.props.disabled ?? false;

    const trigger = cloneElement(children, {
        onClick: () => {
        if (!isDisabled) setIsOpen(!isOpen);
        },
        "aria-haspopup": "dialog",
    });


    return (
        <div>
            {trigger}
            {isOpen && (
                <div className="z-10 inset-0 fixed flex justify-center items-center">
                    <ClassForm 
                        setIsOpen={setIsOpen} 
                        modifiedTerms={modifiedTerms} 
                        setModifiedTerms={setModifiedTerms} 
                        error={error} 
                        setError={setError} 
                    />
                    <div onClick={() => {
                        setIsOpen(false);
                        setTerms([]);
                        setTermId(null);
                        setTermStart("");
                        setTermEnd("");
                    }} className="fixed min-h-screen h-full w-full  bg-gray-500/75" />
                </div>
            )}
        </div>
    )
}