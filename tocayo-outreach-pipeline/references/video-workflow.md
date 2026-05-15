# Video Workflow

Use this reference to generate the 30-second MP4 for a live Tocayo site.

## Default Script

Run the bundled renderer:

```bash
node <skill-dir>/scripts/render-demo-video.mjs --url "https://example.tocayo.me" --duration 30
```

Optional arguments:

```bash
node <skill-dir>/scripts/render-demo-video.mjs \
  --url "https://example.tocayo.me" \
  --duration 30 \
  --slug "business-slug" \
  --project-dir "/absolute/output/project"
```

The script creates or reuses a HyperFrames project, captures a full-page screenshot, builds a one-image linear-scroll composition, validates it, and renders MP4 output.

## Requirements

- Node.js and npm.
- `ffmpeg` available on PATH.
- Network access for npm packages if HyperFrames or Playwright are not already installed.

## Required Video Shape

- 1920x1080 landscape MP4.
- Around 30 seconds unless the user requested a different duration.
- Silent.
- One continuous top-to-bottom linear scroll.
- Website content only.

## Forbidden

- Narration, music, or sound effects.
- Captions, title cards, annotations, or extra text.
- Browser chrome, URL bars, tabs, phone/laptop mockups, cursors, click pulses, or tap effects.
- Cuts, section pauses, easing, fades, or cinematic transitions.

If any forbidden element appears, regenerate using the bundled template.

## Output

Capture the absolute MP4 path, file size, duration, and live site URL for the final outreach table.
