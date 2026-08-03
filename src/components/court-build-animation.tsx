import { useEffect, useState } from "react";
import type { CourtSurface } from "@/lib/court-calc";
import { SURFACE_LOOK } from "@/lib/court-calc";
import { MATERIAL_LABELS } from "@/lib/material-images";
import { MaterialThumb } from "@/components/material-thumb";
import { cn } from "@/lib/utils";

/** Materials shown under each Fern build phase (tap to locate). */
export const COURT_PHASE_MATERIALS: Record<
  number,
  (surface: CourtSurface) => string[]
> = {
  1: () => ["level", "class2", "fence", "net"],
  2: () => ["cut-fill", "compactor", "level"],
  3: (s) =>
    s === "acrylic"
      ? ["geo", "class2", "asphalt", "compactor"]
      : ["geo", "class2", "bedding", "compactor"],
  4: (s) =>
    s === "acrylic"
      ? ["acrylic", "lines"]
      : s === "modular"
        ? ["modular", "lines"]
        : ["turf", "infill", "lines"],
  5: () => ["net", "futsal-goals"],
  6: () => ["fence", "windscreen", "gate-s"],
};

interface CourtBuildAnimationProps {
  phaseId: number;
  surface: CourtSurface;
  active?: boolean;
  includeFutsalGoals?: boolean;
}

type MatProps = (id: string) => {
  "data-mat": string;
  className: string;
};

/**
 * Instructional CSS/SVG animations for Fern tennis-court build phases.
 * Tap a material chip to freeze the final frame and highlight that piece.
 */
