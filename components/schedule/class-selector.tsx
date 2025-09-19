import { ClassForm } from "../class-modal";
import { Button } from "../ui/button";
import { useState } from "react";

export default function ClassSelector() {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <div className="flex justify-between items-center px-4 py-2 border-b">
                {/* subject selector */}
                <div>All Classes</div>
                <div>
                    {/* new class form */}
                    <Button variant="outline" onClick={() => setIsOpen(isOpen => !isOpen)}>New Class</Button>
                </div>
            </div>
            {isOpen && <ClassForm mode="new" className="z-10 inset-0 fixed flex justify-center items-center" setIsOpen={setIsOpen} />}
        </div>
    )
}