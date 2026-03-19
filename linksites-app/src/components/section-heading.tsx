type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      <div className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">{eyebrow}</div>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-white/68 sm:text-lg">{description}</p>
    </div>
  );
}
