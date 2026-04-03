"use client";

import { useState, useEffect, useCallback } from "react";
import { Barril, BarrilStatus, BarrilTipo } from "@/lib/types";
import Dashboard from "@/components/Dashboard";
import BarrilModal from "@/components/BarrilModal";
import ImportModal from "@/components/ImportModal";

const statusColors: Record<BarrilStatus, string> = {
  Fora: "bg-red-100 text-red-700",
  "Fábrica": "bg-purple-100 text-purple-700",
  Vazio: "bg-yellow-100 text-yellow-700",
  Cheio: "bg-green-100 text-green-700",
  Aberto: "bg-blue-100 text-blue-700",
};

export default function Home() {
  const [barris, setBarris] = useState<Barril[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [filterLocal, setFilterLocal] = useState("");
  const [selectedBarril, setSelectedBarril] = useState<Barril | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const fetchBarris = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterStatus) params.set("status", filterStatus);
    if (filterTipo) params.set("tipo", filterTipo);
    if (filterLocal) params.set("local", filterLocal);

    try {
      const res = await fetch(`/api/barris?${params}`);
      const data = await res.json();
      setBarris(Array.isArray(data) ? data : []);
    } catch {
      setBarris([]);
    }
    setLoading(false);
  }, [filterStatus, filterTipo, filterLocal]);

  useEffect(() => {
    fetchBarris();
  }, [fetchBarris]);

  const handleSaveNew = async (data: Partial<Barril>) => {
    await fetch("/api/barris", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setShowNewModal(false);
    fetchBarris();
  };

  const handleSaveEdit = async (data: Partial<Barril>) => {
    if (!selectedBarril) return;
    await fetch(`/api/barris/${selectedBarril.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSelectedBarril(null);
    fetchBarris();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este barril?")) return;
    await fetch(`/api/barris/${id}`, { method: "DELETE" });
    setSelectedBarril(null);
    fetchBarris();
  };

  return (
    <div className="space-y-6">
      <Dashboard barris={barris} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 flex-wrap flex-1">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Todos os Status</option>
              <option value="Fora">Fora</option>
              <option value="Fábrica">Fabrica</option>
              <option value="Vazio">Vazio</option>
              <option value="Cheio">Cheio</option>
              <option value="Aberto">Aberto</option>
            </select>

            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Todos os Tipos</option>
              <option value="50L">50L</option>
              <option value="30L">30L</option>
            </select>

            <input
              type="text"
              value={filterLocal}
              onChange={(e) => setFilterLocal(e.target.value)}
              placeholder="Filtrar por local..."
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowImport(true)}
              className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors"
            >
              Importar
            </button>
            <button
              onClick={() => setShowNewModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg text-sm font-medium hover:from-green-700 hover:to-green-800 transition-all"
            >
              + Novo Barril
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">Carregando...</div>
        ) : barris.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p className="text-lg mb-2">Nenhum barril encontrado</p>
            <p className="text-sm">Adicione barris ou importe de uma planilha</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Numero</th>
                  <th className="text-left px-4 py-3 font-medium">Tipo</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Local</th>
                  <th className="text-left px-4 py-3 font-medium">Lote</th>
                  <th className="text-left px-4 py-3 font-medium">Entrega</th>
                  <th className="text-left px-4 py-3 font-medium">Recolha</th>
                  <th className="text-left px-4 py-3 font-medium">Observacao</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {barris.map((barril) => (
                  <tr
                    key={barril.id}
                    onClick={() => setSelectedBarril(barril)}
                    className="hover:bg-purple-50/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {barril.numero || (
                        <span className="text-gray-400 italic">s/n</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          barril.tipo === "50L"
                            ? "bg-green-100 text-green-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {barril.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[barril.status]}`}
                      >
                        {barril.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{barril.local || "-"}</td>
                    <td className="px-4 py-3 text-gray-600">{barril.lote || "-"}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {barril.data_entrega
                        ? new Date(barril.data_entrega).toLocaleDateString("pt-BR")
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {barril.data_recolha
                        ? new Date(barril.data_recolha).toLocaleDateString("pt-BR")
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[160px]">
                      {barril.observacao ? (
                        <span className="truncate block" title={barril.observacao}>
                          {barril.observacao}
                        </span>
                      ) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showNewModal && (
        <BarrilModal
          barril={null}
          isNew={true}
          onClose={() => setShowNewModal(false)}
          onSave={handleSaveNew}
        />
      )}

      {selectedBarril && (
        <BarrilModal
          barril={selectedBarril}
          isNew={false}
          onClose={() => setSelectedBarril(null)}
          onSave={handleSaveEdit}
          onDelete={handleDelete}
        />
      )}

      {showImport && (
        <ImportModal
          onClose={() => setShowImport(false)}
          onImported={fetchBarris}
        />
      )}
    </div>
  );
}
