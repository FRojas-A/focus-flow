"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/database.types";
import { QueryError } from "@supabase/supabase-js";

type TermRecord = Database["public"]["Tables"]["terms"]["Row"];

interface TermEditorProps extends React.ComponentPropsWithoutRef<"div"> {
    yearId?: number;
    mode: "edit" | "new";
    terms: TermRecord[];
    setTerms: React.Dispatch<React.SetStateAction<TermRecord[]>>;
    setModifiedTerms: React.Dispatch<React.SetStateAction<Set<number>>>;
    yearStart: string;
    yearEnd: string;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function TermEditor ({ yearId, terms, setTerms, setModifiedTerms, mode, yearEnd, yearStart, setError }: TermEditorProps) {
    const supabase = createClient();
    const [termStart, setTermStart] = useState(yearStart);
    const [termEnd, setTermEnd] = useState(yearEnd);
    const [termName, setTermName] = useState("");
    const [tileForm, setTermForm] = useState(false);
    const [openIndex, setOpenIndex]  = useState<number | null>(null);
    const [updateStart, setUpdateStart] = useState("");
    const [updateEnd, setUpdateEnd] = useState("");

    useEffect(() => {
        const getTerms = async () => {
            // TODO: move to /api
            const { data } = await supabase.from("terms").select<"term_start, term_end, name">().eq("academic_year_id", yearId);
            if (data) {
                setTerms(data as TermRecord[]);
            }
        }
        if (yearId && mode === "edit") getTerms();

    }, [supabase, yearId, mode, setTerms])

    const checkOverlap = (start: string, end: string, oldTerms: TermRecord[], i?: number): boolean => {
        const newStart = new Date(start);
        const newEnd = new Date(end);

        if (newEnd < newStart) {
            setError("Term end date must be after start date!")
            return true
        };

        for (const [index, term] of oldTerms.entries()) {
            const existingStart = new Date(term.term_start)
            const existingEnd = new Date(term.term_end);
            if (newStart <= existingEnd && newEnd >= existingStart) {
                if (i !== undefined && i === index ) continue;
                setError("Terms cannot overlap!")
                return true;
            }
        }
        return false;
    }

    const saveTerm = () => {
        setError(null);
        if (checkOverlap(termStart, termEnd, terms)) return;

        const newTerm = { term_start: termStart, term_end: termEnd, name: termName } as TermRecord;

        setTerms(prev => [...prev, newTerm]);
        setTermForm(false)
    }

    const deleteTerm = async (index: number) => {
        setError(null);
        // TODO: pop up asking if user is sure
        if (terms[index].id) {
            try {
                const { error } = await supabase.from("terms").delete().eq("id", terms[index].id);
                if (error) throw error;
            } catch(error: unknown) {
                const queryError = error as QueryError;
                setError(queryError.message);
            }

        }

        setTerms(prev => {
            const newTerms = [...prev]
            newTerms.splice(index, 1);

            return newTerms
        });
        setModifiedTerms(prev => {
            const modifiedIndicies = new Set<number>();
            prev.forEach(modifiedIndex => {
                modifiedIndicies.add( modifiedIndex > index ? modifiedIndex - 1  : modifiedIndex);
            })
            return modifiedIndicies;
            })
    }

    const updateTerm = (index: number) => {
        setError(null);
        const updatedTerm = terms[index] as TermRecord;

        if (updateStart === "" && updateEnd === "") {
            setOpenIndex(null);
            return;
        }

        updatedTerm.term_start = updateStart || terms[index].term_start;
        updatedTerm.term_end = updateEnd || terms[index].term_end;
        
        if (checkOverlap(updateStart, updateEnd, terms, index)) return;

        setModifiedTerms(prev => new Set(prev).add(index));
        setTerms(prev => {
            const updatedTerms = [...prev];
            updatedTerms[index] = updatedTerm;

            return updatedTerms;
        });
        setOpenIndex(null);
    }

    const toggleUpdate = (index: number, term: TermRecord) => {
        setUpdateStart(term.term_start);
        setUpdateEnd(term.term_end);
        setOpenIndex(index)
    }

    // TODO: decouple states and pass data to server component instead

    return (
        <div className="w-full flex flex-col gap-2">
            {terms.length > 0 && terms.map((term, index) => {
                return (
                    <div key={index} className=" border p-3">
                        <div className="flex justify-between">
                            <div>
                                <div>{term.name}</div>
                                {/* TODO: format dates */}
                                <span>{term.term_start} - {term.term_end}</span>
                            </div>
                            <div className="flex gap-2">
                                <Button type="button" size={"sm"} onClick={() => deleteTerm(index)}>delete</Button>
                                <Button type="button" size={"sm"} onClick={() => toggleUpdate(index, term)}>modify</Button>
                            </div>
                        </div>
                        {openIndex === index && (
                        <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="flex flex-col gap-1">
                                <Label>Start Date</Label>
                                <input aria-label="Date" type="date" id="startDate" className="border" defaultValue={term.term_start} min={yearStart} max={yearEnd} onChange={(e) => setUpdateStart(e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label>End Date</Label>
                                <input aria-label="Date" type="date" id="startDate" className="border" defaultValue={term.term_end} min={updateStart} max={yearEnd} onChange={(e) => setUpdateEnd(e.target.value)} />
                            </div>
                            <div className="col-span-2 w-full">
                                <Button className="w-full" type="button" size={"sm"} onClick={() => updateTerm(index)}>Update</Button>
                            </div>
                        </div>
                        )}
                    </div>
                )
            })}
            {tileForm ? (
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between">
                        <div>
                            {/* Name */}
                            <Label >Name</Label>
                            <Input value={termName} onChange={(e) => setTermName(e.target.value)}/>
                        </div>
                        <div>
                            {/* close */}
                            <Button onClick={() => setTermForm(false)} type="button">X</Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <Label >Start</Label>
                            <input aria-label="Date" type="date" id="startDate" className="border" defaultValue={termStart} min={yearStart} max={yearEnd} onChange={(e) => setTermStart(e.target.value)} />
                        </div>
                        <div className="flex flex-col">
                            <Label >End</Label>
                            <input aria-label="Date" type="date" id="startDate" className="border" defaultValue={termEnd} min={termStart} max={yearEnd} onChange={(e) => setTermEnd(e.target.value)} />
                        </div>
                    </div>
                        <Button className="w-full" type="button" onClick={saveTerm} size={"sm"}>Add Term</Button>
                </div>
            ) : (
                <Button onClick={() => setTermForm(true)} type="button">Add Term</Button>
            )}
        </div>
    )
}