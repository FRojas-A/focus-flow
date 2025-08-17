"use client";
import { Database } from "@/database.types";
import { createClient } from "@/lib/supabase/client";
import { cn, formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useSchedule } from "./schedule/schedule-context";

type TermRecord = Database["public"]["Tables"]["terms"]["Row"];

interface TermSelectorProps extends React.ComponentPropsWithoutRef<"div"> {
    setTermId: React.Dispatch<React.SetStateAction<number | null>>;
    setTermStart: React.Dispatch<React.SetStateAction<string>>;
    setTermEnd: React.Dispatch<React.SetStateAction<string>>;
    termId: number | null;
}

export default function TermSelector({ className, setTermId, setTermStart, setTermEnd, termId }: TermSelectorProps) {

    const supabase = createClient();
    
    const { yearId } = useSchedule();
    const [terms, setTerms] = useState<TermRecord[]>([]);

    useEffect(() => {
        const getTerms = async () => {
            // TODO: move to /api
            const { data } = await supabase.from("terms").select<"term_start, term_end, name">().eq("academic_year_id", yearId).order('term_start', { ascending: true });
            if (data) {
                setTerms(data as TermRecord[]);
            }
        }
        if (yearId) getTerms();

    }, [supabase, yearId, setTerms])

    const setTermInfo = (term: TermRecord) => {
        setTermId(termId === term.id ? null : term.id);
        setTermStart(termId === term.id ? "" : term.term_start);
        setTermEnd(termId === term.id ? "" : term.term_end);
    }

    return (
        <div className="w-full flex flex-col gap-2">
            {terms.length > 0 && terms.map((term, index) => {
                return (
                    <div 
                        key={index} 
                        className={cn(`border p-3 transition-all duration-75 hover:scale-105 hover:cursor-pointer hover:bg-blue-300 ${termId === term.id ? "bg-blue-500 hover:bg-blue-500" : ""}`, className)} 
                        onClick={() => setTermInfo(term)}
                    >
                        <div className="flex justify-between">
                            <div className="flex flex-col">
                                <div>{term.name}</div>
                                <span className="text-sm text-slate-600">
                                    {formatDate(term.term_start, { day: "numeric", month: "short", year: "numeric" })} - {formatDate(term.term_end, { day: "numeric", month: "short", year: "numeric" })}
                                </span>
                            </div>
                        </div>
                    </div>
                )
            })}
            {terms.length === 0 && (
                <div className="flex p-4">
                    Edit the year to add a term!
                </div>
            )}
        </div>
    )
}