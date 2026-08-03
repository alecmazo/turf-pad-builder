import { useState } from "react";
import { Feather, Trees } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dashboard as PeacockDashboard } from "@/components/dashboard";
import { FernDashboard } from "@/components/fern-dashboard";

type Property = "peacock" | "fern";

/**
 * Site shell: two properties on one builder site.
 * Peacock = hillside futsal turf pad · Fern = regulation tennis / multi-sport.
 */
export function AppShell() {
  const [property, setProperty] = useState<Property>("peacock");

  return (
    <div className="min-h-dvh overflow-x-hidden">
      <div className="border-b border-border bg-foreground text-background">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-background/70">
              Property projects
            </p>
            <p className="font-display text-lg font-semibold tracking-tight">
              Turf Pad Builder
            </p>
          </div>
          <div
            className="flex rounded-xl bg-background/10 p-1"
            role="tablist"
            aria-label="Property"
          >
            <button
              type="button"
              role="tab"
              aria-selected={property === "peacock"}
              onClick={() => setProperty("peacock")}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                property === "peacock"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-background/80 hover:bg-background/10 hover:text-background",
              )}
            >
              <Feather className="size-4" />
              Peacock
              <span className="hidden text-xs opacity-70 sm:inline">
                · turf pad
              </span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={property === "fern"}
              onClick={() => setProperty("fern")}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                property === "fern"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-background/80 hover:bg-background/10 hover:text-background",
              )}
            >
              <Trees className="size-4" />
              Fern
              <span className="hidden text-xs opacity-70 sm:inline">
                · tennis court
              </span>
            </button>
          </div>
        </div>
      </div>

      {property === "peacock" ? <PeacockDashboard /> : <FernDashboard />}
    </div>
  );
}
