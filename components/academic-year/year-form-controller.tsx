"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import YearForm from "./year-form";
import { useYear } from "../schedule/year-context";
interface YearFormControllerProps extends React.ComponentPropsWithoutRef<"div"> {
    mode: "edit" | "new";
    renderInPortal?: boolean;
    children: React.ReactNode;
    destination?: string;
}

export default function YearFormController({
    mode,
    renderInPortal,
    children,
    destination
}: YearFormControllerProps) {

    const { yearId, terms, yearStart, yearEnd, setTerms, setTermId, setTermStart, setTermEnd } = useYear();
    const [modifiedTerms, setModifiedTerms] = useState<Set<number>>(new Set());
    const [toggleModal, setToggleModal] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (success) setToggleModal(false);
        setSuccess(false);
    }, [success])

    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/academic-years", {
                method: "POST",
                body: JSON.stringify({
                    mode,
                    yearId,
                    yearStart,
                    yearEnd,
                    terms,
                    modifiedTerms: Array.from(modifiedTerms)
                }),
                headers: { "Content-Type": "application/json"}
            })

            const result = await res.json();
            if (!result.success) throw new Error(result.error);
            setSuccess(true);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Unknown error. Could not save academic year.")
            }
        } finally {
            setIsLoading(false);
        }
    }

    const closeYearForm = () => {
        setToggleModal(false);
        setTerms([]);
        setTermId(null);
        setTermStart("");
        setTermEnd("");
    }

    const yearForm = <YearForm 
                        mode={mode}
                        error={error}
                        setError={setError}
                        setModifiedTerms={setModifiedTerms}
                        handleSubmit={handleSubmit}
                        setToggleModal={setToggleModal}
                        isLoading={isLoading}
                    />

    return (
        <div>
            {/* on cancel/click outside modal ask user if they want to discard changes? */}
            <div onClick={() => setToggleModal(!toggleModal)}>{children}</div>
            {toggleModal && (
                renderInPortal && destination ? (
                    createPortal(
                    yearForm, 
                    document.getElementById(destination!)!
                )
                ) : (
                    <div className="z-10 inset-0 fixed flex justify-center items-center">
                        {yearForm}
                        <div onClick={closeYearForm} className="fixed min-h-screen h-full w-full  bg-gray-500/75" />
                    </div>
                )
            )}
        </div>
    )
}