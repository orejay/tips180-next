/**
 * Geo-located subscription pricing, extracted verbatim from the legacy per-country
 * data files (dollarData/ghanaData/kenyaData/UgandaData/camBenData/sierraLData/
 * southAData). The Nigeria (NGN) table is the canonical `plans` in ./plans; the
 * rest live here. `countryPricing` maps a country to its table + currency, and
 * `pricingOptions` drives the our-plans / payment country selector.
 */
import { plans, type Plan } from "@/config/plans";

const usd: Plan[] = [
  {
    "name": "Key",
    "slug": "key",
    "prices": [
      {
        "label": "$5.00",
        "value": 5
      },
      {
        "label": "$10.00",
        "value": 10
      },
      {
        "label": "$25.00",
        "value": 25
      },
      {
        "label": "$55.00",
        "value": 55
      }
    ],
    "durations": [
      "1 week",
      "1 month",
      "3 months",
      "6 months"
    ],
    "features": [
      "Access to one set of Experts ACCA",
      "Access to 8 Tips Stores",
      "70% Accuracy Rate"
    ]
  },
  {
    "name": "Premium",
    "slug": "premium",
    "prices": [
      {
        "label": "$12.00",
        "value": 12
      },
      {
        "label": "$20.00",
        "value": 20
      },
      {
        "label": "$55.00",
        "value": 55
      },
      {
        "label": "$100.00",
        "value": 100
      },
      {
        "label": "$200.00",
        "value": 200
      }
    ],
    "durations": [
      "1 week",
      "1 month",
      "3 months",
      "6 months",
      "12 months"
    ],
    "features": [
      "Access to over 40 Leagues Tips",
      "Access to 2 sets of Experts ACCA",
      "Access to 20 Tips Stores",
      "Access to Risk Management Theory",
      "75% Accuracy Rate"
    ]
  },
  {
    "name": "Smart Bet/Smart Bet Plus",
    "slug": "smartbet",
    "prices": [
      {
        "label": "$11.00",
        "value": 11
      },
      {
        "label": "$18.00",
        "value": 18
      },
      {
        "label": "$25.00",
        "value": 25
      }
    ],
    "durations": [
      "5 days",
      "10 days",
      "15 days"
    ],
    "features": [
      "Access to Smart Betting Strategy",
      "Access to 1.6 - 2.05 odds Daily",
      "Access to Best Ten Tips for the Weekend",
      "A Steady Winning rate",
      "78% Accuracy Rate"
    ]
  },
  {
    "name": "Rollover",
    "slug": "rollover",
    "prices": [
      {
        "label": "$13.00",
        "value": 13
      }
    ],
    "durations": [
      "10 days"
    ],
    "features": [
      "Rollover Betting Strategy",
      "Access to 1.3 odds Daily",
      "85% Accuracy Rate"
    ]
  },
  {
    "name": "50 0dds",
    "slug": "odds50",
    "prices": [
      {
        "label": "$10.00",
        "value": 10
      },
      {
        "label": "$22.00",
        "value": 22
      }
    ],
    "durations": [
      "1 week",
      "1 month"
    ],
    "features": [
      "Access to Winning Tactics",
      "Access to 50 odds twice a Week",
      "Access to 2 different sets of 50 odds on weekends",
      "Access to over 2500 odds of accumulated tips on weekends",
      "75% Accuracy Rate"
    ]
  },
  {
    "name": "Weekend 10 odds",
    "slug": "weekend10",
    "prices": [
      {
        "label": "$14",
        "value": 14
      }
    ],
    "durations": [
      "1 month"
    ],
    "features": [
      "Access to Best Accumulated Tips",
      "Access to 10 odds twice a week",
      "Access to 2 different set of 10 odds on weekends",
      "Access to over 100 odds on weekends",
      "78% Accuracy Rate"
    ]
  }
];

