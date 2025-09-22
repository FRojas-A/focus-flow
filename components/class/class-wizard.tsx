"use client";

import { useState, useRef } from "react";
import { Modal, ModalBody, ModalHeader } from "../ui/modal";
import { Database } from "@/database.types";
import SubjectWizard from "../subject/subject-wizard";
import ClassDetailsForm from "./class-details-form";
import ClassModalFooter from "./class-wizard-footer";
import ClassTimeForm from "./class-time-form";
import ClassYearForm from "./class-year-form";
import { Loader2 } from "lucide-react";

interface ClassFormProps extends React.ComponentPropsWithoutRef<"div"> {
  mode: "new" | "edit";
  classId?: string; // Only needed for edit mode
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type ClassRecord = Database["public"]["Tables"]["classes"]["Row"];
type SubjectRecord = Database["public"]["Tables"]["subjects"]["Row"];

export function ClassForm({
    className,
    mode,
    classId,
    setIsOpen,
    ...props
}: ClassFormProps) {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [openSubjectWizard, setOpenSubjectWizard] = useState(false);
    const [step, setStep] = useState(1);
    const [getSubjects, setGetSubjects] = useState<() => () => void>(() => () => console.log("initial getSubjects function"));
    const formRef = useRef<HTMLFormElement | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const classInfo = Object.fromEntries(formData.entries());

        console.log(classInfo);
        setLoading(false);
    }

  return (
    <div className={className} {...props}>
        <Modal className="w-[780px] z-20 relative shadow-lg shadow-black/50">
            {openSubjectWizard && <SubjectWizard setOpen={setOpenSubjectWizard} onSuccess={getSubjects} />}
            {loading && <div className="z-20 flex absolute top-0 left-0 w-full h-full items-center justify-center bg-gray-500/50 rounded-sm">
                        <Loader2 className="animate-spin size-12" />
            </div>}
            <ModalHeader>
                <div className="flex-col">
                    <div className="text-lg">{mode === "edit" ? "Edit Class" : "New Class"}</div>
                    <div className="text-sm"></div>
                </div>
                <div></div>
            </ModalHeader>
            <ModalBody className="min-h-[300px] max-h-[80vh]">
                {error && <div className="flex w-full">
                    {error}
                </div>}
                <form className="flex flex-col h-[calc(100%-65px)] overflow-y-scroll" onSubmit={handleSubmit} ref={formRef}>

                    <ClassDetailsForm mode={mode} setOpenSubjectWizard={setOpenSubjectWizard} hidden={step !== 1} setGetSubjects={setGetSubjects} setLoading={setLoading} />
                    <ClassTimeForm mode={mode} hidden={step !== 2} formRef={formRef}/>
                    <ClassYearForm mode={mode} hidden={step !== 3} />
                    <ClassModalFooter mode={mode} setIsOpen={setIsOpen} setStep={setStep} step={step} formRef={formRef} />
                </form>
            </ModalBody>
        </Modal>
        <div onClick={() => setIsOpen(false)} className="fixed min-h-screen h-full w-full bg-gray-500/75" />
    </div>
  );

}

