/**
 * Buy comps for Fern tennis court — San Rafael 94901 / North Bay.
 * Prefer search/product URLs that resolve (verified Aug 2026).
 */

export interface CourtBuyOption {
  vendor: string;
  product: string;
  url: string;
  priceNote: string;
  area: string;
  best?: boolean;
  phone?: string;
}

export interface CourtSupplierGroup {
  keys: string[];
  title: string;
  tip: string;
  options: CourtBuyOption[];
}

export const COURT_YARDS = [
  {
    name: "A&S Landscape Materials",
    address: "580 Jacoby St, San Rafael, CA 94901",
    phone: "(415) 456-1381",
    url: "https://ansmaterials.com/",
    note: "Class II, DG, sand — call for multi-load court pad pricing.",
  },
  {
    name: "North Bay Materials",
    address: "Delivers to San Rafael 94901",
    phone: undefined as string | undefined,
    url: "https://www.northbaymaterials.com/landscape-materials/san-rafael-94901",
    note: "Published aggregate pricing + delivery for large Class II orders.",
  },
  {
    name: "Home Depot — San Rafael #657",
    address: "111 Shoreline Pkwy, San Rafael, CA 94901",
    phone: "(415) 458-8675",
    url: "https://www.homedepot.com/l/San-Rafael/CA/San-Rafael/94901/657",
    note: "Fence fabric, posts, net gear, tool rental — BOPIS.",
  },
] as const;

