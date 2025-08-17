import { ScheduleProvider } from "@/components/schedule/schedule-context";
import ScheduleNav from "@/components/schedule/schedule-nav";

export default function ScheduleLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ScheduleProvider>
            <div className="w-full">
                <ScheduleNav />
                {children}
            </div>
        </ScheduleProvider>
    )
}