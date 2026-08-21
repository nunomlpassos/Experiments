const ROWS = 11;
const COLS = 9;
const START_CORNERS = [
  { row: ROWS - 1, col: COLS - 1 },
  { row: ROWS - 1, col: 0 },
  { row: 0, col: 0 },
  { row: 0, col: COLS - 1 },
];
const START = START_CORNERS[0];
const VARIANTS_PER_LEVEL = 5;
const VARIANT_SEED_GAP = 104729;
const MAX_ATTEMPTS = 7;
const ATTEMPT_RECOVERY_MS = 30 * 60 * 1000;
const ATTEMPT_STORAGE_KEY = "mouseMazeAttemptStateV4FullBoard1";
const CAMPAIGN_STORAGE_KEY = "mouseMazeCampaignStateV4Portrait9x11";
const MOUSE_MOVE_DURATION_MS = 280;
const MOUSE_IDLE_SCALE = 0.96;
const MOUSE_FALLBACK_SCALE = 0.9;
const MOUSE_ACTION_SCALE = 0.98;
const CHEESE_SCALE = 0.9;
const ROCK_SCALE = 1.06;
const HINGED_WALL_MOVE_DURATION_MS = 760;
const CHEESE_EAT_DURATION_MS = 1600;
const CHEESE_EAT_SETTLE_RATIO = 0.16;
const MOUSE_DEFEAT_DURATION_MS = CHEESE_EAT_DURATION_MS;
const MOUSE_DEFEAT_SETTLE_RATIO = 0.1;
const LEVEL_INTRO_DURATION_MS = 2400;
const LEVEL_INTRO_RETRY_DURATION_MS = 1500;
const POWER_TRANSFORM_DURATION_MS = 900;
const POWER_TRANSFORM_FRAME_COUNT = 8;
const POWER_TRANSFORM_MOUSE_BLEND_RATIO = 0.125;
const CRYSTAL_REVEAL_TARGET_MS = 2400;
const CRYSTAL_REVEAL_MIN_STEP_MS = 100;
const CRYSTAL_REVEAL_MAX_STEP_MS = 220;
const CRYSTAL_REVEAL_HOLD_MS = 600;
const CRYSTAL_REVEAL_FADE_MS = 420;
const CRYSTAL_PLATE_LIFT_RATIO = 0.22;
const TORNADO_WALL_ANIMATION_DURATION_MS = 4200;
const HAMMER_BREAK_ANIMATION_DURATION_MS = 1180;
const HAMMER_IMPACT_RATIO = 0.48;
const HAMMER_SPRITE_PIVOT = { x: 0.382, y: 0.855 };
const FISHING_CAST_DURATION_MS = 2550;
const FISHING_WINDUP_END = 0.2;
const FISHING_CAST_END = 0.48;
const FISHING_HOOK_END = 0.58;
const FISHING_REEL_END = 0.94;
const FISHING_SPRITE_PIVOT = { x: 0.372, y: 0.813 };
const FISHING_ROD_TIP = { x: 0.665, y: 0.095 };
const FISHING_ACTION_SCALE = 2.35;
const FISHING_WINDUP_ARC = 0.34;
const FISHING_FOLLOW_THROUGH_ARC = 0.14;
const ROCKET_FLIGHT_DURATION_MS = 3200;
const ROCKET_IGNITION_END = 0.22;
const ROCKET_ASCENT_END = 0.5;
const ROCKET_CRUISE_END = 0.66;
const ROCKET_DESCENT_END = 0.9;
const ROCKET_BODY_SCALE = 1.1;
const ROCKET_APEX_SCALE = 1.82;
const STARTING_CURRENCY = 100;
const ECONOMY_STORAGE_KEY = "mouseMazeEconomyStateV4FullBoard1";
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
    image: "assets/fishing-power-transparent-v2.png?v=v2-fishing-upright-1",
  },
  rocket: {
    name: "Mouse Rocket",
    price: 50,
    image: "assets/rocket-power.png?v=campaign-53",
  },
};
const LEVEL_CONFIGS = [
  { seed: 1129, moveLimit: 18, minPath: 10, maxPath: 12, startOffset: 0 },
  { seed: 2113, moveLimit: 20, minPath: 12, maxPath: 14, startOffset: 1 },
  {
    seed: 3251,
    moveLimit: 30,
    minPath: 21,
    maxPath: 28,
    minTurns: 8,
    minDeadEnds: 9,
    loops: 6,
    startOffset: 2,
  },
  {
    seed: 4231,
    cheeseCount: 2,
    moveLimit: 34,
    minPath: 22,
    maxPath: 29,
    minTurns: 7,
    minDeadEnds: 7,
    minCheeseDistance: 8,
    minOrderPenalty: 3,
    maxOrderPenalty: 6,
    moveMargin: 8,
    startOffset: 3,
    loops: 10,
  },
  {
    seed: 5417,
    rockMode: "hidden",
    rockCount: 1,
    moveLimit: 22,
    minPath: 10,
    maxPath: 16,
    minTurns: 4,
    minDeadEnds: 6,
    moveMargin: 6,
    startOffset: 0,
    loops: 8,
  },
  {
    seed: 6619,
    rockMode: "search",
    rockCount: 3,
    moveLimit: 34,
    minPath: 18,
    maxPath: 27,
    minTurns: 7,
    minDeadEnds: 7,
    moveMargin: 8,
    startOffset: 1,
    loops: 7,
  },
  {
    seed: 7759,
    hingedWallCount: 1,
    moveLimit: 28,
    minPath: 15,
    maxPath: 24,
    minTurns: 6,
    minDeadEnds: 7,
    minHingedDetour: 3,
    moveMargin: 7,
    startOffset: 2,
    loops: 8,
  },
  {
    seed: 8819,
    hingedWallCount: 2,
    moveLimit: 36,
    minPath: 21,
    maxPath: 32,
    minTurns: 8,
    minDeadEnds: 8,
    minHingedDetour: 2,
    moveMargin: 8,
    startOffset: 3,
    loops: 6,
  },
];
const DIRS = [
  { key: "up", row: -1, col: 0, wall: "top", opposite: "bottom" },
  { key: "right", row: 0, col: 1, wall: "right", opposite: "left" },
  { key: "down", row: 1, col: 0, wall: "bottom", opposite: "top" },
  { key: "left", row: 0, col: -1, wall: "left", opposite: "right" },
];
const HAMMER_SWING_PROFILES = {
  up: { windupRotation: 1.08, impactRotation: 0, flipX: 1 },
  right: { windupRotation: -0.76, impactRotation: Math.PI / 2, flipX: 1 },
  down: { windupRotation: -1.02, impactRotation: -Math.PI, flipX: 1 },
  left: { windupRotation: 0.76, impactRotation: -Math.PI / 2, flipX: -1 },
};

const gameShellEl = document.querySelector(".game-shell");
const mazeEl = document.querySelector("#maze");
const controlsPanelEl = document.querySelector("#controlsPanel");
const movesLeftEl = document.querySelector("#movesLeft");
const movesStatEl = document.querySelector("#movesStat");
const cheeseProgressEl = document.querySelector("#cheeseProgress");
const testResetButton = document.querySelector("#testResetButton");
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
const mouseWalkLeftSprite = new Image();
const mouseWalkRightSprite = new Image();
const mouseWalkUpSprite = new Image();
const mouseWalkDownSprite = new Image();
const mouseEatingSprite = new Image();
const mouseSleepSprite = new Image();
const mouseSniffSprite = new Image();
const cheeseSprite = new Image();
const rockSprite = new Image();
const crystalSprite = new Image();
const tornadoSprite = new Image();
const fishingSprite = new Image();
const hammerSprite = new Image();
const rocketSprite = new Image();
const rocketFlightBodySprite = new Image();
const crystalTransformSprite = new Image();
const tornadoTransformSprite = new Image();
const fishingTransformSprite = new Image();
const hammerTransformSprite = new Image();
const rocketTransformSprite = new Image();
const albinoSkinPreviewActive = /(?:^|[?&])skin=albino(?:&|$)/.test(
  globalThis.location?.search ?? "",
);
const skinPreviewSpriteCache = new WeakMap();

mouseSprite.src = "assets/mouse.png?v=campaign-53";
mouseWalkLeftSprite.src = "assets/mouse-walk-strip.png?v=v2-walk-3";
mouseWalkRightSprite.src = "assets/mouse-walk-right-strip.png?v=v2-walk-3";
mouseWalkUpSprite.src = "assets/mouse-walk-up-strip.png?v=v2-walk-5";
mouseWalkDownSprite.src = "assets/mouse-walk-down-strip.png?v=v2-walk-3";
mouseEatingSprite.src = "assets/mouse-eat-strip.png?v=v2-eat-1";
mouseSleepSprite.src = "assets/mouse-sleep-strip.png?v=v2-sleep-1";
mouseSniffSprite.src = "assets/mouse-sniff-strip.png?v=v2-intro-1";
cheeseSprite.src = "assets/cheese.svg?v=campaign-53";
rockSprite.src = "assets/rock.png?v=v4-rocks-1";
crystalSprite.src = "assets/crystal-power.png?v=campaign-53";
tornadoSprite.src = "assets/tornado-power.png?v=campaign-53";
fishingSprite.src =
  "assets/fishing-power-transparent-v2.png?v=v2-fishing-upright-1";
hammerSprite.src = "assets/hammer-power.png?v=campaign-53";
rocketSprite.src = "assets/rocket-power.png?v=campaign-53";
rocketFlightBodySprite.src =
  "assets/rocket-flight-body.png?v=v2-rocket-flight-1";
crystalTransformSprite.src =
  "assets/power-transform-crystal-strip.png?v=v2-power-sprites-1";
tornadoTransformSprite.src =
  "assets/power-transform-tornado-strip-v2.png?v=v2-power-sprites-3";
fishingTransformSprite.src =
  "assets/power-transform-fishing-strip-v3.png?v=v2-fishing-upright-1";
hammerTransformSprite.src =
  "assets/power-transform-hammer-strip-v2.png?v=v2-power-sprites-3";
rocketTransformSprite.src =
  "assets/power-transform-rocket-strip-v2.png?v=v2-power-sprites-3";

function createAlbinoSkinPreview(sprite) {
  if (!albinoSkinPreviewActive || !sprite.complete || !sprite.naturalWidth) {
    return sprite;
  }

  const cached = skinPreviewSpriteCache.get(sprite);
  if (cached) return cached;

  const canvas = document.createElement("canvas");
  canvas.width = sprite.naturalWidth;
  canvas.height = sprite.naturalHeight;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(sprite, 0, 0);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);

  for (let index = 0; index < pixels.data.length; index += 4) {
    if (pixels.data[index + 3] < 18) continue;
    const red = pixels.data[index];
    const green = pixels.data[index + 1];
    const blue = pixels.data[index + 2];
    const lightness = red * 0.299 + green * 0.587 + blue * 0.114;
    const chroma = Math.max(red, green, blue) - Math.min(red, green, blue);

    if (lightness < 72 && chroma < 38) {
      pixels.data[index] = Math.round(102 + lightness * 1.15);
      pixels.data[index + 1] = Math.round(8 + lightness * 0.2);
      pixels.data[index + 2] = Math.round(16 + lightness * 0.24);
    } else if (chroma < 54) {
      const whiteShade = Math.min(250, Math.round(180 + lightness * 0.32));
      pixels.data[index] = whiteShade;
      pixels.data[index + 1] = Math.max(0, whiteShade - 3);
      pixels.data[index + 2] = Math.max(0, whiteShade - 6);
    }
  }

  context.putImageData(pixels, 0, 0);
  skinPreviewSpriteCache.set(sprite, canvas);
  return canvas;
}

function applyAlbinoSkinPreviewToPowerIcons() {
  if (!albinoSkinPreviewActive) return;
  document.documentElement.dataset.skinPreview = "albino";
  document.querySelectorAll(".power-icon img").forEach((icon) => {
    const applyPreview = () => {
      if (icon.dataset.skinPreviewApplied === "true") return;
      const preview = createAlbinoSkinPreview(icon);
      if (preview === icon) return;
      icon.dataset.skinPreviewApplied = "true";
      icon.src = preview.toDataURL("image/png");
    };
    if (icon.complete && icon.naturalWidth) applyPreview();
    else icon.addEventListener("load", applyPreview, { once: true });
  });
}

let level = 1;
let activeVariantIndex = -1;
let maze = [];
let exit = null;
let cheeseTargets = [];
let collectedCheeseKeys = new Set();
let initialRocks = [];
let rockPositions = [];
let hiddenCheeseKeys = new Set();
let initialHingedWalls = [];
let hingedWalls = [];
let hingedWallAnimation = null;
let hingedWallAnimationFrame = null;
let levelStart = { ...START };
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
let movementControlsEnabled = false;
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
let crystalRevealFrame = null;
let crystalRevealStartedAt = null;
let crystalRevealStepDuration = 0;
let crystalRevealStepProgress = 0;
let crystalRevealOpacity = 0;
let crystalRevealPhase = "idle";
let crystalRevealToken = 0;
let tornadoAvailable = false;
let tornadoTargeting = false;
let tornadoCandidate = null;
let tornadoWallAnimation = null;
let tornadoWallAnimationFrame = null;
let fishingAvailable = false;
let fishingTargeting = false;
let fishingCatchAnimating = false;
let fishingCatchProgress = 0;
let fishingCatchStartedAt = null;
let fishingCatchFrame = null;
let cheeseEatingAnimating = false;
let cheeseEatingProgress = 0;
let cheeseEatingStartedAt = null;
let cheeseEatingFrame = null;
let cheeseEaten = false;
let cheeseEatingTarget = null;
let activeFishingCatchTarget = null;
let mouseDefeatAnimating = false;
let mouseDefeatProgress = 0;
let mouseDefeatStartedAt = null;
let mouseDefeatFrame = null;
let mouseAsleep = false;
let levelIntro = null;
let levelIntroFrame = null;
let hammerAvailable = false;
let hammerTargeting = false;
let hammerWallAnimation = null;
let hammerWallAnimationFrame = null;
let rocketAvailable = false;
let rocketTargeting = false;
let rocketFlightAnimation = null;
let rocketFlightAnimationFrame = null;
let powerControlsEnabled = true;
let powerTransform = null;
let powerTransformFrame = null;
let mazeLayout = null;
let mouseMotion = null;
let mouseMotionFrame = null;
let queuedMoveDirection = null;
let mouseFacingDirection = "left";
const levelVariantStates = LEVEL_CONFIGS.map(() => ({ current: -1, remaining: [] }));

mouseSprite.addEventListener("load", requestMazeDraw);
mouseWalkLeftSprite.addEventListener("load", requestMazeDraw);
mouseWalkRightSprite.addEventListener("load", requestMazeDraw);
mouseWalkUpSprite.addEventListener("load", requestMazeDraw);
mouseWalkDownSprite.addEventListener("load", requestMazeDraw);
mouseEatingSprite.addEventListener("load", requestMazeDraw);
mouseSleepSprite.addEventListener("load", requestMazeDraw);
mouseSniffSprite.addEventListener("load", requestMazeDraw);
cheeseSprite.addEventListener("load", requestMazeDraw);
rockSprite.addEventListener("load", requestMazeDraw);
crystalSprite.addEventListener("load", requestMazeDraw);
tornadoSprite.addEventListener("load", requestMazeDraw);
fishingSprite.addEventListener("load", requestMazeDraw);
hammerSprite.addEventListener("load", requestMazeDraw);
rocketSprite.addEventListener("load", requestMazeDraw);
rocketFlightBodySprite.addEventListener("load", requestMazeDraw);
crystalTransformSprite.addEventListener("load", requestMazeDraw);
tornadoTransformSprite.addEventListener("load", requestMazeDraw);
fishingTransformSprite.addEventListener("load", requestMazeDraw);
hammerTransformSprite.addEventListener("load", requestMazeDraw);
rocketTransformSprite.addEventListener("load", requestMazeDraw);
applyAlbinoSkinPreviewToPowerIcons();

function createCell(row, col) {
  return {
    row,
    col,
    visited: false,
    walls: { top: true, right: true, bottom: true, left: true },
  };
}

