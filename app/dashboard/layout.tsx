import Overview from "@/components/dashboard/overview";


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="h-screen w-screen flex flex-col items-center">
            <Overview />
            {children}
        </main>
    )
}