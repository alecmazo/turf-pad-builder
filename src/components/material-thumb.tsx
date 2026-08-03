import { MATERIAL_IMAGES } from "@/lib/material-images";
import { cn } from "@/lib/utils";

interface MaterialThumbProps {
  itemId: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  alt?: string;
}

const SIZE = {
  sm: "h-10 w-10",
  md: "h-14 w-14",
  lg: "h-20 w-20",
} as const;

export function MaterialThumb({
  itemId,
  className,
  size = "md",
  alt,
}: MaterialThumbProps) {
  const src = MATERIAL_IMAGES[itemId] ?? MATERIAL_IMAGES.default;
  return (
    <img
      src={src}
      alt={alt ?? itemId}
      className={cn(
        "shrink-0 rounded-lg border border-border bg-muted object-cover",
        SIZE[size],
        className,
      )}
      loading="lazy"
      width={size === "lg" ? 80 : size === "md" ? 56 : 40}
      height={size === "lg" ? 80 : size === "md" ? 56 : 40}
    />
  );
}
