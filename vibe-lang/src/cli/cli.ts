#!/usr/bin/env npx tsx

import { readFileSync, mkdirSync, writeFileSync, existsSync } from "fs";
import { execSync } from "child_process";
import { resolve, dirname } from "path";
import { compile } from "../pipeline.js";
import { VibeError } from "../errors.js";

/** Find the LÖVE executable across platforms. */
function findLove(): string {
  // Check PATH first
  try {
    execSync("which love", { stdio: "ignore" });
    return "love";
  } catch {}
  // macOS .app bundle
  const macPath = "/Applications/love.app/Contents/MacOS/love";
  if (existsSync(macPath)) return macPath;
  return "love"; // fallback
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.length < 2 || args[0] !== "run") {
    console.log("Usage: vibe run <file.vibe>");
    process.exit(1);
  }

  const filePath = args[1];

  try {
    const source = readFileSync(filePath, "utf-8");
    const { mainLua, confLua } = compile(source, filePath);

    const buildDir = resolve("build");
    mkdirSync(buildDir, { recursive: true });
    writeFileSync(resolve(buildDir, "main.lua"), mainLua);
    writeFileSync(resolve(buildDir, "conf.lua"), confLua);

    const lovePath = findLove();
    execSync(`"${lovePath}" ${buildDir}`, { stdio: "inherit" });
  } catch (err) {
    if (err instanceof VibeError) {
      console.error(err.format());
      process.exit(1);
    }
    console.error(`internal error: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(2);
  }
}

main();
