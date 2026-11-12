'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Leaf, Beef, Droplets, Zap, Gift } from 'lucide-react';
import { BADGES } from '@/constants/badges';
import { MainLayout } from '@/components/MainLayout';
import { VISUAL_THEMES } from '@/constants/themes';
import {
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShoppingBag,
  Flame,
} from 'lucide-react';

interface MonthlyIdea {
  id: string;
  themeId: keyof typeof VISUAL_THEMES;
  title: string;
  subtitle: string;
  recommendedCategory: string;
  bestFor: string;
  tag: string;
}

const MONTHLY_SUGGESTIONS: MonthlyIdea[] = [
  {
    id: 'sug-1',
    themeId: 'ofertas-da-semana',
    title: 'Ofertas da Semana Imbatíveis',
    subtitle: 'Alavanca o giro dos produtos básicos essenciais',
    recommendedCategory: 'Mercearia básica e Laticínios',
    bestFor: 'Segunda a Quarta',
    tag: 'Semanal',
  },
  {
    id: 'sug-2',
    themeId: 'feirinha',
    title: 'Terça e Quarta da Feira',
    subtitle: 'Frutas, legumes e verduras selecionados com preço de produtor',
    recommendedCategory: 'Hortifruti',
    bestFor: 'Meio de semana',
    tag: 'Hortifruti',
  },
  {
    id: 'sug-3',
    themeId: 'acougue',
    title: 'Sexta e Sábado do Churrasco',
    subtitle: 'Cortes nobres e aves com descontos especiais para o churrasco',
    recommendedCategory: 'Açougue e Aves',
    bestFor: 'Sexta e Sábado',
    tag: 'Fim de Semana',
  },
  {
    id: 'sug-4',
    themeId: 'limpeza',
    title: 'Festival da Casa Limpa',
    subtitle: 'Descontos em detergentes, amaciantes e itens de higiene',
    recommendedCategory: 'Limpeza e Higiene',
    bestFor: 'Início de mês',
    tag: 'Especial',
  },
  {
    id: 'sug-5',
    themeId: 'ofertas-do-dia',
    title: 'Derruba Preço Só Hoje',
    subtitle: 'Promoção relâmpago de alta conversão para WhatsApp',
    recommendedCategory: 'Bebidas e Biscoitos',
    bestFor: 'Hoje',
    tag: 'Relâmpago',
  },
  {
    id: 'sug-6',
    themeId: 'black-friday',
    title: 'Black Friday de Ofertas',
    subtitle: 'Queima anual de estoque e super descontos comerciais',
    recommendedCategory: 'Todas as categorias',
    bestFor: 'Novembro',
    tag: 'Sazonal',
  },
  {
    id: 'sug-7',
    themeId: 'natal',
    title: 'Natal da Família e Ofertas',
    subtitle: 'Itens de ceia, panetones, aves e bebidas festivas',
    recommendedCategory: 'Ceia e Bebidas',
    bestFor: 'Dezembro',
    tag: 'Festivo',
  },
  {
    id: 'sug-8',
    themeId: 'reveillon',
    title: 'Brinde de Réveillon',
    subtitle: 'Espumantes, carnes e frios para a virada de ano',
    recommendedCategory: 'Bebidas e Frios',
    bestFor: 'Fim de Ano',
    tag: 'Celebração',
  },
];

export default function SuggestionsPage() {
  const [capitalizedMonth, setCapitalizedMonth] = useState('Novembro');

  useEffect(() => {
    const currentMonthName = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date());
    setCapitalizedMonth(currentMonthName.charAt(0).toUpperCase() + currentMonthName.slice(1));
  }, []);

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold">
            <Calendar className="w-3.5 h-3.5" />
            <span>Calendário Sazonal do Varejo</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Sugestões do Mês • {capitalizedMonth}
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500">
            Campanhas planejadas com base no calendário de consumo dos mercados de bairro.
          </p>
        </div>

        {/* Grade de Campanhas Sugeridas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {new Date().getMonth()===10&&['premium','marinho','grafite'].map((preset,i)=><div key={preset} className="bg-white rounded-2xl p-5 border space-y-3"><div style={{background:['#202020','#173553','#34383f'][i],borderRadius:12,padding:16}}><img src={BADGES.find(b=>b.file==='08-black-friday.png')!.url} alt="Black Friday" style={{width:'100%',height:130,objectFit:'contain'}}/></div><h3 className="font-bold">Black Friday · {['Dourado','Marinho','Grafite'][i]}</h3><p className="text-xs">Selo e fundo prontos. Você escolhe os produtos, preços e validade.</p><Link className="block text-purple-600 font-bold text-sm" href={'/campanhas/nova?theme=black-friday&preset='+preset+'&new='+Date.now()+'-'+preset}>Usar este estilo →</Link></div>)}
          {MONTHLY_SUGGESTIONS.map((sug) => {
            const theme = VISUAL_THEMES[sug.themeId]; const Icon=({feirinha:Leaf,acougue:Beef,limpeza:Droplets,'ofertas-do-dia':Zap,natal:Gift} as Record<string,typeof Package>)[sug.themeId]||Package;
            return (
              <div
                key={sug.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div
                    className="h-16 rounded-xl p-3.5 text-white flex items-center justify-between shadow-sm"
                    style={{ background: theme.headerBackground }}
                  >
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider opacity-90 block">
                        {theme.name}
                      </span>
                      <h3 className="font-extrabold text-sm leading-tight drop-shadow-sm">
                        <span className="sc-clay" style={{float:'right',marginLeft:10}}><Icon /></span>{sug.title}
                      </h3>
                    </div>
                    <span className="text-[10px] bg-black/25 px-2.5 py-1 rounded-full font-bold shrink-0">
                      {sug.tag}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{sug.subtitle}</p>

                  <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 text-[11px] border border-slate-100">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400 font-medium">Ideal para:</span>
                      <span className="font-bold text-slate-800">{sug.bestFor}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400 font-medium">Categorias:</span>
                      <span className="font-bold text-purple-700">{sug.recommendedCategory}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400">
                    Usa seus produtos atuais
                  </span>
                  <Link
                    href={`/campanhas/nova?theme=${sug.themeId}&new=${Date.now()}-${sug.id}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-200 transition-colors"
                  >
                    <span>Criar Campanha</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
