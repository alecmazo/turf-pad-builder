/**
 * Fern property — regulation tennis court + multi-sport (futsal with net down).
 * Playing lines: 78 × 36 ft doubles. Full pad with runback defaults 120 × 60 ft.
 * Cut/fill leveling scaled from the Peacock terrace concept (larger pad).
 */

export type CourtMode = "diy" | "pro";
export type CourtSurface = "acrylic" | "modular" | "turf";
export type FenceHeightFt = 8 | 10 | 12;

export interface CourtInputs {
  /** Overall paved/surfaced length (baseline ends) incl. runback. */
  overallLengthFt: number;
  /** Overall paved/surfaced width (sidelines) incl. runback. */
  overallWidthFt: number;
  /** Natural grade drop across court length (baseline direction). */
  gradeDropFt: number;
  surface: CourtSurface;
  mode: CourtMode;
  includeFence: boolean;
  fenceHeightFt: FenceHeightFt;
  /** Black vinyl-coated chain link (vs galvanized). */
  fenceBlackVinyl: boolean;
  includeWindscreen: boolean;
  includeDoubleGate: boolean;
  /** Portable futsal goals for multi-sport when net is down. */
  includeFutsalGoals: boolean;
  includeHelpers: boolean;
  helperCount: number;
  helperDays: number;
}

