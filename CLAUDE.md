# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # start Vite dev server (http://localhost:5173/pokedex/)
npm run build        # production build → dist/
npm run preview      # preview the production build locally
npm run verify       # scripts/verify-play.js — vendored assets, fonts, "silent by design", stories
```

Asset pipeline (committed output; re-run only if `public/pkmn/` or `public/fonts/` is missing):

```bash
node scripts/fetch-play-assets.js     # 151 hero art → WebP 512px + front sprites → public/pkmn/
node scripts/fetch-fonts.js           # the three typefaces → public/fonts/ + generates src/fonts.css
```

Data pipeline (only needed if `src/data/pokemon-cache.json` is missing or must be regenerated —
run in this order, the fixups mutate the cache in place):

```bash
node scripts/fetch-all-pokemon.js     # fetch all 151 from PokéAPI (rate-limited, slow)
node scripts/fix-evo-chains.js        # give every Pokémon its full evolution branch
node scripts/fix-branching-chains.js  # merge branching chains (Eevee) into { branches: [...] }
```

No test runner is configured; `npm run verify` covers the failure classes that would break the play
app silently. Validate print layout changes visually in the browser and via print preview
(Ctrl+P → Save as PDF). Every change to a page component needs a print-preview check — overflow is
invisible on screen because pages use `overflow: hidden`. Validate play changes on the iPad; the PWA
half can only be checked against the deployed HTTPS URL (a service worker won't register on a LAN
dev server).

## Architecture

**Two apps, one repo, one data layer.**

1. **The print book** (`src/components/`) — a print-ready PDF book of all 151 Gen I Pokémon, one per
   A4 page, plus front matter, index grid and appendices. Finished; exported via browser print →
   Save as PDF. Left working, not extended.
2. **The play app** (`src/play/`) — an offline iPad PWA for the owner's under-6 daughters: Explore,
   Story and Game modes, **silent by design** and navigable without reading. This is where new work
   happens. See [docs/interactive-spec.md](docs/interactive-spec.md) and
   [docs/phase-1-plan.md](docs/phase-1-plan.md).

They share `src/data/`, `src/hooks/` and `src/utils/` and nothing else. Print components use `mm`
units and `overflow: hidden` page shells; play components use viewport units and large tap targets.
Don't import across the boundary in either direction.

**Stack**: React 18 + Vite, CSS Modules (no Tailwind — print layout requires precise mm-unit
control), React Router v6 (`HashRouter`), data from PokéAPI pre-fetched into
`src/data/pokemon-cache.json` and committed. Fonts are **self-hosted** from `public/fonts/` via the
generated `src/fonts.css`: **Barlow Condensed** (display/headings), **Lora** (body serif),
**Space Mono** (numbers/labels). Never reintroduce the Google Fonts CDN links — the play app has to
render correctly offline, and `verify` fails if they come back.

`vite.config.js` sets `base: '/pokedex/'` for GitHub Pages. It must match the repo name exactly and
Pages paths are case-sensitive (the remote is `arnautresserras/pokedex`, lowercase). Reference
vendored files through `import.meta.env.BASE_URL`, never a bare `/`-rooted path in JS.

### Data flow

`src/data/pokemon-cache.json` (151 records, committed) → `src/hooks/usePokemon.js`
(`useAllPokemon()` / `usePokemon(id)`, plain synchronous imports, no fetching at runtime) → page
components. `src/data/catchLocations.js` supplies hand-curated Gen I catch locations as a fallback
when a record's `locations` array is empty.

Cache record shape:

```
id, name, types[], category, height (dm), weight (hg), ability,
flavorTexts[{ text, version }], captureRate, baseExperience, growthRate,
eggGroups[], genderRate, stats[{ name, value }], sprites{ frontDefault, officialArtwork },
evolutionChain[{ id, name, trigger }] | [{ branches: [...] }], locations[],
moves[{ name, type, power, learnAt }]
```

The per-Pokémon files (`src/data/bulbasaur.js`, `charmander.js`, `squirtle.js`, `pikachu.js`,
`gengar.js`, `mewtwo.js`) are **unused legacy fixtures** from before the cache existed. Nothing
imports them; don't add to them and don't treat them as a source of truth.

### Routing

`HashRouter`, so every URL below is reached as `#/…` (e.g. `http://localhost:5173/pokedex/#/browse`).
Hash routing is deliberate: GitHub Pages has no SPA rewrite, and this needs no 404.html trick.

