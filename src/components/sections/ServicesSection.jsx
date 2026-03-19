import SectionTag from "../shared/SectionTag";
import ServiceIcon from "../shared/ServiceIcon";

export default function ServicesSection({ content }) {
  return (
    <section id="servicos" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="max-w-2xl" data-reveal="">
        <SectionTag>{content.tag}</SectionTag>
        <h2 className="mt-5 font-display text-4xl tracking-tight text-white sm:text-5xl">
          {content.title}
        </h2>
        <p className="mt-4 text-lg leading-8 text-white/62">{content.description}</p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {content.items.map((service, index) => (
          <article
            key={service.title}
            data-reveal=""
            style={{ "--reveal-delay": `${index * 80}ms` }}
            className="group relative overflow-hidden rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-7 backdrop-blur-sm"
          >
            <span className="pointer-events-none absolute right-5 top-4 text-cyan-200/10 transition group-hover:text-cyan-200/16">
              <ServiceIcon name={service.icon} />
            </span>
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300/22 to-blue-500/18 text-cyan-100 ring-1 ring-white/8">
              <ServiceIcon name={service.icon} />
            </div>
            <p className="mb-3 text-[0.72rem] uppercase tracking-[0.22em] text-cyan-100/58">{service.accent}</p>
            <h3 className="font-display text-2xl text-white">{service.title}</h3>
            <p className="mt-4 text-sm leading-7 text-white/62">{service.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
