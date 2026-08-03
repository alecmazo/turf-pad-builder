import { PHASE_MATERIALS } from "@/lib/material-images";
import { MaterialThumb } from "@/components/material-thumb";

interface BuildStepAnimationProps {
  phaseId: number;
  active?: boolean;
}

/**
 * CSS/SVG instructional animations for each build phase.
 * Code-drawn for accurate structure (cut/fill, walls, drainage, turf).
 */
export function BuildStepAnimation({
  phaseId,
  active = true,
}: BuildStepAnimationProps) {
  const mats = PHASE_MATERIALS[phaseId] ?? [];
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-muted/40">
      <div className="relative aspect-[16/9] w-full">
        <svg
          viewBox="0 0 400 225"
          className="h-full w-full"
          role="img"
          aria-label={`Animation for build step ${phaseId}`}
        >
          {/* shared ground */}
          <rect width="400" height="225" fill="var(--color-background)" />
          {phaseId === 1 && <AnimPrep active={active} />}
          {phaseId === 2 && <AnimCutFill active={active} />}
          {phaseId === 3 && <AnimFrontWall active={active} />}
          {phaseId === 4 && <AnimBackWall active={active} />}
          {phaseId === 5 && <AnimDrainage active={active} />}
          {phaseId === 6 && <AnimTurfBase active={active} />}
          {phaseId === 7 && <AnimTrex active={active} />}
          {phaseId === 8 && <AnimTurf active={active} />}
        </svg>
      </div>
      {mats.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 border-t border-border px-3 py-2">
          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Materials
          </span>
          {mats.map((id) => (
            <MaterialThumb key={id} itemId={id} size="sm" />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function AnimPrep({ active }: { active: boolean }) {
  return (
    <g className={active ? "anim-prep" : undefined}>
      {/* stake lines */}
      <line x1="60" y1="160" x2="340" y2="160" stroke="var(--color-border)" strokeWidth="2" strokeDasharray="6 4" />
      <line x1="60" y1="50" x2="60" y2="160" stroke="var(--color-accent)" strokeWidth="2" className="anim-draw" />
      <line x1="340" y1="50" x2="340" y2="160" stroke="var(--color-accent)" strokeWidth="2" className="anim-draw anim-delay-1" />
      <line x1="60" y1="50" x2="340" y2="50" stroke="var(--color-primary)" strokeWidth="2" strokeDasharray="4 3" className="anim-draw anim-delay-2" />
      {/* stakes */}
      <rect x="56" y="40" width="8" height="20" fill="var(--color-accent)" className="anim-pop" />
      <rect x="336" y="40" width="8" height="20" fill="var(--color-accent)" className="anim-pop anim-delay-1" />
      <text x="200" y="200" textAnchor="middle" fill="var(--color-muted-foreground)" fontSize="12" fontFamily="var(--font-sans)">
        Stake corners · call 811 · order materials
      </text>
      {/* checklist ticks */}
      <g className="anim-fade-in anim-delay-3">
        <circle cx="100" cy="100" r="12" fill="var(--color-success)" opacity=".2" />
        <path d="M94 100l4 4 8-10" stroke="var(--color-success)" strokeWidth="2.5" fill="none" />
        <circle cx="200" cy="100" r="12" fill="var(--color-success)" opacity=".2" />
        <path d="M194 100l4 4 8-10" stroke="var(--color-success)" strokeWidth="2.5" fill="none" />
        <circle cx="300" cy="100" r="12" fill="var(--color-success)" opacity=".2" />
        <path d="M294 100l4 4 8-10" stroke="var(--color-success)" strokeWidth="2.5" fill="none" />
      </g>
    </g>
  );
}

function AnimCutFill({ active }: { active: boolean }) {
  return (
    <g className={active ? "anim-cutfill" : undefined}>
      {/* natural grade dashed */}
      <line x1="30" y1="40" x2="370" y2="160" stroke="var(--color-muted-foreground)" strokeWidth="1.5" strokeDasharray="5 4" opacity=".5" />
      {/* cut wedge disappearing */}
      <polygon points="50,50 50,100 180,100" fill="var(--color-hill)" opacity=".5" className="anim-cut" />
      {/* fill wedge appearing */}
      <polygon points="220,100 350,100 350,150" fill="var(--color-accent)" opacity=".35" className="anim-fill" />
      {/* finished pad */}
      <line x1="50" y1="100" x2="350" y2="100" stroke="var(--color-turf-deep)" strokeWidth="5" strokeLinecap="round" className="anim-draw anim-delay-2" />
      {/* soil arrow */}
      <path d="M120 70 Q200 40 280 120" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeDasharray="4 3" className="anim-draw anim-delay-1" markerEnd="url(#arrow)" />
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="var(--color-primary)" />
        </marker>
      </defs>
      <text x="200" y="200" textAnchor="middle" fill="var(--color-muted-foreground)" fontSize="12" fontFamily="var(--font-sans)">
        Cut uphill → compact fill downhill in lifts
      </text>
    </g>
  );
}

function AnimFrontWall({ active }: { active: boolean }) {
  return (
    <g className={active ? "anim-wall" : undefined}>
      {/* fill zone */}
      <rect x="80" y="60" width="200" height="100" fill="var(--color-hill)" opacity=".25" />
      {/* leveling pad */}
      <rect x="280" y="150" width="50" height="12" fill="var(--color-muted-foreground)" className="anim-rise" />
      {/* blocks stacking */}
      <rect x="285" y="130" width="40" height="18" fill="var(--color-wall)" className="anim-block-1" />
      <rect x="285" y="112" width="40" height="18" fill="var(--color-wall)" className="anim-block-2" />
      <rect x="285" y="94" width="40" height="18" fill="var(--color-wall)" className="anim-block-3" />
      <rect x="283" y="82" width="44" height="12" fill="#A8A298" className="anim-block-4" />
      {/* geogrid layers */}
      <line x1="100" y1="120" x2="285" y2="120" stroke="var(--color-pipe)" strokeWidth="2" strokeDasharray="6 3" className="anim-grid-1" />
      <line x1="100" y1="100" x2="285" y2="100" stroke="var(--color-pipe)" strokeWidth="2" strokeDasharray="6 3" className="anim-grid-2" />
      {/* drain chimney */}
      <rect x="270" y="90" width="12" height="60" fill="var(--color-drain)" opacity=".4" className="anim-fade-in anim-delay-3" />
      <line x1="80" y1="155" x2="280" y2="155" stroke="var(--color-drain)" strokeWidth="3" strokeDasharray="5 3" className="anim-draw anim-delay-3" />
      <text x="200" y="200" textAnchor="middle" fill="var(--color-muted-foreground)" fontSize="12" fontFamily="var(--font-sans)">
        Front wall + geogrid + drain chimney
      </text>
    </g>
  );
}

function AnimBackWall({ active }: { active: boolean }) {
  return (
    <g className={active ? "anim-wall" : undefined}>
      {/* cut face */}
      <rect x="40" y="50" width="30" height="110" fill="var(--color-hill)" opacity=".6" />
      {/* wall */}
      <rect x="70" y="150" width="50" height="12" fill="var(--color-muted-foreground)" className="anim-rise" />
      <rect x="75" y="130" width="40" height="18" fill="var(--color-wall)" className="anim-block-1" />
      <rect x="75" y="112" width="40" height="18" fill="var(--color-wall)" className="anim-block-2" />
      <rect x="75" y="94" width="40" height="18" fill="var(--color-wall)" className="anim-block-3" />
      <rect x="73" y="82" width="44" height="12" fill="#A8A298" className="anim-block-4" />
      {/* interceptor */}
      <line x1="120" y1="155" x2="340" y2="155" stroke="var(--color-drain)" strokeWidth="3" strokeDasharray="5 3" className="anim-draw anim-delay-2" />
      <rect x="115" y="90" width="12" height="60" fill="var(--color-drain)" opacity=".4" className="anim-fade-in anim-delay-2" />
      {/* hillside arrows */}
      <g className="anim-drip" fill="var(--color-drain)" opacity=".7">
        <circle cx="55" cy="70" r="3" />
        <circle cx="55" cy="90" r="3" />
        <circle cx="55" cy="110" r="3" />
      </g>
      <text x="200" y="200" textAnchor="middle" fill="var(--color-muted-foreground)" fontSize="12" fontFamily="var(--font-sans)">
        Back wall intercepts hillside water
      </text>
    </g>
  );
}

function AnimDrainage({ active }: { active: boolean }) {
  return (
    <g className={active ? "anim-drain" : undefined}>
      {/* pad outline */}
      <rect x="80" y="50" width="240" height="100" fill="var(--color-turf)" opacity=".25" rx="4" />
      {/* interceptor */}
      <line x1="90" y1="60" x2="310" y2="60" stroke="var(--color-drain)" strokeWidth="4" strokeDasharray="6 4" className="anim-draw" />
      {/* collector */}
      <line x1="90" y1="140" x2="310" y2="140" stroke="var(--color-drain)" strokeWidth="4" strokeDasharray="6 4" className="anim-draw anim-delay-1" />
      {/* solid outlet */}
      <path d="M90 60 L55 60 L55 170" fill="none" stroke="var(--color-pipe)" strokeWidth="8" strokeLinecap="round" className="anim-draw anim-delay-2" />
      {/* flow dots */}
      <circle r="4" fill="var(--color-drain)" className="anim-flow-1">
        <animateMotion dur="2.5s" repeatCount="indefinite" path="M300 60 L100 60 L55 60 L55 160" />
      </circle>
      <circle r="4" fill="var(--color-drain)" className="anim-flow-2">
        <animateMotion dur="2.5s" begin="0.8s" repeatCount="indefinite" path="M300 140 L100 140 L55 140 L55 160" />
      </circle>
      <polygon points="55,180 48,165 62,165" fill="var(--color-pipe)" className="anim-fade-in anim-delay-3" />
      <text x="200" y="205" textAnchor="middle" fill="var(--color-muted-foreground)" fontSize="12" fontFamily="var(--font-sans)">
        Both perfs pitch ~1% → solid outlet daylights
      </text>
    </g>
  );
}

function AnimTurfBase({ active }: { active: boolean }) {
  return (
    <g className={active ? "anim-base" : undefined}>
      {/* layers building up */}
      <rect x="60" y="140" width="280" height="20" fill="var(--color-hill)" className="anim-layer-1" />
      <rect x="60" y="120" width="280" height="20" fill="#9A9488" className="anim-layer-2" />
      <rect x="60" y="100" width="280" height="20" fill="#B0AAA0" className="anim-layer-3" />
      <rect x="60" y="85" width="280" height="15" fill="#D4B896" className="anim-layer-4" />
      {/* pitch line */}
      <line x1="60" y1="85" x2="340" y2="95" stroke="var(--color-drain)" strokeWidth="2" className="anim-draw anim-delay-3" />
      {/* labels */}
      <text x="70" y="154" fill="#fff" fontSize="9" fontFamily="var(--font-sans)">subgrade</text>
      <text x="70" y="134" fill="#fff" fontSize="9" fontFamily="var(--font-sans)">geotextile</text>
      <text x="70" y="114" fill="#1c1b19" fontSize="9" fontFamily="var(--font-sans)">Class II 4″</text>
      <text x="70" y="96" fill="#1c1b19" fontSize="9" fontFamily="var(--font-sans)">DG 1″</text>
      {/* compactor icon bounce */}
      <g className="anim-compactor" transform="translate(280,55)">
        <rect x="0" y="10" width="30" height="8" fill="var(--color-accent)" rx="1" />
        <rect x="8" y="0" width="14" height="12" fill="var(--color-foreground)" rx="1" />
      </g>
      <text x="200" y="200" textAnchor="middle" fill="var(--color-muted-foreground)" fontSize="12" fontFamily="var(--font-sans)">
        Compact each layer · 1–1.5% fall to front
      </text>
    </g>
  );
}

function AnimTrex({ active }: { active: boolean }) {
  return (
    <g className={active ? "anim-trex" : undefined}>
      {/* pad */}
      <rect x="80" y="50" width="240" height="110" fill="var(--color-turf)" opacity=".3" rx="2" />
      {/* posts rising */}
      <rect x="80" y="50" width="8" height="110" fill="#6B8F5A" className="anim-post-1" />
      <rect x="196" y="50" width="8" height="110" fill="#6B8F5A" className="anim-post-2" />
      <rect x="312" y="50" width="8" height="110" fill="#6B8F5A" className="anim-post-3" />
      {/* rails */}
      <rect x="80" y="55" width="240" height="6" fill="#5A7A4A" className="anim-rail-1" />
      <rect x="80" y="148" width="240" height="6" fill="#5A7A4A" className="anim-rail-2" />
      {/* Trex boards */}
      <rect x="88" y="65" width="6" height="80" fill="#8B5A3C" className="anim-trex-1" />
      <rect x="98" y="65" width="6" height="80" fill="#A06B48" className="anim-trex-2" />
      <rect x="108" y="65" width="6" height="80" fill="#8B5A3C" className="anim-trex-3" />
      <rect x="300" y="65" width="6" height="80" fill="#8B5A3C" className="anim-trex-1" />
      <rect x="290" y="65" width="6" height="80" fill="#A06B48" className="anim-trex-2" />
      <rect x="280" y="65" width="6" height="80" fill="#8B5A3C" className="anim-trex-3" />
      <text x="200" y="200" textAnchor="middle" fill="var(--color-muted-foreground)" fontSize="12" fontFamily="var(--font-sans)">
        PT frame first · nail Trex boards to rails
      </text>
    </g>
  );
}

function AnimTurf({ active }: { active: boolean }) {
  return (
    <g className={active ? "anim-turf" : undefined}>
      {/* base */}
      <rect x="50" y="80" width="300" height="70" fill="#B0AAA0" rx="2" />
      {/* turf unrolling */}
      <rect x="50" y="80" width="300" height="70" fill="var(--color-turf-deep)" className="anim-turf-roll" rx="2" />
      {/* roll cylinder */}
      <g className="anim-roll-cyl">
        <ellipse cx="50" cy="115" rx="14" ry="35" fill="var(--color-primary)" />
        <ellipse cx="50" cy="115" rx="6" ry="14" fill="var(--color-turf)" />
      </g>
      {/* spikes */}
      <g className="anim-spikes" fill="var(--color-muted-foreground)">
        <rect x="60" y="145" width="3" height="12" /><rect x="100" y="145" width="3" height="12" />
        <rect x="140" y="145" width="3" height="12" /><rect x="180" y="145" width="3" height="12" />
        <rect x="220" y="145" width="3" height="12" /><rect x="260" y="145" width="3" height="12" />
        <rect x="300" y="145" width="3" height="12" /><rect x="330" y="145" width="3" height="12" />
      </g>
      {/* infill sprinkle */}
      <g className="anim-infill" fill="#E8D9C0">
        <circle cx="120" cy="100" r="2" /><circle cx="160" cy="110" r="1.5" />
        <circle cx="200" cy="95" r="2" /><circle cx="240" cy="115" r="1.5" />
        <circle cx="280" cy="105" r="2" /><circle cx="180" cy="120" r="1.5" />
      </g>
      <text x="200" y="200" textAnchor="middle" fill="var(--color-muted-foreground)" fontSize="12" fontFamily="var(--font-sans)">
        Roll turf · spike perimeter · brush infill
      </text>
    </g>
  );
}
