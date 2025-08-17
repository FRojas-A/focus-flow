import ClassSelector from "@/components/schedule/class-selector";
import YearSelector from "@/components/schedule/year-selector";

export default function SchedulePage() {
    
    return (
        <main className="w-full grid grid-cols-3 divide-x min-h-screen">
            <YearSelector/>
            {/* Class selector */}
            <ClassSelector />
            {/* Class viewer */}
            <div id="class-viewer" />
        </main>
    )
}