import YearFormController from "../academic-year/year-form-controller";
import { Button } from "../ui/button";

export default function ScheduleNav({ yearId }: { yearId: number | null }) {
    return (
            <div className="flex w-full h-16 justify-between items-center px-4 border-b">
                <div className="h-fit text-xl">Schedule</div>
                <div className="flex gap-2 h-fit">
                    {/* TODO: subject manager */}
                    {/* TODO: set current year in edit button */}
                    <YearFormController mode="edit" yearId={yearId}>
                        <Button disabled={yearId === null} >Edit Year</Button>
                    </YearFormController>
                    <YearFormController mode="new">
                        <Button>New Year</Button>
                    </YearFormController>
                </div>
            </div>
    )
}