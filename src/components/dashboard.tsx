import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownUp,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  ExternalLink,
  Layers,
  MapPin,
  Maximize2,
  Ruler,
  ShoppingCart,
  Shovel,
  Sparkles,
  Star,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BUILD_PHASES,
  CATEGORY_LABELS,
  SITE,
  calcPad,
  type LineItem,
  type Mode,
} from "@/lib/pad-calc";
import {
  LOCAL_YARDS,
  SUPPLIER_GROUPS,
  getBestOption,
  getSuppliersForItem,
} from "@/lib/suppliers";
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
import { PlanView } from "@/components/plan-view";
import { SectionView } from "@/components/section-view";

const PRESETS: {
  label: string;
  widthFt: number;
  depthFt: number;
  gradeDropFt: number;
}[] = [
  { label: "Compact", widthFt: 16, depthFt: 12, gradeDropFt: 5 },
  { label: "Spec baseline", widthFt: 24, depthFt: 13, gradeDropFt: 6 },
  { label: "Max hill", widthFt: 30, depthFt: 20, gradeDropFt: 7 },
  { label: "Youth pitch", widthFt: 28, depthFt: 16, gradeDropFt: 6 },
];

const CAT_COLORS: Record<LineItem["category"], string> = {
  earthwork: "#8a7f6e",
  walls: "#7a756c",
  drainage: "#3a6b8c",
  base: "#6b6560",
  turf: "#2f5d3a",
  sideboards: "#c45c26",
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
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span className="font-mono text-sm tabular-nums text-primary">
          {formatNumber(value, step < 1 ? 1 : 0)} {unit}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([v]) => onChange(v ?? min)}
        aria-label={label}
      />
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function BuyLinks({ itemId }: { itemId: string }) {
  const group = getSuppliersForItem(itemId);
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

export function Dashboard() {
  const [widthFt, setWidthFt] = useState<number>(SITE.defaultWidth);
  const [depthFt, setDepthFt] = useState<number>(SITE.defaultDepth);
  const [gradeDropFt, setGradeDropFt] = useState<number>(SITE.defaultGrade);
  const [sideboardHeightIn, setSideboardHeightIn] = useState<number>(
    SITE.defaultSideboardIn,
  );
  const [mode, setMode] = useState<Mode>("diy");
  const [helperDays, setHelperDays] = useState(0);
  const [checkedPhases, setCheckedPhases] = useState<Record<number, boolean>>(
    {},
  );

  const result = useMemo(
    () =>
      calcPad({
        widthFt,
        depthFt,
        gradeDropFt,
        sideboardHeightIn,
        mode,
        helperDays,
      }),
    [widthFt, depthFt, gradeDropFt, sideboardHeightIn, mode, helperDays],
  );

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of result.items) {
      map.set(item.category, (map.get(item.category) ?? 0) + item.total);
    }
    return Array.from(map.entries())
      .map(([category, total]) => ({
        category,
        label: CATEGORY_LABELS[category as LineItem["category"]],
        total: Math.round(total),
      }))
      .filter((d) => d.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [result.items]);

  const shoppingAggregates = useMemo(() => {
    return [
      {
        name: "Class II road base",
        qty: `${formatNumber(result.classIiCuYd + result.levelingPadCuYd, 1)} cu yd`,
        note: "Pad + wall leveling pads (round up at yard)",
        itemId: "class2",
      },
      {
        name: '¾" clean drainage rock',
        qty: `${formatNumber(result.drainageRockCuYd, 1)} cu yd`,
        note: "Both wall chimneys",
        itemId: "drain-rock",
      },
      {
        name: "DG / sharp sand",
        qty: `${formatNumber(result.beddingCuYd, 1)} cu yd`,
        note: "1 in bedding",
        itemId: "bedding",
      },
      {
        name: "SRW + caps",
        qty: `${result.srwBlocks} + ${result.capBlocks} caps`,
        note: "Both walls",
        itemId: "srw",
      },
      {
        name: "Turf roll stock",
        qty: `${result.turfSqFt} sq ft`,
        note: "Includes waste",
        itemId: "turf",
      },
      {
        name: "Trex boards",
        qty: `${result.trexLf} lf`,
        note: "Sideboards on PT frame",
        itemId: "trex",
      },
    ];
  }, [result]);

  function applyPreset(p: (typeof PRESETS)[number]) {
    setWidthFt(p.widthFt);
    setDepthFt(p.depthFt);
    setGradeDropFt(p.gradeDropFt);
  }

  return (
    <div className="min-h-dvh overflow-x-hidden">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              <MapPin className="size-3" />
              San Rafael, CA 94901 · youth futsal terrace
            </p>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Turf Pad Builder
            </h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Size the cut-and-fill pad, balance dirt on-site, size walls &
              drainage, and price DIY or pro — with buy links for San Rafael /
              North Bay yards.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={result.withinEnvelope ? "success" : "warn"}>
              {result.withinEnvelope
                ? "Within hill envelope"
                : "Outside stated envelope"}
            </Badge>
            <Badge variant="outline">
              Net import {result.netImportCuYd} cu yd
            </Badge>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-12">
        <aside className="min-w-0 space-y-4 lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Maximize2 className="size-4 shrink-0 text-primary" />
                Pad size
              </CardTitle>
              <CardDescription>
                Hill working space ~{SITE.maxWidthFt} ft long ×{" "}
                {SITE.maxDepthFt} ft deep. Spec baseline is 24 × 13.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <Button
                    key={p.label}
                    type="button"
                    size="sm"
                    variant={
                      widthFt === p.widthFt && depthFt === p.depthFt
                        ? "default"
                        : "outline"
                    }
                    onClick={() => applyPreset(p)}
                  >
                    {p.label}
                  </Button>
                ))}
              </div>

              <DimSlider
                label="Width (along contour)"
                value={widthFt}
                min={12}
                max={32}
                step={1}
                unit="ft"
                onChange={setWidthFt}
                hint="Left–right · front & back walls run this length"
              />
              <DimSlider
                label="Depth (uphill → downhill)"
                value={depthFt}
                min={10}
                max={22}
                step={1}
                unit="ft"
                onChange={setDepthFt}
                hint="Distance between back cut wall and front fill wall"
              />
              <DimSlider
                label="Grade drop across pad"
                value={gradeDropFt}
                min={3}
                max={9}
                step={0.5}
                unit="ft"
                onChange={setGradeDropFt}
                hint="Natural slope to level · wall height = half this"
              />
              <DimSlider
                label="Trex sideboard height"
                value={sideboardHeightIn}
                min={3.5}
                max={11}
                step={0.5}
                unit="in"
                onChange={setSideboardHeightIn}
                hint="Boards nailed to PT posts & rails after walls"
              />

              <Separator />

              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">Pricing mode</p>
                  <p className="text-xs text-muted-foreground">
                    {mode === "diy"
                      ? "Materials + rentals (you build)"
                      : "Materials + contractor labor"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2 text-sm">
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
                    aria-label="Toggle pro pricing"
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
                <DimSlider
                  label="Optional helper days"
                  value={helperDays}
                  min={0}
                  max={10}
                  step={1}
                  unit="days"
                  onChange={setHelperDays}
                  hint="Day labor for earthwork & base (~$280/day)"
                />
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
                  incl. 10% contingency · {formatCurrency(result.costPerSqFt, 2)}
                  /sq ft
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-1 p-4">
                <p className="text-xs text-muted-foreground">Play surface</p>
                <p className="font-display text-2xl font-semibold tabular-nums text-foreground">
                  {result.areaSqFt}
                  <span className="ml-1 text-sm font-sans font-normal text-muted-foreground">
                    sq ft
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(depthFt, 0)} × {formatNumber(widthFt, 0)} ft
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-start gap-2 p-4">
                <Shovel className="mt-0.5 size-4 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Cut → fill</p>
                  <p className="font-mono text-lg font-medium tabular-nums">
                    {formatNumber(result.cutCuYd, 1)} cu yd
                  </p>
                  <p className="text-xs text-muted-foreground">
                    balanced on-site
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-start gap-2 p-4">
                <Layers className="mt-0.5 size-4 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Wall height</p>
                  <p className="font-mono text-lg font-medium tabular-nums">
                    {formatNumber(result.wallHeightFt, 1)} ft
                  </p>
                  <p className="text-xs text-muted-foreground">
                    each wall · {result.srwBlocks} blocks
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {result.warnings.length > 0 ? (
            <Card className="border-warn/40 bg-warn/5">
              <CardContent className="space-y-2 p-4">
                <p className="flex items-center gap-2 text-sm font-medium text-warn">
                  <AlertTriangle className="size-4 shrink-0" />
                  Site notes
                </p>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  {result.warnings.map((w) => (
                    <li key={w} className="leading-relaxed">
                      {w}
                    </li>
                  ))}
                  <li className="leading-relaxed">
                    Project site: San Rafael 94901 — confirm permits with City
                    of San Rafael Building Division (hillside + fill wall + pool
                    proximity).
                  </li>
                </ul>
              </CardContent>
            </Card>
          ) : null}
        </aside>

        <section className="min-w-0 space-y-4 lg:col-span-8">
          <Tabs defaultValue="plan" className="min-w-0">
            <TabsList className="h-auto w-full flex-wrap justify-start gap-1">
              <TabsTrigger value="plan">Plan view</TabsTrigger>
              <TabsTrigger value="section">Cut / fill</TabsTrigger>
              <TabsTrigger value="costs">Costs</TabsTrigger>
              <TabsTrigger value="bom">Materials</TabsTrigger>
              <TabsTrigger value="buy">Buy links</TabsTrigger>
              <TabsTrigger value="build">Build steps</TabsTrigger>
            </TabsList>

            <TabsContent value="plan" className="min-w-0">
              <Card className="min-w-0 overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ruler className="size-4 shrink-0 text-primary" />
                    Drainage layout — top-down
                  </CardTitle>
                  <CardDescription>
                    Not to scale · pad shown {formatNumber(widthFt, 0)} ft wide ×{" "}
                    {formatNumber(depthFt, 0)} ft deep · both perf pipes pitch
                    ~1% to the solid outlet
                  </CardDescription>
                </CardHeader>
                <CardContent className="min-w-0">
                  <PlanView
                    widthFt={widthFt}
                    depthFt={depthFt}
                    result={result}
                  />
                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    <div className="rounded-lg bg-muted/60 px-3 py-2 text-xs">
                      <span className="font-medium text-foreground">
                        Interceptor
                      </span>
                      <p className="text-muted-foreground">
                        Back wall · hillside water
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted/60 px-3 py-2 text-xs">
                      <span className="font-medium text-foreground">
                        Collector
                      </span>
                      <p className="text-muted-foreground">
                        Front wall · pad runoff
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted/60 px-3 py-2 text-xs">
                      <span className="font-medium text-foreground">
                        Outlet
                      </span>
                      <p className="text-muted-foreground">
                        {result.solidOutletLf} lf solid · daylights below
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="section" className="min-w-0">
              <Card className="min-w-0 overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowDownUp className="size-4 shrink-0 text-primary" />
                    Cut-and-fill balance
                  </CardTitle>
                  <CardDescription>
                    Level ~{formatNumber(gradeDropFt, 1)} ft of grade across{" "}
                    {formatNumber(depthFt, 0)} ft: cut{" "}
                    {formatNumber(result.wallHeightFt, 1)} ft at back, fill{" "}
                    {formatNumber(result.wallHeightFt, 1)} ft at front. Uphill
                    soil becomes downhill fill — no import when soil is clean.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SectionView
                    depthFt={depthFt}
                    gradeDropFt={gradeDropFt}
                    result={result}
                  />
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[280px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground">
                          <th className="pb-2 font-medium">Item</th>
                          <th className="pb-2 font-medium">Qty</th>
                          <th className="pb-2 font-medium">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="tabular-nums">
                        <tr className="border-b border-border/60">
                          <td className="py-2">Cut (back wedge)</td>
                          <td className="py-2">
                            {formatNumber(result.cutCuYd, 1)} cu yd
                          </td>
                          <td className="py-2 text-muted-foreground">
                            Excavate {formatNumber(result.wallHeightFt, 1)} ft at
                            back → 0 at center
                          </td>
                        </tr>
                        <tr className="border-b border-border/60">
                          <td className="py-2">Fill (front wedge)</td>
                          <td className="py-2">
                            {formatNumber(result.fillCuYd, 1)} cu yd
                          </td>
                          <td className="py-2 text-muted-foreground">
                            Build up front · 6–8 in lifts @ 90–95%
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 font-medium">Net import</td>
                          <td className="py-2 font-medium text-success">
                            ~0 (balanced)
                          </td>
                          <td className="py-2 text-muted-foreground">
                            Use engineered fill only if native is clayey/organic
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="costs" className="min-w-0">
              <div className="grid min-w-0 gap-4 lg:grid-cols-5">
                <Card className="min-w-0 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CircleDollarSign className="size-4 shrink-0 text-primary" />
                      Cost by category
                    </CardTitle>
                    <CardDescription>
                      {mode === "diy" ? "DIY materials" : "Pro installed"} ·
                      North Bay retail blend 2025–26
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-56 w-full min-w-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={byCategory}
                            dataKey="total"
                            nameKey="label"
                            innerRadius={48}
                            outerRadius={80}
                            paddingAngle={2}
                          >
                            {byCategory.map((d) => (
                              <Cell
                                key={d.category}
                                fill={
                                  CAT_COLORS[
                                    d.category as LineItem["category"]
                                  ]
                                }
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(v: number) => formatCurrency(v)}
                            contentStyle={{
                              borderRadius: 8,
                              border: "1px solid var(--color-border)",
                              fontSize: 12,
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <ul className="space-y-1.5 text-sm">
                      {byCategory.map((d) => (
                        <li
                          key={d.category}
                          className="flex items-center justify-between gap-2"
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <span
                              className="inline-block size-2.5 shrink-0 rounded-sm"
                              style={{
                                background:
                                  CAT_COLORS[
                                    d.category as LineItem["category"]
                                  ],
                              }}
                            />
                            <span className="truncate">{d.label}</span>
                          </span>
                          <span className="shrink-0 font-mono tabular-nums">
                            {formatCurrency(d.total)}
                          </span>
                        </li>
                      ))}
                      <li className="flex justify-between border-t border-border pt-2 text-muted-foreground">
                        <span>Contingency (10%)</span>
                        <span className="font-mono tabular-nums">
                          {formatCurrency(result.contingency)}
                        </span>
                      </li>
                      <li className="flex justify-between font-semibold">
                        <span>Grand total</span>
                        <span className="font-mono tabular-nums text-primary">
                          {formatCurrency(result.grandTotal)}
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="min-w-0 lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Category bars</CardTitle>
                    <CardDescription>
                      Subtotal {formatCurrency(result.subtotal)} before
                      contingency
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 w-full min-w-0">
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
                            width={88}
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
                                    d.category as LineItem["category"]
                                  ]
                                }
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Unit prices are blended DIY retail for the North Bay
                      (San Rafael / Marin + Santa Rosa yards OK). Pro mode adds
                      wall install (~$28/sq ft face), turf labor (~$6.50/sq ft),
                      and machine grading. Confirm live prices via Buy links.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="bom" className="min-w-0">
              <Card className="min-w-0 overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="size-4 shrink-0 text-primary" />
                    Bill of materials
                  </CardTitle>
                  <CardDescription>
                    Scaled from the 13 × 24 cut-and-fill spec · star = best-value
                    buy link for San Rafael 94901
                  </CardDescription>
                </CardHeader>
                <CardContent className="min-w-0 space-y-6">
                  <div>
                    <h4 className="mb-2 text-sm font-medium">
                      Aggregate shopping (round up at the yard)
                    </h4>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {shoppingAggregates.map((a) => {
                        const best = getBestOption(
                          getSuppliersForItem(a.itemId) ?? SUPPLIER_GROUPS[0]!,
                        );
                        return (
                          <div
                            key={a.name}
                            className="rounded-lg border border-border bg-muted/40 px-3 py-2"
                          >
                            <p className="text-sm font-medium">{a.name}</p>
                            <p className="font-mono text-sm tabular-nums text-primary">
                              {a.qty}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {a.note}
                            </p>
                            {best ? (
                              <a
                                href={best.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                              >
                                <Star className="size-3 fill-primary" />
                                {best.vendor}
                                <ExternalLink className="size-3" />
                              </a>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="w-full max-w-full overflow-x-auto overscroll-x-contain">
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
                              <p className="font-medium">{item.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {CATEGORY_LABELS[item.category]}
                                {item.notes ? ` · ${item.notes}` : ""}
                              </p>
                              <BuyLinks itemId={item.id} />
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
                          <td className="pt-3 font-mono tabular-nums">
                            {formatCurrency(result.subtotal)}
                          </td>
                        </tr>
                        <tr className="text-muted-foreground">
                          <td className="pt-1" colSpan={3}>
                            Contingency 10%
                          </td>
                          <td className="pt-1 font-mono tabular-nums">
                            {formatCurrency(result.contingency)}
                          </td>
                        </tr>
                        <tr className="text-primary">
                          <td className="pt-1 font-semibold" colSpan={3}>
                            Grand total
                          </td>
                          <td className="pt-1 font-mono text-base font-semibold tabular-nums">
                            {formatCurrency(result.grandTotal)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="buy" className="min-w-0">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="size-4 shrink-0 text-primary" />
                      Where to buy — San Rafael 94901
                    </CardTitle>
                    <CardDescription>
                      Starred options are best value as of research (Aug 2026).
                      Aggregates: local yards. Pipe/Trex/blocks: Home Depot
                      BOPIS. Santa Rosa / Sonoma yards OK if delivery is
                      cheaper.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-3">
                      {LOCAL_YARDS.map((y) => (
                        <a
                          key={y.name}
                          href={y.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-muted/40"
                        >
                          <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                            {y.name}
                            <ExternalLink className="size-3.5 text-primary" />
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {y.address}
                          </p>
                          {y.phone ? (
                            <p className="mt-0.5 font-mono text-xs text-foreground">
                              {y.phone}
                            </p>
                          ) : null}
                          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                            {y.note}
                          </p>
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {SUPPLIER_GROUPS.map((group) => {
                  const best = getBestOption(group);
                  return (
                    <Card key={group.title} className="min-w-0">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          {group.title}
                        </CardTitle>
                        <CardDescription>{group.tip}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="divide-y divide-border">
                          {group.options.map((opt) => (
                            <li key={opt.url + opt.product}>
                              <a
                                href={opt.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col gap-0.5 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                              >
                                <div className="min-w-0">
                                  <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-foreground">
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
                                  <p className="text-xs text-muted-foreground">
                                    {opt.area}
                                    {opt.phone ? ` · ${opt.phone}` : ""}
                                  </p>
                                </div>
                                <div className="flex shrink-0 items-center gap-2 sm:text-right">
                                  <span
                                    className={
                                      opt.best
                                        ? "font-mono text-sm font-medium text-primary"
                                        : "font-mono text-sm text-muted-foreground"
                                    }
                                  >
                                    {opt.priceNote}
                                  </span>
                                  <ExternalLink className="size-3.5 text-primary" />
                                </div>
                              </a>
                            </li>
                          ))}
                        </ul>
                        {best ? (
                          <p className="mt-1 text-xs text-muted-foreground">
                            Tip: open the starred row first — usually lowest
                            landed cost for this line.
                          </p>
                        ) : null}
                      </CardContent>
                    </Card>
                  );
                })}

                <p className="text-center text-xs text-muted-foreground">
                  Prices change — re-check before ordering. Call A&S or North
                  Bay Materials for bulk rock quotes to 94901; compare HD vs
                  Lowe’s same day on pipe and Trex.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="build" className="min-w-0">
              <Card className="min-w-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="size-4 shrink-0 text-primary" />
                    Build sequence
                  </CardTitle>
                  <CardDescription>
                    Follow the walls-before-turf order from the spec. Check off
                    as you go — saved only in this session.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {BUILD_PHASES.map((phase) => {
                      const done = !!checkedPhases[phase.id];
                      return (
                        <li
                          key={phase.id}
                          className="rounded-xl border border-border bg-card p-4"
                        >
                          <button
                            type="button"
                            className="flex w-full items-start gap-3 text-left"
                            onClick={() =>
                              setCheckedPhases((s) => ({
                                ...s,
                                [phase.id]: !s[phase.id],
                              }))
                            }
                          >
                            {done ? (
                              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
                            ) : (
                              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-border font-mono text-xs text-muted-foreground">
                                {phase.id}
                              </span>
                            )}
                            <div className="min-w-0 flex-1">
                              <p
                                className={
                                  done
                                    ? "font-medium text-muted-foreground line-through"
                                    : "font-medium text-foreground"
                                }
                              >
                                {phase.title}
                              </p>
                              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                                {phase.steps.map((step) => (
                                  <li key={step} className="leading-relaxed">
                                    · {step}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="border-primary/25 bg-primary/5">
            <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium text-foreground">
                  Youth futsal on this pad
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  At {result.areaSqFt} sq ft (
                  {formatNumber(depthFt, 0)} × {formatNumber(widthFt, 0)}), this
                  is a skills / 2v2–3v3 strip — not a full court. Pair with
                  portable goals (~2 m × 3 m), rounded Trex corners, and
                  short-pile recreational turf with silica infill for ball roll.
                </p>
              </div>
              <Badge
                variant="default"
                className="shrink-0 self-start sm:self-center"
              >
                12-year-old ready
              </Badge>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        Estimates only · San Rafael 94901 · confirm permits & live prices · Call
        811 before digging
      </footer>
    </div>
  );
}
