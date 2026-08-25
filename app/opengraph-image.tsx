import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "linear-gradient(135deg, #14171d 0%, #0e1014 60%, #1b2a47 100%)",
          color: "#ecebe6",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", width: 40, height: 4, background: "#8fbee8" }} />
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 4, color: "#8fbee8" }}>
            {site.name.toUpperCase()}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 78, lineHeight: 1.02, letterSpacing: -3, fontWeight: 700 }}>
            Frontend
          </div>
          <div
            style={{
              fontSize: 78,
              lineHeight: 1.02,
              letterSpacing: -3,
              fontWeight: 700,
              color: "#8fbee8",
            }}
          >
            Developer
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, fontSize: 22, color: "#98a0ac" }}>
          <span>React</span>
          <span style={{ color: "#c9a227" }}>·</span>
          <span>TypeScript</span>
          <span style={{ color: "#c9a227" }}>·</span>
          <span>Next.js</span>
          <span style={{ color: "#c9a227" }}>·</span>
          <span>Three.js</span>
        </div>
      </div>
    ),
    size,
  );
}
