# Automated Website Builder Skill

An installable Codex and Claude Code skill for finding local-business leads and turning them into cold outreach assets: Tocayo demo sites, Tocayo transfer links, 30-second walkthrough MP4s, and personalized email/DM copy.

[Tocayo](https://tocayo.me) is an AI-native website builder for small businesses. This skill uses Tocayo as the site-building step in an outreach pipeline: find and qualify prospects, build a live sample site for each selected lead, generate a transfer link, record a short scrolling walkthrough, and draft messages that point to the live site and video.

## What it does

- Finds and qualifies local-business prospects from public sources.
- Reads and updates `memory.md` before each run so it avoids duplicate leads and duplicate site generation.
- Checks whether each prospect has no site, social-only presence, a weak site, or an existing good site.
- Captures Google Maps profile URLs and uses Tocayo onboarding to prefill business details when available.
- Scores leads as hot, warm, low, or skip and can also read existing CSV/TSV/JSON/Markdown lead sheets.
- Interviews the user for sender identity, offer, tone, CTA, channel, and constraints before writing outreach.
- Builds a Tocayo site for each selected lead using the available Tocayo interface in the user's environment.
- Generates a Tocayo transfer link from `tocayo.me/settings/transfer` for each generated business website.
- Generates a silent 1920x1080 MP4 walkthrough of each live Tocayo site.
- Outputs business names, phone numbers, email addresses, cold outreach messages, follow-ups, live site URLs, transfer links, and MP4 paths.

## Install

```bash
npx -y github:ringalls2020/automated-website-builder-skill
```

After publishing to npm, this shorter command will also work:

```bash
npx -y automated-website-builder-skill
```

By default the installer copies `automated-website-builder` into both `~/.codex/skills` and `~/.claude/skills`, and pre-installs the pinned `hyperframes` package used by the demo-video renderer. No companion skill is required.

Scope the install or skip the HyperFrames step with flags:

```bash
npx -y github:ringalls2020/automated-website-builder-skill --claude            # Claude Code only
npx -y github:ringalls2020/automated-website-builder-skill --codex             # Codex only
npx -y github:ringalls2020/automated-website-builder-skill --skip-hyperframes  # don't pre-install hyperframes
```

Override the install homes with `CODEX_HOME` and `CLAUDE_CONFIG_DIR`. If the HyperFrames pre-install fails (for example, a global npm install needs elevated permissions), the skill still installs and the renderer falls back to `npx -y hyperframes` at render time.

## Use

In Claude Code:

```text
/automated-website-builder
```

In Codex:

```text
$automated-website-builder
```

or in natural language (either host):

```text
Use the automated-website-builder skill to find roofers in Austin without good websites, develop the outreach tone with me, build Tocayo demo sites for the top 5, generate transfer links and MP4 walkthroughs, and draft cold email copy.
```

With an existing lead sheet:

```text
Use the automated-website-builder skill with leads.csv. Interview me for the offer and write outreach for the top 5 prospects.
```

## Requirements

- Codex or Claude Code skills support.
- Tocayo access through the user's available app, API, CLI, or workflow.
- Node.js and npm for the video renderer (Node >= 22 for the HyperFrames render step).
- `ffmpeg` for MP4 rendering through HyperFrames.

## Repository layout

```text
automated-website-builder/
  SKILL.md            # skill manifest + workflow (read by both hosts)
  agents/openai.yaml  # Codex interface manifest (ignored by Claude Code)
  references/
  scripts/
bin/install.js        # cross-platform installer (Codex + Claude Code)
```

## License

MIT
