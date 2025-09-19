import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { PostgrestError } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase.from("subjects").select("*").order("name", { ascending: true });
        if (error) throw error;
        return NextResponse.json({ success: true, data });
    } catch (error: unknown) {
        const queryError = error as PostgrestError;
        return NextResponse.json({ success: false, error: queryError.message }, { status: Number(queryError.code) });
    }    
}

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const body = await req.json();
    const { id, name, color } = body as { id?: number; name: string; color: string };

    try {
        if (typeof id === "number") {
            const { error } = await supabase
                .from("subjects")
                .update({ name, color })
                .eq("id", id);
            if (error) throw error;
            return NextResponse.json({ success: true });
        } else {
            const { error } = await supabase
                .from("subjects")
                .insert({ name, color })
            if (error) throw error;
            return NextResponse.json({ success: true });
        }
    } catch (error: unknown) {
        const queryError = error as PostgrestError;
        return NextResponse.json({ success: false, error: queryError.message }, { status: Number(queryError.code) });
    }
}