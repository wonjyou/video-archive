# Won J. You — Video Archive

Twenty years of pixels in motion. A static portfolio site that catalogs 42 projects as short screen recordings — playable inline, browsable as a slider or a list.

Type and color borrowed from a subset of the Seventy-Seven design system.

## Stack

Plain HTML, CSS, and JavaScript — no build step, no framework, no package manager. GSAP + ScrollTrigger are vendored locally for animation.

- `index.html` — page shell, chrome, slider, list, and modal markup
- `styles/site.css` — single stylesheet (tokens, layout, components)
- `scripts/site.js` — DOM helpers, manifest loader, page-fade reveal
- `scripts/work.js` — filter state, slider/list rendering, modal player, keyboard nav
- `scripts/vendor/` — `gsap.min.js`, `ScrollTrigger.min.js` (also `Draggable`, `InertiaPlugin`)
- `videos.json` — content manifest (site copy + entries)
- `videos/` — source `.mp4` recordings, one or more parts per entry
- `thumbnails/` — ffmpeg-generated posters, named `<entry-id>.jpg`
- `fonts/` — PP Right Grotesk (display) + Neue Haas Grotesk Display/Text
- `assets/` — logo + favicon SVGs

## Content model

Each entry in `videos.json` has:

```json
{
  "id": "alz",
  "title": "Alzheimer's Assn.",
  "kind": "Web",
  "featured": true,
  "description": "Awareness site for the Alzheimer's Association.",
  "parts": [{ "label": "Site", "file": "alz.mp4" }]
}
```

`kind` drives the filter chips: **All / Web / Motion & Concept** (the latter matches everything that isn't `Web`). `parts` lets one project bundle multiple recordings (versions, mobile cuts, intranet variants) — they appear as part links inside the modal.

## Adding a project

1. Drop the `.mp4` into `videos/`.
2. Generate a poster at the same id into `thumbnails/<id>.jpg` (ffmpeg, mid-clip frame).
3. Add the entry to the `entries` array in `videos.json`. Use a unique `id`; set `kind` to `Web`, `Motion`, `Concept`, `Loop`, `Product`, or similar.
4. Reload — no build.

## Running locally

The page fetches `videos.json` so it needs to be served over HTTP, not opened as `file://`.

```bash
python -m http.server 8000
# or
npx serve .
```

Then visit `http://localhost:8000`.

## Views and controls

- **Slider** — center frame plays the current clip; floating thumbs above/below preview prev/next. Click the frame to open the modal.
- **List** — vertical row list with hover-to-play posters.
- **Modal** — full player with part tabs and project navigation.
  - `Esc` close · `←` `→` parts · `[` `]` projects

## Intro

On first paint the tagline halves (`20+ Years` / `In Motion`) sit together at center, then spread apart as the frame fills in. The counter ticks `00 → 20+` and `IN MOTION` slides in from the right. `html, body { overflow-x: hidden }` keeps the off-screen slide from triggering a horizontal scrollbar.

## Notes

- All animations always play — there is no `prefers-reduced-motion` branch.
- Only the bundled fonts are used; no Google Fonts, no additional licensing.
- Videos are muted, looped, `playsinline`, and `preload="auto"` on the active frame; floaters use `preload="none"` until hover.
