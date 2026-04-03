"use client";

import { useState, useRef } from "react";

interface ImportModalProps {
  onClose: () => void;
  onImported: () => void;
}

export default function ImportModal({ onClose, onImported }: ImportModalProps) {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/barris/import", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setResult(`${data.imported} barris importados com sucesso!`);
        onImported();
      } else {
        setResult(`Erro: ${data.error}`);
      }
    } catch {
      setResult("Erro ao importar arquivo");
    }
    setUploading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="bg-gradient-to-r from-green-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-bold">Importar Barris</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white text-2xl leading-none">
            &times;
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-sm text-purple-700">
            <p className="font-medium mb-2">Formato esperado (CSV ou Excel):</p>
            <p className="text-xs font-mono">
              numero, tipo, status, lote, local, data_entrega, data_recolha, observacao
            </p>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
          />

          {result && (
            <div
              className={`p-3 rounded-lg text-sm ${
                result.includes("Erro")
                  ? "bg-red-50 text-red-700"
                  : "bg-green-50 text-green-700"
              }`}
            >
              {result}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-2.5 rounded-lg font-medium hover:from-green-700 hover:to-green-800 disabled:opacity-50"
            >
              {uploading ? "Importando..." : "Importar"}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
