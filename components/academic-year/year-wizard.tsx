"use client";
import { FormEvent, useState } from "react";
import { Modal, ModalBody, ModalError, ModalFooter, ModalHeader } from "../ui/modal";
import { Button } from "../ui/button";
import YearInput from "./year-input";
import { useSchedule } from "../schedule/schedule-context";
import TermWizard from "../term-wizard/term-wizard";
import { Database } from "@/database.types";
import { parseISODate } from "@/lib/utils";

interface YearWizardProps {
    mode: "new" | "edit";
}

type TermRecord = Database["public"]["Tables"]["terms"]["Row"];

export default function YearWizard({ mode }: YearWizardProps) {

    const { year, yearId, yearStart, yearEnd } = useSchedule();
    const [yStart, setYStart] = useState("");
    const [yEnd, setYEnd] = useState("");
    const [toggleModal, setToggleModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [modifiedTerms, setModifiedTerms] = useState<Set<number>>(new Set());
    const [terms, setTerms] = useState<TermRecord[]>([]);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/academic-years", {
                method: "POST",
                body: JSON.stringify({
                    mode,
                    yearId,
                    yearStart,
                    yearEnd,
                    terms,
                    modifiedTerms: Array.from(modifiedTerms)
                }),
                headers: { "Content-Type": "application/json"}
            })

            const result = await res.json();
            if (!result.success) throw new Error(result.error);
            setSuccess(true);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Unknown error. Could not save academic year.")
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <Button disabled={yearId === null && mode === "edit"} onClick={() => setToggleModal(!toggleModal)}>
                {mode === "edit" ? "Edit" : "New"}{mode === "edit" && year ? " " + year : ""}{" "}{"Year"}
            </Button>
            {toggleModal && (
                <div className="z-10 inset-0 fixed flex justify-center items-center">
                    <form onSubmit={(e) => handleSubmit(e)} className="w-[30rem] z-20">
                        <Modal>
                            <ModalHeader>
                                <span className="text-lg">{mode === "edit" ? "Edit" : "New"}{" "}Academic Year</span>
                            </ModalHeader>
                            {error && (
                                <ModalError>
                                    {error}
                                </ModalError>
                            )}
                            <ModalBody className="flex flex-col p-4 gap-4">
                                <YearInput 
                                    mode={mode}
                                    setYearStart={setYStart} 
                                    setYearEnd={setYEnd} 
                                />
                                <div className="">
                                    <h2 className="text-lg">Terms</h2>
                                    <div className="flex justify-center align-items w-full">
                                        <TermWizard
                                            terms={terms}
                                            setTerms={setTerms}
                                            mode={mode}
                                            setModifiedTerms={setModifiedTerms}
                                            setError={setError}
                                            yearStart={parseISODate(yStart || yearStart)}
                                            yearEnd={parseISODate(yEnd || yearEnd)}
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
                        </Modal>
                    </form>
                    <div onClick={() => setToggleModal(false)} className="fixed min-h-screen h-full w-full  bg-gray-500/75" />
                </div>
            )}
        </>
    )
}