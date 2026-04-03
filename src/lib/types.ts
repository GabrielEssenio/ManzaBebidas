export type BarrilStatus = "Fora" | "Fábrica" | "Vazio" | "Cheio" | "Aberto";
export type BarrilTipo = "50L" | "30L";

export interface Barril {
  id: string;
  numero: string | null;
  tipo: BarrilTipo;
  status: BarrilStatus;
  lote: string | null;
  local: string | null;
  data_entrega: string | null;
  data_recolha: string | null;
  observacao: string | null;
  created_at: string;
  updated_at: string;
}

export interface HistoricoBarril {
  id: string;
  barril_id: string;
  campo: string;
  valor_antigo: string | null;
  valor_novo: string | null;
  data_alteracao: string;
  usuario: string | null;
}
