import ScheduleController from "@/components/schedule/schedule-controller";
import { YearProvider } from "@/components/schedule/year-context";

export default function SchedulePage() {
    return (
        <main className="w-screen">
            <YearProvider>
                <ScheduleController />
            </YearProvider>
        </main>
    )
}