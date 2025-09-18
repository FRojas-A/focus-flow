import { Database } from "@/database.types";
import { createClient } from "@/lib/supabase/server";
import { QueryError } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();

  try {
    const { searchParams } = new URL(req.url);
    const academicYearId = searchParams.get("academic_year_id");
    const orderDir = (searchParams.get("order") ?? "asc").toLowerCase(); // asc | desc
    const ascending = orderDir === "asc";

    if (!academicYearId) {
      return NextResponse.json(
        { success: false, error: "Missing required query param: academic_year_id" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("terms")
      .select("id, name, term_start, term_end, academic_year_id")
      .eq("academic_year_id", Number(academicYearId))
      .order("term_start", { ascending });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const queryError = error as QueryError;
    return NextResponse.json(
      { success: false, error: queryError.message },
      { status: 500 }
    );
  }
}
