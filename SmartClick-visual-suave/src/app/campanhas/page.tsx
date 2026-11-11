'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/MainLayout';
import { Campaign } from '@/types';
import { getCampaigns, saveCampaigns } from '@/utils/storage';
import { VISUAL_THEMES } from '@/constants/themes';
import {
  Layers,
  Plus,
  Calendar,
  RotateCcw,
  Trash2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export default function CampaignsListPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    setCampaigns(getCampaigns());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir esta campanha?')) {
      const updated = campaigns.filter((c) => c.id !== id);
      setCampaigns(updated);
      saveCampaigns(updated);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Minhas Campanhas
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500">
              Histórico de encartes gerados. Você pode repetir, duplicar ou baixar novamente.
            </p>
          </div>

          <Link
            href="/campanhas/nova"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Criar novo encarte</span>
          </Link>
        </div>

        {/* Lista */}
        {campaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map((camp) => {
              const theme = VISUAL_THEMES[camp.themeId] || VISUAL_THEMES.promocao;
              return (
                <div
                  key={camp.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div
                      className="h-14 rounded-xl p-3 text-white flex items-center justify-between"
                      style={{ background: theme.headerBackground }}
                    >
                      <span className="font-extrabold text-sm uppercase truncate">
                        {camp.title}
                      </span>
                      <span className="text-[10px] bg-black/25 px-2 py-0.5 rounded-full font-bold">
                        {camp.items.length} itens
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {camp.startDate} até {camp.endDate}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Formatos salvos: Stories, Feed, Impresso A4
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={`/campanhas/nova?duplicate=${camp.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-800"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Repetir Campanha</span>
                    </Link>

                    <button
                      onClick={() => handleDelete(camp.id)}
                      className="text-slate-400 hover:text-red-600 p-1 rounded"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
            <Layers className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">
              Nenhuma campanha criada ainda
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Selecione produtos do seu catálogo ou importe uma planilha para gerar seu encarte agora.
            </p>
            <Link
              href="/campanhas/nova"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-200"
            >
              <Plus className="w-4 h-4" />
              <span>Criar Primeiro Encarte</span>
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
