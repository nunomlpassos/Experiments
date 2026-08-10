import { mkdir, copyFile, cp, rm } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
const files = ["index.html", "game.js", "styles.css"];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const file of files) {
  await copyFile(join(root, file), join(dist, file));
}

await cp(join(root, "assets"), join(dist, "assets"), { recursive: true });
