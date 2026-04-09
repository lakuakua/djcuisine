/**
 * Per-SKU UPS Ground / 2nd Day rates by US region (Northeast, Midwest, South, West).
 * Generated from \`djcuisine_products .xlsx\` (Easyship_Template sheet). West Ground is inferred
 * from South Ground × (West 2nd Day / South 2nd Day) when the sheet leaves West Ground blank.
 */
export type SkuZoneRates = { ground: number; secondDay: number };
export type SkuShippingRow = Record<
  'northeast' | 'midwest' | 'south' | 'west',
  SkuZoneRates
>;

export const SKU_SHIPPING_RATES: Record<string, SkuShippingRow> =
{
  "CHICKEN-LEG-THIGHS-BIG": {
    "northeast": {
      "ground": 35,
      "secondDay": 70
    },
    "midwest": {
      "ground": 35,
      "secondDay": 70
    },
    "south": {
      "ground": 30,
      "secondDay": 60
    },
    "west": {
      "ground": 60,
      "secondDay": 120
    }
  },
  "CHICKEN-LEG-THIGHS-HALF": {
    "northeast": {
      "ground": 30,
      "secondDay": 60
    },
    "midwest": {
      "ground": 30,
      "secondDay": 60
    },
    "south": {
      "ground": 25,
      "secondDay": 50
    },
    "west": {
      "ground": 40,
      "secondDay": 80
    }
  },
  "CHICKEN-LEG-THIGHS-PLATE": {
    "northeast": {
      "ground": 30,
      "secondDay": 60
    },
    "midwest": {
      "ground": 30,
      "secondDay": 60
    },
    "south": {
      "ground": 25,
      "secondDay": 50
    },
    "west": {
      "ground": 40,
      "secondDay": 80
    }
  },
  "CHICKEN-WINGS-BIG": {
    "northeast": {
      "ground": 35,
      "secondDay": 70
    },
    "midwest": {
      "ground": 35,
      "secondDay": 70
    },
    "south": {
      "ground": 30,
      "secondDay": 60
    },
    "west": {
      "ground": 60,
      "secondDay": 120
    }
  },
  "CHICKEN-WINGS-HALF": {
    "northeast": {
      "ground": 30,
      "secondDay": 60
    },
    "midwest": {
      "ground": 30,
      "secondDay": 60
    },
    "south": {
      "ground": 25,
      "secondDay": 50
    },
    "west": {
      "ground": 40,
      "secondDay": 80
    }
  },
  "CHICKEN-WINGS-PLATE": {
    "northeast": {
      "ground": 30,
      "secondDay": 60
    },
    "midwest": {
      "ground": 30,
      "secondDay": 60
    },
    "south": {
      "ground": 25,
      "secondDay": 50
    },
    "west": {
      "ground": 40,
      "secondDay": 80
    }
  },
  "CHICKEN-BREAST-BIG": {
    "northeast": {
      "ground": 35,
      "secondDay": 70
    },
    "midwest": {
      "ground": 35,
      "secondDay": 70
    },
    "south": {
      "ground": 30,
      "secondDay": 60
    },
    "west": {
      "ground": 60,
      "secondDay": 120
    }
  },
  "CHICKEN-BREAST-HALF": {
    "northeast": {
      "ground": 30,
      "secondDay": 60
    },
    "midwest": {
      "ground": 30,
      "secondDay": 60
    },
    "south": {
      "ground": 25,
      "secondDay": 50
    },
    "west": {
      "ground": 40,
      "secondDay": 80
    }
  },
  "TURKEY-WINGS-BIG": {
    "northeast": {
      "ground": 35,
      "secondDay": 70
    },
    "midwest": {
      "ground": 35,
      "secondDay": 70
    },
    "south": {
      "ground": 30,
      "secondDay": 60
    },
    "west": {
      "ground": 60,
      "secondDay": 120
    }
  },
  "TURKEY-WINGS-HALF": {
    "northeast": {
      "ground": 35,
      "secondDay": 70
    },
    "midwest": {
      "ground": 35,
      "secondDay": 70
    },
    "south": {
      "ground": 30,
      "secondDay": 60
    },
    "west": {
      "ground": 60,
      "secondDay": 120
    }
  },
  "TURKEY-LEGS-BIG": {
    "northeast": {
      "ground": 35,
      "secondDay": 70
    },
    "midwest": {
      "ground": 35,
      "secondDay": 70
    },
    "south": {
      "ground": 30,
      "secondDay": 60
    },
    "west": {
      "ground": 60,
      "secondDay": 120
    }
  },
  "TURKEY-LEGS-HALF": {
    "northeast": {
      "ground": 35,
      "secondDay": 70
    },
    "midwest": {
      "ground": 35,
      "secondDay": 70
    },
    "south": {
      "ground": 30,
      "secondDay": 60
    },
    "west": {
      "ground": 60,
      "secondDay": 120
    }
  },
  "BEEF-RIBS-BIG": {
    "northeast": {
      "ground": 35,
      "secondDay": 70
    },
    "midwest": {
      "ground": 35,
      "secondDay": 70
    },
    "south": {
      "ground": 30,
      "secondDay": 60
    },
    "west": {
      "ground": 60,
      "secondDay": 120
    }
  },
  "BEEF-RIBS-HALF": {
    "northeast": {
      "ground": 35,
      "secondDay": 70
    },
    "midwest": {
      "ground": 35,
      "secondDay": 70
    },
    "south": {
      "ground": 30,
      "secondDay": 60
    },
    "west": {
      "ground": 60,
      "secondDay": 120
    }
  },
  "BEEF-RIBS-PLATE": {
    "northeast": {
      "ground": 30,
      "secondDay": 60
    },
    "midwest": {
      "ground": 30,
      "secondDay": 60
    },
    "south": {
      "ground": 25,
      "secondDay": 50
    },
    "west": {
      "ground": 40,
      "secondDay": 80
    }
  },
  "BEEF-STEAK-TIPS-BIG": {
    "northeast": {
      "ground": 35,
      "secondDay": 70
    },
    "midwest": {
      "ground": 35,
      "secondDay": 70
    },
    "south": {
      "ground": 30,
      "secondDay": 60
    },
    "west": {
      "ground": 60,
      "secondDay": 120
    }
  },
  "BEEF-STEAK-TIPS-HALF": {
    "northeast": {
      "ground": 35,
      "secondDay": 70
    },
    "midwest": {
      "ground": 35,
      "secondDay": 70
    },
    "south": {
      "ground": 30,
      "secondDay": 60
    },
    "west": {
      "ground": 60,
      "secondDay": 120
    }
  },
  "BEEF-STEAK-TIPS-PLATE": {
    "northeast": {
      "ground": 30,
      "secondDay": 60
    },
    "midwest": {
      "ground": 30,
      "secondDay": 60
    },
    "south": {
      "ground": 25,
      "secondDay": 50
    },
    "west": {
      "ground": 40,
      "secondDay": 80
    }
  },
  "BEEF-KABOB-BIG": {
    "northeast": {
      "ground": 35,
      "secondDay": 70
    },
    "midwest": {
      "ground": 35,
      "secondDay": 70
    },
    "south": {
      "ground": 30,
      "secondDay": 60
    },
    "west": {
      "ground": 60,
      "secondDay": 120
    }
  },
  "BEEF-KABOB-HALF": {
    "northeast": {
      "ground": 35,
      "secondDay": 70
    },
    "midwest": {
      "ground": 35,
      "secondDay": 70
    },
    "south": {
      "ground": 30,
      "secondDay": 60
    },
    "west": {
      "ground": 60,
      "secondDay": 120
    }
  },
  "LAMB-BIG": {
    "northeast": {
      "ground": 35,
      "secondDay": 70
    },
    "midwest": {
      "ground": 35,
      "secondDay": 70
    },
    "south": {
      "ground": 30,
      "secondDay": 60
    },
    "west": {
      "ground": 60,
      "secondDay": 120
    }
  },
  "LAMB-HALF": {
    "northeast": {
      "ground": 35,
      "secondDay": 70
    },
    "midwest": {
      "ground": 35,
      "secondDay": 70
    },
    "south": {
      "ground": 30,
      "secondDay": 60
    },
    "west": {
      "ground": 60,
      "secondDay": 120
    }
  },
  "LAMB-PLATE": {
    "northeast": {
      "ground": 30,
      "secondDay": 70
    },
    "midwest": {
      "ground": 30,
      "secondDay": 70
    },
    "south": {
      "ground": 25,
      "secondDay": 50
    },
    "west": {
      "ground": 40,
      "secondDay": 80
    }
  },
  "SMOKED-ROOSTER": {
    "northeast": {
      "ground": 30,
      "secondDay": 60
    },
    "midwest": {
      "ground": 30,
      "secondDay": 60
    },
    "south": {
      "ground": 25,
      "secondDay": 50
    },
    "west": {
      "ground": 40,
      "secondDay": 80
    }
  },
  "SMOKED-GUINEA-FOWL": {
    "northeast": {
      "ground": 30,
      "secondDay": 60
    },
    "midwest": {
      "ground": 30,
      "secondDay": 60
    },
    "south": {
      "ground": 25,
      "secondDay": 50
    },
    "west": {
      "ground": 40,
      "secondDay": 80
    }
  },
  "SMOKED-HEN": {
    "northeast": {
      "ground": 30,
      "secondDay": 60
    },
    "midwest": {
      "ground": 30,
      "secondDay": 60
    },
    "south": {
      "ground": 25,
      "secondDay": 50
    },
    "west": {
      "ground": 40,
      "secondDay": 80
    }
  },
  "SMOKED-RABBIT": {
    "northeast": {
      "ground": 30,
      "secondDay": 60
    },
    "midwest": {
      "ground": 30,
      "secondDay": 60
    },
    "south": {
      "ground": 25,
      "secondDay": 50
    },
    "west": {
      "ground": 40,
      "secondDay": 80
    }
  },
  "GRILLED-ROOSTER": {
    "northeast": {
      "ground": 30,
      "secondDay": 60
    },
    "midwest": {
      "ground": 30,
      "secondDay": 60
    },
    "south": {
      "ground": 25,
      "secondDay": 50
    },
    "west": {
      "ground": 40,
      "secondDay": 80
    }
  },
  "GRILLED-GUINEA-FOWL": {
    "northeast": {
      "ground": 30,
      "secondDay": 60
    },
    "midwest": {
      "ground": 30,
      "secondDay": 60
    },
    "south": {
      "ground": 25,
      "secondDay": 50
    },
    "west": {
      "ground": 40,
      "secondDay": 80
    }
  },
  "DEER-SAUSAGE-5PC": {
    "northeast": {
      "ground": 30,
      "secondDay": 60
    },
    "midwest": {
      "ground": 30,
      "secondDay": 60
    },
    "south": {
      "ground": 25,
      "secondDay": 50
    },
    "west": {
      "ground": 40,
      "secondDay": 80
    }
  },
  "ZOBO-1GAL": {
    "northeast": {
      "ground": 30,
      "secondDay": 60
    },
    "midwest": {
      "ground": 30,
      "secondDay": 60
    },
    "south": {
      "ground": 25,
      "secondDay": 50
    },
    "west": {
      "ground": 40,
      "secondDay": 80
    }
  },
  "ZOBO-HALFGAL": {
    "northeast": {
      "ground": 30,
      "secondDay": 60
    },
    "midwest": {
      "ground": 30,
      "secondDay": 60
    },
    "south": {
      "ground": 25,
      "secondDay": 50
    },
    "west": {
      "ground": 40,
      "secondDay": 80
    }
  },
  "ZOBO-16OZ": {
    "northeast": {
      "ground": 30,
      "secondDay": 60
    },
    "midwest": {
      "ground": 30,
      "secondDay": 60
    },
    "south": {
      "ground": 25,
      "secondDay": 50
    },
    "west": {
      "ground": 40,
      "secondDay": 80
    }
  },
  "ZOBO-32OZ": {
    "northeast": {
      "ground": 30,
      "secondDay": 60
    },
    "midwest": {
      "ground": 30,
      "secondDay": 60
    },
    "south": {
      "ground": 25,
      "secondDay": 50
    },
    "west": {
      "ground": 40,
      "secondDay": 80
    }
  },
  "PINEAPPLE-GINGER-1GAL": {
    "northeast": {
      "ground": 30,
      "secondDay": 60
    },
    "midwest": {
      "ground": 30,
      "secondDay": 60
    },
    "south": {
      "ground": 25,
      "secondDay": 50
    },
    "west": {
      "ground": 40,
      "secondDay": 80
    }
  },
  "PINEAPPLE-GINGER-HALFGAL": {
    "northeast": {
      "ground": 30,
      "secondDay": 60
    },
    "midwest": {
      "ground": 30,
      "secondDay": 60
    },
    "south": {
      "ground": 25,
      "secondDay": 50
    },
    "west": {
      "ground": 40,
      "secondDay": 80
    }
  },
  "PINEAPPLE-GINGER-16OZ": {
    "northeast": {
      "ground": 30,
      "secondDay": 60
    },
    "midwest": {
      "ground": 30,
      "secondDay": 60
    },
    "south": {
      "ground": 25,
      "secondDay": 50
    },
    "west": {
      "ground": 40,
      "secondDay": 80
    }
  },
  "PINEAPPLE-GINGER-32OZ": {
    "northeast": {
      "ground": 30,
      "secondDay": 60
    },
    "midwest": {
      "ground": 30,
      "secondDay": 60
    },
    "south": {
      "ground": 25,
      "secondDay": 50
    },
    "west": {
      "ground": 40,
      "secondDay": 80
    }
  },
  "WATERMELON-GINGER-PINEAPPLE": {
    "northeast": {
      "ground": 30,
      "secondDay": 60
    },
    "midwest": {
      "ground": 30,
      "secondDay": 60
    },
    "south": {
      "ground": 25,
      "secondDay": 50
    },
    "west": {
      "ground": 40,
      "secondDay": 80
    }
  }
}
;
