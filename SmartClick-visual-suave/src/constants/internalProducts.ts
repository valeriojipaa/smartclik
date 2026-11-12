import { Product } from '@/types';
import { getMeatImage } from '@/utils/meatImages';

export const normalizeSearch = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

export const INTERNAL_MEATS: Product[] = [
  'Acém', 'Patinho', 'Patinho moído', 'Contrafilé', 'Alcatra',
  'Picanha', 'Coxão mole', 'Músculo', 'Costela bovina',
].map(name => ({
  id: 'smartclick-meat-' + normalizeSearch(name).replace(/\s+/g, '-'),
  name, packageContent: '1 kg', saleUnit: 'quilo', currentPrice: 0,
  category: 'acougue-e-aves', imageUrl: getMeatImage(name),
  notes: 'Catálogo SmartClick. Imagem ilustrativa. Informe o preço da loja.',
  createdAt: '2026-11-12T00:00:00.000Z',
}));

export function includeInternalMeats(products: Product[]): Product[] {
  const names = new Set(products.map(product => normalizeSearch(product.name)));
  const ids = new Set(products.map(product => product.id));
  return [
    ...products.map(product => ({ ...product, imageUrl: product.imageUrl || getMeatImage(product.name) })),
    ...INTERNAL_MEATS.filter(product => !ids.has(product.id) && !names.has(normalizeSearch(product.name))),
  ];
}
