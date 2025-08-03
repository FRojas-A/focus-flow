import YearFormController from "@/components/academic-year/year-form-controller";
import { Button } from "@/components/ui/button";

export default function SchedulePage() {
    return (
        <div className="flex justify-center w-full">
            <YearFormController mode="edit" yearId={2} >
                <Button>New Year</Button>
            </YearFormController>
        </div>
    )
}