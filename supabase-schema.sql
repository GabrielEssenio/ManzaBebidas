-- Execute este SQL no SQL Editor do Supabase para criar as tabelas

-- Tabela de barris
CREATE TABLE barris (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  numero TEXT,
  tipo TEXT NOT NULL DEFAULT '50L' CHECK (tipo IN ('50L', '30L')),
  status TEXT NOT NULL DEFAULT 'Vazio' CHECK (status IN ('Fora', 'Fábrica', 'Vazio', 'Cheio')),
  lote TEXT,
  local TEXT,
  data_entrega DATE,
  data_recolha DATE,
  observacao TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de histórico
CREATE TABLE historico_barris (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  barril_id UUID NOT NULL REFERENCES barris(id) ON DELETE CASCADE,
  campo TEXT NOT NULL,
  valor_antigo TEXT,
  valor_novo TEXT,
  data_alteracao TIMESTAMPTZ DEFAULT NOW(),
  usuario TEXT
);

-- Índices para performance
CREATE INDEX idx_barris_status ON barris(status);
CREATE INDEX idx_barris_tipo ON barris(tipo);
CREATE INDEX idx_barris_local ON barris(local);
CREATE INDEX idx_historico_barril_id ON historico_barris(barril_id);
CREATE INDEX idx_historico_data ON historico_barris(data_alteracao);

-- Habilitar Row Level Security (RLS) - modo aberto para uso simples
ALTER TABLE barris ENABLE ROW LEVEL SECURITY;
ALTER TABLE historico_barris ENABLE ROW LEVEL SECURITY;

-- Políticas permissivas (acesso total via anon key)
CREATE POLICY "Acesso total barris" ON barris FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso total historico" ON historico_barris FOR ALL USING (true) WITH CHECK (true);
