export default function SectionTag({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-cyan-200/85">
      <span className="mr-2 inline-block h-2 w-2 rounded-full bg-cyan-300/90" />
      {children}
    </span>
  );
}
