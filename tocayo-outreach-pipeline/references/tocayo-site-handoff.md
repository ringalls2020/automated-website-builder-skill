# Tocayo Site Handoff

Use this reference when turning a selected lead into a Tocayo build.

Tocayo link for user-facing docs or README context: https://tocayo.me

## Build Brief

Create a concise build brief before opening Tocayo:

- Business name.
- Service niche and category.
- Location or service area.
- Existing website or social profiles.
- Phone, email, and address if public.
- Reputation/evidence notes from source URLs.
- Preferred vibe based on category, local market, and public brand cues.
- Required pages or sections: home, services, about, reviews/testimonials if evidenced, contact, booking/CTA.
- CTA target: call, quote request, booking, or contact form.
- Things not to claim because they are not evidenced.

## Build Rules

- Use only public lead evidence and user-provided campaign instructions.
- Keep the site clearly suitable as a preview/demo. Do not claim ownership of the business.
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
- `build_notes`: one to three bullets about what was customized.
- `source_evidence`: source URLs used.
- `blocked_items`: missing data, inaccessible pages, or assumptions.
