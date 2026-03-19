export default function ServiceIcon({ name }) {
  const commonProps = {
    className: "h-6 w-6",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    viewBox: "0 0 24 24",
  };

  if (name === "globe") {
    return (
      <svg {...commonProps}>
        <circle cx="12" cy="12" r="8" />
        <path d="M4 12h16" />
        <path d="M12 4a12 12 0 0 1 0 16" />
        <path d="M12 4a12 12 0 0 0 0 16" />
      </svg>
    );
  }

  if (name === "cart") {
    return (
      <svg {...commonProps}>
        <path d="M4 6h2l2 9h8l2-6H7" />
        <circle cx="10" cy="18" r="1.5" />
        <circle cx="17" cy="18" r="1.5" />
      </svg>
    );
  }

  if (name === "chart") {
    return (
      <svg {...commonProps}>
        <path d="M5 18V9" />
        <path d="M12 18V6" />
        <path d="M19 18v-4" />
        <path d="M4 18h16" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3Z" />
      <path d="m9.5 12 1.8 1.8 3.5-3.8" />
    </svg>
  );
}
