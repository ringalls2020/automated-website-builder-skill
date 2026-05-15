#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const skillDir = resolve(scriptDir, "..");

function usage() {
  console.error(`Usage:
  node scripts/render-demo-video.mjs --url https://example.tocayo.me [--duration 30] [--slug slug] [--project-dir /path]`);
}

function parseArgs(argv) {
  const options = { duration: "30" };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for --${key}`);
    }
    options[key] = value;
    index += 1;
  }
  return options;
}

function slugFromUrl(rawUrl) {
  const url = new URL(rawUrl);
  let host = url.hostname.toLowerCase();
  host = host.replace(/^dev-/, "");
  host = host.replace(/\.tocayo\.me$/, "");
  host = host.replace(/\.[a-z]{2,}$/, "");
  return host.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "tocayo-demo";
}

function run(command, args, options = {}) {
  console.log(`$ ${command} ${args.join(" ")}`);
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    env: options.env || process.env,
    encoding: "utf8",
    stdio: options.capture ? ["ignore", "pipe", "pipe"] : "inherit",
  });

  if (options.capture) {
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
  }

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed with exit code ${result.status}`);
  }

  return result;
}

function latestMp4(rendersDir) {
  if (!existsSync(rendersDir)) return null;
  const files = readdirSync(rendersDir)
    .filter((file) => file.endsWith(".mp4"))
    .map((file) => {
      const path = join(rendersDir, file);
      return { path, mtimeMs: statSync(path).mtimeMs, size: statSync(path).size };
    })
    .sort((a, b) => b.mtimeMs - a.mtimeMs);
  return files[0] || null;
}

function formatBytes(bytes) {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!options.url) {
    usage();
    process.exit(1);
  }

  const duration = String(Number(options.duration || 30));
  if (!Number.isFinite(Number(duration)) || Number(duration) <= 0) {
    throw new Error("--duration must be a positive number");
  }

  const slug = options.slug || slugFromUrl(options.url);
  const projectDir = resolve(
    options["project-dir"] || join(homedir(), "tocayo-outreach-videos", slug),
  );
  mkdirSync(projectDir, { recursive: true });

  if (!existsSync(join(projectDir, "meta.json"))) {
    run("npx", ["-y", "hyperframes", "init", ".", "--example", "blank", "--skip-skills", "--non-interactive"], {
      cwd: projectDir,
    });
  }

  if (!existsSync(join(projectDir, "node_modules", "playwright"))) {
    run("npm", ["install", "--no-save", "playwright"], { cwd: projectDir });
  }
  run("npx", ["playwright", "install", "chromium"], { cwd: projectDir });

  mkdirSync(join(projectDir, "scripts"), { recursive: true });
  copyFileSync(join(scriptDir, "capture-desktop.mjs"), join(projectDir, "scripts", "capture-desktop.mjs"));

  const capture = run("node", ["scripts/capture-desktop.mjs"], {
    cwd: projectDir,
    env: { ...process.env, PROSPECT_URL: options.url },
    capture: true,
  });
  const match = capture.stdout.match(/scrollEnd \(translateY\):\s*(-?\d+)/);
  if (!match) {
    throw new Error("Could not find scrollEnd in capture output");
  }

  const template = readFileSync(join(skillDir, "references", "composition-template.html"), "utf8");
  const html = template.replaceAll("__DURATION__", duration).replaceAll("__SCROLL_END__", match[1]);
  writeFileSync(join(projectDir, "index.html"), html);

  run("npx", ["-y", "hyperframes", "lint"], { cwd: projectDir });
  run("npx", ["-y", "hyperframes", "validate"], { cwd: projectDir });
  run("npx", ["-y", "hyperframes", "inspect"], { cwd: projectDir });
  run("npx", ["-y", "hyperframes", "render"], { cwd: projectDir });

  const rendered = latestMp4(join(projectDir, "renders"));
  if (!rendered) {
    throw new Error("Render completed but no MP4 was found in renders/");
  }

  console.log(`Rendered: ${rendered.path}`);
  console.log(`Size: ${formatBytes(rendered.size)}; Duration: ${duration}s; Resolution: 1920x1080`);
  console.log(
    JSON.stringify(
      {
        live_url: options.url,
        mp4_path: rendered.path,
        size_bytes: rendered.size,
        duration_seconds: Number(duration),
        resolution: "1920x1080",
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(`ERROR: ${error.message}`);
  process.exit(1);
});
