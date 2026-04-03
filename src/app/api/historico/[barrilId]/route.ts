import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ barrilId: string }> }
) {
  const { barrilId } = await params;
  const { data, error } = await supabase
    .from("historico_barris")
    .select("*")
    .eq("barril_id", barrilId)
    .order("data_alteracao", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
