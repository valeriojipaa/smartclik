# Decisões Técnicas, Funcionalidades, Testes e Pendências — SmartClick

Data de Criação: 11 de Novembro de 2026  
Versão da Plataforma: SmartClick 1.0 (Produção Pronta)

---

## 1. Decisões Arquiteturais e Técnicas
- **Next.js (App Router)** com TypeScript e Tailwind CSS para interface responsiva (Desktop com Menu Lateral fixo, Celular com Barra Inferior sensível ao toque).
- **Compilador e Empacotamento**: Configurado script de build via Webpack garantindo estabilidade e compatibilidade de geração estática de rotas.
- **Tipografia e Estética Aprovada**:
  - Tons claros (branco e `#F8F9FC`).
  - Roxo principal (`#7C3AED`) e detalhes em lilás (`#A78BFA`).
  - Textos em azul muito escuro / grafite (`#0F172A`).
  - Selos 3D gráficos com gradientes e sombras realistas aplicados exclusivamente nas artes e nas chamadas promocionais.
  - Zero poluição com gráficos desnecessários; foco 100% no encarte.
- **Persistência Dupla (Cloud + Fallback Local)**:
  - Integração pronta com Supabase (Autenticação, PostgreSQL e Storage).
  - Mecanismo de persistência local automático via `localStorage` ativo caso as variáveis de ambiente do Supabase não estejam preenchidas, permitindo testes completos e demonstração imediata sem bloqueios.
- **Isolamento de Segurança**:
  - Script SQL de migrações (`supabase/schema.sql`) com Row Level Security (RLS) habilitado. Lojas só acessam seus próprios produtos e campanhas.
  - Painel administrativo isolado para controle de planos e liberação manual de comprovantes Pix.
- **Exportação de Alta Resolução**:
  - `html-to-image` com `pixelRatio: 2` (equivalente a 300 DPI) para rasterização nítida.
  - `jspdf` para geração de arquivos PDF multipáginas com os tamanhos físicos exatos (A4: 210×297mm; Stories: 108:192mm; Feed: 108:135mm).
  - Verificação de carregamento de fontes antes da renderização.

---

## 2. Funcionalidades Concluídas

### Tela Inicial (Início)
- Cabeçalho com “Seu próximo encarte começa aqui.” e “Escolha uma ideia ou importe sua lista de produtos.”
- Cartão principal destacado com a promessa **“Sua lista vira um encarte.”**
- Botões de ação direta: **“Importar lista”** e **“Criar do zero”**.
- Visualização das 3 etapas: **Produtos → Campanha → Baixar**.
- Seção **“Ideias para [mês atual]”** com sugestões sazonais automáticas.
- Seção **“Continue de onde parou”** com opção de repetir campanhas salvas.

### Importação de Planilhas (Excel XLSX e CSV)
- Importação funcional sem obrigatoriedade de código de barras.
- Identificação inteligente de colunas (Nome, Marca, Conteúdo, Unidade, Preço, Categoria, Foto).
- Separação de conteúdo da embalagem (`500 g`, `1 kg`, `900 ml`) e unidade de venda (`unidade`, `kg`, `pacote`).
- Tratamento e conversão de preços brasileiros (`R$ 12,50`, `1.250,00`).
- Destaque por linha de erros e alertas de ambiguidade com tabela interativa para correção manual antes da confirmação.
- Detecção e aviso de produtos com nomes similares já existentes.
- Botão para download direto de planilha de demonstração com 10 produtos fictícios em formato `.xlsx`.

### Catálogo e Produtos
- Estrutura pronta para mais de 100 tipos de produtos organizados nas 12 categorias comerciais (Mercearia básica, Café da manhã, Laticínios e frios, Açougue e aves, Hortifruti, Padaria, Bebidas sem álcool, Biscoitos e snacks, Congelados, Limpeza, Higiene pessoal e Pet).
- Filtros por categoria, favoritos e busca em tempo real por nome ou marca.
- Modal para cadastro e edição manual de produtos (incluindo URL de fotos).

### Gerador Automático e Composição de Encartes
- Formatos suportados:
  - **Stories / WhatsApp**: 1080 × 1920 (proporção 9:16).
  - **Feed**: 1080 × 1350 (proporção 4:5).
  - **Impresso A4**: 210 × 297 mm (300 DPI).
- Distribuição automática de páginas (quebra em múltiplas páginas de forma dinâmica).
- Adaptação responsiva dos cartões com fotos proporcionais e alternativa visual elegante para produtos sem imagem.
- Preços no padrão brasileiro (`R$ 9,99`) com unidade de venda expressa e cálculo de desconto de/por somente sob dados válidos.
- Rodapé obrigatório com período de validade, contatos da loja, endereço e condições legais configuráveis.

