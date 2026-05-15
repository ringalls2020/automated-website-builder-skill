# Output Contract

Use this structure for the final user-facing delivery.

## Summary Table

Include one row per attempted lead:

| Lead | Status | Live Tocayo URL | MP4 | Contact channel | Notes |
| --- | --- | --- | --- | --- | --- |

Statuses:

- `ready`: live site, MP4, and outreach copy are complete.
- `blocked`: missing Tocayo access, lead data, contact route, or render dependency.
- `skipped`: intentionally not processed, with reason.

## Per-Lead Copy

For each ready lead, provide:

- Business name.
- Evidence used for personalization.
- Primary message.
- Short alternate message.
- Follow-up.
- Live Tocayo URL.
- MP4 absolute path.

## File Output

When the user asks for files, create an output directory such as:

```text
outreach-output/<campaign-slug>/
  normalized-leads.json
  selected-leads.md
  messages.md
  videos/
```

Do not create files unless asked or unless the workflow needs an intermediate artifact for rendering.
