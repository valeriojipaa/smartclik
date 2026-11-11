'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/MainLayout';
import { FlyerCanvas } from '@/components/FlyerCanvas';
import {
  Campaign,
  CampaignItem,
  FlyerFormat,
  Product,
  StoreProfile,
  VisualThemeId,
} from '@/types';
import { VISUAL_THEMES, PROMO_BADGES } from '@/constants/themes';
import {
  getProducts,
  getStoreProfile,
  saveCampaign,
  getCampaigns,
} from '@/utils/storage';
import { chunkItemsByFormat } from '@/utils/layoutEngine';
import { exportElementToPng, exportElementsToPdf } from '@/utils/exportHelper';
import { formatCurrencyBRL } from '@/utils/importHelper';
import {
  ArrowLeft,
  Download,
  FileDown,
  Sparkles,
  Check,
  Plus,
  Trash2,
  Settings2,
  Smartphone,
  Share2,
  FileText,
  Eye,
  ChevronRight,
  AlertCircle,
  Copy,
} from 'lucide-react';

function CampaignEditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTheme = (searchParams.get('theme') as VisualThemeId) || 'promocao';
  const duplicateId = searchParams.get('duplicate');

  const [store, setStore] = useState<StoreProfile>(getStoreProfile());
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [title, setTitle] = useState('Super Ofertas da Semana');
  const [themeId, setThemeId] = useState<VisualThemeId>(initialTheme);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [selectedFormat, setSelectedFormat] = useState<FlyerFormat>('stories');
  const [campaignItems, setCampaignItems] = useState<CampaignItem[]>([]);
  const [hasStockLimit, setHasStockLimit] = useState(true);
  const [hasIllustrativeImagesNotice, setHasIllustrativeImagesNotice] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');

  const pagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prods = getProducts();
    setAllProducts(prods);
    setStore(getStoreProfile());

    if (duplicateId) {
      const existing = getCampaigns().find((c) => c.id === duplicateId);
      if (existing) {
        setTitle(`${existing.title} (Cópia)`);
        setThemeId(existing.themeId);
        setCampaignItems(existing.items);
        return;
      }
    }

    // Carregar inicialmente os primeiros 6 produtos do catálogo se não houver duplicata
    if (prods.length > 0 && campaignItems.length === 0) {
      const initialItems: CampaignItem[] = prods.slice(0, 6).map((p) => ({
        id: `ci-${Date.now()}-${p.id}`,
        productId: p.id,
        product: p,
        promoPrice: Number((p.currentPrice * 0.85).toFixed(2)), // 15% de desconto promocional
        regularPrice: p.currentPrice,
        highlightBadge: '',
      }));
      setCampaignItems(initialItems);
    }
  }, [duplicateId]);

  const activeTheme = VISUAL_THEMES[themeId] || VISUAL_THEMES.promocao;
  const pages = chunkItemsByFormat(campaignItems, selectedFormat);

  // Ações de itens
  const handleAddItem = (product: Product) => {
    if (campaignItems.some((ci) => ci.productId === product.id)) {
      alert('Este produto já está incluído na campanha.');
      return;
    }
    const newItem: CampaignItem = {
      id: `ci-${Date.now()}-${product.id}`,
      productId: product.id,
      product,
      promoPrice: Number((product.currentPrice * 0.85).toFixed(2)),
      regularPrice: product.currentPrice,
      highlightBadge: '',
    };
    setCampaignItems([...campaignItems, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setCampaignItems(campaignItems.filter((i) => i.id !== id));
  };

  const handleUpdateItem = (id: string, updates: Partial<CampaignItem>) => {
    setCampaignItems(
      campaignItems.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  // Salvar Campanha
  const handleSave = () => {
    const newCampaign: Campaign = {
      id: `camp-${Date.now()}`,
      storeId: store.id,
      title,
      themeId,
      startDate,
      endDate,
      items: campaignItems,
      formats: ['stories', 'feed', 'a4'],
      hasStockLimit,
      hasIllustrativeImagesNotice,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveCampaign(newCampaign);
    alert('Campanha salva com sucesso!');
  };

  // Exportação PNG
  const handleExportPngPage = async (pageIndex: number) => {
    const el = document.getElementById(`flyer-page-${pageIndex}`);
    if (!el) return;
    setIsExporting(true);
    setExportMessage(`Gerando imagem de alta resolução da página ${pageIndex + 1}...`);
    try {
      const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      await exportElementToPng(
        el,
        `smartclick_${cleanTitle}_${selectedFormat}_pag_${pageIndex + 1}`
      );
    } catch {
      alert('Erro ao exportar imagem. Tente novamente.');
    } finally {
      setIsExporting(false);
      setExportMessage('');
    }
  };

  const handleExportAllPng = async () => {
    setIsExporting(true);
    setExportMessage('Gerando todas as páginas em alta resolução...');
    try {
      const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      for (let i = 0; i < pages.length; i++) {
        const el = document.getElementById(`flyer-page-${i}`);
        if (el) {
          await exportElementToPng(
            el,
            `smartclick_${cleanTitle}_${selectedFormat}_pag_${i + 1}`
          );
        }
      }
    } catch {
      alert('Erro ao exportar páginas.');
    } finally {
      setIsExporting(false);
      setExportMessage('');
    }
  };

  // Exportação PDF
  const handleExportPdf = async () => {
    setIsExporting(true);
    setExportMessage('Gerando documento PDF com todas as páginas...');
    try {
      const elements: HTMLElement[] = [];
      for (let i = 0; i < pages.length; i++) {
        const el = document.getElementById(`flyer-page-${i}`);
        if (el) elements.push(el);
      }
      const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      await exportElementsToPdf(
        elements,
        `smartclick_${cleanTitle}_${selectedFormat}_completo`,
        selectedFormat
      );
    } catch {
      alert('Erro ao exportar PDF.');
    } finally {
      setIsExporting(false);
      setExportMessage('');
    }
  };

  return (
    <MainLayout>
      <div className="max-w-[1500px] mx-auto px-4 py-6 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="font-black text-xl text-slate-900 border-b border-dashed border-slate-300 hover:border-purple-600 focus:border-purple-600 outline-none pb-0.5"
                />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {campaignItems.length} produtos selecionados • {pages.length} página(s) geradas no formato atual
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={handleSave}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition-colors"
            >
              Salvar Campanha
            </button>

            <button
              onClick={handleExportAllPng}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-200 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Todas (PNG)</span>
            </button>

            <button
              onClick={handleExportPdf}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors disabled:opacity-50"
            >
              <FileDown className="w-4 h-4 text-red-400" />
              <span>Baixar PDF</span>
            </button>
          </div>
        </div>

        {/* Notificação de Processamento de Exportação */}
        {isExporting && (
          <div className="bg-purple-100 border border-purple-300 text-purple-900 px-4 py-3 rounded-2xl flex items-center gap-3 animate-pulse">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="text-xs font-bold">{exportMessage}</span>
          </div>
        )}

        {/* Main Grid: Lateral de Edição e Central de Prévia */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* PAINEL ESQUERDO: CONFIGURAÇÃO DOS PRODUTOS E PREÇOS */}
          <div className="lg:col-span-5 space-y-5">
            {/* 1. Escolha do Formato e Tema */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                1. Formato e Tema Visual
              </h3>

              {/* Formatos com proporção */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSelectedFormat('stories')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    selectedFormat === 'stories'
                      ? 'border-purple-600 bg-purple-50/50 text-purple-700 font-bold shadow-sm'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600 font-medium'
                  }`}
                >
                  <Smartphone className="w-5 h-5 mb-1" />
                  <span className="text-xs">Stories / Zap</span>
                  <span className="text-[10px] text-slate-400 font-normal">1080×1920</span>
                </button>

                <button
                  onClick={() => setSelectedFormat('feed')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    selectedFormat === 'feed'
                      ? 'border-purple-600 bg-purple-50/50 text-purple-700 font-bold shadow-sm'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600 font-medium'
                  }`}
                >
                  <Share2 className="w-5 h-5 mb-1" />
                  <span className="text-xs">Feed</span>
                  <span className="text-[10px] text-slate-400 font-normal">1080×1350</span>
                </button>

                <button
                  onClick={() => setSelectedFormat('a4')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    selectedFormat === 'a4'
                      ? 'border-purple-600 bg-purple-50/50 text-purple-700 font-bold shadow-sm'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600 font-medium'
                  }`}
                >
                  <FileText className="w-5 h-5 mb-1" />
                  <span className="text-xs">Impresso A4</span>
                  <span className="text-[10px] text-slate-400 font-normal">210×297mm</span>
                </button>
              </div>

              {/* Seletor de Modelo Visual (10 Modelos) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Modelo Visual (10 Opções)
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {Object.values(VISUAL_THEMES).map((thm) => (
                    <button
                      key={thm.id}
                      onClick={() => setThemeId(thm.id)}
                      className={`text-left p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                        themeId === thm.id
                          ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-600/20'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: thm.primaryColor }}
                          />
                          <span className="text-xs font-extrabold text-slate-900 leading-tight">
                            {thm.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-600 line-clamp-1">
                          {thm.badgeDefault}
                        </span>
                      </div>
                      {themeId === thm.id && (
                        <Check className="w-4 h-4 text-purple-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Datas de Validade */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Válido a partir de
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Até
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-purple-600"
                  />
                </div>
              </div>
            </div>

            {/* 2. Gerenciador de Produtos da Campanha */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  2. Itens e Preços Confirmados ({campaignItems.length})
                </h3>
              </div>

              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {campaignItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-[10px]">
                          {index + 1}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900 leading-tight">
                            {item.product.name}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {item.product.packageContent} • Por {item.product.saleUnit}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-slate-400 hover:text-red-600 p-1 rounded"
                        title="Remover da campanha"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Preços: De / Por */}
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60">
                      <div>
                        <label className="block text-[10px] font-medium text-slate-500">
                          Preço Anterior (De)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.regularPrice || ''}
                          onChange={(e) =>
                            handleUpdateItem(item.id, {
                              regularPrice: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs outline-none focus:border-purple-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-purple-700">
                          Preço Oferta (Por) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.promoPrice}
                          onChange={(e) =>
                            handleUpdateItem(item.id, {
                              promoPrice: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full px-2 py-1 bg-white border border-purple-300 font-black text-purple-900 rounded text-xs outline-none focus:border-purple-600"
                        />
                      </div>
                    </div>

                    {/* Selo e Condição Opcional */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-medium text-slate-500">
                          Selo Destaque
                        </label>
                        <select
                          value={item.highlightBadge || ''}
                          onChange={(e) =>
                            handleUpdateItem(item.id, { highlightBadge: e.target.value })
                          }
                          className="w-full px-1.5 py-1 bg-white border border-slate-200 rounded text-[11px] outline-none"
                        >
                          <option value="">Nenhum</option>
                          {PROMO_BADGES.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-slate-500">
                          Limite cliente
                        </label>
                        <input
                          type="number"
                          placeholder="Ex: 5"
                          value={item.limitPerCustomer || ''}
                          onChange={(e) =>
                            handleUpdateItem(item.id, {
                              limitPerCustomer: parseInt(e.target.value) || undefined,
                            })
                          }
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Adicionar Mais Produtos do Catálogo */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Adicionar do catálogo:
                </label>
                <div className="flex gap-2">
                  <select
                    id="product-picker"
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none"
                  >
                    {allProducts
                      .filter((p) => !campaignItems.some((ci) => ci.productId === p.id))
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({formatCurrencyBRL(p.currentPrice)})
                        </option>
                      ))}
                  </select>
                  <button
                    onClick={() => {
                      const sel = document.getElementById(
                        'product-picker'
                      ) as HTMLSelectElement;
                      if (!sel?.value) return;
                      const prod = allProducts.find((p) => p.id === sel.value);
                      if (prod) handleAddItem(prod);
                    }}
                    className="px-3.5 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Incluir</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Rodapé Legal e Condições */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                3. Condições Legais do Rodapé
              </h3>

              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={hasStockLimit}
                    onChange={(e) => setHasStockLimit(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>Incluir: &ldquo;Válido enquanto durarem os estoques&rdquo;</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={hasIllustrativeImagesNotice}
                    onChange={(e) => setHasIllustrativeImagesNotice(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>Incluir: &ldquo;Fotos meramente ilustrativas&rdquo;</span>
                </label>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Texto Legal Adicional da Loja
                  </label>
                  <textarea
                    rows={2}
                    value={store.footerLegalText || ''}
                    onChange={(e) => setStore({ ...store, footerLegalText: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-purple-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* PAINEL DIREITO: PRÉVIA REAL EM ALTA DEFINIÇÃO E DOWNLOAD */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-bold text-slate-900">
                  Prévia em Tempo Real ({pages.length} página(s) gerada(s))
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">
                Resolução final preservada a 300 DPI na exportação
              </span>
            </div>

            {/* Container das Páginas Renderizadas */}
            <div
              ref={pagesContainerRef}
              className="flex flex-col items-center gap-8 bg-slate-200/50 p-6 rounded-3xl border border-slate-300/60 overflow-x-auto"
            >
              {pages.map((pageItems, pIndex) => (
                <div key={pIndex} className="flex flex-col items-center gap-3">
                  <div className="flex items-center justify-between w-full max-w-[540px] px-2">
                    <span className="text-xs font-extrabold text-slate-700">
                      Página {pIndex + 1} de {pages.length}
                    </span>
                    <button
                      onClick={() => handleExportPngPage(pIndex)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-300 rounded-lg text-[11px] font-bold text-slate-700 hover:bg-slate-50 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5 text-purple-600" />
                      <span>Baixar esta página (PNG)</span>
                    </button>
                  </div>

                  {/* Canvas do Encarte */}
                  <FlyerCanvas
                    id={`flyer-page-${pIndex}`}
                    theme={activeTheme}
                    store={store}
                    campaignTitle={title}
                    startDate={startDate}
                    endDate={endDate}
                    format={selectedFormat}
                    items={pageItems}
                    pageIndex={pIndex}
                    totalPages={pages.length}
                    hasStockLimit={hasStockLimit}
                    hasIllustrativeImagesNotice={hasIllustrativeImagesNotice}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default function CampaignEditorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Carregando editor...</div>}>
      <CampaignEditorContent />
    </Suspense>
  );
}