const ghs: Plan[] = [
  {
    "name": "Key",
    "slug": "key",
    "prices": [
      {
        "label": "GHC35.00",
        "value": 35
      },
      {
        "label": "GHC70.00",
        "value": 70
      },
      {
        "label": "GHC140.00",
        "value": 140
      },
      {
        "label": "GHC250.00",
        "value": 250
      },
      {
        "label": "GHC450.00",
        "value": 450
      }
    ],
    "durations": [
      "1 week",
      "1 month",
      "3 months",
      "6 months",
      "12 months"
    ],
    "features": [
      "Access to one set of Experts ACCA",
      "Access to 8 Tips Stores",
      "70% Accuracy Rate"
    ]
  },
  {
    "name": "Premium",
    "slug": "premium",
    "prices": [
      {
        "label": "GHC80.00",
        "value": 80
      },
      {
        "label": "GHC150.00",
        "value": 150
      },
      {
        "label": "GHC300.00",
        "value": 300
      },
      {
        "label": "GHC500.00",
        "value": 500
      },
      {
        "label": "GHC900.00",
        "value": 900
      }
    ],
    "durations": [
      "1 week",
      "1 month",
      "3 months",
      "6 months",
      "12 months"
    ],
    "features": [
      "Access to over 40 Leagues Tips",
      "Access to 2 sets of Experts ACCA",
      "Access to 20 Tips Stores",
      "Access to Risk Management Theory",
      "75% Accuracy Rate"
    ]
  },
  {
    "name": "Smart Bet/Smart Bet Plus",
    "slug": "smartbet",
    "prices": [
      {
        "label": "GHC115.00",
        "value": 115
      },
      {
        "label": "GHC180.00",
        "value": 180
      },
      {
        "label": "GHC270.00",
        "value": 270
      }
    ],
    "durations": [
      "5 days",
      "10 days",
      "15 days"
    ],
    "features": [
      "Access to Smart Betting Strategy",
      "Access to 1.6 - 2.05 odds Daily",
      "Access to Best Ten Tips for the Weekend",
      "A Steady Winning rate",
      "78% Accuracy Rate"
    ]
  },
  {
    "name": "Rollover",
    "slug": "rollover",
    "prices": [
      {
        "label": "GHC100.00",
        "value": 100
      }
    ],
    "durations": [
      "10 days"
    ],
    "features": [
      "Rollover Betting Strategy",
      "Access to 1.3 odds Daily",
      "85% Accuracy Rate"
    ]
  },
  {
    "name": "50 0dds",
    "slug": "odds50",
    "prices": [
      {
        "label": "GHC105.00",
        "value": 105
      },
      {
        "label": "GHC240.00",
        "value": 240
      }
    ],
    "durations": [
      "1 week",
      "1 month"
    ],
    "features": [
      "Access to Winning Tactics",
      "Access to 50 odds twice a Week",
      "Access to 2 different sets of 50 odds on weekends",
      "Access to over 2500 odds of accumulated tips on weekends",
      "75% Accuracy Rate"
    ]
  },
  {
    "name": "Weekend 10 odds",
    "slug": "weekend10",
    "prices": [
      {
        "label": "GHC200.00",
        "value": 200
      }
    ],
    "durations": [
      "1 month"
    ],
    "features": [
      "Access to Best Accumulated Tips",
      "Access to 10 odds twice a week",
      "Access to 2 different set of 10 odds on weekends",
      "Access to over 100 odds on weekends",
      "78% Accuracy Rate"
    ]
  }
];

