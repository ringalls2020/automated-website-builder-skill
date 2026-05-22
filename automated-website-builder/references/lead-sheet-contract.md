# Lead Sheet Contract

Use this reference when reading lead sheets from this skill's prospecting output or user-provided files.

## Accepted Formats

- CSV or TSV with a header row.
- JSON array of lead objects, or an object containing a `leads` array.
- Markdown pipe table.
- XLSX or Google Sheets after inspection/export through spreadsheet tooling.

Run the normalizer for supported plain-text files:

```bash
python3 <skill-dir>/scripts/normalize-leads.py leads.csv --max-leads 5 --format markdown
```

## Canonical Fields

- `business_name`: Business or prospect name.
- `category`: Trade, niche, or service type.
- `location`: City, state, neighborhood, or service area.
- `google_maps_url`: Public Google Maps or Google Business Profile URL for Tocayo prefill when available.
- `website_url`: Current website if any.
- `website_status`: `none`, `weak`, `social_only`, `good`, or unknown text from the sheet.
- `social_urls`: Social profiles or directory pages.
- `phone`: Public phone number.
- `email`: Public email if present.
- `source_urls`: Evidence URLs from Maps, directories, websites, or social profiles.
- `prospect_score`: Original score or label such as hot, warm, low.
- `confidence`: Confidence label or numeric confidence.
- `notes`: Useful evidence, issues, or personalization hints.

Map common column names to these fields. Preserve unrecognized columns in `raw`.

## Prioritization Rules

Prefer leads that have:

- `hot` or high numeric scores.
- `none`, `weak`, or `social_only` website status.
- A `google_maps_url`, because Tocayo can prefill business details from it.
- Public phone, email, contact form, or social DM path.
- Enough business evidence to build a credible demo site.
- Clear local-service fit for a website rebuild pitch.

Deprioritize leads that have:

- A strong modern website.
- Missing business name or location.
- No public contact route.
- Low confidence or conflicting evidence.

## Selection Output

For each selected lead, keep:

- Why this lead was selected.
- What evidence will shape the Tocayo build.
- Which `google_maps_url` should be used for Tocayo prefill, if any.
- Which public contact channel should be used.
- What is missing or uncertain.

For each skipped lead, keep a one-line reason.
