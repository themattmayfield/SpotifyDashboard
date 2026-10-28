/** AuxCheck's mark: equalizer bars inside an open ring. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M19.4 7.2A9 9 0 1 0 21 12" />
      <path d="M8.5 10.5v3M12 8v8M15.5 9.5v5" />
    </svg>
  );
}
