# LinkSites App

`linksites-app` e a camada SaaS do ecossistema LinkSites.

Este projeto fica separado da landing publica para permitir a evolucao do produto sem misturar vitrine comercial, autenticacao, dashboard, banco de dados e regras de negocio no site servido pelo GitHub Pages.

## Visao do produto

O objetivo do app e entregar uma experiencia tipo Linktree premium, mas com mais identidade visual e espaco para evoluir para mini sites profissionais.

Hoje a base ja cobre:

- autenticacao real com Supabase
- criacao automatica de `profile` no primeiro acesso
- dashboard autenticado
- pagina publica por `username`
- edicao de perfil no dashboard
- gerenciamento de links
- interface bilingue `pt-BR` e `en`

## Separacao de responsabilidades

- `linksites/`
  Landing page, marketing, SEO e vitrine publica
- `linksites-app/`
  Produto SaaS, auth, dashboard, preview, pagina publica e integracao com banco

## Stack

- Next.js App Router
- React
- Tailwind CSS
- Supabase Auth
- Supabase Postgres
- Supabase Storage
- Vercel para deploy do app

## Status atual

O app ja permite:

- criar conta com email e senha
- usar magic link
- confirmar email
- entrar com sessao real
- criar automaticamente o perfil do usuario
- editar:
  nome de exibicao
  username
  bio
  avatar por URL
  tema visual
  publicacao da pagina
- editar links:
  criar
  atualizar
  remover
  ativar ou desativar
  reorganizar por ordem numerica
- visualizar a pre-visualizacao da pagina publica no proprio dashboard

## Rotas atuais

- `/`
  Entrada do produto
- `/login`
  Login, cadastro e magic link
- `/dashboard`
  Painel autenticado do criador
- `/u/[username]`
  Pagina publica do perfil

## Estrutura principal

- `src/app/`
  Rotas, paginas, server actions e fluxo do App Router
- `src/components/`
  Componentes reutilizaveis, preview e seletor de idioma
- `src/data/`
  Conteudo centralizado e traducao da interface
- `src/lib/`
  Tipos, integracao Supabase, locale, mocks e loaders
- `supabase/schema.sql`
  Schema inicial do banco e politicas RLS
- `docs/ARCHITECTURE.md`
  Visao arquitetural do app

## Configuracao local

1. Copie `.env.example` para `.env.local`
2. Preencha as variaveis:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

3. Rode:

```bash
npm install
npm run dev
```

Se as variaveis do Supabase nao estiverem configuradas, o app entra em modo mock para permitir revisao visual da interface.

## Banco de dados

O schema inicial esta em:

- `supabase/schema.sql`

Ele cria:

- `profiles`
- `links`
- `themes`
- trigger de `updated_at`
- politicas de Row Level Security

Modelo atual:

- `profiles`
  Um perfil por usuario autenticado
- `links`
  Lista de botoes exibidos na pagina publica
- `themes`
  Catalogo de temas visuais

## Autenticacao

O fluxo atual usa Supabase Auth com:

- login por email e senha
- cadastro por email e senha
- magic link
- callback em `/auth/confirm`
- logout em `/auth/signout`

Quando um usuario autenticado entra pela primeira vez, o app cria automaticamente o registro em `profiles`.

## Internacionalizacao

O app segue a mesma ideia de alternancia do projeto principal:

- seletor de idioma visivel na interface
- persistencia via cookie `linksites-locale`
- conteudo centralizado em `src/data/app-content.ts`

Idiomas disponiveis:

- `pt-BR`
- `en`

## Deploy

Deploy recomendado:

- landing publica no GitHub Pages
- app SaaS na Vercel

Configuracao da Vercel:

- repositório: `linksites/linksites`
- root directory: `linksites-app`
- framework preset: `Next.js`

Variaveis de ambiente na Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

Depois do deploy, ajuste no Supabase:

- `Authentication > URL Configuration`
- `Site URL`
- `Redirect URLs`

## Proximos passos

Metas naturais para a proxima fase:

- upload real de avatar com Supabase Storage
- refinamento visual do dashboard
- feedback de onboarding e progresso
- analytics de visitas e cliques
- dominios personalizados
- planos e cobranca
- controles mais ricos de layout e secoes
