# Phase 1 Implementation Plan — Pokédex Interactive

Scope: the P0 set from [interactive-spec.md](interactive-spec.md) — home switcher, Explore, one
Story, "Who's that Pokémon?", PWA installability.

Revised against the silent / parent-narrated / Catalan spec revision.

## Status

| Slice | State |
|---|---|
| 0 · Motion vocabulary spike | **Shipped**, as `/play/motion` — kept in the app rather than thrown away. Its question (is a silent reveal satisfying?) needs the daughters, not a dev. |
| 1 · Foundations | **Done.** Built, deployed to Pages, verified. Three deviations recorded under the slice. |
| 2 · Home / mode switcher | Next, unblocked. |
| 3 · Explore | Unblocked. |
| 4 · Game | Unblocked, and the stronger candidate to take before 3 and 5 — see Sequencing. |
| 5 · Story engine + forest story | Unblocked. |
| 6 · PWA + device hardening | Not started. Its deploy half was pulled forward into Slice 1. |

Nothing about the plan below has changed shape as a result of Slice 1 — the risks it names are
still the risks.

## Decisions taken

| Question | Decision |
|---|---|
| Image assets | **Vendor locally.** A fetch script downloads all 151 artwork + sprites into `public/pkmn/`, committed. True offline, precacheable, no third-party requests. |
| Routing / build | **HashRouter, one build.** `base: '/Pokedex/'`, print book lazy-loaded. Real routes, no GitHub Pages 404 trick, fixes the book's deploy too. |
| Explore layout | **Type rooms.** ~15 big colored type tiles → tap one → that type's grid. Answers "less overwhelming" with no unlock/progress model. |
| Story scope | **One polished story + a data-driven engine.** Forest ships complete; stories 2–3 become pure content files in Phase 2. *(Now recorded in the spec.)* |

Two of these settle questions still listed as open in the spec — Explore's layout, and
routes-vs-state. Treat them as closed.

## What the spec revision changed

**Deleted outright.** The speech spike, `useSpeech()`, the iOS first-gesture unlock, voice
resolution, the `Nidoran F` / `Mr Mime` pronunciation map, the mute toggle, Web Audio oscillator
blips in Game mode, and every "speaks the name on tap" acceptance criterion. Roughly a day of work
gone, and the single riskiest technical dependency in the plan with it.

**The risk moved rather than vanished.** With no audio *and* no haptics — the spec is right that
`navigator.vibrate` doesn't exist in Safari — motion is the app's only feedback channel. That was a
line item before; it's now load-bearing architecture. Which means the freed day mostly gets spent
again, on motion design, teleprompter typography, and Catalan prose. Net estimate is roughly
unchanged.

**Story mode changed target audience.** Written for an adult reader, at adult reading level, laid
out to be performed at arm's length. That's a different typography problem and more authoring
effort than the "1–2 short simple sentences" version.

**One new blocking finding — see below.**

## Constraints discovered in the code

Verified against the current repo:

- ~~**The fonts are loaded from the Google Fonts CDN** in `index.html`.~~ **Resolved in Slice 1** —
  self-hosted from `public/fonts/` (16 woff2 faces, 356KB) via a generated `src/fonts.css`. This was
  cosmetic for a print book. It isn't now: an offline PWA silently falls back to system fonts, and
  "narration text comfortably readable at arm's length" is a P0 acceptance criterion that depends on
  the typeface actually arriving. It's also a third-party request the spec's self-contained goal
  rules out. Catalan's `·`, `ç`, and accented vowels are all in the standard latin subset, so no
  extra subsetting was needed.
- **`locations` is empty for all 151 cache records.** The only real location data is
  `src/data/catchLocations.js`, keyed id → route names. Story encounters need it inverted.
- **Evolution chains contain non-Gen-I Pokémon.** Pikachu's chain includes Pichu (id 172). The play
  UI must apply the same `id <= 151` filter the print book does.
- **Eevee (133) is the only branching chain**, stored as `[{...}, { branches: [...] }]`. The
  evolution component needs a branch case, not just a linear walk.
