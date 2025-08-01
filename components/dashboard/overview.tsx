import { Button } from "../ui/button";

export default function Overview() {
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });


    return (
        <div className="grid grid-cols-4 divide-x divide-gray-100 w-full h-32 shadow border-b">
            <div className="flex flex-col items-start justify-center p-4">
                <h1 className="text-2xl">Today</h1>
                <div>{today}</div>
            </div>
            <div className="flex justify-between p-4">
                <div className="flex-col items-start">
                    <h1>Tasks</h1>
                    <Button >New Task</Button>
                </div>
                <div className="h-24">
                    Chart.js Donut
                </div>
            </div>
            <div className="flex justify-between p-4">
                <div>Exams</div>
                <div></div>
            </div>
            <div></div>
        </div>
    )
}