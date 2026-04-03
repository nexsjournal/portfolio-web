import { ImageResponse } from "next/og";

export const OG_IMAGE_SIZE = {
  width: 1200,
  height: 630,
} as const;

export function createBrandOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "radial-gradient(900px 700px at 20% 0%, rgba(37,99,235,0.45), transparent 60%), radial-gradient(900px 700px at 90% 20%, rgba(251,146,60,0.35), transparent 55%), #070a12",
          color: "#e8eefc",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 6,
              background: "linear-gradient(135deg, #2563eb, #fb923c)",
            }}
          />
          <div style={{ fontSize: 18, letterSpacing: 6, opacity: 0.75 }}>
            LEXTELLSYOU.ASIA
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.05 }}>LEX</div>
          <div
            style={{ fontSize: 34, opacity: 0.78, maxWidth: 900, lineHeight: 1.25 }}
          >
            Indie developer portfolio · dark futuristic UI · blue-orange accents
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            opacity: 0.65,
            fontSize: 20,
          }}
        >
          <div>Apps · Story · Contact</div>
          <div>Next.js · Vercel</div>
        </div>
      </div>
    ),
    {
      width: OG_IMAGE_SIZE.width,
      height: OG_IMAGE_SIZE.height,
    },
  );
}
