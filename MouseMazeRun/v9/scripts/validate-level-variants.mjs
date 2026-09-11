import { readFile } from "node:fs/promises";
import vm from "node:vm";

const source = await readFile(new URL("../game.js", import.meta.url), "utf8");
const generatedLevels = await readFile(
  new URL("../levels.generated.js", import.meta.url),
  "utf8",
);
const gameWithoutBootstrap = source.replace(
  /\ninitializePerformanceMetrics\(\);[\s\S]*$/,
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
    querySelector() { return createElement(); },
    removeAttribute() {},
    setAttribute() {},
    textContent: "",
  };
}

const elements = new Map();
const validationMath = Object.create(Math);
validationMath.random = () => 0.421875;
const sandbox = {
  addEventListener() {},
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
  Math: validationMath,
  requestAnimationFrame() { return 1; },
  setTimeout() { return 1; },
};
sandbox.globalThis = sandbox;
sandbox.window = sandbox;

const verification = `
globalThis.__unlockAllPowersForValidation = true;
const expectedCodes = [
  "T", "Mf", "F", "N", "F", "N", "D", "D", "D", "Md",
  "F", "N", "D", "N", "N", "D", "Md", "Md", "N", "D",
  "N", "D", "Md", "N", "E", "D", "Md", "E", "Md", "I",
  "N", "D", "Md", "D", "N", "E", "Md", "D", "Md", "E",
  "D", "Md", "D", "N", "D", "E", "D", "E", "D", "I",
  "N", "D", "Md", "Md", "E", "E", "I", "D", "Md", "I",
  "N", "D", "Md", "D", "E", "Md", "E", "D", "I", "I",
  "N", "D", "D", "Md", "D", "E", "D", "Md", "E", "I",
  "N", "D", "Md", "D", "E", "D", "Md", "E", "Md", "I",
  "N", "D", "Md", "D", "E", "D", "Md", "E", "I", "I",
];
if (LEVEL_CONFIGS.length !== 100 || WORLD_LEVELS.length !== 100) {
  throw new Error("The campaign must contain 100 levels");
}

const sectionSize = 10;
const sectionTotals = Array.from(
  { length: Math.ceil(LEVEL_CONFIGS.length / sectionSize) },
  (_, sectionIndex) => Math.min(
    sectionSize,
    LEVEL_CONFIGS.length - sectionIndex * sectionSize,
  ),
);
if (sectionTotals.join(",") !== "10,10,10,10,10,10,10,10,10,10") {
  throw new Error("The campaign must contain ten complete sections");
}
if (LEVEL_CONFIGS.some((config, index) => config?.difficultyCode !== expectedCodes[index])) {
  throw new Error("The campaign difficulty curve does not match the agreed plan");
}
if (
  LEVEL_CONFIGS[18]?.cockroachMode !== "single" ||
  LEVEL_CONFIGS[19]?.cockroachMode !== "repeat" ||
  !LEVEL_CONFIGS[6]?.tornadoIntro ||
  !LEVEL_CONFIGS[7]?.tornadoPractice ||
  !LEVEL_CONFIGS[16]?.hammerIntro ||
  !LEVEL_CONFIGS[17]?.hammerPractice ||
  !LEVEL_CONFIGS[25]?.crystalIntro ||
  !LEVEL_CONFIGS[26]?.crystalPractice ||
  LEVEL_CONFIGS[31]?.pieCount !== 1 ||
  LEVEL_CONFIGS[21]?.hingedWallCount !== 1 ||
  !LEVEL_CONFIGS[36]?.fishingIntro ||
  !LEVEL_CONFIGS[28]?.catPawIntro ||
  LEVEL_CONFIGS[29]?.difficultyCode !== "I" ||
  adversitiesForVariant(LEVEL_CONFIGS[29], 0).length !== 2 ||
  POWER_UNLOCK_LEVELS.tornado !== 7 ||
  POWER_UNLOCK_LEVELS.hammer !== 17 ||
  POWER_UNLOCK_LEVELS.crystal !== 26 ||
  POWER_UNLOCK_LEVELS.fishing !== 37 ||
  POWER_UNLOCK_LEVELS.rocket !== 44
) {
  throw new Error("The first four sections or power unlock levels are misplaced");
}
if (
  !LEVEL_CONFIGS[43]?.rocketIntro ||
  LEVEL_CONFIGS[40]?.tunnelCount !== 3 ||
  !LEVEL_CONFIGS[40]?.tunnelIntro ||
  LEVEL_CONFIGS[46]?.rotatingCircuitCount !== 1 ||
  !LEVEL_CONFIGS[46]?.rotatingTilesIntro ||
  adversitiesForVariant(LEVEL_CONFIGS[49], 0).length !== 2 ||
  !LEVEL_CONFIGS[51]?.shape ||
  LEVEL_CONFIGS[55]?.waterMode !== "intro" ||
  LEVEL_CONFIGS[56]?.waterMode !== "advanced"
) {
  throw new Error("The fifth or sixth section mechanic curve is misplaced");
}
if (
  !LEVEL_CONFIGS[38]?.crowIntro ||
  LEVEL_CONFIGS[61]?.cloudMode !== "intro" ||
  !LEVEL_CONFIGS.slice(62, 70).every((config) => Boolean(config.cloudMode)) ||
  LEVEL_CONFIGS[69]?.difficultyCode !== "I" ||
  adversitiesForVariant(LEVEL_CONFIGS[69], 0).length !== 2
) {
  throw new Error("The crow or seventh-section cloud curve is misplaced");
}
if (
  !LEVEL_CONFIGS[70]?.fragileTileIntro ||
  LEVEL_CONFIGS[70]?.fragileTileCount !== 2 ||
  LEVEL_CONFIGS[70]?.cheeseCount !== 2 ||
  adversitiesForVariant(LEVEL_CONFIGS[70], 0).length !== 0 ||
  LEVEL_CONFIGS.slice(70, 80).map((config) => config.fragileTileCount ?? 0).join(",") !==
    "2,2,0,0,0,3,0,0,0,4" ||
  LEVEL_CONFIGS[71]?.cheeseCount !== 1 ||
  LEVEL_CONFIGS[71]?.milkCount !== 1 ||
  adversitiesForVariant(LEVEL_CONFIGS[71], 0).length !== 0 ||
  LEVEL_CONFIGS[72]?.cheeseCount !== 3 ||
  LEVEL_CONFIGS[72]?.rotatingCircuitCount !== 1 ||
  LEVEL_CONFIGS[73]?.cheeseCount !== 3 ||
  (LEVEL_CONFIGS[73]?.milkCount ?? 0) !== 0 ||
  LEVEL_CONFIGS[73]?.hingedWallCount !== 2 ||
  LEVEL_CONFIGS[74]?.pieCount !== 1 ||
  LEVEL_CONFIGS[74]?.cheeseCount !== 0 ||
  !adversitiesForVariant(LEVEL_CONFIGS[74], 0).includes("catPaw") ||
  LEVEL_CONFIGS[75]?.cheeseCount !== 2 ||
  LEVEL_CONFIGS[75]?.milkCount !== 1 ||
  LEVEL_CONFIGS[75]?.fragileTileCount !== 3 ||
  !LEVEL_CONFIGS[75].adversityVariants.flat().includes("car") ||
  !LEVEL_CONFIGS[75].adversityVariants.flat().includes("cockroach") ||
  LEVEL_CONFIGS[76]?.cheeseCount !== 2 ||
  LEVEL_CONFIGS[76]?.rockMode !== "search" ||
  LEVEL_CONFIGS[76]?.rockCount !== 3 ||
  !adversitiesForVariant(LEVEL_CONFIGS[76], 0).includes("cockroach") ||
  LEVEL_CONFIGS[77]?.cheeseCount !== 2 ||
  LEVEL_CONFIGS[77]?.milkCount !== 1 ||
  LEVEL_CONFIGS[77]?.tunnelCount !== 3 ||
  !adversitiesForVariant(LEVEL_CONFIGS[77], 0).includes("crow") ||
  LEVEL_CONFIGS[78]?.cheeseCount !== 3 ||
  LEVEL_CONFIGS[78]?.waterMode !== "advanced" ||
  !LEVEL_CONFIGS[78]?.cloudMode ||
  adversitiesForVariant(LEVEL_CONFIGS[78], 0).length !== 0 ||
  LEVEL_CONFIGS[79]?.cheeseCount !== 3 ||
  LEVEL_CONFIGS[79]?.fragileTileCount !== 4 ||
  LEVEL_CONFIGS[79]?.difficultyCode !== "I" ||
  adversitiesForVariant(LEVEL_CONFIGS[79], 0).length !== 2 ||
  !LEVEL_CONFIGS[79].adversityVariants.flat().includes("catPaw") ||
  !LEVEL_CONFIGS[79].adversityVariants.flat().includes("cockroach")
) {
  throw new Error("The eighth-section recap and fragile-floor curve is misplaced");
}
if (
  !LEVEL_CONFIGS[80]?.carrotIntro ||
  LEVEL_CONFIGS[80]?.carrotCount !== 2 ||
  LEVEL_CONFIGS[80]?.carrotPatchCount !== 4 ||
  LEVEL_CONFIGS[80]?.cheeseCount !== 0 ||
  adversitiesForVariant(LEVEL_CONFIGS[80], 0).length !== 0
) {
  throw new Error("Level 81 must be the isolated carrot-search introduction");
}
if (
  LEVEL_CONFIGS.slice(80, 90).map((config) => config.carrotCount ?? 0).join(",") !==
    "2,1,2,0,2,0,2,0,0,2" ||
  LEVEL_CONFIGS.slice(80, 90).map((config) => config.fragileTileCount ?? 0).join(",") !==
    "0,0,2,0,0,0,0,0,0,2" ||
  LEVEL_CONFIGS[83]?.cheeseCount !== 2 ||
  LEVEL_CONFIGS[83]?.milkCount !== 1 ||
  LEVEL_CONFIGS[84]?.cloudMode !== true ||
  !adversitiesForVariant(LEVEL_CONFIGS[84], 0).includes("crow") ||
  LEVEL_CONFIGS[85]?.rockMode !== "search" ||
  LEVEL_CONFIGS[85]?.rockCount !== 3 ||
  !LEVEL_CONFIGS[86]?.shape ||
  LEVEL_CONFIGS[87]?.pieCount !== 1 ||
  LEVEL_CONFIGS[87]?.cheeseCount !== 2 ||
  (LEVEL_CONFIGS[87]?.milkCount ?? 0) !== 0 ||
  !adversitiesForVariant(LEVEL_CONFIGS[87], 0).includes("catPaw") ||
  LEVEL_CONFIGS[88]?.tunnelCount !== 3 ||
  !adversitiesForVariant(LEVEL_CONFIGS[88], 0).includes("crow") ||
  LEVEL_CONFIGS[89]?.difficultyCode !== "I" ||
  adversitiesForVariant(LEVEL_CONFIGS[89], 0).join(",") !== "car,catPaw"
) {
  throw new Error("The ninth-section carrot remix curve is misplaced");
}
if (
  !LEVEL_CONFIGS[90]?.spiderWebIntro ||
  LEVEL_CONFIGS[90]?.spiderWebCount !== 1 ||
  LEVEL_CONFIGS[90]?.cheeseCount !== 1 ||
  adversitiesForVariant(LEVEL_CONFIGS[90], 0).length !== 0 ||
  helperOfferIsUseful(91, 0)
) {
  throw new Error("Level 91 must introduce one spider web without adversity or helper");
}
if (
  LEVEL_CONFIGS.slice(90, 100).map((config) => config.spiderWebCount ?? 0).join(",") !==
    "1,2,2,0,3,0,0,3,0,4" ||
  LEVEL_CONFIGS[91]?.cheeseCount !== 1 ||
  LEVEL_CONFIGS[91]?.milkCount !== 1 ||
  LEVEL_CONFIGS[92]?.cheeseCount !== 3 ||
  !adversitiesForVariant(LEVEL_CONFIGS[92], 0).includes("car") ||
  LEVEL_CONFIGS[93]?.tunnelCount !== 3 ||
  LEVEL_CONFIGS[94]?.pieCount !== 1 ||
  !adversitiesForVariant(LEVEL_CONFIGS[94], 0).includes("catPaw") ||
  LEVEL_CONFIGS[95]?.cheeseCount !== 3 ||
  LEVEL_CONFIGS[95]?.hingedWallCount !== 2 ||
  LEVEL_CONFIGS[96]?.rotatingCircuitCount !== 1 ||
  LEVEL_CONFIGS[97]?.cheeseCount !== 2 ||
  LEVEL_CONFIGS[97]?.milkCount !== 1 ||
  !adversitiesForVariant(LEVEL_CONFIGS[97], 0).includes("crow") ||
  LEVEL_CONFIGS[98]?.cheeseCount !== 3 ||
  adversitiesForVariant(LEVEL_CONFIGS[98], 0).length !== 2 ||
  LEVEL_CONFIGS[99]?.cheeseCount !== 3 ||
  LEVEL_CONFIGS[99]?.difficultyCode !== "I" ||
  adversitiesForVariant(LEVEL_CONFIGS[99], 0).length !== 2
) {
  throw new Error("The tenth-section web remix and finale curve is misplaced");
}
const expectedMechanicTutorials = new Map([
  [3, "milk"],
  [9, "car"],
  [11, "helper"],
  [12, "rock"],
  [19, "cockroach"],
  [22, "hinge"],
  [29, "catPaw"],
  [32, "pie"],
  [39, "crow"],
  [41, "tunnel"],
  [56, "water"],
  [62, "cloud"],
  [71, "fragile"],
  [81, "carrot"],
  [91, "spiderWeb"],
]);
for (const [tutorialLevel, expectedKind] of expectedMechanicTutorials) {
  level = tutorialLevel;
  const config = LEVEL_CONFIGS[tutorialLevel - 1];
  const previousHelperRequest = helperRequestedForRun;
  if (expectedKind === "helper") helperRequestedForRun = true;
  const actualKind = mechanicTutorialKindForLevel(config);
  helperRequestedForRun = previousHelperRequest;
  if (actualKind !== expectedKind || !MECHANIC_TUTORIAL_MESSAGES[actualKind]) {
    throw new Error(
      "Level " + tutorialLevel + " must introduce the " + expectedKind + " tutorial",
    );
  }
}
level = 1;
for (const [variantIndex, tunnelVariant] of globalThis.__MOUSE_MAZE_PREGENERATED_LEVELS__[40].entries()) {
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
    throw new Error("Level 41 variant " + (variantIndex + 1) + " has invalid tunnel placement");
  }
}
for (const [variantIndex, rotatingVariant] of globalThis.__MOUSE_MAZE_PREGENERATED_LEVELS__[46].entries()) {
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
      cell.row >= (LEVEL_CONFIGS[46]?.rows ?? 9) - 1 ||
      cell.col <= 0 ||
      cell.col >= (LEVEL_CONFIGS[46]?.cols ?? 9) - 1,
  );
  if (
    rotatingVariant.rotatingCircuits?.length !== 1 ||
    circuitKeys.size !== 8 ||
    circuit?.tiles?.length !== 8 ||
    invalidCell ||
    [...circuitKeys].some((key) => occupiedKeys.has(key)) ||
    !rotatingVariant.exits?.some((target) => circuitKeys.has(keyOf(target)))
  ) {
    throw new Error("Level 47 variant " + (variantIndex + 1) + " has an invalid rotating circuit");
  }
}
globalThis.__unlockAllPowersForValidation = false;
worldProgress.unlockedLevel = 44;
tornadoTutorialUnlockedForRun = false;
level = 7;
if (isPowerUnlocked("tornado")) {
  throw new Error("The Tornado must stay locked until its level-7 tutorial begins");
}
tornadoTutorialUnlockedForRun = true;
if (!isPowerUnlocked("tornado")) {
  throw new Error("The Tornado must unlock when its level-7 tutorial begins");
}
powerIntroTutorialUnlockedForRun = new Set();
level = 17;
if (isPowerUnlocked("hammer")) {
  throw new Error("The Hammer must stay locked until its level-17 tutorial begins");
}
powerIntroTutorialUnlockedForRun.add("hammer");
if (!isPowerUnlocked("hammer")) {
  throw new Error("The Hammer must unlock when its level-17 tutorial begins");
}
worldProgress.unlockedLevel = 25;
level = 25;
if (isPowerUnlocked("crystal")) {
  throw new Error("Crystal Vision must stay locked before level 26");
}
worldProgress.unlockedLevel = 26;
level = 26;
if (!isPowerUnlocked("crystal")) {
  throw new Error("Crystal Vision must unlock at level 26");
}
worldProgress.unlockedLevel = 44;
powerIntroTutorialUnlockedForRun = new Set();
level = 37;
if (isPowerUnlocked("fishing")) {
  throw new Error("The Fishing Rod must stay locked until its level-37 tutorial begins");
}
powerIntroTutorialUnlockedForRun.add("fishing");
if (!isPowerUnlocked("fishing")) {
  throw new Error("The Fishing Rod must unlock when its level-37 tutorial begins");
}
powerIntroTutorialUnlockedForRun = new Set();
level = 44;
if (isPowerUnlocked("rocket")) {
  throw new Error("The Rocket must stay locked until its level-44 tutorial begins");
}
powerIntroTutorialUnlockedForRun.add("rocket");
if (!isPowerUnlocked("rocket")) {
  throw new Error("The Rocket must unlock when its level-44 tutorial begins");
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
level = 29;
setGridDimensions(LEVEL_CONFIGS[28]);
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
level = 39;
setGridDimensions(LEVEL_CONFIGS[38]);
const crowVariant = buildLevelVariant(LEVEL_CONFIGS[38], 0);
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
  activeLevelConfig = { ...LEVEL_CONFIGS[38], crowMode: true };
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
const outerCrowTarget = { row: 0, col: Math.min(2, COLS - 1) };
if (
  CROW_TRIGGER_MOVES.join(",") !== "10,12,14" ||
  crowOptions.length !== (ROWS - 2) * (COLS - 2) ||
  !exposedCrowTarget ||
  !directedCrowThreat ||
  !crowThreatContains(directedCrowThreat, exposedCrowTarget) ||
  !escapedCrowPosition ||
  !fixedCrowThreat ||
  fixedCrowThreat.startRow !== directedCrowThreat.startRow ||
  fixedCrowThreat.startCol !== directedCrowThreat.startCol ||
  !crowCanCatchCell(outerCrowTarget) ||
  !crowOptions.some((option) => crowThreatContains(option, outerCrowTarget)) ||
  !internalWalledCrowTarget ||
  !crowCanCatchCell(internalWalledCrowTarget) ||
  crowOptions.some((option) =>
    option.cells.length !== 9 ||
    option.cells.some((cell) => !isInside(cell.row, cell.col))
  )
) {
  throw new Error("The crow must keep its strike fixed and target every active board position");
}
if (
  LEVEL_CONFIGS[49]?.difficultyCode !== "I" ||
  LEVEL_CONFIGS[49]?.tunnelCount !== 3 ||
  LEVEL_CONFIGS[49]?.rotatingCircuitCount !== 1 ||
  Array.from({ length: VARIANTS_PER_LEVEL }, (_, variantIndex) =>
    adversitiesForVariant(LEVEL_CONFIGS[49], variantIndex).length
  ).some((count) => count !== 2)
) {
  throw new Error("Level 50 must combine tunnels, rotating floors, and two adversities");
}
level = 19;
setGridDimensions(LEVEL_CONFIGS[18]);
const cockroachVariant = buildLevelVariant(LEVEL_CONFIGS[18], 0);
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
level = 20;
setGridDimensions(LEVEL_CONFIGS[19]);
const recurringCockroachVariant = buildLevelVariant(LEVEL_CONFIGS[19], 0);
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
  cockroachActionLimit() !== COCKROACH_REPEAT_ACTION_LIMIT ||
  COCKROACH_REPEAT_ACTION_LIMIT !== 3 ||
  bottleOptions.some((option) =>
    !cockroachCanLeaveBottleUsable(option.bottleId, option.to)
  )
) {
  throw new Error("Level 20 must let the recurring cockroach target unopened milk bottles");
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
const savedObjectiveState = {
  cheeseTargets,
  collectedCheeseKeys,
  milkBottles,
  collectedMilkIds,
  pie,
  eatenPieQuarterIds,
};
cheeseTargets = [{ id: "pose-cheese", row: 0, col: 0 }];
collectedCheeseKeys = new Set(["pose-cheese"]);
milkBottles = [];
collectedMilkIds = new Set();
pie = {
  id: "pose-pie",
  row: 1,
  col: 1,
  quarters: [{ id: "pose-quarter", row: 1, col: 1 }],
};
eatenPieQuarterIds = new Set();
if (shouldHoldFinalCheesePose()) {
  throw new Error("Pending pie must release the final cheese pose");
}
eatenPieQuarterIds.add("pose-quarter");
if (!shouldHoldFinalCheesePose()) {
  throw new Error("The final cheese pose must remain available after every objective");
}
({
  cheeseTargets,
  collectedCheeseKeys,
  milkBottles,
  collectedMilkIds,
  pie,
  eatenPieQuarterIds,
} = savedObjectiveState);
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
if (!LEVEL_CONFIGS[11].rockMode || !LEVEL_CONFIGS[12].rockMode) {
  throw new Error("Rocks must start at level 12");
}
if (
  !LEVEL_CONFIGS[6].tornadoIntro ||
  !LEVEL_CONFIGS[16].hammerIntro ||
  !LEVEL_CONFIGS[25].crystalIntro ||
  LEVEL_CONFIGS[21].hingedWallCount !== 1
) {
  throw new Error("Power or hinged-wall introductions are misplaced");
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
for (const curatedLevel of [7, 8, 17, 18, 26, 27, 37, 44]) {
  levelVariantStates[curatedLevel - 1] = { current: -1, remaining: [] };
  if (takeNextVariant(curatedLevel - 1) !== 0) {
    throw new Error(
      "Power introduction or practice level " + curatedLevel +
      " must begin with its curated variant",
    );
  }
}

function loadPowerVariant(levelNumber, variantIndex = 0) {
  level = levelNumber;
  loadLevelVariant(LEVEL_CONFIGS[levelNumber - 1], variantIndex, "retry");
  gameOver = false;
  campaignComplete = false;
  movesLeft = moveLimit;
}

loadPowerVariant(7);
tornadoTutorialShownThisRun = false;
tornadoTutorialActive = false;
let tornadoIntroOpportunity = null;
let tornadoIntroStep = 0;
const tornadoIntroRoute = currentObjectiveRoute()?.path ?? [];
for (let step = 1; step < tornadoIntroRoute.length; step += 1) {
  mouse = { ...tornadoIntroRoute[step] };
  movesLeft = Math.max(0, moveLimit - step);
  const cheese = cheeseAt(mouse);
  if (!cheese) continue;
  collectedCheeseKeys.add(cheeseIdentity(cheese));
  tornadoIntroOpportunity = findTornadoTutorialOpportunity();
  if (tornadoIntroOpportunity) {
    tornadoIntroStep = step;
    break;
  }
}
if (
  !tornadoIntroOpportunity ||
  tornadoIntroOpportunity.savings < 1 ||
  collectedCheeseKeys.size >= cheeseTargets.length
) {
  throw new Error(
    "Level 7 must demonstrate a useful Tornado route before all objectives are collected",
  );
}
const tornadoIntroCollected = collectedCheeseKeys.size;

loadPowerVariant(17);
let hammerIntroTarget = null;
let hammerIntroStep = 0;
const hammerIntroRoute = currentObjectiveRoute()?.path ?? [];
for (let step = 1; step < hammerIntroRoute.length; step += 1) {
  mouse = { ...hammerIntroRoute[step] };
  movesLeft = Math.max(0, moveLimit - step);
  const cheese = cheeseAt(mouse);
  if (cheese) collectedCheeseKeys.add(cheeseIdentity(cheese));
  hammerIntroTarget = hammerTutorialOpportunity();
  if (hammerIntroTarget) {
    hammerIntroStep = step;
    break;
  }
}
if (!hammerIntroTarget || hammerIntroTarget.kind !== "wall") {
  throw new Error("Level 17 must demonstrate the Hammer on a useful internal wall");
}
const hammerCurrentDistance = routeMoveCount(remainingCheeseRoute());
const hammerCurrentCell = maze[mouse.row][mouse.col];
const hammerNeighborCell = maze[hammerIntroTarget.nextRow][hammerIntroTarget.nextCol];
const hammerCurrentWall = hammerCurrentCell.walls[hammerIntroTarget.dir.wall];
const hammerNeighborWall = hammerNeighborCell.walls[hammerIntroTarget.dir.opposite];
hammerCurrentCell.walls[hammerIntroTarget.dir.wall] = false;
hammerNeighborCell.walls[hammerIntroTarget.dir.opposite] = false;
const hammerNewDistance = routeMoveCount(remainingCheeseRoute());
hammerCurrentCell.walls[hammerIntroTarget.dir.wall] = hammerCurrentWall;
hammerNeighborCell.walls[hammerIntroTarget.dir.opposite] = hammerNeighborWall;
const hammerIntroSavings = hammerCurrentDistance - hammerNewDistance;
if (hammerIntroSavings < 2) {
  throw new Error("Level 17 must demonstrate a Hammer shortcut of at least two moves");
}

loadPowerVariant(26);
const crystalIntroPath = currentCrystalPath();
const crystalIntroForecast = buildCrystalForecast(
  crystalIntroPath.slice(1, movesLeft + 1),
);
if (
  crystalIntroPath.length < 2 ||
  !crystalIntroForecast.complete ||
  crystalIntroForecast.failure ||
  crystalIntroForecast.frames.length > movesLeft
) {
  throw new Error(
    "Level 26 must give Crystal Vision a complete, safe forecast from the starting square",
  );
}
globalThis.__powerIntroValidation = {
  tornado: {
    step: tornadoIntroStep,
    collected: tornadoIntroCollected,
    savings: tornadoIntroOpportunity.savings,
  },
  hammer: {
    step: hammerIntroStep,
    target: hammerIntroTarget.kind,
    savings: hammerIntroSavings,
  },
  crystal: {
    actions: crystalIntroForecast.frames.length,
    failure: crystalIntroForecast.failure,
  },
};

loadPowerVariant(8);
const tornadoPracticeDistance = routeMoveCount(remainingCheeseRoute());
const tornadoPracticeBest = chooseSafeTornadoCandidate(true);
powerInventory.tornado = Math.max(1, powerInventory.tornado);
syncPowerAvailability();
activateTornadoPower();
const tornadoPracticeSavings = tornadoPracticeBest
  ? tornadoPracticeDistance - tornadoPracticeBest.routeDistance
  : Number.NEGATIVE_INFINITY;
if (
  !tornadoPracticeBest ||
  !tornadoCandidate ||
  tornadoCandidate.variantIndex !== tornadoPracticeBest.variantIndex ||
  tornadoPracticeSavings < 5
) {
  throw new Error(
    "Level 8 must select a Tornado variation that saves at least five moves",
  );
}
clearPowerTargetingState();

function hammerPracticeResult(variantIndex) {
  const config = LEVEL_CONFIGS[17];
  const variant = buildLevelVariant(config, variantIndex);
  loadPowerVariant(18, variantIndex);
  const route = variant.carSolution?.path ?? currentObjectiveRoute()?.path ?? [];
  for (let step = 1; step < route.length && step <= 10; step += 1) {
    mouse = { ...route[step] };
    movesLeft = Math.max(0, moveLimit - step);
    const cheese = cheeseAt(mouse);
    if (cheese) collectedCheeseKeys.add(cheeseIdentity(cheese));
    const target = hammerTutorialOpportunity();
    if (!target || target.kind !== "wall") continue;
    const currentDistance = routeMoveCount(remainingCheeseRoute());
    const currentCell = maze[mouse.row][mouse.col];
    const neighborCell = maze[target.nextRow][target.nextCol];
    const currentWall = currentCell.walls[target.dir.wall];
    const neighborWall = neighborCell.walls[target.dir.opposite];
    currentCell.walls[target.dir.wall] = false;
    neighborCell.walls[target.dir.opposite] = false;
    const newDistance = routeMoveCount(remainingCheeseRoute());
    currentCell.walls[target.dir.wall] = currentWall;
    neighborCell.walls[target.dir.opposite] = neighborWall;
    return { step, savings: currentDistance - newDistance };
  }
  return null;
}
const hammerPracticeResults = Array.from(
  { length: VARIANTS_PER_LEVEL },
  (_, variantIndex) => hammerPracticeResult(variantIndex),
);
if (hammerPracticeResults.some((result) => !result || result.savings < 2)) {
  throw new Error(
    "Every level 18 variant must offer an early Hammer shortcut of at least two moves",
  );
}

function crystalPracticeResult(variantIndex) {
  loadPowerVariant(27, variantIndex);
  const path = currentCrystalPath();
  const forecast = buildCrystalForecast(path.slice(1, movesLeft + 1));
  return {
    actions: forecast.frames.length,
    complete: forecast.complete,
    failure: forecast.failure,
    showsCockroach: forecast.frames.some((frame) => Boolean(frame.events.cockroach)),
  };
}
const crystalPracticeResults = Array.from(
  { length: VARIANTS_PER_LEVEL },
  (_, variantIndex) => crystalPracticeResult(variantIndex),
);
if (
  crystalPracticeResults.some(
    (result) =>
      !result.complete ||
      result.failure ||
      !result.showsCockroach ||
      result.actions < 1,
  )
  ) {
  throw new Error(
    "Every level 27 variant must show a complete Crystal forecast with a moving cockroach: " +
    JSON.stringify(crystalPracticeResults),
  );
}
globalThis.__powerPracticeValidation = {
  tornado: {
    from: tornadoPracticeDistance,
    to: tornadoPracticeBest.routeDistance,
    savings: tornadoPracticeSavings,
  },
  hammer: hammerPracticeResults,
  crystal: crystalPracticeResults,
};
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
    const spiderWebCost = variant.spiderWebExtraCost ?? 0;
    const requiredRouteDistance = distance + spiderWebCost;
    const signature = variant.grid.flat().map((cell) =>
      [cell.walls.top, cell.walls.right, cell.walls.bottom, cell.walls.left]
        .map(Number).join("")
    ).join("") + ":" + keyOf(variant.start) + ":" +
      (variant.exits ?? []).map(keyOf).sort().join(";") + ":" +
      (variant.milkBottles ?? []).map(keyOf).sort().join(";") + ":" +
      (variant.pie ? keyOf(variant.pie) : "") + ":" +
      (variant.car ? keyOf(variant.car) : "") + ":" +
      (variant.fragileTiles ?? []).map(keyOf).sort().join(";") + ":" +
      (variant.spiderWebs ?? []).map(keyOf).sort().join(";") + ":" +
      (variant.carrotPatches ?? [])
        .map((patch) => keyOf(patch) + (patch.hasCarrot ? "r" : "f"))
        .sort()
        .join(";");
    if (signatures.has(signature)) throw new Error("Duplicate variant in level " + (levelIndex + 1));
    signatures.add(signature);
    if (variant.moveLimit < requiredRouteDistance || keyOf(variant.path[0]) !== keyOf(variant.start)) {
      throw new Error("Invalid route budget in level " + (levelIndex + 1));
    }
    if (variant.moveLimit > MAX_MOVES_PER_LEVEL) {
      throw new Error(
        "Move limit exceeds " + MAX_MOVES_PER_LEVEL + " in level " +
          (levelIndex + 1) + " variant " + (variantIndex + 1),
      );
    }
    const expectedFragileCount = config.fragileTileCount ?? 0;
    const fragileTileKeys = new Set((variant.fragileTiles ?? []).map(keyOf));
    if (
      fragileTileKeys.size !== expectedFragileCount ||
      (variant.fragileTiles ?? []).length !== expectedFragileCount ||
      expectedFragileCount > MAX_FRAGILE_TILES_PER_LEVEL ||
      (expectedFragileCount > 0 && !variant.fragileRouteValidated)
    ) {
      throw new Error(
        "Fragile floor count or route proof is invalid in level " +
          (levelIndex + 1) + " variant " + (variantIndex + 1),
      );
    }
    if (expectedFragileCount > 0) {
      const occupiedKeys = new Set([
        keyOf(variant.start),
        ...(variant.exits ?? []).map(keyOf),
        ...(variant.milkBottles ?? []).map(keyOf),
        ...(variant.rocks ?? []).map(keyOf),
        ...pieFootprintCells(variant.pie).map(keyOf),
        ...(variant.tunnels ?? []).map(keyOf),
        ...(variant.rotatingCircuits ?? []).flatMap((circuit) => circuit.cells.map(keyOf)),
        ...(variant.carrotPatches ?? []).map(keyOf),
      ]);
      if ([...fragileTileKeys].some((cellKey) => occupiedKeys.has(cellKey))) {
        throw new Error(
          "A fragile floor overlaps a protected element in level " + (levelIndex + 1),
        );
      }
      const collapsedKeys = new Set();
      let occupiedFragileKey = fragileTileKeys.has(keyOf(variant.start))
        ? keyOf(variant.start)
        : null;
      for (const step of variant.path.slice(1)) {
        const stepKey = keyOf(step);
        if (occupiedFragileKey && occupiedFragileKey !== stepKey) {
          collapsedKeys.add(occupiedFragileKey);
        }
        if (collapsedKeys.has(stepKey)) {
          throw new Error(
            "The validated route re-enters collapsed floor in level " +
              (levelIndex + 1) + " variant " + (variantIndex + 1),
          );
        }
        occupiedFragileKey = fragileTileKeys.has(stepKey) ? stepKey : null;
      }
    }
    const expectedSpiderWebCount = config.spiderWebCount ?? 0;
    const spiderWebKeys = new Set((variant.spiderWebs ?? []).map(keyOf));
    if (
      spiderWebKeys.size !== expectedSpiderWebCount ||
      (variant.spiderWebs ?? []).length !== expectedSpiderWebCount ||
      expectedSpiderWebCount > MAX_SPIDER_WEBS_PER_LEVEL ||
      spiderWebCost !== expectedSpiderWebCount ||
      (expectedSpiderWebCount > 0 && !variant.spiderWebRouteValidated)
    ) {
      throw new Error(
        "Spider-web count, cost, or route proof is invalid in level " +
          (levelIndex + 1) + " variant " + (variantIndex + 1),
      );
    }
    if (expectedSpiderWebCount > 0) {
      const protectedKeys = new Set([
        keyOf(variant.start),
        ...(variant.exits ?? []).map(keyOf),
        ...(variant.milkBottles ?? []).map(keyOf),
        ...(variant.rocks ?? []).map(keyOf),
        ...pieFootprintCells(variant.pie).map(keyOf),
        ...(variant.tunnels ?? []).map(keyOf),
        ...(variant.rotatingCircuits ?? []).flatMap((circuit) => circuit.cells.map(keyOf)),
        ...(variant.carrotPatches ?? []).map(keyOf),
        ...(variant.fragileTiles ?? []).map(keyOf),
        ...(variant.car ? [keyOf(variant.car)] : []),
      ]);
      if ([...spiderWebKeys].some((cellKey) => protectedKeys.has(cellKey))) {
        throw new Error(
          "A spider web overlaps a protected element in level " + (levelIndex + 1),
        );
      }
      for (const web of variant.spiderWebs) {
        if (keyOf(variant.path[web.routeIndex]) !== keyOf(web)) {
          throw new Error(
            "A spider web is not proven on the validated route in level " +
              (levelIndex + 1) + " variant " + (variantIndex + 1),
          );
        }
      }
    }
    if (levelIndex === 29) {
      const spread = variant.objectiveSpread;
      if (
        distance < 50 ||
        countTurns(variant.path) < 20 ||
        distance * 2 <= variant.moveLimit ||
        !spread ||
        spread.minStartDistance < 6 ||
        spread.minPairSeparation < 5 ||
        spread.minPairDistance < 6 ||
        spread.rowSpan < 7 ||
        spread.colSpan < 6 ||
        spread.detourBeyondFarthest < 6 ||
        spread.passThroughObjectives > 0 ||
        (variant.hingedSolution?.detourPenalty ?? 0) < 12 ||
        variant.moveLimit - distance < 2 ||
        variant.moveLimit - distance > 12 ||
        variant.adversityPlan?.structuralDistance !== distance ||
        variant.adversityPlan?.scenarioActions?.length !== 12 ||
        !variant.adversityPlan?.expectedActions?.length ||
        variant.moveLimit - variant.adversityPlan.expectedActions.length < 2 ||
        variant.moveLimit - variant.adversityPlan.expectedActions.length > 6
      ) {
        throw new Error(
          "Level 30 variant " + (variantIndex + 1) +
            " does not meet the Insane difficulty floor",
        );
      }
    }
    if (config.difficultyCode === "I") {
      const calibratedDistance = Math.max(
        variant.adversityPlan?.expectedActions?.length ?? distance,
        variant.carrotSolution?.supportedDistance ?? 0,
      );
      const solutionSpareMoves = variant.moveLimit - calibratedDistance;
      const maximumGuideline = variant.adversityPlan ? 6 : 4;
      if (solutionSpareMoves < 2 || solutionSpareMoves > maximumGuideline) {
        throw new Error(
          "Insane difficulty allowance is outside its guideline in level " +
            (levelIndex + 1) + " variant " + (variantIndex + 1),
        );
      }
    }
    if (
      variantConfig.waterMode &&
      !waterRouteStaysAhead(variant.grid, variant.start, variant.path)
    ) {
      throw new Error(
        "The required route is overtaken by water in level " + (levelIndex + 1),
      );
    }
    if (config.milkCount) {
      if (
        variant.milkBottles.length !== config.milkCount ||
        variant.exits.length !== (config.cheeseCount ?? 0) ||
        !variant.objectiveSolution ||
        variant.objectiveSolution.actions.filter((action) => action.type === "knock").length !== config.milkCount
      ) throw new Error("Invalid milk puzzle in level " + (levelIndex + 1));
    }
    const expectedCheeseCount = config.cheeseCount ?? (config.pieCount ? 0 : 1);
    const actualCheeseTargets = variant.exits ?? (variant.exit ? [variant.exit] : []);
    if (actualCheeseTargets.length !== expectedCheeseCount) {
      throw new Error(
        "Objective count does not match level " + (levelIndex + 1) +
        ": expected " + expectedCheeseCount +
        " cheese targets, received " + actualCheeseTargets.length,
      );
    }
    const expectedCarrotCount = config.carrotCount ?? 0;
    const expectedCarrotPatchCount = config.carrotPatchCount ?? 0;
    const carrotPatches = variant.carrotPatches ?? [];
    const carrotPatchKeys = new Set(carrotPatches.map(keyOf));
    const realCarrots = carrotPatches.filter((patch) => patch.hasCarrot);
    if (
      carrotPatches.length !== expectedCarrotPatchCount ||
      carrotPatchKeys.size !== expectedCarrotPatchCount ||
      realCarrots.length !== expectedCarrotCount ||
      expectedCarrotPatchCount > MAX_CARROT_PATCHES_PER_LEVEL ||
      carrotPatches.some(
        (patch) =>
          keyOf(patch) === keyOf(variant.start) ||
          !variant.grid[patch.row]?.[patch.col]?.active,
      )
    ) {
      throw new Error(
        "Carrot patch placement is invalid in level " + (levelIndex + 1) +
          " variant " + (variantIndex + 1),
      );
    }
    if (expectedCarrotCount) {
      const solution = variant.carrotSolution;
      const carrotActions = variant.objectiveSolution?.actions?.filter(
        (action) => action.type === "carrot",
      ) ?? [];
      if (
        !solution ||
        solution.carrotCount !== expectedCarrotCount ||
        solution.patchCount !== expectedCarrotPatchCount ||
        solution.supportedFalseChecks !== 1 ||
        variant.path.length - 1 !== solution.optimalDistance ||
        variant.alternatePath.length - 1 !== solution.supportedDistance ||
        variant.trickPath.length - 1 !== solution.allPatchesDistance ||
        variant.moveLimit < solution.supportedDistance ||
        variant.moveLimit >= solution.allPatchesDistance ||
        carrotActions.length !== expectedCarrotCount ||
        carrotActions.some((action) => {
          const patch = carrotPatches.find((candidate) => candidate.id === action.patchId);
          return !patch ||
            keyOf(action.inputTarget) !== keyOf(patch) ||
            !areCardinallyAdjacent(action.mouseTarget, patch) ||
            keyOf(action.mouseTarget) !== keyOf(
              variant.objectiveSolution.path[
                variant.objectiveSolution.actions.indexOf(action)
              ],
            );
        }) ||
        variant.carrotAlternateSolution?.actions?.filter(
          (action) => action.type === "carrot",
        ).length !== expectedCarrotCount + 1 ||
        variant.carrotAllPatchesSolution?.actions?.filter(
          (action) => action.type === "carrot",
        ).length !== expectedCarrotPatchCount
      ) {
        throw new Error(
          "Carrot luck budget is invalid in level " + (levelIndex + 1) +
            " variant " + (variantIndex + 1),
        );
      }
    }
    const expectedRockCount = config.rockCount ?? (config.rockMode ? 1 : 0);
    if ((variant.rocks ?? []).length !== expectedRockCount) {
      throw new Error(
        "Rock count does not match level " + (levelIndex + 1) +
        ": expected " + expectedRockCount +
        ", received " + (variant.rocks ?? []).length,
      );
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
      const simpleCatcherPuzzle =
        !(variant.milkBottles?.length) &&
        !variant.pie &&
        !(variant.rocks?.length) &&
        !(variant.hingedWalls?.length) &&
        !(variant.rotatingTiles?.length);
      if (
        simpleCatcherPuzzle &&
        !carPlacementOffersFairStart(variant, variant.grid, variant.start, variant.car)
      ) {
        throw new Error("Catcher blocks the opening route in level " + (levelIndex + 1));
      }
      if (
        !carPlacementOffersActivePursuit(
          variant,
          variant.grid,
          variant.start,
          variant.car,
        )
      ) {
        throw new Error("Catcher cannot actively pursue in level " + (levelIndex + 1));
      }
      if (
        !carHasLegalMove(
          variant.grid,
          variant.car,
          carBlockedKeysForPuzzle(variant),
        )
      ) {
        throw new Error(
          "Catcher starts blocked in level " +
          (levelIndex + 1) + " variant " + (variantIndex + 1),
        );
      }
      const openingCarStep = nextCarStepAvoiding(
        variant.grid,
        variant.car,
        variant.start,
        carBlockedKeysForPuzzle(variant),
      );
      if (keyOf(openingCarStep) === keyOf(variant.car)) {
        throw new Error(
          "Catcher cannot move on the opening turn in level " +
          (levelIndex + 1) + " variant " + (variantIndex + 1),
        );
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
      if (!variant.carSolution && variant.carValidatedSolution !== true) {
        throw new Error(
          "Catcher lacks a validated combined solution in level " + (levelIndex + 1),
        );
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
      if ((config.milkCount ?? 0) + (config.cheeseCount ?? 0) > 0) {
        const nonPieSolution = solveMilkPuzzle(
          variant.grid,
          variant.start,
          variant.milkBottles ?? [],
          variant.exits ?? [],
          config.maxPath + 24,
          new Set(),
          new Set(),
          footprint,
        );
        const pieAfterOtherObjectives = nonPieSolution
          ? solvePiePuzzle(
              variant.grid,
              nonPieSolution.mouse,
              variant.pie,
              config.maxPath + 20,
              new Set(),
              new Set((variant.milkBottles ?? []).map(keyOf)),
            )
          : null;
        const reverseOrderDistance =
          (nonPieSolution?.actions.length ?? 0) +
          (pieAfterOtherObjectives?.actions.length ?? 0);
        if (
          !nonPieSolution ||
          !pieAfterOtherObjectives ||
          !variant.orderFlexibleActions?.length ||
          variant.moveLimit < reverseOrderDistance ||
          reverseOrderDistance > config.maxPath + 24
        ) {
          throw new Error(
            "Pie objectives cannot be completed after the other objectives in level " +
              (levelIndex + 1) + " variant " + (variantIndex + 1),
          );
        }
      }
    }
    if (config.fishingIntro && variantIndex === 0) {
      setGridDimensions(config);
      activeLevelConfig = variantConfig;
      maze = variant.grid;
      cheeseTargets = (variant.exits ?? []).map((target, index) => ({
        ...target,
        id: target.id ?? "cheese-" + index,
      }));
      collectedCheeseKeys = new Set();
      milkBottles = (variant.milkBottles ?? []).map((bottle) => ({ ...bottle }));
      collectedMilkIds = new Set();
      pie = variant.pie
        ? { ...variant.pie, quarters: variant.pie.quarters.map((quarter) => ({ ...quarter })) }
        : null;
      eatenPieQuarterIds = new Set();
      rockPositions = (variant.rocks ?? []).map((rock) => ({ ...rock }));
      hingedWalls = (variant.hingedWalls ?? []).map((wall) => ({ ...wall }));
      tunnels = (variant.tunnels ?? []).map((tunnel) => ({ ...tunnel }));
      car = variant.car ? { ...variant.car } : null;
      floodedWaterKeys = new Set();
      const tutorialRoute = variant.carSolution?.path ?? variant.path;
      const hasFishingOpportunity = tutorialRoute.slice(1).some((cell) => {
        mouse = { ...cell };
        const collectedCheese = cheeseAt(mouse);
        if (collectedCheese) collectedCheeseKeys.add(cheeseIdentity(collectedCheese));
        return Boolean(getFishingCatchTarget());
      });
      if (!hasFishingOpportunity) {
        throw new Error(
          "Fishing tutorial has no valid demonstration point in level " +
          (levelIndex + 1) + " variant " + (variantIndex + 1),
        );
      }
    }
    variants.push({
      variant: variantIndex + 1,
      distance,
      moveLimit: variant.moveLimit,
      requiredDistance: requiredRouteDistance,
      start: keyOf(variant.start),
      cheeses: (variant.exits ?? []).map(keyOf),
      carrots: (variant.carrotPatches ?? []).map((patch) => ({
        cell: keyOf(patch),
        real: Boolean(patch.hasCarrot),
      })),
      milk: (variant.milkBottles ?? []).map(keyOf),
      car: variant.car ? keyOf(variant.car) : null,
      pie: variant.pie ? keyOf(variant.pie) : null,
      spiderWebs: (variant.spiderWebs ?? []).map(keyOf),
      attempt: variant.attempt,
    });
  }
  return { level: levelIndex + 1, code: config.difficultyCode, variants };
});

level = 71;
activeLevelConfig = LEVEL_CONFIGS[70];
setGridDimensions(activeLevelConfig);
const fragileVariant = buildLevelVariant(activeLevelConfig, 0);
maze = fragileVariant.grid;
fragileTiles = fragileVariant.fragileTiles.map((tile) => ({ ...tile }));
crackedFragileTileKeys = new Set();
collapsedFragileTileKeys = new Set();
const testedFragileTile = fragileTiles[0];
const fragileRouteIndex = testedFragileTile.routeIndex;
const fragileApproach = fragileVariant.path[fragileRouteIndex - 1];
const fragileDeparture = fragileVariant.path[fragileRouteIndex + 1];
mouse = { ...fragileApproach };
commitFragileMouseMotion({ from: fragileApproach, to: testedFragileTile });
if (
  !crackedFragileTileKeys.has(keyOf(testedFragileTile)) ||
  collapsedFragileTileKeys.has(keyOf(testedFragileTile))
) {
  throw new Error("A fragile floor must crack, but not collapse, when the mouse enters it");
}
mouse = { ...testedFragileTile };
commitFragileMouseMotion({ from: testedFragileTile, to: fragileDeparture });
if (
  !collapsedFragileTileKeys.has(keyOf(testedFragileTile)) ||
  helperCellIsBlocked(testedFragileTile)
) {
  throw new Error("A fragile floor must collapse on exit without blocking the helper");
}
floodedWaterKeys = new Set([keyOf(fragileApproach)]);
if (!waterExpansionKeys().includes(keyOf(testedFragileTile))) {
  throw new Error("Water must be able to fall into a collapsed fragile floor");
}
floodedWaterKeys = new Set([keyOf(testedFragileTile)]);
if (waterExpansionKeys().length) {
  throw new Error("Water that falls into a fragile-floor hole must not flow out again");
}
floodedWaterKeys = new Set();
mouse = { ...fragileDeparture };
movesLeft = 10;
gameOver = false;
campaignComplete = false;
movementControlsEnabled = true;
globalThis.performance = { now() { return 0; } };
const returnIntoHoleDirection = DIRS.find(
  (direction) =>
    fragileDeparture.row + direction.row === testedFragileTile.row &&
    fragileDeparture.col + direction.col === testedFragileTile.col,
);
move(returnIntoHoleDirection.key);
if (
  !mouseMotion?.fallsIntoFragileHole ||
  keyOf(mouseMotion.to) !== keyOf(testedFragileTile)
) {
  throw new Error("The player must be allowed to walk into a collapsed fragile floor");
}
clearMouseMotion();
delete globalThis.performance;

level = 91;
activeLevelConfig = LEVEL_CONFIGS[90];
setGridDimensions(activeLevelConfig);
const spiderWebVariant = buildLevelVariant(activeLevelConfig, 0);
maze = spiderWebVariant.grid;
mouse = { ...spiderWebVariant.path[spiderWebVariant.spiderWebs[0].routeIndex - 1] };
levelStart = { ...spiderWebVariant.start };
cheeseTargets = (spiderWebVariant.exits ?? [spiderWebVariant.exit]).filter(Boolean).map((target, index) => ({
  ...target,
  id: target.id ?? "cheese-" + index,
}));
collectedCheeseKeys = new Set();
milkBottles = [];
collectedMilkIds = new Set();
pie = null;
eatenPieQuarterIds = new Set();
rockPositions = [];
hingedWalls = [];
tunnels = [];
rotatingCircuits = [];
fragileTiles = [];
crackedFragileTileKeys = new Set();
collapsedFragileTileKeys = new Set();
carrotPatches = [];
inspectedCarrotPatchIds = new Set();
collectedCarrotIds = new Set();
spiderWebs = spiderWebVariant.spiderWebs.map((web) => ({ ...web }));
brokenSpiderWebIds = new Set();
mouseTrappedWebId = null;
helperActive = false;
helperMouse = null;
helperMotion = null;
car = null;
catPawThreat = null;
crowThreat = null;
floodedWaterKeys = new Set();
movesLeft = 10;
gameOver = false;
campaignComplete = false;
movementControlsEnabled = true;
powerControlsEnabled = true;
const testedSpiderWeb = spiderWebs[0];
const spiderWebStartMoves = movesLeft;
startMouseMotion(testedSpiderWeb);
finishMouseMotion();
if (
  keyOf(mouse) !== keyOf(testedSpiderWeb) ||
  mouseTrappedWebId !== testedSpiderWeb.id ||
  movesLeft !== spiderWebStartMoves - 1 ||
  helperCellIsBlocked(testedSpiderWeb)
) {
  throw new Error("Entering a spider web must trap only the player and spend one movement");
}
const trappedMouseKey = keyOf(mouse);
startSpiderWebBreakAnimation(DIRS[0]);
finishSpiderWebBreakAnimation();
if (
  keyOf(mouse) !== trappedMouseKey ||
  mouseTrappedWebId !== null ||
  !brokenSpiderWebIds.has(testedSpiderWeb.id) ||
  spiderWebAt(testedSpiderWeb) ||
  movesLeft !== spiderWebStartMoves - 2
) {
  throw new Error("Breaking a spider web must spend one movement without moving the player");
}

level = 81;
activeLevelConfig = LEVEL_CONFIGS[80];
setGridDimensions(activeLevelConfig);
const carrotVariant = buildLevelVariant(activeLevelConfig, 0);
loadLevelVariant(activeLevelConfig, 0, "retry");
maze = carrotVariant.grid;
mouse = { ...carrotVariant.start };
levelStart = { ...carrotVariant.start };
cheeseTargets = [];
exit = null;
collectedCheeseKeys = new Set();
milkBottles = [];
collectedMilkIds = new Set();
pie = null;
eatenPieQuarterIds = new Set();
fragileTiles = [];
crackedFragileTileKeys = new Set();
collapsedFragileTileKeys = new Set();
carrotPatches = carrotVariant.carrotPatches.map((patch) => ({ ...patch }));
inspectedCarrotPatchIds = new Set();
collectedCarrotIds = new Set();
movesLeft = carrotVariant.moveLimit;
gameOver = false;
campaignComplete = false;
const carrotForecast = buildCrystalForecast(carrotVariant.path.slice(1));
if (!carrotForecast.complete || carrotForecast.frames.length > carrotVariant.moveLimit) {
  throw new Error("Crystal Vision must understand and complete the carrot objective route");
}
const emptyCarrotPatch = carrotPatches.find((patch) => !patch.hasCarrot);
const secondEmptyCarrotPatch = carrotPatches.find(
  (patch) => !patch.hasCarrot && patch.id !== emptyCarrotPatch.id,
);
const realCarrotPatch = carrotPatches.find((patch) => patch.hasCarrot);
const carrotApproach = (patch) => {
  for (const direction of DIRS) {
    const approach = {
      row: patch.row - direction.row,
      col: patch.col - direction.col,
    };
    if (
      isInside(approach.row, approach.col) &&
      hasOpenPassageBetween(maze, approach, patch) &&
      !carrotPatchAt(approach)
    ) {
      return { approach, direction };
    }
  }
  return null;
};
const emptyApproach = carrotApproach(emptyCarrotPatch);
if (!emptyApproach) throw new Error("An empty carrot patch needs an adjacent interaction square");
mouse = { ...emptyApproach.approach };
const emptyMovesBefore = movesLeft;
startCarrotSearchAnimation(emptyCarrotPatch, emptyApproach.direction);
const emptyTunnel = tunnels.find(
  (tunnel) => tunnel.sourceCarrotPatchId === emptyCarrotPatch.id,
);
if (
  !inspectedCarrotPatchIds.has(emptyCarrotPatch.id) ||
  collectedCarrotIds.has(emptyCarrotPatch.id) ||
  carrotPatchAt(emptyCarrotPatch) ||
  !emptyTunnel ||
  keyOf(mouse) !== keyOf(emptyApproach.approach) ||
  movesLeft !== emptyMovesBefore - 1
) {
  throw new Error("An empty carrot patch must open a tunnel from an adjacent square");
}
mouse = { ...emptyApproach.approach };
const isolatedTunnelMovesBefore = movesLeft;
move(emptyApproach.direction.key);
if (
  keyOf(mouse) !== keyOf(emptyApproach.approach) ||
  movesLeft !== isolatedTunnelMovesBefore ||
  emptyTunnel.sealed
) {
  throw new Error(
    "A lone carrot tunnel must refuse entry on the current square without spending a move",
  );
}
const secondEmptyApproach = carrotApproach(secondEmptyCarrotPatch);
if (!secondEmptyApproach) throw new Error("The second empty carrot patch needs an approach square");
mouse = { ...secondEmptyApproach.approach };
startCarrotSearchAnimation(secondEmptyCarrotPatch, secondEmptyApproach.direction);
const secondEmptyTunnel = tunnels.find(
  (tunnel) => tunnel.sourceCarrotPatchId === secondEmptyCarrotPatch.id,
);
if (!secondEmptyTunnel || activeTunnels().length !== 2) {
  throw new Error("Two empty carrot patches must create two connected open tunnels");
}
mouse = { ...emptyTunnel };
startTunnelTravel(emptyTunnel);
if (!tunnels.every((tunnel) => tunnel.sealed)) {
  throw new Error("A used carrot tunnel pair must follow the established closing rule");
}
const realApproach = carrotApproach(realCarrotPatch);
if (!realApproach) throw new Error("A real carrot patch needs an adjacent interaction square");
mouse = { ...realApproach.approach };
startCarrotSearchAnimation(realCarrotPatch, realApproach.direction);
if (
  !inspectedCarrotPatchIds.has(realCarrotPatch.id) ||
  !collectedCarrotIds.has(realCarrotPatch.id) ||
  remainingObjectiveCount() !== 1
) {
  throw new Error(
    "A real carrot patch must collect exactly one carrot objective: " +
      JSON.stringify({
        inspected: [...inspectedCarrotPatchIds],
        collected: [...collectedCarrotIds],
        remaining: remainingObjectiveCount(),
      }),
  );
}
const carrotRetryState = levelVariantStates[80];
carrotRetryState.current = 3;
carrotRetryState.remaining = [0, 1, 2, 4];
if (takeRetryVariant(80) !== 3 || carrotRetryState.remaining.length !== 0) {
  throw new Error("Retrying carrot search must preserve the learned variant layout");
}
if (helperOfferIsUseful(81, 0)) {
  throw new Error("The carrot introduction must not offer the helper mouse");
}
carrotPatches = [];
inspectedCarrotPatchIds = new Set();
collectedCarrotIds = new Set();
level = 71;
activeLevelConfig = LEVEL_CONFIGS[70];

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

if (!LEVEL_CONFIGS[43]?.rocketIntro || POWER_UNLOCK_LEVELS.rocket !== 44) {
  throw new Error("Level 44 must introduce and unlock the rocket");
}
milkBottles = [{
  id: "rocket-milk",
  row: 0,
  col: 0,
  knocked: true,
  direction: "right",
  spill: { row: 3, col: 5 },
}];
level = 44;
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

const pieCells = pie.quarters.map((quarter) => ({ row: quarter.row, col: quarter.col }));
eatenPieQuarterIds = new Set(["top-left", "top-right", "bottom-right"]);
if (pieCells.some((cell) => !pieQuarterAt(cell))) {
  throw new Error("Every pie cell must stay blocked until the final quarter is eaten");
}
eatenPieQuarterIds.add("bottom-left");
if (pieCells.some((cell) => pieQuarterAt(cell))) {
  throw new Error("All pie cells must open after the complete pie is eaten");
}
eatenPieQuarterIds = new Set();

level = 56;
activeLevelConfig = LEVEL_CONFIGS[55];
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
waterOrigin = { ...levelStart };
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

const pieBiteStages = [0, 0.26, 0.44, 0.62, 0.78, 1].map(pieBiteStageAt);
if (pieBiteStages.join(",") !== "0,1,2,3,4,4") {
  throw new Error("Pie bite animation must preserve its four visible consumption stages");
}

function helperAuditPlayerStep(turnIndex) {
  const current = maze[mouse.row]?.[mouse.col];
  if (!current) return { ...mouse };
  const options = neighbors(maze, current).filter(
    (candidate) => !helperCellIsBlocked(candidate),
  );
  if (!options.length) return { ...mouse };
  return { ...options[turnIndex % options.length] };
}

globalThis.__helperPlannerValidation = [];
let foundSingleCockroachHelperExclusion = false;
let foundSingleWaterHelperExclusion = false;
let foundSingleDistractibleHelperOffer = false;
for (const [levelIndex, config] of LEVEL_CONFIGS.entries()) {
  const levelNumber = levelIndex + 1;
  const objectiveCount =
    (config.cheeseCount ?? (config.pieCount ? 0 : 1)) +
    (config.milkCount ?? 0) +
    (config.pieCount ?? 0) * 4;
  for (let variantIndex = 0; variantIndex < VARIANTS_PER_LEVEL; variantIndex += 1) {
    const available = helperOfferIsUseful(levelNumber, variantIndex);
    if (helperLevelIsIntroductory(levelNumber, config) && available) {
      throw new Error("Introductory level " + levelNumber + " cannot offer the helper");
    }
    if (objectiveCount !== 1 || helperLevelIsIntroductory(levelNumber, config)) continue;
    const adversities = adversitiesForVariant(config, variantIndex);
    const onlyCockroach =
      adversities.length === 1 && adversities[0] === "cockroach";
    if (onlyCockroach) {
      foundSingleCockroachHelperExclusion = true;
      if (available) {
        throw new Error(
          "Single-objective cockroach level " + levelNumber +
            " variant " + (variantIndex + 1) + " cannot offer the helper",
        );
      }
    }
    if (config.waterMode) {
      foundSingleWaterHelperExclusion = true;
      if (available) {
        throw new Error(
          "Single-objective water level " + levelNumber +
            " variant " + (variantIndex + 1) + " cannot offer the helper",
        );
      }
    }
    if (adversities.some((adversity) => ["car", "catPaw", "crow"].includes(adversity))) {
      foundSingleDistractibleHelperOffer = true;
      if (!available) {
        throw new Error(
          "Single-objective distractible level " + levelNumber +
            " variant " + (variantIndex + 1) + " must offer the helper",
        );
      }
    }
  }
}
if (
  !foundSingleCockroachHelperExclusion ||
  !foundSingleWaterHelperExclusion ||
  !foundSingleDistractibleHelperOffer
) {
  throw new Error("Helper eligibility validation is missing a required campaign scenario");
}

const helperIntroConfig = LEVEL_CONFIGS[HELPER_FIRST_LEVEL - 1];
if (
  !helperIntroConfig?.helperIntro ||
  helperIntroConfig.cheeseCount !== 1 ||
  helperIntroConfig.milkCount !== 1
) {
  throw new Error("Level 11 must introduce the helper with one cheese and one milk bottle");
}
for (const [variantIndex, introVariant] of globalThis.__MOUSE_MAZE_PREGENERATED_LEVELS__[
  HELPER_FIRST_LEVEL - 1
].entries()) {
  const spread = introVariant.objectiveSpread;
  if (
    !spread ||
    spread.minStartDistance < helperIntroConfig.minObjectiveStartDistance ||
    spread.minPairSeparation < helperIntroConfig.minObjectiveSeparation ||
    spread.minPairDistance < helperIntroConfig.minObjectivePathDistance ||
    spread.rowSpan < helperIntroConfig.minObjectiveRowSpan ||
    spread.colSpan < helperIntroConfig.minObjectiveColSpan ||
    spread.detourBeyondFarthest < helperIntroConfig.minObjectiveDetour ||
    spread.passThroughObjectives > helperIntroConfig.maxPassThroughObjectives
  ) {
    throw new Error(
      "Level 11 variant " + (variantIndex + 1) +
        " does not separate its helper tutorial objectives",
    );
  }
}

level = HELPER_FIRST_LEVEL;
helperRequestedForRun = true;
loadLevelVariant(helperIntroConfig, 0, "retry");
prepareHelperTurn(mouse);
if (helperTask?.type !== "fetch" || !helperMotion) {
  throw new Error("The helper must begin helping on the first move of level 11");
}
helperRequestedForRun = false;

for (let levelIndex = HELPER_FIRST_LEVEL - 1; levelIndex < LEVEL_CONFIGS.length; levelIndex += 1) {
  const config = LEVEL_CONFIGS[levelIndex];
  if (!config) continue;
  for (let variantIndex = 0; variantIndex < VARIANTS_PER_LEVEL; variantIndex += 1) {
    if (!helperOfferIsUseful(levelIndex + 1, variantIndex)) continue;
    level = levelIndex + 1;
    helperRequestedForRun = true;
    loadLevelVariant(config, variantIndex, "retry");
    gameOver = false;
    campaignComplete = false;
    movesLeft = moveLimit;
    if (!helperIsActive() || keyOf(helperMouse) !== keyOf(levelStart)) {
      throw new Error(
        "Helper must start with the player in level " + level +
          " variant " + (variantIndex + 1),
      );
    }

    const taskTypes = new Set();
    const actionTypes = new Set();
    for (let turnIndex = 0; turnIndex < 10; turnIndex += 1) {
      const projectedPlayer = helperAuditPlayerStep(turnIndex);
      const helperBefore = helperMouse ? { ...helperMouse } : null;
      prepareHelperTurn(projectedPlayer);
      if (helperTask?.type) taskTypes.add(helperTask.type);
      const motion = helperMotion
        ? {
            from: { ...helperMotion.from },
            to: { ...helperMotion.to },
            action: helperMotion.action ? { ...helperMotion.action } : null,
          }
        : null;
      if (motion) {
        if (motion.action?.type) actionTypes.add(motion.action.type);
        const moved = keyOf(motion.from) !== keyOf(motion.to);
        if (moved && motion.action?.type === "tunnel") {
          if (!activeTunnelAt(motion.from) || !activeTunnelAt(motion.to)) {
            throw new Error(
              "Helper used an invalid tunnel in level " + level +
                " variant " + (variantIndex + 1),
            );
          }
        } else if (
          moved &&
          (!areCardinallyAdjacent(motion.from, motion.to) ||
            !hasOpenPassageBetween(maze, motion.from, motion.to))
        ) {
          throw new Error(
            "Helper crossed a wall in level " + level +
              " variant " + (variantIndex + 1),
          );
        }
        if (
          helperCellIsBlocked(motion.to) &&
          motion.action?.type !== "pushRock"
        ) {
          throw new Error(
            "Helper entered an occupied cell in level " + level +
              " variant " + (variantIndex + 1),
          );
        }
        commitHelperTurn(motion);
      }
      mouse = { ...projectedPlayer };
      movesLeft = Math.max(0, movesLeft - 1);
      if (helperMouse && helperCellIsBlocked(helperMouse)) {
        throw new Error(
          "Helper finished inside an obstacle in level " + level +
            " variant " + (variantIndex + 1),
        );
      }
      if (helperCargo?.kind === "cheese") {
        const cargo = helperObjectiveByIdentity(helperCargo.kind, helperCargo.id);
        if (!cargo?.helperCarried || keyOf(cargo) !== keyOf(helperMouse)) {
          throw new Error("Helper cheese cargo lost synchronization");
        }
      }
      if (!helperBefore || !helperMouse) break;
    }
    globalThis.__helperPlannerValidation.push({
      level,
      variant: variantIndex + 1,
      turns: helperPlannerTurn,
      taskTypes: [...taskTypes],
      actionTypes: [...actionTypes],
    });
  }
}
if (
  !globalThis.__helperPlannerValidation.some(
    (result) => result.taskTypes.includes("tunnel") || result.actionTypes.includes("tunnel"),
  )
) {
  throw new Error("The helper never chooses a useful tunnel route in campaign validation");
}

level = 13;
helperRequestedForRun = true;
loadLevelVariant(LEVEL_CONFIGS[level - 1], 0, "retry");
prepareHelperTurn(mouse);
if (!helperDistractsAdversity("car") || helperMode !== "distract") {
  throw new Error("A helper offered for a catcher level must distract it immediately");
}
if (!helperTask?.target || !helperMotion || keyOf(helperMotion.to) === keyOf(helperMotion.from)) {
  throw new Error("A catcher distraction must follow a purposeful decoy route");
}
const firstCarDecoyTarget = keyOf(helperTask.target);
const firstCarDecoyMotion = {
  from: { ...helperMotion.from },
  to: { ...helperMotion.to },
  action: helperMotion.action ? { ...helperMotion.action } : null,
};
commitHelperTurn(firstCarDecoyMotion);
if (keyOf(helperMouse) !== firstCarDecoyTarget) {
  prepareHelperTurn(mouse);
  if (keyOf(helperTask?.target) !== firstCarDecoyTarget) {
    throw new Error("A catcher distraction must keep its decoy destination between turns");
  }
}

loadLevelVariant(LEVEL_CONFIGS[level - 1], 0, "retry");
helperPlannerTurn = HELPER_OBSERVATION_TURNS;
helperTask = {
  type: "distract",
  key: "distract:car",
  adversity: "car",
  target: { ...helperMouse },
  turnsRemaining: null,
};
const carDistanceCells = maze.flat()
  .filter(
    (cell) =>
      cell?.active !== false &&
      !helperCellIsBlocked(cell) &&
      Number.isFinite(carPursuitDistance(car, cell)),
  )
  .map((cell) => ({ cell: { row: cell.row, col: cell.col }, distance: carPursuitDistance(car, cell) }))
  .filter((entry) => entry.distance >= 2)
  .sort((first, second) => first.distance - second.distance);
const nearCarCell = carDistanceCells[0]?.cell;
const farCarCell = carDistanceCells.at(-1)?.cell;
if (!nearCarCell || !farCarCell || keyOf(nearCarCell) === keyOf(farCarCell)) {
  throw new Error("Could not build a dynamic catcher targeting regression scenario");
}
helperMouse = { ...nearCarCell };
mouse = { ...farCarCell };
if (carPursuitTarget().kind !== "helper") {
  throw new Error("The catcher must pursue the closer helper");
}
helperMouse = { ...farCarCell };
mouse = { ...nearCarCell };
if (carPursuitTarget().kind !== "mouse") {
  throw new Error("The catcher must switch back to the closer player");
}
helperMouse = { ...nearCarCell };
mouse = { ...nearCarCell };
if (carPursuitTarget().kind !== "helper") {
  throw new Error("An active helper distraction must win an exact catcher-distance tie");
}
const adjacentCapture = maze.flat().flatMap((cell) =>
  neighbors(maze, cell).map((next) => ({ from: cell, to: next })),
)[0];
const catcherCaptureState = carTurnCaptureState(
  adjacentCapture.to,
  adjacentCapture.to,
  null,
  {
    from: { ...adjacentCapture.from },
    to: { ...adjacentCapture.from },
    targetedHelper: true,
  },
);
if (!catcherCaptureState.mouse) {
  throw new Error("A player inside the catcher's capture reach must lose even while it targets the helper");
}

mouse = { ...adjacentCapture.to };
exit = null;
rockPositions = [];
hiddenCheeseKeys = new Set();
collectedCheeseKeys = new Set();
collectedMilkIds = new Set();
eatenPieQuarterIds = new Set();
milkBottles = [];
pie = null;
cheeseTargets = [{ id: "final-priority-cheese", ...mouse }];
if (finalObjectiveAtMouse()?.kind !== "cheese") {
  throw new Error("A final cheese on the player's cell must outrank an adversity capture");
}
cheeseTargets.push({
  id: "non-final-priority-cheese",
  row: adjacentCapture.from.row,
  col: adjacentCapture.from.col,
});
if (finalObjectiveAtMouse()) {
  throw new Error("Adversity capture priority must remain unchanged while several objectives remain");
}
cheeseTargets = [];
milkBottles = [{
  id: "final-priority-milk",
  row: adjacentCapture.from.row,
  col: adjacentCapture.from.col,
  knocked: true,
  spill: { ...mouse },
}];
if (finalObjectiveAtMouse()?.kind !== "milk") {
  throw new Error("A final milk puddle on the player's cell must outrank an adversity capture");
}
milkBottles = [];
pie = {
  quarters: [{
    id: "final-priority-pie",
    row: adjacentCapture.from.row,
    col: adjacentCapture.from.col,
    helperDeliveredCell: { ...mouse },
  }],
};
if (finalObjectiveAtMouse()?.kind !== "pie") {
  throw new Error("A final delivered pie quarter must outrank an adversity capture");
}
catPawThreat = { cells: [{ ...mouse }] };
catPawStrikePending = true;
crowThreat = { cells: [{ ...mouse }] };
crowStrikePending = true;
cancelPendingAdversityStrikesForFinalObjective();
if (catPawThreat || catPawStrikePending || crowThreat || crowStrikePending) {
  throw new Error("Winning the final objective must cancel pending cat and crow strikes");
}

level = 29;
helperRequestedForRun = true;
loadLevelVariant(LEVEL_CONFIGS[level - 1], 0, "retry");
helperPlannerTurn = HELPER_OBSERVATION_TURNS;
catPawMovesSinceStrike = 0;
catPawNextTrigger = 10;
catPawThreat = null;
prepareHelperTurn(mouse);
if (helperTask?.type !== "fetch") {
  throw new Error(
    "The helper must fetch objectives while the cat is not approaching: " +
      JSON.stringify({
        task: helperTask,
        catTurns: catPawMovesUntilStrike(),
        remaining: remainingObjectiveCount(),
        descriptors: helperObjectiveDescriptors().map((descriptor) => ({
          key: descriptor.key,
          cell: descriptor.cell,
          path: findHelperPath(helperMouse, descriptor.cell, descriptor.allowedTargetKey).length,
          deliverable: helperCanDeliverFrom(descriptor.cell, mouse, helperLikelyPlayerIntent(mouse)),
        })),
        fetches: helperFetchCandidates(mouse, helperLikelyPlayerIntent(mouse)).map((candidate) => ({
          key: candidate.key,
          score: candidate.score,
        })),
      }),
  );
}

loadLevelVariant(LEVEL_CONFIGS[level - 1], 0, "retry");
helperPlannerTurn = HELPER_OBSERVATION_TURNS;
catPawMovesSinceStrike = 0;
catPawNextTrigger = 3;
catPawThreat = null;
prepareHelperTurn(mouse);
if (!helperDistractsAdversity("cat")) {
  throw new Error("Helper must proactively distract an imminent cat strike");
}
catPawThreat = chooseCatPawThreat();
if (
  catPawThreat?.targetKind !== "helper" ||
  !catPawThreatContains(catPawThreat, helperMouse)
) {
  throw new Error("A distracted cat must target the helper");
}
if (!helperTask?.objectiveGoal) {
  throw new Error("A helper fleeing the cat must retain a useful objective direction");
}
const catPlayerBeforeCaptureCheck = { ...mouse };
mouse = { ...catPawThreat.cells[0] };
if (!catPawCaptureTargets(catPawThreat).mouse) {
  throw new Error("The cat must capture a player who enters a helper-targeted strike zone");
}
mouse = catPlayerBeforeCaptureCheck;
const catEscapePath = helperThreatEscapePath("cat", mouse);
if (catEscapePath.length > 1 && helperTask.objectiveGoal?.cell) {
  const catGoalDistanceBefore = helperDistanceBetween(
    helperMouse,
    helperTask.objectiveGoal.cell,
  );
  const catGoalDistanceAfter = helperDistanceBetween(
    catEscapePath[1],
    helperTask.objectiveGoal.cell,
  );
  const catHasSafeGoalStep = neighbors(maze, maze[helperMouse.row][helperMouse.col]).some(
    (next) => {
      if (
        helperCellIsBlocked(next) ||
        helperDistanceBetween(next, helperTask.objectiveGoal.cell) >= catGoalDistanceBefore
      ) {
        return false;
      }
      if (!catPawThreatContains(catPawThreat, next)) return true;
      return Boolean(
        catPawMovesUntilStrike() > 1 &&
          catPawEscapePath(
            maze,
            catPawThreat,
            next,
            catPawMovesUntilStrike() - 1,
            (cell) => helperCellIsBlocked(cell),
          ),
      );
    },
  );
  if (catHasSafeGoalStep && catGoalDistanceAfter >= catGoalDistanceBefore) {
    throw new Error("The helper must flee the cat toward its objective when a safe route permits it");
  }
}
if (catEscapePath.length > 1) {
  prepareHelperTurn(mouse);
  if (keyOf(helperMotion?.to) !== keyOf(catEscapePath[1])) {
    throw new Error("A helper with time to escape the cat must take the safe route");
  }
}
const catCaptureCell = { ...helperMouse };
const catCarriedCheese = remainingCheeseTargets()[0];
pickupHelperObjective({ kind: "cheese", id: cheeseIdentity(catCarriedCheese) });
const catCaptureAnimation = {
  caughtHelper: true,
  helperCaptureCell: catCaptureCell,
  helperCaptureCommitted: false,
};
commitCatHelperCapture(catCaptureAnimation);
if (
  !catCaptureAnimation.helperCaptureCommitted ||
  catCarriedCheese.helperCarried ||
  keyOf(catCarriedCheese) !== keyOf(catCaptureCell)
) {
  throw new Error("The cat must remove the helper and leave its cheese in the capture cell");
}
prepareHelperTurn(mouse);
if (helperIsActive() || helperMouse || helperMotion || helperMode !== "captured") {
  throw new Error("A captured helper must stay out for the rest of the level");
}

level = 39;
helperRequestedForRun = true;
loadLevelVariant(LEVEL_CONFIGS[level - 1], 0, "retry");
for (let row = 0; row < ROWS; row += 1) {
  for (let col = 0; col < COLS; col += 1) {
    const cell = { row, col };
    if (!isInside(row, col)) continue;
    if (!crowThreatOptions().some((threat) => crowThreatContains(threat, cell))) {
      throw new Error("The crow cannot target cell " + keyOf(cell));
    }
  }
}
helperPlannerTurn = HELPER_OBSERVATION_TURNS;
crowMovesSinceStrike = 0;
crowNextTrigger = 10;
crowThreat = null;
prepareHelperTurn(mouse);
if (helperTask?.type !== "fetch") {
  throw new Error("The helper must fetch objectives while the crow is not approaching");
}

loadLevelVariant(LEVEL_CONFIGS[level - 1], 0, "retry");
const finalCrowCheese = remainingCheeseTargets()[0];
for (const target of remainingCheeseTargets().slice(1)) {
  collectedCheeseKeys.add(cheeseIdentity(target));
}
const helperFinalCheesePath = findShortestPathFrom(maze, mouse, finalCrowCheese);
helperMouse = { ...helperFinalCheesePath.at(-2) };
helperPlannerTurn = HELPER_OBSERVATION_TURNS;
crowMovesSinceStrike = 0;
crowNextTrigger = 10;
crowThreat = null;
prepareHelperTurn(mouse);
if (
  helperTask?.type !== "fetch" ||
  helperTask.kind !== "cheese" ||
  helperTask.id !== cheeseIdentity(finalCrowCheese)
) {
  throw new Error("The helper must fetch a final cheese when it can beat the player to it");
}

loadLevelVariant(LEVEL_CONFIGS[level - 1], 0, "retry");
helperPlannerTurn = HELPER_OBSERVATION_TURNS;
crowMovesSinceStrike = 0;
crowNextTrigger = 3;
crowThreat = null;
prepareHelperTurn(mouse);
crowThreat = chooseCrowThreat();
if (
  !helperDistractsAdversity("crow") ||
  crowThreat?.targetKind !== "helper" ||
  !crowThreatContains(crowThreat, helperMouse)
) {
  throw new Error("A distracted crow must target the helper anywhere on the board");
}
if (!helperTask?.objectiveGoal) {
  throw new Error("A helper fleeing the crow must retain a useful objective direction");
}
const crowPlayerBeforeCaptureCheck = { ...mouse };
const exposedCrowStrikeCell = crowThreat.cells.find((cell) => !cloudCoversCell(cell));
if (!exposedCrowStrikeCell) {
  throw new Error("Could not find an exposed crow strike cell for capture validation");
}
mouse = { ...exposedCrowStrikeCell };
if (!crowCaptureTargets(crowThreat).mouse) {
  throw new Error("The crow must capture a player who enters a helper-targeted strike zone");
}
mouse = crowPlayerBeforeCaptureCheck;
const crowEscapePath = helperThreatEscapePath("crow", mouse);
if (crowEscapePath.length > 1) {
  prepareHelperTurn(mouse);
  if (keyOf(helperMotion?.to) !== keyOf(crowEscapePath[1])) {
    throw new Error("A helper with time to escape the crow must take the safe route");
  }
}

loadLevelVariant(LEVEL_CONFIGS[level - 1], 0, "retry");
const deliveryCheese = remainingCheeseTargets()[0];
helperMouse = { ...deliveryCheese };
pickupHelperObjective({ kind: "cheese", id: cheeseIdentity(deliveryCheese) });
const closeDelivery = helperDeliveryPlan(mouse, helperMouse, helperLikelyPlayerIntent(mouse));
if (
  !closeDelivery ||
  closeDelivery.distance !== 1 ||
  helperDistanceBetween(closeDelivery.cell, mouse) !== 1 ||
  keyOf(closeDelivery.cell) === keyOf(deliveryCheese)
) {
  throw new Error("The helper must deliver a carried objective one path step from the player");
}

level = 12;
for (let variantIndex = 0; variantIndex < VARIANTS_PER_LEVEL; variantIndex += 1) {
  helperRequestedForRun = true;
  loadLevelVariant(LEVEL_CONFIGS[level - 1], variantIndex, "retry");
  helperPlannerTurn = HELPER_OBSERVATION_TURNS;
  let pushedRock = false;
  for (let turn = 0; turn < ROWS * COLS; turn += 1) {
    const before = helperRouteLengthForPlayer(mouse);
    prepareHelperTurn(mouse);
    if (!helperMotion) break;
    const motion = {
      from: { ...helperMotion.from },
      to: { ...helperMotion.to },
      action: helperMotion.action ? { ...helperMotion.action } : null,
    };
    commitHelperTurn(motion);
    if (motion.action?.type !== "pushRock") continue;
    const after = helperRouteLengthForPlayer(mouse);
    if (!Number.isFinite(after) || after > before || !helperTestedRockIds.has(String(motion.action.id))) {
      throw new Error(
        "The helper harmed the rock puzzle in level 12 variant " + (variantIndex + 1),
      );
    }
    pushedRock = true;
    break;
  }
  if (!pushedRock) {
    throw new Error(
      "The helper did not safely explore a rock in level 12 variant " + (variantIndex + 1),
    );
  }
}

level = 41;
helperRequestedForRun = true;
loadLevelVariant(LEVEL_CONFIGS[level - 1], 0, "retry");
const helperTunnelEntry = activeTunnels()[0];
helperMouse = { row: helperTunnelEntry.row, col: helperTunnelEntry.col };
helperTunnelCooldownTurns = 0;
const helperTunnelTravel = helperRandomTunnelAction(helperTunnelEntry.id);
if (!helperTunnelTravel) {
  throw new Error("The helper could not choose an independent random tunnel exit");
}
commitHelperTurn({
  from: { ...helperMouse },
  to: { ...helperTunnelTravel.to },
  action: { ...helperTunnelTravel.action },
});
if (
  activeTunnels().length !== initialTunnels.length ||
  tunnels.some((tunnel) => tunnel.sealed) ||
  keyOf(helperMouse) !== keyOf(helperTunnelTravel.to)
) {
  throw new Error("Helper tunnel travel must not consume or seal a tunnel");
}

level = 17;
helperRequestedForRun = true;
loadLevelVariant(LEVEL_CONFIGS[level - 1], 0, "retry");
const tornadoHelperBefore = { ...helperMouse };
const helperTornadoCandidate = buildLevelVariant(LEVEL_CONFIGS[level - 1], 1);
maze = helperTornadoCandidate.grid;
const helperRelocation = applyTornadoEntityLayout(helperTornadoCandidate);
if (
  !helperRelocation ||
  keyOf(helperRelocation.from) !== keyOf(tornadoHelperBefore) ||
  keyOf(helperRelocation.to) !== keyOf(helperMouse) ||
  !maze[helperMouse.row]?.[helperMouse.col]?.active ||
  helperCellIsBlocked(helperMouse)
) {
  throw new Error("The tornado must relocate the helper to a random legal map cell");
}
helperRequestedForRun = false;

globalThis.__level30GameplayAudit = [];
for (let variantIndex = 0; variantIndex < VARIANTS_PER_LEVEL; variantIndex += 1) {
  level = 30;
  const config = LEVEL_CONFIGS[level - 1];
  const variant = buildLevelVariant(config, variantIndex);
  loadLevelVariant(config, variantIndex, "retry");
  const forecast = buildCrystalForecast(
    variant.path.slice(1),
    variant.adversityPlan?.seedOffset ?? 0,
  );
  const scenarioResults = (variant.adversityPlan?.scenarioActions ?? []).map((scenario) => {
    loadLevelVariant(config, variantIndex, "retry");
    clearCrystalForecastReservation();
    if (scenario.cockroachInitialTrigger !== null) {
      cockroachMovesSinceAction = 0;
      cockroachNextTrigger = scenario.cockroachInitialTrigger;
    }
    if (scenario.catPawInitialTrigger !== null) {
      catPawMovesSinceStrike = 0;
      catPawNextTrigger = scenario.catPawInitialTrigger;
    }
    const result = buildCrystalForecast(variant.path.slice(1), scenario.seedOffset);
    return {
      complete: result.complete,
      actions: result.frames.length,
      expectedActions: scenario.actions,
      expectedComplete: scenario.complete,
      failure: result.failure,
      expectedFailure: scenario.failure,
    };
  });
  globalThis.__level30GameplayAudit.push({
    variant: variantIndex + 1,
    complete: forecast.complete,
    failure: forecast.failure,
    actions: forecast.frames.length,
    moveLimit,
    scenarioResults,
  });
}

globalThis.__combinedGameplayFailures = [];
for (let levelIndex = 0; levelIndex < LEVEL_CONFIGS.length; levelIndex += 1) {
  const config = LEVEL_CONFIGS[levelIndex];
  if (!config) continue;
  for (let variantIndex = 0; variantIndex < VARIANTS_PER_LEVEL; variantIndex += 1) {
    const variantConfig = resolveLevelConfigForVariant(config, variantIndex);
    if (
      variantConfig.activeAdversities?.length < 2 ||
      !variantConfig.hingedWallCount
    ) {
      continue;
    }
    level = levelIndex + 1;
    const variant = buildLevelVariant(config, variantIndex);
    loadLevelVariant(config, variantIndex, "retry");
    const forecast = buildCrystalForecast(
      variant.path.slice(1),
      variant.adversityPlan?.seedOffset ?? 0,
    );
    if (!forecast.complete || forecast.frames.length > moveLimit) {
      globalThis.__combinedGameplayFailures.push({
        level,
        variant: variantIndex + 1,
        adversities: variantConfig.activeAdversities,
        failure: forecast.failure,
        actions: forecast.frames.length,
        moveLimit,
      });
    }
  }
}
`;

