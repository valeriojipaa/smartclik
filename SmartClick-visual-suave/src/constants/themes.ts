import { VisualTheme, VisualThemeId } from '@/types';

export const VISUAL_THEMES: Record<VisualThemeId, VisualTheme> = {
  promocao: {
    id: 'promocao',
    name: 'PROMOÇÃO',
    subtitle: 'OFERTAS IMBATÍVEIS PARA VOCÊ ECONOMIZAR',
    primaryColor: '#E53935', // Vermelho
    secondaryColor: '#FF6F00', // Laranja
    accentColor: '#FFC107', // Amarelo
    headerBackground: 'linear-gradient(135deg, #D32F2F 0%, #E53935 50%, #FF6F00 100%)',
    bodyBackground: '#FFF8F6',
    priceTagBg: '#E53935',
    priceTagText: '#FFFFFF',
    badgeDefault: 'PROMOÇÃO',
    cardBg: '#FFFFFF',
    cardBorder: '#FFE082',
  },
  'ofertas-da-semana': {
    id: 'ofertas-da-semana',
    name: 'OFERTAS DA SEMANA',
    subtitle: 'ECONOMIA GARANTIDA TODOS OS DIAS',
    primaryColor: '#1565C0', // Azul Royal
    secondaryColor: '#D32F2F', // Vermelho
    accentColor: '#FFFFFF',
    headerBackground: 'linear-gradient(135deg, #0D47A1 0%, #1976D2 70%, #D32F2F 100%)',
    bodyBackground: '#F4F7FC',
    priceTagBg: '#D32F2F',
    priceTagText: '#FFFFFF',
    badgeDefault: 'OFERTA DA SEMANA',
    cardBg: '#FFFFFF',
    cardBorder: '#BBDEFB',
  },
  'ofertas-do-dia': {
    id: 'ofertas-do-dia',
    name: 'OFERTAS DO DIA',
    subtitle: 'SÓ HOJE! CORRA E APROVEITE ANTES QUE ACABE',
    primaryColor: '#D84315', // Laranja avermelhado
    secondaryColor: '#FBC02D', // Amarelo
    accentColor: '#212121',
    headerBackground: 'linear-gradient(135deg, #BF360C 0%, #E64A19 50%, #F57C00 100%)',
    bodyBackground: '#FFFDE7',
    priceTagBg: '#E65100',
    priceTagText: '#FFFFFF',
    badgeDefault: 'SÓ HOJE',
    cardBg: '#FFFFFF',
    cardBorder: '#FFE082',
  },
  'fim-de-semana': {
    id: 'fim-de-semana',
    name: 'FIM DE SEMANA DE OFERTAS',
    subtitle: 'DESCONTOS ESPECIAIS PARA SEU FINAL DE SEMANA',
    primaryColor: '#1A237E', // Azul escuro
    secondaryColor: '#FB8C00', // Laranja
    accentColor: '#FFD600', // Amarelo
    headerBackground: 'linear-gradient(135deg, #1A237E 0%, #283593 60%, #FB8C00 100%)',
    bodyBackground: '#F3F4F9',
    priceTagBg: '#E65100',
    priceTagText: '#FFFFFF',
    badgeDefault: 'FIM DE SEMANA',
    cardBg: '#FFFFFF',
    cardBorder: '#C5CAE9',
  },
  acougue: {
    id: 'acougue',
    name: 'AÇOUGUE EM OFERTA',
    subtitle: 'CORTES SELECIONADOS COM QUALIDADE E PREÇO BAIXO',
    primaryColor: '#880E4F', // Bordô
    secondaryColor: '#B71C1C', // Vermelho escuro
    accentColor: '#FFD700', // Dourado
    headerBackground: 'linear-gradient(135deg, #4A0E17 0%, #880E4F 50%, #B71C1C 100%)',
    bodyBackground: '#FDF7F7',
    priceTagBg: '#B71C1C',
    priceTagText: '#FFFFFF',
    badgeDefault: 'AÇOUGUE',
    cardBg: '#FFFFFF',
    cardBorder: '#FFCDD2',
  },
  feirinha: {
    id: 'feirinha',
    name: 'FEIRINHA DE OFERTAS',
    subtitle: 'FRUTAS, LEGUMES E VERDURAS FRESCQUINHOS',
    primaryColor: '#2E7D32', // Verde
    secondaryColor: '#F57C00', // Laranja
    accentColor: '#FBC02D', // Amarelo
    headerBackground: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 60%, #EF6C00 100%)',
    bodyBackground: '#F1F8E9',
    priceTagBg: '#2E7D32',
    priceTagText: '#FFFFFF',
    badgeDefault: 'DIA DE FEIRA',
    cardBg: '#FFFFFF',
    cardBorder: '#C8E6C9',
  },
  limpeza: {
    id: 'limpeza',
    name: 'FESTIVAL DA LIMPEZA',
    subtitle: 'CUIDADO E ECONOMIA PARA TODA A SUA CASA',
    primaryColor: '#0288D1', // Azul Claro
    secondaryColor: '#00897B', // Verde-água
    accentColor: '#E0F7FA',
    headerBackground: 'linear-gradient(135deg, #01579B 0%, #0288D1 50%, #00897B 100%)',
    bodyBackground: '#E0F7FA',
    priceTagBg: '#0277BD',
    priceTagText: '#FFFFFF',
    badgeDefault: 'FESTIVAL LIMPEZA',
    cardBg: '#FFFFFF',
    cardBorder: '#B2EBF2',
  },
  'black-friday': {
    id: 'black-friday',
    name: 'BLACK FRIDAY',
    subtitle: 'OS MENORES PREÇOS DO ANO ESTÃO AQUI',
    primaryColor: '#111111', // Preto
    secondaryColor: '#FFD600', // Amarelo forte
    accentColor: '#FFFFFF',
    headerBackground: 'linear-gradient(135deg, #000000 0%, #212121 70%, #FFD600 100%)',
    bodyBackground: '#1E1E1E',
    priceTagBg: '#FFD600',
    priceTagText: '#111111',
    badgeDefault: 'BLACK FRIDAY',
    cardBg: '#2C2C2C',
    cardBorder: '#FFD600',
  },
  natal: {
    id: 'natal',
    name: 'NATAL DE OFERTAS',
    subtitle: 'CELEBRE COM ECONOMIA E A MELHOR MESA',
    primaryColor: '#C62828', // Vermelho
    secondaryColor: '#2E7D32', // Verde
    accentColor: '#FFD700', // Dourado
    headerBackground: 'linear-gradient(135deg, #B71C1C 0%, #C62828 50%, #1B5E20 100%)',
    bodyBackground: '#FFF8F8',
    priceTagBg: '#C62828',
    priceTagText: '#FFFFFF',
    badgeDefault: 'NATAL DE OFERTAS',
    cardBg: '#FFFFFF',
    cardBorder: '#FFE082',
  },
  reveillon: {
    id: 'reveillon',
    name: 'RÉVEILLON DE OFERTAS',
    subtitle: 'BRINDE AO ANO NOVO COM AS MELHORES OFERTAS',
    primaryColor: '#0D47A1', // Azul escuro
    secondaryColor: '#FFD700', // Dourado
    accentColor: '#E0E0E0', // Prata
    headerBackground: 'linear-gradient(135deg, #0A192F 0%, #1565C0 60%, #FFD700 100%)',
    bodyBackground: '#F0F4F8',
    priceTagBg: '#0D47A1',
    priceTagText: '#FFFFFF',
    badgeDefault: 'RÉVEILLON',
    cardBg: '#FFFFFF',
    cardBorder: '#FFD700',
  },
};

export const PROMO_BADGES = [
  'Oferta',
  'Promoção',
  'Ofertas do Dia',
  'Ofertas da Semana',
  'Fim de Semana de Ofertas',
  'Quinzena de Ofertas',
  'Açougue em Oferta',
  'Ofertas da Padaria',
  'Dia de Feira',
  'Feirinha de Ofertas',
  'Festival da Limpeza',
  'Queima de Estoque',
  'Torra Tudo',
  'Derruba Preço',
  'Black Friday',
  'Natal de Ofertas',
  'Réveillon de Ofertas',
  'Carnaval de Ofertas',
  'Festival de Economia',
  'Oferta Especial',
];
