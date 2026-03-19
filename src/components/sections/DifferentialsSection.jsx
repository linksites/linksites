import SectionTag from "../shared/SectionTag";

export default function DifferentialsSection({ content }) {
  return (
    <section id="diferenciais" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[2.25rem] border border-white/8 bg-[linear-gradient(135deg,rgba(9,20,35,0.88),rgba(12,29,49,0.9))] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.22)] sm:p-10 lg:p-12">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="max-w-xl" data-reveal="">
            <SectionTag>{content.tag}</SectionTag>
            <h2 className="mt-5 font-display text-4xl tracking-tight text-white sm:text-5xl">
              {content.title}
            </h2>
            <p className="mt-4 text-lg leading-8 text-white/62">{content.description}</p>
          </div>

          <div className="grid gap-4">
            {content.items.map((item, index) => (
              <div
                key={item.title}
                data-reveal=""
                style={{ "--reveal-delay": `${index * 70}ms` }}
                className="flex items-start gap-4 rounded-[1.5rem] border border-white/8 bg-white/[0.04] p-5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300/22 to-blue-500/20 font-display text-lg text-cyan-100">
                  0{index + 1}
                </div>
                <div className="pt-1">
                  <p className="text-base font-semibold text-white">{item.title}</p>
                  <p className="mt-2 text-sm leading-7 text-white/68">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
