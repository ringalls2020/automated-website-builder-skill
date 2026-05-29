#!/usr/bin/env node

import { existsSync, mkdirSync, readdirSync, statSync, copyFileSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";
import { spawnSync } from "node:child_process";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const skillName = "automated-website-builder";
const sourceSkillDir = join(packageRoot, skillName);

// Pinned HyperFrames version used by scripts/render-demo-video.mjs for the
// demo-video step. Pre-installing it lets `npx -y hyperframes` resolve a known
// version without a live download on each render.
const HYPERFRAMES_VERSION = "0.6.52";

function copyDirectory(source, target) {
  if (!existsSync(source)) {
    throw new Error(`Missing source directory: ${source}`);
  }

  if (existsSync(target)) {
    rmSync(target, { recursive: true, force: true });
  }
  mkdirSync(target, { recursive: true });

  for (const entry of readdirSync(source)) {
    const sourcePath = join(source, entry);
    const targetPath = join(target, entry);
    const stats = statSync(sourcePath);
    if (stats.isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else {
      copyFileSync(sourcePath, targetPath);
    }
  }
}

// Resolve install targets. Default: both Codex and Claude. `--codex` or
// `--claude` scopes the install to a single host.
function resolveTargets(argv) {
  const wantCodex = argv.includes("--codex");
  const wantClaude = argv.includes("--claude");
  const both = wantCodex === wantClaude; // neither or both flags -> install to both

  const targets = [];
  if (both || wantCodex) {
    const codexHome = process.env.CODEX_HOME || join(homedir(), ".codex");
    targets.push({ host: "Codex", invoke: `$${skillName}`, skillsDir: join(codexHome, "skills") });
  }
  if (both || wantClaude) {
    const claudeHome = process.env.CLAUDE_CONFIG_DIR || join(homedir(), ".claude");
    targets.push({ host: "Claude Code", invoke: `/${skillName}`, skillsDir: join(claudeHome, "skills") });
  }
  return targets;
}

function installSkill(target) {
  mkdirSync(target.skillsDir, { recursive: true });
  const targetSkillDir = join(target.skillsDir, skillName);
  copyDirectory(sourceSkillDir, targetSkillDir);
  console.log(`Installed ${skillName} to ${targetSkillDir}`);
}

// Pre-install the pinned HyperFrames package so the demo-video renderer
// (scripts/render-demo-video.mjs -> `npx -y hyperframes ...`) has it available.
// Best-effort: a failure here never blocks the skill install, because the
// renderer still falls back to fetching it via `npx -y hyperframes`.
function ensureHyperframes() {
  const spec = `hyperframes@${HYPERFRAMES_VERSION}`;
  console.log(`Installing ${spec} (global) for the demo-video renderer...`);
  const result = spawnSync("npm", ["install", "--global", spec], { stdio: "inherit" });
  if (result.status === 0) {
    console.log(`Installed ${spec}.`);
    return;
  }
  console.warn(`WARNING: could not pre-install ${spec} (exit ${result.status ?? "unknown"}).`);
  console.warn("The demo-video step still works: render-demo-video.mjs falls back to `npx -y hyperframes`.");
}

const argv = process.argv.slice(2);
const targets = resolveTargets(argv);

for (const target of targets) {
  installSkill(target);
}

if (!argv.includes("--skip-hyperframes")) {
  ensureHyperframes();
}

console.log("Done.");
for (const target of targets) {
  console.log(`Invoke with ${target.invoke} in ${target.host}.`);
}
