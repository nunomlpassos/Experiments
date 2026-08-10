import { readFile } from "node:fs/promises";
import vm from "node:vm";

const source = await readFile(new URL("../game.js", import.meta.url), "utf8");
const gameWithoutBootstrap = source.replace(
  /\nif \(!restoreCampaignState\(\)\) generateLevel\(\);\s*$/,
  "\n",
);

function createElement() {
  const classes = new Set();
  return {
    addEventListener() {},
    append() {},
    classList: {
      add(...names) {
        names.forEach((name) => classes.add(name));
      },
      contains(name) {
        return classes.has(name);
      },
      remove(...names) {
        names.forEach((name) => classes.delete(name));
      },
      toggle(name, force) {
        const enabled = force === undefined ? !classes.has(name) : Boolean(force);
        if (enabled) classes.add(name);
        else classes.delete(name);
        return enabled;
      },
    },
    disabled: false,
    getBoundingClientRect: () => ({ width: 0, height: 0 }),
    getContext: () => ({}),
    hidden: false,
    offsetWidth: 0,
    setAttribute() {},
    textContent: "",
  };
}

const elements = new Map();
const storage = new Map();
let timerId = 0;
const timers = new Map();
const sandbox = {
  Image: class {
    addEventListener() {}
  },
  ResizeObserver: class {
    observe() {}
  },
  cancelAnimationFrame() {},
  console,
  crypto: {
    getRandomValues(values) {
      values[0] = 123456789;
      return values;
    },
  },
  document: {
    querySelector(selector) {
      if (!elements.has(selector)) elements.set(selector, createElement());
      return elements.get(selector);
    },
  },
  globalThis: null,
  localStorage: {
    getItem(key) {
      return storage.get(key) ?? null;
    },
    removeItem(key) {
      storage.delete(key);
    },
    setItem(key, value) {
      storage.set(key, String(value));
    },
  },
  requestAnimationFrame() {
    return 1;
  },
  setTimeout(callback) {
    timerId += 1;
    timers.set(timerId, callback);
    return timerId;
  },
  clearTimeout(id) {
    timers.delete(id);
  },
  runNextTimer() {
    const next = timers.entries().next();
    if (next.done) return false;
    const [id, callback] = next.value;
    timers.delete(id);
    callback();
    return true;
  },
};
sandbox.globalThis = sandbox;

