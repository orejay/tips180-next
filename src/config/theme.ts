/**
 * Brand colours for contexts that can't read CSS variables — `next/og`
 * ImageResponse, inline SVG stroke/fill attributes, canvas, etc. Keep these in
 * sync with the light-theme values in `app/globals.css` (the CSS variables are
 * the source of truth for the rendered UI; this mirrors them for JS-only use).
 */
export const theme = {
  brandStart: "#14b8a6", // teal-500 — var(--brand-start)
  brandEnd: "#2563eb", // blue-600 — var(--brand-end)
  primary: "#2563eb", // var(--primary)
} as const;
