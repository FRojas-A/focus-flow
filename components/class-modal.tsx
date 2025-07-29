"use client";

import { useEffect, useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "./ui/modal";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

interface NewClassFormProps extends React.ComponentPropsWithoutRef<"div"> {
  mode: "create" | "edit";
  classId?: string; // Only needed for edit mode
}

export function NewClassForm({
    className,
    mode,
    classId,
    ...props
}: NewClassFormProps) {

    const [subject, setSubject] = useState("");
    const [module, setModule] = useState("");
    const [room, setRoom] = useState("");
    const [building, setBuilding] = useState("");
    const [teacher, setTeacher] = useState("");
    // const [success, setSuccess] = useState(false);
    // const [error, setError] = useState<string | null>(null);
    // const [isLoading, setIsLoading] = useState(false);
    

    
    // class tile
    // subject/name times days --- teacher
    
    useEffect(() => {
        // TODO fetch class data
        // get class info based on id

    }, [classId, mode])

  return (
    <div className={className} {...props}>
      <Modal>
        <ModalHeader modalTitle={mode === "edit" ? "Edit Class" : "New Class"}  isCloseable={false} academicYear="">

        </ModalHeader>
        <ModalBody>
            <div>
                <div className="p-3">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                        id="subject"
                        type="text"
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />
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
        <ModalFooter>
            <div className="flex flex-row gap-2">
                <Button variant={"outline"} size={"sm"}>
                    Cancel
                </Button>
                <Button size={"sm"}>
                    {mode === "edit" ? "Update" : "Create"}
                </Button>
            </div>
        </ModalFooter>
      </Modal>
    </div>
  );

}

