/**
 * Turf pad / futsal terrace calculator.
 * Spec baseline: 13 ft deep × 24 ft wide, ~6 ft grade drop (cut 3 / fill 3).
 * Cut soil from the uphill wedge becomes fill on the downhill wedge — balanced.
 */

export type Mode = "diy" | "pro";

export interface PadInputs {
  /** Left–right along contour (original 24 ft). Soft max ~30. */
  widthFt: number;
  /** Uphill→downhill depth (original 13 ft). Soft max ~20. */
  depthFt: number;
  /** Natural grade drop across the pad depth (original ~6 ft). */
  gradeDropFt: number;
  /** Sideboard height above finished turf (Trex face). */
  sideboardHeightIn: number;
  mode: Mode;
  /** Optional labor day rate if hiring help on DIY earthwork. */
  helperDays: number;
}

export interface LineItem {
  id: string;
  category:
    | "earthwork"
    | "walls"
    | "drainage"
    | "base"
    | "turf"
    | "sideboards"
    | "tools"
    | "labor";
  name: string;
  qty: number;
  unit: string;
  unitCost: number;
  total: number;
  notes?: string;
  optional?: boolean;
}

export interface PadResult {
  areaSqFt: number;
  cutCuYd: number;
  fillCuYd: number;
  netImportCuYd: number;
  wallHeightFt: number;
  wallFaceSqFt: number;
  perimeterLf: number;
  geogridSqFt: number;
  levelingPadCuYd: number;
  drainageRockCuYd: number;
  filterFabricSqFt: number;
  perforatedPipeLf: number;
  solidOutletLf: number;
  classIiCuYd: number;
  beddingCuYd: number;
  geotextileSqFt: number;
  turfSqFt: number;
  infillLb: number;
  srwBlocks: number;
  capBlocks: number;
  trexLf: number;
  beamLf: number;
  items: LineItem[];
  subtotal: number;
  contingency: number;
  grandTotal: number;
  costPerSqFt: number;
  withinEnvelope: boolean;
  warnings: string[];
  pitchPct: number;
  fallInches: number;
}

/** Soft site envelope from homeowner (hill working space). */
export const SITE = {
  maxWidthFt: 30,
  maxDepthFt: 20,
  minWidthFt: 12,
  minDepthFt: 10,
  defaultWidth: 24,
  defaultDepth: 13,
  defaultGrade: 6,
  defaultSideboardIn: 6,
} as const;

/**
 * DIY material unit costs — Bay Area / NorCal retail 2025–26 blended averages.
 * Sources: Home Depot / local yards, CA turf DIY guides, SRW retail, Trex Enhance.
 */
export const UNIT_COSTS = {
  srwBlock: 5.5, // ~1 sq ft face block
  capBlock: 6.5,
  geogridPerSqFt: 0.55,
  levelingPadCuYd: 72, // Class II delivered
  drainageRockCuYd: 78, // ¾" clean
  filterFabricSqFt: 0.32,
  perfPipeLf: 1.35,
  solidPipeLf: 1.55,
  fittings: 45, // tees, couplings, outlets
  geotextileSqFt: 0.28,
  classIiCuYd: 65,
  beddingCuYd: 58, // DG / sharp sand
  turfSqFt: 3.75, // recreational PET turf materials
  infillPerLb: 0.22, // silica / coated sand
  spikesBox: 28, // ~250 spikes
  seamTapeKit: 42,
  trexLf: 6.25, // Enhance Basics ~ per linear ft of board
  pt4x4Lf: 4.8,
  pt2x6Lf: 2.9,
  hardwareKit: 65, // lag screws, adhesive, concrete anchors
  plateCompactorDay: 85,
  jumpingJackDay: 95,
  laserLevelDay: 55,
  wheelbarrow: 45, // buy
  turfKnife: 22,
  powerBroomDay: 45,
  helperDay: 280, // optional day labor
  // Pro labor multipliers applied in calc for walls + turf install
  proWallPerFaceSqFt: 28, // installed SRW under 4 ft, materials+labor blended add
  proTurfInstallSqFt: 6.5, // labor only on top of materials
  proEarthworkCuYd: 85, // machine grade / compact
  deliveryFlat: 185,
} as const;

function round(n: number, d = 1) {
  const p = 10 ** d;
  return Math.round(n * p) / p;
}

function line(
  partial: Omit<LineItem, "total"> & { total?: number },
): LineItem {
  const total = partial.total ?? partial.qty * partial.unitCost;
  return { ...partial, total: round(total, 2) };
}

