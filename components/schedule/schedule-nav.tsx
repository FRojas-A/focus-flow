import YearWizard from "../academic-year/year-wizard";

export default function ScheduleNav() {
    return (
            <div className="flex w-full h-16 justify-between items-center px-4 border-b">
                <div className="h-fit text-xl">Schedule</div>
                <div className="flex gap-2 h-fit">
                    <YearWizard mode="edit" />
                    <YearWizard mode="new" />
                </div>
            </div>
    )
}