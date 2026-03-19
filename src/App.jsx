import { useEffect, useRef, useState } from "react";
import ContactSection from "./components/sections/ContactSection";
import CurrentSiteDialog from "./components/sections/CurrentSiteDialog";
import DifferentialsSection from "./components/sections/DifferentialsSection";
import HeroSection from "./components/sections/HeroSection";
import PlansSection from "./components/sections/PlansSection";
import PortfolioSection from "./components/sections/PortfolioSection";
import ServicesSection from "./components/sections/ServicesSection";
import SiteFooter from "./components/sections/SiteFooter";
import SiteHeader from "./components/sections/SiteHeader";
import { localizedCases } from "./data/cases";
import { siteContent } from "./data/siteContent";

const repoCaseSource = localizedCases.ptBR;
const githubRepoGroups = repoCaseSource.reduce((groups, item) => {
  const existingRepos = groups[item.owner] ?? [];

  if (!existingRepos.includes(item.repo)) {
    groups[item.owner] = [...existingRepos, item.repo];
  }

  return groups;
}, {});

function createRepoUpdateMap(defaultValue = null) {
  return repoCaseSource.reduce((repoUpdates, item) => {
    repoUpdates[`${item.owner}/${item.repo}`] = defaultValue;
    return repoUpdates;
  }, {});
}

function normalizeRepoUpdates(rawUpdates = {}) {
  const normalizedUpdates = createRepoUpdateMap();

  repoCaseSource.forEach((item) => {
    const key = `${item.owner}/${item.repo}`;
    normalizedUpdates[key] = rawUpdates[key] ?? null;
  });

  return normalizedUpdates;
}

async function fetchLiveRepoUpdates(signal) {
  const ownerEntries = Object.entries(githubRepoGroups);
  const repoUpdatesByOwner = await Promise.all(
    ownerEntries.map(async ([owner, repos]) => {
      const response = await fetch(`https://api.github.com/users/${owner}/repos?per_page=100&type=owner`, {
        cache: "no-store",
        signal,
        headers: {
          Accept: "application/vnd.github+json",
        },
      });

      if (!response.ok) {
        throw new Error(`github_repos_unavailable:${owner}`);
      }

      const payload = await response.json();
      const repoSet = new Set(repos);

      return payload.reduce((ownerUpdates, repo) => {
        if (repoSet.has(repo.name)) {
          ownerUpdates[`${owner}/${repo.name}`] = repo.pushed_at ?? null;
        }

        return ownerUpdates;
      }, {});
    }),
  );

  return normalizeRepoUpdates(Object.assign({}, ...repoUpdatesByOwner));
}