function blankMaze() {
  return Array.from({ length: ROWS }, (_, row) =>
    Array.from({ length: COLS }, (_, col) => createCell(row, col)),
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

  if (
    !gameOver &&
    !campaignComplete &&
    !crystalRevealing &&
    !fishingCatchAnimating &&
    !rocketFlightAnimation
  ) {
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
  const activePowerKey = getActivePowerKey();
  if (
    !powerControlsEnabled ||
    gameOver ||
    campaignComplete ||
    mouseMotion ||
    powerTransform ||
    (activePowerKey && activePowerKey !== powerKey)
  ) {
    return;
  }
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
  globalThis.addEventListener?.("pageshow", () => updateAttemptUI());
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
  loadLevelVariant(config, saved.retryVariantIndex, "full");
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
  movementControlsEnabled = Boolean(enabled);
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

function getActivePowerKey() {
  if (crystalTargeting) return "crystal";
  if (tornadoTargeting) return "tornado";
  if (hammerTargeting) return "hammer";
  if (fishingTargeting) return "fishing";
  if (rocketTargeting) return "rocket";
  return null;
}

function updatePowerButton(powerKey, button, countEl, active, canUse = true) {
  const count = powerInventory[powerKey];
  const config = POWER_CONFIGS[powerKey];
  const empty = count <= 0;
  const activePowerKey = getActivePowerKey();
  const lockedBySelection = Boolean(activePowerKey && activePowerKey !== powerKey);
  const transformingThisPower = powerTransform?.powerKey === powerKey;

  button.classList.toggle("active", active);
  button.classList.toggle("empty", empty && !transformingThisPower);
  button.classList.toggle("selection-locked", lockedBySelection);
  button.disabled =
    !powerControlsEnabled ||
    Boolean(powerTransform) ||
    lockedBySelection ||
    (!empty && !active && !canUse);
  button.setAttribute("aria-pressed", String(active));
  button.setAttribute(
    "aria-label",
    transformingThisPower
      ? `${config.name} transformation in progress`
      : active
      ? `Cancel ${config.name}. ${count} available`
      : empty
      ? `Buy ${config.name}`
      : `Use ${config.name}. ${count} available`,
  );
  button.title = transformingThisPower
    ? `${config.name} transformation in progress`
    : active
      ? `Cancel ${config.name}`
      : empty
        ? `Buy ${config.name}`
        : config.name;
  countEl.textContent = empty && !transformingThisPower ? "+" : String(count);
}

function hammerCanFinishLevel() {
  const remaining = remainingCheeseTargets();
  if (remaining.length !== 1) return false;
  const targetCheese = remaining[0];
  if (!isCheeseVisible(targetCheese)) return false;
  return getHammerTargets().some(
    (target) =>
      target.nextRow === targetCheese.row && target.nextCol === targetCheese.col,
  );
}

function fishingCanFinishLevel() {
  return remainingCheeseTargets().length === 1 && Boolean(getFishingCatchTarget());
}

function rocketCanFinishLevel() {
  const remaining = remainingCheeseTargets();
  if (remaining.length !== 1) return false;
  const targetCheese = remaining[0];
  if (!isCheeseVisible(targetCheese)) return false;
  return getRocketTargets().some(
    (target) => target.row === targetCheese.row && target.col === targetCheese.col,
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
  const transformingPowerKey = powerTransform?.powerKey ?? null;
  const crystalActive = crystalTargeting || transformingPowerKey === "crystal";
  const tornadoActive = tornadoTargeting || transformingPowerKey === "tornado";
  const fishingActive =
    fishingTargeting || fishingCatchAnimating || transformingPowerKey === "fishing";
  const hammerActive =
    hammerTargeting || Boolean(hammerWallAnimation) || transformingPowerKey === "hammer";
  const rocketActive =
    rocketTargeting || Boolean(rocketFlightAnimation) || transformingPowerKey === "rocket";
  const fishingHasTarget = Boolean(getFishingCatchTarget());
  const hammerHasTarget = getHammerTargets().length > 0;
  const rocketHasTarget = getRocketTargets().length > 0;
  powerBarEl.classList.toggle(
    "targeting",
    crystalActive || tornadoActive || fishingActive || hammerActive || rocketActive,
  );
  powerBarEl.classList.toggle("disabled", !powerControlsEnabled);
  powerBarEl.classList.toggle("transforming", Boolean(powerTransform));
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
  const targetsReady =
    !levelIntro &&
    !powerTransform &&
    !crystalRevealing &&
    !tornadoWallAnimation &&
    !hammerWallAnimation &&
    !fishingCatchAnimating &&
    !rocketFlightAnimation;
  mazeEl.classList.toggle("crystal-targeting", crystalActive && targetsReady);
  mazeEl.classList.toggle("tornado-targeting", tornadoActive && targetsReady);
  mazeEl.classList.toggle("fishing-targeting", fishingActive && targetsReady);
  mazeEl.classList.toggle("hammer-targeting", hammerActive && targetsReady);
  mazeEl.classList.toggle("rocket-targeting", rocketActive && targetsReady);
  mazeEl.setAttribute(
    "aria-label",
    levelIntro
      ? "Mouse entering the maze"
      : powerTransform
      ? "Power transformation in progress"
      : tornadoWallAnimation
        ? "Tornado is rearranging the maze"
      : hammerWallAnimation
          ? "Hammer is breaking the selected wall"
        : rocketFlightAnimation
          ? "Rocket is flying to the selected landing square"
        : fishingCatchAnimating
          ? "Fishing rod is casting and retrieving the cheese"
        : crystalRevealing
          ? "Crystal Vision is revealing the route"
      : crystalActive
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

function clearPowerTargetingState() {
  crystalTargeting = false;
  crystalCandidatePath = [];
  crystalCandidateIncomplete = false;
  tornadoTargeting = false;
  tornadoCandidate = null;
  fishingTargeting = false;
  hammerTargeting = false;
  rocketTargeting = false;
  powerPointerStart = null;
}

function resetPowers() {
  clearPowerTransformation();
  clearCrystalReveal();
  clearTornadoWallAnimation();
  clearHingedWallAnimation();
  clearHammerWallAnimation();
  clearFishingCatchAnimation();
  clearRocketFlightAnimation();
  clearPowerTargetingState();
  syncPowerAvailability();
  setPowerControlsEnabled(true);
}

function clearCrystalReveal() {
  crystalRevealToken += 1;
  if (crystalRevealTimer !== null) clearTimeout(crystalRevealTimer);
  if (crystalRevealFrame !== null) cancelAnimationFrame(crystalRevealFrame);
  crystalRevealTimer = null;
  crystalRevealFrame = null;
  crystalRevealPath = [];
  crystalVisibleCount = 0;
  crystalRevealing = false;
  crystalRevealIncomplete = false;
  crystalRevealStartedAt = null;
  crystalRevealStepDuration = 0;
  crystalRevealStepProgress = 0;
  crystalRevealOpacity = 0;
  crystalRevealPhase = "idle";
}

function clearFishingCatchAnimation() {
  if (fishingCatchFrame !== null) cancelAnimationFrame(fishingCatchFrame);
  fishingCatchFrame = null;
  fishingCatchAnimating = false;
  fishingCatchProgress = 0;
  fishingCatchStartedAt = null;
  activeFishingCatchTarget = null;
  mazeEl.setAttribute("aria-busy", "false");
}

function clearTornadoWallAnimation() {
  if (tornadoWallAnimationFrame !== null) cancelAnimationFrame(tornadoWallAnimationFrame);
  tornadoWallAnimation = null;
  tornadoWallAnimationFrame = null;
}

function clearHingedWallAnimation() {
  if (hingedWallAnimationFrame !== null) cancelAnimationFrame(hingedWallAnimationFrame);
  hingedWallAnimation = null;
  hingedWallAnimationFrame = null;
  for (const wall of hingedWalls) wall.moving = false;
  mazeEl.setAttribute("aria-busy", "false");
}

function clearHammerWallAnimation() {
  if (hammerWallAnimationFrame !== null) cancelAnimationFrame(hammerWallAnimationFrame);
  hammerWallAnimation = null;
  hammerWallAnimationFrame = null;
  mazeEl.setAttribute("aria-busy", "false");
}

function clearRocketFlightAnimation() {
  if (rocketFlightAnimationFrame !== null) {
    cancelAnimationFrame(rocketFlightAnimationFrame);
  }
  rocketFlightAnimation = null;
  rocketFlightAnimationFrame = null;
  mazeEl.setAttribute("aria-busy", "false");
}

function clearCheeseEatingAnimation() {
  if (cheeseEatingFrame !== null) cancelAnimationFrame(cheeseEatingFrame);
  cheeseEatingFrame = null;
  cheeseEatingAnimating = false;
  cheeseEatingProgress = 0;
  cheeseEatingStartedAt = null;
  cheeseEaten = false;
  cheeseEatingTarget = null;
}

function clearMouseDefeatAnimation() {
  if (mouseDefeatFrame !== null) cancelAnimationFrame(mouseDefeatFrame);
  mouseDefeatFrame = null;
  mouseDefeatAnimating = false;
  mouseDefeatProgress = 0;
  mouseDefeatStartedAt = null;
  mouseAsleep = false;
  mazeEl.setAttribute("aria-busy", "false");
}

function clearPowerTransformation() {
  if (powerTransformFrame !== null) cancelAnimationFrame(powerTransformFrame);
  powerTransform = null;
  powerTransformFrame = null;
  mazeEl.setAttribute("aria-busy", "false");
}

function finishPowerTransformation() {
  if (!powerTransform) return;
  const transformation = powerTransform;
  powerTransform = null;
  powerTransformFrame = null;
  mazeEl.setAttribute("aria-busy", "false");

  if (transformation.direction === "out") clearPowerTargetingState();
  transformation.onComplete?.();
  updatePowerUI();
  requestMazeDraw();
}

function animatePowerTransformation(timestamp) {
  if (!powerTransform) return;
  if (powerTransform.startedAt === null) powerTransform.startedAt = timestamp;
  powerTransform.progress = clamp(
    (timestamp - powerTransform.startedAt) / POWER_TRANSFORM_DURATION_MS,
    0,
    1,
  );
  drawMaze();

  if (powerTransform.progress >= 1) {
    finishPowerTransformation();
    return;
  }

  powerTransformFrame = requestAnimationFrame(animatePowerTransformation);
}

function startPowerTransformation(powerKey, direction, onComplete) {
  clearPowerTransformation();
  powerTransform = {
    powerKey,
    direction,
    progress: 0,
    startedAt: null,
    onComplete,
  };
  setMovementControlsEnabled(false);
  mazeEl.setAttribute("aria-busy", "true");
  updatePowerUI();
  requestMazeDraw();

  if (!canAnimateMouseMotion()) {
    powerTransform.progress = 1;
    finishPowerTransformation();
    return;
  }

  powerTransformFrame = requestAnimationFrame(animatePowerTransformation);
}

function beginPowerSelection(powerKey, readyMessage) {
  const config = POWER_CONFIGS[powerKey];
  setMessage(`${config.name} is transforming...`);
  startPowerTransformation(powerKey, "in", () => {
    setMessage(readyMessage);
  });
}

function currentCrystalPath() {
  return currentObjectiveRoute()?.path ?? [];
}

function activateCrystalPower() {
  if (
    gameOver ||
    campaignComplete ||
    crystalRevealing ||
    fishingCatchAnimating ||
    rocketFlightAnimation ||
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
  beginPowerSelection("crystal", "Tap the glowing crystal ball to reveal the route.");
}

function chooseSafeTornadoCandidate() {
  const config = LEVEL_CONFIGS[level - 1];
  const remaining = remainingCheeseTargets();
  if (!config || !remaining.length) return null;
  const variantIndices = shuffledVariantIndices().filter(
    (variantIndex) => variantIndex !== activeVariantIndex,
  );

  for (const variantIndex of variantIndices) {
    const variant = buildLevelVariant(config, variantIndex);
    const route = variant.hingedWalls?.length
      ? (() => {
          const solution = solveHingedPuzzle(
            variant.grid,
            mouse,
            variant.hingedWalls,
            remaining,
            80,
          );
          return solution ? { path: solution.path } : null;
        })()
      : rockPositions.length
      ? (() => {
          const solution = solveRockPuzzle(
            variant.grid,
            mouse,
            rockPositions,
            remaining,
            80,
          );
          return solution ? { path: solution.path } : null;
        })()
      : bestCheeseRoute(variant.grid, mouse, remaining);
    if (route?.path.length && route.path.length - 1 <= movesLeft) {
      return {
        grid: variant.grid,
        pathFromMouse: route.path,
        variantIndex,
        hingedWalls: variant.hingedWalls ?? [],
      };
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
    rocketFlightAnimation ||
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
  beginPowerSelection("tornado", "Tap the glowing tornado to reshape the maze.");
}

function activateFishingPower() {
  if (
    gameOver ||
    campaignComplete ||
    crystalRevealing ||
    fishingCatchAnimating ||
    rocketFlightAnimation ||
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
  beginPowerSelection("fishing", "The cheese is in range. Tap it to reel it in.");
}

function activateHammerPower() {
  if (
    gameOver ||
    campaignComplete ||
    crystalRevealing ||
    fishingCatchAnimating ||
    rocketFlightAnimation ||
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
  beginPowerSelection("hammer", "Choose one of the glowing walls.");
}

function activateRocketPower() {
  if (
    gameOver ||
    campaignComplete ||
    crystalRevealing ||
    fishingCatchAnimating ||
    rocketFlightAnimation ||
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
  beginPowerSelection("rocket", "Choose a glowing landing square.");
}

function cancelActivePower(message) {
  const activePowerKey = getActivePowerKey();
  if (!activePowerKey || powerTransform) return;
  powerPointerStart = null;
  setMessage(`${POWER_CONFIGS[activePowerKey].name} is changing back...`);
  startPowerTransformation(activePowerKey, "out", () => {
    setMovementControlsEnabled(true);
    setMessage(message);
  });
}

function shuffle(items, rng) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function startForVariant(config, variantIndex) {
  return {
    ...START_CORNERS[(config.startOffset + variantIndex) % START_CORNERS.length],
  };
}

function initialFacingForStart(start) {
  return start.col === 0 ? "right" : "left";
}

function carveMaze(grid, rng, start) {
  const stack = [grid[start.row][start.col]];
  grid[start.row][start.col].visited = true;

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

function carveKruskalMaze(grid, rng) {
  const cellCount = ROWS * COLS;
  const parents = Array.from({ length: cellCount }, (_, index) => index);
  const ranks = Array(cellCount).fill(0);
  const edges = [];

  const find = (index) => {
    let root = index;
    while (parents[root] !== root) root = parents[root];
    while (parents[index] !== index) {
      const next = parents[index];
      parents[index] = root;
      index = next;
    }
    return root;
  };

  const union = (first, second) => {
    const firstRoot = find(first);
    const secondRoot = find(second);
    if (firstRoot === secondRoot) return false;
    if (ranks[firstRoot] < ranks[secondRoot]) parents[firstRoot] = secondRoot;
    else if (ranks[firstRoot] > ranks[secondRoot]) parents[secondRoot] = firstRoot;
    else {
      parents[secondRoot] = firstRoot;
      ranks[firstRoot] += 1;
    }
    return true;
  };

  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      if (col + 1 < COLS) edges.push({ row, col, dir: DIRS[1] });
      if (row + 1 < ROWS) edges.push({ row, col, dir: DIRS[2] });
    }
  }

  for (const edge of shuffle(edges, rng)) {
    const nextRow = edge.row + edge.dir.row;
    const nextCol = edge.col + edge.dir.col;
    const currentIndex = edge.row * COLS + edge.col;
    const nextIndex = nextRow * COLS + nextCol;
    if (!union(currentIndex, nextIndex)) continue;
    grid[edge.row][edge.col].walls[edge.dir.wall] = false;
    grid[nextRow][nextCol].walls[edge.dir.opposite] = false;
  }

  for (const row of grid) {
    for (const cell of row) cell.visited = true;
  }
}

function addLoops(grid, count, rng) {
  let opened = 0;
  let attempts = 0;
  while (opened < count && attempts < 220) {
    attempts += 1;
    const row = Math.floor(rng() * ROWS);
    const col = Math.floor(rng() * COLS);
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
  return row >= 0 && row < ROWS && col >= 0 && col < COLS;
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

function findShortestPath(grid, target, blockedEdges = new Set(), start = levelStart) {
  return findShortestPathFrom(grid, start, target, blockedEdges);
}

function joinPaths(firstPath, secondPath) {
  if (!firstPath.length || !secondPath.length) return [];
  return [...firstPath, ...secondPath.slice(1)];
}

function bestCheeseRoute(grid, start, targets) {
  if (!targets.length) return null;
  if (targets.length === 1) {
    const path = findShortestPathFrom(grid, start, targets[0]);
    return path.length ? { path, order: [{ ...targets[0] }] } : null;
  }

  let best = null;
  for (let firstIndex = 0; firstIndex < targets.length; firstIndex += 1) {
    const first = targets[firstIndex];
    const remaining = targets.filter((_, index) => index !== firstIndex);
    const firstPath = findShortestPathFrom(grid, start, first);
    if (!firstPath.length) continue;
    const rest = bestCheeseRoute(grid, first, remaining);
    if (!rest) continue;
    const path = joinPaths(firstPath, rest.path);
    if (!best || path.length < best.path.length) {
      best = { path, order: [{ ...first }, ...rest.order] };
    }
  }
  return best;
}

function remainingCheeseTargets() {
  const targets =
    exit && !cheeseTargets.some((target) => keyOf(target) === keyOf(exit))
      ? [exit]
      : cheeseTargets;
  return targets.filter((target) => !collectedCheeseKeys.has(keyOf(target)));
}

function rockAt(cell, positions = rockPositions) {
  if (!cell) return null;
  return (
    positions.find((rock) => rock.row === cell.row && rock.col === cell.col) ?? null
  );
}

function isCheeseVisible(target, positions = rockPositions) {
  return !hiddenCheeseKeys.has(keyOf(target)) || !rockAt(target, positions);
}

function cheeseAt(cell) {
  if (!cell) return null;
  return (
    remainingCheeseTargets().find(
      (target) =>
        target.row === cell.row &&
        target.col === cell.col &&
        isCheeseVisible(target),
    ) ?? null
  );
}

function solveRockPuzzle(grid, start, rocks, targets, maxDistance = 64) {
  const targetIndexByKey = new Map(targets.map((target, index) => [keyOf(target), index]));
  const allCollectedMask = (1 << targets.length) - 1;
  const normalizedRocks = rocks.map((rock) => ({ row: rock.row, col: rock.col }));
  const initialMask = targetIndexByKey.has(keyOf(start)) && !rockAt(start, normalizedRocks)
    ? 1 << targetIndexByKey.get(keyOf(start))
    : 0;
  const queue = [
    {
      mouse: { ...start },
      rocks: normalizedRocks,
      collectedMask: initialMask,
      path: [{ ...start }],
      actions: [],
      pushes: 0,
    },
  ];
  const stateKey = (state) => {
    const rockKeys = state.rocks.map(keyOf).sort().join(";");
    return `${keyOf(state.mouse)}|${rockKeys}|${state.collectedMask}`;
  };
  const seen = new Set([stateKey(queue[0])]);

  for (let queueIndex = 0; queueIndex < queue.length; queueIndex += 1) {
    const state = queue[queueIndex];
    if (state.collectedMask === allCollectedMask) return state;
    if (state.actions.length >= maxDistance) continue;

    for (const dir of DIRS) {
      const currentCell = grid[state.mouse.row][state.mouse.col];
      if (currentCell.walls[dir.wall]) continue;
      const next = { row: state.mouse.row + dir.row, col: state.mouse.col + dir.col };
      if (!isInside(next.row, next.col)) continue;

      const nextRocks = state.rocks.map((rock) => ({ ...rock }));
      const pushedRockIndex = nextRocks.findIndex(
        (rock) => rock.row === next.row && rock.col === next.col,
      );
      let rockFrom = null;
      let rockTo = null;
      if (pushedRockIndex >= 0) {
        const rockCell = grid[next.row][next.col];
        rockTo = { row: next.row + dir.row, col: next.col + dir.col };
        if (
          !isInside(rockTo.row, rockTo.col) ||
          rockCell.walls[dir.wall] ||
          rockAt(rockTo, nextRocks)
        ) {
          continue;
        }
        rockFrom = { ...nextRocks[pushedRockIndex] };
        nextRocks[pushedRockIndex] = { ...rockTo };
      }

      let collectedMask = state.collectedMask;
      const targetIndex = targetIndexByKey.get(keyOf(next));
      if (targetIndex !== undefined && !rockAt(next, nextRocks)) {
        collectedMask |= 1 << targetIndex;
      }
      const action = {
        direction: dir.key,
        mouse: { ...next },
        rockFrom,
        rockTo,
      };
      const nextState = {
        mouse: next,
        rocks: nextRocks,
        collectedMask,
        path: [...state.path, { ...next }],
        actions: [...state.actions, action],
        pushes: state.pushes + (pushedRockIndex >= 0 ? 1 : 0),
      };
      const key = stateKey(nextState);
      if (seen.has(key)) continue;
      seen.add(key);
      queue.push(nextState);
    }
  }

  return null;
}

function currentObjectiveRoute(grid = maze, start = mouse, rocks = rockPositions) {
  const targets = remainingCheeseTargets();
  if (!targets.length) return null;
  const pendingHingedWalls = hingedWalls.filter(
    (wall) => !wall.activated && !wall.destroyed && !wall.moving,
  );
  if (pendingHingedWalls.length) {
    const solution = solveHingedPuzzle(grid, start, pendingHingedWalls, targets, 80);
    return solution ? { path: solution.path, order: targets, solution } : null;
  }
  if (!rocks.length) return bestCheeseRoute(grid, start, targets);
  const solution = solveRockPuzzle(grid, start, rocks, targets, 80);
  return solution ? { path: solution.path, order: targets, solution } : null;
}

function currentCheeseRoute(grid = maze, start = mouse) {
  return bestCheeseRoute(grid, start, remainingCheeseTargets());
}

function syncActiveExit() {
  const route = currentCheeseRoute();
  exit = route?.order[0] ? { ...route.order[0] } : null;
  return route;
}

function keyOf(cell) {
  return `${cell.row},${cell.col}`;
}

function edgeKey(a, b) {
  return [keyOf(a), keyOf(b)].sort().join("|");
}

function cloneMazeGrid(grid) {
  return grid.map((row) =>
    row.map((cell) => ({
      ...cell,
      walls: { ...cell.walls },
    })),
  );
}

function segmentKey(segment) {
  return `${segment.orientation}:${segment.line}:${segment.start}`;
}

function edgeSegmentBetween(first, second) {
  if (first.row !== second.row) {
    return {
      orientation: "horizontal",
      line: Math.max(first.row, second.row),
      start: first.col,
      length: 1,
    };
  }
  return {
    orientation: "vertical",
    line: Math.max(first.col, second.col),
    start: first.row,
    length: 1,
  };
}

function segmentHasWall(grid, segment) {
  if (segment.orientation === "horizontal") {
    return Boolean(grid[segment.line]?.[segment.start]?.walls.top);
  }
  return Boolean(grid[segment.start]?.[segment.line]?.walls.left);
}

function setSegmentWall(grid, segment, present) {
  if (segment.orientation === "horizontal") {
    const lower = grid[segment.line]?.[segment.start];
    const upper = grid[segment.line - 1]?.[segment.start];
    if (!lower || !upper) return false;
    lower.walls.top = present;
    upper.walls.bottom = present;
    return true;
  }

  const right = grid[segment.start]?.[segment.line];
  const left = grid[segment.start]?.[segment.line - 1];
  if (!right || !left) return false;
  right.walls.left = present;
  left.walls.right = present;
  return true;
}

function segmentEndpoints(segment) {
  if (segment.orientation === "horizontal") {
    return [
      { row: segment.line, col: segment.start },
      { row: segment.line, col: segment.start + 1 },
    ];
  }
  return [
    { row: segment.start, col: segment.line },
    { row: segment.start + 1, col: segment.line },
  ];
}

function cellsSeparatedBySegment(segment) {
  if (segment.orientation === "horizontal") {
    return [
      { row: segment.line - 1, col: segment.start },
      { row: segment.line, col: segment.start },
    ];
  }
  return [
    { row: segment.start, col: segment.line - 1 },
    { row: segment.start, col: segment.line },
  ];
}

function perpendicularHingeSources(destination) {
  const [first, second] = segmentEndpoints(destination);
  const candidates = [];
  for (const hinge of [first, second]) {
    if (destination.orientation === "horizontal") {
      for (const start of [hinge.row - 1, hinge.row]) {
        if (hinge.col <= 0 || hinge.col >= COLS || start < 0 || start >= ROWS) continue;
        candidates.push({
          source: { orientation: "vertical", line: hinge.col, start, length: 1 },
          hinge: { ...hinge },
        });
      }
    } else {
      for (const start of [hinge.col - 1, hinge.col]) {
        if (hinge.row <= 0 || hinge.row >= ROWS || start < 0 || start >= COLS) continue;
        candidates.push({
          source: { orientation: "horizontal", line: hinge.row, start, length: 1 },
          hinge: { ...hinge },
        });
      }
    }
  }
  return candidates;
}

function otherSegmentEndpoint(segment, hinge) {
  return segmentEndpoints(segment).find(
    (point) => point.row !== hinge.row || point.col !== hinge.col,
  );
}

function pointToGridSegmentDistance(point, start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;
  if (!lengthSquared) return Math.hypot(point.x - start.x, point.y - start.y);
  const amount = clamp(
    ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared,
    0,
    1,
  );
  return Math.hypot(
    point.x - (start.x + dx * amount),
    point.y - (start.y + dy * amount),
  );
}

function hingedSweepClearsCell(source, destination, hinge, cell) {
  const sourceOther = otherSegmentEndpoint(source, hinge);
  const destinationOther = otherSegmentEndpoint(destination, hinge);
  if (!sourceOther || !destinationOther) return false;
  const hingePoint = { x: hinge.col, y: hinge.row };
  const cellCenter = { x: cell.col + 0.5, y: cell.row + 0.5 };
  const sourceAngle = Math.atan2(
    sourceOther.row - hinge.row,
    sourceOther.col - hinge.col,
  );
  const destinationAngle = Math.atan2(
    destinationOther.row - hinge.row,
    destinationOther.col - hinge.col,
  );
  let angleDelta = destinationAngle - sourceAngle;
  while (angleDelta > Math.PI) angleDelta -= Math.PI * 2;
  while (angleDelta < -Math.PI) angleDelta += Math.PI * 2;

  for (let step = 0; step <= 20; step += 1) {
    const angle = sourceAngle + angleDelta * (step / 20);
    const end = {
      x: hingePoint.x + Math.cos(angle),
      y: hingePoint.y + Math.sin(angle),
    };
    if (pointToGridSegmentDistance(cellCenter, hingePoint, end) < 0.46) return false;
  }
  return true;
}

function wallPresentForHingedState(grid, segment, walls, activatedMask) {
  const key = segmentKey(segment);
  for (let index = 0; index < walls.length; index += 1) {
    if ((activatedMask & (1 << index)) === 0) continue;
    if (segmentKey(walls[index].source) === key) return false;
    if (segmentKey(walls[index].destination) === key) return true;
  }
  return segmentHasWall(grid, segment);
}

function solveHingedPuzzle(grid, start, walls, targets, maxMoves = 80) {
  const targetIndexByKey = new Map(targets.map((target, index) => [keyOf(target), index]));
  const allCollectedMask = (1 << targets.length) - 1;
  const initialCollectedMask = targetIndexByKey.has(keyOf(start))
    ? 1 << targetIndexByKey.get(keyOf(start))
    : 0;
  const queue = [
    {
      mouse: { ...start },
      activatedMask: 0,
      collectedMask: initialCollectedMask,
      moves: 0,
      path: [{ ...start }],
      actions: [],
    },
  ];
  const bestCosts = new Map([[`${keyOf(start)}|0|${initialCollectedMask}`, 0]]);

  while (queue.length) {
    const state = queue.shift();
    if (state.collectedMask === allCollectedMask) {
      return {
        ...state,
        triggers: state.actions.reduce(
          (total, action) => total + (action.hingedWallIds?.length ?? 0),
          0,
        ),
      };
    }
    if (state.moves >= maxMoves) continue;

    for (const dir of DIRS) {
      const next = { row: state.mouse.row + dir.row, col: state.mouse.col + dir.col };
      if (!isInside(next.row, next.col)) continue;
      const segment = edgeSegmentBetween(state.mouse, next);
      if (wallPresentForHingedState(grid, segment, walls, state.activatedMask)) continue;
      let activatedMask = state.activatedMask;
      const hingedWallIds = [];
      walls.forEach((wall, index) => {
        if (
          (activatedMask & (1 << index)) === 0 &&
          keyOf(wall.triggerFrom) === keyOf(next)
        ) {
          activatedMask |= 1 << index;
          hingedWallIds.push(wall.id);
        }
      });
      let collectedMask = state.collectedMask;
      const targetIndex = targetIndexByKey.get(keyOf(next));
      if (targetIndex !== undefined) collectedMask |= 1 << targetIndex;
      const moves = state.moves + 1;
      const key = `${keyOf(next)}|${activatedMask}|${collectedMask}`;
      if ((bestCosts.get(key) ?? Number.POSITIVE_INFINITY) <= moves) continue;
      bestCosts.set(key, moves);
      queue.push({
        mouse: next,
        activatedMask,
        collectedMask,
        moves,
        path: [...state.path, { ...next }],
        actions: [
          ...state.actions,
          { direction: dir.key, mouse: { ...next }, hingedWallIds },
        ],
      });
    }
  }

  return null;
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

function countRoutesToExit(grid, target, limit = 3, start = levelStart) {
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

  walk(start);
  return routes;
}

function findMeaningfulAlternative(grid, target, path, moveLimit) {
  const shortestDistance = path.length - 1;
  const shortestEdges = new Set();
  const start = path[0] ?? levelStart;

  for (let i = 1; i < path.length; i += 1) {
    shortestEdges.add(edgeKey(path[i - 1], path[i]));
  }

  for (const blockedEdge of shortestEdges) {
    const alternate = findShortestPath(
      grid,
      target,
      new Set([blockedEdge]),
      start,
    );
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

function moveBudgetForVariant(path, alternatePath) {
  const shortestDistance = Math.max(0, path.length - 1);
  const alternateDistance = Math.max(shortestDistance, alternatePath.length - 1);
  const recoveryMargin = clamp(Math.ceil(shortestDistance * 0.3), 4, 7);
  return Math.max(shortestDistance + recoveryMargin, alternateDistance);
}

function analyzeDeceptiveBranches(grid, path, target) {
  const pathKeys = new Set(path.map(keyOf));
  let solutionJunctions = 0;
  let falseBranches = 0;
  let deepFalseBranches = 0;
  let falseBranchCells = 0;
  let maxFalseBranchDepth = 0;
  let earlyDeepBranches = 0;
  let goalFacingBranches = 0;
  let misleadingBranches = 0;
  let misleadingBranchCells = 0;
  let nearGoalTraps = 0;

  for (let pathIndex = 0; pathIndex < path.length; pathIndex += 1) {
    const pathCell = path[pathIndex];
    const branchEntries = neighbors(grid, grid[pathCell.row][pathCell.col]).filter(
      (neighbor) => !pathKeys.has(keyOf(neighbor)),
    );
    if (branchEntries.length) solutionJunctions += 1;

    for (const entry of branchEntries) {
      const queue = [{ row: entry.row, col: entry.col, depth: 1 }];
      const seen = new Set([keyOf(pathCell), keyOf(entry)]);
      let branchCells = 0;
      let branchDepth = 0;
      let branchGoalDistance = Number.POSITIVE_INFINITY;

      while (queue.length) {
        const current = queue.shift();
        branchCells += 1;
        branchDepth = Math.max(branchDepth, current.depth);
        branchGoalDistance = Math.min(
          branchGoalDistance,
          Math.abs(current.row - target.row) + Math.abs(current.col - target.col),
        );
        for (const next of neighbors(grid, grid[current.row][current.col])) {
          const nextKey = keyOf(next);
          if (pathKeys.has(nextKey) || seen.has(nextKey)) continue;
          seen.add(nextKey);
          queue.push({ row: next.row, col: next.col, depth: current.depth + 1 });
        }
      }

      falseBranches += 1;
      falseBranchCells += branchCells;
      maxFalseBranchDepth = Math.max(maxFalseBranchDepth, branchDepth);
      if (branchDepth >= 4) {
        deepFalseBranches += 1;
        if (pathIndex < path.length * 0.65) earlyDeepBranches += 1;
      }

      const pathDistance = Math.abs(pathCell.row - target.row) + Math.abs(pathCell.col - target.col);
      const entryDistance = Math.abs(entry.row - target.row) + Math.abs(entry.col - target.col);
      if (branchDepth >= 3 && entryDistance < pathDistance) goalFacingBranches += 1;

      const correctNext = path[pathIndex + 1];
      const correctDistance = correctNext
        ? Math.abs(correctNext.row - target.row) + Math.abs(correctNext.col - target.col)
        : -1;
      if (branchDepth >= 2 && correctNext && entryDistance <= correctDistance) {
        misleadingBranches += 1;
        misleadingBranchCells += branchCells;
      }
      if (branchDepth >= 3 && branchGoalDistance <= 1) nearGoalTraps += 1;
    }
  }

  const greedyMoves = simulateGreedyMazeSolver(grid, path[0], target);
  const greedyPenalty = greedyMoves - (path.length - 1);
  const startGoalManhattan =
    Math.abs(path[0].row - target.row) + Math.abs(path[0].col - target.col);

  return {
    solutionJunctions,
    falseBranches,
    deepFalseBranches,
    falseBranchCells,
    maxFalseBranchDepth,
    earlyDeepBranches,
    goalFacingBranches,
    misleadingBranches,
    misleadingBranchCells,
    nearGoalTraps,
    greedyMoves,
    greedyPenalty,
    startGoalManhattan,
  };
}

function simulateGreedyMazeSolver(grid, start, target) {
  const visited = new Set([keyOf(start)]);
  const stack = [{ cell: { ...start }, options: null }];
  let moves = 0;

  while (stack.length) {
    const frame = stack[stack.length - 1];
    if (frame.cell.row === target.row && frame.cell.col === target.col) return moves;

    if (frame.options === null) {
      frame.options = neighbors(grid, grid[frame.cell.row][frame.cell.col])
        .filter((neighbor) => !visited.has(keyOf(neighbor)))
        .sort((first, second) => {
          const firstDistance = Math.abs(first.row - target.row) + Math.abs(first.col - target.col);
          const secondDistance = Math.abs(second.row - target.row) + Math.abs(second.col - target.col);
          if (firstDistance !== secondDistance) return firstDistance - secondDistance;
          return keyOf(first).localeCompare(keyOf(second));
        });
    }

    const next = frame.options.shift();
    if (next) {
      visited.add(keyOf(next));
      stack.push({ cell: { row: next.row, col: next.col }, options: null });
      moves += 1;
      continue;
    }

    stack.pop();
    if (stack.length) moves += 1;
  }

  return Number.POSITIVE_INFINITY;
}

function extremeDifficultyScore(profile) {
  return (
    profile.solutionJunctions * 16 +
    profile.falseBranches * 10 +
    profile.deepFalseBranches * 24 +
    profile.maxFalseBranchDepth * 12 +
    profile.goalFacingBranches * 30 +
    profile.misleadingBranches * 55 +
    profile.misleadingBranchCells * 4 +
    profile.nearGoalTraps * 90 +
    Math.min(profile.greedyPenalty, 80) * 5 +
    Math.max(0, 12 - profile.startGoalManhattan) * 18
  );
}

function passesExtremeDifficulty(config, profile) {
  if (!config.minSolutionJunctions) return true;
  return (
    profile.solutionJunctions >= config.minSolutionJunctions &&
    profile.falseBranches >= config.minFalseBranches &&
    profile.deepFalseBranches >= config.minDeepFalseBranches &&
    profile.falseBranchCells >= config.minFalseBranchCells &&
    profile.maxFalseBranchDepth >= config.minFalseBranchDepth &&
    profile.earlyDeepBranches >= config.minEarlyDeepBranches &&
    profile.goalFacingBranches >= config.minGoalFacingBranches &&
    profile.misleadingBranches >= config.minMisleadingBranches &&
    profile.misleadingBranchCells >= config.minMisleadingBranchCells &&
    profile.nearGoalTraps >= config.minNearGoalTraps &&
    profile.greedyPenalty >= config.minGreedyPenalty &&
    profile.startGoalManhattan <= config.maxGoalManhattan
  );
}

function chooseExitAndValidate(grid, config, variantIndex, start, rng) {
  const singleRoute = config.singleRoute === true;
  let hardestResult = null;
  const exits = shuffle(
    Array.from({ length: ROWS * COLS }, (_, index) => ({
      row: Math.floor(index / COLS),
      col: index % COLS,
    })).filter(
      (candidate) =>
        (candidate.row !== start.row || candidate.col !== start.col) &&
        (candidate.row * 3 + candidate.col * 2) % VARIANTS_PER_LEVEL === variantIndex,
    ),
    rng,
  );

  for (const candidate of exits) {
    const path = findShortestPath(grid, candidate, new Set(), start);
    if (!path.length) continue;

    const distance = path.length - 1;
    const turns = countTurns(path);
    const deadEnds = countDeadEnds(grid);
    const routes = countRoutesToExit(grid, candidate, 3, start);
    const alternatePath = singleRoute
      ? null
      : findMeaningfulAlternative(grid, candidate, path, config.moveLimit);
    const difficultyProfile = config.minSolutionJunctions
      ? analyzeDeceptiveBranches(grid, path, candidate)
      : null;
    const routeRulesPass = singleRoute
      ? routes === 1
      : routes >= 2 && Boolean(alternatePath);

    if (
      distance >= config.minPath &&
      distance <= config.maxPath &&
      turns >= (config.minTurns ?? 4) &&
      deadEnds >= (config.minDeadEnds ?? 5) &&
      deadEnds <= (config.maxDeadEnds ?? 38) &&
      routeRulesPass &&
      passesExtremeDifficulty(config, difficultyProfile)
    ) {
      const result = {
        exit: candidate,
        path,
        alternatePath,
        difficultyProfile,
        moveLimit: singleRoute
          ? distance + (config.moveMargin ?? 1)
          : moveBudgetForVariant(path, alternatePath),
      };
      if (!singleRoute) return result;
      const score = extremeDifficultyScore(difficultyProfile);
      if (!hardestResult || score > hardestResult.difficultyScore) {
        hardestResult = { ...result, difficultyScore: score };
      }
    }
  }

  return hardestResult;
}

function chooseCheesePairAndValidate(grid, config, variantIndex, start, rng) {
  const candidates = shuffle(
    Array.from({ length: ROWS * COLS }, (_, index) => ({
      row: Math.floor(index / COLS),
      col: index % COLS,
    })).filter(
      (candidate) =>
        keyOf(candidate) !== keyOf(start) &&
        (candidate.row * 3 + candidate.col * 2) % VARIANTS_PER_LEVEL !== variantIndex,
    ),
    rng,
  );
  const pathsFromStart = new Map(
    candidates.map((candidate) => [
      keyOf(candidate),
      findShortestPathFrom(grid, start, candidate),
    ]),
  );

  for (let firstIndex = 0; firstIndex < candidates.length; firstIndex += 1) {
    const first = candidates[firstIndex];
    const firstPath = pathsFromStart.get(keyOf(first));
    if (!firstPath?.length) continue;

    for (let secondIndex = firstIndex + 1; secondIndex < candidates.length; secondIndex += 1) {
      const second = candidates[secondIndex];
      const secondPath = pathsFromStart.get(keyOf(second));
      if (!secondPath?.length) continue;
      const betweenPath = findShortestPathFrom(grid, first, second);
      if (!betweenPath.length) continue;

      const firstDistance = firstPath.length - 1;
      const secondDistance = secondPath.length - 1;
      const betweenDistance = betweenPath.length - 1;
      const firstThenSecond = firstDistance + betweenDistance;
      const secondThenFirst = secondDistance + betweenDistance;
      const optimalDistance = Math.min(firstThenSecond, secondThenFirst);
      const orderPenalty = Math.abs(firstDistance - secondDistance);
      const separation =
        Math.abs(first.row - second.row) + Math.abs(first.col - second.col);
      if (
        optimalDistance < config.minPath ||
        optimalDistance > config.maxPath ||
        orderPenalty < config.minOrderPenalty ||
        orderPenalty > config.maxOrderPenalty ||
        betweenDistance < config.minCheeseDistance ||
        separation < 5
      ) {
        continue;
      }

      const optimalFirst = firstThenSecond <= secondThenFirst ? first : second;
      const optimalSecond = optimalFirst === first ? second : first;
      const pathToFirst = pathsFromStart.get(keyOf(optimalFirst));
      const pathToSecond = findShortestPathFrom(grid, optimalFirst, optimalSecond);
      const path = joinPaths(pathToFirst, pathToSecond);
      if (
        countTurns(path) < config.minTurns ||
        countDeadEnds(grid) < config.minDeadEnds
      ) {
        continue;
      }

      const alternateFirst = optimalSecond;
      const alternateSecond = optimalFirst;
      const alternatePath = joinPaths(
        pathsFromStart.get(keyOf(alternateFirst)),
        findShortestPathFrom(grid, alternateFirst, alternateSecond),
      );
      return {
        exit: { ...optimalFirst },
        exits: [{ ...optimalFirst }, { ...optimalSecond }],
        path,
        alternatePath,
        difficultyProfile: null,
        orderPenalty,
        moveLimit: optimalDistance + config.moveMargin,
      };
    }
  }

  return null;
}

function findPathAvoidingCells(grid, start, target, blockedCells) {
  const queue = [{ cell: { ...start }, path: [{ ...start }] }];
  const seen = new Set([keyOf(start)]);
  while (queue.length) {
    const current = queue.shift();
    if (keyOf(current.cell) === keyOf(target)) return current.path;
    for (const next of neighbors(grid, grid[current.cell.row][current.cell.col])) {
      const nextKey = keyOf(next);
      if (blockedCells.has(nextKey) || seen.has(nextKey)) continue;
      seen.add(nextKey);
      queue.push({
        cell: { row: next.row, col: next.col },
        path: [...current.path, { row: next.row, col: next.col }],
      });
    }
  }
  return [];
}

function rockResult(config, cheese, rocks, solution, hidden = false, alternatePath = null) {
  const distance = solution.path.length - 1;
  return {
    exit: { ...cheese },
    exits: [{ ...cheese }],
    rocks: rocks.map((rock, index) => ({ id: index, row: rock.row, col: rock.col })),
    hiddenCheeseKeys: hidden ? [keyOf(cheese)] : [],
    path: solution.path,
    alternatePath,
    difficultyProfile: null,
    rockSolution: solution,
    moveLimit: distance + config.moveMargin,
  };
}

function chooseRockPuzzleAndValidate(grid, config, variantIndex, start, rng) {
  if (countDeadEnds(grid) < config.minDeadEnds) return null;
  const candidates = shuffle(
    Array.from({ length: ROWS * COLS }, (_, index) => ({
      row: Math.floor(index / COLS),
      col: index % COLS,
    })).filter(
      (candidate) =>
        keyOf(candidate) !== keyOf(start) &&
        (candidate.row * 3 + candidate.col * 2) % VARIANTS_PER_LEVEL === variantIndex,
    ),
    rng,
  );

  if (config.rockMode === "blocker") {
    for (const cheese of candidates) {
      const directPath = findShortestPathFrom(grid, start, cheese);
      if (directPath.length < 9) continue;
      for (const rockCell of shuffle(directPath.slice(3, -3), rng)) {
        const rocks = [{ row: rockCell.row, col: rockCell.col }];
        const solution = solveRockPuzzle(grid, start, rocks, [cheese], config.maxPath);
        if (!solution || solution.pushes < 1) continue;
        const distance = solution.path.length - 1;
        const detour = findPathAvoidingCells(grid, start, cheese, new Set([keyOf(rockCell)]));
        if (
          distance < config.minPath ||
          distance > config.maxPath ||
          countTurns(solution.path) < config.minTurns ||
          (detour.length && detour.length - solution.path.length < config.minDetourPenalty)
        ) {
          continue;
        }
        return rockResult(config, cheese, rocks, solution, false, detour.length ? detour : null);
      }
    }
    return null;
  }

  for (const cheese of candidates) {
    const targetRock = { row: cheese.row, col: cheese.col };
    let rocks = [targetRock];
    let solution = solveRockPuzzle(grid, start, rocks, [cheese], config.maxPath);
    if (!solution || solution.pushes < 1) continue;

    if (config.rockMode === "search") {
      const solutionCells = new Set(solution.path.map(keyOf));
      const decoyCandidates = shuffle(
        Array.from({ length: ROWS * COLS }, (_, index) => ({
          row: Math.floor(index / COLS),
          col: index % COLS,
        })).filter((candidate) => {
          if (keyOf(candidate) === keyOf(start) || solutionCells.has(keyOf(candidate))) return false;
          return neighbors(grid, grid[candidate.row][candidate.col]).length >= 2;
        }),
        rng,
      );
      rocks = [targetRock, ...decoyCandidates.slice(0, config.rockCount - 1)];
      if (rocks.length !== config.rockCount) continue;
      solution = solveRockPuzzle(grid, start, rocks, [cheese], config.maxPath);
      if (!solution || solution.pushes < 1) continue;
    }

    const distance = solution.path.length - 1;
    if (
      distance < config.minPath ||
      distance > config.maxPath ||
      countTurns(solution.path) < config.minTurns
    ) {
      continue;
    }
    return rockResult(config, cheese, rocks, solution, true);
  }

  return null;
}

function chooseHingedWallPuzzleAndValidate(grid, config, variantIndex, start, rng) {
  if (countDeadEnds(grid) < config.minDeadEnds) return null;
  const candidates = shuffle(
    Array.from({ length: ROWS * COLS }, (_, index) => ({
      row: Math.floor(index / COLS),
      col: index % COLS,
    })).filter(
      (candidate) =>
        keyOf(candidate) !== keyOf(start) &&
        (candidate.row * 3 + candidate.col * 2) % VARIANTS_PER_LEVEL === variantIndex,
    ),
    rng,
  );

  for (const cheese of candidates) {
    const initialPath = findShortestPathFrom(grid, start, cheese);
    if (initialPath.length < 8) continue;

    const transformedGrid = cloneMazeGrid(grid);
    const hinged = [];
    const usedSegments = new Set();
    const usedTriggerCells = new Set();
    const combinedPath = [{ ...start }];
    let currentStart = { ...start };
    let totalDetourPenalty = 0;
    let failed = false;

    for (let wallIndex = 0; wallIndex < config.hingedWallCount; wallIndex += 1) {
      const route = findShortestPathFrom(transformedGrid, currentStart, cheese);
      if (route.length < 6) {
        failed = true;
        break;
      }

      const edgeIndices = shuffle(
        Array.from({ length: Math.max(0, route.length - 4) }, (_, index) => index + 2),
        rng,
      );
      let selected = null;

      for (const edgeIndex of edgeIndices) {
        const triggerFrom = route[edgeIndex];
        const triggerTo = route[edgeIndex + 1];
        const destination = edgeSegmentBetween(triggerFrom, triggerTo);
        if (
          usedSegments.has(segmentKey(destination)) ||
          usedTriggerCells.has(keyOf(triggerFrom))
        ) {
          continue;
        }

        const sources = shuffle(perpendicularHingeSources(destination), rng).filter(
          ({ source }) =>
            segmentHasWall(transformedGrid, source) &&
            !usedSegments.has(segmentKey(source)),
        );

        for (const { source, hinge } of sources) {
          if (!hingedSweepClearsCell(source, destination, hinge, triggerFrom)) continue;
          const nextGrid = cloneMazeGrid(transformedGrid);
          setSegmentWall(nextGrid, source, false);
          setSegmentWall(nextGrid, destination, true);
          const detour = findShortestPathFrom(nextGrid, triggerFrom, cheese);
          if (!detour.length) continue;
          const originalRemainingDistance = route.length - 1 - edgeIndex;
          const detourPenalty = detour.length - 1 - originalRemainingDistance;
          if (detourPenalty < config.minHingedDetour) continue;
          selected = {
            source,
            destination,
            hinge,
            triggerFrom: { ...triggerFrom },
            routePrefix: route.slice(0, edgeIndex + 1),
            nextGrid,
            detourPenalty,
          };
          break;
        }
        if (selected) break;
      }

      if (!selected) {
        failed = true;
        break;
      }

      combinedPath.push(...selected.routePrefix.slice(1).map((cell) => ({ ...cell })));
      hinged.push({
        id: wallIndex,
        source: { ...selected.source },
        destination: { ...selected.destination },
        hinge: { ...selected.hinge },
        triggerFrom: { ...selected.triggerFrom },
      });
      usedSegments.add(segmentKey(selected.source));
      usedSegments.add(segmentKey(selected.destination));
      usedTriggerCells.add(keyOf(selected.triggerFrom));
      totalDetourPenalty += selected.detourPenalty;
      currentStart = { ...selected.triggerFrom };
      for (let row = 0; row < ROWS; row += 1) {
        for (let col = 0; col < COLS; col += 1) {
          transformedGrid[row][col].walls = { ...selected.nextGrid[row][col].walls };
        }
      }
    }

    if (failed || hinged.length !== config.hingedWallCount) continue;
    const finalPath = findShortestPathFrom(transformedGrid, currentStart, cheese);
    if (!finalPath.length) continue;
    combinedPath.push(...finalPath.slice(1).map((cell) => ({ ...cell })));
    const distance = combinedPath.length - 1;
    if (
      distance < config.minPath ||
      distance > config.maxPath ||
      countTurns(combinedPath) < config.minTurns
    ) {
      continue;
    }

    const solution = solveHingedPuzzle(grid, start, hinged, [cheese], config.maxPath + 8);
    if (!solution) continue;
    return {
      exit: { ...cheese },
      exits: [{ ...cheese }],
      hingedWalls: hinged,
      path: combinedPath,
      alternatePath: solution.path,
      difficultyProfile: null,
      hingedSolution: {
        path: combinedPath,
        triggers: hinged.length,
        detourPenalty: totalDetourPenalty,
      },
      moveLimit: distance + config.moveMargin,
    };
  }

  return null;
}

function buildLevelVariant(config, variantIndex) {
  const variantSeed = config.seed + variantIndex * VARIANT_SEED_GAP;
  const start = startForVariant(config, variantIndex);
  const fixedAttempt = config.variantAttempts?.[variantIndex];
  const attempts = Number.isInteger(fixedAttempt)
    ? [fixedAttempt]
    : Array.from({ length: 1400 }, (_, attempt) => attempt);

  for (const attempt of attempts) {
    const seed = variantSeed + attempt * 7919;
    const rng = createRng(seed);
    const grid = blankMaze();
    if (config.generator === "kruskal") carveKruskalMaze(grid, rng);
    else carveMaze(grid, rng, start);
    addLoops(grid, config.loops ?? 14, rng);

    const result = config.hingedWallCount
      ? chooseHingedWallPuzzleAndValidate(grid, config, variantIndex, start, rng)
      : config.rockMode
        ? chooseRockPuzzleAndValidate(grid, config, variantIndex, start, rng)
        : config.cheeseCount === 2
          ? chooseCheesePairAndValidate(grid, config, variantIndex, start, rng)
          : chooseExitAndValidate(grid, config, variantIndex, start, rng);
    if (result) return { grid, start, ...result, seed, attempt };
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
  loadLevelVariant(config, variantIndex, "full");
}

function retryLevel() {
  const config = LEVEL_CONFIGS[level - 1];
  const variantIndex = levelVariantStates[level - 1]?.current;
  if (!config || variantIndex < 0) {
    generateLevel();
    return;
  }

  loadLevelVariant(config, variantIndex, "retry");
}

function loadLevelVariant(config, variantIndex, introMode = "full") {
  const variant = buildLevelVariant(config, variantIndex);
  activeVariantIndex = variantIndex;
  maze = variant.grid;
  cheeseTargets = (variant.exits ?? [variant.exit]).map((target) => ({ ...target }));
  collectedCheeseKeys = new Set();
  initialRocks = (variant.rocks ?? []).map((rock) => ({ ...rock }));
  rockPositions = initialRocks.map((rock) => ({ ...rock }));
  hiddenCheeseKeys = new Set(variant.hiddenCheeseKeys ?? []);
  initialHingedWalls = (variant.hingedWalls ?? []).map((wall) => ({
    ...wall,
    source: { ...wall.source },
    destination: { ...wall.destination },
    hinge: { ...wall.hinge },
    triggerFrom: wall.triggerFrom ? { ...wall.triggerFrom } : null,
  }));
  exit = { ...variant.exit };
  levelStart = { ...variant.start };
  shortestPath = variant.path;
  moveLimit = variant.moveLimit;
  resetRun(introMode);
}

function resetRun(introMode = "full") {
  clearMouseMotion();
  clearCheeseEatingAnimation();
  clearMouseDefeatAnimation();
  clearLevelIntroAnimation();
  clearHingedWallAnimation();
  mouse = { ...levelStart };
  collectedCheeseKeys = new Set();
  rockPositions = initialRocks.map((rock) => ({ ...rock }));
  hingedWalls = initialHingedWalls.map((wall) => ({
    ...wall,
    source: { ...wall.source },
    destination: { ...wall.destination },
    hinge: { ...wall.hinge },
    triggerFrom: wall.triggerFrom ? { ...wall.triggerFrom } : null,
    activated: false,
    destroyed: false,
    moving: false,
  }));
  cheeseEatingTarget = null;
  activeFishingCatchTarget = null;
  syncActiveExit();
  mouseFacingDirection = initialFacingForStart(levelStart);
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
  updateAttemptUI();
  render();
  starsEl.textContent = "\u2606 \u2606 \u2606";
  saveCampaignState();
  startLevelIntroAnimation(introMode);
}

function resetTestGame() {
  attempts = MAX_ATTEMPTS;
  nextAttemptAt = null;
  currency = STARTING_CURRENCY;
  powerInventory = createStartingPowerInventory();
  syncPowerAvailability();

  level = 1;
  activeVariantIndex = -1;
  for (const state of levelVariantStates) {
    state.current = -1;
    state.remaining = [];
  }

  touchStart = null;
  activeSwipePointerId = null;
  retryCostsAttempt = false;
  saveAttemptState();
  saveEconomyState();
  updateAttemptUI();
  updateCurrencyUI();
  generateLevel();
}

function render() {
  mazeEl.classList.remove("win", "invalid");
  levelLabelEl.textContent = campaignComplete ? "Game" : "Level";
  levelTitleEl.textContent = campaignComplete ? "Over" : String(level);
  movesLeftEl.textContent = movesLeft;
  const collectedCount = collectedCheeseKeys.size;
  cheeseProgressEl.hidden = cheeseTargets.length < 2 || campaignComplete;
  cheeseProgressEl.textContent = `${collectedCount}/${cheeseTargets.length}`;
  cheeseProgressEl.setAttribute(
    "aria-label",
    `${collectedCount} of ${cheeseTargets.length} cheeses collected`,
  );
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
  const geometry = createBoardGeometry(bounds.width, bounds.height);
  const camera = cinematicCameraState(geometry.inner, bounds.width, bounds.height);
  mazeContext.save();
  applyCinematicCamera(mazeContext, camera, bounds.width, bounds.height);
  drawMazeBoard(mazeContext, bounds.width, bounds.height, geometry);
  mazeContext.restore();
}

function createBoardGeometry(width, height) {
  const frameWidth = clamp(width * 0.027, 11, 30);
  const frameDepth = clamp(width * 0.035, 14, 38);
  const topY = clamp(width * 0.018, 8, 18);
  const boardAspect = (width <= 600 ? 0.82 : 0.74) * (ROWS / COLS);
  const boardHeight = Math.min(width * boardAspect, height - topY - frameDepth - 8);
  const bottomY = topY + boardHeight;
  const outer = {
    tl: { x: width * 0.09, y: topY },
    tr: { x: width * 0.91, y: topY },
    br: { x: width * 0.96, y: bottomY },
    bl: { x: width * 0.04, y: bottomY },
  };
  const inner = {
    tl: { x: outer.tl.x + frameWidth * 0.72, y: outer.tl.y + frameWidth * 0.72 },
    tr: { x: outer.tr.x - frameWidth * 0.72, y: outer.tr.y + frameWidth * 0.72 },
    br: { x: outer.br.x - frameWidth * 0.9, y: outer.br.y - frameWidth * 0.72 },
    bl: { x: outer.bl.x + frameWidth * 0.9, y: outer.bl.y - frameWidth * 0.72 },
  };
  return { frameWidth, frameDepth, outer, inner };
}

function cameraAnimationEnvelope(progress, fadeIn = 0.18, fadeOut = 0.18) {
  const value = clamp(progress, 0, 1);
  if (value < fadeIn) return smoothStep(value / fadeIn);
  if (value > 1 - fadeOut) return 1 - smoothStep((value - (1 - fadeOut)) / fadeOut);
  return 1;
}

function cinematicCameraState(corners, width, height) {
  let amount = 0;
  let zoom = 1;
  let focusCell = currentMouseVisualState();

  if (levelIntro) {
    amount = cameraAnimationEnvelope(levelIntro.progress, 0.2, 0.16);
    zoom = 1.22;
    focusCell = levelStart;
  } else if (powerTransform) {
    amount = cameraAnimationEnvelope(powerTransform.progress, 0.2, 0.2);
    zoom = 1.38;
  } else if (cheeseEatingAnimating) {
    amount = cameraAnimationEnvelope(cheeseEatingProgress, 0.14, 0.16);
    zoom = 1.45;
  } else if (mouseDefeatAnimating) {
    amount = cameraAnimationEnvelope(mouseDefeatProgress, 0.14, 0.16);
    zoom = 1.42;
  } else if (hammerWallAnimation) {
    amount = cameraAnimationEnvelope(hammerWallAnimation.progress, 0.16, 0.18);
    zoom = 1.36;
  } else if (fishingCatchAnimating) {
    amount = cameraAnimationEnvelope(fishingCatchProgress, 0.14, 0.18);
    zoom = 1.28;
    const fishingTarget = activeFishingCatchTarget ?? exit ?? mouse;
    focusCell = {
      row: (mouse.row + fishingTarget.row) / 2,
      col: (mouse.col + fishingTarget.col) / 2,
    };
  }

  const focus = project(
    corners,
    (focusCell.col + 0.5) / COLS,
    (focusCell.row + 0.5) / ROWS,
  );
  return { amount, focus, zoom, target: { x: width * 0.5, y: height * 0.48 } };
}

function applyCinematicCamera(ctx, camera) {
  if (!camera || camera.amount <= 0) return;
  const amount = clamp(camera.amount, 0, 1);
  const zoom = 1 + (camera.zoom - 1) * amount;
  const anchor = {
    x: camera.focus.x + (camera.target.x - camera.focus.x) * amount,
    y: camera.focus.y + (camera.target.y - camera.focus.y) * amount,
  };
  ctx.translate(anchor.x, anchor.y);
  ctx.scale(zoom, zoom);
  ctx.translate(-camera.focus.x, -camera.focus.y);
}

function drawMazeBoard(ctx, width, height, geometry = createBoardGeometry(width, height)) {
  const { frameWidth, frameDepth, outer, inner } = geometry;
  mazeLayout = { corners: inner, width };

  drawBoardShadow(ctx, outer, frameDepth);
  drawBoardBase(ctx, outer, frameDepth, frameWidth);
  drawFloor(ctx, inner, width);
  if (crystalRevealPath.length) drawCrystalPath(ctx, inner);
  if (rocketTargeting && !powerTransform) drawRocketTargets(ctx, inner);
  if (fishingTargeting && !powerTransform) drawFishingTargets(ctx, inner);
  if (tornadoWallAnimation) drawTornadoWalls(ctx, inner, width);
  else {
    drawInteriorWalls(ctx, inner, width);
    drawHingedWallIndicators(ctx, inner, width);
    if (hingedWallAnimation) drawHingedWallMovement(ctx, inner, width);
  }
  if (hammerWallAnimation) drawHammerWallAnimation(ctx, inner, width);
  if (hammerTargeting && !powerTransform && !hammerWallAnimation) {
    drawHammerTargets(ctx, inner, width);
  }
  drawOuterFrame(ctx, outer, frameWidth, frameDepth);
  drawCharacters(ctx, inner);
  if (hammerWallAnimation) drawHammerDebrisAnimation(ctx, inner, width);
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

function drawBoardBase(ctx, outer, depth, lineWidth) {
  const door = introDoorGeometry(outer, lineWidth, depth);
  ctx.save();
  if (door && !door.topEdge) clipOuterFrameAroundDoor(ctx, outer, door, depth);

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
  ctx.restore();
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

  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const points = [
        project(inner, col / COLS, row / ROWS),
        project(inner, (col + 1) / COLS, row / ROWS),
        project(inner, (col + 1) / COLS, (row + 1) / ROWS),
        project(inner, col / COLS, (row + 1) / ROWS),
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
  const activeCellIndex =
    crystalRevealPhase === "reveal" ? Math.max(0, crystalVisibleCount - 1) : -1;

  for (let index = 0; index < cells.length; index += 1) {
    const cell = cells[index];
    const polygon = cellPolygon(cell, corners);
    const cellHeight = distance(polygon[0], polygon[3]);
    const liftProgress = index === activeCellIndex ? crystalRevealStepProgress : 1;
    const liftAmount =
      index === activeCellIndex
        ? Math.sin(Math.PI * liftProgress) * cellHeight * CRYSTAL_PLATE_LIFT_RATIO
        : 0;
    const topPolygon = polygon.map((point) => offsetPoint(point, -liftAmount));

    if (liftAmount > 0.1) {
      ctx.save();
      ctx.shadowColor = "rgba(77, 47, 61, 0.42)";
      ctx.shadowBlur = cellHeight * 0.32;
      ctx.fillStyle = "rgba(103, 67, 81, 0.3)";
      tracePolygon(ctx, polygon);
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = "rgba(171, 107, 130, 0.86)";
      tracePolygon(ctx, [topPolygon[1], topPolygon[2], polygon[2], polygon[1]]);
      ctx.fill();

      ctx.fillStyle = "rgba(194, 126, 151, 0.92)";
      tracePolygon(ctx, [topPolygon[3], topPolygon[2], polygon[2], polygon[3]]);
      ctx.fill();

      ctx.fillStyle =
        (cell.row + cell.col) % 2 === 0 ? "rgb(255, 251, 242)" : "rgb(239, 228, 207)";
      tracePolygon(ctx, topPolygon);
      ctx.fill();
      ctx.strokeStyle = "rgba(154, 123, 136, 0.42)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    const center = polygon.reduce(
      (sum, point) => ({ x: sum.x + point.x / polygon.length, y: sum.y + point.y / polygon.length }),
      { x: 0, y: 0 },
    );
    const liftedCenter = offsetPoint(center, -liftAmount);
    const inset = topPolygon.map((point) => ({
      x: liftedCenter.x + (point.x - liftedCenter.x) * 0.84,
      y: liftedCenter.y + (point.y - liftedCenter.y) * 0.84,
    }));

    ctx.save();
    ctx.globalAlpha = crystalRevealOpacity;
    ctx.shadowColor = "rgba(237, 104, 154, 0.98)";
    ctx.shadowBlur = cellHeight * 0.62;
    tracePolygon(ctx, inset);
    ctx.fillStyle = "rgba(244, 132, 178, 0.46)";
    ctx.fill();
    ctx.lineWidth = clamp(cellHeight * 0.055, 1.2, 2.4);
    ctx.strokeStyle = "rgba(255, 211, 228, 0.92)";
    ctx.stroke();
    ctx.restore();
  }
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

function collectWallSegments(grid = maze) {
  const segments = [];

  for (let y = 1; y < ROWS; y += 1) {
    let start = null;
    for (let x = 0; x < COLS; x += 1) {
      const hasWall = grid[y][x].walls.top;
      if (hasWall && start === null) start = x;
      if ((!hasWall || x === COLS - 1) && start !== null) {
        const end = hasWall && x === COLS - 1 ? x + 1 : x;
        segments.push({ orientation: "horizontal", line: y, start, length: end - start });
        start = null;
      }
    }
  }

  for (let x = 1; x < COLS; x += 1) {
    let start = null;
    for (let y = 0; y < ROWS; y += 1) {
      const hasWall = grid[y][x].walls.left;
      if (hasWall && start === null) start = y;
      if ((!hasWall || y === ROWS - 1) && start !== null) {
        const end = hasWall && y === ROWS - 1 ? y + 1 : y;
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
  for (let row = Math.max(0, mouse.row - 2); row <= Math.min(ROWS - 1, mouse.row + 2); row += 1) {
    for (
      let col = Math.max(0, mouse.col - 2);
      col <= Math.min(COLS - 1, mouse.col + 2);
      col += 1
    ) {
      const moveDistance = Math.abs(row - mouse.row) + Math.abs(col - mouse.col);
      if (moveDistance > 0 && moveDistance <= 2 && !rockAt({ row, col })) {
        targets.push({ row, col });
      }
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
  const targetKeys = new Set(getFishingTargets().map(keyOf));
  return (
    remainingCheeseTargets().find(
      (target) => targetKeys.has(keyOf(target)) && isCheeseVisible(target),
    ) ?? null
  );
}

function cellPolygon(cell, corners) {
  return [
    project(corners, cell.col / COLS, cell.row / ROWS),
    project(corners, (cell.col + 1) / COLS, cell.row / ROWS),
    project(corners, (cell.col + 1) / COLS, (cell.row + 1) / ROWS),
    project(corners, cell.col / COLS, (cell.row + 1) / ROWS),
  ];
}

function segmentGeometry(segment, corners, width) {
  const horizontal = segment.orientation === "horizontal";
  const u1 = horizontal ? segment.start / COLS : segment.line / COLS;
  const v1 = horizontal ? segment.line / ROWS : segment.start / ROWS;
  const u2 = horizontal ? (segment.start + segment.length) / COLS : segment.line / COLS;
  const v2 = horizontal ? segment.line / ROWS : (segment.start + segment.length) / ROWS;
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
    (mouse.col + 0.5) / COLS,
    (mouse.row + 0.5) / ROWS,
  );
  const cellWidth = distance(
    project(mazeLayout.corners, mouse.col / COLS, mouse.row / ROWS),
    project(mazeLayout.corners, (mouse.col + 1) / COLS, mouse.row / ROWS),
  );
  return distance(point, center) <= clamp(cellWidth * 0.9, 22, 44);
}

function crystalTargetAtPoint(point) {
  return crystalTargeting && characterTargetAtPoint(point);
}

function tornadoTargetAtPoint(point) {
  return tornadoTargeting && characterTargetAtPoint(point);
}

function crystalRevealStateAt(elapsed, pathLength, stepDuration) {
  const revealDuration = pathLength * stepDuration;
  if (elapsed < revealDuration) {
    const activeIndex = Math.min(pathLength - 1, Math.floor(elapsed / stepDuration));
    return {
      phase: "reveal",
      visibleCount: activeIndex + 1,
      stepProgress: clamp((elapsed - activeIndex * stepDuration) / stepDuration, 0, 1),
      opacity: 1,
      done: false,
    };
  }

  if (elapsed < revealDuration + CRYSTAL_REVEAL_HOLD_MS) {
    return {
      phase: "hold",
      visibleCount: pathLength,
      stepProgress: 1,
      opacity: 1,
      done: false,
    };
  }

  const fadeElapsed = elapsed - revealDuration - CRYSTAL_REVEAL_HOLD_MS;
  if (fadeElapsed < CRYSTAL_REVEAL_FADE_MS) {
    return {
      phase: "fade",
      visibleCount: pathLength,
      stepProgress: 1,
      opacity: 1 - fadeElapsed / CRYSTAL_REVEAL_FADE_MS,
      done: false,
    };
  }

  return {
    phase: "idle",
    visibleCount: pathLength,
    stepProgress: 1,
    opacity: 0,
    done: true,
  };
}

function applyCrystalRevealState(state) {
  crystalRevealPhase = state.phase;
  crystalVisibleCount = state.visibleCount;
  crystalRevealStepProgress = state.stepProgress;
  crystalRevealOpacity = state.opacity;
}

function finishCrystalReveal(token) {
  if (token !== crystalRevealToken) return;
  const incomplete = crystalRevealIncomplete;
  if (crystalRevealFrame !== null) cancelAnimationFrame(crystalRevealFrame);
  if (crystalRevealTimer !== null) clearTimeout(crystalRevealTimer);
  crystalRevealFrame = null;
  crystalRevealTimer = null;
  crystalRevealPath = [];
  crystalVisibleCount = 0;
  crystalRevealStartedAt = null;
  crystalRevealStepDuration = 0;
  crystalRevealStepProgress = 0;
  crystalRevealOpacity = 0;
  crystalRevealPhase = "idle";
  setMessage("Crystal Vision is changing back...");
  requestMazeDraw();

  startPowerTransformation("crystal", "out", () => {
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
  });
}

function animateCrystalReveal(timestamp) {
  if (!crystalRevealing || !crystalRevealPath.length) return;
  if (crystalRevealStartedAt === null) crystalRevealStartedAt = timestamp;

  const state = crystalRevealStateAt(
    timestamp - crystalRevealStartedAt,
    crystalRevealPath.length,
    crystalRevealStepDuration,
  );
  applyCrystalRevealState(state);
  drawMaze();

  if (state.done) {
    finishCrystalReveal(crystalRevealToken);
    return;
  }

  crystalRevealFrame = requestAnimationFrame(animateCrystalReveal);
}

function revealCrystalPathWithoutMotion(token) {
  const stepDelay = crystalRevealStepDuration;

  function revealNext() {
    if (token !== crystalRevealToken) return;
    crystalRevealStepProgress = 1;
    requestMazeDraw();

    if (crystalVisibleCount < crystalRevealPath.length) {
      crystalRevealTimer = setTimeout(() => {
        if (token !== crystalRevealToken) return;
        crystalVisibleCount += 1;
        crystalRevealStepProgress = 1;
        requestMazeDraw();
        revealNext();
      }, stepDelay);
      return;
    }

    crystalRevealPhase = "hold";
    crystalRevealTimer = setTimeout(() => {
      if (token !== crystalRevealToken) return;
      crystalRevealPhase = "fade";
      crystalRevealOpacity = 0;
      requestMazeDraw();
      crystalRevealTimer = setTimeout(() => finishCrystalReveal(token), CRYSTAL_REVEAL_FADE_MS);
    }, CRYSTAL_REVEAL_HOLD_MS);
  }

  revealNext();
}

function revealCrystalPath() {
  const token = ++crystalRevealToken;
  crystalRevealStepDuration = clamp(
    Math.floor(CRYSTAL_REVEAL_TARGET_MS / crystalRevealPath.length),
    CRYSTAL_REVEAL_MIN_STEP_MS,
    CRYSTAL_REVEAL_MAX_STEP_MS,
  );
  crystalRevealStartedAt = null;
  crystalRevealPhase = "reveal";
  crystalVisibleCount = 1;
  crystalRevealStepProgress = 0;
  crystalRevealOpacity = 1;
  requestMazeDraw();

  if (!canAnimateMouseMotion()) {
    revealCrystalPathWithoutMotion(token);
    return;
  }

  crystalRevealFrame = requestAnimationFrame(animateCrystalReveal);
}

function useCrystalPower() {
  if (!crystalTargeting || !crystalAvailable || !crystalCandidatePath.length) return;
  if (!consumePower("crystal")) return;
  crystalRevealPath = crystalCandidatePath.map((cell) => ({ ...cell }));
  crystalCandidatePath = [];
  crystalRevealIncomplete = crystalCandidateIncomplete;
  crystalCandidateIncomplete = false;
  crystalVisibleCount = 0;
  powerPointerStart = null;
  setMovementControlsEnabled(false);
  setPowerControlsEnabled(false);
  crystalRevealing = true;
  setMessage("Watch the floor wave and remember the route.");
  requestMazeDraw();
  revealCrystalPath();
}

function finishTornadoWallAnimation() {
  if (!tornadoWallAnimation) return;
  tornadoWallAnimation = null;
  tornadoWallAnimationFrame = null;
  setMessage("The new maze has landed. Tornado is changing back...");
  requestMazeDraw();

  startPowerTransformation("tornado", "out", () => {
    setMovementControlsEnabled(true);
    setPowerControlsEnabled(true);
    setMessage("The maze shifted around the mouse.");
    render();
    saveCampaignState();
  });
}

function animateTornadoWalls(timestamp) {
  if (!tornadoWallAnimation) return;
  if (tornadoWallAnimation.startedAt === null) tornadoWallAnimation.startedAt = timestamp;
  tornadoWallAnimation.progress = clamp(
    (timestamp - tornadoWallAnimation.startedAt) / TORNADO_WALL_ANIMATION_DURATION_MS,
    0,
    1,
  );
  drawMaze();

  if (tornadoWallAnimation.progress >= 1) {
    finishTornadoWallAnimation();
    return;
  }

  tornadoWallAnimationFrame = requestAnimationFrame(animateTornadoWalls);
}

function startTornadoWallAnimation(previousGrid, nextGrid) {
  clearTornadoWallAnimation();
  tornadoWallAnimation = {
    outgoingSegments: collectWallSegments(previousGrid),
    incomingSegments: collectWallSegments(nextGrid),
    progress: 0,
    startedAt: null,
  };
  setMovementControlsEnabled(false);
  setPowerControlsEnabled(false);
  mazeEl.setAttribute("aria-busy", "true");
  setMessage("The tornado is lifting and reshaping the maze...");
  requestMazeDraw();

  if (!canAnimateMouseMotion()) {
    tornadoWallAnimation.progress = 1;
    finishTornadoWallAnimation();
    return;
  }

  tornadoWallAnimationFrame = requestAnimationFrame(animateTornadoWalls);
}

function useTornadoPower() {
  if (tornadoWallAnimation || !tornadoTargeting || !tornadoAvailable || !tornadoCandidate) return;
  if (!consumePower("tornado")) return;
  const previousGrid = maze;
  const nextGrid = tornadoCandidate.grid;
  maze = tornadoCandidate.grid;
  hingedWalls = tornadoCandidate.hingedWalls.map((wall) => ({
    ...wall,
    source: { ...wall.source },
    destination: { ...wall.destination },
    hinge: { ...wall.hinge },
    activated: false,
    destroyed: false,
    moving: false,
  }));
  activeVariantIndex = tornadoCandidate.variantIndex;
  shortestPath = tornadoCandidate.pathFromMouse;
  syncActiveExit();
  tornadoCandidate = null;
  powerPointerStart = null;
  startTornadoWallAnimation(previousGrid, nextGrid);
}

function finishFishingCatchAnimation() {
  if (!fishingCatchAnimating) return;
  const caughtTarget = activeFishingCatchTarget ? { ...activeFishingCatchTarget } : null;
  fishingCatchAnimating = false;
  fishingCatchProgress = 0;
  fishingCatchStartedAt = null;
  fishingCatchFrame = null;
  if (caughtTarget) {
    const targetIndex = cheeseTargets.findIndex((target) => keyOf(target) === keyOf(caughtTarget));
    if (targetIndex >= 0) cheeseTargets[targetIndex] = { ...mouse };
  }
  activeFishingCatchTarget = null;
  exit = { ...mouse };
  syncActiveExit();
  setMessage("Fishing rod is changing back...");
  requestMazeDraw();
  startPowerTransformation("fishing", "out", () => startCheeseEatingAnimation(cheeseAt(mouse)));
}

function animateFishingCatch(timestamp) {
  if (!fishingCatchAnimating) return;
  if (fishingCatchStartedAt === null) fishingCatchStartedAt = timestamp;
  fishingCatchProgress = clamp(
    (timestamp - fishingCatchStartedAt) / FISHING_CAST_DURATION_MS,
    0,
    1,
  );
  const phase = fishingCastPhaseAt(fishingCatchProgress).phase;
  if (phase === "cast") setMessage("The hook is flying toward the cheese...");
  else if (phase === "hook") setMessage("Hooked. The reel is engaging...");
  else if (phase === "reel") setMessage("Reeling the cheese back to the mouse...");
  drawMaze();

  if (fishingCatchProgress >= 1) {
    finishFishingCatchAnimation();
    return;
  }

  fishingCatchFrame = requestAnimationFrame(animateFishingCatch);
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
  activeFishingCatchTarget = { ...catchTarget };
  fishingCatchAnimating = true;
  fishingCatchProgress = 0;
  fishingCatchStartedAt = null;
  powerPointerStart = null;
  setMovementControlsEnabled(false);
  setPowerControlsEnabled(false);
  mazeEl.setAttribute("aria-busy", "true");
  setMessage("The fishing rod is preparing its cast...");
  requestMazeDraw();

  if (!canAnimateMouseMotion()) {
    fishingCatchProgress = 1;
    finishFishingCatchAnimation();
    return;
  }

  fishingCatchFrame = requestAnimationFrame(animateFishingCatch);
}

function hammerSwingStateAt(progress, directionKey = "up") {
  const value = clamp(progress, 0, 1);
  const profile = HAMMER_SWING_PROFILES[directionKey] ?? HAMMER_SWING_PROFILES.up;
  if (value < 0.34) {
    const windup = smoothStep(value / 0.34);
    return {
      phase: "windup",
      rotation: profile.windupRotation * windup,
      flipX: profile.flipX,
      impactAmount: 0,
    };
  }
  if (value < HAMMER_IMPACT_RATIO) {
    const strike = smoothStep((value - 0.34) / (HAMMER_IMPACT_RATIO - 0.34));
    return {
      phase: "strike",
      rotation:
        profile.windupRotation +
        (profile.impactRotation - profile.windupRotation) * strike,
      flipX: profile.flipX,
      impactAmount: 0,
    };
  }

  const impactAmount = clamp(
    (value - HAMMER_IMPACT_RATIO) / (1 - HAMMER_IMPACT_RATIO),
    0,
    1,
  );
  const recoilProgress = clamp(impactAmount / 0.34, 0, 1);
  const recoil = Math.sin(recoilProgress * Math.PI) * (1 - recoilProgress) * 0.16;
  return {
    phase: "impact",
    rotation:
      profile.impactRotation +
      (profile.windupRotation - profile.impactRotation) * recoil,
    flipX: profile.flipX,
    impactAmount,
  };
}

function finishHammerWallAnimation() {
  if (!hammerWallAnimation) return;
  hammerWallAnimation = null;
  hammerWallAnimationFrame = null;
  mazeEl.setAttribute("aria-busy", "false");
  setMessage("Wall broken. Hammer is changing back...");
  requestMazeDraw();

  startPowerTransformation("hammer", "out", () => {
    setMovementControlsEnabled(true);
    setPowerControlsEnabled(true);
    setMessage("Wall broken. A new path is open.");
    render();
    saveCampaignState();
  });
}

function animateHammerWall(timestamp) {
  if (!hammerWallAnimation) return;
  if (hammerWallAnimation.startedAt === null) hammerWallAnimation.startedAt = timestamp;
  hammerWallAnimation.progress = clamp(
    (timestamp - hammerWallAnimation.startedAt) / HAMMER_BREAK_ANIMATION_DURATION_MS,
    0,
    1,
  );
  drawMaze();

  if (hammerWallAnimation.progress >= 1) {
    finishHammerWallAnimation();
    return;
  }

  hammerWallAnimationFrame = requestAnimationFrame(animateHammerWall);
}

function startHammerWallAnimation(target) {
  clearHammerWallAnimation();
  hammerWallAnimation = {
    target: {
      dir: { ...target.dir },
      nextRow: target.nextRow,
      nextCol: target.nextCol,
      segment: { ...target.segment },
    },
    progress: 0,
    startedAt: null,
  };
  setMovementControlsEnabled(false);
  setPowerControlsEnabled(false);
  mazeEl.setAttribute("aria-busy", "true");
  setMessage("The hammer is lining up its swing...");
  requestMazeDraw();

  if (!canAnimateMouseMotion()) {
    hammerWallAnimation.progress = 1;
    finishHammerWallAnimation();
    return;
  }

  hammerWallAnimationFrame = requestAnimationFrame(animateHammerWall);
}

function destroyHammerTarget(target) {
  if (!target || hammerWallAnimation || !hammerTargeting || !hammerAvailable) return;
  if (!consumePower("hammer")) return;
  const current = maze[mouse.row][mouse.col];
  const neighbor = maze[target.nextRow][target.nextCol];
  current.walls[target.dir.wall] = false;
  neighbor.walls[target.dir.opposite] = false;
  const brokenSegmentKey = segmentKey(target.segment);
  const hingedWall = hingedWalls.find((wall) => {
    if (wall.destroyed) return false;
    const currentSegment = wall.activated ? wall.destination : wall.source;
    return segmentKey(currentSegment) === brokenSegmentKey;
  });
  if (hingedWall) {
    hingedWall.destroyed = true;
    hingedWall.moving = false;
  }

  hammerTargeting = false;
  powerPointerStart = null;
  startHammerWallAnimation(target);
}

function rocketFlightPhaseAt(progress) {
  const value = clamp(progress, 0, 1);
  if (value < ROCKET_IGNITION_END) {
    return {
      phase: "ignition",
      amount: smoothStep(value / ROCKET_IGNITION_END),
    };
  }
  if (value < ROCKET_ASCENT_END) {
    return {
      phase: "ascent",
      amount: smoothStep(
        (value - ROCKET_IGNITION_END) / (ROCKET_ASCENT_END - ROCKET_IGNITION_END),
      ),
    };
  }
  if (value < ROCKET_CRUISE_END) {
    return {
      phase: "cruise",
      amount: smoothStep(
        (value - ROCKET_ASCENT_END) / (ROCKET_CRUISE_END - ROCKET_ASCENT_END),
      ),
    };
  }
  if (value < ROCKET_DESCENT_END) {
    return {
      phase: "descent",
      amount: smoothStep(
        (value - ROCKET_CRUISE_END) / (ROCKET_DESCENT_END - ROCKET_CRUISE_END),
      ),
    };
  }
  return {
    phase: "impact",
    amount: smoothStep(
      (value - ROCKET_DESCENT_END) / (1 - ROCKET_DESCENT_END),
    ),
  };
}

function rocketFlightVisualStateAt(progress, sourceCenter, targetCenter, cellWidth) {
  const stage = rocketFlightPhaseAt(progress);
  const turnDirection = targetCenter.x >= sourceCenter.x ? 1 : -1;
  const baseHeight = cellWidth * ROCKET_BODY_SCALE;
  const lift = cellWidth * 2.15;
  const sourceRest = {
    x: sourceCenter.x,
    y: sourceCenter.y - baseHeight * 0.12,
  };
  const targetRest = {
    x: targetCenter.x,
    y: targetCenter.y - baseHeight * 0.12,
  };
  const sourceApex = { x: sourceCenter.x, y: sourceRest.y - lift };
  const targetApex = { x: targetCenter.x, y: targetRest.y - lift };
  const noseDownCenter = {
    x: targetCenter.x,
    y: targetCenter.y - baseHeight * 0.5,
  };
  let center = { ...sourceRest };
  let shadowCenter = { ...sourceCenter };
  let rotation = 0;
  let altitude = 0;
  let scale = 1;
  let flame = 0;
  let launchSmokeProgress = 0;
  let launchSmokeOpacity = 0;
  let impactSmokeProgress = 0;

  if (stage.phase === "ignition") {
    flame = stage.amount;
    launchSmokeProgress = stage.amount * 0.72;
    launchSmokeOpacity = stage.amount;
    center.y -= Math.sin(stage.amount * Math.PI * 7) * cellWidth * 0.018 * stage.amount;
  } else if (stage.phase === "ascent") {
    center = {
      x: sourceRest.x + (sourceApex.x - sourceRest.x) * stage.amount,
      y: sourceRest.y + (sourceApex.y - sourceRest.y) * stage.amount,
    };
    altitude = stage.amount;
    scale = 1 + (ROCKET_APEX_SCALE - 1) * stage.amount;
    flame = 1;
    launchSmokeProgress = 0.72 + stage.amount * 0.28;
    launchSmokeOpacity = 1 - stage.amount * 0.72;
  } else if (stage.phase === "cruise") {
    center = {
      x: sourceApex.x + (targetApex.x - sourceApex.x) * stage.amount,
      y:
        sourceApex.y +
        (targetApex.y - sourceApex.y) * stage.amount -
        Math.sin(stage.amount * Math.PI) * cellWidth * 0.42,
    };
    shadowCenter = {
      x: sourceCenter.x + (targetCenter.x - sourceCenter.x) * stage.amount,
      y: sourceCenter.y + (targetCenter.y - sourceCenter.y) * stage.amount,
    };
    rotation = Math.PI * turnDirection * stage.amount;
    altitude = 1;
    scale = ROCKET_APEX_SCALE;
    flame = Math.max(0, 1 - stage.amount * 1.3);
    launchSmokeProgress = 1;
    launchSmokeOpacity = 0.16 * (1 - stage.amount);
  } else if (stage.phase === "descent") {
    center = {
      x: targetApex.x + (noseDownCenter.x - targetApex.x) * stage.amount,
      y: targetApex.y + (noseDownCenter.y - targetApex.y) * stage.amount,
    };
    shadowCenter = { ...targetCenter };
    rotation = Math.PI * turnDirection;
    altitude = 1 - stage.amount;
    scale = ROCKET_APEX_SCALE - (ROCKET_APEX_SCALE - 1) * stage.amount;
  } else {
    const uprightRecovery = smoothStep(
      clamp((stage.amount - 0.76) / 0.24, 0, 1),
    );
    center = {
      x: targetCenter.x,
      y:
        noseDownCenter.y +
        (targetRest.y - noseDownCenter.y) * uprightRecovery -
        Math.sin(stage.amount * Math.PI) * cellWidth * 0.08,
    };
    shadowCenter = { ...targetCenter };
    rotation = Math.PI * turnDirection * (1 - uprightRecovery);
    scale = 1 + Math.sin(stage.amount * Math.PI) * 0.06;
    impactSmokeProgress = stage.amount;
  }

  return {
    ...stage,
    center,
    shadowCenter,
    rotation,
    turnDirection,
    altitude,
    scale,
    flame,
    launchSmokeProgress,
    launchSmokeOpacity,
    impactSmokeProgress,
  };
}

function finishRocketFlightAnimation() {
  if (!rocketFlightAnimation) return;
  const target = { ...rocketFlightAnimation.to };
  rocketFlightAnimation = null;
  rocketFlightAnimationFrame = null;
  mazeEl.setAttribute("aria-busy", "false");
  mouse = target;
  setMessage("Rocket landed and is changing back...");
  startPowerTransformation("rocket", "out", () => {
    const landedCheese = cheeseAt(mouse);
    if (landedCheese) {
      startCheeseEatingAnimation(landedCheese);
      return;
    }
    setMovementControlsEnabled(true);
    setPowerControlsEnabled(true);
    setMessage("Rocket landed. The walls were left behind.");
    render();
    saveCampaignState();
  });
}

function animateRocketFlight(timestamp) {
  if (!rocketFlightAnimation) return;
  if (rocketFlightAnimation.startedAt === null) {
    rocketFlightAnimation.startedAt = timestamp;
  }
  rocketFlightAnimation.progress = clamp(
    (timestamp - rocketFlightAnimation.startedAt) / ROCKET_FLIGHT_DURATION_MS,
    0,
    1,
  );
  const phase = rocketFlightPhaseAt(rocketFlightAnimation.progress).phase;
  if (phase !== rocketFlightAnimation.phase) {
    rocketFlightAnimation.phase = phase;
    if (phase === "ascent") setMessage("Rocket lifting above the maze...");
    else if (phase === "cruise") setMessage("Rocket crossing above the walls...");
    else if (phase === "descent") setMessage("Target locked. Nose down...");
    else if (phase === "impact") setMessage("Landing on the selected square...");
  }
  drawMaze();

  if (rocketFlightAnimation.progress >= 1) {
    finishRocketFlightAnimation();
    return;
  }

  rocketFlightAnimationFrame = requestAnimationFrame(animateRocketFlight);
}

function startRocketFlightAnimation(target) {
  rocketFlightAnimation = {
    from: { ...mouse },
    to: { ...target },
    progress: 0,
    phase: "ignition",
    startedAt: null,
  };
  setMovementControlsEnabled(false);
  setPowerControlsEnabled(false);
  mazeEl.setAttribute("aria-busy", "true");
  setMessage("Rocket upright. Starting ignition...");
  requestMazeDraw();

  if (!canAnimateMouseMotion()) {
    rocketFlightAnimation.progress = 1;
    finishRocketFlightAnimation();
    return;
  }

  rocketFlightAnimationFrame = requestAnimationFrame(animateRocketFlight);
}

function useRocketTarget(target) {
  if (
    !target ||
    rocketFlightAnimation ||
    !rocketTargeting ||
    !rocketAvailable
  ) {
    return;
  }
  if (!consumePower("rocket")) return;
  rocketTargeting = false;
  powerPointerStart = null;
  startRocketFlightAnimation(target);
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

function wallGeometries(segments, corners, width) {
  return segments
    .map((segment) => segmentGeometry(segment, corners, width))
    .sort((a, b) => a.depth - b.depth);
}

function drawInteriorWallSet(ctx, walls) {
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

function drawInteriorWalls(ctx, corners, width) {
  drawInteriorWallSet(ctx, wallGeometries(collectWallSegments(), corners, width));
}

function drawHingeHardware(ctx, point, radius, angle, activeProgress = null) {
  ctx.save();
  ctx.translate(point.x, point.y);
  ctx.rotate(angle + Math.PI / 2);

  if (activeProgress !== null) {
    const glow = Math.sin(clamp(activeProgress, 0, 1) * Math.PI);
    ctx.shadowColor = `rgba(218, 199, 133, ${0.5 * glow})`;
    ctx.shadowBlur = radius * (1.6 + glow * 1.7);
    ctx.strokeStyle = `rgba(232, 219, 169, ${0.25 + glow * 0.48})`;
    ctx.lineWidth = Math.max(1.2, radius * 0.22);
    ctx.beginPath();
    ctx.arc(0, 0, radius * (1.08 + glow * 0.18), 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.lineCap = "round";
  ctx.strokeStyle = "#4d594f";
  ctx.lineWidth = radius * 1.08;
  ctx.beginPath();
  ctx.moveTo(-radius * 0.72, 0);
  ctx.lineTo(radius * 0.72, 0);
  ctx.stroke();

  ctx.shadowColor = "transparent";
  ctx.strokeStyle = "#7d8979";
  ctx.lineWidth = radius * 0.7;
  ctx.beginPath();
  ctx.moveTo(-radius * 0.66, -radius * 0.05);
  ctx.lineTo(radius * 0.66, -radius * 0.05);
  ctx.stroke();

  ctx.fillStyle = "#59665a";
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.7, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = Math.max(1, radius * 0.18);
  ctx.strokeStyle = "#a8b19f";
  ctx.stroke();

  ctx.fillStyle = "#c8b477";
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 249, 220, 0.82)";
  ctx.beginPath();
  ctx.arc(-radius * 0.13, -radius * 0.14, radius * 0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawHingedWallIndicators(ctx, corners, width) {
  const radius = clamp(width * 0.009, 3.6, 8);
  for (const wall of hingedWalls) {
    if (wall.destroyed || wall.moving) continue;
    const segment = wall.activated ? wall.destination : wall.source;
    const geometry = segmentGeometry(segment, corners, width);
    const hinge = project(corners, wall.hinge.col / COLS, wall.hinge.row / ROWS);
    const angle = Math.atan2(geometry.p2.y - geometry.p1.y, geometry.p2.x - geometry.p1.x);
    drawHingeHardware(ctx, hinge, radius, angle);
  }
}

function drawHingedWallMovement(ctx, corners, width) {
  const source = segmentGeometry(hingedWallAnimation.source, corners, width);
  const destination = segmentGeometry(hingedWallAnimation.destination, corners, width);
  const hinge = project(
    corners,
    hingedWallAnimation.hinge.col / COLS,
    hingedWallAnimation.hinge.row / ROWS,
  );
  const sourceOther =
    distance(source.p1, hinge) > distance(source.p2, hinge) ? source.p1 : source.p2;
  const destinationOther =
    distance(destination.p1, hinge) > distance(destination.p2, hinge)
      ? destination.p1
      : destination.p2;
  const sourceAngle = Math.atan2(sourceOther.y - hinge.y, sourceOther.x - hinge.x);
  const destinationAngle = Math.atan2(
    destinationOther.y - hinge.y,
    destinationOther.x - hinge.x,
  );
  let angleDelta = destinationAngle - sourceAngle;
  while (angleDelta > Math.PI) angleDelta -= Math.PI * 2;
  while (angleDelta < -Math.PI) angleDelta += Math.PI * 2;
  const amount = smoothStep(hingedWallAnimation.progress);
  const angle = sourceAngle + angleDelta * amount;
  const length =
    distance(hinge, sourceOther) +
    (distance(hinge, destinationOther) - distance(hinge, sourceOther)) * amount;
  const movingWall = {
    ...source,
    p1: { ...hinge },
    p2: {
      x: hinge.x + Math.cos(angle) * length,
      y: hinge.y + Math.sin(angle) * length,
    },
    depth: source.depth + (destination.depth - source.depth) * amount,
  };
  drawInteriorWallSet(ctx, [movingWall]);
  drawHingeHardware(
    ctx,
    hinge,
    clamp(width * 0.01, 4, 8.5),
    angle,
    hingedWallAnimation.progress,
  );
}

function tornadoWallPhasesAt(progress) {
  return {
    outgoing: clamp((progress - 0.22) / 0.38, 0, 1),
    incoming: clamp((progress - 0.48) / 0.38, 0, 1),
  };
}

function tornadoWallTransform(wall, index, progress, direction, boardCenter, width) {
  const center = {
    x: (wall.p1.x + wall.p2.x) / 2,
    y: (wall.p1.y + wall.p2.y) / 2,
  };
  const baseAngle = Math.atan2(center.y - boardCenter.y, center.x - boardCenter.x);
  const finalRadius = distance(center, boardCenter);
  const orbitRadius = width * (0.14 + (index % 4) * 0.045);
  const turns = 2.25;

  if (direction === "out") {
    const orbitEntry = smoothStep(progress / 0.28);
    const currentRadius = finalRadius + (orbitRadius - finalRadius) * orbitEntry;
    const angleDelta = progress * Math.PI * 2 * turns;
    const angle = baseAngle + angleDelta;
    const orbitCenter = {
      x: boardCenter.x + Math.cos(angle) * currentRadius,
      y: boardCenter.y + Math.sin(angle) * currentRadius,
    };
    return {
      x: orbitCenter.x - center.x,
      y: orbitCenter.y - center.y - orbitEntry * width * 0.11,
      rotation: angleDelta,
      scale: 1 - orbitEntry * 0.12,
      opacity: 1 - clamp((progress - 0.74) / 0.26, 0, 1),
    };
  }

  const release = smoothStep((progress - 0.58) / 0.42);
  const currentRadius = orbitRadius + (finalRadius - orbitRadius) * release;
  const angleDelta = -(1 - progress) * Math.PI * 2 * turns;
  const angle = baseAngle + angleDelta;
  const currentCenter = {
    x: boardCenter.x + Math.cos(angle) * currentRadius,
    y: boardCenter.y + Math.sin(angle) * currentRadius,
  };
  return {
    x: currentCenter.x - center.x,
    y: currentCenter.y - center.y - (1 - release) * width * 0.11,
    rotation: angleDelta,
    scale: 0.88 + release * 0.12,
    opacity: clamp(progress / 0.14, 0, 1),
  };
}

function smoothStep(progress) {
  const value = clamp(progress, 0, 1);
  return value * value * (3 - 2 * value);
}

function tornadoVortexCenterAt(progress, start, center) {
  if (progress < 0.88) {
    const arrival = smoothStep(progress / 0.22);
    return {
      x: start.x + (center.x - start.x) * arrival,
      y: start.y + (center.y - start.y) * arrival,
    };
  }

  const returnProgress = smoothStep((progress - 0.88) / 0.12);
  return {
    x: center.x + (start.x - center.x) * returnProgress,
    y: center.y + (start.y - center.y) * returnProgress,
  };
}

function tornadoCheeseStateAt(progress, restingCenter, boardCenter, width) {
  const baseAngle = Math.atan2(
    restingCenter.y - boardCenter.y,
    restingCenter.x - boardCenter.x,
  );
  const restingRadius = distance(restingCenter, boardCenter);
  const orbitRadius = width * 0.235;

  if (progress <= 0.18 || progress >= 0.9) {
    return { center: { ...restingCenter }, rotation: 0, scale: 1 };
  }

  const orbitProgress = clamp((progress - 0.18) / 0.72, 0, 1);
  const orbitEntry = smoothStep(orbitProgress / 0.24);
  const orbitExit = smoothStep((1 - orbitProgress) / 0.24);
  const orbitAmount = Math.min(orbitEntry, orbitExit);
  const radius = restingRadius + (orbitRadius - restingRadius) * orbitAmount;
  const angleDelta = orbitProgress * Math.PI * 8;
  const angle = baseAngle + angleDelta;
  return {
    center: {
      x: boardCenter.x + Math.cos(angle) * radius,
      y: boardCenter.y + Math.sin(angle) * radius - orbitAmount * width * 0.12,
    },
    rotation: angleDelta,
    scale: 1 + orbitAmount * 0.1,
  };
}

function tornadoVortexAmountAt(progress) {
  if (progress <= 0.12 || progress >= 0.96) return 0;
  if (progress < 0.26) return smoothStep((progress - 0.12) / 0.14);
  if (progress <= 0.86) return 1;
  return 1 - smoothStep((progress - 0.86) / 0.1);
}

function drawFlyingWall(ctx, wall, transform) {
  if (transform.opacity <= 0) return;
  const center = {
    x: (wall.p1.x + wall.p2.x) / 2,
    y: (wall.p1.y + wall.p2.y) / 2,
  };

  ctx.save();
  ctx.globalAlpha = transform.opacity;
  ctx.translate(center.x + transform.x, center.y + transform.y);
  ctx.rotate(transform.rotation);
  ctx.scale(transform.scale, transform.scale);
  ctx.translate(-center.x, -center.y);

  ctx.save();
  ctx.shadowColor = "rgba(45, 53, 46, 0.36)";
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 9;
  strokeLine(
    ctx,
    wall.p1,
    wall.p2,
    wall.lineWidth + 2,
    "rgba(55, 66, 57, 0.34)",
    wall.height + 3,
  );
  ctx.restore();

  for (let layer = 5; layer >= 1; layer -= 1) {
    const offset = (wall.height * layer) / 5;
    const shade = layer >= 3 ? "#5d6a5e" : "#718071";
    strokeLine(ctx, wall.p1, wall.p2, wall.lineWidth, shade, offset);
  }
  strokeLine(ctx, wall.p1, wall.p2, wall.lineWidth + 2.5, "#58665a");
  strokeLine(ctx, wall.p1, wall.p2, wall.lineWidth, "#8f9b8b");
  strokeLine(
    ctx,
    wall.p1,
    wall.p2,
    Math.max(1.2, wall.lineWidth * 0.18),
    "rgba(229, 235, 222, 0.72)",
    -wall.lineWidth * 0.18,
  );
  ctx.restore();
}

function drawTornadoWalls(ctx, corners, width) {
  const phases = tornadoWallPhasesAt(tornadoWallAnimation.progress);
  const boardCenter = project(corners, 0.5, 0.5);
  const outgoingWalls = wallGeometries(tornadoWallAnimation.outgoingSegments, corners, width);
  const incomingWalls = wallGeometries(tornadoWallAnimation.incomingSegments, corners, width);

  ctx.save();
  tracePolygon(ctx, [corners.tl, corners.tr, corners.br, corners.bl]);
  ctx.clip();

  outgoingWalls.forEach((wall, index) => {
    drawFlyingWall(
      ctx,
      wall,
      tornadoWallTransform(wall, index, phases.outgoing, "out", boardCenter, width),
    );
  });
  incomingWalls.forEach((wall, index) => {
    drawFlyingWall(
      ctx,
      wall,
      tornadoWallTransform(wall, index, phases.incoming, "in", boardCenter, width),
    );
  });

  ctx.restore();
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

function drawHammerFragment(ctx, center, length, thickness, angle, wallHeight, opacity) {
  const halfLength = length / 2;
  const direction = { x: Math.cos(angle), y: Math.sin(angle) };
  const p1 = {
    x: center.x - direction.x * halfLength,
    y: center.y - direction.y * halfLength,
  };
  const p2 = {
    x: center.x + direction.x * halfLength,
    y: center.y + direction.y * halfLength,
  };

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.shadowColor = "rgba(48, 55, 49, 0.28)";
  ctx.shadowBlur = 5;
  ctx.shadowOffsetY = 5;
  strokeLine(ctx, p1, p2, thickness + 1.5, "#526055", wallHeight * 0.42);
  ctx.shadowColor = "transparent";
  strokeLine(ctx, p1, p2, thickness, "#69776a", wallHeight * 0.24);
  strokeLine(ctx, p1, p2, thickness + 1, "#566459");
  strokeLine(ctx, p1, p2, thickness * 0.86, "#8f9b8b");
  strokeLine(
    ctx,
    p1,
    p2,
    Math.max(1, thickness * 0.16),
    "rgba(231, 237, 225, 0.7)",
    -thickness * 0.16,
  );
  ctx.restore();
}

function drawHammerFragments(ctx, wall, progress, width) {
  const fragmentCount = 7;
  const wallLength = distance(wall.p1, wall.p2);
  const wallAngle = Math.atan2(wall.p2.y - wall.p1.y, wall.p2.x - wall.p1.x);
  const tangent = { x: Math.cos(wallAngle), y: Math.sin(wallAngle) };
  const normal = { x: -tangent.y, y: tangent.x };
  const opacity = 1 - smoothStep(clamp((progress - 0.72) / 0.28, 0, 1));

  for (let index = 0; index < fragmentCount; index += 1) {
    const along = (index + 0.5) / fragmentCount;
    const base = {
      x: wall.p1.x + (wall.p2.x - wall.p1.x) * along,
      y: wall.p1.y + (wall.p2.y - wall.p1.y) * along,
    };
    const side = index % 2 === 0 ? -1 : 1;
    const lane = (index % 3) - 1;
    const tangentSpread = side * wallLength * (0.14 + (index % 4) * 0.022) * progress;
    const normalSpread = lane * wall.lineWidth * (1.55 + (index % 2) * 0.45) * progress;
    const lift = Math.sin(Math.PI * progress) * width * (0.032 + (index % 3) * 0.011);
    const fall = progress * progress * width * (0.02 + (index % 2) * 0.008);
    const center = {
      x: base.x + tangent.x * tangentSpread + normal.x * normalSpread,
      y:
        base.y +
        wall.height * 0.32 +
        tangent.y * tangentSpread +
        normal.y * normalSpread -
        lift +
        fall,
    };
    const fragmentLength =
      (wallLength / fragmentCount) * (1.02 + (index % 3) * 0.14);
    const rotation = wallAngle + side * progress * (0.7 + (index % 4) * 0.18);
    drawHammerFragment(
      ctx,
      center,
      fragmentLength,
      wall.lineWidth * (0.78 + (index % 2) * 0.12),
      rotation,
      wall.height,
      opacity,
    );
  }

  if (progress < 0.28) {
    const center = {
      x: (wall.p1.x + wall.p2.x) / 2,
      y: (wall.p1.y + wall.p2.y) / 2 + wall.height * 0.28,
    };
    ctx.save();
    ctx.globalAlpha = 1 - progress / 0.28;
    ctx.fillStyle = "rgba(255, 239, 191, 0.82)";
    ctx.shadowColor = "rgba(255, 210, 112, 0.9)";
    ctx.shadowBlur = width * 0.035;
    ctx.beginPath();
    ctx.arc(center.x, center.y, width * (0.012 + progress * 0.045), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawHammerWallAnimation(ctx, corners, width) {
  if (!hammerWallAnimation) return;
  const wall = segmentGeometry(hammerWallAnimation.target.segment, corners, width);
  const swing = hammerSwingStateAt(
    hammerWallAnimation.progress,
    hammerWallAnimation.target.dir.key,
  );
  if (swing.phase !== "impact") {
    drawInteriorWallSet(ctx, [wall]);
  }
}

function drawHammerDebrisAnimation(ctx, corners, width) {
  if (!hammerWallAnimation) return;
  const swing = hammerSwingStateAt(
    hammerWallAnimation.progress,
    hammerWallAnimation.target.dir.key,
  );
  if (swing.phase !== "impact") return;
  const wall = segmentGeometry(hammerWallAnimation.target.segment, corners, width);
  drawHammerFragments(ctx, wall, swing.impactAmount, width);
}

function interpolatePoint(start, end, amount) {
  return {
    x: start.x + (end.x - start.x) * amount,
    y: start.y + (end.y - start.y) * amount,
  };
}

function introDoorGeometry(outer, lineWidth, depth) {
  if (!levelIntro) return null;
  const openAmount = levelIntroStateAt(levelIntro.progress).doorOpen;
  if (openAmount <= 0.001) return null;

  const topEdge = levelIntro.start.row === 0;
  const edgeStart = topEdge ? outer.tl : outer.bl;
  const edgeEnd = topEdge ? outer.tr : outer.br;
  const startAmount = levelIntro.start.col / COLS;
  const endAmount = (levelIntro.start.col + 1) / COLS;
  const p1 = interpolatePoint(edgeStart, edgeEnd, startAmount);
  const p2 = interpolatePoint(edgeStart, edgeEnd, endAmount);
  const direction = levelIntro.start.col === 0 ? 1 : -1;
  const slide = distance(p1, p2) * 0.9 * openAmount * direction;

  return {
    topEdge,
    openAmount,
    p1,
    p2,
    shiftedP1: { x: p1.x + slide, y: p1.y },
    shiftedP2: { x: p2.x + slide, y: p2.y },
    gap: {
      left: Math.min(p1.x, p2.x) - lineWidth * 0.72,
      right: Math.max(p1.x, p2.x) + lineWidth * 0.72,
      top: p1.y - lineWidth * 1.5,
      bottom: p1.y + depth + lineWidth * 1.5,
    },
  };
}

function clipOuterFrameAroundDoor(ctx, outer, door, depth) {
  const minimumX = Math.min(outer.tl.x, outer.bl.x) - depth * 4;
  const maximumX = Math.max(outer.tr.x, outer.br.x) + depth * 4;
  const minimumY = outer.tl.y - depth * 4;
  const maximumY = outer.bl.y + depth * 5;
  ctx.beginPath();
  ctx.rect(minimumX, minimumY, maximumX - minimumX, maximumY - minimumY);
  ctx.rect(
    door.gap.left,
    door.gap.top,
    door.gap.right - door.gap.left,
    door.gap.bottom - door.gap.top,
  );
  ctx.clip("evenodd");
}

function drawSlidingIntroDoor(ctx, door, lineWidth, depth) {
  const backDepth = depth * 0.25;
  const visibleDepth = door.topEdge ? backDepth : depth;

  ctx.save();
  ctx.shadowColor = "rgba(43, 52, 45, 0.3)";
  ctx.shadowBlur = lineWidth * 0.45;
  ctx.shadowOffsetY = lineWidth * 0.28;
  for (let layer = Math.ceil(visibleDepth); layer >= 1; layer -= 1) {
    strokeLine(
      ctx,
      door.shiftedP1,
      door.shiftedP2,
      lineWidth,
      layer > visibleDepth * 0.55 ? "#5b685c" : "#718072",
      layer,
    );
  }
  ctx.shadowColor = "transparent";
  strokeLine(ctx, door.shiftedP1, door.shiftedP2, lineWidth + 3, "#566359");
  strokeLine(ctx, door.shiftedP1, door.shiftedP2, lineWidth, "#8d9989");
  strokeLine(
    ctx,
    door.shiftedP1,
    door.shiftedP2,
    Math.max(2, lineWidth * 0.2),
    "rgba(224, 231, 218, 0.72)",
    -lineWidth * 0.2,
  );
  ctx.restore();
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

  const drawFrame = () => {
    for (let layer = Math.ceil(depth); layer >= 1; layer -= 1) {
      drawSideFaces(layer, lineWidth, layer > depth * 0.55 ? "#5b685c" : "#718072");
    }
    drawPath(0, lineWidth + 3, "#566359");
    drawPath(0, lineWidth, "#8d9989");
    drawPath(
      -lineWidth * 0.2,
      Math.max(2, lineWidth * 0.2),
      "rgba(224, 231, 218, 0.72)",
    );
  };

  const door = introDoorGeometry(outer, lineWidth, depth);
  if (!door) {
    drawFrame();
    return;
  }

  ctx.save();
  clipOuterFrameAroundDoor(ctx, outer, door, depth);
  drawFrame();
  ctx.restore();
  drawSlidingIntroDoor(ctx, door, lineWidth, depth);
}

function easeMouseMotion(progress) {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

function currentMouseVisualState() {
  if (levelIntro) {
    const state = levelIntroStateAt(levelIntro.progress);
    const outsideRow = levelIntro.start.row === 0 ? -1 : ROWS;
    const walking = state.walkProgress > 0 && state.walkProgress < 1;
    return {
      row:
        outsideRow +
        (levelIntro.start.row - outsideRow) * state.walkProgress,
      col: levelIntro.start.col,
      step: walking ? Math.abs(Math.sin(state.walkProgress * Math.PI * 4)) : 0,
    };
  }

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

function getMouseWalkSprite() {
  if (mouseFacingDirection === "right") return mouseWalkRightSprite;
  if (mouseFacingDirection === "up") return mouseWalkUpSprite;
  if (mouseFacingDirection === "down") return mouseWalkDownSprite;
  return mouseWalkLeftSprite;
}

function getPowerVisual(powerKey) {
  if (powerKey === "crystal") {
    return {
      sprite: crystalSprite,
      transformSprite: crystalTransformSprite,
      transformStartScale: 1,
      transformScale: 1.24,
      scale: 1.5,
      glow: "rgba(222, 55, 49, 0.98)",
    };
  }
  if (powerKey === "tornado") {
    return {
      sprite: tornadoSprite,
      transformSprite: tornadoTransformSprite,
      transformStartScale: 0.82,
      transformScale: 1.55,
      scale: 1.55,
      glow: "rgba(222, 55, 49, 0.98)",
    };
  }
  if (powerKey === "fishing") {
    return {
      sprite: fishingSprite,
      transformSprite: fishingTransformSprite,
      transformStartScale: 0.9,
      transformScale: 1.72,
      scale: 1.72,
      glow: null,
    };
  }
  if (powerKey === "hammer") {
    return {
      sprite: hammerSprite,
      transformSprite: hammerTransformSprite,
      transformStartScale: 0.9,
      transformScale: 1.28,
      scale: 1.28,
      glow: null,
    };
  }
  return {
    sprite: rocketSprite,
    transformSprite: rocketTransformSprite,
    transformStartScale: 0.82,
    transformScale: 1.35,
    scale: 1.35,
    glow: null,
  };
}

function powerTransformationAmount(progress, direction) {
  const rawProgress = clamp(progress, 0, 1);
  return direction === "in" ? rawProgress : 1 - rawProgress;
}

function powerTransformationFrameIndex(progress, direction) {
  const powerAmount = powerTransformationAmount(progress, direction);
  const frameProgress = clamp(
    (powerAmount - POWER_TRANSFORM_MOUSE_BLEND_RATIO) /
      (1 - POWER_TRANSFORM_MOUSE_BLEND_RATIO),
    0,
    1,
  );
  return Math.min(
    POWER_TRANSFORM_FRAME_COUNT - 1,
    Math.floor(frameProgress * POWER_TRANSFORM_FRAME_COUNT),
  );
}

function drawNeutralMouse(ctx, center, cellWidth, opacity = 1) {
  const mouseWalkSprite = getMouseWalkSprite();
  if (mouseWalkSprite.complete && mouseWalkSprite.naturalWidth) {
    drawSpriteFrame(ctx, mouseWalkSprite, 3, 4, center, cellWidth * MOUSE_IDLE_SCALE, 0.72, opacity);
    return;
  }
  drawSprite(
    ctx,
    mouseSprite,
    center,
    cellWidth * MOUSE_FALLBACK_SCALE,
    0.72,
    "source-over",
    null,
    opacity,
  );
}

function drawTransformedPower(
  ctx,
  powerKey,
  center,
  cellWidth,
  glowColor = null,
  opacity = 1,
  flipX = 1,
) {
  const powerVisual = getPowerVisual(powerKey);
  const hasTransformSprite =
    powerVisual.transformSprite.complete &&
    powerVisual.transformSprite.naturalWidth;
  const spriteSize =
    cellWidth * (hasTransformSprite ? powerVisual.transformScale : powerVisual.scale);
  let drawCenter = center;

  ctx.save();
  if (
    powerKey === "tornado" &&
    tornadoWallAnimation &&
    tornadoWallAnimation.progress >= 0.86
  ) {
    const pivotY = center.y - spriteSize * 0.22;
    const rotation =
      tornadoWallAnimation.progress * Math.PI * 12 +
      Math.sin(tornadoWallAnimation.progress * Math.PI * 8) * 0.12;
    const pulse = 1 + Math.sin(tornadoWallAnimation.progress * Math.PI) * 0.08;
    ctx.translate(center.x, pivotY);
    ctx.rotate(rotation);
    ctx.scale(pulse, pulse);
    drawCenter = { x: 0, y: spriteSize * 0.22 };
  }
  if (flipX < 0) {
    ctx.translate(drawCenter.x, drawCenter.y);
    ctx.scale(-1, 1);
    drawCenter = { x: 0, y: 0 };
  }

  if (hasTransformSprite) {
    drawSpriteFrame(
      ctx,
      powerVisual.transformSprite,
      POWER_TRANSFORM_FRAME_COUNT - 1,
      POWER_TRANSFORM_FRAME_COUNT,
      drawCenter,
      spriteSize,
      0.72,
      opacity,
      glowColor,
    );
  } else {
    drawSprite(
      ctx,
      powerVisual.sprite,
      drawCenter,
      spriteSize,
      0.72,
      "source-over",
      glowColor,
      opacity,
    );
  }
  ctx.restore();
}

function drawPivotedHammer(ctx, pivot, cellWidth, rotation, flipX, impactPulse) {
  const powerVisual = getPowerVisual("hammer");
  const hasTransformSprite =
    powerVisual.transformSprite.complete && powerVisual.transformSprite.naturalWidth;
  const sprite = hasTransformSprite ? powerVisual.transformSprite : powerVisual.sprite;
  if (!sprite.complete || !sprite.naturalWidth || !sprite.naturalHeight) return;

  const size =
    cellWidth * (hasTransformSprite ? powerVisual.transformScale : powerVisual.scale);
  const frameCount = hasTransformSprite ? POWER_TRANSFORM_FRAME_COUNT : 1;
  const frameWidth = sprite.naturalWidth / frameCount;
  const frameIndex = frameCount - 1;

  ctx.save();
  ctx.translate(pivot.x, pivot.y);
  ctx.rotate(rotation);
  ctx.scale(flipX * (1 + impactPulse), 1 - impactPulse * 0.3);
  ctx.shadowColor = "rgba(40, 46, 40, 0.3)";
  ctx.shadowBlur = size * 0.14;
  ctx.shadowOffsetY = size * 0.1;
  ctx.drawImage(
    createAlbinoSkinPreview(sprite),
    frameIndex * frameWidth,
    0,
    frameWidth,
    sprite.naturalHeight,
    -HAMMER_SPRITE_PIVOT.x * size,
    -HAMMER_SPRITE_PIVOT.y * size,
    size,
    size,
  );
  ctx.restore();
}

function drawHammerSwing(ctx, corners, mouseCenter, cellWidth) {
  if (!hammerWallAnimation) return;
  const directionKey = hammerWallAnimation.target.dir.key;
  const profile = HAMMER_SWING_PROFILES[directionKey] ?? HAMMER_SWING_PROFILES.up;
  const wall = segmentGeometry(
    hammerWallAnimation.target.segment,
    corners,
    mazeLayout.width,
  );
  const wallCenter = {
    x: (wall.p1.x + wall.p2.x) / 2,
    y: (wall.p1.y + wall.p2.y) / 2 + wall.height * 0.25,
  };
  const vector = {
    x: wallCenter.x - mouseCenter.x,
    y: wallCenter.y - mouseCenter.y,
  };
  const vectorLength = Math.max(1, Math.hypot(vector.x, vector.y));
  const direction = { x: vector.x / vectorLength, y: vector.y / vectorLength };
  const directionAngle = Math.atan2(direction.y, direction.x);
  const swing = hammerSwingStateAt(hammerWallAnimation.progress, directionKey);
  const perspectiveCorrection =
    directionAngle + Math.PI / 2 - profile.impactRotation;
  const pivot = {
    x: mouseCenter.x - direction.x * cellWidth * 0.12,
    y: mouseCenter.y - direction.y * cellWidth * 0.12,
  };
  const impactPulse =
    swing.phase === "impact"
      ? Math.sin(Math.min(1, swing.impactAmount / 0.16) * Math.PI) * 0.08
      : 0;

  drawPivotedHammer(
    ctx,
    pivot,
    cellWidth,
    swing.rotation + perspectiveCorrection,
    swing.flipX,
    impactPulse,
  );
}

function quadraticPoint(start, control, end, progress) {
  const inverse = 1 - progress;
  return {
    x:
      inverse * inverse * start.x +
      2 * inverse * progress * control.x +
      progress * progress * end.x,
    y:
      inverse * inverse * start.y +
      2 * inverse * progress * control.y +
      progress * progress * end.y,
  };
}

function rotateOffset(offset, rotation) {
  const cosine = Math.cos(rotation);
  const sine = Math.sin(rotation);
  return {
    x: offset.x * cosine - offset.y * sine,
    y: offset.x * sine + offset.y * cosine,
  };
}

function fishingCastPhaseAt(progress) {
  const value = clamp(progress, 0, 1);
  if (value < FISHING_WINDUP_END) {
    return {
      phase: "windup",
      amount: smoothStep(value / FISHING_WINDUP_END),
    };
  }
  if (value < FISHING_CAST_END) {
    return {
      phase: "cast",
      amount: smoothStep(
        (value - FISHING_WINDUP_END) / (FISHING_CAST_END - FISHING_WINDUP_END),
      ),
    };
  }
  if (value < FISHING_HOOK_END) {
    return {
      phase: "hook",
      amount: (value - FISHING_CAST_END) / (FISHING_HOOK_END - FISHING_CAST_END),
    };
  }
  if (value < FISHING_REEL_END) {
    return {
      phase: "reel",
      amount: smoothStep(
        (value - FISHING_HOOK_END) / (FISHING_REEL_END - FISHING_HOOK_END),
      ),
    };
  }
  return {
    phase: "settle",
    amount: smoothStep((value - FISHING_REEL_END) / (1 - FISHING_REEL_END)),
  };
}

function fishingCastVisualStateAt(progress, mouseCenter, targetCenter, cellWidth) {
  const phase = fishingCastPhaseAt(progress);
  const targetVector = {
    x: targetCenter.x - mouseCenter.x,
    y: targetCenter.y - mouseCenter.y,
  };
  const targetDistance = Math.max(1, Math.hypot(targetVector.x, targetVector.y));
  const direction = {
    x: targetVector.x / targetDistance,
    y: targetVector.y / targetDistance,
  };
  const castSide = direction.x >= 0 ? 1 : -1;
  const mirrorX = direction.x >= 0 ? 1 : -1;
  const spriteSize = cellWidth * FISHING_ACTION_SCALE;
  const pivot = {
    x: mouseCenter.x,
    y: mouseCenter.y + cellWidth * 0.16,
  };
  const sourceTipOffset = {
    x:
      (FISHING_ROD_TIP.x - FISHING_SPRITE_PIVOT.x) *
      spriteSize *
      mirrorX,
    y: (FISHING_ROD_TIP.y - FISHING_SPRITE_PIVOT.y) * spriteSize,
  };
  const sourceRodAngle = Math.atan2(sourceTipOffset.y, sourceTipOffset.x);
  const readyAngle = sourceRodAngle;
  const windupAngle = readyAngle + castSide * FISHING_WINDUP_ARC;
  const followThroughAngle =
    readyAngle - castSide * FISHING_FOLLOW_THROUGH_ARC;
  let rodAngle = readyAngle;
  let hookCenter = targetCenter;
  let cheeseCenter = targetCenter;
  let reelRotation = 0;
  let lineSlack = 0;

  if (phase.phase === "windup") {
    rodAngle = readyAngle + (windupAngle - readyAngle) * phase.amount;
  } else if (phase.phase === "cast") {
    rodAngle = windupAngle + (followThroughAngle - windupAngle) * phase.amount;
    reelRotation = phase.amount * Math.PI * 10;
  } else if (phase.phase === "hook") {
    rodAngle = followThroughAngle +
      (readyAngle - followThroughAngle) * smoothStep(phase.amount);
    reelRotation = Math.PI * 10;
  } else if (phase.phase === "reel") {
    rodAngle = readyAngle + castSide * 0.07 * Math.sin(phase.amount * Math.PI);
    reelRotation = Math.PI * 10 - phase.amount * Math.PI * 15;
  } else {
    rodAngle = readyAngle;
    reelRotation = -Math.PI * 5;
  }

  const assemblyRotation = rodAngle - sourceRodAngle;
  const rotatedTipOffset = rotateOffset(sourceTipOffset, assemblyRotation);
  const rodTip = {
    x: pivot.x + rotatedTipOffset.x,
    y: pivot.y + rotatedTipOffset.y,
  };
  const windupTipOffset = rotateOffset(
    sourceTipOffset,
    windupAngle - sourceRodAngle,
  );
  const releaseTip = {
    x: pivot.x + windupTipOffset.x,
    y: pivot.y + windupTipOffset.y,
  };

  if (phase.phase === "windup") {
    hookCenter = {
      x: rodTip.x - castSide * cellWidth * 0.08,
      y: rodTip.y + cellWidth * 0.28,
    };
    lineSlack = cellWidth * (0.2 + phase.amount * 0.08);
  } else if (phase.phase === "cast") {
    const castControl = {
      x: (releaseTip.x + targetCenter.x) / 2,
      y:
        Math.min(releaseTip.y, targetCenter.y) -
        Math.min(targetDistance * 0.3, cellWidth * 1.25),
    };
    hookCenter = quadraticPoint(releaseTip, castControl, targetCenter, phase.amount);
    lineSlack = cellWidth * 0.08 * (1 - phase.amount);
  } else if (phase.phase === "hook") {
    hookCenter = {
      x: targetCenter.x,
      y: targetCenter.y - Math.sin(phase.amount * Math.PI * 2) * cellWidth * 0.035,
    };
  } else if (phase.phase === "reel") {
    const retrieveControl = {
      x: (targetCenter.x + mouseCenter.x) / 2,
      y:
        Math.min(targetCenter.y, mouseCenter.y) -
        Math.min(targetDistance * 0.18, cellWidth * 0.72),
    };
    hookCenter = quadraticPoint(targetCenter, retrieveControl, mouseCenter, phase.amount);
    cheeseCenter = hookCenter;
  } else {
    hookCenter = { ...mouseCenter };
    cheeseCenter = { ...mouseCenter };
  }

  return {
    ...phase,
    pivot,
    rodBase: pivot,
    rodTip,
    assemblyRotation,
    mirrorX,
    hookCenter,
    cheeseCenter,
    reelRotation,
    lineSlack,
  };
}

function drawFishingBodyAndReel(ctx, state, cellWidth) {
  const powerVisual = getPowerVisual("fishing");
  const sprite = powerVisual.transformSprite;
  if (!sprite.complete || !sprite.naturalWidth || !sprite.naturalHeight) {
    drawTransformedPower(ctx, "fishing", state.pivot, cellWidth, null, 1, state.mirrorX);
    return;
  }

  const frameWidth = sprite.naturalWidth / POWER_TRANSFORM_FRAME_COUNT;
  const frameHeight = sprite.naturalHeight;
  const size = cellWidth * FISHING_ACTION_SCALE;
  const crop = {
    x: frameWidth * 0.16,
    y: frameHeight * 0.055,
    width: frameWidth * 0.55,
    height: frameHeight * 0.84,
  };
  const destination = {
    x: (0.16 - FISHING_SPRITE_PIVOT.x) * size,
    y: (0.055 - FISHING_SPRITE_PIVOT.y) * size,
    width: 0.55 * size,
    height: 0.84 * size,
  };

  ctx.save();
  ctx.translate(state.pivot.x, state.pivot.y);
  ctx.rotate(state.assemblyRotation);
  ctx.scale(state.mirrorX, 1);
  ctx.shadowColor = "rgba(40, 46, 40, 0.3)";
  ctx.shadowBlur = size * 0.12;
  ctx.shadowOffsetY = size * 0.08;
  ctx.drawImage(
    createAlbinoSkinPreview(sprite),
    (POWER_TRANSFORM_FRAME_COUNT - 1) * frameWidth + crop.x,
    crop.y,
    crop.width,
    crop.height,
    destination.x,
    destination.y,
    destination.width,
    destination.height,
  );
  ctx.shadowColor = "transparent";

  const reelCenter = {
    x: (0.5 - FISHING_SPRITE_PIVOT.x) * size,
    y: (0.61 - FISHING_SPRITE_PIVOT.y) * size,
  };
  const reelRadius = cellWidth * 0.22;
  ctx.save();
  ctx.translate(reelCenter.x, reelCenter.y);
  const reelGradient = ctx.createRadialGradient(
    -reelRadius * 0.3,
    -reelRadius * 0.35,
    reelRadius * 0.08,
    0,
    0,
    reelRadius,
  );
  reelGradient.addColorStop(0, "#f4b2b0");
  reelGradient.addColorStop(0.72, "#d98990");
  reelGradient.addColorStop(1, "#a9616d");
  ctx.fillStyle = reelGradient;
  ctx.strokeStyle = "#f0d7cc";
  ctx.lineWidth = Math.max(1.5, cellWidth * 0.045);
  ctx.beginPath();
  ctx.arc(0, 0, reelRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.rotate(state.reelRotation);
  strokeLine(
    ctx,
    { x: 0, y: 0 },
    { x: reelRadius * 1.35, y: 0 },
    cellWidth * 0.07,
    "#777074",
  );
  ctx.fillStyle = "#e88f96";
  ctx.beginPath();
  ctx.arc(reelRadius * 1.48, 0, cellWidth * 0.105, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.restore();
}

function drawFishingLineAndHook(ctx, state, cellWidth) {
  const bobberCenter = {
    x: state.hookCenter.x,
    y: state.hookCenter.y - cellWidth * 0.18,
  };
  const lineControl = {
    x: (state.rodTip.x + bobberCenter.x) / 2,
    y: (state.rodTip.y + bobberCenter.y) / 2 + state.lineSlack,
  };

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(state.rodTip.x, state.rodTip.y);
  ctx.quadraticCurveTo(lineControl.x, lineControl.y, bobberCenter.x, bobberCenter.y);
  ctx.lineCap = "round";
  ctx.lineWidth = Math.max(1.6, cellWidth * 0.055);
  ctx.strokeStyle = "rgba(126, 105, 88, 0.4)";
  ctx.stroke();
  ctx.lineWidth = Math.max(1.1, cellWidth * 0.032);
  ctx.strokeStyle = "#f1dfc4";
  ctx.stroke();

  const bobberRadius = cellWidth * 0.13;
  ctx.fillStyle = "#f2ddd0";
  ctx.strokeStyle = "#b66f74";
  ctx.lineWidth = Math.max(1, cellWidth * 0.025);
  ctx.beginPath();
  ctx.arc(bobberCenter.x, bobberCenter.y, bobberRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#e78d95";
  ctx.beginPath();
  ctx.arc(
    bobberCenter.x,
    bobberCenter.y,
    bobberRadius,
    Math.PI,
    Math.PI * 2,
  );
  ctx.fill();

  const hookTop = bobberCenter.y + bobberRadius;
  ctx.beginPath();
  ctx.moveTo(bobberCenter.x, hookTop);
  ctx.lineTo(bobberCenter.x, state.hookCenter.y + cellWidth * 0.04);
  ctx.arc(
    bobberCenter.x - cellWidth * 0.055,
    state.hookCenter.y + cellWidth * 0.04,
    cellWidth * 0.055,
    0,
    Math.PI * 0.88,
  );
  ctx.lineWidth = Math.max(2, cellWidth * 0.065);
  ctx.strokeStyle = "#777176";
  ctx.lineCap = "round";
  ctx.stroke();
  ctx.restore();
}

function drawFishingCast(ctx, mouseCenter, targetCenter, cellWidth) {
  const state = fishingCastVisualStateAt(
    fishingCatchProgress,
    mouseCenter,
    targetCenter,
    cellWidth,
  );
  drawFishingLineAndHook(ctx, state, cellWidth);
  drawFishingBodyAndReel(ctx, state, cellWidth);
}

function drawRocketSmokeRing(ctx, center, cellWidth, progress, opacity = 1) {
  const amount = clamp(progress, 0, 1);
  if (amount <= 0 || opacity <= 0) return;
  const spread = smoothStep(amount);

  ctx.save();
  for (let index = 0; index < 12; index += 1) {
    const angle = (index / 12) * Math.PI * 2 + (index % 2) * 0.16;
    const distanceFromCenter =
      cellWidth * (0.12 + spread * 0.72) * (0.82 + (index % 3) * 0.09);
    const radius = cellWidth * (0.09 + spread * 0.11) * (0.82 + (index % 2) * 0.18);
    const puffX = center.x + Math.cos(angle) * distanceFromCenter;
    const puffY = center.y + Math.sin(angle) * distanceFromCenter * 0.44;
    const puffOpacity = opacity * (1 - spread * 0.38) * (0.72 + (index % 3) * 0.09);
    ctx.beginPath();
    ctx.arc(puffX, puffY, radius, 0, Math.PI * 2);
    ctx.shadowColor = `rgba(102, 111, 103, ${puffOpacity * 0.36})`;
    ctx.shadowBlur = radius * 0.85;
    ctx.fillStyle = `rgba(151, 159, 151, ${puffOpacity * 0.96})`;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(
      puffX - radius * 0.18,
      puffY - radius * 0.22,
      radius * 0.58,
      0,
      Math.PI * 2,
    );
    ctx.shadowColor = "transparent";
    ctx.fillStyle = `rgba(238, 237, 228, ${puffOpacity * 0.88})`;
    ctx.fill();
  }
  ctx.restore();
}

function drawRocketFlame(ctx, bodyHeight, flameAmount, pulse) {
  if (flameAmount <= 0) return;
  const tailY = bodyHeight * 0.48;
  const flameLength = bodyHeight * (0.18 + flameAmount * 0.22) * pulse;
  const flameWidth = bodyHeight * (0.115 + flameAmount * 0.035);
  const gradient = ctx.createLinearGradient(0, tailY, 0, tailY + flameLength);
  gradient.addColorStop(0, "rgba(255, 244, 159, 0.98)");
  gradient.addColorStop(0.38, "rgba(255, 176, 45, 0.98)");
  gradient.addColorStop(1, "rgba(239, 76, 31, 0)");

  ctx.beginPath();
  ctx.moveTo(-flameWidth, tailY);
  ctx.quadraticCurveTo(
    -flameWidth * 0.7,
    tailY + flameLength * 0.55,
    0,
    tailY + flameLength,
  );
  ctx.quadraticCurveTo(
    flameWidth * 0.7,
    tailY + flameLength * 0.55,
    flameWidth,
    tailY,
  );
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.shadowColor = "rgba(255, 126, 35, 0.86)";
  ctx.shadowBlur = bodyHeight * 0.12 * flameAmount;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-flameWidth * 0.42, tailY);
  ctx.quadraticCurveTo(0, tailY + flameLength * 0.42, 0, tailY + flameLength * 0.7);
  ctx.quadraticCurveTo(
    flameWidth * 0.3,
    tailY + flameLength * 0.36,
    flameWidth * 0.42,
    tailY,
  );
  ctx.closePath();
  ctx.fillStyle = "rgba(255, 250, 202, 0.92)";
  ctx.fill();
  ctx.shadowColor = "transparent";
}

function drawRocketFlight(ctx, corners, cellWidth) {
  if (!rocketFlightAnimation) return;
  const sourceCenter = project(
    corners,
    (rocketFlightAnimation.from.col + 0.5) / COLS,
    (rocketFlightAnimation.from.row + 0.5) / ROWS,
  );
  const targetCenter = project(
    corners,
    (rocketFlightAnimation.to.col + 0.5) / COLS,
    (rocketFlightAnimation.to.row + 0.5) / ROWS,
  );
  const state = rocketFlightVisualStateAt(
    rocketFlightAnimation.progress,
    sourceCenter,
    targetCenter,
    cellWidth,
  );
  const bodyHeight = cellWidth * ROCKET_BODY_SCALE * state.scale;
  const aspectRatio =
    rocketFlightBodySprite.naturalWidth && rocketFlightBodySprite.naturalHeight
      ? rocketFlightBodySprite.naturalWidth / rocketFlightBodySprite.naturalHeight
      : 0.78;
  const bodyWidth = bodyHeight * aspectRatio;
  const shadowScale = 1 - state.altitude * 0.68;

  ctx.save();
  ctx.beginPath();
  ctx.ellipse(
    state.shadowCenter.x,
    state.shadowCenter.y + cellWidth * 0.23,
    cellWidth * 0.34 * shadowScale,
    cellWidth * 0.13 * shadowScale,
    0,
    0,
    Math.PI * 2,
  );
  ctx.fillStyle = `rgba(48, 56, 47, ${0.28 * (1 - state.altitude * 0.62)})`;
  ctx.fill();
  ctx.restore();

  drawRocketSmokeRing(
    ctx,
    { x: sourceCenter.x, y: sourceCenter.y + cellWidth * 0.08 },
    cellWidth,
    state.launchSmokeProgress,
    state.launchSmokeOpacity,
  );
  drawRocketSmokeRing(
    ctx,
    { x: targetCenter.x, y: targetCenter.y + cellWidth * 0.04 },
    cellWidth,
    state.impactSmokeProgress,
    1,
  );

  ctx.save();
  ctx.translate(state.center.x, state.center.y);
  ctx.rotate(state.rotation);
  const flamePulse =
    0.92 + Math.sin(rocketFlightAnimation.progress * Math.PI * 34) * 0.08;
  drawRocketFlame(ctx, bodyHeight, state.flame, flamePulse);
  ctx.shadowColor = "rgba(40, 46, 40, 0.3)";
  ctx.shadowBlur = bodyHeight * (0.08 + state.altitude * 0.07);
  ctx.shadowOffsetY = bodyHeight * 0.05;
  if (rocketFlightBodySprite.complete && rocketFlightBodySprite.naturalWidth) {
    ctx.drawImage(
      createAlbinoSkinPreview(rocketFlightBodySprite),
      -bodyWidth / 2,
      -bodyHeight / 2,
      bodyWidth,
      bodyHeight,
    );
  } else {
    drawTransformedPower(ctx, "rocket", { x: 0, y: 0 }, cellWidth * state.scale);
  }
  ctx.restore();
}

function drawPowerTransformation(ctx, center, cellWidth) {
  if (!powerTransform) return;
  const powerAmount = powerTransformationAmount(
    powerTransform.progress,
    powerTransform.direction,
  );
  const powerVisual = getPowerVisual(powerTransform.powerKey);
  if (!powerVisual.transformSprite.complete || !powerVisual.transformSprite.naturalWidth) {
    if (powerAmount < 0.5) drawNeutralMouse(ctx, center, cellWidth);
    else drawTransformedPower(ctx, powerTransform.powerKey, center, cellWidth);
    return;
  }

  const easedAmount = (1 - Math.cos(Math.PI * powerAmount)) / 2;
  const transformScale =
    powerVisual.transformStartScale +
    (powerVisual.transformScale - powerVisual.transformStartScale) * easedAmount;
  const mouseBlend = clamp(
    powerAmount / POWER_TRANSFORM_MOUSE_BLEND_RATIO,
    0,
    1,
  );
  if (mouseBlend < 1) drawNeutralMouse(ctx, center, cellWidth, 1 - mouseBlend);
  drawSpriteFrame(
    ctx,
    powerVisual.transformSprite,
    powerTransformationFrameIndex(powerTransform.progress, powerTransform.direction),
    POWER_TRANSFORM_FRAME_COUNT,
    center,
    cellWidth * transformScale,
    0.72,
    mouseBlend,
  );
}

function insetCellPolygon(polygon, amount = 0.14) {
  const center = polygon.reduce(
    (sum, point) => ({
      x: sum.x + point.x / polygon.length,
      y: sum.y + point.y / polygon.length,
    }),
    { x: 0, y: 0 },
  );
  return polygon.map((point) => ({
    x: center.x + (point.x - center.x) * (1 - amount),
    y: center.y + (point.y - center.y) * (1 - amount),
  }));
}

function drawContainedCheese(ctx, center, polygon, size) {
  ctx.save();
  tracePolygon(ctx, insetCellPolygon(polygon));
  ctx.clip();
  drawSprite(ctx, cheeseSprite, center, size, 0.5);
  ctx.restore();
}

function currentRockVisualState(rock) {
  const push = mouseMotion?.rockPush;
  if (!push || push.id !== rock.id) return { row: rock.row, col: rock.col, lift: 0 };
  const eased = easeMouseMotion(mouseMotion.progress);
  return {
    row: push.from.row + (push.to.row - push.from.row) * eased,
    col: push.from.col + (push.to.col - push.from.col) * eased,
    lift: Math.sin(mouseMotion.progress * Math.PI),
  };
}

function drawRockSprite(ctx, center, size, lift = 0) {
  if (!rockSprite.complete || !rockSprite.naturalWidth) return;
  const rockSize = size * (1 + lift * 0.035);
  ctx.save();
  ctx.shadowColor = "rgba(44, 52, 43, 0.34)";
  ctx.shadowBlur = rockSize * 0.12;
  ctx.shadowOffsetY = rockSize * (0.1 + lift * 0.02);
  ctx.drawImage(
    rockSprite,
    center.x - rockSize / 2,
    center.y - rockSize * 0.68 - size * lift * 0.07,
    rockSize,
    rockSize,
  );
  ctx.restore();
}

function drawCharacters(ctx, corners) {
  const remainingCheeses = remainingCheeseTargets();
  if (!remainingCheeses.length && !cheeseEatingAnimating && !cheeseEaten) return;

  const primaryCheese = activeFishingCatchTarget ?? cheeseEatingTarget ?? exit ?? mouse;
  const restingCheeseCenter = project(
    corners,
    (primaryCheese.col + 0.5) / COLS,
    (primaryCheese.row + 0.5) / ROWS,
  );

  const visualMouse = currentMouseVisualState();
  const mouseCenter = project(
    corners,
    (visualMouse.col + 0.5) / COLS,
    (visualMouse.row + 0.5) / ROWS,
  );
  const mouseCellWidth = distance(
    project(corners, visualMouse.col / COLS, visualMouse.row / ROWS),
    project(corners, (visualMouse.col + 1) / COLS, visualMouse.row / ROWS),
  );
  mouseCenter.y -= mouseCellWidth * visualMouse.step * 0.045;
  if (tornadoWallAnimation) {
    const vortexCenter = tornadoVortexCenterAt(
      tornadoWallAnimation.progress,
      mouseCenter,
      project(corners, 0.5, 0.5),
    );
    mouseCenter.x = vortexCenter.x;
    mouseCenter.y = vortexCenter.y;
  }
  const mouseStepScale = 1 + visualMouse.step * 0.035;
  const fishingCastState = fishingCatchAnimating && activeFishingCatchTarget
    ? fishingCastVisualStateAt(
        fishingCatchProgress,
        mouseCenter,
        restingCheeseCenter,
        mouseCellWidth,
      )
    : null;
  for (const target of remainingCheeses) {
    const revealingPush =
      mouseMotion?.rockPush &&
      keyOf(mouseMotion.rockPush.from) === keyOf(target) &&
      mouseMotion.progress > 0.22;
    if (!isCheeseVisible(target) && !revealingPush) continue;
    const polygon = cellPolygon(target, corners);
    const restingCenter = project(
      corners,
      (target.col + 0.5) / COLS,
      (target.row + 0.5) / ROWS,
    );
    const cellWidth = distance(
      project(corners, target.col / COLS, target.row / ROWS),
      project(corners, (target.col + 1) / COLS, target.row / ROWS),
    );
    const cellHeight =
      (distance(polygon[0], polygon[3]) + distance(polygon[1], polygon[2])) / 2;
    const multiCheeseScale = cheeseTargets.length > 1 ? 0.78 : 1;
    const size = Math.min(cellWidth, cellHeight) * CHEESE_SCALE * multiCheeseScale;
    const isFishingTarget =
      activeFishingCatchTarget && keyOf(target) === keyOf(activeFishingCatchTarget);
    const isEatingTarget =
      cheeseEatingTarget && keyOf(target) === keyOf(cheeseEatingTarget);
    if (
      isEatingTarget &&
      cheeseEatingAnimating &&
      cheeseEatingProgress >= CHEESE_EAT_SETTLE_RATIO
    ) {
      continue;
    }

    let center = isFishingTarget && fishingCastState
      ? fishingCastState.cheeseCenter
      : restingCenter;
    let tornadoCheeseState = null;
    if (tornadoWallAnimation) {
      tornadoCheeseState = tornadoCheeseStateAt(
        tornadoWallAnimation.progress,
        restingCenter,
        project(corners, 0.5, 0.5),
        mazeLayout.width,
      );
      center = tornadoCheeseState.center;
    }

    if (tornadoCheeseState) {
      drawRotatingSprite(
        ctx,
        cheeseSprite,
        center,
        size,
        tornadoCheeseState.rotation,
        tornadoCheeseState.scale,
      );
    } else if (!isFishingTarget || !fishingCatchAnimating) {
      drawContainedCheese(ctx, center, polygon, size);
    } else {
      drawSprite(ctx, cheeseSprite, center, size, 0.5);
    }
  }


  for (const rock of [...rockPositions].sort((first, second) => first.row - second.row)) {
    const visualRock = currentRockVisualState(rock);
    const center = project(
      corners,
      (visualRock.col + 0.5) / COLS,
      (visualRock.row + 0.5) / ROWS,
    );
    const cellWidth = distance(
      project(corners, visualRock.col / COLS, visualRock.row / ROWS),
      project(corners, (visualRock.col + 1) / COLS, visualRock.row / ROWS),
    );
    drawRockSprite(ctx, center, cellWidth * ROCK_SCALE, visualRock.lift);
  }

  if (levelIntro) {
    const introState = levelIntroStateAt(levelIntro.progress);
    if (
      introState.sniffProgress > 0 &&
      mouseSniffSprite.complete &&
      mouseSniffSprite.naturalWidth
    ) {
      const sniffFrame = Math.min(3, Math.floor(introState.sniffProgress * 4));
      const sniffPulse = Math.sin(introState.sniffProgress * Math.PI * 4) * 0.01;
      drawSpriteFrame(
        ctx,
        mouseSniffSprite,
        sniffFrame,
        4,
        mouseCenter,
        mouseCellWidth * MOUSE_ACTION_SCALE * (1 + sniffPulse),
        0.72,
      );
    } else if (getMouseWalkSprite().complete && getMouseWalkSprite().naturalWidth) {
      const walkFrame = Math.min(3, Math.floor(introState.walkProgress * 4));
      drawSpriteFrame(
        ctx,
        getMouseWalkSprite(),
        walkFrame,
        4,
        mouseCenter,
        mouseCellWidth * MOUSE_IDLE_SCALE * mouseStepScale,
        0.72,
      );
    } else {
      drawSprite(ctx, mouseSprite, mouseCenter, mouseCellWidth * MOUSE_FALLBACK_SCALE, 0.72);
    }
  } else if (mouseDefeatAnimating || mouseAsleep) {
    if (
      mouseDefeatAnimating &&
      mouseDefeatProgress < MOUSE_DEFEAT_SETTLE_RATIO
    ) {
      drawSprite(ctx, mouseSprite, mouseCenter, mouseCellWidth * MOUSE_FALLBACK_SCALE, 0.72);
    } else if (mouseSleepSprite.complete && mouseSleepSprite.naturalWidth) {
      const sleepProgress = mouseAsleep
        ? 1
        : clamp(
            (mouseDefeatProgress - MOUSE_DEFEAT_SETTLE_RATIO) /
              (1 - MOUSE_DEFEAT_SETTLE_RATIO),
            0,
            1,
          );
      const sleepFrame = Math.min(3, Math.floor(sleepProgress * 4));
      const breathing =
        sleepFrame >= 2 ? Math.sin(sleepProgress * Math.PI * 4) * 0.012 : 0;
      drawSpriteFrame(
        ctx,
        mouseSleepSprite,
        sleepFrame,
        4,
        mouseCenter,
        mouseCellWidth * MOUSE_ACTION_SCALE * (1 + breathing),
        0.7,
      );
    } else {
      const tiredAmount = mouseAsleep ? 1 : mouseDefeatProgress;
      drawSprite(
        ctx,
        mouseSprite,
        { x: mouseCenter.x, y: mouseCenter.y + mouseCellWidth * tiredAmount * 0.12 },
        mouseCellWidth * MOUSE_FALLBACK_SCALE,
        0.72,
        "source-over",
        null,
        1,
      );
    }
    drawSleepSymbols(
      ctx,
      mouseCenter,
      mouseCellWidth,
      mouseAsleep ? 1 : mouseDefeatProgress,
    );
  } else if (cheeseEatingAnimating || cheeseEaten) {
    if (cheeseEatingAnimating && cheeseEatingProgress < CHEESE_EAT_SETTLE_RATIO) {
      drawSprite(ctx, mouseSprite, mouseCenter, mouseCellWidth * MOUSE_FALLBACK_SCALE, 0.72);
    } else if (mouseEatingSprite.complete && mouseEatingSprite.naturalWidth) {
      const eatingProgress = cheeseEaten
        ? 1
        : clamp(
            (cheeseEatingProgress - CHEESE_EAT_SETTLE_RATIO) /
              (1 - CHEESE_EAT_SETTLE_RATIO),
            0,
            1,
          );
      const eatingFrame = Math.min(3, Math.floor(eatingProgress * 4));
      const eatingBounce = cheeseEaten ? 0 : Math.sin(eatingProgress * Math.PI * 4) * 0.018;
      drawSpriteFrame(
        ctx,
        mouseEatingSprite,
        eatingFrame,
        4,
        mouseCenter,
        mouseCellWidth * MOUSE_ACTION_SCALE * (1 + eatingBounce),
        0.72,
      );
    } else {
      drawSprite(ctx, mouseSprite, mouseCenter, mouseCellWidth * MOUSE_FALLBACK_SCALE, 0.72);
    }
  } else if (powerTransform) {
    drawPowerTransformation(ctx, mouseCenter, mouseCellWidth);
  } else if (crystalTargeting) {
    drawTransformedPower(
      ctx,
      "crystal",
      mouseCenter,
      mouseCellWidth,
      "rgba(222, 55, 49, 0.98)",
    );
  } else if (tornadoTargeting) {
    if (tornadoWallAnimation) {
      const vortexAmount = tornadoVortexAmountAt(tornadoWallAnimation.progress);
      if (vortexAmount < 1) {
        drawTransformedPower(
          ctx,
          "tornado",
          mouseCenter,
          mouseCellWidth,
          null,
          1 - vortexAmount,
        );
      }
      if (vortexAmount > 0) {
        drawTopDownTornado(
          ctx,
          mouseCenter,
          mouseCellWidth,
          tornadoWallAnimation.progress,
          vortexAmount,
        );
      }
    } else {
      drawTransformedPower(
        ctx,
        "tornado",
        mouseCenter,
        mouseCellWidth,
        "rgba(222, 55, 49, 0.98)",
      );
    }
  } else if (fishingCatchAnimating) {
    drawFishingCast(ctx, mouseCenter, restingCheeseCenter, mouseCellWidth);
  } else if (fishingTargeting) {
    const fishingTarget = getFishingCatchTarget();
    const fishingFlip = fishingTarget && fishingTarget.col < visualMouse.col ? -1 : 1;
    drawTransformedPower(
      ctx,
      "fishing",
      mouseCenter,
      mouseCellWidth,
      null,
      1,
      fishingFlip,
    );
  } else if (hammerWallAnimation) {
    drawHammerSwing(ctx, corners, mouseCenter, mouseCellWidth);
  } else if (hammerTargeting) {
    drawTransformedPower(ctx, "hammer", mouseCenter, mouseCellWidth);
  } else if (rocketFlightAnimation) {
    drawRocketFlight(ctx, corners, mouseCellWidth);
  } else if (rocketTargeting) {
    drawTransformedPower(ctx, "rocket", mouseCenter, mouseCellWidth);
  } else if (getMouseWalkSprite().complete && getMouseWalkSprite().naturalWidth) {
    const mouseWalkSprite = getMouseWalkSprite();
    const walkFrame = mouseMotion
      ? Math.min(3, Math.floor(mouseMotion.progress * 4))
      : 3;
    drawSpriteFrame(
      ctx,
      mouseWalkSprite,
      walkFrame,
      4,
      mouseCenter,
      mouseCellWidth * MOUSE_IDLE_SCALE * mouseStepScale,
      0.72,
    );
  } else {
    drawSprite(
      ctx,
      mouseSprite,
      mouseCenter,
      mouseCellWidth * MOUSE_FALLBACK_SCALE * mouseStepScale,
      0.72,
    );
  }
}

function drawSleepSymbols(ctx, center, cellWidth, progress) {
  const reveal = clamp((progress - 0.62) / 0.38, 0, 1);
  if (reveal <= 0) return;

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(74, 91, 84, 0.96)";
  ctx.strokeStyle = "rgba(250, 246, 235, 0.9)";
  ctx.lineJoin = "round";
  ctx.shadowColor = "rgba(39, 48, 43, 0.24)";
  ctx.shadowBlur = cellWidth * 0.08;

  for (let index = 0; index < 3; index += 1) {
    const symbolReveal = clamp((reveal - index * 0.2) / 0.6, 0, 1);
    if (symbolReveal <= 0) continue;
    const fontSize = cellWidth * (0.31 - index * 0.055);
    const rise = symbolReveal * cellWidth * 0.12;
    const x = center.x + cellWidth * (0.2 + index * 0.22);
    const y = center.y - cellWidth * (0.55 + index * 0.25) - rise;
    ctx.globalAlpha = symbolReveal;
    ctx.font = `800 ${fontSize}px system-ui, sans-serif`;
    ctx.lineWidth = Math.max(1, cellWidth * 0.035);
    ctx.strokeText("Z", x, y);
    ctx.fillText("Z", x, y);
  }

  ctx.restore();
}

function drawRotatingSprite(ctx, sprite, center, size, rotation, scale = 1) {
  ctx.save();
  ctx.translate(center.x, center.y);
  ctx.rotate(rotation);
  ctx.scale(scale, scale);
  drawSprite(ctx, sprite, { x: 0, y: 0 }, size, 0.5);
  ctx.restore();
}

function drawTopDownTornado(ctx, center, cellWidth, progress, opacity) {
  const size = cellWidth * 2.55;
  const phase = progress * Math.PI * 18;

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.translate(center.x, center.y - size * 0.08);

  ctx.save();
  ctx.globalAlpha = opacity * 0.34;
  ctx.filter = `blur(${Math.max(2, size * 0.055)}px)`;
  ctx.fillStyle = "rgba(45, 49, 47, 0.72)";
  ctx.beginPath();
  ctx.ellipse(0, size * 0.16, size * 0.52, size * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const bodyGradient = ctx.createRadialGradient(0, 0, size * 0.06, 0, 0, size * 0.52);
  bodyGradient.addColorStop(0, "rgba(78, 78, 80, 0.98)");
  bodyGradient.addColorStop(0.32, "rgba(151, 148, 149, 0.96)");
  bodyGradient.addColorStop(0.72, "rgba(210, 202, 201, 0.78)");
  bodyGradient.addColorStop(1, "rgba(232, 218, 216, 0.08)");
  ctx.fillStyle = bodyGradient;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.52, 0, Math.PI * 2);
  ctx.fill();

  ctx.lineCap = "round";
  for (let ring = 0; ring < 6; ring += 1) {
    const radius =
      size * (0.12 + ring * 0.067) + Math.sin(phase * 0.42 + ring * 1.3) * size * 0.012;
    const start = phase * (0.62 + ring * 0.035) + ring * 1.15;
    const arcLength = Math.PI * (0.7 + ring * 0.055);
    ctx.beginPath();
    ctx.arc(0, 0, radius, start, start + arcLength);
    ctx.lineWidth = Math.max(2.2, size * (0.092 - ring * 0.009));
    ctx.strokeStyle =
      ring % 3 === 1 ? "rgba(224, 139, 151, 0.9)" : "rgba(118, 117, 120, 0.88)";
    ctx.shadowColor = ring % 3 === 1 ? "rgba(235, 139, 151, 0.55)" : "rgba(65, 65, 68, 0.36)";
    ctx.shadowBlur = size * 0.06;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, radius, start + Math.PI, start + Math.PI + arcLength * 0.46);
    ctx.lineWidth = Math.max(1.4, size * (0.052 - ring * 0.004));
    ctx.strokeStyle = "rgba(246, 233, 228, 0.72)";
    ctx.shadowBlur = 0;
    ctx.stroke();
  }

  const funnelPulse = 1 + Math.sin(phase * 0.85) * 0.08;
  const funnelGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.15);
  funnelGradient.addColorStop(0, "rgba(40, 39, 42, 0.98)");
  funnelGradient.addColorStop(0.58, "rgba(83, 80, 84, 0.96)");
  funnelGradient.addColorStop(1, "rgba(172, 156, 158, 0.1)");
  ctx.fillStyle = funnelGradient;
  ctx.beginPath();
  ctx.ellipse(
    0,
    0,
    size * 0.15 * funnelPulse,
    size * 0.11 * funnelPulse,
    phase * 0.08,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  ctx.restore();
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
  opacity = 1,
) {
  if (!sprite.complete || !sprite.naturalWidth || opacity <= 0) return;
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.globalCompositeOperation = blendMode;
  ctx.shadowColor = glowColor ?? "rgba(40, 46, 40, 0.3)";
  ctx.shadowBlur = glowColor ? size * 0.58 : size * 0.14;
  ctx.shadowOffsetY = glowColor ? 0 : size * 0.1;
  ctx.drawImage(
    createAlbinoSkinPreview(sprite),
    center.x - size / 2,
    center.y - size * baseline,
    size,
    size,
  );
  ctx.restore();
}

function drawSpriteFrame(
  ctx,
  sprite,
  frameIndex,
  frameCount,
  center,
  size,
  baseline,
  opacity = 1,
  glowColor = null,
) {
  if (
    !sprite.complete ||
    !sprite.naturalWidth ||
    !sprite.naturalHeight ||
    opacity <= 0
  ) {
    return;
  }
  const frameWidth = sprite.naturalWidth / frameCount;
  const safeFrame = clamp(Math.floor(frameIndex), 0, frameCount - 1);
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.shadowColor = glowColor ?? "rgba(40, 46, 40, 0.3)";
  ctx.shadowBlur = glowColor ? size * 0.58 : size * 0.14;
  ctx.shadowOffsetY = glowColor ? 0 : size * 0.1;
  ctx.drawImage(
    createAlbinoSkinPreview(sprite),
    safeFrame * frameWidth,
    0,
    frameWidth,
    sprite.naturalHeight,
    center.x - size / 2,
    center.y - size * baseline,
    size,
    size,
  );
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

function levelIntroStateAt(progress) {
  let doorOpen = 0;
  if (progress < 0.2) doorOpen = smoothStep(progress / 0.2);
  else if (progress < 0.55) doorOpen = 1;
  else if (progress < 0.72) {
    doorOpen = 1 - smoothStep((progress - 0.55) / 0.17);
  }

  return {
    doorOpen,
    walkProgress: smoothStep(clamp((progress - 0.18) / 0.4, 0, 1)),
    sniffProgress: clamp((progress - 0.72) / 0.28, 0, 1),
  };
}

function clearLevelIntroAnimation() {
  if (levelIntroFrame !== null) cancelAnimationFrame(levelIntroFrame);
  levelIntro = null;
  levelIntroFrame = null;
  mazeEl.setAttribute("aria-busy", "false");
}

function finishLevelIntroAnimation() {
  if (!levelIntro) return;
  levelIntro = null;
  levelIntroFrame = null;
  mouseFacingDirection = initialFacingForStart(levelStart);
  mazeEl.setAttribute("aria-busy", "false");
  setMovementControlsEnabled(true);
  setPowerControlsEnabled(true);
  const rockMode = LEVEL_CONFIGS[level - 1]?.rockMode;
  const hingedWallCount = LEVEL_CONFIGS[level - 1]?.hingedWallCount ?? 0;
  if (rockMode === "hidden") setMessage("A cheese is hidden beneath the rock.");
  else if (rockMode === "blocker") setMessage("Push the rock aside to open the shorter route.");
  else if (rockMode === "search") setMessage("One of these rocks is hiding the cheese.");
  else if (hingedWallCount === 1) setMessage("The hinged wall can pivot and close a passage.");
  else if (hingedWallCount > 1) setMessage("Hinged walls may reshape your route.");
  else setMessage("Study the maze, then swipe one cell at a time.");
  render();
  saveCampaignState();
}

function animateLevelIntro(timestamp) {
  if (!levelIntro) return;
  if (levelIntro.startedAt === null) levelIntro.startedAt = timestamp;
  levelIntro.progress = clamp(
    (timestamp - levelIntro.startedAt) / levelIntro.duration,
    0,
    1,
  );
  drawMaze();

  if (levelIntro.progress >= 1) {
    finishLevelIntroAnimation();
    return;
  }

  levelIntroFrame = requestAnimationFrame(animateLevelIntro);
}

function startLevelIntroAnimation(mode = "full") {
  clearLevelIntroAnimation();
  levelIntro = {
    mode,
    progress: 0,
    startedAt: null,
    duration:
      mode === "retry" ? LEVEL_INTRO_RETRY_DURATION_MS : LEVEL_INTRO_DURATION_MS,
    start: { ...levelStart },
  };
  mouseFacingDirection = levelStart.row === 0 ? "down" : "up";
  controlsPanelEl.hidden = true;
  setMovementControlsEnabled(false);
  setPowerControlsEnabled(false);
  setMessage(mode === "retry" ? "The mouse is heading back in..." : "The maze door is opening...");
  mazeEl.setAttribute("aria-busy", "true");
  updatePowerUI();
  requestMazeDraw();

  if (!canAnimateMouseMotion()) {
    finishLevelIntroAnimation();
    return;
  }

  levelIntroFrame = requestAnimationFrame(animateLevelIntro);
}

function finishMouseMotion() {
  if (!mouseMotion) return;
  const completedMotion = mouseMotion;
  const target = completedMotion.to;
  const queuedDirection = queuedMoveDirection;
  mouseMotion = null;
  mouseMotionFrame = null;
  queuedMoveDirection = null;
  movementPanelEl.classList.remove("moving");
  mazeEl.setAttribute("aria-busy", "false");
  if (completedMotion.rockPush) {
    const pushedRock = rockPositions.find(
      (rock) => rock.id === completedMotion.rockPush.id,
    );
    if (pushedRock) {
      pushedRock.row = completedMotion.rockPush.to.row;
      pushedRock.col = completedMotion.rockPush.to.col;
    }
  }
  mouse = { ...target };
  movesLeft -= 1;
  render();

  if (completedMotion.hingedWallTriggerId !== null) {
    saveCampaignState();
    return;
  }

  const reachedCheese = cheeseAt(mouse);
  if (reachedCheese) {
    startCheeseEatingAnimation(reachedCheese);
    return;
  }

  if (movesLeft <= 0) {
    startMouseDefeatAnimation();
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

function startMouseMotion(target, rockPush = null, hingedWallTrigger = null) {
  if (target.col > mouse.col) mouseFacingDirection = "right";
  else if (target.col < mouse.col) mouseFacingDirection = "left";
  else if (target.row < mouse.row) mouseFacingDirection = "up";
  else if (target.row > mouse.row) mouseFacingDirection = "down";

  mouseMotion = {
    from: { ...mouse },
    to: target,
    rockPush,
    hingedWallTriggerId: hingedWallTrigger?.id ?? null,
    progress: 0,
    startedAt: null,
  };
  movementPanelEl.classList.add("moving");
  mazeEl.setAttribute("aria-busy", "true");

  if (hingedWallTrigger) activateHingedWall(hingedWallTrigger);

  if (!canAnimateMouseMotion()) {
    mouseMotion.progress = 1;
    finishMouseMotion();
    if (hingedWallAnimation) {
      hingedWallAnimation.progress = 1;
      finishHingedWallAnimation();
    }
    return;
  }

  mouseMotionFrame = requestAnimationFrame(animateMouseMotion);
}

function hingedWallTriggerForArrival(target) {
  return hingedWalls.find(
    (wall) =>
      !wall.activated &&
      !wall.destroyed &&
      !wall.moving &&
      keyOf(wall.triggerFrom) === keyOf(target),
  );
}

function finishHingedWallAnimation() {
  if (!hingedWallAnimation) return;
  const wall = hingedWalls.find((candidate) => candidate.id === hingedWallAnimation.wallId);
  if (wall && !wall.destroyed) {
    setSegmentWall(maze, wall.destination, true);
    wall.activated = true;
    wall.moving = false;
  }
  hingedWallAnimation = null;
  hingedWallAnimationFrame = null;
  mazeEl.setAttribute("aria-busy", "false");
  const reachedCheese = cheeseAt(mouse);
  if (reachedCheese) {
    startCheeseEatingAnimation(reachedCheese);
    return;
  }
  if (movesLeft <= 0) {
    startMouseDefeatAnimation();
    return;
  }
  setMovementControlsEnabled(true);
  setPowerControlsEnabled(true);
  setMessage("The hinged wall closed the passage. Find another route or use a power.", true);
  render();
  saveCampaignState();
}

function animateHingedWall(timestamp) {
  if (!hingedWallAnimation) return;
  if (hingedWallAnimation.startedAt === null) hingedWallAnimation.startedAt = timestamp;
  hingedWallAnimation.progress = clamp(
    (timestamp - hingedWallAnimation.startedAt) / HINGED_WALL_MOVE_DURATION_MS,
    0,
    1,
  );
  drawMaze();
  if (hingedWallAnimation.progress >= 1) {
    finishHingedWallAnimation();
    return;
  }
  hingedWallAnimationFrame = requestAnimationFrame(animateHingedWall);
}

function activateHingedWall(wall) {
  if (!wall || hingedWallAnimation) return;
  wall.moving = true;
  setSegmentWall(maze, wall.source, false);
  hingedWallAnimation = {
    wallId: wall.id,
    source: { ...wall.source },
    destination: { ...wall.destination },
    hinge: { ...wall.hinge },
    progress: 0,
    startedAt: null,
  };
  setMovementControlsEnabled(false);
  setPowerControlsEnabled(false);
  mazeEl.setAttribute("aria-busy", "true");
  setMessage("The hinged wall is moving to block that passage...", true);
  requestMazeDraw();
  if (canAnimateMouseMotion()) {
    hingedWallAnimationFrame = requestAnimationFrame(animateHingedWall);
  }
}

function move(directionKey) {
  if (mouseMotion) {
    if (DIRS.some((item) => item.key === directionKey)) queuedMoveDirection = directionKey;
    return;
  }
  if (
    !movementControlsEnabled ||
    gameOver ||
    campaignComplete ||
    levelIntro ||
    crystalRevealing ||
    fishingCatchAnimating ||
    rocketFlightAnimation ||
    hingedWallAnimation ||
    powerTransform ||
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
  const target = { row: mouse.row + dir.row, col: mouse.col + dir.col };
  const hingedTrigger = hingedWallTriggerForArrival(target);
  const blockingRock = rockAt(target);
  if (!blockingRock) {
    startMouseMotion(target, null, hingedTrigger);
    return;
  }

  const rockDestination = {
    row: target.row + dir.row,
    col: target.col + dir.col,
  };
  const targetCell = maze[target.row][target.col];
  const cheeseBlocksDestination = remainingCheeseTargets().some(
    (cheese) => keyOf(cheese) === keyOf(rockDestination),
  );
  if (
    !isInside(rockDestination.row, rockDestination.col) ||
    targetCell.walls[dir.wall] ||
    rockAt(rockDestination) ||
    cheeseBlocksDestination
  ) {
    showInvalidMove("The rock cannot be pushed in that direction.");
    return;
  }

  startMouseMotion(target, {
    id: blockingRock.id,
    from: { row: blockingRock.row, col: blockingRock.col },
    to: rockDestination,
  });
}

function showInvalidMove(message = "There is a wall there. Choose another direction.") {
  mazeEl.classList.remove("invalid");
  void mazeEl.offsetWidth;
  mazeEl.classList.add("invalid");
  setMessage(message, true);
}

function animateCheeseEating(timestamp) {
  if (!cheeseEatingAnimating) return;
  if (cheeseEatingStartedAt === null) cheeseEatingStartedAt = timestamp;
  cheeseEatingProgress = clamp(
    (timestamp - cheeseEatingStartedAt) / CHEESE_EAT_DURATION_MS,
    0,
    1,
  );
  drawMaze();

  if (cheeseEatingProgress >= 1) {
    finishCheeseEatingAnimation();
    return;
  }

  cheeseEatingFrame = requestAnimationFrame(animateCheeseEating);
}

function finishCheeseEatingAnimation() {
  if (!cheeseEatingTarget) return;
  collectedCheeseKeys.add(keyOf(cheeseEatingTarget));
  cheeseEatingAnimating = false;
  cheeseEatingFrame = null;
  cheeseEatingProgress = 1;
  const remaining = remainingCheeseTargets();
  cheeseEaten = remaining.length === 0;
  cheeseEatingTarget = null;
  syncActiveExit();
  render();

  if (cheeseEaten) {
    winLevel();
    return;
  }

  gameOver = false;
  if (movesLeft <= 0) {
    startMouseDefeatAnimation();
    return;
  }
  setMovementControlsEnabled(true);
  setPowerControlsEnabled(true);
  setMessage(`${collectedCheeseKeys.size}/${cheeseTargets.length} cheeses found. Find the last one.`);
  saveCampaignState();
}

function startCheeseEatingAnimation(target = cheeseAt(mouse)) {
  if (!target || cheeseEatingAnimating || collectedCheeseKeys.has(keyOf(target))) return;
  gameOver = true;
  retryCostsAttempt = false;
  clearMouseDefeatAnimation();
  clearPowerTransformation();
  clearCrystalReveal();
  clearFishingCatchAnimation();
  clearRocketFlightAnimation();
  clearPowerTargetingState();
  cheeseEatingTarget = { ...target };
  cheeseEatingAnimating = true;
  cheeseEatingProgress = 0;
  cheeseEatingStartedAt = null;
  controlsPanelEl.hidden = true;
  setMovementControlsEnabled(false);
  setPowerControlsEnabled(false);
  updateMoveWarningUI();
  setMessage(
    cheeseTargets.length > 1
      ? `The mouse found cheese ${collectedCheeseKeys.size + 1} of ${cheeseTargets.length}.`
      : "The mouse found the cheese.",
  );
  requestMazeDraw();

  if (!canAnimateMouseMotion()) {
    finishCheeseEatingAnimation();
    return;
  }

  cheeseEatingFrame = requestAnimationFrame(animateCheeseEating);
}

function animateMouseDefeat(timestamp) {
  if (!mouseDefeatAnimating) return;
  if (mouseDefeatStartedAt === null) mouseDefeatStartedAt = timestamp;
  mouseDefeatProgress = clamp(
    (timestamp - mouseDefeatStartedAt) / MOUSE_DEFEAT_DURATION_MS,
    0,
    1,
  );
  drawMaze();

  if (mouseDefeatProgress >= 1) {
    mouseDefeatAnimating = false;
    mouseDefeatFrame = null;
    mouseAsleep = true;
    mazeEl.setAttribute("aria-busy", "false");
    requestMazeDraw();
    loseLevel("The mouse ran out of energy and needs a short rest.");
    return;
  }

  mouseDefeatFrame = requestAnimationFrame(animateMouseDefeat);
}

function startMouseDefeatAnimation() {
  if (mouseDefeatAnimating || mouseAsleep) return;
  gameOver = true;
  retryCostsAttempt = true;
  clearCheeseEatingAnimation();
  clearPowerTransformation();
  clearCrystalReveal();
  clearFishingCatchAnimation();
  clearRocketFlightAnimation();
  clearPowerTargetingState();
  mouseDefeatAnimating = true;
  mouseDefeatProgress = 0;
  mouseDefeatStartedAt = null;
  controlsPanelEl.hidden = true;
  setMovementControlsEnabled(false);
  setPowerControlsEnabled(false);
  updateMoveWarningUI();
  setMessage("The mouse is out of energy...");
  mazeEl.setAttribute("aria-busy", "true");
  requestMazeDraw();

  if (!canAnimateMouseMotion()) {
    mouseDefeatAnimating = false;
    mouseDefeatProgress = 1;
    mouseAsleep = true;
    mazeEl.setAttribute("aria-busy", "false");
    loseLevel("The mouse ran out of energy and needs a short rest.");
    return;
  }

  mouseDefeatFrame = requestAnimationFrame(animateMouseDefeat);
}

function winLevel() {
  gameOver = true;
  retryCostsAttempt = false;
  clearPowerTransformation();
  clearCrystalReveal();
  clearFishingCatchAnimation();
  clearRocketFlightAnimation();
  clearPowerTargetingState();
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
    setMessage(`Game over. You cleared the first ${LEVEL_CONFIGS.length} levels.`);
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
  clearCheeseEatingAnimation();
  clearPowerTransformation();
  clearCrystalReveal();
  clearFishingCatchAnimation();
  clearRocketFlightAnimation();
  clearPowerTargetingState();
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
  clearLevelIntroAnimation();
  clearCheeseEatingAnimation();
  clearMouseDefeatAnimation();
  clearPowerTransformation();
  clearCrystalReveal();
  clearFishingCatchAnimation();
  clearRocketFlightAnimation();
  clearPowerTargetingState();
  setMovementControlsEnabled(false);
  setPowerControlsEnabled(false);
  controlsPanelEl.hidden = false;
  maze = blankMaze();
  exit = null;
  cheeseTargets = [];
  collectedCheeseKeys = new Set();
  initialRocks = [];
  rockPositions = [];
  hiddenCheeseKeys = new Set();
  initialHingedWalls = [];
  hingedWalls = [];
  clearHingedWallAnimation();
  levelStart = { ...START };
  mouse = { ...START };
  movesLeft = 0;
  render();
  starsEl.textContent = "\u2605 \u2605 \u2605";
  setMessage(`Game over. You cleared the first ${LEVEL_CONFIGS.length} levels.`);
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

  if (!movementControlsEnabled || Math.max(absX, absY) < 26) return;
  if (absX > absY) {
    move(dx > 0 ? "right" : "left");
  } else {
    move(dy > 0 ? "down" : "up");
  }
}

mazeEl.addEventListener("pointerdown", (event) => {
  if (powerTransform || !isPowerTargeting() || powerPointerStart) return;
  powerPointerStart = {
    pointerId: event.pointerId,
    x: event.clientX,
    y: event.clientY,
  };
  mazeEl.setPointerCapture?.(event.pointerId);
});

mazeEl.addEventListener("pointerup", (event) => {
  if (powerTransform || !isPowerTargeting() || event.pointerId !== powerPointerStart?.pointerId) {
    return;
  }
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

function isSwipeExcludedTarget(target) {
  return Boolean(
    target instanceof Element &&
      target.closest(".top-bar, .power-bar, .power-shop, .controls, button"),
  );
}

gameShellEl.addEventListener("pointerdown", (event) => {
  if (
    !movementControlsEnabled ||
    isPowerTargeting() ||
    powerTransform ||
    isSwipeExcludedTarget(event.target) ||
    activeSwipePointerId !== null ||
    (event.pointerType === "mouse" && event.button !== 0)
  ) {
    return;
  }
  activeSwipePointerId = event.pointerId;
  touchStart = { x: event.clientX, y: event.clientY };
  gameShellEl.setPointerCapture?.(event.pointerId);
  event.preventDefault();
});

gameShellEl.addEventListener("pointerup", (event) => {
  if (event.pointerId !== activeSwipePointerId) return;
  handleSwipe(event.clientX, event.clientY);
  gameShellEl.releasePointerCapture?.(event.pointerId);
  activeSwipePointerId = null;
});

gameShellEl.addEventListener("pointercancel", (event) => {
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

testResetButton.addEventListener("click", resetTestGame);

document.addEventListener?.("keydown", (event) => {
  if (event.key === "Escape" && !powerShopEl.hidden) closePowerShop();
  const direction = {
    ArrowUp: "up",
    ArrowRight: "right",
    ArrowDown: "down",
    ArrowLeft: "left",
  }[event.key];
  if (direction && powerShopEl.hidden) {
    event.preventDefault();
    move(direction);
  }
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
