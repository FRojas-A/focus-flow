import React, { useState } from "react";
import { Modal, ModalBody, ModalHeader } from "../ui/modal";
import SubjectForm from "./subject-form";
import { createClient } from "@/lib/supabase/client";
import { toast } from "react-hot-toast";

type SubjectRecord = {
    id?: number;
    name: string;
    color: string;
}

type SubjectWizardProps = {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    subject?: SubjectRecord | null;
    onSuccess?: () => void;
};

export default function SubjectWizard({ setOpen, subject = null, onSuccess }: SubjectWizardProps) {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const supabase = createClient();

    // TODO: consolidate into one function?
    const submitSubject = async (formData: FormData) => {
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
            toast.success("Subject saved successfully", {
                duration: 3000,
            });
            setOpen(false);
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : "An unknown error occurred");
            toast.error(error instanceof Error ? error.message : "Could not save subject", {
                duration: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    }

    // TODO: move to server route
    const deleteSubject = async () => {
        if (subject?.id) {
            try {
                const { error } = await supabase.from("subjects").delete().eq("id", subject.id);
                if (error) throw error;
                setSuccess(true);
                onSuccess?.();
                toast.success("Subject deleted successfully", {
                    duration: 3000,
                });
                setOpen(false);
            } catch(error: unknown) {
                setError(error instanceof Error ? error.message : "An unknown error occurred");
                toast.error(error instanceof Error ? error.message : "Could not delete subject", {
                    duration: 3000,
                });
            } finally {
                setIsLoading(false);
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const formButton = e.nativeEvent;
        setIsLoading(true);
        if (formButton instanceof SubmitEvent) {
            if (formButton?.submitter?.id === "subjectSubmit") {
                submitSubject(formData);
                return;
            }
            if (formButton?.submitter?.id === "subjectDelete") {
                // TODO: ask for confirmation
                deleteSubject();
                return;
            }
        }
    };

    return (
        <div className="z-20 fixed inset-0 flex items-center justify-center">
            <Modal className="w-[500px] z-30">
                <ModalHeader>
                    <h1>{subject ? "Edit Subject" : "New Subject"}</h1>
                </ModalHeader>
                <ModalBody>
                    <SubjectForm onClickClose={() => setOpen(false)} onSubmit={handleSubmit} isLoading={isLoading} subject={subject} />
                </ModalBody>
            </Modal>
            <div onClick={() => setOpen(false)} className="fixed min-h-screen h-full w-full bg-gray-500/75" />
        </div>

    );
}
