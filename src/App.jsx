import { useState } from "react";
import logo from "../assets/logolinksites.jpg";

const navItems = [
  { label: "Inicio", href: "#inicio" },
  { label: "Servicos", href: "#servicos" },
  { label: "Cases", href: "#cases" },
  { label: "Processo", href: "#processo" },
  { label: "Contato", href: "#contato" },
];

const services = [
  {
    title: "Sites institucionais premium",
    text: "Estruturas claras, design refinado e narrativa de marca pensada para transmitir autoridade desde a primeira dobra.",
  },
  {
    title: "Landing pages de conversao",
    text: "Paginas criadas para campanhas, lancamentos e captacao com foco em clareza, velocidade e resultado comercial.",
  },
  {
    title: "Portfolios e presenca pessoal",
    text: "Interfaces sob medida para profissionais e especialistas que precisam apresentar seu trabalho com elegancia.",
  },
  {
    title: "Design system e continuidade",
    text: "Organizamos o visual para o crescimento da marca com componentes consistentes e manutencao mais simples.",
  },
];

const featuredCases = [
  {
    name: "LinkSites Experience",
    category: "Institucional",
    description:
      "Landing page proprietaria com showcase de servicos, proposta premium e leitura estrategica para marcas digitais.",
    tags: ["React", "Tailwind", "Branding"],
  },
  {
    name: "Sergio Rodrigues",
    category: "Portfolio",
    description:
      "Presenca pessoal elegante com linguagem visual limpa, foco em credibilidade e apresentacao de projetos.",
    tags: ["React", "Portfolio", "UI"],
  },
  {
    name: "Carne Boa",
    category: "Comercio",
    description:
      "Estrutura de apresentacao comercial com identidade forte, blocos objetivos e CTA orientado para atendimento.",
    tags: ["Landing Page", "Conversao", "Marca"],
  },
];

const processSteps = [
  "Imersao visual e estrategica na marca",
  "Direcao de layout, voz e hierarquia",
  "Prototipo funcional com iteracao rapida",
  "Publicacao, refinamento e evolucao continua",
];

const metrics = [
  { value: "Design", label: "elegante, sem exageros" },
  { value: "Stack", label: "React + Tailwind desde a base" },
  { value: "Tema", label: "navy, ciano e azul da LinkSites" },
];

