import Link from "next/link";
import { Key, Crown, Brain, RefreshCw, Zap, Trophy, type LucideIcon } from "lucide-react";
import type { DashboardUser } from "@/lib/api-auth";
import { isActive } from "@/lib/api-auth";
import { cn } from "@/lib/utils";

type PlanCardData = {
  name: string;
  icon: LucideIcon;
  accent: string;
  active: boolean;
  expiry?: string;
  href: string;
};

/**
 * All of the user's subscriptions at a glance (legacy `Profile.js` listed these
 * as separate rows — accoutplan and the four add-on plans track expiry
 * independently on the backend, so a user can hold several at once).
 */
export function AccountPlans({ user }: { user: DashboardUser }) {
  const mainActive = user.accoutplan !== "Free" && isActive(user.rsubscriptstatus);
  const smartActive = isActive(user.isubscriptstatus);
  const rollActive = isActive(user.rollsubscriptstatus);
  const odds50Active = isActive(user.odds50status);
  const w10Active = isActive(user.w10subscriptstatus);

  const cards: PlanCardData[] = [
    {
      name: user.accoutplan === "Premium" ? "Premium Plan" : "Key Plan",
      icon: user.accoutplan === "Premium" ? Crown : Key,
      accent: "from-teal-500 to-blue-600",
      active: mainActive,
      expiry: mainActive ? user.acc_plan_exp : undefined,
      href: mainActive ? "/dashboard/store" : "/dashboard/payment",
    },
    {
      name: "Smart Bet",
      icon: Brain,
      accent: "from-orange-500 to-rose-500",
      active: smartActive,
      expiry: smartActive ? user.smart_exp : undefined,
      href: smartActive ? "/dashboard/smartbet" : "/dashboard/payment",
    },
    {
      name: "Rollover Bet",
      icon: RefreshCw,
      accent: "from-sky-500 to-indigo-600",
      active: rollActive,
      expiry: rollActive ? user.roll_exp : undefined,
      href: rollActive ? "/dashboard/rollover" : "/dashboard/payment",
    },
    {
      name: "50 Odds",
      icon: Zap,
      accent: "from-pink-500 to-fuchsia-600",
      active: odds50Active,
      expiry: odds50Active ? user.odds50_exp : undefined,
      href: odds50Active ? "/dashboard/50odds" : "/dashboard/payment",
    },
    {
      name: "Weekend 10",
      icon: Trophy,
      accent: "from-amber-500 to-yellow-400",
      active: w10Active,
      expiry: w10Active ? user.w10_exp : undefined,
      href: w10Active ? "/dashboard/weekend10" : "/dashboard/payment",
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="mb-4 text-lg font-bold text-foreground">Your Plans</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <PlanStatusCard key={card.name} card={card} />
        ))}
      </div>
    </div>
  );
}

function PlanStatusCard({ card }: { card: PlanCardData }) {
  const Icon = card.icon;
  return (
    <div
      className={cn(
        "flex flex-col justify-between rounded-xl p-4 transition-shadow hover:shadow-md",
        card.active
          ? `bg-linear-to-br text-white ${card.accent}`
          : "border border-border bg-surface-muted",
      )}
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            card.active ? "bg-white/20" : "bg-surface text-muted",
          )}
        >
          <Icon size={17} />
        </div>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
            card.active ? "bg-white/20" : "bg-stone-200 text-muted dark:bg-white/10",
          )}
        >
          {card.active ? "Active" : "Inactive"}
        </span>
      </div>
      <div className="mt-4">
        <p className={cn("font-semibold", card.active ? "text-white" : "text-foreground")}>
          {card.name}
        </p>
        <p className={cn("mt-0.5 text-xs", card.active ? "text-white/80" : "text-subtle")}>
          {card.expiry ? `Expires ${card.expiry}` : "Not subscribed"}
        </p>
      </div>
      <Link
        href={card.href}
        className={cn(
          "mt-4 inline-flex items-center justify-center rounded-lg py-2 text-xs font-semibold transition-colors",
          card.active
            ? "bg-white/15 text-white hover:bg-white/25"
            : "bg-primary text-white hover:opacity-90",
        )}
      >
        {card.active ? "View Tips" : "Subscribe"}
      </Link>
    </div>
  );
}
