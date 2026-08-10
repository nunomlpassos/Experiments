const SIZE = 10;
const START = { row: SIZE - 1, col: SIZE - 1 };
const VARIANTS_PER_LEVEL = 5;
const VARIANT_SEED_GAP = 104729;
const MAX_ATTEMPTS = 7;
const ATTEMPT_RECOVERY_MS = 30 * 60 * 1000;
const ATTEMPT_STORAGE_KEY = "mouseMazeAttemptState";
const CAMPAIGN_STORAGE_KEY = "mouseMazeCampaignStateV1";
const MOUSE_MOVE_DURATION_MS = 210;
const STARTING_CURRENCY = 100;
const ECONOMY_STORAGE_KEY = "mouseMazeEconomyStateV2";
const POWER_CONFIGS = {
  crystal: {
    name: "Crystal Vision",
    price: 10,
    image: "assets/crystal-power.png?v=campaign-53",
  },
  tornado: {
    name: "Maze Tornado",
    price: 20,
    image: "assets/tornado-power.png?v=campaign-53",
  },
  hammer: {
    name: "Wall Hammer",
    price: 30,
    image: "assets/hammer-power.png?v=campaign-53",
  },
  fishing: {
    name: "Fishing Rod",
    price: 40,
    image: "assets/fishing-power.png?v=campaign-53",
  },
  rocket: {
    name: "Mouse Rocket",
    price: 50,
    image: "assets/rocket-power.png?v=campaign-53",
  },
};
const LEVEL_CONFIGS = [
  { seed: 1129, moveLimit: 15, minPath: 9, maxPath: 11 },
  { seed: 2113, moveLimit: 17, minPath: 11, maxPath: 13 },
  { seed: 3251, moveLimit: 19, minPath: 13, maxPath: 15 },
  { seed: 4231, moveLimit: 21, minPath: 15, maxPath: 17 },
  { seed: 5417, moveLimit: 23, minPath: 17, maxPath: 19 },
  { seed: 6521, moveLimit: 25, minPath: 19, maxPath: 21 },
  { seed: 7411, moveLimit: 27, minPath: 21, maxPath: 23 },
  { seed: 8527, moveLimit: 29, minPath: 23, maxPath: 25 },
  { seed: 9631, moveLimit: 31, minPath: 25, maxPath: 27 },
  { seed: 10453, moveLimit: 33, minPath: 27, maxPath: 29 },
];
const DIRS = [
  { key: "up", row: -1, col: 0, wall: "top", opposite: "bottom" },
  { key: "right", row: 0, col: 1, wall: "right", opposite: "left" },
  { key: "down", row: 1, col: 0, wall: "bottom", opposite: "top" },
  { key: "left", row: 0, col: -1, wall: "left", opposite: "right" },
];

const mazeEl = document.querySelector("#maze");
const controlsPanelEl = document.querySelector("#controlsPanel");
const movesLeftEl = document.querySelector("#movesLeft");
const movesStatEl = document.querySelector("#movesStat");
const levelLabelEl = document.querySelector("#levelLabel");
const levelTitleEl = document.querySelector("#levelTitle");
const attemptStatusEl = document.querySelector("#attemptStatus");
const attemptCountEl = document.querySelector("#attemptCount");
const attemptTimerEl = document.querySelector("#attemptTimer");
const currencyStatusEl = document.querySelector("#currencyStatus");
const currencyCountEl = document.querySelector("#currencyCount");
const messageEl = document.querySelector("#message");
const starsEl = document.querySelector("#stars");
const retryButton = document.querySelector("#retryButton");
const nextButton = document.querySelector("#nextButton");
const movementPanelEl = document.querySelector("#movementPanel");
const swipeModeButton = document.querySelector("#swipeModeButton");
const arrowModeButton = document.querySelector("#arrowModeButton");
const swipePadEl = document.querySelector("#swipePad");
const arrowPadEl = document.querySelector("#arrowPad");
const moveUpButton = document.querySelector("#moveUp");
const moveRightButton = document.querySelector("#moveRight");
const moveDownButton = document.querySelector("#moveDown");
const moveLeftButton = document.querySelector("#moveLeft");
const powerBarEl = document.querySelector("#powerBar");
const crystalPowerButton = document.querySelector("#crystalPowerButton");
const crystalPowerCountEl = document.querySelector("#crystalPowerCount");
const tornadoPowerButton = document.querySelector("#tornadoPowerButton");
const tornadoPowerCountEl = document.querySelector("#tornadoPowerCount");
const fishingPowerButton = document.querySelector("#fishingPowerButton");
const fishingPowerCountEl = document.querySelector("#fishingPowerCount");
const hammerPowerButton = document.querySelector("#hammerPowerButton");
const hammerPowerCountEl = document.querySelector("#hammerPowerCount");
const rocketPowerButton = document.querySelector("#rocketPowerButton");
const rocketPowerCountEl = document.querySelector("#rocketPowerCount");
const powerShopEl = document.querySelector("#powerShop");
const powerShopTitleEl = document.querySelector("#powerShopTitle");
const powerShopIconEl = document.querySelector("#powerShopIcon");
const powerShopPriceEl = document.querySelector("#powerShopPrice");
const powerShopBalanceEl = document.querySelector("#powerShopBalance");
const powerShopWarningEl = document.querySelector("#powerShopWarning");
const powerShopCancelButton = document.querySelector("#powerShopCancelButton");
const powerShopBuyButton = document.querySelector("#powerShopBuyButton");
const mazeContext = mazeEl.getContext("2d");
const mouseSprite = new Image();
const cheeseSprite = new Image();
const crystalSprite = new Image();
const tornadoSprite = new Image();
const fishingSprite = new Image();
const hammerSprite = new Image();
const rocketSprite = new Image();

mouseSprite.src = "assets/mouse.png?v=campaign-53";
cheeseSprite.src = "assets/cheese.svg?v=campaign-53";
crystalSprite.src = "assets/crystal-power.png?v=campaign-53";
tornadoSprite.src = "assets/tornado-power.png?v=campaign-53";
fishingSprite.src = "assets/fishing-power.png?v=campaign-53";
hammerSprite.src = "assets/hammer-power.png?v=campaign-53";
rocketSprite.src = "assets/rocket-power.png?v=campaign-53";

let level = 1;
let activeVariantIndex = -1;
let maze = [];
let exit = null;
let mouse = { ...START };
let shortestPath = [];
let moveLimit = 0;
let movesLeft = 0;
let gameOver = false;
let campaignComplete = false;
let attempts = MAX_ATTEMPTS;
let nextAttemptAt = null;
let attemptTicker = null;
let retryCostsAttempt = false;
let currency = STARTING_CURRENCY;
let powerInventory = createStartingPowerInventory();
let shopPowerKey = null;
let shopReturnFocus = null;
let touchStart = null;
let activeSwipePointerId = null;
let powerPointerStart = null;
let drawRequest = 0;
let controlMode = readSavedControlMode();
let crystalAvailable = false;
let crystalTargeting = false;
let crystalCandidatePath = [];
let crystalCandidateIncomplete = false;
let crystalRevealPath = [];
let crystalVisibleCount = 0;
let crystalRevealing = false;
let crystalRevealIncomplete = false;
let crystalRevealTimer = null;
let crystalRevealToken = 0;
let tornadoAvailable = false;
let tornadoTargeting = false;
let tornadoCandidate = null;
let fishingAvailable = false;
let fishingTargeting = false;
let fishingCatchAnimating = false;
let fishingCatchProgress = 0;
let fishingCatchTimer = null;
let fishingCatchToken = 0;
let hammerAvailable = false;
let hammerTargeting = false;
let rocketAvailable = false;
let rocketTargeting = false;
let powerControlsEnabled = true;
let mazeLayout = null;
let mouseMotion = null;
let mouseMotionFrame = null;
let queuedMoveDirection = null;
const levelVariantStates = LEVEL_CONFIGS.map(() => ({ current: -1, remaining: [] }));

mouseSprite.addEventListener("load", requestMazeDraw);
cheeseSprite.addEventListener("load", requestMazeDraw);
crystalSprite.addEventListener("load", requestMazeDraw);
tornadoSprite.addEventListener("load", requestMazeDraw);
fishingSprite.addEventListener("load", requestMazeDraw);
hammerSprite.addEventListener("load", requestMazeDraw);
rocketSprite.addEventListener("load", requestMazeDraw);

function createCell(row, col) {
  return {
    row,
    col,
    visited: false,
    walls: { top: true, right: true, bottom: true, left: true },
  };
}

function blankMaze() {
  return Array.from({ length: SIZE }, (_, row) =>
    Array.from({ length: SIZE }, (_, col) => createCell(row, col)),
  );
}

function createRng(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function randomUnit() {
  if (globalThis.crypto?.getRandomValues) {
    const value = new Uint32Array(1);
    globalThis.crypto.getRandomValues(value);
    return value[0] / 4294967296;
  }
  return Math.random();
}

function shuffledVariantIndices() {
  const variants = Array.from({ length: VARIANTS_PER_LEVEL }, (_, index) => index);
  for (let index = variants.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(randomUnit() * (index + 1));
    [variants[index], variants[swapIndex]] = [variants[swapIndex], variants[index]];
  }
  return variants;
}

function takeNextVariant(levelIndex) {
  const state = levelVariantStates[levelIndex];
  if (!state.remaining.length) {
    state.remaining = shuffledVariantIndices();
    if (state.current >= 0 && state.remaining[0] === state.current) {
      const swapIndex = state.remaining.findIndex((variant) => variant !== state.current);
      [state.remaining[0], state.remaining[swapIndex]] = [state.remaining[swapIndex], state.remaining[0]];
    }
  }

  state.current = state.remaining.shift();
  return state.current;
}

function readSavedControlMode() {
  try {
    const savedMode = globalThis.localStorage?.getItem("mouseMazeControlMode");
    return savedMode === "arrows" ? "arrows" : "swipe";
  } catch {
    return "swipe";
  }
}

function createEmptyPowerInventory() {
  return Object.fromEntries(Object.keys(POWER_CONFIGS).map((key) => [key, 0]));
}

function createStartingPowerInventory() {
  return Object.fromEntries(Object.keys(POWER_CONFIGS).map((key) => [key, 1]));
}

function syncPowerAvailability() {
  crystalAvailable = powerInventory.crystal > 0;
  tornadoAvailable = powerInventory.tornado > 0;
  hammerAvailable = powerInventory.hammer > 0;
  fishingAvailable = powerInventory.fishing > 0;
  rocketAvailable = powerInventory.rocket > 0;
}

function saveEconomyState() {
  try {
    globalThis.localStorage?.setItem(
      ECONOMY_STORAGE_KEY,
      JSON.stringify({ currency, powerInventory }),
    );
  } catch {
    // The current session still works when storage is unavailable.
  }
}

function loadEconomyState() {
  currency = STARTING_CURRENCY;
  powerInventory = createStartingPowerInventory();

  try {
    const saved = globalThis.localStorage?.getItem(ECONOMY_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Number.isFinite(parsed.currency)) {
        currency = Math.max(0, Math.floor(parsed.currency));
      }
      for (const key of Object.keys(POWER_CONFIGS)) {
        const savedCount = parsed.powerInventory?.[key];
        if (Number.isFinite(savedCount)) {
          powerInventory[key] = Math.max(0, Math.floor(savedCount));
        }
      }
    }
  } catch {
    currency = STARTING_CURRENCY;
    powerInventory = createStartingPowerInventory();
  }

  syncPowerAvailability();
  saveEconomyState();
}