export function CourtBuildAnimation({
  phaseId,
  surface,
  active = true,
  includeFutsalGoals = true,
}: CourtBuildAnimationProps) {
  const mats = (COURT_PHASE_MATERIALS[phaseId]?.(surface) ?? []).filter(
    (id) => includeFutsalGoals || id !== "futsal-goals",
  );
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [phaseId, active, surface]);

  const frozen = Boolean(selected);
  const matProps: MatProps = (id) => ({
    "data-mat": id,
    className: cn(
      "mat-region",
      selected ? (selected === id ? "mat-hl" : "mat-dim") : undefined,
    ),
  });

  function toggle(id: string) {
    setSelected((s) => (s === id ? null : id));
  }

  const label = selected ? (MATERIAL_LABELS[selected] ?? selected) : null;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-muted/40">
      <div className="relative aspect-[16/9] w-full">
        <svg
          viewBox="0 0 400 225"
          className={cn("h-full w-full", frozen && "anim-end")}
          role="img"
          aria-label={
            label
              ? `Fern build step ${phaseId}: highlighting ${label}`
              : `Animation for Fern build step ${phaseId}`
          }
        >
          <rect width="400" height="225" fill="var(--color-background)" />
          {phaseId === 1 && <AnimSurvey active={active} matProps={matProps} />}
          {phaseId === 2 && (
            <AnimCourtCutFill active={active} matProps={matProps} />
          )}
          {phaseId === 3 && (
            <AnimCourtBase
              active={active}
              matProps={matProps}
              surface={surface}
            />
          )}
          {phaseId === 4 && (
            <AnimCourtSurface
              active={active}
              matProps={matProps}
              surface={surface}
            />
          )}
          {phaseId === 5 && (
            <AnimNetMulti
              active={active}
              matProps={matProps}
              includeFutsalGoals={includeFutsalGoals}
            />
          )}
          {phaseId === 6 && <AnimFence active={active} matProps={matProps} />}

          {label ? (
            <g className="mat-banner pointer-events-none">
              <rect
                x="70"
                y="6"
                width="260"
                height="24"
                rx="8"
                fill="var(--color-accent)"
              />
              <text
                x="200"
                y="22"
                textAnchor="middle"
                fill="var(--color-accent-foreground)"
                fontSize="12"
                fontWeight="600"
                fontFamily="var(--font-sans)"
              >
                {label}
              </text>
            </g>
          ) : null}
        </svg>
      </div>
      {mats.length > 0 ? (
        <div className="border-t border-border px-3 py-2">
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Materials — tap to locate
            </span>
            {selected ? (
              <button
                type="button"
                className="text-[10px] font-medium text-primary hover:underline"
                onClick={() => setSelected(null)}
              >
                Clear highlight
              </button>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            {mats.map((id) => {
              const on = selected === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-xs transition-colors",
                    on
                      ? "border-accent bg-accent/10 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  <MaterialThumb itemId={id} size="sm" />
                  <span>{MATERIAL_LABELS[id] ?? id}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

interface SceneProps {
  active?: boolean;
  matProps: MatProps;
}

/** Mini regulation court outline (plan) for reuse. */
function MiniCourtLines({
  x,
  y,
  w,
  h,
  opacity = 1,
  line = "var(--color-foreground)",
  net = "var(--color-accent)",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  opacity?: number;
  line?: string;
  net?: string;
}) {
  const alley = h * (4.5 / 36);
  const netX = x + w / 2;
  const sL = x + w * (18 / 78);
  const sR = x + w * (60 / 78);
  const midY = y + h / 2;
  return (
    <g opacity={opacity} stroke={line} fill="none">
      <rect x={x} y={y} width={w} height={h} strokeWidth={1.5} />
      <line x1={x} y1={y + alley} x2={x + w} y2={y + alley} strokeWidth={1} />
      <line
        x1={x}
        y1={y + h - alley}
        x2={x + w}
        y2={y + h - alley}
        strokeWidth={1}
      />
      <line x1={sL} y1={y + alley} x2={sL} y2={y + h - alley} strokeWidth={1} />
      <line x1={sR} y1={y + alley} x2={sR} y2={y + h - alley} strokeWidth={1} />
      <line x1={sL} y1={midY} x2={sR} y2={midY} strokeWidth={1} />
      <line
        x1={netX}
        y1={y - 2}
        x2={netX}
        y2={y + h + 2}
        stroke={net}
        strokeWidth={2}
      />
    </g>
  );
}

function AnimSurvey({ active, matProps }: SceneProps) {
  return (
    <g className={active ? "anim-prep" : undefined}>
      {/* Staked overall pad 120×60 */}
      <rect
        x="40"
        y="40"
        width="320"
        height="140"
        fill="var(--color-hill)"
        opacity=".25"
        className="anim-fade-in"
      />
      <rect
        x="40"
        y="40"
        width="320"
        height="140"
        fill="none"
        stroke="var(--color-muted-foreground)"
        strokeWidth="2"
        strokeDasharray="6 4"
        className="anim-draw"
      />
      {/* Stake points */}
      {[
        [40, 40],
        [360, 40],
        [40, 180],
        [360, 180],
      ].map(([cx, cy], i) => (
        <g key={i} className="anim-pop" style={{ animationDelay: `${i * 0.1}s` }}>
          <line
            x1={cx}
            y1={cy - 10}
            x2={cx}
            y2={cy + 6}
            stroke="var(--color-accent)"
            strokeWidth="2"
          />
          <circle cx={cx} cy={cy - 12} r="3" fill="var(--color-accent)" />
        </g>
      ))}
      {/* Play rectangle staked inside */}
      <g {...matProps("net")}>
        <MiniCourtLines x={90} y={65} w={220} h={90} opacity={0.9} />
      </g>
      <g {...matProps("level")}>
        <rect
          x="160"
          y="30"
          width="80"
          height="14"
          rx="3"
          fill="var(--color-pipe)"
          className="anim-fade-in anim-delay-1"
        />
        <text
          x="200"
          y="40"
          textAnchor="middle"
          fill="var(--color-primary-foreground)"
          fontSize="8"
          fontFamily="var(--font-sans)"
        >
          laser level
        </text>
      </g>
      <g {...matProps("class2")}>
        <text
          x="200"
          y="160"
          textAnchor="middle"
          fill="var(--color-muted-foreground)"
          fontSize="9"
          fontFamily="var(--font-sans)"
          className="anim-fade-in anim-delay-2"
        >
          stake envelope · order base + surface
        </text>
      </g>
      <g {...matProps("fence")}>
        <rect
          x="32"
          y="32"
          width="336"
          height="156"
          fill="none"
          stroke="var(--color-wall)"
          strokeWidth="1.5"
          strokeDasharray="2 3"
          className="anim-draw anim-delay-2"
          opacity=".5"
        />
      </g>
      <text
        x="200"
        y="210"
        textAnchor="middle"
        fill="var(--color-muted-foreground)"
        fontSize="11"
        fontFamily="var(--font-sans)"
      >
        811 · stake 120×60 · confirm permits
      </text>
    </g>
  );
}

function AnimCourtCutFill({ active, matProps }: SceneProps) {
  return (
    <g className={active ? "anim-cutfill" : undefined}>
      {/* Section through court length: high left → low right */}
      <path
        d="M30 70 L200 100 L370 140 L370 170 L30 170 Z"
        fill="var(--color-hill)"
        opacity=".45"
      />
      {/* Cut wedge (high side) */}
      <g {...matProps("cut-fill")}>
        <path
          d="M30 70 L200 100 L200 120 L30 100 Z"
          fill="var(--color-warn)"
          opacity=".55"
          className="anim-cut"
        />
        <text
          x="90"
          y="88"
          fill="var(--color-foreground)"
          fontSize="10"
          fontFamily="var(--font-sans)"
          fontWeight="600"
          className="anim-fade-in"
        >
          CUT
        </text>
        {/* Fill wedge */}
        <path
          d="M200 120 L370 150 L370 170 L200 140 Z"
          fill="var(--color-accent)"
          opacity=".4"
          className="anim-fill"
        />
        <text
          x="290"
          y="148"
          fill="var(--color-foreground)"
          fontSize="10"
          fontFamily="var(--font-sans)"
          fontWeight="600"
          className="anim-fade-in anim-delay-1"
        >
          FILL
        </text>
      </g>
      {/* Finished level pad with pitch */}
      <line
        x1="30"
        y1="100"
        x2="370"
        y2="115"
        stroke="var(--color-primary)"
        strokeWidth="3"
        strokeLinecap="round"
        className="anim-draw anim-delay-2"
      />
      <g {...matProps("level")}>
        <text
          x="200"
          y="95"
          textAnchor="middle"
          fill="var(--color-primary)"
          fontSize="9"
          fontFamily="var(--font-sans)"
          className="anim-fade-in anim-delay-2"
        >
          level pad · ~0.8% pitch
        </text>
      </g>
      <g {...matProps("compactor")}>
        <rect
          x="230"
          y="118"
          width="36"
          height="18"
          rx="3"
          fill="var(--color-pipe)"
          className="anim-compactor anim-delay-2"
        />
        <text
          x="248"
          y="150"
          textAnchor="middle"
          fill="var(--color-muted-foreground)"
          fontSize="8"
          fontFamily="var(--font-sans)"
          className="anim-fade-in anim-delay-2"
        >
          compact lifts
        </text>
      </g>
      <text
        x="200"
        y="205"
        textAnchor="middle"
        fill="var(--color-muted-foreground)"
        fontSize="11"
        fontFamily="var(--font-sans)"
      >
        Cut high · fill low · compact · sheet drain
      </text>
    </g>
  );
}

function AnimCourtBase({
  active,
  matProps,
  surface,
}: SceneProps & { surface: CourtSurface }) {
  const topLayer =
    surface === "acrylic"
      ? { id: "asphalt", label: "asphalt ~3″", color: "#3A3A40" }
      : { id: "bedding", label: "bedding ~1″", color: "#C4B59A" };

  return (
    <g className={active ? "anim-base" : undefined}>
      {/* Layer stack section */}
      <text
        x="200"
        y="28"
        textAnchor="middle"
        fill="var(--color-muted-foreground)"
        fontSize="10"
        fontFamily="var(--font-sans)"
      >
        structural stack (section)
      </text>

      {/* Subgrade */}
      <rect x="50" y="160" width="300" height="28" fill="var(--color-hill)" opacity=".5" />
      <text
        x="200"
        y="178"
        textAnchor="middle"
        fill="var(--color-muted-foreground)"
        fontSize="9"
        fontFamily="var(--font-sans)"
      >
        compacted subgrade
      </text>

      <g {...matProps("geo")}>
        <rect
          x="50"
          y="148"
          width="300"
          height="10"
          fill="#2A2A2E"
          opacity=".75"
          className="anim-layer-1"
        />
        <text
          x="60"
          y="156"
          fill="#fff"
          fontSize="8"
          fontFamily="var(--font-sans)"
          className="anim-fade-in"
        >
          geotextile
        </text>
      </g>

      <g {...matProps("class2")}>
        <rect
          x="50"
          y="100"
          width="300"
          height="48"
          fill="var(--color-wall)"
          opacity=".7"
          className="anim-layer-2"
        />
        <text
          x="200"
          y="128"
          textAnchor="middle"
          fill="var(--color-primary-foreground)"
          fontSize="11"
          fontFamily="var(--font-sans)"
          fontWeight="600"
          className="anim-fade-in anim-delay-1"
        >
          Class II road base · compact in lifts
        </text>
      </g>

      <g {...matProps(topLayer.id)}>
        <rect
          x="50"
          y="72"
          width="300"
          height={surface === "acrylic" ? 28 : 20}
          fill={topLayer.color}
          className="anim-layer-3"
        />
        <text
          x="200"
          y={surface === "acrylic" ? 90 : 86}
          textAnchor="middle"
          fill="#f5f2eb"
          fontSize="10"
          fontFamily="var(--font-sans)"
          className="anim-fade-in anim-delay-2"
        >
          {topLayer.label}
        </text>
      </g>

      <g {...matProps("compactor")}>
        <rect
          x="300"
          y="50"
          width="32"
          height="16"
          rx="2"
          fill="var(--color-pipe)"
          className="anim-compactor anim-delay-2"
        />
      </g>

      <text
        x="200"
        y="210"
        textAnchor="middle"
        fill="var(--color-muted-foreground)"
        fontSize="11"
        fontFamily="var(--font-sans)"
      >
        {surface === "acrylic"
          ? "Geo → Class II → asphalt (cure) → acrylic later"
          : "Geo → Class II → bedding screed → surface"}
      </text>
    </g>
  );
}

function AnimCourtSurface({
  active,
  matProps,
  surface,
}: SceneProps & { surface: CourtSurface }) {
  const look = SURFACE_LOOK[surface];

  if (surface === "modular") {
    return (
      <g className={active ? "anim-surface" : undefined}>
        <rect x="45" y="40" width="310" height="120" fill={look.runback} rx="2" />
        <g {...matProps("modular")}>
          {Array.from({ length: 6 }).map((_, row) =>
            Array.from({ length: 10 }).map((_, col) => (
              <rect
                key={`${row}-${col}`}
                x={50 + col * 30}
                y={45 + row * 22}
                width="28"
                height="20"
                rx="2"
                fill={look.playInner}
                stroke="#1A5C32"
                strokeWidth="0.7"
                opacity={0.82 + ((row + col) % 3) * 0.06}
                className="anim-pop"
                style={{ animationDelay: `${(row * 10 + col) * 0.03}s` }}
              />
            )),
          )}
        </g>
        <g {...matProps("lines")}>
          <MiniCourtLines
            x={80}
            y={55}
            w={240}
            h={100}
            line={look.line}
            net={look.net}
          />
        </g>
        <text
          x="200"
          y="210"
          textAnchor="middle"
          fill="var(--color-muted-foreground)"
          fontSize="11"
          fontFamily="var(--font-sans)"
        >
          Green PP sport tiles · white lines
        </text>
      </g>
    );
  }

  if (surface === "turf") {
    return (
      <g className={active ? "anim-surface" : undefined}>
        <g {...matProps("turf")}>
          <rect
            x="50"
            y="50"
            width="300"
            height="110"
            fill={look.play}
            className="anim-turf-roll"
          />
          <rect
            x="50"
            y="50"
            width="24"
            height="110"
            fill={look.playInner}
            className="anim-roll-cyl"
          />
          {Array.from({ length: 16 }).map((_, i) => (
            <line
              key={i}
              x1={75 + i * 16}
              y1="58"
              x2={78 + i * 16}
              y2="152"
              stroke={look.playInner}
              strokeWidth="1.4"
              opacity="0.4"
            />
          ))}
        </g>
        <g {...matProps("infill")}>
          {[70, 100, 130, 160, 190, 220, 250, 280, 310].map((x, i) => (
            <circle
              key={x}
              cx={x}
              cy={120}
              r="2"
              fill="#C4B59A"
              className="anim-infill"
              style={{ animationDelay: `${0.3 + i * 0.05}s` }}
            />
          ))}
        </g>
        <g {...matProps("lines")}>
          <MiniCourtLines
            x={80}
            y={60}
            w={240}
            h={90}
            line={look.line}
            net={look.net}
          />
        </g>
        <text
          x="200"
          y="210"
          textAnchor="middle"
          fill="var(--color-muted-foreground)"
          fontSize="11"
          fontFamily="var(--font-sans)"
        >
          Short-pile turf · natural green · chalk lines
        </text>
      </g>
    );
  }

  // acrylic
  return (
    <g className={active ? "anim-surface" : undefined}>
      <rect x="50" y="50" width="300" height="110" fill={look.runback} />
      <g {...matProps("acrylic")}>
        <rect
          x="70"
          y="60"
          width="260"
          height="90"
          fill={look.play}
          className="anim-layer-1"
        />
        <rect
          x="70"
          y="72"
          width="260"
          height="66"
          fill={look.playInner}
          opacity="0.28"
          className="anim-layer-2"
        />
        <text
          x="200"
          y="100"
          textAnchor="middle"
          fill={look.line}
          fontSize="10"
          fontFamily="var(--font-sans)"
          className="anim-fade-in anim-delay-1"
        >
          resurfacer → blue color coats
        </text>
      </g>
      <g {...matProps("lines")}>
        <MiniCourtLines
          x={80}
          y={60}
          w={240}
          h={90}
          line={look.line}
          net={look.net}
        />
      </g>
      <text
        x="200"
        y="210"
        textAnchor="middle"
        fill="var(--color-muted-foreground)"
        fontSize="11"
        fontFamily="var(--font-sans)"
      >
        Acrylic · blue play / green runback
      </text>
    </g>
  );
}

function AnimNetMulti({
  active,
  matProps,
  includeFutsalGoals,
}: SceneProps & { includeFutsalGoals: boolean }) {
  /**
   * Three clear sequential panels (not stacked on one court):
   *  1) Set posts + hang net
   *  2) Drop net for multi-sport
   *  3) Goals at fence-end centers · full pad field
   */
  return (
    <g className={active ? "anim-net" : undefined}>
      {/* Panel frames */}
      <rect x="8" y="22" width="120" height="160" rx="8" fill="var(--color-card)" stroke="var(--color-border)" />
      <rect x="140" y="22" width="120" height="160" rx="8" fill="var(--color-card)" stroke="var(--color-border)" />
      <rect x="272" y="22" width="120" height="160" rx="8" fill="var(--color-card)" stroke="var(--color-border)" />

      {/* Step numbers */}
      {[
        { x: 18, n: "1" },
        { x: 150, n: "2" },
        { x: 282, n: "3" },
      ].map((s) => (
        <g key={s.n}>
          <circle cx={s.x + 8} cy={34} r="8" fill="var(--color-primary)" className="anim-pop" />
          <text
            x={s.x + 8}
            y={37}
            textAnchor="middle"
            fill="var(--color-primary-foreground)"
            fontSize="9"
            fontFamily="var(--font-sans)"
            fontWeight="700"
          >
            {s.n}
          </text>
        </g>
      ))}

      {/* ── Panel 1: tennis net up ── */}
      <g {...matProps("net")}>
        <rect
          x="22"
          y="50"
          width="92"
          height="70"
          fill="#3A7BC8"
          opacity="0.35"
          rx="2"
          className="anim-fade-in"
        />
        {/* posts */}
        <rect
          x="64"
          y="48"
          width="5"
          height="74"
          fill="var(--color-pipe)"
          className="anim-post-1"
        />
        <rect
          x="64"
          y="48"
          width="5"
          height="8"
          fill="var(--color-foreground)"
          className="anim-post-1"
        />
        {/* mesh hanging from top */}
        <g className="anim-fade-in anim-delay-1">
          {[58, 66, 74, 82, 90, 98, 106].map((y) => (
            <line
              key={y}
              x1="28"
              y1={y}
              x2="108"
              y2={y}
              stroke="var(--color-accent)"
              strokeWidth="1"
            />
          ))}
          {[36, 48, 60, 72, 84, 96].map((x) => (
            <line
              key={x}
              x1={x}
              y1="54"
              x2={x}
              y2="112"
              stroke="var(--color-accent)"
              strokeWidth="0.8"
              opacity="0.7"
            />
          ))}
        </g>
        <line
          x1="28"
          y1="54"
          x2="108"
          y2="54"
          stroke="var(--color-foreground)"
          strokeWidth="2.5"
          className="anim-draw"
        />
        <text
          x="68"
          y="140"
          textAnchor="middle"
          fill="var(--color-foreground)"
          fontSize="9"
          fontFamily="var(--font-sans)"
          fontWeight="600"
          className="anim-fade-in"
        >
          Set posts + net
        </text>
        <text
          x="68"
          y="154"
          textAnchor="middle"
          fill="var(--color-muted-foreground)"
          fontSize="8"
          fontFamily="var(--font-sans)"
        >
          tennis mode
        </text>
      </g>

      {/* ── Panel 2: net dropped ── */}
      <g>
        <rect
          x="154"
          y="50"
          width="92"
          height="70"
          fill="#3A7BC8"
          opacity="0.35"
          rx="2"
          className="anim-fade-in anim-delay-1"
        />
        {/* posts remain */}
        <rect
          x="196"
          y="48"
          width="5"
          height="74"
          fill="var(--color-pipe)"
          opacity="0.5"
          className="anim-fade-in anim-delay-1"
        />
        {/* net rolled/dropped at bottom */}
        <g {...matProps("net")}>
          <rect
            x="162"
            y="108"
            width="76"
            height="10"
            rx="3"
            fill="var(--color-accent)"
            className="anim-fade-in anim-delay-2"
          />
          <path
            d="M170 108 Q180 98 190 108 Q200 98 210 108 Q220 98 230 108"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            className="anim-draw anim-delay-1"
          />
        </g>
        <text
          x="200"
          y="140"
          textAnchor="middle"
          fill="var(--color-foreground)"
          fontSize="9"
          fontFamily="var(--font-sans)"
          fontWeight="600"
          className="anim-fade-in anim-delay-1"
        >
          Drop / remove net
        </text>
        <text
          x="200"
          y="154"
          textAnchor="middle"
          fill="var(--color-muted-foreground)"
          fontSize="8"
          fontFamily="var(--font-sans)"
        >
          open the full pad
        </text>
      </g>

      {/* ── Panel 3: goals at fence ends ── */}
      <g {...matProps("futsal-goals")}>
        {/* fence outline = field */}
        <rect
          x="286"
          y="48"
          width="92"
          height="74"
          fill="var(--color-success)"
          opacity="0.1"
          rx="2"
          className="anim-fade-in anim-delay-2"
        />
        <rect
          x="286"
          y="48"
          width="92"
          height="74"
          fill="none"
          stroke="var(--color-wall)"
          strokeWidth="2.5"
          className="anim-draw anim-delay-2"
        />
        {/* small tennis lines ghosted */}
        <rect
          x="304"
          y="62"
          width="56"
          height="46"
          fill="none"
          stroke="var(--color-muted-foreground)"
          strokeWidth="0.8"
          strokeDasharray="2 2"
          opacity="0.5"
        />
        {includeFutsalGoals ? (
          <>
            <rect
              x="282"
              y="70"
              width="8"
              height="30"
              rx="1"
              fill="var(--color-success)"
              className="anim-pop anim-delay-2"
            />
            <rect
              x="374"
              y="70"
              width="8"
              height="30"
              rx="1"
              fill="var(--color-success)"
              className="anim-pop anim-delay-2"
            />
          </>
        ) : (
          <text
            x="332"
            y="90"
            textAnchor="middle"
            fill="var(--color-muted-foreground)"
            fontSize="8"
            fontFamily="var(--font-sans)"
          >
            goals off
          </text>
        )}
        <text
          x="332"
          y="140"
          textAnchor="middle"
          fill="var(--color-success)"
          fontSize="9"
          fontFamily="var(--font-sans)"
          fontWeight="600"
          className="anim-fade-in anim-delay-2"
        >
          Goals @ fence ends
        </text>
        <text
          x="332"
          y="154"
          textAnchor="middle"
          fill="var(--color-muted-foreground)"
          fontSize="8"
          fontFamily="var(--font-sans)"
        >
          not tennis baselines
        </text>
      </g>

      <text
        x="200"
        y="208"
        textAnchor="middle"
        fill="var(--color-muted-foreground)"
        fontSize="11"
        fontFamily="var(--font-sans)"
      >
        Tennis net up → drop net → futsal on full pad
      </text>
    </g>
  );
}

function AnimFence({ active, matProps }: SceneProps) {
  /**
   * Three clear sequential panels:
   *  1) Set posts
   *  2) Hang fabric + top rail
   *  3) Gates + windscreen
   */
  return (
    <g className={active ? "anim-fence" : undefined}>
      <rect x="8" y="22" width="120" height="160" rx="8" fill="var(--color-card)" stroke="var(--color-border)" />
      <rect x="140" y="22" width="120" height="160" rx="8" fill="var(--color-card)" stroke="var(--color-border)" />
      <rect x="272" y="22" width="120" height="160" rx="8" fill="var(--color-card)" stroke="var(--color-border)" />

      {[
        { x: 18, n: "1" },
        { x: 150, n: "2" },
        { x: 282, n: "3" },
      ].map((s) => (
        <g key={s.n}>
          <circle cx={s.x + 8} cy={34} r="8" fill="var(--color-primary)" className="anim-pop" />
          <text
            x={s.x + 8}
            y={37}
            textAnchor="middle"
            fill="var(--color-primary-foreground)"
            fontSize="9"
            fontFamily="var(--font-sans)"
            fontWeight="700"
          >
            {s.n}
          </text>
        </g>
      ))}

      {/* ── Panel 1: posts only ── */}
      <g {...matProps("fence")}>
        {[28, 48, 68, 88, 108].map((x, i) => (
          <rect
            key={x}
            x={x - 2}
            y={48}
            width="4"
            height="80"
            fill="var(--color-wall)"
            className="anim-post-1"
            style={{ animationDelay: `${0.1 + i * 0.08}s` }}
          />
        ))}
        {/* ground line */}
        <line
          x1="20"
          y1="128"
          x2="116"
          y2="128"
          stroke="var(--color-hill)"
          strokeWidth="3"
        />
        <text
          x="68"
          y="145"
          textAnchor="middle"
          fill="var(--color-foreground)"
          fontSize="9"
          fontFamily="var(--font-sans)"
          fontWeight="600"
        >
          Set posts
        </text>
        <text
          x="68"
          y="158"
          textAnchor="middle"
          fill="var(--color-muted-foreground)"
          fontSize="8"
          fontFamily="var(--font-sans)"
        >
          terminals + line posts
        </text>
      </g>

      {/* ── Panel 2: fabric + top rail ── */}
      <g {...matProps("fence")}>
        {[160, 180, 200, 220, 240].map((x, i) => (
          <rect
            key={x}
            x={x - 2}
            y={48}
            width="4"
            height="80"
            fill="var(--color-wall)"
            opacity="0.85"
          />
        ))}
        {/* top rail */}
        <line
          x1="156"
          y1="50"
          x2="244"
          y2="50"
          stroke="var(--color-wall)"
          strokeWidth="4"
          strokeLinecap="round"
          className="anim-rail-1"
        />
        {/* chain-link fabric between posts — clean diamond grid, clipped */}
        <g className="anim-fade-in anim-delay-1">
          <rect
            x="158"
            y="54"
            width="84"
            height="70"
            fill="none"
            stroke="var(--color-muted-foreground)"
            strokeWidth="0.8"
            opacity="0.35"
          />
          {/* simple X lattice rows */}
          {[58, 70, 82, 94, 106, 118].map((y) => (
            <line
              key={`h${y}`}
              x1="160"
              y1={y}
              x2="240"
              y2={y}
              stroke="var(--color-muted-foreground)"
              strokeWidth="0.9"
              opacity="0.55"
            />
          ))}
          {[164, 176, 188, 200, 212, 224, 236].map((x) => (
            <line
              key={`v${x}`}
              x1={x}
              y1="56"
              x2={x}
              y2="122"
              stroke="var(--color-muted-foreground)"
              strokeWidth="0.9"
              opacity="0.45"
            />
          ))}
        </g>
        <line
          x1="152"
          y1="128"
          x2="248"
          y2="128"
          stroke="var(--color-hill)"
          strokeWidth="3"
        />
        <text
          x="200"
          y="145"
          textAnchor="middle"
          fill="var(--color-foreground)"
          fontSize="9"
          fontFamily="var(--font-sans)"
          fontWeight="600"
          className="anim-fade-in anim-delay-1"
        >
          Fabric + top rail
        </text>
        <text
          x="200"
          y="158"
          textAnchor="middle"
          fill="var(--color-muted-foreground)"
          fontSize="8"
          fontFamily="var(--font-sans)"
        >
          hang chain-link mesh
        </text>
      </g>

      {/* ── Panel 3: gate + windscreen ── */}
      <g>
        {/* posts */}
        {[292, 312, 332, 352, 372].map((x) => (
          <rect
            key={x}
            x={x - 2}
            y={48}
            width="4"
            height="80"
            fill="var(--color-wall)"
            opacity="0.75"
          />
        ))}
        <line
          x1="288"
          y1="50"
          x2="376"
          y2="50"
          stroke="var(--color-wall)"
          strokeWidth="3"
        />
        {/* fabric ghost */}
        <rect
          x="290"
          y="54"
          width="80"
          height="70"
          fill="var(--color-muted-foreground)"
          opacity="0.12"
        />
        {/* windscreen panels on sides */}
        <g {...matProps("windscreen")}>
          <rect
            x="292"
            y="56"
            width="14"
            height="66"
            fill="var(--color-pipe)"
            opacity="0.9"
            className="anim-fade-in anim-delay-1"
          />
          <rect
            x="358"
            y="56"
            width="14"
            height="66"
            fill="var(--color-pipe)"
            opacity="0.9"
            className="anim-fade-in anim-delay-1"
          />
          {/* bottom gap */}
          <line
            x1="292"
            y1="122"
            x2="306"
            y2="122"
            stroke="var(--color-background)"
            strokeWidth="3"
          />
        </g>
        {/* gate in center */}
        <g {...matProps("gate-s")}>
          <rect
            x="318"
            y="70"
            width="28"
            height="54"
            rx="2"
            fill="var(--color-card)"
            stroke="var(--color-accent)"
            strokeWidth="2.5"
            className="anim-pop anim-delay-2"
          />
          <circle
            cx="340"
            cy="98"
            r="2.5"
            fill="var(--color-accent)"
            className="anim-pop anim-delay-2"
          />
          <text
            x="332"
            y="100"
            textAnchor="middle"
            fill="var(--color-accent)"
            fontSize="7"
            fontFamily="var(--font-sans)"
            className="anim-fade-in anim-delay-2"
          >
            gate
          </text>
        </g>
        <line
          x1="284"
          y1="128"
          x2="380"
          y2="128"
          stroke="var(--color-hill)"
          strokeWidth="3"
        />
        <text
          x="332"
          y="145"
          textAnchor="middle"
          fill="var(--color-foreground)"
          fontSize="9"
          fontFamily="var(--font-sans)"
          fontWeight="600"
          className="anim-fade-in anim-delay-2"
        >
          Gate + windscreen
        </text>
        <text
          x="332"
          y="158"
          textAnchor="middle"
          fill="var(--color-muted-foreground)"
          fontSize="8"
          fontFamily="var(--font-sans)"
        >
          leave bottom air gap
        </text>
      </g>

      <text
        x="200"
        y="208"
        textAnchor="middle"
        fill="var(--color-muted-foreground)"
        fontSize="11"
        fontFamily="var(--font-sans)"
      >
        Posts → fabric & rail → gates & windscreen
      </text>
    </g>
  );
}
