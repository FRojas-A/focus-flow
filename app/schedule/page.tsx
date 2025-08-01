import { Button } from "@/components/ui/button";
import YearForm from "@/components/year-form";

export default function SchedulePage() {



    return (
        <div className="flex justify-center w-full">
            <YearForm mode="edit" yearId={2}>
                <Button>Create New Academic Year</Button>
            </YearForm>
        </div>
    )
}