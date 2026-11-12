'use client';
import { useState } from 'react';
import { INTERNAL_MEATS, normalizeSearch } from '@/constants/internalProducts';
import { BASIC_FOODS } from '@/constants/basicFoods';
import { CATEGORIES, Product } from '@/types';

const catalog = [...INTERNAL_MEATS, ...BASIC_FOODS];

export function InternalImagePicker({ query, onChoose }: { query: string; onChoose: (product: Product) => void }) {
  const [category, setCategory] = useState('all');
  const [failed, setFailed] = useState<string[]>([]);
  const words = normalizeSearch(query).split(/\s+/).filter(Boolean);
  const matches = catalog.filter(product => {
    const text = normalizeSearch([product.name, product.brand, product.packageContent].filter(Boolean).join(' '));
    return (category === 'all' || product.category === category) && words.every(word => text.includes(word));
  });

  return <section className="rounded-xl border border-slate-200 p-3 space-y-3">
    <div className="flex items-center justify-between gap-2">
      <strong>Fotos do catálogo SmartClick</strong>
      <select aria-label="Categoria das fotos" className="border rounded-lg p-2" value={category} onChange={event => setCategory(event.target.value)}>
        <option value="all">Todas as categorias</option>
        {CATEGORIES.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
      </select>
    </div>
    <p>Digite nome, marca ou embalagem e clique na foto desejada.</p>
    <p aria-live="polite">{matches.length} produtos encontrados</p>
    <div className="grid grid-cols-3 gap-2 max-h-72 overflow-auto">
      {matches.map(product => <button type="button" key={product.id} className="border rounded-xl p-2 text-left hover:bg-purple-50" onClick={() => onChoose(product)}>
        {failed.includes(product.id) ? <span className="block text-red-600 text-[10px]">Foto não encontrada no Supabase. Confira o envio do arquivo.</span> : <img loading="lazy" src={product.imageUrl} alt={product.name} className="w-full h-20 object-contain" onError={() => setFailed(previous => [...previous, product.id])}/>}
        <strong className="block mt-1">{product.name}</strong>
        <span className="block text-[10px]">{product.brand} {product.packageContent} · por {product.saleUnit}</span>
        {product.notes?.startsWith('Confira') && <span className="block text-[10px] text-amber-700">Conferir embalagem</span>}
      </button>)}
    </div>
    {!matches.length && <p>Nenhuma foto nesta busca. Escolha outra categoria ou envie sua própria foto.</p>}
  </section>;
}
