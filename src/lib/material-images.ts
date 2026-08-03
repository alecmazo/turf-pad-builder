/**
 * Material thumbnail map — SVGs in /materials (public).
 * base path works for both root and GitHub Pages /turf-pad-builder/.
 */
const BASE = import.meta.env.BASE_URL ?? "/";

function m(name: string) {
  return `${BASE}materials/${name}.svg`;
}

export const MATERIAL_IMAGES: Record<string, string> = {
  "cut-fill": m("cut-fill"),
  srw: m("srw"),
  caps: m("caps"),
  geogrid: m("geogrid"),
  "level-pad": m("level-pad"),
  "drain-rock": m("drain-rock"),
  filter: m("filter"),
  perf: m("perf"),
  solid: m("solid"),
  fittings: m("fittings"),
  geo: m("geo"),
  class2: m("class2"),
  bedding: m("bedding"),
  turf: m("turf"),
  infill: m("infill"),
  spikes: m("spikes"),
  seam: m("seam"),
  beams: m("beams"),
  trex: m("trex"),
  hardware: m("hardware"),
  compactor: m("compactor"),
  level: m("level"),
  broom: m("broom"),
  "tools-buy": m("tools-buy"),
  delivery: m("delivery"),
  // fallbacks
  default: m("class2"),
};

/** Short labels for build-step material chips. */
export const MATERIAL_LABELS: Record<string, string> = {
  "cut-fill": "Cut & fill soil",
  srw: "SRW blocks",
  caps: "Cap blocks",
  geogrid: "Geogrid",
  "level-pad": "Leveling pad",
  "drain-rock": "Drain rock",
  filter: "Filter fabric",
  perf: "Perf pipe",
  solid: "Solid outlet",
  fittings: "Fittings",
  geo: "Geotextile",
  class2: "Class II base",
  bedding: "DG bedding",
  turf: "Turf",
  infill: "Sand infill",
  spikes: "Turf spikes",
  seam: "Seam tape",
  beams: "PT posts & rails",
  trex: "Trex boards",
  hardware: "Fasteners",
  compactor: "Plate compactor",
  level: "Laser level",
  broom: "Power broom",
  "tools-buy": "Hand tools",
  delivery: "Delivery",
};

/** Materials featured in each build phase animation. */
export const PHASE_MATERIALS: Record<number, string[]> = {
  1: ["class2", "srw", "perf", "turf"],
  2: ["cut-fill", "compactor", "class2"],
  3: ["srw", "caps", "geogrid", "drain-rock", "perf"],
  4: ["srw", "drain-rock", "perf", "filter"],
  5: ["perf", "solid", "fittings"],
  6: ["geo", "class2", "bedding", "compactor"],
  7: ["beams", "trex", "hardware"],
  8: ["turf", "infill", "spikes", "seam"],
};
