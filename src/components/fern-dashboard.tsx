import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  ExternalLink,
  Fence,
  Layers,
  MapPin,
  Maximize2,
  ShoppingCart,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  COURT_CATEGORY_LABELS,
  FERN,
  SURFACE_LOOK,
  SURFACE_OPTIONS,
  calcCourt,
  getCourtBuildPhases,
  type CourtLineItem,
  type CourtMode,
  type CourtSurface,
  type FenceHeightFt,
} from "@/lib/court-calc";
import {
  COURT_SUPPLIER_GROUPS,
  COURT_YARDS,
  getCourtBestOption,
  getCourtSuppliersForItem,
} from "@/lib/court-suppliers";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MaterialThumb } from "@/components/material-thumb";
import { CourtBuildAnimation } from "@/components/court-build-animation";

const CAT_COLORS: Record<CourtLineItem["category"], string> = {
  earthwork: "#8a7f6e",
  base: "#6b6560",
  surface: "#2f5d3a",
  lines: "#3a6b8c",
  net: "#c45c26",
  fence: "#5a4a3a",
  multisport: "#2f6b45",
  tools: "#9a6b1f",
  labor: "#5a4a3a",
};

function DimSlider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <label className="text-sm font-medium">{label}</label>
        <span className="font-mono text-sm tabular-nums text-primary">
          {formatNumber(value, step < 1 ? 1 : 0)} {unit}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(v[0] ?? value)}
      />
      {hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

function BuyLinks({ itemId }: { itemId: string }) {
  const group = getCourtSuppliersForItem(itemId);
  if (!group) return null;
  return (
    <div className="mt-1.5 space-y-1">
      {group.options.slice(0, 3).map((opt) => (
        <a
          key={opt.url + opt.product}
          href={opt.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-1.5 text-xs text-primary hover:underline"
        >
          {opt.best ? (
            <Star className="mt-0.5 size-3 shrink-0 fill-primary text-primary" />
          ) : (
            <ExternalLink className="mt-0.5 size-3 shrink-0 opacity-60" />
          )}
          <span>
            <span className="font-medium">{opt.vendor}</span>
            {" — "}
            {opt.product}
            <span className="text-muted-foreground">
              {" "}
              · {opt.priceNote}
              {opt.best ? " · best value" : ""}
            </span>
          </span>
        </a>
      ))}
    </div>
  );
}

function CourtPlan({
  lengthFt,
  widthFt,
  includeFence,
  fenceHeightFt,
  showFutsalGoals,
  surface,
}: {
  lengthFt: number;
  widthFt: number;
  includeFence: boolean;
  fenceHeightFt: number;
  showFutsalGoals: boolean;
  surface: CourtSurface;
}) {
  /**
   * Plan view — baseline ends left/right, net vertical at midcourt.
   * Colors track the selected surface system in real time.
   */
  const look = SURFACE_LOOK[surface];
  const W = 640;
  const H = 400;
  const mx = 48;
  const my = 40;
  const legendH = 36;
  const padW = W - mx * 2;
  const padH = H - my * 2 - legendH;

  const scaleX = padW / lengthFt;
  const scaleY = padH / widthFt;

  const playW = FERN.playLengthFt * scaleX;
  const playH = FERN.playWidthFt * scaleY;
  const playX = mx + (padW - playW) / 2;
  const playY = my + (padH - playH) / 2;

  const toX = (ftFromLeftBaseline: number) => playX + ftFromLeftBaseline * scaleX;
  const toY = (ftFromTopDoubles: number) => playY + ftFromTopDoubles * scaleY;

  const alley = (FERN.playWidthFt - FERN.singlesWidthFt) / 2;
  const netFt = FERN.playLengthFt / 2;
  const serviceFromNet = 21;
  const serviceFromBaseline = netFt - serviceFromNet;
  const serviceLeftX = toX(serviceFromBaseline);
  const serviceRightX = toX(FERN.playLengthFt - serviceFromBaseline);
  const netX = toX(netFt);
  const singlesTopY = toY(alley);
  const singlesBotY = toY(FERN.playWidthFt - alley);
  const midY = toY(FERN.playWidthFt / 2);
  const leftBaseX = playX;
  const rightBaseX = playX + playW;
  const topY = playY;
  const botY = playY + playH;

  const line = look.line;
  const lineSoft = "var(--color-muted-foreground)";
  const patternId = `surf-tex-${surface}`;

  return (
    <div className="w-full max-w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mx-auto h-auto w-full max-w-3xl transition-colors duration-300"
        role="img"
        aria-label={`${look.label} tennis court plan with regulation markings`}
      >
        <defs>
          {/* Modular tile grid */}
          <pattern
            id="surf-tex-modular"
            width="14"
            height="14"
            patternUnits="userSpaceOnUse"
          >
            <rect width="14" height="14" fill={look.play} />
            <rect
              width="13"
              height="13"
              x="0.5"
              y="0.5"
              fill={look.playInner}
              opacity="0.92"
            />
            <path
              d="M0 0H14M0 0V14"
              stroke="#1A5C32"
              strokeWidth="0.6"
              opacity="0.45"
            />
          </pattern>
          {/* Turf pile / grain */}
          <pattern
            id="surf-tex-turf"
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
          >
            <rect width="8" height="8" fill={look.play} />
            <path
              d="M1 7 L2 1 M4 8 L5 2 M7 7 L6 1"
              stroke={look.playInner}
              strokeWidth="1.1"
              strokeLinecap="round"
              opacity="0.85"
            />
            <path
              d="M2 8 L3 3 M5 7 L6 2"
              stroke="#3D7A35"
              strokeWidth="0.7"
              opacity="0.5"
            />
          </pattern>
          {/* Acrylic smooth with subtle roller texture */}
          <pattern
            id="surf-tex-acrylic"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <rect width="40" height="40" fill={look.play} />
            <path
              d="M0 10 H40 M0 30 H40"
              stroke={look.playInner}
              strokeWidth="6"
              opacity="0.12"
            />
          </pattern>
          <linearGradient id="runback-shade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={look.runback} stopOpacity="1" />
            <stop offset="100%" stopColor={look.runback} stopOpacity="0.88" />
          </linearGradient>
        </defs>

        {includeFence ? (
          <rect
            x={mx - 10}
            y={my - 10}
            width={padW + 20}
            height={padH + 20}
            fill="none"
            stroke={look.fence}
            strokeWidth={3.5}
            rx={2}
          />
        ) : null}

        {/* Overall pad / runback — surface-colored */}
        <rect
          x={mx}
          y={my}
          width={padW}
          height={padH}
          fill={`url(#runback-shade)`}
          rx={2}
        />
        {/* Light outer edge wear */}
        <rect
          x={mx}
          y={my}
          width={padW}
          height={padH}
          fill="none"
          stroke={look.play}
          strokeWidth={1}
          opacity={0.25}
          rx={2}
        />
        <text
          x={mx + 6}
          y={my + 14}
          fill="#F0F5F0"
          fontSize={9}
          fontFamily="var(--font-sans)"
          opacity={0.9}
        >
          runback
        </text>

        {/* Playing surface fill with texture */}
        <rect
          x={playX}
          y={playY}
          width={playW}
          height={playH}
          fill={`url(#${patternId})`}
        />
        {/* Slight contrast on singles court (inner) for acrylic */}
        {surface === "acrylic" ? (
          <rect
            x={playX}
            y={singlesTopY}
            width={playW}
            height={singlesBotY - singlesTopY}
            fill={look.playInner}
            opacity={0.22}
          />
        ) : null}

        {/* Doubles outer boundary */}
        <rect
          x={playX}
          y={playY}
          width={playW}
          height={playH}
          fill="none"
          stroke={line}
          strokeWidth={2.4}
        />

        {/* Singles sidelines */}
        <line
          x1={leftBaseX}
          y1={singlesTopY}
          x2={rightBaseX}
          y2={singlesTopY}
          stroke={line}
          strokeWidth={1.9}
        />
        <line
          x1={leftBaseX}
          y1={singlesBotY}
          x2={rightBaseX}
          y2={singlesBotY}
          stroke={line}
          strokeWidth={1.9}
        />

        {/* Service lines */}
        <line
          x1={serviceLeftX}
          y1={singlesTopY}
          x2={serviceLeftX}
          y2={singlesBotY}
          stroke={line}
          strokeWidth={1.9}
        />
        <line
          x1={serviceRightX}
          y1={singlesTopY}
          x2={serviceRightX}
          y2={singlesBotY}
          stroke={line}
          strokeWidth={1.9}
        />

        {/* Center service line */}
        <line
          x1={serviceLeftX}
          y1={midY}
          x2={serviceRightX}
          y2={midY}
          stroke={line}
          strokeWidth={1.9}
        />

        {/* Net */}
        <line
          x1={netX}
          y1={topY - 4}
          x2={netX}
          y2={botY + 4}
          stroke={look.net}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <circle cx={netX} cy={topY - 4} r={3.5} fill={look.netPost} />
        <circle cx={netX} cy={botY + 4} r={3.5} fill={look.netPost} />

        {/* Center marks */}
        <line
          x1={leftBaseX}
          y1={midY}
          x2={leftBaseX + 4 * scaleX}
          y2={midY}
          stroke={line}
          strokeWidth={2.2}
        />
        <line
          x1={rightBaseX}
          y1={midY}
          x2={rightBaseX - 4 * scaleX}
          y2={midY}
          stroke={line}
          strokeWidth={2.2}
        />

        <text
          x={netX}
          y={topY - 12}
          textAnchor="middle"
          fill={look.net}
          fontSize={10}
          fontFamily="var(--font-sans)"
          fontWeight={600}
        >
          net (removable)
        </text>

        <text
          x={leftBaseX - 8}
          y={midY + 4}
          textAnchor="middle"
          fill={line}
          fontSize={9}
          fontFamily="var(--font-sans)"
          opacity={0.85}
          transform={`rotate(-90 ${leftBaseX - 8} ${midY + 4})`}
        >
          baseline
        </text>
        <text
          x={rightBaseX + 10}
          y={midY + 4}
          textAnchor="middle"
          fill={line}
          fontSize={9}
          fontFamily="var(--font-sans)"
          opacity={0.85}
          transform={`rotate(90 ${rightBaseX + 10} ${midY + 4})`}
        >
          baseline
        </text>

        <text
          x={(serviceLeftX + netX) / 2}
          y={midY - 8}
          textAnchor="middle"
          fill={line}
          fontSize={9}
          fontFamily="var(--font-sans)"
          opacity={0.9}
        >
          ad
        </text>
        <text
          x={(serviceLeftX + netX) / 2}
          y={midY + 16}
          textAnchor="middle"
          fill={line}
          fontSize={9}
          fontFamily="var(--font-sans)"
          opacity={0.9}
        >
          deuce
        </text>
        <text
          x={(netX + serviceRightX) / 2}
          y={midY - 8}
          textAnchor="middle"
          fill={line}
          fontSize={9}
          fontFamily="var(--font-sans)"
          opacity={0.9}
        >
          deuce
        </text>
        <text
          x={(netX + serviceRightX) / 2}
          y={midY + 16}
          textAnchor="middle"
          fill={line}
          fontSize={9}
          fontFamily="var(--font-sans)"
          opacity={0.9}
        >
          ad
        </text>

        <text
          x={toX(9)}
          y={topY - 6}
          textAnchor="middle"
          fill={line}
          fontSize={8}
          fontFamily="var(--font-sans)"
          opacity={0.8}
        >
          doubles alley
        </text>

        <text
          x={serviceLeftX}
          y={botY + 14}
          textAnchor="middle"
          fill={lineSoft}
          fontSize={8}
          fontFamily="var(--font-mono)"
        >
          service line
        </text>
        <text
          x={serviceRightX}
          y={botY + 14}
          textAnchor="middle"
          fill={lineSoft}
          fontSize={8}
          fontFamily="var(--font-mono)"
        >
          service line
        </text>
        <text
          x={(leftBaseX + serviceLeftX) / 2}
          y={botY + 14}
          textAnchor="middle"
          fill={lineSoft}
          fontSize={8}
          fontFamily="var(--font-mono)"
        >
          18′
        </text>
        <text
          x={(serviceLeftX + netX) / 2}
          y={botY + 14}
          textAnchor="middle"
          fill={lineSoft}
          fontSize={8}
          fontFamily="var(--font-mono)"
        >
          21′
        </text>
        <text
          x={netX}
          y={botY + 26}
          textAnchor="middle"
          fill={lineSoft}
          fontSize={8}
          fontFamily="var(--font-mono)"
        >
          78′ play · 36′ doubles · 27′ singles
        </text>

        <text
          x={rightBaseX + 22}
          y={singlesTopY + 4}
          fill={lineSoft}
          fontSize={8}
          fontFamily="var(--font-mono)"
        >
          singles
        </text>
        <text
          x={rightBaseX + 22}
          y={topY + 10}
          fill={lineSoft}
          fontSize={8}
          fontFamily="var(--font-mono)"
        >
          4.5′ alley
        </text>

        {showFutsalGoals ? (
          <>
            <rect
              x={mx}
              y={my}
              width={padW}
              height={padH}
              fill="none"
              stroke="var(--color-success)"
              strokeWidth={1.5}
              strokeDasharray="5 4"
              opacity={0.9}
            />
            <rect
              x={mx - (includeFence ? 12 : 6)}
              y={my + padH / 2 - 18}
              width={8}
              height={36}
              fill="var(--color-success)"
              opacity={0.95}
              rx={1}
            />
            <rect
              x={mx + padW + (includeFence ? 4 : -2)}
              y={my + padH / 2 - 18}
              width={8}
              height={36}
              fill="var(--color-success)"
              opacity={0.95}
              rx={1}
            />
            <text
              x={mx - 18}
              y={my + padH / 2 + 4}
              textAnchor="middle"
              fill="var(--color-success)"
              fontSize={8}
              fontFamily="var(--font-sans)"
              fontWeight={600}
              transform={`rotate(-90 ${mx - 18} ${my + padH / 2 + 4})`}
            >
              futsal goal @ fence
            </text>
            <text
              x={W / 2}
              y={my + 12}
              textAnchor="middle"
              fill="#E8F8E8"
              fontSize={9}
              fontFamily="var(--font-sans)"
              fontWeight={600}
            >
              futsal field = full pad · goals at fence ends
            </text>
          </>
        ) : null}

        {/* Surface legend chip */}
        <rect
          x={W / 2 - 120}
          y={H - 28}
          width={240}
          height={18}
          rx={9}
          fill={look.play}
          stroke={line}
          strokeWidth={1}
          opacity={0.95}
        />
        <text
          x={W / 2}
          y={H - 15}
          textAnchor="middle"
          fill={line}
          fontSize={10}
          fontFamily="var(--font-sans)"
          fontWeight={600}
        >
          {look.label} · {formatNumber(lengthFt, 0)}×{formatNumber(widthFt, 0)}
          ft
          {includeFence ? ` · ${fenceHeightFt}′ fence` : ""}
        </text>
      </svg>
    </div>
  );
}

export function FernDashboard() {
  const [lengthFt, setLengthFt] = useState<number>(FERN.defaultLengthFt);
  const [widthFt, setWidthFt] = useState<number>(FERN.defaultWidthFt);
  const [gradeDropFt, setGradeDropFt] = useState<number>(FERN.defaultGradeDropFt);
  const [surface, setSurface] = useState<CourtSurface>("modular");
  const [mode, setMode] = useState<CourtMode>("diy");
  const [includeFence, setIncludeFence] = useState(true);
  const [fenceHeightFt, setFenceHeightFt] = useState<FenceHeightFt>(10);
  const [fenceBlackVinyl, setFenceBlackVinyl] = useState(true);
  const [includeWindscreen, setIncludeWindscreen] = useState(true);
  const [includeDoubleGate, setIncludeDoubleGate] = useState(true);
  const [includeFutsalGoals, setIncludeFutsalGoals] = useState(true);
  const [includeHelpers, setIncludeHelpers] = useState(false);
  const [helperCount, setHelperCount] = useState(3);
  const [helperDays, setHelperDays] = useState(5);
  const [checkedPhases, setCheckedPhases] = useState<Record<number, boolean>>(
    {},
  );
  const [expandedPhase, setExpandedPhase] = useState<number | null>(1);

  const result = useMemo(
    () =>
      calcCourt({
        overallLengthFt: lengthFt,
        overallWidthFt: widthFt,
        gradeDropFt,
        surface,
        mode,
        includeFence,
        fenceHeightFt,
        fenceBlackVinyl,
        includeWindscreen,
        includeDoubleGate,
        includeFutsalGoals,
        includeHelpers,
        helperCount,
        helperDays,
      }),
    [
      lengthFt,
      widthFt,
      gradeDropFt,
      surface,
      mode,
      includeFence,
      fenceHeightFt,
      fenceBlackVinyl,
      includeWindscreen,
      includeDoubleGate,
      includeFutsalGoals,
      includeHelpers,
      helperCount,
      helperDays,
    ],
  );

  const phases = useMemo(
    () => getCourtBuildPhases(surface, includeFence),
    [surface, includeFence],
  );

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of result.items) {
      map.set(item.category, (map.get(item.category) ?? 0) + item.total);
    }
    return Array.from(map.entries())
      .map(([category, total]) => ({
        category,
        label: COURT_CATEGORY_LABELS[category as CourtLineItem["category"]],
        total: Math.round(total),
      }))
      .filter((d) => d.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [result.items]);

  const surfMeta = SURFACE_OPTIONS.find((s) => s.id === surface)!;

  return (
    <div className="min-h-0">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              <MapPin className="size-3" />
              Fern · San Rafael 94901 · regulation tennis + multi-sport
            </p>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Tennis Court Builder
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Full-size court pad (play 78×36 inside a larger overall pad) with
              cut/fill leveling, three surface systems, toggleable fence, and
              futsal on the full enclosure when the net is down.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={result.withinRegulationPad ? "success" : "warn"}>
              {result.withinRegulationPad
                ? "Rec pad OK"
                : "Tight runback"}
            </Badge>
            <Badge variant="outline">{result.surfaceLabel}</Badge>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-12">
        <aside className="min-w-0 space-y-4 lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Maximize2 className="size-4 shrink-0 text-primary" />
                Court pad size
              </CardTitle>
              <CardDescription>
                Playing lines stay 78×36 doubles. Overall pad is the runback —
                and the futsal field when goals sit at the fence ends. Default{" "}
                {FERN.defaultLengthFt}×{FERN.defaultWidthFt}.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <DimSlider
                label="Overall length (baselines)"
                value={lengthFt}
                min={FERN.minLengthFt}
                max={FERN.maxLengthFt}
                step={1}
                unit="ft"
                onChange={setLengthFt}
                hint="Includes runback beyond 78 ft play"
              />
              <DimSlider
                label="Overall width (sidelines)"
                value={widthFt}
                min={FERN.minWidthFt}
                max={FERN.maxWidthFt}
                step={1}
                unit="ft"
                onChange={setWidthFt}
                hint="Includes runback beyond 36 ft doubles"
              />
              <DimSlider
                label="Grade drop to level"
                value={gradeDropFt}
                min={1}
                max={8}
                step={0.5}
                unit="ft"
                onChange={setGradeDropFt}
                hint="Same cut/fill idea as Peacock — larger footprint"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="size-4 shrink-0 text-primary" />
                Surface system
              </CardTitle>
              <CardDescription>
                Three packages that work for tennis and multi-sport.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {SURFACE_OPTIONS.map((opt) => {
                const on = surface === opt.id;
                const look = SURFACE_LOOK[opt.id];
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSurface(opt.id)}
                    className={
                      on
                        ? "w-full rounded-xl border-2 border-primary bg-primary/5 p-3 text-left transition-colors"
                        : "w-full rounded-xl border border-border bg-card p-3 text-left transition-colors hover:border-primary/40"
                    }
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex shrink-0 flex-col items-center gap-1.5">
                        <MaterialThumb
                          itemId={
                            opt.id === "acrylic"
                              ? "acrylic"
                              : opt.id === "modular"
                                ? "modular"
                                : "turf"
                          }
                          size="md"
                        />
                        <div
                          className="flex h-3 w-12 overflow-hidden rounded-full border border-border shadow-sm"
                          aria-hidden
                        >
                          <span
                            className="h-full w-1/2"
                            style={{ backgroundColor: look.play }}
                          />
                          <span
                            className="h-full w-1/2"
                            style={{ backgroundColor: look.runback }}
                          />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">{opt.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {opt.short}
                          {on ? " · live on plan" : ""}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {opt.blurb}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
              <div className="rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                <p className="font-medium text-foreground">Multi-sport</p>
                <p className="mt-0.5">{surfMeta.multiSport}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fence className="size-4 shrink-0 text-primary" />
                Fence options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">Enclose the court</p>
                  <p className="text-xs text-muted-foreground">
                    Chain-link perimeter
                  </p>
                </div>
                <Switch
                  checked={includeFence}
                  onCheckedChange={setIncludeFence}
                  aria-label="Include fence"
                />
              </div>
              {includeFence ? (
                <>
                  <div className="flex flex-wrap gap-2">
                    {([8, 10, 12] as FenceHeightFt[]).map((h) => (
                      <Button
                        key={h}
                        type="button"
                        size="sm"
                        variant={fenceHeightFt === h ? "default" : "outline"}
                        onClick={() => setFenceHeightFt(h)}
                      >
                        {h} ft
                      </Button>
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">Black vinyl coat</p>
                      <p className="text-xs text-muted-foreground">
                        vs plain galvanized
                      </p>
                    </div>
                    <Switch
                      checked={fenceBlackVinyl}
                      onCheckedChange={setFenceBlackVinyl}
                      aria-label="Black vinyl fence"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">Windscreen</p>
                      <p className="text-xs text-muted-foreground">
                        Privacy + wind cut
                      </p>
                    </div>
                    <Switch
                      checked={includeWindscreen}
                      onCheckedChange={setIncludeWindscreen}
                      aria-label="Windscreen"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">Double gate</p>
                      <p className="text-xs text-muted-foreground">
                        Equipment access
                      </p>
                    </div>
                    <Switch
                      checked={includeDoubleGate}
                      onCheckedChange={setIncludeDoubleGate}
                      aria-label="Double gate"
                    />
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">Futsal goals</p>
                  <p className="text-xs text-muted-foreground">
                    At fence-end centers — full pad is the field
                  </p>
                </div>
                <Switch
                  checked={includeFutsalGoals}
                  onCheckedChange={setIncludeFutsalGoals}
                  aria-label="Futsal goals"
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">Pricing mode</p>
                  <p className="text-xs text-muted-foreground">
                    {mode === "diy" ? "DIY materials" : "Pro labor added"}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span
                    className={
                      mode === "diy"
                        ? "font-medium text-primary"
                        : "text-muted-foreground"
                    }
                  >
                    DIY
                  </span>
                  <Switch
                    checked={mode === "pro"}
                    onCheckedChange={(c) => setMode(c ? "pro" : "diy")}
                    aria-label="Pro pricing"
                  />
                  <span
                    className={
                      mode === "pro"
                        ? "font-medium text-primary"
                        : "text-muted-foreground"
                    }
                  >
                    Pro
                  </span>
                </div>
              </div>
              {mode === "diy" ? (
                <div className="space-y-3 rounded-lg border border-border bg-muted/30 px-3 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">Helpers</p>
                      <p className="text-xs text-muted-foreground">
                        {includeHelpers
                          ? `${helperCount}×${helperDays}d`
                          : "Off"}
                      </p>
                    </div>
                    <Switch
                      checked={includeHelpers}
                      onCheckedChange={setIncludeHelpers}
                      aria-label="Helpers"
                    />
                  </div>
                  {includeHelpers ? (
                    <>
                      <DimSlider
                        label="Helpers"
                        value={helperCount}
                        min={1}
                        max={6}
                        step={1}
                        unit="people"
                        onChange={setHelperCount}
                      />
                      <DimSlider
                        label="Days"
                        value={helperDays}
                        min={1}
                        max={20}
                        step={1}
                        unit="days"
                        onChange={setHelperDays}
                      />
                    </>
                  ) : null}
                </div>
              ) : null}
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="space-y-1 p-4">
                <p className="text-xs opacity-80">Estimated total</p>
                <p className="font-display text-2xl font-semibold tabular-nums">
                  {formatCurrency(result.grandTotal)}
                </p>
                <p className="text-xs opacity-80">
                  +10% contingency · {formatCurrency(result.costPerSqFt, 2)}/sq
                  ft
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-1 p-4">
                <p className="text-xs text-muted-foreground">Pad area</p>
                <p className="font-display text-2xl font-semibold tabular-nums">
                  {result.overallAreaSqFt}
                </p>
                <p className="text-xs text-muted-foreground">
                  sq ft · cut {result.cutCuYd} cy
                </p>
              </CardContent>
            </Card>
          </div>
        </aside>

        <section className="min-w-0 space-y-4 lg:col-span-8">
          {result.warnings.length > 0 ? (
            <Card className="border-warn/40 bg-warn/5">
              <CardContent className="flex gap-3 p-4">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warn" />
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {result.warnings.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}

          <Tabs defaultValue="plan" className="min-w-0">
            <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
              <TabsTrigger value="plan">Plan</TabsTrigger>
              <TabsTrigger value="cut">Cut / fill</TabsTrigger>
              <TabsTrigger value="costs">Costs</TabsTrigger>
              <TabsTrigger value="bom">Materials</TabsTrigger>
              <TabsTrigger value="buy">Buy links</TabsTrigger>
              <TabsTrigger value="build">Build steps</TabsTrigger>
            </TabsList>

            <TabsContent value="plan" className="min-w-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="size-4 text-primary" />
                    Court plan — tennis + futsal
                  </CardTitle>
                  <CardDescription>
                    Drop the net for multi-sport. Futsal uses the{" "}
                    <strong>full overall pad</strong> with portable goals at the{" "}
                    <strong>fence ends</strong> (center of each short side) — not
                    on the tennis baselines.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CourtPlan
                    lengthFt={lengthFt}
                    widthFt={widthFt}
                    includeFence={includeFence}
                    fenceHeightFt={fenceHeightFt}
                    showFutsalGoals={includeFutsalGoals}
                    surface={surface}
                  />
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {surfMeta.pros.map((p) => (
                      <div
                        key={p}
                        className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs"
                      >
                        {p}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cut" className="min-w-0">
              <Card>
                <CardHeader>
                  <CardTitle>Level the pad (cut & fill)</CardTitle>
                  <CardDescription>
                    Same physics as Peacock — cut the high side, fill the low
                    side in lifts — on a much larger pad.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-xs text-muted-foreground">Cut</p>
                      <p className="font-mono text-lg tabular-nums">
                        {result.cutCuYd} cu yd
                      </p>
                    </div>
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-xs text-muted-foreground">Fill</p>
                      <p className="font-mono text-lg tabular-nums">
                        {result.fillCuYd} cu yd
                      </p>
                    </div>
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-xs text-muted-foreground">
                        Class II base
                      </p>
                      <p className="font-mono text-lg tabular-nums">
                        {result.classIiCuYd} cu yd
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Target sheet drainage ≈{result.pitchPct}% along length (
                    {result.fallInches}″ fall) so the court doesn’t pond. Compact
                    every lift — a soft base ruins bounce on acrylic and tiles.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="costs" className="min-w-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CircleDollarSign className="size-4 text-primary" />
                    Cost by category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72 w-full min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={byCategory}
                        layout="vertical"
                        margin={{ left: 4, right: 12 }}
                      >
                        <XAxis
                          type="number"
                          tickFormatter={(v) => `$${v}`}
                          fontSize={11}
                        />
                        <YAxis
                          type="category"
                          dataKey="label"
                          width={100}
                          fontSize={10}
                          tickLine={false}
                        />
                        <Tooltip
                          formatter={(v: number) => formatCurrency(v)}
                          contentStyle={{
                            borderRadius: 8,
                            border: "1px solid var(--color-border)",
                            fontSize: 12,
                          }}
                        />
                        <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                          {byCategory.map((d) => (
                            <Cell
                              key={d.category}
                              fill={
                                CAT_COLORS[
                                  d.category as CourtLineItem["category"]
                                ]
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    DIY retail blend for San Rafael / North Bay · confirm live
                    quotes on Buy links.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bom" className="min-w-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="size-4 text-primary" />
                    Bill of materials
                  </CardTitle>
                  <CardDescription>
                    {result.surfaceLabel} · {result.overallAreaSqFt} sq ft pad
                  </CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                        <th className="pb-2 pr-2 font-medium">Item + buy</th>
                        <th className="pb-2 pr-2 font-medium">Qty</th>
                        <th className="pb-2 pr-2 font-medium">Unit $</th>
                        <th className="pb-2 font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.items.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b border-border/50 align-top"
                        >
                          <td className="py-2.5 pr-2">
                            <div className="flex items-start gap-2">
                              <MaterialThumb itemId={item.id} size="sm" />
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {COURT_CATEGORY_LABELS[item.category]}
                                  {item.notes ? ` · ${item.notes}` : ""}
                                </p>
                                <BuyLinks itemId={item.id} />
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 pr-2 whitespace-nowrap font-mono tabular-nums">
                            {formatNumber(item.qty, item.qty >= 20 ? 0 : 1)}{" "}
                            {item.unit}
                          </td>
                          <td className="py-2.5 pr-2 font-mono tabular-nums">
                            {item.unitCost === 0
                              ? "—"
                              : formatCurrency(item.unitCost, 2)}
                          </td>
                          <td className="py-2.5 font-mono tabular-nums">
                            {item.total === 0
                              ? "—"
                              : formatCurrency(item.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="font-medium">
                        <td className="pt-3" colSpan={3}>
                          Subtotal
                        </td>
                        <td className="pt-3 font-mono">
                          {formatCurrency(result.subtotal)}
                        </td>
                      </tr>
                      <tr className="text-muted-foreground">
                        <td className="pt-1" colSpan={3}>
                          Contingency 10%
                        </td>
                        <td className="pt-1 font-mono">
                          {formatCurrency(result.contingency)}
                        </td>
                      </tr>
                      <tr className="text-primary">
                        <td className="pt-1 font-semibold" colSpan={3}>
                          Grand total
                        </td>
                        <td className="pt-1 font-mono text-base font-semibold">
                          {formatCurrency(result.grandTotal)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="buy" className="min-w-0 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="size-4 text-primary" />
                    Where to buy — Fern / 94901
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {COURT_YARDS.map((y) => (
                      <a
                        key={y.name}
                        href={y.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl border border-border p-4 hover:border-primary/40"
                      >
                        <p className="flex items-center gap-1 text-sm font-semibold">
                          {y.name}
                          <ExternalLink className="size-3.5 text-primary" />
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {y.address}
                        </p>
                        {y.phone ? (
                          <p className="font-mono text-xs">{y.phone}</p>
                        ) : null}
                        <p className="mt-2 text-xs text-muted-foreground">
                          {y.note}
                        </p>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
              {COURT_SUPPLIER_GROUPS.filter((g) => {
                if (!includeFence && g.keys.some((k) => ["fence", "gate-s", "gate-d", "windscreen", "fence-labor"].includes(k)))
                  return false;
                if (!includeFutsalGoals && g.keys.includes("futsal-goals"))
                  return false;
                if (
                  surface !== "acrylic" &&
                  g.keys.some((k) => k.startsWith("acrylic") || k === "asphalt")
                )
                  return g.keys.includes("geo") || g.keys.includes("lines");
                if (surface !== "modular" && g.keys.some((k) => k.startsWith("modular")))
                  return false;
                if (
                  surface !== "turf" &&
                  g.keys.some((k) => ["turf", "infill", "turf-labor"].includes(k))
                )
                  return false;
                return true;
              }).map((group) => {
                const thumbId = group.keys[0] ?? "class2";
                return (
                  <Card key={group.title}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start gap-3">
                        <MaterialThumb itemId={thumbId} size="lg" />
                        <div>
                          <CardTitle className="text-base">
                            {group.title}
                          </CardTitle>
                          <CardDescription>{group.tip}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="divide-y divide-border">
                        {group.options.map((opt) => (
                          <li key={opt.url + opt.product}>
                            <a
                              href={opt.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex flex-col gap-0.5 py-3 sm:flex-row sm:items-center sm:justify-between"
                            >
                              <div className="min-w-0">
                                <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                                  {opt.best ? (
                                    <Badge variant="default" className="gap-1">
                                      <Star className="size-3 fill-primary-foreground" />
                                      Best value
                                    </Badge>
                                  ) : null}
                                  {opt.vendor}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {opt.product}
                                </p>
                              </div>
                              <span className="font-mono text-sm text-primary">
                                {opt.priceNote}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="build" className="min-w-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="size-4 text-primary" />
                    Build sequence — Fern
                  </CardTitle>
                  <CardDescription>
                    Expand each phase for a how-to animation. Tap materials
                    under the animation to locate them on the finished frame.
                    Surface steps follow your selected system (
                    {result.surfaceLabel}).
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-4">
                    {phases.map((phase) => {
                      const done = !!checkedPhases[phase.id];
                      const open = expandedPhase === phase.id;
                      return (
                        <li
                          key={phase.id}
                          className="overflow-hidden rounded-xl border border-border bg-card"
                        >
                          <div className="flex items-start gap-3 p-4">
                            <button
                              type="button"
                              className="mt-0.5 shrink-0"
                              aria-label={
                                done
                                  ? `Mark phase ${phase.id} incomplete`
                                  : `Mark phase ${phase.id} complete`
                              }
                              onClick={() =>
                                setCheckedPhases((s) => ({
                                  ...s,
                                  [phase.id]: !s[phase.id],
                                }))
                              }
                            >
                              {done ? (
                                <CheckCircle2 className="size-5 text-success" />
                              ) : (
                                <span className="flex size-5 items-center justify-center rounded-full border-2 border-border font-mono text-xs text-muted-foreground">
                                  {phase.id}
                                </span>
                              )}
                            </button>
                            <button
                              type="button"
                              className="min-w-0 flex-1 text-left"
                              onClick={() =>
                                setExpandedPhase(open ? null : phase.id)
                              }
                            >
                              <p
                                className={
                                  done
                                    ? "font-medium text-muted-foreground line-through"
                                    : "font-medium text-foreground"
                                }
                              >
                                {phase.title}
                              </p>
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {open
                                  ? "Hide animation"
                                  : "Show how-to animation"}
                                {" · "}
                                {phase.steps.length} steps
                              </p>
                            </button>
                          </div>

                          {open ? (
                            <div className="space-y-3 border-t border-border px-4 pb-4 pt-3">
                              <CourtBuildAnimation
                                phaseId={phase.id}
                                surface={surface}
                                active={open}
                                includeFutsalGoals={includeFutsalGoals}
                              />
                              <ul className="space-y-1.5 text-sm text-muted-foreground">
                                {phase.steps.map((step) => (
                                  <li
                                    key={step}
                                    className="flex gap-2 leading-relaxed"
                                  >
                                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                                    {step}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : null}
                        </li>
                      );
                    })}
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="border-primary/25 bg-primary/5">
            <CardContent className="p-5">
              <p className="font-medium">Multi-sport on Fern</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Regulation tennis with the net up. For futsal: drop or remove the
                net and place portable goals at the <strong>center of each
                fence end</strong> so the field is the full{" "}
                {formatNumber(lengthFt, 0)}×{formatNumber(widthFt, 0)} ft pad
                (not the 78×36 tennis lines). Size the overall pad large enough
                for the game you want — bump length/width above the tennis
                minimum. Modular tiles and turf are friendliest underfoot;
                acrylic stays best for pure tennis bounce.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
