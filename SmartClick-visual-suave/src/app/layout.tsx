import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartClick - Sua lista vira um encarte",
  description: "Plataforma profissional para geração automática de encartes de ofertas.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-[#F8F9FC] text-slate-900">
        {children}
      </body>
    </html>
  );
}
