import { useState } from "react";
import ContactSection from "./components/sections/ContactSection";
import CurrentSiteDialog from "./components/sections/CurrentSiteDialog";
import DifferentialsSection from "./components/sections/DifferentialsSection";
import HeroSection from "./components/sections/HeroSection";
import PlansSection from "./components/sections/PlansSection";
import PortfolioSection from "./components/sections/PortfolioSection";
import ServicesSection from "./components/sections/ServicesSection";
import SiteFooter from "./components/sections/SiteFooter";
import SiteHeader from "./components/sections/SiteHeader";
import { appLinks } from "./config/app-links";
import { localizedCases } from "./data/cases";
import { siteContent } from "./data/siteContent";
import { useDialogEscape } from "./hooks/useDialogEscape";
import { useExchangeRate } from "./hooks/useExchangeRate";
import { useLandingLocale } from "./hooks/useLandingLocale";
import { usePageMetadata } from "./hooks/usePageMetadata";
import { usePortfolioTrack } from "./hooks/usePortfolioTrack";
import { useRepoUpdates } from "./hooks/useRepoUpdates";
import { useRevealOnScroll } from "./hooks/useRevealOnScroll";
import { useVisitCount } from "./hooks/useVisitCount";
import { formatPlanPrice } from "./lib/plan-pricing";

export default function App() {
  const [locale, setLocale] = useLandingLocale();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCurrentSiteDialogOpen, setIsCurrentSiteDialogOpen] = useState(false);

  const content = siteContent[locale] ?? siteContent.ptBR;
  const cases = localizedCases[locale] ?? localizedCases.ptBR;
  const exchangeRate = useExchangeRate();
  const repoUpdateDates = useRepoUpdates();
  const visitCount = useVisitCount(
    content.numberLocale,
    content.visitCount.offline,
    content.visitCount.loading,
  );
  const {
    canScrollPrev,
    canScrollNext,
    handleTrackClickCapture,
    handleTrackPointerDown,
    handleTrackPointerMove,
    handleTrackPointerUp,
    handleTrackWheel,
    scrollCases,
    trackRef,
  } = usePortfolioTrack();

  usePageMetadata(content);
  useRevealOnScroll();
  useDialogEscape(isCurrentSiteDialogOpen, () => setIsCurrentSiteDialogOpen(false));

  const plansContent = {
    ...content.plans,
    items: content.plans.items.map((plan) => ({
      ...plan,
      price: formatPlanPrice(plan.amountBrl, locale, exchangeRate) ?? content.plans.priceLoading,
    })),
  };

  function handleProjectClick(event, item) {
    if (item.repo !== content.portfolio.currentDemoRepo) {
      return;
    }

    event.preventDefault();
    setIsCurrentSiteDialogOpen(true);
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
        appLinks={appLinks}
        locale={locale}
        setLocale={setLocale}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      <main id="inicio">
        <HeroSection hero={content.hero} appLinks={appLinks} />
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
        <PlansSection content={plansContent} visitCount={visitCount} appLinks={appLinks} />
        <ContactSection content={content.contact} appLinks={appLinks} />
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