export const COURT_SUPPLIER_GROUPS: CourtSupplierGroup[] = [
  {
    keys: ["class2", "bedding"],
    title: "Class II base & bedding",
    tip: "Court pads take many yards — get multi-load quotes. North Bay Materials posts online pricing to 94901.",
    options: [
      {
        vendor: "North Bay Materials",
        product: "Virgin Class 2 road base (¾″)",
        url: "https://www.northbaymaterials.com/product-page/base-rock-class-2-road-base-3-4-inch-napa-vallejo-benicia-delivery",
        priceNote: "From ~$58/cu yd",
        area: "Delivers to 94901",
        best: true,
      },
      {
        vendor: "A&S Landscape Materials",
        product: "Class II / DG yard quote",
        url: "https://ansmaterials.com/",
        priceNote: "Call for multi-load",
        area: "San Rafael yard",
        phone: "(415) 456-1381",
      },
      {
        vendor: "Home Depot",
        product: "Search: decomposed granite / sand",
        url: "https://www.homedepot.com/s/decomposed%20granite",
        priceNote: "Bagged only — emergency top-off",
        area: "San Rafael #657",
      },
    ],
  },
  {
    keys: ["asphalt", "geo"],
    title: "Asphalt / geotextile under hard court",
    tip: "Acrylic needs a stable asphalt or concrete slab. Geotextile under base for all systems.",
    options: [
      {
        vendor: "Home Depot",
        product: "Landscape fabric / geotextile rolls",
        url: "https://www.homedepot.com/s/landscape%20fabric%20weed%20barrier",
        priceNote: "Compare roll widths",
        area: "San Rafael #657",
        best: true,
      },
      {
        vendor: "Local asphalt plant",
        product: "Hot mix asphalt (ton) — residential pad",
        url: "https://www.google.com/search?q=asphalt+plant+near+San+Rafael+CA",
        priceNote: "Quote ~$/ton delivered",
        area: "Marin / Sonoma plants",
      },
    ],
  },
  {
    keys: ["acrylic", "acrylic-labor", "lines"],
    title: "Acrylic hard-court system & lines",
    tip: " pro installers use Laykold / DecoTurf / Plexipave systems. DIY materials exist as court coatings; pro finish is cleaner for tennis bounce.",
    options: [
      {
        vendor: "California Sports Surfaces",
        product: "Laykold acrylic systems (pro)",
        url: "https://www.californiasportssurfaces.com/",
        priceNote: "Pro system quote",
        area: "CA installer network",
        best: true,
      },
      {
        vendor: "Home Depot",
        product: "Search: acrylic concrete resurfacer / court paint",
        url: "https://www.homedepot.com/s/acrylic%20concrete%20resurfacer",
        priceNote: "DIY coating blend",
        area: "San Rafael #657",
      },
      {
        vendor: "Home Depot",
        product: "Search: tennis court line paint",
        url: "https://www.homedepot.com/s/tennis%20court%20paint",
        priceNote: "Line kits / striping",
        area: "San Rafael #657",
      },
    ],
  },
  {
    keys: ["modular", "modular-labor"],
    title: "Modular multi-sport tiles",
    tip: "Sport Court / multipurpose interlocking tiles excel when the Fern court also hosts futsal.",
    options: [
      {
        vendor: "Sport Court",
        product: "Residential outdoor court systems",
        url: "https://www.sportcourt.com/",
        priceNote: "Quote by sq ft",
        area: "Dealer install / DIY kits",
        best: true,
      },
      {
        vendor: "Home Depot",
        product: "Search: interlocking deck / sport floor tiles",
        url: "https://www.homedepot.com/s/interlocking%20floor%20tiles%20outdoor",
        priceNote: "Budget tile options",
        area: "San Rafael #657",
      },
      {
        vendor: "Amazon",
        product: "Search: outdoor sports court tiles",
        url: "https://www.amazon.com/s?k=outdoor+sports+court+interlocking+tiles",
        priceNote: "Compare coverage packs",
        area: "Ships to 94901",
      },
    ],
  },
  {
    keys: ["turf", "infill", "turf-labor"],
    title: "Multi-sport artificial turf",
    tip: "Short-pile recreational turf + silica infill. Slower tennis bounce; best futsal feel of the three.",
    options: [
      {
        vendor: "Home Depot",
        product: "Search: artificial grass turf roll",
        url: "https://www.homedepot.com/s/artificial%20grass%20turf",
        priceNote: "Compare pile height",
        area: "San Rafael #657",
        best: true,
      },
      {
        vendor: "Home Depot",
        product: "Search: silica sand infill turf",
        url: "https://www.homedepot.com/s/silica%20sand%20infill",
        priceNote: "50 lb bags",
        area: "San Rafael #657",
      },
      {
        vendor: "Artificial Turf Supply",
        product: "Sports / multi-purpose turf",
        url: "https://www.artificialturfsupply.com/",
        priceNote: "Sports lines available",
        area: "Ships CA",
      },
    ],
  },
  {
    keys: ["net"],
    title: "Tennis net & posts",
    tip: "Choose a net you can drop or remove so Fern can host futsal / open play.",
    options: [
      {
        vendor: "Home Depot",
        product: "Search: tennis net",
        url: "https://www.homedepot.com/s/tennis%20net",
        priceNote: "Nets + posts kits",
        area: "San Rafael #657",
        best: true,
      },
      {
        vendor: "Amazon",
        product: "Search: regulation tennis net posts set",
        url: "https://www.amazon.com/s?k=regulation+tennis+net+and+posts",
        priceNote: "Compare ratings",
        area: "Ships to 94901",
      },
    ],
  },
  {
    keys: ["fence", "gate-s", "gate-d", "fence-labor"],
    title: "Chain-link fence, posts & gates",
    tip: "10′ is the residential tennis sweet spot; 12′ on ends if balls fly out. Black vinyl looks cleaner.",
    options: [
      {
        vendor: "Home Depot",
        product: "Search: chain link fence 10 ft",
        url: "https://www.homedepot.com/s/chain%20link%20fence%2010%20ft",
        priceNote: "Fabric, posts, rail",
        area: "San Rafael #657",
        best: true,
      },
      {
        vendor: "Home Depot",
        product: "Search: black vinyl chain link",
        url: "https://www.homedepot.com/s/black%20vinyl%20chain%20link%20fence",
        priceNote: "Premium look",
        area: "San Rafael #657",
      },
      {
        vendor: "Home Depot",
        product: "Search: chain link gate",
        url: "https://www.homedepot.com/s/chain%20link%20gate",
        priceNote: "Walk + double gates",
        area: "San Rafael #657",
      },
    ],
  },
  {
    keys: ["windscreen"],
    title: "Windscreen / privacy mesh",
    tip: "Cuts wind and neighbors’ view of the court. Leave a bottom gap for airflow.",
    options: [
      {
        vendor: "Home Depot",
        product: "Search: fence windscreen",
        url: "https://www.homedepot.com/s/windscreen%20fence",
        priceNote: "By height × length",
        area: "San Rafael #657",
        best: true,
      },
      {
        vendor: "Amazon",
        product: "Search: tennis court windscreen",
        url: "https://www.amazon.com/s?k=tennis+court+windscreen",
        priceNote: "Custom sizes",
        area: "Ships to 94901",
      },
    ],
  },
  {
    keys: ["futsal-goals"],
    title: "Portable futsal goals",
    tip: "Park on the baselines when the tennis net is down — multi-sport mode for Fern.",
    options: [
      {
        vendor: "Amazon",
        product: "Search: portable futsal goals pair",
        url: "https://www.amazon.com/s?k=portable+futsal+goals",
        priceNote: "2 m × 3 m youth/adult",
        area: "Ships to 94901",
        best: true,
      },
      {
        vendor: "Home Depot",
        product: "Search: soccer goal portable",
        url: "https://www.homedepot.com/s/portable%20soccer%20goal",
        priceNote: "Compare sizes",
        area: "San Rafael #657",
      },
    ],
  },
  {
    keys: ["compactor", "level", "delivery", "helpers"],
    title: "Tool rentals & delivery",
    tip: "Large pad = multi-day plate/roller and laser. Yards deliver Class II cheaper than bag hauling.",
    options: [
      {
        vendor: "Home Depot Tool Rental",
        product: "Plate compactors & rollers",
        url: "https://www.homedepot.com/c/tool_and_equipment_rental",
        priceNote: "Day rates",
        area: "San Rafael #657",
        best: true,
      },
      {
        vendor: "United Rentals",
        product: "Compaction equipment",
        url: "https://www.unitedrentals.com/marketplace/equipment/compaction-equipment",
        priceNote: "Multi-day discounts",
        area: "Bay Area",
      },
      {
        vendor: "North Bay Materials",
        product: "Aggregate delivery to 94901",
        url: "https://www.northbaymaterials.com/landscape-materials/san-rafael-94901",
        priceNote: "Multi-load court pads",
        area: "94901",
      },
    ],
  },
];

export function getCourtSuppliersForItem(
  itemId: string,
): CourtSupplierGroup | undefined {
  return COURT_SUPPLIER_GROUPS.find((g) => g.keys.includes(itemId));
}

export function getCourtBestOption(
  group: CourtSupplierGroup,
): CourtBuyOption | undefined {
  return group.options.find((o) => o.best) ?? group.options[0];
}
