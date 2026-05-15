# Prospecting Workflow

Use this reference when the user wants this skill to find leads, not just process an existing sheet.

## Inputs

Infer reasonable defaults and continue unless the base location is missing.

- `base_location`: address, city, town, landmark, or service area. Ask if missing.
- `radius_km`: default 20.
- `categories`: default local services likely to buy a better website, such as restaurants, gyms, salons, clinics, trades, studios, and professional services.
- `max_leads`: default 15 for the research sheet; default top 5 for Tocayo site/video/outreach production.
- `language`: match the user's language.
- `output`: default chat table; create CSV/spreadsheet only when asked or when the result set is large.

## Research Rules

- Use browser-assisted research and public sources.
- Treat maps, directories, search results, social pages, and official websites as discovery/evidence sources.
- Do not bypass CAPTCHAs, login walls, paywalls, bot protections, robots restrictions, or rate limits.
- Do not collect private personal data. Prefer public business contact channels.
- Prefer fewer verified leads over many weak guesses.
- Cross-check important facts with at least one independent public source when possible.

## Browser Research Steps

1. Search for the requested category near the base location.
2. Build a candidate list from visible public results, public directories, local pages, or official business profiles.
3. For each candidate, capture business name, category, area, public phone/email/socials, website URL, and source URLs.
4. Search the exact business name plus city/area to verify whether a standalone website exists.
5. Classify website status:
   - `No site found`: no credible standalone website after exact-name search.
   - `Social only`: only Facebook, Instagram, WhatsApp, Linktree, marketplace, directory, or booking portal was found.
   - `Weak site`: standalone site exists but appears outdated, broken, thin, non-mobile-friendly, slow, or missing clear contact/conversion flow.
   - `Has site`: credible standalone website exists and is not an obvious rebuild opportunity.
6. Mark confidence:
   - `High`: official source or at least two consistent public sources.
   - `Medium`: one credible source plus consistent search evidence.
   - `Low`: incomplete, stale, or ambiguous evidence.

## Lead Scoring

- `Hot`: no site found or social only, public contact route exists, active business, relevant to the requested area/category.
- `Warm`: weak website, poor online presentation, or only marketplace/booking page.
- `Low`: decent website already exists, contact route is unclear, or evidence is limited.
- `Skip`: closed, duplicate, outside target area, irrelevant category, not a business prospect, or insufficient public evidence.

Do not label a lead `Hot` unless website status has been checked with an exact-name search.

## Lead Sheet Output

Use this chat table for prospecting results unless the user requests a file:

| Score | Business | Category | Area | Distance | Website status | Website/Social | Phone | Why it is a prospect | Confidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

Rules:

- Keep `Why it is a prospect` short and actionable.
- Use `Not found` instead of blank fields.
- Include source URLs in notes or a compact `source_urls` field when useful.
- After the table, add `Best first outreach targets` with the top 3 leads and one practical reason each.
- State search location, radius, categories, and date in the summary.

When creating CSV, use:

```csv
score,business,category,area,distance_km,website_status,website_url,social_urls,phone,email,source_urls,why_prospect,confidence,notes
```
