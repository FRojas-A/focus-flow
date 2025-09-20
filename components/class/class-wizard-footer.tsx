import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "../ui/button";

interface ClassWizardFooterProps {
    mode: "new" | "edit";
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setStep: React.Dispatch<React.SetStateAction<number>>;
    step: number;
}

export default function ClassWizardFooter({mode, setIsOpen, setStep, step}: ClassWizardFooterProps) {
    return (
        <div className="flex flex-row justify-end w-full gap-2 p-4 border-t absolute bottom-0">
            <Button type="button" size={"sm"} className="" onClick={() => setStep(prev => prev - 1)} disabled={step === 1}>
                <ChevronLeftIcon /> Previous
            </Button>
            <Button type="button" size={"sm"} className="" onClick={() => setStep(prev => prev + 1)} disabled={step === 3}>
                Next <ChevronRightIcon />
            </Button>
            <Button size={"sm"} type="submit">
                {mode === "edit" ? "Update" : "Create"}
            </Button>
            <Button variant={"outline"} size={"sm"} type="button" onClick={() => setIsOpen(false)}>
                Cancel
            </Button>
        </div>
    )
}
    