function updateCurrencyUI() {
  currencyCountEl.textContent = String(currency);
  currencyStatusEl.setAttribute(
    "aria-label",
    `${currency} shirt button${currency === 1 ? "" : "s"}`,
  );
}

function updatePowerShopUI() {
  const config = POWER_CONFIGS[shopPowerKey];
  if (!config) return;

  powerShopTitleEl.textContent = `Buy ${config.name}`;
  powerShopIconEl.src = config.image;
  powerShopPriceEl.textContent = String(config.price);
  powerShopBalanceEl.textContent = String(currency);
  powerShopWarningEl.hidden = currency >= config.price;
  powerShopBuyButton.disabled = currency < config.price;
}

function openPowerShop(powerKey) {
  const config = POWER_CONFIGS[powerKey];
  if (!config || gameOver || campaignComplete || !powerControlsEnabled) return;

  if (isPowerTargeting()) cancelActivePower("Power put away while the shop is open.");
  shopPowerKey = powerKey;
  shopReturnFocus = document.querySelector(`#${powerKey}PowerButton`);
  powerShopEl.hidden = false;
  setMovementControlsEnabled(false);
  setPowerControlsEnabled(false);
  updateCurrencyUI();
  updatePowerShopUI();
  powerShopBuyButton.focus?.();
}

function closePowerShop() {
  if (powerShopEl.hidden) return;
  const returnFocus = shopReturnFocus;
  powerShopEl.hidden = true;
  shopPowerKey = null;
  shopReturnFocus = null;

  if (!gameOver && !campaignComplete && !crystalRevealing && !fishingCatchAnimating) {
    setMovementControlsEnabled(true);
    setPowerControlsEnabled(true);
  }
  returnFocus?.focus?.();
}

function buySelectedPower() {
  const config = POWER_CONFIGS[shopPowerKey];
  if (!config || currency < config.price) {
    updatePowerShopUI();
    return false;
  }

  currency -= config.price;
  powerInventory[shopPowerKey] += 1;
  syncPowerAvailability();
  saveEconomyState();
  updateCurrencyUI();
  updatePowerUI();
  updatePowerShopUI();
  setMessage(`${config.name} added. ${powerInventory[shopPowerKey]} available.`);
  return true;
}

function consumePower(powerKey) {
  if (!POWER_CONFIGS[powerKey] || powerInventory[powerKey] <= 0) return false;
  powerInventory[powerKey] -= 1;
  syncPowerAvailability();
  saveEconomyState();
  updatePowerUI();
  return true;
}

function handlePowerButton(powerKey, activatePower) {
  if (!powerControlsEnabled || gameOver || campaignComplete || mouseMotion) return;
  if (powerInventory[powerKey] <= 0) {
    openPowerShop(powerKey);
    return;
  }
  activatePower();
}

function initializeEconomySystem() {
  loadEconomyState();
  updateCurrencyUI();
  document.addEventListener?.("visibilitychange", () => {
    if (document.hidden) saveEconomyState();
  });
  globalThis.addEventListener?.("pagehide", saveEconomyState);
}

function saveAttemptState() {
  try {
    globalThis.localStorage?.setItem(
      ATTEMPT_STORAGE_KEY,
      JSON.stringify({ attempts, nextAttemptAt }),
    );
  } catch {
    // The current session still works when storage is unavailable.
  }
}

function syncAttempts(now = Date.now()) {
  attempts = Math.min(MAX_ATTEMPTS, Math.max(0, Math.floor(attempts)));
  let changed = false;

  if (attempts >= MAX_ATTEMPTS) {
    if (nextAttemptAt !== null) changed = true;
    nextAttemptAt = null;
  } else if (!Number.isFinite(nextAttemptAt)) {
    nextAttemptAt = now + ATTEMPT_RECOVERY_MS;
    changed = true;
  } else if (now >= nextAttemptAt) {
    const recovered = Math.floor((now - nextAttemptAt) / ATTEMPT_RECOVERY_MS) + 1;
    attempts = Math.min(MAX_ATTEMPTS, attempts + recovered);
    nextAttemptAt =
      attempts < MAX_ATTEMPTS
        ? nextAttemptAt + recovered * ATTEMPT_RECOVERY_MS
        : null;
    changed = true;
  }

  if (changed) saveAttemptState();
  return changed;
}

function loadAttemptState(now = Date.now()) {
  attempts = MAX_ATTEMPTS;
  nextAttemptAt = null;

  try {
    const saved = globalThis.localStorage?.getItem(ATTEMPT_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Number.isFinite(parsed.attempts)) attempts = parsed.attempts;
      if (Number.isFinite(parsed.nextAttemptAt)) nextAttemptAt = parsed.nextAttemptAt;
    }
  } catch {
    attempts = MAX_ATTEMPTS;
    nextAttemptAt = null;
  }

  syncAttempts(now);
  saveAttemptState();
}

