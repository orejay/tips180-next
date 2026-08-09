import Link from "next/link";

const gradient =
  "bg-linear-to-r from-brand-start to-brand-end bg-clip-text text-transparent";

const MARKETS = [
  {
    title: "Sure Banker Tips",
    body: "our highest-confidence pick of the day, chosen for consistency over flashy odds — provided for free.",
    href: "/dashboard/bankertips",
  },
  {
    title: "Correct Score Predictions",
    body: "exact scoreline forecasts for punters chasing bigger returns.",
    href: "/tip-store/correctscore",
  },
  {
    title: "BTTS (Both Teams to Score) Tips",
    body: "for matches where goals at both ends are the smarter read than the outright winner.",
    href: "/tip-store/bts",
  },
  {
    title: "Over/Under 2.5 Goals Predictions",
    body: "goal-line tips built from each team's recent scoring and conceding record.",
    href: "/tip-store/over2",
  },
  {
    title: "Double Chance Tips",
    body: "a lower-risk way to cover two possible outcomes in one selection.",
    href: "/tip-store/doublechance",
  },
  {
    title: "Accumulator Tips",
    body: "carefully paired legs for bettors building multi-bets, not just a random list stapled together.",
    href: "/tip-store/accumulator",
  },
  {
    title: "Win Either Half & HT/FT",
    body: "for punters who want more precision than a full-time result alone.",
    href: "/tip-store/winehalf",
  },
];

const TESTIMONIALS = [
  {
    quote: "I stopped chasing random tips on Twitter once I found a site that actually explains its picks.",
    name: "Austin, Nigeria",
  },
  {
    quote: "I was skeptical at first, then I tried it. I stick with the 2 Odds store. It is quite good and consistent.",
    name: "Venka, India",
  },
  {
    quote: "The Rollover Plan is the first guarantee I've seen from a prediction site that isn't just marketing.",
    name: "Frimpong, Ghana",
  },
  {
    quote: "A friend recommended this website, and I have been using them for 6 years now.",
    name: "Justin, Kenya",
  },
];

/**
 * Long-form SEO copy block (legacy Writeup). Server Component — this content is a
 * core on-page ranking signal for "football prediction site" / "free betting tips".
 */
