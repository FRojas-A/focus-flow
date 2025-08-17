"use client";
import { parseISODate, parseLocalDate } from "@/lib/utils";
import { Button } from "../ui/button";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "../ui/input";
import { useState } from "react";
import { Database } from "@/database.types";

type TermRecord = Database["public"]["Tables"]["terms"]["Row"];

interface TermCreatorProps {
    terms: TermRecord[];
    setTerms: React.Dispatch<React.SetStateAction<TermRecord[]>>;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
    yearStart: string;
    yearEnd: string;
}

export default function TermCreator({ terms, setTerms, setError, yearStart, yearEnd }: TermCreatorProps) {

    const [termName, setTermName] = useState("");
    const [termStart, setTermStart] = useState("");
    const [termEnd, setTermEnd] = useState("");
    const [tileForm, setTermForm] = useState(false);

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

    return (
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
                            <Button onClick={() => setTermForm(false)} type="button">x</Button>
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
                                defaultValue={termStart}
                                onChange={(e) => {
                                    const date = parseLocalDate(e.target.value);
                                    setTermStart(date.toISOString());
                                }} 
                            />
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
                                defaultValue={termEnd}
                                onChange={(e) => {
                                    const date = parseLocalDate(e.target.value);
                                    setTermEnd(date.toISOString());
                                }} 
                            />
                        </div>
                    </div>
                        <Button className="w-full" type="button" onClick={saveTerm} size={"sm"}>Add Term</Button>
                </div>
            ) : (
                <Button onClick={() => setTermForm(true)} type="button">Add Term</Button>
            )}
        </>
    )
}