export function calcPad(input: PadInputs): PadResult {
  const widthFt = clamp(input.widthFt, 8, 40);
  const depthFt = clamp(input.depthFt, 8, 30);
  const gradeDropFt = clamp(input.gradeDropFt, 2, 10);
  const sideboardHeightIn = clamp(input.sideboardHeightIn, 3, 12);
  const mode = input.mode;

  const areaSqFt = widthFt * depthFt;

  // Balanced cut/fill wedges: 0 at centerline, max at edges.
  // Each wedge depth = depth/2, height = gradeDrop/2.
  const wallHeightFt = gradeDropFt / 2;
  const wedgeDepth = depthFt / 2;
  const cutCuYd = round((0.5 * wallHeightFt * wedgeDepth * widthFt) / 27, 1);
  const fillCuYd = cutCuYd;
  const netImportCuYd = 0;

  // Walls: 3 ft exposed + ~10% embed → face height ≈ wallHeight + 0.5
  const faceHeight = wallHeightFt + 0.5;
  const wallFaceSqFtOne = widthFt * faceHeight;
  const wallFaceSqFt = wallFaceSqFtOne * 2;
  const srwBlocks = Math.ceil(wallFaceSqFt); // ~1 sq ft/block
  const capBlocks = Math.ceil((widthFt * 2) / 1.5); // ~16" caps

  // Geogrid: front (fill) wall only — 2 layers × ~5 ft deep × width
  const geogridDepth = Math.min(5, depthFt * 0.4);
  const geogridSqFt = round(2 * geogridDepth * widthFt, 0);

  // Leveling pads under both walls: 6" × 24" × length
  const levelingPadCuYd = round((2 * (0.5 * 2 * widthFt)) / 27, 2);

  // Drainage chimneys: 12" thick × full face height × width, both walls
  const drainageRockCuYd = round(
    (2 * (1 * faceHeight * widthFt)) / 27,
    1,
  );

  const filterFabricSqFt = round(2 * (faceHeight + 2) * (widthFt + 2), 0);

  // Perforated runs along both walls + solid outlet down left side
  const perforatedPipeLf = round(widthFt * 2 + 4, 0); // + stub fittings
  const solidOutletLf = round(depthFt + wallHeightFt + 8, 0); // daylights below

  // Turf base over pad
  const classIiCuYd = round((areaSqFt * (4 / 12)) / 27 * 1.15, 1); // 4" + compact
  const beddingCuYd = round((areaSqFt * (1 / 12)) / 27 * 1.1, 1);
  const geotextileSqFt = round(areaSqFt * 1.15, 0);

  // Turf: 15 ft rolls preferred when depth ≤ 15; else seam
  const turfRollWidth = depthFt <= 15 ? 15 : Math.ceil(depthFt / 5) * 5;
  const turfSqFt = round(Math.max(areaSqFt * 1.13, turfRollWidth * widthFt), 0);
  const infillLb = round(areaSqFt * 1.5, 0);

  const perimeterLf = round(2 * (widthFt + depthFt), 1);

  // Trex sideboards: all 4 sides, stacked courses if tall
  const courses = Math.max(1, Math.ceil(sideboardHeightIn / 5.5));
  const trexLf = round(perimeterLf * courses * 1.08, 0);
  // Structural: PT posts every 4 ft + top/bottom rails
  const posts = Math.ceil(perimeterLf / 4);
  const beamLf = round(posts * (wallHeightFt + 1) + perimeterLf * 2, 0);

  const pitchPct = 1.25; // mid of 1–1.5% toward front collector
  const fallInches = round(depthFt * 12 * (pitchPct / 100), 1);

  const items: LineItem[] = [];

  // Earthwork
  items.push(
    line({
      id: "cut-fill",
      category: "earthwork",
      name: "Cut & fill (balanced, native)",
      qty: cutCuYd,
      unit: "cu yd",
      unitCost: 0,
      notes: "Cut uphill wedge → fill downhill. No dirt import.",
    }),
  );
  if (mode === "pro") {
    items.push(
      line({
        id: "earth-labor",
        category: "earthwork",
        name: "Machine grade & compact",
        qty: cutCuYd + fillCuYd,
        unit: "cu yd",
        unitCost: UNIT_COSTS.proEarthworkCuYd,
        notes: "Mini-ex + plate; includes haul within site",
      }),
    );
  }

  // Walls
  items.push(
    line({
      id: "srw",
      category: "walls",
      name: "SRW blocks (both walls)",
      qty: srwBlocks,
      unit: "ea",
      unitCost: UNIT_COSTS.srwBlock,
      notes: `~${round(faceHeight, 1)} ft face × ${widthFt} ft × 2`,
    }),
  );
  items.push(
    line({
      id: "caps",
      category: "walls",
      name: "Cap blocks (adhesive-set)",
      qty: capBlocks,
      unit: "ea",
      unitCost: UNIT_COSTS.capBlock,
    }),
  );
  items.push(
    line({
      id: "geogrid",
      category: "walls",
      name: "Geogrid (front fill wall)",
      qty: geogridSqFt,
      unit: "sq ft",
      unitCost: UNIT_COSTS.geogridPerSqFt,
      notes: "2 layers, tied into compacted fill",
    }),
  );
  items.push(
    line({
      id: "level-pad",
      category: "walls",
      name: "Wall leveling pad (Class II)",
      qty: levelingPadCuYd,
      unit: "cu yd",
      unitCost: UNIT_COSTS.levelingPadCuYd,
      notes: "6 in × 24 in under each wall",
    }),
  );
  if (mode === "pro") {
    items.push(
      line({
        id: "wall-labor",
        category: "walls",
        name: "Wall install labor",
        qty: wallFaceSqFt,
        unit: "sq ft face",
        unitCost: UNIT_COSTS.proWallPerFaceSqFt,
        notes: "Under 4 ft SRW, CA rates",
      }),
    );
  }

  // Drainage
  items.push(
    line({
      id: "drain-rock",
      category: "drainage",
      name: '¾" clean drainage rock',
      qty: drainageRockCuYd,
      unit: "cu yd",
      unitCost: UNIT_COSTS.drainageRockCuYd,
      notes: "12 in chimney behind both walls",
    }),
  );
  items.push(
    line({
      id: "filter",
      category: "drainage",
      name: "Filter / separation fabric",
      qty: filterFabricSqFt,
      unit: "sq ft",
      unitCost: UNIT_COSTS.filterFabricSqFt,
    }),
  );
  items.push(
    line({
      id: "perf",
      category: "drainage",
      name: '4" perforated pipe (interceptor + collector)',
      qty: perforatedPipeLf,
      unit: "lf",
      unitCost: UNIT_COSTS.perfPipeLf,
      notes: "~1% pitch to left, tied to solid outlet",
    }),
  );
  items.push(
    line({
      id: "solid",
      category: "drainage",
      name: '4" solid outlet pipe',
      qty: solidOutletLf,
      unit: "lf",
      unitCost: UNIT_COSTS.solidPipeLf,
      notes: "Daylights downhill (or ties to existing drain)",
    }),
  );
  items.push(
    line({
      id: "fittings",
      category: "drainage",
      name: "Drain fittings & outlet kit",
      qty: 1,
      unit: "kit",
      unitCost: UNIT_COSTS.fittings,
    }),
  );

  // Base
  items.push(
    line({
      id: "geo",
      category: "base",
      name: "Woven geotextile (weed barrier)",
      qty: geotextileSqFt,
      unit: "sq ft",
      unitCost: UNIT_COSTS.geotextileSqFt,
    }),
  );
  items.push(
    line({
      id: "class2",
      category: "base",
      name: "Class II road base (4 in compacted)",
      qty: classIiCuYd,
      unit: "cu yd",
      unitCost: UNIT_COSTS.classIiCuYd,
      notes: `~1–1.5% pitch → front drain (${fallInches}" fall)`,
    }),
  );
  items.push(
    line({
      id: "bedding",
      category: "base",
      name: "DG / sharp sand bedding (1 in)",
      qty: beddingCuYd,
      unit: "cu yd",
      unitCost: UNIT_COSTS.beddingCuYd,
    }),
  );

  // Turf
  items.push(
    line({
      id: "turf",
      category: "turf",
      name: "Artificial turf (recreational / futsal)",
      qty: turfSqFt,
      unit: "sq ft",
      unitCost: UNIT_COSTS.turfSqFt,
      notes: "~13% waste / roll width allowance",
    }),
  );
  items.push(
    line({
      id: "infill",
      category: "turf",
      name: "Silica / coated sand infill",
      qty: infillLb,
      unit: "lb",
      unitCost: UNIT_COSTS.infillPerLb,
      notes: "~1.5 lb/sq ft, brushed in",
    }),
  );
  items.push(
    line({
      id: "spikes",
      category: "turf",
      name: "Galvanized turf spikes (5–6\")",
      qty: Math.max(1, Math.ceil(perimeterLf / 74)),
      unit: "box",
      unitCost: UNIT_COSTS.spikesBox,
    }),
  );
  items.push(
    line({
      id: "seam",
      category: "turf",
      name: "Seam tape + adhesive",
      qty: depthFt > 15 ? 1 : 0,
      unit: "kit",
      unitCost: UNIT_COSTS.seamTapeKit,
      notes: depthFt > 15 ? "Depth needs a seam" : "Not needed if single roll covers depth",
      optional: depthFt <= 15,
    }),
  );
  if (mode === "pro") {
    items.push(
      line({
        id: "turf-labor",
        category: "turf",
        name: "Turf install labor",
        qty: areaSqFt,
        unit: "sq ft",
        unitCost: UNIT_COSTS.proTurfInstallSqFt,
      }),
    );
  }

  // Sideboards — Trex on PT frame
  items.push(
    line({
      id: "beams",
      category: "sideboards",
      name: "PT structural posts & rails",
      qty: beamLf,
      unit: "lf",
      unitCost: UNIT_COSTS.pt4x4Lf * 0.55 + UNIT_COSTS.pt2x6Lf * 0.45,
      notes: "Posts ~4 ft o.c., top/bottom rails",
    }),
  );
  items.push(
    line({
      id: "trex",
      category: "sideboards",
      name: "Trex sideboards (nailed to frame)",
      qty: trexLf,
      unit: "lf",
      unitCost: UNIT_COSTS.trexLf,
      notes: `${courses} course(s) @ ${sideboardHeightIn}" face`,
    }),
  );
  items.push(
    line({
      id: "hardware",
      category: "sideboards",
      name: "Fasteners, adhesive, anchors",
      qty: 1,
      unit: "kit",
      unitCost: UNIT_COSTS.hardwareKit,
    }),
  );

  // Tools / rentals (DIY)
  if (mode === "diy") {
    items.push(
      line({
        id: "compactor",
        category: "tools",
        name: "Plate compactor rental (2 days)",
        qty: 2,
        unit: "day",
        unitCost: UNIT_COSTS.plateCompactorDay,
      }),
    );
    items.push(
      line({
        id: "level",
        category: "tools",
        name: "Laser / transit level rental",
        qty: 2,
        unit: "day",
        unitCost: UNIT_COSTS.laserLevelDay,
      }),
    );
    items.push(
      line({
        id: "broom",
        category: "tools",
        name: "Power broom rental (infill)",
        qty: 1,
        unit: "day",
        unitCost: UNIT_COSTS.powerBroomDay,
      }),
    );
    items.push(
      line({
        id: "tools-buy",
        category: "tools",
        name: "Wheelbarrow + turf knife",
        qty: 1,
        unit: "set",
        unitCost: UNIT_COSTS.wheelbarrow + UNIT_COSTS.turfKnife,
      }),
    );
    if (input.helperDays > 0) {
      items.push(
        line({
          id: "helpers",
          category: "labor",
          name: "Day labor helpers",
          qty: input.helperDays,
          unit: "day",
          unitCost: UNIT_COSTS.helperDay,
          notes: "Optional — earthwork & base are the heavy lifts",
        }),
      );
    }
  }

  items.push(
    line({
      id: "delivery",
      category: "tools",
      name: "Aggregate & material delivery",
      qty: 1,
      unit: "trip",
      unitCost: UNIT_COSTS.deliveryFlat,
    }),
  );

  // Filter zero-qty optional
  const active = items.filter((i) => i.qty > 0);
  const subtotal = round(
    active.reduce((s, i) => s + i.total, 0),
    0,
  );
  const contingency = round(subtotal * 0.1, 0);
  const grandTotal = subtotal + contingency;
  const costPerSqFt = areaSqFt > 0 ? round(grandTotal / areaSqFt, 2) : 0;

  const warnings: string[] = [];
  if (widthFt > SITE.maxWidthFt || depthFt > SITE.maxDepthFt) {
    warnings.push(
      `Exceeds stated hill envelope (~${SITE.maxWidthFt} × ${SITE.maxDepthFt} ft). Confirm usable space on site.`,
    );
  }
  if (wallHeightFt > 3.5) {
    warnings.push(
      "Wall face over ~3.5 ft may trigger engineering / permits in CA — check Santa Rosa / Sonoma County building dept.",
    );
  }
  if (wallHeightFt >= 4) {
    warnings.push(
      "Walls ≥ 4 ft (footing-to-top) commonly need a permit and often a PE design.",
    );
  }
  warnings.push(
    "Call 811 / DigAlert before digging. Keep the front wall independent of the existing pool wall — do not surcharge it.",
  );
  if (depthFt * 2 < gradeDropFt * 3) {
    warnings.push(
      "Very steep grade relative to depth — verify cut stability and wall manufacturer charts.",
    );
  }

  const withinEnvelope =
    widthFt <= SITE.maxWidthFt && depthFt <= SITE.maxDepthFt;

  return {
    areaSqFt: round(areaSqFt, 0),
    cutCuYd,
    fillCuYd,
    netImportCuYd,
    wallHeightFt: round(wallHeightFt, 2),
    wallFaceSqFt: round(wallFaceSqFt, 0),
    perimeterLf,
    geogridSqFt,
    levelingPadCuYd,
    drainageRockCuYd,
    filterFabricSqFt,
    perforatedPipeLf,
    solidOutletLf,
    classIiCuYd,
    beddingCuYd,
    geotextileSqFt,
    turfSqFt,
    infillLb,
    srwBlocks,
    capBlocks,
    trexLf,
    beamLf,
    items: active,
    subtotal,
    contingency,
    grandTotal,
    costPerSqFt,
    withinEnvelope,
    warnings,
    pitchPct,
    fallInches,
  };
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export const CATEGORY_LABELS: Record<LineItem["category"], string> = {
  earthwork: "Earthwork",
  walls: "Retaining walls",
  drainage: "Drainage",
  base: "Turf base",
  turf: "Artificial turf",
  sideboards: "Trex sideboards & frame",
  tools: "Tools & delivery",
  labor: "Labor",
};

export const BUILD_PHASES = [
  {
    id: 1,
    title: "Before you dig",
    steps: [
      "Call 811 / DigAlert for utility locate",
      "Confirm with Santa Rosa / Sonoma County building dept (fill wall + hillside + pool proximity)",
      "Stake pad corners; set string lines for grade",
      "Order aggregates, SRW, pipe, fabric, Trex, turf",
    ],
  },
  {
    id: 2,
    title: "Cut & fill terrace",
    steps: [
      "Cut the uphill wedge (native soil) to finished subgrade",
      "Place fill downhill in 6–8 in lifts; compact each to ~90–95%",
      "Reuse cut soil only if clean & non-organic; else import engineered fill for structural zone",
      "Verify cut/fill balance — no dirt import when soil is good",
    ],
  },
  {
    id: 3,
    title: "Front wall (holds fill)",
    steps: [
      "Excavate leveling pad; place & compact 6 in Class II",
      "Set base course ~6 in embedded; build SRW to grade",
      "Install geogrid layers into compacted fill (~5 ft deep)",
      "12 in drainage rock chimney + 4\" perf collector at base",
      "Keep footing independent of existing pool wall",
    ],
  },
  {
    id: 4,
    title: "Back wall (cut face)",
    steps: [
      "Leveling pad + SRW gravity wall into native cut",
      "Drainage chimney + interceptor perf (hillside water)",
      "Geogrid usually none/minimal at 3 ft — check manufacturer chart",
    ],
  },
  {
    id: 5,
    title: "Drainage outlet",
    steps: [
      "Pitch both perf runs ~1% to the left",
      "Tie into one solid 4\" outlet",
      "Daylight downhill below the pad (or tie to existing drain)",
    ],
  },
  {
    id: 6,
    title: "Turf base",
    steps: [
      "Woven geotextile over subgrade",
      "4 in Class II, compact in lifts, ~1–1.5% fall to front drain",
      "1 in DG / sharp sand bedding, screeded flat",
    ],
  },
  {
    id: 7,
    title: "Structural frame + Trex sideboards",
    steps: [
      "Set PT posts & rails after walls are complete",
      "Nail Trex boards to the wooden beams (sideboards)",
      "Seal corners; leave expansion gaps per Trex guide",
    ],
  },
  {
    id: 8,
    title: "Turf & finish",
    steps: [
      "Roll turf (pile grain consistent), cut, spike perimeter",
      "Seam only if depth exceeds roll width",
      "Brush in ~1.5 lb/sq ft silica/coated infill",
      "Add portable futsal goals (~2 m × 3 m for youth)",
    ],
  },
] as const;
