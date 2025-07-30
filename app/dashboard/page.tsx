import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";


export default async function Dashboard() {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getClaims();
    if (error || !data?.claims) {
        redirect("/auth/login");
    }

    return (
        <div>Dashboard</div>
    )
}