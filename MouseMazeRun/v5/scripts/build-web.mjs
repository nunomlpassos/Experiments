import { mkdir, copyFile, readFile, rm } from "node:fs/promises";
import { dirname, join, normalize } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
const files = ["index.html", "game.js", "styles.css", "levels.generated.js"];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const file of files) {
  await copyFile(join(root, file), join(dist, file));
}

const assetReferences = new Set();
for (const file of ["index.html", "game.js", "styles.css"]) {
  const source = await readFile(join(root, file), "utf8");
  for (const match of source.matchAll(/assets\/([^"'()\s?]+)(?:\?[^"'()\s]*)?/g)) {
    const relativePath = normalize(match[1]);
    if (relativePath.startsWith("..")) {
      throw new Error(`Asset reference escapes the assets folder: ${match[0]}`);
    }
    assetReferences.add(relativePath);
  }
}

for (const relativePath of assetReferences) {
  const source = join(root, "assets", relativePath);
  const destination = join(dist, "assets", relativePath);
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(source, destination);
}

console.log(`Built web package with ${assetReferences.size} referenced assets.`);
