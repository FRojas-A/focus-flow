import React, { useState } from "react";
import { Modal, ModalBody, ModalHeader } from "../ui/modal";
import SubjectForm from "./subject-form";

type SubjectRecord = {
    id?: number;
    name: string;
    color: string;
}

type SubjectWizardProps = {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    mode: "new" | "edit";
    subject?: SubjectRecord | null;
    onSuccess?: () => void;
};

export default function SubjectWizard({ setOpen, mode, subject = null, onSuccess }: SubjectWizardProps) {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        setIsLoading(true);
        setError(null);

        try {
            const { name, color } = Object.fromEntries(formData);
            if (name === subject?.name && color === subject?.color) {
                setOpen(false);
                return;
            }
            const res = await fetch("/api/subjects", {
                method: "POST",
                body: JSON.stringify({ name, color, id: subject?.id }),
                headers: { "Content-Type": "application/json" }
            });
            const result = await res.json();
            if (!result.success) throw new Error(result.error);
            setSuccess(true);
            onSuccess?.();
            setOpen(false);
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : "An unknown error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="z-20 fixed inset-0 flex items-center justify-center">
            <Modal className="w-[500px] z-30">
                <ModalHeader>
                    <h1>New Subject</h1>
                </ModalHeader>
                <ModalBody>
                    <SubjectForm onClickClose={() => setOpen(false)} onSubmit={handleSubmit} isLoading={isLoading} subject={subject} />
                </ModalBody>
            </Modal>
            <div onClick={() => setOpen(false)} className="fixed min-h-screen h-full w-full bg-gray-500/75" />
        </div>

    );
}