- ~~**Five Pokémon carry `fairy`**~~ — **seven records carry a post-Gen-I type**, not five, and
  **`steel` was missed**: Magnemite and Magneton are `[electric, steel]`. Neither type is in
  `TYPE_COLORS` or the Gen I chart. **Resolved in Slice 1** by *dropping* post-Gen-I types rather
  than colouring them, which reproduces the original typing exactly in all seven cases (Clefairy →
  Normal, Mr Mime → Psychic, Magnemite → Electric) with one rule and no id table, and keeps the
  type-room index at 15.
- ~~**`App.jsx` statically imports all nine book components**~~, so today's bundle ships the whole
  print book to the iPad. **Resolved in Slice 1** — `React.lazy` behind one `Suspense` boundary.
- **Service workers require a secure context.** An iPad on `http://192.168.x.x:5173` can't register
  one, so the PWA half of P0 is only verifiable against the deployed HTTPS URL. Deploy comes early.

---

## Slice 0 — Motion vocabulary spike (≈half day) — **shipped**

Landed as a route, `/play/motion`, rather than as throwaway scaffolding: the three primitives side
by side with a live `prefers-reduced-motion` readout. Keeping it costs nothing, is what gets handed
to the daughters, and catches later regressions in a layer that has no other test.

Replaces the deleted speech spike. Same reasoning: the one channel everything depends on gets
proven on the real device before three modes are built on top of it.

- Build the feedback primitives standalone: tap acknowledgement (sub-100ms), a "correct answer"
  celebration, a scene/card transition, a reduced-motion variant of each.
- Test on the actual iPad, muted, in standalone mode.
- Answers the spec's own open question — *is a visual-only reveal satisfying for a 4-year-old?* —
  and it's the one question only the daughters can answer.

Unlike the audio spike this is a design gate, not a feasibility gate, so it doesn't block: if the
verdict is lukewarm you iterate on the celebration in Slice 4, you don't rearchitect. Its real
output is a shared motion vocabulary the other slices consume instead of each inventing their own.

## Slice 1 — Foundations (≈1–1.5 days) — **done**

Commits `77ac1fa`, `7933e8f`, `e865f87`. Deployed and checked on Pages.

**Three deviations from the plan as written:**

1. **`base: '/pokedex/'`, not `/Pokedex/`.** The repo is `arnautresserras/pokedex` and Pages paths
   are case-sensitive, so the planned value would have 404'd every asset. `start_url` / `scope` in
   Slice 6 inherit the lowercase form.
2. **`fairy` was half the problem** — `steel` was in the cache too, and the fix drops post-Gen-I
   types rather than adding colours for them. See the constraints section above.
3. **Pages needed its Source set to "GitHub Actions" by hand.** A branch-based source serves the
   repo verbatim, so the site returned an `index.html` pointing at unbuilt `/src/main.jsx` — which
   surfaces as a MIME type error, not as an obvious "not built" message. `enablement: true` on
   `configure-pages` did *not* switch it; the run went green while the site kept serving the branch.
   Worth knowing if Pages is ever reset.

Also landed, unplanned but required: `public/pokeball.svg`, referenced as the favicon and assumed by
Slice 6's icon step, but never actually in the repo.

**Asset vendoring** — `scripts/fetch-play-assets.js`:
- Hero art from PokéAPI official-artwork → `sharp` → WebP @512px q82 → `public/pkmn/art/{id}.webp`
  (~23KB each, **3.5MB total** — comfortably under the ~7MB estimated; raw PNGs would be ~38MB, too
  heavy to precache). Front sprites add 442KB, so the whole image set is 3.9MB.
- Front sprites as-is → `public/pkmn/sprite/{id}.png` (~1.5MB total).
- Committed, matching the project's existing "cache the data, commit it" philosophy. Back/shiny
  stay remote — print-only.
- Adds `sharp` as a devDependency.

**Self-host fonts** — pull Barlow Condensed, Lora, and Space Mono into `public/fonts/` as woff2,
serve via `@font-face`, drop the two `fonts.googleapis.com` links from `index.html`. Precacheable,
offline-correct, and removes a third-party request. Verify Catalan glyphs render.

