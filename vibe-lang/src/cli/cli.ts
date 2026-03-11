#!/usr/bin/env npx tsx

import { readFileSync, mkdirSync, writeFileSync, existsSync } from "fs";
import { execSync } from "child_process";
import { resolve } from "path";
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

/** Build a reverse source map from Lua output: lua line → vibe line. */
function buildReverseMap(lua: string): Map<number, number> {
  const map = new Map<number, number>();
  const lines = lua.split("\n");
  let currentVibeLine = 0;
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/-- @vibe:(\d+)/);
    if (match) {
      currentVibeLine = parseInt(match[1], 10);
    } else if (currentVibeLine > 0) {
      map.set(i + 1, currentVibeLine); // Lua lines are 1-indexed
    }
  }
  return map;
}

/** Translate Lua error messages to Vibe source locations. */
function translateError(stderr: string, reverseMap: Map<number, number>, vibeFile: string): string {
  // Pattern: main.lua:47: error message
  return stderr.replace(/main\.lua:(\d+)/g, (_match, luaLine) => {
    const vibeLine = reverseMap.get(parseInt(luaLine, 10));
    if (vibeLine) {
      return `${vibeFile}:${vibeLine}`;
    }
    return _match;
  });
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
    const { mainLua, confLua, preludeLua } = compile(source, filePath, { sourceMap: true });

    const buildDir = resolve("build");
    mkdirSync(buildDir, { recursive: true });
    writeFileSync(resolve(buildDir, "vibe_runtime.lua"), preludeLua);
    writeFileSync(resolve(buildDir, "main.lua"), `require("vibe_runtime")\n${mainLua}`);
    writeFileSync(resolve(buildDir, "conf.lua"), confLua);

    const reverseMap = buildReverseMap(mainLua);

    const lovePath = findLove();
    try {
      execSync(`"${lovePath}" ${buildDir}`, { stdio: ["inherit", "inherit", "pipe"] });
    } catch (loveErr: any) {
      // Translate Lua errors to Vibe line numbers
      const stderr = loveErr.stderr?.toString() || "";
      if (stderr) {
        console.error(translateError(stderr, reverseMap, filePath));
      }
      process.exit(1);
    }
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
