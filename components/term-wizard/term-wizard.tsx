"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import TermTile from "./term-tile";
import TermCreator from "./term-creator";
import { useSchedule } from "../schedule/schedule-context";
import Skeleton from "../ui/skeleton";

type Term = {
    id?: number;
    name: string;
    term_start: string;
    term_end: string;
    academic_year_id?: number;
}

interface TermWizardProps extends React.ComponentPropsWithoutRef<"div"> {
    mode: "edit" | "new",
    terms: Term[];
    setTerms: React.Dispatch<React.SetStateAction<Term[]>>;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
    setModifiedTerms: React.Dispatch<React.SetStateAction<Set<number>>>;
    yearStart: string;
    yearEnd: string;
}

export default function TermWizard({ className, mode, terms, setTerms, setError, setModifiedTerms, yearStart, yearEnd }: TermWizardProps) {

    const { yearId } = useSchedule();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {        
        const getTerms = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/terms?academic_year_id=${yearId}&order=asc`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                const json = await res.json();
                if (!res.ok || !json.success) {
                    throw new Error(json.error || `Request failed with status ${res.status}`);
                }
                const data = (json.data ?? []) as Term[];
                setTerms(data);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setError(error.message);
                }
            } finally {
                setLoading(false);
            }
        }
        if (yearId && (mode === "edit")) getTerms();

    }, [])

    if (loading) {
        return (
            <Skeleton title count={2} repeatCount={3} />
        )
    }

    return (
        <div className="w-full flex flex-col gap-2">
            {terms.length > 0 && terms.map((term, index) => {
                return (
                    <div 
                        key={index} 
                        className={cn(`border p-3`, className)} 
                    >
                        <TermTile 
                            index={index} 
                            term={term} 
                            yearStart={yearStart}
                            yearEnd={yearEnd}
                            terms={terms}
                            setTerms={setTerms}
                            setError={setError}
                            setModifiedTerms={setModifiedTerms}
                        />
                    </div>
                )
            })}
            <TermCreator 
                terms={terms} 
                setTerms={setTerms} 
                setError={setError}
                yearStart={yearStart}
                yearEnd={yearEnd}
            />
        </div>
    )
}