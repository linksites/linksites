import SectionTag from "../shared/SectionTag";

export default function ContactSection() {
  return (
    <section id="contato" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div
        className="overflow-hidden rounded-[2.25rem] border border-cyan-300/10 bg-[linear-gradient(135deg,rgba(9,20,35,0.96),rgba(12,29,49,0.94))] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-10 lg:p-12"
        data-reveal=""
      >
        <SectionTag>Contato</SectionTag>
        <div className="mt-5 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <h2 className="font-display text-4xl tracking-tight text-white sm:text-5xl">Fale com a LinkSites.</h2>
            <p className="mt-4 text-lg leading-8 text-white/62">
              Atendimento direto pelo WhatsApp, com estrutura pronta para transformar sua ideia em uma
              experiencia digital marcante e profissional.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.04] p-5">
                <div className="text-[0.72rem] uppercase tracking-[0.22em] text-white/42">E-mail</div>
                <p className="mt-3 text-base text-white/80">sergiosrdev@hotmail.com</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.04] p-5">
                <div className="text-[0.72rem] uppercase tracking-[0.22em] text-white/42">Localizacao</div>
                <p className="mt-3 text-base text-white/80">Belem, PA - Atendimento Global</p>
              </div>
            </div>
          </div>

          <div className="min-w-[18rem] rounded-[1.8rem] border border-white/8 bg-[rgba(6,12,22,0.44)] p-6">
            <div className="text-[0.72rem] uppercase tracking-[0.24em] text-white/42">WhatsApp</div>
            <a
              href="https://wa.me/5591982460001"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex min-h-[54px] w-full items-center justify-center rounded-full bg-gradient-to-r from-cyan-300 to-sky-400 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_18px_40px_rgba(74,222,255,0.18)] transition hover:translate-y-[-1px]"
            >
              Chamar no WhatsApp
            </a>
            <p className="mt-4 text-sm leading-7 text-white/60">+55 91 98246-0001</p>
          </div>
        </div>
      </div>
    </section>
  );
}
