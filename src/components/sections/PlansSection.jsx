import SectionTag from "../shared/SectionTag";

export default function PlansSection({ content, visitCount, appLinks }) {
  return (
    <section id="planos" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl" data-reveal="">
          <SectionTag>{content.tag}</SectionTag>
          <h2 className="mt-5 font-display text-4xl tracking-tight text-white sm:text-5xl">{content.title}</h2>
          <p className="mt-4 text-lg leading-8 text-white/62">{content.description}</p>
        </div>

        <div
          className="rounded-[1.8rem] border border-cyan-300/10 bg-[linear-gradient(145deg,rgba(8,17,29,0.94),rgba(12,29,49,0.92))] px-6 py-5"
          data-reveal=""
          style={{ "--reveal-delay": "120ms" }}
        >
          <div className="text-[0.72rem] uppercase tracking-[0.24em] text-white/42">{content.growthTag}</div>
          <strong className="mt-3 block font-display text-4xl tracking-tight text-cyan-200">{visitCount}</strong>
          <p className="mt-2 max-w-xs text-sm leading-7 text-white/60">{content.growthText}</p>
        </div>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {content.items.map((plan, index) => (
          <article
            key={plan.name}
            data-reveal=""
            style={{ "--reveal-delay": `${index * 90}ms` }}
            className={`rounded-[2rem] border p-7 ${
              plan.featured
                ? "border-cyan-300/28 bg-[linear-gradient(180deg,rgba(18,39,63,0.96),rgba(10,19,31,0.98))] shadow-[0_24px_70px_rgba(13,110,186,0.18)]"
                : "border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[0.72rem] uppercase tracking-[0.22em] text-cyan-100/58">{plan.badge}</div>
                <h3 className="mt-3 font-display text-3xl text-white">{plan.name}</h3>
              </div>
              {plan.featured ? (
                <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[0.68rem] uppercase tracking-[0.2em] text-cyan-100">
                  {content.featuredLabel}
                </div>
              ) : null}
            </div>

            <div className="mt-8 flex items-end gap-2">
              <strong className="font-display text-5xl tracking-tight text-white">{plan.price}</strong>
              <span className="pb-1 text-sm text-white/56">{plan.detail}</span>
            </div>

            <p className="mt-5 text-sm leading-7 text-white/66">{plan.description}</p>

            <div className="mt-6 flex flex-col gap-3">
              {plan.features.map((feature) => (
                <div
                  key={feature}
                  className="rounded-[1rem] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/74"
                >
                  {feature}
                </div>
              ))}
            </div>

            <a
              href={appLinks.dashboardUrl}
              className={`mt-8 inline-flex min-h-[50px] w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition hover:translate-y-[-1px] ${
                plan.featured
                  ? "bg-gradient-to-r from-cyan-300 to-sky-400 text-slate-950"
                  : "border border-white/12 bg-white/[0.03] text-white/85 hover:border-cyan-300/30 hover:text-cyan-100"
              }`}
            >
              {plan.cta}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
