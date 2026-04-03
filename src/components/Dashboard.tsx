"use client";

import { Barril } from "@/lib/types";

interface DashboardProps {
  barris: Barril[];
}

const statusConfig: Record<string, { bg: string; text: string; border: string }> = {
  Fora: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  "Fábrica": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  Vazio: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
  Cheio: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  Aberto: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
};

export default function Dashboard({ barris }: DashboardProps) {
  const contagem = {
    total: barris.length,
    "50L": barris.filter((b) => b.tipo === "50L").length,
    "30L": barris.filter((b) => b.tipo === "30L").length,
    Fora: barris.filter((b) => b.status === "Fora").length,
    "Fábrica": barris.filter((b) => b.status === "Fábrica").length,
    Vazio: barris.filter((b) => b.status === "Vazio").length,
    Cheio: barris.filter((b) => b.status === "Cheio").length,
    Aberto: barris.filter((b) => b.status === "Aberto").length,
  };

  const foraHaMuitoTempo = barris.filter((b) => {
    if (b.status !== "Fora" || !b.data_entrega) return false;
    const diff = Date.now() - new Date(b.data_entrega).getTime();
    return diff > 30 * 24 * 60 * 60 * 1000;
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-gradient-to-br from-green-600 to-purple-600 text-white rounded-xl p-4 shadow">
          <p className="text-2xl font-bold">{contagem.total}</p>
          <p className="text-sm opacity-80">Total</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow border border-green-200">
          <p className="text-2xl font-bold text-green-700">{contagem["50L"]}</p>
          <p className="text-sm text-gray-500">50L</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow border border-purple-200">
          <p className="text-2xl font-bold text-purple-700">{contagem["30L"]}</p>
          <p className="text-sm text-gray-500">30L</p>
        </div>
        {(["Fora", "Fábrica", "Vazio", "Cheio", "Aberto"] as const).map((s) => {
          const cfg = statusConfig[s];
          return (
            <div key={s} className={`${cfg.bg} rounded-xl p-4 shadow border ${cfg.border}`}>
              <p className={`text-2xl font-bold ${cfg.text}`}>{contagem[s]}</p>
              <p className="text-sm text-gray-500">{s}</p>
            </div>
          );
        })}
      </div>

      {foraHaMuitoTempo.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700 font-semibold text-sm">
            Alerta: {foraHaMuitoTempo.length} barri{foraHaMuitoTempo.length === 1 ? "l" : "s"} fora
            ha mais de 30 dias
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {foraHaMuitoTempo.slice(0, 10).map((b) => (
              <span key={b.id} className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                {b.numero || b.id.slice(0, 8)}
              </span>
            ))}
            {foraHaMuitoTempo.length > 10 && (
              <span className="text-red-500 text-xs py-1">
                +{foraHaMuitoTempo.length - 10} mais
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
