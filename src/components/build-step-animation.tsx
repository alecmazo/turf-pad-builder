import { useEffect, useState } from "react";
import {
  MATERIAL_LABELS,
  PHASE_MATERIALS,
} from "@/lib/material-images";
import { MaterialThumb } from "@/components/material-thumb";
import { cn } from "@/lib/utils";

interface BuildStepAnimationProps {
  phaseId: number;
  active?: boolean;
}

type MatProps = (id: string) => {
  "data-mat": string;
  className: string;
};

/**
 * CSS/SVG instructional animations for each build phase.
 * Click a material chip to freeze on the finished frame and highlight
 * where that material lives in the diagram.
 */
export function BuildStepAnimation({
  phaseId,
  active = true,
}: BuildStepAnimationProps) {
  const mats = PHASE_MATERIALS[phaseId] ?? [];
  const [selected, setSelected] = useState<string | null>(null);

  // Reset highlight when switching phases or collapsing
  useEffect(() => {
    setSelected(null);
  }, [phaseId, active]);

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
              ? `Build step ${phaseId}: highlighting ${label}`
              : `Animation for build step ${phaseId}`
          }
        >
          <rect width="400" height="225" fill="var(--color-background)" />
          {phaseId === 1 && (
            <AnimPrep active={active} matProps={matProps} />
          )}
          {phaseId === 2 && (
            <AnimCutFill active={active} matProps={matProps} />
          )}
          {phaseId === 3 && (
            <AnimFrontWall active={active} matProps={matProps} />
          )}
          {phaseId === 4 && (
            <AnimBackWall active={active} matProps={matProps} />
          )}
          {phaseId === 5 && (
            <AnimDrainage active={active} matProps={matProps} />
          )}
          {phaseId === 6 && (
            <AnimTurfBase active={active} matProps={matProps} />
          )}
          {phaseId === 7 && (
            <AnimTrex active={active} matProps={matProps} />
          )}
          {phaseId === 8 && (
            <AnimTurf active={active} matProps={matProps} />
          )}

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
                onClick={() => setSelected(null)}
                className="text-[10px] font-medium text-primary hover:underline"
              >
                Clear highlight
              </button>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {mats.map((id) => {
              const on = selected === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggle(id)}
                  aria-pressed={on}
                  title={`Show where ${MATERIAL_LABELS[id] ?? id} is used`}
                  className={cn(
                    "flex max-w-full items-center gap-1.5 rounded-lg border px-1.5 py-1 text-left transition-colors",
                    on
                      ? "border-accent bg-accent/10 ring-2 ring-accent/35"
                      : "border-border bg-card hover:border-primary/40 hover:bg-muted/50",
                  )}
                >
                  <MaterialThumb
                    itemId={id}
                    size="sm"
                    className={cn(
                      "pointer-events-none",
                      on ? "border-accent" : undefined,
                    )}
                  />
                  <span className="min-w-0 max-w-[6.5rem] text-[10px] font-medium leading-tight text-foreground">
                    {MATERIAL_LABELS[id] ?? id}
                  </span>
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
  active: boolean;
  matProps: MatProps;
}

function AnimPrep({ active, matProps }: SceneProps) {
  return (
    <g className={active ? "anim-prep" : undefined}>
      <line
        x1="60"
        y1="160"
        x2="340"
        y2="160"
        stroke="var(--color-border)"
        strokeWidth="2"
        strokeDasharray="6 4"
      />
      <line
        x1="60"
        y1="50"
        x2="60"
        y2="160"
        stroke="var(--color-accent)"
        strokeWidth="2"
        className="anim-draw"
      />
      <line
        x1="340"
        y1="50"
        x2="340"
        y2="160"
        stroke="var(--color-accent)"
        strokeWidth="2"
        className="anim-draw anim-delay-1"
      />
      <line
        x1="60"
        y1="50"
        x2="340"
        y2="50"
        stroke="var(--color-primary)"
        strokeWidth="2"
        strokeDasharray="4 3"
        className="anim-draw anim-delay-2"
      />
      <rect
        x="56"
        y="40"
        width="8"
        height="20"
        fill="var(--color-accent)"
        className="anim-pop"
      />
      <rect
        x="336"
        y="40"
        width="8"
        height="20"
        fill="var(--color-accent)"
        className="anim-pop anim-delay-1"
      />

      {/* Material staging piles — order list for step 1 */}
      <g {...matProps("class2")} className={cn(matProps("class2").className, "anim-fade-in")}>
        <ellipse cx="100" cy="130" rx="28" ry="12" fill="#8A8478" opacity=".55" />
        <circle cx="90" cy="122" r="7" fill="#6B6560" />
        <circle cx="105" cy="118" r="8" fill="#7A756C" />
        <circle cx="112" cy="126" r="6" fill="#6B6560" />
        <text x="100" y="150" textAnchor="middle" fill="var(--color-muted-foreground)" fontSize="9" fontFamily="var(--font-sans)">
          Class II
        </text>
      </g>
      <g {...matProps("srw")} className={cn(matProps("srw").className, "anim-fade-in anim-delay-1")}>
        <rect x="155" y="108" width="36" height="14" rx="2" fill="var(--color-wall)" />
        <rect x="155" y="122" width="36" height="14" rx="2" fill="#6A6560" />
        <text x="173" y="150" textAnchor="middle" fill="var(--color-muted-foreground)" fontSize="9" fontFamily="var(--font-sans)">
          SRW
        </text>
      </g>
      <g {...matProps("perf")} className={cn(matProps("perf").className, "anim-fade-in anim-delay-2")}>
        <path
          d="M220 118 Q235 108 250 118 T280 118"
          stroke="var(--color-pipe)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="232" cy="114" r="2" fill="var(--color-success)" />
        <circle cx="248" cy="118" r="2" fill="var(--color-success)" />
        <circle cx="264" cy="114" r="2" fill="var(--color-success)" />
        <text x="250" y="150" textAnchor="middle" fill="var(--color-muted-foreground)" fontSize="9" fontFamily="var(--font-sans)">
          Perf pipe
        </text>
      </g>
      <g {...matProps("turf")} className={cn(matProps("turf").className, "anim-fade-in anim-delay-3")}>
        <rect x="300" y="105" width="40" height="28" rx="3" fill="var(--color-turf-deep)" />
        <ellipse cx="300" cy="119" rx="8" ry="14" fill="var(--color-primary)" />
        <text x="320" y="150" textAnchor="middle" fill="var(--color-muted-foreground)" fontSize="9" fontFamily="var(--font-sans)">
          Turf roll
        </text>
      </g>

      <text
        x="200"
        y="200"
        textAnchor="middle"
        fill="var(--color-muted-foreground)"
        fontSize="12"
        fontFamily="var(--font-sans)"
      >
        Stake corners · call 811 · stage materials
      </text>
    </g>
  );
}

function AnimCutFill({ active, matProps }: SceneProps) {
  return (
    <g className={active ? "anim-cutfill" : undefined}>
      <line
        x1="30"
        y1="40"
        x2="370"
        y2="160"
        stroke="var(--color-muted-foreground)"
        strokeWidth="1.5"
        strokeDasharray="5 4"
        opacity=".5"
      />
      <g {...matProps("cut-fill")}>
        <polygon
          points="50,50 50,100 180,100"
          fill="var(--color-hill)"
          opacity=".5"
          className="anim-cut"
        />
        <polygon
          points="220,100 350,100 350,150"
          fill="var(--color-accent)"
          opacity=".35"
          className="anim-fill"
        />
        <path
          d="M120 70 Q200 40 280 120"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2"
          strokeDasharray="4 3"
          className="anim-draw anim-delay-1"
          markerEnd="url(#arrow-cf)"
        />
      </g>
      <g {...matProps("class2")}>
        <line
          x1="50"
          y1="100"
          x2="350"
          y2="100"
          stroke="var(--color-turf-deep)"
          strokeWidth="8"
          strokeLinecap="round"
          className="anim-draw anim-delay-2"
        />
        <text
          x="200"
          y="92"
          textAnchor="middle"
          fill="var(--color-primary)"
          fontSize="10"
          fontFamily="var(--font-sans)"
          className="anim-fade-in anim-delay-3"
        >
          Class II working surface
        </text>
      </g>
      <g
        {...matProps("compactor")}
        className={cn(matProps("compactor").className, "anim-compactor")}
        transform="translate(270,72)"
      >
        <rect x="0" y="18" width="34" height="10" rx="1" fill="var(--color-accent)" />
        <rect x="8" y="4" width="16" height="14" rx="1" fill="var(--color-foreground)" />
        <path
          d="M34 12c10 0 18 14 18 24"
          stroke="var(--color-accent)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </g>
      <defs>
        <marker
          id="arrow-cf"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 Z" fill="var(--color-primary)" />
        </marker>
      </defs>
      <text
        x="200"
        y="200"
        textAnchor="middle"
        fill="var(--color-muted-foreground)"
        fontSize="12"
        fontFamily="var(--font-sans)"
      >
        Cut uphill → compact fill downhill in lifts
      </text>
    </g>
  );
}

function AnimFrontWall({ active, matProps }: SceneProps) {
  return (
    <g className={active ? "anim-wall" : undefined}>
      <rect
        x="80"
        y="60"
        width="200"
        height="100"
        fill="var(--color-hill)"
        opacity=".25"
      />
      <g {...matProps("srw")}>
        <rect
          x="280"
          y="150"
          width="50"
          height="12"
          fill="var(--color-muted-foreground)"
          className="anim-rise"
        />
        <rect
          x="285"
          y="130"
          width="40"
          height="18"
          fill="var(--color-wall)"
          className="anim-block-1"
        />
        <rect
          x="285"
          y="112"
          width="40"
          height="18"
          fill="var(--color-wall)"
          className="anim-block-2"
        />
        <rect
          x="285"
          y="94"
          width="40"
          height="18"
          fill="var(--color-wall)"
          className="anim-block-3"
        />
      </g>
      <g {...matProps("caps")}>
        <rect
          x="283"
          y="82"
          width="44"
          height="12"
          fill="#A8A298"
          className="anim-block-4"
        />
      </g>
      <g {...matProps("geogrid")}>
        <line
          x1="100"
          y1="120"
          x2="285"
          y2="120"
          stroke="var(--color-pipe)"
          strokeWidth="2"
          strokeDasharray="6 3"
          className="anim-grid-1"
        />
        <line
          x1="100"
          y1="100"
          x2="285"
          y2="100"
          stroke="var(--color-pipe)"
          strokeWidth="2"
          strokeDasharray="6 3"
          className="anim-grid-2"
        />
        <text
          x="160"
          y="96"
          fill="var(--color-pipe)"
          fontSize="9"
          fontFamily="var(--font-sans)"
          className="anim-fade-in anim-delay-2"
        >
          geogrid
        </text>
      </g>
      <g {...matProps("drain-rock")}>
        <rect
          x="270"
          y="90"
          width="12"
          height="60"
          fill="var(--color-drain)"
          opacity=".55"
          className="anim-fade-in anim-delay-3"
        />
        <circle cx="276" cy="100" r="2" fill="#A8B4BE" className="anim-fade-in anim-delay-3" />
        <circle cx="276" cy="112" r="2" fill="#A8B4BE" className="anim-fade-in anim-delay-3" />
        <circle cx="276" cy="124" r="2" fill="#A8B4BE" className="anim-fade-in anim-delay-3" />
      </g>
      <g {...matProps("perf")}>
        <line
          x1="80"
          y1="155"
          x2="280"
          y2="155"
          stroke="var(--color-drain)"
          strokeWidth="4"
          strokeDasharray="5 3"
          className="anim-draw anim-delay-3"
        />
      </g>
      <text
        x="200"
        y="200"
        textAnchor="middle"
        fill="var(--color-muted-foreground)"
        fontSize="12"
        fontFamily="var(--font-sans)"
      >
        Front wall + geogrid + drain chimney
      </text>
    </g>
  );
}

function AnimBackWall({ active, matProps }: SceneProps) {
  return (
    <g className={active ? "anim-wall" : undefined}>
      <rect x="40" y="50" width="30" height="110" fill="var(--color-hill)" opacity=".6" />
      <g {...matProps("srw")}>
        <rect
          x="70"
          y="150"
          width="50"
          height="12"
          fill="var(--color-muted-foreground)"
          className="anim-rise"
        />
        <rect
          x="75"
          y="130"
          width="40"
          height="18"
          fill="var(--color-wall)"
          className="anim-block-1"
        />
        <rect
          x="75"
          y="112"
          width="40"
          height="18"
          fill="var(--color-wall)"
          className="anim-block-2"
        />
        <rect
          x="75"
          y="94"
          width="40"
          height="18"
          fill="var(--color-wall)"
          className="anim-block-3"
        />
        <rect
          x="73"
          y="82"
          width="44"
          height="12"
          fill="#A8A298"
          className="anim-block-4"
        />
      </g>
      <g {...matProps("drain-rock")}>
        <rect
          x="115"
          y="90"
          width="14"
          height="60"
          fill="var(--color-drain)"
          opacity=".55"
          className="anim-fade-in anim-delay-2"
        />
        <circle cx="122" cy="102" r="2" fill="#A8B4BE" />
        <circle cx="122" cy="116" r="2" fill="#A8B4BE" />
        <circle cx="122" cy="130" r="2" fill="#A8B4BE" />
      </g>
      <g {...matProps("filter")}>
        <path
          d="M112 88 L132 88 L132 152 L112 152"
          fill="none"
          stroke="#2A2A2E"
          strokeWidth="2.5"
          strokeDasharray="3 2"
          className="anim-draw anim-delay-1"
        />
        <text
          x="145"
          y="100"
          fill="#2A2A2E"
          fontSize="9"
          fontFamily="var(--font-sans)"
          className="anim-fade-in anim-delay-2"
        >
          filter fabric
        </text>
      </g>
      <g {...matProps("perf")}>
        <line
          x1="120"
          y1="155"
          x2="340"
          y2="155"
          stroke="var(--color-drain)"
          strokeWidth="4"
          strokeDasharray="5 3"
          className="anim-draw anim-delay-2"
        />
      </g>
      <g className="anim-drip" fill="var(--color-drain)" opacity=".7">
        <circle cx="55" cy="70" r="3" />
        <circle cx="55" cy="90" r="3" />
        <circle cx="55" cy="110" r="3" />
      </g>
      <text
        x="200"
        y="200"
        textAnchor="middle"
        fill="var(--color-muted-foreground)"
        fontSize="12"
        fontFamily="var(--font-sans)"
      >
        Back wall intercepts hillside water
      </text>
    </g>
  );
}

function AnimDrainage({ active, matProps }: SceneProps) {
  return (
    <g className={active ? "anim-drain" : undefined}>
      <rect
        x="80"
        y="50"
        width="240"
        height="100"
        fill="var(--color-turf)"
        opacity=".25"
        rx="4"
      />
      <g {...matProps("perf")}>
        <line
          x1="90"
          y1="60"
          x2="310"
          y2="60"
          stroke="var(--color-drain)"
          strokeWidth="5"
          strokeDasharray="6 4"
          className="anim-draw"
        />
        <line
          x1="90"
          y1="140"
          x2="310"
          y2="140"
          stroke="var(--color-drain)"
          strokeWidth="5"
          strokeDasharray="6 4"
          className="anim-draw anim-delay-1"
        />
        <text
          x="200"
          y="54"
          textAnchor="middle"
          fill="var(--color-drain)"
          fontSize="9"
          fontFamily="var(--font-sans)"
        >
          interceptor perf
        </text>
        <text
          x="200"
          y="155"
          textAnchor="middle"
          fill="var(--color-drain)"
          fontSize="9"
          fontFamily="var(--font-sans)"
        >
          collector perf
        </text>
      </g>
      <g {...matProps("solid")}>
        <path
          d="M90 60 L55 60 L55 170"
          fill="none"
          stroke="var(--color-pipe)"
          strokeWidth="9"
          strokeLinecap="round"
          className="anim-draw anim-delay-2"
        />
        <polygon
          points="55,180 48,165 62,165"
          fill="var(--color-pipe)"
          className="anim-fade-in anim-delay-3"
        />
        <text
          x="40"
          y="120"
          fill="var(--color-pipe)"
          fontSize="9"
          fontFamily="var(--font-sans)"
          transform="rotate(-90 40 120)"
        >
          solid outlet
        </text>
      </g>
      <g {...matProps("fittings")}>
        {/* elbows / tees at junctions */}
        <circle
          cx="90"
          cy="60"
          r="7"
          fill="var(--color-accent)"
          className="anim-pop"
        />
        <circle
          cx="90"
          cy="140"
          r="7"
          fill="var(--color-accent)"
          className="anim-pop anim-delay-1"
        />
        <circle
          cx="55"
          cy="60"
          r="7"
          fill="var(--color-accent)"
          className="anim-pop anim-delay-2"
        />
        <text
          x="108"
          y="48"
          fill="var(--color-accent)"
          fontSize="9"
          fontFamily="var(--font-sans)"
          className="anim-fade-in"
        >
          fittings
        </text>
      </g>
      <circle r="4" fill="var(--color-drain)" className="anim-flow-1">
        <animateMotion
          dur="2.5s"
          repeatCount="indefinite"
          path="M300 60 L100 60 L55 60 L55 160"
        />
      </circle>
      <circle r="4" fill="var(--color-drain)" className="anim-flow-2">
        <animateMotion
          dur="2.5s"
          begin="0.8s"
          repeatCount="indefinite"
          path="M300 140 L100 140 L55 140 L55 160"
        />
      </circle>
      <text
        x="200"
        y="205"
        textAnchor="middle"
        fill="var(--color-muted-foreground)"
        fontSize="12"
        fontFamily="var(--font-sans)"
      >
        Both perfs pitch ~1% → solid outlet daylights
      </text>
    </g>
  );
}

function AnimTurfBase({ active, matProps }: SceneProps) {
  return (
    <g className={active ? "anim-base" : undefined}>
      <rect
        x="60"
        y="140"
        width="280"
        height="20"
        fill="var(--color-hill)"
        className="anim-layer-1"
      />
      <g {...matProps("geo")}>
        <rect
          x="60"
          y="120"
          width="280"
          height="20"
          fill="#3A3A40"
          className="anim-layer-2"
        />
        <text
          x="70"
          y="134"
          fill="#fff"
          fontSize="9"
          fontFamily="var(--font-sans)"
        >
          geotextile
        </text>
      </g>
      <g {...matProps("class2")}>
        <rect
          x="60"
          y="100"
          width="280"
          height="20"
          fill="#B0AAA0"
          className="anim-layer-3"
        />
        <text
          x="70"
          y="114"
          fill="#1c1b19"
          fontSize="9"
          fontFamily="var(--font-sans)"
        >
          Class II 4″
        </text>
      </g>
      <g {...matProps("bedding")}>
        <rect
          x="60"
          y="85"
          width="280"
          height="15"
          fill="#D4B896"
          className="anim-layer-4"
        />
        <text
          x="70"
          y="96"
          fill="#1c1b19"
          fontSize="9"
          fontFamily="var(--font-sans)"
        >
          DG 1″
        </text>
      </g>
      <line
        x1="60"
        y1="85"
        x2="340"
        y2="95"
        stroke="var(--color-drain)"
        strokeWidth="2"
        className="anim-draw anim-delay-3"
      />
      <text
        x="70"
        y="154"
        fill="#fff"
        fontSize="9"
        fontFamily="var(--font-sans)"
      >
        subgrade
      </text>
      <g
        {...matProps("compactor")}
        className={cn(matProps("compactor").className, "anim-compactor")}
        transform="translate(280,55)"
      >
        <rect x="0" y="10" width="30" height="8" fill="var(--color-accent)" rx="1" />
        <rect x="8" y="0" width="14" height="12" fill="var(--color-foreground)" rx="1" />
      </g>
      <text
        x="200"
        y="200"
        textAnchor="middle"
        fill="var(--color-muted-foreground)"
        fontSize="12"
        fontFamily="var(--font-sans)"
      >
        Compact each layer · 1–1.5% fall to front
      </text>
    </g>
  );
}

function AnimTrex({ active, matProps }: SceneProps) {
  return (
    <g className={active ? "anim-trex" : undefined}>
      <rect
        x="80"
        y="50"
        width="240"
        height="110"
        fill="var(--color-turf)"
        opacity=".3"
        rx="2"
      />
      <g {...matProps("beams")}>
        <rect
          x="80"
          y="50"
          width="8"
          height="110"
          fill="#6B8F5A"
          className="anim-post-1"
        />
        <rect
          x="196"
          y="50"
          width="8"
          height="110"
          fill="#6B8F5A"
          className="anim-post-2"
        />
        <rect
          x="312"
          y="50"
          width="8"
          height="110"
          fill="#6B8F5A"
          className="anim-post-3"
        />
        <rect
          x="80"
          y="55"
          width="240"
          height="6"
          fill="#5A7A4A"
          className="anim-rail-1"
        />
        <rect
          x="80"
          y="148"
          width="240"
          height="6"
          fill="#5A7A4A"
          className="anim-rail-2"
        />
      </g>
      <g {...matProps("trex")}>
        <rect
          x="88"
          y="65"
          width="6"
          height="80"
          fill="#8B5A3C"
          className="anim-trex-1"
        />
        <rect
          x="98"
          y="65"
          width="6"
          height="80"
          fill="#A06B48"
          className="anim-trex-2"
        />
        <rect
          x="108"
          y="65"
          width="6"
          height="80"
          fill="#8B5A3C"
          className="anim-trex-3"
        />
        <rect
          x="300"
          y="65"
          width="6"
          height="80"
          fill="#8B5A3C"
          className="anim-trex-1"
        />
        <rect
          x="290"
          y="65"
          width="6"
          height="80"
          fill="#A06B48"
          className="anim-trex-2"
        />
        <rect
          x="280"
          y="65"
          width="6"
          height="80"
          fill="#8B5A3C"
          className="anim-trex-3"
        />
      </g>
      <g {...matProps("hardware")}>
        {/* fasteners at post / rail intersections */}
        {[
          [84, 58],
          [200, 58],
          [316, 58],
          [84, 151],
          [200, 151],
          [316, 151],
          [91, 70],
          [91, 140],
          [303, 70],
          [303, 140],
        ].map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="2.5"
            fill="#8A9098"
            stroke="#5A6068"
            strokeWidth="0.8"
            className={cn(
              "anim-pop",
              i > 3 ? "anim-delay-2" : "anim-delay-1",
            )}
          />
        ))}
      </g>
      <text
        x="200"
        y="200"
        textAnchor="middle"
        fill="var(--color-muted-foreground)"
        fontSize="12"
        fontFamily="var(--font-sans)"
      >
        PT frame first · nail Trex boards to rails
      </text>
    </g>
  );
}