function formatAttemptCountdown(milliseconds) {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function updateAttemptUI(now = Date.now()) {
  syncAttempts(now);
  attemptCountEl.textContent = String(attempts);
  attemptStatusEl.setAttribute(
    "aria-label",
    `${attempts} attempt${attempts === 1 ? "" : "s"} available`,
  );

  const recovering = attempts < MAX_ATTEMPTS && Number.isFinite(nextAttemptAt);
  attemptTimerEl.hidden = false;
  attemptTimerEl.textContent = recovering
    ? `Next ${formatAttemptCountdown(nextAttemptAt - now)}`
    : "MAX";

  if (gameOver && retryCostsAttempt && !campaignComplete) {
    retryButton.disabled = attempts <= 0;
  }
}

function spendAttempt(now = Date.now()) {
  syncAttempts(now);
  if (attempts <= 0) {
    updateAttemptUI(now);
    return false;
  }

  const wasFull = attempts === MAX_ATTEMPTS;
  attempts -= 1;
  if (wasFull || !Number.isFinite(nextAttemptAt)) {
    nextAttemptAt = now + ATTEMPT_RECOVERY_MS;
  }
  saveAttemptState();
  updateAttemptUI(now);
  return true;
}

function initializeAttemptSystem() {
  loadAttemptState();
  updateAttemptUI();

  if (typeof setInterval === "function" && attemptTicker === null) {
    attemptTicker = setInterval(updateAttemptUI, 1000);
  }

  document.addEventListener?.("visibilitychange", () => {
    if (document.hidden) saveAttemptState();
    else updateAttemptUI();
  });
  globalThis.addEventListener?.("pageshow", updateAttemptUI);
  globalThis.addEventListener?.("pagehide", saveAttemptState);
}

function saveCampaignState() {
  const config = LEVEL_CONFIGS[level - 1];
  const retryVariantIndex = levelVariantStates[level - 1]?.current;
  if (
    !config ||
    !Number.isInteger(retryVariantIndex) ||
    retryVariantIndex < 0 ||
    retryVariantIndex >= VARIANTS_PER_LEVEL
  ) {
    return;
  }

  try {
    globalThis.localStorage?.setItem(
      CAMPAIGN_STORAGE_KEY,
      JSON.stringify({
        level,
        retryVariantIndex,
      }),
    );
  } catch {
    // Storage can be unavailable in private browsing; the game remains playable.
  }
}

function restoreCampaignState() {
  let saved;
  try {
    saved = JSON.parse(globalThis.localStorage?.getItem(CAMPAIGN_STORAGE_KEY) ?? "null");
  } catch {
    saved = null;
  }

  const savedLevel = saved?.level;
  const config = LEVEL_CONFIGS[savedLevel - 1];
  const validVariant = (variantIndex) =>
    Number.isInteger(variantIndex) &&
    variantIndex >= 0 &&
    variantIndex < VARIANTS_PER_LEVEL;

  if (
    !config ||
    !validVariant(saved.retryVariantIndex)
  ) {
    try {
      globalThis.localStorage?.removeItem(CAMPAIGN_STORAGE_KEY);
    } catch {
      // Ignore unavailable storage and start a new campaign below.
    }
    return false;
  }

  level = savedLevel;
  levelVariantStates[level - 1].current = saved.retryVariantIndex;
  levelVariantStates[level - 1].remaining = [];
  loadLevelVariant(config, saved.retryVariantIndex);
  return true;
}

function setControlMode(mode) {
  controlMode = mode === "arrows" ? "arrows" : "swipe";
  const swipeActive = controlMode === "swipe";
  swipePadEl.hidden = !swipeActive;
  arrowPadEl.hidden = swipeActive;
  swipeModeButton.classList.toggle("active", swipeActive);
  arrowModeButton.classList.toggle("active", !swipeActive);
  swipeModeButton.setAttribute("aria-pressed", String(swipeActive));
  arrowModeButton.setAttribute("aria-pressed", String(!swipeActive));
  touchStart = null;
  activeSwipePointerId = null;

  try {
    globalThis.localStorage?.setItem("mouseMazeControlMode", controlMode);
  } catch {
    // The mode still works for this session when storage is unavailable.
  }
}

function setMovementControlsEnabled(enabled) {
  movementPanelEl.classList.toggle("disabled", !enabled);
  swipePadEl.setAttribute("aria-disabled", String(!enabled));
  moveUpButton.disabled = !enabled;
  moveRightButton.disabled = !enabled;
  moveDownButton.disabled = !enabled;
  moveLeftButton.disabled = !enabled;
}

function isPowerTargeting() {
  return (
    crystalTargeting ||
    tornadoTargeting ||
    fishingTargeting ||
    hammerTargeting ||
    rocketTargeting
  );
}

function updatePowerButton(powerKey, button, countEl, active, canUse = true) {
  const count = powerInventory[powerKey];
  const config = POWER_CONFIGS[powerKey];
  const empty = count <= 0;

  button.classList.toggle("active", active);
  button.classList.toggle("empty", empty);
  button.disabled = !powerControlsEnabled || (!empty && !active && !canUse);
  button.setAttribute("aria-pressed", String(active));
  button.setAttribute(
    "aria-label",
    empty
      ? `Buy ${config.name}`
      : `Use ${config.name}. ${count} available`,
  );
  button.title = empty ? `Buy ${config.name}` : config.name;
  countEl.textContent = empty ? "+" : String(count);
}

function hammerCanFinishLevel() {
  if (!exit) return false;
  return getHammerTargets().some(
    (target) => target.nextRow === exit.row && target.nextCol === exit.col,
  );
}

function fishingCanFinishLevel() {
  return Boolean(getFishingCatchTarget());
}

function rocketCanFinishLevel() {
  if (!exit) return false;
  return getRocketTargets().some(
    (target) => target.row === exit.row && target.col === exit.col,
  );
}

function updateMoveWarningUI() {
  const warningActive = !gameOver && !campaignComplete && movesLeft > 0 && movesLeft <= 3;
  const finalMove = warningActive && movesLeft === 1;
  movesStatEl.classList.toggle("moves-warning-slow", warningActive && !finalMove);
  movesStatEl.classList.toggle("moves-warning-fast", finalMove);
}

function updatePowerFinishWarnings() {
  const showSuggestions =
    !gameOver && !campaignComplete && powerControlsEnabled && movesLeft === 1;
  hammerPowerButton.classList.toggle(
    "finish-alert",
    showSuggestions && hammerAvailable && hammerCanFinishLevel(),
  );
  fishingPowerButton.classList.toggle(
    "finish-alert",
    showSuggestions && fishingAvailable && fishingCanFinishLevel(),
  );
  rocketPowerButton.classList.toggle(
    "finish-alert",
    showSuggestions && rocketAvailable && rocketCanFinishLevel(),
  );
}

function updatePowerUI() {
  const crystalActive = crystalTargeting && crystalAvailable;
  const tornadoActive = tornadoTargeting && tornadoAvailable;
  const fishingActive = fishingTargeting && fishingAvailable;
  const hammerActive = hammerTargeting && hammerAvailable;
  const rocketActive = rocketTargeting && rocketAvailable;
  const fishingHasTarget = Boolean(getFishingCatchTarget());
  const hammerHasTarget = getHammerTargets().length > 0;
  const rocketHasTarget = getRocketTargets().length > 0;
  powerBarEl.classList.toggle(
    "targeting",
    crystalActive || tornadoActive || fishingActive || hammerActive || rocketActive,
  );
  powerBarEl.classList.toggle("disabled", !powerControlsEnabled);
  updatePowerButton("crystal", crystalPowerButton, crystalPowerCountEl, crystalActive);
  updatePowerButton("tornado", tornadoPowerButton, tornadoPowerCountEl, tornadoActive);
  updatePowerButton(
    "hammer",
    hammerPowerButton,
    hammerPowerCountEl,
    hammerActive,
    hammerHasTarget,
  );
  updatePowerButton(
    "fishing",
    fishingPowerButton,
    fishingPowerCountEl,
    fishingActive,
    fishingHasTarget,
  );
  updatePowerButton(
    "rocket",
    rocketPowerButton,
    rocketPowerCountEl,
    rocketActive,
    rocketHasTarget,
  );
  updatePowerFinishWarnings();
  mazeEl.classList.toggle("crystal-targeting", crystalActive);
  mazeEl.classList.toggle("tornado-targeting", tornadoActive);
  mazeEl.classList.toggle("fishing-targeting", fishingActive);
  mazeEl.classList.toggle("hammer-targeting", hammerActive);
  mazeEl.classList.toggle("rocket-targeting", rocketActive);
  mazeEl.setAttribute(
    "aria-label",
    crystalActive
      ? "Tap the highlighted crystal ball to reveal the route"
      : tornadoActive
        ? "Tap the highlighted tornado to change the maze"
        : fishingActive
          ? "Tap the cheese when it is on a highlighted diagonal square"
          : hammerActive
            ? "Select a highlighted wall to break"
            : rocketActive
              ? "Select a highlighted landing square"
              : "Maze board",
  );
}

function setPowerControlsEnabled(enabled) {
  powerControlsEnabled = enabled;
  updatePowerUI();
}

function resetPowers() {
  clearCrystalReveal();
  clearFishingCatchAnimation();
  crystalTargeting = false;
  crystalCandidatePath = [];
  crystalCandidateIncomplete = false;
  tornadoTargeting = false;
  tornadoCandidate = null;
  fishingTargeting = false;
  hammerTargeting = false;
  rocketTargeting = false;
  powerPointerStart = null;
  syncPowerAvailability();
  setPowerControlsEnabled(true);
}

function clearCrystalReveal() {
  crystalRevealToken += 1;
  if (crystalRevealTimer !== null) clearTimeout(crystalRevealTimer);
  crystalRevealTimer = null;
  crystalRevealPath = [];
  crystalVisibleCount = 0;
  crystalRevealing = false;
  crystalRevealIncomplete = false;
}

function clearFishingCatchAnimation() {
  fishingCatchToken += 1;
  if (fishingCatchTimer !== null) clearTimeout(fishingCatchTimer);
  fishingCatchTimer = null;
  fishingCatchAnimating = false;
  fishingCatchProgress = 0;
}

function currentCrystalPath() {
  if (!exit) return [];
  return findShortestPathFrom(maze, mouse, exit);
}

function activateCrystalPower() {
  if (
    gameOver ||
    campaignComplete ||
    crystalRevealing ||
    fishingCatchAnimating ||
    !crystalAvailable
  ) {
    return;
  }
  if (crystalTargeting) {
    cancelActivePower("Crystal put away. Choose your next move.");
    return;
  }

  const path = currentCrystalPath();
  if (!path.length) {
    crystalCandidatePath = [];
    crystalCandidateIncomplete = false;
    setMessage("No route to the cheese is available.", true);
    return;
  }

  crystalCandidateIncomplete = path.length - 1 > movesLeft;
  crystalCandidatePath = path.slice(1, movesLeft + 1);
  crystalTargeting = true;
  tornadoTargeting = false;
  tornadoCandidate = null;
  fishingTargeting = false;
  hammerTargeting = false;
  rocketTargeting = false;
  powerPointerStart = null;
  setMovementControlsEnabled(false);
  updatePowerUI();
  setMessage("Tap the glowing crystal ball to reveal the route.");
  requestMazeDraw();
}

function chooseSafeTornadoCandidate() {
  const config = LEVEL_CONFIGS[level - 1];
  if (!config || !exit) return null;
  const variantIndices = shuffledVariantIndices().filter(
    (variantIndex) => variantIndex !== activeVariantIndex,
  );

  for (const variantIndex of variantIndices) {
    const variant = buildLevelVariant(config, variantIndex);
    const pathFromMouse = findShortestPathFrom(variant.grid, mouse, exit);
    if (pathFromMouse.length && pathFromMouse.length - 1 <= movesLeft) {
      return { grid: variant.grid, pathFromMouse, variantIndex };
    }
  }
  return null;
}

function activateTornadoPower() {
  if (
    gameOver ||
    campaignComplete ||
    crystalRevealing ||
    fishingCatchAnimating ||
    !tornadoAvailable
  ) {
    return;
  }
  if (tornadoTargeting) {
    cancelActivePower("Tornado put away. Choose your next move.");
    return;
  }

  tornadoCandidate = chooseSafeTornadoCandidate();
  if (!tornadoCandidate) {
    mazeEl.classList.remove("invalid");
    void mazeEl.offsetWidth;
    mazeEl.classList.add("invalid");
    setMessage("No maze variation can be completed with the remaining moves.", true);
    return;
  }

  tornadoTargeting = true;
  crystalTargeting = false;
  crystalCandidatePath = [];
  crystalCandidateIncomplete = false;
  fishingTargeting = false;
  hammerTargeting = false;
  rocketTargeting = false;
  powerPointerStart = null;
  setMovementControlsEnabled(false);
  updatePowerUI();
  setMessage("Tap the glowing tornado to reshape the maze.");
  requestMazeDraw();
}

function activateFishingPower() {
  if (
    gameOver ||
    campaignComplete ||
    crystalRevealing ||
    fishingCatchAnimating ||
    !fishingAvailable
  ) {
    return;
  }
  if (fishingTargeting) {
    cancelActivePower("Fishing rod put away. Choose your next move.");
    return;
  }
  if (!getFishingCatchTarget()) {
    setMessage("The cheese is outside the fishing rod's diagonal range.", true);
    return;
  }

  fishingTargeting = true;
  crystalTargeting = false;
  crystalCandidatePath = [];
  crystalCandidateIncomplete = false;
  tornadoTargeting = false;
  tornadoCandidate = null;
  hammerTargeting = false;
  rocketTargeting = false;
  powerPointerStart = null;
  setMovementControlsEnabled(false);
  updatePowerUI();
  setMessage("The cheese is in range. Tap it to reel it in.");
  requestMazeDraw();
}

function activateHammerPower() {
  if (
    gameOver ||
    campaignComplete ||
    crystalRevealing ||
    fishingCatchAnimating ||
    !hammerAvailable
  ) {
    return;
  }
  if (hammerTargeting) {
    cancelActivePower("Hammer put away. Choose your next move.");
    return;
  }

  if (!getHammerTargets().length) {
    setMessage("There is no internal wall beside the mouse.", true);
    return;
  }

  hammerTargeting = true;
  crystalTargeting = false;
  crystalCandidatePath = [];
  crystalCandidateIncomplete = false;
  tornadoTargeting = false;
  tornadoCandidate = null;
  fishingTargeting = false;
  rocketTargeting = false;
  powerPointerStart = null;
  setMovementControlsEnabled(false);
  updatePowerUI();
  setMessage("Choose one of the glowing walls.");
  requestMazeDraw();
}

function activateRocketPower() {
  if (
    gameOver ||
    campaignComplete ||
    crystalRevealing ||
    fishingCatchAnimating ||
    !rocketAvailable
  ) {
    return;
  }
  if (rocketTargeting) {
    cancelActivePower("Rocket put away. Choose your next move.");
    return;
  }

  rocketTargeting = true;
  crystalTargeting = false;
  crystalCandidatePath = [];
  crystalCandidateIncomplete = false;
  tornadoTargeting = false;
  tornadoCandidate = null;
  fishingTargeting = false;
  hammerTargeting = false;
  powerPointerStart = null;
  setMovementControlsEnabled(false);
  updatePowerUI();
  setMessage("Choose a glowing landing square.");
  requestMazeDraw();
}

function cancelActivePower(message) {
  if (!isPowerTargeting()) return;
  crystalTargeting = false;
  crystalCandidatePath = [];
  crystalCandidateIncomplete = false;
  tornadoTargeting = false;
  tornadoCandidate = null;
  fishingTargeting = false;
  hammerTargeting = false;
  rocketTargeting = false;
  powerPointerStart = null;
  setMovementControlsEnabled(true);
  updatePowerUI();
  setMessage(message);
  requestMazeDraw();
}

function shuffle(items, rng) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function carveMaze(grid, rng) {
  const stack = [grid[START.row][START.col]];
  grid[START.row][START.col].visited = true;

  while (stack.length) {
    const current = stack[stack.length - 1];
    const options = shuffle(DIRS, rng).filter((dir) => {
      const row = current.row + dir.row;
      const col = current.col + dir.col;
      return isInside(row, col) && !grid[row][col].visited;
    });

    if (!options.length) {
      stack.pop();
      continue;
    }

    const dir = options[0];
    const next = grid[current.row + dir.row][current.col + dir.col];
    current.walls[dir.wall] = false;
    next.walls[dir.opposite] = false;
    next.visited = true;
    stack.push(next);
  }
}

function addLoops(grid, count, rng) {
  let opened = 0;
  let attempts = 0;
  while (opened < count && attempts < 220) {
    attempts += 1;
    const row = Math.floor(rng() * SIZE);
    const col = Math.floor(rng() * SIZE);
    const dir = DIRS[Math.floor(rng() * DIRS.length)];
    const nextRow = row + dir.row;
    const nextCol = col + dir.col;
    if (!isInside(nextRow, nextCol) || !grid[row][col].walls[dir.wall]) continue;
    grid[row][col].walls[dir.wall] = false;
    grid[nextRow][nextCol].walls[dir.opposite] = false;
    opened += 1;
  }
}

function isInside(row, col) {
  return row >= 0 && row < SIZE && col >= 0 && col < SIZE;
}

function neighbors(grid, cell) {
  return DIRS.flatMap((dir) => {
    const row = cell.row + dir.row;
    const col = cell.col + dir.col;
    if (!isInside(row, col) || cell.walls[dir.wall]) return [];
    return [{ row, col, dir: dir.key }];
  });
}

function findShortestPathFrom(grid, start, target, blockedEdges = new Set()) {
  const queue = [{ row: start.row, col: start.col, path: [{ ...start }] }];
  const seen = new Set([keyOf(start)]);

  while (queue.length) {
    const current = queue.shift();
    if (current.row === target.row && current.col === target.col) return current.path;

    for (const next of neighbors(grid, grid[current.row][current.col])) {
      const key = keyOf(next);
      const edge = edgeKey(current, next);
      if (blockedEdges.has(edge) || seen.has(key)) continue;
      seen.add(key);
      queue.push({
        row: next.row,
        col: next.col,
        path: [...current.path, { row: next.row, col: next.col }],
      });
    }
  }

  return [];
}

function findShortestPath(grid, target, blockedEdges = new Set()) {
  return findShortestPathFrom(grid, START, target, blockedEdges);
}

function keyOf(cell) {
  return `${cell.row},${cell.col}`;
}

function edgeKey(a, b) {
  return [keyOf(a), keyOf(b)].sort().join("|");
}

function countTurns(path) {
  let turns = 0;
  let last = null;
  for (let i = 1; i < path.length; i += 1) {
    const previous = path[i - 1];
    const current = path[i];
    const dir = `${Math.sign(current.row - previous.row)},${Math.sign(current.col - previous.col)}`;
    if (last && dir !== last) turns += 1;
    last = dir;
  }
  return turns;
}

function countDeadEnds(grid) {
  let deadEnds = 0;
  for (const row of grid) {
    for (const cell of row) {
      const openSides = DIRS.filter((dir) => !cell.walls[dir.wall]).length;
      if (openSides === 1) deadEnds += 1;
    }
  }
  return deadEnds;
}

function countRoutesToExit(grid, target, limit = 3) {
  let routes = 0;
  const seen = new Set();

  function walk(cell) {
    if (routes >= limit) return;
    if (cell.row === target.row && cell.col === target.col) {
      routes += 1;
      return;
    }

    seen.add(keyOf(cell));
    for (const next of neighbors(grid, grid[cell.row][cell.col])) {
      const key = keyOf(next);
      if (!seen.has(key)) walk(next);
      if (routes >= limit) break;
    }
    seen.delete(keyOf(cell));
  }

  walk(START);
  return routes;
}

function findMeaningfulAlternative(grid, target, path, moveLimit) {
  const shortestDistance = path.length - 1;
  const shortestEdges = new Set();

  for (let i = 1; i < path.length; i += 1) {
    shortestEdges.add(edgeKey(path[i - 1], path[i]));
  }

  for (const blockedEdge of shortestEdges) {
    const alternate = findShortestPath(grid, target, new Set([blockedEdge]));
    if (!alternate.length) continue;

    const alternateDistance = alternate.length - 1;
    if (alternateDistance > moveLimit) continue;

    const alternateEdges = new Set();
    for (let i = 1; i < alternate.length; i += 1) {
      alternateEdges.add(edgeKey(alternate[i - 1], alternate[i]));
    }

    let differentEdges = 0;
    for (const edge of alternateEdges) {
      if (!shortestEdges.has(edge)) differentEdges += 1;
    }

    if (differentEdges >= 6) return alternate;
  }

  return null;
}

function chooseExitAndValidate(grid, config, variantIndex, rng) {
  const exits = shuffle(
    Array.from({ length: SIZE * SIZE }, (_, index) => ({
      row: Math.floor(index / SIZE),
      col: index % SIZE,
    })).filter(
      (candidate) =>
        (candidate.row !== START.row || candidate.col !== START.col) &&
        (candidate.row * 3 + candidate.col * 2) % VARIANTS_PER_LEVEL === variantIndex,
    ),
    rng,
  );

  for (const candidate of exits) {
    const path = findShortestPath(grid, candidate);
    if (!path.length) continue;

    const distance = path.length - 1;
    const turns = countTurns(path);
    const deadEnds = countDeadEnds(grid);
    const routes = countRoutesToExit(grid, candidate);
    const alternatePath = findMeaningfulAlternative(grid, candidate, path, config.moveLimit);

    if (
      distance >= config.minPath &&
      distance <= config.maxPath &&
      turns >= 4 &&
      deadEnds >= 5 &&
      deadEnds <= 38 &&
      routes >= 2 &&
      alternatePath
    ) {
      return { exit: candidate, path };
    }
  }

  return null;
}

function buildLevelVariant(config, variantIndex) {
  const variantSeed = config.seed + variantIndex * VARIANT_SEED_GAP;

  for (let attempt = 0; attempt < 1400; attempt += 1) {
    const seed = variantSeed + attempt * 7919;
    const rng = createRng(seed);
    const grid = blankMaze();
    carveMaze(grid, rng);
    addLoops(grid, 12, rng);

    const result = chooseExitAndValidate(grid, config, variantIndex, rng);
    if (result) return { grid, ...result, seed, attempt };
  }

  throw new Error(`Could not build variant ${variantIndex + 1}`);
}

function generateLevel() {
  const config = LEVEL_CONFIGS[level - 1];
  if (!config) {
    showCampaignComplete();
    return;
  }

  const variantIndex = takeNextVariant(level - 1);
  loadLevelVariant(config, variantIndex);
}

function retryLevel() {
  const config = LEVEL_CONFIGS[level - 1];
  const variantIndex = levelVariantStates[level - 1]?.current;
  if (!config || variantIndex < 0) {
    generateLevel();
    return;
  }

  loadLevelVariant(config, variantIndex);
}

function loadLevelVariant(config, variantIndex) {
  const variant = buildLevelVariant(config, variantIndex);
  activeVariantIndex = variantIndex;
  maze = variant.grid;
  exit = variant.exit;
  shortestPath = variant.path;
  moveLimit = config.moveLimit;
  resetRun();
}

function resetRun() {
  clearMouseMotion();
  mouse = { ...START };
  movesLeft = moveLimit;
  gameOver = false;
  campaignComplete = false;
  retryCostsAttempt = false;
  powerShopEl.hidden = true;
  shopPowerKey = null;
  shopReturnFocus = null;
  controlsPanelEl.hidden = true;
  retryButton.hidden = false;
  retryButton.disabled = false;
  nextButton.disabled = true;
  nextButton.textContent = "Next Level";
  resetPowers();
  setMovementControlsEnabled(true);
  updateAttemptUI();
  render();
  setMessage("Study the maze, then swipe one cell at a time.");
  starsEl.textContent = "\u2606 \u2606 \u2606";
  saveCampaignState();
}

function render() {
  mazeEl.classList.remove("win", "invalid");
  levelLabelEl.textContent = campaignComplete ? "Game" : "Level";
  levelTitleEl.textContent = campaignComplete ? "Over" : String(level);
  movesLeftEl.textContent = movesLeft;
  updateMoveWarningUI();
  updatePowerUI();
  requestMazeDraw();
}

function requestMazeDraw() {
  if (drawRequest) return;
  drawRequest = requestAnimationFrame(() => {
    drawRequest = 0;
    drawMaze();
  });
}

function drawMaze() {
  const bounds = mazeEl.getBoundingClientRect();
  if (!bounds.width || !bounds.height) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const pixelWidth = Math.round(bounds.width * dpr);
  const pixelHeight = Math.round(bounds.height * dpr);
  if (mazeEl.width !== pixelWidth || mazeEl.height !== pixelHeight) {
    mazeEl.width = pixelWidth;
    mazeEl.height = pixelHeight;
  }

  mazeContext.setTransform(dpr, 0, 0, dpr, 0, 0);
  mazeContext.clearRect(0, 0, bounds.width, bounds.height);
  if (campaignComplete) {
    mazeLayout = null;
    return;
  }
  drawMazeBoard(mazeContext, bounds.width, bounds.height);
}

function drawMazeBoard(ctx, width, height) {
  const frameWidth = clamp(width * 0.027, 11, 30);
  const frameDepth = clamp(width * 0.035, 14, 38);
  const topY = clamp(width * 0.018, 8, 18);
  const boardAspect = width <= 600 ? 0.82 : 0.74;
  const boardHeight = Math.min(width * boardAspect, height - topY - frameDepth - 8);
  const bottomY = topY + boardHeight;
  const outer = {
    tl: { x: width * 0.135, y: topY },
    tr: { x: width * 0.865, y: topY },
    br: { x: width * 0.982, y: bottomY },
    bl: { x: width * 0.018, y: bottomY },
  };
  const inner = {
    tl: { x: outer.tl.x + frameWidth * 0.72, y: outer.tl.y + frameWidth * 0.72 },
    tr: { x: outer.tr.x - frameWidth * 0.72, y: outer.tr.y + frameWidth * 0.72 },
    br: { x: outer.br.x - frameWidth * 0.9, y: outer.br.y - frameWidth * 0.72 },
    bl: { x: outer.bl.x + frameWidth * 0.9, y: outer.bl.y - frameWidth * 0.72 },
  };
  mazeLayout = { corners: inner, width };

  drawBoardShadow(ctx, outer, frameDepth);
  drawBoardBase(ctx, outer, frameDepth);
  drawFloor(ctx, inner, width);
  if (crystalRevealPath.length) drawCrystalPath(ctx, inner);
  if (rocketTargeting) drawRocketTargets(ctx, inner);
  if (fishingTargeting) drawFishingTargets(ctx, inner);
  drawInteriorWalls(ctx, inner, width);
  if (hammerTargeting) drawHammerTargets(ctx, inner, width);
  drawOuterFrame(ctx, outer, frameWidth, frameDepth);
  drawCharacters(ctx, inner);
}

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function tracePolygon(ctx, points) {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i].x, points[i].y);
  ctx.closePath();
}

