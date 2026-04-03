import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status");
  const local = searchParams.get("local");
  const tipo = searchParams.get("tipo");

  let query = supabase.from("barris").select("*").order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);
  if (local) query = query.ilike("local", `%${local}%`);
  if (tipo) query = query.eq("tipo", tipo);

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { data, error } = await supabase
    .from("barris")
    .insert({
      numero: body.numero || null,
      tipo: body.tipo,
      status: body.status,
      lote: body.lote || null,
      local: body.local || null,
      data_entrega: body.data_entrega || null,
      data_recolha: body.data_recolha || null,
      observacao: body.observacao || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("historico_barris").insert({
    barril_id: data.id,
    campo: "criação",
    valor_antigo: null,
    valor_novo: "Barril criado",
    usuario: body.usuario || null,
  });

  return NextResponse.json(data, { status: 201 });
}
