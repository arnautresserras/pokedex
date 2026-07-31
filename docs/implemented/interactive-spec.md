# Spec: Pokédex Interactive Experience (Print → Digital Pivot)

## Context

The original project built a print-ready A4 book of all 151 Gen I Pokémon (React 18 + Vite,
CSS Modules, PokéAPI data cached in `src/data/pokemon-cache.json`). The book is finished and the
owner is happy with it, but local print-shop full-bleed A4 printing is impractical (~€70,
no full-bleed support). This spec pivots the same codebase and data toward an interactive
iPad-browser experience for the owner's daughters (under 6), replacing "print it" with
"open it on the iPad."

## Problem Statement

The finished print book can't be produced affordably at a local print shop, and a printed book
also can't do the things that would make it engaging for a pre-reader: animation, choice, and play.
The owner wants a safe, self-contained digital experience — no ads, no accounts, no external links —
that lets their under-6 daughters explore the same 151 Gen I Pokémon their parent already curated,
without needing to read.

## Goals

- Daughters can independently open and navigate the **solo modes** (Explore, Game) on an iPad with
  no reading required (icon/colour-driven navigation, not text-driven)
- Story mode works as a **shared, parent-narrated experience** — good enough that the parent enjoys
  reading it aloud, not just tolerable
- The app is **silent by design** — a purely visual and tactile experience, with the parent
  supplying all voice
- 100% reuse of existing data layer (`pokemon-cache.json`, `usePokemon` hook, `typeColors.js`,
  `typeChart.js`) — no re-fetching or re-modeling Pokémon data
- The experience is fully self-contained **and works offline**: no ads, no external links, no
  in-app purchases, and no runtime network calls at all — hero art, sprites, and fonts are vendored
  into the repo rather than hotlinked from third parties
- Three distinct modes ship in v1: Explore, Story, and a simple Game mode
- Runs well in Safari on iPad in full-screen (PWA "Add to Home Screen"), so there's no browser
  chrome for a toddler to tap into

## Non-Goals

- **No audio of any kind.** No speech synthesis, no recorded narration, no name clips, no sound
  effects, no music. The parent reads the stories aloud and teaches the names in person. This
  removes an entire asset pipeline, the iOS audio-unlock dance, and the Web Speech API's iPad
  problems (see Technical Notes for why that door is closed). Revisit only if the visual-only
  version proves to want it.
- **Not a print artifact anymore** — the print/PDF book code path can be left as-is (or later
  removed), but this spec does not extend or fix print CSS
- **No user accounts, cloud sync, or multi-device progress** — this is a single-device, local,
  offline-friendly experience, not a service
- **No native app / App Store submission** — browser-based PWA only, at least for v1
- **No procedurally generated story branches** — Story mode content is hand-authored, not
  dynamically generated, to keep content safe and predictable
- **No monetization, analytics, or tracking** — this is a private family project

## Target Users

- **Primary**: two daughters, under 6, non/early readers, using an iPad
- **Secondary**: the parent, who sets it up, plays alongside them, narrates Story mode, and may
  extend content later

**Language**: the children speak **Catalan**, not English. All narration and any child-facing
copy is Catalan. Pokémon names stay as-is (Gen I names are the same in Catalan/Spanish as English).

## Usage model — two different design targets

The three modes are **not** designed to the same criteria, and conflating them leads to the wrong
decisions about text:

| | **Explore + Game** | **Story** |
|---|---|---|
| Played | Solo, unsupervised | Together, on the parent's lap |
| Reading | None required | Parent reads aloud; child never reads |
| Text sizing | Avoid text entirely | Sized for an **adult at arm's length** |
| Feedback | Visual + motion only (silent) | Parent's voice |
| Child's input | All navigation | Choice taps only |

This is a deliberate scoping decision, not a limitation. The parent has no intention of handing
over the iPad for hours unattended; Story mode is explicitly the shared-experience mode, and names
are taught in person rather than by the app.

## User Stories

- As a pre-reading child, I want to tap a Pokémon and see it big, so I can explore without needing
  to read anything.
