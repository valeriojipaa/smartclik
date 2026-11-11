-- ==============================================================================
-- SMARTCLICK - ESTRUTURA DO BANCO DE DADOS (SUPABASE POSTGRESQL + RLS)
-- ==============================================================================

-- 1. TABELA DE LOJAS (STORE PROFILES)
create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  cnpj text,
  address text,
  phone text,
  whatsapp text,
  instagram text,
  logo_url text,
  primary_color text default '#7C3AED',
  accent_color text default '#A78BFA',
  footer_legal_text text default 'Ofertas válidas enquanto durarem os estoques. Fotos meramente ilustrativas.',
  plan text default 'mensal',
  subscription_status text default 'ativo', -- 'ativo', 'pendente_pix', 'expirado'
  valid_until timestamp with time zone default (now() + interval '30 days'),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. TABELA DE MEMBROS / USUÁRIOS VINCULADOS À LOJA
create table if not exists public.store_users (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references public.stores(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text default 'editor', -- 'owner', 'editor', 'admin'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (store_id, user_id)
);

-- 3. TABELA DE PRODUTOS DA LOJA
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references public.stores(id) on delete cascade not null,
  name text not null,
  brand text,
  package_content text, -- Ex: '900 ml', '500 g'
  sale_unit text default 'unidade', -- Ex: 'unidade', 'kg', 'pacote'
  current_price numeric(10,2) not null,
  category text not null,
  image_url text,
  is_favorite boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. TABELA DE CAMPANHAS
create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references public.stores(id) on delete cascade not null,
  title text not null,
  theme_id text not null,
  start_date date,
  end_date date,
  has_stock_limit boolean default true,
  has_illustrative_images_notice boolean default true,
  items jsonb not null default '[]'::jsonb,
  formats text[] default array['stories', 'feed', 'a4']::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. CATÁLOGO COMPARTILHADO DE FOTOS APROVADAS (GLOBAL)
create table if not exists public.shared_product_catalog (
  id uuid primary key default gen_random_uuid(),
  gtin text,
  product_name text not null,
  brand text,
  package_content text,
  image_url text not null,
  source text default 'manual_upload', -- 'openfoodfacts', 'manual_upload'
  license text default 'CC-BY-SA',
  verified_at timestamp with time zone default timezone('utc'::text, now())
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) - ISOLAMENTO COMPLETO ENTRE LOJAS
-- ==============================================================================

alter table public.stores enable row level security;
alter table public.store_users enable row level security;
alter table public.products enable row level security;
alter table public.campaigns enable row level security;
alter table public.shared_product_catalog enable row level security;

-- Política para PRODUTOS: Cada usuário só enxerga os produtos da sua própria loja vinculada
create policy "Usuários acessam produtos da sua própria loja"
  on public.products
  for all
  using (
    store_id in (
      select su.store_id from public.store_users su where su.user_id = auth.uid()
    )
  );

-- Política para CAMPANHAS: Usuários só visualizam e alteram campanhas de sua loja
create policy "Usuários acessam campanhas da sua própria loja"
  on public.campaigns
  for all
  using (
    store_id in (
      select su.store_id from public.store_users su where su.user_id = auth.uid()
    )
  );

-- Catálogo compartilhado de fotos: Todos os autenticados podem consultar imagens aprovadas
create policy "Qualquer loja autenticada pode consultar catálogo compartilhado de fotos"
  on public.shared_product_catalog
  for select
  using (auth.role() = 'authenticated');