**Build + routing**:
- `vite.config.js`: `base: '/pokedex/'` (lowercase — see deviation 1).
- `App.jsx`: `BrowserRouter` → `HashRouter`; `React.lazy` the nine book components; add `/play/*`.
  `/` now redirects to `/play` rather than `/browse`.
- `.github/workflows/deploy.yml` — build + `npm run verify` + deploy to Pages, landed now so Slice 6
  has something to install from.

**Play shell** — new `src/play/` tree, kept clear of the print components:
- Touch hardening: `overscroll-behavior: none`, `touch-action: manipulation`,
  `-webkit-user-select: none`, `-webkit-touch-callout: none`,
  `-webkit-tap-highlight-color: transparent`, `height: 100dvh`, `viewport-fit=cover` +
  `env(safe-area-inset-*)`. Plus `gesturestart` preventDefault for pinch-zoom —
  `user-scalable=no` is ignored by iOS.
- **Motion primitives** from Slice 0, as the shared feedback layer. Each primitive ships both a
  motion path and a reduced-motion path that *substitutes* (instant state change, colour shift)
  rather than removing feedback, per the spec.
- `playColors.js`: wraps `getTypeColors`, resolves the `fairy` gap explicitly.
- **One `onPokemonTap` call site** that all three modes route through. The spec's P2 asks for a
  future name-clip lookup to be a single-site change — this is what makes that true, and it costs
  nothing now.

**No audio module of any kind.** No `AudioContext`, no `speechSynthesis`, nothing in the precache.

**Regression:** `/browse` still renders and prints — its URL becomes `/#/browse`. `CLAUDE.md`'s
Routing section needs updating to match. *(Done — `CLAUDE.md` now documents two apps in one repo,
the play tree, the silent-by-design rule, and the type-colour resolution.)*

## Slice 2 — Home / mode switcher (≈half day)

- Three large tiles (Explore / Story / Game), each a distinct colour + pictogram, no text needed.
- Persistent home affordance in the same corner position inside every mode.
- Tap feedback uses the Slice 1 primitives — with no sound, the tile must visibly react or the tap
  reads as dead.

## Slice 3 — Explore (≈1.5–2 days)

**Type-room index:** 15 tiles from `TYPE_COLORS`, each with colour, pictogram, and a representative
silhouette. The distribution is lopsided (water 28, ice 2) — the grid has to handle both ends
without looking broken.

**Grid:** big cells, vendored front sprites, type-coloured backgrounds.

**Card:** full-bleed hero art, big name **as text only**, type badge(s), and a "what it's like" row
of three pictographic meters — how big (`height`), how heavy (`weight`), how fast (speed stat) — as
icon rows, no numbers, no bars.

**Evolution:** horizontal sprite sequence, tap the next stage to advance with a transition. Filters
`id > 151` and handles Eevee's `branches` shape.

**Acceptance:** all 151 reachable; every card has working art and type badge; evolution taps
advance; nothing plays audio.

## Slice 4 — Game: Who's that Pokémon? (≈1–1.5 days)

- Silhouette via `filter: brightness(0)` on the vendored art. Three options: the answer plus two
  visually distinct distractors (easier is correct for this age).
- **The reveal carries the entire payoff with no sound to help.** Budget the design time here, not
  in the round logic — the logic is trivial and the animation is the feature. Wrong taps celebrate
  too, then reveal the right answer. No score, no streak, no fail state.
- Must be unambiguous muted, and must not rely on timing the child can't perceive.
- Reduced-motion variant still has to signal correctness, not just skip the animation.

## Slice 5 — Story engine + forest story (≈2–2.5 days)

**Engine** — content is data, not components:

```js
{ id: 'forest', scenes: { start: { backdrop: 'forest-path', narration: [...],
    choices: [{ icon: 'left-path', next: 'clearing' }] }, ... } }
```

Terminal scenes are `type: 'encounter'` with a Pokémon pool. Keep narration text in its own field so
a `ca` / `es` / `en` sibling file is a copy-paste later — the spec's P2 multi-language item is cheap
only while the app stays silent, and this is what keeps it cheap.

