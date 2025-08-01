import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";


export default async function Dashboard() {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getClaims();
    if (error || !data?.claims) {
        redirect("/auth/login");
    }

    return (
        <div className="relative grid grid-cols-4 w-full h-screen divide-x divide-gray-300">
            <div className="flex flex-cols py-8 px-4">
                classes today
                
            </div>
            <div className="space-y-2 py-8 px-4 ">
                tasks
            </div>
            <div className="flex flex-cols py-8 px-4">
                upcoming exams
            </div>
            <div className="flex flex-cols py-8 px-4">

            </div>
        </div>
    )
}