function offsetPoint(point, y) {
  return { x: point.x, y: point.y + y };
}

function drawBoardShadow(ctx, outer, depth) {
  ctx.save();
  ctx.filter = "blur(18px)";
  ctx.fillStyle = "rgba(43, 54, 46, 0.24)";
  tracePolygon(ctx, [
    offsetPoint(outer.tl, depth + 10),
    offsetPoint(outer.tr, depth + 10),
    offsetPoint(outer.br, depth + 16),
    offsetPoint(outer.bl, depth + 16),
  ]);
  ctx.fill();
  ctx.restore();
}

function drawBoardBase(ctx, outer, depth) {
  const leftGradient = ctx.createLinearGradient(outer.tl.x, 0, outer.bl.x, 0);
  leftGradient.addColorStop(0, "#7f8c7d");
  leftGradient.addColorStop(1, "#667366");
  ctx.fillStyle = leftGradient;
  tracePolygon(ctx, [outer.tl, outer.bl, offsetPoint(outer.bl, depth), offsetPoint(outer.tl, depth)]);
  ctx.fill();

  ctx.fillStyle = "#5e6c60";
  tracePolygon(ctx, [outer.bl, outer.br, offsetPoint(outer.br, depth), offsetPoint(outer.bl, depth)]);
  ctx.fill();

  ctx.fillStyle = "#728073";
  tracePolygon(ctx, [outer.tr, outer.br, offsetPoint(outer.br, depth), offsetPoint(outer.tr, depth)]);
  ctx.fill();
}

