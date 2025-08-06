import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "../ui/modal";
import TermEditor from "../term-editor";
import { Input } from "../ui/input";
import { parseISODate, parseLocalDate } from "@/lib/utils";
import { useYear } from "../schedule/year-context";


interface YearFormProps extends React.ComponentPropsWithoutRef<"div"> {
    mode: "edit" | "new";
    error: string | null;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
    setModifiedTerms: React.Dispatch<React.SetStateAction<Set<number>>>;
    handleSubmit: () => void
    setToggleModal: React.Dispatch<React.SetStateAction<boolean>>;
    isLoading: boolean;
}

export default function YearForm({
    mode,
    error,
    setError,
    setModifiedTerms,
    handleSubmit,
    setToggleModal,
    isLoading
}: YearFormProps) {

    const { yearStart, yearEnd, setYearStart, setYearEnd } = useYear()
    
    return (
        <Modal className="w-[30rem] z-20">
            <form onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}>
                <ModalHeader>
                    <span className="text-lg">{mode === "edit" ? "Edit" : "New"}{" "}Academic Year</span>
                </ModalHeader>
                    {error && (
                        <div className="bg-red-400 border border-red-600 w-full h-16 border-4 flex items-center px-6">
                            {error}
                        </div>
                    )}
                <ModalBody className="flex flex-col p-4 gap-4">
                    <div className="grid grid-cols-2 gap-10">
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input 
                            aria-label="Date" 
                            type="date" 
                            id="startDate" 
                            className="border" 
                            defaultValue={mode === "new" ? "" : parseISODate(yearStart)} 
                            onChange={(e) => {
                                const date = parseLocalDate(e.target.value)
                                setYearStart(date.toISOString())
                            }} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="endDate">End Date</Label>
                            <Input 
                            aria-label="Date" 
                            type="date" 
                            id="endDate" 
                            className="border" 
                            defaultValue={mode === "new" ? "" : parseISODate(yearEnd)} 
                            onChange={(e) => {
                                const date = parseLocalDate(e.target.value)
                                setYearEnd(date.toISOString())
                            }} />
                        </div>
                    </div>
                    <div className="">
                        <h2 className="text-lg">Terms</h2>
                        <div className="flex justify-center align-items w-full">
                            <TermEditor 
                                setModifiedTerms={setModifiedTerms}
                                mode={mode}
                                setError={setError}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter className="justify-between">
                    <div>
                        {mode === "edit" && (
                            <Button type="button" size={"sm"} variant={"destructive"}>Delete</Button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => setToggleModal(false)} type="button" size={"sm"} variant={"outline"}>Cancel</Button>
                        <Button type="submit" disabled={isLoading} size={"sm"}>Save</Button>
                    </div>
                </ModalFooter>
            </form>
        </Modal>
    )
}