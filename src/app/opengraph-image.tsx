import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { theme } from "@/config/theme";

export const alt = "Tips180 — Accurate Football Predictions & Betting Tips";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default social share image, generated at the edge (no static asset needed). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${theme.brandStart} 0%, ${theme.brandEnd} 100%)`,
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 120, fontWeight: 800, letterSpacing: -2 }}>
          {siteConfig.name}
        </div>
        <div style={{ marginTop: 16, fontSize: 40, opacity: 0.95 }}>
          Accurate Football Predictions &amp; Betting Tips
        </div>
        <div style={{ marginTop: 28, fontSize: 26, opacity: 0.8 }}>
          Free &amp; premium tips · correct scores · accumulators
        </div>
      </div>
    ),
    size,
  );
}