function drawFloor(ctx, inner, width) {
  ctx.save();
  tracePolygon(ctx, [inner.tl, inner.tr, inner.br, inner.bl]);
  ctx.clip();

  const floorGlow = ctx.createLinearGradient(0, inner.tl.y, 0, inner.bl.y);
  floorGlow.addColorStop(0, "#f8f3e8");
  floorGlow.addColorStop(1, "#efe5cf");
  ctx.fillStyle = floorGlow;
  ctx.fillRect(0, inner.tl.y, width, inner.bl.y - inner.tl.y);

  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      const points = [
        project(inner, col / SIZE, row / SIZE),
        project(inner, (col + 1) / SIZE, row / SIZE),
        project(inner, (col + 1) / SIZE, (row + 1) / SIZE),
        project(inner, col / SIZE, (row + 1) / SIZE),
      ];
      ctx.fillStyle =
        (row + col) % 2 === 0 ? "rgba(255, 252, 244, 0.72)" : "rgba(231, 218, 190, 0.42)";
      tracePolygon(ctx, points);
      ctx.fill();
      ctx.strokeStyle = "rgba(155, 137, 105, 0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  ctx.restore();
}

function drawRocketTargets(ctx, corners) {
  const targets = getRocketTargets().map((target) => cellPolygon(target, corners));

  ctx.save();
  ctx.shadowColor = "rgba(221, 58, 52, 0.9)";
  ctx.shadowBlur = 14;
  for (const polygon of targets) {
    tracePolygon(ctx, polygon);
    ctx.fillStyle = "rgba(218, 57, 50, 0.2)";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(214, 49, 44, 0.68)";
    ctx.stroke();
  }
  ctx.restore();

  for (const polygon of targets) {
    tracePolygon(ctx, polygon);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "rgba(255, 190, 180, 0.92)";
    ctx.stroke();
  }
}

function drawFishingTargets(ctx, corners) {
  const catchTarget = getFishingCatchTarget();
  const targets = getFishingTargets().map((target) => ({
    target,
    polygon: cellPolygon(target, corners),
  }));

  ctx.save();
  ctx.shadowColor = "rgba(221, 58, 52, 0.9)";
  ctx.shadowBlur = 16;
  for (const { target, polygon } of targets) {
    const isCatchable =
      catchTarget && target.row === catchTarget.row && target.col === catchTarget.col;
    tracePolygon(ctx, polygon);
    ctx.fillStyle = isCatchable ? "rgba(222, 55, 49, 0.34)" : "rgba(218, 57, 50, 0.2)";
    ctx.fill();
    ctx.lineWidth = isCatchable ? 3.5 : 2.5;
    ctx.strokeStyle = isCatchable ? "rgba(208, 45, 40, 0.9)" : "rgba(214, 49, 44, 0.68)";
    ctx.stroke();
  }
  ctx.restore();

  for (const { polygon } of targets) {
    tracePolygon(ctx, polygon);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "rgba(255, 190, 180, 0.92)";
    ctx.stroke();
  }
}

function drawCrystalPath(ctx, corners) {
  const cells = crystalRevealPath.slice(0, crystalVisibleCount);

  ctx.save();
  ctx.shadowColor = "rgba(237, 104, 154, 0.95)";
  ctx.shadowBlur = 18;
  for (const cell of cells) {
    const polygon = cellPolygon(cell, corners);
    const center = polygon.reduce(
      (sum, point) => ({ x: sum.x + point.x / polygon.length, y: sum.y + point.y / polygon.length }),
      { x: 0, y: 0 },
    );
    const inset = polygon.map((point) => ({
      x: center.x + (point.x - center.x) * 0.78,
      y: center.y + (point.y - center.y) * 0.78,
    }));
    tracePolygon(ctx, inset);
    ctx.fillStyle = "rgba(244, 132, 178, 0.42)";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255, 211, 228, 0.92)";
    ctx.stroke();
  }
  ctx.restore();
}

function project(corners, u, v) {
  const top = {
    x: corners.tl.x + (corners.tr.x - corners.tl.x) * u,
    y: corners.tl.y + (corners.tr.y - corners.tl.y) * u,
  };
  const bottom = {
    x: corners.bl.x + (corners.br.x - corners.bl.x) * u,
    y: corners.bl.y + (corners.br.y - corners.bl.y) * u,
  };
  return {
    x: top.x + (bottom.x - top.x) * v,
    y: top.y + (bottom.y - top.y) * v,
  };
}

function collectWallSegments() {
  const segments = [];

  for (let y = 1; y < SIZE; y += 1) {
    let start = null;
    for (let x = 0; x < SIZE; x += 1) {
      const hasWall = maze[y][x].walls.top;
      if (hasWall && start === null) start = x;
      if ((!hasWall || x === SIZE - 1) && start !== null) {
        const end = hasWall && x === SIZE - 1 ? x + 1 : x;
        segments.push({ orientation: "horizontal", line: y, start, length: end - start });
        start = null;
      }
    }
  }

  for (let x = 1; x < SIZE; x += 1) {
    let start = null;
    for (let y = 0; y < SIZE; y += 1) {
      const hasWall = maze[y][x].walls.left;
      if (hasWall && start === null) start = y;
      if ((!hasWall || y === SIZE - 1) && start !== null) {
        const end = hasWall && y === SIZE - 1 ? y + 1 : y;
        segments.push({ orientation: "vertical", line: x, start, length: end - start });
        start = null;
      }
    }
  }

  return segments;
}

function hammerSegmentForDirection(directionKey) {
  if (directionKey === "top") {
    return { orientation: "horizontal", line: mouse.row, start: mouse.col, length: 1 };
  }
  if (directionKey === "bottom") {
    return { orientation: "horizontal", line: mouse.row + 1, start: mouse.col, length: 1 };
  }
  if (directionKey === "left") {
    return { orientation: "vertical", line: mouse.col, start: mouse.row, length: 1 };
  }
  return { orientation: "vertical", line: mouse.col + 1, start: mouse.row, length: 1 };
}

