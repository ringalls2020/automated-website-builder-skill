# Output Contract

Use this structure for the final user-facing delivery.

Always include the `memory.md` path used for the run.

## Summary Table

Include one row per attempted lead:

| Business name | Phone | Email | Status | Live Tocayo URL | Transfer link | MP4 | Contact channel | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

Statuses:

- `ready`: live site, transfer link, MP4, and outreach copy are complete.
- `partial`: at least one asset exists, but transfer link, MP4, or copy is missing.
- `blocked`: missing Tocayo access, lead data, contact route, transfer-link access, or render dependency.
- `skipped`: intentionally not processed, with reason.
- `duplicate`: skipped because the lead matched an existing `memory.md` entry.

## Per-Lead Copy

For each ready lead, provide:

- Business name.
- Phone number, or `Not found`.
- Email address, or `Not found`.
- Evidence used for personalization.
- Primary message.
- Short alternate message.
- Follow-up.
- Live Tocayo URL.
- Tocayo transfer link.
- MP4 absolute path.

## File Output

When the user asks for files, create an output directory such as:

```text
outreach-output/<campaign-slug>/
  normalized-leads.json
  memory.md
  selected-leads.md
  messages.md
  transfer-links.md
  videos/
```

Do not create files unless asked or unless the workflow needs an intermediate artifact for rendering.
