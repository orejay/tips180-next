import type { Metadata } from "next";
import { getBankerTip } from "@/lib/plan-tips";
import { TipsterBadge } from "@/components/marketing/tipster-badge";

export const metadata: Metadata = { title: "Banker Tips of the Day" };

export default async function BankerTipsPage() {
  const banker = await getBankerTip();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Banker Tips of the Day</h1>

      {!banker ? (
        <p className="rounded-lg border border-border py-10 text-center text-muted">
          No banker tip has been posted today. Please check back later.
        </p>
      ) : (
        <div className="rounded-xl border border-border p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-foreground">{banker.name}</h2>
            {banker.league && (
              <span className="rounded bg-background px-2 py-1 text-xs font-medium text-muted">
                {banker.league}
              </span>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Stat label="Tip" value={banker.tip} highlight />
            <Stat label="Odds" value={banker.odds} />
            <Stat label="Confidence" value={banker.confidence} />
          </div>

          {banker.analysis && (
            <div className="mt-5">
              <h3 className="text-sm font-semibold text-foreground">Analysis</h3>
              <p className="mt-1 leading-relaxed text-muted">{banker.analysis}</p>
            </div>
          )}
        </div>
      )}
      {banker && <TipsterBadge category="bankers" />}
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-xs tracking-wide text-subtle uppercase">{label}</p>
      <p
        className={
          highlight
            ? "mt-1 inline-block rounded bg-primary px-2 py-1 text-sm font-medium text-white"
            : "mt-1 text-sm font-medium text-foreground"
        }
      >
        {value || "—"}
      </p>
    </div>
  );
}