function getHammerTargets() {
  if (!maze.length) return [];
  const current = maze[mouse.row]?.[mouse.col];
  if (!current) return [];

  return DIRS.flatMap((dir) => {
    const nextRow = mouse.row + dir.row;
    const nextCol = mouse.col + dir.col;
    if (!isInside(nextRow, nextCol) || !current.walls[dir.wall]) return [];
    return [
      {
        dir,
        nextRow,
        nextCol,
        segment: hammerSegmentForDirection(dir.wall),
      },
    ];
  });
}

function getRocketTargets() {
  const targets = [];
  for (let row = Math.max(0, mouse.row - 2); row <= Math.min(SIZE - 1, mouse.row + 2); row += 1) {
    for (
      let col = Math.max(0, mouse.col - 2);
      col <= Math.min(SIZE - 1, mouse.col + 2);
      col += 1
    ) {
      const moveDistance = Math.abs(row - mouse.row) + Math.abs(col - mouse.col);
      if (moveDistance > 0 && moveDistance <= 2) targets.push({ row, col });
    }
  }
  return targets;
}

function getFishingTargets() {
  const targets = [];
  for (const distance of [1, 2]) {
    for (const rowDirection of [-1, 1]) {
      for (const colDirection of [-1, 1]) {
        const row = mouse.row + rowDirection * distance;
        const col = mouse.col + colDirection * distance;
        if (isInside(row, col)) targets.push({ row, col });
      }
    }
  }
  return targets;
}

function getFishingCatchTarget() {
  if (!exit) return null;
  return (
    getFishingTargets().find((target) => target.row === exit.row && target.col === exit.col) ??
    null
  );
}

function cellPolygon(cell, corners) {
  return [
    project(corners, cell.col / SIZE, cell.row / SIZE),
    project(corners, (cell.col + 1) / SIZE, cell.row / SIZE),
    project(corners, (cell.col + 1) / SIZE, (cell.row + 1) / SIZE),
    project(corners, cell.col / SIZE, (cell.row + 1) / SIZE),
  ];
}

function segmentGeometry(segment, corners, width) {
  const horizontal = segment.orientation === "horizontal";
  const u1 = horizontal ? segment.start / SIZE : segment.line / SIZE;
  const v1 = horizontal ? segment.line / SIZE : segment.start / SIZE;
  const u2 = horizontal ? (segment.start + segment.length) / SIZE : segment.line / SIZE;
  const v2 = horizontal ? segment.line / SIZE : (segment.start + segment.length) / SIZE;
  const depth = (v1 + v2) / 2;
  const middleU = (u1 + u2) / 2;
  const sampleLeft = project(corners, clamp(middleU - 0.05, 0, 1), depth);
  const sampleRight = project(corners, clamp(middleU + 0.05, 0, 1), depth);
  const sampleTop = project(corners, middleU, clamp(depth - 0.05, 0, 1));
  const sampleBottom = project(corners, middleU, clamp(depth + 0.05, 0, 1));
  const localCellWidth = distance(sampleLeft, sampleRight);
  const localCellHeight = distance(sampleTop, sampleBottom);
  const lineWidth = Math.min(
    clamp(width * (0.012 + depth * 0.004) * 0.8, 6, 15),
    localCellWidth * 0.14,
  );
  const maximumFootprint = localCellHeight * 0.4;
  const height = Math.max(
    6,
    Math.min(
      clamp(width * (0.018 + depth * 0.009) * 0.75, 8, 22),
      maximumFootprint - lineWidth,
    ),
  );
  return {
    p1: project(corners, u1, v1),
    p2: project(corners, u2, v2),
    lineWidth,
    height,
    depth,
  };
}

function pointToSegmentDistance(point, start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;
  if (!lengthSquared) return distance(point, start);
  const amount = clamp(
    ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared,
    0,
    1,
  );
  return Math.hypot(point.x - (start.x + dx * amount), point.y - (start.y + dy * amount));
}

function hammerTargetAtPoint(point) {
  if (!hammerTargeting || !mazeLayout) return null;
  const threshold = clamp(mazeLayout.width * 0.045, 16, 30);
  let closest = null;
  let closestDistance = Infinity;

  for (const target of getHammerTargets()) {
    const wall = segmentGeometry(target.segment, mazeLayout.corners, mazeLayout.width);
    const offsets = [0, wall.height * 0.5, wall.height];
    const targetDistance = Math.min(
      ...offsets.map((offsetY) =>
        pointToSegmentDistance(
          point,
          { x: wall.p1.x, y: wall.p1.y + offsetY },
          { x: wall.p2.x, y: wall.p2.y + offsetY },
        ),
      ),
    );
    if (targetDistance < closestDistance) {
      closest = target;
      closestDistance = targetDistance;
    }
  }

  return closestDistance <= threshold ? closest : null;
}

function pointInPolygon(point, polygon) {
  let inside = false;
  for (let current = 0, previous = polygon.length - 1; current < polygon.length; previous = current++) {
    const a = polygon[current];
    const b = polygon[previous];
    const crosses =
      a.y > point.y !== b.y > point.y &&
      point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x;
    if (crosses) inside = !inside;
  }
  return inside;
}

function rocketTargetAtPoint(point) {
  if (!rocketTargeting || !mazeLayout) return null;
  return (
    getRocketTargets().find((target) =>
      pointInPolygon(point, cellPolygon(target, mazeLayout.corners)),
    ) ?? null
  );
}

function fishingTargetAtPoint(point) {
  if (!fishingTargeting || !mazeLayout) return null;
  const target = getFishingCatchTarget();
  if (!target) return null;
  return pointInPolygon(point, cellPolygon(target, mazeLayout.corners)) ? target : null;
}

function characterTargetAtPoint(point) {
  if (!mazeLayout) return false;
  const center = project(
    mazeLayout.corners,
    (mouse.col + 0.5) / SIZE,
    (mouse.row + 0.5) / SIZE,
  );
  const cellWidth = distance(
    project(mazeLayout.corners, mouse.col / SIZE, mouse.row / SIZE),
    project(mazeLayout.corners, (mouse.col + 1) / SIZE, mouse.row / SIZE),
  );
  return distance(point, center) <= clamp(cellWidth * 0.9, 22, 44);
}

function crystalTargetAtPoint(point) {
  return crystalTargeting && characterTargetAtPoint(point);
}

function tornadoTargetAtPoint(point) {
  return tornadoTargeting && characterTargetAtPoint(point);
}

function finishCrystalReveal(token) {
  if (token !== crystalRevealToken) return;
  crystalRevealPath = [];
  crystalVisibleCount = 0;
  crystalRevealTimer = null;
  requestMazeDraw();

  crystalRevealTimer = setTimeout(() => {
    if (token !== crystalRevealToken) return;
    const incomplete = crystalRevealIncomplete;
    crystalRevealTimer = null;
    crystalRevealing = false;
    crystalRevealIncomplete = false;
    setMovementControlsEnabled(true);
    setPowerControlsEnabled(true);
    setMessage(
      incomplete
        ? "The vision stopped at the movement limit. Another power may open the way."
        : "The vision faded. Remember the route.",
    );
    requestMazeDraw();
  }, 140);
}

function revealCrystalPath() {
  const token = ++crystalRevealToken;
  const stepDelay = clamp(Math.floor(2200 / crystalRevealPath.length), 70, 150);

  function revealNext() {
    if (token !== crystalRevealToken) return;
    crystalVisibleCount += 1;
    requestMazeDraw();

    if (crystalVisibleCount < crystalRevealPath.length) {
      crystalRevealTimer = setTimeout(revealNext, stepDelay);
      return;
    }

    crystalRevealTimer = setTimeout(() => finishCrystalReveal(token), 1000);
  }

  revealNext();
}

function useCrystalPower() {
  if (!crystalTargeting || !crystalAvailable || !crystalCandidatePath.length) return;
  if (!consumePower("crystal")) return;
  crystalTargeting = false;
  crystalRevealPath = crystalCandidatePath.map((cell) => ({ ...cell }));
  crystalCandidatePath = [];
  crystalRevealIncomplete = crystalCandidateIncomplete;
  crystalCandidateIncomplete = false;
  crystalVisibleCount = 0;
  crystalRevealing = true;
  powerPointerStart = null;
  setMovementControlsEnabled(false);
  setPowerControlsEnabled(false);
  setMessage("Watch the route carefully.");
  requestMazeDraw();
  revealCrystalPath();
}

function useTornadoPower() {
  if (!tornadoTargeting || !tornadoAvailable || !tornadoCandidate) return;
  if (!consumePower("tornado")) return;
  maze = tornadoCandidate.grid;
  activeVariantIndex = tornadoCandidate.variantIndex;
  shortestPath = findShortestPath(maze, exit);
  tornadoTargeting = false;
  tornadoCandidate = null;
  powerPointerStart = null;
  setMovementControlsEnabled(true);
  updatePowerUI();
  mazeEl.classList.remove("tornado-shift");
  void mazeEl.offsetWidth;
  mazeEl.classList.add("tornado-shift");
  setMessage("The maze shifted around the mouse.");
  render();
  saveCampaignState();
}

function useFishingPower(target) {
  const catchTarget = getFishingCatchTarget();
  if (
    !target ||
    !catchTarget ||
    !fishingTargeting ||
    !fishingAvailable ||
    target.row !== catchTarget.row ||
    target.col !== catchTarget.col
  ) {
    return;
  }

  if (!consumePower("fishing")) return;
  fishingTargeting = false;
  fishingCatchAnimating = true;
  fishingCatchProgress = 0;
  powerPointerStart = null;
  setMovementControlsEnabled(false);
  setPowerControlsEnabled(false);
  setMessage("Reeling in the cheese...");
  requestMazeDraw();

  const token = ++fishingCatchToken;
  function reelNext() {
    if (token !== fishingCatchToken) return;
    fishingCatchProgress = Math.min(1, fishingCatchProgress + 0.14);
    requestMazeDraw();

    if (fishingCatchProgress < 1) {
      fishingCatchTimer = setTimeout(reelNext, 45);
      return;
    }

    fishingCatchTimer = setTimeout(() => {
      if (token !== fishingCatchToken) return;
      fishingCatchTimer = null;
      fishingCatchAnimating = false;
      fishingCatchProgress = 0;
      exit = { ...mouse };
      winLevel();
    }, 100);
  }

  fishingCatchTimer = setTimeout(reelNext, 45);
}

