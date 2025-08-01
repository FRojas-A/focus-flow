import * as React from "react";
import { Modal, ModalBody, ModalHeader } from "./ui/modal";

export default function TaskViewer() {
    return (
        <Modal>
            <ModalHeader className="p-6">
                <div className="flex flex-col">
                    <div className="text-xl">Task Name</div>
                    <div className="">Subject Task Type</div>
                </div>
                <div className="flex flex-row gap-2">
                    <div>Trash</div>
                    <div>Edit</div>
                    <div>Close</div>
                </div>
            </ModalHeader>
            <ModalBody className="flex flex-col p-6 rounded-b-sm">
                <div>Due Date</div>
                <div>Progress</div>
                <div>Details</div>
                <div>Due for Class</div>
            </ModalBody>
        </Modal>
    )
}