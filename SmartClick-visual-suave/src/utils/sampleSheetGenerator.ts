import * as XLSX from 'xlsx';

export function generateSampleExcelFile(): void {
  const sampleData = [
    {
      'Nome do Produto': 'Arroz Branco Tipo 1',
      'Marca': 'Tio João',
      'Conteúdo Embalagem': '5 kg',
      'Unidade de Venda': 'pacote',
      'Preço Atual': '28,90',
      'Categoria': 'Mercearia básica',
      'Foto URL (Opcional)': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80',
    },
    {
      'Nome do Produto': 'Feijão Carioca',
      'Marca': 'Camil',
      'Conteúdo Embalagem': '1 kg',
      'Unidade de Venda': 'pacote',
      'Preço Atual': '7,89',
      'Categoria': 'Mercearia básica',
      'Foto URL (Opcional)': 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=500&q=80',
    },
    {
      'Nome do Produto': 'Óleo de Soja Refinado',
      'Marca': 'Soya',
      'Conteúdo Embalagem': '900 ml',
      'Unidade de Venda': 'unidade',
      'Preço Atual': '6,49',
      'Categoria': 'Mercearia básica',
      'Foto URL (Opcional)': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=500&q=80',
    },
    {
      'Nome do Produto': 'Café Torrado e Moído Tradicional',
      'Marca': 'Pilão',
      'Conteúdo Embalagem': '500 g',
      'Unidade de Venda': 'pacote',
      'Preço Atual': '19,90',
      'Categoria': 'Café da manhã',
      'Foto URL (Opcional)': 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=500&q=80',
    },
    {
      'Nome do Produto': 'Leite Integral UHT',
      'Marca': 'Piracanjuba',
      'Conteúdo Embalagem': '1 litro',
      'Unidade de Venda': 'unidade',
      'Preço Atual': '4,99',
      'Categoria': 'Laticínios e frios',
      'Foto URL (Opcional)': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=500&q=80',
    },
    {
      'Nome do Produto': 'Queijo Mussarela Fatiado',
      'Marca': 'Itambé',
      'Conteúdo Embalagem': '150 g',
      'Unidade de Venda': 'bandeja',
      'Preço Atual': '8,79',
      'Categoria': 'Laticínios e frios',
      'Foto URL (Opcional)': 'https://images.unsplash.com/photo-1589881133595-a3c085cb731d?auto=format&fit=crop&w=500&q=80',
    },
    {
      'Nome do Produto': 'Alcatra Bovina Resfriada',
      'Marca': 'Friboi',
      'Conteúdo Embalagem': 'Peça ou pedaço',
      'Unidade de Venda': 'kg',
      'Preço Atual': '39,90',
      'Categoria': 'Açougue e aves',
      'Foto URL (Opcional)': 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=500&q=80',
    },
    {
      'Nome do Produto': 'Banana Prata Selecionada',
      'Marca': '',
      'Conteúdo Embalagem': 'Fresca',
      'Unidade de Venda': 'kg',
      'Preço Atual': '6,99',
      'Categoria': 'Hortifruti',
      'Foto URL (Opcional)': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=500&q=80',
    },
    {
      'Nome do Produto': 'Refrigerante Guaraná',
      'Marca': 'Antarctica',
      'Conteúdo Embalagem': '2 litros',
      'Unidade de Venda': 'garrafa',
      'Preço Atual': '8,49',
      'Categoria': 'Bebidas sem álcool',
      'Foto URL (Opcional)': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=80',
    },
    {
      'Nome do Produto': 'Detergente Líquido Neutro',
      'Marca': 'Ypê',
      'Conteúdo Embalagem': '500 ml',
      'Unidade de Venda': 'frasco',
      'Preço Atual': '2,39',
      'Categoria': 'Limpeza',
      'Foto URL (Opcional)': 'https://images.unsplash.com/photo-1585670270608-b404fb88821d?auto=format&fit=crop&w=500&q=80',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Produtos_Demonstracao');
  XLSX.writeFile(workbook, 'smartclick_modelo_produtos_demonstracao.xlsx');
}
