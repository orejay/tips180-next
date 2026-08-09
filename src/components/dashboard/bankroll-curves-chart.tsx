"use client";

import { useId, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  CURVES,
  PEAK_BANKROLL,
  SERIES,
  STARTING_BANKROLL,
  WEEKS,
  type CurveId,
} from "@/config/bankroll-curves";

/** Series -> CSS color var. Kept out of config so it stays a presentation concern. */
const COLOR_VAR: Record<CurveId, string> = {
  smart: "var(--success)",
  chaser: "var(--danger)",
  lucky: "var(--warning)",
  casual: "var(--chart-neutral)",
};

const fmtNaira = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;

const CHART_W = 760;
const CHART_H = 340;
const PAD = { top: 12, right: 16, bottom: 28, left: 46 };
const Y_MAX = 18000;
const Y_STEP = 2000;

const x = (week: number) =>
  PAD.left + (week / WEEKS) * (CHART_W - PAD.left - PAD.right);
const y = (value: number) =>
  PAD.top + (1 - value / Y_MAX) * (CHART_H - PAD.top - PAD.bottom);

/** Catmull-Rom -> cubic Bezier smoothing, so the illustrative wiggle reads as a
 *  hand-drawn trend line rather than a jagged polyline. */
function smoothPath(points: [number, number][]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
  }
  return d;
}

