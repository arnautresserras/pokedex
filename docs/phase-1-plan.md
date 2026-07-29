# Phase 1 Implementation Plan — Pokédex Interactive

Scope: the P0 set from [interactive-spec.md](interactive-spec.md) — home switcher, Explore, one
Story, "Who's that Pokémon?", PWA installability.

Revised against the silent / parent-narrated / Catalan spec revision.

## Status

| Slice | State |
|---|---|
| 0 · Motion vocabulary spike | **Shipped**, as `/play/motion` — kept in the app rather than thrown away. Its question (is a silent reveal satisfying?) needs the daughters, not a dev. |
| 1 · Foundations | **Done.** Built, deployed to Pages, verified. Three deviations recorded under the slice. |
| 2 · Home / mode switcher | **Done.** Built, deployed to Pages, reviewed on device. Five decisions recorded under the slice. |
| 3 · Explore | **Built.** All three levels land; logic verified against the cache. Awaiting the device pass. Six decisions recorded under the slice. |
| 4 · Game | **Built.** Rounds and both phases verified against the cache. Awaiting the device pass — which is also the answer to Slice 0's open question. Six decisions recorded under the slice. |
| 5 · Story engine + forest story | Unblocked, and now the only Phase 1 feature slice left. Taken *after* 6 — see the note under that slice. |
| 6 · PWA + device hardening | **Built.** Manifest, icons and service worker land; precache verified against the build. Awaiting the device pass, which is the install itself. Five decisions recorded under the slice. |

Nothing about the plan below has changed shape as a result of Slices 1–2 — the risks they name
are still the risks.

## Decisions taken