function destroyHammerTarget(target) {
  if (!target || !hammerTargeting || !hammerAvailable) return;
  if (!consumePower("hammer")) return;
  const current = maze[mouse.row][mouse.col];
  const neighbor = maze[target.nextRow][target.nextCol];
  current.walls[target.dir.wall] = false;
  neighbor.walls[target.dir.opposite] = false;

  hammerTargeting = false;
  powerPointerStart = null;
  setMovementControlsEnabled(true);
  updatePowerUI();
  setMessage("Wall broken. A new path is open.");
  render();
  saveCampaignState();
}

function useRocketTarget(target) {
  if (!target || !rocketTargeting || !rocketAvailable) return;
  if (!consumePower("rocket")) return;
  mouse = { row: target.row, col: target.col };
  rocketTargeting = false;
  powerPointerStart = null;
  setMovementControlsEnabled(true);
  updatePowerUI();
  setMessage("Rocket landed. The walls were left behind.");
  render();

  if (mouse.row === exit.row && mouse.col === exit.col) winLevel();
  else saveCampaignState();
}

function strokeLine(ctx, p1, p2, lineWidth, color, offsetY = 0) {
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y + offsetY);
  ctx.lineTo(p2.x, p2.y + offsetY);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.stroke();
}

function drawInteriorWalls(ctx, corners, width) {
  const walls = collectWallSegments()
    .map((segment) => segmentGeometry(segment, corners, width))
    .sort((a, b) => a.depth - b.depth);
  const maximumHeight = Math.ceil(Math.max(...walls.map((wall) => wall.height), 0));

  ctx.save();
  ctx.shadowColor = "rgba(50, 58, 50, 0.25)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 8;
  for (const wall of walls) {
    strokeLine(ctx, wall.p1, wall.p2, wall.lineWidth + 2, "rgba(61, 72, 62, 0.3)", wall.height + 3);
  }
  ctx.restore();

  for (let layer = maximumHeight; layer >= 1; layer -= 1) {
    const shade = layer > maximumHeight * 0.55 ? "#5d6a5e" : "#718071";
    for (const wall of walls) {
      if (layer <= wall.height) strokeLine(ctx, wall.p1, wall.p2, wall.lineWidth, shade, layer);
    }
  }

  for (const wall of walls) strokeLine(ctx, wall.p1, wall.p2, wall.lineWidth + 2.5, "#58665a");
  for (const wall of walls) strokeLine(ctx, wall.p1, wall.p2, wall.lineWidth, "#8f9b8b");
  for (const wall of walls) {
    strokeLine(
      ctx,
      wall.p1,
      wall.p2,
      Math.max(1.2, wall.lineWidth * 0.18),
      "rgba(229, 235, 222, 0.72)",
      -wall.lineWidth * 0.18,
    );
  }
}

function drawHammerTargets(ctx, corners, width) {
  const targets = getHammerTargets().map((target) => ({
    ...target,
    wall: segmentGeometry(target.segment, corners, width),
  }));

  ctx.save();
  ctx.shadowColor = "rgba(221, 58, 52, 0.95)";
  ctx.shadowBlur = clamp(width * 0.035, 12, 28);
  for (const { wall } of targets) {
    strokeLine(ctx, wall.p1, wall.p2, wall.lineWidth + 10, "rgba(220, 48, 43, 0.42)");
  }
  ctx.restore();

  for (const { wall } of targets) {
    strokeLine(ctx, wall.p1, wall.p2, wall.lineWidth + 5, "rgba(208, 52, 46, 0.48)");
    strokeLine(ctx, wall.p1, wall.p2, Math.max(2, wall.lineWidth * 0.3), "#ffbbb2");
  }
}

function drawOuterFrame(ctx, outer, lineWidth, depth) {
  const points = [outer.tl, outer.tr, outer.br, outer.bl];
  const backDepth = depth * 0.25;
  const drawPath = (offsetY, width, color) => {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y + offsetY);
    for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i].x, points[i].y + offsetY);
    ctx.closePath();
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.stroke();
  };
  const drawSideFaces = (offsetY, width, color) => {
    ctx.beginPath();
    ctx.moveTo(outer.tl.x, outer.tl.y + offsetY);
    ctx.lineTo(outer.bl.x, outer.bl.y + offsetY);
    ctx.lineTo(outer.br.x, outer.br.y + offsetY);
    ctx.lineTo(outer.tr.x, outer.tr.y + offsetY);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.stroke();

    if (offsetY <= backDepth) {
      strokeLine(ctx, outer.tl, outer.tr, width, color, offsetY);
    }
  };

  for (let layer = Math.ceil(depth); layer >= 1; layer -= 1) {
    drawSideFaces(layer, lineWidth, layer > depth * 0.55 ? "#5b685c" : "#718072");
  }
  drawPath(0, lineWidth + 3, "#566359");
  drawPath(0, lineWidth, "#8d9989");
  drawPath(-lineWidth * 0.2, Math.max(2, lineWidth * 0.2), "rgba(224, 231, 218, 0.72)");
}