function SectionTag({ children }) {
  return (
    <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-cyan-200/85">
      {children}
    </span>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-strong)] text-[var(--text-primary)]">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-12%] top-[-8%] h-[32rem] w-[32rem] rounded-full bg-cyan-400/12 blur-3xl" />
        <div className="absolute bottom-[-14%] right-[-8%] h-[30rem] w-[30rem] rounded-full bg-blue-500/12 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(98,240,235,0.09),transparent_28%),linear-gradient(180deg,#08111d_0%,#0b1625_45%,#07101b_100%)]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/8 bg-[rgba(6,12,22,0.72)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#inicio" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Logo LinkSites"
              className="h-11 w-11 rounded-2xl object-cover shadow-[0_0_28px_rgba(98,240,235,0.18)]"
            />
            <div className="leading-none">
              <div className="font-display text-2xl tracking-tight text-white">
                Link<span className="text-cyan-300">Sites</span>
              </div>
              <div className="text-[0.65rem] uppercase tracking-[0.28em] text-white/45">
                Presenca digital premium
              </div>
            </div>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium tracking-wide text-white/68 transition hover:text-cyan-200"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <a
              href="#contato"
              className="inline-flex items-center rounded-full border border-cyan-300/25 bg-cyan-300/10 px-5 py-2.5 text-sm font-medium text-cyan-100 transition hover:border-cyan-200/40 hover:bg-cyan-300/16"
            >
              Iniciar projeto
            </a>
          </div>

          <button
            type="button"
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white md:hidden"
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span className="relative h-4 w-5">
              <span
                className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
              />
              <span
                className={`absolute left-0 top-[7px] h-0.5 w-5 rounded-full bg-current transition ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`absolute left-0 top-[14px] h-0.5 w-5 rounded-full bg-current transition ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>

        {menuOpen ? (
          <div className="border-t border-white/8 px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/75"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        ) : null}
      </header>

      <main id="inicio">
        <section className="relative overflow-hidden">
          <div className="mx-auto grid max-w-7xl gap-14 px-4 pb-20 pt-16 sm:px-6 md:pt-24 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:pb-28">
            <div className="max-w-2xl">
              <SectionTag>LinkSites Theme</SectionTag>
              <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
                React e Tailwind para uma presenca digital elegante e precisa.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">
                Uma base nova, premium e organizada para a LinkSites. Sem efeitos baratos, sem visual genérico e com uma direcao clara inspirada no globo, no brilho e na paleta institucional da marca.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-stretch">
                <a
                  href="#contato"
                  className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-gradient-to-r from-cyan-300 to-sky-400 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_18px_40px_rgba(74,222,255,0.18)] transition hover:translate-y-[-1px]"
                >
                  Solicitar direcao visual
                </a>
                <a
                  href="#cases"
                  className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-white/80 transition hover:border-cyan-300/30 hover:text-cyan-100"
                >
                  Ver estrutura da home
                </a>
              </div>

              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                {metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-[1.75rem] border border-white/8 bg-white/[0.03] p-5 backdrop-blur-sm"
                  >
                    <div className="font-display text-2xl text-cyan-200">{metric.value}</div>
                    <div className="mt-1 text-sm leading-6 text-white/58">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-x-[6%] inset-y-[10%] rounded-[2rem] border border-cyan-300/10 bg-[linear-gradient(155deg,rgba(14,32,53,0.92),rgba(5,12,22,0.84))] shadow-[0_30px_70px_rgba(0,0,0,0.35)]" />
              <div className="absolute inset-x-8 inset-y-8 rounded-[2rem] bg-[radial-gradient(circle_at_30%_25%,rgba(98,240,235,0.16),transparent_24%),radial-gradient(circle_at_72%_30%,rgba(59,130,246,0.18),transparent_26%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_55%)]" />
              <div className="hero-orbit absolute inset-0" />
              <div className="relative flex w-full max-w-[30rem] items-center justify-center px-8 py-10">
                <div className="relative w-full">
                  <img
                    src={logo}
                    alt="Marca LinkSites"
                    className="mx-auto w-full max-w-[24rem] drop-shadow-[0_0_40px_rgba(98,240,235,0.16)]"
                  />
                  <div className="absolute -bottom-3 left-3 rounded-full border border-white/10 bg-[rgba(7,16,27,0.72)] px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/58 backdrop-blur">
                    React-ready
                  </div>
                  <div className="absolute -right-2 top-8 rounded-full border border-cyan-300/18 bg-cyan-300/8 px-4 py-2 text-xs uppercase tracking-[0.24em] text-cyan-100/88 backdrop-blur">
                    Tailwind
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="servicos" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <SectionTag>Servicos</SectionTag>
            <h2 className="mt-5 font-display text-4xl tracking-tight text-white sm:text-5xl">
              Estrutura visual limpa para marcas que querem parecer maiores.
            </h2>
            <p className="mt-4 text-lg leading-8 text-white/62">
              A LinkSites nasce melhor em uma base moderna, componentizada e preparada para crescer sem perder coerencia visual.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => (
              <article
                key={service.title}
                className="rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-7 backdrop-blur-sm"
              >
                <div className="mb-5 h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-300/22 to-blue-500/18 ring-1 ring-white/8" />
                <h3 className="font-display text-2xl text-white">{service.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/62">{service.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="cases" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <SectionTag>Case show</SectionTag>
              <h2 className="mt-5 font-display text-4xl tracking-tight text-white sm:text-5xl">
                Um showcase elegante, organizado e sem ruido visual.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-white/60">
              A vitrine entra como parte da narrativa, com cards amplos, hierarquia forte e acabamento premium no lugar de efeitos chamativos.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {featuredCases.map((item) => (
              <article
                key={item.name}
                className="group overflow-hidden rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(13,28,51,0.86),rgba(8,17,29,0.92))] transition hover:border-cyan-300/20"
              >
                <div className="relative h-56 overflow-hidden border-b border-white/6 bg-[radial-gradient(circle_at_30%_20%,rgba(98,240,235,0.18),transparent_25%),radial-gradient(circle_at_72%_30%,rgba(37,99,235,0.18),transparent_24%),linear-gradient(145deg,#10243f,#09131f)]">
                  <div className="absolute inset-7 rounded-[1.4rem] border border-white/8" />
                  <div className="absolute inset-x-10 top-10 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
                  <div className="absolute inset-y-10 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-cyan-300/30 to-transparent" />
                  <div className="absolute bottom-8 left-8 text-sm uppercase tracking-[0.28em] text-white/55">
                    {item.category}
                  </div>
                </div>

                <div className="p-7">
                  <h3 className="font-display text-3xl text-white">{item.name}</h3>
                  <p className="mt-4 text-sm leading-7 text-white/62">{item.description}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-xs uppercase tracking-[0.18em] text-cyan-100/82"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="processo" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <SectionTag>Processo</SectionTag>
              <h2 className="mt-5 font-display text-4xl tracking-tight text-white sm:text-5xl">
                Design com direcao clara e execucao limpa.
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-8 text-white/62">
                A proposta aqui nao e colocar efeitos por colocar. A prioridade e uma experiencia sofisticada, legivel e preparada para escalar.
              </p>
            </div>

            <div className="grid gap-4">
              {processSteps.map((step, index) => (
                <div
                  key={step}
                  className="flex gap-5 rounded-[1.75rem] border border-white/8 bg-white/[0.03] p-6"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300/22 to-blue-500/20 font-display text-xl text-cyan-100">
                    0{index + 1}
                  </div>
                  <div>
                    <h3 className="font-display text-2xl text-white">{step}</h3>
                    <p className="mt-2 text-sm leading-7 text-white/58">
                      Cada etapa ajuda a manter o site elegante, coerente com a marca e tecnicamente pronto para continuar evoluindo.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contato" className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2.25rem] border border-cyan-300/10 bg-[linear-gradient(135deg,rgba(9,20,35,0.96),rgba(12,29,49,0.94))] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-10 lg:p-12">
            <SectionTag>Contato</SectionTag>
            <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-3xl">
                <h2 className="font-display text-4xl tracking-tight text-white sm:text-5xl">
                  Vamos transformar a LinkSites em um produto React premium desde a base.
                </h2>
                <p className="mt-4 text-lg leading-8 text-white/62">
                  Podemos seguir com design system, componentes reais, animacoes discretas e um projeto pronto para deploy, manutencao e crescimento.
                </p>
              </div>
              <a
                href="https://wa.me/5591982460001"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-gradient-to-r from-cyan-300 to-sky-400 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_18px_40px_rgba(74,222,255,0.18)] transition hover:translate-y-[-1px]"
              >
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}