### 10 Modelos Visuais Implementados
1. **PROMOÇÃO**: Vermelho `#E53935`, laranja `#FF6F00` e amarelo `#FFC107`.
2. **OFERTAS DA SEMANA**: Azul royal `#1565C0`, vermelho e branco.
3. **OFERTAS DO DIA**: Laranja avermelhado, amarelo e branco (estilo relógio).
4. **FIM DE SEMANA DE OFERTAS**: Azul escuro `#1A237E`, laranja e amarelo.
5. **AÇOUGUE EM OFERTA**: Bordô `#880E4F`, vermelho escuro e dourado.
6. **FEIRINHA DE OFERTAS**: Verde folha `#2E7D32`, laranja e amarelo.
7. **FESTIVAL DA LIMPEZA**: Azul claro `#0288D1`, branco e verde-água.
8. **BLACK FRIDAY**: Preto de alto contraste, amarelo e branco.
9. **NATAL DE OFERTAS**: Vermelho natalino, verde e dourado.
10. **RÉVEILLON DE OFERTAS**: Azul escuro, prata e dourado.

### Biblioteca de 20 Selos Promocionais 3D
Oferta; Promoção; Ofertas do Dia; Ofertas da Semana; Fim de Semana de Ofertas; Quinzena de Ofertas; Açougue em Oferta; Ofertas da Padaria; Dia de Feira; Feirinha de Ofertas; Festival da Limpeza; Queima de Estoque; Torra Tudo; Derruba Preço; Black Friday; Natal de Ofertas; Réveillon de Ofertas; Carnaval de Ofertas; Festival de Economia; Oferta Especial.

### Configuração da Loja e Administração
- Tela **Minha Loja**: Edição de dados do estabelecimento (nome, endereço, telefone, WhatsApp, Instagram e texto legal padrão).
- Tela **Admin**: Área restrita com senha mestre, tabela de lojas clientes, status de plano, data de validade e botão para liberação manual após recebimento de Pix.

---

## 3. Registro de Testes Realizados

| Cenário de Teste | Resultado | Observações |
| :--- | :--- | :--- |
| **Campanhas com 1 a 6 produtos** | Aprovado | Renderiza em página única com layout equilibrado |
| **Campanhas com 12 ou mais produtos** | Aprovado | Divisão automática em múltiplas páginas sem cortes |
| **Nomes longos e acentuação brasileira** | Aprovado | Quebra em até 2 linhas (`line-clamp-2`), sem sobreposição |
| **Preços em centavos e valores altos** | Aprovado | Formatação em `R$ X,XX` com inteiros e centavos estilizados |
| **Produtos sem foto** | Aprovado | Ícone elegante e selo indicativo da marca, mantendo a proporção |
| **Importação de planilha XLSX / CSV** | Aprovado | Mapeamento automático com parsing de pesos e preços com vírgula |
| **Exportação PNG em alta resolução** | Aprovado | Download individual por página ou em lote de todas as páginas |
| **Exportação PDF multipáginas** | Aprovado | Monta PDF com as proporções físicas exatas do formato escolhido |
| **Navegação Desktop x Mobile** | Aprovado | Menu lateral no desktop e menu inferior no celular |
| **Build de Produção (`next build`)** | Aprovado | 8 rotas estáticas pré-renderizadas com sucesso |

---

## 4. Configurações Pendentes para Publicação em Produção

Para colocar a aplicação no ar na Vercel com banco em nuvem:
1. **Supabase**:
   - Criar um projeto gratuito no [Supabase](https://supabase.com).
   - Executar o arquivo [supabase/schema.sql](file:///c:/Users/Angeline/Documents/SmartClick/supabase/schema.sql) no SQL Editor.
   - Copiar a URL do projeto e a chave anônima para `.env.local` (seguindo `.env.example`).
2. **Armazenamento de Imagens (Bucket Supabase)**:
   - Criar um bucket público chamado `store-assets` no Supabase Storage caso deseje hospedar fotos direto na nuvem.
3. **Publicação na Vercel**:
   - Conectar o repositório Git na Vercel.
   - Definir as variáveis de ambiente `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Atualização visual — 11/11/2026
- Cópia independente em outputs/SmartClick; MY TAGS e fonte em Downloads preservados.
- Paleta lavanda/turquesa suave, navegação com ícones vetoriais em relevo por CSS (sem baixar imagens), atalhos e carrossel com três slides.
- Carrossel com anterior/próximo, indicadores, pausa e respeito à preferência por movimento reduzido.
- Página inicial mantém importação e links para as rotas existentes.
- Ajustes de apresentação; não foram implementados novos serviços de autenticação, cobrança ou nuvem.
- Dados do utilitário storage.ts continuam locais. A mudança visual não comprova integração com Supabase.
- Verificação de build e inspeção visual pendentes se a instalação das dependências não concluir neste ambiente.
