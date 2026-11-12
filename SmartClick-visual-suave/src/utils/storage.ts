import { Campaign, Product, StoreProfile } from '@/types';
import {getMeatImage} from './meatImages';
import { INITIAL_PRODUCTS } from '@/constants/sampleProducts';

const STORAGE_KEYS = {
  STORE: 'smartclick_store_profile',
  PRODUCTS: 'smartclick_products',
  CAMPAIGNS: 'smartclick_campaigns',
};

export const DEFAULT_STORE: StoreProfile = {
  id: 'store-1',
  name: 'Supermercado Bom Preço',
  cnpj: '12.345.678/0001-90',
  address: 'Av. Brasil, 1200 - Centro',
  phone: '(11) 98765-4321',
  whatsapp: '(11) 98765-4321',
  instagram: '@supermercadobompreco',
  primaryColor: '#7C3AED',
  accentColor: '#A78BFA',
  footerLegalText: 'Ofertas válidas enquanto durarem os estoques. Fotos meramente ilustrativas. Reservamo-nos o direito de corrigir eventuais erros de digitação e impressão.',
};

export function getStoreProfile(): StoreProfile {
  if (typeof window === 'undefined') return DEFAULT_STORE;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STORE);
    return raw ? JSON.parse(raw) : DEFAULT_STORE;
  } catch {
    return DEFAULT_STORE;
  }
}

export function saveStoreProfile(profile: StoreProfile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.STORE, JSON.stringify(profile));
}

export function getProducts(): Product[] {
  if (typeof window === 'undefined') return INITIAL_PRODUCTS.map(p=>({...p,imageUrl:p.imageUrl||getMeatImage(p.name)}));
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return (JSON.parse(raw) as Product[]).map(p=>({...p,imageUrl:p.imageUrl||getMeatImage(p.name)}));
  } catch {
    return INITIAL_PRODUCTS;
  }
}

export function saveProducts(products: Product[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
}

export function addProducts(newProducts: Product[]): Product[] {
  const current = getProducts();
  const updated = [...newProducts, ...current];
  saveProducts(updated);
  return updated;
}

export function getCampaigns(): Campaign[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCampaigns(campaigns: Campaign[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
}

export function saveCampaign(campaign: Campaign): Campaign {
  const current = getCampaigns();
  const existingIdx = current.findIndex((c) => c.id === campaign.id);
  let updated: Campaign[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = campaign;
  } else {
    updated = [campaign, ...current];
  }
  saveCampaigns(updated);
  return campaign;
}