export function Writeup() {
  return (
    <section id="writeup" className="mx-auto w-full max-w-5xl px-4 py-14">
      <h2 className={`mb-3 text-2xl font-semibold lg:text-3xl ${gradient}`}>
        Football Betting Tips &amp; Predictions Today
      </h2>
      <p className="mb-6 text-sm font-semibold text-foreground lg:text-base">
        Free and Premium football tips across every major league — built on
        match data, not guesswork.
      </p>
      <p className="mb-6 text-sm text-muted lg:text-base">
        Every day, Tips180 publishes football betting tips and predictions
        covering fixtures from the Premier League and Champions League down
        to leagues casual fans never hear about. Whether you&apos;re after a
        straightforward sure banker, a correct score prediction, or the legs
        for a full accumulator, every tip starts from form, head-to-head
        records, and match statistics. And unlike sites that promise
        &quot;100% sure wins&quot; with nothing behind the claim, we offer a
        money-back guarantee on some of our plans.
      </p>

      <h3 className={`mb-2 text-lg font-semibold lg:text-xl ${gradient}`}>
        Why Bettors Choose Tips180
      </h3>
      <p className="mb-4 text-sm text-muted lg:text-base">
        Plenty of sites call themselves the best football prediction site.
        Here&apos;s what actually backs that up for Tips180:
      </p>
      <ul className="mb-6 list-disc space-y-2 pl-6 text-sm text-muted lg:text-base">
        <li>
          <strong className="text-foreground">Real analysis, not guesses.</strong> Every
          football prediction is built from team form, head-to-head history,
          and match statistics — not a coin flip dressed up as a &quot;sure
          win.&quot;
        </li>
        <li>
          <strong className="text-foreground">Every major betting market, one site.</strong>{" "}
          Bankers,{" "}
          <Link href="/tip-store/correctscore" className="font-medium text-primary hover:underline">
            correct scores
          </Link>
          , BTTS, over/under, double chance, accumulators — you don&apos;t
          need five tabs open to compare tips.
        </li>
        <li>
          <strong className="text-foreground">A guarantee, not just a promise.</strong> The
          Rollover Plan is backed by a genuine money-back guarantee.{" "}
          <a href="#rollover-plan" className="font-medium text-primary hover:underline">
            See how it works below.
          </a>
        </li>
        <li>
          <strong className="text-foreground">Free tips daily, Premium tips for serious punters.</strong>{" "}
          Start with our free football predictions, upgrade to a subscription
          plan when you want deeper daily coverage.
        </li>
      </ul>

      <h3 className={`mb-2 text-lg font-semibold lg:text-xl ${gradient}`}>
        Today&apos;s Football Predictions: Every Market Covered
      </h3>
      <p className="mb-4 text-sm text-muted lg:text-base">
        Football betting isn&apos;t just one bet — it&apos;s dozens of
        markets, and Tips180 covers the ones bettors actually use:
      </p>
      <ul className="mb-6 list-disc space-y-2 pl-6 text-sm text-muted lg:text-base">
        {MARKETS.map((m) => (
          <li key={m.title}>
            <Link href={m.href} className="font-semibold text-foreground hover:text-primary">
              {m.title}
            </Link>{" "}
            — {m.body}
          </li>
        ))}
      </ul>
      <p className="mb-10 text-sm text-muted lg:text-base">
        Free predictions are updated daily on the homepage. Premium members
        get the full board — every market, every fixture we cover, every day.
      </p>

      <div id="rollover-plan" className="scroll-mt-24 rounded-2xl border border-border bg-surface-muted p-6 lg:p-8">
        <h3 className={`mb-2 text-lg font-semibold lg:text-xl ${gradient}`}>
          The Rollover Plan: Predictions Backed by a Guarantee
        </h3>
        <p className="mb-4 text-sm text-muted lg:text-base">
          Most prediction sites just ask you to trust them. The Rollover Plan
          asks you to hold us accountable instead.
        </p>
        <p className="mb-4 text-sm text-muted lg:text-base">
          It&apos;s a 30-day plan for paid subscribers, giving full access to
          Tips180&apos;s VIP football predictions across every market for the
          full period. If we fail to correctly predict a minimum of 20 of the
          day-tips issued during those 30 days, you get your subscription fee
          back — in full.
        </p>
        <p className="mb-4 text-sm text-muted lg:text-base">
          No fine print, no &quot;credit toward next month.&quot; A refund.
        </p>
        <p className="mb-5 text-sm text-muted lg:text-base">
          That&apos;s the kind of guarantee you can only offer when
          you&apos;re confident in what you&apos;re publishing — which is
          exactly the point.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/our-plans"
            className="inline-block rounded-md bg-linear-to-r from-brand-start to-brand-end px-6 py-2.5 font-semibold text-white transition-opacity hover:opacity-90"
          >
            Join the Rollover Plan →
          </Link>
          <Link
            href="/rollover-guarantee"
            className="text-sm font-medium text-primary hover:underline"
          >
            Read the full guarantee policy
          </Link>
        </div>
      </div>

      <h3 className={`mb-2 mt-10 text-lg font-semibold lg:text-xl ${gradient}`}>
        How We Build Our Football Predictions
      </h3>
      <p className="mb-4 text-sm text-muted lg:text-base">
        Behind every tip is the same process: recent form on both sides,
        head-to-head history, home and away splits, what is at stake in the
        match, the relevance of the match result to the teams involved and
        the impact of winning/losing/drawing to other teams around them, the
        time interval between the current match and the next match, squad
        depth, and injury or suspension news that can tip a match one way or
        the other.
      </p>
      <p className="mb-4 text-sm text-muted lg:text-base">
        We also delve deep into the statistics of the typical bet market for
        each league. For example, the average outcome of a match in the
        Netherlands Eredivisie is Over 2.5 goals. Does this mean every match
        played in the Netherlands Eredivisie is expected to end with both
        teams scoring more than 2 goals? Of course not. This is why we
        inspect and analyze each match, one at a time. The average match
        outcome of some leagues is draws, while some are under 2.5, some
        BTTS, and so on — this kind of betting market
        familiarisation/knowledge can only be achieved with experience in the
        football betting industry and in-depth analysis, both of which we
        have in stock.
      </p>
      <p className="mb-10 text-sm text-muted lg:text-base">
        We&apos;re not chasing long-shot odds to make a bigger number look
        exciting — we&apos;re looking for value the bookmakers have
        underpriced. No football prediction is ever 100% certain, and we
        won&apos;t pretend otherwise. Every tip on Tips180 is the product of
        research, not a guess dressed up as one.
      </p>

      <h3 className={`mb-4 text-lg font-semibold lg:text-xl ${gradient}`}>
        What Bettors Are Saying
      </h3>
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {TESTIMONIALS.map((t) => (
          <blockquote
            key={t.name}
            className="rounded-xl border border-border bg-surface p-4 text-sm text-muted lg:text-base"
          >
            <p>&ldquo;{t.quote}&rdquo;</p>
            <footer className="mt-2 text-xs font-semibold text-foreground">
              — {t.name}
            </footer>
          </blockquote>
        ))}
      </div>

      <h3 className={`mb-2 text-lg font-semibold lg:text-xl ${gradient}`}>
        Start Winning Smarter — Today&apos;s Tips Are Live
      </h3>
      <p className="mb-4 text-sm text-muted lg:text-base">
        Free football predictions update daily. VIP members get the full
        board, every market, backed by the Rollover Plan guarantee.
      </p>

      <Link href="/auth/signup" className={`text-lg font-semibold underline ${gradient}`}>
        Sign Up Now with Tips180 and Start Winning
      </Link>
    </section>
  );
}
