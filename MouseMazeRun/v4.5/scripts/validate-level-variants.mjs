import { readFile } from "node:fs/promises";
import vm from "node:vm";

const source = await readFile(new URL("../game.js", import.meta.url), "utf8");
const generatedLevels = await readFile(
  new URL("../levels.generated.js", import.meta.url),
  "utf8",
);
const gameWithoutBootstrap = source.replace(
  /\ninitializeEconomySystem\(\);[\s\S]*$/,
  "\n",
);

function createElement() {
  const classes = new Set();
  return {
    addEventListener() {},
    append() {},
    classList: {
      add(...names) { names.forEach((name) => classes.add(name)); },
      contains(name) { return classes.has(name); },
      remove(...names) { names.forEach((name) => classes.delete(name)); },
      toggle(name, force) {
        const enabled = force === undefined ? !classes.has(name) : Boolean(force);
        if (enabled) classes.add(name);
        else classes.delete(name);
        return enabled;
      },
    },
    disabled: false,
    dataset: {},
    hidden: false,
    offsetWidth: 0,
    style: { setProperty() {} },
    addEventListener() {},
    getAttribute() { return null; },
    getBoundingClientRect: () => ({ width: 0, height: 0 }),
    getContext: () => ({}),
    removeAttribute() {},
    setAttribute() {},
    textContent: "",
  };
}

const elements = new Map();
const sandbox = {
  Image: class { addEventListener() {} },
  ResizeObserver: class { observe() {} },
  cancelAnimationFrame() {},
  clearTimeout() {},
  console,
  crypto: { getRandomValues(values) { values[0] = 123456789; return values; } },
  document: {
    querySelector(selector) {
      if (!elements.has(selector)) elements.set(selector, createElement());
      return elements.get(selector);
    },
    querySelectorAll() { return []; },
  },
  globalThis: null,
  localStorage: { getItem() { return null; }, removeItem() {}, setItem() {} },
  requestAnimationFrame() { return 1; },
  setTimeout() { return 1; },
};
sandbox.globalThis = sandbox;