const verification = `
globalThis.__variantValidation = LEVEL_CONFIGS.map((config, levelIndex) => {
  const signatures = new Set();
  const exitKeys = new Set();
  const exitRows = new Set();
  const variants = [];

  for (let variantIndex = 0; variantIndex < VARIANTS_PER_LEVEL; variantIndex += 1) {
    const variant = buildLevelVariant(config, variantIndex);
    const distance = variant.path.length - 1;
    const routes = countRoutesToExit(variant.grid, variant.exit);
    const alternate = findMeaningfulAlternative(
      variant.grid,
      variant.exit,
      variant.path,
      config.moveLimit,
    );
    const signature = variant.grid
      .flat()
      .map((cell) => [cell.walls.top, cell.walls.right, cell.walls.bottom, cell.walls.left]
        .map((wall) => Number(wall))
        .join(""))
      .join("") + ":" + keyOf(variant.exit);

    if (distance < config.minPath || distance > config.maxPath) {
      throw new Error("Level " + (levelIndex + 1) + " variant " + (variantIndex + 1) + " has invalid distance");
    }
    if (distance > config.moveLimit || routes < 2 || !alternate) {
      throw new Error("Level " + (levelIndex + 1) + " variant " + (variantIndex + 1) + " breaks route rules");
    }
    if (signatures.has(signature)) {
      throw new Error("Level " + (levelIndex + 1) + " contains duplicate variants");
    }

    signatures.add(signature);
    exitKeys.add(keyOf(variant.exit));
    exitRows.add(variant.exit.row);
    variants.push({
      variant: variantIndex + 1,
      distance,
      routes,
      alternateDistance: alternate.length - 1,
      attempt: variant.attempt,
      exit: keyOf(variant.exit),
    });
  }

  if (exitKeys.size !== VARIANTS_PER_LEVEL) {
    throw new Error("Level " + (levelIndex + 1) + " repeats a cheese position");
  }
  if (exitRows.size < 3) {
    throw new Error("Level " + (levelIndex + 1) + " does not spread cheese across enough rows");
  }

  return { level: levelIndex + 1, moveLimit: config.moveLimit, variants };
});

globalThis.__variantSequences = levelVariantStates.map((state, levelIndex) => {
  state.current = -1;
  state.remaining = [];
  const sequence = Array.from({ length: VARIANTS_PER_LEVEL * 2 }, () => takeNextVariant(levelIndex));
  const firstCycle = new Set(sequence.slice(0, VARIANTS_PER_LEVEL));
  const secondCycle = new Set(sequence.slice(VARIANTS_PER_LEVEL));
  if (firstCycle.size !== VARIANTS_PER_LEVEL || secondCycle.size !== VARIANTS_PER_LEVEL) {
    throw new Error("Level " + (levelIndex + 1) + " repeats a variant before completing a cycle");
  }
  if (sequence[VARIANTS_PER_LEVEL - 1] === sequence[VARIANTS_PER_LEVEL]) {
    throw new Error("Level " + (levelIndex + 1) + " repeats across cycle boundaries");
  }
  return sequence;
});

level = 3;
const retryConfig = LEVEL_CONFIGS[level - 1];
const retryVariantIndex = 3;
const retryExpected = buildLevelVariant(retryConfig, retryVariantIndex);
const retryState = levelVariantStates[level - 1];
retryState.current = retryVariantIndex;
const retryRemainingBefore = [...retryState.remaining];
maze = blankMaze();
maze[5][5].walls.top = false;
exit = { row: 0, col: 0 };
activeVariantIndex = 1;
powerInventory = createEmptyPowerInventory();
powerInventory.hammer = 2;
syncPowerAvailability();
retryLevel();
const retryMazeSignature = maze
  .flat()
  .map((cell) =>
    [cell.walls.top, cell.walls.right, cell.walls.bottom, cell.walls.left]
      .map((wall) => Number(wall))
      .join(""),
  )
  .join("");
const retryExpectedSignature = retryExpected.grid
  .flat()
  .map((cell) =>
    [cell.walls.top, cell.walls.right, cell.walls.bottom, cell.walls.left]
      .map((wall) => Number(wall))
      .join(""),
  )
  .join("");
if (
  retryMazeSignature !== retryExpectedSignature ||
  exit.row !== retryExpected.exit.row ||
  exit.col !== retryExpected.exit.col ||
  activeVariantIndex !== retryVariantIndex ||
  retryState.current !== retryVariantIndex ||
  JSON.stringify(retryState.remaining) !== JSON.stringify(retryRemainingBefore) ||
  mouse.row !== START.row ||
  mouse.col !== START.col ||
  movesLeft !== retryConfig.moveLimit ||
  !hammerAvailable ||
  powerInventory.hammer !== 2
) {
  throw new Error("Retry did not restore the exact level while preserving inventory");
}

level = 4;
const persistedConfig = LEVEL_CONFIGS[level - 1];
const persistedVariantIndex = 4;
const persistedRetryVariantIndex = 1;
const persistedVariant = buildLevelVariant(persistedConfig, persistedVariantIndex);
const persistedRestartVariant = buildLevelVariant(persistedConfig, persistedRetryVariantIndex);
maze = persistedVariant.grid;
exit = { ...persistedVariant.exit };
mouse = { ...persistedVariant.path[4] };
moveLimit = persistedConfig.moveLimit;
movesLeft = 12;
shortestPath = persistedVariant.path;
activeVariantIndex = persistedVariantIndex;
levelVariantStates[level - 1].current = persistedRetryVariantIndex;
gameOver = false;
campaignComplete = false;

let openedPersistedWall = false;
for (let row = 0; row < SIZE && !openedPersistedWall; row += 1) {
  for (let col = 0; col < SIZE - 1; col += 1) {
    if (!maze[row][col].walls.right) continue;
    maze[row][col].walls.right = false;
    maze[row][col + 1].walls.left = false;
    openedPersistedWall = true;
    break;
  }
}

powerInventory.hammer = 0;
syncPowerAvailability();
saveEconomyState();
saveCampaignState();

level = 1;
activeVariantIndex = -1;
maze = blankMaze();
exit = null;
mouse = { ...START };
movesLeft = 0;
levelVariantStates[3].current = -1;
powerInventory.hammer = 5;
loadEconomyState();

const persistedRestartSignature = persistedRestartVariant.grid
  .flat()
  .map((cell) =>
    [cell.walls.top, cell.walls.right, cell.walls.bottom, cell.walls.left]
      .map((wall) => Number(wall))
      .join(""),
  )
  .join("");

if (
  !restoreCampaignState() ||
  level !== 4 ||
  activeVariantIndex !== persistedRetryVariantIndex ||
  levelVariantStates[3].current !== persistedRetryVariantIndex ||
  mouse.row !== START.row ||
  mouse.col !== START.col ||
  exit.row !== persistedRestartVariant.exit.row ||
  exit.col !== persistedRestartVariant.exit.col ||
  movesLeft !== persistedConfig.moveLimit ||
  maze
    .flat()
    .map((cell) =>
      [cell.walls.top, cell.walls.right, cell.walls.bottom, cell.walls.left]
        .map((wall) => Number(wall))
        .join(""),
    )
    .join("") !== persistedRestartSignature ||
  powerInventory.hammer !== 0 ||
  hammerAvailable ||
  gameOver ||
  controlsPanelEl.hidden !== true
) {
  throw new Error("Campaign state did not restart the saved level while preserving spent powers");
}

const originalRequestAnimationFrame = globalThis.requestAnimationFrame;
const originalCancelAnimationFrame = globalThis.cancelAnimationFrame;
const originalPerformance = globalThis.performance;
const originalMatchMedia = globalThis.matchMedia;
const motionFrames = [];
let motionFrameId = 0;
globalThis.performance = { now: () => 0 };
globalThis.matchMedia = () => ({ matches: false });
globalThis.requestAnimationFrame = (callback) => {
  motionFrameId += 1;
  motionFrames.push(callback);
  return motionFrameId;
};
globalThis.cancelAnimationFrame = () => {};
drawRequest = 0;

const motionOrigin = { ...mouse };
const motionMovesBefore = movesLeft;
const motionDirection = DIRS.find((dir) => !maze[mouse.row][mouse.col].walls[dir.wall]);
const motionTarget = {
  row: motionOrigin.row + motionDirection.row,
  col: motionOrigin.col + motionDirection.col,
};
move(motionDirection.key);

if (
  !mouseMotion ||
  mouse.row !== motionOrigin.row ||
  mouse.col !== motionOrigin.col ||
  movesLeft !== motionMovesBefore ||
  !movementPanelEl.classList.contains("moving")
) {
  throw new Error("Animated movement changed the logical cell before the animation began");
}

motionFrames.shift()(0);
motionFrames.shift()(MOUSE_MOVE_DURATION_MS / 2);
const halfwayMouse = currentMouseVisualState();
if (
  Math.abs(mouseMotion.progress - 0.5) > 0.001 ||
  Math.abs(halfwayMouse.row - (motionOrigin.row + motionTarget.row) / 2) > 0.001 ||
  Math.abs(halfwayMouse.col - (motionOrigin.col + motionTarget.col) / 2) > 0.001 ||
  halfwayMouse.step < 0.99 ||
  movesLeft !== motionMovesBefore
) {
  throw new Error("Animated movement did not interpolate cleanly between cells");
}

motionFrames.shift()(MOUSE_MOVE_DURATION_MS);
if (
  mouseMotion ||
  mouse.row !== motionTarget.row ||
  mouse.col !== motionTarget.col ||
  movesLeft !== motionMovesBefore - 1 ||
  movementPanelEl.classList.contains("moving")
) {
  throw new Error("Animated movement did not finish on the target cell");
}

globalThis.requestAnimationFrame = originalRequestAnimationFrame;
globalThis.cancelAnimationFrame = originalCancelAnimationFrame;
globalThis.performance = originalPerformance;
globalThis.matchMedia = originalMatchMedia;
drawRequest = 0;

const attemptTestNow = Date.now() + 60000;
attempts = MAX_ATTEMPTS;
nextAttemptAt = null;
saveAttemptState();
updateAttemptUI(attemptTestNow);
if (attemptTimerEl.hidden || attemptTimerEl.textContent !== "MAX") {
  throw new Error("Attempt system did not show MAX at seven attempts");
}
if (!spendAttempt(attemptTestNow)) {
  throw new Error("Attempt system refused an available attempt");
}
const firstRecoveryAt = attemptTestNow + ATTEMPT_RECOVERY_MS;
if (
  attempts !== 6 ||
  nextAttemptAt !== firstRecoveryAt ||
  attemptCountEl.textContent !== "6" ||
  attemptTimerEl.hidden
) {
  throw new Error("Attempt system did not begin its 30-minute recovery");
}

spendAttempt(attemptTestNow + 100);
const persistedAttemptState = JSON.parse(
  globalThis.localStorage.getItem(ATTEMPT_STORAGE_KEY),
);
if (
  attempts !== 5 ||
  nextAttemptAt !== firstRecoveryAt ||
  persistedAttemptState.attempts !== 5 ||
  persistedAttemptState.nextAttemptAt !== firstRecoveryAt
) {
  throw new Error("Attempt system did not preserve the active recovery timer");
}

attempts = MAX_ATTEMPTS;
nextAttemptAt = null;
loadAttemptState(attemptTestNow + 1000);
if (attempts !== 5 || nextAttemptAt !== firstRecoveryAt) {
  throw new Error("Attempt state did not survive an app restart");
}
syncAttempts(firstRecoveryAt);
if (attempts !== 6 || nextAttemptAt !== firstRecoveryAt + ATTEMPT_RECOVERY_MS) {
  throw new Error("Attempt system did not recover the first offline attempt");
}
syncAttempts(firstRecoveryAt + ATTEMPT_RECOVERY_MS);
updateAttemptUI(firstRecoveryAt + ATTEMPT_RECOVERY_MS);
if (
  attempts !== MAX_ATTEMPTS ||
  nextAttemptAt !== null ||
  attemptTimerEl.hidden ||
  attemptTimerEl.textContent !== "MAX"
) {
  throw new Error("Attempt recovery did not stop at the maximum of seven");
}

attempts = 2;
nextAttemptAt = null;
retryCostsAttempt = true;
gameOver = true;
campaignComplete = false;
handleRetry(attemptTestNow);
if (attempts !== 1 || gameOver || retryCostsAttempt) {
  throw new Error("A failed-level retry did not consume exactly one attempt");
}

attempts = 1;
nextAttemptAt = attemptTestNow + ATTEMPT_RECOVERY_MS;
retryCostsAttempt = false;
gameOver = true;
handleRetry(attemptTestNow + 1000);
if (attempts !== 1 || gameOver) {
  throw new Error("A completed-level retry incorrectly consumed an attempt");
}

attempts = 0;
nextAttemptAt = attemptTestNow + ATTEMPT_RECOVERY_MS;
retryCostsAttempt = true;
gameOver = true;
retryButton.disabled = false;
handleRetry(attemptTestNow + 1000);
if (
  attempts !== 0 ||
  !gameOver ||
  !retryButton.disabled ||
  !messageEl.textContent.includes("No attempts available")
) {
  throw new Error("Retry was not blocked when no attempts remained");
}

attempts = MAX_ATTEMPTS;
nextAttemptAt = null;
retryCostsAttempt = false;
gameOver = false;
saveAttemptState();
updateAttemptUI(attemptTestNow);

if (
  POWER_CONFIGS.crystal.price !== 10 ||
  POWER_CONFIGS.tornado.price !== 20 ||
  POWER_CONFIGS.hammer.price !== 30 ||
  POWER_CONFIGS.fishing.price !== 40 ||
  POWER_CONFIGS.rocket.price !== 50
) {
  throw new Error("Power shop prices do not match the configured economy");
}

globalThis.localStorage.removeItem(ECONOMY_STORAGE_KEY);
loadEconomyState();
powerControlsEnabled = true;
gameOver = false;
campaignComplete = false;
updateCurrencyUI();
updatePowerUI();
if (
  currency !== STARTING_CURRENCY ||
  Object.values(powerInventory).some((count) => count !== 1) ||
  currencyCountEl.textContent !== "100" ||
  crystalPowerCountEl.textContent !== "1" ||
  tornadoPowerCountEl.textContent !== "1" ||
  hammerPowerCountEl.textContent !== "1" ||
  fishingPowerCountEl.textContent !== "1" ||
  rocketPowerCountEl.textContent !== "1" ||
  crystalPowerButton.disabled ||
  hammerPowerButton.disabled
) {
  throw new Error("The test build did not start with 100 buttons and one of each power");
}

powerInventory = createEmptyPowerInventory();
syncPowerAvailability();
saveEconomyState();
updatePowerUI();
handlePowerButton("crystal", () => {
  throw new Error("An empty power activated instead of opening the shop");
});
if (powerShopEl.hidden || shopPowerKey !== "crystal" || powerShopBuyButton.disabled) {
  throw new Error("The empty crystal power did not open its purchase confirmation");
}
if (!buySelectedPower() || !buySelectedPower()) {
  throw new Error("The shop refused an affordable stacked purchase");
}
const persistedEconomyState = JSON.parse(
  globalThis.localStorage.getItem(ECONOMY_STORAGE_KEY),
);
if (
  currency !== 80 ||
  powerInventory.crystal !== 2 ||
  crystalPowerCountEl.textContent !== "2" ||
  persistedEconomyState.currency !== 80 ||
  persistedEconomyState.powerInventory.crystal !== 2 ||
  powerShopEl.hidden
) {
  throw new Error("Purchases did not accumulate or persist correctly");
}
closePowerShop();
if (!powerShopEl.hidden || !powerControlsEnabled || moveUpButton.disabled) {
  throw new Error("Closing the power shop did not restore gameplay controls");
}

currency = 0;
powerInventory = createEmptyPowerInventory();
syncPowerAvailability();
loadEconomyState();
if (currency !== 80 || powerInventory.crystal !== 2 || !crystalAvailable) {
  throw new Error("The economy did not survive an app restart");
}

currency = 5;
powerInventory = createEmptyPowerInventory();
syncPowerAvailability();
saveEconomyState();
updateCurrencyUI();
updatePowerUI();
openPowerShop("rocket");
if (
  buySelectedPower() ||
  powerInventory.rocket !== 0 ||
  currency !== 5 ||
  !powerShopBuyButton.disabled ||
  powerShopWarningEl.hidden
) {
  throw new Error("The shop allowed a purchase without enough shirt buttons");
}
closePowerShop();

currency = STARTING_CURRENCY;
powerInventory = createEmptyPowerInventory();
syncPowerAvailability();
saveEconomyState();
updateCurrencyUI();
updatePowerUI();

gameOver = false;
campaignComplete = false;
movesLeft = 3;
updateMoveWarningUI();
if (
  !movesStatEl.classList.contains("moves-warning-slow") ||
  movesStatEl.classList.contains("moves-warning-fast")
) {
  throw new Error("Three remaining moves did not trigger the slow warning");
}
movesLeft = 2;
updateMoveWarningUI();
if (
  !movesStatEl.classList.contains("moves-warning-slow") ||
  movesStatEl.classList.contains("moves-warning-fast")
) {
  throw new Error("Two remaining moves did not keep the slow warning");
}
movesLeft = 1;
updateMoveWarningUI();
if (
  movesStatEl.classList.contains("moves-warning-slow") ||
  !movesStatEl.classList.contains("moves-warning-fast")
) {
  throw new Error("The final move did not switch to the fast warning");
}
movesLeft = 0;
updateMoveWarningUI();
if (
  movesStatEl.classList.contains("moves-warning-slow") ||
  movesStatEl.classList.contains("moves-warning-fast")
) {
  throw new Error("Move warnings remained active after the final move");
}

maze = blankMaze();
mouse = { row: 5, col: 5 };
exit = { row: 4, col: 5 };
movesLeft = 1;
powerControlsEnabled = true;
powerInventory = createEmptyPowerInventory();
powerInventory.hammer = 1;
syncPowerAvailability();
updatePowerUI();
if (
  !hammerPowerButton.classList.contains("finish-alert") ||
  fishingPowerButton.classList.contains("finish-alert") ||
  rocketPowerButton.classList.contains("finish-alert")
) {
  throw new Error("The hammer finish suggestion was not isolated correctly");
}

powerInventory = createEmptyPowerInventory();
syncPowerAvailability();
updatePowerUI();
if (hammerPowerButton.classList.contains("finish-alert")) {
  throw new Error("An unavailable hammer incorrectly showed a finish suggestion");
}

exit = { row: 3, col: 3 };
powerInventory.fishing = 1;
syncPowerAvailability();
updatePowerUI();
if (!fishingPowerButton.classList.contains("finish-alert")) {
  throw new Error("The fishing rod did not signal a catchable final move");
}

powerInventory = createEmptyPowerInventory();
powerInventory.rocket = 1;
exit = { row: 5, col: 7 };
syncPowerAvailability();
updatePowerUI();
if (!rocketPowerButton.classList.contains("finish-alert")) {
  throw new Error("The rocket did not signal a reachable final square");
}

movesLeft = 2;
updatePowerUI();
if (
  hammerPowerButton.classList.contains("finish-alert") ||
  fishingPowerButton.classList.contains("finish-alert") ||
  rocketPowerButton.classList.contains("finish-alert")
) {
  throw new Error("Finish suggestions appeared before the final move");
}

maze = blankMaze();
mouse = { row: 5, col: 5 };
powerInventory = createEmptyPowerInventory();
powerInventory.hammer = 1;
syncPowerAvailability();
hammerTargeting = true;
powerControlsEnabled = true;
const hammerTarget = getHammerTargets().find((target) => target.dir.key === "up");
const movesBeforeHammer = movesLeft;
destroyHammerTarget(hammerTarget);
if (
  maze[5][5].walls.top ||
  maze[4][5].walls.bottom ||
  hammerAvailable ||
  hammerTargeting ||
  movesLeft !== movesBeforeHammer
) {
  throw new Error("Hammer power did not open both sides of the wall cleanly");
}

maze = blankMaze();
mouse = { row: 0, col: 0 };
const cornerTargets = getHammerTargets();
if (
  cornerTargets.length !== 2 ||
  cornerTargets.some((target) => target.dir.key === "up" || target.dir.key === "left")
) {
  throw new Error("Hammer power exposed an outer-frame wall");
}

maze = blankMaze();
mouse = { row: 5, col: 5 };
const centerRocketTargets = getRocketTargets();
if (
  centerRocketTargets.length !== 12 ||
  centerRocketTargets.some((target) => {
    const distance = Math.abs(target.row - mouse.row) + Math.abs(target.col - mouse.col);
    return distance < 1 || distance > 2;
  })
) {
  throw new Error("Rocket power produced an invalid two-move landing area");
}

mouse = { row: 0, col: 0 };
if (getRocketTargets().length !== 5) {
  throw new Error("Rocket power did not clip its landing area at the board edge");
}

mouse = { row: 5, col: 5 };
exit = { row: 0, col: 9 };
powerInventory.rocket = 1;
syncPowerAvailability();
rocketTargeting = true;
gameOver = false;
campaignComplete = false;
movesLeft = 17;
useRocketTarget({ row: 3, col: 5 });
if (
  mouse.row !== 3 ||
  mouse.col !== 5 ||
  rocketAvailable ||
  rocketTargeting ||
  movesLeft !== 17
) {
  throw new Error("Rocket power did not land cleanly without consuming a move");
}

maze = blankMaze();
mouse = { row: 5, col: 5 };
powerInventory = createEmptyPowerInventory();
powerInventory.hammer = 1;
powerInventory.rocket = 1;
syncPowerAvailability();
hammerTargeting = false;
rocketTargeting = false;
gameOver = false;
campaignComplete = false;
powerControlsEnabled = true;
activateHammerPower();
activateRocketPower();
if (hammerTargeting || !rocketTargeting || !hammerAvailable || !rocketAvailable) {
  throw new Error("Switching powers consumed a charge or left both powers active");
}
cancelActivePower("Power cancelled");
if (hammerTargeting || rocketTargeting || !hammerAvailable || !rocketAvailable) {
  throw new Error("Cancelling a power consumed a charge");
}

level = 1;
const tornadoOriginal = buildLevelVariant(LEVEL_CONFIGS[0], 0);
maze = tornadoOriginal.grid;
exit = tornadoOriginal.exit;
shortestPath = tornadoOriginal.path;
activeVariantIndex = 0;
levelVariantStates[0].current = 0;
mouse = { ...START };
movesLeft = 99;
powerInventory = createEmptyPowerInventory();
powerInventory.tornado = 1;
powerInventory.rocket = 1;
syncPowerAvailability();
tornadoTargeting = true;
const mouseBeforeTornado = { ...mouse };
const exitBeforeTornado = { ...exit };
const retryVariantBeforeTornado = levelVariantStates[0].current;
tornadoCandidate = chooseSafeTornadoCandidate();
if (
  !tornadoCandidate ||
  tornadoCandidate.variantIndex === activeVariantIndex ||
  tornadoCandidate.pathFromMouse.length - 1 > movesLeft
) {
  throw new Error("Tornado power did not choose a safe alternate variation");
}
useTornadoPower();
if (
  mouse.row !== mouseBeforeTornado.row ||
  mouse.col !== mouseBeforeTornado.col ||
  exit.row !== exitBeforeTornado.row ||
  exit.col !== exitBeforeTornado.col ||
  movesLeft !== 99 ||
  tornadoAvailable ||
  tornadoTargeting ||
  hammerAvailable ||
  !rocketAvailable ||
  levelVariantStates[0].current !== retryVariantBeforeTornado ||
  !shortestPath.length
) {
  throw new Error("Tornado power failed to preserve the active run state");
}

maze = tornadoOriginal.grid;
exit = tornadoOriginal.exit;
activeVariantIndex = 0;
mouse = { ...START };
movesLeft = 0;
if (chooseSafeTornadoCandidate()) {
  throw new Error("Tornado power allowed a variation that cannot fit the remaining moves");
}

const crystalVariant = buildLevelVariant(LEVEL_CONFIGS[2], 2);
maze = crystalVariant.grid;
exit = crystalVariant.exit;
shortestPath = crystalVariant.path;
mouse = { ...START };
movesLeft = LEVEL_CONFIGS[2].moveLimit;
gameOver = false;
campaignComplete = false;
powerInventory = createEmptyPowerInventory();
powerInventory.crystal = 1;
syncPowerAvailability();
crystalTargeting = false;
crystalCandidatePath = [];
powerControlsEnabled = true;
const crystalMovesBefore = movesLeft;
const crystalMouseBefore = { ...mouse };
activateCrystalPower();
if (
  !crystalTargeting ||
  !crystalAvailable ||
  crystalCandidatePath.length !== crystalVariant.path.length - 1 ||
  crystalCandidateIncomplete ||
  !moveUpButton.disabled
) {
  throw new Error("Crystal power did not prepare the shortest route cleanly");
}
cancelActivePower("Crystal cancelled");
if (
  crystalTargeting ||
  !crystalAvailable ||
  crystalCandidatePath.length ||
  crystalCandidateIncomplete
) {
  throw new Error("Cancelling crystal power consumed it or kept a route active");
}

activateCrystalPower();
useCrystalPower();
if (
  crystalAvailable ||
  crystalTargeting ||
  !crystalRevealing ||
  crystalVisibleCount !== 1 ||
  crystalRevealPath.length !== crystalVariant.path.length - 1 ||
  powerControlsEnabled ||
  !moveUpButton.disabled
) {
  throw new Error("Crystal power did not begin its locked route reveal");
}

const firstCrystalStep = crystalRevealPath[0];
const crystalDirection = DIRS.find(
  (dir) =>
    crystalMouseBefore.row + dir.row === firstCrystalStep.row &&
    crystalMouseBefore.col + dir.col === firstCrystalStep.col,
);
move(crystalDirection.key);
if (
  mouse.row !== crystalMouseBefore.row ||
  mouse.col !== crystalMouseBefore.col ||
  movesLeft !== crystalMovesBefore
) {
  throw new Error("Crystal reveal allowed movement before the vision disappeared");
}

let crystalTimerGuard = 0;
while (crystalRevealing && crystalTimerGuard < 100) {
  if (!runNextTimer()) break;
  crystalTimerGuard += 1;
}
if (
  crystalRevealing ||
  crystalRevealPath.length ||
  crystalVisibleCount ||
  !powerControlsEnabled ||
  moveUpButton.disabled
) {
  throw new Error("Crystal route did not disappear before restoring controls");
}

maze = crystalVariant.grid;
exit = crystalVariant.exit;
mouse = { ...START };
movesLeft = crystalVariant.path.length - 2;
gameOver = false;
campaignComplete = false;
controlsPanelEl.hidden = true;
powerInventory = createEmptyPowerInventory();
powerInventory.crystal = 1;
powerInventory.tornado = 1;
powerInventory.hammer = 1;
powerInventory.rocket = 1;
syncPowerAvailability();
crystalTargeting = false;
crystalCandidateIncomplete = false;
powerControlsEnabled = true;
const insufficientMoves = movesLeft;
activateCrystalPower();
if (
  gameOver ||
  !crystalAvailable ||
  !crystalTargeting ||
  crystalCandidatePath.length !== insufficientMoves ||
  !crystalCandidateIncomplete ||
  !controlsPanelEl.hidden ||
  movesLeft !== insufficientMoves ||
  crystalPowerCountEl.textContent !== "1"
) {
  throw new Error("Crystal power did not prepare a movement-limited route");
}

useCrystalPower();
if (
  crystalAvailable ||
  crystalTargeting ||
  !crystalRevealing ||
  !crystalRevealIncomplete ||
  crystalRevealPath.length !== insufficientMoves ||
  crystalPowerCountEl.textContent !== "+"
) {
  throw new Error("Crystal power did not consume its movement-limited vision");
}

crystalTimerGuard = 0;
while (crystalRevealing && crystalTimerGuard < 100) {
  if (!runNextTimer()) break;
  crystalTimerGuard += 1;
}
if (
  gameOver ||
  crystalRevealing ||
  crystalRevealPath.length ||
  crystalVisibleCount ||
  !powerControlsEnabled ||
  !tornadoAvailable ||
  !hammerAvailable ||
  !rocketAvailable ||
  !messageEl.textContent.includes("movement limit")
) {
  throw new Error("Crystal movement-limited vision did not return control to the player");
}

maze = blankMaze();
mouse = { row: 5, col: 5 };
exit = { row: 5, col: 6 };
gameOver = false;
campaignComplete = false;
crystalRevealing = false;
powerInventory = createEmptyPowerInventory();
powerInventory.fishing = 1;
syncPowerAvailability();
fishingTargeting = false;
fishingCatchAnimating = false;
powerControlsEnabled = true;
updatePowerUI();
const centerFishingTargets = getFishingTargets();
if (
  centerFishingTargets.length !== 8 ||
  centerFishingTargets.some((target) => {
    const rowDistance = Math.abs(target.row - mouse.row);
    const colDistance = Math.abs(target.col - mouse.col);
    return rowDistance !== colDistance || rowDistance < 1 || rowDistance > 2;
  })
) {
  throw new Error("Fishing power produced an invalid diagonal range");
}

mouse = { row: 0, col: 0 };
if (getFishingTargets().length !== 2) {
  throw new Error("Fishing power did not clip its diagonal range at the board edge");
}

mouse = { row: 5, col: 5 };
activateFishingPower();
if (
  fishingTargeting ||
  !fishingAvailable ||
  getFishingCatchTarget() ||
  moveUpButton.disabled ||
  !fishingPowerButton.disabled ||
  fishingPowerCountEl.textContent !== "1"
) {
  throw new Error("Fishing power was not safely disabled without a catchable cheese");
}

exit = { row: 3, col: 3 };
shortestPath = Array.from({ length: 9 }, (_, index) => ({ row: index, col: index }));
moveLimit = 15;
movesLeft = 8;
controlsPanelEl.hidden = true;
activateFishingPower();
let fishingCatchTarget = getFishingCatchTarget();
if (!fishingTargeting || !fishingAvailable || !fishingCatchTarget) {
  throw new Error("Fishing power did not activate for a catchable cheese");
}
cancelActivePower("Fishing cancelled");
if (fishingTargeting || !fishingAvailable || fishingPowerCountEl.textContent !== "1") {
  throw new Error("Cancelling fishing consumed its charge");
}
activateFishingPower();
fishingCatchTarget = getFishingCatchTarget();
const fishingMovesBefore = movesLeft;
useFishingPower(fishingCatchTarget);
if (
  fishingAvailable ||
  fishingTargeting ||
  !fishingCatchAnimating ||
  fishingCatchProgress !== 0 ||
  powerControlsEnabled ||
  movesLeft !== fishingMovesBefore ||
  fishingPowerCountEl.textContent !== "+"
) {
  throw new Error("Fishing power did not start a no-move catch cleanly");
}

let fishingTimerGuard = 0;
while (fishingCatchAnimating && fishingTimerGuard < 30) {
  if (!runNextTimer()) break;
  fishingTimerGuard += 1;
}
if (
  fishingCatchAnimating ||
  !gameOver ||
  exit.row !== mouse.row ||
  exit.col !== mouse.col ||
  movesLeft !== fishingMovesBefore ||
  controlsPanelEl.hidden ||
  fishingPowerCountEl.textContent !== "+"
) {
  throw new Error("Fishing power did not complete the catch without consuming a move");
}
globalThis.__hammerValidation = true;
globalThis.__rocketValidation = true;
globalThis.__tornadoValidation = true;
globalThis.__crystalValidation = true;
globalThis.__fishingValidation = true;
`;

