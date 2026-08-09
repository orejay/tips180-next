import type { GuideFaq, GuideSection } from "@/config/guides/types";

export const howToBetSlug = "how-to-bet";

export const howToBetSections: GuideSection[] = [
  {
    id: "intro",
    title: "Why this guide matters",
    blocks: [
      {
        type: "p",
        text: "Football betting is huge in Nigeria, from local NPFL matches to the English Premier League and the UEFA Champions League. Millions tune in and many place bets every week.",
      },
      {
        type: "p-link",
        before: "If you're new and wondering",
        linkText: "how to place a football bet in Nigeria",
        href: "#steps",
        after:
          "this step-by-step guide breaks the whole process down: choosing a site, creating an account, depositing funds, understanding odds, placing bets, and withdrawing winnings. We'll also cover common bet types, smart beginner tips, responsible gambling, and an FAQ section so you can start confidently and safely.",
      },
      {
        type: "p",
        text: "If you're new to sports betting, the process can feel overwhelming: different apps, unfamiliar terms (accumulator? cash out?), and various payment methods. This guide gives you clear, actionable steps plus practical examples so you understand not just how to place a bet, but why each step matters. It's written for Nigerians (18+) who want to bet online or via mobile apps responsibly.",
      },
    ],
  },
  {
    id: "legal",
    title: "Is football betting legal in Nigeria?",
    blocks: [
      {
        type: "p",
        text: "Short answer: yes — when you use licensed operators. Nigeria allows commercial sports betting, regulated by federal and state authorities. The National Lottery Regulatory Commission (NLRC) oversees licensing at the federal level, while some states have their own gaming boards and taxes.",
      },
      { type: "h3", text: "The important takeaway" },
      {
        type: "ul",
        items: [
          "Only use betting platforms that are licensed and regulated for Nigeria.",
          "Never share your account credentials with strangers.",
          "You must be 18 years or older to bet.",
        ],
      },
      {
        type: "p",
        text: "This guide assumes you'll use a licensed operator. If you're unsure whether a platform is licensed, check the operator's website for license details or ask customer support before depositing money.",
      },
    ],
  },
  {
    id: "steps",
    title: "Step-by-step: how to place a football bet in Nigeria",
    blocks: [
      {
        type: "p-link",
        before:
          "Below is a practical, step-by-step walkthrough from picking a betting site to withdrawing your winnings. You can check",
        linkText: "our review on betting sites in Nigeria here",
        href: "/best-betting-sites/nigeria",
        after: ".",
      },
      { type: "h3", text: "Step 1 — Choose a reputable betting site or mobile app" },
      {
        type: "p",
        text: "Picking the right platform is the most important decision. A good betting site should be licensed for Nigeria, secure (HTTPS, strong privacy policy), user-friendly on web and mobile, support multiple local payment methods (bank transfer, USSD, cards, mobile wallets), provide clear odds and live betting across local and international leagues, and offer solid customer support.",
      },
      {
        type: "ul",
        items: [
          "Welcome bonuses and promotions (but read the terms).",
          "Payout speed (time to withdraw).",
          "Odds competitiveness (higher odds = better returns).",
          "App performance (if you prefer betting on mobile).",
        ],
      },
      {
        type: "p",
        text: "Note: popular Nigerian operators often include local brands and international companies operating in-country. Focus on safety and transparency over flashy promotions.",
      },
      { type: "h3", text: "Step 2 — Create an account (registration)" },
      {
        type: "ol",
        items: [
          "Click Sign Up or Register on the website or app.",
          "Provide basic details: full name, email, phone number, date of birth (to confirm age).",
          "Create a secure password (use a password manager).",
          "Some sites require identity verification (upload a government ID, selfie, or proof of address) to enable withdrawals — this is normal and protects you.",
        ],
      },
      {
        type: "ul",
        items: [
          "Use your real name and matching bank account details to avoid verification issues later.",
          "Enable two-factor authentication (2FA) if the site offers it.",
        ],
      },
      { type: "h3", text: "Step 3 — Deposit funds (funding your betting wallet)" },
      {
        type: "p",
        text: "Common deposit options in Nigeria include bank transfer (online banking), USSD (instant debit from your bank account), debit/credit card (where accepted), mobile wallets (Opay, PalmPay, etc.), third-party agents or local payment vendors, and crypto (available on some platforms — check legality and exchange fees).",
      },
      {
        type: "ul",
        items: [
          "Check the minimum deposit and any deposit fees.",
          "Confirm whether bonuses require specific deposit methods.",
          "Keep your bank or transfer reference number until the deposit reflects.",
        ],
      },
      {
        type: "example",
        label: "Example of a deposit flow",
        items: [
          "Log in to your account → click Deposit.",
          "Choose a payment method (e.g. USSD).",
          "Enter an amount (e.g. ₦1,000) and follow the on-screen instructions.",
          "Confirm the transaction on your bank app or via USSD.",
          "Money typically reflects instantly or within minutes.",
        ],
      },
      { type: "h3", text: "Step 4 — Understand betting odds and payouts" },
      {
        type: "p",
        text: "Odds show how much you can win relative to your stake. In Nigeria, decimal odds are very common: they represent total return for each unit staked (stake + profit). Example: odds of 2.50 — if you stake ₦1,000, total return = 1,000 × 2.50 = ₦2,500, profit = 2,500 − 1,000 = ₦1,500. Always calculate both total return and profit before confirming a bet.",
      },
      {
        type: "p",
        text: "Convert decimal odds to implied probability: probability (%) = (1 / decimal odds) × 100. Example: odds 2.00 → implied probability = (1 / 2.00) × 100 = 50%.",
      },
      { type: "h3", text: "Common bet types" },
      {
        type: "ul",
        items: [
          "Single (1X2) — bet on a single match outcome (home win, draw, away win).",
          "Accumulator (parlay) — combine multiple selections; all must win to pay out. Odds multiply, so potential returns grow quickly, but risk is higher.",
          "Each-way — typically for player or match markets (less common in football).",
          "Over/Under — bet on total goals scored (e.g. Over 2.5 goals).",
          "Both Teams to Score (BTTS) — bet YES or NO on whether both teams will score.",
          "Handicap (Asian/European) — give one team a goal advantage to balance odds.",
          "Live/in-play bets — place bets after a match starts on events like next goal, next corner, etc.",
          "Cash Out — the operator allows you to settle a bet early for a partial return.",
        ],
      },
      { type: "h3", text: "Step 5 — Selecting a football match and market" },
      {
        type: "ol",
        items: [
          "Open the Football category.",
          "Choose a league (e.g. English Premier League, La Liga, NPFL).",
          "Browse available markets for a match (match outcome, total goals, goal scorers, corners).",
          "Click a selection to add it to the bet slip.",
        ],
      },
      {
        type: "ul",
        items: [
          "Check form (last 5 matches), injuries, and head-to-head records.",
          "Consider home/away performance — some teams are much stronger at home.",
          "Look for market value — a bet where implied probability seems worse than your estimate.",
        ],
      },
      { type: "h3", text: "Step 6 — Place your bet (use the bet slip)" },
      {
        type: "ol",
        items: [
          "Open the bet slip (usually on the right or bottom of the app).",
          "Confirm all selections. For accumulators, check the combined odds.",
          "Enter your stake (the amount you want to bet).",
          "The slip shows potential return — double-check before confirming.",
          "Click Place Bet or Confirm.",
          "Save your bet ID or take a screenshot — you might need it for any dispute.",
        ],
      },
      {
        type: "example",
        label: "Example",
        items: [
          "Single bet on Team A at odds 1.80 with a ₦2,000 stake: return = 2,000 × 1.80 = ₦3,600, profit = ₦1,600.",
          "Accumulator — Match 1 odds 1.80, Match 2 odds 2.00, combined odds = 1.80 × 2.00 = 3.60.",
          "Stake ₦1,000 → return = ₦1,000 × 3.60 = ₦3,600.",
        ],
      },
      { type: "h3", text: "Step 7 — Monitor results and withdraw winnings" },
      {
        type: "p",
        text: "If your bet wins, the winnings are credited to your betting balance. To withdraw: go to the Withdraw or Cashout section, choose a withdrawal method (bank account is common), enter the amount and confirm. Withdrawals may require completed identity verification (KYC), and timelines vary from instant to a few business days. Always check withdrawal limits and any fees, and keep records of transaction references until funds hit your bank.",
      },
    ],
  },
  {
    id: "strategy-tips",
    title: "Betting strategy & smart tips for beginners",
    blocks: [
      {
        type: "ol",
        items: [
          "Start small — begin with small stakes while you learn how odds work and how markets behave.",
          "Set a betting budget — only risk what you can afford to lose. Pick a weekly or monthly limit and stick to it.",
          "Learn to manage bankroll — many bettors use a fixed percentage of bankroll per bet (e.g. 1–3%).",
          "Do basic research — check team form, injuries, suspensions, weather, and head-to-head stats.",
          "Compare odds across sites to get the best value.",
          "Avoid emotional betting — don't bet on your favourite team unless the odds offer genuine value.",
          "Keep records — track bets, stakes, returns, and notes on why you placed each bet. This helps you learn what works.",
          "Use cash out cautiously — it can lock in profit or reduce loss, but often offers less than the potential full return.",
          "Be cautious with accumulators — large payouts are tempting, but the probability of winning falls with each added selection.",
          "Beware of bonuses with heavy wagering requirements — these can look attractive but may be hard to clear.",
        ],
      },
    ],
  },
  {
    id: "glossary",
    title: "Common football betting terms (glossary)",
    blocks: [
      {
        type: "ul",
        items: [
          "Stake — the amount you bet.",
          "Odds — the price offered by the bookmaker (decimal, fractional, or American).",
          "Return — total money you receive if the bet wins (stake × odds).",
          "Profit — return minus stake.",
          "Accumulator (Parlay) — a combined bet with multiple selections.",
          "Handicap — giving one team a virtual advantage/disadvantage.",
          "BTTS — both teams to score.",
          "Over/Under — betting total goals relative to a threshold (2.5, 3.5, etc.).",
          "Draw No Bet — stake returned if the match ends in a draw.",
          "Cash Out — option to settle a bet before the event finishes.",
          "KYC (Know Your Customer) — the identity verification process required by operators.",
          "Bet Slip — the interface showing selected markets and potential returns.",
        ],
      },
      { type: "h3", text: "Best football betting site features to look for" },
      {
        type: "ul",
        items: [
          "Valid Nigerian license and visible company information.",
          "Fast payouts and a clear withdrawal policy.",
          "Multiple payment options popular in Nigeria.",
          "Responsive mobile app or mobile site.",
          "Competitive odds across popular leagues.",
          "Live in-play betting markets.",
          "Customer support (chat/phone/email).",
          "Transparent terms and conditions for promos.",
        ],
      },
    ],
  },
  {
    id: "responsible-gambling",
    title: "Responsible gambling — keep it safe",
    blocks: [
      {
        type: "p",
        text: "Gambling should be viewed as entertainment, not a means to solve financial problems.",
      },
      {
        type: "ul",
        items: [
          "Only bet if you are 18 or older.",
          "Set deposit and loss limits on your account.",
          "Take regular breaks — don't chase losses.",
          "Avoid betting when impaired (alcohol, stress).",
          "If you feel betting is becoming a problem, seek help from support groups or local helplines. Many licensed operators also provide self-exclusion tools and deposit limits.",
          "If you're unsure where to get help, consider reaching out to local counselling services, financial advisors, or national addiction helplines.",
        ],
      },
    ],
  },
  {
    id: "example-walkthrough",
    title: "Example walkthrough (practical scenario)",
    blocks: [
      {
        type: "p",
        text: "Scenario: you want to place a single bet on an English Premier League match — Manchester United to win, decimal odds 2.20, stake ₦2,000.",
      },
      {
        type: "example",
        label: "Calculation",
        items: [
          "Total return = stake × odds = 2,000 × 2.20 = ₦4,400.",
          "Profit = return − stake = 4,400 − 2,000 = ₦2,400.",
        ],
      },
      {
        type: "example",
        label: "If you instead add a second match (accumulator)",
        items: [
          "Match 1 odds: 2.20. Match 2 odds: 1.70.",
          "Combined odds = 2.20 × 1.70 = 3.74.",
          "Stake ₦1,000 → return = 1,000 × 3.74 = ₦3,740. Profit = ₦2,740.",
        ],
      },
      {
        type: "p",
        text: "This shows how accumulator odds multiply and can create higher returns, but remember: all selections must win to cash out.",
      },
    ],
  },
  {
    id: "markets",
    title: "Popular betting markets you should understand",
    blocks: [
      {
        type: "ul",
        items: [
          "Match Result (1X2) — home win, draw, away win.",
          "Double Chance — covers two of three match outcomes (e.g. home win or draw).",
          "Both Teams To Score (BTTS) — YES or NO.",
          "Correct Score — predict the exact scoreline (harder, higher payout).",
          "Total Goals (Over/Under) — e.g. Over 2.5 goals means at least 3 goals must be scored.",
          "First Goalscorer / Anytime Goalscorer — predict which player scores.",
          "Handicap Markets — level the playing field between mismatched teams.",
          "Bookings/Red Cards/Corners — speciality markets for in-play and pre-match.",
        ],
      },
    ],
  },
  {
    id: "common-mistakes",
    title: "Common mistakes beginners make (and how to avoid them)",
    blocks: [
      {
        type: "ol",
        items: [
          "Betting too large, too quickly — start with small percentages of your bankroll.",
          "Not shopping for the best odds — small differences in odds can compound over time.",
          "Chasing losses — don't increase stakes to recover losses; use fixed staking.",
          "Ignoring basic research — team news, weather, and motivation matter.",
          "Overusing accumulators — use single bets or small multiples until you understand variance.",
          "Falling for misleading promotions — always read wagering requirements and T&Cs.",
        ],
      },
    ],
  },
  {
    id: "conclusion",
    title: "Conclusion — start safe, start smart",
    blocks: [
      {
        type: "p",
        text: "Placing a football bet in Nigeria is easy once you understand the steps: choose a licensed platform, register, deposit, understand odds, place your bet, and withdraw responsibly. The real edge is in discipline: good bankroll management, basic match research, and avoiding emotional decisions.",
      },
      {
        type: "ul",
        items: [
          "Open accounts on one or two trusted operators.",
          "Start with small stakes and track your bets.",
          "Use in-site tools (limits, self-exclusion) if you ever feel betting is getting out of control.",
          "Keep learning — betting is about long-term value, not quick wins.",
        ],
      },
    ],
  },
];

