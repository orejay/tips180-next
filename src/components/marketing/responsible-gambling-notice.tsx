/**
 * Static legal disclaimer shown at the bottom of every "Best Betting Sites"
 * page — always rendered regardless of what the CMS returns, not admin content.
 */
export function ResponsibleGamblingNotice() {
  return (
    <div className="mt-14 rounded-lg border border-border bg-surface-muted p-6 text-xs leading-relaxed text-muted">
      <p className="font-semibold text-foreground">Responsible Gambling</p>
      <p className="mt-2">
        Gambling should not be used as a means of earning money, but rather as a
        kind of amusement. Wager sensibly at all times and refrain from chasing
        losses. Only betting sites with a valid local licence are reviewed on
        Tips180. This service is only available to people who are at least 18
        years old (or the legal betting age in your country, if higher).
      </p>
      <p className="mt-2">
        This page contains affiliate links — we may earn a commission at no
        cost to you. 18+ | Gamble responsibly.
      </p>
    </div>
  );
}
