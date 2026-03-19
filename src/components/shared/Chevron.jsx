export default function Chevron({ direction }) {
  const rotateClass = direction === "left" ? "rotate-180" : "";

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`h-4 w-4 ${rotateClass}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M8 5l8 7-8 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