- As a pre-reading child, I want to pick a path in a story ("go left / go right") using pictures,
  so I can feel like I'm making choices in an adventure while my parent reads it to me.
- As a pre-reading child, I want to play a simple guessing game with familiar characters, so
  there's a sense of play and replayability, not just browsing.
- As a pre-reading child, I want the screen to react visibly when I touch it, so I can tell my taps
  are working without needing sound.
- As a narrating parent, I want story text laid out so I can read it aloud at a glance without
  hunching over the screen, so I can perform it rather than decipher it.
- As a narrating parent, I want the story written for *my* reading level, not simplified for a
  pre-reader, so it's actually enjoyable to read the same story repeatedly.
- As a parent, I want the whole thing to open full-screen with one tap from the home screen icon,
  so my daughters can start it themselves without navigating a browser.
- As a parent, I want no external links or ads anywhere in the experience, so I don't have to
  supervise every session.
- As a parent, I want the app to make no noise, so it's usable in a quiet room and doesn't compete
  with me talking to my daughter.
- As a parent, I want the mode-switcher (Explore/Story/Game) to be icon-based and always
  accessible, so my daughters can move between modes on their own.

## Requirements

### Must-Have (P0)

**Home / mode switcher**
- Large icon-based home screen: three big tappable icons (Explore / Story / Game), no text
  required to understand them
- Acceptance: a non-reader can identify and reach all three modes from the home screen without help

**Explore mode**
- All 151 Pokémon, organised into **type rooms**: an index of ~15 large colour tiles (one per Gen I
  type, reusing `typeColors.js`), each opening a grid of that type's Pokémon. Chosen over a single
  151-cell grid (a dense wall for a 4-year-old) and over progressive unlock (needs a progress model
  and a parent reset — deferred to P1). "Pick a colour" is very learnable for a pre-reader.
- Tapping a Pokémon opens a simplified full-screen card: large hero art, name, type badge(s), and a
  simple "what it's like" visual (no stat bars, no dense vitals list)
- The name is shown as **text only** — displayed, never spoken. It exists for the parent to read to
  the child, and as something the child will eventually learn to recognise by shape.
- Evolution shown as a simple tappable sequence of sprites (tap next stage to "evolve" with a
  transition animation), not the print chain diagram
- Acceptance: tapping any of the 151 grid entries opens a card with working art and type badge;
  tapping an evolution sprite advances to the next stage's card; no audio is played anywhere

**Story mode** — parent-narrated

- At least 3 short hand-authored branching stories (e.g., forest / cave / beach), each 3-5 scenes.
  *(Superseded for Phase 1: one polished story + a data-driven engine — see the phase plan.)*
- Each scene: one illustration/backdrop, narration text, and a 2-button picture choice (e.g., two
  path icons) where relevant
- **The parent reads the text aloud in Catalan.** No synthesis, no recordings, no timing.
- Because the reader is an adult, the earlier "1–2 short simple sentences" limit **no longer
  applies**. Write real Catalan prose: longer lines, jokes, wordplay, asides pitched at the parent
  as much as the child. It should be enjoyable to read for the twentieth time.
- Narration text must be legible **for an adult holding the iPad at arm's length with a child on
  their lap** — generous type size, high contrast, comfortable line length, no cramped blocks. Treat
  it as a teleprompter, not body copy.
- The parent may skip, improvise, or paraphrase lines; nothing in the UI should depend on a line
  having been "read" or on any narration timing
- **Parent controls**: back-one-scene and restart, anchored in a top corner and deliberately small
  — small targets are the deterrent against stray child taps. No confirmation dialogs and no
  long-press gate; the parent uses these mid-narration and anything slower is friction.
- Choices remain **fully pictographic** — the child taps them, so they must be understandable
  without reading
- Each story ends in a "wild Pokémon encounter" scene pulling one Pokémon from the cache
- Acceptance: a full story can be played start to finish by the child tapping only picture choices,
  with the parent narrating; the narration text is comfortably readable at arm's length

