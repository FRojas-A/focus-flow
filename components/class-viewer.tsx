import { Database } from "@/database.types";
import { Modal, ModalBody, ModalHeader } from "./ui/modal";
import { Button } from "./ui/button";

type BasicClassRecord = Database["public"]["Views"]["basic_class_by_year"]["Row"];

interface ClassViewerProps {
  classRecord: BasicClassRecord;
}

export default function ClassViewer({ classRecord }: ClassViewerProps) {
    return (
        <Modal className="rounded-b-sm">
            <ModalHeader className="flex justify-between p-4">
                <div>
                    {classRecord.subject_name} {classRecord.module} {classRecord.class_name}
                </div>
                <div className="flex gap-4">
                    <Button size={"sm"} variant={"destructive"} type="button">Trash</Button>
                    <Button size={"sm"} type="button">Edit</Button>
                    <Button size={"sm"} type="button">Close</Button>
                </div>
            </ModalHeader>
            <ModalBody className="flex flex-col p-4 gap-4">
                <div className="flex flex-row gap-4">
                    <div>clock icon</div>
                    <div></div>
                </div>
                <div className="flex flex-row gap-4">
                    <div>pin icon</div>
                    <div>{classRecord.building} - {classRecord.room}</div>
                </div>
                <div className="flex flex-row gap-4">
                    <div>owl icon</div>
                    <div>{classRecord.class_teacher}</div>
                </div>
            </ModalBody>
        </Modal>
    )
}