const kes: Plan[] = [
  {
    "name": "Key",
    "slug": "key",
    "prices": [
      {
        "label": "KSH700.00",
        "value": 700
      },
      {
        "label": "KSH1,600.00",
        "value": 1600
      },
      {
        "label": "KSH3,500.00",
        "value": 2500
      },
      {
        "label": "KSH5,500.00",
        "value": 5500
      },
      {
        "label": "KSH10,000.00",
        "value": 10000
      }
    ],
    "durations": [
      "1 week",
      "1 month",
      "3 months",
      "6 months",
      "12 months"
    ],
    "features": [
      "Access to one set of Experts ACCA",
      "Access to 8 Tips Stores",
      "70% Accuracy Rate"
    ]
  },
  {
    "name": "Premium",
    "slug": "premium",
    "prices": [
      {
        "label": "KSH1,800.00",
        "value": 1800
      },
      {
        "label": "KSH3,000.00",
        "value": 3000
      },
      {
        "label": "KSH6,000.00",
        "value": 6000
      },
      {
        "label": "KSH12,000.00",
        "value": 12000
      },
      {
        "label": "KSH20,000.00",
        "value": 20000
      }
    ],
    "durations": [
      "1 week",
      "1 month",
      "3 months",
      "6 months",
      "12 months"
    ],
    "features": [
      "Access to over 40 Leagues Tips",
      "Access to 2 sets of Experts ACCA",
      "Access to 20 Tips Stores",
      "Access to Risk Management Theory",
      "75% Accuracy Rate"
    ]
  },
  {
    "name": "Smart Bet/Smart Bet Plus",
    "slug": "smartbet",
    "prices": [
      {
        "label": "KSH2,500.00",
        "value": 2500
      },
      {
        "label": "KSH4,500.00",
        "value": 4500
      },
      {
        "label": "KSH6,000.00",
        "value": 6000
      }
    ],
    "durations": [
      "5 days",
      "10 days",
      "15 days"
    ],
    "features": [
      "Access to Smart Betting Strategy",
      "Access to 1.6 - 2.05 odds Daily",
      "Access to Best Ten Tips for the Weekend",
      "A Steady Winning rate",
      "78% Accuracy Rate"
    ]
  },
  {
    "name": "Rollover",
    "slug": "rollover",
    "prices": [
      {
        "label": "KSH2,400.00",
        "value": 2400
      }
    ],
    "durations": [
      "10 days"
    ],
    "features": [
      "Rollover Betting Strategy",
      "Access to 1.3 odds Daily",
      "85% Accuracy Rate"
    ]
  },
  {
    "name": "50 0dds",
    "slug": "odds50",
    "prices": [
      {
        "label": "KSH1,500.00",
        "value": 1500
      },
      {
        "label": "KSH3,200.00",
        "value": 3200
      }
    ],
    "durations": [
      "1 week",
      "1 month"
    ],
    "features": [
      "Access to Winning Tactics",
      "Access to 50 odds twice a Week",
      "Access to 2 different sets of 50 odds on weekends",
      "Access to over 2500 odds of accumulated tips on weekends",
      "75% Accuracy Rate"
    ]
  },
  {
    "name": "Weekend 10 odds",
    "slug": "weekend10",
    "prices": [
      {
        "label": "KSH1,600.00",
        "value": 1600
      }
    ],
    "durations": [
      "1 month"
    ],
    "features": [
      "Access to Best Accumulated Tips",
      "Access to 10 odds twice a week",
      "Access to 2 different set of 10 odds on weekends",
      "Access to over 100 odds on weekends",
      "78% Accuracy Rate"
    ]
  }
];

