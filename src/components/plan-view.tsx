import type { PadResult } from "@/lib/pad-calc";
import { formatNumber } from "@/lib/utils";

interface PlanViewProps {
  widthFt: number;
  depthFt: number;
  result: PadResult;
}

/** Interactive top-down drainage layout scaled to pad size. */
export function PlanView({ widthFt, depthFt, result }: PlanViewProps) {
  const padW = 440;
  const padH = Math.max(160, Math.min(280, (depthFt / widthFt) * 440));
  const mx = 56;
  const my = 40;
  const rightLabel = 72;
  const svgW = padW + mx + rightLabel + 16;
  const svgH = padH + my + 100;
  const wallT = 14;
  const pipeW = 7;

  const backY = my;
  const frontY = my + padH;
  const leftX = mx;
  const rightX = mx + padW;

  return (
    <div className="w-full max-w-full overflow-x-auto overscroll-x-contain">
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="mx-auto h-auto w-full max-w-3xl"
        role="img"
        aria-label={`Top-down drainage plan for ${widthFt} by ${depthFt} foot turf pad`}
      >
        <rect
          x={0}
          y={0}
          width={svgW}
          height={my - 4}
          fill="var(--color-hill)"
          opacity={0.85}
        />
        <text
          x={svgW / 2}
          y={16}
          textAnchor="middle"
          className="fill-foreground"
          fontSize={10}
          fontFamily="var(--font-sans)"
        >
          ↑ uphill / cut bank — water comes from here ↑
        </text>

        <rect
          x={leftX}
          y={backY}
          width={padW}
          height={wallT}
          fill="var(--color-wall)"
          rx={2}
        />
        <text
          x={leftX + padW / 2}
          y={backY + wallT - 3}
          textAnchor="middle"
          fill="#f5f2eb"
          fontSize={9}
          fontFamily="var(--font-sans)"
        >
          BACK wall (cut) · {formatNumber(result.wallHeightFt, 1)} ft
        </text>

        <line
          x1={leftX + 4}
          y1={backY + wallT + 6}
          x2={rightX - 4}
          y2={backY + wallT + 6}
          stroke="var(--color-drain)"
          strokeWidth={3}
          strokeDasharray="6 4"
        />
        <text
          x={rightX + 4}
          y={backY + wallT + 10}
          fill="var(--color-drain)"
          fontSize={8}
          fontFamily="var(--font-sans)"
        >
          interceptor
        </text>

        <rect
          x={leftX}
          y={backY + wallT}
          width={padW}
          height={padH - wallT * 2}
          fill="var(--color-turf)"
          opacity={0.55}
        />

        {[0.25, 0.5, 0.75].map((t) => {
          const x = leftX + padW * t;
          const y1 = backY + wallT + 24;
          const y2 = frontY - wallT - 16;
          return (
            <g key={t}>
              <line
                x1={x}
                y1={y1}
                x2={x}
                y2={y2}
                stroke="var(--color-drain)"
                strokeWidth={1.5}
                opacity={0.7}
              />
              <polygon
                points={`${x},${y2 + 7} ${x - 4},${y2} ${x + 4},${y2}`}
                fill="var(--color-drain)"
                opacity={0.7}
              />
            </g>
          );
        })}

        <text
          x={leftX + padW / 2}
          y={backY + padH / 2 - 6}
          textAnchor="middle"
          fill="var(--color-turf-deep)"
          fontSize={15}
          fontWeight={700}
          fontFamily="var(--font-display)"
        >
          FLAT TURF PAD
        </text>
        <text
          x={leftX + padW / 2}
          y={backY + padH / 2 + 12}
          textAnchor="middle"
          fill="var(--color-foreground)"
          fontSize={11}
          fontFamily="var(--font-mono)"
        >
          {formatNumber(depthFt, 0)} × {formatNumber(widthFt, 0)} ft (
          {result.areaSqFt} sq ft)
        </text>
        <text
          x={leftX + padW / 2}
          y={backY + padH / 2 + 28}
          textAnchor="middle"
          fill="var(--color-drain)"
          fontSize={9}
          fontFamily="var(--font-sans)"
        >
          ≈{result.pitchPct}% pitch → front · {result.fallInches}" fall
        </text>

        <line
          x1={leftX + 4}
          y1={frontY - wallT - 6}
          x2={rightX - 4}
          y2={frontY - wallT - 6}
          stroke="var(--color-drain)"
          strokeWidth={3}
          strokeDasharray="6 4"
        />
        <text
          x={rightX + 4}
          y={frontY - wallT - 2}
          fill="var(--color-drain)"
          fontSize={8}
          fontFamily="var(--font-sans)"
        >
          collector
        </text>

        <rect
          x={leftX}
          y={frontY - wallT}
          width={padW}
          height={wallT}
          fill="var(--color-wall)"
          rx={2}
        />
        <text
          x={leftX + padW / 2}
          y={frontY - 3}
          textAnchor="middle"
          fill="#f5f2eb"
          fontSize={9}
          fontFamily="var(--font-sans)"
        >
          FRONT wall (holds {formatNumber(result.wallHeightFt, 1)} ft fill)
        </text>

        <path
          d={`M ${leftX - pipeW / 2} ${backY + wallT + 6}
              L ${leftX - 22} ${backY + wallT + 6}
              L ${leftX - 22} ${frontY + 36}
              L ${leftX - 22} ${frontY + 48}`}
          fill="none"
          stroke="var(--color-pipe)"
          strokeWidth={pipeW}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polygon
          points={`${leftX - 22},${frontY + 58} ${leftX - 28},${frontY + 46} ${leftX - 16},${frontY + 46}`}
          fill="var(--color-pipe)"
        />
        <text
          x={leftX - 36}
          y={backY + padH / 2}
          textAnchor="middle"
          fill="var(--color-pipe)"
          fontSize={9}
          fontFamily="var(--font-sans)"
          transform={`rotate(-90 ${leftX - 36} ${backY + padH / 2})`}
        >
          solid outlet 4"
        </text>
        <text
          x={leftX - 22}
          y={frontY + 72}
          textAnchor="middle"
          fill="var(--color-pipe)"
          fontSize={9}
          fontFamily="var(--font-sans)"
          fontWeight={600}
        >
          daylight downhill
        </text>

        <rect
          x={leftX}
          y={frontY + 8}
          width={padW}
          height={20}
          fill="var(--color-pool)"
          opacity={0.7}
          rx={2}
        />
        <text
          x={leftX + padW / 2}
          y={frontY + 21}
          textAnchor="middle"
          fill="#1a3a48"
          fontSize={9}
          fontFamily="var(--font-sans)"
        >
          ↓ pool / downhill — keep front wall independent of pool wall ↓
        </text>

        {result.includeSideboards ? (
          <>
            <rect
              x={leftX - 3}
              y={backY + wallT}
              width={3}
              height={padH - wallT * 2}
              fill="var(--color-accent)"
              opacity={0.75}
            />
            <rect
              x={rightX}
              y={backY + wallT}
              width={3}
              height={padH - wallT * 2}
              fill="var(--color-accent)"
              opacity={0.75}
            />
            <text
              x={rightX + 14}
              y={backY + padH / 2 + 30}
              fill="var(--color-accent)"
              fontSize={8}
              fontFamily="var(--font-sans)"
              transform={`rotate(90 ${rightX + 14} ${backY + padH / 2 + 30})`}
            >
              Trex boards
            </text>
          </>
        ) : null}
      </svg>
    </div>
  );
}
