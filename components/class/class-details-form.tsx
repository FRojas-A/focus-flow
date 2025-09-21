import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Plus } from "lucide-react";
import { Database } from "@/database.types";
import { createClient } from "@/lib/supabase/client";
import { QueryError } from "@supabase/supabase-js";
import Select, { StylesConfig } from "react-select";

type SubjectRecord = Database["public"]["Tables"]["subjects"]["Row"];
type SubjectOption = {
    label: string;
    value: number;
    color: string;
}

interface ClassDetailsFormProps {
    mode: "new" | "edit";
    setOpenSubjectWizard: React.Dispatch<React.SetStateAction<boolean>>;
    hidden?: boolean;
    setGetSubjects: React.Dispatch<React.SetStateAction<() => () => void>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

// Step 1 of class wizard
export default function ClassDetailsForm({setOpenSubjectWizard, hidden, setGetSubjects, setLoading}: ClassDetailsFormProps) {
    const supabase = createClient();
    const [error, setError] = useState<string | null>(null)
    const [subjects, setSubjects] = useState<SubjectOption[]>([]);

    useEffect(() => {
        const getSubjects = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase.from('subjects').select().order('name', { ascending: true });
                if (error) throw error
                const subjects = data.map((subject) => ({
                    
                    label: subject.name,
                    value: subject.id,
                    color: subject.color
                }));

                setSubjects(subjects);
            } catch(error: unknown) {
                const errorMessage = error as QueryError;
                setError(errorMessage.message);
            } finally {
                setLoading(false);
            }
        }
        setGetSubjects(() => () => getSubjects())
        getSubjects();
    }, [])

    const dot = (color = 'transparent') => ({
        alignItems: 'center',
        display: 'flex',
      
        ':before': {
          backgroundColor: color,
          borderRadius: 10,
          content: '" "',
          display: 'block',
          marginRight: 8,
          height: 16,
          width: 16,
        },
      });
    
    // TODO: revisit font sizing & select styling to use class names instead
    const colourStyles: StylesConfig<SubjectOption> = {
        container: (styles) => ({
            ...styles,
            width: "100%",

        }),
        control: (styles) => ({
            ...styles,
            minHeight: "36px",
            height: "36px",
            borderRight: "none",
            borderEndEndRadius: "0px",
            borderTopRightRadius: "0px",
            borderColor: "hsl(0, 0%, 14.9%)",
            backgroundColor: "transparent",
            '&:hover': {
                borderColor: "hsl(0, 0%, 14.9%)",
            }
        }),
        indicatorSeparator: (styles) => ({
            ...styles,
            display: "none",
        }),
        menu: (styles) => ({
            ...styles,
            backgroundColor: "hsl(0, 0%, 14.9%)",
            '&:hover': {
                backgroundColor: "hsl(0, 0%, 14.9%)",
            }
        }),
        option: (styles, { data }) => ({
            ...styles,
            ...dot(data.color),
            backgroundColor: "transparent",
            '&:hover': {
                backgroundColor: "gray",
            }

        }),
        singleValue: (styles, { data }) => ({
            ...styles,
            ...dot(data.color),
            color: "hsl(0, 0%, 98%)",
        })
    }
    
    return (
        <div className={`grid grid-cols-2 gap-y-2 gap-x-4 p-4 ${hidden ? "hidden" : ""}`}>
            <div className="">
                <Label htmlFor="subject">Subject</Label>
                <div className="flex flex-row">
                    {/* TODO: set default value if done loading */}
                    <Select options={subjects} styles={colourStyles} required name="subject" placeholder="Select a subject" />
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
