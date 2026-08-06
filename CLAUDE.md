# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # start Vite dev server (http://localhost:5173/pokedex/) — no service worker
npm run build        # production build → dist/, plus manifest.webmanifest + sw.js
npm run preview      # preview the production build locally — the only local way to get the SW
npm run verify       # scripts/verify-play.js — assets, fonts, icons, "silent by design", stories
```

Asset pipeline (committed output; re-run only if `public/pkmn/` or `public/fonts/` is missing):

```bash
node scripts/fetch-play-assets.js     # 151 hero art → WebP 512px + front/back sprites → public/pkmn/
node scripts/fetch-fonts.js           # the three typefaces → public/fonts/ + generates src/fonts.css
node scripts/fetch-type-icons.js      # the 15 type pictograms → generates src/play/typeIcons.js
node scripts/make-icons.js            # home-screen / manifest icons from pokeball.svg → public/icons/
node scripts/list-people-sprites.js   # scans public/people/ → generates src/play/peopleSprites.js
node scripts/compose-scene.js         # Tiled .tmx + tileset PNGs (assets/tilesets/) → public/scenes/
node scripts/label-tileset.js         # annotates a tileset PNG for compose-scene.js
```

`npm run` aliases exist for the three most-repeated ones: `assets:play`, `assets:fonts`,
`assets:icons`. `fetch-type-icons.js` and `list-people-sprites.js` have no alias — run them with
`node` directly.

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
half can only be checked against the deployed HTTPS URL or `npm run preview` (a service worker
won't register on a LAN dev server — it needs a secure context, and `npm run dev` registers none
at all by design, so a stale SW can never confuse a dev session).

## Architecture

**Two apps, one repo, one data layer.**

1. **The print book** (`src/components/`) — a print-ready PDF book of all 151 Gen I Pokémon, one per
   A4 page, plus front matter, index grid and appendices. Finished; exported via browser print →
   Save as PDF. Left working, not extended.
2. **The play app** (`src/play/`) — an offline iPad PWA for the owner's under-6 daughters: Explore,
   Story and Game modes, **silent by design** and navigable without reading. This is where new work
   happens. See [docs/implemented/interactive-spec.md](docs/implemented/interactive-spec.md) and
   [docs/implemented/phase-1-plan.md](docs/implemented/phase-1-plan.md).

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

### PWA / offline

`vite-plugin-pwa` (Workbox `generateSW`) is configured in [vite.config.js](vite.config.js) and emits
`manifest.webmanifest` + `sw.js` at build time. Four things about it are load-bearing:

- **`base` is the single source of truth.** `scope`, `start_url` and every manifest icon `src` are
  built from the same `BASE` constant, so the casing mistake that cost Slice 1 a deploy can't
  recur — a wrong `scope` means a home-screen launch that opens in Safari with chrome, which looks
  like a broken install rather than a config typo. Never restate the path literally.
- **`globPatterns` must keep `webp` and `woff2`.** Workbox's default pattern omits both, and both
  are the entire app: 151 hero arts and the three self-hosted typefaces. The precache is ~350
  entries / ~4MB, comfortably under `maximumFileSizeToCacheInBytes` (largest single file is the
  437KB main bundle), so that limit is deliberately left at its default.
- **There is no `runtimeCaching`, and shouldn't be.** Everything the play app touches is vendored
  and precached, so a runtime cache could only ever catch a remote request — which in play code is
  the bug the vendoring rule exists to prevent, and in the print book is 151 remote hero arts that
  deliberately stay out of a child's offline cache.
- **`registerType: 'prompt'` with no prompt UI is intentional.** `autoUpdate` reloads the page the
  instant a new SW takes over, and a reload mid-round reads as a crash to a four-year-old — who
  also can't be shown an "update available" button in an app with no readable text. So
  `skipWaiting` stays off: a new version installs quietly and activates on the next cold launch.
  `clientsClaim: true` is still set, so the *first* load is controlled without needing a refresh.

[src/registerServiceWorker.js](src/registerServiceWorker.js), called from `main.jsx`, replaces
`vite-plugin-pwa`'s auto-injected registration so `registration.update()` also runs on
`visibilitychange` and `pageshow` — a returning tab checks for a new version without the child
having to background-and-reopen the app. It still never calls `skipWaiting`: the load-bearing
"installs quietly, activates on next cold launch" contract above is unchanged.

Icons are generated output like everything else in `public/` — `scripts/make-icons.js` renders four
PNGs from `public/pokeball.svg` into `public/icons/`, committed. They're flattened onto `--play-bg`
because a transparent icon composites onto black on iOS, and there are two 512s because a maskable
icon needs a smaller ball to survive Android's crop. **iOS reads the `apple-touch-icon` link in
[index.html](index.html), not the manifest**, so that line and the manifest's `icons` array both
have to be right; `verify` checks the files exist and that the link is present.

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
/                            → redirect to /play
/play                        → play app home — the three-tile mode switcher
/play/explore                → Explore — the 15 type rooms
/play/explore/:type          → that type's grid
/play/explore/:type/:id      → one Pokémon's card (`:type` is the room you came from,
                               which is not always the Pokémon's own type)
/play/story                  → Story — a picker over STORY_LIST (currently three: forest, route1,
                               pikafield); redirects straight in only while there's a single story
/play/story/:storyId         → that story. The *scene* is state, not a route: the path taken is
                               what gives a scene meaning, and the parent's back must mean
                               "previous scene", not "previous URL"
/play/game                    → Game — GameIndex: one big tile per activity (silhouette, type,
                               family, evolution order, memory, sprite match, jigsaw), plus
                               "Barrejat" for a random one each round
/play/game/:activity          → GameRound — that activity (or a fresh random one every round, for
                               "mix"), asked round after round. A round is state, not a route, so
                               anything deeper redirects to the index
/play/motion                 → motion lab — the shared feedback primitives, for on-device checks
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
PlayApp.jsx          shell for /play/*; sets html[data-mode='play'] and blocks pinch/double-tap
                     zoom. MODE_SCREENS maps a mode id → its screen; a mode with no entry gets
                     ModePlaceholder. Every mode owns a subtree (/play/<id>/*), not one path.
play.css             global touch hardening + design tokens (scoped to html[data-mode='play'],
                     so App.css's #root print layout is left alone)
modes.js             the three modes as data — id, Catalan label, colour triple; MODES drives
                     the home tiles AND PlayApp's routes (mode id === path segment)
typeRooms.js         the 15 type rooms as data — Catalan label, representative `face` id, and
                     type → members (memoized). modes.js's sibling, one level down.
typeIcons.js         GENERATED by scripts/fetch-type-icons.js — the 15 type pictograms as path
                     data + the shared viewBox. Licence in typeIcons.LICENSE.txt.
peopleSprites.js     GENERATED by scripts/list-people-sprites.js — the vendored Gen III human
                     sprites (public/people/) as id → filename, plus protagonistBackUrl(id) /
                     trainerSpriteUrl(id). TRAINERS isn't consumed by any story yet.
motion/              the shared feedback layer — Tappable, Celebrate, SceneTransition,
                     useReducedMotion
components/          ModeScreen (the shell every mode renders inside), HomeButton, BackButton,
                     ModeGlyph, TypeGlyph (15 type pictograms), PlayTypeBadge
stories/             the story content: forest.js/forest.ca.js, route1.js/route1.ca.js,
                     pikafield.js/pikafield.ca.js — each story is a *graph* file (scenes, choices,
                     backdrops, encounter pool) plus a *prose* file, joined by index.js into
                     STORIES. A new language is a text file; a new story is both plus one line
utils/playColors.js  type colours with the cache's post-Gen-I types resolved
utils/playAssets.js  artUrl(id) / spriteUrl(id) / backSpriteUrl(id) / sceneUrl(id) → vendored
                     files under public/pkmn/ and public/scenes/
utils/traits.js      height / weight / speed as 1-of-5 levels, ranked across all 151
utils/evolution.js   a chain reduced to drawable stages — Gen I filter + Eevee's branch shape
utils/rounds.js      five round builders, one per Game activity, sharing the contract
                     `(roster, { recent }) => { ...roundData, recentIds }`: buildRound (silhouette;
                     answer + 2 distinct distractors via a family/type/height strictness ladder),
                     buildTypeRound (a Pokémon + its type + 2 distractor types), buildFamilyRound
                     (two members of the same evolution family), buildEvolutionRound (an unbranched
                     2–3-stage Gen I chain to sequence — Eevee excluded, not special-cased),
                     buildMemoryRound (6 Pokémon × 2 cards; distinctness rules don't apply, the
                     skill is location memory)
utils/encounters.js  CATCH_LOCATIONS inverted (route → ids) + STORY_POOLS (a story place → its
                     Gen I locations; forest/route1/pikafield) → pickEncounter(). A pool is a
                     *place*, never a cast list
utils/onPokemonTap.js  the single "a Pokémon was tapped" call site, used by all three modes
screens/             PlayHome (the mode switcher), ModePlaceholder (the fallback for a mode with
                     no MODE_SCREENS entry — unreachable from MODES now all three are built),
                     MotionLab
screens/explore/     Explore (owns the frame and the sub-routing), TypeRoomIndex, TypeRoom,
                     PokemonCard, TraitMeters, EvolutionStrip, PokemonLore (pages through the
                     cache's four flavor texts inside PokemonCard)
screens/game/        Game (frame + routing, Explore's shape), GameIndex (one tile per activity,
                     plus "Barrejat"), GameRound (`:activity` — rolls/advances rounds, tracks
                     last 12 seen ids in recentRef), activities.js (the ACTIVITIES registry —
                     key → label/builder/Component; see "Game's rules" below), ActivityIcon
                     (the pictograms GameIndex's tiles use), SilhouetteStage + AnswerOptions
                     (silhouette, and reused by sprite match), TypeStage + TypeOptions (type,
                     and TypeStage reused as-is by family and sprite match),
                     SilhouetteGame/TypeGame/FamilyGame/EvolutionOrderGame/MemoryGame/
                     SpriteMatchGame/JigsawGame (the seven activity components)
screens/story/       Story (frame, routing, scene state machine), StoryPicker (shown once
                     STORY_LIST has more than one entry), StoryScene (the shared frame every scene
                     renders in — backdrop, narration panel, action slot), Narration (the
                     teleprompter), SceneChoices + ChoiceGlyph (the picture choices), Encounter,
                     Backdrop (15 backdrops across 4 shapes, the fourth being a composed tile
                     image via sceneUrl), Protagonist (the story's stand-in on the trail, shown on
                     every non-encounter scene — a peopleSprites.js id or a Pokémon back sprite),
                     ParentControls
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
to hit (Story mode's parent controls) — don't out-specify the base class. It's also the escape hatch
for a target that's already large by other means (a type-room tile, an evolution sprite), where the
floor would otherwise force a minimum the layout doesn't want.

**Corner grammar.** Top-left is always `HomeButton` → `/play`, in every mode, never restyled. Top
right is `ModeScreen`'s `controls` slot: Explore and Game both put a full-size `BackButton` ("up
one level") there once they're a level deep, Story puts its deliberately small parent controls
there instead. Back navigates to an explicit parent path, never `navigate(-1)` — a deep-linked
card or round would otherwise walk out of the app.

**Glyph sizing contract.** `TypeGlyph` fills its box (`width/height: 100%`) and is sized by a
wrapper element, never by overriding the SVG's own class — CSS Module ordering across files isn't
guaranteed, so two rules fighting over `width` is a coin flip.

**The 15 type pictograms are vendored, not drawn.** They come from
[partywhale/pokemon-type-icons](https://github.com/partywhale/pokemon-type-icons) (MIT — a vector
recreation of the modern games' type icons) via `node scripts/fetch-type-icons.js`, which writes the
generated `src/play/typeIcons.js` and `src/play/typeIcons.LICENSE.txt`. Don't hand-edit the generated
module and don't add a sixteenth icon to it — re-run the script. The script drops each icon's
coloured disc (the app supplies the colour), computes the shared `viewBox` from the measured union of
all 15 symbols, and marks the detail shapes upstream fills with a shade of the disc as `cut: true`.
Those cuts are rendered as an **SVG mask**, so a hole shows the real surface behind it — which is why
nothing sets `--glyph-cut` any more (a flat fill can't match the gradient the tiles use).

**Game's rules.** Game is two levels, `Explore`'s shape: `GameIndex` (one big tile per activity,
plus "Barrejat" for a random one) and `GameRound` (`:activity` — that activity, or a fresh random
one each round for "mix", asked round after round). Both read from `screens/game/activities.js`'s
`ACTIVITIES` registry (`modes.js`/`typeRooms.js`'s pattern one level down): a key → `{ label,
build, Component }`. `GameRound` never inspects a round's shape — every builder in `utils/rounds.js`
returns `{ ...roundData, recentIds }`, and `GameRound` forwards the round to the matching
`Component` as `{ round, onDone }` and folds `recentIds` into the shared "last 12 seen" exclusion
list. Adding an eighth activity means one round builder, one component, one registry entry, one
`ActivityIcon` case — not a change to `GameRound`. `key={roundNo}` on the mounted activity remounts
it every round, so no activity has to reset its own internal state by hand.

There used to be one screen with a corner tray (`ActivityPicker`) that switched activities without
leaving the round on screen. Once there were seven activities the tray stopped being a fair target
for a child, so it's gone — switching activity now means going back to the index, the same gesture
Explore's rooms already teach.

The seven activities:

- **Silhouette** ("Endevina el Pokémon") — tap 1 of 3 art tiles matching a black silhouette. The
  silhouette and all three options come from the *same* `artUrl(id)` file, so the pose being
  matched is the pose on screen (a sprite is a different pose of the same Pokémon, which turns an
  easy match into a trick question).
- **Type** ("Endevina el color") — tap 1 of 3 type pictogram tiles matching the shown Pokémon's
  primary type.
- **Family** ("Qui és de la família?") — tap the Pokémon from the prompt's evolution family;
  reuses `TypeStage` and `AnswerOptions` as-is rather than owning its own stage/options.
- **Evolution order** ("Ordena l'evolució") — tap chain stages into sequence, left to right;
  tapping anything but the next expected stage does nothing (no wrong state, only "not yet").
  Limited to unbranched 2–3-stage Gen I chains, so there's always exactly one right order.
- **Memory** ("Memory") — a 6-pair flip-and-match grid using `artUrl(id)` on both faces of a pair.
  The only activity where distinctness rules don't apply — the skill being tested is location
  memory, not identification, so any six Pokémon make a fair board.
- **Sprite match** ("Troba el sprite") — hero art on stage (again `TypeStage` reused as-is), tap
  1 of 3 pixel sprites that are the same Pokémon. The inverse lesson from Silhouette: there one
  picture in two forms is the question, here two *different* pictures of the same Pokémon are.
  Reuses `buildRound` unchanged — `AnswerOptions` just takes `spriteUrl` instead of its `artUrl`
  default.
- **Jigsaw** ("Trenca-closques") — one Pokémon's hero art sliced into a shuffled 3 × 2 grid; tap
  two pieces to swap them until it's whole. No drag: tap-to-select-then-swap, the same two-tap
  shape as Memory's flip and Evolution order's tap-to-place.

Distractors must stay visually distinct across the activities that need it; the strictness ladder
in `rounds.js` guarantees that and is the only place that logic belongs. **No score, no streak, no
timer, no fail state** anywhere in Game — a wrong tap reveals the answer and celebrates too (except
evolution order and jigsaw, where there's no "wrong" to reveal, only "not yet"). The silhouette
reveal must stay legible with motion off: it carries four signals (colour fill, `Celebrate`, the
stage's light pool switching to the Pokémon's type colour, the `?` becoming the name) and only one
of them is animation.

**Story's rules.** The mode is an **engine over content**: nothing in `screens/story/` knows what a
forest is, and a second story must stay a graph file, a text file and one line in
`stories/index.js`. So:

- **The graph and the prose are separate files.** `forest.js` holds ids, choices, backdrops and
  the encounter pool; `forest.ca.js` holds only words (narration keyed by scene, choice labels
  keyed by pictogram id). A translation copies the words, so it can't fork the branching.
- **`src/play/stories/` and `utils/encounters.js` are data only, with explicit `.js` import
  extensions** — no JSX, no `import.meta.env`, no extensionless imports. `scripts/verify-play.js`
  imports them under plain Node to walk the graph, and that check is the reason authored prose
  can't break silently.
- **Narration is authored as a list of paragraphs**, ≤3 blocks and ~340 characters per narrated
  scene (~200 for an encounter). That's the teleprompter panel's budget, not a style preference:
  over it, the type shrinks below arm's-length legibility or the panel scrolls mid-sentence. An
  encounter's last line ends on a **colon** — the Pokémon's name completes the sentence.
- **Choices are pictures of places, not arrows.** Left/right needs teaching; sun-versus-shade and
  up-versus-down don't. Every choice needs an entry in `ChoiceGlyph` (currently: `sunny-path`,
  `dark-path`, `branch`, `leaves`, `cloud-gap`, `grass-ripple` — add a case, don't extend a
  generated table) and a label for the parent. An unknown icon renders a magenta placeholder on
  purpose — a blank tile would be indistinguishable from a working one.
- **An encounter pool is a place.** `STORY_POOLS` maps a story place (`forest`, `route1`,
  `plant-fence`) to real Gen I location names and `CATCH_LOCATIONS` supplies the cast; never
  hand-pick ids, and don't invent habitat sub-pools the data doesn't have.
- **A story may name a `protagonist`** — either an id into `peopleSprites.js`'s vendored Gen III
  back sprites, or `{ pokemon: <id> }` for a Pokémon's own back sprite via `backSpriteUrl` (used
  by `pikafield.js`) — and `StoryScene` stands it on the trail in every narrated scene, never an
  encounter. It's optional and purely atmospheric: a story with no `protagonist` renders exactly
  as before.
- **The scene is state and the visited path is an array.** Back pops it, restart empties it,
  neither touches history. The parent's controls are deliberately small (`--tap-min: 0`) and that
  size is the whole access control — no dialogs, no long-press gates.

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
- The play app's images are **vendored** in `public/pkmn/` (art as 512px WebP, front and back
  sprites as PNG) and must stay that way. Shiny sprites remain remote — print-only.
- Story backdrop scenes composed from tilesets (`scripts/compose-scene.js` + `scripts/label-tileset.js`,
  reading Tiled `.tmx` maps and tileset PNGs from `assets/tilesets/`) are rendered once and
  committed as PNGs to `public/scenes/`, read via `sceneUrl(id)`. Re-run the compose script after
  editing a `.tmx` map; don't hand-edit the output PNGs.
- Human sprites for the play app are vendored by hand (not fetched) in `public/people/`:
  `gen3_back/` (13 back-view walking sprites, one of which a story can use as its
  `protagonist`) and `gen3_trainer_sprites/` (~170 front-facing battle sprites, not yet consumed
  by any story). Re-run `node scripts/list-people-sprites.js` after adding or removing a file —
  `src/play/peopleSprites.js` is generated from a directory listing, not hand-maintained.
- Gen I only (#001–151). No alternate forms, no Megas. Evolution chains filter out any `id > 151`.
  The cache's chains include later-gen Pokémon (Pikachu's includes Pichu, id 172), and Eevee (133) is
  the only branching chain — stored as `[{...}, { branches: [...] }]`, so it needs a branch case.
- `locations` is empty on all 151 cache records; `src/data/catchLocations.js` (id → route names) is
  the only real location data.
- Abilities were introduced in Gen III; the retroactively assigned ability is shown in the vitals list.
- No SSR — static SPA on hash routes, so no server rewrite is needed for deep links.
