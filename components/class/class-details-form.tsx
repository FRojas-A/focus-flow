import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Plus } from "lucide-react";
import { Database } from "@/database.types";
import { createClient } from "@/lib/supabase/client";
import { QueryError } from "@supabase/supabase-js";

type SubjectRecord = Database["public"]["Tables"]["subjects"]["Row"];

interface ClassDetailsFormProps {
    mode: "new" | "edit";
    setOpenSubjectWizard: React.Dispatch<React.SetStateAction<boolean>>;
    hidden?: boolean;
    setGetSubjects: React.Dispatch<React.SetStateAction<() => void>>;
}

// Step 1 of class wizard
export default function ClassDetailsForm({setOpenSubjectWizard, hidden, setGetSubjects}: ClassDetailsFormProps) {
    const supabase = createClient();
    const [error, setError] = useState<string | null>(null)
    const [subjects, setSubjects] = useState<SubjectRecord[]>([]);

    useEffect(() => {
        const getSubjects = async () => {
            try {
                const { data, error } = await supabase.from('subjects').select();
                if (error) throw error
                const subjects = data as SubjectRecord[];
                setSubjects(subjects);
            } catch(error: unknown) {
                const errorMessage = error as QueryError;
                setError(errorMessage.message);
            }
        }
        setGetSubjects(getSubjects)
    }, [])
    
    return (
        <div className={`grid grid-cols-2 gap-y-2 gap-x-4 p-4 ${hidden ? "hidden" : ""}`}>
            <div className="">
                <Label htmlFor="subject">Subject</Label>
                <div className="flex flex-row">
                    <select
                    id="subject"
                    name="subjectId"
                    required
                    className="border-r-0 rounded-l-sm focus:border z-10 w-full py-1 px-3 font-sans"
                >
                    {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id} >
                            {subject.name}
                        </option>
                    ))}
                </select>
                <Button type="button" onClick={() => setOpenSubjectWizard(true)} size="sm" variant="outline" className="h-9 w-9 border-l-0 rounded-l-none">
                    <Plus />
                </Button>
            </div>
            </div>
            <div className="">
                <Label htmlFor="module">Module</Label>
                <Input
                    id="module"
                    type="text"
                    name="module"
                    required
                />
            </div>
            <div className="">
                <Label htmlFor="room">Room</Label>
                <Input
                    id="room"
                    type="text"
                    name="room"
                />
            </div>
            <div className="">
                <Label htmlFor="building">Building</Label>
                <Input
                    id="building"
                    type="text"
                    name="building"
                />
            </div>
            <div className="">
                <Label htmlFor="teacher">Teacher</Label>
                <Input
                    id="teacher"
                    type="text"
                    name="teacher"
                />
            </div>
        </div>
    )
}
