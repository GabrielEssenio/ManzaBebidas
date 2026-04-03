"use client";

import { useState, useEffect } from "react";
import { Barril, BarrilStatus, BarrilTipo, HistoricoBarril } from "@/lib/types";

interface BarrilModalProps {
  barril: Barril | null;
  isNew: boolean;
  onClose: () => void;
  onSave: (data: Partial<Barril>) => void;
  onDelete?: (id: string) => void;
}

const campoLabels: Record<string, string> = {
  numero: "Numero",
  tipo: "Tipo",
  status: "Status",
  lote: "Lote",
  local: "Local",
  data_entrega: "Data Entrega",
  data_recolha: "Data Recolha",
  observacao: "Observacao",
  "criação": "Criacao",
  "importação": "Importacao",
};

export default function BarrilModal({ barril, isNew, onClose, onSave, onDelete }: BarrilModalProps) {
  const [form, setForm] = useState({
    numero: "",
    tipo: "50L" as BarrilTipo,
    status: "Vazio" as BarrilStatus,
    lote: "",
    local: "",
    data_entrega: "",
    data_recolha: "",
    observacao: "",
  });
  const [historico, setHistorico] = useState<HistoricoBarril[]>([]);
  const [tab, setTab] = useState<"editar" | "historico">("editar");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (barril) {
      setForm({
        numero: barril.numero || "",
        tipo: barril.tipo,
        status: barril.status,
        lote: barril.lote || "",
        local: barril.local || "",
        data_entrega: barril.data_entrega || "",
        data_recolha: barril.data_recolha || "",
        observacao: barril.observacao || "",
      });
      fetch(`/api/historico/${barril.id}`)
        .then((r) => r.json())
        .then(setHistorico)
        .catch(() => {});
    }
  }, [barril]);

  const handleSave = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">
            {isNew ? "Novo Barril" : `Barril ${barril?.numero || barril?.id.slice(0, 8)}`}
          </h2>
          <button onClick={onClose} className="text-white/80 hover:text-white text-2xl leading-none">
            &times;
          </button>
        </div>

        {!isNew && (
          <div className="flex border-b">
            <button
              onClick={() => setTab("editar")}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                tab === "editar"
                  ? "text-purple-700 border-b-2 border-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Editar
            </button>
            <button
              onClick={() => setTab("historico")}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                tab === "historico"
                  ? "text-purple-700 border-b-2 border-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Historico ({historico.length})
            </button>
          </div>
        )}

        <div className="overflow-y-auto p-6" style={{ maxHeight: "60vh" }}>
          {tab === "editar" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Numero</label>
                  <input
                    type="text"
                    value={form.numero}
                    onChange={(e) => setForm({ ...form, numero: e.target.value })}
                    placeholder="Opcional"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value as BarrilTipo })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="50L">50L</option>
                    <option value="30L">30L</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as BarrilStatus })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Fora">Fora</option>
                    <option value="Fábrica">Fabrica</option>
                    <option value="Vazio">Vazio</option>
                    <option value="Cheio">Cheio</option>
                    <option value="Aberto">Aberto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lote</label>
                  <input
                    type="text"
                    value={form.lote}
                    onChange={(e) => setForm({ ...form, lote: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Local</label>
                <input
                  type="text"
                  value={form.local}
                  onChange={(e) => setForm({ ...form, local: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data Entrega
                  </label>
                  <input
                    type="date"
                    value={form.data_entrega}
                    onChange={(e) => setForm({ ...form, data_entrega: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data Recolha
                  </label>
                  <input
                    type="date"
                    value={form.data_recolha}
                    onChange={(e) => setForm({ ...form, data_recolha: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observacao</label>
                <textarea
                  value={form.observacao}
                  onChange={(e) => setForm({ ...form, observacao: e.target.value })}
                  rows={3}
                  placeholder="Ex: 40L, 20L, etc."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-2.5 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50"
                >
                  {saving ? "Salvando..." : "Salvar"}
                </button>
                {!isNew && onDelete && (
                  <button
                    onClick={() => onDelete(barril!.id)}
                    className="px-4 py-2.5 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
                  >
                    Excluir
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {historico.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">Nenhum historico encontrado</p>
              ) : (
                historico.map((h) => (
                  <div key={h.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-purple-700">
                        {campoLabels[h.campo] || h.campo}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(h.data_alteracao).toLocaleString("pt-BR")}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {h.valor_antigo && (
                        <span className="line-through text-red-400 mr-2">{h.valor_antigo}</span>
                      )}
                      <span className="text-green-600 font-medium">{h.valor_novo}</span>
                    </div>
                    {h.usuario && (
                      <p className="text-xs text-gray-400 mt-1">por {h.usuario}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
