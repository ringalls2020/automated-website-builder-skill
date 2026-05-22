# Memory Workflow

Use this reference before every prospecting, lead selection, site generation, and final delivery pass.

## Default File

- Default memory path: `memory.md` in the active workspace or campaign output directory.
- If the user provides a memory path, use that path for the whole run.
- If `memory.md` exists, read it before any new prospect search or site generation.
- If it does not exist, create it only when there is a finding or result to record.

## Purpose

`memory.md` prevents duplicate prospecting and duplicate Tocayo site generation across runs. Treat it as the local campaign ledger.

## Duplicate Detection

Before adding a candidate to the selected leads list, compare it against memory entries by:

- Normalized business name plus city/area.
- Phone number.
- Email.
- Existing website domain.
- Google Maps or Google Business Profile URL.
- Social profile URL.
- Directory source URL.
- Tocayo live URL.
- Tocayo transfer link.

Normalize business names by lowercasing, removing punctuation, removing legal suffixes such as `llc`, `inc`, `co`, and collapsing whitespace. If two records are likely the same business, treat the new one as duplicate unless the user explicitly asks to revisit it.

## What To Record

Append one entry per meaningful finding, including skipped and blocked leads. Use this shape:

```markdown
## YYYY-MM-DD - Business Name - City, State

- status: ready | partial | blocked | skipped | duplicate | researched
- normalized_key: business-name--city-state
- category: ...
- phone: ...
- email: ...
- google_maps_url: ...
- website_url: ...
- social_urls: ...
- source_urls: ...
- website_status: no site found | social only | weak site | has site | unknown
- score: hot | warm | low | skip
- confidence: high | medium | low
- tocayo_live_url: ...
- tocayo_transfer_link: ...
- demo_video: ...
- outreach_channel: ...
- outreach_summary: one-line summary of drafted message or why none was drafted
- notes: source evidence, blockers, assumptions, or reason skipped
```

Use `Not found` for unavailable identifiers. Keep notes concise.

## When To Write

- After prospecting: record researched candidates, skipped leads, and selected leads.
- After Tocayo build: update or append the live URL and transfer link.
- After video render: update or append the MP4 path.
- Before final response: ensure every reported lead has a corresponding memory entry.

If a run fails midway, write partial entries so future runs know what already happened.

## Final Response

Always include the memory path in the final response. Mention how many candidates were skipped because they already appeared in `memory.md`.
