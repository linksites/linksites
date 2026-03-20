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

### 2. App do produto

`linksites-app/` abriga o MVP SaaS:

- autenticacao com `Supabase`
- criacao automatica de perfil
- dashboard editavel
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
- pagina publica de perfil
- schema inicial com `profiles`, `links`, `themes` e politicas RLS

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

App:

```bash
cd linksites-app
npm run lint
npm run build
```

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

## Direcao de produto

Hoje o LinkSites e um SaaS de perfil publico e mini site leve. A evolucao natural para uma mini rede social entre usuarios deve ser incremental, sem perder a simplicidade do MVP.

Prioridades recomendadas:

1. fortalecer a identidade do perfil
2. criar sinais sociais leves
3. liberar descoberta entre usuarios
4. instrumentar analytics antes de feed complexo

Traduzindo isso em funcionalidades:

- seguir perfis favoritos
- bloco de perfis recomendados
- atividade recente do criador
- colecoes de links ou destaques
- mural de atualizacoes curtas
- notificacoes simples de novas publicacoes
- analytics de visitas, cliques e origem de trafego

## Proximas metas sugeridas

- extrair logicas da landing que hoje vivem em `src/App.jsx` para hooks utilitarios
- mover URLs externas fixas para configuracao central
- adicionar validacao automatica de build no CI para landing e app
- criar um documento de roadmap por fases do produto
- evoluir o modelo de dados do app para suportar `follows`, `posts`, `reactions` e `notifications`
- separar claramente o que e conteudo institucional do que e regra de negocio

## Contato

- WhatsApp: [https://wa.me/5591982460001](https://wa.me/5591982460001)
- E-mail: `linksitesapp@gmail.com`
