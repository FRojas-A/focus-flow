"use client";

import { useEffect, useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "./ui/modal";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/database.types";
import { QueryError } from "@supabase/supabase-js";
import { ChevronLeftIcon, ChevronRightIcon, Plus } from "lucide-react";
import SubjectWizard from "./subject/subject-wizard";

interface ClassFormProps extends React.ComponentPropsWithoutRef<"div"> {
  mode: "new" | "edit";
  classId?: string; // Only needed for edit mode
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type ClassRecord = Database["public"]["Tables"]["classes"]["Row"];

export function ClassForm({
    className,
    mode,
    classId,
    setIsOpen,
    ...props
}: ClassFormProps) {

    const supabase = createClient();
    const [subject, setSubject] = useState("");
    const [module, setModule] = useState("");
    const [room, setRoom] = useState("");
    const [building, setBuilding] = useState("");
    const [teacher, setTeacher] = useState(""); 
    const [error, setError] = useState<string | null>(null)
    const [openSubjectWiz, setOpenSubjectWiz] = useState(false);
    
    useEffect(() => {
        const getData = async () => {
            try {
                const { data, error } = await supabase.from('classes').select().single();
                if (error) throw error
                const classInfo = data as ClassRecord;
                setModule(classInfo.module ?? "");
            } catch(error: unknown) {
                const errorMessage = error as QueryError;
                setError(errorMessage.message);
            }
        }
        if (mode === "edit") getData();
    }, [classId, mode, supabase])

  return (
    <div className={className} {...props}>
      <Modal className="w-[780px] z-20">
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
            <div className="grid grid-cols-2">
                <div className="p-3">
                    <Label htmlFor="subject">Subject</Label>
                    <div className="flex flex-row">
                        {/* TODO: turn into dropdown */}
                        <Input
                            id="subject"
                            type="text"
                            required
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="border-r-0 rounded-r-none focus:border z-10"
                        />
                        {/* on click opens subject modal */}
                        <Button onClick={() => setOpenSubjectWiz(true)} size="sm" variant="outline" className="h-9 w-9 border-l-0 rounded-l-none">
                            <Plus />
                        </Button>
                        <SubjectWizard setOpen={setOpenSubjectWiz} mode="new" />
                    </div>
                </div>
                <div className="p-3">
                    <Label htmlFor="module">Module</Label>
                    <Input
                        id="module"
                        type="text"
                        required
                        value={module}
                        onChange={(e) => setModule(e.target.value)}
                    />
                </div>
                <div className="p-3">
                    <Label htmlFor="room">Room</Label>
                    <Input
                        id="room"
                        type="text"
                        required
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                    />
                </div>
                <div className="p-3">
                    <Label htmlFor="building">Building</Label>
                    <Input
                        id="building"
                        type="text"
                        required
                        value={building}
                        onChange={(e) => setBuilding(e.target.value)}
                    />
                </div>
                <div className="p-3">
                    <Label htmlFor="teacher">Teacher</Label>
                    <Input
                        id="teacher"
                        type="text"
                        required
                        value={teacher}
                        onChange={(e) => setTeacher(e.target.value)}
                    />
                </div>
            </div>
        </ModalBody>
        <ModalFooter className="">
            <div className="flex flex-row justify-end w-full gap-2">
                <Button size={"sm"} className="">
                    <ChevronLeftIcon /> Previous
                </Button>
                <Button size={"sm"} className="">
                    Next <ChevronRightIcon />
                </Button>
                <Button size={"sm"}>
                    {mode === "edit" ? "Update" : "Create"}
                </Button>
                <Button variant={"outline"} size={"sm"} onClick={() => setIsOpen(false)}>
                    Cancel
                </Button>
            </div>
        </ModalFooter>
      </Modal>
      <div onClick={() => setIsOpen(false)} className="fixed min-h-screen h-full w-full bg-gray-500/75" />
    </div>
  );

}