```
/              → redirect to /play
/play          → play app home — the three-tile mode switcher
/play/explore  → Explore (type rooms) — placeholder shell until Slice 3
/play/story    → Story — placeholder shell until Slice 5
/play/game     → Game ("Who's that Pokémon?") — placeholder shell until Slice 4
/play/motion   → motion lab — the shared feedback primitives, for on-device checks
/browse        → the whole book, stacked (full print run)
/pokemon/:id   → single Pokémon page (design/iterate on one card)
/page/:slug    → single book page — half-title, full-title, copyright, foreword,
                 how-to-read, pokedex-grid, appendix, closing
```

The nine book components plus `PokemonPage` are `React.lazy` in [src/App.jsx](src/App.jsx) behind one
`Suspense` boundary, so the iPad doesn't download 163 A4 pages to play a guessing game. `PlayApp` is
eager. Adding a book page means adding it to the lazy list, not a static import.

### Book structure and pagination

`BrowsePage` in [src/App.jsx](src/App.jsx) assembles the book. Printed page numbers are passed
down explicitly as `pageNum` / `startPage` props — there is no automatic counter, so **adding or
removing any page means updating the numbers in `BrowsePage`** (and `pokemonBookPage` in
[src/components/book/PokedexGridPage.jsx](src/components/book/PokedexGridPage.jsx), which maps
Pokémon id → book page as `4 + id`).

Current order:

| Sheet(s) | Component | Printed page |
|---|---|---|
| 1 | `BlankPage` | — |
| 2 | `FullTitlePage` | — |
| 3 | `CopyrightPage` | — |
| 4 | `ForewordPage` | — |
| 5 | `HowToReadPage` | 1 |
| 6–8 | `PokedexGridPage` (3 sheets) | 2–4 |
| 9–159 | `PokemonPage` ×151 | 5–155 |
| 160–161 | `AppendixPage` (type chart, stat rankings) | 156–157 |
| 162 | `ClosingPage` | 158 |
| 163 | `BlankPage` | — |

`HalfTitlePage` exists and is reachable at `/page/half-title` but is **not** currently in the
`/browse` run.

### Page components

Each page is its own component + co-located CSS Module, both declaring the `210mm × 297mm` shell.
`src/components/`:

- `PokemonPage.jsx` — the core card. Header (number, type badges, name, category) → two-column body
  → footer. Left column: hero art, vitals `<dl>` (height, weight, ability, gender, catch rate, base
  EXP, growth, egg groups), 4-up sprite gallery (front/back/shiny/shiny-back). Right column: flavor
  texts by game version, Strong-vs / Weak-to type matchups, base stat bars + BST total, notable
  moves. Footer: evolution chain, locations, page number. A large type-name watermark sits behind it.
- `TypeBadge.jsx` — type pill, `small` prop for inline use.
- `StatBar.jsx` — one base-stat row; takes `accentColor`.
- `book/` — front/back matter: `BlankPage`, `HalfTitlePage`, `FullTitlePage`, `CopyrightPage`,
  `ForewordPage`, `HowToReadPage`, `PokedexGridPage` (151-cell index across 3 sheets),
  `AppendixPage` (full 15×15 Gen I type chart + stat rankings), `ClosingPage`.

### Play app (`src/play/`)

```
PlayApp.jsx          shell for /play/*; sets html[data-mode='play'] and blocks pinch/double-tap zoom
play.css             global touch hardening + design tokens (scoped to html[data-mode='play'],
                     so App.css's #root print layout is left alone)
modes.js             the three modes as data — id, Catalan label, colour triple; MODES drives
                     the home tiles AND PlayApp's routes (mode id === path segment)
motion/              the shared feedback layer — Tappable, Celebrate, SceneTransition,
                     useReducedMotion
components/          ModeScreen (the shell every mode renders inside), HomeButton, ModeGlyph
utils/playColors.js  type colours with the cache's post-Gen-I types resolved
utils/playAssets.js  artUrl(id) / spriteUrl(id) → vendored files under public/pkmn/
utils/onPokemonTap.js  the single "a Pokémon was tapped" call site, used by all three modes
screens/             PlayHome (the mode switcher), ModePlaceholder (stands in for a mode that
                     isn't built yet), MotionLab
```

**Every mode renders inside `ModeScreen`.** It owns the two corners — `HomeButton` top-left in every
mode, a `controls` slot top-right for Story's small parent controls — and injects the mode's
`--color-*` vars plus the entry transition. Don't place a home button by hand, don't hardcode a mode
colour, and take a mode's identity from `modes.js` rather than restating it.

Mode colours are deliberately **not** from `TYPE_COLORS`: a mode tile must not read as a type room.
They keep the same `primary` / `light` / `accent` shape, so components still read only the three CSS
custom properties.

