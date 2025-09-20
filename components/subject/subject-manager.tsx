"use client"
import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "../ui/modal";
import { Button } from "../ui/button";
import SubjectWizard from "./subject-wizard";
import { LoaderCircle } from "lucide-react";

type SubjectRecord = {
    id?: number;
    name: string;
    color: string;
}


export default function SubjectManager() {

    const [subjects, setSubjects] = useState<SubjectRecord[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<SubjectRecord | null>(null);
    const [openSubjectWizard, setOpenSubjectWizard] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchSubjects = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/subjects");
            const data = await res.json() as { data: SubjectRecord[] };
            setSubjects(data.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    return (
        <>
        <Button onClick={() => setOpen(true)}>Manage Subjects</Button>
        {open && <div className="z-10 fixed inset-0 flex items-center justify-center">
            <Modal className="w-[425px] z-20">
                <ModalHeader>
                    <h1>Subject Manager</h1>
                </ModalHeader>
                <ModalBody className="p-4 flex flex-col items-center justify-center">
                    {loading ? (
                        <div className="flex items-center justify-center h-48">
                            <LoaderCircle className="animate-spin h-12 w-12" />
                        </div>
                    ) : subjects.length > 0 ? (
                        <>
                            {/* Hidden trigger used by all list items */}
                            {openSubjectWizard && <SubjectWizard
                                setOpen={setOpenSubjectWizard}
                                subject={selectedSubject}
                                onSuccess={fetchSubjects}
                            />}
                            <ul className="flex flex-col w-full">
                                {subjects.map((subject: SubjectRecord) => (
                                    <li
                                        key={subject.id}
                                        className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded-sm cursor-pointer transition-colors duration-75"
                                        onClick={() => {
                                            setSelectedSubject(subject);
                                            setOpenSubjectWizard(true);
                                        }}
                                    >
                                        <span
                                            className="text-xs size-5 rounded-full inline-block"
                                            style={{ backgroundColor: subject.color }}
                                        />
                                        {subject.name}
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <p>No subjects found. Create a new one to get started.</p>
                    )}
                </ModalBody>
                <ModalFooter className="flex flex-row justify-between">
                    <Button size="sm" onClick={() => setOpen(false)} variant="outline">Close</Button>
                    <Button size="sm" onClick={() => {
                        setSelectedSubject(null);
                        setOpenSubjectWizard(true);
                    }}>New Subject</Button>
                </ModalFooter>
            </Modal>
            <div onClick={() => setOpen(false)} className="fixed min-h-screen h-full w-full bg-gray-500/75" />
        </div>}
        </>
    );
}