**Game mode**
- "Who's that Pokémon?" silhouette guess: show a silhouette (CSS filter on existing sprite), offer
  2-3 tappable answer options, no penalty or score pressure
- Reveal and feedback are **entirely visual** — a pop/scale animation, colour, and motion. Since
  there's no sound to carry it, the animation has to do all the celebratory work; budget design
  attention accordingly.
- Acceptance: a round can be completed via tap-only, with clear positive visual feedback regardless
  of correctness (no "fail" state that could be discouraging for a young child), and the outcome is
  unambiguous with the device muted

**Platform / safety**
- No outbound links, ads, or third-party embeds anywhere in the UI
- Installable as a PWA (manifest + icons) so it can be added to the iPad home screen and opened
  full-screen
- Hosted on GitHub Pages from this repository, alongside the existing print/book build — with hash
  routing the play app lives at `https://<user>.github.io/<repo>/#/play`, which is also the PWA
  `start_url`
- Works fully offline once installed — art, sprites, and fonts all precached
- Acceptance: "Add to Home Screen" from the deployed GitHub Pages URL launches with no Safari chrome
  visible, and the app remains fully usable in airplane mode. (Verification has to happen against
  the deployed HTTPS URL — a LAN dev server can't register a service worker; see Technical Notes.)

### Nice-to-Have (P1)

- Memory-match mini-game using type badges/colors
- A "favorites" shelf in Explore mode (locally stored, no accounts) so a child can bookmark
  Pokémon they like
- More than 3 story paths; a simple "story picker" screen with picture thumbnails

### Future Considerations (P2)

- Parent-authored custom stories (a simple JSON/markdown format a parent could write new stories
  in without touching code)
- Additional game modes (memory pairs, simple type-matchup quiz for when they're a bit older)
- Multi-language support (Spanish / English) — story text as parallel content files. Cheap while the
  app stays silent; adding audio later would make this considerably more expensive, which is an
  argument for staying silent.
- Audio, if the silent version turns out to want it — most likely recorded name clips in the
  parent's voice rather than synthesis. Keep tap handlers and the card component structured so a
  clip lookup could be added at one call site.
- Native app wrapper if browser-based experience proves limiting

## Technical Notes (for implementation)

- **Reused as-is**: `src/data/pokemon-cache.json`, `src/hooks/usePokemon.js`,
  `src/utils/typeColors.js`, `src/utils/typeChart.js`, `src/utils/formatters.js`
- **Replaced**: all CSS Modules built for `mm`-unit print pages get new touch-first, viewport-unit
  layouts; large tap targets (44px+ minimum, bigger for this age group); no `overflow: hidden`
  page-shell pattern needed since there's no print constraint
- **Routing — decided**: real routes under `/play/*`, served by **`HashRouter`** rather than
  `BrowserRouter`. This keeps routes debuggable (jump straight to a mode during development) while
  needing no GitHub Pages 404-redirect trick, and it fixes the deploy for the existing print routes
  at the same time. Chosen over keeping all navigation in client-side state. One build, with the
  print book lazy-loaded so the kids' bundle stays small.
- **Assets are vendored, not hotlinked**: a fetch script pulls all 151 hero images and front sprites
  into `public/`, committed alongside `pokemon-cache.json` in the same spirit. Hotlinking
  `assets.pokemon.com` and `raw.githubusercontent.com` would leave the app a grid of broken images
  on spotty wifi, and neither is a CDN meant to serve 151 images a session. This is what makes the
  offline goal and service-worker precaching real.
- **Fonts must be self-hosted.** `index.html` currently loads Barlow Condensed, Lora, and Space Mono
  from the Google Fonts CDN. That was cosmetic for a locally-rendered print book; it isn't here — an
  offline PWA silently falls back to system fonts, and "narration legible at arm's length" is a P0
  acceptance criterion that depends on the typeface actually arriving. It's also a third-party
  request the self-contained goal rules out. Catalan's `·`, `ç`, and accented vowels are all in the
  standard latin subset, so no extra subsetting is needed.
- **Type-colour data gap**: five Pokémon carry the modern `fairy` type — Clefairy, Clefable,
  Jigglypuff, Wigglytuff, Mr Mime — which is absent from both `TYPE_COLORS` and the Gen I chart, so
  `getTypeColors('fairy')` silently falls back to grey. The print book hides this; type rooms will
  not. Needs an explicit resolution rather than a silent fallback.
- **No audio subsystem at all.** No `useSpeech()` hook, no `AudioContext`, no first-gesture unlock,
  no mute toggle, no pronunciation override map, no audio assets in the precache. Nothing in the app
  should require the device to be unmuted.
- **Why speech synthesis stays closed as an option**, recorded here so it isn't relitigated:
  on iPad, `getVoices()` does not expose the full set of system voices (reports of it returning only
  the legacy Eloquence group while Settings showed better ones, browser-independently); there are
  unresolved reports of iOS Safari ignoring `utterance.lang` and reading non-English text with
  English pronunciation while working correctly in desktop Safari, which is fatal for Catalan;
  enhanced voices downloaded via Accessibility → Spoken Content can stop working after an iPadOS
  update while still appearing in the voice list, with no way for code to detect it; and every good
  Catalan TTS available is cloud SaaS, violating the offline / no-third-party constraint.
- **"Tactile" means motion, not haptics.** The Vibration API (`navigator.vibrate`) is not available
  in Safari, so there is no haptic feedback on the web on iPad. Every touch response has to be
  carried by animation, scale, colour, and shadow. With no sound either, this is the app's *only*
  feedback channel — it deserves more design attention than it would in a noisy app. Keep tap
  responses immediate (sub-100ms visual acknowledgement) so nothing feels dead.
- **`prefers-reduced-motion`** needs care: motion is the sole feedback channel, so the reduced-motion
  path must substitute something (instant state change, colour shift) rather than removing feedback.
- **Story content authoring**: plain JS/JSON data files, similar in spirit to `catchLocations.js`,
  so stories are data, not hardcoded components
- **Existing print/book code**: left untouched and unremoved unless/until the owner decides to
  retire it
- **GitHub Pages hosting**: Vite's `base` config needs to match the repo name (e.g.
  `base: '/repo-name/'`) so assets resolve correctly under a project-pages subpath; the manifest's
  `start_url`/`scope` need the same subpath for PWA install to work correctly
- **Deep-link routing on Pages** — resolved by the `HashRouter` decision above. GitHub Pages serves
  static files with no SSR/rewrite support (per the existing "No SSR — static SPA" constraint), and
  hash routing sidesteps that entirely: no 404.html redirect trick, no server config.
- **Service workers require a secure context**, so an iPad pointed at a LAN dev server
  (`http://192.168.x.x:5173`) cannot register one. The PWA half of P0 is therefore only verifiable
  against the deployed HTTPS URL — which is why Pages deployment lands early in the build order
  rather than last.

## Open Questions

- With no sound to signal a correct answer in Game mode, is a visual-only reveal satisfying enough
  for a 4-year-old? (parent — worth a real-device check early, it's the one place silence costs
  something)
- Should "favorites" or any local storage be per-child (two profiles) or shared? (parent)

### Resolved

- ~~Is Web Speech API voice quality acceptable, or is pre-recorded audio worth the effort?~~
  **Neither — the app is silent.** The parent narrates and teaches names in person.
- ~~Should Explore expose all 151 at once, or unlock progressively?~~ **Neither — type rooms.**
  See Explore mode.
- ~~Single-page app with internal state vs. real routes?~~ **Real routes via `HashRouter`.**
  See Technical Notes.
- ~~Does Story mode need a parent-only affordance the child shouldn't trigger?~~ **Yes — small
  back/restart controls in a top corner.** See Story mode.

## Timeline / Phasing

- **Phase 1 (this spec, P0 only)**: Home switcher + Explore mode + one working Story + "Who's that
  Pokémon?" game + PWA installability. This is the smallest version that's actually usable and fun.
- **Phase 2**: Remaining P1 items (memory game, favorites, more stories)
- **Phase 3**: P2 items, only if Phase 1 gets real play time from the daughters