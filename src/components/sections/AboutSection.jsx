import SectionTag from "../shared/SectionTag";

export default function AboutSection({ visitCount }) {
  return (
    <section id="sobre" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.82fr]">
        <div
          className="rounded-[2.25rem] border border-white/8 bg-[linear-gradient(145deg,rgba(9,20,35,0.88),rgba(12,29,49,0.84))] p-8 sm:p-10"
          data-reveal=""
        >
          <SectionTag>Sobre a LinkSites</SectionTag>
          <h2 className="mt-5 font-display text-4xl tracking-tight text-white sm:text-5xl">
            Tecnologia, design futurista e foco total no resultado do cliente.
          </h2>
          <p className="mt-5 text-lg leading-8 text-white/66">
            Somos uma startup do grupo <strong>Techlab Software</strong>, referencia em solucoes digitais.
            Nossa missao e transformar ideias em experiencias digitais marcantes, com tecnologia de ponta,
            design futurista e foco total no resultado do cliente.
          </p>
        </div>

        <div
          className="rounded-[2.25rem] border border-cyan-300/10 bg-[linear-gradient(145deg,rgba(8,17,29,0.94),rgba(12,29,49,0.92))] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.22)] sm:p-10"
          data-reveal=""
          style={{ "--reveal-delay": "120ms" }}
        >
          <SectionTag>Presenca em crescimento</SectionTag>
          <div className="mt-6 rounded-[1.8rem] border border-white/8 bg-[rgba(5,11,20,0.55)] p-6">
            <div className="text-[0.72rem] uppercase tracking-[0.26em] text-white/42">Leitura exclusiva</div>
            <strong className="mt-4 block font-display text-5xl tracking-tight text-cyan-200">{visitCount}</strong>
            <p className="mt-4 text-sm leading-7 text-white/60">
              Visitantes unicos por navegador. Cada navegador conta uma vez e depois apenas consulta o total.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
