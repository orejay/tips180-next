import Link from "next/link";

const gradient =
  "bg-linear-to-r from-brand-start to-brand-end bg-clip-text text-transparent";

/**
 * Long-form SEO copy block (legacy Writeup). Server Component — this content is a
 * core on-page ranking signal for "football prediction site" / "free betting tips".
 */
export function Writeup() {
  return (
    <section id="writeup" className="mx-auto w-full max-w-5xl px-4 py-14">
      <h2 className={`mb-3 text-2xl font-semibold lg:text-3xl ${gradient}`}>
        Your Go-To Football Prediction Site
      </h2>
      <p className="mb-6 text-muted">
        Tips180 is one of the most accurate football prediction websites in the
        world, with an average accuracy rate of over 85%.
      </p>

      <h3 className={`mb-2 text-lg font-semibold lg:text-xl ${gradient}`}>
        Win Smart, Bet Smarter with Tips180
      </h3>
      <p className="mb-6 text-sm text-muted lg:text-base">
        Football betting can feel like a game of chance, but with Tips180 you have
        a reliable partner on your side. We understand the risks, but we also know
        how to cut them down — bringing you expert-backed predictions designed to
        keep your losses low. This isn&apos;t about chasing risky bets or false
        promises; it&apos;s about betting smarter, not harder. Whether you&apos;re a
        seasoned bettor or just starting out, we combine research, in-depth
        analysis and a dedication to accuracy to help you succeed.
      </p>

      <h3 className={`mb-2 text-lg font-semibold lg:text-xl ${gradient}`}>
        Why Bet With Us?
      </h3>
      <p className="mb-6 text-sm text-muted lg:text-base">
        With Tips180 you get a systematic approach that prioritises your success.
        We stay on top of the latest developments — from team form to player
        injuries — so our predictions are always based on up-to-date information.
        Our expert team dives deep into match statistics and trends to deliver
        tips with accuracy. We offer more than predictions: we offer insights that
        guide you toward smarter, safer betting.
      </p>

      <h3 className={`mb-3 text-lg font-semibold lg:text-xl ${gradient}`}>
        What We Offer at Tips180
      </h3>
      <h4 className={`text-base font-semibold ${gradient}`}>Over 85% Prediction Accuracy</h4>
      <p className="mb-4 text-sm text-muted lg:text-base">
        Consistency is key, and at Tips180 we deliver soccer predictions with an
        average accuracy rate of over 85%, constantly refining our methods to raise
        the bar even higher.
      </p>
      <h4 className={`text-base font-semibold ${gradient}`}>Free Betting Tips</h4>
      <p className="mb-4 text-sm text-muted lg:text-base">
        We provide free betting tips and free soccer predictions to new and
        experienced bettors alike — everything from Over 1.5 goals to Double Chance
        and high-odds risk tips — with paid plans available for more exclusive,
        in-depth insights.
      </p>
      <h4 className={`text-base font-semibold ${gradient}`}>Betting Guidance for Smarter Betting</h4>
      <ul className="mb-4 list-disc space-y-2 pl-6 text-sm text-muted lg:text-base">
        <li><strong>Smart Bet Plan:</strong> a pathway to smarter betting for long-term gains.</li>
        <li><strong>Performance Tracking:</strong> follow our predictions and see the results for full transparency.</li>
        <li><strong>Tips Ahead of Tomorrow:</strong> early predictions for the next day&apos;s matches.</li>
        <li><strong>Selection Store:</strong> carefully selected predictions by market and weekend.</li>
        <li><strong>Learn From Us:</strong> resources to help you become a smarter bettor.</li>
      </ul>

      <Link href="/auth/signup" className={`text-lg font-semibold underline ${gradient}`}>
        Sign Up Now with Tips180 and Start Winning
      </Link>
    </section>
  );
}
