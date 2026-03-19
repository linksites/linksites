import CaseCard from "../CaseCard";
import SectionTag from "../shared/SectionTag";
import Chevron from "../shared/Chevron";

export default function PortfolioSection({
  canScrollPrev,
  canScrollNext,
  scrollCases,
  trackRef,
  handleTrackClickCapture,
  handleTrackPointerDown,
  handleTrackPointerMove,
  handleTrackPointerUp,
  handleTrackWheel,
  content,
  caseCardContent,
  cases,
  repoUpdateDates,
  onProjectClick,
}) {
  return (
    <section id="portfolio" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl" data-reveal="">
          <SectionTag>{content.tag}</SectionTag>
          <h2 className="mt-5 font-display text-4xl tracking-tight text-white sm:text-5xl">
            {content.title}
          </h2>
        </div>
        <p className="max-w-xl text-base leading-7 text-white/60">{content.description}</p>
      </div>

      <div className="relative mt-12 overflow-hidden rounded-[2.4rem] border border-white/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-20 bg-gradient-to-r from-[var(--bg-strong)] to-transparent lg:block" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-20 bg-gradient-to-l from-[var(--bg-strong)] to-transparent lg:block" />

        <button
          type="button"
          aria-label={content.prevAria}
          className={`showcase-nav showcase-nav-left hidden lg:flex ${canScrollPrev ? "" : "pointer-events-none opacity-30"}`}
          onClick={() => scrollCases(-1)}
        >
          <Chevron direction="left" />
        </button>
        <button
          type="button"
          aria-label={content.nextAria}
          className={`showcase-nav showcase-nav-right hidden lg:flex ${canScrollNext ? "" : "pointer-events-none opacity-30"}`}
          onClick={() => scrollCases(1)}
        >
          <Chevron direction="right" />
        </button>

        <div className="mb-5 flex flex-col gap-4 lg:mb-7 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-white/52">{content.helper}</p>
        </div>

        <div
          ref={trackRef}
          className="showcase-track hide-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 lg:gap-7"
          onClickCapture={handleTrackClickCapture}
          onPointerDown={handleTrackPointerDown}
          onPointerMove={handleTrackPointerMove}
          onPointerUp={handleTrackPointerUp}
          onPointerCancel={handleTrackPointerUp}
          onPointerLeave={handleTrackPointerUp}
          onWheel={handleTrackWheel}
        >
          {cases.map((item, index) => {
            const repoKey = `${item.owner}/${item.repo}`;

            return (
              <CaseCard
                key={repoKey}
                item={item}
                index={index}
                repoDate={repoUpdateDates[repoKey]}
                content={caseCardContent}
                onProjectClick={onProjectClick}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