export const howToBetFaqs: GuideFaq[] = [
  {
    question: "Is online football betting legal in Nigeria?",
    answer:
      "Yes, when conducted with licensed operators. Confirm platform licensing before depositing.",
  },
  {
    question: "What is the minimum age for betting in Nigeria?",
    answer: "You must be 18 years or older.",
  },
  {
    question: "How much can I win from a ₦1,000 bet at 2.50 odds?",
    answer: "Total return = 1,000 × 2.50 = ₦2,500. Profit = ₦1,500.",
  },
  {
    question: "What's the difference between decimal and fractional odds?",
    answer:
      "Decimal odds show total return per unit staked (easier to calculate). Fractional odds show profit relative to stake (e.g. 3/1 means win 3 units for each 1 staked).",
  },
  {
    question: "How long do withdrawals take?",
    answer:
      "It varies — some operators process withdrawals instantly; others may take 24–72 hours or longer, depending on verification and bank processing times.",
  },
  {
    question: "Can I use my bank account to deposit and withdraw?",
    answer:
      "Yes — bank transfers and USSD are commonly accepted. Ensure your bank details match the name on your betting account.",
  },
  {
    question: "Are betting bonuses worth it?",
    answer:
      "Bonuses can be valuable, but read the wagering requirements carefully. Some bonuses have tough playthrough conditions or restricted markets.",
  },
];
