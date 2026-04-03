import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data, error } = await supabase
    .from("barris")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const { data: existing, error: fetchError } = await supabase
    .from("barris")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 404 });

  const camposEditaveis = [
    "numero", "tipo", "status", "lote", "local",
    "data_entrega", "data_recolha", "observacao",
  ] as const;

  const historico: {
    barril_id: string;
    campo: string;
    valor_antigo: string | null;
    valor_novo: string | null;
    usuario: string | null;
  }[] = [];

  for (const campo of camposEditaveis) {
    if (campo in body && String(body[campo] ?? "") !== String(existing[campo] ?? "")) {
      historico.push({
        barril_id: id,
        campo,
        valor_antigo: existing[campo] != null ? String(existing[campo]) : null,
        valor_novo: body[campo] != null ? String(body[campo]) : null,
        usuario: body.usuario || null,
      });
    }
  }

  if (historico.length > 0) {
    await supabase.from("historico_barris").insert(historico);
  }

  const { data, error } = await supabase
    .from("barris")
    .update({
      numero: body.numero ?? existing.numero,
      tipo: body.tipo ?? existing.tipo,
      status: body.status ?? existing.status,
      lote: body.lote ?? existing.lote,
      local: body.local ?? existing.local,
      data_entrega: body.data_entrega ?? existing.data_entrega,
      data_recolha: body.data_recolha ?? existing.data_recolha,
      observacao: body.observacao ?? existing.observacao,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { error } = await supabase.from("barris").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
