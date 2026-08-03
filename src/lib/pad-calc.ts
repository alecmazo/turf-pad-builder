/**
 * Turf pad / futsal terrace calculator.
 * Spec baseline: 13 ft deep × 24 ft wide, ~6 ft grade drop (cut 3 / fill 3).
 * Cut soil from the uphill wedge becomes fill on the downhill wedge — balanced.
 * Project site: San Rafael, CA 94901 (North Bay yards OK for materials).
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
  /**
   * PT frame + Trex sideboards around the pad.
   * Off when walls alone contain the turf (retaining-wall-only build).
   */
  includeSideboards?: boolean;
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
  includeSideboards: boolean;
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
  city: "San Rafael",
  zip: "94901",
  county: "Marin",
} as const;

/**
 * DIY material unit costs — North Bay (Marin / Sonoma) retail 2025–26 blended.
 * Prefer bulk yards for rock; big-box for pipe / Trex / fabric.
 */
export const UNIT_COSTS = {
  srwBlock: 5.5,
  capBlock: 6.5,
  geogridPerSqFt: 0.55,
  levelingPadCuYd: 68,
  drainageRockCuYd: 72,
  filterFabricSqFt: 0.32,
  perfPipeLf: 1.1,
  solidPipeLf: 1.4,
  fittings: 45,
  geotextileSqFt: 0.28,
  classIiCuYd: 62,
  beddingCuYd: 55,
  turfSqFt: 3.5,
  infillPerLb: 0.22,
  spikesBox: 28,
  seamTapeKit: 42,
  trexLf: 6.25,
  pt4x4Lf: 4.8,
  pt2x6Lf: 2.9,
  hardwareKit: 65,
  plateCompactorDay: 85,
  jumpingJackDay: 95,
  laserLevelDay: 55,
  wheelbarrow: 45,
  turfKnife: 22,
  powerBroomDay: 45,
  helperDay: 280,
  proWallPerFaceSqFt: 30,
  proTurfInstallSqFt: 7,
  proEarthworkCuYd: 95,
  deliveryFlat: 175,
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
  const includeSideboards = input.includeSideboards !== false;

  const areaSqFt = widthFt * depthFt;

  const wallHeightFt = gradeDropFt / 2;
  const wedgeDepth = depthFt / 2;
  const cutCuYd = round((0.5 * wallHeightFt * wedgeDepth * widthFt) / 27, 1);
  const fillCuYd = cutCuYd;
  const netImportCuYd = 0;

  const faceHeight = wallHeightFt + 0.5;
  const wallFaceSqFtOne = widthFt * faceHeight;
  const wallFaceSqFt = wallFaceSqFtOne * 2;
  const srwBlocks = Math.ceil(wallFaceSqFt);
  const capBlocks = Math.ceil((widthFt * 2) / 1.5);

  const geogridDepth = Math.min(5, depthFt * 0.4);
  const geogridSqFt = round(2 * geogridDepth * widthFt, 0);

  const levelingPadCuYd = round((2 * (0.5 * 2 * widthFt)) / 27, 2);

  const drainageRockCuYd = round((2 * (1 * faceHeight * widthFt)) / 27, 1);

  const filterFabricSqFt = round(2 * (faceHeight + 2) * (widthFt + 2), 0);

  const perforatedPipeLf = round(widthFt * 2 + 4, 0);
  const solidOutletLf = round(depthFt + wallHeightFt + 8, 0);

  const classIiCuYd = round((areaSqFt * (4 / 12)) / 27 * 1.15, 1);
  const beddingCuYd = round((areaSqFt * (1 / 12)) / 27 * 1.1, 1);
  const geotextileSqFt = round(areaSqFt * 1.15, 0);

  const turfRollWidth = depthFt <= 15 ? 15 : Math.ceil(depthFt / 5) * 5;
  const turfSqFt = round(Math.max(areaSqFt * 1.13, turfRollWidth * widthFt), 0);
  const infillLb = round(areaSqFt * 1.5, 0);

  const perimeterLf = round(2 * (widthFt + depthFt), 1);

  const courses = Math.max(1, Math.ceil(sideboardHeightIn / 5.5));
  const trexLf = includeSideboards
    ? round(perimeterLf * courses * 1.08, 0)
    : 0;
  const posts = Math.ceil(perimeterLf / 4);
  const beamLf = includeSideboards
    ? round(posts * (wallHeightFt + 1) + perimeterLf * 2, 0)
    : 0;

  const pitchPct = 1.25;
  const fallInches = round(depthFt * 12 * (pitchPct / 100), 1);

  const items: LineItem[] = [];

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
        notes: "Under 4 ft SRW, North Bay rates",
      }),
    );
  }

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
      notes:
        depthFt > 15
          ? "Depth needs a seam"
          : "Not needed if single roll covers depth",
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

  if (includeSideboards) {
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
  }

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
      "Wall face over ~3.5 ft may trigger engineering / permits in CA — check City of San Rafael Building Division.",
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
    includeSideboards,
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

export type BuildPhase = {
  id: number;
  title: string;
  steps: string[];
};

/** Build sequence — Trex frame phase omitted when sideboards are off. */
export function getBuildPhases(includeSideboards = true): BuildPhase[] {
  const orderNote = includeSideboards
    ? "Order aggregates (A&S San Rafael or North Bay Materials), SRW, pipe, fabric, Trex, turf"
    : "Order aggregates (A&S San Rafael or North Bay Materials), SRW, pipe, fabric, turf (no Trex — walls only)";

  const phases: BuildPhase[] = [
    {
      id: 1,
      title: "Before you dig",
      steps: [
        "Call 811 / DigAlert to locate utilities",
        "Confirm with City of San Rafael Building Division (fill wall + hillside + pool proximity)",
        "Stake pad corners; set string lines for grade",
        orderNote,
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
        '12 in drainage rock chimney + 4" perf collector at base',
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
        'Tie into one solid 4" outlet',
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
  ];

  if (includeSideboards) {
    phases.push({
      id: 7,
      title: "Structural frame + Trex sideboards",
      steps: [
        "Set PT posts & rails after walls are complete",
        "Nail Trex boards to the wooden beams (sideboards)",
        "Seal corners; leave expansion gaps per Trex guide",
      ],
    });
  }

  phases.push({
    id: 8,
    title: "Turf & finish",
    steps: [
      "Roll turf (pile grain consistent), cut, spike perimeter",
      includeSideboards
        ? "Spike / staple to sideboards where present"
        : "Spike perimeter into compacted base / wall top (no Trex frame)",
      "Seam only if depth exceeds roll width",
      "Brush in ~1.5 lb/sq ft silica/coated infill",
      "Add portable futsal goals (~2 m × 3 m for youth)",
    ],
  });

  return phases;
}

/** @deprecated Prefer getBuildPhases() — kept for any static imports. */
export const BUILD_PHASES = getBuildPhases(true);
