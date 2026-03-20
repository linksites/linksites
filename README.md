# LinkSites

<p align="center">
  <a href="https://linksites.github.io/linksites" target="_blank" title="Acessar LinkSites">
    <img src="assets/logoLS.png" alt="LinkSites" width="180" />
  </a>
</p>

> Presenca digital premium para marcas, criadores, especialistas e negocios locais.

O **LinkSites** hoje funciona como uma landing page SaaS publicada no GitHub Pages. O projeto apresenta a marca, mostra modelos reais, reforca prova social e prepara a transicao da vitrine institucional para um produto escalavel de bio link premium e mini site profissional.

O repositorio agora tambem abriga a camada do produto em `linksites-app/`, publicada separadamente na Vercel.

## Acesso rapido

- Site publicado: [https://linksites.github.io/linksites/](https://linksites.github.io/linksites/)
- App publicado: [https://linksites.vercel.app/](https://linksites.vercel.app/)
- Repositorio: [https://github.com/linksites/linksites](https://github.com/linksites/linksites)
- Landing stack: `React`, `Vite`, `Tailwind CSS`
- App stack: `Next.js`, `Supabase`, `Tailwind CSS`
- Deploys: `GitHub Pages` para a landing e `Vercel` para o app

## Visao atual

A home foi reposicionada para uma narrativa de produto:

- hero com foco em SaaS
- secao de como funciona
- secao de para quem serve
- showcase com casos reais e modelos
- planos de entrada, pro e business
- CTA final conectado ao `LinkSites App`

A landing agora funciona como ponte para o app:

- CTAs principais levando para `https://linksites.vercel.app/dashboard`
- demo publica apontando para `https://linksites.vercel.app/u/linksitesapp`
- transicao da vitrine para o produto sem depender de um segundo repositorio

Ao mesmo tempo, o projeto continua servindo como vitrine comercial da LinkSites e base para a futura separacao entre landing publica e app do produto.

## O que ja foi feito

- secoes extraidas em componentes reutilizaveis em `src/components/sections`
- card de portfolio isolado em `src/components/CaseCard.jsx`
- dados dos cases movidos para `src/data/cases.js`
- camada de conteudo centralizada em `src/data/siteContent.js`
- suporte a `pt-BR` e `en` com alternancia de idioma no header
- persistencia do idioma com `localStorage`
- metadados e SEO reforcados com canonical, Open Graph, Twitter Cards, JSON-LD, `robots.txt`, `sitemap.xml` e `site.webmanifest`
- cards do portfolio consultando `pushed_at` ao vivo na API do GitHub, com fallback em `public/repo-updates.json`
- contador de visitantes unicos por navegador
- conversao automatica de moeda nos planos entre `BRL` e `USD`, incluindo o valor numerico
- conexao direta entre os CTAs da landing e o `linksites-app`
- home do app com vitrine da conta oficial `@linksitesapp`
- autenticacao real com Supabase no app
- criacao automatica de perfil no primeiro acesso do usuario
- dashboard editavel com perfil, links, tema, publicacao e avatar
- pagina publica por `username` em `/u/[username]`

## Arquitetura

Principais decisoes da base atual:

- `React` para composicao da interface
- `Vite` para ambiente rapido de desenvolvimento e build
- `Tailwind CSS` para consistencia visual e produtividade
- `src/components/sections` para composicao da home
- `src/components/shared` para UI reutilizavel
- `src/data/cases.js` para os cases do showcase
- `src/data/siteContent.js` para conteudo bilingue
- `linksites-app/` como camada SaaS dentro do mesmo repositorio
- consulta em tempo real ao GitHub para atividade dos repositorios
- fallback estatico gerado por `npm run sync:repo-updates`
- deploy continuo com `.github/workflows/deploy-pages.yml` para a landing

## Internacionalizacao

O projeto esta disponivel em dois idiomas:

- Portugues do Brasil (`pt-BR`)
- Ingles (`en`)

A troca de idioma afeta:

- navegacao
- hero
- secoes da home
- planos
- CTA e modal
- footer
- textos dinamicos dos cards
- titulo e descricao da pagina

## Planos e moeda

Os planos usam `amountBrl` como base numerica. A exibicao muda automaticamente conforme o idioma:

- em `pt-BR`, os valores aparecem em `R$`
- em `en`, os valores sao convertidos para `USD`

A conversao usa a API Frankfurter:

- Documentacao: [https://frankfurter.dev/docs/](https://frankfurter.dev/docs/)

No navegador, a cotacao `BRL -> USD` e buscada em tempo real e guardada em cache local para reduzir dependencia imediata da API.

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

Depois, abra a URL exibida pelo Next.js no navegador.

## Build de producao

```bash
npm run sync:repo-updates
npm run build
```

O resultado e gerado na pasta `dist/`.

## Publicacao

Os deploys acontecem a cada push na branch `main`.

Fluxo atual:

1. editar a landing em `src/` ou o app em `linksites-app/`
2. sincronizar o fallback com `npm run sync:repo-updates`
3. validar com `npm run build` na landing ou no app
4. fazer commit
5. enviar para `origin/main`
6. aguardar a publicacao no GitHub Pages e/ou na Vercel

## Estrutura essencial

```text
.
|-- assets/
|   |-- logoLS.png
|   `-- logolinksites.jpg
|-- public/
|   |-- favicon.svg
|   |-- og-cover.svg
|   |-- repo-updates.json
|   |-- robots.txt
|   |-- sitemap.xml
|   `-- site.webmanifest
|-- scripts/
|   `-- sync-repo-updates.mjs
|-- src/
|   |-- components/
|   |   |-- sections/
|   |   `-- shared/
|   |-- data/
|   |   |-- cases.js
|   |   `-- siteContent.js
|   |-- App.jsx
|   |-- index.css
|   `-- main.jsx
|-- .github/
|   `-- workflows/
|       `-- deploy-pages.yml
|-- linksites-app/
|   |-- docs/
|   |-- src/
|   |-- supabase/
|   `-- README.md
|-- index.html
|-- package.json
`-- vite.config.js
```

## Proximas metas

- preparar SEO por pagina ou projeto quando houver rotas dedicadas
- gerar social previews em PNG ou JPG para ampliar compatibilidade nas plataformas
- adicionar validacoes automaticas de build, links e metadados no CI
- refinar o fluxo de confirmacao de cadastro e entrega de emails no Supabase
- adicionar analytics de visitas e cliques no `linksites-app`
- ampliar temas e personalizacao visual dos perfis
- melhorar onboarding, estados de erro e feedback do dashboard
- avaliar provedor SMTP dedicado para cadastro publico confiavel

## Contato

- WhatsApp: [https://wa.me/5591982460001](https://wa.me/5591982460001)
- E-mail: `sergiosrdev@hotmail.com`

## Posicionamento

O caminho atual da LinkSites e claro: manter a landing como vitrine comercial e evoluir o produto SaaS em paralelo.

Este repositorio agora cobre as duas frentes:

- a camada publica da estrategia em `linksites/`
- a camada SaaS em `linksites-app/`