export interface CourtLineItem {
  id: string;
  category:
    | "earthwork"
    | "base"
    | "surface"
    | "lines"
    | "net"
    | "fence"
    | "multisport"
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

export interface CourtResult {
  playAreaSqFt: number;
  overallAreaSqFt: number;
  cutCuYd: number;
  fillCuYd: number;
  netImportCuYd: number;
  classIiCuYd: number;
  asphaltOrSlabCuYd: number;
  fenceLf: number;
  windscreenSqFt: number;
  surfaceLabel: string;
  surfaceBlurb: string;
  items: CourtLineItem[];
  subtotal: number;
  contingency: number;
  grandTotal: number;
  costPerSqFt: number;
  warnings: string[];
  pitchPct: number;
  fallInches: number;
  helperPersonDays: number;
  withinRegulationPad: boolean;
}

/** Fern site + court geometry constants. */
export const FERN = {
  property: "Fern",
  city: "San Rafael",
  zip: "94901",
  /** ITF doubles playing lines */
  playLengthFt: 78,
  playWidthFt: 36,
  singlesWidthFt: 27,
  /** Recreational full pad with runback (common US residential) */
  defaultLengthFt: 126,
  defaultWidthFt: 64,
  minLengthFt: 110,
  minWidthFt: 56,
  maxLengthFt: 140,
  maxWidthFt: 70,
  defaultGradeDropFt: 4,
  netHeightIn: 36, // center
  netHeightPostIn: 42,
} as const;

export const SURFACE_OPTIONS: {
  id: CourtSurface;
  name: string;
  short: string;
  blurb: string;
  pros: string[];
  multiSport: string;
}[] = [
  {
    id: "acrylic",
    name: "Acrylic hard court",
    short: "Classic tennis",
    blurb:
      "Asphalt or concrete slab + acrylic color-coat system (DecoTurf / Laykold style). True bounce, tournament look.",
    pros: [
      "Best traditional tennis feel",
      "Durable color lines",
      "Low maintenance once cured",
    ],
    multiSport:
      "Great tennis; futsal OK with portable goals at fence ends when net is down (hard underfoot).",
  },
  {
    id: "modular",
    name: "Modular sport tiles",
    short: "Multi-sport tiles",
    blurb:
      "Interlocking polypropylene sport tiles over a compacted base (Sport Court–style). Drains well, cushions impact.",
    pros: [
      "Fast DIY-friendly install",
      "Excellent multi-sport / futsal",
      "Repair single tiles later",
    ],
    multiSport:
      "Ideal when the court doubles as futsal / pickleball / kids sports with net down.",
  },
  {
    id: "turf",
    name: "Multi-sport artificial turf",
    short: "Sport turf",
    blurb:
      "Short-pile recreational turf with inlaid or painted tennis lines over Class II + bedding. Soft underfoot.",
    pros: [
      "Softest for kids & futsal",
      "Quieter ball",
      "Green look year-round",
    ],
    multiSport:
      "Best for futsal on the full pad + open play; tennis bounce is slower than hard court.",
  },
];

/**
 * Realistic on-court colors for plan / live preview.
 * Acrylic: US-club blue play + green runback · Modular: PP tile green grid · Turf: short-pile grass.
 */
export const SURFACE_LOOK: Record<
  CourtSurface,
  {
    play: string;
    playInner: string;
    runback: string;
    line: string;
    net: string;
    netPost: string;
    fence: string;
    label: string;
    texture: "smooth" | "tile" | "pile";
  }
> = {
  acrylic: {
    // Hard-court acrylic: medium blue play, forest green out-of-play (common club finish)
    play: "#3A7BC8",
    playInner: "#4590D8",
    runback: "#2A5C3A",
    line: "#F7F7F2",
    net: "#1A1A1C",
    netPost: "#2C2C30",
    fence: "#3D3D42",
    label: "Acrylic · blue play / green runback",
    texture: "smooth",
  },
  modular: {
    // Sport-court PP tiles: vivid green modules with visible seams
    play: "#2F9B55",
    playInner: "#38A85F",
    runback: "#248A48",
    line: "#FFFFFF",
    net: "#1A1A1C",
    netPost: "#2C2C30",
    fence: "#3D3D42",
    label: "Modular · green sport tiles",
    texture: "tile",
  },
  turf: {
    // Short-pile multi-sport turf: natural grass greens + chalk lines
    play: "#4F9A45",
    playInner: "#5AAB50",
    runback: "#458A3C",
    line: "#F4F4EE",
    net: "#1A1A1C",
    netPost: "#2C2C30",
    fence: "#3D3D42",
    label: "Turf · short-pile green",
    texture: "pile",
  },
};

const UNIT = {
  class2CuYd: 58,
  beddingCuYd: 72,
  asphaltTon: 140, // installed-material blend DIY haul
  concreteCuYd: 185,
  acrylicSqFt: 2.4, // resurfacer + color + lines materials
  modularSqFt: 4.75,
  turfSqFt: 3.1,
  infillLb: 0.18,
  geotextileSqFt: 0.28,
  netSystem: 420,
  linePaintKit: 180,
  fenceLf8: 28,
  fenceLf10: 34,
  fenceLf12: 42,
  fenceBlackPremium: 1.18,
  windscreenSqFt: 1.35,
  gateSingle: 380,
  gateDouble: 720,
  futsalGoalsPair: 650,
  plateCompactorDay: 85,
  laserLevelDay: 55,
  helperDay: 280,
  delivery: 450,
  proGradeCuYd: 55,
  proSurfaceAcrylic: 6.5,
  proSurfaceModular: 8.5,
  proSurfaceTurf: 7.25,
  proFenceLf: 45,
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
function round(n: number, d = 1) {
  const p = 10 ** d;
  return Math.round(n * p) / p;
}
function line(
  partial: Omit<CourtLineItem, "total"> & { total?: number },
): CourtLineItem {
  const total = partial.total ?? partial.qty * partial.unitCost;
  return { ...partial, total: round(total, 2) };
}

export function calcCourt(input: CourtInputs): CourtResult {
  const lengthFt = clamp(
    input.overallLengthFt,
    FERN.minLengthFt,
    FERN.maxLengthFt,
  );
  const widthFt = clamp(
    input.overallWidthFt,
    FERN.minWidthFt,
    FERN.maxWidthFt,
  );
  const gradeDropFt = clamp(input.gradeDropFt, 1, 10);
  const surface = input.surface;
  const mode = input.mode;

  const overallAreaSqFt = lengthFt * widthFt;
  const playAreaSqFt = FERN.playLengthFt * FERN.playWidthFt;

  // Balanced cut/fill wedge along length (same model as Peacock, larger footprint)
  const halfDrop = gradeDropFt / 2;
  const cutCuYd = round((0.5 * halfDrop * (lengthFt / 2) * widthFt) / 27, 1);
  const fillCuYd = cutCuYd;
  const netImportCuYd = 0;

  const classIiDepthIn = surface === "modular" ? 4 : surface === "turf" ? 4 : 6;
  const classIiCuYd = round(
    (overallAreaSqFt * (classIiDepthIn / 12)) / 27 * 1.12,
    1,
  );

  // Structural wearing course under acrylic; modular/turf sit on base+bedding
  const asphaltOrSlabCuYd =
    surface === "acrylic"
      ? round((overallAreaSqFt * (3 / 12)) / 27 * 1.08, 1)
      : 0;
  const beddingCuYd =
    surface === "turf" || surface === "modular"
      ? round((overallAreaSqFt * (1 / 12)) / 27 * 1.1, 1)
      : 0;

  const perimeterLf = round(2 * (lengthFt + widthFt), 0);
  const fenceLf = input.includeFence ? perimeterLf : 0;
  const windscreenSqFt =
    input.includeFence && input.includeWindscreen
      ? round(perimeterLf * input.fenceHeightFt * 0.85, 0)
      : 0;

  const includeHelpers =
    mode === "diy" && input.includeHelpers && input.helperDays > 0;
  const helperCount = clamp(Math.round(input.helperCount || 1), 1, 8);
  const helperDays = includeHelpers
    ? clamp(Math.round(input.helperDays), 1, 30)
    : 0;
  const helperPersonDays = includeHelpers ? helperCount * helperDays : 0;

  const surf = SURFACE_OPTIONS.find((s) => s.id === surface)!;
  const pitchPct = 0.8; // gentle sheet drainage
  const fallInches = round(lengthFt * 12 * (pitchPct / 100), 1);

  const fenceUnit =
    (input.fenceHeightFt === 8
      ? UNIT.fenceLf8
      : input.fenceHeightFt === 10
        ? UNIT.fenceLf10
        : UNIT.fenceLf12) * (input.fenceBlackVinyl ? UNIT.fenceBlackPremium : 1);

  const items: CourtLineItem[] = [];

  items.push(
    line({
      id: "cut-fill",
      category: "earthwork",
      name: "Cut & fill (balanced pad)",
      qty: cutCuYd,
      unit: "cu yd",
      unitCost: 0,
      notes: `Level ~${gradeDropFt} ft drop across ${lengthFt} ft · reuse clean cut as fill`,
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
        unitCost: UNIT.proGradeCuYd,
        notes: "Dozer / mini-ex + roller on large pad",
      }),
    );
  }

  items.push(
    line({
      id: "geo",
      category: "base",
      name: "Woven geotextile separator",
      qty: round(overallAreaSqFt * 1.1, 0),
      unit: "sq ft",
      unitCost: UNIT.geotextileSqFt,
    }),
  );
  items.push(
    line({
      id: "class2",
      category: "base",
      name: `Class II road base (${classIiDepthIn}″ compacted)`,
      qty: classIiCuYd,
      unit: "cu yd",
      unitCost: UNIT.class2CuYd,
      notes: "Primary structural pad — compact in lifts",
    }),
  );
  if (beddingCuYd > 0) {
    items.push(
      line({
        id: "bedding",
        category: "base",
        name: "DG / fine bedding",
        qty: beddingCuYd,
        unit: "cu yd",
        unitCost: UNIT.beddingCuYd,
        notes: "Screed layer under tiles or turf",
      }),
    );
  }
  if (asphaltOrSlabCuYd > 0) {
    items.push(
      line({
        id: "asphalt",
        category: "base",
        name: "Asphalt wearing course (~3″)",
        qty: round(asphaltOrSlabCuYd * 2.05, 1), // ~tons
        unit: "ton",
        unitCost: UNIT.asphaltTon,
        notes: "Or 4″ concrete slab alternative — quote local plant",
      }),
    );
  }

  if (surface === "acrylic") {
    items.push(
      line({
        id: "acrylic",
        category: "surface",
        name: "Acrylic resurfacer + color + finish",
        qty: overallAreaSqFt,
        unit: "sq ft",
        unitCost: UNIT.acrylicSqFt,
        notes: "2–3 coats resurfacer, 2 color, clear — DIY materials blend",
      }),
    );
    if (mode === "pro") {
      items.push(
        line({
          id: "acrylic-labor",
          category: "surface",
          name: "Pro acrylic system install",
          qty: overallAreaSqFt,
          unit: "sq ft",
          unitCost: UNIT.proSurfaceAcrylic,
        }),
      );
    }
  } else if (surface === "modular") {
    items.push(
      line({
        id: "modular",
        category: "surface",
        name: "Modular sport court tiles",
        qty: overallAreaSqFt,
        unit: "sq ft",
        unitCost: UNIT.modularSqFt,
        notes: "Interlocking PP tiles · multi-sport rated",
      }),
    );
    if (mode === "pro") {
      items.push(
        line({
          id: "modular-labor",
          category: "surface",
          name: "Pro tile install",
          qty: overallAreaSqFt,
          unit: "sq ft",
          unitCost: UNIT.proSurfaceModular,
        }),
      );
    }
  } else {
    items.push(
      line({
        id: "turf",
        category: "surface",
        name: "Multi-sport artificial turf",
        qty: round(overallAreaSqFt * 1.1, 0),
        unit: "sq ft",
        unitCost: UNIT.turfSqFt,
        notes: "Short pile · includes waste",
      }),
    );
    items.push(
      line({
        id: "infill",
        category: "surface",
        name: "Silica / coated infill",
        qty: round(overallAreaSqFt * 1.5, 0),
        unit: "lb",
        unitCost: UNIT.infillLb,
      }),
    );
    if (mode === "pro") {
      items.push(
        line({
          id: "turf-labor",
          category: "surface",
          name: "Pro turf install",
          qty: overallAreaSqFt,
          unit: "sq ft",
          unitCost: UNIT.proSurfaceTurf,
        }),
      );
    }
  }

  items.push(
    line({
      id: "lines",
      category: "lines",
      name: "Tennis line kit / paint + templates",
      qty: 1,
      unit: "kit",
      unitCost: UNIT.linePaintKit,
      notes: "Regulation doubles + singles · white",
    }),
  );
  items.push(
    line({
      id: "net",
      category: "net",
      name: "Tennis net + posts + center strap",
      qty: 1,
      unit: "set",
      unitCost: UNIT.netSystem,
      notes: "Removable / drop-down for multi-sport",
    }),
  );

  if (input.includeFence) {
    items.push(
      line({
        id: "fence",
        category: "fence",
        name: `${input.fenceHeightFt}′ chain-link fence (${input.fenceBlackVinyl ? "black vinyl" : "galvanized"})`,
        qty: fenceLf,
        unit: "lf",
        unitCost: round(fenceUnit, 2),
        notes: "Terminals, line posts, top rail, fabric, ties",
      }),
    );
    items.push(
      line({
        id: "gate-s",
        category: "fence",
        name: "Walk gate (4′)",
        qty: 1,
        unit: "ea",
        unitCost: UNIT.gateSingle,
      }),
    );
    if (input.includeDoubleGate) {
      items.push(
        line({
          id: "gate-d",
          category: "fence",
          name: "Double equipment gate (10′)",
          qty: 1,
          unit: "ea",
          unitCost: UNIT.gateDouble,
          notes: "Equipment / mower access",
        }),
      );
    }
    if (input.includeWindscreen) {
      items.push(
        line({
          id: "windscreen",
          category: "fence",
          name: "Fence windscreen (privacy / wind)",
          qty: windscreenSqFt,
          unit: "sq ft",
          unitCost: UNIT.windscreenSqFt,
          notes: "~85% of fence face · grommets + ties",
        }),
      );
    }
    if (mode === "pro") {
      items.push(
        line({
          id: "fence-labor",
          category: "fence",
          name: "Pro fence install",
          qty: fenceLf,
          unit: "lf",
          unitCost: UNIT.proFenceLf,
        }),
      );
    }
  }

  if (input.includeFutsalGoals) {
    items.push(
      line({
        id: "futsal-goals",
        category: "multisport",
        name: "Portable futsal goals (pair)",
        qty: 1,
        unit: "pair",
        unitCost: UNIT.futsalGoalsPair,
        notes: "Place at fence-end centers — full pad is the futsal field (not tennis baselines)",
        optional: true,
      }),
    );
  }

  if (mode === "diy") {
    items.push(
      line({
        id: "compactor",
        category: "tools",
        name: "Plate / roller rental",
        qty: 4,
        unit: "day",
        unitCost: UNIT.plateCompactorDay,
      }),
    );
    items.push(
      line({
        id: "level",
        category: "tools",
        name: "Laser level rental",
        qty: 3,
        unit: "day",
        unitCost: UNIT.laserLevelDay,
      }),
    );
    if (helperPersonDays > 0) {
      items.push(
        line({
          id: "helpers",
          category: "labor",
          name: `Day labor (${helperCount}×${helperDays}d)`,
          qty: helperPersonDays,
          unit: "person-day",
          unitCost: UNIT.helperDay,
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
      unitCost: UNIT.delivery,
      notes: "Multiple loads for large pad — confirm with yard",
    }),
  );

  const active = items.filter((i) => i.qty > 0 && (i.total > 0 || i.unitCost === 0));
  const subtotal = round(
    active.reduce((s, i) => s + i.total, 0),
    0,
  );
  const contingency = round(subtotal * 0.1, 0);
  const grandTotal = subtotal + contingency;
  const costPerSqFt =
    overallAreaSqFt > 0 ? round(grandTotal / overallAreaSqFt, 2) : 0;

  const warnings: string[] = [];
  if (lengthFt < 118 || widthFt < 58) {
    warnings.push(
      "Below common 120×60 recreational envelope — verify runback comfort for full-court play.",
    );
  }
  if (gradeDropFt > 6) {
    warnings.push(
      "Large grade drop on a full court means significant cut/fill — budget machine time and compaction testing.",
    );
  }
  if (!input.includeFence) {
    warnings.push(
      "No fence selected — balls leave the court easily; consider at least 10′ ends for tennis.",
    );
  }
  warnings.push(
    "Call 811 before digging. Confirm permits for grading / fence height with City of San Rafael.",
  );
  warnings.push(
    "Multi-sport futsal: drop the tennis net and place portable goals at the center of each fence end so the field is the full overall pad — not the 78×36 tennis lines.",
  );

  const withinRegulationPad =
    lengthFt >= FERN.minLengthFt && widthFt >= FERN.minWidthFt;

  return {
    playAreaSqFt,
    overallAreaSqFt: round(overallAreaSqFt, 0),
    cutCuYd,
    fillCuYd,
    netImportCuYd,
    classIiCuYd,
    asphaltOrSlabCuYd,
    fenceLf,
    windscreenSqFt,
    surfaceLabel: surf.name,
    surfaceBlurb: surf.blurb,
    items: active,
    subtotal,
    contingency,
    grandTotal,
    costPerSqFt,
    warnings,
    pitchPct,
    fallInches,
    helperPersonDays,
    withinRegulationPad,
  };
}

export const COURT_CATEGORY_LABELS: Record<CourtLineItem["category"], string> =
  {
    earthwork: "Earthwork",
    base: "Structural base",
    surface: "Playing surface",
    lines: "Lines & marking",
    net: "Net system",
    fence: "Fence & enclosure",
    multisport: "Multi-sport gear",
    tools: "Tools & delivery",
    labor: "Labor",
  };

export function getCourtBuildPhases(surface: CourtSurface, includeFence: boolean) {
  const phases = [
    {
      id: 1,
      title: "Survey & permits",
      steps: [
        "Call 811 / DigAlert",
        "Stake 120×60 (or your overall) envelope and playing lines",
        "Confirm grading & fence height with City of San Rafael",
        "Order aggregates, surface system, net, and fence package",
      ],
    },
    {
      id: 2,
      title: "Cut & fill level pad",
      steps: [
        "Cut high side / fill low side in lifts — same balance idea as Peacock, larger pad",
        "Compact each lift to ~90–95%",
        "Establish ~0.8–1% sheet drainage (not a dead flat bathtub)",
      ],
    },
    {
      id: 3,
      title: "Structural base",
      steps: [
        "Geotextile over subgrade",
        "Class II road base compacted in lifts",
        surface === "acrylic"
          ? "Asphalt (or concrete) wearing course, cure before coatings"
          : "Fine bedding screeded flat for tiles/turf",
      ],
    },
    {
      id: 4,
      title: "Playing surface",
      steps:
        surface === "acrylic"
          ? [
              "Apply acrylic resurfacer coats",
              "Color coats (in/out of play contrast optional)",
              "Strike regulation lines",
            ]
          : surface === "modular"
            ? [
                "Snap chalk baselines",
                "Lay interlocking tiles from a corner",
                "Cut edges; install ramps at gates if needed",
              ]
            : [
                "Roll multi-sport turf",
                "Seam, spike perimeter",
                "Brush infill; inlay or paint tennis lines",
              ],
    },
    {
      id: 5,
      title: "Net & multi-sport setup",
      steps: [
        "Set net posts on regulation centerline",
        "Hang net — designed to drop/remove for other sports",
        "Optional: portable futsal goals at fence-end centers (full pad = field)",
      ],
    },
  ];
  if (includeFence) {
    phases.push({
      id: 6,
      title: "Fence & windscreen",
      steps: [
        "Set terminals and line posts outside the playing runback",
        "Hang fabric, top rail, gates",
        "Add windscreen if selected — leave bottom gap for airflow",
      ],
    });
  }
  return phases;
}
