export type ProductCategory =
  | 'mercearia-basica'
  | 'cafe-da-manha'
  | 'laticinios-e-frios'
  | 'acougue-e-aves'
  | 'hortifruti'
  | 'padaria'
  | 'bebidas-sem-alcool'
  | 'biscoitos-e-snacks'
  | 'congelados'
  | 'limpeza'
  | 'higiene-pessoal'
  | 'pet';

export interface CategoryInfo {
  id: ProductCategory;
  label: string;
  icon: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'mercearia-basica', label: 'Mercearia básica', icon: 'ShoppingBag' },
  { id: 'cafe-da-manha', label: 'Café da manhã', icon: 'Coffee' },
  { id: 'laticinios-e-frios', label: 'Laticínios e frios', icon: 'Milk' },
  { id: 'acougue-e-aves', label: 'Açougue e aves', icon: 'Beef' },
  { id: 'hortifruti', label: 'Hortifruti', icon: 'Apple' },
  { id: 'padaria', label: 'Padaria', icon: 'Croissant' },
  { id: 'bebidas-sem-alcool', label: 'Bebidas sem álcool', icon: 'CupSoda' },
  { id: 'biscoitos-e-snacks', label: 'Biscoitos e snacks', icon: 'Cookie' },
  { id: 'congelados', label: 'Congelados', icon: 'Snowflake' },
  { id: 'limpeza', label: 'Limpeza', icon: 'Sparkles' },
  { id: 'higiene-pessoal', label: 'Higiene pessoal', icon: 'HeartPulse' },
  { id: 'pet', label: 'Pet', icon: 'Dog' },
];

export interface Product {
  id: string;
  storeId?: string;
  name: string;
  brand?: string;
  packageContent: string; // Ex: '900 ml', '500 g', '1 kg'
  saleUnit: string; // Ex: 'unidade', 'kg', 'pacote', 'litro'
  currentPrice: number; // Preço regular
  category: ProductCategory;
  imageUrl?: string;
  isFavorite?: boolean;
  notes?: string;
  createdAt: string;
}

export interface CampaignItem {
  id: string;
  productId: string;
  product: Product;
  promoPrice: number;
  regularPrice?: number;
  highlightBadge?: string; // Selo específico do item (ex: 'Super Oferta')
  limitPerCustomer?: number;
  conditions?: string; // Ex: 'A partir de 3 unidades'
}

export type FlyerFormat = 'stories' | 'feed' | 'a4' | 'a5';

export interface StoreProfile {
  id: string;
  name: string;
  cnpj?: string;
  address: string;
  phone: string;
  whatsapp?: string;
  instagram?: string;
  logoUrl?: string;
  primaryColor?: string;
  accentColor?: string;
  footerLegalText?: string;
}

export type VisualThemeId =
  | 'promocao'
  | 'ofertas-da-semana'
  | 'ofertas-do-dia'
  | 'fim-de-semana'
  | 'acougue'
  | 'feirinha'
  | 'limpeza'
  | 'black-friday'
  | 'natal'
  | 'reveillon';

export interface VisualTheme {
  id: VisualThemeId;
  name: string;
  subtitle: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headerBackground: string;
  bodyBackground: string;
  priceTagBg: string;
  priceTagText: string;
  badgeDefault: string;
  cardBg: string;
  cardBorder: string;
}

export interface Campaign {
  artwork?: { badge: {x:number;y:number;width:number}; logo: {x:number;y:number;width:number}; textColor?: string; identity: string; italic: boolean; logoUrl?: string };
  backgroundId?: string;
  badgeUrl?: string;
  id: string;
  storeId: string;
  title: string;
  themeId: VisualThemeId;
  startDate: string;
  endDate: string;
  items: CampaignItem[];
  formats: FlyerFormat[];
  legalNotice?: string;
  hasStockLimit?: boolean;
  hasIllustrativeImagesNotice?: boolean;
  createdAt: string;
  updatedAt: string;
}
