"use client";
import { Database } from "@/database.types";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import YearForm from "./year-form";

type TermRecord = Database["public"]["Tables"]["terms"]["Row"];

interface YearFormControllerProps extends React.ComponentPropsWithoutRef<"div"> {
    yearId?: number | null;
    mode: "edit" | "new";
    renderInPortal?: boolean;
    children: React.ReactNode;
    destination?: string;
}

export default function YearFormController({
    mode,
    yearId,
    renderInPortal,
    children,
    destination
}: YearFormControllerProps) {

    const supabase = createClient();
    const [yearStart, setYearStart] = useState("");
    const [yearEnd, setYearEnd] = useState("");
    const [terms, setTerms] = useState<TermRecord[]>([])
    const [modifiedTerms, setModifiedTerms] = useState<Set<number>>(new Set());
    const [toggleModal, setToggleModal] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getYear = async () => {
            // TODO: move to /api
            const { data } = await supabase.from("academic_years").select<"year_start, year_end">().eq("id", yearId).single();
            if (data) {
                setYearStart(data.year_start)
                setYearEnd(data.year_end);
            }
        }
        if (mode === "edit" && yearId) getYear();
    }, [supabase, yearId, mode])

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

    const yearForm = <YearForm 
                        mode={mode}
                        yearId={yearId}
                        error={error}
                        setError={setError}
                        yearStart={yearStart}
                        setYearStart={setYearStart}
                        yearEnd={yearEnd}
                        setYearEnd={setYearEnd}
                        terms={terms}
                        setTerms={setTerms}
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
                        <div onClick={() => setToggleModal(false)} className="fixed min-h-screen h-full w-full  bg-gray-500/75" />
                    </div>
                )
            )}
        </div>
    )
}