const verification = `
globalThis.__unlockAllPowersForValidation = true;
const expectedCodes = [
  "T", "Mf", "F", "N", "F", "N", "D", "D", "Md", "Md", "F", "E", "Md", "Md",
  "D", "N", "Md", "Md", "D", "F", "N", "Md", "Md", "E", "Md", "E", "E", "I",
  "N", "D", "D", "Md", "D", "E", "E", "I", "D",
  "Md", "E", "E", "I", "Md",
];
if (LEVEL_CONFIGS.length !== 42 || WORLD_LEVELS.length !== 42) {
  throw new Error("The campaign must contain 42 levels through the water section");
}
if (LEVEL_CONFIGS.some((config, index) => config?.difficultyCode !== expectedCodes[index])) {
  throw new Error("The two-section difficulty curve does not match the agreed plan");
}
if (
  LEVEL_CONFIGS[14]?.cockroachMode !== "single" ||
  LEVEL_CONFIGS[14]?.difficultyCode !== "D" ||
  LEVEL_CONFIGS[14]?.cheeseCount !== 2 ||
  LEVEL_CONFIGS[15]?.cockroachMode !== "repeat" ||
  LEVEL_CONFIGS[15]?.difficultyCode !== "N" ||
  LEVEL_CONFIGS[15]?.cheeseCount !== 1 ||
  LEVEL_CONFIGS[15]?.milkCount !== 2 ||
  !LEVEL_CONFIGS[16]?.hammerIntro ||
  LEVEL_CONFIGS[17]?.hingedWallCount !== 2 ||
  LEVEL_CONFIGS[18]?.pieCount !== 1 ||
  !LEVEL_CONFIGS[20]?.shape ||
  LEVEL_CONFIGS[21]?.rockCount !== 3 ||
  !LEVEL_CONFIGS[22]?.fishingIntro ||
  LEVEL_CONFIGS[23]?.pieCount !== 1 ||
  !LEVEL_CONFIGS[24]?.catPawIntro ||
  LEVEL_CONFIGS[25]?.hingedWallCount !== 2 ||
  !LEVEL_CONFIGS[26]?.rocketIntro ||
  LEVEL_CONFIGS[26]?.milkCount !== 2 ||
  LEVEL_CONFIGS[27]?.difficultyCode !== "I" ||
  adversitiesForVariant(LEVEL_CONFIGS[27], 0).length !== 2 ||
  LEVEL_CONFIGS[27]?.cheeseCount !== 3 ||
  POWER_UNLOCK_LEVELS.hammer !== 17 ||
  POWER_UNLOCK_LEVELS.fishing !== 23 ||
  POWER_UNLOCK_LEVELS.rocket !== 27
) {
  throw new Error("The second section introductions or power unlock levels are misplaced");
}
if (
  LEVEL_CONFIGS[28]?.difficultyCode !== "N" ||
  LEVEL_CONFIGS[29]?.difficultyCode !== "D" ||
  LEVEL_CONFIGS[29]?.tunnelCount !== 3 ||
  !LEVEL_CONFIGS[29]?.tunnelIntro ||
  LEVEL_CONFIGS[30]?.difficultyCode !== "D" ||
  LEVEL_CONFIGS[31]?.difficultyCode !== "Md" ||
  LEVEL_CONFIGS[32]?.difficultyCode !== "D" ||
  LEVEL_CONFIGS[32]?.rotatingCircuitCount !== 1 ||
  !LEVEL_CONFIGS[32]?.rotatingTilesIntro ||
  LEVEL_CONFIGS[33]?.difficultyCode !== "E" ||
  LEVEL_CONFIGS[33]?.rotatingCircuitCount !== 1 ||
  LEVEL_CONFIGS[34]?.difficultyCode !== "E" ||
  !LEVEL_CONFIGS[34]?.crowIntro ||
  adversitiesForVariant(LEVEL_CONFIGS[34], 0).join(",") !== "crow" ||
  LEVEL_CONFIGS[36]?.difficultyCode !== "D" ||
  LEVEL_CONFIGS[36]?.cloudMode !== "intro" ||
  adversitiesForVariant(LEVEL_CONFIGS[36], 0).length !== 0 ||
  LEVEL_CONFIGS[37]?.difficultyCode !== "Md" ||
  LEVEL_CONFIGS[38]?.difficultyCode !== "E" ||
  LEVEL_CONFIGS[39]?.difficultyCode !== "E" ||
  LEVEL_CONFIGS[39]?.waterMode !== "intro" ||
  !LEVEL_CONFIGS[39]?.waterIntro ||
  adversitiesForVariant(LEVEL_CONFIGS[39], 0).length !== 0 ||
  LEVEL_CONFIGS[40]?.difficultyCode !== "I" ||
  LEVEL_CONFIGS[40]?.waterMode !== "advanced" ||
  adversitiesForVariant(LEVEL_CONFIGS[40], 0).length !== 0 ||
  LEVEL_CONFIGS[41]?.difficultyCode !== "Md" ||
  Boolean(LEVEL_CONFIGS[41]?.waterMode)
) {
  throw new Error("The third-section difficulty curve or mechanic introductions are misplaced");
}
for (const [variantIndex, tunnelVariant] of globalThis.__MOUSE_MAZE_PREGENERATED_LEVELS__[29].entries()) {
  const tunnelKeys = new Set((tunnelVariant.tunnels ?? []).map(keyOf));
  const occupiedKeys = new Set([
    keyOf(tunnelVariant.start),
    ...(tunnelVariant.exits ?? []).map(keyOf),
    ...(tunnelVariant.milkBottles ?? []).map(keyOf),
    ...(tunnelVariant.rocks ?? []).map(keyOf),
    ...pieFootprintCells(tunnelVariant.pie).map(keyOf),
    ...(tunnelVariant.car ? [keyOf(tunnelVariant.car)] : []),
  ]);
  const requiredRouteKeys = new Set((tunnelVariant.path ?? []).map(keyOf));
  const tunnelTooCloseToStart = (tunnelVariant.tunnels ?? []).some(
    (tunnel) =>
      Math.abs(tunnel.row - tunnelVariant.start.row) +
        Math.abs(tunnel.col - tunnelVariant.start.col) <
      3,
  );
  if (
    tunnelKeys.size !== 3 ||
    [...tunnelKeys].some((key) => occupiedKeys.has(key)) ||
    [...tunnelKeys].some((key) => requiredRouteKeys.has(key)) ||
    tunnelTooCloseToStart ||
    tunnelVariant.tunnelsOptional !== true
  ) {
    throw new Error("Level 30 variant " + (variantIndex + 1) + " has invalid tunnel placement");
  }
}
for (const [variantIndex, rotatingVariant] of globalThis.__MOUSE_MAZE_PREGENERATED_LEVELS__[32].entries()) {
  const circuit = rotatingVariant.rotatingCircuits?.[0];
  const circuitKeys = new Set((circuit?.cells ?? []).map(keyOf));
  const occupiedKeys = new Set([
    keyOf(rotatingVariant.start),
    ...(rotatingVariant.milkBottles ?? []).map(keyOf),
    ...(rotatingVariant.rocks ?? []).map(keyOf),
    ...pieFootprintCells(rotatingVariant.pie).map(keyOf),
    ...(rotatingVariant.tunnels ?? []).map(keyOf),
    ...(rotatingVariant.car ? [keyOf(rotatingVariant.car)] : []),
  ]);
  const invalidCell = (circuit?.cells ?? []).some(
    (cell) =>
      !rotatingVariant.grid?.[cell.row]?.[cell.col]?.active ||
      cell.row <= 0 ||
      cell.row >= (LEVEL_CONFIGS[32]?.rows ?? 9) - 1 ||
      cell.col <= 0 ||
      cell.col >= (LEVEL_CONFIGS[32]?.cols ?? 9) - 1,
  );
  if (
    rotatingVariant.rotatingCircuits?.length !== 1 ||
    circuitKeys.size !== 8 ||
    circuit?.tiles?.length !== 8 ||
    invalidCell ||
    [...circuitKeys].some((key) => occupiedKeys.has(key)) ||
    !rotatingVariant.exits?.some((target) => circuitKeys.has(keyOf(target)))
  ) {
    throw new Error("Level 33 variant " + (variantIndex + 1) + " has an invalid rotating circuit");
  }
}
globalThis.__unlockAllPowersForValidation = false;
worldProgress.unlockedLevel = 28;
powerIntroTutorialUnlockedForRun = new Set();
level = 17;
if (isPowerUnlocked("hammer")) {
  throw new Error("The Hammer must stay locked until its level-17 tutorial begins");
}
powerIntroTutorialUnlockedForRun.add("hammer");
if (!isPowerUnlocked("hammer")) {
  throw new Error("The Hammer must unlock when its level-17 tutorial begins");
}
powerIntroTutorialUnlockedForRun = new Set();
level = 23;
if (isPowerUnlocked("fishing")) {
  throw new Error("The Fishing Rod must stay locked until its level-23 tutorial begins");
}
powerIntroTutorialUnlockedForRun.add("fishing");
if (!isPowerUnlocked("fishing")) {
  throw new Error("The Fishing Rod must unlock when its level-23 tutorial begins");
}
powerIntroTutorialUnlockedForRun = new Set();
level = 27;
if (isPowerUnlocked("rocket")) {
  throw new Error("The Rocket must stay locked until its level-27 tutorial begins");
}
powerIntroTutorialUnlockedForRun.add("rocket");
if (!isPowerUnlocked("rocket")) {
  throw new Error("The Rocket must unlock when its level-27 tutorial begins");
}
globalThis.__unlockAllPowersForValidation = true;
level = 1;
if (
  COCKROACH_JUMPS.length !== 16 ||
  COCKROACH_JUMPS.filter((jump) => jump.distance === 1).length !== 8 ||
  COCKROACH_JUMPS.filter((jump) => jump.distance === 2).length !== 8 ||
  COCKROACH_JUMPS.some((jump) =>
    ![1, 2].includes(Math.max(Math.abs(jump.row), Math.abs(jump.col))) ||
    jump.distance !== Math.max(Math.abs(jump.row), Math.abs(jump.col))
  )
) {
  throw new Error("The cockroach must support eight directions at one or two squares");
}
if (
  COCKROACH_MIN_TRIGGER_MOVES !== 7 ||
  COCKROACH_MAX_TRIGGER_MOVES !== 10 ||
  Array.from({ length: 80 }, randomCockroachTrigger).some(
    (trigger) => trigger < 7 || trigger > 10
  )
) {
  throw new Error("The cockroach must return after 7, 8, 9, or 10 mouse movements");
}
level = 27;
setGridDimensions(LEVEL_CONFIGS[26]);
mouse = { row: 0, col: 4 };
const pawOptions = catPawThreatOptions();
const topPawOptions = pawOptions.filter((option) => option.side === "top");
if (
  CAT_PAW_TRIGGER_MOVES.join(",") !== "10,15,20" ||
  pawOptions.length !== (COLS - 1) * 2 + (ROWS - 1) * 2 ||
  pawOptions.some((option) =>
    option.cells.length !== 6 ||
    option.cells.some((cell) => !isInside(cell.row, cell.col)) ||
    (["top", "bottom"].includes(option.side)
      ? new Set(option.cells.map((cell) => cell.row)).size !== 3 ||
        new Set(option.cells.map((cell) => cell.col)).size !== 2
      : new Set(option.cells.map((cell) => cell.row)).size !== 2 ||
        new Set(option.cells.map((cell) => cell.col)).size !== 3)
  ) ||
  !topPawOptions.some((option) => catPawThreatContains(option, mouse))
) {
  throw new Error("The cat paw must use 2x3 top/bottom or 3x2 side areas and 10, 15, or 20 move triggers");
}
level = 35;
setGridDimensions(LEVEL_CONFIGS[34]);
const crowVariant = buildLevelVariant(LEVEL_CONFIGS[34], 0);
maze = crowVariant.grid;
mouse = { ...crowVariant.start };
const crowOptions = crowThreatOptions();
const exposedCrowTarget = crowOptions
  .flatMap((option) => option.cells)
  .find(crowCanCatchCell);
if (exposedCrowTarget) mouse = { ...exposedCrowTarget };
const directedCrowThreat = chooseCrowThreat();
const escapedCrowPosition = crowOptions
  .flatMap((option) => option.cells)
  .find(
    (cell) =>
      directedCrowThreat &&
      !crowThreatContains(directedCrowThreat, cell)
  );
if (escapedCrowPosition) {
  activeLevelConfig = { ...LEVEL_CONFIGS[34], crowMode: true };
  crowThreat = directedCrowThreat;
  mouse = { ...escapedCrowPosition };
  crowMovesSinceStrike = 0;
  crowNextTrigger = 2;
  advanceCrowClockAfterMouseMove();
  activeLevelConfig = null;
}
const fixedCrowThreat = crowThreat;
const internalWalledCrowTarget = crowOptions
  .flatMap((option) => option.cells)
  .find((cell) => {
    const walls = maze?.[cell.row]?.[cell.col]?.walls;
    return walls && DIRS.some((direction) => Boolean(walls[direction.wall]));
  });
const shelteredCrowTarget = { row: 0, col: Math.min(2, COLS - 1) };
if (
  CROW_TRIGGER_MOVES.join(",") !== "10,12,14" ||
  !crowOptions.length ||
  !exposedCrowTarget ||
  !directedCrowThreat ||
  !crowThreatContains(directedCrowThreat, exposedCrowTarget) ||
  !escapedCrowPosition ||
  !fixedCrowThreat ||
  fixedCrowThreat.startRow !== directedCrowThreat.startRow ||
  fixedCrowThreat.startCol !== directedCrowThreat.startCol ||
  !crowCellTouchesOuterWall(shelteredCrowTarget) ||
  crowCanCatchCell(shelteredCrowTarget) ||
  !internalWalledCrowTarget ||
  crowCellTouchesOuterWall(internalWalledCrowTarget) ||
  !crowCanCatchCell(internalWalledCrowTarget) ||
  crowOptions.some((option) =>
    option.cells.length !== 9 ||
    option.cells.some((cell) => !isInside(cell.row, cell.col)) ||
    crowThreatCells(option.startRow - 1, option.startCol - 1, 5).some(
      (cell) => !isInside(cell.row, cell.col)
    )
  )
) {
  throw new Error("The crow must keep its strike fixed, catch beside internal walls, and spare only the outer border");
}
if (
  LEVEL_CONFIGS[35]?.difficultyCode !== "I" ||
  LEVEL_CONFIGS[35]?.tunnelCount !== 3 ||
  LEVEL_CONFIGS[35]?.rotatingCircuitCount !== 1 ||
  Array.from({ length: VARIANTS_PER_LEVEL }, (_, variantIndex) =>
    adversitiesForVariant(LEVEL_CONFIGS[35], variantIndex).length
  ).some((count) => count !== 2)
) {
  throw new Error("Level 36 must combine tunnels, rotating floors, and two adversities");
}
level = 15;
setGridDimensions(LEVEL_CONFIGS[14]);
const cockroachVariant = buildLevelVariant(LEVEL_CONFIGS[14], 0);
maze = cockroachVariant.grid;
mouse = { ...cockroachVariant.start };
cheeseTargets = cockroachVariant.exits.map((target) => ({ ...target }));
collectedCheeseKeys = new Set();
milkBottles = [];
pie = null;
car = null;
rockPositions = [];
hiddenCheeseKeys = new Set();
const cockroachOptions = cockroachDestinationOptions();
if (
  !cockroachOptions.length ||
  cockroachOptions.some((option) =>
    !isInside(option.to.row, option.to.col) ||
    ![1, 2].includes(Math.max(
      Math.abs(option.to.row - option.from.row),
      Math.abs(option.to.col - option.from.col),
    ))
  )
) {
  throw new Error("The cockroach does not have valid one- or two-square destinations");
}
const cheesesBeforeCockroach = cheeseTargets.map(keyOf);
movesLeft = 20;
cockroachActionsUsed = 0;
cockroachMovesSinceAction = 7;
cockroachNextTrigger = 7;
if (
  !maybeStartCockroach() ||
  cockroachActionsUsed !== 1 ||
  movesLeft !== 20 ||
  cheeseTargets.map(keyOf).every((key, index) => key === cheesesBeforeCockroach[index])
) {
  throw new Error("The cockroach event must relocate one cheese without spending a move");
}
level = 16;
setGridDimensions(LEVEL_CONFIGS[15]);
const recurringCockroachVariant = buildLevelVariant(LEVEL_CONFIGS[15], 0);
maze = recurringCockroachVariant.grid;
mouse = { ...recurringCockroachVariant.start };
cheeseTargets = recurringCockroachVariant.exits.map((target, index) => ({
  ...target,
  id: "cheese-" + index,
}));
exit = cheeseTargets[0] ? { ...cheeseTargets[0] } : null;
collectedCheeseKeys = new Set();
milkBottles = recurringCockroachVariant.milkBottles.map((bottle) => ({
  ...bottle,
  knocked: false,
  direction: null,
  spill: null,
}));
collectedMilkIds = new Set();
pie = null;
car = null;
rockPositions = [];
hiddenCheeseKeys = new Set();
const bottleOption = cockroachDestinationOptions().find((option) => option.kind === "milk");
const bottleOptions = cockroachDestinationOptions().filter((option) => option.kind === "milk");
if (
  !bottleOption ||
  cockroachActionLimit() !== Number.POSITIVE_INFINITY ||
  bottleOptions.some((option) =>
    !cockroachCanLeaveBottleUsable(option.bottleId, option.to)
  )
) {
  throw new Error("Level 16 must let the recurring cockroach target unopened milk bottles");
}
const bottleBeforeCockroach = milkBottles.find((bottle) => bottle.id === bottleOption.bottleId);
const originalBottleKey = keyOf(bottleBeforeCockroach);
movesLeft = 20;
cockroachActionsUsed = 0;
startCockroachAnimation(bottleOption);
if (
  keyOf(bottleBeforeCockroach) === originalBottleKey ||
  bottleBeforeCockroach.knocked ||
  movesLeft !== 20 ||
  cockroachActionsUsed !== 1
) {
  throw new Error("The recurring cockroach must move a standing milk bottle without spilling it or spending a move");
}
cheeseTargets = recurringCockroachVariant.exits.map((target, index) => ({
  ...target,
  id: "cheese-" + index,
}));
exit = cheeseTargets[0] ? { ...cheeseTargets[0] } : null;
collectedCheeseKeys = new Set();
const cheeseOption = cockroachDestinationOptions().find((option) => option.kind === "cheese");
if (!cheeseOption) throw new Error("The recurring cockroach needs a movable cheese option");
startCockroachAnimation(cheeseOption);
const relocatedCheese = cheeseTargets[cheeseOption.targetIndex];
if (
  keyOf(relocatedCheese) === keyOf(cheeseOption.from) ||
  cheeseIdentity(relocatedCheese) !== "cheese-" + cheeseOption.targetIndex ||
  keyOf(exit) !== keyOf(relocatedCheese)
) {
  throw new Error("A relocated cheese must preserve its identity and become the active destination");
}
collectedCheeseKeys.add(cheeseIdentity(relocatedCheese));
syncActiveExit();
if (remainingCheeseTargets().length !== 0) {
  throw new Error("A relocated cheese must stay collected instead of reappearing at either position");
}
if (LEVEL_CONFIGS[0].rows !== 5 || LEVEL_CONFIGS[0].cols !== 5) {
  throw new Error("Level 1 must remain the centered 5 x 5 tutorial");
}
if (!LEVEL_CONFIGS[2].milkCount || !LEVEL_CONFIGS[4].milkCount || LEVEL_CONFIGS[4].cheeseCount !== 2) {
  throw new Error("Milk and combined objectives are not introduced at the agreed levels");
}
if (!LEVEL_CONFIGS[8].carMode || !LEVEL_CONFIGS[9].carMode) {
  throw new Error("The remote-control catcher must start at level 9");
}
const captureRuleCases = [
  { label: "same square", mouseFrom: { row: 2, col: 2 }, mouseTo: { row: 2, col: 3 }, carFrom: { row: 2, col: 4 }, carTo: { row: 2, col: 3 }, expected: true },
  { label: "crossed paths", mouseFrom: { row: 2, col: 2 }, mouseTo: { row: 2, col: 3 }, carFrom: { row: 2, col: 3 }, carTo: { row: 2, col: 2 }, expected: true },
  { label: "adjacent finish", mouseFrom: { row: 2, col: 2 }, mouseTo: { row: 2, col: 3 }, carFrom: { row: 2, col: 5 }, carTo: { row: 2, col: 4 }, expected: true },
  { label: "successful escape", mouseFrom: { row: 2, col: 2 }, mouseTo: { row: 1, col: 2 }, carFrom: { row: 2, col: 3 }, carTo: { row: 2, col: 3 }, expected: false },
  { label: "diagonal finish", mouseFrom: { row: 2, col: 2 }, mouseTo: { row: 1, col: 2 }, carFrom: { row: 3, col: 3 }, carTo: { row: 2, col: 3 }, expected: false },
];
const captureGrid = Array.from({ length: 7 }, (_, row) =>
  Array.from({ length: 7 }, (_, col) => ({
    row,
    col,
    walls: { top: false, right: false, bottom: false, left: false },
  }))
);
for (const testCase of captureRuleCases) {
  if (carCatchesMouse(captureGrid, testCase.mouseFrom, testCase.mouseTo, testCase.carFrom, testCase.carTo) !== testCase.expected) {
    throw new Error("Incorrect catcher rule for " + testCase.label);
  }
}
if (!LEVEL_CONFIGS[10].rockMode || !LEVEL_CONFIGS[11].rockMode) {
  throw new Error("Rocks must start at level 11");
}
if (!LEVEL_CONFIGS[12].tornadoIntro || LEVEL_CONFIGS[13].hingedWallCount !== 1) {
  throw new Error("Tornado and hinged-wall introductions are misplaced");
}
if (
  MAX_OBJECTIVES_PER_LEVEL !== 6 ||
  MAX_MILK_BOTTLES_PER_LEVEL !== 2 ||
  MAX_ROCKS_PER_LEVEL !== 3 ||
  MAX_HINGED_WALLS_PER_LEVEL !== 5 ||
  LEVEL_CONFIGS.some((config) => config &&
    (config.cheeseCount ?? (config.pieCount ? 0 : 1)) +
    (config.milkCount ?? 0) +
    (config.pieCount ?? 0) * 4 > MAX_OBJECTIVES_PER_LEVEL) ||
  LEVEL_CONFIGS.some((config) =>
    (config.milkCount ?? 0) > MAX_MILK_BOTTLES_PER_LEVEL ||
    (config.rockCount ?? 0) > MAX_ROCKS_PER_LEVEL ||
    (config.hingedWallCount ?? 0) > MAX_HINGED_WALLS_PER_LEVEL
  )
) {
  throw new Error("A level exceeds the global mechanic limits");
}
levelVariantStates[0] = { current: 0, remaining: [3, 4] };
if (takeRetryVariant(0) !== 1 || takeRetryVariant(0) !== 2 || takeRetryVariant(0) !== 3 ||
    takeRetryVariant(0) !== 4 || takeRetryVariant(0) !== 0) {
  throw new Error("Retries must cycle through every variant before returning to the original");
}
const emptyProgress = defaultWorldProgress();
if ("stars" in emptyProgress || emptyProgress.completedLevels.some(Boolean)) {
  throw new Error("World progress must use completion state without star ratings");
}

globalThis.__variantValidation = LEVEL_CONFIGS.map((config, levelIndex) => {
  if (!config) return { level: levelIndex + 1, code: "locked", variants: [] };
  const signatures = new Set();
  const variants = [];
  for (let variantIndex = 0; variantIndex < VARIANTS_PER_LEVEL; variantIndex += 1) {
    const variant = buildLevelVariant(config, variantIndex);
    const variantConfig = resolveLevelConfigForVariant(config, variantIndex);
    const expectedRows = config.rows ?? 11;
    const expectedCols = config.cols ?? 9;
    if (
      variant.grid.length !== expectedRows ||
      variant.grid.some((row) => row.length !== expectedCols)
    ) {
      throw new Error(
        "Grid dimensions do not match level " + (levelIndex + 1) +
        ": expected " + expectedRows + "x" + expectedCols +
        ", received " + variant.grid.length + "x" + (variant.grid[0]?.length ?? 0)
      );
    }
    const distance = variant.path.length - 1;
    const signature = variant.grid.flat().map((cell) =>
      [cell.walls.top, cell.walls.right, cell.walls.bottom, cell.walls.left]
        .map(Number).join("")
    ).join("") + ":" + keyOf(variant.start) + ":" +
      (variant.exits ?? []).map(keyOf).sort().join(";") + ":" +
      (variant.milkBottles ?? []).map(keyOf).sort().join(";") + ":" +
      (variant.pie ? keyOf(variant.pie) : "") + ":" +
      (variant.car ? keyOf(variant.car) : "");
    if (signatures.has(signature)) throw new Error("Duplicate variant in level " + (levelIndex + 1));
    signatures.add(signature);
    if (variant.moveLimit < distance || keyOf(variant.path[0]) !== keyOf(variant.start)) {
      throw new Error("Invalid route budget in level " + (levelIndex + 1));
    }
    if (config.milkCount) {
      if (
        variant.milkBottles.length !== config.milkCount ||
        variant.exits.length !== (config.cheeseCount ?? 0) ||
        !variant.objectiveSolution ||
        variant.objectiveSolution.actions.filter((action) => action.type === "knock").length !== config.milkCount
      ) throw new Error("Invalid milk puzzle in level " + (levelIndex + 1));
    }
    if (variantConfig.carMode) {
      if (!variant.car) {
        throw new Error("Invalid catcher puzzle in level " + (levelIndex + 1));
      }
      if (
        variant.car.row === 0 ||
        variant.car.row === config.rows - 1 ||
        variant.car.col === 0 ||
        variant.car.col === config.cols - 1
      ) {
        throw new Error("Catcher touches the outer frame in level " + (levelIndex + 1));
      }
      if (variant.carSolution && variant.carSolution.path.length !== variant.carSolution.carPath.length) {
        throw new Error("Catcher solution paths differ in level " + (levelIndex + 1));
      }
      if (
        variant.carSolution &&
        variant.carSolution.path.some((cell, index) => {
          if (index === 0) return false;
          const carCell = variant.carSolution.carPath[index];
          return carCatchesMouse(
            variant.grid,
            variant.carSolution.path[index - 1],
            cell,
            variant.carSolution.carPath[index - 1],
            carCell,
          );
        })
      ) {
        throw new Error("Catcher reaches the required solution's danger zone in level " + (levelIndex + 1));
      }
    }
    if (config.rockMode && (!variant.rockSolution || variant.rockSolution.pushes < 1)) {
      throw new Error("Invalid rock puzzle in level " + (levelIndex + 1));
    }
    if (config.hingedWallCount && (!variant.hingedSolution || variant.hingedWalls.length !== config.hingedWallCount)) {
      throw new Error("Invalid hinged-wall puzzle in level " + (levelIndex + 1));
    }
    if (config.pieCount) {
      const footprint = new Set(variant.pie.quarters.map(keyOf));
      if (
        !variant.pieSolution ||
        variant.pie.quarters.length !== 4 ||
        variant.pieSolution.actions.filter((action) => action.type === "bite").length !== 4 ||
        variant.pieSolution.path.some((cell) => footprint.has(keyOf(cell)))
      ) {
        throw new Error("Invalid four-quarter pie puzzle in level " + (levelIndex + 1));
      }
    }
    variants.push({
      variant: variantIndex + 1,
      distance,
      moveLimit: variant.moveLimit,
      start: keyOf(variant.start),
      cheeses: (variant.exits ?? []).map(keyOf),
      milk: (variant.milkBottles ?? []).map(keyOf),
      car: variant.car ? keyOf(variant.car) : null,
      pie: variant.pie ? keyOf(variant.pie) : null,
      attempt: variant.attempt,
    });
  }
  return { level: levelIndex + 1, code: config.difficultyCode, variants };
});

setGridDimensions({ rows: 7, cols: 7 });
maze = blankMaze();
for (let row = 0; row < ROWS; row += 1) {
  for (let col = 0; col < COLS; col += 1) {
    for (const direction of DIRS) {
      const next = { row: row + direction.row, col: col + direction.col };
      if (!isInside(next.row, next.col)) continue;
      maze[row][col].walls[direction.wall] = false;
      maze[next.row][next.col].walls[direction.opposite] = false;
    }
  }
}
mouse = { row: 3, col: 3 };
levelStart = { ...mouse };
cheeseTargets = [];
collectedCheeseKeys = new Set();
collectedMilkIds = new Set();
rockPositions = [];
hingedWalls = [];
car = null;
pie = null;
eatenPieQuarterIds = new Set();
milkBottles = [{ id: "fishing-milk", row: 2, col: 2, knocked: false, direction: null, spill: null }];
const fishingMilkTarget = getFishingCatchTargets().find((target) => target.kind === "milk");
if (
  !fishingMilkTarget?.mouseDestination ||
  !relocatedBottleRemainsUsable(
    fishingMilkTarget.bottleId,
    mouse,
    fishingMilkTarget.mouseDestination,
  )
) {
  throw new Error("Fishing must only retrieve a milk bottle when mouse and spill remain usable");
}
if (getRocketTargets().some((target) => keyOf(target) === keyOf(milkBottles[0]))) {
  throw new Error("Rocket landing targets must exclude milk bottles");
}

if (!LEVEL_CONFIGS[26]?.rocketIntro || POWER_UNLOCK_LEVELS.rocket !== 27) {
  throw new Error("Level 27 must introduce and unlock the rocket");
}
milkBottles = [{
  id: "rocket-milk",
  row: 0,
  col: 0,
  knocked: true,
  direction: "right",
  spill: { row: 3, col: 5 },
}];
level = 27;
moveLimit = 10;
movesLeft = 0;
const rocketMilkTutorialTarget = rocketTutorialOpportunity();
if (
  !rocketMilkTutorialTarget ||
  keyOf(rocketMilkTutorialTarget) !== "3,5" ||
  collectedMilkIds.size !== 0
) {
  throw new Error("Rocket tutorial must rescue the last spilled-milk objective at zero moves");
}

milkBottles = [];
pie = { row: 1, col: 4, quarters: pieQuarterBlueprint(1, 4) };
const fishingPieTarget = getFishingCatchTargets().find(
  (target) => target.kind === "pie" && target.pieQuarterId === "bottom-left",
);
const rocketPieTarget = getRocketTargets().find(
  (target) => target.kind === "pie" && target.pieQuarterId === "bottom-left",
);
if (!fishingPieTarget) {
  throw new Error("Fishing must be able to retrieve a pie quarter in diagonal range");
}
if (!rocketPieTarget || keyOf(rocketPieTarget.mouseDestination) !== "2,3") {
  throw new Error("Rocket must consume a pie quarter and use its valid lateral landing square");
}

level = 40;
activeLevelConfig = LEVEL_CONFIGS[39];
setGridDimensions(activeLevelConfig);
const waterVariant = buildLevelVariant(activeLevelConfig, 0);
maze = waterVariant.grid;
levelStart = { ...waterVariant.start };
mouse = { ...levelStart };
rockPositions = [];
cheeseTargets = (waterVariant.exits ?? [waterVariant.exit]).map((target) => ({ ...target }));
collectedCheeseKeys = new Set();
milkBottles = [];
pie = null;
waterMoveCount = 0;
floodedWaterKeys = new Set();
for (let moveIndex = 1; moveIndex < WATER_PREPARATION_MOVES; moveIndex += 1) {
  const advance = waterAdvanceForNextMove();
  if (advance.newKeys.length) throw new Error("Water must wait for four completed moves");
  commitWaterAdvance(advance);
}
const firstFlood = waterAdvanceForNextMove();
if (firstFlood.newKeys.join(",") !== keyOf(levelStart)) {
  throw new Error("Water must begin in the mouse start cell after move four");
}
commitWaterAdvance(firstFlood);
const expectedWaterFront = neighbors(maze, maze[levelStart.row][levelStart.col]).map(keyOf).sort();
const nextFlood = waterAdvanceForNextMove();
if (nextFlood.newKeys.slice().sort().join("|") !== expectedWaterFront.join("|")) {
  throw new Error("Water must branch through every open passage after preparation");
}
`;

vm.runInNewContext(generatedLevels + "\n" + gameWithoutBootstrap + verification, sandbox, {
  filename: "game.js",
  timeout: 120000,
});

for (const level of sandbox.__variantValidation) {
  if (!level.variants.length) {
    console.log(`Level ${level.level}: locked placeholder`);
    continue;
  }
  console.log(
    `Level ${level.level} (${level.code}): ` +
    level.variants.map((variant) =>
      `v${variant.variant} ${variant.distance}/${variant.moveLimit}` +
      `${variant.milk.length ? ` milk=${variant.milk.join("+")}` : ""}` +
      `${variant.car ? ` car=${variant.car}` : ""}`
      + `${variant.pie ? ` pie=${variant.pie}` : ""}`
    ).join(" | "),
  );
}
const validatedVariantCount = sandbox.__variantValidation.reduce(
  (total, level) => total + level.variants.length,
  0,
);
console.log(`Validated ${validatedVariantCount} fixed variants.`);
console.log("Validated milk, pie, catcher, cockroach, cat-paw, crow, cloud, water, rock, hinged-wall, transport-tunnel, and rotating-floor objectives.");
