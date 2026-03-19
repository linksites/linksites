export default function CurrentSiteDialog({ open, onClose }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(3,8,15,0.72)] px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,24,39,0.96),rgba(6,14,24,0.98))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.38)] sm:p-7">
        <div className="rounded-full border border-emerald-400/18 bg-emerald-400/10 px-3 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-emerald-200/88">
          Navegacao atual
        </div>
        <h3 className="mt-5 font-display text-3xl tracking-tight text-white">Voce ja esta no site atual.</h3>
        <p className="mt-3 text-sm leading-7 text-white/64">
          Este projeto e a propria pagina que voce esta navegando neste momento.
        </p>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-gradient-to-r from-cyan-300 to-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:translate-y-[-1px]"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
