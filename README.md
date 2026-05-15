# Tocayo Outreach Pipeline Skill

An installable Codex skill for finding local-business leads and turning them into cold outreach assets: Tocayo demo sites, 30-second walkthrough MP4s, and personalized email/DM copy.

[Tocayo](https://tocayo.me) is an AI-native website builder for small businesses. This skill uses Tocayo as the site-building step in an outreach pipeline: find and qualify prospects, build a live sample site for each selected lead, record a short scrolling walkthrough, and draft messages that point to the live site and video.

## What it does

- Finds and qualifies local-business prospects from public sources.
- Checks whether each prospect has no site, social-only presence, a weak site, or an existing good site.
- Scores leads as hot, warm, low, or skip and can also read existing CSV/TSV/JSON/Markdown lead sheets.
- Interviews the user for sender identity, offer, tone, CTA, channel, and constraints before writing outreach.
- Builds a Tocayo site for each selected lead using the available Tocayo interface in the user's environment.
- Generates a silent 1920x1080 MP4 walkthrough of each live Tocayo site.
- Outputs cold outreach messages, follow-ups, live site URLs, and MP4 paths.

## Install

```bash
npx -y github:Kappaemme-git/tocayo-outreach-pipeline-skill
```

After publishing to npm, this shorter command will also work:

```bash
npx -y tocayo-outreach-pipeline-skill
```

The installer copies `tocayo-outreach-pipeline` into `~/.codex/skills`. No companion skill is required.

## Use

In Codex:

```text
Use $tocayo-outreach-pipeline to find roofers in Austin without good websites, develop the outreach tone with me, build Tocayo demo sites for the top 5, generate MP4 walkthroughs, and draft cold email copy.
```

With an existing lead sheet:

```text
Use $tocayo-outreach-pipeline with leads.csv. Interview me for the offer and write outreach for the top 5 prospects.
```

## Requirements

- Codex skills support.
- Tocayo access through the user's available app, API, CLI, or workflow.
- Node.js and npm for the video renderer.
- `ffmpeg` for MP4 rendering through HyperFrames.

## Repository layout

```text
tocayo-outreach-pipeline/
  SKILL.md
  agents/openai.yaml
  references/
  scripts/
bin/install.js
```

## License

MIT
