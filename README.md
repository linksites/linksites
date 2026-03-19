# LinkSites

<p align="center">
  <a href="https://linksites.github.io/linksites" target="_blank" title="Acessar LinkSites">
  <img src="assets/logoLS.png" alt="Logo LinkSites - Acesse nossa plataforma" width="180" />
</a>
</p>

> 🚀 Presenca digital premium para marcas que querem autoridade, clareza e conversao.

A **LinkSites** e uma startup focada em transformar posicionamento digital em experiencia visual de alto nivel. Este projeto representa a landing page institucional da marca em uma base moderna, performatica e pronta para evolucao.

## 🌐 Acesso Rapido

- **Site publicado:** [https://linksites.github.io/linksites/](https://linksites.github.io/linksites/)
- **Repositorio:** [https://github.com/linksites/linksites](https://github.com/linksites/linksites)
- **Stack principal:** `React`, `Vite`, `Tailwind CSS`
- **Deploy:** automatico via `GitHub Pages`

## ✨ Visao do Projeto

O objetivo desta aplicacao e apresentar a LinkSites como uma empresa de tecnologia com:

- identidade visual forte e coerente com a marca
- comunicacao institucional clara
- portfolio com projetos reais
- experiencia premium em desktop e mobile
- estrutura pronta para crescimento continuo

Mais do que uma landing page, este repositorio funciona como vitrine de posicionamento, design e capacidade de execucao.

## 💼 Destaques da Experiencia

- **Hero institucional premium** com composicao visual refinada e CTAs estrategicos
- **Secao de servicos** com foco em sites corporativos, lojas virtuais, SEO e suporte
- **Diferenciais competitivos** apresentados com leitura objetiva e hierarquia forte
- **Cases reais em showcase horizontal** com links de projeto e codigo
- **Cards de portfolio com ultimo push ao vivo** via API do GitHub, com fallback local em `repo-updates.json`
- **Contador de visitantes unicos por navegador** para reforco de presenca e prova de tracao
- **Contato direto por WhatsApp** com caminho curto para conversao

## 🎨 Direcao Visual

A identidade da interface foi desenhada para transmitir sofisticao, confianca e modernidade.

**Paleta principal**

- `#07101b` - navy profundo
- `#0b1728` - background secundario
- `#0d2136` - paines e cards
- `#62f0eb` - ciano de destaque
- `#3b82f6` - azul de apoio
- `#edf7ff` - texto principal

**Tipografia**

- **Display:** `Space Grotesk`
- **Texto:** `Outfit`

**Assets**

- `assets/logolinksites.jpg` - logo principal da marca
- `assets/logoLS.png` - arte transparente usada no hero

## 🧠 Arquitetura e Decisoes

O projeto foi estruturado para manter velocidade de entrega sem abrir mao de organizacao:

- `React` para composicao da interface
- `Vite` para ambiente rapido de desenvolvimento e build
- `Tailwind CSS` para consistencia visual e produtividade
- secoes extraidas em componentes reutilizaveis dentro de `src/components/sections`
- card de portfolio isolado em `src/components/CaseCard.jsx`
- dados dos cases separados em `src/data/cases.js`
- consulta ao GitHub em tempo real para exibir o `pushed_at` dos repositorios dos cards
- fallback estatico gerado em `public/repo-updates.json` pelo script `npm run sync:repo-updates`
- camada SEO com canonical, Open Graph, Twitter Cards, JSON-LD, `robots.txt`, `sitemap.xml` e `site.webmanifest`
- deploy continuo com workflow em `.github/workflows/deploy-pages.yml`

Essa base permite iterar rapidamente em layout, conteudo, portfolio e expansao futura para design system, conteudo externo e automacoes de publicacao.

## 🛠️ Como Rodar Localmente

```bash
npm install
npm run dev
```

Depois, abra a URL exibida pelo Vite no navegador.

## 📦 Build de Producao

```bash
npm run sync:repo-updates
npm run build
```

O resultado e gerado na pasta `dist/`.

## 🚀 Publicacao

O deploy acontece automaticamente a cada push na branch `main`.

Fluxo atual:

1. editar os arquivos do projeto
2. sincronizar o snapshot de fallback com `npm run sync:repo-updates`
3. validar com `npm run build`
4. fazer commit
5. enviar para `origin/main`
6. aguardar a publicacao no GitHub Pages

## 📁 Estrutura Essencial

```text
.
|-- assets/
|   |-- logoLS.png
|   `-- logolinksites.jpg
|-- public/
|   |-- favicon.svg
|   |-- og-cover.svg
|   `-- repo-updates.json
|-- scripts/
|   `-- sync-repo-updates.mjs
|-- src/
|   |-- components/
|   |-- data/
|   |-- App.jsx
|   |-- index.css
|   `-- main.jsx
|-- .github/
|   `-- workflows/
|       `-- deploy-pages.yml
|-- index.html
|-- package.json
`-- vite.config.js
```

## 📈 Proximo Nivel

Evolucoes naturais para a proxima fase do projeto:

- extrair `navItems`, `services`, `differentials` e `heroPoints` para a camada `src/data/`
- criar uma estrategia de SEO por pagina/projeto para quando o portfolio ganhar rotas proprias
- gerar assets sociais em PNG para melhorar compatibilidade de preview fora do SVG
- fortalecer a documentacao de design, estrutura e operacao
- adicionar validacao automatica para build, metadados e links do portfolio no CI

## 🤝 Contato

- **WhatsApp:** [https://wa.me/5591982460001](https://wa.me/5591982460001)
- **E-mail:** `sergiosrdev@hotmail.com`

## 🏁 Posicionamento

A proposta da LinkSites e simples e ambiciosa: **conectar empresas ao mundo digital com tecnologia, identidade e presenca profissional de alto impacto**.

Este repositorio traduz essa visao em uma experiencia concreta, publica e evolutiva.
