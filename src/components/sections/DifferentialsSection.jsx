import SectionTag from "../shared/SectionTag";

export default function DifferentialsSection({ differentials }) {
  return (
    <section id="diferenciais" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[2.25rem] border border-white/8 bg-[linear-gradient(135deg,rgba(9,20,35,0.88),rgba(12,29,49,0.9))] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.22)] sm:p-10 lg:p-12">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="max-w-xl" data-reveal="">
            <SectionTag>Diferenciais</SectionTag>
            <h2 className="mt-5 font-display text-4xl tracking-tight text-white sm:text-5xl">
              Estrutura premium com base solida, rapida e inteligente.
            </h2>
            <p className="mt-4 text-lg leading-8 text-white/62">
              O que fazia sentido na mensagem original continua aqui: performance, atendimento consultivo,
              velocidade e uma postura profissional do inicio ao fim.
            </p>
          </div>

          <div className="grid gap-4">
            {differentials.map((item, index) => (
              <div
                key={item}
                data-reveal=""
                style={{ "--reveal-delay": `${index * 70}ms` }}
                className="flex items-start gap-4 rounded-[1.5rem] border border-white/8 bg-white/[0.04] p-5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300/22 to-blue-500/20 font-display text-lg text-cyan-100">
                  0{index + 1}
                </div>
                <p className="pt-1 text-base leading-7 text-white/72">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
