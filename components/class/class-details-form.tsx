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
}

// Step 1 of class wizard
export default function ClassDetailsForm({mode, setOpenSubjectWizard, hidden}: ClassDetailsFormProps) {
    const supabase = createClient();
    const [subject, setSubject] = useState("");
    const [module, setModule] = useState("");
    const [room, setRoom] = useState("");
    const [building, setBuilding] = useState("");
    const [teacher, setTeacher] = useState(""); 
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
        getSubjects();
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
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
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
                    value={module}
                    onChange={(e) => setModule(e.target.value)}
                />
            </div>
            <div className="">
                <Label htmlFor="room">Room</Label>
                <Input
                    id="room"
                    type="text"
                    name="room"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                />
            </div>
            <div className="">
                <Label htmlFor="building">Building</Label>
                <Input
                    id="building"
                    type="text"
                    name="building"
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                />
            </div>
            <div className="">
                <Label htmlFor="teacher">Teacher</Label>
                <Input
                    id="teacher"
                    type="text"
                    name="teacher"
                    value={teacher}
                    onChange={(e) => setTeacher(e.target.value)}
                />
            </div>
        </div>
    )
}
