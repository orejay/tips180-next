/**
 * Punter's Guide content, ported from the legacy PuntersData (whose content
 * mixed plain strings with inline JSX — flattened here to paragraphs + bullets).
 */
export type GuideBlock = { type: "p"; text: string } | { type: "ul"; items: string[] };
export type GuideSection = { title: string; blocks: GuideBlock[] };

export const punterGuide: GuideSection[] = [
  {
    title: "What are your odds target for the day?",
    blocks: [
      {
        type: "p",
        text: "What is an Odd Target? Most successful punters worldwide that cash out steadily have a formula which goes — DON'T GAMBLE, INVEST! An Odd Target simply means betting budget. For example, I have $10 today, and I want to make $100 out of it. This simply implies I'm looking for 10 odds. This is where we — Tips180 — come in to ensure you have the best of odds provided daily.",
      },
    ],
  },
  {
    title: "How do you select the best odds?",
    blocks: [
      {
        type: "p",
        text: "Use the expert's confidence level to set your staking plans. For example, Bordeaux vs Marseille (X) @ 3.10 odds, Expert Confidence: 65%. If I were looking for 3 odds, I'd rather avoid that fixture due to the high risk in the prediction market and accumulate other matches with 85% confidence level till I get my 3 odds.",
      },
      {
        type: "p",
        text: "For accumulators, you are advised not to accumulate all into one ticket; if you are doing so, then don't stake too high. See Accumulators in Tips Store.",
      },
      {
        type: "p",
        text: "For the Sure 2/3 Odds category: when you get 2 sets of Sure 2/3 Odds, you are advised to split your budget across the given sets of games.",
      },
      {
        type: "p",
        text: "For example, Set 1: Real Madrid vs Getafe (Home Win). There are days when unforeseen upsets occur in football. Let's say it was one of those days where Getafe goes ahead to beat Madrid — instead of feeling bad about how much stake you lost, you have a backup, Set 2, to make up for it. It is very rare for both sets to get foiled. In summary, if you have $100 to stake for the Sure 2/3 odds, we advise you split your budget 60:40 across both sets.",
      },
    ],
  },
  {
    title: "How much should you bet?",
    blocks: [
      {
        type: "p",
        text: "There are many different systems for determining the size of your bets and each system has a different risk/return profile. Some of the key characteristics to look at are:",
      },
      {
        type: "ul",
        items: [
          "The risk of going bust;",
          "The risk of losing money;",
          "The volatility of returns and the size of your betting ticket; and",
          "The magnitude of winnings when you get things right.",
        ],
      },
      {
        type: "p",
        text: "Each of these characteristics is in turn impacted by the level of edge that you have, the size of the bookies' over-round and various other factors. There is no approach to position sizing that will cause a bad forecasting system to make money — as a starting point, you have to have an edge over the bookies if you want to win consistently. Unfortunately, a bad approach to position sizing can cause a good forecasting system to lose money. That is, even where you have an edge over the bookie, you can lose money if you choose your stake sizes poorly.",
      },
    ],
  },
  {
    title: "What system should you use?",
    blocks: [
      {
        type: "p",
        text: "So which is the best system? Or is there some other system that does a better job? Is it possible to extract the best parts of each system and combine them? Some characteristics you may want to have in a position sizing system are:",
      },
      {
        type: "ul",
        items: [
          "Place more money on bets that are more certain/lower risk. This reduces the volatility of returns.",
          "The system should be fairly tolerant of forecast errors.",
          "Bet size shouldn't depend on arbitrary factors such as what happened with your last bet — play each bet on its merits.",
          "Maximize returns, subject to managing risk.",
          "You don't want the volatility of your betting book to be too great.",
        ],
      },
    ],
  },
  {
    title: "Time value of money",
    blocks: [
      {
        type: "p",
        text: "This section is really only relevant if you bet on longer-term markets such as season outcomes. Some bets are nearly certain and have correspondingly low odds. For example, Chelsea may be clearly top of the league table halfway through the season and looking strong. You could bet on them finishing in the Top 6 but you are only getting odds of 1.01 at best and it is four months until the bet settles. Even with such small odds, this could be a well-priced bet if you believe the outcome is virtually certain.",
      },
      {
        type: "p",
        text: "Some position sizing systems will recommend a large bet if you have a very high forecast probability. The catch is that a 1% return in four months is a poor return on your money and you could probably do better by pulling the money out of your bookmaker's account and sticking it in the bank. Money has a time value — a rate of return that you can earn with no risk.",
      },
    ],
  },
  {
    title: "Risk tolerance",
    blocks: [
      {
        type: "p",
        text: "It is important to understand the theory of risk management, but it is also critical that you understand your own tolerance for risk. Psychology is very important in betting (and investing) and if you feel uncomfortable with the volatility in your betting returns it will impact your ability to maintain the discipline necessary for a successful betting system. Maintaining a disciplined approach to position sizing when you have lost your nerve — or alternatively when you are feeling invincible — is very challenging. All punters have great runs where they feel unbeatable and believe they may have discovered the secret to free money; and all punters also have periods where nothing goes right and they feel like giving up. Never underestimate the impact of luck on your short-term returns. Ensuring you operate within your risk tolerance will help you stay focused. So how much are you prepared to lose? How do you feel when you lose half of your book? These considerations feed into the determination of your standard bet size, which in turn determines how fast you could lose your money. You need to adapt your system so that you are comfortable with the volatility.",
      },
    ],
  },
];
