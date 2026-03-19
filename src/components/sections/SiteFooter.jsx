export default function SiteFooter({ content }) {
  return (
    <footer className="border-t border-white/8 py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-sm text-white/52 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p>{content.left}</p>
        <p>{content.right}</p>
      </div>
    </footer>
  );
}
