/**
 * Purchase comps for San Rafael, CA 94901 (project site).
 * Aggregates: local yards usually beat big-box bag pricing.
 * Links verified Aug 2026; prices shift — confirm before order.
 */

export interface BuyOption {
  vendor: string;
  /** Short product / offer label */
  product: string;
  url: string;
  /** Approximate unit price as of research date */
  priceNote: string;
  /** Where to pick up / ships from */
  area: string;
  /** Marked as best value among comps */
  best?: boolean;
  /** Optional phone for yards that quote */
  phone?: string;
}

export interface SupplierGroup {
  /** Matches LineItem.id keys (and aggregates) */
  keys: string[];
  title: string;
  tip: string;
  options: BuyOption[];
}

/** Local yards & big-box near San Rafael 94901 / North Bay. */
export const LOCAL_YARDS = [
  {
    name: "A&S Landscape Materials",
    address: "580 Jacoby St, San Rafael, CA 94901",
    phone: "(415) 456-1381",
    url: "https://ansmaterials.com/",
    note: "Closest yard to the job — base, drain rock, sand, DG. Call for yard prices.",
  },
  {
    name: "North Bay Materials",
    address: "Delivers to San Rafael 94901 / 94903",
    phone: undefined as string | undefined,
    url: "https://www.northbaymaterials.com/landscape-materials/san-rafael-94901",
    note: "Published online pricing + delivery to San Rafael. Min ~1 cu yd aggregates.",
  },
  {
    name: "Home Depot — San Rafael #657",
    address: "111 Shoreline Pkwy, San Rafael, CA 94901",
    phone: "(415) 458-8675",
    url: "https://www.homedepot.com/l/San-Rafael/CA/San-Rafael/94901/657",
    note: "Pipe, fabric, Trex, blocks, tool rental — BOPIS. Aggregates better at yards.",
  },
] as const;

/**
 * Buy options keyed by BOM line id.
 * Prefer local bulk for rock/base; big-box/online for pipe, fabric, turf, Trex.
 */