export function BankrollCurvesChart() {
  const gradientId = useId();
  const [selected, setSelected] = useState<CurveId | "all">("all");
  const [hoverWeek, setHoverWeek] = useState<number | null>(null);

  const visible = selected === "all" ? CURVES.map((c) => c.id) : [selected];

  const paths = useMemo(
    () =>
      CURVES.map((curve) => ({
        curve,
        d: smoothPath(SERIES[curve.id].map((v, w) => [x(w), y(v)] as [number, number])),
      })),
    [],
  );

  const stats = useMemo(() => {
    if (selected === "all") {
      return {
        peak: PEAK_BANKROLL,
        end: null as number | null,
        verdict: "See all paths",
      };
    }
    const series = SERIES[selected];
    return {
      peak: Math.max(...series),
      end: series[series.length - 1],
      verdict: CURVES.find((c) => c.id === selected)!.verdict,
    };
  }, [selected]);

  const yTicks = useMemo(() => {
    const ticks: number[] = [];
    for (let v = 0; v <= Y_MAX; v += Y_STEP) ticks.push(v);
    return ticks;
  }, []);

  const xTicks = [0, 4, 8, 12, 16, 20, 24, 28];

  const handleMove = (e: React.PointerEvent<SVGRectElement>) => {
    const svg = e.currentTarget.ownerSVGElement;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * CHART_W;
    const week = Math.round(
      ((relX - PAD.left) / (CHART_W - PAD.left - PAD.right)) * WEEKS,
    );
    setHoverWeek(Math.min(WEEKS, Math.max(0, week)));
  };

  return (
    <div>
      {/* Filter pills */}
      <div role="tablist" aria-label="Filter curves" className="mb-5 flex flex-wrap gap-2">
        <button
          type="button"
          role="tab"
          aria-selected={selected === "all"}
          onClick={() => setSelected("all")}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
            selected === "all"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "border border-border text-muted hover:text-foreground",
          )}
        >
          All curves
        </button>
        {CURVES.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={selected === c.id}
            onClick={() => setSelected(c.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
              selected === c.id
                ? "border-transparent text-white shadow-sm"
                : "border-border text-muted hover:text-foreground",
            )}
            style={selected === c.id ? { backgroundColor: COLOR_VAR[c.id] } : undefined}
          >
            {c.shortLabel}
          </button>
        ))}
      </div>

      {/* Stat tiles */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Starting bankroll" value={fmtNaira(STARTING_BANKROLL)} />
        <StatTile label="Peak bankroll" value={fmtNaira(stats.peak)} />
        <StatTile label="End bankroll" value={stats.end === null ? "Varies" : fmtNaira(stats.end)} />
        <StatTile label="Verdict" value={stats.verdict} small />
      </div>

      {/* Chart */}
      <div className="rounded-2xl border border-border bg-surface p-3 sm:p-4">
        <svg
          viewBox={`0 0 ${CHART_W} ${CHART_H}`}
          className="w-full touch-none select-none"
          role="img"
          aria-label="Weekly bankroll trajectories for four betting personalities"
        >
          <defs>
            <clipPath id={`${gradientId}-clip`}>
              <rect x={PAD.left} y={PAD.top} width={CHART_W - PAD.left - PAD.right} height={CHART_H - PAD.top - PAD.bottom} />
            </clipPath>
          </defs>

          {/* Gridlines + y labels */}
          {yTicks.map((v) => (
            <g key={v}>
              <line
                x1={PAD.left}
                x2={CHART_W - PAD.right}
                y1={y(v)}
                y2={y(v)}
                stroke="var(--border)"
                strokeWidth={1}
              />
              <text x={PAD.left - 8} y={y(v) + 3} textAnchor="end" fontSize={10} fill="var(--subtle)">
                {`₦${v / 1000}k`}
              </text>
            </g>
          ))}

          {/* x labels */}
          {xTicks.map((w) => (
            <text
              key={w}
              x={x(w)}
              y={CHART_H - 8}
              textAnchor="middle"
              fontSize={10}
              fill="var(--subtle)"
            >
              {`Wk ${w}`}
            </text>
          ))}

          {/* Hover crosshair */}
          {hoverWeek !== null && (
            <line
              x1={x(hoverWeek)}
              x2={x(hoverWeek)}
              y1={PAD.top}
              y2={CHART_H - PAD.bottom}
              stroke="var(--subtle)"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          )}

          {/* Lines */}
          <g clipPath={`url(#${gradientId}-clip)`}>
            {paths
              .filter((p) => visible.includes(p.curve.id))
              .map((p) => (
                <path
                  key={p.curve.id}
                  d={p.d}
                  fill="none"
                  stroke={COLOR_VAR[p.curve.id]}
                  strokeWidth={p.curve.id === "casual" ? 2 : 2.5}
                  strokeLinecap="round"
                  strokeDasharray={p.curve.dash}
                  opacity={selected === "all" || selected === p.curve.id ? 1 : 0.25}
                />
              ))}
          </g>

          {/* Hover dots + values */}
          {hoverWeek !== null &&
            CURVES.filter((c) => visible.includes(c.id)).map((c, i) => {
              const value = SERIES[c.id][hoverWeek];
              return (
                <g key={c.id}>
                  <circle
                    cx={x(hoverWeek)}
                    cy={y(value)}
                    r={4}
                    fill={COLOR_VAR[c.id]}
                    stroke="var(--surface)"
                    strokeWidth={2}
                  />
                  <text
                    x={Math.min(x(hoverWeek) + 8, CHART_W - PAD.right - 60)}
                    y={PAD.top + 12 + i * 14}
                    fontSize={10}
                    fontWeight={600}
                    fill={COLOR_VAR[c.id]}
                  >
                    {`${c.shortLabel}: ${fmtNaira(value)}`}
                  </text>
                </g>
              );
            })}

          {/* Hover hit area */}
          <rect
            x={PAD.left}
            y={PAD.top}
            width={CHART_W - PAD.left - PAD.right}
            height={CHART_H - PAD.top - PAD.bottom}
            fill="transparent"
            onPointerMove={handleMove}
            onPointerLeave={() => setHoverWeek(null)}
          />
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        {CURVES.map((c) => (
          <div key={c.id} className="flex items-center gap-2 text-xs font-medium text-muted">
            <svg width="18" height="8" aria-hidden="true">
              <line
                x1={0}
                x2={18}
                y1={4}
                y2={4}
                stroke={COLOR_VAR[c.id]}
                strokeWidth={2.5}
                strokeDasharray={c.dash}
                strokeLinecap="round"
              />
            </svg>
            {c.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatTile({ label, value, small = false }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="rounded-xl bg-foreground px-4 py-3 text-white dark:bg-surface-muted">
      <p className="text-[11px] font-medium text-white/70">{label}</p>
      <p className={cn("mt-0.5 font-bold", small ? "text-sm leading-snug" : "text-lg")}>{value}</p>
    </div>
  );
}
