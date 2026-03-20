# LinkSites App

`linksites-app` e a camada SaaS do ecossistema LinkSites.

Ele existe separado da landing publica para nao misturar marketing, SEO e prova social com autenticacao, dashboard, banco de dados e regras de produto.

## O que o app ja entrega

O MVP atual ja cobre o fluxo principal de um criador:

- criar conta com email e senha
- entrar com email e senha ou magic link
- confirmar email
- gerar automaticamente um perfil no primeiro acesso
- editar `display name`, `username`, `bio`, `tema`, `status de publicacao` e `avatar`
- enviar avatar com `Supabase Storage`
- criar, editar, remover, reordenar e ativar links
- publicar a pagina publica em `/u/[username]`
- visualizar preview do perfil no dashboard
- acompanhar onboarding com checklist de publicacao
- acompanhar analytics de visitas, visitantes unicos e cliques

Sem variaveis de ambiente, o app entra em modo mock para revisao visual da experiencia.

## Stack

- `Next.js` App Router
- `React`
- `Tailwind CSS`
- `Supabase Auth`
- `Supabase Postgres`
- `Supabase Storage`
- `Vercel`

## Rotas principais

- `/`
  Entrada do produto e vitrine da conta oficial
- `/login`
  Login, cadastro e magic link
- `/dashboard`
  Painel autenticado de configuracao
- `/api/analytics`
  Captura publica de `profile_view` e `link_click`
- `/u/[username]`
  Pagina publica do perfil
- `/auth/confirm`
  Callback de confirmacao por email
- `/auth/signout`
  Encerramento de sessao

## Estrutura

- `src/app/`
  Rotas, paginas e server actions
- `src/components/`
  Componentes reutilizaveis e preview
- `src/data/`
  Conteudo textual e traducao
- `src/lib/`
  Integracao Supabase, mocks, locale, loaders e tipos
- `supabase/schema.sql`
  Schema inicial com RLS
- `docs/ARCHITECTURE.md`
  Visao arquitetural resumida

## Configuracao local

1. Copie `.env.example` para `.env.local`
2. Preencha:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

3. Rode:

```bash
npm install
npm run dev
```

Validacoes uteis:

```bash
npm run lint
npm run build
```

## Modelo de dados atual

O schema inicial cria:

- `profiles`
  um perfil por usuario autenticado
- `links`
  botoes e destinos exibidos na pagina publica
- `themes`
  catalogo de temas visuais
- `analytics_events`
  eventos publicos de visualizacao de perfil e clique em link

Tambem ja existem:

- trigger de `updated_at`
- politicas de `Row Level Security`
- bucket publico `avatars`
- politicas de upload, leitura, update e delete para avatar
- politicas para leitura privada de analytics pelo dono do perfil
- politica publica de insert para capturar eventos em perfis publicados

## Dashboard atual

O dashboard agora concentra tres camadas:

- configuracao do perfil
- checklist de onboarding
- resumo de analytics

Hoje ele mostra:

- views totais
- visitantes unicos
- cliques em links
- views dos ultimos 7 dias
- link com maior volume de cliques
- progresso de publicacao do perfil

## Direcao de produto

Hoje o app e um construtor de pagina publica. Se a proposta e virar uma mini rede social entre usuarios, o melhor caminho e crescer por camadas:

### Camada 1. Perfil forte

- aprofundar onboarding
- ampliar blocos de conteudo
- expandir analytics
- suportar dominios personalizados

### Camada 2. Sinais e medida

- consolidar analytics
- entender origem de trafego
- medir clique, retorno e perfil mais acessado
- transformar dados em proximas acoes de produto

### Camada 3. Relacao entre perfis

- seguir criadores
- favoritos
- perfis relacionados
- notificacoes de atividade

### Camada 4. Conteudo social leve

- blocos de destaque e colecoes de links
- posts curtos
- destaques fixados no perfil
- reacoes
- comentarios moderados

### Camada 5. Descoberta

- feed por interesses
- busca por categoria
- ranking de perfis e colecoes

## Tabelas recomendadas para a proxima fase

Se a meta de mini rede social for confirmada, as proximas entidades naturais sao:

- `follows`
- `posts`
- `post_reactions`
- `comments`
- `notifications`
- `profile_metrics`

Vale manter a evolucao incremental: primeiro sinais sociais leves e analytics, depois feed e interacao mais densa.

## Deploy

Configuracao recomendada na Vercel:

- repositorio: `linksites/linksites`
- root directory: `linksites-app`
- framework preset: `Next.js`

Variaveis de ambiente:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

Depois do deploy, alinhe no Supabase:

- `Authentication > URL Configuration`
- `Site URL`
- `Redirect URLs`
- aplicacao do schema mais recente em `supabase/schema.sql`
