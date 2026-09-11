import { mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";

const root = process.cwd();
const sourceRoot = join(root, "assets");
const outputRoot = join(sourceRoot, "runtime");
const assets = new Map([
  ["mouse.png", 512],
  ["milk-bottle.png", 512],
  ["milk-spill-up-sheet-green.png", 768],
  ["milk-spill-down-sheet-green.png", 768],
  ["pie.png", 512],
  ["tunnel.png", 512],
  ["rock.png", 512],
  ["rc-catcher.png", 512],
  ["cockroach.png", 512],
  ["cat-paw.png", 768],
  ["cat-attack-top-strip-v1.png", 1800],
  ["cat-attack-bottom-strip-v4.png", 1800],
  ["cat-attack-side-strip-v5.png", 1800],
  ["crow.png", 768],
  ["cloud.png", 768],
  ["world-start-burrow-v1.png", 768],
  ["world-start-burrow-background-v2.png", 768],
  ["crystal-power.png", 384],
  ["tornado-power.png", 384],
  ["hammer-power.png", 384],
  ["fishing-power-transparent-v2.png", 384],
  ["rocket-power.png", 384],
  ["cash-button.png", 256],
  ["mouse-walk-strip.png", 1024],
  ["mouse-walk-right-strip.png", 1024],
  ["mouse-walk-up-strip.png", 1024],
  ["mouse-walk-down-strip.png", 1024],
  ["mouse-eat-strip.png", 1024],
  ["mouse-sleep-strip.png", 1024],
  ["mouse-sniff-strip.png", 1024],
  ["mouse-drink-strip.png", 1152],
  ["mouse-milk-push-side-strip.png", 1152],
  ["mouse-milk-push-left-strip.png", 1152],
  ["mouse-milk-push-up-strip.png", 1152],
  ["mouse-milk-push-down-strip.png", 1152],
  ["milk-spill-action-strip.png", 2304],
  ["power-transform-crystal-strip.png", 2048],
  ["power-transform-tornado-strip-v2.png", 2048],
  ["power-transform-hammer-strip-v2.png", 2048],
  ["power-transform-fishing-strip-v3.png", 2048],
  ["power-transform-rocket-strip-v2.png", 2048],
  ["rc-catcher-capture-up-integrated-strip.png", 1280],
  ["rc-catcher-capture-down-integrated-strip.png", 1280],
  ["rc-catcher-capture-left-integrated-strip.png", 1280],
  ["rc-catcher-capture-right-integrated-strip.png", 1280],
  ["mouse-tunnel-enter-strip-v1.png", 1280],
  ["mouse-tunnel-exit-strip-v1.png", 1280],
]);

function run(command, args) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, { stdio: "inherit" });
    process.once("error", reject);
    process.once("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with code ${code}.`));
    });
  });
}

await mkdir(outputRoot, { recursive: true });
for (const [asset, maxDimension] of assets) {
  const source = join(sourceRoot, asset);
  const destination = join(outputRoot, asset);
  await mkdir(dirname(destination), { recursive: true });
  await run("ffmpeg", [
    "-hide_banner",
    "-loglevel",
    "error",
    "-y",
    "-i",
    source,
    "-vf",
    `scale='if(gte(iw,ih),min(iw,${maxDimension}),-2)':'if(gte(iw,ih),-2,min(ih,${maxDimension}))':flags=lanczos`,
    "-frames:v",
    "1",
    destination,
  ]);
  console.log(`Optimized ${asset} to a maximum of ${maxDimension}px.`);
}
