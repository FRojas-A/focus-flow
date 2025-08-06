"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/database.types";
import { QueryError } from "@supabase/supabase-js";
import { cn, formatDate, parseISODate, parseLocalDate } from "@/lib/utils";
import { useYear } from "./schedule/year-context";

type TermRecord = Database["public"]["Tables"]["terms"]["Row"];

interface TermEditorProps extends React.ComponentPropsWithoutRef<"div"> {
    mode: "edit" | "new" | "select";
    setModifiedTerms: React.Dispatch<React.SetStateAction<Set<number>>>;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function TermEditor ({ setModifiedTerms, mode, setError, className }: TermEditorProps) {
    const supabase = createClient();
    const [termName, setTermName] = useState("");
    const [tileForm, setTermForm] = useState(false);
    const [openIndex, setOpenIndex]  = useState<number | null>(null);
    const [updateStart, setUpdateStart] = useState("");
    const [updateEnd, setUpdateEnd] = useState("");
    const [updateName, setUpdateName] = useState("");
    const { yearId, terms, setTerms, yearStart, yearEnd, termId, setTermId, setTermStart, termStart, setTermEnd, termEnd } = useYear();

    useEffect(() => {
        const getTerms = async () => {
            // TODO: move to /api
            const { data } = await supabase.from("terms").select<"term_start, term_end, name">().eq("academic_year_id", yearId).order('term_start', { ascending: true });
            if (data) {
                setTerms(data as TermRecord[]);
            }
        }
        if (yearId && (mode === "edit" || mode === "select")) getTerms();

    }, [supabase, yearId, mode, setTerms])

    const checkOverlap = (start: string, end: string, name: string, oldTerms: TermRecord[], i?: number): boolean => {
        const newStart = new Date(start);
        const newEnd = new Date(end);

        if (newEnd < newStart) {
            setError("Term end date must be after start date!")
            return true
        } else if (newEnd > parseLocalDate(yearEnd) || newStart < parseLocalDate(yearStart)) {
            setError("Term cannot exceed year bounds!");
            return true;
        }

        for (const [index, term] of oldTerms.entries()) {
            const existingStart = new Date(term.term_start)
            const existingEnd = new Date(term.term_end);
            if (i !== undefined && i === index) continue;
            if (newStart <= existingEnd && newEnd >= existingStart) {
                setError("Terms cannot overlap!")
                return true;
            } else if (name.toLowerCase() === term.name.toLowerCase()) {
                setError("Term names cannot be the same!");
                return true;
            }
        }
        return false;
    }

    const saveTerm = () => {
        setError(null);
        if (!termName) {
            setError("Select a name for the term!");
            return;
        }
        if (!termStart) {
            setError("Select a start date for the term!");
            return;
        }
        if (!termEnd) {
            setError("Select an end time for the term!");
            return;
        }

        const trimmedName = termName.trim();

        if (checkOverlap(termStart, termEnd, trimmedName, terms)) return;

        const newTerm = { term_start: termStart, term_end: termEnd, name: trimmedName } as TermRecord;

        setTerms(prev => [...prev, newTerm]);
        setTermForm(false)
        setTermName("");
        setTermStart("");
        setTermEnd("");
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
        
        if (updateStart === "" && updateEnd === "") {
            setOpenIndex(null);
            return;
        }

        const trimmedName = updateName.trim();

        if (checkOverlap(updateStart, updateEnd, trimmedName, terms, index)) return;

        const updatedTerm = terms[index] as TermRecord;

        updatedTerm.term_start = updateStart || terms[index].term_start;
        updatedTerm.term_end = updateEnd || terms[index].term_end;
        updatedTerm.name = trimmedName || terms[index].name;

        setModifiedTerms(prev => new Set(prev).add(index));
        setTerms(prev => {
            const updatedTerms = [...prev];
            updatedTerms[index] = updatedTerm;

            return updatedTerms;
        });
        setOpenIndex(null);
    }

    const toggleUpdate = (index: number, term: TermRecord) => {
        setUpdateName(term.name);
        setUpdateStart(term.term_start);
        setUpdateEnd(term.term_end);
        setOpenIndex(index === openIndex ? null : index);
    }

    const setTermInfo = (term: TermRecord) => {
        setTermId(termId === term.id ? null : term.id);
        setTermStart(termId === term.id ? "" : term.term_start);
        setTermEnd(termId === term.id ? "" : term.term_end);
    }

    // TODO: decouple states and pass data to server component instead

    return (
        <div className="w-full flex flex-col gap-2">
            {/* Display and modify terms - term editor */}
            {terms.length > 0 && terms.map((term, index) => {
                return (
                    <div 
                        key={index} 
                        className={cn(`border p-3 transition-all duration-75 ${openIndex !== index && mode === "select" ? "hover:scale-105 hover:cursor-pointer hover:bg-blue-300" : ""} ${termId === term.id ? "bg-blue-500 hover:bg-blue-500" : ""}`, className)} 
                        onClick={() => setTermInfo(term)}
                    >
                        <div className="flex justify-between">
                            <div className="flex flex-col">
                                {openIndex === index && mode !== "select" ? (
                                    <Input value={updateName} onChange={(e) => setUpdateName(e.target.value)} />
                                ) : (
                                    <div>{term.name}</div>
                                )}
                                <span className="text-sm text-slate-600">
                                    {formatDate(term.term_start, { day: "numeric", month: "short", year: "numeric" })} - {formatDate(term.term_end, { day: "numeric", month: "short", year: "numeric" })}
                                </span>
                            </div>
                            {mode !== "select" && (
                                <div className="flex gap-2">
                                    <Button type="button" size={"sm"} onClick={() => deleteTerm(index)} variant={"destructive"}>delete</Button>
                                    <Button type="button" size={"sm"} onClick={() => toggleUpdate(index, term)}>modify</Button>
                                </div>
                            )}
                        </div>
                        {openIndex === index && mode !== "select" && (
                        <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="flex flex-col gap-1">
                                <Label>Start Date</Label>
                                <Input 
                                    aria-label="Date" 
                                    type="date" 
                                    id="startDate" 
                                    className="border" 
                                    defaultValue={parseISODate(term.term_start)} 
                                    min={yearStart} 
                                    max={yearEnd} 
                                    onChange={(e) => {
                                        const date = parseLocalDate(e.target.value);
                                        setUpdateStart(date.toISOString());
                                    }} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label>End Date</Label>
                                <Input 
                                    aria-label="Date" 
                                    type="date" 
                                    id="startDate" 
                                    className="border" 
                                    defaultValue={parseISODate(term.term_end)} 
                                    min={updateStart} 
                                    max={yearEnd} 
                                    onChange={(e) => {
                                        const date = parseLocalDate(e.target.value);
                                        setUpdateEnd(date.toISOString());
                                    }} />
                            </div>
                            <div className="col-span-2 w-full">
                                <Button className="w-full" type="button" size={"sm"} onClick={() => updateTerm(index)}>Update</Button>
                            </div>
                        </div>
                        )}
                    </div>
                )
            })}
            {mode === "select" && terms.length === 0 && (
                <div className="flex p-4">
                    Edit the year to add a term!
                </div>
            )}
            {/* Add new Term - tile-form */}
            {mode !== "select" && (
                <>
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
                                <div className="flex flex-col gap-1">
                                    <Label >Start Date</Label>
                                    <Input 
                                    aria-label="Date" 
                                    type="date" 
                                    id="startDate" 
                                    className="border" 
                                    min={yearStart} 
                                    max={yearEnd} 
                                    onChange={(e) => {
                                        const date = parseLocalDate(e.target.value);
                                        setTermStart(date.toISOString());
                                    }} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Label >End Date</Label>
                                    <Input 
                                    aria-label="Date" 
                                    type="date" 
                                    id="startDate" 
                                    className="border" 
                                    min={parseISODate(termStart)} 
                                    max={yearEnd} 
                                    onChange={(e) => {
                                        const date = parseLocalDate(e.target.value);
                                        setTermEnd(date.toISOString());
                                    }} />
                                </div>
                            </div>
                                <Button className="w-full" type="button" onClick={saveTerm} size={"sm"}>Add Term</Button>
                        </div>
                    ) : (
                        <Button onClick={() => setTermForm(true)} type="button">Add Term</Button>
                    )}
                </>
            )}
        </div>
    )
}