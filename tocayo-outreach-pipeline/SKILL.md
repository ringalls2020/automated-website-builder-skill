---
name: tocayo-outreach-pipeline
description: End-to-end Tocayo cold outreach workflow for local-business prospecting. Use when the user wants to find and qualify local business leads, check website/social presence, score prospects, develop outreach tone and campaign messaging, build live Tocayo demo sites, generate Tocayo transfer links, generate 30-second MP4 walkthrough videos, and output cold email/DM copy with site URLs, transfer links, and video paths. Also use when the user provides an existing lead sheet, CSV, spreadsheet, JSON, or Markdown table and wants it turned into Tocayo outreach assets.
---

# Tocayo Outreach Pipeline

Find local-business prospects and convert them into outreach-ready assets: qualified lead sheets, a concise campaign brief from the user, Tocayo demo sites, Tocayo transfer links, 30-second walkthrough MP4s, and cold email/DM copy.

## Required Inputs

- Either prospecting criteria or a lead sheet path/pasted table.
  - Prospecting criteria: base location, categories, radius, max leads, and output format.
  - Lead sheet: CSV, TSV, JSON, Markdown table, spreadsheet file, or pasted rows.
- Tocayo access through the user's available app, API, CLI, or workflow.
- A target outreach asset count. If missing, default to the top 5 viable leads after qualification.

If the base location is missing and cannot be inferred, ask one concise clarification before prospecting. Otherwise infer reasonable defaults and proceed.

## References

- Read `references/prospecting-workflow.md` before finding new leads.
- Read `references/lead-sheet-contract.md` when parsing or ranking leads.
- Read `references/outreach-interview.md` before interviewing the user or drafting messages.
- Read `references/tocayo-site-handoff.md` before building Tocayo sites.
- Read `references/video-workflow.md` before generating MP4 walkthroughs.
- Read `references/output-contract.md` before final delivery.

## Workflow

1. Determine the entry path.
   - If the user supplied a lead sheet, continue to normalization.
   - If the user supplied prospecting criteria, run the prospecting workflow first.
   - If neither is present, ask for base location and target business categories.

2. Find and qualify leads when needed.
   - Follow `references/prospecting-workflow.md`.
   - Use browser-assisted research from public sources; do not scrape at scale or bypass access controls.
   - Verify website/social/contact status before labeling a lead as hot.
   - Produce a compact lead sheet in chat unless the user asks for CSV/spreadsheet output.

3. Load and normalize the lead sheet.
   - For CSV, TSV, JSON, or Markdown tables, run `scripts/normalize-leads.py`.
   - For XLSX or Google Sheets exports, use spreadsheet tooling to inspect or export the relevant tab to CSV, then normalize it.
   - Preserve original source URLs and notes. Do not discard provenance.

4. Select viable prospects.
   - Prefer leads with weak/no websites, clear public contact channels, strong category fit, and credible evidence.
   - Exclude leads that lack enough information to build a reasonable demo site unless the user explicitly wants them.
   - Keep a short reason for every included and excluded lead.

5. Interview the user for the campaign brief and outreach tone.
   - Ask only for missing information that affects message quality or compliance.
   - Cover sender identity, offer, target segment, channel, tone, CTA, personalization rules, and constraints.
   - When the user is unsure about tone, propose two or three tone options based on the lead category and let the user choose.
   - Use defaults from `references/outreach-interview.md` when the user asks you to proceed quickly.

6. Build one Tocayo demo site per selected lead.
   - Use the available Tocayo interface. Do not assume private local paths or credentials.
   - Create a build brief from normalized lead data and source evidence.
   - Publish the site and record the live URL. Never fabricate a Tocayo URL.
   - Generate the site's transfer link from `https://tocayo.me/settings/transfer` and record the actual returned link. Never fabricate a transfer link.
   - If Tocayo access is unavailable, pause and state exactly what the user must provide.

7. Generate a 30-second walkthrough MP4 for each live site.
   - Use `scripts/render-demo-video.mjs` by default.
   - If `$tocayo-demo-video` is installed, it is acceptable to use that skill instead.
   - The video must be a silent single linear scroll of the website at 1920x1080. No narration, captions, cuts, mockups, browser chrome, cursor effects, or music.

8. Draft outreach.
   - Write messages after the site URL, transfer link, and MP4 path exist, so the copy can reference real assets.
   - Personalize from public evidence in the lead sheet and Tocayo build brief.
   - Avoid claims of affiliation, ownership, guaranteed results, or prior relationship unless supplied by the user.
   - Include the transfer link in the outbound copy only when the campaign brief says the prospect should claim or take over the site directly; otherwise keep it in the final handoff table.
   - Include a light opt-out line for email campaigns when appropriate.

9. Deliver the output.
   - Follow `references/output-contract.md`.
   - Include prospecting criteria, selected/skipped leads, each lead's business name, confidence, live Tocayo URL, transfer link, MP4 path, primary message, follow-up, and any blocked/missing items.

## Quality Bar

- Do not send or schedule messages unless the user explicitly asks for that action.
- Do not scrape behind logins, bypass robots, ignore rate limits, solve CAPTCHAs, or use private data.
- Do not publish demos under a prospect's custom domain without authorization.
- Keep messages short, specific, and plausible for one-to-one outreach.
- Treat the MP4 as proof-of-existence. The written message carries the pitch.
