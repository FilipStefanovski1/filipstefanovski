/** Small authored icon set: one 1.5px stroke, square caps. */
type Name = "arrow-right" | "arrow-up-right" | "arrow-left" | "arrow-down";

const paths: Record<Name, string> = {
  "arrow-right": "M3 8h10M9 4l4 4-4 4",
  "arrow-left": "M13 8H3M7 4 3 8l4 4",
  "arrow-up-right": "M4.5 11.5 11.5 4.5M5.5 4.5h6v6",
  "arrow-down": "M8 3v10M4 9l4 4 4-4",
};

export default function Icon({ name, size = 16 }: { name: Name; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden focusable="false" style={{ flex: "none" }}>
      <path d={paths[name]} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}
