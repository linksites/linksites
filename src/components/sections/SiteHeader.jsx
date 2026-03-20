import logo from "../../../assets/logolinksites.jpg";

export default function SiteHeader({ navItems, header, appLinks, locale, setLocale, menuOpen, setMenuOpen }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[rgba(6,12,22,0.72)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#inicio" className="flex items-center gap-3">
          <img
            src={logo}
            alt="LinkSites"
            className="h-11 w-11 rounded-2xl object-cover shadow-[0_0_28px_rgba(98,240,235,0.18)]"
          />
          <div className="leading-none">
            <div className="font-display text-2xl tracking-tight text-white">
              Link<span className="text-cyan-300">Sites</span>
            </div>
            <div className="text-[0.65rem] uppercase tracking-[0.28em] text-white/45">
              {header.tagline}
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

        <div className="hidden items-center gap-3 md:flex">
          <div className="rounded-full border border-white/10 bg-white/[0.04] p-1">
            {header.locales.map((item) => (
              <button
                key={item.value}
                type="button"
                aria-label={`${header.languageLabel}: ${item.label}`}
                onClick={() => setLocale(item.value)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  locale === item.value
                    ? "bg-cyan-300 text-slate-950"
                    : "text-white/65 hover:text-cyan-100"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <a
            href={appLinks.dashboardUrl}
            className="inline-flex items-center rounded-full border border-cyan-300/25 bg-cyan-300/10 px-5 py-2.5 text-sm font-medium text-cyan-100 transition hover:border-cyan-200/40 hover:bg-cyan-300/16"
          >
            {header.primaryCta}
          </a>
        </div>

        <button
          type="button"
          aria-label={header.openMenuLabel}
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
          <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
            <span className="text-xs uppercase tracking-[0.22em] text-white/45">{header.languageLabel}</span>
            <div className="flex items-center gap-2">
              {header.locales.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setLocale(item.value)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    locale === item.value
                      ? "bg-cyan-300 text-slate-950"
                      : "border border-white/10 text-white/65"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
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
  );
}
