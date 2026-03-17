
import { useEffect, useRef, useState } from "react";
import logo from "../assets/logolinksites.jpg";

const navItems = [
  { label: "Inicio", href: "#inicio" },
  { label: "Servicos", href: "#servicos" },
  { label: "Diferenciais", href: "#diferenciais" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Sobre", href: "#sobre" },
  { label: "Contato", href: "#contato" },
];

const services = [
  {
    icon: "🌐",
    accent: "Presenca institucional",
    title: "Sites Corporativos",
    text: "Desenvolvimento de sites institucionais, landing pages e portais empresariais com tecnologia de ponta.",
  },
  {
    icon: "🛒",
    accent: "Venda digital",
    title: "Lojas Virtuais",
    text: "E-commerce completo, seguro e escalavel para impulsionar suas vendas online.",
  },
  {
    icon: "📈",
    accent: "Visibilidade online",
    title: "SEO & Marketing",
    text: "Otimizacao para buscadores e estrategias digitais para voce ser encontrado e crescer.",
  },
  {
    icon: "🛡️",
    accent: "Base e suporte",
    title: "Hospedagem & Suporte",
    text: "Infraestrutura robusta, monitoramento e atendimento agil para seu site nunca parar.",
  },
];

const diferentials = [
  "Seguranca e performance de alto nivel",
  "Entrega rapida e processos inteligentes",
  "Atendimento consultivo e personalizado",
  "Solucoes escalaveis e inovadoras",
  "Equipe Techlab: expertise e paixao por tecnologia",
];

const cases = [
  {
    owner: "linksites",
    repo: "linksites",
    label: "Startup digital",
    eyebrow: "Institucional / Showcase",
    name: "LinkSites Experience",
    coverTitle: "LinkSites",
    description:
      "Landing page institucional com foco em autoridade, servicos, prova visual e conversao para atendimento imediato.",
    stack: "React",
    projectUrl: "https://linksites.github.io/linksites/",
    codeUrl: "https://github.com/linksites/linksites",
    coverClass:
      "bg-[radial-gradient(circle_at_22%_18%,rgba(98,240,235,0.22),transparent_24%),radial-gradient(circle_at_80%_25%,rgba(59,130,246,0.24),transparent_28%),linear-gradient(145deg,#10243f,#09131f)]",
  },
  {
    owner: "linksites",
    repo: "almeida-cunha",
    label: "Marca profissional",
    eyebrow: "Site institucional / Marca",
    name: "Almeida Cunha",
    coverTitle: "Almeida Cunha",
    description:
      "Projeto institucional pensado para apresentar servicos com leitura limpa, acabamento premium e contato descomplicado.",
    stack: "HTML",
    projectUrl: "https://linksites.github.io/almeida-cunha",
    codeUrl: "https://github.com/linksites/almeida-cunha",
    coverClass:
      "bg-[radial-gradient(circle_at_25%_20%,rgba(113,204,255,0.18),transparent_26%),radial-gradient(circle_at_75%_30%,rgba(98,240,235,0.18),transparent_26%),linear-gradient(145deg,#112033,#0a1521)]",
  },
  {
    owner: "linksites",
    repo: "danilo-souza",
    label: "Portfolio pessoal",
    eyebrow: "Portfolio / Apresentacao",
    name: "Danilo Souza",
    coverTitle: "Danilo Souza",
    description:
      "Portfolio pessoal com leitura rapida, hierarquia clara e elementos visuais voltados para apresentar identidade e competencias.",
    stack: "JavaScript",
    projectUrl: "https://linksites.github.io/danilo-souza",
    codeUrl: "https://github.com/linksites/danilo-souza",
    coverClass:
      "bg-[radial-gradient(circle_at_26%_18%,rgba(98,240,235,0.18),transparent_25%),radial-gradient(circle_at_74%_30%,rgba(37,99,235,0.18),transparent_28%),linear-gradient(145deg,#0f2136,#09131f)]",
  },
  {
    owner: "linksites",
    repo: "gomes-de-deus",
    label: "Site institucional",
    eyebrow: "Institucional / Autoridade",
    name: "Gomes de Deus",
    coverTitle: "Gomes de Deus",
    description:
      "Pagina de apresentacao estruturada para comunicar valor, reforcar a marca e manter a jornada de contato simples.",
    stack: "HTML",
    projectUrl: "https://linksites.github.io/gomes-de-deus",
    codeUrl: "https://github.com/linksites/gomes-de-deus",
    coverClass:
      "bg-[radial-gradient(circle_at_30%_22%,rgba(108,194,255,0.16),transparent_26%),radial-gradient(circle_at_76%_30%,rgba(98,240,235,0.14),transparent_28%),linear-gradient(145deg,#101f31,#08131f)]",
  },
  {
    owner: "linksites",
    repo: "frigorificocarneboa",
    label: "Comercio alimentar",
    eyebrow: "Catalogo / Conversao",
    name: "Frigorifico Carne Boa",
    coverTitle: "Carne Boa",
    description:
      "Projeto com foco em mostrar produtos, reforcar confianca comercial e encurtar o caminho ate o atendimento.",
    stack: "CSS",
    projectUrl: "https://linksites.github.io/frigorificocarneboa",
    codeUrl: "https://github.com/linksites/frigorificocarneboa",
    coverClass:
      "bg-[radial-gradient(circle_at_22%_18%,rgba(98,240,235,0.14),transparent_24%),radial-gradient(circle_at_74%_28%,rgba(37,99,235,0.24),transparent_26%),linear-gradient(145deg,#132743,#09131f)]",
  },
  {
    owner: "linksites",
    repo: "arcadenoe",
    label: "Projeto tematico",
    eyebrow: "Landing page / Identidade",
    name: "Arca de Noe",
    coverTitle: "Arca de Noe",
    description:
      "Layout com presenca visual marcante, construido para dar personalidade a marca sem perder legibilidade e impacto.",
    stack: "CSS",
    projectUrl: "https://linksites.github.io/arcadenoe",
    codeUrl: "https://github.com/linksites/arcadenoe",
    coverClass:
      "bg-[radial-gradient(circle_at_24%_18%,rgba(98,240,235,0.18),transparent_25%),radial-gradient(circle_at_80%_22%,rgba(29,78,216,0.22),transparent_28%),linear-gradient(145deg,#102038,#08111c)]",
  },
  {
    owner: "liksites",
    repo: "sergiorodrigues",
    label: "Portfolio React",
    eyebrow: "Portfolio / React",
    name: "Sergio Rodrigues",
    coverTitle: "Sergio Rodrigues",
    description:
      "Portfolio pessoal em React com leitura objetiva, tom profissional e apresentacao visual mais premium.",
    stack: "React",
    projectUrl: "http://linksites.github.io/sergiorodrigues",
    codeUrl: "https://github.com/liksites/sergiorodrigues",
    coverClass:
      "bg-[radial-gradient(circle_at_22%_18%,rgba(98,240,235,0.22),transparent_24%),radial-gradient(circle_at_76%_22%,rgba(59,130,246,0.2),transparent_26%),linear-gradient(145deg,#102543,#091421)]",
  },
];

const heroPoints = [
  "✦ Identidade futurista",
  "⌁ Rede visual premium",
  "• Experiencia responsiva",
];

function formatRelativeTime(dateString) {
  const updatedAt = new Date(dateString);
  const diffMs = Date.now() - updatedAt.getTime();

  if (!Number.isFinite(updatedAt.getTime()) || diffMs < 0) {
    return "Atualizacao recente";
  }

  const minuteMs = 60 * 1000;
  const hourMs = 60 * minuteMs;
  const dayMs = 24 * hourMs;
  const weekMs = 7 * dayMs;
  const monthMs = 30 * dayMs;
  const yearMs = 365 * dayMs;

  if (diffMs < hourMs) {
    const minutes = Math.max(1, Math.floor(diffMs / minuteMs));
    return minutes === 1 ? "Atualizado ha 1 minuto" : `Atualizado ha ${minutes} minutos`;
  }

  if (diffMs < dayMs) {
    const hours = Math.floor(diffMs / hourMs);
    return hours === 1 ? "Atualizado ha 1 hora" : `Atualizado ha ${hours} horas`;
  }

  if (diffMs < weekMs) {
    const days = Math.floor(diffMs / dayMs);
    return days === 1 ? "Atualizado ha 1 dia" : `Atualizado ha ${days} dias`;
  }

  if (diffMs < monthMs) {
    const weeks = Math.floor(diffMs / weekMs);
    return weeks === 1 ? "Atualizado ha 1 semana" : `Atualizado ha ${weeks} semanas`;
  }

  if (diffMs < yearMs) {
    const months = Math.floor(diffMs / monthMs);
    return months === 1 ? "Atualizado ha 1 mes" : `Atualizado ha ${months} meses`;
  }

  const years = Math.floor(diffMs / yearMs);
  return years === 1 ? "Atualizado ha 1 ano" : `Atualizado ha ${years} anos`;
}

function SectionTag({ children }) {
  return (
    <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-cyan-200/85">
      <span className="mr-2 text-cyan-300/90">✦</span>
      {children}
    </span>
  );
}

function Chevron({ direction }) {
  const rotateClass = direction === "left" ? "rotate-180" : "";

  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-cyan-100/90 backdrop-blur transition hover:border-cyan-300/30 hover:bg-cyan-300/10 ${rotateClass}`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 5l8 7-8 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [repoUpdates, setRepoUpdates] = useState({});
  const [visitCount, setVisitCount] = useState("Sincronizando");
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const trackRef = useRef(null);

  useEffect(() => {
    let active = true;
    const owners = [...new Set(cases.map((item) => item.owner))];

    async function loadRepoUpdates() {
      try {
        const responses = await Promise.all(
          owners.map(async (owner) => {
            const response = await fetch(
              `https://api.github.com/users/${owner}/repos?per_page=100&sort=updated`,
            );

            if (!response.ok) {
              throw new Error("repo_unavailable");
            }

            return { owner, repos: await response.json() };
          }),
        );

        if (!active) {
          return;
        }

        const nextUpdates = {};

        responses.forEach(({ owner, repos }) => {
          repos.forEach((repo) => {
            nextUpdates[`${owner}/${repo.name}`] = repo.pushed_at
              ? formatRelativeTime(repo.pushed_at)
              : "Atualizacao GitHub indisponivel";
          });
        });

        setRepoUpdates(nextUpdates);
      } catch {
        if (!active) {
          return;
        }

        const fallback = {};

        cases.forEach((item) => {
          fallback[`${item.owner}/${item.repo}`] = "Atualizacao GitHub indisponivel";
        });

        setRepoUpdates(fallback);
      }
    }

    loadRepoUpdates();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const apiBase = "https://countapi.mileshilliard.com/api/v1";
    const counterKey = "linksites-home-unique-browsers";
    const storageKey = "linksites-home-unique-browser-v1";
    let shouldIncrement = false;

    try {
      shouldIncrement = window.localStorage.getItem(storageKey) !== "1";
    } catch {
      shouldIncrement = true;
    }

    async function requestCounter(mode) {
      const response = await fetch(`${apiBase}/${mode}/${counterKey}`);

      if (!response.ok && response.status === 404 && mode === "get") {
        return requestCounter("hit");
      }

      if (!response.ok) {
        throw new Error("counter_unavailable");
      }

      return response.json();
    }

    async function loadCounter() {
      try {
        const data = await requestCounter(shouldIncrement ? "hit" : "get");
        const value = Number(data.value);

        if (!Number.isFinite(value)) {
          throw new Error("invalid_counter_value");
        }

        if (shouldIncrement) {
          try {
            window.localStorage.setItem(storageKey, "1");
          } catch {
            // Ignore storage issues and still show the fetched number.
          }
        }

        if (active) {
          setVisitCount(value.toLocaleString("pt-BR"));
        }
      } catch {
        if (active) {
          setVisitCount("Offline");
        }
      }
    }

    loadCounter();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return undefined;
    }

    const updateScrollState = () => {
      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth - 8);
      setCanScrollPrev(track.scrollLeft > 8);
      setCanScrollNext(track.scrollLeft < maxScroll);
    };

    updateScrollState();
    track.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      track.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  function scrollCases(direction) {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const amount = Math.max(340, Math.round(track.clientWidth * 0.86));
    track.scrollBy({ left: amount * direction, behavior: "smooth" });
  }

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
                Solucoes digitais futuristas
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
              Solicite seu projeto
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
              <SectionTag>Identidade conectada</SectionTag>
              <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
                O futuro da presenca digital comeca aqui.
              </h1>
              <h2 className="mt-5 max-w-2xl text-2xl font-medium tracking-tight text-cyan-100 sm:text-3xl">
                Sites profissionais, modernos e inteligentes para pessoas e empresas visionarias.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">
                Mantivemos a nova base em React e Tailwind, mas trouxemos de volta a mensagem da LinkSites:
                design premium, tecnologia de ponta e foco real em resultado.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-stretch">
                <a
                  href="#contato"
                  className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-gradient-to-r from-cyan-300 to-sky-400 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_18px_40px_rgba(74,222,255,0.18)] transition hover:translate-y-[-1px]"
                >
                  Solicite seu projeto
                </a>
                <a
                  href="#portfolio"
                  className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-white/80 transition hover:border-cyan-300/30 hover:text-cyan-100"
                >
                  Explorar cases
                </a>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                {heroPoints.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute left-[12%] top-[10%] h-40 w-40 rounded-full bg-cyan-300/10 blur-3xl" />
              <div className="absolute bottom-[10%] right-[10%] h-44 w-44 rounded-full bg-blue-500/10 blur-3xl" />
              <div className="hero-orbit absolute inset-[8%]" />

              <div className="relative flex w-full max-w-[30rem] flex-col items-center justify-center gap-6 px-6 py-6 sm:px-10">
                <div className="relative flex h-[20rem] w-full max-w-[23rem] items-center justify-center sm:h-[24rem] sm:max-w-[25rem]">
                  <div className="absolute inset-[10%] rounded-full border border-cyan-300/10 bg-[radial-gradient(circle,rgba(98,240,235,0.12),rgba(8,17,29,0)_68%)] blur-2xl" />
                  <div className="absolute inset-[8%] rounded-[2.5rem] border border-white/6 bg-[linear-gradient(155deg,rgba(10,24,39,0.48),rgba(5,12,22,0.18))] shadow-[0_30px_80px_rgba(0,0,0,0.24)] backdrop-blur-sm" />
                  <div className="absolute inset-[14%] rounded-full border border-cyan-300/12" />
                  <div className="absolute inset-[18%] rounded-full border border-white/6" />

                  <div className="relative h-[14.5rem] w-[14.5rem] overflow-hidden rounded-full border border-cyan-300/14 bg-[radial-gradient(circle_at_50%_35%,rgba(98,240,235,0.16),rgba(11,23,40,0.86)_68%)] shadow-[0_24px_70px_rgba(6,12,22,0.48)] sm:h-[17rem] sm:w-[17rem]">
                    <img
                      src={logo}
                      alt="Globo da marca LinkSites"
                      className="h-full w-full scale-[1.38] object-cover object-top opacity-95"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#09131f] via-[#09131f]/70 to-transparent" />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <div className="rounded-full border border-white/10 bg-[rgba(7,16,27,0.62)] px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/58 backdrop-blur">
                    Techlab Software
                  </div>
                  <div className="rounded-full border border-cyan-300/18 bg-cyan-300/8 px-4 py-2 text-xs uppercase tracking-[0.24em] text-cyan-100/88 backdrop-blur">
                    Atendimento global
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
              Solucoes digitais para marcas que querem crescer com clareza.
            </h2>
            <p className="mt-4 text-lg leading-8 text-white/62">
              A nova interface continua elegante, mas agora com o conteudo institucional completo da LinkSites
              e uma oferta muito mais fiel ao que a empresa entrega.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => (
              <article
                key={service.title}
                className="group relative overflow-hidden rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-7 backdrop-blur-sm"
              >
                <span className="pointer-events-none absolute right-5 top-4 text-5xl opacity-[0.08] transition group-hover:opacity-[0.14]">
                  {service.icon}
                </span>
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300/22 to-blue-500/18 text-2xl ring-1 ring-white/8">
                  {service.icon}
                </div>
                <p className="mb-3 text-[0.72rem] uppercase tracking-[0.22em] text-cyan-100/58">
                  {service.accent}
                </p>
                <h3 className="font-display text-2xl text-white">{service.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/62">{service.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="diferenciais" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2.25rem] border border-white/8 bg-[linear-gradient(135deg,rgba(9,20,35,0.88),rgba(12,29,49,0.9))] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.22)] sm:p-10 lg:p-12">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div className="max-w-xl">
                <SectionTag>Diferenciais</SectionTag>
                <h2 className="mt-5 font-display text-4xl tracking-tight text-white sm:text-5xl">
                  Estrutura premium com base solida, rapida e inteligente.
                </h2>
                <p className="mt-4 text-lg leading-8 text-white/62">
                  O que fazia sentido na mensagem original continua aqui: performance, atendimento consultivo,
                  velocidade e uma postura profissional do inicio ao fim.
                </p>
              </div>

              <div className="grid gap-4">
                {diferentials.map((item, index) => (
                  <div
                    key={item}
                    className="flex items-start gap-4 rounded-[1.5rem] border border-white/8 bg-white/[0.04] p-5"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300/22 to-blue-500/20 font-display text-lg text-cyan-100">
                      0{index + 1}
                    </div>
                    <p className="pt-1 text-base leading-7 text-white/72">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="portfolio" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <SectionTag>Showcase digital</SectionTag>
              <h2 className="mt-5 font-display text-4xl tracking-tight text-white sm:text-5xl">
                Projetos em destaque com o conteudo real da LinkSites.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-white/60">
              O portfolio volta com os projetos publicados, descricoes de negocio, links de projeto e codigo,
              alem da ultima atualizacao puxada em tempo real do GitHub.
            </p>
          </div>

          <div className="relative mt-12">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-20 bg-gradient-to-r from-[var(--bg-strong)] to-transparent lg:block" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-20 bg-gradient-to-l from-[var(--bg-strong)] to-transparent lg:block" />

            <div className="mb-5 flex items-center justify-between gap-4">
              <p className="text-sm text-white/52">Use as setas ou arraste lateralmente para explorar os cases.</p>
              <div className="hidden items-center gap-3 md:flex">
                <button
                  type="button"
                  aria-label="Ver projetos anteriores"
                  className={`transition ${canScrollPrev ? "opacity-100" : "pointer-events-none opacity-35"}`}
                  onClick={() => scrollCases(-1)}
                >
                  <Chevron direction="left" />
                </button>
                <button
                  type="button"
                  aria-label="Ver proximos projetos"
                  className={`transition ${canScrollNext ? "opacity-100" : "pointer-events-none opacity-35"}`}
                  onClick={() => scrollCases(1)}
                >
                  <Chevron direction="right" />
                </button>
              </div>
            </div>

            <div
              ref={trackRef}
              className="hide-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2"
            >
              {cases.map((item) => {
                const repoKey = `${item.owner}/${item.repo}`;

                return (
                  <article
                    key={repoKey}
                    className="group min-w-[86%] snap-center overflow-hidden rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(13,28,51,0.86),rgba(8,17,29,0.92))] transition hover:border-cyan-300/20 sm:min-w-[30rem] lg:min-w-[24rem]"
                  >
                    <div className={`relative h-56 overflow-hidden border-b border-white/6 ${item.coverClass}`}>
                      <div className="absolute inset-7 rounded-[1.4rem] border border-white/8" />
                      <div className="absolute inset-x-10 top-10 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
                      <div className="absolute inset-y-10 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-cyan-300/30 to-transparent" />
                      <div className="absolute left-8 top-8 rounded-full border border-white/12 bg-[rgba(7,16,27,0.4)] px-3 py-1 text-[0.65rem] uppercase tracking-[0.22em] text-white/62 backdrop-blur">
                        {item.label}
                      </div>
                      <div className="absolute bottom-8 left-8 right-8">
                        <strong className="font-display text-3xl tracking-tight text-white">
                          {item.coverTitle}
                        </strong>
                        <p className="mt-2 max-w-[18rem] text-sm leading-6 text-white/64">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-7">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[0.72rem] uppercase tracking-[0.22em] text-cyan-100/62">
                            {item.eyebrow}
                          </p>
                          <h3 className="mt-2 font-display text-3xl text-white">{item.name}</h3>
                        </div>
                        <span className="rounded-full border border-cyan-300/14 bg-cyan-300/10 px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-cyan-100/88">
                          Ao vivo
                        </span>
                      </div>

                      <div className="mt-6 flex items-center justify-between gap-3 rounded-[1.25rem] border border-white/8 bg-white/[0.03] px-4 py-3">
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.72rem] uppercase tracking-[0.2em] text-white/66">
                          {item.stack}
                        </span>
                        <span className="text-right text-xs leading-5 text-white/52">
                          {"⌁ "}{repoUpdates[repoKey] ?? "Sincronizando GitHub"}
                        </span>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <a
                          href={item.projectUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-gradient-to-r from-cyan-300 to-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:translate-y-[-1px]"
                        >
                          ↗ Ver projeto
                        </a>
                        <a
                          href={item.codeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-5 py-3 text-sm font-medium text-white/80 transition hover:border-cyan-300/30 hover:text-cyan-100"
                        >
                          ⌁ Ver codigo
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="sobre" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.82fr]">
            <div className="rounded-[2.25rem] border border-white/8 bg-[linear-gradient(145deg,rgba(9,20,35,0.88),rgba(12,29,49,0.84))] p-8 sm:p-10">
              <SectionTag>Sobre a LinkSites</SectionTag>
              <h2 className="mt-5 font-display text-4xl tracking-tight text-white sm:text-5xl">
                Tecnologia, design futurista e foco total no resultado do cliente.
              </h2>
              <p className="mt-5 text-lg leading-8 text-white/66">
                Somos uma startup do grupo <strong>Techlab Software</strong>, referencia em solucoes digitais.
                Nossa missao e transformar ideias em experiencias digitais marcantes, com tecnologia de ponta,
                design futurista e foco total no resultado do cliente.
              </p>
            </div>

              <div className="rounded-[2.25rem] border border-cyan-300/10 bg-[linear-gradient(145deg,rgba(8,17,29,0.94),rgba(12,29,49,0.92))] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.22)] sm:p-10">
              <SectionTag>Presenca em crescimento</SectionTag>
              <div className="mt-6 rounded-[1.8rem] border border-white/8 bg-[rgba(5,11,20,0.55)] p-6">
                <div className="text-[0.72rem] uppercase tracking-[0.26em] text-white/42">
                  ✦ Leitura exclusiva
                </div>
                <strong className="mt-4 block font-display text-5xl tracking-tight text-cyan-200">
                  {visitCount}
                </strong>
                <p className="mt-4 text-sm leading-7 text-white/60">
                  Visitantes unicos por navegador. Cada navegador conta uma vez e depois apenas consulta o total.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="contato" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2.25rem] border border-cyan-300/10 bg-[linear-gradient(135deg,rgba(9,20,35,0.96),rgba(12,29,49,0.94))] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-10 lg:p-12">
            <SectionTag>Contato</SectionTag>
            <div className="mt-5 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-3xl">
                <h2 className="font-display text-4xl tracking-tight text-white sm:text-5xl">
                  Fale com a LinkSites.
                </h2>
                <p className="mt-4 text-lg leading-8 text-white/62">
                  Atendimento direto pelo WhatsApp, com estrutura pronta para transformar sua ideia em uma
                  experiencia digital marcante e profissional.
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.04] p-5">
                    <div className="text-[0.72rem] uppercase tracking-[0.22em] text-white/42">E-mail</div>
                    <p className="mt-3 text-base text-white/80">sergiosrdev@hotmail.com</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.04] p-5">
                    <div className="text-[0.72rem] uppercase tracking-[0.22em] text-white/42">Localizacao</div>
                    <p className="mt-3 text-base text-white/80">Belem, PA - Atendimento Global</p>
                  </div>
                </div>
              </div>

              <div className="min-w-[18rem] rounded-[1.8rem] border border-white/8 bg-[rgba(6,12,22,0.44)] p-6">
                <div className="text-[0.72rem] uppercase tracking-[0.24em] text-white/42">• WhatsApp</div>
                <a
                  href="https://wa.me/5591982460001"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex min-h-[54px] w-full items-center justify-center rounded-full bg-gradient-to-r from-cyan-300 to-sky-400 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_18px_40px_rgba(74,222,255,0.18)] transition hover:translate-y-[-1px]"
                >
                  ↗ Chamar no WhatsApp
                </a>
                <p className="mt-4 text-sm leading-7 text-white/60">+55 91 98246-0001</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/8 py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-sm text-white/52 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>LinkSites 2026 - Uma startup do grupo Techlab Software</p>
          <p>Conectando voce ao mundo digital com criatividade, tecnologia e paixao.</p>
        </div>
      </footer>
    </div>
  );
}
