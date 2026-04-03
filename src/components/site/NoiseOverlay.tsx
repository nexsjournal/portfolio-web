export function NoiseOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.22]"
    >
      <svg className="h-full w-full">
        <filter id="lexNoise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#lexNoise)" />
      </svg>
    </div>
  );
}