vm.runInNewContext(generatedLevels + "\n" + gameWithoutBootstrap + verification, sandbox, {
  filename: "game.js",
  timeout: 180000,
});

for (const result of sandbox.__level30GameplayAudit) {
  console.log(
    `Level 30 gameplay v${result.variant}: ${result.complete ? "complete" : "FAILED"} ` +
    `${result.actions}/${result.moveLimit}${result.failure ? ` (${result.failure})` : ""}`,
  );
  if (!result.complete || result.actions > result.moveLimit) {
    throw new Error(
      `Level 30 variant ${result.variant} fails the combined gameplay simulation`,
    );
  }
  if (
    result.scenarioResults.some(
      (scenario) =>
        scenario.actions > result.moveLimit ||
        scenario.actions !== scenario.expectedActions ||
        scenario.complete !== scenario.expectedComplete ||
        scenario.failure !== scenario.expectedFailure,
    )
  ) {
    throw new Error(
      `Level 30 variant ${result.variant} fails its multi-scenario gameplay audit`,
    );
  }
  const completeScenarios = result.scenarioResults.filter((scenario) => scenario.complete);
  if (completeScenarios.length < Math.ceil(result.scenarioResults.length * 2 / 3)) {
    throw new Error(
      `Level 30 variant ${result.variant} completes too few sampled luck scenarios`,
    );
  }
  const scenarioActions = completeScenarios.map((scenario) => scenario.actions);
  console.log(
    `  ${completeScenarios.length}/${result.scenarioResults.length} sampled scenarios complete; ` +
      `successful range ${Math.min(...scenarioActions)}-${Math.max(...scenarioActions)} actions`,
  );
}
if (sandbox.__combinedGameplayFailures.length) {
  for (const result of sandbox.__combinedGameplayFailures) console.log(result);
  throw new Error("A combined-adversity variant fails full gameplay simulation");
}

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
console.log(
  "Validated power introductions: " +
  `Tornado at step ${sandbox.__powerIntroValidation.tornado.step} ` +
  `(${sandbox.__powerIntroValidation.tornado.savings} moves saved); ` +
  `Hammer at step ${sandbox.__powerIntroValidation.hammer.step} ` +
  `(${sandbox.__powerIntroValidation.hammer.savings} moves saved); ` +
  `Crystal forecast ${sandbox.__powerIntroValidation.crystal.actions} actions.`,
);
console.log(
  "Validated power practice: " +
  `Tornado ${sandbox.__powerPracticeValidation.tornado.from}->` +
  `${sandbox.__powerPracticeValidation.tornado.to}; ` +
  "Hammer " + sandbox.__powerPracticeValidation.hammer
    .map((result) => `step ${result.step}/+${result.savings}`)
    .join(", ") + "; " +
  "Crystal " + sandbox.__powerPracticeValidation.crystal
    .map((result) => result.actions)
    .join(", ") + " actions.",
);
console.log("Validated carrot, milk, pie, catcher, cockroach, cat-paw, crow, cloud, water, rock, hinged-wall, transport-tunnel, rotating-floor, fragile-floor, and spider-web objectives.");
