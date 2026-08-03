import type { PadResult } from "@/lib/pad-calc";
import { formatNumber } from "@/lib/utils";

interface SectionViewProps {
  depthFt: number;
  gradeDropFt: number;
  result: PadResult;
}

/** Side elevation: cut bank → level pad → fill wall → pool. */
export function SectionView({ depthFt, gradeDropFt, result }: SectionViewProps) {
  const W = 640;
  const H = 220;
  const padLeft = 80;
  const padRight = 560;
  const padTop = 70;
  const padBottom = 130;
  const wallH = 40;
  const grade = Math.min(70, (gradeDropFt / 10) * 70);

  // Natural grade line from high left to low right
  const gradeStartY = padTop - grade / 2;
  const gradeEndY = padBottom + grade / 2;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mx-auto h-auto w-full max-w-2xl"
        role="img"
        aria-label="Cross-section of cut-and-fill terrace"
      >
        {/* Natural grade (dashed) */}
        <line
          x1={20}
          y1={gradeStartY}
          x2={W - 20}
          y2={gradeEndY}
          stroke="var(--color-muted-foreground)"
          strokeWidth={1.5}
          strokeDasharray="5 4"
          opacity={0.6}
        />
        <text
          x={30}
          y={gradeStartY - 8}
          fill="var(--color-muted-foreground)"
          fontSize={10}
          fontFamily="var(--font-sans)"
        >
          natural grade (~{formatNumber(gradeDropFt, 1)} ft drop)
        </text>

        {/* Cut wedge (back) */}
        <polygon
          points={`${padLeft},${padTop} ${padLeft},${gradeStartY} ${(padLeft + padRight) / 2},${padTop}`}
          fill="var(--color-hill)"
          opacity={0.45}
        />
        <text
          x={padLeft + 40}
          y={padTop - 18}
          fill="var(--color-muted-foreground)"
          fontSize={10}
          fontFamily="var(--font-sans)"
        >
          CUT {formatNumber(result.cutCuYd, 1)} cu yd
        </text>

        {/* Fill wedge (front) */}
        <polygon
          points={`${padRight},${padBottom} ${padRight},${gradeEndY} ${(padLeft + padRight) / 2},${padBottom}`}
          fill="var(--color-accent)"
          opacity={0.2}
        />
        <text
          x={padRight - 100}
          y={padBottom + 28}
          fill="var(--color-accent)"
          fontSize={10}
          fontFamily="var(--font-sans)"
        >
          FILL {formatNumber(result.fillCuYd, 1)} cu yd (from cut)
        </text>

        {/* Finished pad surface */}
        <line
          x1={padLeft}
          y1={padTop}
          x2={padRight}
          y2={padBottom}
          stroke="var(--color-turf-deep)"
          strokeWidth={4}
          strokeLinecap="round"
        />
        <text
          x={(padLeft + padRight) / 2}
          y={(padTop + padBottom) / 2 - 12}
          textAnchor="middle"
          fill="var(--color-turf-deep)"
          fontSize={11}
          fontWeight={600}
          fontFamily="var(--font-sans)"
        >
          finished turf · {formatNumber(depthFt, 0)} ft deep · {result.pitchPct}% pitch
        </text>

        {/* Back wall */}
        <rect
          x={padLeft - 12}
          y={padTop}
          width={12}
          height={wallH}
          fill="var(--color-wall)"
          rx={1}
        />
        {/* Front wall */}
        <rect
          x={padRight}
          y={padBottom - wallH}
          width={14}
          height={wallH + 8}
          fill="var(--color-wall)"
          rx={1}
        />
        <text
          x={padRight + 22}
          y={padBottom - wallH / 2}
          fill="var(--color-wall)"
          fontSize={10}
          fontFamily="var(--font-sans)"
        >
          front wall
        </text>
        <text
          x={padRight + 22}
          y={padBottom - wallH / 2 + 12}
          fill="var(--color-wall)"
          fontSize={10}
          fontFamily="var(--font-sans)"
        >
          {formatNumber(result.wallHeightFt, 1)} ft
        </text>

        {/* Pool */}
        <rect
          x={padRight + 40}
          y={padBottom + 4}
          width={80}
          height={28}
          fill="var(--color-pool)"
          rx={4}
          opacity={0.8}
        />
        <text
          x={padRight + 80}
          y={padBottom + 22}
          textAnchor="middle"
          fill="#1a3a48"
          fontSize={10}
          fontFamily="var(--font-sans)"
        >
          pool
        </text>

        {/* Net import badge */}
        <rect
          x={W / 2 - 70}
          y={H - 36}
          width={140}
          height={24}
          rx={6}
          fill="var(--color-success)"
          opacity={0.15}
        />
        <text
          x={W / 2}
          y={H - 20}
          textAnchor="middle"
          fill="var(--color-success)"
          fontSize={11}
          fontWeight={600}
          fontFamily="var(--font-sans)"
        >
          Net dirt import: 0 cu yd
        </text>
      </svg>
    </div>
  );
}
