"use client";

import { useState, useRef } from "react";
import { Modal, ModalBody, ModalHeader } from "../ui/modal";
import { Database } from "@/database.types";
import SubjectWizard from "../subject/subject-wizard";
import ClassDetailsForm from "./class-details-form";
import ClassModalFooter from "./class-wizard-footer";
import ClassTimeForm from "./class-time-form";
import ClassYearForm from "./class-year-form";

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
    const [openSubjectWizard, setOpenSubjectWizard] = useState(false);
    const [step, setStep] = useState(1);
    const [getSubjects, setGetSubjects] = useState<() => void>(() => {});
    const formRef = useRef<HTMLFormElement | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        console.log("Form submitted");
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const classInfo = Object.fromEntries(formData.entries().filter(([key]) => key !== "days[]"));
        const days = formData.getAll("days[]");
        console.log(classInfo, days);
    }

  return (
    <div className={className} {...props}>
        <Modal className="w-[780px] z-20">
            {openSubjectWizard && <SubjectWizard setOpen={setOpenSubjectWizard} onSuccess={getSubjects} />}
            <ModalHeader>
                <div className="flex-col">
                    <div className="text-lg">{mode === "edit" ? "Edit Class" : "New Class"}</div>
                    <div className="text-sm"></div>
                </div>
                <div></div>
            </ModalHeader>
            <ModalBody>
                <div className="flex w-full">
                    {error}
                </div>
                <form className="flex flex-col min-h-[300px] h-full relative" onSubmit={handleSubmit} ref={formRef}>
                    <ClassDetailsForm mode={mode} setOpenSubjectWizard={setOpenSubjectWizard} hidden={step !== 1} setGetSubjects={setGetSubjects} />
                    <ClassTimeForm mode={mode} hidden={step !== 2} />
                    <ClassYearForm mode={mode} hidden={step !== 3} />
                    <ClassModalFooter mode={mode} setIsOpen={setIsOpen} setStep={setStep} step={step} formRef={formRef} />
                </form>
        </ModalBody>
      </Modal>
      <div onClick={() => setIsOpen(false)} className="fixed min-h-screen h-full w-full bg-gray-500/75" />
    </div>
  );

}

