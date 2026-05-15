#!/usr/bin/env python3
"""Normalize local-business lead sheets for the Tocayo outreach pipeline."""

from __future__ import annotations

import argparse
import csv
import json
import re
import sys
from pathlib import Path
from typing import Any


FIELD_ALIASES = {
    "business_name": {
        "business",
        "business name",
        "name",
        "lead",
        "company",
        "prospect",
    },
    "category": {"category", "niche", "trade", "service", "services", "type"},
    "location": {"location", "city", "area", "address", "service area"},
    "website_url": {"website", "website url", "site", "url", "current website"},
    "website_status": {"website status", "site status", "status", "web status"},
    "social_urls": {"social", "socials", "social urls", "facebook", "instagram", "linkedin"},
    "phone": {"phone", "telephone", "mobile", "number"},
    "email": {"email", "email address", "mail"},
    "source_urls": {"sources", "source urls", "evidence", "source", "links"},
    "prospect_score": {"score", "prospect score", "lead score", "rating", "fit"},
    "confidence": {"confidence", "confidence level", "certainty"},
    "notes": {"notes", "note", "why", "why prospect", "reason", "personalization", "details"},
}


def normalize_header(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", value.strip().lower()).strip()


def canonical_field(header: str) -> str | None:
    normalized = normalize_header(header)
    for field, aliases in FIELD_ALIASES.items():
        if normalized == field.replace("_", " ") or normalized in aliases:
            return field
    return None


def split_links(value: str) -> list[str]:
    parts = re.split(r"[\s,;]+", value.strip())
    return [part for part in parts if part.startswith(("http://", "https://"))]


def load_json(path: Path) -> list[dict[str, Any]]:
    data = json.loads(path.read_text())
    if isinstance(data, dict) and isinstance(data.get("leads"), list):
        data = data["leads"]
    if not isinstance(data, list):
        raise ValueError("JSON input must be an array or an object with a 'leads' array")
    return [item for item in data if isinstance(item, dict)]


def load_delimited(path: Path) -> list[dict[str, str]]:
    sample = path.read_text(newline="")[:4096]
    dialect = csv.Sniffer().sniff(sample, delimiters=",\t;")
    with path.open(newline="") as handle:
        return list(csv.DictReader(handle, dialect=dialect))


def load_markdown_table(path: Path) -> list[dict[str, str]]:
    rows = []
    for raw_line in path.read_text().splitlines():
        line = raw_line.strip()
        if not line.startswith("|") or not line.endswith("|"):
            continue
        cells = [cell.strip() for cell in line.strip("|").split("|")]
        if all(re.fullmatch(r":?-{3,}:?", cell.replace(" ", "")) for cell in cells):
            continue
        rows.append(cells)

    if len(rows) < 2:
        raise ValueError("Markdown table must include a header row and at least one data row")

    headers = rows[0]
    return [dict(zip(headers, row, strict=False)) for row in rows[1:]]


def load_rows(path: Path) -> list[dict[str, Any]]:
    suffix = path.suffix.lower()
    if suffix == ".json":
        return load_json(path)
    if suffix in {".md", ".markdown"}:
        return load_markdown_table(path)
    if suffix in {".csv", ".tsv", ".txt"}:
        return load_delimited(path)
    raise ValueError(
        f"Unsupported input format '{suffix}'. Export spreadsheets to CSV, or provide JSON/Markdown."
    )


def coerce_text(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, list):
        return ", ".join(str(item) for item in value)
    return str(value).strip()


def normalize_row(row: dict[str, Any], index: int) -> dict[str, Any]:
    lead: dict[str, Any] = {
        "row": index,
        "business_name": "",
        "category": "",
        "location": "",
        "website_url": "",
        "website_status": "",
        "social_urls": [],
        "phone": "",
        "email": "",
        "source_urls": [],
        "prospect_score": "",
        "confidence": "",
        "notes": "",
        "raw": {},
    }

    for key, value in row.items():
        field = canonical_field(str(key))
        text = coerce_text(value)
        if not text:
            continue
        if field in {"social_urls", "source_urls"}:
            lead[field].extend(split_links(text) or [text])
        elif field:
            lead[field] = text
        else:
            lead["raw"][str(key)] = text

    if lead["website_url"] and not lead["website_url"].startswith(("http://", "https://")):
        if "." in lead["website_url"] and " " not in lead["website_url"]:
            lead["website_url"] = "https://" + lead["website_url"]

    lead["rank_score"] = rank_score(lead)
    lead["selection_reason"] = selection_reason(lead)
    return lead


def rank_score(lead: dict[str, Any]) -> int:
    score = 0
    score_text = str(lead.get("prospect_score", "")).lower()
    confidence = str(lead.get("confidence", "")).lower()
    website_status = str(lead.get("website_status", "")).lower()

    if any(token in score_text for token in ("hot", "high", "strong", "a")):
        score += 30
    elif any(token in score_text for token in ("warm", "medium", "b")):
        score += 20
    elif any(token in score_text for token in ("low", "weak", "c")):
        score += 5

    numeric_match = re.search(r"\d+(?:\.\d+)?", score_text)
    if numeric_match:
        score += min(30, round(float(numeric_match.group(0))))

    if any(token in website_status for token in ("none", "no site", "missing", "social")):
        score += 30
    elif any(token in website_status for token in ("weak", "old", "outdated", "poor")):
        score += 25
    elif any(token in website_status for token in ("good", "modern", "strong")):
        score -= 25

    if lead.get("phone") or lead.get("email") or lead.get("social_urls"):
        score += 15
    if lead.get("business_name"):
        score += 10
    if lead.get("location"):
        score += 5
    if any(token in confidence for token in ("high", "strong", "0.8", "0.9", "1.0")):
        score += 10
    elif "low" in confidence:
        score -= 10

    return score


def selection_reason(lead: dict[str, Any]) -> str:
    reasons = []
    if lead.get("website_status"):
        reasons.append(f"website status: {lead['website_status']}")
    if lead.get("phone") or lead.get("email") or lead.get("social_urls"):
        reasons.append("has public contact route")
    if lead.get("confidence"):
        reasons.append(f"confidence: {lead['confidence']}")
    if lead.get("notes"):
        reasons.append(str(lead["notes"])[:120])
    return "; ".join(reasons) or "needs manual review"


def normalize_leads(rows: list[dict[str, Any]], max_leads: int | None) -> list[dict[str, Any]]:
    normalized = [normalize_row(row, index + 1) for index, row in enumerate(rows)]
    normalized.sort(key=lambda lead: lead["rank_score"], reverse=True)
    if max_leads:
        return normalized[:max_leads]
    return normalized


def print_markdown(leads: list[dict[str, Any]]) -> None:
    print("| Rank | Business | Category | Location | Website status | Contact | Score | Reason |")
    print("| --- | --- | --- | --- | --- | --- | ---: | --- |")
    for rank, lead in enumerate(leads, start=1):
        contact = lead.get("email") or lead.get("phone") or ", ".join(lead.get("social_urls", []))
        values = [
            str(rank),
            lead.get("business_name", ""),
            lead.get("category", ""),
            lead.get("location", ""),
            lead.get("website_status", ""),
            contact,
            str(lead.get("rank_score", "")),
            lead.get("selection_reason", ""),
        ]
        escaped = [str(value).replace("|", "\\|") for value in values]
        print("| " + " | ".join(escaped) + " |")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("lead_sheet", type=Path)
    parser.add_argument("--max-leads", type=int, default=5)
    parser.add_argument("--format", choices=("json", "markdown"), default="json")
    args = parser.parse_args()

    try:
        rows = load_rows(args.lead_sheet)
        leads = normalize_leads(rows, args.max_leads)
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1

    if args.format == "markdown":
        print_markdown(leads)
    else:
        print(json.dumps({"leads": leads}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
