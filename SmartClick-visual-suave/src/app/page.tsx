'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HomeCarousel } from '@/components/HomeCarousel';
import { MainLayout } from '@/components/MainLayout';
import { ImportModal } from '@/components/ImportModal';
import { Campaign, Product } from '@/types';
import { getCampaigns, getProducts, addProducts } from '@/utils/storage';
import { VISUAL_THEMES } from '@/constants/themes';
import {
  Upload,
  PlusCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Tag,
  CheckCircle2,
  Package,
} from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [capitalizedMonth, setCapitalizedMonth] = useState('Novembro');

  useEffect(() => {
    setProducts(getProducts());
    setCampaigns(getCampaigns());
    const currentMonthName = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date());
    setCapitalizedMonth(currentMonthName.charAt(0).toUpperCase() + currentMonthName.slice(1));
  }, []);

  const handleImportConfirmed = (newProds: Product[]) => {
    const updated = addProducts(newProds);
    setProducts(updated);
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Boas-vindas e Chamada Principal */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Seu próximo encarte começa aqui.
          </h1>
          <p className="text-sm sm:text-base font-medium text-slate-600">
            Escolha uma ideia ou importe sua lista de produtos.
          </p>
        </div>

        <HomeCarousel onImport={() => setIsImportModalOpen(true)} />
        <div className="sc-shortcuts">
          <button onClick={() => setIsImportModalOpen(true)}><span className="sc-clay"><Upload /></span><span>Importar lista<small>Excel ou CSV</small></span></button>
          <Link href="/campanhas/nova"><span className="sc-clay mint"><PlusCircle /></span><span>Criar encarte<small>Sem complicar</small></span></Link>
          <Link href="/sugestoes"><span className="sc-clay peach"><Sparkles /></span><span>Encontrar ideias<small>Inspire sua campanha</small></span></Link>
        </div>
        {/* Ideias para o Mês Atual */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-6 rounded-full bg-purple-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Ideias para {capitalizedMonth}
              </h2>
            </div>
            <Link
              href="/sugestoes"
              className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              <span>Ver todas as ideias</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(VISUAL_THEMES)
              .slice(0, 3)
              .map((theme) => (
                <div
                  key={theme.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div
                      className="h-14 rounded-xl p-3 text-white flex items-center justify-between"
                      style={{ background: theme.headerBackground }}
                    >
                      <span className="font-black text-sm uppercase drop-shadow-sm">
                        {theme.name}
                      </span>
                      <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                        Sugerido
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">{theme.subtitle}</p>
                  </div>

                  <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-500">
                      Cores e selo prontos
                    </span>
                    <Link
                      href={`/campanhas/nova?theme=${theme.id}&new=${Date.now()}-${theme.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl transition-colors"
                    >
                      <span>Usar modelo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* Continue de onde parou */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-6 rounded-full bg-slate-400" />
              <h2 className="text-lg font-bold text-slate-900">Continue de onde parou</h2>
            </div>
            <Link
              href="/campanhas"
              className="text-xs font-bold text-purple-600 hover:text-purple-700"
            >
              Ver histórico
            </Link>
          </div>

          {campaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaigns.slice(0, 2).map((camp) => {
                const theme = VISUAL_THEMES[camp.themeId] || VISUAL_THEMES.promocao;
                return (
                  <div
                    key={camp.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between"
                  >
                    <div className="space-y-1 max-w-[65%]">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: theme.primaryColor }}
                        />
                        <h3 className="font-bold text-sm text-slate-900 truncate">
                          {camp.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500">
                        {camp.items.length} produtos • Modelos: {camp.formats.join(', ')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/campanhas/${camp.id}`}
                        className="inline-flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Repetir</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-slate-200/80 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                <Tag className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-800">
                Nenhum encarte gerado ainda
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Você já possui {products.length} produtos cadastrados no catálogo prontos para gerar
                seu primeiro encarte de ofertas.
              </p>
              <Link
                href="/campanhas/nova"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-200"
              >
                <span>Criar primeiro encarte</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </section>

        {/* Modal de Importação */}
        <ImportModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          existingProducts={products}
          onImportConfirmed={handleImportConfirmed}
        />
      </div>
    </MainLayout>
  );
}
