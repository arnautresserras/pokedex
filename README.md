# Pokédex

Two apps in one repo, sharing one data layer of all 151 Gen I Pokémon
(`src/data/pokemon-cache.json`, pre-fetched from PokéAPI and committed).

- **The print book** (`src/components/`) — a print-ready A4 book, one page per Pokémon plus front
  matter, an index grid and appendices. Exported through the browser's print dialog → Save as PDF.
  Finished; left working, not extended.
- **The play app** (`src/play/`) — an offline iPad PWA for two children under six. Three modes
  (Explore, Story, Game), **silent by design**, navigable without reading. This is where new work
  happens.

Live at **https://arnautresserras.github.io/pokedex/** — the play app is the landing page; the book
is at `#/browse`.

Design docs: [docs/interactive-spec.md](docs/interactive-spec.md),
[docs/phase-1-plan.md](docs/phase-1-plan.md). Working notes for contributors and agents:
[CLAUDE.md](CLAUDE.md).

## Commands

```bash
npm install
npm run dev          # dev server at http://localhost:5173/pokedex/
npm run build         # production build → dist/ (also emits the manifest and service worker)
npm run preview       # serve the build locally — the only way to exercise the service worker
npm run verify        # vendored assets, fonts, icons, "silent by design", story links
```

The asset and data pipelines are committed output. Re-run them only if the files are missing —
see [CLAUDE.md](CLAUDE.md) for the scripts and the order they run in.

`npm run dev` never registers a service worker. Anything PWA — install, offline, the icon, the
launch screen — has to be checked against `npm run preview` or the deployed HTTPS URL, because a
service worker requires a secure context and an iPad on `http://192.168.x.x:5173` isn't one.

## Installing it on the iPad

1. Open **https://arnautresserras.github.io/pokedex/** in **Safari** (not Chrome — on iOS only
   Safari can install to the home screen).
2. Wait a few seconds on the first visit. The service worker downloads ~4MB of artwork, sprites and
   fonts in the background; until it finishes, offline won't work.
3. Share → **Add to Home Screen** → Add.
4. Launch from the home-screen icon. It should open with no Safari chrome, no address bar, and land
   straight on the three coloured tiles.
5. To check offline: put the iPad in airplane mode and launch it again. Everything should work —
   all 151 Pokémon, all three modes, correct fonts. The only thing that needs the network is the
   print book at `#/browse`, whose page artwork is deliberately remote.

Updates install themselves in the background and take effect the next time the app is opened cold,
so a new version can never interrupt a round mid-tap.

## Guided Access — the answer to "the child tapped out of the app"

The app has no way to stop a stray tap from leaving it, and shouldn't try: a web page can't lock
down iOS, and a homemade lock screen would be one more thing a four-year-old has to learn. iOS
already has the real feature.

**Settings → Accessibility → Guided Access → on.** Set a passcode. Then, with the Pokédex open,
triple-click the top button (or Home button) to start a session. The iPad is now locked to this one
app: the home gesture, notifications and app switching are all disabled until you triple-click again
and enter the passcode.

Two options inside Guided Access worth knowing:

- **Time Limits** — ends the session automatically, which is a screen-time limit that needs no
  negotiating with a child.
- **Touch off** in the session's Options — freezes the screen entirely, if you're handing over an
  iPad you'd rather they only look at.

This is a parent setup step, not something the code does. It's the difference between an app that's
safe to hand over and one that needs supervising.
