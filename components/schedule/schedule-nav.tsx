import YearFormController from "../academic-year/year-form-controller";
import { Button } from "../ui/button";
import { useYear } from "./year-context";

export default function ScheduleNav() {

    const { year, yearId } = useYear();

    return (
            <div className="flex w-full h-16 justify-between items-center px-4 border-b">
                <div className="h-fit text-xl">Schedule</div>
                <div className="flex gap-2 h-fit">
                    {/* TODO: subject manager */}
                    <YearFormController mode="edit" >
                        <Button disabled={yearId === null} >Edit {year} Year</Button>
                    </YearFormController>
                    <YearFormController mode="new">
                        <Button>New Year</Button>
                    </YearFormController>
                </div>
            </div>
    )
}