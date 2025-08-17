"use client";
import { Database } from "@/database.types";
import { YearTile } from "../year-tile";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type YearRecord = Database["public"]["Tables"]["academic_years"]["Row"];

export default function YearSelector() {

    const supabase = createClient();
    const [years, setYears] = useState<YearRecord[]>([])

    useEffect(() => {
        const getYearData = async () => {
            try {
                const { data, error } = await supabase.from("academic_years").select("*");
                if (error) throw error;
                const yearData = data as YearRecord[];
                setYears(yearData);
            } catch(error: unknown) {
                if (error instanceof Error) {
                    console.log(error.message);
                }
            }
        }
        getYearData();
    }, [])

    return (
        <div>
            {years.map((year, index) => {
                return (
                    <YearTile key={index} yearStart={year.year_start} yearEnd={year.year_end} year={year}/>
                )
            })}
        </div>
                
    )
}