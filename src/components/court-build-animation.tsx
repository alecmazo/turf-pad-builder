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
  return (
    <g className={active ? "anim-net" : undefined}>
      {/* Full pad / fence envelope = futsal field */}
      <rect
        x="30"
        y="35"
        width="340"
        height="145"
        fill="var(--color-primary)"
        opacity=".08"
        rx="2"
      />
      <rect
        x="30"
        y="35"
        width="340"
        height="145"
        fill="none"
        stroke="var(--color-wall)"
        strokeWidth="3"
        className="anim-draw"
      />
      <text
        x="200"
        y="28"
        textAnchor="middle"
        fill="var(--color-muted-foreground)"
        fontSize="8"
        fontFamily="var(--font-sans)"
      >
        fence / full pad = futsal field
      </text>

      {/* Tennis play (smaller, centered) — net up mode */}
      <rect
        x="90"
        y="55"
        width="220"
        height="100"
        fill="var(--color-primary)"
        opacity=".12"
      />
      <MiniCourtLines x={90} y={55} w={220} h={100} opacity={0.55} />

      <g {...matProps("net")}>
        {/* Center net posts on tennis court */}
        <rect
          x="196"
          y="50"
          width="8"
          height="110"
          fill="var(--color-pipe)"
          className="anim-post-1"
        />
        <g className="anim-fade-in anim-delay-1">
          {[60, 75, 90, 105, 120, 135, 150].map((y) => (
            <line
              key={y}
              x1="120"
              y1={y}
              x2="280"
              y2={y}
              stroke="var(--color-accent)"
              strokeWidth="1"
              opacity=".65"
            />
          ))}
          {[130, 150, 170, 190, 210, 230, 250, 270].map((x) => (
            <line
              key={x}
              x1={x}
              y1="60"
              x2={x}
              y2="150"
              stroke="var(--color-accent)"
              strokeWidth="1"
              opacity=".45"
            />
          ))}
        </g>
        <line
          x1="120"
          y1="58"
          x2="280"
          y2="58"
          stroke="var(--color-foreground)"
          strokeWidth="3"
          className="anim-draw"
        />
        <text
          x="200"
          y="48"
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="9"
          fontFamily="var(--font-sans)"
          fontWeight="600"
          className="anim-fade-in"
        >
          tennis net (drop / remove for futsal)
        </text>
      </g>

      {includeFutsalGoals ? (
        <g {...matProps("futsal-goals")}>
          {/* Goals at FENCE ends — center of each short side, not tennis baselines */}
          <rect
            x="24"
            y="85"
            width="12"
            height="48"
            rx="1"
            fill="var(--color-success)"
            className="anim-pop anim-delay-2"
          />
          <rect
            x="364"
            y="85"
            width="12"
            height="48"
            rx="1"
            fill="var(--color-success)"
            className="anim-pop anim-delay-2"
          />
          {/* Dashed field using full pad */}
          <rect
            x="36"
            y="42"
            width="328"
            height="130"
            fill="none"
            stroke="var(--color-success)"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            className="anim-fade-in anim-delay-2"
            opacity=".8"
          />
          <text
            x="200"
            y="188"
            textAnchor="middle"
            fill="var(--color-success)"
            fontSize="9"
            fontFamily="var(--font-sans)"
            fontWeight="600"
            className="anim-fade-in anim-delay-2"
          >
            goals @ fence-end centers · field = full pad
          </text>
        </g>
      ) : null}

      <text
        x="200"
        y="212"
        textAnchor="middle"
        fill="var(--color-muted-foreground)"
        fontSize="11"
        fontFamily="var(--font-sans)"
      >
        Not on tennis baselines — use the enclosure ends
      </text>
    </g>
  );
}

function AnimFence({ active, matProps }: SceneProps) {
  return (
    <g className={active ? "anim-fence" : undefined}>
      {/* Court inside */}
      <rect
        x="70"
        y="50"
        width="260"
        height="110"
        fill="var(--color-primary)"
        opacity=".12"
      />
      <MiniCourtLines x={90} y={65} w={220} h={80} opacity={0.5} />

      <g {...matProps("fence")}>
        {/* Posts rising */}
        {[60, 100, 140, 180, 220, 260, 300, 340].map((x, i) => (
          <rect
            key={x}
            x={x - 3}
            y={40}
            width="6"
            height="140"
            fill="var(--color-wall)"
            className={i % 2 === 0 ? "anim-post-1" : "anim-post-2"}
            style={{ animationDelay: `${i * 0.06}s` }}
          />
        ))}
        {/* Top rail */}
        <line
          x1="60"
          y1="42"
          x2="340"
          y2="42"
          stroke="var(--color-wall)"
          strokeWidth="4"
          className="anim-rail-1"
        />
        {/* Fabric diamond hint */}
        <path
          d="M70 50 l20 15 l-20 15 l20 15 l-20 15 l20 15 l-20 15 M100 50 l20 15 l-20 15 l20 15 l-20 15 l20 15 l-20 15"
          fill="none"
          stroke="var(--color-muted-foreground)"
          strokeWidth="1.2"
          className="anim-draw anim-delay-1"
          opacity=".7"
        />
        <path
          d="M300 50 l20 15 l-20 15 l20 15 l-20 15 l20 15 l-20 15 M330 50 l10 15 l-10 15 l10 15 l-10 15 l10 15 l-10 15"
          fill="none"
          stroke="var(--color-muted-foreground)"
          strokeWidth="1.2"
          className="anim-draw anim-delay-1"
          opacity=".7"
        />
      </g>

      <g {...matProps("windscreen")}>
        <rect
          x="65"
          y="55"
          width="18"
          height="100"
          fill="var(--color-pipe)"
          opacity=".75"
          className="anim-fade-in anim-delay-2"
        />
        <rect
          x="317"
          y="55"
          width="18"
          height="100"
          fill="var(--color-pipe)"
          opacity=".75"
          className="anim-fade-in anim-delay-2"
        />
        <text
          x="200"
          y="175"
          textAnchor="middle"
          fill="var(--color-pipe)"
          fontSize="9"
          fontFamily="var(--font-sans)"
          className="anim-fade-in anim-delay-2"
        >
          windscreen · leave bottom gap
        </text>
      </g>

      <g {...matProps("gate-s")}>
        <rect
          x="175"
          y="155"
          width="50"
          height="20"
          rx="2"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2"
          className="anim-pop anim-delay-2"
        />
        <text
          x="200"
          y="169"
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="8"
          fontFamily="var(--font-sans)"
          className="anim-fade-in anim-delay-2"
        >
          gate
        </text>
      </g>

      <text
        x="200"
        y="210"
        textAnchor="middle"
        fill="var(--color-muted-foreground)"
        fontSize="11"
        fontFamily="var(--font-sans)"
      >
        Posts → fabric → top rail → gates → windscreen
      </text>
    </g>
  );
}
