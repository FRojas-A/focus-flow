import { Database } from "@/database.types";
import { YearTile } from "../year-tile";

interface YearSelectorProps {
    // pass in years, setYearId
    years: YearRecord[];
    yearId: number | null;
    setYearId: React.Dispatch<React.SetStateAction<number | null>>;
}

type YearRecord = Database["public"]["Tables"]["academic_years"]["Row"];

// TODO: rename - only handles years
export default function YearSelector({ years, yearId, setYearId }: YearSelectorProps) {

    return (
        <div>
            {/* get all years, display via year tile, usestate to open year-form/and set yearID for edit current year */}
            {years.map((year, index) => {
                return (
                    <YearTile key={index} yearStart={year.year_start} yearEnd={year.year_end} onClick={() => setYearId(year.id)} className={yearId === year.id ? "bg-blue-500" : ""}/>
                )
            })}
        </div>
                
    )
}