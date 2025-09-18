"use client";
import { Database } from "@/database.types";
import { YearTile } from "../year-tile";
import { useEffect, useState } from "react";
import { useSchedule } from "./schedule-context";
import { formatDate } from "@/lib/utils";
import Skeleton from "../ui/skeleton";

type YearRecord = Database["public"]["Tables"]["academic_years"]["Row"];

export default function YearSelector() {
    const [years, setYears] = useState<YearRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { yearId, setYearId, setYearStart, setYearEnd, setYear } = useSchedule();

    useEffect(() => {
        const getYearData = async () => {
            try {
                const res = await fetch(`/api/academic-years?orderBy=year_start&order=desc`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                const json = await res.json();
                if (!res.ok || !json.success) {
                    throw new Error(json.error || `Request failed with status ${res.status}`);
                }
                const data = (json.data ?? []) as YearRecord[];
                setYears(data);
                setError(null);
            } catch(error: unknown) {
                if (error instanceof Error) {
                    setError(error.message);
                }
            } finally {
                setLoading(false);
            }
        }
        getYearData();
    }, [])

    return (
        <div>
            {loading && (
                <div className="p-2">
                    <Skeleton count={1} title={true} repeatCount={3} />
                </div>
            )}
            {error && (
                <div className="p-2 text-sm text-red-600" role="alert">{error}</div>
            )}
            {!loading && !error && years.map((year) => {
                const shortStart = formatDate(year.year_start, { year: "numeric" });
                const shortEnd = formatDate(year.year_end, { year: "numeric" });
                const yearLabel = `${shortStart}${shortStart === shortEnd ? "" : ` - ${shortEnd}`}`;
                return (
                    <YearTile
                        key={year.id}
                        year={year}
                        selected={yearId === year.id}
                        onSelectYear={(y) => {
                            setYearId(y.id);
                            setYearStart(y.year_start);
                            setYearEnd(y.year_end);
                            setYear(yearLabel);
                        }}
                    />
                )
            })}
        </div>
                
    )
}