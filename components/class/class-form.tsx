import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "../ui/modal";
import { useSchedule } from "../schedule/schedule-context";


export default function ClassForm({ 
    setIsOpen, 
    modifiedTerms, 
    setModifiedTerms,
    error,
    setError
}: { 
    setIsOpen: (isOpen: boolean) => void, 
    modifiedTerms: Set<number>, 
    setModifiedTerms: React.Dispatch<React.SetStateAction<Set<number>>>, 
    error: string | null,
    setError: React.Dispatch<React.SetStateAction<string | null>>
}) {

    const { year, yearId } = useSchedule();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        console.log("year id: ", yearId)
        console.log(formData, formData.getAll("days[]"), modifiedTerms);
    }

    return (
        <Modal className="w-3/5 z-20">
            <form onSubmit={(e) => handleSubmit(e)}>
                <ModalHeader className="text-lg">
                    <div>
                        New Class
                    </div>
                    <div>
                        {year}
                    </div>
                </ModalHeader>
                {/* Error/info */}
                    {error}
                <ModalBody className="grid grid-cols-2 gap-4 p-6 ">
                    {/* class info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>Subject Dropdown</div>
                        <div>
                            <Label>Name</Label>
                            <Input required name="name" />
                        </div>
                        <div>
                            <Label>Module</Label>
                            <Input name="module"  />
                        </div>
                        <div>
                            <Label>Room</Label>
                            <Input name="room" />
                        </div>
                        <div>
                            <Label>Building</Label>
                            <Input name="building" />
                        </div>
                        <div>
                            <Label>Teacher</Label>
                            <Input name="teacher" />
                        </div>
                    <div className="flex flex-col gap-2 col-span-2">
                        {/* Day Selector */}
                        <div>Days</div>
                        <ul className="grid w-full md:grid-cols-7">
                            {days.map((day, index) => {
                                return (
                                    <li key={index}>
                                        <Input className="hidden peer" name="days[]" id={day} value={day} type="checkbox" />
                                        <Label htmlFor={day} className="inline-flex items-center justify-center w-full border p-3 text-gray-600 peer-checked:border-blue-600 peer-checked:text-white hover:bg-gray-600">
                                            <div className="block">
                                                {day}
                                            </div>
                                        </Label>
                                    </li>
                                )
                            })}
                        </ul>
                        {/* Time Selector */}
                        <div>Times</div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="classStart">Start Time</Label>
                                <Input name="classStart" type="time" />
                            </div>
                            <div>
                                <Label htmlFor="classEnd">End Time</Label>
                                <Input name="classEnd" type="time" />
                            </div>
                        </div>
                    </div>
                    </div>
                    {/* Terms/year info - add new term logic later */}
                    <div className="flex flex-col gap-2">
                        <div>Terms</div>
                        <div className="text-sm">
                            Selecting a term will bind your classes to that term’s duration. If no term is selected, classes will default to the full academic year.
                        </div>
                        <div>
                            
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter className="flex justify-between px-4 py-2">
                    <div></div>
                    <div className="flex gap-2">
                        <Button variant={"outline"} size={"sm"} type="button" onClick={() => {
                            setIsOpen(false);
                        }} >Cancel</Button>
                        <Button size={"sm"} type="submit">Save</Button>
                    </div>
                </ModalFooter>
            </form>
        </Modal>
    )
}