| Question | Decision |
|---|---|
| Image assets | **Vendor locally.** A fetch script downloads all 151 artwork + sprites into `public/pkmn/`, committed. True offline, precacheable, no third-party requests. |
| Routing / build | **HashRouter, one build.** `base: '/Pokedex/'`, print book lazy-loaded. Real routes, no GitHub Pages 404 trick, fixes the book's deploy too. |
| Explore layout | **Type rooms.** ~15 big colored type tiles → tap one → that type's grid. Answers "less overwhelming" with no unlock/progress model. |
| Story scope | **One polished story + a data-driven engine.** Forest ships complete; stories 2–3 become pure content files in Phase 2. *(Now recorded in the spec.)* |
| Type pictograms | **Vendored, not drawn.** The 15 icons come from `partywhale/pokemon-type-icons` (MIT, a vector recreation of the modern games' set) via a fetch script, replacing Slice 3's hand-drawn glyphs. See the note under Slice 3. |

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

## Slice 2 — Home / mode switcher (≈half day) — **done**

Commit `3d44280`. Deployed and reviewed on the Pages build.

- Three large tiles (Explore / Story / Game), each a distinct colour + pictogram, no text needed.
- Persistent home affordance in the same corner position inside every mode.
- Tap feedback uses the Slice 1 primitives — with no sound, the tile must visibly react or the tap
  reads as dead.

**What landed.** `src/play/modes.js` (the three modes as data), `src/play/components/`
(`ModeScreen`, `HomeButton`, `ModeGlyph`), a rewritten `PlayHome`, and `ModePlaceholder` on three
new routes — `/play/explore`, `/play/story`, `/play/game`.

**Five decisions worth keeping:**

1. **Mode colour is its own palette, not `TYPE_COLORS`.** Blue / violet / amber, deliberately far
   apart and deliberately outside the type palette: a mode tile must never read as a type room,
   which is the very next screen Explore shows. They keep the `primary` / `light` / `accent` shape
   so components still read only `--color-primary` / `--color-light` / `--color-accent`, exactly
   like the print book's cards.
2. **The three modes got placeholder routes.** "Home affordance in the same corner inside every
   mode" isn't buildable — or checkable on the iPad — against three routes that don't render, and a
   tile that goes nowhere is indistinguishable from a broken app to a child. Each route renders the
   real shell with the mode's own pictogram; slices 3–5 replace the body, not the shell.
3. **The corner is structural, not a convention.** `ModeScreen` owns both corners and renders
   `HomeButton` itself, so a mode can't move it, restyle it, or forget it. Its `controls` slot is the
   opposite corner, reserved for Story's small back/restart — which is why those two don't collide.
4. **Pictograms preview the destination instead of symbolising the mode**: six coloured rooms (the
   type-room index in miniature), an open book with a forest on the page, and — for Game — the
   vendored art at `brightness(0)` plus a "?", i.e. the game screen shrunk to an icon. Nothing a
   4-year-old has to be taught. All inline SVG or vendored assets, so there's nothing for a service
   worker to miss.
5. **Home keeps two deliberately small parent links** (motion lab, print book). The Slice 1
   placeholder home was the only route to `/play/motion`, and losing it would have cost the Slice 0
   spike its way onto the device. They use the same small-target deterrent the spec settles on for
   Story's parent controls, tucked under the tiles rather than floating over one, so a stray tap
   lands on a tile and not on a link out of the app.

Catalan labels (`Explora` / `Contes` / `Endevina`) sit under each pictogram — secondary to it, on
the same reasoning the spec gives for showing Pokémon names as text: the parent reads it, the child
learns its shape.

**Still unanswered, and it can't be answered by a dev**: the acceptance criterion is that *a
non-reader reaches all three modes unaided*. The layout, the pictograms and the corner button read
correctly on the device, but whether the pictograms mean the right thing to a 4-year-old is the same
kind of question Slice 0 left open — it needs the daughters. If one tile turns out not to land, it's
a glyph swap in `ModeGlyph`, not a rework.

## Slice 3 — Explore (≈1.5–2 days) — **built, device pass pending**

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

**What landed.** `src/play/typeRooms.js` (the 15 rooms as data — `modes.js`'s sibling),
`src/play/utils/traits.js` and `utils/evolution.js`, three new shared components (`TypeGlyph`,
`PlayTypeBadge`, `BackButton`), and `screens/explore/` — `Explore` (frame + sub-routing),
`TypeRoomIndex`, `TypeRoom`, `PokemonCard`, `TraitMeters`, `EvolutionStrip`. `PlayApp` grew a
`MODE_SCREENS` map, so slices 4 and 5 are one entry each rather than an edit to the route loop.

**Six decisions worth keeping:**

1. **The meters are ranked, not scaled.** Gen I weight runs 1hg (Gastly) to 4600hg (Snorlax), and on
   a linear scale ~140 of the 151 land in the bottom fifth — every Pokémon a child taps would show
   one pip and the row would carry no information at all. Ranking each value against all 151 gives
   five equal groups (verified: 31/30/30/30/30 on weight), so the pips actually move between one
   Pokémon and the next. Which is the whole point of a meter a pre-reader can't read a number off.
2. **`:type` in a card's URL is the room you came from, not the Pokémon's type.** Evolution can walk
   you from Eevee's Normal room to Vaporeon, and back has to return where the child started rather
   than to a Water room they never opened. The card takes its *colour* from the Pokémon's own type
   regardless — that beige-to-blue change is most of what makes an evolution feel like an event.
3. **Evolution advances `replace` the history entry.** Caterpie → Metapod → Butterfree would
   otherwise bury the room three steps down, and back is a child's escape hatch: it has to mean "out
   of this card", not "one evolution ago".
4. **Back is a second corner button, not a contextual home button.** `HomeButton` is documented as
   the one fixed point in the app and must never mean two things, so Explore's three levels needed a
   step-back of their own. It goes in `ModeScreen`'s `controls` slot at full tap-target size — the
   slot is generic; Story's *choice* to put small controls there is Story's. It navigates to an
   explicit parent path rather than `navigate(-1)`, which on a deep-linked card would walk out of
   the app entirely.
5. **Room tiles are fixed-width cells centred, not `1fr` columns.** Verí has 33 members and
   Fantasma has 3; stretchy columns would blow the three ghosts up to a third of the screen each,
   which reads as a broken screen rather than a small room. This is the plan's "handle both ends"
   line, and fixed cells are the whole answer: a small room is simply a short one.
6. **Glyphs are sized by a wrapper, never by overriding the SVG's class.** CSS Module ordering
   across files isn't guaranteed, so a consumer's `.glyph { width: … }` racing the base
   `.glyph { width: 100% }` is a coin flip that would have shown up as one wrong-sized icon on the
   iPad and nowhere else. Now recorded in `CLAUDE.md` as the contract.

**Verified against the cache, not just the build**: all 151 reachable across the 15 rooms with no
orphans, every room's representative face is a member of its own room, Pichu and Munchlax filtered
out of their chains, Eevee's three branches resolved, Ditto and Snorlax correctly showing no chain,
`steel`/`fairy` dropped on Magnemite and Mr Mime, and every route rendering without throwing.

**Changed after the fact — the glyphs are now vendored, not drawn.** `TypeGlyph`'s 15 hand-drawn
shapes were replaced with the modern games' type icons, via `scripts/fetch-type-icons.js` →
generated `src/play/typeIcons.js` (source: `partywhale/pokemon-type-icons`, MIT, licence vendored
alongside). Three things worth keeping about the swap:

1. **The reason is recognition transfer, not looks.** "Draw the thing, not the concept" was the
   right rule with nothing better available, but these are the shapes the child meets again on a
   card, a sticker or a screenshot, so what they learn here doesn't stop at the app. The cost is
   that a few are *less* literal than what they replaced — Normal is a ring, Psíquic a swirl — so
   the guessable ones became learnable ones. Colour and the watermark silhouette still carry the
   tile, which is what makes that affordable.
2. **The disc is dropped and the crop is computed.** Upstream ships circular badges; keeping the
   disc would put the icon set's own slightly-different green on top of a screen already painted
   in `TYPE_COLORS`. Dropping it leaves the symbols filling only 53–67% of the 256 box, so the
   script measures all 15 and emits one shared `viewBox` (the union, `42 42 172 172`) — shared
   rather than per-icon because the set was drawn with deliberate relative sizes, and normalising
   each glyph to its own box would throw that away. Computed rather than hardcoded so an upstream
   redraw can't silently clip anything.
3. **`--glyph-cut` is gone.** Upstream draws a few detail shapes (ghost eyes, a water wave,
   Normal's inner ring) in a shade of the disc, i.e. as holes. The old mechanism filled them with a
   flat surface colour, which was close enough for two small eyes but is visibly wrong for
   Normal's hole across a gradient tile. They're now cut with an SVG mask, so a hole shows whatever
   is actually behind it and there's no colour to get wrong. The mask region is pinned to the
   viewBox in user space — the defaulted `objectBoundingBox` region is the one genuinely
   renderer-dependent corner of SVG masking.

**Still unanswered, same class as slices 0 and 2**: whether the 15 type pictograms mean anything to
a pre-reader. Fifteen is a lot more glyphs to get wrong than three, and the fallback is the same —
the colour and the watermark silhouette carry the tile even if the pictogram misses. A miss is now a
different kind of fix, though: the shapes are vendored, so it's a wrapper-size or contrast change
rather than a redraw. Also untested on device: whether a child scrolls the Verí
room unprompted, which is the one place in the app that scrolls.

## Slice 4 — Game: Who's that Pokémon? (≈1–1.5 days) — **built, device pass pending**

- Silhouette via `filter: brightness(0)` on the vendored art. Three options: the answer plus two
  visually distinct distractors (easier is correct for this age).
- **The reveal carries the entire payoff with no sound to help.** Budget the design time here, not
  in the round logic — the logic is trivial and the animation is the feature. Wrong taps celebrate
  too, then reveal the right answer. No score, no streak, no fail state.
- Must be unambiguous muted, and must not rely on timing the child can't perceive.
- Reduced-motion variant still has to signal correctness, not just skip the animation.

**What landed.** `src/play/utils/rounds.js` (the round as data) and `screens/game/` — `Game` (frame
plus the round state), `SilhouetteStage` (the question and the reveal), `AnswerOptions` (the three
answers). One `MODE_SCREENS` entry, exactly as Slice 3 left it. No new shared component: the mode is
built entirely out of `ModeScreen`, `Tappable` and `Celebrate`.

**Six decisions worth keeping:**

1. **The answers are pictures, and they come from the same file as the silhouette.** A list of names
   isn't an option for a non-reader — literally — so the round is a shape match: one black
   silhouette above, three full-colour arts below. All four are `artUrl(id)`, the same 512px
   artwork, so the pose the child is matching is the pose they're looking at. The front sprites were
   the obvious cheaper choice and are wrong here: a sprite is a *different pose* of the same
   Pokémon, which quietly turns an easy match into a trick question.
2. **"Visually distinct" is inferred from three cache fields, and it's load-bearing.** If two
   options share a silhouette the round has no answer a child could defend. There's no image
   analysis available, so distinctness comes from family (Caterpie and Metapod are the same drawing
   twice), primary type (the colour it's painted in) and the ranked height band from `traits.js`
   (tall vs squat). All three are required, with a ladder that relaxes height, then type, if no
   candidate qualifies — family never relaxes, because it's the only one whose failure is genuinely
   ambiguous. In 20,000 rounds against the real cache the ladder never had to relax at all.
3. **Mode colour is the UI, type colour is the Pokémon.** The options row and the "this is the one"
   ring stay amber in every round, so the correct-answer mark means the same thing every time. The
   *stage* switches to the Pokémon's own type colour on reveal — the same beige-to-blue trick that
   makes an evolution feel like an event in Explore. Which is also why the type colour is injected
   only *after* the tap: while asking, a type-coloured light pool behind the silhouette would
   quietly announce the answer.
4. **The reveal fires four signals, and only one of them is animation.** Colour filling the shape,
   `Celebrate`'s pop and sparks, the light pool changing colour, and the `?` becoming the name.
   That's what makes the `prefers-reduced-motion` path honest rather than a downgrade: three of the
   four are instant state changes and survive intact. The correct-answer mark is deliberately a
   *static* ring plus tick for the same reason — a round's outcome must never be carried by motion
   alone, and the plan asks for a reduced-motion variant that still signals correctness.
5. **A wrong tap dims, and nothing more.** No red, no cross, no shake. The tapped cell steps back
   with a thin neutral outline (so the child can see what they chose) while the answer lights up,
   and the celebration on the stage fires either way. Honest about which shape was right — the point
   of the game — with nothing a 4-year-old reads as failure.
6. **A round is state, not a route.** Explore's levels are real routes because a card is worth
   linking to; a random round isn't, and a URL for one would either be a lie or would have to seed
   the randomness. So `/play/game` is the whole mode and anything deeper redirects to it. `picked`
   doubles as the phase — `null` asks, an id reveals — so the two halves of the screen can't
   disagree about which state they're in.

Nothing auto-advances, per the plan's "must not rely on timing the child can't perceive": the reveal
holds until it's tapped past, and both the arrow *and* the revealed art advance, because a child
handed a Pokémon that just burst into colour taps the Pokémon. Recent answers are barred from
recurring (12 deep) — random with replacement repeats often enough over 151 that a repeat right
after a reveal reads as a broken app rather than as chance.

**Verified against the cache, not just the build**: 20,000 rounds with no duplicate option, no
missing answer, no same-family pair, and the strict distinctness tier never relaxing; all 151
appearing both as answers and as distractors; the answer landing in each of the three slots equally
often (6606 / 6747 / 6647); the recent list never leaking. Then both phases server-rendered for all
151 — the reveal always shows its own name and its own art, and exactly one tick appears, on the
answer, whether the pick was right or wrong.

**Not added to `npm run verify`.** The round invariants are the natural fourth entry there, but
`verify-play.js` runs under plain Node and the play utils use extensionless imports that only Vite
resolves — wiring it up means either a loader shim in the script or changing the import style across
`src/play/utils/`, and neither is worth it for logic with no content to drift. The exercise above is
recorded here instead.

**Still unanswered, and this is the big one**: whether a silent reveal actually satisfies a
4-year-old. Slices 0, 2 and 3 each left a question only the daughters can answer; this is the one
the spike was built for, and Game mode is where it gets its real test. If the verdict is lukewarm,
the fix is `SilhouetteStage` and `Celebrate` — not the round logic, and not the layout.

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

## Slice 6 — PWA + device hardening (≈1 day) — **built, device pass pending**

**Taken before Slice 5**, against the sequencing note's own suggestion. The reasoning: every open
question left by slices 0, 2, 3 and 4 ends in "needs the daughters", and this slice's last step is
handing them the app — so it's the one that unblocks four pending answers rather than adding a fifth
feature. It also front-loads the slice with the slow feedback loop (manifest and standalone
behaviour only verify on a deployed HTTPS build), and Slice 5 adds no new precached assets —
backdrops are gradients and inline SVG, Lora already ships — so nothing here gets invalidated by
taking Story second. The cost is that the installed app has one dead tile until 5 lands; accepted
rather than papered over, since a parent is present.

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

**What landed.** `vite-plugin-pwa` wired into `vite.config.js`, `scripts/make-icons.js` →
`public/icons/` (four PNGs, 33KB, committed), an `apple-touch-icon` link and a corrected
`theme-color` in `index.html`, a fourth check in `verify-play.js`, and a `README.md` — the repo
didn't have one, and the Guided Access note needed somewhere a parent would actually look.

**Five decisions worth keeping:**

1. **Updates wait for a cold launch — `registerType: 'prompt'` with no prompt.** `autoUpdate`
   reloads the page the moment a new service worker takes over, and a mid-round reload doesn't read
   as an update to a 4-year-old, it reads as the app breaking. The usual alternative is an "update
   available" button, which is unavailable on principle: this app has no readable text. So
   `skipWaiting` stays off and a new version activates the next time the app is opened cold — which
   for a home-screen app is exactly the natural moment. `clientsClaim: true` is still set, so the
   *first* visit is controlled immediately and "open the page, add to home screen, go offline" works
   without a refresh nobody would think to do. The only `skipWaiting()` in the emitted worker sits
   behind a `SKIP_WAITING` message that nothing sends — verified in `dist/sw.js`, because this is
   the kind of default that's easy to inherit by accident.
2. **`base` is the single source of truth for the manifest.** `scope`, `start_url` and all three
   icon `src`s are built from one `BASE` constant. Slice 1's deviation 1 was a casing mistake in
   exactly this value, and its failure mode here is worse than a 404: a wrong `scope` gives a
   home-screen launch that opens *in Safari with chrome*, which looks like a broken install rather
   than a config typo. Construction rather than a verify check, because a `verify` assertion would
   have to re-parse the config to know what it should say.
3. **No `runtimeCaching`, deliberately.** Every play asset is vendored and precached, so a runtime
   cache could only ever catch a *remote* request — and in play code a remote request is the bug the
   vendoring rule exists to prevent. The print book's 151 remote hero arts are the other side of it:
   they'd quietly fill a child's offline cache with the one part of the app that isn't for her. The
   absence is the design, so it's commented in place.
4. **Icons are flattened, and there are two 512s.** `pokeball.svg` is a circle in a square box, so
   its corners are transparent — and iOS composites a transparent icon onto black, which erases the
   ball's own `#16161a` outline and makes it look bitten. Every icon is therefore flattened onto
   `--play-bg`, the same colour as `background_color` and the corrected `theme-color`, so the tile,
   the launch screen and the app's first painted pixel are one continuous dark instead of three
   different ones. The second 512 is the maskable variant: Android keeps only the central 80%, so it
   draws the ball at 60% rather than 82%. Not a `purpose` flag on the same file — a different crop.
5. **`verify` gained a fourth failure class: the missing icon.** `public/icons/` is generated output
   exactly like `public/pkmn/`, and it fails the same silent way — the build succeeds, the manifest
   points at a 404, and iOS falls back to a screenshot of a dark screen. The `apple-touch-icon`
   `<link>` gets its own assertion, because iOS ignores the manifest's `icons` array entirely: losing
   that one line breaks the tile while leaving the manifest looking perfectly correct.

**Verified against the build, not just the config**: 350 precache entries / 4.05MB — 302 `pkmn`
images, 16 fonts, 4 icons, 24 JS/CSS chunks, plus `index.html`, `registerSW.js`, `pokeball.svg` and
the manifest. Precache URLs are worker-relative rather than root-relative, so the `/pokedex/` base
resolves through the worker's own scope and can't drift from `base`. `navigateFallback` is
`index.html` (offline `/pokedex/` still boots). `clientsClaim()` present, `skipWaiting()` only
behind the unsent message. `npm run preview` serves the manifest as `application/manifest+json` and
every PWA path 200s. `npm run dev` injects neither the manifest link nor the registration, so no
stale worker can ever confuse a dev session.

**Not done here, and it can't be**: the device pass itself — Add to Home Screen, launch with no
Safari chrome, both orientations, airplane mode, fonts arriving offline. That's the whole point of
taking this slice now, and it's the step that also finally asks slices 0/2/3/4's open questions of
the actual users.

---

## Verification

No test runner, and Phase 1 doesn't warrant adding one. Four failure classes would break the
experience silently for a pre-reader who can't report a bug, so they get one cheap script —
`scripts/verify-play.js`, wired to `npm run verify` and run in CI before every build:

- every id 1–151 has both a vendored art and sprite file *(live; also checks that every face in
  `fonts.css` exists and that the Google Fonts links haven't crept back into `index.html`)*;
- every story scene's `next` resolves to a real scene, every branch terminates, no narration field
  is empty *(written, inert until the story engine lands in Slice 5)*;
- **nothing under `src/play/` references `speechSynthesis`, `AudioContext`, `new Audio`, or
  `navigator.vibrate`** *(live; `SpeechSynthesisUtterance`, `webkitAudioContext` and `<audio>` are in
  the list too)*. "Silent by design" is a constraint that's easy to violate months later without
  noticing, and it's a two-line assertion;
- all four `public/icons/` files exist and `index.html` still carries its `apple-touch-icon` link
  *(live, added in Slice 6)*. Same class as the first check — generated output that goes missing
  without failing the build, leaving iOS to use a screenshot of a dark screen as the app's icon.

Everything else is a real-device check on the deployed URL at the end of each slice.

## Sequencing

Slice 1 gates 2–6. Slice 0 informs everything but blocks nothing. Slices 3, 4, and 5 are independent
once 1 and 2 land — Game remains the cheapest path to something the daughters can actually play, and
it now doubles as the real test of whether silent feedback works, so there's a good argument for
taking it before Story.

With 0–4 done, **only 5 and 6 are left and neither gates the other**. Story fills in the last
placeholder shell; PWA hardening is already worth doing, because Explore and Game together are
enough to install. Story is the bigger of the two and the one with authoring in it, so taking 6
first is a defensible way to get something on the home screen sooner — but 5 is what makes Phase 1
complete.

**6 was taken first**, on that argument plus a stronger one: it's the slice that ends in handing the
app to the daughters, and four earlier slices are each waiting on exactly that. Reasoning recorded
under Slice 6. Slice 5 is next and is all that's left of Phase 1.

Rough total: **8–10 working days**. Cutting audio didn't buy time; it moved it into motion design,
self-hosted typography, and Catalan authoring.

## Still open (not blocking Phase 1)

- Is a visual-only reveal satisfying? → the primitives read correctly on the device at
  `/play/motion`, and Slice 4 has now built the screen the question was really about. Still
  unanswered, because it needs the daughters. `/play/game` is where it gets asked properly.
- Do the three mode pictograms mean the right thing to a non-reader? → the switcher is live at
  `/play` and reads correctly on the device; same class of question as above, and the fix is a glyph
  swap in `ModeGlyph` if one of them misses.
- Do the fifteen *type* pictograms? → same question, five times the surface, and now asked of the
  games' own icons rather than of ours (see Slice 3). Colour and the watermark silhouette carry a
  tile even where the glyph misses, so a miss costs a sizing or contrast change, not a rework.
- Does a child scroll a big type room unprompted? → the Verí room (33 members) is the only scrolling
  surface in the app. If not, the fallback is paging rather than scrolling, which is a change to one
  component.
- Per-child profiles → only matters once favorites exist (P1).
- Whether to retire the print book → no action; it keeps working.