**Silent by design.** No `speechSynthesis`, no `AudioContext`, no `new Audio`, no `<audio>`, no
`navigator.vibrate` — the whole experience is visual, the parent supplies the voice, and
`npm run verify` asserts it. Motion is therefore the *only* feedback channel: route every tappable
thing through `Tappable` rather than inventing a hover/active style, keep tap acknowledgement under
100ms, and under `prefers-reduced-motion` **substitute** an instant signal rather than removing it.

**Everything is vendored.** No play component may reference a remote image; airplane mode has to
work and a service worker can only precache what ships. Use `playAssets.js`.

`--tap-min` overrides `Tappable`'s 88px tap-target floor for the rare control that should be *hard*
to hit (Story mode's parent controls) — don't out-specify the base class.

### Type theming

`src/utils/typeColors.js` exports `TYPE_COLORS` (15 Gen I types, each `primary`/`light`/`accent`)
and `getTypeColors(type)`. `PokemonPage` sets `data-type` on the page root and injects
`--color-primary` / `--color-light` / `--color-accent` as inline custom properties; the CSS Module
reads only those variables — never hardcode a type color in CSS.

The cache came from modern PokéAPI, so it carries two types Gen I doesn't have and `TYPE_COLORS`
doesn't cover: `fairy` (Clefairy, Clefable, Jigglypuff, Wigglytuff, Mr Mime) and `steel` (Magnemite,
Magneton). The print book silently greys them out. `src/play/utils/playColors.js` resolves them by
*dropping* them — which reproduces the original Gen I typing exactly in all seven cases (Clefairy →
Normal, Mr Mime → Psychic, Magnemite → Electric) and keeps the type-room index at 15. Play code
should call `getPlayTypeColors` / `pokemonTypes` / `typeCssVars` from there, not `getTypeColors`.

### Type effectiveness

`src/utils/typeChart.js` implements the **Gen I** chart (15 types), including its quirks — Ghost →
Psychic is 0× (the original bug), Bug ↔ Poison are 2× both ways. Exports `ALL_TYPES`,
`getTypeMultiplier(atk, def)`, `getTypeMatchups(types)` → `{ weak, resist, immune }`, and
`getOffensiveMatchups(types)`. Do not substitute a modern type chart.

### Formatters

`src/utils/formatters.js`: `formatId` (`#001`), `paddedId` (`001`), `formatHeight` (dm → m + ft/in),
`formatWeight` (hg → kg + lbs), `formatGender` (PokéAPI `gender_rate` → ♂/♀ split), `STAT_LABELS`.

### Print CSS architecture

Global `@page` / print rules live in [src/App.css](src/App.css) (A4, zero margin, nav hidden,
`#root` padding and gap collapsed). Each page module then follows this pattern:

```css
.page {
  position: relative;
  width: 210mm;
  height: 297mm;
  overflow: hidden;
  box-shadow: 0 4px 32px rgba(0,0,0,0.18);  /* screen only */
}

@media print {
  .page { box-shadow: none; break-after: page; }
}
```

Use `mm` for structural layout, `rem`/`em` for typography.

## Key constraints

- Every page is exactly `210mm × 297mm` — no overflow, no scroll inside a page. `overflow: hidden`
  hides mistakes rather than fixing them, so check print preview.
- Printed page numbers are manual props — keep `BrowsePage` and `pokemonBookPage` in sync.
- Hero art: `https://assets.pokemon.com/assets/cms2/img/pokedex/full/{paddedId}.png`, with an
  `onError` fallback to the cached PokéAPI official-artwork sprite. Small sprites and evolution-chain
  sprites come from the `PokeAPI/sprites` GitHub raw URLs. All images are remote — printing requires
  network access and "print background graphics" enabled.
- The play app's images are **vendored** in `public/pkmn/` (art as 512px WebP, front sprites as PNG,
  ~3.9MB total) and must stay that way. Back/shiny sprites remain remote — print-only.
- Gen I only (#001–151). No alternate forms, no Megas. Evolution chains filter out any `id > 151`.
  The cache's chains include later-gen Pokémon (Pikachu's includes Pichu, id 172), and Eevee (133) is
  the only branching chain — stored as `[{...}, { branches: [...] }]`, so it needs a branch case.
- `locations` is empty on all 151 cache records; `src/data/catchLocations.js` (id → route names) is
  the only real location data.
- Abilities were introduced in Gen III; the retroactively assigned ability is shown in the vitals list.
- No SSR — static SPA on hash routes, so no server rewrite is needed for deep links.
