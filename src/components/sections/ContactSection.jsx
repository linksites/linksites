import SectionTag from "../shared/SectionTag";

export default function ContactSection({ content, appLinks }) {
  return (
    <section id="contato" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div
        className="overflow-hidden rounded-[2.25rem] border border-cyan-300/10 bg-[linear-gradient(135deg,rgba(9,20,35,0.96),rgba(12,29,49,0.94))] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-10 lg:p-12"
        data-reveal=""
      >
        <SectionTag>{content.tag}</SectionTag>
        <div className="mt-5 grid gap-10 xl:grid-cols-[minmax(0,1.15fr)_minmax(19rem,0.85fr)] xl:items-start">
          <div className="max-w-3xl">
            <h2 className="font-display text-4xl tracking-tight text-white sm:text-5xl">{content.title}</h2>
            <p className="mt-4 text-lg leading-8 text-white/62">{content.description}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {content.cards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-[1.5rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5 backdrop-blur-sm"
                >
                  <div className="text-[0.72rem] uppercase tracking-[0.22em] text-cyan-100/52">{card.label}</div>
                  <p className="mt-3 text-base leading-7 text-white/80">{card.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative self-start overflow-hidden rounded-[1.9rem] border border-cyan-300/14 bg-[linear-gradient(180deg,rgba(9,21,35,0.9),rgba(7,15,26,0.96))] p-6 shadow-[0_24px_70px_rgba(4,10,20,0.34)]">
            <div className="pointer-events-none absolute inset-x-6 top-0 h-24 rounded-full bg-cyan-300/10 blur-3xl" />
            <div className="relative">
              <div className="inline-flex rounded-full border border-cyan-300/18 bg-cyan-300/10 px-3 py-1 text-[0.72rem] uppercase tracking-[0.24em] text-cyan-100/78">
                {content.sidebarLabel}
              </div>
              <h3 className="mt-5 max-w-sm font-display text-2xl tracking-tight text-white">
                {content.cta}
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/62">{content.helper}</p>

              <div className="mt-6 grid gap-3">
                <a
                  href={appLinks.dashboardUrl}
                  className="inline-flex min-h-[56px] w-full items-center justify-center rounded-full bg-gradient-to-r from-cyan-300 to-sky-400 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_18px_40px_rgba(74,222,255,0.18)] transition hover:translate-y-[-1px]"
                >
                  {content.cta}
                </a>
                <a
                  href={appLinks.showcaseUrl}
                  className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full border border-white/12 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white/82 transition hover:border-cyan-300/28 hover:text-cyan-100"
                >
                  Demo publica
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