function easeMouseMotion(progress) {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

function currentMouseVisualState() {
  if (!mouseMotion) {
    return { row: mouse.row, col: mouse.col, step: 0 };
  }

  const eased = easeMouseMotion(mouseMotion.progress);
  return {
    row: mouseMotion.from.row + (mouseMotion.to.row - mouseMotion.from.row) * eased,
    col: mouseMotion.from.col + (mouseMotion.to.col - mouseMotion.from.col) * eased,
    step: Math.sin(Math.PI * mouseMotion.progress),
  };
}

function drawCharacters(ctx, corners) {
  if (!exit) return;

  const restingCheeseCenter = project(
    corners,
    (exit.col + 0.5) / SIZE,
    (exit.row + 0.5) / SIZE,
  );
  const cheeseCellWidth = distance(
    project(corners, exit.col / SIZE, exit.row / SIZE),
    project(corners, (exit.col + 1) / SIZE, exit.row / SIZE),
  );

  const visualMouse = currentMouseVisualState();
  const mouseCenter = project(
    corners,
    (visualMouse.col + 0.5) / SIZE,
    (visualMouse.row + 0.5) / SIZE,
  );
  const mouseCellWidth = distance(
    project(corners, visualMouse.col / SIZE, visualMouse.row / SIZE),
    project(corners, (visualMouse.col + 1) / SIZE, visualMouse.row / SIZE),
  );
  mouseCenter.y -= mouseCellWidth * visualMouse.step * 0.045;
  const mouseStepScale = 1 + visualMouse.step * 0.035;
  const reelAmount = fishingCatchAnimating
    ? 1 - Math.pow(1 - fishingCatchProgress, 3)
    : 0;
  const cheeseCenter = fishingCatchAnimating
    ? {
        x: restingCheeseCenter.x + (mouseCenter.x - restingCheeseCenter.x) * reelAmount,
        y:
          restingCheeseCenter.y +
          (mouseCenter.y - restingCheeseCenter.y) * reelAmount -
          Math.sin(Math.PI * reelAmount) * mouseCellWidth * 0.35,
      }
    : restingCheeseCenter;
  drawSprite(ctx, cheeseSprite, cheeseCenter, cheeseCellWidth * 0.9, 0.5);

  if (crystalTargeting) {
    drawSprite(
      ctx,
      crystalSprite,
      mouseCenter,
      mouseCellWidth * 1.5,
      0.72,
      "source-over",
      "rgba(222, 55, 49, 0.98)",
    );
  } else if (tornadoTargeting) {
    drawSprite(
      ctx,
      tornadoSprite,
      mouseCenter,
      mouseCellWidth * 1.55,
      0.72,
      "source-over",
      "rgba(222, 55, 49, 0.98)",
    );
  } else if (fishingTargeting || fishingCatchAnimating) {
    drawSprite(ctx, fishingSprite, mouseCenter, mouseCellWidth * 1.72, 0.72);
  } else if (hammerTargeting) {
    drawSprite(ctx, hammerSprite, mouseCenter, mouseCellWidth * 1.28, 0.72);
  } else if (rocketTargeting) {
    drawSprite(ctx, rocketSprite, mouseCenter, mouseCellWidth * 1.35, 0.72);
  } else {
    drawSprite(ctx, mouseSprite, mouseCenter, mouseCellWidth * 0.76 * mouseStepScale, 0.72);
  }
}

function distance(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function drawSprite(
  ctx,
  sprite,
  center,
  size,
  baseline,
  blendMode = "source-over",
  glowColor = null,
) {
  if (!sprite.complete || !sprite.naturalWidth) return;
  ctx.save();
  ctx.globalCompositeOperation = blendMode;
  ctx.shadowColor = glowColor ?? "rgba(40, 46, 40, 0.3)";
  ctx.shadowBlur = glowColor ? size * 0.58 : size * 0.14;
  ctx.shadowOffsetY = glowColor ? 0 : size * 0.1;
  ctx.drawImage(sprite, center.x - size / 2, center.y - size * baseline, size, size);
  ctx.restore();
}

function setMessage(text, warning = false) {
  messageEl.textContent = text;
  messageEl.classList.toggle("warning", warning);
}

function clearMouseMotion() {
  if (mouseMotionFrame !== null) cancelAnimationFrame(mouseMotionFrame);
  mouseMotion = null;
  mouseMotionFrame = null;
  queuedMoveDirection = null;
  movementPanelEl.classList.remove("moving");
  mazeEl.setAttribute("aria-busy", "false");
}

function canAnimateMouseMotion() {
  return (
    typeof globalThis.performance?.now === "function" &&
    typeof globalThis.requestAnimationFrame === "function" &&
    !globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches
  );
}

function finishMouseMotion() {
  if (!mouseMotion) return;
  const target = mouseMotion.to;
  const queuedDirection = queuedMoveDirection;
  mouseMotion = null;
  mouseMotionFrame = null;
  queuedMoveDirection = null;
  movementPanelEl.classList.remove("moving");
  mazeEl.setAttribute("aria-busy", "false");
  mouse = { ...target };
  movesLeft -= 1;
  render();

  if (mouse.row === exit.row && mouse.col === exit.col) {
    winLevel();
    return;
  }

  if (movesLeft <= 0) {
    loseLevel();
    return;
  }

  setMessage(movesLeft <= 3 ? "Only a few careful steps remain." : "Good. Keep planning each cell.");
  saveCampaignState();
  if (queuedDirection) move(queuedDirection);
}

function animateMouseMotion(timestamp) {
  if (!mouseMotion) return;
  if (mouseMotion.startedAt === null) mouseMotion.startedAt = timestamp;
  mouseMotion.progress = clamp(
    (timestamp - mouseMotion.startedAt) / MOUSE_MOVE_DURATION_MS,
    0,
    1,
  );
  drawMaze();

  if (mouseMotion.progress >= 1) {
    finishMouseMotion();
    return;
  }

  mouseMotionFrame = requestAnimationFrame(animateMouseMotion);
}

function startMouseMotion(target) {
  mouseMotion = {
    from: { ...mouse },
    to: target,
    progress: 0,
    startedAt: null,
  };
  movementPanelEl.classList.add("moving");
  mazeEl.setAttribute("aria-busy", "true");

  if (!canAnimateMouseMotion()) {
    mouseMotion.progress = 1;
    finishMouseMotion();
    return;
  }

  mouseMotionFrame = requestAnimationFrame(animateMouseMotion);
}

function move(directionKey) {
  if (mouseMotion) {
    if (DIRS.some((item) => item.key === directionKey)) queuedMoveDirection = directionKey;
    return;
  }
  if (
    gameOver ||
    campaignComplete ||
    crystalRevealing ||
    fishingCatchAnimating ||
    isPowerTargeting()
  ) {
    return;
  }
  const dir = DIRS.find((item) => item.key === directionKey);
  const current = maze[mouse.row][mouse.col];

  if (!dir || current.walls[dir.wall]) {
    showInvalidMove();
    return;
  }

  startMouseMotion({ row: mouse.row + dir.row, col: mouse.col + dir.col });
}

function showInvalidMove() {
  mazeEl.classList.remove("invalid");
  void mazeEl.offsetWidth;
  mazeEl.classList.add("invalid");
  setMessage("There is a wall there. Choose another direction.", true);
}

function winLevel() {
  gameOver = true;
  retryCostsAttempt = false;
  clearCrystalReveal();
  clearFishingCatchAnimation();
  crystalTargeting = false;
  crystalCandidatePath = [];
  tornadoTargeting = false;
  tornadoCandidate = null;
  fishingTargeting = false;
  hammerTargeting = false;
  rocketTargeting = false;
  setMovementControlsEnabled(false);
  setPowerControlsEnabled(false);
  updateMoveWarningUI();
  controlsPanelEl.hidden = false;
  mazeEl.classList.add("win");
  requestMazeDraw();
  const stars = calculateStars();
  starsEl.textContent = `${"\u2605 ".repeat(stars)}${"\u2606 ".repeat(3 - stars)}`.trim();
  retryButton.hidden = stars === 3;
  updateAttemptUI();

  if (level >= LEVEL_CONFIGS.length) {
    setMessage("Game over. You cleared the first 10 levels.");
    retryButton.disabled = true;
    nextButton.disabled = true;
    nextButton.textContent = "Complete";
    saveCampaignState();
    return;
  }

  setMessage(stars === 3 ? "Clean route. Three stars." : "Exit reached. Next level unlocked.");
  nextButton.disabled = false;
  saveCampaignState();
}

function loseLevel(message = "No moves left. Retry and plan a quieter route.") {
  gameOver = true;
  retryCostsAttempt = true;
  clearCrystalReveal();
  clearFishingCatchAnimation();
  crystalTargeting = false;
  crystalCandidatePath = [];
  tornadoTargeting = false;
  tornadoCandidate = null;
  fishingTargeting = false;
  hammerTargeting = false;
  rocketTargeting = false;
  setMovementControlsEnabled(false);
  setPowerControlsEnabled(false);
  updateMoveWarningUI();
  controlsPanelEl.hidden = false;
  retryButton.hidden = false;
  starsEl.textContent = "\u2606 \u2606 \u2606";
  updateAttemptUI();
  setMessage(
    attempts > 0 ? message : "No attempts available. Wait for the next one to retry.",
    true,
  );
  saveCampaignState();
}

function calculateStars() {
  const used = moveLimit - movesLeft;
  const optimal = shortestPath.length - 1;
  const spare = moveLimit - optimal;
  const extraUsed = used - optimal;

  if (extraUsed <= Math.max(0, Math.floor(spare * 0.25))) return 3;
  if (extraUsed <= Math.max(1, Math.floor(spare * 0.7))) return 2;
  return 1;
}

function showCampaignComplete() {
  campaignComplete = true;
  gameOver = true;
  retryCostsAttempt = false;
  clearCrystalReveal();
  clearFishingCatchAnimation();
  crystalTargeting = false;
  crystalCandidatePath = [];
  tornadoTargeting = false;
  tornadoCandidate = null;
  fishingTargeting = false;
  hammerTargeting = false;
  rocketTargeting = false;
  setMovementControlsEnabled(false);
  setPowerControlsEnabled(false);
  controlsPanelEl.hidden = false;
  maze = blankMaze();
  exit = null;
  mouse = { ...START };
  movesLeft = 0;
  render();
  starsEl.textContent = "\u2605 \u2605 \u2605";
  setMessage("Game over. You cleared the first 10 levels.");
  retryButton.disabled = true;
  nextButton.disabled = true;
  nextButton.textContent = "Complete";
  updateAttemptUI();
}

function handleRetry(now = Date.now()) {
  if (campaignComplete) return;
  if (retryCostsAttempt && !spendAttempt(now)) {
    setMessage("No attempts available. Wait for the next one to retry.", true);
    return;
  }
  retryLevel();
}

function handleSwipe(endX, endY) {
  if (!touchStart) return;
  const dx = endX - touchStart.x;
  const dy = endY - touchStart.y;
  const absX = Math.abs(dx);
  const absY = Math.abs(dy);
  touchStart = null;

  if (Math.max(absX, absY) < 24) return;
  if (absX > absY) {
    move(dx > 0 ? "right" : "left");
  } else {
    move(dy > 0 ? "down" : "up");
  }
}

mazeEl.addEventListener("pointerdown", (event) => {
  if (!isPowerTargeting() || powerPointerStart) return;
  powerPointerStart = {
    pointerId: event.pointerId,
    x: event.clientX,
    y: event.clientY,
  };
  mazeEl.setPointerCapture?.(event.pointerId);
});

mazeEl.addEventListener("pointerup", (event) => {
  if (!isPowerTargeting() || event.pointerId !== powerPointerStart?.pointerId) return;
  const start = powerPointerStart;
  powerPointerStart = null;
  mazeEl.releasePointerCapture?.(event.pointerId);

  if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > 18) return;
  const bounds = mazeEl.getBoundingClientRect();
  const point = {
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top,
  };

  if (crystalTargeting) {
    if (crystalTargetAtPoint(point)) useCrystalPower();
    else setMessage("Tap the glowing crystal ball.", true);
  } else if (tornadoTargeting) {
    if (tornadoTargetAtPoint(point)) useTornadoPower();
    else setMessage("Tap the glowing tornado.", true);
  } else if (fishingTargeting) {
    const target = fishingTargetAtPoint(point);
    if (target) useFishingPower(target);
    else if (getFishingCatchTarget()) setMessage("Tap the highlighted cheese to catch it.", true);
    else setMessage("The cheese is not on a highlighted diagonal square.", true);
  } else if (hammerTargeting) {
    const target = hammerTargetAtPoint(point);
    if (target) destroyHammerTarget(target);
    else setMessage("Tap one of the glowing walls.", true);
  } else {
    const target = rocketTargetAtPoint(point);
    if (target) useRocketTarget(target);
    else setMessage("Tap one of the glowing landing squares.", true);
  }
});

mazeEl.addEventListener("pointercancel", (event) => {
  if (event.pointerId !== powerPointerStart?.pointerId) return;
  powerPointerStart = null;
});

swipePadEl.addEventListener("pointerdown", (event) => {
  if (activeSwipePointerId !== null) return;
  activeSwipePointerId = event.pointerId;
  touchStart = { x: event.clientX, y: event.clientY };
  swipePadEl.setPointerCapture?.(event.pointerId);
});

swipePadEl.addEventListener("pointerup", (event) => {
  if (event.pointerId !== activeSwipePointerId) return;
  handleSwipe(event.clientX, event.clientY);
  swipePadEl.releasePointerCapture?.(event.pointerId);
  activeSwipePointerId = null;
});

swipePadEl.addEventListener("pointercancel", (event) => {
  if (event.pointerId !== activeSwipePointerId) return;
  touchStart = null;
  activeSwipePointerId = null;
});

swipeModeButton.addEventListener("click", () => setControlMode("swipe"));
arrowModeButton.addEventListener("click", () => setControlMode("arrows"));
crystalPowerButton.addEventListener("click", () =>
  handlePowerButton("crystal", activateCrystalPower),
);
tornadoPowerButton.addEventListener("click", () =>
  handlePowerButton("tornado", activateTornadoPower),
);
hammerPowerButton.addEventListener("click", () =>
  handlePowerButton("hammer", activateHammerPower),
);
fishingPowerButton.addEventListener("click", () =>
  handlePowerButton("fishing", activateFishingPower),
);
rocketPowerButton.addEventListener("click", () =>
  handlePowerButton("rocket", activateRocketPower),
);
powerShopCancelButton.addEventListener("click", closePowerShop);
powerShopBuyButton.addEventListener("click", buySelectedPower);
moveUpButton.addEventListener("click", () => move("up"));
moveRightButton.addEventListener("click", () => move("right"));
moveDownButton.addEventListener("click", () => move("down"));
moveLeftButton.addEventListener("click", () => move("left"));

retryButton.addEventListener("click", () => {
  handleRetry();
});

nextButton.addEventListener("click", () => {
  if (nextButton.disabled || level >= LEVEL_CONFIGS.length) return;
  level += 1;
  generateLevel();
});

document.addEventListener?.("keydown", (event) => {
  if (event.key === "Escape" && !powerShopEl.hidden) closePowerShop();
});
document.addEventListener?.("visibilitychange", () => {
  if (document.hidden) saveCampaignState();
});
globalThis.addEventListener?.("pagehide", saveCampaignState);

new ResizeObserver(requestMazeDraw).observe(mazeEl);

initializeEconomySystem();
initializeAttemptSystem();
setControlMode(controlMode);
if (!restoreCampaignState()) generateLevel();
