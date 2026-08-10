import { readFile } from "node:fs/promises";
import vm from "node:vm";

const source = await readFile(new URL("../game.js", import.meta.url), "utf8");
const gameWithoutBootstrap = source.replace(
  /\nif \(!restoreCampaignState\(\)\) generateLevel\(\);\s*$/,
  "\n",
);

function createElement() {
  const classes = new Set();
  const attributes = new Map();
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
    getAttribute(name) {
      return attributes.get(name) ?? null;
    },
    getBoundingClientRect: () => ({ width: 0, height: 0 }),
    getContext: () => ({}),
    hidden: false,
    offsetWidth: 0,
    setAttribute(name, value) {
      attributes.set(name, String(value));
    },
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
  const startKeys = new Set();
  const variants = [];

  for (let variantIndex = 0; variantIndex < VARIANTS_PER_LEVEL; variantIndex += 1) {
    const variant = buildLevelVariant(config, variantIndex);
    const distance = variant.path.length - 1;
    const routes = countRoutesToExit(variant.grid, variant.exit, 3, variant.start);
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
      .join("") + ":" + keyOf(variant.exit) + ":" + keyOf(variant.start);

    if (distance < config.minPath || distance > config.maxPath) {
      throw new Error("Level " + (levelIndex + 1) + " variant " + (variantIndex + 1) + " has invalid distance");
    }
    if (
      distance > config.moveLimit ||
      routes < 2 ||
      !alternate ||
      keyOf(variant.path[0]) !== keyOf(variant.start) ||
      keyOf(variant.start) === keyOf(variant.exit) ||
      !START_CORNERS.some((corner) => keyOf(corner) === keyOf(variant.start)) ||
      initialFacingForStart(variant.start) !== (variant.start.col === 0 ? "right" : "left")
    ) {
      throw new Error("Level " + (levelIndex + 1) + " variant " + (variantIndex + 1) + " breaks route rules");
    }
    if (signatures.has(signature)) {
      throw new Error("Level " + (levelIndex + 1) + " contains duplicate variants");
    }

    signatures.add(signature);
    exitKeys.add(keyOf(variant.exit));
    exitRows.add(variant.exit.row);
    startKeys.add(keyOf(variant.start));
    variants.push({
      variant: variantIndex + 1,
      start: keyOf(variant.start),
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
  if (startKeys.size !== START_CORNERS.length) {
    throw new Error("Level " + (levelIndex + 1) + " does not use all four starting corners");
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
  mouse.row !== retryExpected.start.row ||
  mouse.col !== retryExpected.start.col ||
  levelStart.row !== retryExpected.start.row ||
  levelStart.col !== retryExpected.start.col ||
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
levelStart = { ...persistedVariant.start };
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
levelStart = { ...START };
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
  mouse.row !== persistedRestartVariant.start.row ||
  mouse.col !== persistedRestartVariant.start.col ||
  levelStart.row !== persistedRestartVariant.start.row ||
  levelStart.col !== persistedRestartVariant.start.col ||
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

const introMovesBefore = movesLeft;
const introMouseBefore = { ...mouse };
const introDirection = DIRS.find((dir) => !maze[mouse.row][mouse.col].walls[dir.wall]);
startLevelIntroAnimation("full");
if (
  !levelIntro ||
  levelIntro.duration !== LEVEL_INTRO_DURATION_MS ||
  !moveUpButton.disabled ||
  powerControlsEnabled ||
  mazeEl.getAttribute("aria-busy") !== "true"
) {
  throw new Error("Full level intro did not lock movement and powers");
}

move(introDirection.key);
if (mouseMotion || movesLeft !== introMovesBefore) {
  throw new Error("Movement was accepted while the mouse was entering the maze");
}

levelIntro.startedAt = 0;
animateLevelIntro(LEVEL_INTRO_DURATION_MS * 0.4);
const introVisual = currentMouseVisualState();
const introState = levelIntroStateAt(0.4);
if (
  !levelIntro ||
  introState.doorOpen < 0.99 ||
  introState.walkProgress <= 0 ||
  introState.walkProgress >= 1 ||
  introVisual.col !== introMouseBefore.col ||
  introVisual.row === introMouseBefore.row
) {
  throw new Error("Level intro did not open the door and walk in from outside");
}

const introOuter = {
  tl: { x: 100, y: 20 },
  tr: { x: 500, y: 20 },
  br: { x: 560, y: 420 },
  bl: { x: 40, y: 420 },
};
levelIntro.start = { row: 0, col: 0 };
levelIntro.progress = 0.4;
const topLeftDoor = introDoorGeometry(introOuter, 14, 20);
levelIntro.start = { row: SIZE - 1, col: SIZE - 1 };
const bottomRightDoor = introDoorGeometry(introOuter, 14, 20);
if (
  !topLeftDoor?.topEdge ||
  topLeftDoor.shiftedP1.x <= topLeftDoor.p1.x ||
  bottomRightDoor?.topEdge ||
  bottomRightDoor.shiftedP1.x >= bottomRightDoor.p1.x
) {
  throw new Error("Corner doors did not slide inward along the correct outer wall");
}

levelIntro.start = { ...levelStart };
animateLevelIntro(LEVEL_INTRO_DURATION_MS);
if (
  levelIntro ||
  moveUpButton.disabled ||
  !powerControlsEnabled ||
  mazeEl.getAttribute("aria-busy") !== "false" ||
  movesLeft !== introMovesBefore
) {
  throw new Error("Full level intro did not hand control back cleanly");
}

startLevelIntroAnimation("retry");
if (!levelIntro || levelIntro.duration !== LEVEL_INTRO_RETRY_DURATION_MS) {
  throw new Error("Retry did not use the shorter level intro");
}
levelIntro.startedAt = 0;
animateLevelIntro(LEVEL_INTRO_RETRY_DURATION_MS);
motionFrames.length = 0;
drawRequest = 0;

const cameraGeometry = boardGeometry(500, 400);
const cameraState = mazeCameraState(cameraGeometry, 500, 400);
const cameraMousePoint = project(
  cameraGeometry.inner,
  (mouse.col + 0.5) / SIZE,
  (mouse.row + 0.5) / SIZE,
);
const centeredMousePoint = transformCameraPoint(cameraMousePoint, cameraState);
if (
  CAMERA_VISIBLE_RADIUS !== 3 ||
  CAMERA_ZOOM < 2 ||
  Math.abs(centeredMousePoint.x - cameraState.center.x) > 0.001 ||
  Math.abs(centeredMousePoint.y - cameraState.center.y) > 0.001 ||
  ATTEMPT_STORAGE_KEY === "mouseMazeAttemptState" ||
  CAMPAIGN_STORAGE_KEY === "mouseMazeCampaignStateV1" ||
  ECONOMY_STORAGE_KEY === "mouseMazeEconomyStateV16" ||
  !ATTEMPT_STORAGE_KEY.includes("V3") ||
  !CAMPAIGN_STORAGE_KEY.includes("V3") ||
  !ECONOMY_STORAGE_KEY.includes("V3")
) {
  throw new Error("V3 camera did not preserve the strict centered three-cell view");
}

const cameraExitBefore = { ...exit };
exit = { row: 4, col: 4 };
const scentRight = generalCheeseDirection({ row: 4, col: 1 });
const scentUpLeft = generalCheeseDirection({ row: 7, col: 7 });
if (
  scentRight.row !== 0 ||
  scentRight.col !== 1 ||
  scentUpLeft.row !== -1 ||
  scentUpLeft.col !== -1
) {
  throw new Error("Cheese scent did not resolve to a broad eight-direction heading");
}
exit = cameraExitBefore;

if (!startMouseSniffAnimation() || !mouseSniffAnimation || !moveUpButton.disabled || powerControlsEnabled) {
  throw new Error("Tap sniff did not lock controls while showing the heading");
}
mouseSniffAnimation.startedAt = 0;
animateMouseSniff(MOUSE_SNIFF_DURATION_MS);
if (mouseSniffAnimation || moveUpButton.disabled || !powerControlsEnabled) {
  throw new Error("Tap sniff did not restore controls after its short animation");
}
motionFrames.length = 0;
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
  mouseFacingDirection !== motionDirection.key ||
  mouse.row !== motionOrigin.row ||
  mouse.col !== motionOrigin.col ||
  movesLeft !== motionMovesBefore ||
  !movementPanelEl.classList.contains("moving")
) {
  throw new Error("Animated movement changed the logical cell before the animation began");
}

const directionSprites = {
  left: mouseWalkLeftSprite,
  right: mouseWalkRightSprite,
  up: mouseWalkUpSprite,
  down: mouseWalkDownSprite,
};
for (const [direction, sprite] of Object.entries(directionSprites)) {
  mouseFacingDirection = direction;
  if (getMouseWalkSprite() !== sprite) {
    throw new Error("Walking sprite did not match the " + direction + " direction");
  }
}
mouseFacingDirection = motionDirection.key;

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

motionFrames.length = 0;
drawRequest = 0;
clearPowerTransformation();
clearPowerTargetingState();
gameOver = false;
campaignComplete = false;
powerControlsEnabled = true;
powerInventory.crystal = 1;
powerInventory.tornado = 1;
syncPowerAvailability();
updatePowerUI();
if (
  powerTransformationFrameIndex(0, "in") !== 0 ||
  powerTransformationFrameIndex(1, "in") !== POWER_TRANSFORM_FRAME_COUNT - 1 ||
  powerTransformationFrameIndex(0, "out") !== POWER_TRANSFORM_FRAME_COUNT - 1 ||
  powerTransformationFrameIndex(1, "out") !== 0 ||
  powerTransformationFrameIndex(0.25, "in") !==
    powerTransformationFrameIndex(0.75, "out")
) {
  throw new Error("Power transformation frames are not exact forward/reverse counterparts");
}
for (const powerKey of ["tornado", "hammer", "fishing", "rocket"]) {
  const powerVisual = getPowerVisual(powerKey);
  if (powerVisual.transformScale !== powerVisual.scale) {
    throw new Error(powerKey + " transformation does not finish at its approved scale");
  }
}
handlePowerButton("crystal", activateCrystalPower);
if (
  !powerTransform ||
  powerTransform.powerKey !== "crystal" ||
  powerTransform.direction !== "in" ||
  !crystalTargeting ||
  !crystalPowerButton.disabled ||
  !tornadoPowerButton.disabled ||
  !moveUpButton.disabled
) {
  throw new Error("Power selection did not begin an exclusive locked transformation");
}

powerTransform.startedAt = 0;
animatePowerTransformation(POWER_TRANSFORM_DURATION_MS / 2);
if (!powerTransform || Math.abs(powerTransform.progress - 0.5) > 0.001) {
  throw new Error("Power transformation did not remain active at its midpoint");
}

animatePowerTransformation(POWER_TRANSFORM_DURATION_MS);
if (
  powerTransform ||
  !crystalTargeting ||
  crystalPowerButton.disabled ||
  !tornadoPowerButton.disabled ||
  !moveUpButton.disabled
) {
  throw new Error("Power transformation did not finish in exclusive targeting mode");
}

handlePowerButton("tornado", activateTornadoPower);
if (!crystalTargeting || tornadoTargeting) {
  throw new Error("A second power activated before the selected power was put away");
}

handlePowerButton("crystal", activateCrystalPower);
if (!powerTransform || powerTransform.direction !== "out" || !crystalTargeting) {
  throw new Error("Power cancellation did not begin the reverse transformation");
}
powerTransform.startedAt = 0;
animatePowerTransformation(POWER_TRANSFORM_DURATION_MS);
if (
  powerTransform ||
  isPowerTargeting() ||
  !crystalAvailable ||
  moveUpButton.disabled ||
  tornadoPowerButton.disabled
) {
  throw new Error("Reverse transformation did not restore movement and power selection");
}

motionFrames.length = 0;
drawRequest = 0;
gameOver = false;
campaignComplete = false;
cheeseEaten = false;
cheeseEatingAnimating = false;
controlsPanelEl.hidden = true;
exit = { ...mouse };
startCheeseEatingAnimation();
if (
  !cheeseEatingAnimating ||
  cheeseEaten ||
  !gameOver ||
  controlsPanelEl.hidden !== true ||
  !moveUpButton.disabled ||
  powerControlsEnabled
) {
  throw new Error("Cheese eating did not lock the game before showing the result");
}

cheeseEatingStartedAt = 0;
animateCheeseEating(CHEESE_EAT_DURATION_MS / 2);
if (
  Math.abs(cheeseEatingProgress - 0.5) > 0.001 ||
  !cheeseEatingAnimating ||
  cheeseEaten ||
  controlsPanelEl.hidden !== true
) {
  throw new Error("Cheese eating did not remain active for its full animation");
}

animateCheeseEating(CHEESE_EAT_DURATION_MS);
if (
  cheeseEatingAnimating ||
  !cheeseEaten ||
  !gameOver ||
  controlsPanelEl.hidden !== false
) {
  throw new Error("Level result appeared before the cheese eating animation completed");
}

clearCheeseEatingAnimation();
gameOver = false;
controlsPanelEl.hidden = true;
setMovementControlsEnabled(true);
setPowerControlsEnabled(true);
motionFrames.length = 0;

mouseAsleep = false;
mouseDefeatAnimating = false;
retryCostsAttempt = false;
startMouseDefeatAnimation();
if (
  !mouseDefeatAnimating ||
  mouseAsleep ||
  !gameOver ||
  !retryCostsAttempt ||
  controlsPanelEl.hidden !== true ||
  !moveUpButton.disabled ||
  powerControlsEnabled ||
  mazeEl.getAttribute("aria-busy") !== "true"
) {
  throw new Error("Mouse defeat did not lock the game before showing the result");
}

mouseDefeatStartedAt = 0;
animateMouseDefeat(MOUSE_DEFEAT_DURATION_MS / 2);
if (
  Math.abs(mouseDefeatProgress - 0.5) > 0.001 ||
  !mouseDefeatAnimating ||
  mouseAsleep ||
  controlsPanelEl.hidden !== true
) {
  throw new Error("Mouse defeat did not remain active for its full animation");
}

animateMouseDefeat(MOUSE_DEFEAT_DURATION_MS);
if (
  mouseDefeatAnimating ||
  !mouseAsleep ||
  !gameOver ||
  !retryCostsAttempt ||
  controlsPanelEl.hidden !== false ||
  mazeEl.getAttribute("aria-busy") !== "false" ||
  !messageEl.textContent.includes("energy")
) {
  throw new Error("Failed-level result appeared before the sleep animation completed");
}

clearMouseDefeatAnimation();
gameOver = false;
retryCostsAttempt = false;
controlsPanelEl.hidden = true;
setMovementControlsEnabled(true);
setPowerControlsEnabled(true);
motionFrames.length = 0;

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
  Object.values(powerInventory).some((count) => count !== 10) ||
  currencyCountEl.textContent !== "100" ||
  crystalPowerCountEl.textContent !== "10" ||
  tornadoPowerCountEl.textContent !== "10" ||
  hammerPowerCountEl.textContent !== "10" ||
  fishingPowerCountEl.textContent !== "10" ||
  rocketPowerCountEl.textContent !== "10" ||
  crystalPowerButton.disabled ||
  hammerPowerButton.disabled
) {
  throw new Error("The test build did not start with 100 buttons and ten of each power");
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
const hammerDirectionSegments = Object.fromEntries(
  getHammerTargets().map((target) => [target.dir.key, target.segment]),
);
if (
  hammerDirectionSegments.up.orientation !== "horizontal" ||
  hammerDirectionSegments.up.line !== 5 ||
  hammerDirectionSegments.right.orientation !== "vertical" ||
  hammerDirectionSegments.right.line !== 6 ||
  hammerDirectionSegments.down.orientation !== "horizontal" ||
  hammerDirectionSegments.down.line !== 6 ||
  hammerDirectionSegments.left.orientation !== "vertical" ||
  hammerDirectionSegments.left.line !== 5
) {
  throw new Error("Hammer targets did not retain distinct geometry for all four directions");
}
for (const directionKey of ["up", "right", "down", "left"]) {
  const profile = HAMMER_SWING_PROFILES[directionKey];
  const hammerIdle = hammerSwingStateAt(0, directionKey);
  const hammerWindup = hammerSwingStateAt(0.3, directionKey);
  const hammerStrike = hammerSwingStateAt(0.44, directionKey);
  const hammerImpact = hammerSwingStateAt(HAMMER_IMPACT_RATIO, directionKey);
  if (
    hammerIdle.rotation !== 0 ||
    hammerWindup.phase !== "windup" ||
    Math.abs(hammerWindup.rotation) < 0.2 ||
    hammerStrike.phase !== "strike" ||
    hammerImpact.phase !== "impact" ||
    Math.abs(hammerImpact.rotation - profile.impactRotation) > 0.000001 ||
    hammerImpact.flipX !== profile.flipX ||
    hammerImpact.impactAmount !== 0
  ) {
    throw new Error("Hammer swing did not use the " + directionKey + " pivot profile");
  }
}
if (
  HAMMER_SWING_PROFILES.right.flipX !== 1 ||
  HAMMER_SWING_PROFILES.left.flipX !== -1 ||
  HAMMER_SWING_PROFILES.right.impactRotation !== -HAMMER_SWING_PROFILES.left.impactRotation ||
  HAMMER_SWING_PROFILES.up.impactRotation === HAMMER_SWING_PROFILES.down.impactRotation ||
  HAMMER_SPRITE_PIVOT.y < 0.8
) {
  throw new Error("Hammer direction profiles did not preserve mirrored sides and a fixed handle pivot");
}
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
handlePowerButton("hammer", activateHammerPower);
handlePowerButton("rocket", activateRocketPower);
if (!hammerTargeting || rocketTargeting || !hammerAvailable || !rocketAvailable) {
  throw new Error("Exclusive power selection allowed a direct switch");
}
handlePowerButton("hammer", activateHammerPower);
if (hammerTargeting || rocketTargeting || !hammerAvailable || !rocketAvailable) {
  throw new Error("Cancelling a power consumed a charge");
}
handlePowerButton("rocket", activateRocketPower);
if (hammerTargeting || !rocketTargeting || !hammerAvailable || !rocketAvailable) {
  throw new Error("A different power did not activate after the first was put away");
}
handlePowerButton("rocket", activateRocketPower);

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

const tornadoStartPhases = tornadoWallPhasesAt(0);
const tornadoOverlapPhases = tornadoWallPhasesAt(0.55);
const tornadoEndPhases = tornadoWallPhasesAt(1);
const tornadoTestWall = {
  p1: { x: 10, y: 20 },
  p2: { x: 70, y: 20 },
  lineWidth: 8,
  height: 12,
  depth: 0.5,
};
const tornadoBoardCenter = { x: 100, y: 100 };
const outgoingStart = tornadoWallTransform(
  tornadoTestWall,
  0,
  0,
  "out",
  tornadoBoardCenter,
  400,
);
const incomingEnd = tornadoWallTransform(
  tornadoTestWall,
  0,
  1,
  "in",
  tornadoBoardCenter,
  400,
);
const tornadoActorStart = { x: 320, y: 300 };
const tornadoActorAtStart = tornadoVortexCenterAt(0, tornadoActorStart, tornadoBoardCenter);
const tornadoActorAtCenter = tornadoVortexCenterAt(0.5, tornadoActorStart, tornadoBoardCenter);
const tornadoActorAtEnd = tornadoVortexCenterAt(1, tornadoActorStart, tornadoBoardCenter);
const tornadoCheeseStart = { x: 270, y: 80 };
const tornadoCheeseAtStart = tornadoCheeseStateAt(
  0,
  tornadoCheeseStart,
  tornadoBoardCenter,
  400,
);
const tornadoCheeseInVortex = tornadoCheeseStateAt(
  0.54,
  tornadoCheeseStart,
  tornadoBoardCenter,
  400,
);
const tornadoCheeseAtEnd = tornadoCheeseStateAt(
  1,
  tornadoCheeseStart,
  tornadoBoardCenter,
  400,
);
const tornadoVortexBefore = tornadoVortexAmountAt(0.1);
const tornadoVortexActive = tornadoVortexAmountAt(0.5);
const tornadoVortexAfter = tornadoVortexAmountAt(0.98);
if (
  tornadoStartPhases.outgoing !== 0 ||
  tornadoStartPhases.incoming !== 0 ||
  tornadoOverlapPhases.outgoing <= 0 ||
  tornadoOverlapPhases.outgoing >= 1 ||
  tornadoOverlapPhases.incoming <= 0 ||
  tornadoOverlapPhases.incoming >= 1 ||
  tornadoEndPhases.outgoing !== 1 ||
  Math.abs(tornadoEndPhases.incoming - 1) > 0.001 ||
  Math.abs(outgoingStart.x) > 0.001 ||
  Math.abs(outgoingStart.y) > 0.001 ||
  outgoingStart.rotation !== 0 ||
  outgoingStart.scale !== 1 ||
  incomingEnd.opacity !== 1 ||
  Math.abs(incomingEnd.x) > 0.001 ||
  Math.abs(incomingEnd.y) > 0.001 ||
  Math.abs(incomingEnd.rotation) > 0.001 ||
  Math.abs(incomingEnd.scale - 1) > 0.001 ||
  distance(tornadoActorAtStart, tornadoActorStart) > 0.001 ||
  distance(tornadoActorAtCenter, tornadoBoardCenter) > 0.001 ||
  distance(tornadoActorAtEnd, tornadoActorStart) > 0.001 ||
  distance(tornadoCheeseAtStart.center, tornadoCheeseStart) > 0.001 ||
  distance(tornadoCheeseInVortex.center, tornadoBoardCenter) >=
    distance(tornadoCheeseStart, tornadoBoardCenter) ||
  distance(tornadoCheeseAtEnd.center, tornadoCheeseStart) > 0.001 ||
  tornadoVortexBefore !== 0 ||
  tornadoVortexActive !== 1 ||
  tornadoVortexAfter !== 0
) {
  throw new Error("Tornado vortex does not gather and restore the walls, mouse, and cheese cleanly");
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
  tornadoWallAnimation ||
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
  !crystalTargeting ||
  !crystalRevealing ||
  crystalVisibleCount !== 1 ||
  crystalRevealPath.length !== crystalVariant.path.length - 1 ||
  crystalRevealPhase !== "reveal" ||
  crystalRevealOpacity !== 1 ||
  powerControlsEnabled ||
  !moveUpButton.disabled
) {
  throw new Error("Crystal power did not begin its locked route reveal");
}

const crystalWaveStep = 160;
const liftedCrystalState = crystalRevealStateAt(
  crystalWaveStep * 0.5,
  crystalRevealPath.length,
  crystalWaveStep,
);
const settledCrystalState = crystalRevealStateAt(
  crystalWaveStep * 1.25,
  crystalRevealPath.length,
  crystalWaveStep,
);
const heldCrystalState = crystalRevealStateAt(
  crystalWaveStep * crystalRevealPath.length + CRYSTAL_REVEAL_HOLD_MS * 0.5,
  crystalRevealPath.length,
  crystalWaveStep,
);
const fadedCrystalState = crystalRevealStateAt(
  crystalWaveStep * crystalRevealPath.length +
    CRYSTAL_REVEAL_HOLD_MS +
    CRYSTAL_REVEAL_FADE_MS * 0.5,
  crystalRevealPath.length,
  crystalWaveStep,
);
if (
  liftedCrystalState.phase !== "reveal" ||
  liftedCrystalState.visibleCount !== 1 ||
  liftedCrystalState.stepProgress !== 0.5 ||
  settledCrystalState.visibleCount !== 2 ||
  heldCrystalState.phase !== "hold" ||
  heldCrystalState.visibleCount !== crystalRevealPath.length ||
  fadedCrystalState.phase !== "fade" ||
  Math.abs(fadedCrystalState.opacity - 0.5) > 0.001
) {
  throw new Error("Crystal floor wave phases do not lift, hold, and fade in sequence");
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
  !crystalTargeting ||
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

const rocketPhaseSequence = [0.1, 0.35, 0.58, 0.78, 0.96].map(
  (progress) => rocketFlightPhaseAt(progress).phase,
);
if (rocketPhaseSequence.join(",") !== "ignition,ascent,cruise,descent,impact") {
  throw new Error("Rocket flight animation phases were not ordered correctly");
}
const rocketVisualSource = { x: 40, y: 180 };
const rocketVisualTarget = { x: 130, y: 140 };
const rocketIgnitionVisual = rocketFlightVisualStateAt(
  0.1,
  rocketVisualSource,
  rocketVisualTarget,
  40,
);
const rocketAscentVisual = rocketFlightVisualStateAt(
  0.35,
  rocketVisualSource,
  rocketVisualTarget,
  40,
);
const rocketCruiseVisual = rocketFlightVisualStateAt(
  0.58,
  rocketVisualSource,
  rocketVisualTarget,
  40,
);
const rocketDescentVisual = rocketFlightVisualStateAt(
  0.78,
  rocketVisualSource,
  rocketVisualTarget,
  40,
);
const rocketImpactVisual = rocketFlightVisualStateAt(
  0.99,
  rocketVisualSource,
  rocketVisualTarget,
  40,
);
const leftRocketVisualTarget = { x: -50, y: 140 };
const leftRocketCruiseVisual = rocketFlightVisualStateAt(
  0.58,
  rocketVisualSource,
  leftRocketVisualTarget,
  40,
);
const leftRocketDescentVisual = rocketFlightVisualStateAt(
  0.78,
  rocketVisualSource,
  leftRocketVisualTarget,
  40,
);
if (
  rocketIgnitionVisual.rotation !== 0 ||
  rocketIgnitionVisual.scale !== 1 ||
  rocketIgnitionVisual.flame <= 0 ||
  rocketAscentVisual.center.y >= rocketVisualSource.y ||
  rocketAscentVisual.altitude <= 0 ||
  rocketAscentVisual.scale <= 1 ||
  rocketCruiseVisual.turnDirection !== 1 ||
  rocketCruiseVisual.rotation <= 0 ||
  rocketCruiseVisual.rotation >= Math.PI ||
  Math.abs(Math.abs(rocketDescentVisual.rotation) - Math.PI) > 0.001 ||
  rocketDescentVisual.center.y >= rocketVisualTarget.y ||
  Math.abs(rocketImpactVisual.rotation) >= 0.2 ||
  leftRocketCruiseVisual.turnDirection !== -1 ||
  leftRocketCruiseVisual.rotation >= 0 ||
  Math.abs(
    Math.abs(leftRocketCruiseVisual.rotation) - rocketCruiseVisual.rotation,
  ) > 0.001 ||
  Math.abs(leftRocketDescentVisual.rotation + Math.PI) > 0.001 ||
  rocketImpactVisual.impactSmokeProgress <= 0.9
) {
  throw new Error(
    "Rocket flight did not launch at rest scale, mirror its turn, and settle upright",
  );
}

maze = blankMaze();
mouse = { row: 5, col: 5 };
exit = { row: 0, col: 0 };
gameOver = false;
campaignComplete = false;
movesLeft = 17;
powerInventory = createEmptyPowerInventory();
powerInventory.rocket = 1;
syncPowerAvailability();
rocketTargeting = true;
powerControlsEnabled = true;
globalThis.performance = { now: () => 0 };
globalThis.matchMedia = () => ({ matches: false });
globalThis.requestAnimationFrame = (callback) => {
  motionFrameId += 1;
  motionFrames.push(callback);
  return motionFrameId;
};
globalThis.cancelAnimationFrame = () => {};
motionFrames.length = 0;
drawRequest = 0;
const animatedRocketSource = { ...mouse };
const animatedRocketTarget = { row: 3, col: 5 };
useRocketTarget(animatedRocketTarget);
if (
  !rocketFlightAnimation ||
  rocketAvailable ||
  rocketTargeting ||
  powerControlsEnabled ||
  mouse.row !== animatedRocketSource.row ||
  mouse.col !== animatedRocketSource.col ||
  movesLeft !== 17
) {
  throw new Error("Rocket flight moved the mouse before takeoff completed");
}
while (rocketFlightAnimation?.startedAt === null && motionFrames.length) {
  motionFrames.shift()(0);
}
const rocketMidFlightFrame = motionFrames.shift();
rocketMidFlightFrame?.(ROCKET_FLIGHT_DURATION_MS * 0.5);
if (
  !rocketFlightAnimation ||
  rocketFlightAnimation.progress < 0.49 ||
  mouse.row !== animatedRocketSource.row ||
  mouse.col !== animatedRocketSource.col
) {
  throw new Error("Rocket flight did not preserve the source square while airborne");
}
let rocketAnimationGuard = 0;
let rocketAnimationClock = ROCKET_FLIGHT_DURATION_MS * 0.5;
while ((rocketFlightAnimation || powerTransform) && rocketAnimationGuard < 20) {
  const nextRocketFrame = motionFrames.shift();
  if (!nextRocketFrame) break;
  rocketAnimationClock += ROCKET_FLIGHT_DURATION_MS;
  nextRocketFrame(rocketAnimationClock);
  rocketAnimationGuard += 1;
}
if (
  rocketFlightAnimation ||
  powerTransform ||
  mouse.row !== animatedRocketTarget.row ||
  mouse.col !== animatedRocketTarget.col ||
  movesLeft !== 17 ||
  !powerControlsEnabled
) {
  throw new Error("Rocket flight did not land cleanly before restoring control");
}
globalThis.requestAnimationFrame = originalRequestAnimationFrame;
globalThis.cancelAnimationFrame = originalCancelAnimationFrame;
globalThis.performance = originalPerformance;
globalThis.matchMedia = originalMatchMedia;
motionFrames.length = 0;
drawRequest = 0;

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
const fishingPhaseSequence = [0.1, 0.3, 0.53, 0.76, 0.98].map(
  (progress) => fishingCastPhaseAt(progress).phase,
);
if (fishingPhaseSequence.join(",") !== "windup,cast,hook,reel,settle") {
  throw new Error("Fishing animation phases were not ordered correctly");
}
const fishingVisualMouse = { x: 0, y: 0 };
const fishingVisualCheese = { x: 100, y: -100 };
const fishingCastVisual = fishingCastVisualStateAt(
  0.4,
  fishingVisualMouse,
  fishingVisualCheese,
  40,
);
const fishingReelVisual = fishingCastVisualStateAt(
  0.76,
  fishingVisualMouse,
  fishingVisualCheese,
  40,
);
const fishingDirections = [
  { x: 100, y: -100 },
  { x: -100, y: -100 },
  { x: 100, y: 100 },
  { x: -100, y: 100 },
];
const fishingWindupsAreControlled = fishingDirections.every((target) => {
  const readyState = fishingCastVisualStateAt(0, fishingVisualMouse, target, 40);
  const windupState = fishingCastVisualStateAt(0.2, fishingVisualMouse, target, 40);
  const releaseState = fishingCastVisualStateAt(0.48, fishingVisualMouse, target, 40);
  const reelState = fishingCastVisualStateAt(0.76, fishingVisualMouse, target, 40);
  const settleState = fishingCastVisualStateAt(0.98, fishingVisualMouse, target, 40);
  const vectorFor = (state) => ({
    x: state.rodTip.x - state.rodBase.x,
    y: state.rodTip.y - state.rodBase.y,
  });
  const angleBetween = (first, second) => {
    const denominator = Math.hypot(first.x, first.y) *
      Math.hypot(second.x, second.y);
    return Math.acos(clamp(
      (first.x * second.x + first.y * second.y) / denominator,
      -1,
      1,
    ));
  };
  const readyVector = vectorFor(readyState);
  const windupVector = vectorFor(windupState);
  const releaseVector = vectorFor(releaseState);
  const windupCross = readyVector.x * windupVector.y - readyVector.y * windupVector.x;
  const releaseCross = readyVector.x * releaseVector.y - readyVector.y * releaseVector.x;
  const uprightStates = [
    readyState,
    windupState,
    releaseState,
    reelState,
    settleState,
  ];
  return (
    uprightStates.every((state) => state.rodTip.y < state.rodBase.y) &&
    angleBetween(readyVector, windupVector) > 0.25 &&
    angleBetween(readyVector, windupVector) < 0.45 &&
    angleBetween(readyVector, releaseVector) > 0.08 &&
    angleBetween(readyVector, releaseVector) < 0.22 &&
    windupCross * releaseCross < 0
  );
});
const rightFishingReady = fishingCastVisualStateAt(
  0,
  fishingVisualMouse,
  { x: 100, y: -100 },
  40,
);
const leftFishingReady = fishingCastVisualStateAt(
  0,
  fishingVisualMouse,
  { x: -100, y: -100 },
  40,
);
if (
  fishingCastVisual.phase !== "cast" ||
  fishingReelVisual.phase !== "reel" ||
  !fishingWindupsAreControlled ||
  rightFishingReady.mirrorX !== 1 ||
  leftFishingReady.mirrorX !== -1 ||
  distance(fishingReelVisual.cheeseCenter, fishingVisualMouse) >=
    distance(fishingVisualCheese, fishingVisualMouse) ||
  fishingReelVisual.reelRotation >= fishingCastVisual.reelRotation
) {
  throw new Error("Fishing cast did not release the hook and reverse the reel during retrieval");
}

globalThis.performance = { now: () => 0 };
globalThis.matchMedia = () => ({ matches: false });
globalThis.requestAnimationFrame = (callback) => {
  motionFrameId += 1;
  motionFrames.push(callback);
  return motionFrameId;
};
globalThis.cancelAnimationFrame = () => {};
motionFrames.length = 0;
drawRequest = 0;
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

let fishingAnimationGuard = 0;
let fishingAnimationClock = 0;
while (
  (fishingCatchAnimating || powerTransform || cheeseEatingAnimating) &&
  fishingAnimationGuard < 40
) {
  const nextFishingFrame = motionFrames.shift();
  if (!nextFishingFrame) break;
  fishingAnimationClock += 3000;
  nextFishingFrame(fishingAnimationClock);
  fishingAnimationGuard += 1;
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
globalThis.requestAnimationFrame = originalRequestAnimationFrame;
globalThis.cancelAnimationFrame = originalCancelAnimationFrame;
globalThis.performance = originalPerformance;
globalThis.matchMedia = originalMatchMedia;
motionFrames.length = 0;
drawRequest = 0;
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
  const starts = level.variants.map((variant) => variant.start).join(" | ");
  console.log(
    `Level ${level.level}: moves=${level.moveLimit} shortest=[${distances}] starts=[${starts}] exits=[${exits}] attempts=[${attempts}]`,
  );
}

console.log(`Validated ${sandbox.__variantValidation.length * 5} fixed variants.`);
console.log("Validated all four starting corners across every level.");
console.log("Validated unique cheese positions across at least three rows per level.");
console.log("Validated non-repeating variant cycles for every level.");
console.log("Validated exact level restoration on retry without advancing the variant cycle.");
console.log("Validated saved-level restart after reopening without restoring spent powers.");
console.log("Validated interpolated mouse movement and arrival-based move counting.");
console.log("Validated direction-specific walking sprite selection.");
console.log("Validated four-corner door entry, sniffing lock, and shortened retry intro.");
console.log("Validated centered three-cell camera and broad eight-direction scent guidance.");
console.log("Validated exclusive power transformations and reverse cancellation.");
console.log("Validated delayed victory during the cheese eating animation.");
console.log("Validated delayed defeat during the mouse sleep animation.");
console.log("Validated persistent attempts, 30-minute recovery, retry costs, and seven-attempt cap.");
console.log("Validated persistent currency, shop prices, stacked purchases, and insufficient funds.");
console.log("Validated slow/fast move warnings and final-move power suggestions.");
console.log("Validated directional hammer windup, impact, wall removal, and outer-frame protection.");
console.log("Validated rocket range, mirrored flight, delayed landing, and wall-ignoring movement.");
console.log("Validated exclusive power selection and cancellation without consuming charges.");
console.log("Validated tornado vortex paths, safe variation, and restored mouse and cheese positions.");
console.log("Validated crystal reveal timing, movement lock, cancellation, and limited-route recovery.");
console.log("Validated fishing diagonal range, unavailable state, and no-move catch completion.");