const ugx: Plan[] = [
  {
    "name": "Key",
    "slug": "key",
    "prices": [
      {
        "label": "UGX20,000",
        "value": 20000
      },
      {
        "label": "UGX42,000",
        "value": 42000
      },
      {
        "label": "UGX90,000",
        "value": 90000
      },
      {
        "label": "UGX145,000",
        "value": 145000
      },
      {
        "label": "UGX270,000",
        "value": 270000
      }
    ],
    "durations": [
      "1 week",
      "1 month",
      "3 months",
      "6 months",
      "12 months"
    ],
    "features": [
      "Access to one set of Experts ACCA",
      "Access to 8 Tips Stores",
      "70% Accuracy Rate"
    ]
  },
  {
    "name": "Premium",
    "slug": "premium",
    "prices": [
      {
        "label": "UGX50,000",
        "value": 50000
      },
      {
        "label": "UGX82,000",
        "value": 82000
      },
      {
        "label": "UGX160,000",
        "value": 160000
      },
      {
        "label": "UGX320,000",
        "value": 320000
      },
      {
        "label": "UGX500,000",
        "value": 500000
      }
    ],
    "durations": [
      "1 week",
      "1 month",
      "3 months",
      "6 months",
      "12 months"
    ],
    "features": [
      "Access to over 40 Leagues Tips",
      "Access to 2 sets of Experts ACCA",
      "Access to 20 Tips Stores",
      "Access to Risk Management Theory",
      "75% Accuracy Rate"
    ]
  },
  {
    "name": "Smart Bet/Smart Bet Plus",
    "slug": "smartbet",
    "prices": [
      {
        "label": "UGX70,000",
        "value": 70000
      },
      {
        "label": "UGX120,500",
        "value": 120500
      },
      {
        "label": "UGX160,000",
        "value": 160000
      }
    ],
    "durations": [
      "5 days",
      "10 days",
      "15 days"
    ],
    "features": [
      "Access to Smart Betting Strategy",
      "Access to 1.6 - 2.05 odds Daily",
      "Access to Best Ten Tips for the Weekend",
      "A Steady Winning rate",
      "78% Accuracy Rate"
    ]
  },
  {
    "name": "Rollover",
    "slug": "rollover",
    "prices": [
      {
        "label": "UGX65,000",
        "value": 65000
      }
    ],
    "durations": [
      "10 days"
    ],
    "features": [
      "Rollover Betting Strategy",
      "Access to 1.3 odds Daily",
      "85% Accuracy Rate"
    ]
  },
  {
    "name": "50 0dds",
    "slug": "odds50",
    "prices": [
      {
        "label": "UGX42,000",
        "value": 42000
      },
      {
        "label": "UGX85,000",
        "value": 85000
      }
    ],
    "durations": [
      "1 week",
      "1 month"
    ],
    "features": [
      "Access to Winning Tactics",
      "Access to 50 odds twice a Week",
      "Access to 2 different sets of 50 odds on weekends",
      "Access to over 2500 odds of accumulated tips on weekends",
      "75% Accuracy Rate"
    ]
  },
  {
    "name": "Weekend 10 odds",
    "slug": "weekend10",
    "prices": [
      {
        "label": "UGX44,000",
        "value": 44000
      }
    ],
    "durations": [
      "1 month"
    ],
    "features": [
      "Access to Best Accumulated Tips",
      "Access to 10 odds twice a week",
      "Access to 2 different set of 10 odds on weekends",
      "Access to over 100 odds on weekends",
      "78% Accuracy Rate"
    ]
  }
];

