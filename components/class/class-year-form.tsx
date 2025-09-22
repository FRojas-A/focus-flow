import { useEffect, useState } from "react";
import { Database } from "@/database.types";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type AcademicYear = Database["public"]["Tables"]["academic_years"]["Row"];

interface ClassYearFormProps {
    mode: "new" | "edit";
    hidden?: boolean;
}
export default function ClassYearForm({mode, hidden}: ClassYearFormProps) {
    const [years, setYears] = useState<AcademicYear[]>([]);
    useEffect(() => {
        const getYears = async () => {
            try {
                // call api to get all year info including terms
                const response = await fetch("/api/academic-years");
                const data = await response.json();
                console.log(data.data);
                setYears(data.data);
            } catch (error) {
                console.log(error);
            }
        }
        getYears();
    }, [])

    return (
        <div className={`flex flex-col gap-2 p-4 h-full ${hidden ? "hidden" : ""}`}>
            <h2>Years</h2>
            <ul>
                {years.map(year => {
                    return (
                        <div key={year.id}>
                            {/* TODO: Display terms under each year */}
                            <Input value={year.id} type="radio" name="year" className="hidden peer" id={String(year.id)} />
                            <Label htmlFor={String(year.id)} className="inline-flex items-center justify-center w-full border p-3 text-gray-600 peer-checked:border-blue-600 peer-checked:text-white hover:bg-gray-600">
                                <div className="block">
                                    {year.year_start}
                                </div>
                            </Label>
                        </div>
                    )
                })}
            </ul>
        </div>
    )
}