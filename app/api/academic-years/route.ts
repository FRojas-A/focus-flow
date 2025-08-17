
import { Database } from "@/database.types";
import { createClient } from "@/lib/supabase/server";
import { QueryError } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

type TermRecord = Database["public"]["Tables"]["terms"]["Row"];

export async function POST(req: NextRequest) {
    const body = await req.json();
    const supabase = await createClient();


    const {
        mode,
        yearId,
        yearStart,
        yearEnd,
        terms,
        modifiedTerms,
    }: {
        mode: "new" | "edit";
        yearId?: number;
        yearStart: string;
        yearEnd: string;
        terms: TermRecord[];
        modifiedTerms: number[];
    } = body;

  try {
    if (mode === "new") {
        const { data, error: yearError } = await supabase
            .from("academic_years")
            .insert({ year_start: yearStart, year_end: yearEnd })
            .select()
            .single();

        if (yearError) throw yearError;
        const newYear = data;

        const enrichedTerms = terms.map(term => ({
            ...term,
            academic_year_id: newYear.id,
        }));

        const { error: termError } = await supabase
            .from("terms")
            .insert(enrichedTerms);

        if (termError) throw termError;
    } else if (mode === "edit" && yearId) {
        // TODO: verify that terms are still within year bounds
        const { error: yearError } = await supabase
            .from("academic_years")
            .update({ year_start: yearStart, year_end: yearEnd })
            .eq("id", yearId);

        if (yearError) throw yearError;

        const newTerms = terms
            .filter(term => !term.id)
            .map(term => ({ ...term, academic_year_id: yearId }));

        const { error: newTermError } = await supabase
            .from("terms")
            .insert(newTerms);

        if (newTermError) throw newTermError;

        for (const index of modifiedTerms) {
            const term = terms[index];
            if (term.id) {
                const { error: modifiedTermError } = await supabase
                    .from("terms")
                    .update({
                        name: term.name,
                        term_start: term.term_start,
                        term_end: term.term_end,
                    })
                    .eq("id", term.id);

                if (modifiedTermError) throw modifiedTermError;
            }
        }
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const queryError = error as QueryError
    return NextResponse.json({ success: false, error: queryError.message }, { status: 500 });
  }
}