const xof: Plan[] = [
  {
    "name": "Key",
    "slug": "key",
    "prices": [
      {
        "label": "CFA1,000",
        "value": 1000
      },
      {
        "label": "CFA2,100",
        "value": 2100
      },
      {
        "label": "CFA5,000",
        "value": 5000
      },
      {
        "label": "CFA9,300",
        "value": 9300
      },
      {
        "label": "CFA13,200",
        "value": 13200
      }
    ],
    "durations": [
      "1 week",
      "1 month",
      "3 months",
      "6 months",
      "12 months"
    ],
    "features": [
      "Access to one set of Experts ACCA",
      "Access to 8 Tips Stores",
      "70% Accuracy Rate"
    ]
  },
  {
    "name": "Premium",
    "slug": "premium",
    "prices": [
      {
        "label": "CFA1,200",
        "value": 1200
      },
      {
        "label": "CFA3,200",
        "value": 3200
      },
      {
        "label": "CFA7,000",
        "value": 7000
      },
      {
        "label": "CFA13,000",
        "value": 13000
      },
      {
        "label": "CFA32,000",
        "value": 32000
      }
    ],
    "durations": [
      "1 week",
      "1 month",
      "3 months",
      "6 months",
      "12 months"
    ],
    "features": [
      "Access to over 40 Leagues Tips",
      "Access to 2 sets of Experts ACCA",
      "Access to 20 Tips Stores",
      "Access to Risk Management Theory",
      "75% Accuracy Rate"
    ]
  },
  {
    "name": "Smart Bet/Smart Bet Plus",
    "slug": "smartbet",
    "prices": [
      {
        "label": "CFA2,000",
        "value": 2000
      },
      {
        "label": "CFA3,000",
        "value": 3000
      },
      {
        "label": "CFA4,500",
        "value": 4500
      }
    ],
    "durations": [
      "5 days",
      "10 days",
      "15 days"
    ],
    "features": [
      "Access to Smart Betting Strategy",
      "Access to 1.6 - 2.05 odds Daily",
      "Access to Best Ten Tips for the Weekend",
      "A Steady Winning rate",
      "78% Accuracy Rate"
    ]
  },
  {
    "name": "Rollover",
    "slug": "rollover",
    "prices": [
      {
        "label": "CFA2,200",
        "value": 2200
      }
    ],
    "durations": [
      "10 days"
    ],
    "features": [
      "Rollover Betting Strategy",
      "Access to 1.3 odds Daily",
      "85% Accuracy Rate"
    ]
  },
  {
    "name": "50 0dds",
    "slug": "odds50",
    "prices": [
      {
        "label": "CFA1,500",
        "value": 1500
      },
      {
        "label": "CFA3,100",
        "value": 3100
      }
    ],
    "durations": [
      "1 week",
      "1 month"
    ],
    "features": [
      "Access to Winning Tactics",
      "Access to 50 odds twice a Week",
      "Access to 2 different sets of 50 odds on weekends",
      "Access to over 2500 odds of accumulated tips on weekends",
      "75% Accuracy Rate"
    ]
  },
  {
    "name": "Weekend 10 odds",
    "slug": "weekend10",
    "prices": [
      {
        "label": "CFA2,300",
        "value": 2300
      }
    ],
    "durations": [
      "1 month"
    ],
    "features": [
      "Access to Best Accumulated Tips",
      "Access to 10 odds twice a week",
      "Access to 2 different set of 10 odds on weekends",
      "Access to over 100 odds on weekends",
      "78% Accuracy Rate"
    ]
  }
];

const sll: Plan[] = [
  {
    "name": "Key",
    "slug": "key",
    "prices": [
      {
        "label": "LE110.00",
        "value": 110
      },
      {
        "label": "LE220.00",
        "value": 220
      },
      {
        "label": "LE500.00",
        "value": 500
      },
      {
        "label": "LE800.00",
        "value": 800
      },
      {
        "label": "LE1,400",
        "value": 1400
      }
    ],
    "durations": [
      "1 week",
      "1 month",
      "3 months",
      "6 months",
      "12 months"
    ],
    "features": [
      "Access to one set of Experts ACCA",
      "Access to 8 Tips Stores",
      "70% Accuracy Rate"
    ]
  },
  {
    "name": "Premium",
    "slug": "premium",
    "prices": [
      {
        "label": "LE200.00",
        "value": 200
      },
      {
        "label": "LE450.00",
        "value": 450
      },
      {
        "label": "LE1,100",
        "value": 1100
      },
      {
        "label": "LE2,000",
        "value": 2000
      },
      {
        "label": "LE3,000",
        "value": 3000
      }
    ],
    "durations": [
      "1 week",
      "1 month",
      "3 months",
      "6 months",
      "12 months"
    ],
    "features": [
      "Access to over 40 Leagues Tips",
      "Access to 2 sets of Experts ACCA",
      "Access to 20 Tips Stores",
      "Access to Risk Management Theory",
      "75% Accuracy Rate"
    ]
  },
  {
    "name": "Smart Bet/Smart Bet Plus",
    "slug": "smartbet",
    "prices": [
      {
        "label": "LE400.00",
        "value": 400
      },
      {
        "label": "LE600.00",
        "value": 600
      },
      {
        "label": "LE900.00",
        "value": 900
      }
    ],
    "durations": [
      "5 days",
      "10 days",
      "15 days"
    ],
    "features": [
      "Access to Smart Betting Strategy",
      "Access to 1.6 - 2.05 odds Daily",
      "Access to Best Ten Tips for the Weekend",
      "A Steady Winning rate",
      "78% Accuracy Rate"
    ]
  },
  {
    "name": "Rollover",
    "slug": "rollover",
    "prices": [
      {
        "label": "LE300.00",
        "value": 300
      }
    ],
    "durations": [
      "10 days"
    ],
    "features": [
      "Rollover Betting Strategy",
      "Access to 1.3 odds Daily",
      "85% Accuracy Rate"
    ]
  },
  {
    "name": "50 0dds",
    "slug": "odds50",
    "prices": [
      {
        "label": "LE250.00",
        "value": 250
      },
      {
        "label": "LE550.00",
        "value": 550
      }
    ],
    "durations": [
      "1 week",
      "1 month"
    ],
    "features": [
      "Access to Winning Tactics",
      "Access to 50 odds twice a Week",
      "Access to 2 different sets of 50 odds on weekends",
      "Access to over 2500 odds of accumulated tips on weekends",
      "75% Accuracy Rate"
    ]
  },
  {
    "name": "Weekend 10 odds",
    "slug": "weekend10",
    "prices": [
      {
        "label": "LE350.00",
        "value": 350
      }
    ],
    "durations": [
      "1 month"
    ],
    "features": [
      "Access to Best Accumulated Tips",
      "Access to 10 odds twice a week",
      "Access to 2 different set of 10 odds on weekends",
      "Access to over 100 odds on weekends",
      "78% Accuracy Rate"
    ]
  }
];