function AnimTurf({ active, matProps }: SceneProps) {
  return (
    <g className={active ? "anim-turf" : undefined}>
      <rect x="50" y="80" width="300" height="70" fill="#B0AAA0" rx="2" />
      <g {...matProps("turf")}>
        <rect
          x="50"
          y="80"
          width="300"
          height="70"
          fill="var(--color-turf-deep)"
          className="anim-turf-roll"
          rx="2"
        />
        <g className="anim-roll-cyl">
          <ellipse cx="50" cy="115" rx="14" ry="35" fill="var(--color-primary)" />
          <ellipse cx="50" cy="115" rx="6" ry="14" fill="var(--color-turf)" />
        </g>
      </g>
      <g {...matProps("seam")}>
        <line
          x1="200"
          y1="82"
          x2="200"
          y2="148"
          stroke="#C45C26"
          strokeWidth="3"
          strokeDasharray="5 3"
          className="anim-draw anim-delay-2"
        />
        <rect
          x="190"
          y="100"
          width="20"
          height="30"
          rx="2"
          fill="#C45C26"
          opacity=".35"
          className="anim-fade-in anim-delay-2"
        />
        <text
          x="212"
          y="96"
          fill="#C45C26"
          fontSize="9"
          fontFamily="var(--font-sans)"
          className="anim-fade-in anim-delay-2"
        >
          seam
        </text>
      </g>
      <g
        {...matProps("spikes")}
        className={cn(matProps("spikes").className, "anim-spikes")}
        fill="var(--color-muted-foreground)"
      >
        <rect x="60" y="145" width="3" height="12" />
        <rect x="100" y="145" width="3" height="12" />
        <rect x="140" y="145" width="3" height="12" />
        <rect x="180" y="145" width="3" height="12" />
        <rect x="220" y="145" width="3" height="12" />
        <rect x="260" y="145" width="3" height="12" />
        <rect x="300" y="145" width="3" height="12" />
        <rect x="330" y="145" width="3" height="12" />
      </g>
      <g
        {...matProps("infill")}
        className={cn(matProps("infill").className, "anim-infill")}
        fill="#E8D9C0"
      >
        <circle cx="120" cy="100" r="2.5" />
        <circle cx="160" cy="110" r="2" />
        <circle cx="200" cy="95" r="2.5" />
        <circle cx="240" cy="115" r="2" />
        <circle cx="280" cy="105" r="2.5" />
        <circle cx="180" cy="120" r="2" />
        <circle cx="140" cy="125" r="2" />
        <circle cx="260" cy="98" r="2" />
      </g>
      <text
        x="200"
        y="200"
        textAnchor="middle"
        fill="var(--color-muted-foreground)"
        fontSize="12"
        fontFamily="var(--font-sans)"
      >
        Roll turf · spike perimeter · brush infill
      </text>
    </g>
  );
}