**Teleprompter typography** — the P0 criterion is an adult reading aloud at arm's length with a
child on their lap. Large type, high contrast, comfortable measure, generous leading, no cramped
blocks. Lora at display size, self-hosted from Slice 1. This is a real layout problem, not a
font-size bump, and it's the part of Story mode most likely to need a device iteration.

**Content:** one forest story in **Catalan**, 4–5 scenes, two branch points, written as real prose
for the parent — jokes and asides included — ending in an encounter. Choices stay fully
pictographic.

**Encounter pools:** invert `CATCH_LOCATIONS` (id → routes) into routes → ids, then map story
locations to route names — forest → Viridian Forest / Route 2. Small pure module.

**Backdrops:** layered CSS gradients + inline SVG in a small backdrop component set — no image
pipeline, no licensing question, on-brand with the type-colour system.

**Parent controls** — answering the spec's new open question: back one scene and restart, in a top
corner, deliberately small. Small targets are the deterrent; a long-press gate would just annoy the
parent, who uses these mid-narration. No confirmation dialogs.

**Acceptance:** playable start to finish by the child tapping picture choices only, parent
narrating, text comfortably readable at arm's length.

## Slice 6 — PWA + device hardening (≈1 day)

- `vite-plugin-pwa` (Workbox): `start_url: '/pokedex/#/play'`, `scope: '/pokedex/'`,
  `display: standalone`; precache build output including `public/pkmn/` and `public/fonts/`. The
  vendored total came in at 4.3MB rather than ~10MB, so nothing should trip
  `maximumFileSizeToCacheInBytes`.
- The iOS standalone meta tags (`apple-mobile-web-app-capable`, status-bar style, title) and
  `viewport-fit=cover` already landed in Slice 1; this slice adds the manifest, icons and service
  worker.
- Icons from the existing `pokeball.svg` via `sharp`: 180×180 apple-touch-icon (iOS reads this, not
  the manifest) plus 192/512 for the manifest.
- Orientation `any`, verified both ways.
- **Full device pass on the deployed URL**: Add to Home Screen, launch, no Safari chrome,
  airplane-mode test, fonts arriving offline, then hand it to the actual users.
- README note on **Guided Access** — the real answer to "child taps out of the app," and a parent
  setup step rather than code.

---

## Verification

No test runner, and Phase 1 doesn't warrant adding one. Three failure classes would break the
experience silently for a pre-reader who can't report a bug, so they get one cheap script —
`scripts/verify-play.js`, wired to `npm run verify` and run in CI before every build:

- every id 1–151 has both a vendored art and sprite file *(live; also checks that every face in
  `fonts.css` exists and that the Google Fonts links haven't crept back into `index.html`)*;
- every story scene's `next` resolves to a real scene, every branch terminates, no narration field
  is empty *(written, inert until the story engine lands in Slice 5)*;
- **nothing under `src/play/` references `speechSynthesis`, `AudioContext`, `new Audio`, or
  `navigator.vibrate`** *(live; `SpeechSynthesisUtterance`, `webkitAudioContext` and `<audio>` are in
  the list too)*. "Silent by design" is a constraint that's easy to violate months later without
  noticing, and it's a two-line assertion.

Everything else is a real-device check on the deployed URL at the end of each slice.

## Sequencing

Slice 1 gates 2–6. Slice 0 informs everything but blocks nothing. Slices 3, 4, and 5 are independent
once 1 and 2 land — Game remains the cheapest path to something the daughters can actually play, and
it now doubles as the real test of whether silent feedback works, so there's a good argument for
taking it before Story.

With 0 and 1 done, **Slice 2 is the only thing gating everything else**, and it's half a day. After
that the order is a judgement call, and Game is the recommended next step for the reason above.

Rough total: **8–10 working days**. Cutting audio didn't buy time; it moved it into motion design,
self-hosted typography, and Catalan authoring.

## Still open (not blocking Phase 1)

- Is a visual-only reveal satisfying? → the spike is live at `/play/motion` and the primitives read
  correctly on the device, but the actual question is unanswered: it needs the daughters, and it gets
  its real test in Slice 4.
- Per-child profiles → only matters once favorites exist (P1).
- Whether to retire the print book → no action; it keeps working.
