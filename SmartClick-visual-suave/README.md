# 🛒 SmartClick — Sua lista vira um encarte

SmartClick é uma plataforma completa e funcional desenvolvida para mercados de bairro, mercearias e conveniências gerarem encartes e folhetos de ofertas automaticamente a partir de planilhas ou do catálogo integrado.

---

## 🚀 Como Executar o Projeto Localmente

### 1. Pré-requisitos
- **Node.js**: Versão 18 ou superior (testado com Node v24).
- **Gerenciador de Pacotes**: npm ou pnpm.

### 2. Instalação e Execução
```bash
# Clone o projeto ou abra esta pasta no terminal
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador. O projeto já inicia com 10 produtos de demonstração, 10 modelos visuais ativos e armazenamento local imediato caso o Supabase não esteja conectado.

---

## 📁 Estrutura do Projeto

- `src/app/page.tsx`: Tela inicial aprovada com cartão principal, botão de importação, etapas e ideias do mês.
- `src/app/campanhas/nova/page.tsx`: Editor automático com escolha de formato (Stories 1080×1920, Feed 1080×1350, A4 impresso 210×297mm), cálculo de páginas e exportações.
- `src/app/produtos/page.tsx`: Gestão de produtos, 12 categorias comerciais, busca, favoritos e inclusão rápida.
- `src/app/sugestoes/page.tsx`: Calendário sazonal com sugestões diárias, semanais e comemorativas (Feira, Churrasco, Limpeza, Black Friday, Natal).
- `src/app/loja/page.tsx`: Configuração de nome, endereço, WhatsApp, Instagram e texto legal do rodapé.
- `src/app/admin/page.tsx`: Painel administrativo protegido para gestão de lojas, validade de planos e liberação manual de Pix.
- `src/components/FlyerCanvas.tsx`: Mecanismo de composição gráfica de alta qualidade com fotos proporcionais, preços em destaque no padrão brasileiro e rodapé obrigatório.
- `src/components/PromoBadge3D.tsx`: Biblioteca de selos promocionais tridimensionais (3D gráfico de estúdio).
- `src/utils/exportHelper.ts`: Exportação real de PNG por página (com pixel ratio para alta definição) e montagem de PDF multipáginas.
- `src/utils/importHelper.ts`: Mapeamento inteligente de planilhas Excel/CSV, reconhecimento de unidades (`500 g`, `1 kg`, `900 ml`), tratamento de preços brasileiros e detecção de duplicados.
- `supabase/schema.sql`: Estrutura de tabelas PostgreSQL com Row Level Security (RLS) para isolamento por loja.

---

## 🎨 Os 10 Modelos Visuais Implementados

1. **PROMOÇÃO**: Vermelho (`#E53935`), laranja (`#FF6F00`) e amarelo (`#FFC107`).
2. **OFERTAS DA SEMANA**: Azul royal (`#1565C0`), vermelho e branco.
3. **OFERTAS DO DIA**: Laranja avermelhado, amarelo e branco (estilo relógio/relâmpago).
4. **FIM DE SEMANA DE OFERTAS**: Azul escuro (`#1A237E`), laranja e amarelo.
5. **AÇOUGUE EM OFERTA**: Bordô (`#880E4F`), vermelho escuro e dourado.
6. **FEIRINHA DE OFERTAS**: Verde folha (`#2E7D32`), laranja e amarelo.
7. **FESTIVAL DA LIMPEZA**: Azul claro (`#0288D1`), branco e verde-água.
8. **BLACK FRIDAY**: Preto contrastante, amarelo e branco.
9. **NATAL DE OFERTAS**: Vermelho tradicional, verde e dourado.
10. **RÉVEILLON DE OFERTAS**: Azul escuro, prata e detalhes dourados.

---

## 📑 Tabela de 12 Categorias Preparadas

1. Mercearia básica
2. Café da manhã
3. Laticínios e frios
4. Açougue e aves
5. Hortifruti
6. Padaria
7. Bebidas sem álcool
8. Biscoitos e snacks
9. Congelados
10. Limpeza
11. Higiene pessoal
12. Pet

---

## 🔒 Segurança e Banco de Dados (Supabase)

Para conectar o Supabase em produção:
1. Crie um projeto no Supabase.
2. Copie os comandos de `supabase/schema.sql` e execute no SQL Editor do painel do Supabase.
3. Crie um arquivo `.env.local` preenchendo as chaves com base no arquivo `.env.example`.
4. Todas as tabelas possuem **Row Level Security (RLS)** ativado, garantindo isolamento total entre os estabelecimentos.
