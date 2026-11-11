import { Product, ProductCategory } from '@/types';

export interface ParsedRowResult {
  rowIndex: number;
  raw: Record<string, unknown>;
  product?: Partial<Product>;
  errors: string[];
  warnings: string[];
  isDuplicate?: boolean;
}

export function parsePrice(val: unknown): number | null {
  if (val === null || val === undefined) return null;
  if (typeof val === 'number') return val;
  const str = String(val).trim();
  if (!str) return null;

  // Tratar R$ 12,50 ou 12.50 ou 1.250,00
  let clean = str.replace(/[R$\s]/g, '');
  if (clean.includes(',') && clean.includes('.')) {
    // 1.250,50 -> 1250.50
    clean = clean.replace(/\./g, '').replace(',', '.');
  } else if (clean.includes(',')) {
    clean = clean.replace(',', '.');
  }

  const num = parseFloat(clean);
  return isNaN(num) ? null : num;
}

export function extractPackageAndUnit(text: string): { content: string; unit: string } {
  const normalized = text.toLowerCase();
  
  // Buscar padrões de conteúdo de embalagem
  const regexes = [
    /(\d+(?:[.,]\d+)?)\s*(kg|kilos?|g|gramas?|ml|l|litros?|unidades?|un|pct|pacotes?|latas?|garrafas?)/i,
  ];

  for (const rx of regexes) {
    const match = normalized.match(rx);
    if (match) {
      const amount = match[1];
      const unitRaw = match[2];
      let unit = 'unidade';
      if (['kg', 'kilo', 'kilos'].includes(unitRaw)) unit = 'kg';
      else if (['g', 'gramas', 'grama'].includes(unitRaw)) unit = 'unidade'; // Conteúdo de 500g vendido por unidade
      else if (['l', 'litro', 'litros'].includes(unitRaw)) unit = 'litro';
      else if (['ml'].includes(unitRaw)) unit = 'unidade'; // 900ml vendido por unidade
      else if (['pct', 'pacote', 'pacotes'].includes(unitRaw)) unit = 'pacote';

      return {
        content: `${amount} ${unitRaw}`,
        unit: unit,
      };
    }
  }

  return { content: '', unit: 'unidade' };
}

export function guessCategory(name: string): ProductCategory {
  const n = name.toLowerCase();
  if (n.includes('arroz') || n.includes('feijao') || n.includes('feijão') || n.includes('óleo') || n.includes('oleo') || n.includes('acucar') || n.includes('açúcar') || n.includes('sal') || n.includes('farinha') || n.includes('macarrao') || n.includes('macarrão') || n.includes('molho')) {
    return 'mercearia-basica';
  }
  if (n.includes('cafe') || n.includes('café') || n.includes('cha') || n.includes('chá') || n.includes('achocolatado') || n.includes('cereal') || n.includes('torrada') || n.includes('geleia')) {
    return 'cafe-da-manha';
  }
  if (n.includes('leite') || n.includes('queijo') || n.includes('iogurte') || n.includes('manteiga') || n.includes('requeijao') || n.includes('requeijão') || n.includes('presunto') || n.includes('mortadela')) {
    return 'laticinios-e-frios';
  }
  if (n.includes('carne') || n.includes('alcatra') || n.includes('picanha') || n.includes('frango') || n.includes('linguica') || n.includes('linguiça') || n.includes('costela') || n.includes('peito') || n.includes('acougue') || n.includes('bife')) {
    return 'acougue-e-aves';
  }
  if (n.includes('banana') || n.includes('maca') || n.includes('maçã') || n.includes('tomate') || n.includes('batata') || n.includes('cebola') || n.includes('laranja') || n.includes('alface') || n.includes('cenoura')) {
    return 'hortifruti';
  }
  if (n.includes('pão') || n.includes('pao') || n.includes('bolo') || n.includes('croissant') || n.includes('broa') || n.includes('baguete')) {
    return 'padaria';
  }
  if (n.includes('refrigerante') || n.includes('suco') || n.includes('agua') || n.includes('água') || n.includes('energetico') || n.includes('energético') || n.includes('cha')) {
    return 'bebidas-sem-alcool';
  }
  if (n.includes('biscoito') || n.includes('bolacha') || n.includes('salgadinho') || n.includes('batata frita') || n.includes('chocolate') || n.includes('bombom')) {
    return 'biscoitos-e-snacks';
  }
  if (n.includes('pizza') || n.includes('lasanha') || n.includes('hamburguer') || n.includes('nuggets') || n.includes('congelado') || n.includes('sorvete') || n.includes('polpa')) {
    return 'congelados';
  }
  if (n.includes('sabao') || n.includes('sabão') || n.includes('detergente') || n.includes('amaciante') || n.includes('desinfetante') || n.includes('agua sanitaria') || n.includes('esponja') || n.includes('limpador')) {
    return 'limpeza';
  }
  if (n.includes('sabonete') || n.includes('shampoo') || n.includes('creme dental') || n.includes('escova') || n.includes('papel higienico') || n.includes('papel higiênico') || n.includes('desodorante') || n.includes('fralda')) {
    return 'higiene-pessoal';
  }
  if (n.includes('racao') || n.includes('ração') || n.includes('pet') || n.includes('gato') || n.includes('cao') || n.includes('cão') || n.includes('cachorro') || n.includes('areia sanit')) {
    return 'pet';
  }
  return 'mercearia-basica';
}

export function formatCurrencyBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}
