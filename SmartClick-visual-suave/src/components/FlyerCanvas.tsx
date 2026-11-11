import React from 'react';
import { CampaignItem, FlyerFormat, StoreProfile, VisualTheme } from '@/types';
import { PromoBadge3D } from './PromoBadge3D';
import { Sparkles } from 'lucide-react';

interface FlyerCanvasProps {
  id?: string;
  theme: VisualTheme;
  store: StoreProfile;
  campaignTitle: string;
  startDate: string;
  endDate: string;
  format: FlyerFormat;
  items: CampaignItem[];
  pageIndex: number;
  totalPages: number;
  hasStockLimit?: boolean;
  hasIllustrativeImagesNotice?: boolean;
  scale?: number;
}

export const FlyerCanvas: React.FC<FlyerCanvasProps> = ({
  id,
  theme,
  store,
  campaignTitle,
  startDate,
  endDate,
  format,
  items,
  pageIndex,
  totalPages,
  hasStockLimit = true,
  hasIllustrativeImagesNotice = true,
  scale = 1,
}) => {
  // Configuração de dimensões exatas de visualização e exportação
  // Stories: 1080 x 1920 (proporção 9:16)
  // Feed: 1080 x 1350 (proporção 4:5)
  // A4: 1080 x 1528 (equivalente proporcional a 210 x 297mm)
  let baseWidth = 540;
  let baseHeight = 960; // 540x960 (Stories preview)
  let gridColsClass = 'grid-cols-2';

  if (format === 'stories') {
    baseWidth = 540;
    baseHeight = 960;
    gridColsClass = items.length <= 4 ? 'grid-cols-2' : 'grid-cols-2';
  } else if (format === 'feed') {
    baseWidth = 540;
    baseHeight = 675; // 4:5
    gridColsClass = items.length <= 4 ? 'grid-cols-2' : items.length <= 6 ? 'grid-cols-3' : 'grid-cols-3';
  } else if (format === 'a4') {
    baseWidth = 540;
    baseHeight = 764; // A4 proporcional
    gridColsClass = items.length <= 6 ? 'grid-cols-3' : 'grid-cols-4';
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  const periodText =
    startDate && endDate
      ? `Válido de ${formatDate(startDate)} até ${formatDate(endDate)}`
      : 'Ofertas válidas enquanto durarem os estoques';

  return (
    <div
      id={id}
      style={{
        width: `${baseWidth}px`,
        height: `${baseHeight}px`,
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top left',
        backgroundColor: theme.bodyBackground,
      }}
      className="relative flex flex-col justify-between overflow-hidden shadow-2xl font-sans select-none text-slate-800"
    >
      {/* CABEÇALHO */}
      <header
        className="relative z-10 px-6 pt-5 pb-4 text-white shadow-md"
        style={{
          background: theme.headerBackground,
        }}
      >
        {/* Top bar com nome da loja e paginação */}
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 max-w-[70%]">
            {store.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={store.logoUrl}
                alt={store.name}
                className="h-7 w-auto object-contain rounded bg-white p-0.5"
              />
            ) : (
              <div className="h-6 w-6 rounded bg-white/20 flex items-center justify-center font-bold text-xs">
                {store.name.substring(0, 1)}
              </div>
            )}
            <span className="font-extrabold text-sm tracking-wide uppercase truncate drop-shadow-sm">
              {store.name}
            </span>
          </div>

          <div className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-black/25 text-white backdrop-blur-sm">
            {totalPages > 1 ? `Pág. ${pageIndex + 1}/${totalPages}` : 'EDIÇÃO ESPECIAL'}
          </div>
        </div>

        {/* Título Principal da Campanha e Selo Promocional 3D */}
        <div className="text-center py-1">
          <div className="mb-1 inline-block">
            <PromoBadge3D text={theme.badgeDefault} size="sm" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white drop-shadow-md leading-tight">
            {campaignTitle || theme.name}
          </h1>
          <p className="text-[11px] font-semibold text-white/90 uppercase tracking-widest mt-0.5">
            {theme.subtitle}
          </p>
        </div>

        {/* Faixa de Validade no Topo */}
        <div className="mt-2 text-center">
          <span className="inline-block bg-white text-slate-900 text-[10px] font-black px-3 py-0.5 rounded-full shadow-sm tracking-wide">
            {periodText}
          </span>
        </div>
      </header>

      {/* ÁREA DE PRODUTOS */}
      <main className="flex-1 p-3 overflow-hidden flex flex-col justify-center">
        <div className={`grid ${gridColsClass} gap-2.5 h-full items-stretch`}>
          {items.map((item) => {
            const prod = item.product;
            const hasDiscount = item.regularPrice && item.regularPrice > item.promoPrice;
            const discountPercent = hasDiscount
              ? Math.round(((item.regularPrice! - item.promoPrice) / item.regularPrice!) * 100)
              : 0;

            const priceWhole = Math.floor(item.promoPrice);
            const priceCents = Math.round((item.promoPrice - priceWhole) * 100)
              .toString()
              .padStart(2, '0');

            return (
              <div
                key={item.id}
                className="relative flex flex-col justify-between p-2 rounded-xl border transition-all"
                style={{
                  backgroundColor: theme.cardBg,
                  borderColor: theme.cardBorder,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
              >
                {/* Desconto ou Selo Superior */}
                <div className="absolute top-1.5 left-1.5 right-1.5 flex justify-between items-start z-10 pointer-events-none">
                  {hasDiscount ? (
                    <span className="bg-red-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-sm">
                      -{discountPercent}%
                    </span>
                  ) : <span />}
                  {item.highlightBadge && (
                    <span className="bg-amber-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-sm uppercase">
                      {item.highlightBadge}
                    </span>
                  )}
                </div>

                {/* Foto do Produto */}
                <div className="w-full flex items-center justify-center pt-2 pb-1 h-24 overflow-hidden">
                  {prod.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="max-h-full max-w-full object-contain drop-shadow-sm"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="w-full h-full rounded-lg bg-slate-100 flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                      <Sparkles className="w-6 h-6 mb-1 text-slate-300" />
                      <span className="text-[10px] font-medium leading-tight text-slate-500">
                        {prod.brand || 'Item Selecionado'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Detalhes do Produto */}
                <div className="text-center mt-1 flex-1 flex flex-col justify-end">
                  {prod.brand && (
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block truncate">
                      {prod.brand}
                    </span>
                  )}
                  <h3 className="font-extrabold text-[12px] leading-tight text-slate-900 line-clamp-2 min-h-[1.75rem] flex items-center justify-center">
                    {prod.name}
                  </h3>
                  {prod.packageContent && (
                    <span className="text-[10px] font-semibold text-slate-600 block mt-0.5">
                      {prod.packageContent}
                    </span>
                  )}

                  {/* Preço Promocional e De/Por */}
                  <div className="mt-2 pt-1 border-t border-slate-100">
                    {hasDiscount && (
                      <div className="text-[10px] text-slate-400 line-through font-semibold leading-none mb-0.5">
                        De: R$ {item.regularPrice?.toFixed(2).replace('.', ',')}
                      </div>
                    )}

                    <div
                      className="inline-flex items-baseline justify-center px-2 py-0.5 rounded-lg shadow-sm"
                      style={{
                        backgroundColor: theme.priceTagBg,
                        color: theme.priceTagText,
                      }}
                    >
                      <span className="text-[10px] font-bold mr-0.5">R$</span>
                      <span className="text-xl font-black leading-none">{priceWhole}</span>
                      <span className="text-xs font-bold leading-none">,{priceCents}</span>
                    </div>

                    <div className="text-[9px] font-bold text-slate-600 uppercase mt-0.5 tracking-tight">
                      Por {prod.saleUnit || 'unidade'}
                    </div>

                    {item.limitPerCustomer && (
                      <div className="text-[8px] font-semibold text-red-600 mt-0.5">
                        Limite {item.limitPerCustomer} unid. por cliente
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* RODAPÉ OBRIGATÓRIO E LEGAL */}
      <footer className="relative z-10 bg-white border-t border-slate-200 px-4 py-2 text-slate-600 text-[9px] leading-tight shadow-inner">
        <div className="flex flex-col md:flex-row justify-between items-center gap-1.5 text-center md:text-left">
          <div className="space-y-0.5 max-w-full">
            <div className="font-bold text-slate-800">
              {store.name} {store.phone && `• Tel: ${store.phone}`}{' '}
              {store.whatsapp && `• WhatsApp: ${store.whatsapp}`}
            </div>
            {store.address && <div>{store.address}</div>}
          </div>

          <div className="text-[8px] text-slate-500 max-w-sm text-center md:text-right">
            <span>
              {hasStockLimit ? 'Ofertas válidas enquanto durarem os estoques. ' : ''}
              {hasIllustrativeImagesNotice ? 'Imagens meramente ilustrativas. ' : ''}
              {store.footerLegalText || ''}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
