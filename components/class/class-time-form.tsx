import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface ClassTimeFormProps {
    mode: "new" | "edit";
    hidden?: boolean;
}

export default function ClassTimeForm({mode, hidden}: ClassTimeFormProps) {
    
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div className={`p-4 ${hidden ? "hidden" : ""}`}>
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
        </div>
    )
}