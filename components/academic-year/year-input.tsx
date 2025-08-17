"use client";
import { useSchedule } from "../schedule/schedule-context";
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { parseISODate, parseLocalDate } from "@/lib/utils";

interface YearInputProps {
    mode: "edit" | "new";
    setYearStart: React.Dispatch<React.SetStateAction<string>>;
    setYearEnd: React.Dispatch<React.SetStateAction<string>>;
}

export default function YearInput({ mode, setYearStart, setYearEnd }: YearInputProps) {

    const { yearStart, yearEnd } = useSchedule();

    return (
        <div className="grid grid-cols-2 gap-10">
            <div className="flex flex-col gap-1">
                <Label htmlFor="startDate">Start Date</Label>
                <Input 
                    aria-label="Date" 
                    type="date" 
                    id="startDate" 
                    className="border" 
                    defaultValue={mode === "new" ? "" : parseISODate(yearStart)} 
                    onChange={(e) => {
                        const date = parseLocalDate(e.target.value)
                        setYearStart(date.toISOString())
                    }} 
                />
            </div>
            <div className="flex flex-col gap-1">
                <Label htmlFor="endDate">End Date</Label>
                <Input 
                    aria-label="Date" 
                    type="date" 
                    id="endDate" 
                    className="border" 
                    defaultValue={mode === "new" ? "" : parseISODate(yearEnd)} 
                    onChange={(e) => {
                        const date = parseLocalDate(e.target.value)
                        setYearEnd(date.toISOString())
                    }} 
                />
            </div>
        </div>
    )
}