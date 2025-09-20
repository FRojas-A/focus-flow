import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { LoaderCircle, Pipette } from "lucide-react";

type SubjectRecord = {
    id?: number;
    name: string;
    color: string;
}

interface SubjectFormProps {
    onClickClose: () => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
    subject: SubjectRecord | null;
}

export default function SubjectForm({ onClickClose, onSubmit, isLoading, subject }: SubjectFormProps) {
    const generateRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    return (
        <form className="flex flex-col relative" onSubmit={(e) => onSubmit(e)}>
            {isLoading && (
                <div className="z-20 absolute inset-0 flex items-center justify-center bg-gray-500/50">
                    <LoaderCircle className="animate-spin size-12" />
                </div>
            )}
            <div className="flex flex-row p-4 gap-2 relative">
                <div className="w-full">
                    <Label htmlFor="name">Name</Label>
                    <Input type="text" id="name" name="name" required defaultValue={subject?.name ?? ""} />
                </div>
                <div className="">
                    <Label htmlFor="color">Color</Label>
                    <div className="size-9 overflow-hidden flex items-center justify-center relative rounded-sm">
                        <Input type="color" title="Color picker" id="color" name="color" className="size-10 absolute rounded-sm p-0 border-none hover:cursor-pointer" required defaultValue={subject?.color ?? generateRandomColor()} />
                        <Pipette className="size-5 absolute pointer-events-none" />
                    </div>
                </div>
            </div>
            <div className="flex justify-between gap-2 p-4 border-t">
                <Button size="sm" type="button" onClick={onClickClose} variant="outline">Cancel</Button>
                <div className="flex gap-2" >
                    <Button id="subjectSubmit" size="sm" type="submit" disabled={isLoading} className="flex items-center gap-2">
                        Submit
                    </Button>
                    {subject && <Button id="subjectDelete" size="sm" type="submit" disabled={isLoading} variant="destructive" className="flex items-center gap-2">Delete</Button>}
                </div>
            </div>
        </form>
    );
}