const zar: Plan[] = [
  {
    "name": "Key",
    "slug": "key",
    "prices": [
      {
        "label": "ZAR50.00",
        "value": 50
      },
      {
        "label": "ZAR100.00",
        "value": 100
      },
      {
        "label": "ZAR250.00",
        "value": 250
      },
      {
        "label": "ZAR400.00",
        "value": 400
      },
      {
        "label": "ZAR700.00",
        "value": 700
      }
    ],
    "durations": [
      "1 week",
      "1 month",
      "3 months",
      "6 months",
      "12 months"
    ],
    "features": [
      "Access to one set of Experts ACCA",
      "Access to 8 Tips Stores",
      "70% Accuracy Rate"
    ]
  },
  {
    "name": "Premium",
    "slug": "premium",
    "prices": [
      {
        "label": "ZAR80.00",
        "value": 80
      },
      {
        "label": "ZAR160.00",
        "value": 160
      },
      {
        "label": "ZAR350.00",
        "value": 350
      },
      {
        "label": "ZAR600.00",
        "value": 600
      },
      {
        "label": "ZAR1,000",
        "value": 1000
      }
    ],
    "durations": [
      "1 week",
      "1 month",
      "3 months",
      "6 months",
      "12 months"
    ],
    "features": [
      "Access to over 40 Leagues Tips",
      "Access to 2 sets of Experts ACCA",
      "Access to 20 Tips Stores",
      "Access to Risk Management Theory",
      "75% Accuracy Rate"
    ]
  },
  {
    "name": "Smart Bet/Smart Bet Plus",
    "slug": "smartbet",
    "prices": [
      {
        "label": "ZAR90.00",
        "value": 90
      },
      {
        "label": "ZAR150.00",
        "value": 150
      },
      {
        "label": "ZAR250.00",
        "value": 250
      }
    ],
    "durations": [
      "5 days",
      "10 days",
      "15 days"
    ],
    "features": [
      "Access to Smart Betting Strategy",
      "Access to 1.6 - 2.05 odds Daily",
      "Access to Best Ten Tips for the Weekend",
      "A Steady Winning rate",
      "78% Accuracy Rate"
    ]
  },
  {
    "name": "Rollover",
    "slug": "rollover",
    "prices": [
      {
        "label": "ZAR95.00",
        "value": 95
      }
    ],
    "durations": [
      "10 days"
    ],
    "features": [
      "Rollover Betting Strategy",
      "Access to 1.3 odds Daily",
      "85% Accuracy Rate"
    ]
  },
  {
    "name": "50 0dds",
    "slug": "odds50",
    "prices": [
      {
        "label": "ZAR85.00",
        "value": 85
      },
      {
        "label": "ZAR150.00",
        "value": 150
      }
    ],
    "durations": [
      "1 week",
      "1 month"
    ],
    "features": [
      "Access to Winning Tactics",
      "Access to 50 odds twice a Week",
      "Access to 2 different sets of 50 odds on weekends",
      "Access to over 2500 odds of accumulated tips on weekends",
      "75% Accuracy Rate"
    ]
  },
  {
    "name": "Weekend 10 odds",
    "slug": "weekend10",
    "prices": [
      {
        "label": "ZAR100.00",
        "value": 100
      }
    ],
    "durations": [
      "1 month"
    ],
    "features": [
      "Access to Best Accumulated Tips",
      "Access to 10 odds twice a week",
      "Access to 2 different set of 10 odds on weekends",
      "Access to over 100 odds on weekends",
      "78% Accuracy Rate"
    ]
  }
];