export const SUPPLIER_GROUPS: SupplierGroup[] = [
  {
    keys: ["class2", "level-pad"],
    title: "Class II road base / leveling pad",
    tip: "Buy bulk by the yard — bagged base at HD costs 3–5× more. Best: North Bay Materials virgin Class 2 (~$58/yd).",
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
        vendor: "North Bay Materials",
        product: "Permeable Class 2 base (per ton)",
        url: "https://www.northbaymaterials.com/product-page/permeable-class-2-base-rock",
        priceNote: "~$63/ton",
        area: "Delivers to 94901",
      },
      {
        vendor: "A&S Landscape Materials",
        product: "Base rock / sand & gravel (call)",
        url: "https://ansmaterials.com/products/sand-and-gravel/",
        priceNote: "Call for yard rate",
        area: "San Rafael 94901",
        phone: "(415) 456-1381",
      },
      {
        vendor: "Lyngso Garden Materials",
        product: "Class 2 base rock (Peninsula)",
        url: "https://store.lyngsogarden.com/products/class-2-base-rock-145.html",
        priceNote: "From ~$2.95 bag / yard rates online",
        area: "San Carlos — further but published prices",
      },
    ],
  },
  {
    keys: ["drain-rock"],
    title: '¾″ clean drainage rock',
    tip: "Must be clean (no fines) for wall chimneys. Recycled drain rock is the budget pick if clean angular.",
    options: [
      {
        vendor: "North Bay Materials",
        product: "Recycled drain rock (per cu yd)",
        url: "https://www.northbaymaterials.com/product-page/recycled-drain-rock-for-drainage-backfill",
        priceNote: "~$59/cu yd",
        area: "Delivers to 94901",
        best: true,
      },
      {
        vendor: "A&S Landscape Materials",
        product: "Drain rock ¾″",
        url: "https://ansmaterials.com/?p=18423",
        priceNote: "Call for yard rate",
        area: "San Rafael 94901",
        phone: "(415) 456-1381",
      },
      {
        vendor: "North Bay Materials",
        product: "Sonoma quarry rock / drain rock",
        url: "https://www.northbaymaterials.com/product-page/sonoma-county-construction-quarry-rock",
        priceNote: "From ~$88 (varies by product)",
        area: "Santa Rosa / Sonoma delivery",
      },
      {
        vendor: "Lyngso",
        product: "¾″ crushed drain rock",
        url: "https://store.lyngsogarden.com/departments/base-rock-18.html",
        priceNote: "From ~$6.95 (bag) / yard rates",
        area: "San Carlos",
      },
    ],
  },
  {
    keys: ["bedding"],
    title: "DG / sharp sand bedding",
    tip: "1″ bedding over Class II. Utility sand or fine DG both work; avoid playground sand for structure.",
    options: [
      {
        vendor: "A&S Landscape Materials",
        product: "Sand & gravel / DG (yard)",
        url: "https://ansmaterials.com/products/sand-and-gravel/",
        priceNote: "Call — usually best local sand price",
        area: "San Rafael 94901",
        phone: "(415) 456-1381",
        best: true,
      },
      {
        vendor: "North Bay Materials",
        product: "Bay Area gold DG fines",
        url: "https://www.northbaymaterials.com/product-page/dg-gold-fines-bay-area-delivery",
        priceNote: "~$189/cu yd (premium DG)",
        area: "Delivers to 94901",
      },
      {
        vendor: "Home Depot",
        product: "Play sand / all-purpose sand (bags)",
        url: "https://www.homedepot.com/b/Building-Materials-Concrete-Cement-Masonry-Sand-Gravel/N-5yc1vZbqly",
        priceNote: "Bags ~$5–8 — only for tiny top-ups",
        area: "San Rafael #657 BOPIS",
      },
    ],
  },
  {
    keys: ["srw", "caps"],
    title: "SRW blocks + caps",
    tip: "Keystone Compact ~1 sq ft face works for ≤3–4 ft. Caps sold separately. Compare HD vs Belgard dealers.",
    options: [
      {
        vendor: "Home Depot",
        product: "Keystone Compact retaining wall block",
        url: "https://www.homedepot.com/p/Keystone-18-in-x-12-in-Concrete-Compact-Retaining-Wall-Block-KEYCO/202522888",
        priceNote: "Often ~$4–7/block (check local)",
        area: "San Rafael #657 BOPIS",
        best: true,
      },
      {
        vendor: "Home Depot",
        product: "Keystone angle cap block",
        url: "https://www.homedepot.com/p/Keystone-18-in-Concrete-Angle-Cap-Retaining-Wall-Block-KEYCAL/202522880",
        priceNote: "Caps — check local stock",
        area: "San Rafael #657 BOPIS",
      },
      {
        vendor: "Home Depot",
        product: "All retaining wall blocks",
        url: "https://www.homedepot.com/b/Outdoors-Garden-Center-Landscaping-Supplies-Hardscapes-Wall-Blocks-Retaining-Wall-Blocks/N-5yc1vZciam",
        priceNote: "From ~$2–8/block",
        area: "Compare Belgard / Pavestone",
      },
      {
        vendor: "Belgard",
        product: "Find Belgard dealer (Marin / Sonoma)",
        url: "https://www.belgard.com/where-to-buy/",
        priceNote: "Dealer quote — often better on large orders",
        area: "North Bay dealers",
      },
    ],
  },
  {
    keys: ["geogrid"],
    title: "Geogrid reinforcement",
    tip: "Front fill wall only — 2 layers. Manufacturer-matched grid (e.g. AB Grid) is safest.",
    options: [
      {
        vendor: "Allan Block",
        product: "AB Reinforcement Grid (tech sheet)",
        url: "https://www.allanblock.com/PDF/grid_tech_sheet.pdf",
        priceNote: "Spec; buy at HD/dealers",
        area: "Use with AB/Keystone systems",
      },
      {
        vendor: "Home Depot",
        product: "Search: geogrid retaining wall",
        url: "https://www.homedepot.com/s/geogrid%20retaining%20wall",
        priceNote: "Typically ~$40–80/roll",
        area: "Online / San Rafael BOPIS",
        best: true,
      },
      {
        vendor: "Amazon",
        product: "Biaxial geogrid rolls",
        url: "https://www.amazon.com/s?k=biaxial+geogrid+retaining+wall",
        priceNote: "Shop by sq ft — verify tensile rating",
        area: "Ships to 94901",
      },
    ],
  },
  {
    keys: ["filter", "geo"],
    title: "Filter fabric / geotextile weed barrier",
    tip: "Nonwoven for drain chimneys; woven for under-turf weed barrier. Buy rolls, not small packs.",
    options: [
      {
        vendor: "Home Depot",
        product: "Soil Separator 36″ × 150′ trench wrap",
        url: "https://www.homedepot.com/p/Soil-Separator-36-in-x-150-ft-Trench-Wrap-36150SSF-6/100154781",
        priceNote: "Strong value for drainage wrap",
        area: "San Rafael #657 BOPIS",
        best: true,
      },
      {
        vendor: "Home Depot",
        product: "Landscape fabric (woven weed barrier)",
        url: "https://www.homedepot.com/b/Outdoors-Garden-Center-Landscape-Supplies-Landscape-Fabric/N-5yc1vZbx6v",
        priceNote: "From ~$20–50/roll",
        area: "San Rafael #657 BOPIS",
      },
      {
        vendor: "Lowe's",
        product: "Landscape fabric & geotextile",
        url: "https://www.lowes.com/pl/Landscape-fabric-Landscape-supplies-Outdoors/4294612735",
        priceNote: "Compare roll size vs HD",
        area: "Marin / nearby Lowe's",
      },
    ],
  },
  {
    keys: ["perf"],
    title: '4″ perforated drain pipe',
    tip: "Sock-covered pipe saves a step. FLEX-Drain Pro is often the lowest $/ft online at HD (~$0.94/ft).",
    options: [
      {
        vendor: "Home Depot",
        product: "FLEX-Drain Pro 4″ × 100′ perforated",
        url: "https://www.homedepot.com/p/Amerimax-Home-Products-FLEX-Drain-Pro-4-in-x-100-ft-Black-Copolymer-Perforated-Drain-Pipe-HP4100P/308643526",
        priceNote: "~$0.94/ft · $93.78/roll",
        area: "San Rafael #657 BOPIS",
        best: true,
      },
      {
        vendor: "Home Depot",
        product: "ADS 4″ × 100′ perforated (no sock)",
        url: "https://www.homedepot.com/p/Advanced-Drainage-Systems-4-in-x-100-ft-Singlewall-Perforated-Drain-Pipe-4010100/202282466",
        priceNote: "~$1.36/ft · $136/roll",
        area: "San Rafael #657 BOPIS",
      },
      {
        vendor: "Home Depot",
        product: "ADS 4″ × 100′ perforated + filter sock",
        url: "https://www.homedepot.com/p/Advanced-Drainage-Systems-4-in-x-100-ft-Singlewall-Perforated-Drain-Pipe-with-Filter-Sock-04730100BS/100129255",
        priceNote: "~$2.07/ft · $207/roll",
        area: "Premium sock option",
      },
      {
        vendor: "Lowe's",
        product: "ADS 4″ × 100′ perforated + sock",
        url: "https://www.lowes.com/pd/ADS-4-in-x-100-ft-Corrugated-Perforated-Pipe/50163611",
        priceNote: "Compare to HD same day",
        area: "Marin / nearby Lowe's",
      },
    ],
  },
  {
    keys: ["solid", "fittings"],
    title: '4″ solid outlet pipe + fittings',
    tip: "Solid (non-perf) for the daylight run. Grab tees/couplers/end outlet same trip.",
    options: [
      {
        vendor: "Home Depot",
        product: "FLEX-Drain 4″ × 50′ solid pipe",
        url: "https://www.homedepot.com/p/Amerimax-Home-Products-FLEX-Drain-4-in-x-50-ft-Black-Copolymer-Solid-Drain-Pipe-52001/205399958",
        priceNote: "Good mid-length solid run",
        area: "San Rafael #657 BOPIS",
        best: true,
      },
      {
        vendor: "Home Depot",
        product: "All corrugated drain pipe",
        url: "https://www.homedepot.com/b/Plumbing-Drainage-Corrugated-Pipes/N-5yc1vZ1z18i3f",
        priceNote: "Mix solid + fittings",
        area: "San Rafael #657 BOPIS",
      },
      {
        vendor: "Lowe's",
        product: "Corrugated drain pipe & fittings",
        url: "https://www.lowes.com/pl/Drainage-pipes-fittings-Water-management-Outdoors/4294722317",
        priceNote: "Compare fittings kit price",
        area: "Marin / nearby Lowe's",
      },
    ],
  },
  {
    keys: ["turf"],
    title: "Artificial turf (recreational / futsal)",
    tip: "15 ft wide rolls avoid a seam on a 13 ft depth. Specialty turf shops beat HD on recreational pile.",
    options: [
      {
        vendor: "Artificial Grass Liquidators",
        product: "DIY turf rolls (multi-width)",
        url: "https://www.artificialgrassliquidators.com/",
        priceNote: "Often ~$1.50–3.50/sq ft materials",
        area: "Ships CA · multiple yards",
        best: true,
      },
      {
        vendor: "Synthetic Grass Store",
        product: "Wholesale landscape turf",
        url: "https://www.syntheticgrassstore.com/",
        priceNote: "Contractor pricing available",
        area: "Online → 94901",
      },
      {
        vendor: "Home Depot",
        product: "Artificial grass (in-store / online)",
        url: "https://www.homedepot.com/b/Outdoors-Garden-Center-Landscape-Supplies-Artificial-Grass/N-5yc1vZbx70",
        priceNote: "Convenient but usually higher $/sq ft",
        area: "San Rafael #657 BOPIS",
      },
      {
        vendor: "Install Artificial (info)",
        product: "CA cost & product guide",
        url: "https://www.installartificial.com/how/artificial-grass",
        priceNote: "Reference for CA pricing",
        area: "Research",
      },
    ],
  },
  {
    keys: ["infill"],
    title: "Silica / coated sand infill",
    tip: "Target ~1.5 lb/sq ft. Bulk 100 lb bags crush unit price vs 40 lb specialty bags.",
    options: [
      {
        vendor: "Synthetic Grass Store",
        product: "White silica sand 100 lb bag",
        url: "https://www.syntheticgrassstore.com/silica-sand-white-100-lb-bag.html",
        priceNote: "~$22 / 100 lb (~$0.22/lb)",
        area: "Ships / bulk",
        best: true,
      },
      {
        vendor: "ArtifiTurf",
        product: "Silica sand turf infill 50 lb",
        url: "https://artifiturf.com/products/silica-sand-artificial-grass-infill",
        priceNote: "50 lb bags · free ship over ~$200",
        area: "Online",
      },
      {
        vendor: "Home Depot",
        product: "Atlawnta green silica infill 40 lb",
        url: "https://www.homedepot.com/p/Atlawnta-Premium-Green-Silica-Sand-Infill-for-Artificial-Turf-and-Putting-Greens-40-lbs-Bag-TO-TLGOLFGREEN40/340757490",
        priceNote: "~$45–70 / 40 lb (premium colored)",
        area: "BOPIS — pricey per lb",
      },
      {
        vendor: "Amazon",
        product: "Coated silica infill bags",
        url: "https://www.amazon.com/Coated-Silica-Infill-Synthetic-Turf/dp/B08K1JFN35",
        priceNote: "Compare landed cost to bulk",
        area: "Ships to 94901",
      },
    ],
  },
  {
    keys: ["spikes", "seam"],
    title: "Turf spikes, seam tape & adhesive",
    tip: "Galvanized 5–6″ spikes for perimeter. Seam kit only if depth > roll width.",
    options: [
      {
        vendor: "Amazon",
        product: "Galvanized turf nails / stakes bulk",
        url: "https://www.amazon.com/s?k=galvanized+artificial+turf+nails+6+inch",
        priceNote: "Often best bulk spike price",
        area: "Ships to 94901",
        best: true,
      },
      {
        vendor: "Home Depot",
        product: "Landscape fabric staples / spikes",
        url: "https://www.homedepot.com/s/landscape%20fabric%20staples",
        priceNote: "OK for light duty; prefer longer turf nails",
        area: "San Rafael #657 BOPIS",
      },
      {
        vendor: "Synthetic Grass Store",
        product: "Seam tape & adhesive kits",
        url: "https://www.syntheticgrassstore.com/",
        priceNote: "Match tape to turf backing",
        area: "Online",
      },
    ],
  },
  {
    keys: ["trex"],
    title: "Trex sideboards",
    tip: "Enhance Basics is the budget Trex line (~$5–7/lf). Square-edge boards for sidewalls; color match house trim.",
    options: [
      {
        vendor: "Home Depot",
        product: "Trex Enhance Basics 1×6×16 Tide Pool",
        url: "https://www.homedepot.com/p/Trex-Enhance-Basics-1-in-x-6-in-x-16-ft-Tide-Pool-Grooved-Edge-Composite-Decking-Board-TP010616E2G01/337701928",
        priceNote: "Budget composite — check local $/lf",
        area: "San Rafael #657 BOPIS",
        best: true,
      },
      {
        vendor: "Home Depot",
        product: "Trex Enhance Naturals 1×6×16",
        url: "https://www.homedepot.com/p/Trex-Enhance-Naturals-1-in-x-6-in-x-16-ft-Rocky-Harbor-Grooved-Edge-Composite-Deck-Board-RH010616E2G01/310569119",
        priceNote: "Mid tier — better grain",
        area: "San Rafael #657 BOPIS",
      },
      {
        vendor: "Trex",
        product: "Official cost calculator + find stock",
        url: "https://www.trex.com/build-your-deck/planyourdeck/deck-cost-landing/",
        priceNote: "Material est. $10–27/sq ft full deck",
        area: "Retailer finder",
      },
      {
        vendor: "Home Depot",
        product: "All Trex decking (pickup today)",
        url: "https://www.homedepot.com/b/Lumber-Composites-Decking/Trex/Pick-Up-Today/N-5yc1vZbqmgZ2vyZ1z175a5",
        priceNote: "Compare lengths 12–20 ft",
        area: "San Rafael #657",
      },
    ],
  },
  {
    keys: ["beams", "hardware"],
    title: "PT posts, rails & fasteners",
    tip: "Pressure-treated 4×4 posts + 2×6 rails (ground-contact grade). Fasten with exterior structural screws — not drywall screws. San Rafael HD #657 stocks PT lumber.",
    options: [
      {
        vendor: "Home Depot",
        product: "4×4×8 #2 ground-contact PT post",
        url: "https://www.homedepot.com/p/4-in-x-4-in-x-8-ft-2-Ground-Contact-Pressure-Treated-Southern-Yellow-Pine-Wood-Post-194354/205220341",
        priceNote: "Best seller · ~$10–14 each",
        area: "San Rafael #657 BOPIS",
        best: true,
      },
      {
        vendor: "Home Depot",
        product: "2×6×10 #2 prime PT rail (WeatherShield)",
        url: "https://www.homedepot.com/p/WeatherShield-2-in-x-6-in-x-10-ft-2-Prime-Pressure-Treated-Pine-Lumber-124884/100050928",
        priceNote: "Top/bottom rails · cut to length",
        area: "San Rafael #657 BOPIS",
      },
      {
        vendor: "Home Depot",
        product: "All pressure-treated lumber (browse)",
        url: "https://www.homedepot.com/b/Lumber-Composites-Pressure-Treated-Lumber/N-5yc1vZc3sr",
        priceNote: "4×4 / 2×6 / other lengths",
        area: "San Rafael #657 BOPIS",
      },
      {
        vendor: "Home Depot",
        product: "SPAX 5/16×4 exterior Powerlags (structural)",
        url: "https://www.homedepot.com/p/SPAX-5-16-in-x-4-in-Black-Exterior-Powerlags-Torx-T-Star-Washer-Head-Wood-Lag-Structural-Screws-250-Ea-Bulk-Bit-Included-3581820801000/206442593",
        priceNote: "Exterior structural · bit included",
        area: "San Rafael #657 BOPIS",
      },
      {
        vendor: "Lowe's",
        product: "Severe Weather 4×4×8 #2 PT post",
        url: "https://www.lowes.com/pd/Severe-Weather-Common-4-in-x-4-in-x-8-ft-Actual-3-5-in-x-3-5-in-x-8-ft-2-Treated-Lumber/50121083",
        priceNote: "Price-match check vs HD",
        area: "Marin / nearby Lowe's",
      },
      {
        vendor: "Lowe's",
        product: "4×4 PT lumber collection",
        url: "https://www.lowes.com/pl/lumber-composites/pressure-treated-lumber/4-in-x-4-in/4013895981-4294401501",
        priceNote: "Other lengths if 8 ft is short",
        area: "Marin / nearby Lowe's",
      },
    ],
  },
  {
    keys: ["compactor", "level", "broom", "tools-buy", "delivery"],
    title: "Tool rentals & delivery",
    tip: "Plate compactor is non-negotiable for base. Rent at HD San Rafael; yards deliver rock for a flat fee.",
    options: [
      {
        vendor: "Home Depot Tool Rental",
        product: "Plate compactors & jumping jacks",
        url: "https://www.homedepot.com/c/tool_and_equipment_rental",
        priceNote: "Day rates often ~$70–100",
        area: "San Rafael #657",
        best: true,
      },
      {
        vendor: "United Rentals",
        product: "Compactors / laser levels",
        url: "https://www.unitedrentals.com/marketplace/equipment/compaction-equipment",
        priceNote: "Contractor rates · multi-day discounts",
        area: "Bay Area branches",
      },
      {
        vendor: "Sunbelt Rentals",
        product: "Plate compactors",
        url: "https://www.sunbeltrentals.com/equipment/earthmoving/compaction/",
        priceNote: "Compare day vs week",
        area: "Bay Area branches",
      },
      {
        vendor: "North Bay Materials",
        product: "Aggregate delivery to San Rafael",
        url: "https://www.northbaymaterials.com/landscape-materials/san-rafael-94901",
        priceNote: "Often cheaper than bag hauling",
        area: "94901 / 94903",
      },
    ],
  },
];

export function getSuppliersForItem(itemId: string): SupplierGroup | undefined {
  return SUPPLIER_GROUPS.find((g) => g.keys.includes(itemId));
}

export function getBestOption(group: SupplierGroup): BuyOption | undefined {
  return group.options.find((o) => o.best) ?? group.options[0];
}
