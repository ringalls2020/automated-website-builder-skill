// Capture a website as a single full-page PNG at desktop retina viewport.
//
// Mitigates IntersectionObserver-based scroll-triggered animations so all
// sections render at final state. Without these mitigations, sections that use
// opacity:0 -> 1 fade-ins can render blank in the fullPage:true screenshot.
//
// Usage:
//   PROSPECT_URL=https://example.com/ node scripts/capture-desktop.mjs

import { chromium } from "playwright";
import { existsSync, mkdirSync } from "node:fs";

const URL = process.env.PROSPECT_URL;
if (!URL) {
  console.error("ERROR: set PROSPECT_URL, for example:");
  console.error("  PROSPECT_URL=https://example.com/ node scripts/capture-desktop.mjs");
  process.exit(1);
}

const OUT_DIR = process.env.OUT_DIR || "capture/desktop";
const VIEWPORT = { width: 1920, height: 1080 };
const DEVICE_SCALE = 2;

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: VIEWPORT,
  deviceScaleFactor: DEVICE_SCALE,
});
const page = await context.newPage();

await page.goto(URL, { waitUntil: "load", timeout: 60000 });
await page.waitForTimeout(4000);
await page.evaluate(async () => {
  if (document.fonts?.ready) await document.fonts.ready;
  await Promise.all(
    Array.from(document.images)
      .filter((img) => !img.complete)
      .map(
        (img) =>
          new Promise((resolve) => {
            img.addEventListener("load", resolve, { once: true });
            img.addEventListener("error", resolve, { once: true });
          }),
      ),
  );
});

const totalHeight = await page.evaluate(() => document.body.scrollHeight);
const stepSize = Math.floor(VIEWPORT.height / 3);
for (let y = 0; y <= totalHeight; y += stepSize) {
  await page.evaluate((sy) => window.scrollTo(0, sy), y);
  await page.waitForTimeout(650);
}

const sectionTops = await page.evaluate(() =>
  Array.from(document.querySelectorAll("section, [class*='tocayo-section-target-surface']"))
    .map((el) =>
      Math.max(
        0,
        Math.round(el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.25),
      ),
    )
    .filter((top, index, all) => Number.isFinite(top) && all.indexOf(top) === index)
    .sort((a, b) => a - b),
);
for (const y of sectionTops) {
  await page.evaluate((sy) => window.scrollTo(0, sy), y);
  await page.waitForTimeout(900);
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(1200);

await page.addStyleTag({
  content: `
    *, *::before, *::after {
      animation-duration: 0.001s !important;
      animation-delay: 0s !important;
      transition-duration: 0.001s !important;
      transition-delay: 0s !important;
    }
    [data-tocayo-capture-force-visible] {
      opacity: 1 !important;
      visibility: visible !important;
      transform: none !important;
      filter: none !important;
    }
  `,
});
await page.waitForTimeout(1200);

const forcedVisible = await page.evaluate(() => {
  const changed = [];
  for (const el of document.body.querySelectorAll("*")) {
    const text = (el.textContent || "").replace(/\s+/g, " ").trim();
    if (text.length < 3) continue;

    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    const docTop = rect.top + window.scrollY;
    const inDocumentFlow =
      rect.width > 0 &&
      rect.height > 0 &&
      docTop >= 0 &&
      docTop < document.body.scrollHeight &&
      style.display !== "none";

    if (!inDocumentFlow) continue;

    if (style.opacity === "0" || style.visibility === "hidden") {
      el.setAttribute("data-tocayo-capture-force-visible", "true");
      changed.push({
        tag: el.tagName,
        y: Math.round(docTop),
        text: text.slice(0, 80),
      });
    }
  }
  return changed;
});
await page.waitForTimeout(800);

const sectionAudit = await page.evaluate(() =>
  Array.from(document.querySelectorAll("section"))
    .map((section, index) => {
      const rect = section.getBoundingClientRect();
      const text = (section.textContent || "").replace(/\s+/g, " ").trim();
      const visibleTextElements = Array.from(section.querySelectorAll("*")).filter((el) => {
        const childRect = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        const childText = (el.textContent || "").replace(/\s+/g, " ").trim();
        return (
          childText.length > 2 &&
          childRect.width > 0 &&
          childRect.height > 0 &&
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          Number(style.opacity) > 0.01
        );
      });
      return {
        index,
        y: Math.round(rect.top + window.scrollY),
        height: Math.round(rect.height),
        text: text.slice(0, 80),
        visibleTextElements: visibleTextElements.length,
      };
    })
    .filter((section) => section.text.length > 0),
);

const suspectSections = sectionAudit.filter(
  (section) => section.height >= 120 && section.visibleTextElements === 0,
);
if (suspectSections.length > 0) {
  console.error("ERROR: text-bearing sections still appear hidden before screenshot:");
  console.error(JSON.stringify(suspectSections, null, 2));
  await browser.close();
  process.exit(1);
}

const fullPath = `${OUT_DIR}/full-page.png`;
await page.screenshot({ path: fullPath, fullPage: true, type: "png" });

const { width, height } = await page.evaluate(() => ({
  width: document.documentElement.scrollWidth,
  height: document.body.scrollHeight,
}));
console.log(`page logical dimensions: ${width} x ${height}`);
console.log(`expected PNG raw size:    ${width * DEVICE_SCALE} x ${height * DEVICE_SCALE}`);
console.log(`displayHeight @ 1920w:    ${height}`);
console.log(`scrollEnd (translateY):   -${height - 1080}`);
console.log(`forced visible elements:  ${forcedVisible.length}`);
console.log(`audited sections:         ${sectionAudit.length}`);
console.log(`wrote ${fullPath}`);

await browser.close();
