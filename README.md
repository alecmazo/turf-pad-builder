# Turf Pad Builder

Interactive dashboard for planning a backyard hillside cut-and-fill turf pad / youth futsal terrace.

## Live site

**https://alecmazo.github.io/turf-pad-builder/**

## Features

- Live pad sizing (width, depth, grade drop, Trex sideboard height)
- Balanced cut/fill earthwork (no dirt import when soil is clean)
- Drainage layout plan view (interceptor + collector + solid outlet)
- DIY vs pro cost estimates (NorCal retail blend)
- Scaled bill of materials from the 13×24 build spec
- Build sequence checklist

## Stack

React 19 · TypeScript · Vite · Tailwind v4 · Recharts

## Develop

```bash
npm install
npm run dev         # TanStack Start app (Grok / local)
npm run build:spa   # static site for GitHub Pages
```

## Deploy (GitHub Pages)

```bash
npm run build:spa
# push contents of dist-spa/ to the gh-pages branch
```

## Notes

Estimates only — confirm permits, soils, and manufacturer charts before building. Call 811 before you dig.
