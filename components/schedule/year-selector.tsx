import { Database } from "@/database.types";
import { YearTile } from "../year-tile";
import { useYear } from "./year-context";

interface YearSelectorProps {
    years: YearRecord[];
}

type YearRecord = Database["public"]["Tables"]["academic_years"]["Row"];

// TODO: rename - only handles years
export default function YearSelector({ years }: YearSelectorProps) {

    const { yearId, setYearId, setYearStart, setYearEnd } = useYear();

    return (
        <div>
            {/* get all years, display via year tile, usestate to open year-form/and set yearID for edit current year */}
            {years.map((year, index) => {
                return (
                    <YearTile key={index} yearStart={year.year_start} yearEnd={year.year_end} onClick={() => {
                        setYearId(year.id);
                        setYearStart(year.year_start);
                        setYearEnd(year.year_end);
                    }} className={yearId === year.id ? "bg-blue-500" : ""}/>
                )
            })}
        </div>
                
    )
}