async function fetchSnapshotRepoUpdates(repoUpdatesUrl, signal) {
  const response = await fetch(repoUpdatesUrl, {
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new Error("repo_updates_unavailable");
  }

  const payload = await response.json();
  return normalizeRepoUpdates(payload?.repos);
}

const EXCHANGE_RATE_STORAGE_KEY = "linksites-brl-usd-rate-v1";

function readCachedExchangeRate() {
  try {
    const rawValue = window.localStorage.getItem(EXCHANGE_RATE_STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    const parsedValue = JSON.parse(rawValue);
    const rate = Number(parsedValue?.rate);

    return Number.isFinite(rate) && rate > 0 ? rate : null;
  } catch {
    return null;
  }
}

async function fetchBrlToUsdRate(signal) {
  const response = await fetch("https://api.frankfurter.dev/v1/latest?base=BRL&symbols=USD", {
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new Error("exchange_rate_unavailable");
  }

  const payload = await response.json();
  const rate = Number(payload?.rates?.USD);

  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error("invalid_exchange_rate");
  }

  return {
    rate,
    date: payload?.date ?? null,
  };
}

function formatPlanPrice(amountBrl, locale, exchangeRate) {
  if (!Number.isFinite(amountBrl)) {
    return null;
  }

  if (locale === "en") {
    if (!Number.isFinite(exchangeRate) || exchangeRate <= 0) {
      return null;
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: amountBrl === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(amountBrl * exchangeRate);
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: amountBrl === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amountBrl);
}

export default function App() {
  const [locale, setLocale] = useState(() => {
    try {
      return window.localStorage.getItem("linksites-locale") ?? "ptBR";
    } catch {
      return "ptBR";
    }
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [repoUpdateDates, setRepoUpdateDates] = useState({});
  const [visitCount, setVisitCount] = useState(siteContent.ptBR.visitCount.loading);
  const [brlToUsdRate, setBrlToUsdRate] = useState(() => readCachedExchangeRate());
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [isCurrentSiteDialogOpen, setIsCurrentSiteDialogOpen] = useState(false);
  const trackRef = useRef(null);
  const dragStateRef = useRef({
    isPointerDown: false,
    moved: false,
    pointerId: null,
    startX: 0,
    startScrollLeft: 0,
  });

  const content = siteContent[locale] ?? siteContent.ptBR;
  const cases = localizedCases[locale] ?? localizedCases.ptBR;
  const plansContent = {
    ...content.plans,
    items: content.plans.items.map((plan) => ({
      ...plan,
      price: formatPlanPrice(plan.amountBrl, locale, brlToUsdRate) ?? content.plans.priceLoading,
    })),
  };

  useEffect(() => {
    try {
      window.localStorage.setItem("linksites-locale", locale);
    } catch {
      // Ignore storage issues and keep the selected locale in memory.
    }
  }, [locale]);

  useEffect(() => {
    document.documentElement.lang = content.lang;
    document.title = content.metadata.title;

    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute("content", content.metadata.description);
    }
  }, [content]);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadExchangeRate() {
      try {
        const exchangeRate = await fetchBrlToUsdRate(controller.signal);

        if (active) {
          setBrlToUsdRate(exchangeRate.rate);
        }

        try {
          window.localStorage.setItem(EXCHANGE_RATE_STORAGE_KEY, JSON.stringify(exchangeRate));
        } catch {
          // Ignore storage issues and keep the fresh rate in memory.
        }
      } catch (error) {
        if (!active || error.name === "AbortError") {
          return;
        }
      }
    }

    loadExchangeRate();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const repoUpdatesUrl = `${import.meta.env.BASE_URL}repo-updates.json`;

    async function loadRepoUpdates() {
      try {
        const liveUpdates = await fetchLiveRepoUpdates(controller.signal);

        if (active) {
          setRepoUpdateDates(liveUpdates);
        }

        return;
      } catch (liveError) {
        if (!active || liveError.name === "AbortError") {
          return;
        }
      }

      try {
        const snapshotUpdates = await fetchSnapshotRepoUpdates(repoUpdatesUrl, controller.signal);

        if (active) {
          setRepoUpdateDates(snapshotUpdates);
        }
      } catch (snapshotError) {
        if (!active || snapshotError.name === "AbortError") {
          return;
        }

        setRepoUpdateDates(createRepoUpdateMap());
      }
    }

    loadRepoUpdates();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll("[data-reveal]"));

    if (!elements.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
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
          setVisitCount(value.toLocaleString(content.numberLocale));
        }
      } catch {
        if (active) {
          setVisitCount(content.visitCount.offline);
        }
      }
    }

    loadCounter();

    return () => {
      active = false;
    };
  }, [content.numberLocale, content.visitCount.offline]);

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

  useEffect(() => {
    if (!isCurrentSiteDialogOpen) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsCurrentSiteDialogOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCurrentSiteDialogOpen]);

  function scrollCases(direction) {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const firstCard = track.querySelector("[data-case-card='true']");
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 0;
    const amount = Math.max(340, Math.round(cardWidth || track.clientWidth * 0.72));
    track.scrollBy({ left: amount * direction, behavior: "smooth" });
  }

  function handleProjectClick(event, item) {
    if (item.repo !== content.portfolio.currentDemoRepo) {
      return;
    }

    event.preventDefault();
    setIsCurrentSiteDialogOpen(true);
  }

  function handleTrackPointerDown(event) {
    const track = trackRef.current;

    if (!track || event.pointerType !== "mouse") {
      return;
    }

    if (event.target.closest("a, button")) {
      return;
    }

    dragStateRef.current = {
      isPointerDown: true,
      moved: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: track.scrollLeft,
    };

    track.classList.add("is-dragging");
    track.setPointerCapture(event.pointerId);
  }

  function handleTrackPointerMove(event) {
    const track = trackRef.current;
    const dragState = dragStateRef.current;

    if (!track || !dragState.isPointerDown || dragState.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;

    if (Math.abs(deltaX) > 6) {
      dragStateRef.current.moved = true;
    }

    track.scrollLeft = dragState.startScrollLeft - deltaX;
  }

  function handleTrackPointerUp(event) {
    const track = trackRef.current;
    const dragState = dragStateRef.current;

    if (!track || dragState.pointerId !== event.pointerId) {
      return;
    }

    dragStateRef.current.isPointerDown = false;
    dragStateRef.current.pointerId = null;

    track.classList.remove("is-dragging");

    if (track.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId);
    }

    window.setTimeout(() => {
      dragStateRef.current.moved = false;
    }, 0);
  }

  function handleTrackClickCapture(event) {
    if (dragStateRef.current.moved) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  function handleTrackWheel(event) {
    const track = trackRef.current;

    if (!track || window.innerWidth < 1024) {
      return;
    }

    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
      return;
    }

    event.preventDefault();
    track.scrollLeft += event.deltaY;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-strong)] text-[var(--text-primary)]">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-12%] top-[-8%] h-[32rem] w-[32rem] rounded-full bg-cyan-400/12 blur-3xl" />
        <div className="absolute bottom-[-14%] right-[-8%] h-[30rem] w-[30rem] rounded-full bg-blue-500/12 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(98,240,235,0.09),transparent_28%),linear-gradient(180deg,#08111d_0%,#0b1625_45%,#07101b_100%)]" />
      </div>

      <SiteHeader
        navItems={content.navItems}
        header={content.header}
        locale={locale}
        setLocale={setLocale}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      <main id="inicio">
        <HeroSection hero={content.hero} />
        <ServicesSection content={content.services} />
        <DifferentialsSection content={content.audiences} />
        <PortfolioSection
          canScrollPrev={canScrollPrev}
          canScrollNext={canScrollNext}
          scrollCases={scrollCases}
          trackRef={trackRef}
          handleTrackClickCapture={handleTrackClickCapture}
          handleTrackPointerDown={handleTrackPointerDown}
          handleTrackPointerMove={handleTrackPointerMove}
          handleTrackPointerUp={handleTrackPointerUp}
          handleTrackWheel={handleTrackWheel}
          content={content.portfolio}
          caseCardContent={content.caseCard}
          cases={cases}
          repoUpdateDates={repoUpdateDates}
          onProjectClick={handleProjectClick}
        />
        <PlansSection content={plansContent} visitCount={visitCount} />
        <ContactSection content={content.contact} />
      </main>

      <SiteFooter content={content.footer} />
      <CurrentSiteDialog
        open={isCurrentSiteDialogOpen}
        content={content.dialog}
        onClose={() => setIsCurrentSiteDialogOpen(false)}
      />
    </div>
  );
}
