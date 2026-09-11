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
];
if (LEVEL_CONFIGS.length !== 70 || WORLD_LEVELS.length !== 70) {
  throw new Error("The campaign must contain 70 levels");
}

const sectionSize = 10;
const sectionTotals = Array.from(
  { length: Math.ceil(LEVEL_CONFIGS.length / sectionSize) },
  (_, sectionIndex) => Math.min(
    sectionSize,
    LEVEL_CONFIGS.length - sectionIndex * sectionSize,
  ),
);
if (sectionTotals.join(",") !== "10,10,10,10,10,10,10") {
  throw new Error("The campaign must be grouped into seven sections of 10 levels");
}
if (LEVEL_CONFIGS.some((config, index) => config?.difficultyCode !== expectedCodes[index])) {
  throw new Error("The four-section difficulty curve does not match the agreed plan");
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
  !LEVEL_CONFIGS.slice(62).every((config) => Boolean(config.cloudMode)) ||
  LEVEL_CONFIGS[69]?.difficultyCode !== "I" ||
  adversitiesForVariant(LEVEL_CONFIGS[69], 0).length !== 2
) {
  throw new Error("The crow or seventh-section cloud curve is misplaced");
}
const expectedMechanicTutorials = new Map([
  [3, "milk"],
  [9, "car"],
  [12, "rock"],
  [19, "cockroach"],
  [22, "hinge"],
  [29, "catPaw"],
  [32, "pie"],
  [39, "crow"],
  [41, "tunnel"],
  [56, "water"],
  [62, "cloud"],
]);
for (const [tutorialLevel, expectedKind] of expectedMechanicTutorials) {
  level = tutorialLevel;
  const config = LEVEL_CONFIGS[tutorialLevel - 1];
  const actualKind = mechanicTutorialKindForLevel(config);
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
    if (variant.moveLimit > MAX_MOVES_PER_LEVEL) {
      throw new Error(
        "Move limit exceeds " + MAX_MOVES_PER_LEVEL + " in level " +
          (levelIndex + 1) + " variant " + (variantIndex + 1),
      );
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
      const calibratedDistance = variant.adversityPlan?.expectedActions?.length ?? distance;
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
  timeout: 120000,
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
console.log("Validated milk, pie, catcher, cockroach, cat-paw, crow, cloud, water, rock, hinged-wall, transport-tunnel, and rotating-floor objectives.");
