# LinkSites

Landing page institucional da LinkSites, agora em uma base moderna com React, Vite e Tailwind CSS.

## Projeto

- Site publicado: `https://linksites.github.io/linksites/`
- Repositorio: `https://github.com/linksites/linksites`
- Stack atual: `React + Vite + Tailwind CSS`
- Deploy automatico via GitHub Pages

## Direcao atual

O projeto foi migrado da estrutura estatica original para uma base em React com foco em:

- identidade visual elegante e coerente com a marca LinkSites
- paleta institucional em navy, azul e ciano
- hero premium com composicao visual refinada e marca transparente integrada ao layout
- conteudo textual institucional restaurado na nova interface
- componentizacao e evolucao mais organizada da interface
- base pronta para expandir em secoes, componentes e design system

## Recursos atuais

- app em React com entrada via Vite
- Tailwind CSS integrado ao projeto
- header responsivo com menu mobile
- hero com CTA principal e CTA secundario, usando a arte transparente da marca em `assets/logoLS.png`
- secao de servicos com o conteudo institucional da LinkSites
- cards de servicos com ilustracoes relacionadas a cada oferta
- secao de diferenciais
- portfolio lateral com cases reais, links de projeto/codigo e leitura da ultima atualizacao no GitHub
- secao sobre com contador de visitantes unicos por navegador
- secao final de contato com WhatsApp, e-mail e localizacao
- microdetalhes visuais com simbolos discretos para reforcar o tom criativo sem perder elegancia
- uso da logo real da LinkSites em `assets/logolinksites.jpg`
- uso da arte transparente da marca em `assets/logoLS.png` na composicao principal do hero
- build de producao validado com `npm run build`

## Estrutura

- [index.html](c:/Projeto/linksites/index.html): shell HTML usada pelo Vite
- [package.json](c:/Projeto/linksites/package.json): scripts e dependencias do projeto
- [vite.config.js](c:/Projeto/linksites/vite.config.js): configuracao do Vite com React e Tailwind
- [src/main.jsx](c:/Projeto/linksites/src/main.jsx): ponto de entrada da aplicacao React
- [src/App.jsx](c:/Projeto/linksites/src/App.jsx): landing page principal em React
- [src/index.css](c:/Projeto/linksites/src/index.css): estilos globais e configuracao visual com Tailwind
- [assets/logolinksites.jpg](c:/Projeto/linksites/assets/logolinksites.jpg): logo da marca usada no header
- [assets/logoLS.png](c:/Projeto/linksites/assets/logoLS.png): arte transparente usada na composicao principal do hero
- [.github/workflows/deploy-pages.yml](c:/Projeto/linksites/.github/workflows/deploy-pages.yml): workflow de deploy no GitHub Pages

## Como rodar localmente

1. instalar dependencias com `npm install`
2. iniciar ambiente local com `npm run dev`
3. abrir a URL mostrada pelo Vite no navegador

## Como gerar build

1. executar `npm run build`
2. o resultado sera gerado na pasta `dist/`

## Como publicar

O deploy acontece automaticamente a cada push na branch `main`.

Fluxo atual:

1. editar os arquivos do app
2. testar com `npm run build`
3. fazer commit
4. enviar para `origin/main`
5. aguardar o GitHub Pages atualizar a URL publicada

## Proximos passos sugeridos

1. separar a landing em componentes como `Navbar`, `Hero`, `Services`, `Cases` e `Contact`
2. integrar tambem a arte horizontal oficial da marca em `assets/`
3. transformar os cases e os diferenciais em dados reutilizaveis em vez de conteudo inline
4. revisar os textos e a acentuacao para padronizar UTF-8
5. refinar ainda mais o hero e os microdetalhes visuais sem perder sobriedade
6. preparar favicon, social preview e metadados completos da marca

## Contato

- WhatsApp: `+55 91 98246-0001`
- Link direto: `https://wa.me/5591982460001`
- E-mail: `sergiosrdev@hotmail.com`

## Visao da LinkSites

A proposta da LinkSites e conectar clientes ao mundo digital com identidade, clareza, presenca profissional e uma experiencia visual premium.

