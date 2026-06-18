import Link from "next/link";
import { getNextSmartBet } from "@/lib/home";
import { Countdown } from "@/components/ui/countdown";

const gradient = "bg-linear-to-r from-brand-start to-brand-end bg-clip-text text-transparent";

function fmtDate(iso: string): string {
  const m = iso?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso ?? "";
}

/** Smart Bet / Smart Bet Plus promo cards (legacy SmartBetLanding). */
export async function SmartBetLanding() {
  const next = await getNextSmartBet();
  const sb = next[0];
  if (!sb) return null;

  return (
    <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 px-4 py-8 md:grid-cols-2">
      <div className="rounded-xl bg-teal-50 dark:bg-surface-muted p-6 shadow-sm">
        <h2 className={`mb-1 text-3xl font-bold ${gradient}`}>Smart Bet Plan!</h2>
        <p className="mb-3 max-w-[80%] text-sm text-muted">
          Unveil smart betting tips! Bet smart, win consistently!
        </p>
        <Link href="/dashboard/smartbet" className="inline-block rounded bg-linear-to-r from-brand-start to-brand-end px-3 py-2 text-sm font-medium text-white">
          Try This Out
        </Link>
        <p className="mt-3 font-bold text-foreground">Smart Bet Odds: {sb.smartbetodds}</p>
        <p className="mt-3 text-sm text-muted">Next Smart Bet Tips starts in</p>
        <h3 className={`text-xl font-extrabold lg:text-2xl ${gradient}`}>
          <Countdown time={sb.nextsmartbet} />
        </h3>
      </div>

      <div className="rounded-xl bg-indigo-50 dark:bg-surface-muted p-6 shadow-sm">
        <h2 className={`mb-1 text-3xl font-bold ${gradient}`}>Smart Bet Plus!</h2>
        <p className="mb-3 max-w-[80%] text-sm text-muted">
          Get an ACCA of 10 banker tips (one per league) selected from Europe&apos;s
          top ten leagues.
        </p>
        <Link href="/dashboard/smartbet" className="inline-block rounded bg-linear-to-r from-brand-start to-brand-end px-3 py-2 text-sm font-medium text-white">
          Try This Out
        </Link>
        <p className="mt-3 font-bold text-foreground">Exclusive to Smart Bet Members</p>
        <p className="mt-3 text-sm text-muted">Next Smart Bet Plus Tip</p>
        <h3 className={`text-xl font-extrabold lg:text-2xl ${gradient}`}>
          {fmtDate(sb.nextsmartbetplus)}
        </h3>
      </div>
    </section>
  );
}
