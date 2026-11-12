'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PhotoUpload } from '@/components/PhotoUpload';
import { OptionSection } from '@/components/OptionSection';
import { BackgroundPicker } from '@/components/BackgroundPicker';
import { BadgePicker } from '@/components/BadgePicker';

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
  saveProducts,
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
  const [artwork,setArtwork] = useState<NonNullable<Campaign['artwork']>>({badge:{x:90,y:27,width:360},logo:{x:12,y:8,width:90},identity:'name',italic:false});
  const [backgroundId, setBackgroundId] = useState('original');
  const [badgeUrl, setBadgeUrl] = useState('');
  const [title, setTitle] = useState('Super Ofertas da Semana');
  const [themeId, setThemeId] = useState<VisualThemeId>(initialTheme);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [selectedFormat, setSelectedFormat] = useState<FlyerFormat>('stories');
  const [campaignItems, setCampaignItems] = useState<CampaignItem[]>([]);
  const [hasStockLimit, setHasStockLimit] = useState(false);
  const [hasIllustrativeImagesNotice, setHasIllustrativeImagesNotice] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');

  const sessionId=searchParams.get('new')||searchParams.get('draft')||duplicateId||'current';
  const draftKey='smartclick_campaign_draft_v3_'+sessionId;
  const [pageBreaks,setPageBreaks]=useState<number[]>([]);
  const [draftWarning,setDraftWarning]=useState('');
  const [draftReady, setDraftReady] = useState(false);
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
        setBadgeUrl(existing.badgeUrl || '');if(existing.artwork)setArtwork(existing.artwork);
        setBackgroundId(existing.backgroundId || 'original');
        setCampaignItems(existing.items);setPageBreaks(existing.pageBreaks||[]);
        setDraftReady(true);
        return;
      }
    }

    try { const raw = localStorage.getItem(draftKey); if(raw) {const d=JSON.parse(raw);setTitle(d.title);setThemeId(d.themeId);setBadgeUrl(d.badgeUrl || '');if(d.artwork)setArtwork(d.artwork);setBackgroundId(d.backgroundId || 'original');setStartDate(d.startDate);setEndDate(d.endDate);setCampaignItems(d.items);setPageBreaks(d.pageBreaks||[]);setSelectedFormat(d.selectedFormat==='a5'?'a4':d.selectedFormat||'stories');setDraftReady(true);return;} } catch {}
    const preset=searchParams.get('preset');
    if(searchParams.get('theme')){setThemeId(initialTheme);const files:Record<string,string>={'promocao':'01-promocao.png','ofertas-da-semana':'02-ofertas-da-semana.png','ofertas-do-dia':'03-ofertas-do-dia.png','fim-de-semana':'04-fim-de-semana.png','acougue':'05-acougue.png','feirinha':'06-feirinha.png','limpeza':'07-limpeza.png','black-friday':'08-black-friday.png','natal':'09-natal.png','reveillon':'10-reveillon.png'};setBadgeUrl('https://sihrhmizpigscavtrtyl.supabase.co/storage/v1/object/public/selos/'+files[initialTheme]);setBackgroundId(preset||({'feirinha':'verde','black-friday':'premium','ofertas-da-semana':'azul'}[initialTheme]||'comercial'));setTitle(VISUAL_THEMES[initialTheme]?.name||'Nova campanha');}
    setDraftReady(true);
    // Carregar inicialmente os primeiros 6 produtos do catálogo se não houver duplicata
    if (prods.length > 0 && campaignItems.length === 0) {
      const initialItems: CampaignItem[] = prods.slice(0, 6).map((p) => ({
        id: `ci-${Date.now()}-${p.id}`,
        productId: p.id,
        product: p,
        promoPrice: p.currentPrice,
        regularPrice: undefined,
        highlightBadge: '',
      }));
      setCampaignItems(initialItems);
    }
  }, [duplicateId]);

  useEffect(()=>{if(!draftReady)return;const d={artwork,backgroundId,badgeUrl,title,themeId,startDate,endDate,items:campaignItems,pageBreaks,selectedFormat};try{localStorage.setItem(draftKey,JSON.stringify(d));const index=JSON.parse(localStorage.getItem('smartclick_drafts_index')||'{}');index[sessionId]={title,updatedAt:new Date().toISOString()};localStorage.setItem('smartclick_drafts_index',JSON.stringify(index));setDraftWarning('');}catch{setDraftWarning('Armazenamento cheio: o rascunho não foi salvo. Exporte antes de fechar.');}},[draftReady,draftKey,sessionId,artwork,backgroundId,badgeUrl,title,themeId,startDate,endDate,campaignItems,pageBreaks,selectedFormat]);
  const activeTheme = VISUAL_THEMES[themeId] || VISUAL_THEMES.promocao;
  const starts=[0,...pageBreaks.filter(n=>n>0&&n<campaignItems.length)].sort((a,b)=>a-b);
  const pages=starts.flatMap((start,i)=>chunkItemsByFormat(campaignItems.slice(start,starts[i+1]||campaignItems.length),selectedFormat));
  function addPage(){const base=pages[0]||[];if(!base.length)return;setPageBreaks([...pageBreaks,campaignItems.length]);setCampaignItems([...campaignItems,...base.map((item,i)=>({...item,id:'ci-copy-'+Date.now()+'-'+i}))]);}

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
      promoPrice: product.currentPrice,
      regularPrice: undefined,
      highlightBadge: '',
    };
    setCampaignItems([...campaignItems, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    const pos=campaignItems.findIndex(i=>i.id===id);setPageBreaks(pageBreaks.map(n=>n>pos?n-1:n));setCampaignItems(campaignItems.filter(i=>i.id!==id));
  };

  const handleUpdateItem = (id: string, updates: Partial<CampaignItem>) => {
    setCampaignItems(
      campaignItems.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  // Salvar Campanha
  const handleSave = () => {
    const newCampaign: Campaign = {
      id: `camp-${sessionId}`,
      storeId: store.id,
      title,
      themeId,
      badgeUrl,
      backgroundId,
      artwork,
      pageBreaks,
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
            <section className="bg-white border rounded-2xl p-5 space-y-4">
<h2 className="text-lg font-bold">QUAL FORMATO VOCÊ PRECISA?</h2><div className="grid grid-cols-2 gap-2">{([{id:'stories',name:'Stories',info:'1080 × 1920'},{id:'feed',name:'Feed',info:'1080 × 1350'},{id:'a4',name:'Panfleto · A4',info:'210 × 297 mm'}] as const).map(f=><button key={f.id} type="button" onClick={()=>setSelectedFormat(f.id)} aria-pressed={selectedFormat===f.id} className="border rounded-xl p-3 text-sm" style={{borderColor:selectedFormat===f.id?'#9565c9':'#e8e0ee',background:selectedFormat===f.id?'#f5effb':'white'}}>{f.name}<small className="block text-xs">{f.info}</small></button>)}</div>
<div className="grid grid-cols-2 gap-3"><label className="text-xs">Início das ofertas<input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} className="block border rounded p-2 w-full"/></label><label className="text-xs">Fim das ofertas<input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} className="block border rounded p-2 w-full"/></label></div>
{backgroundId==='none'&&<label className="block text-xs">Cor do texto no cabeçalho<input type="color" value={artwork.textColor||'#202020'} onChange={e=>setArtwork({...artwork,textColor:e.target.value})}/></label>}
</section>
            <OptionSection title="Fundo do encarte"><BackgroundPicker value={backgroundId} onChange={setBackgroundId} /></OptionSection>
            <OptionSection title="LOGOTIPO / NOME">
 <div className="p-4 space-y-4 text-xs">
 <p>Clique no selo ou logotipo na prévia e arraste. Os ajustes ficam na área superior para preservar produtos e rodapé.</p>
 <label className="block">Identificação da loja<select className="border rounded p-2 ml-2" value={artwork.identity} onChange={e=>setArtwork({...artwork,identity:e.target.value})}><option value="name">Nome em texto</option><option value="logo">Logotipo</option></select></label>
 <label className="block"><input type="checkbox" checked={artwork.italic} onChange={e=>setArtwork({...artwork,italic:e.target.checked})}/> Nome em negrito e itálico</label>
 <PhotoUpload label="ENVIAR LOGO" onChange={url=>setArtwork({...artwork,logoUrl:url,identity:'logo'})}/>
 <button type="button" className="border rounded p-2" onClick={async()=>{const src=artwork.logoUrl||store.logoUrl;if(!src){alert('Envie um logotipo primeiro.');return}try{const im=new Image();im.crossOrigin='anonymous';await new Promise<void>((ok,no)=>{im.onload=()=>ok();im.onerror=no;im.src=src});const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const ctx=c.getContext('2d')!;ctx.drawImage(im,0,0);const pixels=ctx.getImageData(0,0,c.width,c.height);const seen=new Uint8Array(c.width*c.height),queue:number[]=[];const add=(i:number)=>{if(seen[i])return;seen[i]=1;const k=i*4;if(pixels.data[k]>235&&pixels.data[k+1]>235&&pixels.data[k+2]>235)queue.push(i)};for(let x=0;x<c.width;x++){add(x);add((c.height-1)*c.width+x)}for(let y=0;y<c.height;y++){add(y*c.width);add(y*c.width+c.width-1)}for(let n=0;n<queue.length;n++){const i=queue[n];pixels.data[i*4+3]=0;if(i%c.width)add(i-1);if(i%c.width<c.width-1)add(i+1);if(i>=c.width)add(i-c.width);if(i<c.width*(c.height-1))add(i+c.width)}ctx.putImageData(pixels,0,0);setArtwork({...artwork,logoUrl:c.toDataURL('image/png'),identity:'logo'});}catch{alert('Envie o arquivo do logo para remover o fundo branco.')}}}>Remover fundo branco do logo</button><p className="text-xs">Remove branco conectado às bordas. Confira o resultado; você pode reenviar o original.</p>
 {(['badge','logo'] as const).map(key=><label key={key} className="block">Tamanho do {key==='badge'?'selo':'logotipo'}<input aria-label={'Tamanho '+key} type="range" min={key==='badge'?100:40} max={key==='badge'?500:200} value={artwork[key].width} className="block w-full" onChange={e=>{const width=Number(e.target.value);setArtwork({...artwork,[key]:{...artwork[key],width,x:Math.min(artwork[key].x,540-width),y:Math.min(artwork[key].y,Math.max(0,165-Math.min(width*.48,165)))}})}}/></label>)}
 <button type="button" className="border rounded p-2" onClick={()=>setArtwork({...artwork,badge:{x:90,y:27,width:360},logo:{x:12,y:8,width:90}})}>Restaurar posições</button>
 </div></OptionSection>
            <OptionSection title="Selo promocional"><BadgePicker value={badgeUrl} onChange={setBadgeUrl} /></OptionSection>
            <OptionSection title={`Produtos e preços (${campaignItems.length})`} open>
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

                    <PhotoUpload onChange={url=>{const product={...item.product,imageUrl:url,notes:undefined};handleUpdateItem(item.id,{product});const updated=allProducts.map(p=>p.id===product.id?product:p);saveProducts(updated);setAllProducts(updated);}} />
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

            </OptionSection>

          </div>

          {/* PAINEL DIREITO: PRÉVIA REAL EM ALTA DEFINIÇÃO E DOWNLOAD */}
          <div className="sc-editor-preview lg:col-span-7 space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-bold text-slate-900">
                  PRÉVIA
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">
                
              </span>
            </div>

            <button type="button" className="sc-upload-button" onClick={addPage}>+ Criar página baseada na primeira</button>
            {draftWarning&&<p role="alert" className="text-red-600 text-xs">{draftWarning}</p>}
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
                    artwork={artwork}
                    onArtworkChange={setArtwork}
                    backgroundId={backgroundId}
                    badgeUrl={badgeUrl}
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

function CampaignSession(){const params=useSearchParams();return <CampaignEditorContent key={params.get('new')||params.get('draft')||params.get('duplicate')||'current'}/>;}
export default function CampaignEditorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Carregando editor...</div>}>
      <CampaignSession />
    </Suspense>
  );
}
