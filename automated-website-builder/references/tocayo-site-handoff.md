# Tocayo Site Handoff

Use this reference when turning a selected lead into a Tocayo build.

Tocayo link for user-facing docs or README context: https://tocayo.me

## Build Brief

Create a concise build brief before opening Tocayo:

- Business name.
- Service niche and category.
- Location or service area.
- Google Maps business profile URL, if available.
- Existing website or social profiles.
- Phone, email, and address if public.
- Reputation/evidence notes from source URLs.
- Preferred vibe based on category, local market, and public brand cues.
- Required pages or sections: home, services, about, reviews/testimonials if evidenced, contact, booking/CTA.
- CTA target: call, quote request, booking, or contact form.
- Things not to claim because they are not evidenced.

## Tocayo Onboarding Flow

Use `https://tocayo.me/onboarding` for new builds.

Preferred path for Maps-sourced leads:

1. Choose `Set up by typing`.
2. On `Start with your Google profile?`, paste the lead's `google_maps_url`. A business name plus city can work when a direct Maps URL is missing, but a direct URL is preferred.
3. Click `Find my profile`.
4. Verify the matched business name, address, phone, website, and hours. If it is not the intended business, choose `Not the right place? Try another search`.
5. Click `Use these details` only after the match is correct.
6. Review the contact step. Tocayo can continue when an email is not provided if the public profile supplies enough usable business details. Do not invent an email address.
7. Pick a vibe from the build brief, then choose logo, photos, and social profiles using only public or user-provided assets. Skip unavailable optional assets.
8. On the final review screen, verify the prefilled fields and selected options before clicking `Generate My Website`.

Existing-site rebuild path:

- The `Rebuild my existing site` URL field accepts ordinary website URLs and can also accept Google Maps URLs.
- Use this path when the user specifically wants Tocayo to rebuild from an existing website URL.
- For a lead whose strongest source is Google Maps, prefer the Google profile path above because it exposes a match-verification step before generation.

## Build Rules

- Use only public lead evidence and user-provided campaign instructions.
- Keep the site clearly suitable as a preview/demo. Do not claim ownership of the business.
- Record which onboarding source was used: `google_maps_url`, `business_name_search`, `website_url`, or `manual`.
- Do not publish to a custom domain owned by the prospect unless the user has authorization.
- Record the live Tocayo URL from the actual published site. Do not infer or fabricate it.
- After publishing, open `https://tocayo.me/settings/transfer`, generate a transfer link for the specific business website, and record the exact link returned by Tocayo.
- Do not reuse a transfer link across businesses. Each generated site needs its own transfer link.
- Do not infer, guess, or construct transfer links from slugs or project ids.
- If Tocayo requires login, payment, API keys, project ownership, or manual review, ask for that access at the point it is needed.

## Transfer Link Rules

- Generate the transfer link only after the site exists and is associated with the correct Tocayo project/business.
- Verify the transfer link belongs to the intended business before recording it.
- Treat transfer links as sensitive handoff links. Include them in user-facing output, but do not place them in cold outreach copy unless the user confirms the CTA should be "claim/take over this site."
- If transfer-link generation is unavailable, mark the lead as `blocked` or `partial` with the reason, while still reporting any live URL and MP4 already produced.

## Completion Checklist

For every built site, capture:

- `live_url`: the actual public Tocayo URL.
- `transfer_link`: the actual Tocayo transfer link generated from `https://tocayo.me/settings/transfer`.
- `project_name` or slug if visible.
- `onboarding_source`: `google_maps_url`, `business_name_search`, `website_url`, or `manual`.
- `build_notes`: one to three bullets about what was customized.
- `source_evidence`: source URLs used.
- `blocked_items`: missing data, inaccessible pages, or assumptions.
