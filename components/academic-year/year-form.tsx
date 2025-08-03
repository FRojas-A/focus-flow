import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "../ui/modal";
import { Database } from "@/database.types";
import TermEditor from "../term-editor";

type TermRecord = Database["public"]["Tables"]["terms"]["Row"];

interface YearFormProps extends React.ComponentPropsWithoutRef<"div"> {
    yearId?: number;
    mode: "edit" | "new";
    error: string | null;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
    yearStart: string;
    setYearStart: React.Dispatch<React.SetStateAction<string>>;
    yearEnd: string;
    setYearEnd: React.Dispatch<React.SetStateAction<string>>;
    terms: TermRecord[];
    setTerms: React.Dispatch<React.SetStateAction<TermRecord[]>>;
    setModifiedTerms: React.Dispatch<React.SetStateAction<Set<number>>>;
    handleSubmit: () => void
    setToggleModal: React.Dispatch<React.SetStateAction<boolean>>;
    isLoading: boolean;
}

export default function YearForm({
    mode,
    yearId,
    error,
    setError,
    yearStart,
    setYearStart,
    yearEnd,
    setYearEnd,
    terms,
    setTerms,
    setModifiedTerms,
    handleSubmit,
    setToggleModal,
    isLoading
}: YearFormProps) {
    
    return (
        <Modal>
            <form onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}>
                <ModalHeader>
                    <span className="text-lg">{mode === "edit" ? "Edit" : "New"}{" "}Academic Year</span>
                </ModalHeader>
                <ModalBody className="flex flex-col p-4 gap-4">
                    <div>
                        {error}
                    </div>
                    <div className="grid grid-cols-2 gap-10">
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="startDate">Start Date</Label>
                            <input aria-label="Date" type="date" id="startDate" className="border" defaultValue={yearStart} onChange={(e) => setYearStart(e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="endDate">End Date</Label>
                            <input aria-label="Date" type="date" id="endDate" className="border" defaultValue={yearEnd} onChange={(e) => setYearEnd(e.target.value)} />
                        </div>
                        <div>{yearStart}-{yearEnd}</div>
                    </div>
                    <div className="">
                        <h2 className="text-lg">Terms</h2>
                        <div className="flex justify-center align-items w-full">
                            <TermEditor 
                                terms={terms} 
                                setTerms={setTerms}
                                setModifiedTerms={setModifiedTerms}
                                yearId={yearId} 
                                mode={mode} 
                                yearStart={yearStart} 
                                yearEnd={yearEnd}
                                setError={setError} 
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter className="justify-end">
                    {/* TODO: add additional button to delete */}
                    <div className="flex gap-2">
                        <Button onClick={() => setToggleModal(false)} type="button" size={"sm"} variant={"outline"}>Cancel</Button>
                        <Button type="submit" disabled={isLoading} size={"sm"}>Save</Button>
                    </div>
                </ModalFooter>
            </form>
        </Modal>
    )
}