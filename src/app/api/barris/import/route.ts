import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

  const barris = rows.map((row) => ({
    numero: row["numero"] != null ? String(row["numero"]) : null,
    tipo: String(row["tipo"] || "50L"),
    status: String(row["status"] || "Vazio"),
    lote: row["lote"] != null ? String(row["lote"]) : null,
    local: row["local"] != null ? String(row["local"]) : null,
    data_entrega: row["data_entrega"] != null ? String(row["data_entrega"]) : null,
    data_recolha: row["data_recolha"] != null ? String(row["data_recolha"]) : null,
    observacao: row["observacao"] != null ? String(row["observacao"]) : null,
  }));

  const { data, error } = await supabase.from("barris").insert(barris).select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (data) {
    const historico = data.map((b) => ({
      barril_id: b.id,
      campo: "importação",
      valor_antigo: null,
      valor_novo: "Importado via CSV/Excel",
      usuario: null,
    }));
    await supabase.from("historico_barris").insert(historico);
  }

  return NextResponse.json({ imported: data?.length || 0 });
}
