import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Manza Bebidas - Gestão de Barris",
  description: "Sistema de gestão de barris de bebidas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 min-h-screen">
        <header className="bg-gradient-to-r from-green-700 to-purple-700 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-xl font-bold">
                M
              </div>
              <div>
                <h1 className="text-xl font-bold">Manza Bebidas</h1>
                <p className="text-green-200 text-xs">Gestão de Barris</p>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
