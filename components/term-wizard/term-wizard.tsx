"use client";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/database.types";
import { cn } from "@/lib/utils";
import TermTile from "./term-tile";
import TermCreator from "./term-creator";
import { useSchedule } from "../schedule/schedule-context";

interface TermWizardProps extends React.ComponentPropsWithoutRef<"div"> {
    mode: "edit" | "new",
    terms: TermRecord[];
    setTerms: React.Dispatch<React.SetStateAction<TermRecord[]>>;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
    setModifiedTerms: React.Dispatch<React.SetStateAction<Set<number>>>;
    yearStart: string;
    yearEnd: string;
}

type TermRecord = Database["public"]["Tables"]["terms"]["Row"];

export default function TermWizard({ className, mode, terms, setTerms, setError, setModifiedTerms, yearStart, yearEnd }: TermWizardProps) {

    const supabase = createClient();
    const { yearId } = useSchedule();

    useEffect(() => {
        const getTerms = async () => {
            // TODO: move to /api
            const { data } = await supabase.from("terms").select<"term_start, term_end, name">().eq("academic_year_id", yearId).order('term_start', { ascending: true });
            if (data) {
                setTerms(data as TermRecord[]);
            }
        }
        if (yearId && (mode === "edit")) getTerms();

    }, [supabase, yearId, mode, setTerms])

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
            <TermCreator terms={terms} setTerms={setTerms} setError={setError}
                yearStart={yearStart}
                yearEnd={yearEnd}
            />
        </div>
    )
}