#!/usr/bin/env node

import { existsSync, mkdirSync, readdirSync, statSync, copyFileSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const skillName = "automated-website-builder";
const sourceSkillDir = join(packageRoot, skillName);
const codexHome = process.env.CODEX_HOME || join(homedir(), ".codex");
const skillsDir = join(codexHome, "skills");
const targetSkillDir = join(skillsDir, skillName);

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

mkdirSync(skillsDir, { recursive: true });
copyDirectory(sourceSkillDir, targetSkillDir);
console.log(`Installed ${skillName} to ${targetSkillDir}`);
console.log("Done. Invoke with $automated-website-builder in Codex.");
