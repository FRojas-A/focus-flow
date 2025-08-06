"use client";
import { useEffect, useState } from "react";
import YearSelector from "./year-selector";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/database.types";
import ScheduleNav from "./schedule-nav";
import ClassSelector from "./class-selector";
import { useYear } from "./year-context";

type YearRecord = Database["public"]["Tables"]["academic_years"]["Row"];
type SubjectRecord = Database["public"]["Tables"]["subjects"]["Row"];
type BasicClassRecord = Database["public"]["Views"]["basic_class_by_year"]["Row"];

export default function ScheduleController() {


    const supabase = createClient();
    const [years, setYears] = useState<YearRecord[]>([]);
    const [subjects, setSubjects] = useState<SubjectRecord[]>([]);
    const [classes, setClasses] = useState<BasicClassRecord[]>([])
    const { yearId } = useYear();

    // TODO: fix - each class selection is triggering all calls 
    useEffect(() => {
        const getYears = async () => {
            try {
                const { data, error } = await supabase.from("academic_years").select<"year_start, year_end, id">().order('year_start', { ascending: false });
                if (error) throw error;
                const yearData = data as YearRecord[]
                setYears(yearData);
            } catch(error: unknown) {
                if (error instanceof Error) {
                    console.log("instance of error");
                }
                console.log(error)
            }
        }

        getYears();

    }, [supabase])

    useEffect(() => {
        const getSubjects = async () => {
            try {
                const { data, error } = await supabase.from("subjects").select().eq("academic_year_id", yearId);
                if (error) throw error;
                setSubjects(data);
            } catch(error: unknown) {
                if (error instanceof Error) {
                    console.log("Class error")
                }
                console.log(error)
            }
        }

        const getClasses = async () => {
            try {
                const { data, error } = await supabase
                    .from('basic_class_by_year')
                    .select('*')
                    .eq('academic_year_id', yearId);
                if (error) throw error;
                setClasses(data);
            } catch(error: unknown) {
                if (error instanceof Error) {
                    console.log("Class error")
                }
                console.log(error)
            }
        }
        if (yearId !== null) {
            getSubjects();
            getClasses();
        }
    }, [yearId, supabase])

    return (
        <div>
            <ScheduleNav />
            <div className="grid grid-cols-2 divide-x min-h-screen">
                {/* selects year for editing and displaying classes */}
                <YearSelector years={years} />
                {/* displays classes and class viewer - viewer allows editing */}
                <ClassSelector subjects={subjects} classes={classes} />
            </div>
        </div>
    )
}