/** All tables by key (Nigeria reuses the canonical `plans`). */
export const pricingTables: Record<string, Plan[]> = {
  ngn: plans,
  usd,
  ghs,
  kes,
  ugx,
  xof,
  sll,
  zar,
};

export type CountryPricing = { code: string; label: string; table: string; currency: string };

export const countryPricing: CountryPricing[] = [
  {
    "code": "NG",
    "label": "Nigeria",
    "table": "ngn",
    "currency": "NGN"
  },
  {
    "code": "GH",
    "label": "Ghana",
    "table": "ghs",
    "currency": "GHS"
  },
  {
    "code": "KE",
    "label": "Kenya",
    "table": "kes",
    "currency": "KES"
  },
  {
    "code": "TZ",
    "label": "Tanzania",
    "table": "kes",
    "currency": "KES"
  },
  {
    "code": "UG",
    "label": "Uganda",
    "table": "ugx",
    "currency": "UGX"
  },
  {
    "code": "ZA",
    "label": "South Africa",
    "table": "zar",
    "currency": "ZAR"
  },
  {
    "code": "SL",
    "label": "Sierra Leone",
    "table": "sll",
    "currency": "SLL"
  },
  {
    "code": "CM",
    "label": "Cameroon",
    "table": "xof",
    "currency": "XOF"
  },
  {
    "code": "BJ",
    "label": "Benin Republic",
    "table": "xof",
    "currency": "XOF"
  },
  {
    "code": "CI",
    "label": "Cote d'Ivoire",
    "table": "xof",
    "currency": "XOF"
  },
  {
    "code": "OT",
    "label": "Other countries",
    "table": "usd",
    "currency": "USD"
  }
];

/** Options for the country selector (value = country code). */
export const pricingOptions = countryPricing.map((c) => ({ value: c.code, label: c.label }));

/** Resolve a country code to its plans + currency; defaults to Nigeria/NGN. */
export function getPricingFor(code: string): { plans: Plan[]; currency: string; label: string } {
  const match = countryPricing.find((c) => c.code === code) ?? countryPricing[0];
  return { plans: pricingTables[match.table] ?? plans, currency: match.currency, label: match.label };
}

/**
 * Map a detected ISO country code to a pricing-selector option. Countries with a
 * dedicated table use it; Ethiopia/Rwanda share Kenya pricing (as in the legacy);
 * everything else falls back to "OT" (USD).
 */
export function toPricingCountry(iso: string | null | undefined): string {
  if (!iso) return "NG";
  const code = iso.toUpperCase();
  if (code === "ET" || code === "RW") return "KE";
  return pricingOptions.some((o) => o.value === code) ? code : "OT";
}
