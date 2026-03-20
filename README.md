# LinkSites

<p align="center">
  <a href="https://linksites.github.io/linksites" target="_blank" title="Acessar LinkSites">
    <img src="assets/logoLS.png" alt="LinkSites" width="180" />
  </a>
</p>

> Presenca digital premium para criadores, especialistas, marcas pessoais e negocios locais.

O repositorio concentra duas frentes do produto:

- a landing institucional em `src/`, publicada no `GitHub Pages`
- o app SaaS em `linksites-app/`, publicado na `Vercel`

A ideia central continua a mesma: transformar um link na bio em uma pagina com mais identidade visual, mais contexto comercial e espaco para evoluir para uma mini rede social entre perfis.

Este README da raiz prioriza a camada publica da landing page. A documentacao detalhada do produto fica em `linksites-app/README.md`.

## Visao do repositorio

### 1. Landing publica

A raiz do projeto funciona como vitrine e narrativa de produto:

- posicionamento da marca
- SEO e prova social
- showcase de casos reais
- planos e conversao
- ponte direta para o app

Stack atual:

- `React`
- `Vite`
- `Tailwind CSS`

Principais pontos de edicao da landing:

- `src/App.jsx`
  composicao da pagina e integracao entre secoes
- `src/components/sections/`
  secoes visuais da home
- `src/components/shared/`
  elementos reutilizaveis da interface
- `src/data/siteContent.js`
  copy, traducao e estrutura de conteudo
- `src/data/cases.js`
  showcase de casos e demonstracoes
- `public/`
  ativos publicos, SEO e arquivos servidos pela landing

### 2. App do produto

`linksites-app/` abriga o MVP SaaS:

- autenticacao com `Supabase`
- criacao automatica de perfil
- dashboard editavel
- onboarding com checklist de publicacao
- analytics de visitas e cliques no dashboard
- avatar por upload ou URL
- pagina publica em `/u/[username]`
- modo mock quando o ambiente nao esta configurado

Stack atual:

- `Next.js`
- `React`
- `Supabase`
- `Tailwind CSS`

## Estado atual

O projeto ja esta em um ponto bom para continuar evoluindo. O build da landing e o lint do app passam, e a separacao entre marketing e produto ja existe. O principal gargalo agora nao e estabilidade basica, e sim maturidade de arquitetura, higiene do repositorio e profundidade de produto.

Ja existe hoje:

- landing bilingue com CTA para o app
- portfolio com consulta de atualizacao de repositorios
- conversao de precos `BRL -> USD`
- autenticacao real no app
- dashboard com edicao de perfil, tema, links, avatar e publicacao
- onboarding com progresso do perfil
- analytics de visualizacoes, visitantes unicos e cliques
- validacao automatica de build e lint no CI (GitHub Actions)
- landing page modularizada com hooks utilitarios customizados
- banco de dados preparado para interatividade (follows, chat, notificacoes, presenca)
- pagina publica de perfil
- schema com `profiles`, `links`, `themes`, `analytics_events` e politicas RLS

Na pratica:

- a landing vende, educa e direciona trafego
- o app autentica, publica perfis e mede interacao

## Estrutura principal

```text
.
|-- assets/
|-- public/
|-- scripts/
|-- src/                  # landing Vite
|-- linksites-app/        # app Next.js
|   |-- docs/
|   |-- src/
|   |-- supabase/
|   `-- README.md
|-- .github/workflows/
|-- index.html
|-- package.json
`-- README.md
```

## Como rodar localmente

Landing:

```bash
npm install
npm run dev
```

Depois, abra a URL exibida pelo Vite no navegador.

App:

```bash
cd linksites-app
npm install
npm run dev
```

Para o app, copie `linksites-app/.env.example` para `linksites-app/.env.local` e preencha as variaveis do Supabase. Sem isso, a interface continua funcionando em modo mock para revisao visual.

## Build e validacao

Landing:

```bash
npm run sync:repo-updates
npm run build
```

O build da landing gera os arquivos estaticos em `dist/`, prontos para publicacao no GitHub Pages.

App:

```bash
cd linksites-app
npm run lint
npm run build
```

Se voce alterar o schema do app, aplique tambem `linksites-app/supabase/schema.sql` no projeto Supabase antes do deploy completo da funcionalidade.

## Higiene do repositorio

Arquivos gerados localmente nao devem ser versionados. Este repositorio agora ignora os principais artefatos da raiz, como:

- `node_modules/`
- `dist/`
- `.vscode/`
- `*.log`
- `tmp-home.png`

Na pratica, isso significa que os seguintes itens podem ser descartados sem impacto no codigo-fonte:

- builds locais
- logs de desenvolvimento
- capturas temporarias
- configuracoes locais do editor

## Deploy da landing

A landing da raiz e publicada pelo workflow do GitHub Pages em `.github/workflows/deploy-pages.yml`.

Fluxo esperado:

1. editar arquivos da landing em `src/`, `public/` ou `assets/`
2. rodar `npm run sync:repo-updates` quando o showcase depender do fallback local
3. validar com `npm run build`
4. enviar para `main`

O app em `linksites-app/` continua com deploy separado na Vercel.

## Direcao de produto

Hoje o LinkSites e um SaaS de perfil publico e mini site leve. A evolucao para uma mini rede social entre usuarios deve acontecer por camadas, sem perder a simplicidade do MVP.

Prioridades recomendadas:

1. fortalecer a identidade do perfil
2. instrumentar analytics para entender uso e conversao
3. criar sinais sociais leves entre perfis
4. liberar descoberta entre usuarios antes de pensar em feed mais denso

Traduzindo isso em funcionalidades:

- analytics de visitas, cliques e origem de trafego
- checklist de onboarding e progresso do perfil
- blocos de destaque e colecoes de links
- seguir perfis favoritos
- perfis recomendados
- atividade recente do criador
- notificacoes simples de novas publicacoes
- mural de atualizacoes curtas

## Proximas metas sugeridas

- **UI de Interatividade**: Construir e integrar a interface do feed de notificacoes em tempo real.
- **Sistema de Chat**: Desenvolver as telas de DMs e grupos aproveitando as tabelas e politicas RLS ja criadas.
- **Presenca de Usuarios**: Implementar o hook de presenca no Next.js para mostrar quem esta online.
- **Gestao do Banco**: Consolidar o uso de `supabase migration new` para todas as proximas alteracoes de schema.
- **UI de Posts**: Finalizar a construcao da tela para a publicacao de `posts` e interacao via `reactions`.deploy


## Contato

- WhatsApp: [https://wa.me/5591982460001](https://wa.me/5591982460001)
- E-mail: `linksitesapp@gmail.com`
