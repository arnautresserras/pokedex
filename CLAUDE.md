# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # start Vite dev server (http://localhost:5173)
npm run build        # production build → dist/
npm run preview      # preview the production build locally

# One-time data fetch (run before first use if pokemon-cache.json is missing):
node scripts/fetch-all-pokemon.js
```

No test runner is configured. Validate layout changes visually in the browser and via print preview.

## Architecture

**Goal**: A print-ready PDF book of all 151 Gen I Pokémon — one per A4 page. The web app is the design environment; the final artifact is exported via browser print → Save as PDF.

**Stack**: React + Vite, plain CSS (no Tailwind — print layout requires precise mm-unit control), React Router v6, data from PokéAPI pre-fetched into `src/data/pokemon-cache.json`.

### Data flow

`src/data/pokemon-cache.json` (pre-fetched) → `src/hooks/usePokemon.js` → page components. The fetch script (`scripts/fetch-all-pokemon.js`) is a one-time Node script that populates the cache with rate-limit delays. During development, runtime fetch with `localStorage` cache is acceptable.

### Routing

```
/              → redirect to /browse
/browse        → all 151 pages stacked (full print run)
/pokemon/:id   → single Pokémon page (design/iterate on one card)
```

### Page layout

`PokemonPage` is the core component — a fixed `210mm × 297mm` box. Content must never overflow. Layout:
- **Header band**: Pokédex number, name, type badge(s), category
- **Main body (two columns)**: left = art + height/weight/abilities; right = flavor text + stat bars + BST total
- **Footer band**: evolution chain, catch locations, type-themed decoration

### Type theming

Each page derives its color theme from the Pokémon's primary type. `src/utils/typeColors.js` exports `TYPE_COLORS` (15 Gen I types, each with `primary`/`light`/`accent`). Apply as `data-type` attribute on the page root and use CSS custom properties to propagate colors.

### Print CSS architecture

```css
.pokemon-page {
  width: 210mm;
  height: 297mm;
  overflow: hidden;
  break-after: page;
}

@page { size: A4; margin: 0; }

@media print {
  .app-nav, .browse-controls { display: none; }
  .pokemon-page { margin: 0; box-shadow: none; }
}
```

Use `mm` for structural layout, `rem`/`em` for typography.

## Key constraints

- Page is exactly `210mm × 297mm` — no overflow, no scroll inside a page.
- High-res art URL: `https://assets.pokemon.com/assets/cms2/img/pokedex/full/{padded_id}.png` (e.g. `001.png`). Fallback to PokéAPI official artwork sprite.
- Gen I only (Pokédex #001–151). No alternate forms, no Mega evolutions.
- Abilities were introduced in Gen III — show the retroactively assigned ability or replace with a "Pokémon Facts" callout.
- No SSR required — static SPA.
