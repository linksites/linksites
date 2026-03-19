import { useEffect, useState } from "react";

const REPO_UPDATE_LOADING = "Consultando atualizacao...";
const REPO_UPDATE_FALLBACK = "Atualizacao indisponivel";

function getRelativeTimeState(dateString, now = Date.now()) {
  const updatedAt = new Date(dateString);
  const updatedAtMs = updatedAt.getTime();
  const diffMs = now - updatedAtMs;

  if (!Number.isFinite(updatedAtMs) || diffMs < 0) {
    return {
      label: "agora",
      nextUpdateInMs: 60 * 1000,
    };
  }

  const minuteMs = 60 * 1000;
  const hourMs = 60 * minuteMs;
  const dayMs = 24 * hourMs;
  const weekMs = 7 * dayMs;
  const monthMs = 30 * dayMs;
  const yearMs = 365 * dayMs;
  const getNextBoundary = (unitMs) => {
    const remainder = diffMs % unitMs;
    return Math.max(1000, remainder === 0 ? unitMs : unitMs - remainder);
  };

  if (diffMs < hourMs) {
    const minutes = Math.max(1, Math.floor(diffMs / minuteMs));
    return {
      label: minutes === 1 ? "ha 1 minuto" : `ha ${minutes} minutos`,
      nextUpdateInMs: getNextBoundary(minuteMs),
    };
  }

  if (diffMs < dayMs) {
    const hours = Math.floor(diffMs / hourMs);
    return {
      label: hours === 1 ? "ha 1 hora" : `ha ${hours} horas`,
      nextUpdateInMs: getNextBoundary(hourMs),
    };
  }

  if (diffMs < weekMs) {
    const days = Math.floor(diffMs / dayMs);
    return {
      label: days === 1 ? "ha 1 dia" : `ha ${days} dias`,
      nextUpdateInMs: getNextBoundary(dayMs),
    };
  }

  if (diffMs < monthMs) {
    const weeks = Math.floor(diffMs / weekMs);
    return {
      label: weeks === 1 ? "ha 1 semana" : `ha ${weeks} semanas`,
      nextUpdateInMs: getNextBoundary(weekMs),
    };
  }

  if (diffMs < yearMs) {
    const months = Math.floor(diffMs / monthMs);
    return {
      label: months === 1 ? "ha 1 mes" : `ha ${months} meses`,
      nextUpdateInMs: getNextBoundary(monthMs),
    };
  }

  const years = Math.floor(diffMs / yearMs);
  return {
    label: years === 1 ? "ha 1 ano" : `ha ${years} anos`,
    nextUpdateInMs: getNextBoundary(yearMs),
  };
}

function formatRelativeTime(dateString, now = Date.now()) {
  return getRelativeTimeState(dateString, now).label;
}

function formatRepoUpdateStatus(dateString, now) {
  if (!dateString) {
    return REPO_UPDATE_FALLBACK;
  }

  return `Atualizado ${formatRelativeTime(dateString, now)}`;
}

function useRelativeRepoUpdateLabel(dateString) {
  const [label, setLabel] = useState(() => formatRepoUpdateStatus(dateString));

  useEffect(() => {
    if (!dateString) {
      setLabel(REPO_UPDATE_FALLBACK);
      return undefined;
    }

    let timeoutId;

    const updateLabel = () => {
      const { label: relativeLabel, nextUpdateInMs } = getRelativeTimeState(dateString, Date.now());
      setLabel(`Atualizado ${relativeLabel}`);
      timeoutId = window.setTimeout(updateLabel, nextUpdateInMs);
    };

    updateLabel();

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [dateString]);

  return label;
}

export default function CaseCard({ item, index, repoDate, onProjectClick }) {
  const repoKey = `${item.owner}/${item.repo}`;
  const repoUpdateLabel = useRelativeRepoUpdateLabel(repoDate);
  const isRepoUpdateLoading = repoDate === undefined;

  return (
    <article
      key={repoKey}
      data-case-card="true"
      data-reveal=""
      style={{ "--reveal-delay": `${(index % 4) * 80}ms` }}
      className="group flex min-h-[34rem] min-w-[86%] snap-center flex-col overflow-hidden rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(13,28,51,0.86),rgba(8,17,29,0.92))] transition hover:border-cyan-300/20 sm:min-w-[30rem] lg:min-w-[22.5rem] lg:max-w-[22.5rem] xl:min-w-[23.25rem] xl:max-w-[23.25rem]"
    >
      <div className={`relative h-56 overflow-hidden border-b border-white/6 ${item.coverClass}`}>
        <div className="absolute inset-7 rounded-[1.4rem] border border-white/8" />
        <div className="absolute inset-x-10 top-10 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
        <div className="absolute inset-y-10 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-cyan-300/30 to-transparent" />
        <div className="absolute left-8 top-8 rounded-full border border-white/12 bg-[rgba(7,16,27,0.4)] px-3 py-1 text-[0.65rem] uppercase tracking-[0.22em] text-white/62 backdrop-blur">
          {item.label}
        </div>
        <div className="absolute bottom-8 left-8 right-8">
          <strong className="font-display text-3xl tracking-tight text-white">{item.coverTitle}</strong>
          <p className="mt-2 max-w-[18rem] text-sm leading-6 text-white/64">{item.description}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.72rem] uppercase tracking-[0.22em] text-cyan-100/62">{item.eyebrow}</p>
            <h3 className="mt-2 font-display text-3xl text-white">{item.name}</h3>
          </div>
          <span className="status-live rounded-full border border-emerald-400/24 bg-emerald-400/10 px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-emerald-200">
            <span className="status-live-dot" />
            Online
          </span>
        </div>

        <div className="mt-6 flex flex-col gap-3 rounded-[1.25rem] border border-white/8 bg-white/[0.03] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.72rem] uppercase tracking-[0.2em] text-white/66">
              {item.stack}
            </span>
            <a
              href={item.codeUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex max-w-full items-center gap-2 text-[0.72rem] text-white/52 transition hover:text-cyan-100/80"
            >
              <span className="truncate">{`github.com/${item.owner}`}</span>
              <span className="text-white/28">/</span>
              <span className="truncate text-white/42">{item.repo}</span>
            </a>
          </div>
          <div className="w-full rounded-[1rem] border border-white/6 bg-slate-950/25 px-3 py-2 sm:w-auto sm:min-w-[8.5rem] sm:max-w-[9.5rem]">
            <p className="text-[0.64rem] uppercase tracking-[0.2em] text-white/40 sm:text-right">
              Ultimo push
            </p>
            <p className="mt-1 text-xs font-medium leading-5 text-cyan-100/78 sm:text-right sm:text-sm">
              {isRepoUpdateLoading ? REPO_UPDATE_LOADING : repoUpdateLabel}
            </p>
          </div>
        </div>

        <div className="mt-auto flex flex-wrap gap-3 pt-6">
          <a
            href={item.projectUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => onProjectClick(event, item)}
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-gradient-to-r from-cyan-300 to-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:translate-y-[-1px]"
          >
            Ver projeto
          </a>
          <a
            href={item.codeUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-5 py-3 text-sm font-medium text-white/80 transition hover:border-cyan-300/30 hover:text-cyan-100"
          >
            Ver codigo
          </a>
        </div>
      </div>
    </article>
  );
}
