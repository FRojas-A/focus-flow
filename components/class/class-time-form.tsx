import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Select from "react-select";
import { useState } from "react";
import { Button } from "../ui/button";
import { CircleX, Trash2 } from "lucide-react";

interface ClassTimeFormProps {
    mode: "new" | "edit";
    hidden?: boolean;
    formRef: React.RefObject<HTMLFormElement | null>;
}

type Schedule = {
    frequency: number;
    startTime: TimeOption;
    endTime: TimeOption;
    days: string[];
}

type TimeOption = {
    label: string;
    value: number;
    input: string;
}

export default function ClassTimeForm({mode, hidden, formRef}: ClassTimeFormProps) {

    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [frequency, setFrequency] = useState<number>(0);
    const [startTime, setStartTime] = useState<TimeOption | null>(null);
    const [endTime, setEndTime] = useState<TimeOption | null>(null);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [scheduleForm, setScheduleForm] = useState<boolean>(true);
    const [scheduleIndex, setScheduleIndex] = useState<number>(-1);
    
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const frequencyOptions = [
        { value: 0, label: "Daily" },
        { value: 1, label: "Week 1" },
        { value: 2, label: "Week 2" }
    ];

    const createSchedule = () => {
        if (isNaN(frequency) || startTime === null || endTime === null || selectedDays.length === 0) {
            formRef.current?.reportValidity();
            console.log("Invalid schedule", frequency, startTime, endTime, selectedDays);
            return;
        }
        if (startTime > endTime) {
            formRef.current?.reportValidity();
            console.log("Invalid schedule", startTime, endTime);
            return;
        }

        const schedule: Schedule = {
            frequency: frequency,
            startTime: startTime,
            endTime: endTime,
            days: selectedDays
        }

        if (scheduleIndex === -1) {
            setSchedules([...schedules, schedule]);
        } else {
            const newSchedules = [...schedules];
            newSchedules[scheduleIndex] = schedule;
            setSchedules(newSchedules);
            setScheduleIndex(-1);
        }

        setScheduleForm(false);
        setFrequency(0);
        setStartTime(null);
        setEndTime(null);
        setSelectedDays([]);
    }


    const editSchedule = (schedule: Schedule, index: number) => {
        setScheduleForm(true);
        setFrequency(schedule.frequency);
        setStartTime(schedule.startTime);
        setEndTime(schedule.endTime);
        setSelectedDays(schedule.days);
        setScheduleIndex(index);
    }

    const deleteSchedule = (index: number) => {
        const newSchedules = [...schedules];
        newSchedules.splice(index, 1);
        setSchedules(newSchedules);
        if (newSchedules.length === 0) {
            setScheduleForm(true);
        }
    }

    const convertTime = (time: number): { label: string; value: number; input: string } => {
        const now = new Date();
        const date = now.setHours(0, 0, 0, time);
        const input = new Date(date).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: false,
        });
        const label = new Date(date).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });

        return { label, value: time, input };
      
      };

    return (
        <div className={`p-4 flex flex-col gap-4 items-center justify-center w-full h-full ${hidden ? "hidden" : ""}`}>
            <div className="flex justify-between items-center w-full">
                <div className="text-lg">Set Schedule</div>
                <Button size="sm" type="button" onClick={() => setScheduleForm(true)}>
                    Add Schedule
                </Button>
            </div>
            {schedules.length > 0 && (
                <div className="flex flex-col gap-1 w-full">
                    {schedules.map((schedule, index) => {
                        return (
                            <div key={index} className="flex flex-row justify-between items-center border  gap-1 w-full hover:bg-gray-700 transition-colors cursor-pointer relative">
                                <div className="flex flex-col px-3 py-2 w-full" onClick={() => editSchedule(schedule, index)}>
                                    <div className="text-sm">{convertTime(schedule.startTime.value).label} - {convertTime(schedule.endTime.value).label}</div>
                                    <div className="text-xs text-muted-foreground flex gap-1">{schedule.frequency !== 0 && <div>Week {schedule.frequency}:</div>} {schedule.days.join(", ")}</div>
                                </div>
                                <div className="absolute top-0 right-0 flex h-full items-center justify-center px-3 py-2 hover:text-red-500 transition-colors cursor-pointer" onClick={() => deleteSchedule(index)}>
                                    <Trash2 className="size-5" />
                                </div>
                            </div>
                        )
                    })}                    
                </div>
            )}

            {scheduleForm && (
                <div className="p-4 flex flex-col gap-4 bg-gray-700 w-full ">
                    <div className="flex justify-between">
                        <div className="w-1/2 flex flex-col gap-2">
                            <Label htmlFor="frequency">Frequency</Label>
                            <Select options={frequencyOptions} name="frequency" onChange={(e) => setFrequency(e?.value!)} defaultValue={frequencyOptions[0]} isClearable={false} required />
                        </div>
                        {schedules.length > 0 && (
                            <div className="p-2 h-fit cursor-pointer hover:text-red-500 transition-colors" onClick={() => setScheduleForm(false)}>
                                <CircleX className="size-5" />
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="startTime">Start Time</Label>
                            <Input name="startTime" type="time" onChange={(e) => setStartTime({label: e.target.value, value: e.target.valueAsNumber!, input: e.target.value})} value={startTime?.input ?? ""} disabled={hidden} max={endTime?.value} required />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="endTime">End Time</Label>
                            <Input name="endTime" type="time" onChange={(e) => setEndTime({label: e.target.value, value: e.target.valueAsNumber!, input: e.target.value})} value={endTime?.input ?? ""} disabled={hidden} min={startTime?.value} max="23:59" required />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="days">Days</Label>
                        <ul className="grid w-full md:grid-cols-7">
                            {days.map((day, index) => {
                                return (
                                    <li key={index}>
                                        <Input className="hidden peer" name="days" id={day} value={day} type="checkbox" onChange={(e) => {
                                                const value = e.target.value;
                                                setSelectedDays((prev) =>
                                                prev.includes(value)
                                                    ? prev.filter((d) => d !== value)
                                                    : [...prev, value]
                                                );
                                            }}
                                            checked={selectedDays.includes(day)}
                                        />
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
                    <Button size="sm" type="button" onClick={() => createSchedule()}>{scheduleIndex === -1 ? "Add Schedule" : "Update Schedule"}</Button>
                </div>
            )}
        </div>
    )
}