vm.runInNewContext(gameWithoutBootstrap + verification, sandbox, {
  filename: "game.js",
  timeout: 120000,
});

for (const level of sandbox.__variantValidation) {
  const distances = level.variants.map((variant) => variant.distance).join(",");
  const attempts = level.variants.map((variant) => variant.attempt).join(",");
  const exits = level.variants.map((variant) => variant.exit).join(" | ");
  console.log(
    `Level ${level.level}: moves=${level.moveLimit} shortest=[${distances}] exits=[${exits}] attempts=[${attempts}]`,
  );
}

console.log(`Validated ${sandbox.__variantValidation.length * 5} fixed variants.`);
console.log("Validated unique cheese positions across at least three rows per level.");
console.log("Validated non-repeating variant cycles for every level.");
console.log("Validated exact level restoration on retry without advancing the variant cycle.");
console.log("Validated saved-level restart after reopening without restoring spent powers.");
console.log("Validated interpolated mouse movement and arrival-based move counting.");
console.log("Validated persistent attempts, 30-minute recovery, retry costs, and seven-attempt cap.");
console.log("Validated persistent currency, shop prices, stacked purchases, and insufficient funds.");
console.log("Validated slow/fast move warnings and final-move power suggestions.");
console.log("Validated hammer wall removal and outer-frame protection.");
console.log("Validated rocket range, edge clipping, and wall-ignoring landing.");
console.log("Validated power switching and cancellation without consuming charges.");
console.log("Validated tornado safety and preservation of the active run state.");
console.log("Validated crystal reveal timing, movement lock, cancellation, and limited-route recovery.");
console.log("Validated fishing diagonal range, unavailable state, and no-move catch completion.");
