import heroLogo from "../../../assets/logoLS.png";
import SectionTag from "../shared/SectionTag";

export default function HeroSection({ hero, appLinks }) {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 pb-20 pt-16 sm:px-6 md:pt-24 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:pb-28">
        <div className="max-w-2xl" data-reveal="">
          <SectionTag>{hero.tag}</SectionTag>
          <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {hero.title}
          </h1>
          <h2 className="mt-5 max-w-2xl text-2xl font-medium tracking-tight text-cyan-100 sm:text-3xl">
            {hero.subtitle}
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">{hero.description}</p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-stretch">
            <a
              href={appLinks.dashboardUrl}
              className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-gradient-to-r from-cyan-300 to-sky-400 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_18px_40px_rgba(74,222,255,0.18)] transition hover:translate-y-[-1px]"
            >
              {hero.primaryCta}
            </a>
            <a
              href={appLinks.showcaseUrl}
              className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-white/80 transition hover:border-cyan-300/30 hover:text-cyan-100"
            >
              {hero.secondaryCta}
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {hero.points.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-center" data-reveal="" style={{ "--reveal-delay": "120ms" }}>
          <div className="absolute left-[12%] top-[10%] h-40 w-40 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="absolute bottom-[10%] right-[10%] h-44 w-44 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="hero-orbit absolute inset-[8%]" />

          <div className="relative flex w-full max-w-[30rem] flex-col items-center justify-center gap-6 px-6 py-6 sm:px-10">
            <div className="relative flex h-[20rem] w-full max-w-[23rem] items-center justify-center sm:h-[24rem] sm:max-w-[25rem]">
              <div className="absolute inset-[10%] rounded-full border border-cyan-300/10 bg-[radial-gradient(circle,rgba(98,240,235,0.12),rgba(8,17,29,0)_68%)] blur-2xl" />
              <div className="absolute inset-[8%] rounded-[2.5rem] border border-white/6 bg-[linear-gradient(155deg,rgba(10,24,39,0.48),rgba(5,12,22,0.18))] shadow-[0_30px_80px_rgba(0,0,0,0.24)] backdrop-blur-sm" />
              <div className="absolute inset-[14%] rounded-full border border-cyan-300/12" />
              <div className="absolute inset-[18%] rounded-full border border-white/6" />

              <div className="hero-energy-shell relative flex h-[16rem] w-[16rem] items-center justify-center rounded-[2.2rem] border border-cyan-300/12 bg-[radial-gradient(circle_at_50%_30%,rgba(98,240,235,0.12),rgba(9,19,31,0.18)_55%,rgba(9,19,31,0)_78%)] shadow-[0_24px_70px_rgba(6,12,22,0.38)] sm:h-[19rem] sm:w-[19rem]">
                <img
                  src={heroLogo}
                  alt="LinkSites"
                  className="hero-energy-logo h-full w-full object-contain drop-shadow-[0_0_42px_rgba(98,240,235,0.2)]"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {hero.statusBadges.map((item, index) => (
                <div
                  key={item}
                  className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.24em] backdrop-blur ${
                    index === 0
                      ? "border border-white/10 bg-[rgba(7,16,27,0.62)] text-white/58"
                      : "border border-cyan-300/18 bg-cyan-300/8 text-cyan-100/88"
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
