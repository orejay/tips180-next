import { BankrollCurvesChart } from "@/components/dashboard/bankroll-curves-chart";
import { CURVES } from "@/config/bankroll-curves";

const TIPS = [
  {
    title: "Set a fixed bankroll and stick to it",
    body: "Decide on a dedicated betting budget — money you can afford to lose entirely. Never dip into savings, rent, or essential funds. Treat it as an entertainment budget with upside potential.",
  },
  {
    title: "Use the unit system",
    body: "Never bet random amounts. Define 1 unit as 1–5% of your total bankroll per bet. This protects you from wiping out on a bad run. For example, if your bankroll is ₦50,000, one unit = ₦1,000–₦2,500.",
  },
  {
    title: "Do NOT use the Smart Bet Plan as a Rollover Plan",
    body: "We understand that the odds provided on Smart Bet range from 1.50 to 2.00 daily and can be seen as “small”. We advise you to resist the temptation to roll over your winnings. It is best to stake your daily tips differently — we have a Rollover Plan dedicated to rolling over stakes and winnings.",
  },
  {
    title: "Track every single bet",
    body: "Keep a betting log (even a simple spreadsheet) recording: date, match, market, odds, stake, and result. After 10–50 bets, your data will reveal which markets are most favourable to you.",
  },
  {
    title: "Manage your emotions — never chase losses",
    body: "The most dangerous moment in betting is right after a losing streak. There are times when we might encounter a losing streak; during this poor run of form, taking a break while observing might be the best move. You can always reach out to us for a free extension of your plan on days like this. Chasing losses by increasing stakes or making impulsive bets is how bankrolls collapse — if you lose 3 bets in a row, it is advisable to take a break.",
  },
];

export function SmartBetStrategy() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-warning/30 bg-warning/10 p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-warning">Golden Rule</p>
        <p className="mt-1 text-sm leading-relaxed text-foreground">
          No strategy guarantees profit. Betting should be approached as a
          long-term discipline, not a get-rich-quick scheme. We advise that you
          bet responsibly and within your means.
        </p>
      </div>

      <div className="space-y-5">
        {TIPS.map((tip, i) => (
          <div key={tip.title} className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-brand-start to-brand-end text-xs font-bold text-white">
              {i + 1}
            </span>
            <div>
              <h3 className="text-sm font-bold text-foreground">{tip.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{tip.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-bold text-foreground">
          Winning in football betting is like a graph — the lines are never the same
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Betting bankrolls follow different trajectories depending on your
          strategy and discipline. Compare each curve to understand the
          long-term shape of each betting personality.
        </p>

        <p className="mt-4 text-sm font-semibold text-foreground">
          Here&apos;s how the four betting personalities map to curve shapes:
        </p>

        <div className="mt-5">
          <BankrollCurvesChart />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CURVES.map((c) => (
            <div key={c.id} className="rounded-xl border border-border bg-surface-muted p-4">
              <p className="text-sm font-bold text-foreground">{c.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{c.description}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 rounded-xl bg-surface-muted p-4 text-sm font-semibold leading-relaxed text-foreground">
          The key takeaway: the shape of your curve is entirely determined by
          behaviour, not luck. Click each button in the chart to explore the
          curves individually.
        </p>
      </div>

      <p className="text-sm font-medium text-muted">
        We hope you have a profitable and seamless experience with us! — Team
        Tips180.
      </p>
    </div>
  );
}
