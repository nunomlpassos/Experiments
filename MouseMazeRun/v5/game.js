let ROWS = 11;
let COLS = 9;
let START_CORNERS = [];
let START = null;
let ACTIVE_CELL_KEYS = new Set();

function setGridDimensions(config = {}) {
  ROWS = config.rows ?? 11;
  COLS = config.cols ?? 9;
  const shape = config.shape;
  ACTIVE_CELL_KEYS = new Set();
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      if (!shape || shape[row]?.[col] !== ".") ACTIVE_CELL_KEYS.add(`${row},${col}`);
    }
  }
  START_CORNERS = [
    { row: ROWS - 1, col: COLS - 1 },
    { row: ROWS - 1, col: 0 },
    { row: 0, col: 0 },
    { row: 0, col: COLS - 1 },
  ];
  START = START_CORNERS[0];
}

setGridDimensions();
const VARIANTS_PER_LEVEL = 5;
const MAX_CHEESES_PER_LEVEL = 3;
const MAX_OBJECTIVES_PER_LEVEL = 6;
const MAX_MILK_BOTTLES_PER_LEVEL = 2;
const MAX_ROCKS_PER_LEVEL = 3;
const MAX_HINGED_WALLS_PER_LEVEL = 5;
const MIN_TUNNELS_PER_LEVEL = 3;
const MAX_TUNNELS_PER_LEVEL = 4;
const VARIANT_SEED_GAP = 104729;
const MAX_ATTEMPTS = 5;
const ATTEMPT_RECOVERY_MS = 30 * 60 * 1000;
const CRYSTAL_TUTORIAL_STORAGE_KEY = "mouseMazeCrystalTutorialV5";
const TORNADO_TUTORIAL_STORAGE_KEY = "mouseMazeTornadoTutorialV5";
const POWER_INTRO_TUTORIAL_STORAGE_KEY = "mouseMazePowerIntroTutorialV5";
const TUNNEL_TUTORIAL_STORAGE_KEY = "mouseMazeTunnelTutorialV5";
const ROTATING_TILES_TUTORIAL_STORAGE_KEY = "mouseMazeRotatingTilesTutorialV5";
const MECHANIC_TUTORIAL_STORAGE_KEY = "mouseMazeMechanicTutorialsV5";
const ATTEMPT_STORAGE_KEY = "mouseMazeAttemptStateV5";
const CAMPAIGN_STORAGE_KEY = "mouseMazeCampaignStateV5";
const WORLD_PROGRESS_STORAGE_KEY = "mouseMazeWorldProgressV5";
const MOUSE_MOVE_DURATION_MS = 280;
const MOUSE_IDLE_SCALE = 0.96;
const MOUSE_FALLBACK_SCALE = 0.9;
const MOUSE_ACTION_SCALE = 0.98;
const CHEESE_SCALE = 0.9;
const ROCK_SCALE = 1.06;
const HINGED_WALL_MOVE_DURATION_MS = 760;
const MILK_KNOCK_DURATION_MS = 1500;
const MILK_DRINK_DURATION_MS = 1450;
const PIE_BITE_DURATION_MS = 1500;
const CAR_MOVE_DURATION_MS = MOUSE_MOVE_DURATION_MS;
const CAR_CAPTURE_DURATION_MS = 1250;
const COCKROACH_MOVE_DURATION_MS = 2100;
const COCKROACH_MIN_TRIGGER_MOVES = 7;
const COCKROACH_MAX_TRIGGER_MOVES = 10;
const CAT_PAW_TRIGGER_MOVES = Object.freeze([10, 15, 20]);
const CAT_PAW_STRIKE_DURATION_MS = 1500;
const CAT_PAW_IMPACT_START = 0.5;
const CAT_PAW_IMPACT_END = 0.76;
const CROW_TRIGGER_MOVES = Object.freeze([10, 12, 14]);
const CROW_STRIKE_DURATION_MS = 1850;
const CROW_IMPACT_START = 0.42;
const CROW_FLIGHT_DIAGONALS = Object.freeze([
  Object.freeze({ originX: -1, originY: 1, rotation: 0 }),
  Object.freeze({ originX: 1, originY: 1, rotation: -Math.PI / 2 }),
  Object.freeze({ originX: -1, originY: -1, rotation: Math.PI / 2 }),
  Object.freeze({ originX: 1, originY: -1, rotation: Math.PI }),
]);
const CHEESE_EAT_DURATION_MS = 1600;
const CHEESE_EAT_SETTLE_RATIO = 0.16;
const MOUSE_DEFEAT_DURATION_MS = CHEESE_EAT_DURATION_MS;
const MOUSE_DEFEAT_SETTLE_RATIO = 0.1;
const TUNNEL_TRAVEL_DURATION_MS = 2150;
const TUNNEL_TUTORIAL_DURATION_MS = 4200;
const ROTATING_TILES_DURATION_MS = 240;
const ROTATING_TILES_TUTORIAL_HOLD_MS = 900;
const MECHANIC_TUTORIAL_DURATION_MS = 3600;
const ROTATING_TILES_START_DELAY_RATIO = 0.24;
const CLOUD_STEP_INTERVAL_MS = 2000;
const CLOUD_MOVE_DURATION_MS = 680;
const CLOUD_MAX_IDLE_STEPS = 3;
const CLOUD_FOOTPRINT_CELLS = 5;
const WATER_PREPARATION_MOVES = 4;
const WATER_AMBIENT_FRAME_MS = 50;
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
const STARTING_CURRENCY = 0;
const ECONOMY_STORAGE_KEY = "mouseMazeEconomyStateV5ZeroStart";
const POWER_GRANT_STORAGE_KEY = "mouseMazePowerGrantsV5";
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
const POWER_UNLOCK_LEVELS = Object.freeze({
  crystal: 7,
  tornado: 13,
  hammer: 17,
  fishing: 25,
  rocket: 29,
});

function isPowerUnlocked(powerKey) {
  if (globalThis.__unlockAllPowersForValidation === true) return true;
  const reachedLevel = Math.max(level, worldProgress.unlockedLevel);
  if (
    powerKey === "tornado" &&
    level === 13 &&
    LEVEL_CONFIGS[level - 1]?.tornadoIntro &&
    !tornadoTutorialUnlockedForRun &&
    (!tornadoTutorialWasSeen() || forceTornadoTutorialFromUrl())
  ) {
    return false;
  }
  if (
    ["hammer", "fishing", "rocket"].includes(powerKey) &&
    LEVEL_CONFIGS[level - 1]?.[`${powerKey}Intro`] &&
    !powerIntroTutorialUnlockedForRun.has(powerKey) &&
    (!powerIntroTutorialWasSeen(powerKey) || forcePowerIntroTutorialFromUrl(powerKey))
  ) {
    return false;
  }
  return reachedLevel >= (POWER_UNLOCK_LEVELS[powerKey] ?? Number.POSITIVE_INFINITY);
}

// Dots are exterior space, never blocked cells. Keeping the four outer corners
// playable preserves the existing entrance animation in every variation.
const BOARD_SHAPES = Object.freeze({
  compactBays: ["#########", "####..###", "####..###", "#########", "..#####..", "..#######", "#########", "###...###", "#########"],
  firstNotches: ["#########", "#########", "######...", "#########", "..#######", "..#######", "#########", "#####....", "#####.###", "#########", "#########"],
  splitPantry: ["#########", "###...###", "####..###", "#########", "#########", "..#####..", "..#######", "#########", "###..####", "###...###", "#########"],
  crookedBridge: ["#########", "#####...#", "#####...#", "#########", "...######", "...######", "#########", "######...", "##.######", "##.######", "#########"],
  sideBays: ["#########", "#########", "..#######", "..#######", "#########", "######...", "######.##", "#########", "###...###", "###...###", "#########"],
  offsetCourtyard: ["#########", "#########", "##...####", "##...####", "######.##", "######.##", "####...##", "####...##", "#########", "#########", "#########"],
  brokenCross: ["#########", "###..####", "###..####", "#########", "..#######", "..#######", "#########", "#####....", "#####.###", "#########", "#########"],
  hookedRooms: ["#########", "######..#", "######..#", "#########", "###...###", "#####.###", "#####.###", "#########", "#..######", "#..######", "#########"],
  windingFloor: ["#########", "##...####", "##...####", "######.##", "######.##", "#########", "...######", "...######", "#####.###", "#####.###", "#########"],
});

const SECTION_TWO_DIFFICULTY_RULES = Object.freeze({
  Mf: { difficulty: "Very Easy", moveMarginRatio: 0.5, minPath: 12, maxPath: 18, minTurns: 5, maxTurns: 11, minDeadEnds: 4, maxDeadEnds: 24, minSolutionJunctions: 2, minFalseBranches: 2, minFalseBranchDepth: 2, minAlternateEdges: 3, maxStraightRun: 5, loops: 10 },
  F: { difficulty: "Easy", moveMarginRatio: 0.4, minPath: 15, maxPath: 23, minTurns: 6, maxTurns: 14, minDeadEnds: 5, maxDeadEnds: 27, minSolutionJunctions: 3, minFalseBranches: 3, minFalseBranchDepth: 2, minAlternateEdges: 4, maxStraightRun: 5, loops: 9 },
  N: { difficulty: "Normal", moveMarginRatio: 0.32, minPath: 19, maxPath: 28, minTurns: 8, maxTurns: 17, minDeadEnds: 6, maxDeadEnds: 31, minSolutionJunctions: 4, minFalseBranches: 4, minFalseBranchDepth: 3, minAlternateEdges: 5, maxStraightRun: 5, loops: 8 },
  D: { difficulty: "Difficult", moveMarginRatio: 0.26, minPath: 23, maxPath: 33, minTurns: 9, maxTurns: 21, minDeadEnds: 7, maxDeadEnds: 35, minSolutionJunctions: 5, minFalseBranches: 5, minFalseBranchDepth: 3, minAlternateEdges: 6, maxStraightRun: 5, loops: 7 },
  Md: { difficulty: "Very Difficult", moveMarginRatio: 0.22, minPath: 28, maxPath: 39, minTurns: 11, maxTurns: 25, minDeadEnds: 8, maxDeadEnds: 39, minSolutionJunctions: 6, minFalseBranches: 6, minFalseBranchDepth: 4, minAlternateEdges: 6, maxStraightRun: 4, loops: 6 },
  E: { difficulty: "Extreme", moveMarginRatio: 0.18, minPath: 32, maxPath: 45, minTurns: 13, maxTurns: 28, minDeadEnds: 9, maxDeadEnds: 43, minSolutionJunctions: 7, minFalseBranches: 7, minFalseBranchDepth: 4, minAlternateEdges: 7, maxStraightRun: 4, loops: 5 },
  I: { difficulty: "Insane", moveMarginRatio: 0.14, minPath: 38, maxPath: 58, minTurns: 15, maxTurns: 34, minDeadEnds: 10, maxDeadEnds: 47, minSolutionJunctions: 8, minFalseBranches: 8, minFalseBranchDepth: 5, minAlternateEdges: 8, maxStraightRun: 3, loops: 4 },
});

function sectionTwoLevel(seed, code, shape, startOffset, cheeseCount = 1) {
  const rules = SECTION_TWO_DIFFICULTY_RULES[code];
  const extraTargets = Math.max(0, cheeseCount - 1);
  return {
    seed,
    difficultyCode: code,
    shape: shape ? BOARD_SHAPES[shape] : undefined,
    startOffset,
    cheeseCount,
    minPathRowSpan: 4,
    minPathColSpan: 4,
    maxRoutes: 3,
    maxVariantDistanceSpread: 0.55,
    ...rules,
    ...(extraTargets
      ? {
          minPath: rules.minPath + extraTargets * 5,
          maxPath: rules.maxPath + extraTargets * 8,
          minTurns: rules.minTurns + extraTargets * 2,
          minCheeseDistance: cheeseCount === 3 ? 5 : 6,
          minCheeseSeparation: 4,
          minOrderPenalty: cheeseCount === 3 ? 3 : 2,
          maxOrderPenalty: cheeseCount === 3 ? 18 : 10,
          moveMargin: Math.max(6, Math.ceil((rules.maxPath + extraTargets * 5) * 0.28)),
        }
      : {}),
  };
}
const LEGACY_LEVEL_CONFIGS = [
  {
    seed: 1129,
    rows: 5,
    cols: 5,
    boardScale: 0.72,
    difficulty: "Tutorial",
    difficultyCode: "T",
    moveLimit: 8,
    moveBudget: 8,
    minPath: 5,
    maxPath: 7,
    minTurns: 2,
    maxTurns: 5,
    minDeadEnds: 1,
    maxDeadEnds: 5,
    minAlternateEdges: 2,
    maxRoutes: 2,
    loops: 5,
    startOffset: 0,
  },
  { seed: 2113, rows: 7, cols: 7, boardScale: 0.86, difficulty: "Tutorial", difficultyCode: "T", moveMarginRatio: 0.5, minPath: 8, maxPath: 9, minTurns: 3, maxTurns: 7, minDeadEnds: 2, maxDeadEnds: 10, minSolutionJunctions: 1, minFalseBranches: 1, minAlternateEdges: 2, maxRoutes: 2, maxStraightRun: 4, loops: 8, startOffset: 1 },
  { seed: 3251, rows: 9, cols: 9, boardScale: 0.96, difficulty: "Tutorial", difficultyCode: "T", moveMarginRatio: 0.48, minPath: 11, maxPath: 12, minTurns: 4, maxTurns: 8, minDeadEnds: 3, maxDeadEnds: 13, minSolutionJunctions: 1, minFalseBranches: 1, minAlternateEdges: 3, maxRoutes: 3, maxStraightRun: 4, minPathRowSpan: 3, minPathColSpan: 3, loops: 11, startOffset: 2 },
  { seed: 4231, difficulty: "Very Easy", difficultyCode: "Mf", moveMarginRatio: 0.5, minPath: 12, maxPath: 14, minTurns: 5, maxTurns: 9, minDeadEnds: 4, maxDeadEnds: 16, minSolutionJunctions: 2, minFalseBranches: 2, minFalseBranchDepth: 2, minAlternateEdges: 3, maxStraightRun: 4, minPathRowSpan: 4, minPathColSpan: 3, loops: 13, startOffset: 3 },
  { seed: 5417, difficulty: "Very Easy", difficultyCode: "Mf", moveMarginRatio: 0.5, minPath: 13, maxPath: 15, minTurns: 5, maxTurns: 10, minDeadEnds: 4, maxDeadEnds: 16, minSolutionJunctions: 2, minFalseBranches: 2, minFalseBranchDepth: 2, minAlternateEdges: 3, maxStraightRun: 4, minPathRowSpan: 4, minPathColSpan: 3, loops: 12, startOffset: 0 },
  { seed: 6619, difficulty: "Easy", difficultyCode: "F", moveMarginRatio: 0.4, minPath: 16, maxPath: 18, minTurns: 6, maxTurns: 11, minDeadEnds: 5, maxDeadEnds: 18, minSolutionJunctions: 3, minFalseBranches: 3, minFalseBranchDepth: 2, minAlternateEdges: 4, maxStraightRun: 4, minPathRowSpan: 5, minPathColSpan: 4, loops: 11, startOffset: 1 },
  { seed: 7759, difficulty: "Very Easy", difficultyCode: "Mf", cheeseCount: 2, moveMarginRatio: 0.5, moveMargin: 8, minPath: 18, maxPath: 23, minTurns: 6, maxTurns: 13, minDeadEnds: 4, maxDeadEnds: 16, minSolutionJunctions: 2, minFalseBranches: 2, minFalseBranchDepth: 2, minAlternateEdges: 3, minCheeseDistance: 5, minCheeseSeparation: 4, minOrderPenalty: 1, maxOrderPenalty: 8, maxVariantDistanceSpread: 0.3, maxStraightRun: 4, minPathRowSpan: 4, minPathColSpan: 3, loops: 12, startOffset: 2 },
  { seed: 8819, difficulty: "Easy", difficultyCode: "F", moveMarginRatio: 0.4, minPath: 16, maxPath: 19, minTurns: 6, maxTurns: 12, minDeadEnds: 5, maxDeadEnds: 19, minSolutionJunctions: 3, minFalseBranches: 3, minFalseBranchDepth: 2, minAlternateEdges: 4, maxStraightRun: 4, minPathRowSpan: 5, minPathColSpan: 4, loops: 10, startOffset: 3 },
  { seed: 9949, difficulty: "Easy", difficultyCode: "F", cheeseCount: 2, moveMarginRatio: 0.4, moveMargin: 7, minPath: 21, maxPath: 28, minTurns: 8, maxTurns: 15, minDeadEnds: 5, maxDeadEnds: 19, minSolutionJunctions: 3, minFalseBranches: 3, minFalseBranchDepth: 2, minAlternateEdges: 4, minCheeseDistance: 6, minCheeseSeparation: 4, minOrderPenalty: 2, maxOrderPenalty: 9, maxVariantDistanceSpread: 0.35, maxStraightRun: 4, minPathRowSpan: 5, minPathColSpan: 4, loops: 10, startOffset: 0 },
  { seed: 11027, difficulty: "Normal", difficultyCode: "N", moveMarginRatio: 0.32, minPath: 20, maxPath: 23, minTurns: 8, maxTurns: 14, minDeadEnds: 6, maxDeadEnds: 21, minSolutionJunctions: 4, minFalseBranches: 4, minFalseBranchDepth: 3, minAlternateEdges: 5, maxStraightRun: 4, minPathRowSpan: 6, minPathColSpan: 5, loops: 9, startOffset: 1 },
  { seed: 12109, difficulty: "Easy", difficultyCode: "F", cheeseCount: 2, moveMarginRatio: 0.4, moveMargin: 7, minPath: 22, maxPath: 29, minTurns: 8, maxTurns: 15, minDeadEnds: 5, maxDeadEnds: 19, minSolutionJunctions: 3, minFalseBranches: 3, minFalseBranchDepth: 2, minAlternateEdges: 4, minCheeseDistance: 6, minCheeseSeparation: 4, minOrderPenalty: 2, maxOrderPenalty: 10, maxVariantDistanceSpread: 0.35, maxStraightRun: 4, minPathRowSpan: 5, minPathColSpan: 4, loops: 10, startOffset: 2 },
  { seed: 13217, difficulty: "Normal", difficultyCode: "N", cheeseCount: 2, moveMarginRatio: 0.32, moveMargin: 7, minPath: 24, maxPath: 32, minTurns: 9, maxTurns: 17, minDeadEnds: 6, maxDeadEnds: 22, minSolutionJunctions: 4, minFalseBranches: 4, minFalseBranchDepth: 3, minAlternateEdges: 5, minCheeseDistance: 6, minCheeseSeparation: 4, minOrderPenalty: 2, maxOrderPenalty: 11, maxVariantDistanceSpread: 0.35, maxStraightRun: 4, minPathRowSpan: 6, minPathColSpan: 5, loops: 8, startOffset: 3 },
  { seed: 14321, difficulty: "Normal", difficultyCode: "N", cheeseCount: 3, moveMarginRatio: 0.32, moveMargin: 8, minPath: 29, maxPath: 39, minTurns: 11, maxTurns: 20, minDeadEnds: 6, maxDeadEnds: 22, minSolutionJunctions: 4, minFalseBranches: 4, minFalseBranchDepth: 3, minAlternateEdges: 5, minCheeseDistance: 5, minCheeseSeparation: 4, minOrderPenalty: 3, maxOrderPenalty: 16, maxVariantDistanceSpread: 0.4, maxStraightRun: 4, minPathRowSpan: 6, minPathColSpan: 5, loops: 8, startOffset: 0 },
  { seed: 15427, difficulty: "Difficult", difficultyCode: "D", cheeseCount: 3, moveMarginRatio: 0.26, moveMargin: 8, minPath: 32, maxPath: 43, minTurns: 13, maxTurns: 23, minDeadEnds: 7, maxDeadEnds: 25, minSolutionJunctions: 5, minFalseBranches: 5, minFalseBranchDepth: 4, minAlternateEdges: 6, minCheeseDistance: 5, minCheeseSeparation: 4, minOrderPenalty: 4, maxOrderPenalty: 18, maxVariantDistanceSpread: 0.4, maxStraightRun: 4, minPathRowSpan: 7, minPathColSpan: 6, loops: 7, startOffset: 1 },
  sectionTwoLevel(16661, "Mf", "firstNotches", 2),
  sectionTwoLevel(17809, "F", "splitPantry", 3, 2),
  sectionTwoLevel(18917, "F", "crookedBridge", 0, 2),
  sectionTwoLevel(19997, "N", undefined, 1),
  sectionTwoLevel(21107, "F", "sideBays", 2, 2),
  sectionTwoLevel(22247, "N", "offsetCourtyard", 3, 2),
  sectionTwoLevel(23369, "N", "brokenCross", 0, 3),
  sectionTwoLevel(24481, "D", undefined, 1),
  sectionTwoLevel(25589, "N", "hookedRooms", 2, 2),
  sectionTwoLevel(26711, "D", "windingFloor", 3, 2),
  sectionTwoLevel(27827, "D", "splitPantry", 0, 3),
  sectionTwoLevel(28933, "Md", undefined, 1, 2),
  sectionTwoLevel(30047, "D", "crookedBridge", 2, 3),
  sectionTwoLevel(31159, "E", "offsetCourtyard", 3, 3),
];
const LEGACY_WORLD_LEVELS = [
  { x: 20, y: 95, objective: "Learn movement on a 5 x 5 maze", difficulty: "Tutorial · 5 x 5" },
  { x: 49, y: 88, objective: "Explore a wider 7 x 7 maze", difficulty: "Tutorial · 7 x 7" },
  { x: 78, y: 81, objective: "Master the full 9 x 9 introduction", difficulty: "Tutorial · 9 x 9" },
  { x: 62, y: 74, objective: "Find the cheese", difficulty: "Very Easy" },
  { x: 28, y: 67, objective: "Choose between two routes", difficulty: "Very Easy" },
  { x: 18, y: 60, objective: "Read the junctions", difficulty: "Easy" },
  { x: 50, y: 53, objective: "Collect both cheeses", difficulty: "Very Easy" },
  { x: 81, y: 46, objective: "Avoid the longer route", difficulty: "Easy" },
  { x: 67, y: 39, objective: "Choose the best order for two cheeses", difficulty: "Easy" },
  { x: 34, y: 32, objective: "Navigate the false turns", difficulty: "Normal" },
  { x: 18, y: 25, objective: "Collect both cheeses efficiently", difficulty: "Easy" },
  { x: 46, y: 18, objective: "Plan the order of two cheeses", difficulty: "Normal" },
  { x: 77, y: 11, objective: "Collect all three cheeses", difficulty: "Normal" },
  { x: 57, y: 4.5, objective: "Master a three-cheese Pantry finale", difficulty: "Difficult" },
  { x: 19, y: 95, objective: "Discover the first shaped maze", difficulty: "Very Easy" },
  { x: 48, y: 88, objective: "Collect two cheeses across the pantry wings", difficulty: "Easy" },
  { x: 78, y: 81, objective: "Find both cheeses in the stepped rooms", difficulty: "Easy" },
  { x: 62, y: 74, objective: "Return to the full maze", difficulty: "Normal" },
  { x: 27, y: 67, objective: "Choose the narrow crossing for both cheeses", difficulty: "Easy" },
  { x: 18, y: 60, objective: "Collect two cheeses around the outer spaces", difficulty: "Normal" },
  { x: 50, y: 53, objective: "Collect all three cheeses in the chambers", difficulty: "Normal" },
  { x: 82, y: 46, objective: "Find the route through the full maze", difficulty: "Difficult" },
  { x: 68, y: 39, objective: "Use the shape to collect both cheeses", difficulty: "Normal" },
  { x: 34, y: 32, objective: "Resist the detours and collect both cheeses", difficulty: "Difficult" },
  { x: 18, y: 25, objective: "Collect all three cheeses in the chambered maze", difficulty: "Difficult" },
  { x: 46, y: 18, objective: "Master two cheeses across the false routes", difficulty: "Very Difficult" },
  { x: 77, y: 11, objective: "Find all three cheeses beyond the crossing", difficulty: "Difficult" },
  { x: 57, y: 4.5, objective: "Finish the extreme three-cheese route", difficulty: "Extreme" },
];

function chapterLevel(seed, code, extras = {}) {
  const rules = SECTION_TWO_DIFFICULTY_RULES[code];
  return {
    seed,
    difficultyCode: code,
    startOffset: extras.startOffset ?? 0,
    maxRoutes: 3,
    minPathRowSpan: 4,
    minPathColSpan: 4,
    ...rules,
    ...extras,
  };
}

const ADVERSITY_MODE_PROPERTIES = Object.freeze({
  car: ["carMode", "chase"],
  cockroach: ["cockroachMode", "repeat"],
  catPaw: ["catPawMode", "repeat"],
  crow: ["crowMode", "repeat"],
});

function repeatedAdversity(...adversities) {
  return Array.from({ length: VARIANTS_PER_LEVEL }, () => [...adversities]);
}

function adversitiesForVariant(config, variantIndex) {
  if (Array.isArray(config.adversityVariants)) {
    const planned = config.adversityVariants[variantIndex % config.adversityVariants.length] ?? [];
    return [...new Set(Array.isArray(planned) ? planned : [planned])].filter(Boolean);
  }
  return Object.entries(ADVERSITY_MODE_PROPERTIES)
    .filter(([, [property]]) => Boolean(config[property]))
    .map(([adversity]) => adversity);
}

function resolveLevelConfigForVariant(config, variantIndex) {
  const resolved = { ...config };
  const adversities = adversitiesForVariant(config, variantIndex);
  if (Array.isArray(config.adversityVariants)) {
    for (const [, [property]] of Object.entries(ADVERSITY_MODE_PROPERTIES)) {
      delete resolved[property];
    }
  }
  for (const adversity of adversities) {
    const [property, mode] = ADVERSITY_MODE_PROPERTIES[adversity] ?? [];
    if (property) resolved[property] = mode;
  }
  resolved.activeAdversities = adversities;
  return resolved;
}

const LEVEL_BLUEPRINTS = [
  {
    seed: 1129,
    rows: 5,
    cols: 5,
    boardScale: 0.72,
    difficulty: "Tutorial",
    difficultyCode: "T",
    moveLimit: 8,
    moveBudget: 8,
    minPath: 5,
    maxPath: 7,
    minTurns: 2,
    maxTurns: 5,
    minDeadEnds: 1,
    maxDeadEnds: 5,
    minAlternateEdges: 2,
    maxRoutes: 2,
    loops: 5,
    startOffset: 0,
  },
  chapterLevel(2113, "Mf", {
    rows: 8,
    cols: 8,
    boardScale: 0.92,
    startOffset: 1,
    minPath: 12,
    maxPath: 17,
    loops: 9,
  }),
  chapterLevel(3251, "F", {
    rows: 7,
    cols: 7,
    boardScale: 0.86,
    startOffset: 2,
    milkCount: 1,
    cheeseCount: 0,
    minPath: 10,
    maxPath: 18,
    minTurns: 4,
    moveMargin: 6,
    loops: 7,
  }),
  chapterLevel(4231, "N", {
    rows: 9,
    cols: 8,
    boardScale: 0.94,
    startOffset: 3,
    milkCount: 1,
    cheeseCount: 1,
    minPath: 20,
    maxPath: 34,
    minObjectiveSeparation: 3,
    minObjectivePathDistance: 5,
    minObjectiveStartDistance: 5,
    minObjectiveRowSpan: 3,
    minObjectiveColSpan: 3,
    minObjectiveDetour: 4,
    maxPassThroughObjectives: 0,
    moveMargin: 8,
    loops: 8,
  }),
  chapterLevel(5417, "F", {
    rows: 8,
    cols: 8,
    boardScale: 0.92,
    startOffset: 0,
    milkCount: 1,
    cheeseCount: 2,
    minPath: 19,
    maxPath: 31,
    minTurns: 7,
    minObjectiveSeparation: 3,
    minObjectivePathDistance: 5,
    minObjectiveStartDistance: 5,
    minObjectiveRowSpan: 3,
    minObjectiveColSpan: 3,
    minObjectiveDetour: 4,
    maxPassThroughObjectives: 0,
    moveMargin: 7,
    loops: 8,
  }),
  chapterLevel(6619, "N", {
    rows: 9,
    cols: 9,
    boardScale: 0.96,
    startOffset: 1,
    milkCount: 2,
    cheeseCount: 1,
    minPath: 24,
    maxPath: 42,
    minObjectiveSeparation: 3,
    minObjectivePathDistance: 5,
    minObjectiveStartDistance: 5,
    minObjectiveRowSpan: 4,
    minObjectiveColSpan: 4,
    minObjectiveDetour: 6,
    maxPassThroughObjectives: 0,
    moveMargin: 9,
    loops: 8,
  }),
  chapterLevel(7759, "D", {
    startOffset: 2,
    milkCount: 1,
    cheeseCount: 2,
    minPath: 27,
    maxPath: 43,
    moveMargin: 8,
    crystalIntro: true,
    loops: 7,
  }),
  chapterLevel(8819, "D", {
    startOffset: 3,
    milkCount: 2,
    cheeseCount: 2,
    minPath: 31,
    maxPath: 49,
    moveMargin: 8,
    loops: 7,
  }),
  chapterLevel(9949, "Md", {
    startOffset: 0,
    cheeseCount: 2,
    carMode: "chase",
    minPath: 27,
    maxPath: 43,
    moveMargin: 7,
    loops: 6,
  }),
  chapterLevel(11027, "Md", {
    startOffset: 1,
    cheeseCount: 3,
    carMode: "chase",
    minPath: 32,
    maxPath: 50,
    moveMargin: 7,
    loops: 6,
    minCheeseSeparation: 4,
    minCheeseDistance: 7,
    minObjectiveRowSpan: 5,
    minObjectiveColSpan: 4,
    minObjectiveDetour: 9,
    maxPassThroughObjectives: 0,
  }),
  chapterLevel(12109, "F", {
    rows: 7,
    cols: 7,
    boardScale: 0.86,
    startOffset: 2,
    rockMode: "hidden",
    rockCount: 1,
    minPath: 11,
    maxPath: 18,
    minTurns: 5,
    moveMargin: 6,
    loops: 7,
  }),
  chapterLevel(13217, "E", {
    startOffset: 3,
    rockMode: "search",
    rockCount: 3,
    adversityVariants: repeatedAdversity("car"),
    minPath: 24,
    maxPath: 43,
    minTurns: 10,
    moveMargin: 6,
    loops: 5,
  }),
  chapterLevel(14321, "Md", {
    startOffset: 0,
    cheeseCount: 3,
    minPath: 31,
    maxPath: 47,
    minTurns: 11,
    minCheeseDistance: 5,
    minCheeseSeparation: 4,
    minOrderPenalty: 3,
    maxOrderPenalty: 18,
    moveMargin: 7,
    tornadoIntro: true,
    loops: 6,
  }),
  chapterLevel(15427, "Md", {
    rows: 7,
    cols: 7,
    boardScale: 0.86,
    startOffset: 1,
    hingedWallCount: 1,
    minPath: 18,
    maxPath: 29,
    minTurns: 8,
    minHingedDetour: 3,
    moveMargin: 6,
    loops: 5,
  }),
  chapterLevel(16547, "D", {
    rows: 7,
    cols: 7,
    boardScale: 0.86,
    startOffset: 2,
    cheeseCount: 2,
    cockroachMode: "single",
    minPath: 20,
    maxPath: 31,
    minTurns: 8,
    minCheeseDistance: 4,
    minCheeseSeparation: 4,
    minOrderPenalty: 3,
    maxOrderPenalty: 13,
    moveMargin: 6,
    loops: 5,
  }),
  chapterLevel(17659, "N", {
    rows: 9,
    cols: 9,
    boardScale: 0.96,
    startOffset: 3,
    cheeseCount: 1,
    milkCount: 2,
    cockroachMode: "repeat",
    minPath: 25,
    maxPath: 42,
    minTurns: 9,
    minObjectiveSeparation: 3,
    minObjectivePathDistance: 5,
    minObjectiveStartDistance: 6,
    minObjectiveRowSpan: 4,
    minObjectiveColSpan: 4,
    minObjectiveDetour: 6,
    maxPassThroughObjectives: 0,
    moveMargin: 8,
    loops: 8,
  }),
  chapterLevel(18749, "Md", {
    startOffset: 0,
    cheeseCount: 3,
    adversityVariants: [
      ["cockroach"],
      ["car"],
      ["cockroach"],
      ["car"],
      ["cockroach"],
    ],
    hammerIntro: true,
    minPath: 32,
    maxPath: 49,
    minTurns: 12,
    minCheeseDistance: 5,
    minCheeseSeparation: 4,
    minOrderPenalty: 4,
    maxOrderPenalty: 18,
    moveMargin: 7,
    loops: 6,
  }),
  chapterLevel(19867, "Md", {
    startOffset: 1,
    hingedWallCount: 2,
    adversityVariants: [
      ["car"],
      ["cockroach"],
      ["car"],
      ["cockroach"],
      ["car"],
    ],
    minPath: 30,
    maxPath: 48,
    minTurns: 11,
    minCheeseDistance: 6,
    minCheeseSeparation: 5,
    moveMargin: 7,
    loops: 6,
  }),
  chapterLevel(21019, "D", {
    rows: 7,
    cols: 7,
    boardScale: 0.86,
    startOffset: 2,
    pieCount: 1,
    cheeseCount: 0,
    minPath: 22,
    maxPath: 34,
    minTurns: 8,
    minDeadEnds: 5,
    moveMargin: 6,
    loops: 5,
  }),
  chapterLevel(22129, "F", {
    rows: 8,
    cols: 8,
    boardScale: 0.92,
    startOffset: 3,
    milkCount: 1,
    cheeseCount: 1,
    minPath: 17,
    maxPath: 29,
    minTurns: 7,
    minObjectiveSeparation: 3,
    minObjectivePathDistance: 5,
    minObjectiveStartDistance: 5,
    minObjectiveRowSpan: 3,
    minObjectiveColSpan: 3,
    minObjectiveDetour: 3,
    maxPassThroughObjectives: 0,
    moveMargin: 8,
    loops: 9,
  }),
  chapterLevel(23251, "N", {
    startOffset: 0,
    shape: BOARD_SHAPES.firstNotches,
    cheeseCount: 2,
    adversityVariants: [[], ["car"], [], ["cockroach"], []],
    minPath: 23,
    maxPath: 38,
    minTurns: 9,
    minCheeseDistance: 5,
    minCheeseSeparation: 4,
    moveMargin: 8,
    loops: 8,
  }),
  chapterLevel(24379, "Md", {
    startOffset: 1,
    shape: BOARD_SHAPES.splitPantry,
    rockMode: "search",
    rockCount: 3,
    adversityVariants: [
      ["car"],
      ["cockroach"],
      ["car"],
      ["cockroach"],
      ["car"],
    ],
    minPath: 29,
    maxPath: 48,
    minTurns: 11,
    minCheeseDistance: 5,
    minCheeseSeparation: 4,
    moveMargin: 7,
    loops: 6,
  }),
  chapterLevel(25409, "Md", {
    rows: 7,
    cols: 7,
    boardScale: 0.86,
    startOffset: 2,
    cheeseCount: 3,
    adversityVariants: [
      ["cockroach"],
      ["car"],
      ["cockroach"],
      ["car"],
      ["cockroach"],
    ],
    carOverlay: true,
    fishingIntro: true,
    minPath: 24,
    maxPath: 36,
    minTurns: 9,
    minCheeseDistance: 4,
    minCheeseSeparation: 3,
    minOrderPenalty: 3,
    maxOrderPenalty: 14,
    moveMargin: 6,
    loops: 5,
  }),
  chapterLevel(26561, "E", {
    startOffset: 3,
    pieCount: 1,
    cheeseCount: 0,
    adversityVariants: repeatedAdversity("car"),
    minPath: 35,
    maxPath: 54,
    minTurns: 13,
    minCheeseDistance: 5,
    minCheeseSeparation: 4,
    moveMargin: 6,
    loops: 5,
  }),
  chapterLevel(27673, "Md", {
    startOffset: 0,
    cheeseCount: 3,
    catPawIntro: true,
    adversityVariants: repeatedAdversity("catPaw"),
    minPath: 32,
    maxPath: 51,
    minTurns: 11,
    moveMargin: 7,
    loops: 6,
  }),
  chapterLevel(28793, "E", {
    startOffset: 1,
    shape: BOARD_SHAPES.hookedRooms,
    hingedWallCount: 2,
    adversityVariants: [
      ["catPaw"],
      ["car"],
      ["cockroach"],
      ["catPaw"],
      ["car"],
    ],
    minPath: 34,
    maxPath: 54,
    minTurns: 13,
    minHingedDetour: 4,
    moveMargin: 6,
    loops: 5,
  }),
  chapterLevel(29927, "E", {
    startOffset: 2,
    milkCount: 2,
    cheeseCount: 2,
    rocketIntro: true,
    adversityVariants: repeatedAdversity("catPaw"),
    minPath: 35,
    maxPath: 54,
    minTurns: 13,
    minCheeseDistance: 5,
    minCheeseSeparation: 4,
    minOrderPenalty: 4,
    maxOrderPenalty: 20,
    moveMargin: 6,
    loops: 5,
  }),
  chapterLevel(31039, "I", {
    startOffset: 3,
    cheeseCount: 3,
    adversityVariants: [
      ["car", "catPaw"],
      ["car", "cockroach"],
      ["cockroach", "catPaw"],
      ["car", "catPaw"],
      ["cockroach", "catPaw"],
    ],
    minPath: 38,
    maxPath: 58,
    minTurns: 15,
    minCheeseDistance: 6,
    minCheeseSeparation: 5,
    minOrderPenalty: 5,
    maxOrderPenalty: 22,
    moveMargin: 5,
    loops: 4,
  }),
  chapterLevel(32159, "N", {
    rows: 9,
    cols: 9,
    boardScale: 0.96,
    shape: BOARD_SHAPES.compactBays,
    startOffset: 0,
    cheeseCount: 2,
    milkCount: 1,
    adversityVariants: [["car"], [], ["cockroach"], [], ["catPaw"]],
    minPath: 26,
    maxPath: 43,
    minTurns: 9,
    minObjectiveSeparation: 3,
    minObjectivePathDistance: 5,
    minObjectiveStartDistance: 5,
    minObjectiveRowSpan: 4,
    minObjectiveColSpan: 4,
    minObjectiveDetour: 6,
    maxPassThroughObjectives: 0,
    moveMargin: 8,
    loops: 8,
  }),
  chapterLevel(33287, "D", {
    rows: 9,
    cols: 9,
    boardScale: 0.96,
    startOffset: 1,
    cheeseCount: 1,
    tunnelCount: 3,
    tunnelIntro: true,
    minPath: 23,
    maxPath: 34,
    minTurns: 9,
    moveMargin: 16,
    loops: 7,
  }),
  chapterLevel(34421, "D", {
    startOffset: 2,
    cheeseCount: 2,
    tunnelCount: 3,
    adversityVariants: repeatedAdversity("car"),
    minPath: 27,
    maxPath: 43,
    minTurns: 10,
    moveMargin: 7,
    loops: 7,
  }),
  chapterLevel(35533, "Md", {
    startOffset: 3,
    shape: BOARD_SHAPES.splitPantry,
    cheeseCount: 0,
    pieCount: 1,
    adversityVariants: repeatedAdversity("car"),
    minPath: 30,
    maxPath: 48,
    minTurns: 11,
    moveMargin: 7,
    loops: 6,
  }),
  chapterLevel(36671, "D", {
    rows: 9,
    cols: 9,
    boardScale: 0.96,
    startOffset: 0,
    cheeseCount: 2,
    rotatingCircuitCount: 1,
    rotatingMoveMargin: 10,
    rotatingTilesIntro: true,
    minPath: 24,
    maxPath: 38,
    minTurns: 9,
    moveMargin: 12,
    loops: 7,
  }),
  chapterLevel(37889, "E", {
    startOffset: 1,
    cheeseCount: 3,
    rotatingCircuitCount: 1,
    rotatingMoveMargin: 8,
    rockMode: "blocker",
    rockCount: 2,
    adversityVariants: [
      ["car"],
      ["cockroach"],
      ["catPaw"],
      ["car"],
      ["cockroach"],
    ],
    minPath: 34,
    maxPath: 52,
    minTurns: 13,
    minCheeseDistance: 5,
    minCheeseSeparation: 4,
    moveMargin: 6,
    loops: 5,
  }),
  chapterLevel(39019, "E", {
    startOffset: 2,
    cheeseCount: 2,
    crowIntro: true,
    adversityVariants: repeatedAdversity("crow"),
    minPath: 32,
    maxPath: 48,
    minTurns: 13,
    minCheeseDistance: 6,
    minCheeseSeparation: 5,
    moveMargin: 8,
    loops: 24,
  }),
  chapterLevel(40211, "I", {
    startOffset: 3,
    cheeseCount: 3,
    tunnelCount: 3,
    rotatingCircuitCount: 1,
    rotatingMoveMargin: 6,
    adversityVariants: [
      ["crow", "car"],
      ["crow", "catPaw"],
      ["crow", "cockroach"],
      ["crow", "car"],
      ["crow", "catPaw"],
    ],
    minPath: 32,
    maxPath: 52,
    minTurns: 13,
    minCheeseDistance: 6,
    minCheeseSeparation: 5,
    minOrderPenalty: 5,
    maxOrderPenalty: 22,
    moveMargin: 7,
    loops: 6,
  }),
  chapterLevel(41333, "D", {
    rows: 9,
    cols: 9,
    boardScale: 0.96,
    startOffset: 0,
    cheeseCount: 2,
    cloudMode: "intro",
    minPath: 27,
    maxPath: 42,
    minTurns: 10,
    minCheeseDistance: 6,
    minCheeseSeparation: 5,
    moveMargin: 9,
    loops: 7,
  }),
  chapterLevel(42509, "Md", {
    startOffset: 1,
    cheeseCount: 2,
    cloudMode: true,
    hingedWallCount: 2,
    adversityVariants: [
      ["car"],
      ["cockroach"],
      ["car"],
      ["cockroach"],
      ["car"],
    ],
    minPath: 30,
    maxPath: 48,
    minTurns: 11,
    minCheeseDistance: 6,
    minCheeseSeparation: 5,
    moveMargin: 7,
    loops: 7,
  }),
  chapterLevel(43651, "E", {
    startOffset: 2,
    shape: BOARD_SHAPES.hookedRooms,
    cheeseCount: 0,
    pieCount: 1,
    adversityVariants: [
      ["crow"],
      ["catPaw"],
      ["car"],
      ["crow"],
      ["car"],
    ],
    minPath: 30,
    maxPath: 50,
    minTurns: 11,
    minCheeseDistance: 6,
    minCheeseSeparation: 5,
    minOrderPenalty: 4,
    maxOrderPenalty: 20,
    moveMargin: 6,
    loops: 7,
  }),
  chapterLevel(44777, "E", {
    rows: 9,
    cols: 9,
    boardScale: 0.96,
    startOffset: 0,
    cheeseCount: 1,
    waterMode: "intro",
    waterIntro: true,
    minPath: 23,
    maxPath: 32,
    minTurns: 10,
    moveMargin: 12,
    loops: 7,
  }),
  chapterLevel(45943, "I", {
    startOffset: 3,
    cheeseCount: 1,
    waterMode: "advanced",
    minPath: 38,
    maxPath: 56,
    minTurns: 16,
    moveMargin: 7,
    loops: 4,
  }),
  chapterLevel(47057, "E", {
    startOffset: 1,
    shape: BOARD_SHAPES.firstNotches,
    cheeseCount: 2,
    milkCount: 1,
    cloudMode: true,
    adversityVariants: [
      ["car"],
      ["cockroach"],
      ["catPaw"],
      ["crow"],
      ["cockroach"],
    ],
    minPath: 34,
    maxPath: 53,
    minTurns: 13,
    minObjectiveSeparation: 4,
    minObjectivePathDistance: 5,
    minObjectiveStartDistance: 6,
    minObjectiveDetour: 5,
    maxPassThroughObjectives: 0,
    moveMargin: 6,
    loops: 5,
  }),
];

const REMIXED_LEVEL_FIELDS = Object.freeze([
  "seed", "difficulty", "difficultyCode", "rows", "cols", "boardScale", "shape",
  "cheeseCount", "milkCount", "pieCount", "rockMode", "rockCount",
  "hingedWallCount", "tunnelCount", "rotatingCircuitCount", "rotatingMoveMargin",
  "cloudMode", "waterMode", "waterIntro", "carMode", "cockroachMode",
  "catPawMode", "crowMode", "adversityVariants", "activeAdversities", "carOverlay",
  "crystalIntro", "tornadoIntro", "hammerIntro", "fishingIntro", "rocketIntro",
  "catPawIntro", "crowIntro", "tunnelIntro", "rotatingTilesIntro",
]);

function remixedLevel(sourceIndex, seed, code, extras = {}) {
  const inherited = { ...LEVEL_BLUEPRINTS[sourceIndex] };
  REMIXED_LEVEL_FIELDS.forEach((field) => delete inherited[field]);
  return chapterLevel(seed, code, { ...inherited, ...extras });
}

const alternatingCarCockroach = (first = "car") =>
  Array.from({ length: VARIANTS_PER_LEVEL }, (_, index) => [
    index % 2 === 0 ? first : first === "car" ? "cockroach" : "car",
  ]);
const rotatingAdversities = (...names) =>
  Array.from({ length: VARIANTS_PER_LEVEL }, (_, index) => [names[index % names.length]]);
const pairedAdversities = (...pairs) =>
  Array.from({ length: VARIANTS_PER_LEVEL }, (_, index) => [...pairs[index % pairs.length]]);

const LEVEL_CONFIGS = [
  remixedLevel(0, 50129, "T", {
    rows: 5, cols: 5, boardScale: 0.72, moveLimit: 8, moveBudget: 8,
    minPath: 5, maxPath: 7, minTurns: 2, maxTurns: 5, startOffset: 0,
  }),
  remixedLevel(1, 51241, "Mf", { rows: 8, cols: 8, boardScale: 0.92, startOffset: 1 }),
  remixedLevel(2, 52361, "F", {
    rows: 7, cols: 7, boardScale: 0.86, milkCount: 1, cheeseCount: 0, startOffset: 2,
  }),
  remixedLevel(3, 53479, "N", {
    rows: 9, cols: 8, boardScale: 0.94, cheeseCount: 1, milkCount: 1, startOffset: 3,
  }),
  remixedLevel(4, 54583, "F", {
    rows: 8, cols: 8, boardScale: 0.92, cheeseCount: 2, milkCount: 1, startOffset: 0,
  }),
  remixedLevel(5, 55691, "N", {
    rows: 9, cols: 9, boardScale: 0.96, cheeseCount: 1, milkCount: 2, startOffset: 1,
  }),
  remixedLevel(6, 56807, "D", {
    rows: 9, cols: 9, boardScale: 0.96, cheeseCount: 2, milkCount: 1,
    crystalIntro: true, startOffset: 2,
  }),
  remixedLevel(7, 57917, "D", { cheeseCount: 2, milkCount: 2, startOffset: 3 }),
  remixedLevel(8, 59029, "Md", {
    cheeseCount: 2, carMode: "chase", startOffset: 0,
  }),
  remixedLevel(9, 60139, "Md", {
    cheeseCount: 3, carMode: "chase", startOffset: 1,
  }),
  remixedLevel(10, 61253, "F", {
    rows: 7, cols: 7, boardScale: 0.86, rockMode: "hidden", rockCount: 1,
    cheeseCount: 1, startOffset: 2,
  }),
  remixedLevel(11, 62383, "E", {
    cheeseCount: 1, rockMode: "search", rockCount: 3,
    adversityVariants: repeatedAdversity("car"), startOffset: 3,
  }),
  remixedLevel(12, 63493, "Md", {
    rows: 9, cols: 9, boardScale: 0.96, cheeseCount: 3,
    tornadoIntro: true, startOffset: 0,
  }),
  remixedLevel(11, 64601, "E", {
    cheeseCount: 2, rockMode: "search", rockCount: 3,
    adversityVariants: repeatedAdversity("car"), startOffset: 1,
  }),

  remixedLevel(14, 65713, "D", {
    rows: 7, cols: 7, boardScale: 0.86, cheeseCount: 2,
    cockroachMode: "single", startOffset: 2,
  }),
  remixedLevel(15, 66821, "N", {
    rows: 9, cols: 9, boardScale: 0.96, cheeseCount: 1, milkCount: 2,
    cockroachMode: "repeat", startOffset: 3,
  }),
  remixedLevel(16, 67933, "Md", {
    rows: 9, cols: 9, boardScale: 0.96, cheeseCount: 3, hammerIntro: true,
    adversityVariants: [[], ["car"], ["cockroach"], ["car"], ["cockroach"]],
    startOffset: 0,
  }),
  remixedLevel(7, 69047, "Md", {
    cheeseCount: 2, milkCount: 2,
    adversityVariants: alternatingCarCockroach("car"), startOffset: 1,
  }),
  remixedLevel(19, 70163, "F", {
    rows: 8, cols: 8, boardScale: 0.92, cheeseCount: 1, milkCount: 1, startOffset: 2,
  }),
  remixedLevel(18, 71287, "D", {
    rows: 7, cols: 7, boardScale: 0.86, pieCount: 1, cheeseCount: 0, startOffset: 3,
  }),
  remixedLevel(20, 72403, "N", {
    cheeseCount: 2, adversityVariants: [[], ["car"], [], ["cockroach"], []], startOffset: 0,
  }),
  remixedLevel(13, 73517, "D", {
    rows: 7, cols: 7, boardScale: 0.86, cheeseCount: 1,
    hingedWallCount: 1, startOffset: 1,
  }),
  remixedLevel(17, 74623, "Md", {
    cheeseCount: 3, hingedWallCount: 2,
    adversityVariants: alternatingCarCockroach("cockroach"), startOffset: 2,
  }),
  remixedLevel(23, 75731, "E", {
    pieCount: 1, cheeseCount: 0, adversityVariants: repeatedAdversity("car"), startOffset: 3,
  }),
  remixedLevel(22, 25409, "Md", {
    rows: 7, cols: 7, boardScale: 0.86, cheeseCount: 3, fishingIntro: true,
    adversityVariants: [[], ["car"], ["cockroach"], ["car"], ["cockroach"]],
    startOffset: 0,
  }),
  remixedLevel(25, 77951, "E", {
    cheeseCount: 1, milkCount: 0, hingedWallCount: 2,
    adversityVariants: alternatingCarCockroach("car"), startOffset: 1,
  }),
  remixedLevel(24, 79063, "Md", {
    rows: 9, cols: 9, boardScale: 0.96, cheeseCount: 3,
    catPawIntro: true, adversityVariants: repeatedAdversity("catPaw"), startOffset: 2,
  }),
  remixedLevel(27, 80177, "I", {
    cheeseCount: 3, hingedWallCount: 2,
    adversityVariants: pairedAdversities(
      ["car", "catPaw"], ["car", "cockroach"], ["cockroach", "catPaw"],
    ),
    startOffset: 3,
  }),

  remixedLevel(28, 81283, "N", {
    rows: 9, cols: 9, boardScale: 0.96, cheeseCount: 2, milkCount: 1,
    rocketIntro: true, startOffset: 0,
  }),
  remixedLevel(29, 82421, "D", {
    cheeseCount: 2, adversityVariants: repeatedAdversity("car"), startOffset: 1,
  }),
  remixedLevel(29, 83537, "D", {
    rows: 9, cols: 9, boardScale: 0.96, cheeseCount: 1,
    tunnelCount: 3, tunnelIntro: true, moveMargin: 16, startOffset: 2,
  }),
  remixedLevel(30, 84653, "N", {
    cheeseCount: 1, milkCount: 1, tunnelCount: 4, startOffset: 3,
  }),
  remixedLevel(21, 85769, "Md", {
    cheeseCount: 2, rockMode: "blocker", rockCount: 2,
    adversityVariants: repeatedAdversity("cockroach"), startOffset: 0,
  }),
  remixedLevel(28, 86881, "N", {
    shape: BOARD_SHAPES.compactBays, cheeseCount: 2, startOffset: 1,
  }),
  remixedLevel(21, 87997, "Md", {
    shape: BOARD_SHAPES.splitPantry, cheeseCount: 1, rockMode: "search", rockCount: 3,
    adversityVariants: rotatingAdversities("car", "cockroach", "catPaw"), startOffset: 2,
  }),
  remixedLevel(38, 89107, "E", {
    pieCount: 1, cheeseCount: 0, milkCount: 0,
    adversityVariants: rotatingAdversities("cockroach", "car", "catPaw"), startOffset: 3,
  }),
  remixedLevel(34, 90217, "Md", {
    cheeseCount: 2, crowIntro: true, adversityVariants: repeatedAdversity("crow"), startOffset: 0,
  }),
  remixedLevel(41, 91331, "E", {
    cheeseCount: 2, milkCount: 1, tunnelCount: 3,
    adversityVariants: repeatedAdversity("crow"), startOffset: 1,
  }),
  remixedLevel(38, 92443, "E", {
    cheeseCount: 2, rockMode: "blocker", rockCount: 2,
    adversityVariants: rotatingAdversities("car", "cockroach", "catPaw", "crow"), startOffset: 2,
  }),
  remixedLevel(32, 93553, "D", {
    rows: 9, cols: 9, boardScale: 0.96, cheeseCount: 2,
    rotatingCircuitCount: 1, rotatingMoveMargin: 10, rotatingTilesIntro: true,
    moveMargin: 12, startOffset: 3,
  }),
  remixedLevel(33, 94687, "E", {
    cheeseCount: 3, rotatingCircuitCount: 1, rotatingMoveMargin: 8,
    rockMode: "blocker", rockCount: 2,
    adversityVariants: rotatingAdversities("car", "cockroach", "catPaw", "crow"), startOffset: 0,
  }),
  remixedLevel(35, 95791, "I", {
    cheeseCount: 3, tunnelCount: 3, rotatingCircuitCount: 1, rotatingMoveMargin: 6,
    adversityVariants: pairedAdversities(
      ["crow", "catPaw"], ["crow", "cockroach"], ["catPaw", "cockroach"],
    ),
    startOffset: 1,
  }),

  remixedLevel(36, 96911, "D", {
    rows: 9, cols: 9, boardScale: 0.96, cheeseCount: 2,
    cloudMode: "intro", startOffset: 2,
  }),
  remixedLevel(37, 98017, "Md", {
    cheeseCount: 2, cloudMode: true,
    adversityVariants: rotatingAdversities("car", "cockroach", "catPaw", "crow"), startOffset: 3,
  }),
  remixedLevel(38, 99131, "E", {
    pieCount: 1, cheeseCount: 0, milkCount: 0, cloudMode: true,
    adversityVariants: rotatingAdversities("crow", "catPaw", "car", "cockroach"), startOffset: 0,
  }),
  remixedLevel(39, 100237, "E", {
    rows: 9, cols: 9, boardScale: 0.96, cheeseCount: 1,
    waterMode: "intro", waterIntro: true, moveMargin: 12, startOffset: 1,
  }),
  remixedLevel(40, 101359, "I", {
    cheeseCount: 1, waterMode: "advanced", startOffset: 2,
  }),
  remixedLevel(41, 102461, "Md", {
    cheeseCount: 2, milkCount: 1, cloudMode: true,
    adversityVariants: rotatingAdversities("car", "cockroach", "catPaw", "crow"), startOffset: 3,
  }),
  remixedLevel(38, 103591, "D", {
    shape: BOARD_SHAPES.firstNotches, cheeseCount: 2, tunnelCount: 3,
    adversityVariants: rotatingAdversities("car", "cockroach", "catPaw"), startOffset: 0,
  }),
  remixedLevel(38, 104701, "Md", {
    pieCount: 1, cheeseCount: 0,
    adversityVariants: rotatingAdversities("car", "cockroach", "catPaw", "crow"), startOffset: 1,
  }),
  remixedLevel(33, 105829, "E", {
    cheeseCount: 2, milkCount: 2, rotatingCircuitCount: 1, rotatingMoveMargin: 8,
    adversityVariants: rotatingAdversities("car", "cockroach", "catPaw", "crow"), startOffset: 2,
  }),
  remixedLevel(35, 106949, "I", {
    shape: BOARD_SHAPES.windingFloor, cheeseCount: 3, cloudMode: true, tunnelCount: 3,
    adversityVariants: pairedAdversities(
      ["crow", "car"], ["crow", "catPaw"], ["cockroach", "catPaw"],
    ),
    startOffset: 3,
  }),
  remixedLevel(38, 108061, "D", {
    shape: BOARD_SHAPES.hookedRooms, cheeseCount: 2, hingedWallCount: 2,
    adversityVariants: rotatingAdversities("car", "cockroach", "catPaw"), startOffset: 0,
  }),
  remixedLevel(38, 109169, "Md", {
    pieCount: 1, cheeseCount: 0, cloudMode: true,
    adversityVariants: rotatingAdversities("car", "cockroach", "catPaw", "crow"), startOffset: 1,
  }),
  remixedLevel(33, 110281, "E", {
    cheeseCount: 3, rotatingCircuitCount: 1, rotatingMoveMargin: 8,
    rockMode: "blocker", rockCount: 3,
    adversityVariants: rotatingAdversities("car", "cockroach", "catPaw", "crow"), startOffset: 2,
  }),
  remixedLevel(40, 111427, "I", {
    cheeseCount: 3, waterMode: "advanced", startOffset: 3,
  }),
];

const INTRO_LEVELS_WITHOUT_ADVERSITY = new Set([13, 17, 20, 22, 25, 31, 40, 43]);

function validateGlobalLevelRules() {
  for (const [levelIndex, config] of LEVEL_CONFIGS.entries()) {
    const levelNumber = levelIndex + 1;
    const milkCount = config.milkCount ?? 0;
    const rockCount = config.rockCount ?? (config.rockMode ? 1 : 0);
    const hingedWallCount = config.hingedWallCount ?? 0;
    const tunnelCount = config.tunnelCount ?? 0;
    const objectiveCount =
      (config.cheeseCount ?? (config.pieCount ? 0 : 1)) +
      milkCount +
      (config.pieCount ?? 0) * 4;
    if (milkCount > MAX_MILK_BOTTLES_PER_LEVEL) {
      throw new Error(`Level ${levelNumber} exceeds the two-bottle limit.`);
    }
    if (rockCount > MAX_ROCKS_PER_LEVEL) {
      throw new Error(`Level ${levelNumber} exceeds the three-rock limit.`);
    }
    if (hingedWallCount > MAX_HINGED_WALLS_PER_LEVEL) {
      throw new Error(`Level ${levelNumber} exceeds the five-hinged-wall limit.`);
    }
    if (
      tunnelCount !== 0 &&
      (tunnelCount < MIN_TUNNELS_PER_LEVEL || tunnelCount > MAX_TUNNELS_PER_LEVEL)
    ) {
      throw new Error(`Level ${levelNumber} needs between three and four tunnels.`);
    }
    if ((config.pieCount ?? 0) > 1 || objectiveCount > MAX_OBJECTIVES_PER_LEVEL) {
      throw new Error(`Level ${levelNumber} exceeds the global objective limits.`);
    }
    if (config.waterMode && !["E", "I"].includes(config.difficultyCode)) {
      throw new Error(`Level ${levelNumber} can only use water at Extreme or Insane difficulty.`);
    }

    for (let variantIndex = 0; variantIndex < VARIANTS_PER_LEVEL; variantIndex += 1) {
      const adversities = adversitiesForVariant(config, variantIndex);
      const isPreAdversity = levelNumber < 9;
      const isIntroException = INTRO_LEVELS_WITHOUT_ADVERSITY.has(levelNumber);
      const expectedCount = config.waterMode
        ? 0
        : config.difficultyCode === "I"
        ? 2
        : ["D", "Md", "E"].includes(config.difficultyCode) && !isPreAdversity && !isIntroException
          ? 1
          : null;
      if (expectedCount !== null && adversities.length !== expectedCount) {
        throw new Error(
          `Level ${levelNumber} variant ${variantIndex + 1} needs ${expectedCount} adversit${expectedCount === 1 ? "y" : "ies"}.`,
        );
      }
      if (["Mf", "F", "T"].includes(config.difficultyCode) && adversities.length) {
        throw new Error(`Level ${levelNumber} cannot contain an adversity at this difficulty.`);
      }
      if (config.difficultyCode === "N" && adversities.length > 1) {
        throw new Error(`Level ${levelNumber} can contain at most one adversity.`);
      }
      if (config.waterMode && adversities.length) {
        throw new Error(`Level ${levelNumber} must use water as its only adversity.`);
      }
      const unavailable = adversities.find((adversity) =>
        adversity === "car"
          ? levelNumber < 9
          : adversity === "cockroach"
            ? levelNumber < 15
            : adversity === "catPaw"
              ? levelNumber < 27
              : adversity === "crow" && levelNumber < 37,
      );
      if (unavailable) {
        throw new Error(`Level ${levelNumber} uses ${unavailable} before its introduction.`);
      }
    }
  }
}

validateGlobalLevelRules();

const WORLD_LEVEL_PATTERN = Object.freeze([
  { x: 20, y: 95 }, { x: 49, y: 88 }, { x: 78, y: 81 }, { x: 62, y: 74 },
  { x: 28, y: 67 }, { x: 18, y: 60 }, { x: 50, y: 53 }, { x: 81, y: 46 },
  { x: 67, y: 39 }, { x: 34, y: 32 }, { x: 18, y: 25 }, { x: 46, y: 18 },
  { x: 77, y: 11 }, { x: 57, y: 4.5 },
]);
const WORLD_CHAPTER_SIZE = 14;
const WORLD_CHAPTER_TRACK_HEIGHT = 920;
const WORLD_CHAPTER_TITLES = Object.freeze([
  "Through the cupboards",
  "Beyond the pantry",
  "Behind the skirting boards",
  "Under the old floorboards",
]);
let visibleWorldChapterCount = 1;

const WORLD_LEVEL_OBJECTIVES = Object.freeze([
  "Learn how the mouse moves", "Find the cheese", "Tip the bottle and drink the milk",
  "Collect cheese and spilled milk", "Collect three pantry treats", "Plan the milk route",
  "Discover Crystal Vision", "Remember the revealed route", "Escape the remote-control catcher",
  "Outrun the catcher and collect every cheese", "Push the rock to reveal the objective",
  "Search the rocks while escaping the catcher", "Discover the Maze Tornado",
  "Search the rocks under pressure",
  "Discover the cheese-carrying cockroach", "Protect the milk from the cockroach",
  "Discover the wall-breaking hammer", "Adapt to moving objectives", "Collect the milk and cheese",
  "Eat the pie from all four sides", "Choose whether to risk the adversity",
  "Discover the first hinged wall", "Master hinged walls under pressure",
  "Eat the pie while evading the catcher", "Discover the fishing rod",
  "Use hinged walls around mixed objectives", "Discover the cat paw striking from the frame",
  "Survive two adversities at once",
  "Discover the Mouse Rocket", "Consolidate the Rocket under pressure",
  "Discover the transport tunnels", "Use the tunnels around mixed objectives",
  "Move rocks while the cockroach interferes", "Discover the first shaped maze",
  "Search a shaped maze under pressure", "Eat the pie among hinged walls",
  "Take cover from the diving crow", "Use tunnels while the crow hunts",
  "Search the rocks under a changing threat", "Discover the rotating floor circuits",
  "Cross the rotating floor under pressure", "Master rotating tunnels against two threats",
  "Discover the moving clouds", "Navigate beneath moving clouds", "Eat the pie under shifting cover",
  "Discover the rising flood", "Outrun the flood through the dead ends",
  "Collect mixed objectives beneath clouds", "Use tunnels in a shaped maze",
  "Eat the pie while moving rocks", "Cross rotating floors with mixed objectives",
  "Master tunnels beneath moving clouds", "Navigate hinged rooms under pressure",
  "Eat the pie beneath shifting cover", "Master rocks on the rotating floor",
  "Complete the final flood challenge",
]);

const WORLD_LEVELS = LEVEL_CONFIGS.map((config, index) => ({
  ...WORLD_LEVEL_PATTERN[index % WORLD_LEVEL_PATTERN.length],
  objective: WORLD_LEVEL_OBJECTIVES[index],
  difficulty: index === 0 ? "Tutorial - 5 x 5" : config.difficulty,
}));

const DIRS = [
  { key: "up", row: -1, col: 0, wall: "top", opposite: "bottom" },
  { key: "right", row: 0, col: 1, wall: "right", opposite: "left" },
  { key: "down", row: 1, col: 0, wall: "bottom", opposite: "top" },
  { key: "left", row: 0, col: -1, wall: "left", opposite: "right" },
];
const COCKROACH_JUMPS = Object.freeze([
  ...[1, 2].flatMap((distance) => [
    { key: "up", row: -distance, col: 0, distance },
    { key: "up-right", row: -distance, col: distance, distance },
    { key: "right", row: 0, col: distance, distance },
    { key: "down-right", row: distance, col: distance, distance },
    { key: "down", row: distance, col: 0, distance },
    { key: "down-left", row: distance, col: -distance, distance },
    { key: "left", row: 0, col: -distance, distance },
    { key: "up-left", row: -distance, col: -distance, distance },
  ]),
]);
const HAMMER_SWING_PROFILES = {
  up: { windupRotation: 1.08, impactRotation: 0, flipX: 1 },
  right: { windupRotation: -0.76, impactRotation: Math.PI / 2, flipX: 1 },
  down: { windupRotation: -1.02, impactRotation: -Math.PI, flipX: 1 },
  left: { windupRotation: 0.76, impactRotation: -Math.PI / 2, flipX: -1 },
};

const gameShellEl = document.querySelector(".game-shell");
const worldScreenEl = document.querySelector("#worldScreen");
const worldMapEl = document.querySelector("#worldMap");
const worldMapTrackEl = document.querySelector("#worldMapTrack");
const worldLevelNodesEl = document.querySelector("#worldLevelNodes");
const worldMouseEl = document.querySelector("#worldMouse");
const worldAttemptStatusEl = document.querySelector("#worldAttemptStatus");
const worldAttemptCountEl = document.querySelector("#worldAttemptCount");
const worldAttemptTimerEl = document.querySelector("#worldAttemptTimer");
const worldCurrencyStatusEl = document.querySelector("#worldCurrencyStatus");
const worldCurrencyCountEl = document.querySelector("#worldCurrencyCount");
const worldProgressTextEl = document.querySelector("#worldProgressText");
const worldProgressBarEl = document.querySelector("#worldProgressBar");
const worldChapterLabelEl = document.querySelector("#worldChapterLabel");
const worldChapterTitleEl = document.querySelector("#worldChapterTitle");
const levelSheetBackdropEl = document.querySelector("#levelSheetBackdrop");
const levelSheetEl = document.querySelector("#levelSheet");
const levelSheetCloseButton = document.querySelector("#levelSheetClose");
const levelSheetPlayButton = document.querySelector("#levelSheetPlay");
const sheetLevelMarkEl = document.querySelector("#sheetLevelMark");
const levelSheetTitleEl = document.querySelector("#levelSheetTitle");
const levelSheetObjectiveEl = document.querySelector("#levelSheetObjective");
const levelSheetDifficultyEl = document.querySelector("#levelSheetDifficulty");
const mazeEl = document.querySelector("#maze");
const swipeTutorialEl = document.querySelector("#swipeTutorial");
const swipeTutorialDemoEl = document.querySelector("#swipeTutorialDemo");
const crystalTutorialEl = document.querySelector("#crystalTutorial");
const tornadoTutorialEl = document.querySelector("#tornadoTutorial");
const powerIntroTutorialEl = document.querySelector("#powerIntroTutorial");
const controlsPanelEl = document.querySelector("#controlsPanel");
const movesLeftEl = document.querySelector("#movesLeft");
const movesStatEl = document.querySelector("#movesStat");
const cheeseProgressEl = document.querySelector("#cheeseProgress");
const cheeseRemainingEl = document.querySelector("#cheeseRemaining");
const cheeseObjectiveEl = document.querySelector("#cheeseObjective");
const milkObjectiveEl = document.querySelector("#milkObjective");
const milkRemainingEl = document.querySelector("#milkRemaining");
const pieObjectiveEl = document.querySelector("#pieObjective");
const pieRemainingEl = document.querySelector("#pieRemaining");
const testResetButton = document.querySelector("#testResetButton");
const levelLabelEl = document.querySelector("#levelLabel");
const levelTitleEl = document.querySelector("#levelTitle");
const attemptStatusEl = document.querySelector("#attemptStatus");
const attemptCountEl = document.querySelector("#attemptCount");
const attemptTimerEl = document.querySelector("#attemptTimer");
const currencyStatusEl = document.querySelector("#currencyStatus");
const currencyCountEl = document.querySelector("#currencyCount");
const messageEl = document.querySelector("#message");
const retryButton = document.querySelector("#retryButton");
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
const mouseDrinkingSprite = new Image();
const mouseMilkPushRightSprite = new Image();
const mouseMilkPushLeftSprite = new Image();
const mouseMilkPushUpSprite = new Image();
const mouseMilkPushDownSprite = new Image();
const mouseSleepSprite = new Image();
const mouseSniffSprite = new Image();
const cheeseSprite = new Image();
const pieSprite = new Image();
const rockSprite = new Image();
const milkBottleSprite = new Image();
const milkSpillActionSprite = new Image();
const milkSpillUpSprite = new Image();
const milkSpillDownSprite = new Image();
const milkSpillBottleSprite = new Image();
const milkSpillPuddleSprite = new Image();
const rcCatcherSprite = new Image();
const rcCatcherWalkUpSprite = new Image();
const rcCatcherWalkDownSprite = new Image();
const rcCatcherWalkLeftSprite = new Image();
const rcCatcherWalkRightSprite = new Image();
const rcCatcherCaptureUpSprite = new Image();
const rcCatcherCaptureDownSprite = new Image();
const rcCatcherCaptureLeftSprite = new Image();
const rcCatcherCaptureRightSprite = new Image();
const cockroachSprite = new Image();
const catPawSprite = new Image();
const crowSprite = new Image();
const cloudSprite = new Image();
const tunnelSprite = new Image();
const mouseTunnelEnterSprite = new Image();
const mouseTunnelExitSprite = new Image();
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

const ASSET_GROUPS = Object.freeze({
  core: [
    [mouseSprite, "assets/mouse.png?v=campaign-53"],
    [mouseWalkLeftSprite, "assets/mouse-walk-strip.png?v=v2-walk-3"],
    [mouseWalkRightSprite, "assets/mouse-walk-right-strip.png?v=v2-walk-3"],
    [mouseWalkUpSprite, "assets/mouse-walk-up-strip.png?v=v2-walk-5"],
    [mouseWalkDownSprite, "assets/mouse-walk-down-strip.png?v=v2-walk-3"],
    [mouseEatingSprite, "assets/mouse-eat-strip.png?v=v2-eat-1"],
    [mouseSleepSprite, "assets/mouse-sleep-strip.png?v=v2-sleep-1"],
    [mouseSniffSprite, "assets/mouse-sniff-strip.png?v=v2-intro-1"],
    [cheeseSprite, "assets/cheese-animation-frame-1-clean.png?v=v45-cheese-clean-1"],
  ],
  milk: [
    [mouseDrinkingSprite, "assets/mouse-drink-strip.png?v=v45-milk-animation-1"],
    [mouseMilkPushRightSprite, "assets/mouse-milk-push-side-strip.png?v=v45-milk-push-1"],
    [mouseMilkPushLeftSprite, "assets/mouse-milk-push-left-strip.png?v=v45-milk-push-1"],
    [mouseMilkPushUpSprite, "assets/mouse-milk-push-up-strip.png?v=v45-milk-push-1"],
    [mouseMilkPushDownSprite, "assets/mouse-milk-push-down-strip.png?v=v45-milk-push-1"],
    [milkBottleSprite, "assets/milk-bottle.png?v=v45-dynamic-1"],
    [milkSpillActionSprite, "assets/milk-spill-action-strip.png?v=v45-milk-action-1"],
    [milkSpillUpSprite, "assets/milk-spill-up-sheet-green.png?v=v5-milk-vertical-2"],
    [milkSpillDownSprite, "assets/milk-spill-down-sheet-green.png?v=v5-milk-vertical-2"],
    [milkSpillBottleSprite, "assets/milk-spill-bottle.png?v=v45-milk-action-1"],
    [milkSpillPuddleSprite, "assets/milk-spill-puddle.png?v=v45-milk-action-1"],
  ],
  pie: [[pieSprite, "assets/pie.png?v=v45-pie-1"]],
  car: [
    [rcCatcherSprite, "assets/rc-catcher.png?v=v45-dynamic-1"],
    [rcCatcherWalkUpSprite, "assets/rc-catcher-walk-up-strip-v3.png?v=v45-car-vertical-3"],
    [rcCatcherWalkDownSprite, "assets/rc-catcher-walk-down-strip-v3.png?v=v45-car-vertical-3"],
    [rcCatcherWalkLeftSprite, "assets/rc-catcher-walk-left-strip-v2.png?v=v45-car-vertical-3"],
    [rcCatcherWalkRightSprite, "assets/rc-catcher-walk-right-strip-v2.png?v=v45-car-vertical-3"],
    [rcCatcherCaptureUpSprite, "assets/rc-catcher-capture-up-integrated-strip.png?v=v45-car-capture-5"],
    [rcCatcherCaptureDownSprite, "assets/rc-catcher-capture-down-integrated-strip.png?v=v45-car-capture-5"],
    [rcCatcherCaptureLeftSprite, "assets/rc-catcher-capture-left-integrated-strip.png?v=v45-car-capture-5"],
    [rcCatcherCaptureRightSprite, "assets/rc-catcher-capture-right-integrated-strip.png?v=v45-car-capture-5"],
  ],
  cockroach: [[cockroachSprite, "assets/cockroach.png?v=v45-cockroach-1"]],
  catPaw: [[catPawSprite, "assets/cat-paw.png?v=v45-cat-paw-2"]],
  crow: [[crowSprite, "assets/crow.png?v=v45-crow-1"]],
  cloud: [[cloudSprite, "assets/cloud.png?v=v45-cloud-5"]],
  tunnels: [
    [tunnelSprite, "assets/tunnel.png?v=v45-tunnels-1"],
    [mouseTunnelEnterSprite, "assets/mouse-tunnel-enter-strip-v1.png?v=v45-tunnel-sprites-1"],
    [mouseTunnelExitSprite, "assets/mouse-tunnel-exit-strip-v1.png?v=v45-tunnel-sprites-1"],
  ],
  rocks: [[rockSprite, "assets/rock.png?v=v4-rocks-1"]],
  crystal: [
    [crystalSprite, "assets/crystal-power.png?v=campaign-53"],
    [crystalTransformSprite, "assets/power-transform-crystal-strip.png?v=v2-power-sprites-1"],
  ],
  tornado: [
    [tornadoSprite, "assets/tornado-power.png?v=campaign-53"],
    [tornadoTransformSprite, "assets/power-transform-tornado-strip-v2.png?v=v2-power-sprites-3"],
  ],
  hammer: [
    [hammerSprite, "assets/hammer-power.png?v=campaign-53"],
    [hammerTransformSprite, "assets/power-transform-hammer-strip-v2.png?v=v2-power-sprites-3"],
  ],
  fishing: [
    [fishingSprite, "assets/fishing-power-transparent-v2.png?v=v2-fishing-upright-1"],
    [fishingTransformSprite, "assets/power-transform-fishing-strip-v3.png?v=v2-fishing-upright-1"],
  ],
  rocket: [
    [rocketSprite, "assets/rocket-power.png?v=campaign-53"],
    [rocketFlightBodySprite, "assets/rocket-flight-body.png?v=v2-rocket-flight-1"],
    [rocketTransformSprite, "assets/power-transform-rocket-strip-v2.png?v=v2-power-sprites-3"],
  ],
});
const assetGroupPromises = new Map();

function loadSprite(sprite, source) {
  if (sprite.src) return sprite.decode?.().catch(() => undefined) ?? Promise.resolve();
  return new Promise((resolve) => {
    const finish = () => resolve();
    sprite.addEventListener("load", finish, { once: true });
    sprite.addEventListener("error", finish, { once: true });
    sprite.src = source;
  });
}

const greenScreenSpriteCache = new WeakMap();

function prepareGreenScreenSprite(sprite) {
  if (!sprite?.complete || !sprite.naturalWidth) return null;
  if (greenScreenSpriteCache.has(sprite)) return greenScreenSpriteCache.get(sprite);

  try {
    const canvas = document.createElement("canvas");
    canvas.width = sprite.naturalWidth;
    canvas.height = sprite.naturalHeight;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.drawImage(sprite, 0, 0);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height);

    for (let index = 0; index < pixels.data.length; index += 4) {
      const red = pixels.data[index];
      const green = pixels.data[index + 1];
      const blue = pixels.data[index + 2];
      const dominantGreen = green - Math.max(red, blue);
      if (green < 105 || dominantGreen < 24) continue;

      const removal = clamp((dominantGreen - 24) / 92, 0, 1);
      pixels.data[index + 3] = Math.round(pixels.data[index + 3] * (1 - removal));
      if (pixels.data[index + 3] > 0) {
        pixels.data[index + 1] = Math.min(green, Math.max(red, blue) + 14);
      }
    }

    context.putImageData(pixels, 0, 0);
    greenScreenSpriteCache.set(sprite, canvas);
    return canvas;
  } catch {
    return null;
  }
}

function loadAssetGroup(groupName) {
  if (assetGroupPromises.has(groupName)) return assetGroupPromises.get(groupName);
  const entries = ASSET_GROUPS[groupName] ?? [];
  const promise = Promise.all(entries.map(([sprite, source]) => loadSprite(sprite, source)))
    .then(() => {
      if (groupName === "milk") {
        prepareGreenScreenSprite(milkSpillUpSprite);
        prepareGreenScreenSprite(milkSpillDownSprite);
      }
      document.querySelectorAll?.(`[data-asset-group="${groupName}"]`).forEach((image) => {
        if (!image.getAttribute("src") && image.dataset.src) image.src = image.dataset.src;
      });
      applyAlbinoSkinPreviewToPowerIcons();
      requestMazeDraw();
    });
  assetGroupPromises.set(groupName, promise);
  return promise;
}

function assetGroupsForLevel(levelNumber) {
  const config = LEVEL_CONFIGS[levelNumber - 1] ?? {};
  const groups = new Set(["core"]);
  const reachedLevel = Math.max(levelNumber, worldProgress?.unlockedLevel ?? levelNumber);
  if (config.milkCount) groups.add("milk");
  if (config.pieCount) groups.add("pie");
  if (config.carMode) groups.add("car");
  if (config.cockroachMode) groups.add("cockroach");
  if (config.catPawMode) groups.add("catPaw");
  if (config.crowMode) groups.add("crow");
  if (config.cloudMode) groups.add("cloud");
  if (config.tunnelCount) groups.add("tunnels");
  if (config.rockMode) groups.add("rocks");
  for (let variantIndex = 0; variantIndex < VARIANTS_PER_LEVEL; variantIndex += 1) {
    for (const adversity of adversitiesForVariant(config, variantIndex)) {
      groups.add(adversity);
    }
  }
  for (const [powerKey, unlockLevel] of Object.entries(POWER_UNLOCK_LEVELS)) {
    if (Number.isFinite(unlockLevel) && reachedLevel >= unlockLevel) groups.add(powerKey);
  }
  return [...groups];
}

function ensureAssetsForLevel(levelNumber) {
  return Promise.all(assetGroupsForLevel(levelNumber).map(loadAssetGroup));
}

function scheduleNextLevelPreload(levelNumber) {
  const nextLevel = levelNumber + 1;
  if (nextLevel > LEVEL_CONFIGS.length) return;
  const preload = () => void ensureAssetsForLevel(nextLevel);
  if (typeof globalThis.requestIdleCallback === "function") {
    globalThis.requestIdleCallback(preload, { timeout: 1800 });
  } else {
    setTimeout(preload, 500);
  }
}

void loadAssetGroup("core");

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
let worldProgress = {
  unlockedLevel: 1,
  completedLevels: Array(LEVEL_CONFIGS.length).fill(false),
};
let selectedWorldLevel = 1;
let worldReplayFrontier = null;
let activeVariantIndex = -1;
let maze = [];
let exit = null;
let cheeseTargets = [];
let collectedCheeseKeys = new Set();
let initialMilkBottles = [];
let milkBottles = [];
let collectedMilkIds = new Set();
let milkKnockAnimation = null;
let milkKnockAnimationFrame = null;
let milkDrinkAnimation = null;
let milkDrinkAnimationFrame = null;
let initialPie = null;
let pie = null;
let eatenPieQuarterIds = new Set();
let pieBiteAnimation = null;
let pieBiteAnimationFrame = null;
let initialCar = null;
let car = null;
let carMotion = null;
let carMotionFrame = null;
let carCaptureAnimation = null;
let carCaptureAnimationFrame = null;
let cockroachMovesSinceAction = 0;
let cockroachNextTrigger = COCKROACH_MIN_TRIGGER_MOVES;
let cockroachActionsUsed = 0;
let cockroachAnimation = null;
let cockroachAnimationFrame = null;
let cockroachDefeated = false;
let catPawMovesSinceStrike = 0;
let catPawNextTrigger = CAT_PAW_TRIGGER_MOVES[0];
let catPawThreat = null;
let catPawStrikePending = false;
let catPawAnimation = null;
let catPawAnimationFrame = null;
let crowMovesSinceStrike = 0;
let crowNextTrigger = CROW_TRIGGER_MOVES[0];
let crowThreat = null;
let crowStrikePending = false;
let crowAnimation = null;
let crowAnimationFrame = null;
let mouseCapturedByCrow = false;
let cloud = null;
let cloudAnimation = null;
let cloudAnimationFrame = null;
let cloudStepTimer = null;
let cloudIdleStepsRemaining = 0;
let waterMoveCount = 0;
let floodedWaterKeys = new Set();
let waterOrigin = { ...START };
let waterVisualTime = 0;
let waterAmbientFrame = null;
let waterLastAmbientDraw = 0;
let initialRocks = [];
let rockPositions = [];
let hiddenCheeseKeys = new Set();
let initialHingedWalls = [];
let hingedWalls = [];
let hingedWallAnimation = null;
let hingedWallAnimationFrame = null;
let initialTunnels = [];
let tunnels = [];
let tunnelAnimation = null;
let tunnelAnimationFrame = null;
let tunnelTutorial = null;
let tunnelTutorialFrame = null;
let initialRotatingCircuits = [];
let rotatingCircuits = [];
let rotatingTilesAnimation = null;
let rotatingTilesAnimationFrame = null;
let rotatingTilesTutorialActive = false;
let rotatingTilesTutorialTimer = null;
let mechanicTutorial = null;
let mechanicTutorialFrame = null;
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
let swipeTutorialActive = false;
let swipeTutorialTimer = null;
let crystalTutorialActive = false;
let crystalTutorialTimers = [];
let tornadoTutorialActive = false;
let tornadoTutorialTimers = [];
let tornadoTutorialCandidate = null;
let tornadoTutorialUnlockedForRun = false;
let tornadoTutorialSavings = 0;
let tornadoTutorialShownThisRun = false;
let powerIntroTutorialActive = false;
let powerIntroTutorialKey = null;
let powerIntroTutorialTarget = null;
let powerIntroTutorialTimers = [];
let powerIntroTutorialShownThisRun = false;
let powerIntroTutorialUnlockedForRun = new Set();
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
let carFacingDirection = "left";
let activeLevelConfig = null;
const levelVariantStates = LEVEL_CONFIGS.map(() => ({ current: -1, remaining: [] }));

function currentLevelConfig() {
  return activeLevelConfig ?? LEVEL_CONFIGS[level - 1] ?? {};
}

mouseSprite.addEventListener("load", requestMazeDraw);
mouseWalkLeftSprite.addEventListener("load", requestMazeDraw);
mouseWalkRightSprite.addEventListener("load", requestMazeDraw);
mouseWalkUpSprite.addEventListener("load", requestMazeDraw);
mouseWalkDownSprite.addEventListener("load", requestMazeDraw);
mouseEatingSprite.addEventListener("load", requestMazeDraw);
mouseDrinkingSprite.addEventListener("load", requestMazeDraw);
mouseMilkPushRightSprite.addEventListener("load", requestMazeDraw);
mouseMilkPushLeftSprite.addEventListener("load", requestMazeDraw);
mouseMilkPushUpSprite.addEventListener("load", requestMazeDraw);
mouseMilkPushDownSprite.addEventListener("load", requestMazeDraw);
mouseSleepSprite.addEventListener("load", requestMazeDraw);
mouseSniffSprite.addEventListener("load", requestMazeDraw);
cheeseSprite.addEventListener("load", requestMazeDraw);
rockSprite.addEventListener("load", requestMazeDraw);
milkBottleSprite.addEventListener("load", requestMazeDraw);
milkSpillActionSprite.addEventListener("load", requestMazeDraw);
milkSpillUpSprite.addEventListener("load", () => {
  prepareGreenScreenSprite(milkSpillUpSprite);
  requestMazeDraw();
});
milkSpillDownSprite.addEventListener("load", () => {
  prepareGreenScreenSprite(milkSpillDownSprite);
  requestMazeDraw();
});
milkSpillBottleSprite.addEventListener("load", requestMazeDraw);
milkSpillPuddleSprite.addEventListener("load", requestMazeDraw);
rcCatcherSprite.addEventListener("load", requestMazeDraw);
rcCatcherWalkUpSprite.addEventListener("load", requestMazeDraw);
rcCatcherWalkDownSprite.addEventListener("load", requestMazeDraw);
rcCatcherWalkLeftSprite.addEventListener("load", requestMazeDraw);
rcCatcherWalkRightSprite.addEventListener("load", requestMazeDraw);
rcCatcherCaptureUpSprite.addEventListener("load", requestMazeDraw);
rcCatcherCaptureDownSprite.addEventListener("load", requestMazeDraw);
rcCatcherCaptureLeftSprite.addEventListener("load", requestMazeDraw);
rcCatcherCaptureRightSprite.addEventListener("load", requestMazeDraw);
cockroachSprite.addEventListener("load", requestMazeDraw);
catPawSprite.addEventListener("load", requestMazeDraw);
crowSprite.addEventListener("load", requestMazeDraw);
cloudSprite.addEventListener("load", requestMazeDraw);
tunnelSprite.addEventListener("load", requestMazeDraw);
mouseTunnelEnterSprite.addEventListener("load", requestMazeDraw);
mouseTunnelExitSprite.addEventListener("load", requestMazeDraw);
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
    active: ACTIVE_CELL_KEYS.has(`${row},${col}`),
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

function takeRetryVariant(levelIndex) {
  const state = levelVariantStates[levelIndex];
  state.current = state.current < 0
    ? takeNextVariant(levelIndex)
    : (state.current + 1) % VARIANTS_PER_LEVEL;
  state.remaining = [];
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

function grantIntroPowerIfNeeded(config) {
  const powerKey = config.crystalIntro
    ? "crystal"
    : config.tornadoIntro
      ? "tornado"
      : config.hammerIntro
        ? "hammer"
        : config.fishingIntro
          ? "fishing"
          : config.rocketIntro
            ? "rocket"
          : null;
  if (!powerKey) return;
  let grants = {};
  try {
    grants = JSON.parse(globalThis.localStorage?.getItem(POWER_GRANT_STORAGE_KEY) ?? "{}") ?? {};
  } catch {
    grants = {};
  }
  if (grants[powerKey]) return;
  powerInventory[powerKey] = Math.max(1, powerInventory[powerKey]);
  grants[powerKey] = true;
  syncPowerAvailability();
  saveEconomyState();
  try {
    globalThis.localStorage?.setItem(POWER_GRANT_STORAGE_KEY, JSON.stringify(grants));
  } catch {
    // The free introduction use remains available for this session.
  }
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
  if (currencyCountEl) currencyCountEl.textContent = String(currency);
  currencyStatusEl?.setAttribute(
    "aria-label",
    `${currency} shirt button${currency === 1 ? "" : "s"}`,
  );
  worldCurrencyCountEl.textContent = String(currency);
  worldCurrencyStatusEl.setAttribute(
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
  if (!isPowerUnlocked(powerKey)) return;
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
  worldAttemptCountEl.textContent = String(attempts);
  worldAttemptTimerEl.textContent = recovering
    ? formatAttemptCountdown(nextAttemptAt - now)
    : "MAX";
  worldAttemptStatusEl.setAttribute(
    "aria-label",
    `${attempts} attempt${attempts === 1 ? "" : "s"} available`,
  );

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
  if (worldReplayFrontier !== null) return;
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
  return true;
}

function defaultWorldProgress() {
  return {
    unlockedLevel: 1,
    completedLevels: Array(LEVEL_CONFIGS.length).fill(false),
  };
}

function loadWorldProgress() {
  worldProgress = defaultWorldProgress();
  try {
    const saved = JSON.parse(
      globalThis.localStorage?.getItem(WORLD_PROGRESS_STORAGE_KEY) ?? "null",
    );
    if (Number.isFinite(saved?.unlockedLevel)) {
      worldProgress.unlockedLevel = clamp(
        Math.floor(saved.unlockedLevel),
        1,
        WORLD_LEVELS.length,
      );
    }
    const savedCompleted = Array.isArray(saved?.completedLevels)
      ? saved.completedLevels
      : Array.isArray(saved?.stars)
        ? saved.stars.map((value) => Number(value) > 0)
        : [];
    worldProgress.completedLevels = Array.from(
      { length: LEVEL_CONFIGS.length },
      (_, index) => Boolean(savedCompleted[index]) || index + 1 < worldProgress.unlockedLevel,
    );
  } catch {
    worldProgress = defaultWorldProgress();
  }

  worldProgress.unlockedLevel = Math.max(
    worldProgress.unlockedLevel,
    clamp(level, 1, WORLD_LEVELS.length),
  );
}

function saveWorldProgress() {
  try {
    globalThis.localStorage?.setItem(
      WORLD_PROGRESS_STORAGE_KEY,
      JSON.stringify(worldProgress),
    );
  } catch {
    // Progress remains available for the current session when storage is unavailable.
  }
}

function resetWorldProgress() {
  worldProgress = defaultWorldProgress();
  selectedWorldLevel = 1;
  worldReplayFrontier = null;
  saveWorldProgress();
}

function worldLevelState(levelNumber) {
  if (worldProgress.completedLevels[levelNumber - 1] || levelNumber < worldProgress.unlockedLevel) {
    return "complete";
  }
  if (levelNumber === worldProgress.unlockedLevel) return "current";
  return "locked";
}

function renderWorldChapterSummary(chapterNumber) {
  const chapter = clamp(chapterNumber, 1, visibleWorldChapterCount);
  const chapterStartIndex = (chapter - 1) * WORLD_CHAPTER_SIZE;
  const chapterEndIndex = Math.min(
    chapterStartIndex + WORLD_CHAPTER_SIZE,
    WORLD_LEVELS.length,
  );
  const chapterLevelTotal = chapterEndIndex - chapterStartIndex;
  const chapterCompletedCount = worldProgress.completedLevels
    .slice(chapterStartIndex, chapterEndIndex)
    .filter(Boolean).length;
  worldChapterLabelEl.textContent = `Chapter ${chapter}`;
  worldChapterTitleEl.textContent = WORLD_CHAPTER_TITLES[chapter - 1];
  worldProgressTextEl.textContent = `${chapterCompletedCount} / ${chapterLevelTotal}`;
  worldProgressBarEl.style.transform = `scaleX(${chapterCompletedCount / chapterLevelTotal})`;
}

function syncWorldChapterHeaderToScroll() {
  const viewportCenter = worldMapEl.scrollTop + worldMapEl.clientHeight * 0.5;
  const sectionFromTop = clamp(
    Math.floor(viewportCenter / WORLD_CHAPTER_TRACK_HEIGHT),
    0,
    visibleWorldChapterCount - 1,
  );
  renderWorldChapterSummary(visibleWorldChapterCount - sectionFromTop);
}

function renderWorldMap() {
  const currentLevel = clamp(worldProgress.unlockedLevel, 1, WORLD_LEVELS.length);
  const currentMeta = WORLD_LEVELS[currentLevel - 1];
  const visibleChapterCount = Math.min(
    Math.ceil(WORLD_LEVELS.length / WORLD_CHAPTER_SIZE),
    Math.ceil(worldProgress.unlockedLevel / WORLD_CHAPTER_SIZE),
  );
  visibleWorldChapterCount = visibleChapterCount;
  const visibleStart = 1;
  const visibleEnd = Math.min(
    WORLD_LEVELS.length,
    visibleChapterCount * WORLD_CHAPTER_SIZE,
  );
  const visibleLevels = WORLD_LEVELS.slice(visibleStart - 1, visibleEnd);
  const levelMapY = (levelNumber, meta) => {
    const localY = (meta.y / 100) * WORLD_CHAPTER_TRACK_HEIGHT;
    const chapterIndex = Math.floor((levelNumber - 1) / WORLD_CHAPTER_SIZE);
    return (visibleChapterCount - chapterIndex - 1) * WORLD_CHAPTER_TRACK_HEIGHT + localY;
  };

  const currentChapter = Math.floor((currentLevel - 1) / WORLD_CHAPTER_SIZE) + 1;
  renderWorldChapterSummary(currentChapter);
  worldMapTrackEl.style.height = `${visibleChapterCount * WORLD_CHAPTER_TRACK_HEIGHT}px`;
  worldMapTrackEl.style.minHeight = `${visibleChapterCount * WORLD_CHAPTER_TRACK_HEIGHT}px`;
  document.querySelectorAll(".world-map-section").forEach((section, sectionIndex) => {
    const isVisible = sectionIndex < visibleChapterCount;
    section.style.display = isVisible ? "block" : "none";
    section.style.transform = isVisible
      ? `translateY(${(visibleChapterCount - sectionIndex - 1) * WORLD_CHAPTER_TRACK_HEIGHT}px)`
      : "translateY(0)";
  });

  worldLevelNodesEl.replaceChildren();
  let currentLevelButton = null;
  visibleLevels.forEach((meta, localIndex) => {
    const levelNumber = visibleStart + localIndex;
    const state = worldLevelState(levelNumber);
    const button = document.createElement("button");
    const number = document.createElement("strong");
    button.type = "button";
    button.className = "level-node";
    button.dataset.state = state;
    button.style.setProperty("--node-x", `${meta.x}%`);
    button.style.setProperty("--node-y", `${levelMapY(levelNumber, meta)}px`);
    button.disabled = state === "locked";
    button.setAttribute(
      "aria-label",
      state === "locked"
        ? `Level ${levelNumber}, locked`
        : state === "current"
          ? `Level ${levelNumber}, current level`
          : `Level ${levelNumber}, complete`,
    );
    number.textContent = String(levelNumber);
    button.append(number);
    if (state !== "locked") {
      button.addEventListener("click", () => openWorldLevelSheet(levelNumber));
    }
    if (state === "current") currentLevelButton = button;
    worldLevelNodesEl.append(button);
  });

  worldMouseEl.style.setProperty("--node-x", `${currentMeta.x}%`);
  worldMouseEl.style.setProperty(
    "--node-y",
    `${levelMapY(currentLevel, currentMeta)}px`,
  );
  requestAnimationFrame(() => {
    if (!currentLevelButton) return;
    const targetTop = currentLevelButton.offsetTop - worldMapEl.clientHeight * 0.5;
    worldMapEl.scrollTop = clamp(
      targetTop,
      0,
      Math.max(0, worldMapEl.scrollHeight - worldMapEl.clientHeight),
    );
    syncWorldChapterHeaderToScroll();
  });
}

function openWorldLevelSheet(levelNumber) {
  if (worldLevelState(levelNumber) === "locked") return;
  selectedWorldLevel = levelNumber;
  const completed = worldProgress.completedLevels[levelNumber - 1];
  sheetLevelMarkEl.textContent = String(levelNumber);
  levelSheetTitleEl.textContent = `Level ${levelNumber}`;
  levelSheetObjectiveEl.textContent = WORLD_LEVELS[levelNumber - 1].objective;
  levelSheetDifficultyEl.textContent = WORLD_LEVELS[levelNumber - 1].difficulty;
  levelSheetPlayButton.textContent = completed ? "Replay" : "Play";
  levelSheetBackdropEl.hidden = false;
  levelSheetEl.hidden = false;
  levelSheetPlayButton.focus?.();
}

function closeWorldLevelSheet() {
  levelSheetBackdropEl.hidden = true;
  levelSheetEl.hidden = true;
}

function recordWorldCompletion(levelNumber) {
  const index = levelNumber - 1;
  worldProgress.completedLevels[index] = true;
  worldProgress.unlockedLevel = Math.max(
    worldProgress.unlockedLevel,
    Math.min(WORLD_LEVELS.length, levelNumber + 1),
  );
  saveWorldProgress();
}

function stopGameForWorldMap() {
  clearMouseMotion();
  clearCheeseEatingAnimation();
  clearPieBiteAnimation();
  clearMouseDefeatAnimation();
  clearLevelIntroAnimation();
  clearSwipeTutorial();
  clearCrystalTutorial();
  clearTornadoTutorial();
  clearPowerIntroTutorial();
  clearTunnelAnimation();
  clearTunnelTutorial();
  clearRotatingTilesAnimation();
  clearRotatingTilesTutorial();
  clearMechanicTutorial();
  clearCloudRun();
  clearPowerTransformation();
  clearCrystalReveal();
  clearFishingCatchAnimation();
  clearRocketFlightAnimation();
  clearHingedWallAnimation();
  clearPowerTargetingState();
  powerShopEl.hidden = true;
  setMovementControlsEnabled(false);
  setPowerControlsEnabled(false);
}

function showWorldMap(nextLevelToOpen = null) {
  stopGameForWorldMap();
  if (worldReplayFrontier !== null) {
    level = worldReplayFrontier;
    worldReplayFrontier = null;
  }
  saveCampaignState();
  closeWorldLevelSheet();
  renderWorldMap();
  updateAttemptUI();
  updateCurrencyUI();
  gameShellEl.hidden = true;
  worldScreenEl.hidden = false;
  document.body.classList.add("world-view");
  if (Number.isInteger(nextLevelToOpen)) {
    requestAnimationFrame(() => openWorldLevelSheet(nextLevelToOpen));
  }
}

async function startWorldLevel(levelNumber) {
  if (worldLevelState(levelNumber) === "locked") return;
  levelSheetPlayButton.disabled = true;
  await ensureAssetsForLevel(levelNumber);
  levelSheetPlayButton.disabled = false;
  closeWorldLevelSheet();
  worldReplayFrontier =
    levelNumber < worldProgress.unlockedLevel ? worldProgress.unlockedLevel : null;
  level = levelNumber;
  const config = LEVEL_CONFIGS[level - 1];
  grantIntroPowerIfNeeded(config);
  const variantIndex = levelVariantStates[level - 1]?.current;
  worldScreenEl.hidden = true;
  gameShellEl.hidden = false;
  document.body.classList.remove("world-view");
  if (globalThis.history?.state?.mouseMazeView !== "game") {
    globalThis.history?.pushState({ mouseMazeView: "game" }, "");
  }

  if (config && Number.isInteger(variantIndex) && variantIndex >= 0) {
    loadLevelVariant(config, variantIndex, "full");
  } else {
    generateLevel();
  }
  scheduleNextLevelPreload(levelNumber);
  requestMazeDraw();
}

function initializeWorldExperience() {
  loadWorldProgress();
  saveWorldProgress();
  showWorldMap();
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
  const progressionLocked = !isPowerUnlocked(powerKey);
  const empty = count <= 0;
  const activePowerKey = getActivePowerKey();
  const lockedBySelection = Boolean(activePowerKey && activePowerKey !== powerKey);
  const transformingThisPower = powerTransform?.powerKey === powerKey;

  button.classList.toggle("active", active);
  button.classList.toggle("empty", empty && !transformingThisPower);
  button.classList.toggle("selection-locked", lockedBySelection);
  button.classList.toggle("progression-locked", progressionLocked);
  button.disabled =
    progressionLocked ||
    !powerControlsEnabled ||
    Boolean(powerTransform) ||
    lockedBySelection ||
    (!empty && !active && !canUse);
  button.setAttribute("aria-pressed", String(active));
  if (progressionLocked) {
    button.setAttribute("aria-label", `${config.name}. Locked`);
    button.title = `${config.name} - Locked`;
    return;
  }
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
  if (remainingObjectiveCount() !== 1) return false;
  return getFishingCatchTargets().some(
    (target) => target.kind === "cheese" || target.kind === "pie",
  );
}

function rocketCanFinishLevel() {
  if (remainingObjectiveCount() !== 1) return false;
  return getRocketTargets().some(
    (target) =>
      target.kind === "pie" ||
      Boolean(cheeseAt(target)),
  );
}

function updateMoveWarningUI() {
  const warningActive = !gameOver && !campaignComplete && movesLeft > 0 && movesLeft <= 5;
  const criticalMoves = warningActive && movesLeft <= 2;
  movesStatEl.classList.toggle("moves-warning-slow", warningActive && !criticalMoves);
  movesStatEl.classList.toggle("moves-warning-fast", criticalMoves);
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
    !swipeTutorialActive &&
    !mechanicTutorial &&
    !crystalTutorialActive &&
    !tornadoTutorialActive &&
    !powerIntroTutorialActive &&
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
      : swipeTutorialActive
        ? "Swipe tutorial in progress"
      : mechanicTutorial
        ? `${MECHANIC_TUTORIAL_MESSAGES[mechanicTutorial.kind] ?? "Maze element tutorial"}`
      : crystalTutorialActive
        ? "Crystal Vision tutorial in progress"
      : tornadoTutorialActive
        ? "Maze Tornado tutorial in progress"
      : powerIntroTutorialActive
        ? `${POWER_CONFIGS[powerIntroTutorialKey]?.name ?? "Power"} tutorial in progress`
      : powerTransform
      ? "Power transformation in progress"
      : tornadoWallAnimation
        ? "Tornado is rearranging the maze"
      : hammerWallAnimation
          ? "Hammer is breaking the selected wall"
        : rocketFlightAnimation
          ? "Rocket is flying to the selected landing square"
        : fishingCatchAnimating
          ? "Fishing rod is casting and retrieving an objective"
        : crystalRevealing
          ? "Crystal Vision is revealing the route"
      : crystalActive
      ? "Tap the highlighted crystal ball to reveal the route"
      : tornadoActive
        ? "Tap the highlighted tornado to change the maze"
        : fishingActive
          ? "Tap a catchable objective on a highlighted diagonal square"
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
  mazeEl.setAttribute("aria-busy", "false");
}

function clearHingedWallAnimation() {
  if (hingedWallAnimationFrame !== null) cancelAnimationFrame(hingedWallAnimationFrame);
  hingedWallAnimation = null;
  hingedWallAnimationFrame = null;
  for (const wall of hingedWalls) wall.moving = false;
  mazeEl.setAttribute("aria-busy", "false");
}

function clearMilkAnimations() {
  if (milkKnockAnimationFrame !== null) cancelAnimationFrame(milkKnockAnimationFrame);
  if (milkDrinkAnimationFrame !== null) cancelAnimationFrame(milkDrinkAnimationFrame);
  milkKnockAnimation = null;
  milkKnockAnimationFrame = null;
  milkDrinkAnimation = null;
  milkDrinkAnimationFrame = null;
}

function clearPieBiteAnimation() {
  if (pieBiteAnimationFrame !== null) cancelAnimationFrame(pieBiteAnimationFrame);
  pieBiteAnimation = null;
  pieBiteAnimationFrame = null;
  mazeEl.setAttribute("aria-busy", "false");
}

function clearCarAnimations() {
  if (carMotionFrame !== null) cancelAnimationFrame(carMotionFrame);
  if (carCaptureAnimationFrame !== null) cancelAnimationFrame(carCaptureAnimationFrame);
  carMotion = null;
  carMotionFrame = null;
  carCaptureAnimation = null;
  carCaptureAnimationFrame = null;
}

function clearCockroachAnimation() {
  if (cockroachAnimationFrame !== null) cancelAnimationFrame(cockroachAnimationFrame);
  cockroachAnimation = null;
  cockroachAnimationFrame = null;
  mazeEl.setAttribute("aria-busy", "false");
}

function clearCatPawAnimation() {
  if (catPawAnimationFrame !== null) cancelAnimationFrame(catPawAnimationFrame);
  catPawAnimation = null;
  catPawAnimationFrame = null;
  mazeEl.setAttribute("aria-busy", "false");
}

function clearCrowAnimation() {
  if (crowAnimationFrame !== null) cancelAnimationFrame(crowAnimationFrame);
  crowAnimation = null;
  crowAnimationFrame = null;
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
  if (waterIsActive()) {
    const route = currentObjectiveRoute()?.path ?? [];
    if (!route.length) return [];
    const floodArrivals = waterArrivalMoves();
    const safe = route.every((cell, index) => {
      const floodArrival = floodArrivals.get(keyOf(cell)) ?? Number.POSITIVE_INFINITY;
      return (
        !floodedWaterKeys.has(keyOf(cell)) &&
        waterMoveCount + index < floodArrival
      );
    });
    return safe ? route : [];
  }
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

function tornadoFixedCellKeys() {
  return new Set([
    ...rotatingCircuits.flatMap((circuit) => circuit.cells.map(keyOf)),
    ...tunnels.filter((tunnel) => !tunnel.sealed).map(keyOf),
    ...floodedWaterKeys,
  ]);
}

function tornadoVariantFitsFixedElements(variant) {
  const fixedKeys = tornadoFixedCellKeys();
  if (!fixedKeys.size) return true;
  const movingCells = [
    ...(variant.exits ?? (variant.exit ? [variant.exit] : [])),
    ...(variant.milkBottles ?? []),
    ...(variant.rocks ?? []),
    ...pieFootprintCells(variant.pie),
  ];
  return movingCells.every((cell) => !fixedKeys.has(keyOf(cell)));
}

function chooseSafeTornadoCandidate(preferShortestRoute = false) {
  const config = LEVEL_CONFIGS[level - 1];
  if (!config || allObjectivesComplete()) return null;
  const variantIndices = shuffledVariantIndices().filter(
    (variantIndex) => variantIndex !== activeVariantIndex,
  );
  const candidates = [];

  for (const variantIndex of variantIndices) {
    const variant = buildLevelVariant(config, variantIndex);
    if (!variant?.grid?.length || !tornadoVariantFitsFixedElements(variant)) continue;
    const relocatedCheeses = cheeseTargets
      .map((target, index) => ({
        ...target,
        ...(variant.exits?.[index] ?? variant.exit ?? target),
        id: target.id,
      }))
      .filter((target) => !cheeseWasCollected(target));
    const route = bestCheeseRoute(variant.grid, mouse, relocatedCheeses);
    const candidate = {
      grid: variant.grid,
      variantIndex,
      cheeseTargets: variant.exits ?? (variant.exit ? [variant.exit] : []),
      milkBottles: variant.milkBottles ?? [],
      pie: variant.pie ?? null,
      rocks: variant.rocks ?? [],
      hiddenCheeseKeys: variant.hiddenCheeseKeys ?? [],
      hingedWalls: variant.hingedWalls ?? [],
      routeDistance: route?.path?.length ? route.path.length - 1 : Number.POSITIVE_INFINITY,
    };
    if (!preferShortestRoute) return candidate;
    candidates.push(candidate);
  }
  if (!candidates.length) return null;
  if (preferShortestRoute) {
    candidates.sort((first, second) => first.routeDistance - second.routeDistance);
  }
  return candidates[0];
}

function activateTornadoPower(preselectedCandidate = null) {
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

  tornadoCandidate = preselectedCandidate ?? chooseSafeTornadoCandidate();
  if (!tornadoCandidate) {
    mazeEl.classList.remove("invalid");
    void mazeEl.offsetWidth;
    mazeEl.classList.add("invalid");
    setMessage("No alternate maze variation is available.", true);
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
    setMessage("No catchable objective is inside the fishing rod's diagonal range.", true);
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
  beginPowerSelection("fishing", "Choose a glowing objective to reel it in.");
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
      if (!isInside(row, col)) continue;
      if (isInside(row, col + 1)) edges.push({ row, col, dir: DIRS[1] });
      if (isInside(row + 1, col)) edges.push({ row, col, dir: DIRS[2] });
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
    for (const cell of row) cell.visited = cell.active;
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
    if (!isInside(row, col) || !isInside(nextRow, nextCol) || !grid[row][col].walls[dir.wall]) continue;
    grid[row][col].walls[dir.wall] = false;
    grid[nextRow][nextCol].walls[dir.opposite] = false;
    opened += 1;
  }
}

function isInside(row, col) {
  return (
    row >= 0 &&
    row < ROWS &&
    col >= 0 &&
    col < COLS &&
    ACTIVE_CELL_KEYS.has(`${row},${col}`)
  );
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
  const targets = cheeseTargets.length ? cheeseTargets : exit ? [exit] : [];
  return targets.filter((target) => !cheeseWasCollected(target));
}

function cheeseIdentity(target) {
  return target?.id ?? keyOf(target);
}

function cheeseWasCollected(target) {
  return collectedCheeseKeys.has(cheeseIdentity(target));
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

function randomCockroachTrigger() {
  return (
    COCKROACH_MIN_TRIGGER_MOVES +
    Math.floor(
      Math.random() *
        (COCKROACH_MAX_TRIGGER_MOVES - COCKROACH_MIN_TRIGGER_MOVES + 1),
    )
  );
}

function cockroachActionLimit() {
  const mode = currentLevelConfig().cockroachMode;
  if (!mode) return 0;
  return mode === "single" ? 1 : Number.POSITIVE_INFINITY;
}

function resetCockroachRun() {
  clearCockroachAnimation();
  cockroachMovesSinceAction = 0;
  cockroachNextTrigger = randomCockroachTrigger();
  cockroachActionsUsed = 0;
  cockroachDefeated = false;
}

function cockroachHardObstacleAt(cell, movingBottleId = null, relocatedBottle = null) {
  if (!cell) return true;
  const cellKey = keyOf(cell);
  if (relocatedBottle && cellKey === keyOf(relocatedBottle)) return true;
  if (rockAt(cell) || pieQuarterAt(cell) || activeTunnelAt(cell)) return true;
  if (car && cellKey === keyOf(car)) return true;
  return milkBottles.some(
    (bottle) => bottle.id !== movingBottleId && keyOf(bottle) === cellKey,
  );
}

function cockroachCellIsReachable(from, target, movingBottleId, destination) {
  if (cockroachHardObstacleAt(target, movingBottleId, destination)) return false;
  const queue = [{ ...from }];
  const seen = new Set([keyOf(from)]);

  for (let index = 0; index < queue.length; index += 1) {
    const current = queue[index];
    if (keyOf(current) === keyOf(target)) return true;
    for (const next of neighbors(maze, maze[current.row][current.col])) {
      const nextKey = keyOf(next);
      if (
        seen.has(nextKey) ||
        cockroachHardObstacleAt(next, movingBottleId, destination)
      ) {
        continue;
      }
      seen.add(nextKey);
      queue.push({ row: next.row, col: next.col });
    }
  }
  return false;
}

function relocatedBottleRemainsUsable(bottleId, destination, mouseStart = mouse) {
  return DIRS.some((direction) => {
    const approach = {
      row: destination.row - direction.row,
      col: destination.col - direction.col,
    };
    const spill = {
      row: destination.row + direction.row,
      col: destination.col + direction.col,
    };
    if (
      !isInside(approach.row, approach.col) ||
      !isInside(spill.row, spill.col) ||
      !hasOpenPassageBetween(maze, approach, destination) ||
      !hasOpenPassageBetween(maze, destination, spill) ||
      cockroachHardObstacleAt(spill, bottleId, destination) ||
      Boolean(milkPuddleAt(spill)) ||
      remainingCheeseTargets().some((target) => keyOf(target) === keyOf(spill))
    ) {
      return false;
    }
    return (
      cockroachCellIsReachable(mouseStart, approach, bottleId, destination) &&
      cockroachCellIsReachable(approach, spill, bottleId, destination)
    );
  });
}

function cockroachCanLeaveBottleUsable(bottleId, destination) {
  return relocatedBottleRemainsUsable(bottleId, destination, mouse);
}

function cockroachDestinationOptions() {
  const remaining = remainingCheeseTargets();
  const movableObjectives = [
    ...remaining
      .filter((target) => isCheeseVisible(target))
      .map((target) => ({
        kind: "cheese",
        targetIndex: cheeseTargets.findIndex(
          (candidate) => keyOf(candidate) === keyOf(target),
        ),
        from: { row: target.row, col: target.col },
      })),
    ...milkBottles
      .filter((bottle) => !bottle.knocked && !collectedMilkIds.has(bottle.id))
      .map((bottle) => ({
        kind: "milk",
        bottleId: bottle.id,
        from: { row: bottle.row, col: bottle.col },
      })),
  ];
  const options = [];

  for (const objective of movableObjectives) {
    if (objective.kind === "cheese" && objective.targetIndex < 0) continue;
    for (const jump of COCKROACH_JUMPS) {
      const destination = {
        row: objective.from.row + jump.row,
        col: objective.from.col + jump.col,
      };
      if (!isInside(destination.row, destination.col)) continue;
      const destinationKey = keyOf(destination);
      const occupied =
        destinationKey === keyOf(mouse) ||
        Boolean(car && destinationKey === keyOf(car)) ||
        Boolean(rockAt(destination)) ||
        Boolean(milkBottleAt(destination)) ||
        Boolean(milkPuddleAt(destination)) ||
        Boolean(pieQuarterAt(destination)) ||
        remaining.some(
          (candidate) =>
            !(objective.kind === "cheese" && keyOf(candidate) === keyOf(objective.from)) &&
            keyOf(candidate) === destinationKey,
        );
      if (occupied) continue;
      if (
        objective.kind === "milk" &&
        !cockroachCanLeaveBottleUsable(objective.bottleId, destination)
      ) {
        continue;
      }
      options.push({
        ...objective,
        to: destination,
        direction: jump.key,
        distance: jump.distance,
      });
    }
  }

  return options;
}

function applyCockroachRelocation(animation) {
  if (!animation) return;
  if (animation.kind === "milk") {
    const bottle = milkBottles.find((candidate) => candidate.id === animation.bottleId);
    if (bottle && !bottle.knocked && keyOf(bottle) === keyOf(animation.from)) {
      bottle.row = animation.to.row;
      bottle.col = animation.to.col;
    }
  } else {
    const target = cheeseTargets[animation.targetIndex];
    if (
      target &&
      !cheeseWasCollected(target) &&
      keyOf(target) === keyOf(animation.from)
    ) {
      cheeseTargets[animation.targetIndex] = { ...target, ...animation.to };
    }
  }
  cockroachActionsUsed += 1;
  cockroachMovesSinceAction = 0;
  cockroachNextTrigger = randomCockroachTrigger();
  syncActiveExit();
}

function finishCockroachAnimation() {
  const animation = cockroachAnimation;
  if (!animation) return;
  applyCockroachRelocation(animation);
  const queuedDirection = animation.queuedDirection;
  cockroachAnimation = null;
  cockroachAnimationFrame = null;
  mazeEl.setAttribute("aria-busy", "false");
  setMovementControlsEnabled(true);
  setPowerControlsEnabled(true);
  setMessage(
    animation.kind === "milk"
      ? "The cockroach moved an unopened milk bottle."
      : "The cockroach carried a cheese to another part of the maze.",
    true,
  );
  render();
  saveCampaignState();
  if (queuedDirection) move(queuedDirection);
}

function cockroachEventOption() {
  const config = currentLevelConfig();
  if (
    !config.cockroachMode ||
    cockroachDefeated ||
    cockroachAnimation ||
    cockroachActionsUsed >= cockroachActionLimit() ||
    cockroachMovesSinceAction < cockroachNextTrigger
  ) {
    return null;
  }
  const options = cockroachDestinationOptions();
  if (!options.length) {
    cockroachMovesSinceAction = 0;
    cockroachNextTrigger = randomCockroachTrigger();
    return null;
  }
  return options[Math.floor(Math.random() * options.length)];
}

function cockroachVisualCellAtProgress(animation, rawProgress) {
  if (!animation) return null;
  const progress = clamp(rawProgress, 0, 1);
  const from = animation.from;
  const to = animation.to;
  const rowDirection = Math.sign(to.row - from.row);
  const colDirection = Math.sign(to.col - from.col);
  const approach = {
    row: from.row - rowDirection * 0.9,
    col: from.col - colDirection * 0.9,
  };
  const escape = {
    row: to.row + rowDirection * 0.8,
    col: to.col + colDirection * 0.8,
  };
  const mixCell = (first, second, amount) => ({
    row: first.row + (second.row - first.row) * amount,
    col: first.col + (second.col - first.col) * amount,
  });
  if (progress < 0.24) {
    return mixCell(approach, from, smoothStep(progress / 0.24));
  }
  if (progress < 0.78) {
    return mixCell(from, to, smoothStep((progress - 0.24) / 0.54));
  }
  return mixCell(to, escape, smoothStep((progress - 0.78) / 0.22));
}

function startConcurrentCockroachAnimation() {
  const option = cockroachEventOption();
  if (!option) return null;
  cockroachAnimation = {
    ...option,
    queuedDirection: null,
    concurrentHazard: true,
    progress: 0,
    startedAt: null,
  };
  return cockroachAnimation;
}

function finishConcurrentCockroachAnimation(caught) {
  const animation = cockroachAnimation;
  if (!animation?.concurrentHazard) return false;
  if (caught) {
    cockroachDefeated = true;
    cockroachMovesSinceAction = 0;
  } else {
    applyCockroachRelocation(animation);
  }
  cockroachAnimation = null;
  return caught;
}

function animateCockroach(timestamp) {
  if (!cockroachAnimation) return;
  if (cockroachAnimation.startedAt === null) cockroachAnimation.startedAt = timestamp;
  cockroachAnimation.progress = clamp(
    (timestamp - cockroachAnimation.startedAt) / COCKROACH_MOVE_DURATION_MS,
    0,
    1,
  );
  drawMaze();
  if (cockroachAnimation.progress >= 1) finishCockroachAnimation();
  else cockroachAnimationFrame = requestAnimationFrame(animateCockroach);
}

function startCockroachAnimation(option, queuedDirection = null) {
  cockroachAnimation = {
    ...option,
    queuedDirection,
    progress: 0,
    startedAt: null,
  };
  setMovementControlsEnabled(false);
  setPowerControlsEnabled(false);
  mazeEl.setAttribute("aria-busy", "true");
  setMessage(
    option.kind === "milk"
      ? "The cockroach has spotted an unopened milk bottle..."
      : "The cockroach has spotted a cheese...",
  );
  requestMazeDraw();
  if (!canAnimateMouseMotion()) finishCockroachAnimation();
  else cockroachAnimationFrame = requestAnimationFrame(animateCockroach);
}

function maybeStartCockroach(queuedDirection = null) {
  const option = cockroachEventOption();
  if (!option) return false;
  startCockroachAnimation(option, queuedDirection);
  return true;
}

function randomCatPawTrigger() {
  return CAT_PAW_TRIGGER_MOVES[
    Math.floor(Math.random() * CAT_PAW_TRIGGER_MOVES.length)
  ];
}

function catPawThreatOptions() {
  const options = [];
  const addOption = (side, start, cells) => {
    if (cells.length === 6 && cells.every((cell) => isInside(cell.row, cell.col))) {
      options.push({ side, start, cells });
    }
  };

  for (let col = 0; col <= COLS - 2; col += 1) {
    addOption(
      "top",
      col,
      [0, 1, 2].flatMap((row) =>
        [0, 1].map((offset) => ({ row, col: col + offset })),
      ),
    );
    addOption(
      "bottom",
      col,
      [ROWS - 3, ROWS - 2, ROWS - 1].flatMap((row) =>
        [0, 1].map((offset) => ({ row, col: col + offset })),
      ),
    );
  }

  for (let row = 0; row <= ROWS - 2; row += 1) {
    addOption(
      "left",
      row,
      [0, 1].flatMap((offset) =>
        [0, 1, 2].map((col) => ({ row: row + offset, col })),
      ),
    );
    addOption(
      "right",
      row,
      [0, 1].flatMap((offset) =>
        [COLS - 3, COLS - 2, COLS - 1].map((col) => ({ row: row + offset, col })),
      ),
    );
  }

  return options;
}

function catPawThreatContains(threat, cell) {
  return Boolean(
    threat?.cells.some(
      (candidate) => candidate.row === cell.row && candidate.col === cell.col,
    ),
  );
}

function chooseCatPawThreat() {
  const options = catPawThreatOptions();
  if (!options.length) return null;
  const threateningOptions = options.filter((option) =>
    catPawThreatContains(option, mouse),
  );
  const pool = threateningOptions.length ? threateningOptions : options;
  const selected = pool[Math.floor(Math.random() * pool.length)];
  return {
    ...selected,
    cells: selected.cells.map((cell) => ({ ...cell })),
  };
}

function catPawMovesUntilStrike() {
  if (!currentLevelConfig().catPawMode) return Number.POSITIVE_INFINITY;
  return Math.max(0, catPawNextTrigger - catPawMovesSinceStrike);
}

function resetCatPawRun() {
  clearCatPawAnimation();
  catPawMovesSinceStrike = 0;
  catPawNextTrigger = randomCatPawTrigger();
  catPawThreat = null;
  catPawStrikePending = false;
}

function advanceCatPawClockAfterMouseMove() {
  if (!currentLevelConfig().catPawMode) return;
  catPawMovesSinceStrike += 1;
  const remaining = catPawMovesUntilStrike();
  if (remaining <= 2 && !catPawThreat) catPawThreat = chooseCatPawThreat();
  if (remaining === 0) catPawStrikePending = true;
  requestMazeDraw();
}

function finishCatPawAnimation() {
  const animation = catPawAnimation;
  if (!animation) return;
  if (animation.caughtCar) car = null;
  const caughtCockroach = finishConcurrentCockroachAnimation(
    animation.caughtCockroach,
  );
  catPawAnimation = null;
  catPawAnimationFrame = null;
  catPawThreat = null;
  catPawStrikePending = false;
  catPawMovesSinceStrike = 0;
  catPawNextTrigger = randomCatPawTrigger();
  mazeEl.setAttribute("aria-busy", "false");
  requestMazeDraw();

  if (animation.caught) {
    loseLevel("The cat's paw swept the mouse out of the maze.");
    return;
  }

  setMovementControlsEnabled(true);
  setPowerControlsEnabled(true);
  setMessage(
    animation.caughtCar
      ? "The cat's paw swept the remote-control car away."
      : caughtCockroach
        ? "The cat's paw caught the cockroach."
        : "The paw missed. Keep moving before the cat tries again.",
  );
  saveCampaignState();
  resolvePlayerArrival(animation.queuedDirection);
}

function animateCatPaw(timestamp) {
  if (!catPawAnimation) return;
  if (catPawAnimation.startedAt === null) catPawAnimation.startedAt = timestamp;
  catPawAnimation.progress = clamp(
    (timestamp - catPawAnimation.startedAt) / CAT_PAW_STRIKE_DURATION_MS,
    0,
    1,
  );
  if (cockroachAnimation?.concurrentHazard) {
    cockroachAnimation.progress = catPawAnimation.progress;
  }
  drawMaze();
  if (catPawAnimation.progress >= 1) finishCatPawAnimation();
  else catPawAnimationFrame = requestAnimationFrame(animateCatPaw);
}

function startCatPawAnimation(queuedDirection = null) {
  const threat = catPawThreat ?? chooseCatPawThreat();
  if (!threat) {
    resetCatPawRun();
    return false;
  }
  startConcurrentCockroachAnimation();
  const cockroachImpactCell = cockroachAnimation?.concurrentHazard
    ? cockroachVisualCellAtProgress(cockroachAnimation, CAT_PAW_IMPACT_START)
    : null;
  const caughtCockroach = Boolean(
    cockroachImpactCell &&
      catPawThreatContains(threat, {
        row: Math.round(cockroachImpactCell.row),
        col: Math.round(cockroachImpactCell.col),
      }),
  );
  const caught = catPawThreatContains(threat, mouse);
  catPawAnimation = {
    threat,
    caught,
    caughtCar: Boolean(car && catPawThreatContains(threat, car)),
    caughtCockroach,
    queuedDirection,
    progress: 0,
    startedAt: null,
  };
  catPawStrikePending = false;
  if (caught) {
    gameOver = true;
    retryCostsAttempt = true;
  }
  setMovementControlsEnabled(false);
  setPowerControlsEnabled(false);
  controlsPanelEl.hidden = true;
  mazeEl.setAttribute("aria-busy", "true");
  setMessage(caught ? "The cat has the mouse in its sights..." : "The cat is striking the warned edge...");
  requestMazeDraw();
  if (!canAnimateMouseMotion()) finishCatPawAnimation();
  else catPawAnimationFrame = requestAnimationFrame(animateCatPaw);
  return true;
}

function maybeStartCatPawStrike(queuedDirection = null) {
  if (
    !currentLevelConfig().catPawMode ||
    !catPawStrikePending ||
    catPawAnimation
  ) {
    return false;
  }
  return startCatPawAnimation(queuedDirection);
}

function randomCrowTrigger() {
  return CROW_TRIGGER_MOVES[
    Math.floor(Math.random() * CROW_TRIGGER_MOVES.length)
  ];
}

function crowCellTouchesOuterWall(cell) {
  if (!isInside(cell.row, cell.col)) return true;
  return (
    cell.row === 0 ||
    cell.row === ROWS - 1 ||
    cell.col === 0 ||
    cell.col === COLS - 1
  );
}

function crowCanCatchCell(cell) {
  return isInside(cell.row, cell.col) && !crowCellTouchesOuterWall(cell);
}

function crowThreatCells(startRow, startCol, size = 3) {
  return Array.from({ length: size }, (_, rowOffset) =>
    Array.from({ length: size }, (__, colOffset) => ({
      row: startRow + rowOffset,
      col: startCol + colOffset,
    })),
  ).flat();
}

function crowThreatOptions() {
  const options = [];
  for (let row = 1; row <= ROWS - 4; row += 1) {
    for (let col = 1; col <= COLS - 4; col += 1) {
      const cells = crowThreatCells(row, col);
      const warningCells = crowThreatCells(row - 1, col - 1, 5);
      if (warningCells.every((cell) => isInside(cell.row, cell.col))) {
        options.push({ startRow: row, startCol: col, cells });
      }
    }
  }
  return options;
}

function crowThreatContains(threat, cell) {
  return Boolean(
    threat?.cells?.some(
      (candidate) => candidate.row === cell.row && candidate.col === cell.col,
    ),
  );
}

function crowThreatCenterCell(threat) {
  if (!threat?.cells?.length) return { ...mouse };
  return threat.cells.reduce(
    (center, cell) => ({
      row: center.row + cell.row / threat.cells.length,
      col: center.col + cell.col / threat.cells.length,
    }),
    { row: 0, col: 0 },
  );
}

function chooseCrowThreat() {
  const options = crowThreatOptions();
  if (!options.length) return null;
  const threateningOptions = options.filter((option) =>
    crowThreatContains(option, mouse),
  );
  let pool = threateningOptions;
  if (!pool.length) {
    const distances = options.map((option) => {
      const center = crowThreatCenterCell(option);
      return Math.abs(center.row - mouse.row) + Math.abs(center.col - mouse.col);
    });
    const nearestDistance = Math.min(...distances);
    pool = options.filter((_, index) => distances[index] === nearestDistance);
  }
  const selected = pool[Math.floor(Math.random() * pool.length)];
  return {
    ...selected,
    cells: selected.cells.map((cell) => ({ ...cell })),
  };
}

function crowMovesUntilStrike() {
  if (!currentLevelConfig().crowMode) return Number.POSITIVE_INFINITY;
  return Math.max(0, crowNextTrigger - crowMovesSinceStrike);
}

function resetCrowRun() {
  clearCrowAnimation();
  crowMovesSinceStrike = 0;
  crowNextTrigger = randomCrowTrigger();
  crowThreat = null;
  crowStrikePending = false;
  mouseCapturedByCrow = false;
}

function advanceCrowClockAfterMouseMove() {
  if (!currentLevelConfig().crowMode) return;
  crowMovesSinceStrike += 1;
  const remaining = crowMovesUntilStrike();
  if (remaining <= 2 && !crowThreat && !cloudCoversCell(mouse)) {
    crowThreat = chooseCrowThreat();
  }
  if (remaining === 0) {
    if (crowThreat) crowStrikePending = true;
    else resetCrowRun();
  }
  requestMazeDraw();
}

function finishCrowAnimation() {
  const animation = crowAnimation;
  if (!animation) return;
  if (animation.caughtCar) car = null;
  const caughtCockroach = finishConcurrentCockroachAnimation(
    animation.caughtCockroach,
  );
  crowAnimation = null;
  crowAnimationFrame = null;
  crowThreat = null;
  crowStrikePending = false;
  crowMovesSinceStrike = 0;
  crowNextTrigger = randomCrowTrigger();
  mazeEl.setAttribute("aria-busy", "false");
  requestMazeDraw();

  if (animation.caught) {
    mouseCapturedByCrow = true;
    loseLevel("The crow carried the mouse out of the maze.");
    return;
  }

  setMovementControlsEnabled(true);
  setPowerControlsEnabled(true);
  setMessage(
    animation.caughtCar
      ? "The crow carried the remote-control car away."
      : caughtCockroach
        ? "The crow carried the cockroach away."
        : animation.blockedByCloud
          ? "The cloud concealed the mouse from the crow."
          : animation.blockedByWall
            ? "The wall sheltered the mouse from the crow."
            : "The crow missed. Stay close to a wall when its shadow returns.",
  );
  saveCampaignState();
  resolvePlayerArrival(animation.queuedDirection);
}

function animateCrow(timestamp) {
  if (!crowAnimation) return;
  if (crowAnimation.startedAt === null) crowAnimation.startedAt = timestamp;
  crowAnimation.progress = clamp(
    (timestamp - crowAnimation.startedAt) / CROW_STRIKE_DURATION_MS,
    0,
    1,
  );
  if (cockroachAnimation?.concurrentHazard) {
    cockroachAnimation.progress = crowAnimation.progress;
  }
  drawMaze();
  if (crowAnimation.progress >= 1) finishCrowAnimation();
  else crowAnimationFrame = requestAnimationFrame(animateCrow);
}

function startCrowAnimation(queuedDirection = null) {
  const threat = crowThreat ?? chooseCrowThreat();
  if (!threat) {
    resetCrowRun();
    return false;
  }
  startConcurrentCockroachAnimation();
  const targetedCell = crowThreatContains(threat, mouse) ? { ...mouse } : null;
  const blockedByWall = Boolean(targetedCell && crowCellTouchesOuterWall(targetedCell));
  const blockedByCloud = Boolean(targetedCell && cloudCoversCell(targetedCell));
  const caught = Boolean(targetedCell && !blockedByWall && !blockedByCloud);
  const carTargeted = Boolean(car && crowThreatContains(threat, car));
  const caughtCar = Boolean(
    carTargeted &&
      !crowCellTouchesOuterWall(car) &&
      !cloudCoversCell(car),
  );
  const cockroachImpactCell = cockroachAnimation?.concurrentHazard
    ? cockroachVisualCellAtProgress(cockroachAnimation, CROW_IMPACT_START)
    : null;
  const roundedCockroachImpactCell = cockroachImpactCell
    ? {
        row: Math.round(cockroachImpactCell.row),
        col: Math.round(cockroachImpactCell.col),
      }
    : null;
  const caughtCockroach = Boolean(
    roundedCockroachImpactCell &&
      crowThreatContains(threat, roundedCockroachImpactCell) &&
      !crowCellTouchesOuterWall(roundedCockroachImpactCell) &&
      !cloudCoversCell(roundedCockroachImpactCell),
  );
  crowAnimation = {
    threat,
    flightDiagonal:
      CROW_FLIGHT_DIAGONALS[
        Math.floor(Math.random() * CROW_FLIGHT_DIAGONALS.length)
      ],
    caught,
    caughtCar,
    caughtCockroach,
    caughtCell: caught ? { ...mouse } : null,
    targetedCell,
    blockedByWall,
    blockedByCloud,
    queuedDirection,
    progress: 0,
    startedAt: null,
  };
  crowStrikePending = false;
  if (caught) {
    gameOver = true;
    retryCostsAttempt = true;
  }
  setMovementControlsEnabled(false);
  setPowerControlsEnabled(false);
  controlsPanelEl.hidden = true;
  mazeEl.setAttribute("aria-busy", "true");
  setMessage(
    caught
      ? "The crow has caught the mouse in the open..."
      : blockedByCloud
        ? "The cloud is concealing the mouse from the crow..."
        : blockedByWall
          ? "The crow struck, but the wall is sheltering the mouse..."
          : "The crow is diving at the warned squares...",
  );
  requestMazeDraw();
  if (!canAnimateMouseMotion()) finishCrowAnimation();
  else crowAnimationFrame = requestAnimationFrame(animateCrow);
  return true;
}

function maybeStartCrowStrike(queuedDirection = null) {
  if (
    !currentLevelConfig().crowMode ||
    !crowStrikePending ||
    crowAnimation
  ) {
    return false;
  }
  return startCrowAnimation(queuedDirection);
}

const CLOUD_DIRECTIONS = Object.freeze([
  { row: -1, col: 0 },
  { row: 1, col: 0 },
  { row: 0, col: -1 },
  { row: 0, col: 1 },
  { row: -1, col: -1 },
  { row: -1, col: 1 },
  { row: 1, col: -1 },
  { row: 1, col: 1 },
]);

function createCloudPass() {
  const direction = CLOUD_DIRECTIONS[
    Math.floor(randomUnit() * CLOUD_DIRECTIONS.length)
  ];
  const padding = (CLOUD_FOOTPRINT_CELLS + 1) / 2;
  const laneInset = Math.floor(CLOUD_FOOTPRINT_CELLS / 2);
  const laneRow =
    laneInset + randomUnit() * Math.max(0, ROWS - 1 - laneInset * 2);
  const laneCol =
    laneInset + randomUnit() * Math.max(0, COLS - 1 - laneInset * 2);
  const row = direction.row === 0
    ? laneRow
    : direction.row > 0
      ? -padding
      : ROWS - 1 + padding;
  const col = direction.col === 0
    ? laneCol
    : direction.col > 0
      ? -padding
      : COLS - 1 + padding;
  const travelCells = Math.max(
    direction.row ? ROWS : 0,
    direction.col ? COLS : 0,
  ) + Math.ceil(padding * 2);
  return {
    row,
    col,
    direction: { ...direction },
    stepsTaken: 0,
    travelCells,
  };
}

function currentCloudVisualState() {
  if (!cloud) return null;
  if (!cloudAnimation) return { row: cloud.row, col: cloud.col };
  const progress = smoothStep(clamp(cloudAnimation.progress, 0, 1));
  return {
    row:
      cloudAnimation.from.row +
      (cloudAnimation.to.row - cloudAnimation.from.row) * progress,
    col:
      cloudAnimation.from.col +
      (cloudAnimation.to.col - cloudAnimation.from.col) * progress,
  };
}

function cloudCoversCell(cell) {
  const visual = currentCloudVisualState();
  if (!visual || !cell) return false;
  const halfFootprint = CLOUD_FOOTPRINT_CELLS / 2;
  return (
    Math.abs(cell.row - visual.row) < halfFootprint &&
    Math.abs(cell.col - visual.col) < halfFootprint
  );
}

function clearCloudRun() {
  if (cloudStepTimer !== null) clearTimeout(cloudStepTimer);
  if (cloudAnimationFrame !== null) cancelAnimationFrame(cloudAnimationFrame);
  cloudStepTimer = null;
  cloudAnimationFrame = null;
  cloudAnimation = null;
  cloud = null;
  cloudIdleStepsRemaining = 0;
}

function scheduleCloudStep() {
  if (
    !cloud ||
    cloudStepTimer !== null ||
    cloudAnimation ||
    cloudIdleStepsRemaining <= 0 ||
    gameOver ||
    campaignComplete
  ) {
    return;
  }
  cloudStepTimer = setTimeout(() => {
    cloudStepTimer = null;
    startCloudStep();
  }, CLOUD_STEP_INTERVAL_MS);
}

function finishCloudStep() {
  if (!cloud || !cloudAnimation) return;
  cloud.row = cloudAnimation.to.row;
  cloud.col = cloudAnimation.to.col;
  cloud.stepsTaken += 1;
  cloudIdleStepsRemaining = Math.max(0, cloudIdleStepsRemaining - 1);
  cloudAnimation = null;
  cloudAnimationFrame = null;
  if (cloud.stepsTaken >= cloud.travelCells) cloud = createCloudPass();
  requestMazeDraw();
  scheduleCloudStep();
}

function animateCloudStep(timestamp) {
  if (!cloudAnimation) return;
  if (cloudAnimation.startedAt === null) cloudAnimation.startedAt = timestamp;
  cloudAnimation.progress = clamp(
    (timestamp - cloudAnimation.startedAt) / CLOUD_MOVE_DURATION_MS,
    0,
    1,
  );
  drawMaze();
  if (cloudAnimation.progress >= 1) finishCloudStep();
  else cloudAnimationFrame = requestAnimationFrame(animateCloudStep);
}

function startCloudStep() {
  if (!cloud || cloudAnimation || cloudIdleStepsRemaining <= 0 || gameOver) return;
  cloudAnimation = {
    from: { row: cloud.row, col: cloud.col },
    to: {
      row: cloud.row + cloud.direction.row,
      col: cloud.col + cloud.direction.col,
    },
    progress: 0,
    startedAt: null,
  };
  requestMazeDraw();
  if (!canAnimateMouseMotion()) {
    cloudAnimation.progress = 1;
    finishCloudStep();
    return;
  }
  cloudAnimationFrame = requestAnimationFrame(animateCloudStep);
}

function startCloudRun() {
  clearCloudRun();
  if (!currentLevelConfig().cloudMode || gameOver || campaignComplete) return;
  cloud = createCloudPass();
  cloudIdleStepsRemaining = CLOUD_MAX_IDLE_STEPS;
  requestMazeDraw();
  scheduleCloudStep();
}

function noteCloudPlayerAction() {
  if (!cloud || !currentLevelConfig().cloudMode || gameOver) return;
  cloudIdleStepsRemaining = CLOUD_MAX_IDLE_STEPS;
  scheduleCloudStep();
}

function waterIsActive() {
  return Boolean(currentLevelConfig().waterMode);
}

function cellFromKey(key) {
  const [row, col] = String(key).split(",").map(Number);
  return { row, col };
}

function projectedRockPositions(rockPush = null) {
  if (!rockPush) return rockPositions;
  return rockPositions.map((rock) =>
    rock.id === rockPush.id
      ? { ...rock, row: rockPush.to.row, col: rockPush.to.col }
      : rock,
  );
}

function movableObjectiveAt(cell) {
  if (!cell) return null;
  const cheese = remainingCheeseTargets().find(
    (target) => target.row === cell.row && target.col === cell.col,
  );
  if (cheese) {
    return {
      kind: "cheese",
      id: cheeseIdentity(cheese),
      entity: cheese,
    };
  }
  const bottle = milkBottleAt(cell);
  return bottle
    ? { kind: "milk", id: bottle.id, entity: bottle }
    : null;
}

function objectivePushDestinationIsClear(destination, movingObjective, reservedKeys = new Set()) {
  if (!isInside(destination.row, destination.col)) return false;
  const destinationCell = maze[destination.row]?.[destination.col];
  if (!destinationCell?.active || reservedKeys.has(keyOf(destination))) return false;
  if (
    rockAt(destination) ||
    milkBottleAt(destination) ||
    milkPuddleAt(destination) ||
    pieQuarterAt(destination) ||
    activeTunnelAt(destination) ||
    waterCellIsFlooded(destination) ||
    keyOf(mouse) === keyOf(destination) ||
    (car && keyOf(car) === keyOf(destination))
  ) {
    return false;
  }
  return !remainingCheeseTargets().some(
    (target) =>
      cheeseIdentity(target) !== movingObjective.id &&
      keyOf(target) === keyOf(destination),
  );
}

function objectivePushForStep(actorFrom, objectCell, reservedKeys = new Set()) {
  if (!areCardinallyAdjacent(actorFrom, objectCell)) return { blocked: true, push: null };
  const movingObjective = movableObjectiveAt(objectCell);
  if (!movingObjective) return { blocked: false, push: null };
  const rowDelta = objectCell.row - actorFrom.row;
  const colDelta = objectCell.col - actorFrom.col;
  const direction = DIRS.find(
    (candidate) => candidate.row === rowDelta && candidate.col === colDelta,
  );
  const sourceCell = maze[objectCell.row]?.[objectCell.col];
  const destination = {
    row: objectCell.row + rowDelta,
    col: objectCell.col + colDelta,
  };
  if (
    !direction ||
    !sourceCell ||
    sourceCell.walls[direction.wall] ||
    !objectivePushDestinationIsClear(destination, movingObjective, reservedKeys)
  ) {
    return { blocked: true, push: null };
  }
  return {
    blocked: false,
    push: {
      kind: movingObjective.kind,
      id: movingObjective.id,
      from: { row: objectCell.row, col: objectCell.col },
      to: destination,
    },
  };
}

function applyObjectivePush(push) {
  if (!push) return;
  if (push.kind === "cheese") {
    const target = cheeseTargets.find(
      (candidate) => cheeseIdentity(candidate) === push.id,
    );
    if (!target || cheeseWasCollected(target)) return;
    const hidden = hiddenCheeseKeys.delete(keyOf(target));
    target.row = push.to.row;
    target.col = push.to.col;
    if (hidden) hiddenCheeseKeys.add(keyOf(target));
    return;
  }
  if (push.kind === "milk") {
    const bottle = milkBottles.find((candidate) => candidate.id === push.id);
    if (!bottle || bottle.glassDestroyed) return;
    bottle.row = push.to.row;
    bottle.col = push.to.col;
  }
}

function uniqueObjectivePushes(...groups) {
  const pushes = groups.flat().filter(Boolean);
  const seen = new Set();
  return pushes.filter((push) => {
    const identity = `${push.kind}:${push.id}`;
    if (seen.has(identity)) return false;
    seen.add(identity);
    return true;
  });
}

function waterExpansionEdges(floodedKeys = floodedWaterKeys, rocks = rockPositions) {
  const edges = [];
  const seen = new Set();
  for (const floodedKey of floodedKeys) {
    const from = cellFromKey(floodedKey);
    const mazeCell = maze[from.row]?.[from.col];
    if (!mazeCell) continue;
    for (const next of neighbors(maze, mazeCell)) {
      const nextKey = keyOf(next);
      if (floodedKeys.has(nextKey) || rockAt(next, rocks) || seen.has(nextKey)) continue;
      seen.add(nextKey);
      edges.push({ from, to: { row: next.row, col: next.col } });
    }
  }
  return edges;
}

function waterExpansionKeys(floodedKeys = floodedWaterKeys, rocks = rockPositions) {
  return waterExpansionEdges(floodedKeys, rocks).map(({ to }) => keyOf(to));
}

function waterArrivalMoves(rocks = rockPositions) {
  const arrivalMoves = new Map([[keyOf(waterOrigin), WATER_PREPARATION_MOVES]]);
  const queue = [{ ...waterOrigin }];
  while (queue.length) {
    const current = queue.shift();
    const currentArrival = arrivalMoves.get(keyOf(current));
    const mazeCell = maze[current.row]?.[current.col];
    if (!mazeCell) continue;
    for (const next of neighbors(maze, mazeCell)) {
      const nextKey = keyOf(next);
      if (arrivalMoves.has(nextKey) || rockAt(next, rocks)) continue;
      arrivalMoves.set(nextKey, currentArrival + 1);
      queue.push({ row: next.row, col: next.col });
    }
  }
  return arrivalMoves;
}

function findWaterSafePath(start, target, rocks = rockPositions) {
  if (!waterIsActive() || !start || !target) return [];
  const arrivalMoves = waterArrivalMoves(rocks);
  const queue = [{ ...start, path: [{ ...start }] }];
  const earliestVisit = new Map([[keyOf(start), 0]]);
  while (queue.length) {
    const current = queue.shift();
    if (keyOf(current) === keyOf(target)) return current.path;
    const mazeCell = maze[current.row]?.[current.col];
    if (!mazeCell) continue;
    for (const next of neighbors(maze, mazeCell)) {
      const nextKey = keyOf(next);
      const steps = current.path.length;
      const playerArrivalMove = waterMoveCount + steps;
      const floodArrivalMove = arrivalMoves.get(nextKey) ?? Number.POSITIVE_INFINITY;
      if (
        rockAt(next, rocks) ||
        floodedWaterKeys.has(nextKey) ||
        playerArrivalMove >= floodArrivalMove ||
        (earliestVisit.get(nextKey) ?? Number.POSITIVE_INFINITY) <= steps
      ) {
        continue;
      }
      earliestVisit.set(nextKey, steps);
      queue.push({
        row: next.row,
        col: next.col,
        path: [...current.path, { row: next.row, col: next.col }],
      });
    }
  }
  return [];
}

function waterAdvanceForNextMove(rocks = rockPositions) {
  if (!waterIsActive()) return null;
  const moveCount = waterMoveCount + 1;
  if (moveCount < WATER_PREPARATION_MOVES) return { moveCount, newKeys: [], pushes: [] };
  if (moveCount === WATER_PREPARATION_MOVES) {
    return { moveCount, newKeys: [keyOf(waterOrigin)], pushes: [] };
  }
  const edges = waterExpansionEdges(floodedWaterKeys, rocks);
  const newKeys = edges.map(({ to }) => keyOf(to));
  const reservedKeys = new Set([
    ...rocks.map(keyOf),
    ...newKeys,
  ]);
  const pushedIds = new Set();
  const pushes = [];
  for (const edge of edges) {
    const objective = movableObjectiveAt(edge.to);
    if (!objective || pushedIds.has(`${objective.kind}:${objective.id}`)) continue;
    const result = objectivePushForStep(edge.from, edge.to, reservedKeys);
    if (result.blocked || !result.push) continue;
    pushes.push(result.push);
    pushedIds.add(`${objective.kind}:${objective.id}`);
    reservedKeys.add(keyOf(result.push.to));
  }
  return { moveCount, newKeys, pushes };
}

function activeWaterAdvanceVisual() {
  const animation = mouseMotion ?? milkKnockAnimation ?? pieBiteAnimation;
  return animation?.waterAdvance
    ? { advance: animation.waterAdvance, progress: animation.progress ?? 0 }
    : null;
}

function waterObjectiveDefeatMessage() {
  if (!waterIsActive()) return null;
  if (floodedWaterKeys.has(keyOf(mouse))) return "The flood caught the mouse.";
  if (remainingCheeseTargets().some((target) => floodedWaterKeys.has(keyOf(target)))) {
    return "The flood reached the cheese.";
  }
  if (
    remainingMilkBottles().some((bottle) => {
      const objectiveCell = bottle.knocked && bottle.spill ? bottle.spill : bottle;
      return floodedWaterKeys.has(keyOf(objectiveCell));
    })
  ) {
    return "The flood reached the milk objective.";
  }
  if (remainingPieQuarters().some((quarter) => floodedWaterKeys.has(keyOf(quarter)))) {
    return "The flood reached the pie.";
  }
  return null;
}

function commitWaterAdvance(advance, { applyPushes = true } = {}) {
  if (!advance) return null;
  waterMoveCount = advance.moveCount;
  if (applyPushes) {
    for (const push of advance.pushes ?? []) applyObjectivePush(push);
  }
  for (const key of advance.newKeys) floodedWaterKeys.add(key);
  syncWaterDebugDataset();
  return waterObjectiveDefeatMessage();
}

function waterWarningKeys() {
  if (!waterIsActive()) return [];
  if (!floodedWaterKeys.size) return [keyOf(waterOrigin)];
  return waterExpansionKeys();
}

function syncWaterDebugDataset() {
  mazeEl.dataset.testWater = JSON.stringify({
    active: waterIsActive(),
    origin: { ...waterOrigin },
    moveCount: waterMoveCount,
    flooded: [...floodedWaterKeys],
    warning: waterWarningKeys(),
  });
}

function restartWaterAfterTornado() {
  if (!waterIsActive()) return;
  const occupiedKeys = new Set([
    keyOf(mouse),
    ...remainingCheeseTargets().map(keyOf),
    ...milkBottles.filter((bottle) => !bottle.glassDestroyed).map(keyOf),
    ...pieFootprintCells(pie).map(keyOf),
    ...rockPositions.map(keyOf),
    ...activeTunnels().map(keyOf),
    ...(car ? [keyOf(car)] : []),
  ]);
  const candidates = [];
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      if (row !== 0 && row !== ROWS - 1 && col !== 0 && col !== COLS - 1) continue;
      const cell = maze[row]?.[col];
      if (
        !cell?.active ||
        occupiedKeys.has(`${row},${col}`) ||
        keyOf(cell) === keyOf(waterOrigin)
      ) {
        continue;
      }
      candidates.push({ row, col });
    }
  }
  if (candidates.length) {
    waterOrigin = { ...candidates[Math.floor(randomUnit() * candidates.length)] };
  }
  waterMoveCount = 0;
  floodedWaterKeys = new Set();
  syncWaterDebugDataset();
}

function waterShouldAnimate() {
  return waterIsActive() && !campaignComplete && !gameOver && !gameShellEl.hidden && !document.hidden;
}

function animateWaterSurface(timestamp) {
  waterAmbientFrame = null;
  if (!waterShouldAnimate()) return;
  waterVisualTime = timestamp;
  if (timestamp - waterLastAmbientDraw >= WATER_AMBIENT_FRAME_MS) {
    waterLastAmbientDraw = timestamp;
    requestMazeDraw();
  }
  waterAmbientFrame = requestAnimationFrame(animateWaterSurface);
}

function ensureWaterSurfaceAnimation() {
  if (!waterShouldAnimate() || waterAmbientFrame) return;
  waterVisualTime = performance.now();
  waterLastAmbientDraw = 0;
  waterAmbientFrame = requestAnimationFrame(animateWaterSurface);
}

function waterCellIsFlooded(cell) {
  return floodedWaterKeys.has(keyOf(cell));
}

function milkBottleAt(cell, bottles = milkBottles) {
  if (!cell) return null;
  return bottles.find(
    (bottle) =>
      !bottle.glassDestroyed &&
      bottle.row === cell.row &&
      bottle.col === cell.col,
  ) ?? null;
}

function milkPuddleAt(cell, bottles = milkBottles, collected = collectedMilkIds) {
  if (!cell) return null;
  return bottles.find(
    (bottle) =>
      bottle.knocked &&
      bottle.spill?.row === cell.row &&
      bottle.spill?.col === cell.col &&
      !collected.has(bottle.id),
  ) ?? null;
}

function remainingMilkBottles() {
  return milkBottles.filter((bottle) => !collectedMilkIds.has(bottle.id));
}

function remainingPieQuarters() {
  return pie?.quarters?.filter((quarter) => !eatenPieQuarterIds.has(quarter.id)) ?? [];
}

function isPieCleared() {
  return Boolean(pie) && remainingPieQuarters().length === 0;
}

function pieQuarterAt(cell) {
  if (!cell || !pie || isPieCleared()) return null;
  return pie.quarters.find(
    (quarter) => quarter.row === cell.row && quarter.col === cell.col,
  ) ?? null;
}

function remainingObjectiveCount() {
  return (
    remainingCheeseTargets().length +
    remainingMilkBottles().length +
    remainingPieQuarters().length
  );
}

function allObjectivesComplete() {
  return remainingObjectiveCount() === 0;
}

function bottleSpillForDirection(bottle, directionKey) {
  const dir = DIRS.find((candidate) => candidate.key === directionKey);
  if (!dir) return null;
  return { row: bottle.row + dir.row, col: bottle.col + dir.col };
}

function solveMilkPuzzle(
  grid,
  start,
  bottles,
  targets,
  maxDistance = 72,
  initialCollectedCheeses = new Set(),
  initialCollectedMilk = new Set(),
) {
  const targetIndexByKey = new Map(targets.map((target, index) => [keyOf(target), index]));
  const allCheeseMask = (1 << targets.length) - 1;
  const allMilkMask = (1 << bottles.length) - 1;
  const initialCheeseMask = targets.reduce(
    (mask, target, index) => mask | (initialCollectedCheeses.has(keyOf(target)) ? 1 << index : 0),
    0,
  );
  const initialMilkMask = bottles.reduce(
    (mask, bottle, index) => mask | (initialCollectedMilk.has(bottle.id) ? 1 << index : 0),
    0,
  );
  const initialBottleStates = bottles.map((bottle) =>
    bottle.knocked ? DIRS.findIndex((dir) => dir.key === bottle.direction) + 1 : 0,
  );
  const queue = [{
    mouse: { ...start },
    bottleStates: initialBottleStates,
    cheeseMask: initialCheeseMask,
    milkMask: initialMilkMask,
    path: [{ ...start }],
    actions: [],
  }];
  const stateKey = (state) =>
    `${keyOf(state.mouse)}|${state.bottleStates.join("")}|${state.cheeseMask}|${state.milkMask}`;
  const seen = new Set([stateKey(queue[0])]);

  for (let queueIndex = 0; queueIndex < queue.length; queueIndex += 1) {
    const state = queue[queueIndex];
    if (state.cheeseMask === allCheeseMask && state.milkMask === allMilkMask) return state;
    if (state.actions.length >= maxDistance) continue;

    for (let directionIndex = 0; directionIndex < DIRS.length; directionIndex += 1) {
      const dir = DIRS[directionIndex];
      const currentCell = grid[state.mouse.row][state.mouse.col];
      if (currentCell.walls[dir.wall]) continue;
      const next = { row: state.mouse.row + dir.row, col: state.mouse.col + dir.col };
      if (!isInside(next.row, next.col)) continue;
      const bottleIndex = bottles.findIndex((bottle) => keyOf(bottle) === keyOf(next));

      if (bottleIndex >= 0) {
        if (state.bottleStates[bottleIndex] !== 0) continue;
        const bottle = bottles[bottleIndex];
        const bottleCell = grid[bottle.row][bottle.col];
        const spill = bottleSpillForDirection(bottle, dir.key);
        if (
          !spill ||
          !isInside(spill.row, spill.col) ||
          bottleCell.walls[dir.wall] ||
          bottles.some((candidate, index) => index !== bottleIndex && keyOf(candidate) === keyOf(spill)) ||
          targetIndexByKey.has(keyOf(spill))
        ) {
          continue;
        }
        const bottleStates = [...state.bottleStates];
        bottleStates[bottleIndex] = directionIndex + 1;
        const nextState = {
          ...state,
          bottleStates,
          path: [...state.path, { ...state.mouse }],
          actions: [...state.actions, { type: "knock", direction: dir.key, bottleId: bottle.id }],
        };
        const stateId = stateKey(nextState);
        if (!seen.has(stateId)) {
          seen.add(stateId);
          queue.push(nextState);
        }
        continue;
      }

      let blockedByFallenBottle = false;
      for (let index = 0; index < bottles.length; index += 1) {
        if (state.bottleStates[index] && keyOf(bottles[index]) === keyOf(next)) {
          blockedByFallenBottle = true;
          break;
        }
      }
      if (blockedByFallenBottle) continue;

      let cheeseMask = state.cheeseMask;
      const targetIndex = targetIndexByKey.get(keyOf(next));
      if (targetIndex !== undefined) cheeseMask |= 1 << targetIndex;
      let milkMask = state.milkMask;
      for (let index = 0; index < bottles.length; index += 1) {
        const encodedDirection = state.bottleStates[index];
        if (!encodedDirection) continue;
        const spill = bottleSpillForDirection(bottles[index], DIRS[encodedDirection - 1].key);
        if (keyOf(spill) === keyOf(next)) milkMask |= 1 << index;
      }
      const nextState = {
        mouse: next,
        bottleStates: [...state.bottleStates],
        cheeseMask,
        milkMask,
        path: [...state.path, { ...next }],
        actions: [...state.actions, { type: "move", direction: dir.key }],
      };
      const stateId = stateKey(nextState);
      if (seen.has(stateId)) continue;
      seen.add(stateId);
      queue.push(nextState);
    }
  }
  return null;
}

function nextCarStep(grid, from, target) {
  const path = findShortestPathFrom(grid, from, target);
  return path.length > 1 ? { ...path[1] } : { ...from };
}

function nextCarStepAvoiding(grid, from, target, blockedKeys = new Set()) {
  if (hasOpenPassageBetween(grid, from, target)) return { ...from };
  const queue = [{ ...from }];
  const previous = new Map([[keyOf(from), null]]);
  const targetKey = keyOf(target);
  while (queue.length) {
    const current = queue.shift();
    if (keyOf(current) === targetKey) break;
    const mazeCell = grid[current.row]?.[current.col];
    if (!mazeCell) continue;
    for (const next of neighbors(grid, mazeCell)) {
      const nextKey = keyOf(next);
      if (
        previous.has(nextKey) ||
        (nextKey !== targetKey && blockedKeys.has(nextKey))
      ) {
        continue;
      }
      previous.set(nextKey, keyOf(current));
      queue.push({ row: next.row, col: next.col });
    }
  }
  if (!previous.has(targetKey)) return { ...from };
  let cursor = targetKey;
  let parent = previous.get(cursor);
  while (parent && parent !== keyOf(from)) {
    cursor = parent;
    parent = previous.get(cursor);
  }
  return cellFromKey(cursor);
}

function areCardinallyAdjacent(first, second) {
  return Math.abs(first.row - second.row) + Math.abs(first.col - second.col) === 1;
}

function hasOpenPassageBetween(grid, first, second) {
  if (!areCardinallyAdjacent(first, second)) return false;
  const direction = DIRS.find(
    (item) =>
      first.row + item.row === second.row &&
      first.col + item.col === second.col,
  );
  if (!direction) return false;
  const firstCell = grid[first.row]?.[first.col];
  const secondCell = grid[second.row]?.[second.col];
  if (!firstCell || !secondCell) return false;
  return (
    !firstCell.walls[direction.wall] &&
    !secondCell.walls[direction.opposite]
  );
}

function nextCarStepForTurn(grid, carPosition, mousePosition) {
  if (grid === maze) {
    const blockedKeys = new Set([
      ...rockPositions.map(keyOf),
      ...(pie && !isPieCleared() ? pieFootprintCells(pie).map(keyOf) : []),
      ...floodedWaterKeys,
    ]);
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const next = nextCarStepAvoiding(grid, carPosition, mousePosition, blockedKeys);
      if (keyOf(next) === keyOf(carPosition)) return next;
      const objectivePush = objectivePushForStep(carPosition, next);
      if (!objectivePush.blocked) return next;
      blockedKeys.add(keyOf(next));
    }
    return { ...carPosition };
  }
  return nextCarStep(grid, carPosition, mousePosition);
}

function carObjectivePushForStep(carFrom, carTo) {
  if (!carFrom || !carTo || keyOf(carFrom) === keyOf(carTo)) return null;
  return objectivePushForStep(carFrom, carTo).push;
}

function carHasLegalMove(grid, carPosition, blockedKeys = new Set()) {
  const cell = grid[carPosition.row]?.[carPosition.col];
  if (!cell) return false;
  return neighbors(grid, cell).some((next) => !blockedKeys.has(keyOf(next)));
}

function carBlockedKeysForPuzzle(result) {
  const blockedKeys = new Set([
    ...(result.rocks ?? []).map(keyOf),
    ...(result.milkBottles ?? []).map(keyOf),
  ]);
  if (result.pie) {
    for (const cell of pieFootprintCells(result.pie)) blockedKeys.add(keyOf(cell));
  }
  return blockedKeys;
}

function carCatchesMouse(grid, mouseFrom, mouseTo, carFrom, carTo) {
  const sameDestination = keyOf(mouseTo) === keyOf(carTo);
  const crossedPaths = keyOf(mouseFrom) === keyOf(carTo) && keyOf(mouseTo) === keyOf(carFrom);
  return (
    sameDestination ||
    crossedPaths ||
    hasOpenPassageBetween(grid, mouseTo, carTo)
  );
}

function solveCarPuzzle(grid, start, carStart, targets, maxDistance = 72) {
  const targetIndexByKey = new Map(targets.map((target, index) => [keyOf(target), index]));
  const allCollectedMask = (1 << targets.length) - 1;
  const queue = [{
    mouse: { ...start },
    car: { ...carStart },
    collectedMask: 0,
    path: [{ ...start }],
    carPath: [{ ...carStart }],
    actions: [],
  }];
  const stateKey = (state) => `${keyOf(state.mouse)}|${keyOf(state.car)}|${state.collectedMask}`;
  const seen = new Set([stateKey(queue[0])]);

  for (let queueIndex = 0; queueIndex < queue.length; queueIndex += 1) {
    const state = queue[queueIndex];
    if (state.collectedMask === allCollectedMask) return state;
    if (state.actions.length >= maxDistance) continue;
    for (const next of neighbors(grid, grid[state.mouse.row][state.mouse.col])) {
      if (keyOf(next) === keyOf(state.car)) continue;
      let collectedMask = state.collectedMask;
      const targetIndex = targetIndexByKey.get(keyOf(next));
      if (targetIndex !== undefined) collectedMask |= 1 << targetIndex;
      const nextCar = nextCarStepForTurn(grid, state.car, state.mouse);
      if (carCatchesMouse(grid, state.mouse, next, state.car, nextCar)) continue;
      const nextState = {
        mouse: { row: next.row, col: next.col },
        car: nextCar,
        collectedMask,
        path: [...state.path, { row: next.row, col: next.col }],
        carPath: [...state.carPath, nextCar],
        actions: [...state.actions, { direction: next.dir }],
      };
      const stateId = stateKey(nextState);
      if (seen.has(stateId)) continue;
      seen.add(stateId);
      queue.push(nextState);
    }
  }
  return null;
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
  if (pie && !isPieCleared()) {
    const solution = solvePiePuzzle(grid, start, pie, 80, eatenPieQuarterIds);
    return solution ? { path: solution.path, order: [], solution } : null;
  }
  if (milkBottles.length) {
    const normalizedMilk = milkBottles.map((bottle) => ({
      ...bottle,
      knocked: Boolean(bottle.knocked),
      direction: bottle.direction,
    }));
    const solution = solveMilkPuzzle(
      grid,
      start,
      normalizedMilk,
      targets,
      80,
      new Set(),
      collectedMilkIds,
    );
    return solution ? { path: solution.path, order: targets, solution } : null;
  }
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
      if (!cell.active) continue;
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

function findMeaningfulAlternative(grid, target, path, moveLimit, minDifferentEdges = 6) {
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

    if (differentEdges >= minDifferentEdges) return alternate;
  }

  return null;
}

function findOverBudgetTrickPath(grid, target, path, moveLimit, minDifferentEdges = 4) {
  const pathKeys = new Set(path.map(keyOf));
  const goalDistance = (cell) => Math.abs(cell.row - target.row) + Math.abs(cell.col - target.col);
  let best = null;

  const latestUsefulBranch = Math.max(
    1,
    Math.floor((path.length - 1) * (ROWS <= 7 ? 1 : 0.78)),
  );
  for (let pathIndex = 0; pathIndex < latestUsefulBranch; pathIndex += 1) {
    const branchOrigin = path[pathIndex];
    const branchEntries = neighbors(grid, grid[branchOrigin.row][branchOrigin.col]).filter(
      (next) => !pathKeys.has(keyOf(next)) && goalDistance(next) <= goalDistance(branchOrigin),
    );
    for (const entry of branchEntries) {
      const queue = [{ cell: { ...entry }, route: [{ ...entry }] }];
      const seen = new Set([keyOf(entry)]);
      let deepest = queue[0];
      while (queue.length) {
        const current = queue.shift();
        if (current.route.length > deepest.route.length) deepest = current;
        for (const next of neighbors(grid, grid[current.cell.row][current.cell.col])) {
          const nextKey = keyOf(next);
          if (pathKeys.has(nextKey) || seen.has(nextKey)) continue;
          seen.add(nextKey);
          queue.push({
            cell: { row: next.row, col: next.col },
            route: [...current.route, { row: next.row, col: next.col }],
          });
        }
      }

      const outward = deepest.route;
      if (outward.length < minDifferentEdges) continue;
      const returnTrip = [...outward].reverse().slice(1);
      const trickPath = [
        ...path.slice(0, pathIndex + 1),
        ...outward,
        ...returnTrip,
        { ...branchOrigin },
        ...path.slice(pathIndex + 1),
      ];
      const distance = trickPath.length - 1;
      if (distance <= moveLimit) continue;
      const result = {
        path: trickPath,
        distance,
        excess: distance - moveLimit,
        differentEdges: outward.length,
        divergenceIndex: pathIndex + 1,
        deadEnd: { ...deepest.cell },
      };
      if (!best || result.excess < best.excess) best = result;
    }
  }
  return best;
}

function moveBudgetForVariant(path, alternatePath) {
  const shortestDistance = Math.max(0, path.length - 1);
  const alternateDistance = Math.max(shortestDistance, alternatePath.length - 1);
  const recoveryMargin = clamp(Math.ceil(shortestDistance * 0.3), 4, 7);
  return Math.max(shortestDistance + recoveryMargin, alternateDistance);
}

function configuredMoveBudget(config, distance) {
  if (Number.isFinite(config.moveBudget)) return Math.floor(config.moveBudget);
  if (Number.isFinite(config.moveMarginRatio)) {
    return distance + Math.max(2, Math.ceil(distance * config.moveMarginRatio));
  }
  return null;
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
  const pathRows = path.map((cell) => cell.row);
  const pathCols = path.map((cell) => cell.col);
  let maxStraightRun = 0;
  let currentStraightRun = 0;
  let previousDirection = null;

  for (let index = 1; index < path.length; index += 1) {
    const direction = `${path[index].row - path[index - 1].row},${path[index].col - path[index - 1].col}`;
    currentStraightRun = direction === previousDirection ? currentStraightRun + 1 : 1;
    maxStraightRun = Math.max(maxStraightRun, currentStraightRun);
    previousDirection = direction;
  }

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
    maxStraightRun,
    pathRowSpan: Math.max(...pathRows) - Math.min(...pathRows) + 1,
    pathColSpan: Math.max(...pathCols) - Math.min(...pathCols) + 1,
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
  if (!profile) return true;
  const rules = [
    ["solutionJunctions", "minSolutionJunctions", "maxSolutionJunctions"],
    ["falseBranches", "minFalseBranches", "maxFalseBranches"],
    ["deepFalseBranches", "minDeepFalseBranches", "maxDeepFalseBranches"],
    ["falseBranchCells", "minFalseBranchCells", "maxFalseBranchCells"],
    ["maxFalseBranchDepth", "minFalseBranchDepth", "maxFalseBranchDepth"],
    ["earlyDeepBranches", "minEarlyDeepBranches", "maxEarlyDeepBranches"],
    ["goalFacingBranches", "minGoalFacingBranches", "maxGoalFacingBranches"],
    ["misleadingBranches", "minMisleadingBranches", "maxMisleadingBranches"],
    ["misleadingBranchCells", "minMisleadingBranchCells", "maxMisleadingBranchCells"],
    ["nearGoalTraps", "minNearGoalTraps", "maxNearGoalTraps"],
    ["greedyPenalty", "minGreedyPenalty", "maxGreedyPenalty"],
    ["maxStraightRun", "minStraightRun", "maxStraightRun"],
    ["pathRowSpan", "minPathRowSpan", "maxPathRowSpan"],
    ["pathColSpan", "minPathColSpan", "maxPathColSpan"],
  ];
  if (rules.some(([metric, minimum]) => config[minimum] !== undefined && profile[metric] < config[minimum])) {
    return false;
  }
  if (rules.some(([metric, , maximum]) => config[maximum] !== undefined && profile[metric] > config[maximum])) {
    return false;
  }
  return config.maxGoalManhattan === undefined || profile.startGoalManhattan <= config.maxGoalManhattan;
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
        isInside(candidate.row, candidate.col) &&
        (candidate.row !== start.row || candidate.col !== start.col) &&
        (candidate.row * 3 + candidate.col * 2) % VARIANTS_PER_LEVEL === variantIndex,
    ),
    rng,
  );

  for (const candidate of exits) {
    const path = findShortestPath(grid, candidate, new Set(), start);
    if (!path.length) continue;

    const distance = path.length - 1;
    const configuredBudget = configuredMoveBudget(config, distance);
    const turns = countTurns(path);
    const deadEnds = countDeadEnds(grid);
    const routes = countRoutesToExit(grid, candidate, 3, start);
    const alternatePath = singleRoute
      ? null
      : findMeaningfulAlternative(
          grid,
          candidate,
          path,
          configuredBudget ?? config.moveLimit,
          config.minAlternateEdges ?? 6,
        );
    const finalMoveLimit = singleRoute
      ? distance + (config.moveMargin ?? 1)
      : configuredBudget ?? moveBudgetForVariant(path, alternatePath ?? path);
    const trickPath = findOverBudgetTrickPath(
      grid,
      candidate,
      path,
      finalMoveLimit,
      config.minTrickDifferentEdges ?? (ROWS <= 5 ? 1 : ROWS <= 7 ? 2 : 3),
    );
    const difficultyProfile = config.minSolutionJunctions || config.maxSolutionJunctions
      ? analyzeDeceptiveBranches(grid, path, candidate)
      : null;
    const routeRulesPass = singleRoute
      ? routes === 1
      : routes >= 2 && routes <= (config.maxRoutes ?? Number.POSITIVE_INFINITY) && Boolean(alternatePath);

    if (
      distance >= config.minPath &&
      distance <= config.maxPath &&
      turns >= (config.minTurns ?? 4) &&
      turns <= (config.maxTurns ?? Number.POSITIVE_INFINITY) &&
      deadEnds >= (config.minDeadEnds ?? 5) &&
      deadEnds <= (config.maxDeadEnds ?? 38) &&
      routeRulesPass &&
      Boolean(trickPath) &&
      passesExtremeDifficulty(config, difficultyProfile)
    ) {
      const result = {
        exit: candidate,
        path,
        alternatePath,
        trickPath: trickPath.path,
        trickPathProfile: trickPath,
        difficultyProfile,
        moveLimit: finalMoveLimit,
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

function cheeseRouteOptions(grid, start, targets) {
  const pathCache = new Map();
  const pathBetween = (from, to) => {
    const cacheKey = `${keyOf(from)}>${keyOf(to)}`;
    if (!pathCache.has(cacheKey)) {
      pathCache.set(cacheKey, findShortestPathFrom(grid, from, to));
    }
    return pathCache.get(cacheKey);
  };
  const routes = [];

  function visit(order, remaining, path, current) {
    if (!remaining.length) {
      routes.push({ order: order.map((target) => ({ ...target })), path });
      return;
    }
    for (let index = 0; index < remaining.length; index += 1) {
      const target = remaining[index];
      const segment = pathBetween(current, target);
      if (!segment.length) continue;
      visit(
        [...order, target],
        remaining.filter((_, targetIndex) => targetIndex !== index),
        joinPaths(path, segment),
        target,
      );
    }
  }

  visit([], targets, [{ ...start }], start);
  return routes.sort((first, second) => first.path.length - second.path.length);
}

function chooseCheeseTargetsAndValidate(grid, config, variantIndex, start, rng) {
  const cheeseCount = clamp(Math.floor(config.cheeseCount ?? 1), 2, MAX_CHEESES_PER_LEVEL);
  const candidates = shuffle(
    Array.from({ length: ROWS * COLS }, (_, index) => ({
      row: Math.floor(index / COLS),
      col: index % COLS,
    })).filter(
      (candidate) =>
        isInside(candidate.row, candidate.col) &&
        keyOf(candidate) !== keyOf(start) &&
        (candidate.row * 3 + candidate.col * 2) % VARIANTS_PER_LEVEL !== variantIndex,
    ),
    rng,
  );
  const candidateLimit = cheeseCount === 3 ? 18 : Math.min(30, candidates.length);
  const usableCandidates = candidates.slice(0, candidateLimit);
  const targetSets = [];
  function collectTargetSets(startIndex, selected) {
    if (selected.length === cheeseCount) {
      targetSets.push(selected.map((target) => ({ ...target })));
      return;
    }
    for (
      let index = startIndex;
      index <= usableCandidates.length - (cheeseCount - selected.length);
      index += 1
    ) {
      collectTargetSets(index + 1, [...selected, usableCandidates[index]]);
    }
  }
  collectTargetSets(0, []);

  for (const targets of shuffle(targetSets, rng)) {
    let targetsSeparated = true;
    for (let firstIndex = 0; firstIndex < targets.length; firstIndex += 1) {
      for (let secondIndex = firstIndex + 1; secondIndex < targets.length; secondIndex += 1) {
        const first = targets[firstIndex];
        const second = targets[secondIndex];
        const separation = Math.abs(first.row - second.row) + Math.abs(first.col - second.col);
        const betweenPath = findShortestPathFrom(grid, first, second);
        if (
          separation < (config.minCheeseSeparation ?? 4) ||
          !betweenPath.length ||
          betweenPath.length - 1 < (config.minCheeseDistance ?? 5)
        ) {
          targetsSeparated = false;
          break;
        }
      }
      if (!targetsSeparated) break;
    }
    if (!targetsSeparated) continue;

    const routes = cheeseRouteOptions(grid, start, targets);
    if (routes.length < 2) continue;
    const optimal = routes[0];
    const alternate = routes.find(
      (route) => route.order.map(keyOf).join("|") !== optimal.order.map(keyOf).join("|"),
    );
    if (!alternate) continue;
    const optimalDistance = optimal.path.length - 1;
    const orderPenalty = alternate.path.length - optimal.path.length;
    if (
      optimalDistance < config.minPath ||
      optimalDistance > config.maxPath ||
      alternate.path.length - 1 > optimalDistance + config.moveMargin ||
      orderPenalty < (config.minOrderPenalty ?? 1) ||
      orderPenalty > (config.maxOrderPenalty ?? Number.POSITIVE_INFINITY) ||
      countTurns(optimal.path) < config.minTurns ||
      countDeadEnds(grid) < config.minDeadEnds
    ) {
      continue;
    }

    const moveLimit = optimalDistance + config.moveMargin;
    const finalTarget = optimal.order[optimal.order.length - 1];
    const trickPath = findOverBudgetTrickPath(
      grid,
      finalTarget,
      optimal.path,
      moveLimit,
      config.minTrickDifferentEdges ?? 3,
    );
    if (!trickPath) continue;

    return {
      exit: { ...optimal.order[0] },
      exits: optimal.order.map((target) => ({ ...target })),
      path: optimal.path,
      alternatePath: alternate.path,
      trickPath: trickPath.path,
      trickPathProfile: trickPath,
      difficultyProfile: null,
      orderPenalty,
      moveLimit,
    };
  }

  return null;
}

function objectivePlacementCandidates(start, variantIndex, rng) {
  return shuffle(
    Array.from({ length: ROWS * COLS }, (_, index) => ({
      row: Math.floor(index / COLS),
      col: index % COLS,
    })).filter(
      (candidate) =>
        isInside(candidate.row, candidate.col) &&
        keyOf(candidate) !== keyOf(start) &&
        (candidate.row * 3 + candidate.col * 2) % VARIANTS_PER_LEVEL !== variantIndex,
    ),
    rng,
  );
}

function pieQuarterBlueprint(row, col) {
  return [
    {
      id: "top-left",
      row,
      col,
      approach: { row: row - 1, col },
      direction: "down",
    },
    {
      id: "top-right",
      row,
      col: col + 1,
      approach: { row, col: col + 2 },
      direction: "left",
    },
    {
      id: "bottom-right",
      row: row + 1,
      col: col + 1,
      approach: { row: row + 2, col: col + 1 },
      direction: "up",
    },
    {
      id: "bottom-left",
      row: row + 1,
      col,
      approach: { row: row + 1, col: col - 1 },
      direction: "right",
    },
  ];
}

function pieFootprintCells(pieData = pie) {
  return pieData?.quarters?.map(({ row, col }) => ({ row, col })) ?? [];
}

function pieFootprintKeys(pieData = pie) {
  return new Set(pieFootprintCells(pieData).map(keyOf));
}

function configurePieGrid(grid, pieData) {
  const footprint = pieFootprintKeys(pieData);
  for (const quarter of pieData.quarters) {
    for (const dir of DIRS) {
      const neighbor = { row: quarter.row + dir.row, col: quarter.col + dir.col };
      if (!isInside(neighbor.row, neighbor.col)) continue;
      setSegmentWall(grid, edgeSegmentBetween(quarter, neighbor), !footprint.has(keyOf(neighbor)));
    }
  }
  for (const quarter of pieData.quarters) {
    setSegmentWall(grid, edgeSegmentBetween(quarter, quarter.approach), false);
  }
  return grid;
}

function solvePiePuzzle(
  grid,
  start,
  pieData,
  maxDistance = 80,
  initialEatenQuarterIds = new Set(),
) {
  if (!pieData?.quarters?.length) return null;
  const footprint = pieFootprintKeys(pieData);
  const allEatenMask = (1 << pieData.quarters.length) - 1;
  const initialMask = pieData.quarters.reduce(
    (mask, quarter, index) =>
      mask | (initialEatenQuarterIds.has(quarter.id) ? 1 << index : 0),
    0,
  );
  const queue = [{
    mouse: { ...start },
    eatenMask: initialMask,
    path: [{ ...start }],
    actions: [],
  }];
  const seen = new Set([`${keyOf(start)}|${initialMask}`]);

  while (queue.length) {
    const state = queue.shift();
    if (state.eatenMask === allEatenMask) return state;
    if (state.actions.length >= maxDistance) continue;

    for (const next of neighbors(grid, grid[state.mouse.row][state.mouse.col])) {
      if (footprint.has(keyOf(next))) continue;
      const nextState = {
        mouse: { row: next.row, col: next.col },
        eatenMask: state.eatenMask,
        path: [...state.path, { row: next.row, col: next.col }],
        actions: [...state.actions, { type: "move", direction: next.dir }],
      };
      const stateKey = `${keyOf(nextState.mouse)}|${nextState.eatenMask}`;
      if (seen.has(stateKey)) continue;
      seen.add(stateKey);
      queue.push(nextState);
    }

    pieData.quarters.forEach((quarter, index) => {
      if (
        state.eatenMask & (1 << index) ||
        keyOf(state.mouse) !== keyOf(quarter.approach)
      ) {
        return;
      }
      const dir = DIRS.find((candidate) => candidate.key === quarter.direction);
      if (!dir || grid[state.mouse.row][state.mouse.col].walls[dir.wall]) return;
      const nextMask = state.eatenMask | (1 << index);
      const nextState = {
        mouse: { ...state.mouse },
        eatenMask: nextMask,
        path: [...state.path, { ...state.mouse }],
        actions: [
          ...state.actions,
          { type: "bite", quarterId: quarter.id, direction: quarter.direction },
        ],
      };
      const stateKey = `${keyOf(nextState.mouse)}|${nextMask}`;
      if (seen.has(stateKey)) return;
      seen.add(stateKey);
      queue.push(nextState);
    });
  }

  return null;
}

function choosePiePuzzleAndValidate(grid, config, variantIndex, start, rng) {
  if (config.pieCount !== 1 || 4 > MAX_OBJECTIVES_PER_LEVEL) return null;
  const anchors = shuffle(
    Array.from({ length: ROWS * COLS }, (_, index) => ({
      row: Math.floor(index / COLS),
      col: index % COLS,
    })).filter(({ row, col }) => {
      if (row < 2 || row > ROWS - 4 || col < 2 || col > COLS - 4) return false;
      const quarters = pieQuarterBlueprint(row, col);
      return (
        quarters.every((quarter) =>
          isInside(quarter.row, quarter.col) &&
          isInside(quarter.approach.row, quarter.approach.col),
        ) &&
        quarters.every((quarter) => keyOf(quarter.approach) !== keyOf(start)) &&
        Math.abs(start.row - row) + Math.abs(start.col - col) >= 5 &&
        (row * 3 + col * 2) % VARIANTS_PER_LEVEL !== variantIndex
      );
    }),
    rng,
  );

  for (const anchor of anchors) {
    const pieData = {
      id: "pie-0",
      row: anchor.row,
      col: anchor.col,
      quarters: pieQuarterBlueprint(anchor.row, anchor.col),
    };
    const candidateGrid = configurePieGrid(cloneMazeGrid(grid), pieData);
    const solution = solvePiePuzzle(candidateGrid, start, pieData, config.maxPath + 12);
    if (!solution) continue;
    const distance = solution.actions.length;
    const movementPath = solution.path.filter(
      (cell, index, path) => index === 0 || keyOf(cell) !== keyOf(path[index - 1]),
    );
    if (
      distance < config.minPath ||
      distance > config.maxPath ||
      countTurns(movementPath) < config.minTurns ||
      countDeadEnds(candidateGrid) < config.minDeadEnds ||
      solution.actions.filter((action) => action.type === "bite").length !== 4
    ) {
      continue;
    }
    return {
      grid: candidateGrid,
      exit: null,
      exits: [],
      pie: pieData,
      pieSolution: solution,
      path: solution.path,
      actions: solution.actions,
      alternatePath: solution.path,
      trickPath: null,
      difficultyProfile: null,
      moveLimit: distance + config.moveMargin,
    };
  }
  return null;
}

function chooseMilkPuzzleAndValidate(grid, config, variantIndex, start, rng) {
  const milkCount = clamp(
    Math.floor(config.milkCount ?? 1),
    1,
    MAX_MILK_BOTTLES_PER_LEVEL,
  );
  const cheeseCount = clamp(Math.floor(config.cheeseCount ?? 0), 0, MAX_CHEESES_PER_LEVEL);
  if (milkCount + cheeseCount > MAX_OBJECTIVES_PER_LEVEL) return null;
  const candidates = objectivePlacementCandidates(start, variantIndex, rng);

  for (let placementAttempt = 0; placementAttempt < 180; placementAttempt += 1) {
    const shuffled = shuffle(candidates, rng);
    const bottles = shuffled.slice(0, milkCount).map((cell, index) => ({
      id: `milk-${index}`,
      row: cell.row,
      col: cell.col,
    }));
    const occupied = new Set(bottles.map(keyOf));
    const cheeses = shuffled
      .slice(milkCount)
      .filter((cell) => !occupied.has(keyOf(cell)))
      .slice(0, cheeseCount)
      .map((cell) => ({ ...cell }));
    if (cheeses.length !== cheeseCount) continue;
    const solution = solveMilkPuzzle(grid, start, bottles, cheeses, config.maxPath + 12);
    if (!solution) continue;
    const distance = solution.actions.length;
    if (distance < config.minPath || distance > config.maxPath) continue;
    const knockCount = solution.actions.filter((action) => action.type === "knock").length;
    if (knockCount !== milkCount || countDeadEnds(grid) < config.minDeadEnds) continue;
    const solvedBottles = bottles.map((bottle, index) => {
      const encodedDirection = solution.bottleStates[index];
      const direction = DIRS[encodedDirection - 1]?.key;
      return { ...bottle, solutionDirection: direction };
    });
    const spilledMilkTargets = solvedBottles.map((bottle) => {
      const direction = DIRS.find((candidate) => candidate.key === bottle.solutionDirection);
      return {
        row: bottle.row + direction.row,
        col: bottle.col + direction.col,
      };
    });
    const objectiveSpread = carObjectiveSpread(
      grid,
      start,
      [...cheeses, ...spilledMilkTargets],
    );
    if (
      !objectiveSpread ||
      objectiveSpread.minStartDistance < (config.minObjectiveStartDistance ?? 0) ||
      objectiveSpread.minPairSeparation < (config.minObjectiveSeparation ?? 0) ||
      objectiveSpread.minPairDistance < (config.minObjectivePathDistance ?? 0) ||
      objectiveSpread.rowSpan < (config.minObjectiveRowSpan ?? 0) ||
      objectiveSpread.colSpan < (config.minObjectiveColSpan ?? 0) ||
      objectiveSpread.detourBeyondFarthest < (config.minObjectiveDetour ?? 0) ||
      objectiveSpread.passThroughObjectives >
        (config.maxPassThroughObjectives ?? Number.POSITIVE_INFINITY)
    ) {
      continue;
    }
    const moveLimit = distance + (config.moveMargin ?? Math.max(6, Math.ceil(distance * 0.3)));
    return {
      exit: cheeses[0] ? { ...cheeses[0] } : null,
      exits: cheeses.map((target) => ({ ...target })),
      milkBottles: solvedBottles,
      path: solution.path,
      actions: solution.actions,
      objectiveSolution: solution,
      alternatePath: solution.path,
      trickPath: null,
      difficultyProfile: null,
      objectiveSpread,
      moveLimit,
    };
  }
  return null;
}

function carObjectiveSpread(grid, start, targets) {
  if (!targets.length) return null;
  const directDistances = new Map();
  const pairDistances = new Map();
  let minPairDistance = Number.POSITIVE_INFINITY;
  let minPairSeparation = Number.POSITIVE_INFINITY;
  let passThroughObjectives = 0;

  for (const target of targets) {
    const path = findShortestPathFrom(grid, start, target);
    if (!path.length) return null;
    directDistances.set(keyOf(target), path.length - 1);
  }

  for (let firstIndex = 0; firstIndex < targets.length; firstIndex += 1) {
    const first = targets[firstIndex];
    for (let secondIndex = firstIndex + 1; secondIndex < targets.length; secondIndex += 1) {
      const second = targets[secondIndex];
      const path = findShortestPathFrom(grid, first, second);
      if (!path.length) return null;
      const distance = path.length - 1;
      pairDistances.set(`${keyOf(first)}>${keyOf(second)}`, distance);
      pairDistances.set(`${keyOf(second)}>${keyOf(first)}`, distance);
      minPairDistance = Math.min(minPairDistance, distance);
      minPairSeparation = Math.min(
        minPairSeparation,
        Math.abs(first.row - second.row) + Math.abs(first.col - second.col),
      );
    }
  }

  for (const target of targets) {
    const targetDistance = directDistances.get(keyOf(target));
    const liesOnWayToAnotherTarget = targets.some((other) => {
      if (keyOf(other) === keyOf(target)) return false;
      const betweenDistance = pairDistances.get(`${keyOf(target)}>${keyOf(other)}`);
      return targetDistance + betweenDistance === directDistances.get(keyOf(other));
    });
    if (liesOnWayToAnotherTarget) passThroughObjectives += 1;
  }

  let optimalDistance = Number.POSITIVE_INFINITY;
  function measureOrders(current, remaining, distance) {
    if (!remaining.length) {
      optimalDistance = Math.min(optimalDistance, distance);
      return;
    }
    for (let index = 0; index < remaining.length; index += 1) {
      const target = remaining[index];
      const segmentDistance = current
        ? pairDistances.get(`${keyOf(current)}>${keyOf(target)}`)
        : directDistances.get(keyOf(target));
      measureOrders(
        target,
        remaining.filter((_, targetIndex) => targetIndex !== index),
        distance + segmentDistance,
      );
    }
  }
  measureOrders(null, targets, 0);
  const furthestDirectDistance = Math.max(...directDistances.values());
  const rows = targets.map((target) => target.row);
  const cols = targets.map((target) => target.col);

  return {
    minStartDistance: Math.min(...directDistances.values()),
    minPairDistance,
    minPairSeparation,
    rowSpan: Math.max(...rows) - Math.min(...rows),
    colSpan: Math.max(...cols) - Math.min(...cols),
    detourBeyondFarthest: optimalDistance - furthestDirectDistance,
    passThroughObjectives,
  };
}

function chooseCarPuzzleAndValidate(grid, config, variantIndex, start, rng) {
  const cheeseCount = clamp(Math.floor(config.cheeseCount ?? 1), 1, MAX_CHEESES_PER_LEVEL);
  const candidates = objectivePlacementCandidates(start, variantIndex, rng);
  for (let placementAttempt = 0; placementAttempt < 220; placementAttempt += 1) {
    const shuffled = shuffle(candidates, rng);
    const carStart = shuffled.find((cell) => {
      if (
        cell.row === 0 ||
        cell.row === ROWS - 1 ||
        cell.col === 0 ||
        cell.col === COLS - 1
      ) {
        return false;
      }
      const path = findShortestPathFrom(grid, cell, start);
      return path.length - 1 >= 7;
    });
    if (!carStart) continue;
    const cheeses = shuffled
      .filter((cell) => keyOf(cell) !== keyOf(carStart))
      .slice(0, cheeseCount)
      .map((cell) => ({ ...cell }));
    if (cheeses.length !== cheeseCount) continue;
    const spread = carObjectiveSpread(grid, start, cheeses);
    if (
      !spread ||
      spread.minPairSeparation < (config.minCheeseSeparation ?? 0) ||
      spread.minPairDistance < (config.minCheeseDistance ?? 0) ||
      spread.rowSpan < (config.minObjectiveRowSpan ?? 0) ||
      spread.colSpan < (config.minObjectiveColSpan ?? 0) ||
      spread.detourBeyondFarthest < (config.minObjectiveDetour ?? 0) ||
      spread.passThroughObjectives >
        (config.maxPassThroughObjectives ?? Number.POSITIVE_INFINITY)
    ) {
      continue;
    }
    const solution = solveCarPuzzle(grid, start, carStart, cheeses, config.maxPath + 14);
    if (!solution) continue;
    const distance = solution.actions.length;
    if (distance < config.minPath || distance > config.maxPath) continue;
    if (countTurns(solution.path) < config.minTurns || countDeadEnds(grid) < config.minDeadEnds) {
      continue;
    }
    return {
      exit: { ...cheeses[0] },
      exits: cheeses,
      car: { id: "catcher", row: carStart.row, col: carStart.col },
      carSolution: solution,
      path: solution.path,
      alternatePath: solution.path,
      trickPath: null,
      difficultyProfile: null,
      objectiveSpread: spread,
      moveLimit: distance + (config.moveMargin ?? 7),
    };
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
  const rockCount = clamp(Math.floor(config.rockCount ?? 1), 1, MAX_ROCKS_PER_LEVEL);
  if (countDeadEnds(grid) < config.minDeadEnds) return null;
  const candidates = shuffle(
    Array.from({ length: ROWS * COLS }, (_, index) => ({
      row: Math.floor(index / COLS),
      col: index % COLS,
    })).filter(
      (candidate) =>
        isInside(candidate.row, candidate.col) &&
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
          if (!isInside(candidate.row, candidate.col)) return false;
          if (keyOf(candidate) === keyOf(start) || solutionCells.has(keyOf(candidate))) return false;
          return neighbors(grid, grid[candidate.row][candidate.col]).length >= 2;
        }),
        rng,
      );
      rocks = [targetRock, ...decoyCandidates.slice(0, rockCount - 1)];
      if (rocks.length !== rockCount) continue;
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
  const hingedWallCount = clamp(
    Math.floor(config.hingedWallCount ?? 1),
    1,
    MAX_HINGED_WALLS_PER_LEVEL,
  );
  if (countDeadEnds(grid) < config.minDeadEnds) return null;
  const candidates = shuffle(
    Array.from({ length: ROWS * COLS }, (_, index) => ({
      row: Math.floor(index / COLS),
      col: index % COLS,
    })).filter(
      (candidate) =>
        isInside(candidate.row, candidate.col) &&
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

    for (let wallIndex = 0; wallIndex < hingedWallCount; wallIndex += 1) {
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

    if (failed || hinged.length !== hingedWallCount) continue;
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

function cloneLevelVariant(variant) {
  if (typeof globalThis.structuredClone === "function") {
    return globalThis.structuredClone(variant);
  }
  return JSON.parse(JSON.stringify(variant));
}

function pregeneratedLevelVariant(config, variantIndex) {
  const levelIndex = LEVEL_CONFIGS.indexOf(config);
  const variant = globalThis.__MOUSE_MAZE_PREGENERATED_LEVELS__?.[levelIndex]?.[variantIndex];
  return variant ? cloneLevelVariant(variant) : null;
}

function carSafetyActionsForResult(result) {
  if (result.rockSolution?.actions?.length) return result.rockSolution.actions;
  if (result.actions?.length) return result.actions;
  const path = result.alternatePath?.length ? result.alternatePath : result.path;
  return (path ?? []).slice(1).map((mouse) => ({ mouse: { ...mouse } }));
}

function carPlacementKeepsSolutionSafe(result, grid, start, carStart) {
  const actions = carSafetyActionsForResult(result);
  if (!actions.length) return false;
  if (!carHasLegalMove(grid, carStart, carBlockedKeysForPuzzle(result))) return false;
  const simulationGrid = cloneMazeGrid(grid);
  const rocks = (result.rocks ?? []).map((rock) => ({ ...rock }));
  const bottles = (result.milkBottles ?? []).map((bottle) => ({
    ...bottle,
    knocked: Boolean(bottle.knocked),
  }));
  const eatenQuarterIds = new Set();
  const activatedHingedWallIds = new Set();
  let mousePosition = { ...start };
  let carPosition = { ...carStart };

  for (const action of actions) {
    const blockedKeys = new Set([
      ...rocks.map(keyOf),
      ...bottles.map(keyOf),
    ]);
    if (result.pie && eatenQuarterIds.size < (result.pie.quarters?.length ?? 0)) {
      for (const cell of pieFootprintCells(result.pie)) blockedKeys.add(keyOf(cell));
    }

    const direction = DIRS.find((candidate) => candidate.key === action.direction);
    const nextMouse = action.mouse
      ? { ...action.mouse }
      : action.type === "move" && direction
        ? {
            row: mousePosition.row + direction.row,
            col: mousePosition.col + direction.col,
          }
        : { ...mousePosition };

    if (
      keyOf(nextMouse) === keyOf(carPosition) ||
      (action.rockTo && keyOf(action.rockTo) === keyOf(carPosition))
    ) {
      return false;
    }
    if (action.type === "knock") {
      const bottle = bottles.find((candidate) => candidate.id === action.bottleId);
      const spill = bottle && direction ? bottleSpillForDirection(bottle, direction.key) : null;
      if (spill && keyOf(spill) === keyOf(carPosition)) return false;
    }

    const carAdvances = action.type !== "knock" && action.type !== "bite";
    const nextCar = carAdvances
      ? nextCarStepAvoiding(
          simulationGrid,
          carPosition,
          mousePosition,
          blockedKeys,
        )
      : { ...carPosition };
    if (
      carAdvances &&
      carCatchesMouse(
        simulationGrid,
        mousePosition,
        nextMouse,
        carPosition,
        nextCar,
      )
    ) {
      return false;
    }

    mousePosition = nextMouse;
    carPosition = nextCar;
    if (action.rockFrom && action.rockTo) {
      const rock = rocks.find((candidate) => keyOf(candidate) === keyOf(action.rockFrom));
      if (rock) Object.assign(rock, action.rockTo);
    }
    if (action.type === "knock") {
      const bottle = bottles.find((candidate) => candidate.id === action.bottleId);
      if (bottle) {
        bottle.knocked = true;
        bottle.direction = action.direction;
      }
    }
    if (action.type === "bite") eatenQuarterIds.add(action.quarterId);

    for (const wall of result.hingedWalls ?? []) {
      if (
        activatedHingedWallIds.has(wall.id) ||
        keyOf(wall.triggerFrom) !== keyOf(mousePosition)
      ) {
        continue;
      }
      setSegmentWall(simulationGrid, wall.source, false);
      setSegmentWall(simulationGrid, wall.destination, true);
      activatedHingedWallIds.add(wall.id);
    }
  }

  return true;
}

function addCarAdversityToPuzzle(result, grid, start, rng) {
  if (!result || result.car) return result;
  const occupied = new Set([keyOf(start)]);
  for (const target of result.exits ?? []) occupied.add(keyOf(target));
  for (const bottle of result.milkBottles ?? []) occupied.add(keyOf(bottle));
  for (const rock of result.rocks ?? []) occupied.add(keyOf(rock));
  for (const cell of pieFootprintCells(result.pie)) occupied.add(keyOf(cell));
  const candidates = shuffle(
    Array.from({ length: ROWS * COLS }, (_, index) => ({
      row: Math.floor(index / COLS),
      col: index % COLS,
    })).filter((candidate) => {
      if (
        !isInside(candidate.row, candidate.col) ||
        candidate.row === 0 ||
        candidate.row === ROWS - 1 ||
        candidate.col === 0 ||
        candidate.col === COLS - 1 ||
        occupied.has(keyOf(candidate))
      ) {
        return false;
      }
      const pathToMouse = findShortestPathFrom(grid, candidate, start);
      return pathToMouse.length - 1 >= Math.min(8, Math.max(6, Math.floor((ROWS + COLS) / 3)));
    }),
    rng,
  );
  const carStart = candidates.find((candidate) =>
    carPlacementKeepsSolutionSafe(result, grid, start, candidate),
  );
  return carStart
    ? {
        ...result,
        car: { id: "catcher", row: carStart.row, col: carStart.col },
        carValidatedSolution: true,
      }
    : null;
}

function ensurePregeneratedCarStartsMobile(result, config, variantIndex) {
  if (!result?.car || !result.grid || !result.start) return result;
  const blockedKeys = carBlockedKeysForPuzzle(result);
  if (carHasLegalMove(result.grid, result.car, blockedKeys)) return result;

  const occupiedKeys = new Set([
    ...blockedKeys,
    keyOf(result.start),
    ...(result.exits ?? []).map(keyOf),
    ...(result.tunnels ?? []).map(keyOf),
  ]);
  const candidates = result.grid
    .flat()
    .filter(
      (cell) =>
        cell?.active !== false &&
        cell.row > 0 &&
        cell.row < result.grid.length - 1 &&
        cell.col > 0 &&
        cell.col < result.grid[0].length - 1 &&
        !occupiedKeys.has(keyOf(cell)) &&
        carHasLegalMove(result.grid, cell, blockedKeys),
    )
    .sort((first, second) => {
      const firstDistance = findShortestPathFrom(result.grid, first, result.start).length;
      const secondDistance = findShortestPathFrom(result.grid, second, result.start).length;
      return secondDistance - firstDistance;
    });
  const replacement = candidates.find((candidate) =>
    carPlacementKeepsSolutionSafe(result, result.grid, result.start, candidate),
  );
  if (!replacement) {
    const levelNumber = LEVEL_CONFIGS.indexOf(config) + 1;
    throw new Error(
      `Level ${levelNumber}, variant ${variantIndex + 1}: catcher has no mobile, solvable starting position.`,
    );
  }
  return {
    ...result,
    car: { ...result.car, row: replacement.row, col: replacement.col },
    carValidatedSolution: true,
  };
}

function addTunnelsToPuzzle(result, grid, start, config, rng) {
  if (!result || result.tunnels?.length) return result;
  const tunnelCount = clamp(
    config.tunnelCount ?? MIN_TUNNELS_PER_LEVEL,
    MIN_TUNNELS_PER_LEVEL,
    MAX_TUNNELS_PER_LEVEL,
  );
  const occupied = new Set([keyOf(start)]);
  for (const target of result.exits ?? []) occupied.add(keyOf(target));
  for (const bottle of result.milkBottles ?? []) occupied.add(keyOf(bottle));
  for (const rock of result.rocks ?? []) occupied.add(keyOf(rock));
  for (const cell of pieFootprintCells(result.pie)) occupied.add(keyOf(cell));
  if (result.car) occupied.add(keyOf(result.car));
  const requiredRouteKeys = new Set((result.path ?? []).map(keyOf));

  const canUseCell = (cell) =>
    Boolean(cell) &&
    isInside(cell.row, cell.col) &&
    !occupied.has(keyOf(cell)) &&
    !requiredRouteKeys.has(keyOf(cell));
  const candidates = shuffle(
    Array.from({ length: ROWS * COLS }, (_, index) => ({
      row: Math.floor(index / COLS),
      col: index % COLS,
    })).filter((candidate) => {
      if (!canUseCell(candidate)) return false;
      const distanceFromStart =
        Math.abs(candidate.row - start.row) + Math.abs(candidate.col - start.col);
      if (distanceFromStart < 3) return false;
      return findShortestPathFrom(grid, start, candidate).length > 1;
    }),
    rng,
  ).sort((first, second) => {
    const firstOpenings = neighbors(grid, grid[first.row][first.col]).length;
    const secondOpenings = neighbors(grid, grid[second.row][second.col]).length;
    return firstOpenings - secondOpenings;
  });

  const selected = [];
  for (const candidate of candidates) {
    if (
      selected.some(
        (tunnel) =>
          Math.abs(tunnel.row - candidate.row) + Math.abs(tunnel.col - candidate.col) < 4,
      )
    ) {
      continue;
    }
    selected.push({
      id: `tunnel-${selected.length}`,
      row: candidate.row,
      col: candidate.col,
    });
    if (selected.length === tunnelCount) break;
  }

  return selected.length === tunnelCount
    ? { ...result, tunnels: selected, tunnelsOptional: true }
    : null;
}

function setCellSideWall(grid, cell, side, present) {
  const direction = DIRS.find((candidate) => candidate.wall === side);
  if (!direction) return false;
  const neighbor = {
    row: cell.row + direction.row,
    col: cell.col + direction.col,
  };
  const currentCell = grid[cell.row]?.[cell.col];
  const neighborCell = grid[neighbor.row]?.[neighbor.col];
  if (!currentCell || !neighborCell || !isInside(neighbor.row, neighbor.col)) return false;
  currentCell.walls[side] = present;
  neighborCell.walls[direction.opposite] = present;
  return true;
}

function rotatingRingCells(top, left) {
  return [
    { row: top, col: left },
    { row: top, col: left + 1 },
    { row: top, col: left + 2 },
    { row: top + 1, col: left + 2 },
    { row: top + 2, col: left + 2 },
    { row: top + 2, col: left + 1 },
    { row: top + 2, col: left },
    { row: top + 1, col: left },
  ];
}

function addRotatingCircuitsToPuzzle(result, grid, start, config, rng) {
  if (!result || result.rotatingCircuits?.length) return result;
  const circuitCount = Math.max(0, Math.floor(config.rotatingCircuitCount ?? 0));
  if (!circuitCount) return result;

  const occupied = new Set([keyOf(start)]);
  for (const bottle of result.milkBottles ?? []) occupied.add(keyOf(bottle));
  for (const rock of result.rocks ?? []) occupied.add(keyOf(rock));
  for (const cell of pieFootprintCells(result.pie)) occupied.add(keyOf(cell));
  for (const tunnel of result.tunnels ?? []) occupied.add(keyOf(tunnel));
  if (result.car) occupied.add(keyOf(result.car));

  const candidates = shuffle(
    Array.from({ length: Math.max(0, ROWS - 3) * Math.max(0, COLS - 3) }, (_, index) => ({
      top: 1 + Math.floor(index / Math.max(1, COLS - 3)),
      left: 1 + (index % Math.max(1, COLS - 3)),
    })).filter(({ top, left }) => {
      if (top + 2 >= ROWS - 1 || left + 2 >= COLS - 1) return false;
      const cells = rotatingRingCells(top, left);
      return cells.every(
        (cell) => isInside(cell.row, cell.col) && !occupied.has(keyOf(cell)),
      );
    }),
    rng,
  ).sort((first, second) => {
    const firstCenter = { row: first.top + 1, col: first.left + 1 };
    const secondCenter = { row: second.top + 1, col: second.left + 1 };
    const firstDistance = Math.abs(firstCenter.row - start.row) + Math.abs(firstCenter.col - start.col);
    const secondDistance = Math.abs(secondCenter.row - start.row) + Math.abs(secondCenter.col - start.col);
    return secondDistance - firstDistance;
  });

  const selected = candidates[0];
  if (!selected) return null;
  const cells = rotatingRingCells(selected.top, selected.left);
  for (const cell of cells) {
    for (const direction of DIRS) setCellSideWall(grid, cell, direction.wall, false);
  }

  const tileWalls = cells.map(() => ({ top: false, right: false, bottom: false, left: false }));
  tileWalls[1].bottom = true;
  tileWalls[3].left = true;
  tileWalls[5].top = true;
  tileWalls[7].right = true;
  tileWalls.forEach((walls, index) => {
    for (const direction of DIRS) {
      if (walls[direction.wall]) {
        setCellSideWall(grid, cells[index], direction.wall, true);
      }
    }
  });

  const exits = (result.exits ?? (result.exit ? [result.exit] : [])).map((target) => ({ ...target }));
  if (exits.length) {
    exits[0] = { ...exits[0], ...cells[2] };
  }
  const route = bestCheeseRoute(grid, start, exits);
  if (!route?.path?.length) return null;
  const routeDistance = route.path.length - 1;
  const rotatingMoveMargin = config.rotatingMoveMargin ?? 10;

  return {
    ...result,
    exits,
    exit: exits[0] ? { ...exits[0] } : result.exit,
    path: route.path,
    alternatePath: null,
    moveLimit: routeDistance + rotatingMoveMargin,
    rotatingCircuits: [
      {
        id: "rotating-circuit-0",
        direction: 1,
        offset: 0,
        cells,
        tiles: tileWalls.map((walls, homeIndex) => ({
          id: `rotating-tile-${homeIndex}`,
          homeIndex,
          walls,
        })),
      },
    ],
  };
}

function buildLevelVariant(config, variantIndex) {
  const variantConfig = resolveLevelConfigForVariant(config, variantIndex);
  const pregenerated = pregeneratedLevelVariant(config, variantIndex);
  if (pregenerated) {
    setGridDimensions(variantConfig);
    const validated = ensurePregeneratedCarStartsMobile(pregenerated, config, variantIndex);
    return { ...validated, activeAdversities: variantConfig.activeAdversities };
  }
  setGridDimensions(variantConfig);
  const variantSeed = variantConfig.seed + variantIndex * VARIANT_SEED_GAP;
  const start = startForVariant(variantConfig, variantIndex);
  const fixedAttempt = variantConfig.variantAttempts?.[variantIndex];
  const attempts = Number.isInteger(fixedAttempt)
    ? [fixedAttempt]
    : Array.from({ length: 1400 }, (_, attempt) => attempt);

  for (const attempt of attempts) {
    const seed = variantSeed + attempt * 7919;
    const rng = createRng(seed);
    const grid = blankMaze();
    if (variantConfig.generator === "kruskal") carveKruskalMaze(grid, rng);
    else carveMaze(grid, rng, start);
    addLoops(grid, variantConfig.loops ?? 14, rng);

    const hasSpecialPuzzle = Boolean(
      variantConfig.pieCount ||
      variantConfig.milkCount ||
      variantConfig.hingedWallCount ||
      variantConfig.rockMode,
    );
    let result = variantConfig.pieCount
      ? choosePiePuzzleAndValidate(grid, variantConfig, variantIndex, start, rng)
      : variantConfig.milkCount
        ? chooseMilkPuzzleAndValidate(grid, variantConfig, variantIndex, start, rng)
        : variantConfig.hingedWallCount
          ? chooseHingedWallPuzzleAndValidate(grid, variantConfig, variantIndex, start, rng)
          : variantConfig.rockMode
            ? chooseRockPuzzleAndValidate(grid, variantConfig, variantIndex, start, rng)
            : variantConfig.carMode && !variantConfig.carOverlay
              ? chooseCarPuzzleAndValidate(grid, variantConfig, variantIndex, start, rng)
              : variantConfig.cheeseCount > 1
                ? chooseCheeseTargetsAndValidate(grid, variantConfig, variantIndex, start, rng)
                : chooseExitAndValidate(grid, variantConfig, variantIndex, start, rng);
    if (
      result &&
      variantConfig.carMode &&
      (hasSpecialPuzzle || variantConfig.carOverlay)
    ) {
      result = addCarAdversityToPuzzle(result, result.grid ?? grid, start, rng);
    }
    if (result && variantConfig.tunnelCount) {
      result = addTunnelsToPuzzle(result, grid, start, variantConfig, rng);
    }
    if (result && variantConfig.rotatingCircuitCount) {
      result = addRotatingCircuitsToPuzzle(result, grid, start, variantConfig, rng);
    }
    if (result) {
      const requiredRouteLength = Math.max(
        result.path.length - 1,
        (result.alternatePath?.length ?? 1) - 1,
      );
      const spareMoves = Math.max(0, result.moveLimit - requiredRouteLength);
      const tightenedSpareMoves = spareMoves > 0
        ? Math.max(1, Math.floor(spareMoves * 0.8))
        : 0;
      return {
        grid,
        start,
        ...result,
        moveLimit: requiredRouteLength + tightenedSpareMoves,
        activeAdversities: variantConfig.activeAdversities,
        seed,
        attempt,
      };
    }
  }

  throw new Error(
    `Could not build ${variantConfig.difficulty ?? "level"} seed ${variantConfig.seed} variant ${variantIndex + 1}`,
  );
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
  const currentVariantIndex = levelVariantStates[level - 1]?.current;
  if (!config || currentVariantIndex < 0) {
    generateLevel();
    return;
  }

  const variantIndex = takeRetryVariant(level - 1);
  loadLevelVariant(config, variantIndex, "retry");
}

function loadLevelVariant(config, variantIndex, introMode = "full") {
  activeLevelConfig = resolveLevelConfigForVariant(config, variantIndex);
  setGridDimensions(activeLevelConfig);
  const variant = buildLevelVariant(config, variantIndex);
  activeVariantIndex = variantIndex;
  maze = variant.grid;
  cheeseTargets = (variant.exits ?? (variant.exit ? [variant.exit] : [])).map(
    (target, index) => ({ ...target, id: target.id ?? `cheese-${index}` }),
  );
  collectedCheeseKeys = new Set();
  initialMilkBottles = (variant.milkBottles ?? []).map((bottle) => ({ ...bottle }));
  initialPie = variant.pie
    ? {
        ...variant.pie,
        quarters: variant.pie.quarters.map((quarter) => ({
          ...quarter,
          approach: { ...quarter.approach },
        })),
      }
    : null;
  initialCar = variant.car ? { ...variant.car } : null;
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
  initialTunnels = (variant.tunnels ?? []).map((tunnel) => ({ ...tunnel }));
  initialRotatingCircuits = (variant.rotatingCircuits ?? []).map((circuit) => ({
    ...circuit,
    cells: circuit.cells.map((cell) => ({ ...cell })),
    tiles: circuit.tiles.map((tile) => ({
      ...tile,
      walls: { ...tile.walls },
    })),
    offset: 0,
  }));
  exit = variant.exit ? { ...variant.exit } : null;
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
  clearSwipeTutorial();
  clearMechanicTutorial();
  clearCrystalTutorial();
  clearTornadoTutorial();
  clearPowerIntroTutorial();
  clearTunnelAnimation();
  clearTunnelTutorial();
  clearRotatingTilesAnimation();
  clearRotatingTilesTutorial();
  clearCloudRun();
  clearHingedWallAnimation();
  clearMilkAnimations();
  clearPieBiteAnimation();
  clearCarAnimations();
  resetCockroachRun();
  resetCatPawRun();
  resetCrowRun();
  waterMoveCount = 0;
  floodedWaterKeys = new Set();
  waterOrigin = { ...levelStart };
  syncWaterDebugDataset();
  mouse = { ...levelStart };
  collectedCheeseKeys = new Set();
  tornadoTutorialShownThisRun = false;
  powerIntroTutorialShownThisRun = false;
  powerIntroTutorialUnlockedForRun = new Set();
  tornadoTutorialUnlockedForRun =
    tornadoTutorialWasSeen() && !forceTornadoTutorialFromUrl();
  collectedMilkIds = new Set();
  milkBottles = initialMilkBottles.map((bottle) => ({
    ...bottle,
    knocked: false,
    direction: null,
    spill: null,
  }));
  pie = initialPie
    ? {
        ...initialPie,
        quarters: initialPie.quarters.map((quarter) => ({
          ...quarter,
          approach: { ...quarter.approach },
        })),
      }
    : null;
  eatenPieQuarterIds = new Set();
  car = initialCar ? { ...initialCar } : null;
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
  tunnels = initialTunnels.map((tunnel) => ({ ...tunnel, sealed: false }));
  rotatingCircuits = initialRotatingCircuits.map((circuit) => ({
    ...circuit,
    cells: circuit.cells.map((cell) => ({ ...cell })),
    tiles: circuit.tiles.map((tile) => ({
      ...tile,
      walls: { ...tile.walls },
    })),
    offset: 0,
  }));
  applyRotatingCircuitWalls();
  cheeseEatingTarget = null;
  activeFishingCatchTarget = null;
  syncActiveExit();
  mouseFacingDirection = initialFacingForStart(levelStart);
  if (car) {
    carFacingDirection = carDirectionBetween(
      car,
      nextCarStepForTurn(maze, car, mouse),
      "left",
    );
  }
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
  resetPowers();
  updateAttemptUI();
  render();
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
  try {
    globalThis.localStorage?.removeItem(POWER_GRANT_STORAGE_KEY);
    globalThis.localStorage?.removeItem(CRYSTAL_TUTORIAL_STORAGE_KEY);
    globalThis.localStorage?.removeItem(TORNADO_TUTORIAL_STORAGE_KEY);
    globalThis.localStorage?.removeItem(POWER_INTRO_TUTORIAL_STORAGE_KEY);
    globalThis.localStorage?.removeItem(TUNNEL_TUTORIAL_STORAGE_KEY);
    globalThis.localStorage?.removeItem(ROTATING_TILES_TUTORIAL_STORAGE_KEY);
    globalThis.localStorage?.removeItem(MECHANIC_TUTORIAL_STORAGE_KEY);
  } catch {
    // Test reset still works for the current session when storage is unavailable.
  }
  updateAttemptUI();
  updateCurrencyUI();
  resetWorldProgress();
  generateLevel();
  showWorldMap();
}

function render() {
  mazeEl.classList.remove("win", "invalid");
  levelLabelEl.textContent = campaignComplete ? "Game" : "Level";
  levelTitleEl.textContent = campaignComplete ? "Over" : String(level);
  movesLeftEl.textContent = movesLeft;
  const collectedCount = collectedCheeseKeys.size;
  const remainingCheese = Math.max(0, cheeseTargets.length - collectedCount);
  const remainingMilk = Math.max(0, milkBottles.length - collectedMilkIds.size);
  const remainingPie = remainingPieQuarters().length;
  cheeseRemainingEl.textContent = String(remainingCheese);
  milkRemainingEl.textContent = String(remainingMilk);
  pieRemainingEl.textContent = String(remainingPie);
  cheeseObjectiveEl.hidden = cheeseTargets.length === 0;
  milkObjectiveEl.hidden = milkBottles.length === 0;
  pieObjectiveEl.hidden = !pie;
  cheeseProgressEl.hidden = campaignComplete;
  cheeseProgressEl.setAttribute(
    "aria-label",
    `${remainingCheese + remainingMilk + remainingPie} objective${remainingCheese + remainingMilk + remainingPie === 1 ? "" : "s"} remaining`,
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
  drawMechanicTutorialOverlay(mazeContext, bounds.width, bounds.height);
  ensureWaterSurfaceAnimation();
}

function drawTutorialSprite(ctx, sprite, center, size, rotation = 0, opacity = 1) {
  if (!sprite?.complete || !sprite.naturalWidth || opacity <= 0) return;
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.translate(center.x, center.y);
  ctx.rotate(rotation);
  ctx.shadowColor = "rgba(35, 42, 38, 0.28)";
  ctx.shadowBlur = size * 0.12;
  ctx.shadowOffsetY = size * 0.08;
  ctx.drawImage(sprite, -size / 2, -size / 2, size, size);
  ctx.restore();
}

function drawTutorialFloor(ctx, left, top, width, height, columns = 5, rows = 3) {
  const cellWidth = width / columns;
  const cellHeight = height / rows;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(left, top, width, height, 8);
  ctx.clip();
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < columns; col += 1) {
      ctx.fillStyle = (row + col) % 2 ? "#eee3ca" : "#faf7ee";
      ctx.fillRect(left + col * cellWidth, top + row * cellHeight, cellWidth, cellHeight);
    }
  }
  ctx.strokeStyle = "rgba(121, 137, 125, 0.24)";
  ctx.lineWidth = 1;
  for (let col = 1; col < columns; col += 1) {
    ctx.beginPath();
    ctx.moveTo(left + col * cellWidth, top);
    ctx.lineTo(left + col * cellWidth, top + height);
    ctx.stroke();
  }
  for (let row = 1; row < rows; row += 1) {
    ctx.beginPath();
    ctx.moveTo(left, top + row * cellHeight);
    ctx.lineTo(left + width, top + row * cellHeight);
    ctx.stroke();
  }
  ctx.restore();
  ctx.strokeStyle = "#718478";
  ctx.lineWidth = Math.max(3, width * 0.014);
  ctx.beginPath();
  ctx.roundRect(left, top, width, height, 8);
  ctx.stroke();
  return { cellWidth, cellHeight };
}

function drawMechanicTutorialOverlay(ctx, width, height) {
  if (!mechanicTutorial) return;
  const progress = clamp(mechanicTutorial.progress, 0, 1);
  const entrance = smoothStep(clamp(progress / 0.1, 0, 1));
  const exit = 1 - smoothStep(clamp((progress - 0.9) / 0.1, 0, 1));
  const opacity = Math.min(entrance, exit);
  const stageWidth = Math.min(width * 0.78, 430);
  const stageHeight = Math.min(height * 0.34, stageWidth * 0.58);
  const left = (width - stageWidth) / 2;
  const top = height * 0.47 - stageHeight / 2;
  const padding = stageWidth * 0.06;
  const floorLeft = left + padding;
  const floorTop = top + padding;
  const floorWidth = stageWidth - padding * 2;
  const floorHeight = stageHeight - padding * 2;

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = "rgba(28, 37, 33, 0.34)";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "rgba(250, 248, 239, 0.97)";
  ctx.shadowColor = "rgba(35, 44, 39, 0.28)";
  ctx.shadowBlur = 24;
  ctx.beginPath();
  ctx.roundRect(left, top, stageWidth, stageHeight, 8);
  ctx.fill();
  ctx.shadowColor = "transparent";
  const grid = drawTutorialFloor(ctx, floorLeft, floorTop, floorWidth, floorHeight);
  const cell = Math.min(grid.cellWidth, grid.cellHeight);
  const point = (col, row) => ({
    x: floorLeft + (col + 0.5) * grid.cellWidth,
    y: floorTop + (row + 0.5) * grid.cellHeight,
  });
  const pulse = 1 + Math.sin(progress * Math.PI * 16) * 0.035;
  const mouseSize = cell * 0.92;

  if (mechanicTutorial.kind === "cheese") {
    const approach = smoothStep(clamp((progress - 0.1) / 0.4, 0, 1));
    const eating = clamp((progress - 0.5) / 0.36, 0, 1);
    const start = point(0.7, 1);
    const target = point(3.25, 1);
    const mouseCenter = {
      x: start.x + (target.x - start.x) * approach,
      y: start.y,
    };
    const cheeseFade = 1 - smoothStep(clamp((eating - 0.28) / 0.58, 0, 1));

    if (cheeseFade > 0) {
      ctx.save();
      ctx.globalAlpha = 0.22 * cheeseFade;
      ctx.fillStyle = "#f4bd45";
      ctx.beginPath();
      ctx.ellipse(target.x, target.y + cell * 0.18, cell * 0.5, cell * 0.24, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      drawTutorialSprite(
        ctx,
        cheeseSprite,
        target,
        cell * 0.72 * (1 - eating * 0.18),
        0,
        cheeseFade,
      );
    }

    if (eating > 0 && mouseEatingSprite.complete) {
      drawSpriteFrame(
        ctx,
        mouseEatingSprite,
        Math.min(3, Math.floor(eating * 4)),
        4,
        target,
        mouseSize,
        0.58,
      );
    } else {
      drawSpriteFrame(
        ctx,
        mouseWalkRightSprite,
        Math.min(3, Math.floor(approach * 4)),
        4,
        mouseCenter,
        mouseSize * pulse,
        0.58,
      );
    }
  } else if (mechanicTutorial.kind === "milk") {
    const push = smoothStep(clamp((progress - 0.12) / 0.34, 0, 1));
    const spill = smoothStep(clamp((progress - 0.38) / 0.2, 0, 1));
    const drink = clamp((progress - 0.62) / 0.25, 0, 1);
    const mouseCenter = drink > 0
      ? point(3.15, 1)
      : { x: point(1, 1).x + cell * 0.62 * push, y: point(1, 1).y };
    if (drink > 0 && mouseDrinkingSprite.complete) {
      drawSpriteFrame(ctx, mouseDrinkingSprite, Math.min(3, Math.floor(drink * 4)), 4, mouseCenter, mouseSize, 0.58);
    } else if (mouseMilkPushRightSprite.complete) {
      drawSpriteFrame(ctx, mouseMilkPushRightSprite, Math.min(3, Math.floor(push * 4)), 4, mouseCenter, mouseSize, 0.58);
    } else drawTutorialSprite(ctx, mouseSprite, mouseCenter, mouseSize);
    const bottleCenter = point(2.45, 1);
    drawTutorialSprite(ctx, milkBottleSprite, bottleCenter, cell * 0.72, Math.PI * 0.48 * spill);
    if (spill > 0) {
      ctx.fillStyle = `rgba(249, 246, 226, ${0.9 * spill})`;
      ctx.beginPath();
      ctx.ellipse(point(3.25, 1).x, point(3.25, 1).y + cell * 0.18, cell * 0.45 * spill, cell * 0.23 * spill, 0.1, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (mechanicTutorial.kind === "rock") {
    const amount = smoothStep(clamp((progress - 0.16) / 0.58, 0, 1));
    const mouseCenter = { x: point(1, 1).x + cell * amount, y: point(1, 1).y };
    const rockCenter = { x: point(2, 1).x + cell * amount, y: point(2, 1).y };
    drawSpriteFrame(
      ctx,
      mouseWalkRightSprite,
      Math.min(3, Math.floor(amount * 4)),
      4,
      mouseCenter,
      mouseSize * pulse,
      0.58,
    );
    drawTutorialSprite(ctx, rockSprite, rockCenter, cell * 0.9, 0, 1);
  } else if (mechanicTutorial.kind === "hinge") {
    const amount = smoothStep(clamp((progress - 0.2) / 0.55, 0, 1));
    const hinge = point(2, 1);
    drawSpriteFrame(
      ctx,
      mouseWalkRightSprite,
      Math.min(3, Math.floor(amount * 4)),
      4,
      { x: point(0.8, 1).x + cell * 0.6 * amount, y: hinge.y + cell * 0.4 },
      mouseSize,
      0.58,
    );
    ctx.save();
    ctx.translate(hinge.x, hinge.y);
    ctx.rotate((Math.PI / 2) * amount);
    ctx.strokeStyle = "#728579";
    ctx.lineWidth = cell * 0.2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(cell * 1.15, 0);
    ctx.stroke();
    ctx.restore();
    ctx.fillStyle = "#d4b36d";
    ctx.beginPath();
    ctx.arc(hinge.x, hinge.y, cell * 0.12, 0, Math.PI * 2);
    ctx.fill();
  } else if (mechanicTutorial.kind === "car") {
    const approach = smoothStep(clamp((progress - 0.12) / 0.42, 0, 1));
    const capture = clamp((progress - 0.54) / 0.34, 0, 1);
    const carCenter = { x: point(0.7, 1).x + cell * 1.55 * approach, y: point(0.7, 1).y };
    const mouseCenter = point(3, 1);
    if (capture > 0 && rcCatcherCaptureRightSprite.complete) {
      drawSpriteFrame(ctx, rcCatcherCaptureRightSprite, Math.min(3, Math.floor(capture * 4)), 4, { x: (carCenter.x + mouseCenter.x) / 2, y: mouseCenter.y }, cell * 1.65, 0.5, 1, null, false);
    } else {
      drawSpriteFrame(
        ctx,
        rcCatcherWalkRightSprite,
        Math.min(3, Math.floor(approach * 4)),
        4,
        carCenter,
        cell * 1.02,
        0.5,
        1,
        null,
        false,
      );
      drawTutorialSprite(ctx, mouseSprite, mouseCenter, mouseSize);
    }
  } else if (mechanicTutorial.kind === "cockroach") {
    const travel = smoothStep(clamp((progress - 0.15) / 0.66, 0, 1));
    const from = point(1, 1);
    const to = point(3, 1);
    const center = { x: from.x + (to.x - from.x) * travel, y: from.y - Math.sin(travel * Math.PI) * cell * 0.12 };
    drawTutorialSprite(ctx, cheeseSprite, { x: center.x, y: center.y - cell * 0.25 }, cell * 0.6, 0, 1);
    drawTutorialSprite(ctx, cockroachSprite, center, cell * 1.02, 0, 1);
  } else if (mechanicTutorial.kind === "pie") {
    drawTutorialSprite(ctx, pieSprite, point(2, 1), cell * 2.05, 0, 1);
    const eaten = Math.min(4, Math.floor(clamp((progress - 0.14) / 0.68, 0, 0.9999) * 4));
    const pieCenter = point(2, 1);
    const half = cell * 1.02;
    ctx.fillStyle = "rgba(250, 248, 239, 0.92)";
    const quarters = [
      [pieCenter.x - half, pieCenter.y - half],
      [pieCenter.x, pieCenter.y - half],
      [pieCenter.x - half, pieCenter.y],
      [pieCenter.x, pieCenter.y],
    ];
    for (let index = 0; index < eaten; index += 1) ctx.fillRect(quarters[index][0], quarters[index][1], half, half);
    drawSpriteFrame(
      ctx,
      mouseEatingSprite,
      Math.min(3, Math.floor(clamp((progress - 0.14) / 0.68, 0, 1) * 4)),
      4,
      { x: pieCenter.x + cell * 1.28, y: pieCenter.y },
      mouseSize,
      0.58,
    );
  } else if (mechanicTutorial.kind === "catPaw") {
    const descend = smoothStep(clamp((progress - 0.36) / 0.3, 0, 1));
    const target = point(2, 1);
    ctx.fillStyle = `rgba(42, 38, 34, ${0.12 + 0.24 * clamp(progress / 0.38, 0, 1)})`;
    ctx.beginPath();
    ctx.ellipse(target.x, target.y, cell * 1.1, cell * 0.72, 0, 0, Math.PI * 2);
    ctx.fill();
    if (progress < 0.68) drawTutorialSprite(ctx, mouseSprite, target, mouseSize);
    drawTutorialSprite(ctx, catPawSprite, { x: target.x, y: target.y - cell * (2.1 - 2.0 * descend) }, cell * 2.3, 0, descend);
  } else if (mechanicTutorial.kind === "crow") {
    const target = point(2, 1);
    const approach = smoothStep(clamp((progress - 0.34) / 0.28, 0, 1));
    const depart = smoothStep(clamp((progress - 0.62) / 0.26, 0, 1));
    const shadowSpan = progress < 0.2 ? 2.2 : progress < 0.38 ? 1.8 : 1.35;
    ctx.fillStyle = `rgba(28, 31, 33, ${0.12 + progress * 0.2})`;
    ctx.beginPath();
    ctx.ellipse(target.x, target.y, cell * shadowSpan, cell * shadowSpan * 0.56, -0.08, 0, Math.PI * 2);
    ctx.fill();
    if (progress < 0.62) drawTutorialSprite(ctx, mouseSprite, target, mouseSize);
    const crowCenter = {
      x: target.x - cell * 2.4 * (1 - approach) + cell * 2.5 * depart,
      y: target.y + cell * 1.7 * (1 - approach) - cell * 1.8 * depart,
    };
    drawTutorialSprite(ctx, crowSprite, crowCenter, cell * 2.7, -0.08, approach * (1 - depart * 0.45));
  } else if (mechanicTutorial.kind === "cloud") {
    const travel = smoothStep(clamp((progress - 0.08) / 0.82, 0, 1));
    const center = { x: floorLeft - cell * 2 + (floorWidth + cell * 4) * travel, y: point(2, 1).y };
    drawTutorialSprite(ctx, mouseSprite, point(2, 1), mouseSize);
    drawTutorialSprite(ctx, cloudSprite, center, cell * 3.5, 0, 0.96);
  } else if (mechanicTutorial.kind === "water") {
    const filled = Math.min(11, Math.floor(clamp((progress - 0.12) / 0.74, 0, 0.9999) * 11));
    const order = [[0,1],[1,1],[2,1],[2,0],[2,2],[3,0],[3,2],[4,0],[4,2],[3,1],[4,1]];
    for (let index = 0; index < filled; index += 1) {
      const [col, row] = order[index];
      const x = floorLeft + col * grid.cellWidth;
      const y = floorTop + row * grid.cellHeight;
      const gradient = ctx.createLinearGradient(x, y, x, y + grid.cellHeight);
      gradient.addColorStop(0, "rgba(119, 211, 232, 0.78)");
      gradient.addColorStop(1, "rgba(48, 139, 190, 0.9)");
      ctx.fillStyle = gradient;
      ctx.fillRect(x + 1, y + 1, grid.cellWidth - 2, grid.cellHeight - 2);
      ctx.strokeStyle = "rgba(235, 252, 255, 0.88)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + grid.cellWidth * 0.14, y + grid.cellHeight * 0.45);
      ctx.quadraticCurveTo(x + grid.cellWidth * 0.5, y + grid.cellHeight * 0.28, x + grid.cellWidth * 0.86, y + grid.cellHeight * 0.45);
      ctx.stroke();
    }
    drawTutorialSprite(ctx, mouseSprite, point(4, 1), mouseSize);
  }

  ctx.strokeStyle = "rgba(210, 171, 76, 0.92)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(width / 2, top + stageHeight + 10, 3 + Math.sin(progress * Math.PI * 8), 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function createBoardGeometry(width, height) {
  const config = LEVEL_CONFIGS[level - 1] ?? {};
  const boardScale = config.boardScale ?? 1;
  const visualWidth = width * boardScale;
  const frameWidth = clamp(visualWidth * 0.027, 9, 30);
  const frameDepth = clamp(visualWidth * 0.035, 12, 38);
  const boardAspect = (width <= 600 ? 0.82 : 0.74) * (ROWS / COLS);
  const boardHeight = Math.min(
    width * boardAspect * boardScale,
    height - frameDepth - 16,
  );
  const topY = boardScale < 1
    ? Math.max(8, (height - boardHeight - frameDepth) * 0.48)
    : clamp(width * 0.018, 8, 18);
  const bottomY = topY + boardHeight;
  const topHalfWidth = width * 0.41 * boardScale;
  const bottomHalfWidth = width * 0.46 * boardScale;
  const outer = {
    tl: { x: width * 0.5 - topHalfWidth, y: topY },
    tr: { x: width * 0.5 + topHalfWidth, y: topY },
    br: { x: width * 0.5 + bottomHalfWidth, y: bottomY },
    bl: { x: width * 0.5 - bottomHalfWidth, y: bottomY },
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
  } else if (milkKnockAnimation) {
    amount = cameraAnimationEnvelope(milkKnockAnimation.progress, 0.14, 0.18);
    zoom = 1.36;
  } else if (milkDrinkAnimation) {
    amount = cameraAnimationEnvelope(milkDrinkAnimation.progress, 0.14, 0.18);
    zoom = 1.42;
  } else if (carCaptureAnimation) {
    amount = cameraAnimationEnvelope(carCaptureAnimation.progress, 0.12, 0.16);
    zoom = 1.48;
  } else if (cockroachAnimation) {
    amount = cameraAnimationEnvelope(cockroachAnimation.progress, 0.14, 0.16);
    zoom = 1.24;
    focusCell = {
      row: (cockroachAnimation.from.row + cockroachAnimation.to.row) / 2,
      col: (cockroachAnimation.from.col + cockroachAnimation.to.col) / 2,
    };
  } else if (catPawAnimation) {
    amount = cameraAnimationEnvelope(catPawAnimation.progress, 0.18, 0.2);
    zoom = 1.22;
    focusCell = catPawThreatCenterCell(catPawAnimation.threat);
  } else if (crowAnimation) {
    amount = cameraAnimationEnvelope(crowAnimation.progress, 0.14, 0.2);
    zoom = 1.3;
    focusCell = crowThreatCenterCell(crowAnimation.threat);
  } else if (tunnelAnimation || tunnelTutorial) {
    const activeTunnelSequence = tunnelAnimation ?? tunnelTutorial;
    amount = cameraAnimationEnvelope(activeTunnelSequence.progress, 0.16, 0.18);
    zoom = tunnelAnimation ? 1.34 : 1.22;
    const timings = tunnelSequenceTimings(activeTunnelSequence);
    const tunnelPan = smoothStep(
      clamp(
        (activeTunnelSequence.progress - timings.entryEnd) /
          (timings.exitStart - timings.entryEnd),
        0,
        1,
      ),
    );
    focusCell = {
      row:
        activeTunnelSequence.from.row +
        (activeTunnelSequence.to.row - activeTunnelSequence.from.row) * tunnelPan,
      col:
        activeTunnelSequence.from.col +
        (activeTunnelSequence.to.col - activeTunnelSequence.from.col) * tunnelPan,
    };
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
  const shapedBoard = Boolean(LEVEL_CONFIGS[level - 1]?.shape);

  if (!shapedBoard) {
    drawBoardShadow(ctx, outer, frameDepth);
    drawBoardBase(ctx, outer, frameDepth, frameWidth);
  } else {
    drawShapedBoardBase(ctx, inner, width, frameDepth);
  }
  drawFloor(ctx, inner, width);
  drawWater(ctx, inner);
  drawRotatingTileMarkers(ctx, inner, width);
  drawTunnels(ctx, inner);
  if (catPawThreat) drawCatPawDangerZone(ctx, inner);
  if (crowThreat) drawCrowDangerZone(ctx, inner);
  if (crystalRevealPath.length) drawCrystalPath(ctx, inner);
  if (rocketTargeting && !powerTransform) drawRocketTargets(ctx, inner);
  if (fishingTargeting && !powerTransform) drawFishingTargets(ctx, inner);
  if (tornadoWallAnimation) {
    drawTornadoWalls(ctx, inner, width);
    if (shapedBoard) drawExteriorWalls(ctx, inner, width);
  }
  else {
    drawInteriorWalls(ctx, inner, width);
    if (shapedBoard) drawExteriorWalls(ctx, inner, width);
    drawHingedWallIndicators(ctx, inner, width);
    if (hingedWallAnimation) drawHingedWallMovement(ctx, inner, width);
  }
  if (hammerWallAnimation) drawHammerWallAnimation(ctx, inner, width);
  if (hammerTargeting && !powerTransform && !hammerWallAnimation) {
    drawHammerTargets(ctx, inner, width);
  }
  if (!shapedBoard) drawOuterFrame(ctx, outer, frameWidth, frameDepth);
  drawMilkBottles(ctx, inner);
  if (!tornadoWallAnimation) drawMilkForegroundWalls(ctx, inner, width);
  drawPie(ctx, inner);
  if (!tornadoWallAnimation) drawPieForegroundWalls(ctx, inner, width);
  drawCharacters(ctx, inner);
  drawTunnelForegroundEffects(ctx, inner);
  if (!tornadoWallAnimation) drawCarForegroundWalls(ctx, inner, width);
  if (cockroachAnimation) drawCockroachEvent(ctx, inner);
  if (catPawAnimation) drawCatPawStrike(ctx, inner, width);
  if (crowAnimation) drawCrowStrike(ctx, inner, width);
  if (hammerWallAnimation) drawHammerDebrisAnimation(ctx, inner, width);
  drawCloudCover(ctx, inner, outer);
  if (cloud) {
    if (catPawThreat) drawCatPawDangerZone(ctx, inner);
    if (crowThreat) drawCrowDangerZone(ctx, inner);
  }
}

function drawCloudMouseSilhouette(ctx, corners, cloudCenter) {
  if (mouseCapturedByCrow || !mouseSprite.complete || !mouseSprite.naturalWidth) return;
  const visualMouse = currentMouseVisualState();
  const rowDistance = Math.abs(visualMouse.row - cloudCenter.row);
  const colDistance = Math.abs(visualMouse.col - cloudCenter.col);
  if (rowDistance > 1.05 || colDistance > 1.05) return;

  const center = project(
    corners,
    (visualMouse.col + 0.5) / COLS,
    (visualMouse.row + 0.5) / ROWS,
  );
  const cellWidth = distance(
    project(corners, visualMouse.col / COLS, visualMouse.row / ROWS),
    project(corners, (visualMouse.col + 1) / COLS, visualMouse.row / ROWS),
  );
  const size = cellWidth * MOUSE_FALLBACK_SCALE;
  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.filter = "grayscale(1) brightness(0.32) contrast(1.35)";
  ctx.drawImage(
    createAlbinoSkinPreview(mouseSprite),
    center.x - size / 2,
    center.y - size * 0.72,
    size,
    size,
  );
  ctx.restore();
}

function drawCloudCover(ctx, corners, outerCorners) {
  const visual = currentCloudVisualState();
  if (!visual || !cloudSprite.complete || !cloudSprite.naturalWidth) return;

  const halfFootprint = CLOUD_FOOTPRINT_CELLS / 2;
  const center = project(
    corners,
    (visual.col + 0.5) / COLS,
    (visual.row + 0.5) / ROWS,
  );
  const left = project(
    corners,
    (visual.col + 0.5 - halfFootprint) / COLS,
    (visual.row + 0.5) / ROWS,
  );
  const right = project(
    corners,
    (visual.col + 0.5 + halfFootprint) / COLS,
    (visual.row + 0.5) / ROWS,
  );
  const top = project(
    corners,
    (visual.col + 0.5) / COLS,
    (visual.row + 0.5 - halfFootprint) / ROWS,
  );
  const bottom = project(
    corners,
    (visual.col + 0.5) / COLS,
    (visual.row + 0.5 + halfFootprint) / ROWS,
  );
  const drawWidth = distance(left, right) * 1.14;
  const drawHeight = distance(top, bottom) * 1.18;
  const frameOverhang = Math.max(
    8,
    (distance(outerCorners.tl, outerCorners.tr) / COLS) * 0.34,
  );

  ctx.save();
  tracePolygon(ctx, [
    {
      x: outerCorners.tl.x - frameOverhang,
      y: outerCorners.tl.y - frameOverhang,
    },
    {
      x: outerCorners.tr.x + frameOverhang,
      y: outerCorners.tr.y - frameOverhang,
    },
    {
      x: outerCorners.br.x + frameOverhang,
      y: outerCorners.br.y + frameOverhang,
    },
    {
      x: outerCorners.bl.x - frameOverhang,
      y: outerCorners.bl.y + frameOverhang,
    },
  ]);
  ctx.clip();
  ctx.globalAlpha = 0.98;
  ctx.filter = "contrast(1.08) saturate(0.82)";
  ctx.shadowColor = "rgba(62, 72, 78, 0.24)";
  ctx.shadowBlur = Math.min(drawWidth, drawHeight) * 0.12;
  ctx.drawImage(
    cloudSprite,
    center.x - drawWidth / 2,
    center.y - drawHeight / 2,
    drawWidth,
    drawHeight,
  );
  ctx.filter = "none";
  ctx.shadowColor = "transparent";
  drawCloudMouseSilhouette(ctx, corners, visual);
  ctx.restore();
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
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      if (!isInside(row, col)) continue;
      const points = [
        project(inner, col / COLS, row / ROWS),
        project(inner, (col + 1) / COLS, row / ROWS),
        project(inner, (col + 1) / COLS, (row + 1) / ROWS),
        project(inner, col / COLS, (row + 1) / ROWS),
      ];
      const topToBottom = ctx.createLinearGradient(points[0].x, points[0].y, points[3].x, points[3].y);
      topToBottom.addColorStop(0, (row + col) % 2 === 0 ? "#fffaf0" : "#f1e6ce");
      topToBottom.addColorStop(1, (row + col) % 2 === 0 ? "#f5ead5" : "#e9dcc1");
      ctx.fillStyle =
        topToBottom;
      tracePolygon(ctx, points);
      ctx.fill();
      ctx.strokeStyle = "rgba(155, 137, 105, 0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  ctx.restore();
}

function waterPointBetween(from, to, amount) {
  return {
    x: from.x + (to.x - from.x) * amount,
    y: from.y + (to.y - from.y) * amount,
  };
}

function waterCellCenter(polygon) {
  return polygon.reduce(
    (sum, point) => ({
      x: sum.x + point.x / polygon.length,
      y: sum.y + point.y / polygon.length,
    }),
    { x: 0, y: 0 },
  );
}

function waterOutsideSource(cell) {
  if (cell.row === 0) return { row: -1, col: cell.col };
  if (cell.row === ROWS - 1) return { row: ROWS, col: cell.col };
  if (cell.col === 0) return { row: cell.row, col: -1 };
  return { row: cell.row, col: COLS };
}

function waterSourceForCell(cell, wetKeys = floodedWaterKeys) {
  const mazeCell = maze[cell.row]?.[cell.col];
  if (mazeCell) {
    for (const direction of DIRS) {
      if (mazeCell.walls[direction.wall]) continue;
      const candidate = {
        row: cell.row + direction.row,
        col: cell.col + direction.col,
      };
      if (wetKeys.has(keyOf(candidate))) return candidate;
    }
  }
  return keyOf(cell) === keyOf(waterOrigin) ? waterOutsideSource(cell) : null;
}

function waterFlowSide(cell, source) {
  if (!source) return "top";
  if (source.row < cell.row) return "top";
  if (source.row > cell.row) return "bottom";
  if (source.col < cell.col) return "left";
  return "right";
}

function waterFillPolygon(polygon, side, progress) {
  const amount = clamp(progress, 0, 1);
  if (side === "bottom") {
    return [
      waterPointBetween(polygon[3], polygon[0], amount),
      waterPointBetween(polygon[2], polygon[1], amount),
      polygon[2],
      polygon[3],
    ];
  }
  if (side === "left") {
    return [
      polygon[0],
      waterPointBetween(polygon[0], polygon[1], amount),
      waterPointBetween(polygon[3], polygon[2], amount),
      polygon[3],
    ];
  }
  if (side === "right") {
    return [
      waterPointBetween(polygon[1], polygon[0], amount),
      polygon[1],
      polygon[2],
      waterPointBetween(polygon[2], polygon[3], amount),
    ];
  }
  return [
    polygon[0],
    polygon[1],
    waterPointBetween(polygon[1], polygon[2], amount),
    waterPointBetween(polygon[0], polygon[3], amount),
  ];
}

function waterCrestSegment(polygon, side, progress) {
  const amount = clamp(progress, 0, 1);
  if (side === "bottom") {
    return [
      waterPointBetween(polygon[3], polygon[0], amount),
      waterPointBetween(polygon[2], polygon[1], amount),
    ];
  }
  if (side === "left") {
    return [
      waterPointBetween(polygon[0], polygon[1], amount),
      waterPointBetween(polygon[3], polygon[2], amount),
    ];
  }
  if (side === "right") {
    return [
      waterPointBetween(polygon[1], polygon[0], amount),
      waterPointBetween(polygon[2], polygon[3], amount),
    ];
  }
  return [
    waterPointBetween(polygon[0], polygon[3], amount),
    waterPointBetween(polygon[1], polygon[2], amount),
  ];
}

function drawWaterSurfaceDetails(ctx, polygon, cell, phase) {
  const center = waterCellCenter(polygon);
  const cellWidth = distance(polygon[0], polygon[1]);
  const cellHeight = (distance(polygon[0], polygon[3]) + distance(polygon[1], polygon[2])) / 2;
  const seed = cell.row * 2.31 + cell.col * 3.73;

  for (let index = 0; index < 3; index += 1) {
    const motion = phase * (0.56 + index * 0.08) + seed + index * 1.9;
    const x = center.x + Math.sin(motion) * cellWidth * (0.14 + index * 0.025);
    const y = center.y + Math.cos(motion * 0.72) * cellHeight * (0.12 + index * 0.02);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.sin(motion * 0.55) * 0.35);
    ctx.fillStyle = `rgba(216, 251, 249, ${0.11 + index * 0.025})`;
    ctx.beginPath();
    ctx.ellipse(0, 0, cellWidth * (0.15 - index * 0.018), cellHeight * 0.045, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const glint = ctx.createRadialGradient(
    center.x - cellWidth * 0.16,
    center.y - cellHeight * 0.18,
    0,
    center.x - cellWidth * 0.16,
    center.y - cellHeight * 0.18,
    cellWidth * 0.48,
  );
  glint.addColorStop(0, "rgba(231, 255, 252, 0.22)");
  glint.addColorStop(1, "rgba(231, 255, 252, 0)");
  ctx.fillStyle = glint;
  ctx.fillRect(
    center.x - cellWidth * 0.65,
    center.y - cellHeight * 0.65,
    cellWidth * 1.3,
    cellHeight * 1.3,
  );
}

function drawWaterCell(ctx, corners, cell, options = {}) {
  const progress = clamp(options.progress ?? 1, 0, 1);
  if (progress <= 0.001) return;
  const polygon = cellPolygon(options.visualCell ?? cell, corners);
  const side = waterFlowSide(cell, options.source);
  const fillPolygon = progress >= 0.999 ? polygon : waterFillPolygon(polygon, side, progress);
  const bounds = polygon.reduce(
    (result, point) => ({
      left: Math.min(result.left, point.x),
      right: Math.max(result.right, point.x),
      top: Math.min(result.top, point.y),
      bottom: Math.max(result.bottom, point.y),
    }),
    { left: Infinity, right: -Infinity, top: Infinity, bottom: -Infinity },
  );
  const surface = ctx.createLinearGradient(corners.tl.x, corners.tl.y, corners.bl.x, corners.bl.y);
  surface.addColorStop(0, "rgba(121, 229, 235, 0.82)");
  surface.addColorStop(0.46, "rgba(54, 184, 210, 0.88)");
  surface.addColorStop(1, "rgba(25, 119, 169, 0.94)");

  ctx.save();
  tracePolygon(ctx, fillPolygon);
  ctx.clip();
  ctx.fillStyle = surface;
  ctx.fillRect(bounds.left - 2, bounds.top - 2, bounds.right - bounds.left + 4, bounds.bottom - bounds.top + 4);
  drawWaterSurfaceDetails(ctx, polygon, cell, options.phase ?? 0);
  ctx.restore();

  if (progress < 0.985) {
    const [from, to] = waterCrestSegment(polygon, side, progress);
    const crestWidth = distance(polygon[0], polygon[1]);
    const crestPhase = Math.sin((options.phase ?? 0) * 7 + cell.row * 1.7 + cell.col * 2.1);
    const midpoint = waterPointBetween(from, to, 0.5);
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.max(1, Math.hypot(dx, dy));
    const normal = { x: -dy / length, y: dx / length };
    ctx.save();
    ctx.strokeStyle = "rgba(232, 255, 252, 0.88)";
    ctx.lineWidth = Math.max(1.4, crestWidth * 0.045);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.quadraticCurveTo(
      midpoint.x + normal.x * crestWidth * 0.06 * crestPhase,
      midpoint.y + normal.y * crestWidth * 0.06 * crestPhase,
      to.x,
      to.y,
    );
    ctx.stroke();
    for (let index = 0; index < 4; index += 1) {
      const amount = (index + 0.5) / 4;
      const bubble = waterPointBetween(from, to, amount);
      const radius = crestWidth * (0.024 + 0.01 * Math.sin(index + (options.phase ?? 0) * 5));
      ctx.fillStyle = "rgba(242, 255, 252, 0.78)";
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, Math.max(1, radius), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

function waterFrontierDirections(cell, wetKeys) {
  const mazeCell = maze[cell.row]?.[cell.col];
  if (!mazeCell) return [];
  return DIRS.filter((direction) => {
    if (mazeCell.walls[direction.wall]) return false;
    const next = { row: cell.row + direction.row, col: cell.col + direction.col };
    return isInside(next.row, next.col) && !wetKeys.has(keyOf(next)) && !rockAt(next);
  });
}

function waterPolygonEdge(polygon, directionKey) {
  if (directionKey === "right") return [polygon[1], polygon[2]];
  if (directionKey === "down") return [polygon[3], polygon[2]];
  if (directionKey === "left") return [polygon[0], polygon[3]];
  return [polygon[0], polygon[1]];
}

function drawWaterFrontier(ctx, corners, cell, direction, phase) {
  const polygon = cellPolygon(cell, corners);
  const [from, to] = waterPolygonEdge(polygon, direction.key);
  const edgeLength = distance(from, to);
  ctx.save();
  ctx.strokeStyle = "rgba(220, 252, 248, 0.72)";
  ctx.lineWidth = Math.max(1, edgeLength * 0.035);
  ctx.lineCap = "round";
  ctx.setLineDash([edgeLength * 0.16, edgeLength * 0.11]);
  ctx.lineDashOffset = -(phase * edgeLength * 0.16 + cell.row * 3 + cell.col * 5);
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function drawWaterWarningCell(ctx, corners, cell, strength = 1, phase = 0) {
  const polygon = cellPolygon(cell, corners);
  const center = waterCellCenter(polygon);
  const source = waterSourceForCell(cell);
  const sourcePolygon = source ? cellPolygon(source, corners) : polygon;
  const sourceCenter = waterCellCenter(sourcePolygon);
  const entry = waterPointBetween(sourceCenter, center, 0.58);
  const cellWidth = distance(polygon[0], polygon[1]);
  const pulse = 0.5 + Math.sin(phase * 3.2 + cell.row * 0.8 + cell.col) * 0.5;
  const glow = ctx.createRadialGradient(entry.x, entry.y, 0, entry.x, entry.y, cellWidth * (0.55 + pulse * 0.08));
  glow.addColorStop(0, `rgba(80, 196, 219, ${0.18 + strength * 0.16})`);
  glow.addColorStop(0.55, `rgba(97, 207, 224, ${0.08 + strength * 0.08})`);
  glow.addColorStop(1, "rgba(97, 207, 224, 0)");

  ctx.save();
  tracePolygon(ctx, polygon);
  ctx.clip();
  ctx.fillStyle = glow;
  ctx.fillRect(
    center.x - cellWidth * 0.75,
    center.y - cellWidth * 0.75,
    cellWidth * 1.5,
    cellWidth * 1.5,
  );
  for (let index = 0; index < 3; index += 1) {
    const travel = (phase * 0.42 + index * 0.3) % 1;
    const droplet = waterPointBetween(entry, center, 0.12 + travel * 0.72);
    ctx.fillStyle = `rgba(195, 244, 245, ${0.16 + strength * 0.22 * (1 - travel)})`;
    ctx.beginPath();
    ctx.ellipse(
      droplet.x,
      droplet.y,
      Math.max(1.2, cellWidth * 0.035),
      Math.max(0.8, cellWidth * 0.018),
      Math.atan2(center.y - entry.y, center.x - entry.x),
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
  ctx.restore();
}

function drawWater(ctx, corners) {
  if (!waterIsActive()) return;
  const phase = waterVisualTime / 1000;
  const pending = activeWaterAdvanceVisual();
  const fillProgress = pending ? smoothStep(clamp(pending.progress * 1.08, 0, 1)) : 0;
  const visualWetKeys = new Set(floodedWaterKeys);

  for (const floodedKey of floodedWaterKeys) {
    const cell = cellFromKey(floodedKey);
    drawWaterCell(ctx, corners, cell, {
      phase,
      source: waterSourceForCell(cell),
      visualCell: rotatingVisualCell("water", floodedKey, cell),
    });
  }

  if (pending) {
    for (const pendingKey of pending.advance.newKeys) {
      if (floodedWaterKeys.has(pendingKey)) continue;
      const cell = cellFromKey(pendingKey);
      drawWaterCell(ctx, corners, cell, {
        progress: fillProgress,
        phase,
        source: waterSourceForCell(cell),
      });
      if (fillProgress > 0.58) visualWetKeys.add(pendingKey);
    }
  }

  for (const wetKey of visualWetKeys) {
    const cell = cellFromKey(wetKey);
    for (const direction of waterFrontierDirections(cell, visualWetKeys)) {
      drawWaterFrontier(ctx, corners, cell, direction, phase);
    }
  }

  if (pending) return;
  const warningStrength = floodedWaterKeys.size
    ? 0.68
    : clamp((waterMoveCount + 1) / WATER_PREPARATION_MOVES, 0.3, 1);
  for (const warningKey of waterWarningKeys()) {
    drawWaterWarningCell(ctx, corners, cellFromKey(warningKey), warningStrength, phase);
  }
}

function drawRotatingTileArrow(ctx, center, destination, size, opacity = 1) {
  const dx = destination.x - center.x;
  const dy = destination.y - center.y;
  const length = Math.max(1, Math.hypot(dx, dy));
  const ux = dx / length;
  const uy = dy / length;
  const start = { x: center.x - ux * size * 0.13, y: center.y - uy * size * 0.13 };
  const end = { x: center.x + ux * size * 0.17, y: center.y + uy * size * 0.17 };
  const normal = { x: -uy, y: ux };
  const headBack = { x: end.x - ux * size * 0.12, y: end.y - uy * size * 0.12 };
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.strokeStyle = "rgba(72, 111, 101, 0.9)";
  ctx.lineWidth = Math.max(1.4, size * 0.035);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.moveTo(end.x, end.y);
  ctx.lineTo(headBack.x + normal.x * size * 0.075, headBack.y + normal.y * size * 0.075);
  ctx.moveTo(end.x, end.y);
  ctx.lineTo(headBack.x - normal.x * size * 0.075, headBack.y - normal.y * size * 0.075);
  ctx.stroke();
  ctx.restore();
}

function drawRotatingTileMarkers(ctx, corners, width) {
  if (!rotatingCircuits.length) return;
  const animationAmount = rotatingTilesAnimation
    ? smoothStep(rotatingTilesAnimation.progress)
    : 0;
  for (const circuit of rotatingCircuits) {
    const direction = circuit.direction ?? 1;
    for (let index = 0; index < circuit.cells.length; index += 1) {
      const source = circuit.cells[index];
      const destinationIndex = (index + direction + circuit.cells.length) % circuit.cells.length;
      const destination = circuit.cells[destinationIndex];
      const visualCell = rotatingTilesAnimation
        ? {
            row: source.row + (destination.row - source.row) * animationAmount,
            col: source.col + (destination.col - source.col) * animationAmount,
          }
        : source;
      const polygon = insetCellPolygon(cellPolygon(visualCell, corners), 0.11);
      const center = project(
        corners,
        (visualCell.col + 0.5) / COLS,
        (visualCell.row + 0.5) / ROWS,
      );
      const nextCenter = project(
        corners,
        (destination.col + 0.5) / COLS,
        (destination.row + 0.5) / ROWS,
      );
      const size = Math.min(
        distance(polygon[0], polygon[1]),
        (distance(polygon[0], polygon[3]) + distance(polygon[1], polygon[2])) / 2,
      );
      ctx.save();
      ctx.fillStyle = "rgba(173, 196, 181, 0.22)";
      ctx.strokeStyle = "rgba(91, 125, 111, 0.58)";
      ctx.lineWidth = Math.max(1, width * 0.0018);
      tracePolygon(ctx, polygon);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      drawRotatingTileArrow(ctx, center, nextCenter, size);
    }
  }
}

function drawTunnels(ctx, corners) {
  const available = activeTunnels();
  if (!available.length) return;
  const activeAnimation = tunnelAnimation ?? tunnelTutorial;

  for (const tunnel of available) {
    const visualTunnel = rotatingVisualCell("tunnel", tunnel.id, tunnel);
    const polygon = cellPolygon(visualTunnel, corners);
    const center = project(
      corners,
      (visualTunnel.col + 0.5) / COLS,
      (visualTunnel.row + 0.5) / ROWS,
    );
    const cellWidth = distance(polygon[0], polygon[1]);
    const cellHeight = (distance(polygon[0], polygon[3]) + distance(polygon[1], polygon[2])) / 2;
    const isEntry = activeAnimation && keyOf(tunnel) === keyOf(activeAnimation.from);
    const isDestination = activeAnimation && keyOf(tunnel) === keyOf(activeAnimation.to);
    const pulse = activeAnimation
      ? 1 + Math.sin(activeAnimation.progress * Math.PI * 10 + tunnel.row) * 0.045
      : 1;
    const closing = tunnelClosingProgress(tunnel, activeAnimation);
    const size = Math.min(cellWidth, cellHeight) * 0.86 * pulse * (1 - closing * 0.72);

    ctx.save();
    tracePolygon(ctx, polygon);
    ctx.clip();
    ctx.globalAlpha = 1 - closing * 0.82;
    if (tunnelSprite.complete && tunnelSprite.naturalWidth) {
      ctx.shadowColor = "rgba(54, 31, 17, 0.38)";
      ctx.shadowBlur = size * 0.14;
      ctx.shadowOffsetY = size * 0.08;
      ctx.drawImage(
        tunnelSprite,
        center.x - size / 2,
        center.y - size * 0.5,
        size,
        size,
      );
    } else {
      const gradient = ctx.createRadialGradient(
        center.x,
        center.y,
        size * 0.05,
        center.x,
        center.y,
        size * 0.48,
      );
      gradient.addColorStop(0, "#17100d");
      gradient.addColorStop(0.55, "#3e2519");
      gradient.addColorStop(1, "#a55f35");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(center.x, center.y, size * 0.47, size * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    if ((isEntry || isDestination) && activeAnimation) {
      ctx.save();
      ctx.globalAlpha = 0.32 + Math.abs(Math.sin(activeAnimation.progress * Math.PI * 8)) * 0.38;
      ctx.strokeStyle = "rgba(232, 155, 86, 0.95)";
      ctx.lineWidth = Math.max(1.5, size * 0.045);
      ctx.beginPath();
      ctx.ellipse(center.x, center.y, size * 0.46, size * 0.39, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }
}

function tunnelSequenceTimings(animation) {
  return animation?.kind === "tutorial"
    ? {
        entryStart: 0.26,
        entryEnd: 0.46,
        exitStart: 0.54,
        exitEnd: 0.76,
        collapseStart: 0.76,
        collapseEnd: 0.96,
      }
    : {
        entryStart: 0,
        entryEnd: 0.3,
        exitStart: 0.42,
        exitEnd: 0.72,
        collapseStart: 0.72,
        collapseEnd: 1,
      };
}

function tunnelClosingProgress(tunnel, animation = tunnelAnimation ?? tunnelTutorial) {
  if (!animation || keyOf(tunnel) !== keyOf(animation.to)) return 0;
  const timings = tunnelSequenceTimings(animation);
  return smoothStep(
    clamp(
      (animation.progress - timings.collapseStart) /
        (timings.collapseEnd - timings.collapseStart),
      0,
      1,
    ),
  );
}

function tunnelDrawGeometry(tunnel, corners) {
  const polygon = cellPolygon(tunnel, corners);
  const center = project(
    corners,
    (tunnel.col + 0.5) / COLS,
    (tunnel.row + 0.5) / ROWS,
  );
  const width = distance(polygon[0], polygon[1]);
  const height = (distance(polygon[0], polygon[3]) + distance(polygon[1], polygon[2])) / 2;
  return { center, size: Math.min(width, height) * 0.86 };
}

function drawTunnelForegroundEffects(ctx, corners) {
  const animation = tunnelAnimation ?? tunnelTutorial;
  if (!animation) return;
  const tunnelsInSequence = activeTunnels().filter(
    (tunnel) => keyOf(tunnel) === keyOf(animation.from) || keyOf(tunnel) === keyOf(animation.to),
  );

  for (const tunnel of tunnelsInSequence) {
    const { center, size: baseSize } = tunnelDrawGeometry(tunnel, corners);
    const closing = tunnelClosingProgress(tunnel, animation);
    const size = baseSize * (1 - closing * 0.72);
    const alpha = 1 - closing * 0.82;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.lineCap = "round";
    ctx.shadowColor = "rgba(44, 23, 13, 0.34)";
    ctx.shadowBlur = size * 0.08;
    ctx.strokeStyle = "rgba(105, 55, 31, 0.96)";
    ctx.lineWidth = Math.max(1.4, size * 0.115);
    ctx.beginPath();
    ctx.ellipse(center.x, center.y, size * 0.43, size * 0.355, 0, 0.04, Math.PI - 0.04);
    ctx.stroke();
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = "rgba(196, 115, 68, 0.92)";
    ctx.lineWidth = Math.max(0.8, size * 0.038);
    ctx.beginPath();
    ctx.ellipse(
      center.x,
      center.y - size * 0.018,
      size * 0.42,
      size * 0.34,
      0,
      0.08,
      Math.PI - 0.08,
    );
    ctx.stroke();
    ctx.restore();

    if (closing <= 0) continue;
    ctx.save();
    ctx.globalAlpha = Math.sin(closing * Math.PI) * 0.94;
    for (let index = 0; index < 10; index += 1) {
      const angle = (Math.PI * 2 * index) / 10 + 0.18;
      const radius = baseSize * (0.4 - closing * 0.31);
      const pebble = baseSize * (0.055 + (index % 3) * 0.012) * (1 - closing * 0.42);
      const x = center.x + Math.cos(angle) * radius;
      const y = center.y + Math.sin(angle) * radius * 0.8;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle + closing * 1.8);
      ctx.fillStyle = index % 2 ? "#8f4e2c" : "#b66a3d";
      ctx.beginPath();
      ctx.ellipse(0, 0, pebble, pebble * 0.62, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }
}

function drawShapedBoardBase(ctx, inner, width, depth) {
  const cells = [];
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      if (!isInside(row, col)) continue;
      cells.push(cellPolygon({ row, col }, inner));
    }
  }

  ctx.save();
  ctx.filter = "blur(14px)";
  ctx.fillStyle = "rgba(43, 54, 46, 0.22)";
  for (const polygon of cells) {
    tracePolygon(ctx, polygon.map((point) => offsetPoint(point, depth + 10)));
    ctx.fill();
  }
  ctx.restore();

  ctx.fillStyle = "#627064";
  for (const polygon of cells) {
    tracePolygon(ctx, polygon.map((point) => offsetPoint(point, depth * 0.72)));
    ctx.fill();
  }
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
  const catchableKeys = new Set(getFishingCatchTargets().map(keyOf));
  const targets = getFishingTargets().map((target) => ({
    target,
    polygon: cellPolygon(target, corners),
  }));

  ctx.save();
  ctx.shadowColor = "rgba(221, 58, 52, 0.9)";
  ctx.shadowBlur = 16;
  for (const { target, polygon } of targets) {
    const isCatchable = catchableKeys.has(keyOf(target));
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

function collectWallSegments(grid = maze, excludedUnitKeys = null) {
  const segments = [];

  for (let y = 1; y < ROWS; y += 1) {
    let start = null;
    for (let x = 0; x < COLS; x += 1) {
      const unitKey = segmentKey({ orientation: "horizontal", line: y, start: x });
      const hasWall =
        isInside(y, x) &&
        isInside(y - 1, x) &&
        grid[y][x].walls.top &&
        !excludedUnitKeys?.has(unitKey);
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
      const unitKey = segmentKey({ orientation: "vertical", line: x, start: y });
      const hasWall =
        isInside(y, x) &&
        isInside(y, x - 1) &&
        grid[y][x].walls.left &&
        !excludedUnitKeys?.has(unitKey);
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

function collectExteriorSegments() {
  const segments = [];
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      if (!isInside(row, col)) continue;
      if (!isInside(row - 1, col)) segments.push({ orientation: "horizontal", line: row, start: col, length: 1 });
      if (!isInside(row + 1, col)) segments.push({ orientation: "horizontal", line: row + 1, start: col, length: 1 });
      if (!isInside(row, col - 1)) segments.push({ orientation: "vertical", line: col, start: row, length: 1 });
      if (!isInside(row, col + 1)) segments.push({ orientation: "vertical", line: col + 1, start: row, length: 1 });
    }
  }
  return mergeCollinearSegments(segments);
}

function mergeCollinearSegments(segments) {
  const merged = [];
  const groups = new Map();
  for (const segment of segments) {
    const key = `${segment.orientation}:${segment.line}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(segment);
  }
  for (const group of groups.values()) {
    group.sort((first, second) => first.start - second.start);
    for (const segment of group) {
      const previous = merged[merged.length - 1];
      if (
        previous &&
        previous.orientation === segment.orientation &&
        previous.line === segment.line &&
        previous.start + previous.length === segment.start
      ) {
        previous.length += segment.length;
      } else {
        merged.push({ ...segment });
      }
    }
  }
  return merged;
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

function hammerRockSegment(row, col, directionKey) {
  return directionKey === "top" || directionKey === "bottom"
    ? { orientation: "horizontal", line: row + 0.5, start: col + 0.18, length: 0.64 }
    : { orientation: "vertical", line: col + 0.5, start: row + 0.18, length: 0.64 };
}

function getHammerTargets() {
  if (!maze.length) return [];
  const current = maze[mouse.row]?.[mouse.col];
  if (!current) return [];

  return DIRS.flatMap((dir) => {
    const nextRow = mouse.row + dir.row;
    const nextCol = mouse.col + dir.col;
    if (!isInside(nextRow, nextCol)) return [];
    const rock = rockAt({ row: nextRow, col: nextCol });
    if (rock && !current.walls[dir.wall]) {
      return [{
        kind: "rock",
        rockId: rock.id,
        dir,
        nextRow,
        nextCol,
        segment: hammerRockSegment(nextRow, nextCol, dir.wall),
      }];
    }
    const bottle = milkBottleAt({ row: nextRow, col: nextCol });
    if (
      bottle?.knocked &&
      bottle.spill &&
      !bottle.glassDestroyed &&
      !current.walls[dir.wall]
    ) {
      return [{
        kind: "bottle",
        bottleId: bottle.id,
        dir,
        nextRow,
        nextCol,
        segment: hammerSegmentForDirection(dir.wall),
      }];
    }
    if (!current.walls[dir.wall]) return [];
    return [
      {
        kind: "wall",
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
      const candidate = { row, col };
      if (
        moveDistance > 0 &&
        moveDistance <= 2 &&
        isInside(row, col) &&
        !rockAt(candidate) &&
        !milkBottleAt(candidate) &&
        !waterCellIsFlooded(candidate)
      ) {
        const quarter = pieQuarterAt(candidate);
        if (quarter && !eatenPieQuarterIds.has(quarter.id)) {
          const landing = rocketPieLandingForQuarter(quarter);
          if (landing) {
            targets.push({
              ...candidate,
              kind: "pie",
              pieQuarterId: quarter.id,
              mouseDestination: landing,
            });
          }
        } else if (!quarter) {
          targets.push({ ...candidate, kind: "cell" });
        }
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

function fishingMouseDestinationIsClear(cell, movingBottleId, bottleDestination) {
  if (!isInside(cell.row, cell.col)) return false;
  if (cockroachHardObstacleAt(cell, movingBottleId, bottleDestination)) return false;
  if (milkPuddleAt(cell)) return false;
  if (remainingCheeseTargets().some((target) => keyOf(target) === keyOf(cell))) return false;
  return true;
}

function fishingBottleMouseDestination(bottle) {
  if (!bottle || bottle.knocked || collectedMilkIds.has(bottle.id)) return null;
  const bottleDestination = { ...mouse };
  const currentCell = maze[mouse.row]?.[mouse.col];
  if (!currentCell) return null;
  const options = neighbors(maze, currentCell)
    .map(({ row, col }) => ({ row, col }))
    .filter((candidate) =>
      fishingMouseDestinationIsClear(candidate, bottle.id, bottleDestination) &&
      relocatedBottleRemainsUsable(bottle.id, bottleDestination, candidate),
    );
  if (!options.length) return null;

  options.sort((first, second) => {
    const firstRoute = currentObjectiveRoute(maze, first);
    const secondRoute = currentObjectiveRoute(maze, second);
    const firstDistance = firstRoute?.path?.length ?? Number.POSITIVE_INFINITY;
    const secondDistance = secondRoute?.path?.length ?? Number.POSITIVE_INFINITY;
    return firstDistance - secondDistance;
  });
  return { ...options[0] };
}

function getFishingCatchTargets() {
  const targetKeys = new Set(getFishingTargets().map(keyOf));
  const targets = [];

  for (const cheese of remainingCheeseTargets()) {
    if (!targetKeys.has(keyOf(cheese)) || !isCheeseVisible(cheese)) continue;
    targets.push({
      ...cheese,
      kind: "cheese",
      targetId: cheeseIdentity(cheese),
    });
  }

  for (const bottle of milkBottles) {
    if (!targetKeys.has(keyOf(bottle)) || bottle.knocked || collectedMilkIds.has(bottle.id)) {
      continue;
    }
    const mouseDestination = fishingBottleMouseDestination(bottle);
    if (!mouseDestination) continue;
    targets.push({
      row: bottle.row,
      col: bottle.col,
      kind: "milk",
      bottleId: bottle.id,
      mouseDestination,
    });
  }

  for (const quarter of remainingPieQuarters()) {
    if (!targetKeys.has(keyOf(quarter))) continue;
    targets.push({
      row: quarter.row,
      col: quarter.col,
      kind: "pie",
      pieQuarterId: quarter.id,
    });
  }

  return targets;
}

function getFishingCatchTarget() {
  return getFishingCatchTargets()[0] ?? null;
}

function rocketPieLandingForQuarter(quarter) {
  const landing = quarter?.approach ? { ...quarter.approach } : null;
  if (!landing || !isInside(landing.row, landing.col)) return null;
  if (
    rockAt(landing) ||
    milkBottleAt(landing) ||
    milkPuddleAt(landing) ||
    pieQuarterAt(landing) ||
    waterCellIsFlooded(landing) ||
    remainingCheeseTargets().some((target) => keyOf(target) === keyOf(landing)) ||
    (car && keyOf(car) === keyOf(landing))
  ) {
    return null;
  }
  return landing;
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
  return (
    getFishingCatchTargets().find((target) =>
      pointInPolygon(point, cellPolygon(target, mazeLayout.corners)),
    ) ?? null
  );
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
    if (crystalTutorialActive) {
      finishCrystalTutorial();
      return;
    }
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
    if (tornadoTutorialActive) {
      finishTornadoTutorial();
      return;
    }
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

function clonePieForTornado(candidatePie) {
  if (!candidatePie) return null;
  return {
    ...candidatePie,
    quarters: candidatePie.quarters.map((quarter, index) => ({
      ...quarter,
      id: pie?.quarters?.[index]?.id ?? quarter.id,
      approach: { ...quarter.approach },
    })),
  };
}

function tornadoOpenPlacementCells(grid, occupiedKeys) {
  const candidates = [];
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const cell = grid[row]?.[col];
      if (!cell?.active || occupiedKeys.has(`${row},${col}`)) continue;
      if (!findShortestPathFrom(grid, mouse, { row, col }).length) continue;
      candidates.push({ row, col });
    }
  }
  for (let index = candidates.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(randomUnit() * (index + 1));
    [candidates[index], candidates[swapIndex]] = [candidates[swapIndex], candidates[index]];
  }
  return candidates;
}

function applyTornadoEntityLayout(candidate) {
  const nextCheeses = candidate.cheeseTargets ?? [];
  cheeseTargets = cheeseTargets.map((target, index) => ({
    ...target,
    ...(nextCheeses[index] ?? target),
    id: target.id,
  }));

  const nextPie = clonePieForTornado(candidate.pie);
  if (pie && nextPie) pie = nextPie;

  rockPositions = rockPositions.map((rock, index) => ({
    ...rock,
    ...(candidate.rocks?.[index] ?? rock),
    id: rock.id,
  }));

  const occupiedKeys = new Set([
    keyOf(mouse),
    ...tornadoFixedCellKeys(),
    ...cheeseTargets.filter((target) => !cheeseWasCollected(target)).map(keyOf),
    ...rockPositions.map(keyOf),
    ...pieFootprintCells(pie).map(keyOf),
  ]);
  milkBottles = milkBottles.map((bottle, index) => {
    const destination = candidate.milkBottles?.[index] ?? bottle;
    occupiedKeys.add(keyOf(destination));
    return {
      ...bottle,
      row: destination.row,
      col: destination.col,
      spill: bottle.spill ? { ...bottle.spill } : null,
    };
  });

  // Fallen glass and its puddle are separate tornado cargo. This intentionally
  // allows the new layout to create a useful strategic separation.
  const spillCells = tornadoOpenPlacementCells(candidate.grid, occupiedKeys);
  for (const bottle of milkBottles) {
    if (!bottle.spill || collectedMilkIds.has(bottle.id)) continue;
    const spill = spillCells.shift();
    if (!spill) continue;
    bottle.spill = { ...spill };
    occupiedKeys.add(keyOf(spill));
  }

  hiddenCheeseKeys = new Set(candidate.hiddenCheeseKeys ?? []);
}

function useTornadoPower() {
  if (tornadoWallAnimation || !tornadoTargeting || !tornadoAvailable || !tornadoCandidate) return;
  if (!consumePower("tornado")) return;
  const previousGrid = maze;
  const nextGrid = tornadoCandidate.grid;
  maze = tornadoCandidate.grid;
  applyTornadoEntityLayout(tornadoCandidate);
  hingedWalls = tornadoCandidate.hingedWalls.map((wall) => ({
    ...wall,
    source: { ...wall.source },
    destination: { ...wall.destination },
    hinge: { ...wall.hinge },
    activated: false,
    destroyed: false,
    moving: false,
  }));
  applyRotatingCircuitWalls();
  clearCloudRun();
  restartWaterAfterTornado();
  activeVariantIndex = tornadoCandidate.variantIndex;
  shortestPath = currentObjectiveRoute()?.path ?? [];
  syncActiveExit();
  tornadoCandidate = null;
  powerPointerStart = null;
  startTornadoWallAnimation(previousGrid, nextGrid);
}

function finishPowerObjectiveResolution(message) {
  render();
  if (allObjectivesComplete()) {
    winLevel();
    return;
  }
  if (movesLeft <= 0) {
    startMouseDefeatAnimation();
    return;
  }
  if (maybeStartCockroach()) return;
  setMovementControlsEnabled(true);
  setPowerControlsEnabled(true);
  setMessage(message);
  saveCampaignState();
}

function finishFishingCatchAnimation() {
  if (!fishingCatchAnimating) return;
  const caughtTarget = activeFishingCatchTarget
    ? {
        ...activeFishingCatchTarget,
        mouseDestination: activeFishingCatchTarget.mouseDestination
          ? { ...activeFishingCatchTarget.mouseDestination }
          : null,
      }
    : null;
  fishingCatchAnimating = false;
  fishingCatchProgress = 0;
  fishingCatchStartedAt = null;
  fishingCatchFrame = null;
  if (!caughtTarget) {
    activeFishingCatchTarget = null;
    setMovementControlsEnabled(true);
    setPowerControlsEnabled(true);
    render();
    return;
  }

  if (caughtTarget.kind === "cheese") {
    const targetIndex = cheeseTargets.findIndex(
      (target) => cheeseIdentity(target) === caughtTarget.targetId,
    );
    if (targetIndex >= 0) cheeseTargets[targetIndex] = { ...cheeseTargets[targetIndex], ...mouse };
  } else if (caughtTarget.kind === "milk") {
    const bottle = milkBottles.find((candidate) => candidate.id === caughtTarget.bottleId);
    const bottleDestination = { ...mouse };
    if (bottle && caughtTarget.mouseDestination) {
      bottle.row = bottleDestination.row;
      bottle.col = bottleDestination.col;
      mouse = { ...caughtTarget.mouseDestination };
      const pushedDirection = DIRS.find(
        (direction) =>
          bottleDestination.row + direction.row === mouse.row &&
          bottleDestination.col + direction.col === mouse.col,
      );
      if (pushedDirection) mouseFacingDirection = pushedDirection.key;
    }
  } else if (caughtTarget.kind === "pie") {
    eatenPieQuarterIds.add(caughtTarget.pieQuarterId);
  }
  activeFishingCatchTarget = null;
  syncActiveExit();
  setMessage("Fishing rod is changing back...");
  requestMazeDraw();
  startPowerTransformation("fishing", "out", () => {
    if (caughtTarget.kind === "cheese") {
      startCheeseEatingAnimation(cheeseAt(mouse));
      return;
    }
    finishPowerObjectiveResolution(
      caughtTarget.kind === "milk"
        ? "Bottle retrieved. The mouse made room and the milk can still be spilled."
        : remainingPieQuarters().length
          ? `${remainingPieQuarters().length} pie quarter${remainingPieQuarters().length === 1 ? "" : "s"} remaining.`
          : `${remainingObjectiveCount()} pantry objective${remainingObjectiveCount() === 1 ? "" : "s"} remaining.`,
    );
  });
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
  if (phase === "cast") setMessage("The hook is flying toward the objective...");
  else if (phase === "hook") setMessage("Hooked. The reel is engaging...");
  else if (phase === "reel") setMessage("Reeling the objective back to the mouse...");
  drawMaze();

  if (fishingCatchProgress >= 1) {
    finishFishingCatchAnimation();
    return;
  }

  fishingCatchFrame = requestAnimationFrame(animateFishingCatch);
}

function useFishingPower(target) {
  const catchTarget = getFishingCatchTargets().find(
    (candidate) =>
      candidate.row === target?.row &&
      candidate.col === target?.col &&
      candidate.kind === target?.kind,
  );
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
  const targetKind = hammerWallAnimation.target.kind;
  const targetName = targetKind === "rock"
    ? "Rock"
    : targetKind === "bottle"
      ? "Bottle"
      : "Wall";
  hammerWallAnimation = null;
  hammerWallAnimationFrame = null;
  mazeEl.setAttribute("aria-busy", "false");
  setMessage(`${targetName} broken. Hammer is changing back...`);
  requestMazeDraw();

  startPowerTransformation("hammer", "out", () => {
    setMovementControlsEnabled(true);
    setPowerControlsEnabled(true);
    setMessage(`${targetName} broken. The square is clear.`);
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
      kind: target.kind ?? "wall",
      bottleId: target.bottleId ?? null,
      rockId: target.rockId ?? null,
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
  if (target.kind === "rock") {
    rockPositions = rockPositions.filter((rock) => rock.id !== target.rockId);
  } else if (target.kind === "bottle") {
    const bottle = milkBottles.find((candidate) => candidate.id === target.bottleId);
    if (bottle?.knocked && bottle.spill) bottle.glassDestroyed = true;
  } else {
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
  const target = {
    ...rocketFlightAnimation.to,
    mouseDestination: rocketFlightAnimation.to.mouseDestination
      ? { ...rocketFlightAnimation.to.mouseDestination }
      : null,
  };
  rocketFlightAnimation = null;
  rocketFlightAnimationFrame = null;
  mazeEl.setAttribute("aria-busy", "false");
  if (target.kind === "pie" && target.mouseDestination) {
    mouse = { ...target.mouseDestination };
    eatenPieQuarterIds.add(target.pieQuarterId);
  } else {
    mouse = { row: target.row, col: target.col };
  }
  syncActiveExit();
  setMessage(
    target.kind === "pie"
      ? "Rocket impact ate a pie quarter and pushed the mouse aside..."
      : "Rocket landed and is changing back...",
  );
  startPowerTransformation("rocket", "out", () => {
    if (target.kind === "pie") {
      finishPowerObjectiveResolution(
        remainingPieQuarters().length
          ? `${remainingPieQuarters().length} pie quarter${remainingPieQuarters().length === 1 ? "" : "s"} remaining.`
          : `${remainingObjectiveCount()} pantry objective${remainingObjectiveCount() === 1 ? "" : "s"} remaining.`,
      );
      return;
    }
    const landedTunnel = activeTunnelAt(mouse);
    if (landedTunnel && startTunnelTravel(landedTunnel)) return;
    const landedMilk = milkPuddleAt(mouse);
    if (landedMilk) {
      startMilkDrinkAnimation(landedMilk);
      return;
    }
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
  const excludedUnitKeys = rotatingTilesAnimation
    ? rotatingCircuitWallUnitKeys()
    : null;
  drawInteriorWallSet(
    ctx,
    wallGeometries(collectWallSegments(maze, excludedUnitKeys), corners, width),
  );
  if (rotatingTilesAnimation) drawMovingRotatingWalls(ctx, corners, width);
}

function rotatingCircuitWallUnitKeys() {
  const keys = new Set();
  for (const circuit of rotatingCircuits) {
    for (const cell of circuit.cells) {
      keys.add(segmentKey({ orientation: "horizontal", line: cell.row, start: cell.col }));
      keys.add(segmentKey({ orientation: "horizontal", line: cell.row + 1, start: cell.col }));
      keys.add(segmentKey({ orientation: "vertical", line: cell.col, start: cell.row }));
      keys.add(segmentKey({ orientation: "vertical", line: cell.col + 1, start: cell.row }));
    }
  }
  return keys;
}

function rotatingTileWallSegment(cell, wall) {
  if (wall === "top") {
    return { orientation: "horizontal", line: cell.row, start: cell.col, length: 1 };
  }
  if (wall === "bottom") {
    return { orientation: "horizontal", line: cell.row + 1, start: cell.col, length: 1 };
  }
  if (wall === "left") {
    return { orientation: "vertical", line: cell.col, start: cell.row, length: 1 };
  }
  return { orientation: "vertical", line: cell.col + 1, start: cell.row, length: 1 };
}

function drawMovingRotatingWalls(ctx, corners, width) {
  const amount = smoothStep(rotatingTilesAnimation?.progress ?? 0);
  const segments = [];
  for (const circuit of rotatingCircuits) {
    const direction = circuit.direction ?? 1;
    for (const tile of circuit.tiles) {
      const fromIndex =
        (tile.homeIndex + (circuit.offset ?? 0) + circuit.cells.length) %
        circuit.cells.length;
      const toIndex = (fromIndex + direction + circuit.cells.length) % circuit.cells.length;
      const from = circuit.cells[fromIndex];
      const to = circuit.cells[toIndex];
      const visualCell = {
        row: from.row + (to.row - from.row) * amount,
        col: from.col + (to.col - from.col) * amount,
      };
      for (const wall of Object.keys(tile.walls)) {
        if (tile.walls[wall]) segments.push(rotatingTileWallSegment(visualCell, wall));
      }
    }
  }
  drawInteriorWallSet(ctx, wallGeometries(segments, corners, width));
}

function drawExteriorWalls(ctx, corners, width) {
  const door = shapedIntroDoorState();
  const segments = door
    ? removeUnitFromSegments(collectExteriorSegments(), door.segment)
    : collectExteriorSegments();
  const walls = wallGeometries(segments, corners, width).map((wall) => ({
    ...wall,
    height: wall.height * 1.18,
    lineWidth: wall.lineWidth * 1.15,
  }));
  drawInteriorWallSet(ctx, walls);
  if (door) drawShapedSlidingDoor(ctx, corners, width, door);
}

function shapedIntroDoorState() {
  if (!levelIntro) return null;
  const openAmount = levelIntroStateAt(levelIntro.progress).doorOpen;
  if (openAmount <= 0.001) return null;
  const topEdge = levelIntro.start.row === 0;
  return {
    openAmount,
    segment: {
      orientation: "horizontal",
      line: topEdge ? 0 : ROWS,
      start: levelIntro.start.col,
      length: 1,
    },
    direction: levelIntro.start.col === 0 ? 1 : -1,
  };
}

function removeUnitFromSegments(segments, unit) {
  const pieces = [];
  const unitEnd = unit.start + unit.length;
  for (const segment of segments) {
    if (segment.orientation !== unit.orientation || segment.line !== unit.line) {
      pieces.push(segment);
      continue;
    }
    const segmentEnd = segment.start + segment.length;
    if (unitEnd <= segment.start || unit.start >= segmentEnd) {
      pieces.push(segment);
      continue;
    }
    if (unit.start > segment.start) {
      pieces.push({ ...segment, length: unit.start - segment.start });
    }
    if (unitEnd < segmentEnd) {
      pieces.push({ ...segment, start: unitEnd, length: segmentEnd - unitEnd });
    }
  }
  return pieces;
}

function drawShapedSlidingDoor(ctx, corners, width, door) {
  const wall = segmentGeometry(door.segment, corners, width);
  const slide = distance(wall.p1, wall.p2) * 0.9 * door.openAmount * door.direction;
  const shifted = {
    ...wall,
    p1: { x: wall.p1.x + slide, y: wall.p1.y },
    p2: { x: wall.p2.x + slide, y: wall.p2.y },
    height: wall.height * 1.18,
    lineWidth: wall.lineWidth * 1.15,
  };
  drawInteriorWallSet(ctx, [shifted]);
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

  const tunnelVisual = tunnelMouseVisualState();
  if (tunnelVisual) return tunnelVisual;

  if (mouseMotion) {
    const eased = easeMouseMotion(mouseMotion.progress);
    const rotatingMotion = rotatingEntityMotion("mouse", "mouse");
    const rotationAmount = rotatingTilesAnimation
      ? smoothStep(rotatingTilesAnimation.progress)
      : 0;
    return {
      row:
        mouseMotion.from.row +
        (mouseMotion.to.row - mouseMotion.from.row) * eased +
        (rotatingMotion ? (rotatingMotion.to.row - rotatingMotion.from.row) * rotationAmount : 0),
      col:
        mouseMotion.from.col +
        (mouseMotion.to.col - mouseMotion.from.col) * eased +
        (rotatingMotion ? (rotatingMotion.to.col - rotatingMotion.from.col) * rotationAmount : 0),
      step: Math.sin(Math.PI * mouseMotion.progress),
    };
  }

  if (rotatingTilesAnimation) {
    const visual = rotatingVisualCell("mouse", "mouse", mouse);
    return {
      row: visual.row,
      col: visual.col,
      step: Math.sin(rotatingTilesAnimation.progress * Math.PI) * 0.3,
    };
  }

  return { row: mouse.row, col: mouse.col, step: 0 };
}

function getMouseWalkSprite(direction = mouseFacingDirection) {
  if (direction === "right") return mouseWalkRightSprite;
  if (direction === "up") return mouseWalkUpSprite;
  if (direction === "down") return mouseWalkDownSprite;
  return mouseWalkLeftSprite;
}

function getMouseMilkPushSprite(direction) {
  if (direction === "right") return mouseMilkPushRightSprite;
  if (direction === "up") return mouseMilkPushUpSprite;
  if (direction === "down") return mouseMilkPushDownSprite;
  return mouseMilkPushLeftSprite;
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

function fishingCatchVisualState(corners, target = activeFishingCatchTarget) {
  if (!fishingCatchAnimating || !target) return null;
  const mouseCenter = project(
    corners,
    (mouse.col + 0.5) / COLS,
    (mouse.row + 0.5) / ROWS,
  );
  const targetCenter = project(
    corners,
    (target.col + 0.5) / COLS,
    (target.row + 0.5) / ROWS,
  );
  const cellWidth = distance(
    project(corners, mouse.col / COLS, mouse.row / ROWS),
    project(corners, (mouse.col + 1) / COLS, mouse.row / ROWS),
  );
  return fishingCastVisualStateAt(
    fishingCatchProgress,
    mouseCenter,
    targetCenter,
    cellWidth,
  );
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
  if (!push || push.id !== rock.id) {
    const rotating = rotatingVisualCell("rock", rock.id, rock);
    return { row: rotating.row, col: rotating.col, lift: 0 };
  }
  const eased = easeMouseMotion(mouseMotion.progress);
  const rotatingMotion = rotatingEntityMotion("rock", rock.id);
  const rotationAmount = rotatingTilesAnimation
    ? smoothStep(rotatingTilesAnimation.progress)
    : 0;
  return {
    row:
      push.from.row +
      (push.to.row - push.from.row) * eased +
      (rotatingMotion
        ? (rotatingMotion.to.row - rotatingMotion.from.row) * rotationAmount
        : 0),
    col:
      push.from.col +
      (push.to.col - push.from.col) * eased +
      (rotatingMotion
        ? (rotatingMotion.to.col - rotatingMotion.from.col) * rotationAmount
        : 0),
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

function drawMilkPuddle(
  ctx,
  center,
  cellWidth,
  { opacity = 1, scale = 1, angle = 0, depletion = 0 } = {},
) {
  const visibleScale = scale * (1 - depletion * 0.68);
  ctx.save();
  ctx.globalAlpha = opacity * (1 - depletion);
  ctx.translate(center.x, center.y + cellWidth * 0.12);
  ctx.rotate(angle);
  ctx.scale(visibleScale, visibleScale);
  ctx.shadowColor = "rgba(151, 143, 122, 0.3)";
  ctx.shadowBlur = cellWidth * 0.07;

  const puddleGradient = ctx.createRadialGradient(
    -cellWidth * 0.1,
    -cellWidth * 0.05,
    cellWidth * 0.03,
    0,
    0,
    cellWidth * 0.38,
  );
  puddleGradient.addColorStop(0, "rgba(255, 254, 240, 0.98)");
  puddleGradient.addColorStop(0.62, "rgba(249, 242, 214, 0.96)");
  puddleGradient.addColorStop(1, "rgba(222, 211, 181, 0.9)");
  ctx.fillStyle = puddleGradient;
  ctx.beginPath();
  ctx.moveTo(-cellWidth * 0.36, cellWidth * 0.015);
  ctx.bezierCurveTo(
    -cellWidth * 0.35,
    -cellWidth * 0.12,
    -cellWidth * 0.19,
    -cellWidth * 0.2,
    -cellWidth * 0.075,
    -cellWidth * 0.13,
  );
  ctx.bezierCurveTo(
    cellWidth * 0.055,
    -cellWidth * 0.22,
    cellWidth * 0.31,
    -cellWidth * 0.13,
    cellWidth * 0.35,
    -cellWidth * 0.015,
  );
  ctx.bezierCurveTo(
    cellWidth * 0.4,
    cellWidth * 0.12,
    cellWidth * 0.18,
    cellWidth * 0.2,
    cellWidth * 0.045,
    cellWidth * 0.14,
  );
  ctx.bezierCurveTo(
    -cellWidth * 0.11,
    cellWidth * 0.22,
    -cellWidth * 0.34,
    cellWidth * 0.15,
    -cellWidth * 0.36,
    cellWidth * 0.015,
  );
  ctx.closePath();
  ctx.fill();

  ctx.shadowColor = "transparent";
  ctx.strokeStyle = "rgba(255, 255, 247, 0.78)";
  ctx.lineWidth = Math.max(1, cellWidth * 0.025);
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 255, 250, 0.82)";
  ctx.beginPath();
  ctx.ellipse(
    -cellWidth * 0.11,
    -cellWidth * 0.055,
    cellWidth * 0.12,
    cellWidth * 0.035,
    -0.18,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  ctx.fillStyle = "rgba(247, 239, 210, 0.94)";
  for (const drop of [
    { x: -0.4, y: -0.09, radius: 0.042 },
    { x: 0.41, y: 0.09, radius: 0.035 },
    { x: 0.31, y: -0.17, radius: 0.025 },
  ]) {
    ctx.beginPath();
    ctx.arc(
      cellWidth * drop.x,
      cellWidth * drop.y,
      cellWidth * drop.radius,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
  ctx.restore();
}

function milkKnockStateAt(progress) {
  const approach = smoothStep(progress / 0.28);
  const release = smoothStep((progress - 0.74) / 0.26);
  return {
    mouseContact: approach * (1 - release),
    bottleFall: smoothStep((progress - 0.25) / 0.33),
    streamReach: smoothStep((progress - 0.5) / 0.22),
    streamOpacity:
      smoothStep((progress - 0.47) / 0.1) *
      (1 - smoothStep((progress - 0.8) / 0.13)),
    puddle: smoothStep((progress - 0.55) / 0.34),
  };
}

function milkActionFrameAt(progress) {
  if (progress < 0.18) return 0;
  if (progress < 0.36) return 1;
  if (progress < 0.72) return 2;
  return 3;
}

function milkScreenGeometry(bottle, spill, corners) {
  const center = project(corners, (bottle.col + 0.5) / COLS, (bottle.row + 0.5) / ROWS);
  if (!spill) {
    return {
      center,
      spillCenter: center,
      unit: { x: 0, y: -1 },
      angle: -Math.PI / 2,
    };
  }
  const spillCenter = project(corners, (spill.col + 0.5) / COLS, (spill.row + 0.5) / ROWS);
  const dx = spillCenter.x - center.x;
  const dy = spillCenter.y - center.y;
  const magnitude = Math.hypot(dx, dy) || 1;
  return {
    center,
    spillCenter,
    unit: { x: dx / magnitude, y: dy / magnitude },
    angle: Math.atan2(dy, dx),
  };
}

function drawMilkStream(ctx, start, end, unit, cellWidth, reach, opacity) {
  if (opacity <= 0 || reach <= 0) return;
  const perpendicular = { x: -unit.y, y: unit.x };
  const streamEnd = {
    x: start.x + (end.x - start.x) * reach,
    y: start.y + (end.y - start.y) * reach,
  };
  const bend = Math.sin(reach * Math.PI) * cellWidth * 0.055;
  const control = {
    x: (start.x + streamEnd.x) / 2 + perpendicular.x * bend,
    y: (start.y + streamEnd.y) / 2 + perpendicular.y * bend,
  };

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.lineCap = "round";
  ctx.strokeStyle = "rgba(244, 233, 201, 0.98)";
  ctx.lineWidth = Math.max(2.4, cellWidth * 0.12);
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.quadraticCurveTo(control.x, control.y, streamEnd.x, streamEnd.y);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255, 255, 247, 0.86)";
  ctx.lineWidth = Math.max(1, cellWidth * 0.026);
  ctx.stroke();

  ctx.fillStyle = "rgba(250, 241, 214, 0.98)";
  for (const offset of [0.42, 0.7, 0.9]) {
    if (reach < offset * 0.8) continue;
    const x = start.x + (streamEnd.x - start.x) * offset + perpendicular.x * bend * 0.3;
    const y = start.y + (streamEnd.y - start.y) * offset + perpendicular.y * bend * 0.3;
    ctx.beginPath();
    ctx.arc(x, y, cellWidth * (0.025 + offset * 0.012), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawUprightMilkBottle(ctx, center, cellWidth) {
  if (!milkSpillActionSprite.complete || !milkSpillActionSprite.naturalWidth) return;
  const frameWidth = milkSpillActionSprite.naturalWidth / 4;
  const sourceCellWidth = frameWidth / 2;
  const size = cellWidth * 1.04;
  ctx.save();
  ctx.translate(center.x, center.y + cellWidth * 0.035);
  ctx.shadowColor = "rgba(48, 55, 49, 0.25)";
  ctx.shadowBlur = cellWidth * 0.1;
  ctx.shadowOffsetY = cellWidth * 0.08;
  ctx.drawImage(
    milkSpillActionSprite,
    0,
    0,
    sourceCellWidth,
    milkSpillActionSprite.naturalHeight,
    -size / 2,
    -size / 2,
    size,
    size,
  );
  ctx.restore();
}

function drawContainedMilkBottle(ctx, center, polygon, cellWidth) {
  ctx.save();
  tracePolygon(ctx, insetCellPolygon(polygon));
  ctx.clip();
  drawUprightMilkBottle(ctx, center, cellWidth);
  ctx.restore();
}

function drawVerticalMilkBottlePose(
  ctx,
  center,
  cellWidth,
  direction,
  fall = 1,
  opacity = 1,
) {
  if (!milkSpillActionSprite.complete || !milkSpillActionSprite.naturalWidth) return;
  const amount = clamp(fall, 0, 1);
  const frameWidth = milkSpillActionSprite.naturalWidth / 4;
  const sourceCellWidth = frameWidth / 2;
  const towardViewer = direction === "down";
  const travel = (towardViewer ? 1 : -1) * cellWidth * 0.13 * amount;
  const midpointCompression = Math.sin(amount * Math.PI) * 0.22;
  const finalCompression = towardViewer ? 0.13 : 0.2;
  const scaleY = 1 - midpointCompression - finalCompression * amount;
  const scaleX = 1 + (towardViewer ? 0.09 : -0.035) * amount;
  const size = cellWidth * 1.04;

  const drawPose = (flipY, poseOpacity) => {
    if (poseOpacity <= 0) return;
    ctx.save();
    ctx.globalAlpha = opacity * poseOpacity;
    ctx.translate(center.x, center.y + cellWidth * 0.035 + travel);
    ctx.scale(scaleX, flipY ? -scaleY : scaleY);
    ctx.shadowColor = "rgba(48, 55, 49, 0.23)";
    ctx.shadowBlur = cellWidth * 0.09;
    ctx.shadowOffsetY = cellWidth * (towardViewer ? 0.1 : 0.055);
    ctx.drawImage(
      milkSpillActionSprite,
      0,
      0,
      sourceCellWidth,
      milkSpillActionSprite.naturalHeight,
      -size / 2,
      -size / 2,
      size,
      size,
    );
    ctx.restore();
  };

  if (!towardViewer) {
    drawPose(false, 1);
    return;
  }

  const flipBlend = smoothStep((amount - 0.34) / 0.34);
  drawPose(false, 1 - flipBlend);
  drawPose(true, flipBlend);
}

function drawVerticalMilkAction(
  ctx,
  geometry,
  cellWidth,
  progress,
  direction,
  bottlePolygon,
) {
  const frameIndex = milkActionFrameAt(progress);
  const sprite = direction === "up" ? milkSpillUpSprite : milkSpillDownSprite;
  const midpoint = {
    x: (geometry.center.x + geometry.spillCenter.x) / 2,
    y: (geometry.center.y + geometry.spillCenter.y) / 2,
  };
  const spriteCenter = frameIndex === 0 ? geometry.center : midpoint;
  const spriteSize = cellWidth * (frameIndex === 0 ? 1.18 : 1.72);
  if (drawVerticalMilkSpriteFrame(ctx, sprite, frameIndex, spriteCenter, spriteSize, cellWidth)) {
    return;
  }

  const state = milkKnockStateAt(progress);
  if (progress < 0.03) {
    drawContainedMilkBottle(ctx, geometry.center, bottlePolygon, cellWidth);
    return;
  }

  drawVerticalMilkBottlePose(
    ctx,
    geometry.center,
    cellWidth,
    direction,
    state.bottleFall,
  );

  const mouth = {
    x: geometry.center.x + geometry.unit.x * cellWidth * (0.31 + state.bottleFall * 0.13),
    y: geometry.center.y + geometry.unit.y * cellWidth * (0.31 + state.bottleFall * 0.13),
  };
  const puddleEdge = {
    x: geometry.spillCenter.x - geometry.unit.x * cellWidth * 0.2,
    y: geometry.spillCenter.y - geometry.unit.y * cellWidth * 0.2,
  };
  drawMilkStream(
    ctx,
    mouth,
    puddleEdge,
    geometry.unit,
    cellWidth,
    state.streamReach,
    state.streamOpacity,
  );
  if (state.puddle > 0) {
    drawMilkPuddle(ctx, geometry.spillCenter, cellWidth, {
      opacity: state.puddle,
      scale: state.puddle,
      angle: geometry.angle,
    });
  }
}

function drawVerticalMilkSpriteFrame(ctx, sprite, frameIndex, center, size, cellWidth) {
  const prepared = prepareGreenScreenSprite(sprite);
  if (!prepared) return false;

  const sourceWidth = prepared.width / 2;
  const sourceHeight = prepared.height / 2;
  const column = frameIndex % 2;
  const row = Math.floor(frameIndex / 2);
  ctx.save();
  ctx.translate(center.x, center.y + cellWidth * 0.025);
  ctx.shadowColor = "rgba(48, 55, 49, 0.24)";
  ctx.shadowBlur = cellWidth * 0.08;
  ctx.shadowOffsetY = cellWidth * 0.055;
  ctx.drawImage(
    prepared,
    column * sourceWidth,
    row * sourceHeight,
    sourceWidth,
    sourceHeight,
    -size / 2,
    -size / 2,
    size,
    size,
  );
  ctx.restore();
  return true;
}

function drawMilkActionFrame(
  ctx,
  geometry,
  cellWidth,
  frameIndex,
  direction,
  bottlePolygon,
  progress,
) {
  if (direction === "up" || direction === "down") {
    drawVerticalMilkAction(
      ctx,
      geometry,
      cellWidth,
      progress,
      direction,
      bottlePolygon,
    );
    return;
  }
  if (frameIndex === 0 || !milkSpillActionSprite.complete || !milkSpillActionSprite.naturalWidth) {
    drawContainedMilkBottle(ctx, geometry.center, bottlePolygon, cellWidth);
    return;
  }
  const span = distance(geometry.center, geometry.spillCenter);
  const midpoint = {
    x: (geometry.center.x + geometry.spillCenter.x) / 2,
    y: (geometry.center.y + geometry.spillCenter.y) / 2,
  };
  const frameWidth = milkSpillActionSprite.naturalWidth / 4;
  const height = cellWidth * 1.04;

  ctx.save();
  ctx.translate(midpoint.x, midpoint.y + cellWidth * 0.035);
  if (direction === "left") ctx.scale(-1, 1);
  else ctx.rotate(geometry.angle);
  ctx.shadowColor = "rgba(48, 55, 49, 0.2)";
  ctx.shadowBlur = cellWidth * 0.07;
  ctx.shadowOffsetY = cellWidth * 0.045;
  ctx.drawImage(
    milkSpillActionSprite,
    frameIndex * frameWidth,
    0,
    frameWidth,
    milkSpillActionSprite.naturalHeight,
    -span,
    -height / 2,
    span * 2,
    height,
  );
  ctx.restore();
}

function drawSettledMilkSprite(
  ctx,
  sprite,
  center,
  cellWidth,
  angle,
  direction,
  opacity = 1,
  scale = 1,
) {
  if (!sprite.complete || !sprite.naturalWidth || opacity <= 0 || scale <= 0) return;
  const size = cellWidth * 1.04;
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.translate(center.x, center.y + cellWidth * 0.035);
  if (direction === "left") ctx.scale(-1, 1);
  else ctx.rotate(angle);
  ctx.scale(scale, scale);
  ctx.shadowColor = "rgba(48, 55, 49, 0.2)";
  ctx.shadowBlur = cellWidth * 0.07;
  ctx.shadowOffsetY = cellWidth * 0.045;
  ctx.drawImage(sprite, -size / 2, -size / 2, size, size);
  ctx.restore();
}

function drawMilkBottle(ctx, bottle, corners, cellWidth) {
  const activeKnock = milkKnockAnimation?.bottleId === bottle.id ? milkKnockAnimation : null;
  const direction = activeKnock?.direction ?? bottle.direction;
  const visualBottle = objectivePushVisualCell("milk", bottle.id, bottle);
  const settledSpill = bottle.spill
    ? rotatingVisualCell("milk-spill", bottle.id, bottle.spill)
    : null;
  const spill = activeKnock?.spill ?? settledSpill;
  const geometry = milkScreenGeometry(visualBottle, spill, corners);
  const bottlePolygon = cellPolygon(visualBottle, corners);
  const fishingState =
    activeFishingCatchTarget?.kind === "milk" &&
    activeFishingCatchTarget.bottleId === bottle.id
      ? fishingCatchVisualState(corners, activeFishingCatchTarget)
      : null;
  if (fishingState) {
    drawUprightMilkBottle(ctx, fishingState.cheeseCenter, cellWidth);
    return;
  }
  if (activeKnock) {
    drawMilkActionFrame(
      ctx,
      geometry,
      cellWidth,
      milkActionFrameAt(activeKnock.progress),
      direction,
      bottlePolygon,
      activeKnock.progress,
    );
    return;
  }
  if (!bottle.knocked || !spill) {
    if (bottle.glassDestroyed) return;
    drawContainedMilkBottle(ctx, geometry.center, bottlePolygon, cellWidth);
    return;
  }
  const state = activeKnock
    ? milkKnockStateAt(activeKnock.progress)
    : {
        bottleFall: bottle.knocked ? 1 : 0,
        streamReach: 1,
        streamOpacity: 0,
        puddle: bottle.knocked ? 1 : 0,
      };
  const drinkProgress =
    milkDrinkAnimation?.bottleId === bottle.id ? milkDrinkAnimation.progress : 0;
  const depletion = smoothStep((drinkProgress - 0.14) / 0.68);
  if (!bottle.glassDestroyed) {
    if (direction === "up" || direction === "down") {
      const sprite = direction === "up" ? milkSpillUpSprite : milkSpillDownSprite;
      if (!drawVerticalMilkSpriteFrame(ctx, sprite, 1, geometry.center, cellWidth * 1.16, cellWidth)) {
        drawVerticalMilkBottlePose(ctx, geometry.center, cellWidth, direction, 1);
      }
    } else {
      drawSettledMilkSprite(
        ctx,
        milkSpillBottleSprite,
        geometry.center,
        cellWidth,
        geometry.angle,
        direction,
      );
    }
  }
  if (!collectedMilkIds.has(bottle.id)) {
    drawSettledMilkSprite(
      ctx,
      milkSpillPuddleSprite,
      geometry.spillCenter,
      cellWidth,
      geometry.angle,
      direction,
      1 - depletion,
      1 - depletion * 0.68,
    );
  }
}

function drawMilkBottles(ctx, corners) {
  for (const bottle of milkBottles) {
    if (
      cockroachAnimation?.kind === "milk" &&
      cockroachAnimation.bottleId === bottle.id
    ) {
      continue;
    }
    const cellWidth = distance(
      project(corners, bottle.col / COLS, bottle.row / ROWS),
      project(corners, (bottle.col + 1) / COLS, bottle.row / ROWS),
    );
    drawMilkBottle(ctx, bottle, corners, cellWidth);
  }
}

function drawMilkForegroundWalls(ctx, corners, width) {
  const foregroundLines = new Set();
  for (const bottle of milkBottles) {
    const occupiedCells = [bottle];
    if (bottle.knocked && bottle.spill) occupiedCells.push(bottle.spill);
    if (milkKnockAnimation?.bottleId === bottle.id && milkKnockAnimation.spill) {
      occupiedCells.push(milkKnockAnimation.spill);
    }
    for (const cell of occupiedCells) {
      foregroundLines.add(`${cell.row + 1}:${cell.col}`);
    }
  }

  const segments = collectWallSegments().filter(
    (segment) =>
      segment.orientation === "horizontal" &&
      Array.from(foregroundLines).some((entry) => {
        const [line, col] = entry.split(":").map(Number);
        return (
          segment.line === line &&
          col >= segment.start &&
          col < segment.start + segment.length
        );
      }),
  );
  if (!segments.length) return;
  drawInteriorWallSet(ctx, wallGeometries(segments, corners, width));
}

function pieScreenGeometry(pieData, corners) {
  if (!pieData) return null;
  const topLeft = project(corners, pieData.col / COLS, pieData.row / ROWS);
  const topRight = project(corners, (pieData.col + 2) / COLS, pieData.row / ROWS);
  const bottomRight = project(
    corners,
    (pieData.col + 2) / COLS,
    (pieData.row + 2) / ROWS,
  );
  const bottomLeft = project(corners, pieData.col / COLS, (pieData.row + 2) / ROWS);
  const points = [topLeft, topRight, bottomRight, bottomLeft];
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const bounds = {
    x: Math.min(...xs),
    y: Math.min(...ys),
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
  };
  return {
    points,
    bounds,
    center: {
      x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
      y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
    },
  };
}

function drawPieImage(ctx, geometry, opacity = 1) {
  if (!pieSprite.complete || !pieSprite.naturalWidth || opacity <= 0) return;
  const { bounds } = geometry;
  const sourceY = pieSprite.naturalHeight * 0.09;
  const sourceHeight = pieSprite.naturalHeight * 0.76;
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.shadowColor = "rgba(92, 58, 28, 0.28)";
  ctx.shadowBlur = bounds.width * 0.055;
  ctx.shadowOffsetY = bounds.height * 0.08;
  ctx.drawImage(
    pieSprite,
    0,
    sourceY,
    pieSprite.naturalWidth,
    sourceHeight,
    bounds.x + bounds.width * 0.045,
    bounds.y + bounds.height * 0.04,
    bounds.width * 0.91,
    bounds.height * 0.91,
  );
  ctx.restore();
}

function drawPieCrumbs(ctx, corners, quarter, progress) {
  if (!quarter || progress < 0.36) return;
  const quarterCenter = project(
    corners,
    (quarter.col + 0.5) / COLS,
    (quarter.row + 0.5) / ROWS,
  );
  const mouseCenter = project(
    corners,
    (quarter.approach.col + 0.5) / COLS,
    (quarter.approach.row + 0.5) / ROWS,
  );
  const travel = smoothStep((progress - 0.36) / 0.5);
  ctx.save();
  for (let index = 0; index < 6; index += 1) {
    const phase = clamp(travel * 1.35 - index * 0.07, 0, 1);
    if (phase <= 0) continue;
    const sway = Math.sin(index * 2.17 + phase * Math.PI) * 5;
    const x = quarterCenter.x + (mouseCenter.x - quarterCenter.x) * phase + sway;
    const y =
      quarterCenter.y +
      (mouseCenter.y - quarterCenter.y) * phase -
      Math.sin(phase * Math.PI) * (8 + index * 1.4);
    ctx.globalAlpha = (1 - phase * 0.68) * 0.9;
    ctx.fillStyle = index % 2 ? "#b65a24" : "#efad45";
    ctx.beginPath();
    ctx.arc(x, y, 1.8 + (index % 3) * 0.55, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawPie(ctx, corners) {
  if (!pie || isPieCleared()) return;
  const geometry = pieScreenGeometry(pie, corners);
  if (!geometry) return;
  const { bounds } = geometry;

  ctx.save();
  const plateGradient = ctx.createRadialGradient(
    geometry.center.x,
    geometry.center.y - bounds.height * 0.08,
    bounds.width * 0.05,
    geometry.center.x,
    geometry.center.y,
    bounds.width * 0.54,
  );
  plateGradient.addColorStop(0, "#fff9ea");
  plateGradient.addColorStop(0.7, "#dfd3b9");
  plateGradient.addColorStop(1, "#9d8e75");
  ctx.fillStyle = plateGradient;
  ctx.shadowColor = "rgba(49, 54, 47, 0.3)";
  ctx.shadowBlur = bounds.width * 0.06;
  ctx.shadowOffsetY = bounds.height * 0.08;
  ctx.beginPath();
  ctx.ellipse(
    geometry.center.x,
    geometry.center.y + bounds.height * 0.045,
    bounds.width * 0.48,
    bounds.height * 0.42,
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();
  ctx.restore();

  for (const quarter of pie.quarters) {
    if (eatenPieQuarterIds.has(quarter.id)) continue;
    const active = pieBiteAnimation?.quarterId === quarter.id;
    const fishingState =
      activeFishingCatchTarget?.kind === "pie" &&
      activeFishingCatchTarget.pieQuarterId === quarter.id
        ? fishingCatchVisualState(corners, activeFishingCatchTarget)
        : null;
    const opacity = active
      ? 1 - smoothStep((pieBiteAnimation.progress - 0.42) / 0.42)
      : 1;
    ctx.save();
    if (fishingState) {
      const quarterCenter = project(
        corners,
        (quarter.col + 0.5) / COLS,
        (quarter.row + 0.5) / ROWS,
      );
      ctx.translate(
        fishingState.cheeseCenter.x - quarterCenter.x,
        fishingState.cheeseCenter.y - quarterCenter.y,
      );
    }
    tracePolygon(ctx, cellPolygon(quarter, corners));
    ctx.clip();
    drawPieImage(ctx, geometry, opacity);
    ctx.restore();
    if (active) drawPieCrumbs(ctx, corners, quarter, pieBiteAnimation.progress);
  }

  ctx.save();
  ctx.strokeStyle = "rgba(112, 65, 28, 0.34)";
  ctx.lineWidth = Math.max(1, bounds.width * 0.008);
  const verticalTop = project(corners, (pie.col + 1) / COLS, pie.row / ROWS);
  const verticalBottom = project(corners, (pie.col + 1) / COLS, (pie.row + 2) / ROWS);
  const horizontalLeft = project(corners, pie.col / COLS, (pie.row + 1) / ROWS);
  const horizontalRight = project(corners, (pie.col + 2) / COLS, (pie.row + 1) / ROWS);
  ctx.beginPath();
  ctx.moveTo(verticalTop.x, verticalTop.y);
  ctx.lineTo(verticalBottom.x, verticalBottom.y);
  ctx.moveTo(horizontalLeft.x, horizontalLeft.y);
  ctx.lineTo(horizontalRight.x, horizontalRight.y);
  ctx.stroke();
  ctx.restore();
}

function drawPieForegroundWalls(ctx, corners, width) {
  if (!pie || isPieCleared()) return;
  const foregroundLines = new Set(
    pie.quarters.map((quarter) => `${quarter.row + 1}:${quarter.col}`),
  );
  const segments = collectWallSegments().filter(
    (segment) =>
      segment.orientation === "horizontal" &&
      Array.from(foregroundLines).some((entry) => {
        const [line, col] = entry.split(":").map(Number);
        return (
          segment.line === line &&
          col >= segment.start &&
          col < segment.start + segment.length
        );
      }),
  );
  if (!segments.length) return;
  drawInteriorWallSet(ctx, wallGeometries(segments, corners, width));
}

function currentCarVisualState() {
  if (!car) return null;
  if (!carMotion) {
    const rotating = rotatingVisualCell("car", car.id ?? "catcher", car);
    return { row: rotating.row, col: rotating.col };
  }
  const eased = easeMouseMotion(carMotion.progress);
  const rotatingMotion = rotatingEntityMotion("car", car.id ?? "catcher");
  const rotationAmount = rotatingTilesAnimation
    ? smoothStep(rotatingTilesAnimation.progress)
    : 0;
  return {
    row:
      carMotion.from.row +
      (carMotion.to.row - carMotion.from.row) * eased +
      (rotatingMotion
        ? (rotatingMotion.to.row - rotatingMotion.from.row) * rotationAmount
        : 0),
    col:
      carMotion.from.col +
      (carMotion.to.col - carMotion.from.col) * eased +
      (rotatingMotion
        ? (rotatingMotion.to.col - rotatingMotion.from.col) * rotationAmount
        : 0),
  };
}

function drawCarForegroundWalls(ctx, corners, width) {
  const captureCar = carCaptureAnimation?.car ?? null;
  const captureTarget = carCaptureAnimation?.target ?? null;
  const visual = captureCar ?? currentCarVisualState();
  if (!visual) return;

  const occupiedCells = captureCar && captureTarget
    ? [captureCar, captureTarget]
    : carMotion
      ? [carMotion.from, carMotion.to]
      : [car];
  const foregroundLines = new Set(
    occupiedCells.map((cell) => `${cell.row + 1}:${cell.col}`),
  );
  const segments = collectWallSegments().filter(
    (segment) =>
      segment.orientation === "horizontal" &&
      Array.from(foregroundLines).some((entry) => {
        const [line, col] = entry.split(":").map(Number);
        return (
          segment.line === line &&
          col >= segment.start &&
          col < segment.start + segment.length
        );
      }),
  );
  if (!segments.length) return;

  const visualCenter = project(
    corners,
    (visual.col + 0.5) / COLS,
    (visual.row + 0.5) / ROWS,
  );
  const targetCenter = captureTarget
    ? project(
        corners,
        (captureTarget.col + 0.5) / COLS,
        (captureTarget.row + 0.5) / ROWS,
      )
    : visualCenter;
  const center = {
    x: (visualCenter.x + targetCenter.x) / 2,
    y: (visualCenter.y + targetCenter.y) / 2,
  };
  const cellWidth = distance(
    project(corners, visual.col / COLS, visual.row / ROWS),
    project(corners, (visual.col + 1) / COLS, visual.row / ROWS),
  );

  ctx.save();
  ctx.beginPath();
  const clipScale = captureTarget ? 2.2 : 1;
  ctx.rect(
    center.x - cellWidth * 0.56 * clipScale,
    center.y - cellWidth * 0.44 * clipScale,
    cellWidth * 1.12 * clipScale,
    cellWidth * 0.98 * clipScale,
  );
  ctx.clip();
  drawInteriorWallSet(ctx, wallGeometries(segments, corners, width));
  ctx.restore();
}

function carDirectionBetween(from, to, fallback = carFacingDirection) {
  if (to.col > from.col) return "right";
  if (to.col < from.col) return "left";
  if (to.row < from.row) return "up";
  if (to.row > from.row) return "down";
  return fallback;
}

function getCarWalkSprite(direction = carFacingDirection) {
  if (direction === "right") return rcCatcherWalkRightSprite;
  if (direction === "up") return rcCatcherWalkUpSprite;
  if (direction === "down") return rcCatcherWalkDownSprite;
  return rcCatcherWalkLeftSprite;
}

function getCarCaptureSprite(direction = carFacingDirection) {
  if (direction === "right") return rcCatcherCaptureRightSprite;
  if (direction === "up") return rcCatcherCaptureUpSprite;
  if (direction === "down") return rcCatcherCaptureDownSprite;
  return rcCatcherCaptureLeftSprite;
}

function carCaptureFrameAt(progress) {
  if (progress < 0.2) return 0;
  if (progress < 0.43) return 1;
  if (progress < 0.68) return 2;
  return 3;
}

function drawCarCaptureSequence(ctx, corners, cellWidth) {
  if (!carCaptureAnimation) return false;
  const sprite = getCarCaptureSprite(carCaptureAnimation.direction);
  if (!sprite.complete || !sprite.naturalWidth) return false;

  const carCenter = project(
    corners,
    (carCaptureAnimation.car.col + 0.5) / COLS,
    (carCaptureAnimation.car.row + 0.5) / ROWS,
  );
  const targetCenter = project(
    corners,
    (carCaptureAnimation.target.col + 0.5) / COLS,
    (carCaptureAnimation.target.row + 0.5) / ROWS,
  );
  const center = {
    x: (carCenter.x + targetCenter.x) / 2,
    y: (carCenter.y + targetCenter.y) / 2,
  };
  const brakeDip = Math.sin(
    clamp(carCaptureAnimation.progress / 0.2, 0, 1) * Math.PI,
  ) * cellWidth * 0.035;

  drawSpriteFrame(
    ctx,
    sprite,
    carCaptureFrameAt(carCaptureAnimation.progress),
    4,
    { x: center.x, y: center.y + brakeDip },
    cellWidth * 1.7,
    0.5,
    1,
    null,
    false,
  );
  return true;
}

function drawCarCatcher(ctx, corners, cellWidth) {
  const visual = currentCarVisualState();
  if (!visual) return;
  const center = project(corners, (visual.col + 0.5) / COLS, (visual.row + 0.5) / ROWS);
  const direction = carMotion
    ? carDirectionBetween(carMotion.from, carMotion.to)
    : carFacingDirection;
  const walkSprite = getCarWalkSprite(direction);
  if (walkSprite.complete && walkSprite.naturalWidth) {
    const isDriving =
      carMotion &&
      (carMotion.from.row !== carMotion.to.row || carMotion.from.col !== carMotion.to.col);
    const progress = isDriving ? carMotion.progress : 0;
    const frame = isDriving ? Math.min(3, Math.floor(progress * 4)) : 0;
    const suspensionLift = isDriving
      ? Math.sin(progress * Math.PI) * cellWidth * 0.055
      : 0;
    const wheelRhythm = isDriving
      ? Math.sin(progress * Math.PI * 4) * 0.012
      : 0;
    drawSpriteFrame(
      ctx,
      walkSprite,
      frame,
      4,
      {
        x: center.x,
        y: center.y - cellWidth * 0.025 - suspensionLift,
      },
      cellWidth * 1.06 * (1 + wheelRhythm),
      0.5,
      1,
      null,
      false,
    );
    return;
  }

  if (!rcCatcherSprite.complete || !rcCatcherSprite.naturalWidth) return;
  const sourceX = rcCatcherSprite.naturalWidth * 0.27;
  const sourceY = rcCatcherSprite.naturalHeight * 0.015;
  const sourceWidth = rcCatcherSprite.naturalWidth * 0.72;
  const sourceHeight = rcCatcherSprite.naturalHeight * 0.77;
  const drawWidth = cellWidth * 0.96;
  const drawHeight = drawWidth * (sourceHeight / sourceWidth);
  ctx.save();
  ctx.translate(center.x, center.y - cellWidth * 0.04);
  const heading = carMotion
    ? Math.atan2(carMotion.to.row - carMotion.from.row, carMotion.to.col - carMotion.from.col)
    : 0;
  ctx.rotate(heading * 0.16);
  ctx.shadowColor = "rgba(35, 43, 40, 0.34)";
  ctx.shadowBlur = cellWidth * 0.12;
  ctx.shadowOffsetY = cellWidth * 0.08;
  ctx.drawImage(
    rcCatcherSprite,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    -drawWidth / 2,
    -drawHeight / 2,
    drawWidth,
    drawHeight,
  );
  ctx.restore();
}

function drawCockroachEvent(ctx, corners) {
  if (!cockroachAnimation) return;
  const progress = clamp(cockroachAnimation.progress, 0, 1);
  const from = cockroachAnimation.from;
  const to = cockroachAnimation.to;
  const rowDirection = Math.sign(to.row - from.row);
  const colDirection = Math.sign(to.col - from.col);
  const approach = {
    row: from.row - rowDirection * 0.9,
    col: from.col - colDirection * 0.9,
  };
  const escape = {
    row: to.row + rowDirection * 0.8,
    col: to.col + colDirection * 0.8,
  };
  const mixCell = (first, second, amount) => ({
    row: first.row + (second.row - first.row) * amount,
    col: first.col + (second.col - first.col) * amount,
  });

  let cockroachCell;
  let opacity = 1;
  if (progress < 0.24) {
    cockroachCell = mixCell(approach, from, smoothStep(progress / 0.24));
    opacity = smoothStep(progress / 0.12);
  } else if (progress < 0.78) {
    cockroachCell = mixCell(from, to, smoothStep((progress - 0.24) / 0.54));
  } else {
    cockroachCell = mixCell(to, escape, smoothStep((progress - 0.78) / 0.22));
    opacity = 1 - smoothStep((progress - 0.88) / 0.12);
  }

  const cockroachCenter = project(
    corners,
    (cockroachCell.col + 0.5) / COLS,
    (cockroachCell.row + 0.5) / ROWS,
  );
  const fromCenter = project(corners, (from.col + 0.5) / COLS, (from.row + 0.5) / ROWS);
  const toCenter = project(corners, (to.col + 0.5) / COLS, (to.row + 0.5) / ROWS);
  const cellWidth = distance(
    project(corners, from.col / COLS, from.row / ROWS),
    project(corners, (from.col + 1) / COLS, from.row / ROWS),
  );
  const heading = Math.atan2(toCenter.y - fromCenter.y, toCenter.x - fromCenter.x);
  const scuttle = Math.sin(progress * Math.PI * 18);
  const carrying = progress >= 0.28 && progress < 0.82;
  const lift = carrying ? Math.sin(clamp((progress - 0.28) / 0.54, 0, 1) * Math.PI) : 0;

  if (cockroachSprite.complete && cockroachSprite.naturalWidth) {
    const spriteAspect = cockroachSprite.naturalWidth / cockroachSprite.naturalHeight;
    const drawWidth = cellWidth * (1.02 + Math.abs(scuttle) * 0.025);
    const drawHeight = drawWidth / spriteAspect;
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(
      cockroachCenter.x,
      cockroachCenter.y - cellWidth * (0.05 + lift * 0.12),
    );
    ctx.rotate(heading - Math.PI + scuttle * 0.035);
    ctx.shadowColor = "rgba(50, 28, 18, 0.38)";
    ctx.shadowBlur = cellWidth * 0.14;
    ctx.shadowOffsetY = cellWidth * 0.1;
    ctx.drawImage(
      cockroachSprite,
      -drawWidth / 2,
      -drawHeight / 2,
      drawWidth,
      drawHeight,
    );
    ctx.restore();
  }

  let objectiveCenter = fromCenter;
  if (progress >= 0.28 && progress < 0.82) {
    const travel = smoothStep((progress - 0.28) / 0.54);
    objectiveCenter = {
      x: fromCenter.x + (toCenter.x - fromCenter.x) * travel,
      y:
        fromCenter.y +
        (toCenter.y - fromCenter.y) * travel -
        Math.sin(travel * Math.PI) * cellWidth * 0.22,
    };
  } else if (progress >= 0.82) {
    objectiveCenter = toCenter;
  }
  const pickupBounce = carrying ? 1 + Math.sin(progress * Math.PI * 8) * 0.035 : 1;
  if (cockroachAnimation.kind === "milk") {
    ctx.save();
    ctx.translate(objectiveCenter.x, objectiveCenter.y - cellWidth * (carrying ? 0.12 : 0));
    ctx.scale(0.78 * pickupBounce, 0.78 * pickupBounce);
    drawUprightMilkBottle(ctx, { x: 0, y: 0 }, cellWidth);
    ctx.restore();
  } else {
    drawSprite(
      ctx,
      cheeseSprite,
      objectiveCenter,
      cellWidth * 0.68 * pickupBounce,
      0.5,
      "source-over",
      carrying ? "rgba(242, 184, 63, 0.72)" : null,
    );
  }
}

function crowThreatGeometry(corners, threat, span) {
  const centerCell = crowThreatCenterCell(threat);
  const center = project(
    corners,
    (centerCell.col + 0.5) / COLS,
    (centerCell.row + 0.5) / ROWS,
  );
  const halfSpan = span / 2;
  const left = project(
    corners,
    (centerCell.col + 0.5 - halfSpan) / COLS,
    (centerCell.row + 0.5) / ROWS,
  );
  const right = project(
    corners,
    (centerCell.col + 0.5 + halfSpan) / COLS,
    (centerCell.row + 0.5) / ROWS,
  );
  const top = project(
    corners,
    (centerCell.col + 0.5) / COLS,
    (centerCell.row + 0.5 - halfSpan) / ROWS,
  );
  const bottom = project(
    corners,
    (centerCell.col + 0.5) / COLS,
    (centerCell.row + 0.5 + halfSpan) / ROWS,
  );
  return {
    center,
    width: distance(left, right),
    height: distance(top, bottom),
  };
}

function drawCrowSilhouette(ctx, center, width, height, opacity, blur) {
  ctx.save();
  ctx.translate(center.x, center.y);
  ctx.rotate(-0.08);
  ctx.globalAlpha = opacity;
  ctx.filter = `brightness(0) blur(${blur}px)`;
  if (crowSprite.complete && crowSprite.naturalWidth) {
    ctx.drawImage(crowSprite, -width / 2, -height / 2, width, height);
  } else {
    ctx.fillStyle = "rgba(24, 27, 29, 0.92)";
    ctx.beginPath();
    ctx.ellipse(0, 0, width * 0.48, height * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawCrowDangerZone(ctx, corners) {
  if (!crowThreat || crowAnimation) return;
  const remaining = crowMovesUntilStrike();
  const span = remaining <= 1 ? 4 : 5;
  const geometry = crowThreatGeometry(corners, crowThreat, span);
  const pulse = 0.82 + Math.sin(Date.now() / (remaining <= 1 ? 105 : 210)) * 0.12;
  drawCrowSilhouette(
    ctx,
    geometry.center,
    geometry.width,
    geometry.height * 0.92,
    (remaining <= 1 ? 0.34 : 0.22) * pulse,
    remaining <= 1 ? 3 : 5,
  );
}

function drawCrowStrike(ctx, corners, width) {
  if (!crowAnimation || !crowSprite.complete || !crowSprite.naturalWidth) return;
  const {
    threat,
    progress,
    targetedCell,
    blockedByWall,
    flightDiagonal = CROW_FLIGHT_DIAGONALS[0],
  } = crowAnimation;
  const targetGeometry = crowThreatGeometry(corners, threat, 3);
  const approach = smoothStep(clamp(progress / CROW_IMPACT_START, 0, 1));
  const departure = smoothStep(
    clamp((progress - CROW_IMPACT_START) / (1 - CROW_IMPACT_START), 0, 1),
  );
  const drawWidth = targetGeometry.width * (0.54 + approach * 0.46) * (1 - departure * 0.42);
  const spriteAspect = crowSprite.naturalWidth / crowSprite.naturalHeight;
  const drawHeight = Math.min(
    targetGeometry.height * 1.16,
    drawWidth / Math.max(0.72, spriteAspect),
  );
  const flightHorizontal = Math.max(targetGeometry.width * 1.55, width * 0.16);
  const flightVertical = Math.max(targetGeometry.height * 1.55, width * 0.16);
  const beforeImpact = progress < CROW_IMPACT_START;
  const center = {
    x:
      targetGeometry.center.x +
      (beforeImpact
        ? flightDiagonal.originX * (1 - approach) * flightHorizontal
        : -flightDiagonal.originX * departure * flightHorizontal * 1.18) +
      Math.sin(progress * Math.PI * 6) * drawWidth * 0.018,
    y:
      targetGeometry.center.y +
      (beforeImpact
        ? flightDiagonal.originY * (1 - approach) * flightVertical
        : -flightDiagonal.originY * departure * flightVertical * 1.18),
  };
  const wingBeat = 1 + Math.sin(progress * Math.PI * 12) * 0.045;

  const shadowOpacity = (1 - departure) * (0.12 + approach * 0.22);
  ctx.save();
  ctx.globalAlpha = shadowOpacity;
  ctx.filter = `blur(${Math.max(3, width * 0.009)}px)`;
  ctx.fillStyle = "rgba(24, 27, 29, 0.92)";
  ctx.beginPath();
  ctx.ellipse(
    targetGeometry.center.x,
    targetGeometry.center.y,
    targetGeometry.width * 0.43,
    targetGeometry.height * 0.28,
    -0.08,
    0,
    Math.PI * 2,
  );
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(center.x, center.y);
  ctx.rotate(
    flightDiagonal.rotation -
      0.08 +
      Math.sin(progress * Math.PI * 4) * 0.025,
  );
  ctx.scale(1, wingBeat);
  ctx.shadowColor = "rgba(14, 18, 22, 0.4)";
  ctx.shadowBlur = drawWidth * 0.09;
  ctx.shadowOffsetY = drawHeight * 0.08;
  ctx.drawImage(crowSprite, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
  ctx.restore();

  if (blockedByWall && targetedCell && progress >= CROW_IMPACT_START) {
    const protectionProgress = clamp(
      (progress - CROW_IMPACT_START) / Math.max(0.01, 1 - CROW_IMPACT_START),
      0,
      1,
    );
    const protectedCenter = project(
      corners,
      (targetedCell.col + 0.5) / COLS,
      (targetedCell.row + 0.5) / ROWS,
    );
    const protectedCellWidth = distance(
      project(corners, targetedCell.col / COLS, targetedCell.row / ROWS),
      project(corners, (targetedCell.col + 1) / COLS, targetedCell.row / ROWS),
    );
    const impactPulse = Math.sin(Math.min(1, protectionProgress * 2.4) * Math.PI);
    ctx.save();
    ctx.globalAlpha = Math.max(0, 1 - protectionProgress) * 0.9;
    ctx.strokeStyle = "rgba(247, 224, 151, 0.95)";
    ctx.lineWidth = Math.max(2, protectedCellWidth * 0.07);
    ctx.shadowColor = "rgba(247, 224, 151, 0.82)";
    ctx.shadowBlur = protectedCellWidth * 0.2;
    ctx.beginPath();
    ctx.arc(
      protectedCenter.x,
      protectedCenter.y,
      protectedCellWidth * (0.34 + impactPulse * 0.18),
      Math.PI * 1.05,
      Math.PI * 1.95,
    );
    ctx.stroke();
    ctx.restore();
  }

}

function catPawThreatCenterCell(threat) {
  if (!threat?.cells?.length) return { ...mouse };
  return threat.cells.reduce(
    (center, cell) => ({
      row: center.row + cell.row / threat.cells.length,
      col: center.col + cell.col / threat.cells.length,
    }),
    { row: 0, col: 0 },
  );
}

function catPawThreatAxis(threat) {
  if (threat.side === "top") {
    return { u: (threat.start + 1) / COLS, v: 0, du: 0, dv: 1 / ROWS };
  }
  if (threat.side === "bottom") {
    return { u: (threat.start + 1) / COLS, v: 1, du: 0, dv: -1 / ROWS };
  }
  if (threat.side === "left") {
    return { u: 0, v: (threat.start + 1) / ROWS, du: 1 / COLS, dv: 0 };
  }
  return { u: 1, v: (threat.start + 1) / ROWS, du: -1 / COLS, dv: 0 };
}

function drawCatPawDangerZone(ctx, corners) {
  if (!catPawThreat) return;
  const remaining = catPawMovesUntilStrike();
  const urgency = remaining <= 1 || catPawAnimation ? 1 : 0.58;
  const pulse = 0.76 + Math.sin(Date.now() / (remaining <= 1 ? 115 : 230)) * 0.14;

  ctx.save();
  ctx.filter = `blur(${remaining <= 1 ? 5 : 7}px)`;
  for (const cell of catPawThreat.cells) {
    const polygon = cellPolygon(cell, corners);
    tracePolygon(ctx, polygon);
    ctx.fillStyle = `rgba(45, 40, 35, ${0.09 + urgency * 0.15 * pulse})`;
    ctx.fill();
  }
  ctx.restore();
}

function catPawStrikeProgress(progress) {
  if (progress < 0.18) return 0;
  if (progress < CAT_PAW_IMPACT_START) {
    return smoothStep((progress - 0.18) / (CAT_PAW_IMPACT_START - 0.18));
  }
  if (progress <= CAT_PAW_IMPACT_END) return 1;
  return 1 - smoothStep((progress - CAT_PAW_IMPACT_END) / (1 - CAT_PAW_IMPACT_END));
}

function catPawSpriteRotation(side) {
  if (side === "bottom") return Math.PI;
  if (side === "left") return -Math.PI / 2;
  if (side === "right") return Math.PI / 2;
  return 0;
}

function drawCatPawStrike(ctx, corners, width) {
  if (!catPawAnimation || !catPawSprite.complete || !catPawSprite.naturalWidth) return;
  const { threat, progress } = catPawAnimation;
  const axis = catPawThreatAxis(threat);
  const strike = catPawStrikeProgress(progress);
  const toePoint = project(
    corners,
    axis.u + axis.du * (-1.15 + strike * 3.85),
    axis.v + axis.dv * (-1.15 + strike * 3.85),
  );
  const crossSpan = 2;
  const acrossStart = threat.side === "top" || threat.side === "bottom"
    ? project(corners, threat.start / COLS, axis.v)
    : project(corners, axis.u, threat.start / ROWS);
  const acrossEnd = threat.side === "top" || threat.side === "bottom"
    ? project(corners, (threat.start + crossSpan) / COLS, axis.v)
    : project(corners, axis.u, (threat.start + crossSpan) / ROWS);
  const drawWidth = distance(acrossStart, acrossEnd) * 0.92;
  const aspect = catPawSprite.naturalWidth / catPawSprite.naturalHeight;
  const drawHeight = drawWidth / Math.max(0.34, aspect);
  const impact = clamp(
    (progress - CAT_PAW_IMPACT_START) / Math.max(0.01, CAT_PAW_IMPACT_END - CAT_PAW_IMPACT_START),
    0,
    1,
  );

  if (strike > 0.72) {
    const center = catPawThreatCenterCell(threat);
    const shadowCenter = project(
      corners,
      (center.col + 0.5) / COLS,
      (center.row + 0.5) / ROWS,
    );
    ctx.save();
    ctx.globalAlpha = 0.16 + impact * 0.16;
    ctx.filter = `blur(${Math.max(4, width * 0.012)}px)`;
    ctx.fillStyle = "rgba(49, 35, 24, 0.9)";
    ctx.beginPath();
    ctx.ellipse(
      shadowCenter.x,
      shadowCenter.y,
      drawWidth * 0.34,
      drawWidth * 0.19,
      catPawSpriteRotation(threat.side),
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.restore();
  }

  ctx.save();
  ctx.translate(toePoint.x, toePoint.y);
  ctx.rotate(catPawSpriteRotation(threat.side));
  const squash = 1 - Math.sin(impact * Math.PI) * 0.045;
  ctx.scale(1 / squash, squash);
  ctx.shadowColor = "rgba(55, 38, 20, 0.42)";
  ctx.shadowBlur = drawWidth * 0.1;
  ctx.shadowOffsetY = drawWidth * 0.06;
  ctx.drawImage(
    catPawSprite,
    -drawWidth / 2,
    -drawHeight * 0.96,
    drawWidth,
    drawHeight,
  );
  ctx.restore();
}

function drawPieBiteMouse(ctx, corners, mouseCenter, cellWidth) {
  const quarter = pie?.quarters?.find(
    (candidate) => candidate.id === pieBiteAnimation?.quarterId,
  );
  if (!quarter || !pieBiteAnimation) return false;
  const targetCenter = project(
    corners,
    (quarter.col + 0.5) / COLS,
    (quarter.row + 0.5) / ROWS,
  );
  const progress = pieBiteAnimation.progress;
  const lungeIn = smoothStep(clamp(progress / 0.28, 0, 1));
  const settleBack = smoothStep(clamp((progress - 0.78) / 0.22, 0, 1));
  const contact = lungeIn * (1 - settleBack);
  const actionCenter = {
    x: mouseCenter.x + (targetCenter.x - mouseCenter.x) * contact * 0.18,
    y: mouseCenter.y + (targetCenter.y - mouseCenter.y) * contact * 0.18,
  };
  const bitePulse = progress > 0.28 && progress < 0.82
    ? Math.sin((progress - 0.28) * Math.PI * 12) * 0.022
    : 0;
  const walkSprite = getMouseWalkSprite();
  if (walkSprite.complete && walkSprite.naturalWidth) {
    const frame = progress < 0.24
      ? Math.min(2, Math.floor(progress * 12))
      : progress < 0.82
        ? Math.floor(progress * 10) % 2 === 0 ? 1 : 2
        : 3;
    drawSpriteFrame(
      ctx,
      walkSprite,
      frame,
      4,
      actionCenter,
      cellWidth * MOUSE_ACTION_SCALE * (1 + bitePulse),
      0.72,
    );
  } else {
    drawSprite(ctx, mouseSprite, actionCenter, cellWidth * MOUSE_FALLBACK_SCALE, 0.72);
  }

  if (progress > 0.34 && progress < 0.76) {
    const directionX = targetCenter.x - mouseCenter.x;
    const directionY = targetCenter.y - mouseCenter.y;
    const magnitude = Math.max(1, Math.hypot(directionX, directionY));
    const nose = {
      x: actionCenter.x + (directionX / magnitude) * cellWidth * 0.35,
      y: actionCenter.y + (directionY / magnitude) * cellWidth * 0.24,
    };
    ctx.save();
    ctx.strokeStyle = "rgba(176, 92, 39, 0.82)";
    ctx.lineCap = "round";
    ctx.lineWidth = Math.max(1.2, cellWidth * 0.025);
    for (let index = -1; index <= 1; index += 1) {
      const angle = Math.atan2(directionY, directionX) + index * 0.38;
      const pulse = 0.65 + Math.abs(Math.sin(progress * Math.PI * 10)) * 0.35;
      ctx.beginPath();
      ctx.moveTo(nose.x, nose.y);
      ctx.lineTo(
        nose.x + Math.cos(angle) * cellWidth * 0.13 * pulse,
        nose.y + Math.sin(angle) * cellWidth * 0.13 * pulse,
      );
      ctx.stroke();
    }
    ctx.restore();
  }
  return true;
}

function drawCharacters(ctx, corners) {
  const remainingCheeses = remainingCheeseTargets();
  if (
    !remainingCheeses.length &&
    !milkBottles.length &&
    !pie &&
    !car &&
    !cheeseEatingAnimating &&
    !milkDrinkAnimation &&
    !cheeseEaten
  ) return;

  const primaryCheese = activeFishingCatchTarget ?? cheeseEatingTarget ?? exit ?? mouse;
  const restingCheeseCenter = project(
    corners,
    (primaryCheese.col + 0.5) / COLS,
    (primaryCheese.row + 0.5) / ROWS,
  );

  let visualMouse = currentMouseVisualState();
  if (catPawAnimation?.caught && catPawAnimation.progress >= CAT_PAW_IMPACT_START) {
    const drag = smoothStep(
      clamp(
        (catPawAnimation.progress - CAT_PAW_IMPACT_START) /
          (1 - CAT_PAW_IMPACT_START),
        0,
        1,
      ),
    ) * 2.8;
    const side = catPawAnimation.threat.side;
    visualMouse = {
      ...visualMouse,
      row: visualMouse.row + (side === "top" ? -drag : side === "bottom" ? drag : 0),
      col: visualMouse.col + (side === "left" ? -drag : side === "right" ? drag : 0),
    };
  }
  let mouseCenter = project(
    corners,
    (visualMouse.col + 0.5) / COLS,
    (visualMouse.row + 0.5) / ROWS,
  );
  const mouseCellWidth = distance(
    project(corners, visualMouse.col / COLS, visualMouse.row / ROWS),
    project(corners, (visualMouse.col + 1) / COLS, visualMouse.row / ROWS),
  );
  if (
    mouseCapturedByCrow ||
    (crowAnimation?.caught && crowAnimation.progress >= CROW_IMPACT_START)
  ) {
    mouseCenter = { x: -10000, y: -10000 };
  }
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
    if (
      cockroachAnimation?.kind === "cheese" &&
      keyOf(target) === keyOf(cockroachAnimation.from)
    ) {
      continue;
    }
    const revealingPush =
      mouseMotion?.rockPush &&
      keyOf(mouseMotion.rockPush.from) === keyOf(target) &&
      mouseMotion.progress > 0.22;
    if (!isCheeseVisible(target) && !revealingPush) continue;
    const visualTarget = objectivePushVisualCell("cheese", cheeseIdentity(target), target);
    const polygon = cellPolygon(visualTarget, corners);
    const restingCenter = project(
      corners,
      (visualTarget.col + 0.5) / COLS,
      (visualTarget.row + 0.5) / ROWS,
    );
    const cellWidth = distance(
      project(corners, visualTarget.col / COLS, visualTarget.row / ROWS),
      project(corners, (visualTarget.col + 1) / COLS, visualTarget.row / ROWS),
    );
    const cellHeight =
      (distance(polygon[0], polygon[3]) + distance(polygon[1], polygon[2])) / 2;
    const multiCheeseScale = cheeseTargets.length > 1 ? 0.78 : 1;
    const size = Math.min(cellWidth, cellHeight) * CHEESE_SCALE * multiCheeseScale;
    const isFishingTarget =
      activeFishingCatchTarget?.kind === "cheese" &&
      cheeseIdentity(target) === activeFishingCatchTarget.targetId;
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

  const captureSpriteRendered = carCaptureAnimation
    ? drawCarCaptureSequence(ctx, corners, mouseCellWidth)
    : false;
  if (!captureSpriteRendered) drawCarCatcher(ctx, corners, mouseCellWidth);

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
  } else if (milkKnockAnimation) {
    const bottle = milkBottles.find(
      (candidate) => candidate.id === milkKnockAnimation.bottleId,
    );
    const bottleCenter = bottle
      ? project(corners, (bottle.col + 0.5) / COLS, (bottle.row + 0.5) / ROWS)
      : mouseCenter;
    const state = milkKnockStateAt(milkKnockAnimation.progress);
    const directionScale =
      milkKnockAnimation.direction === "up" || milkKnockAnimation.direction === "down"
        ? 0.28
        : 0.31;
    const contactCenter = {
      x:
        mouseCenter.x +
        (bottleCenter.x - mouseCenter.x) * directionScale * state.mouseContact,
      y:
        mouseCenter.y +
        (bottleCenter.y - mouseCenter.y) * directionScale * state.mouseContact,
    };
    const pushSprite = getMouseMilkPushSprite(milkKnockAnimation.direction);
    const pushFrame = milkActionFrameAt(milkKnockAnimation.progress);
    const pushBounce =
      pushFrame === 2
        ? Math.abs(Math.sin(milkKnockAnimation.progress * Math.PI * 4)) * 0.012
        : 0;
    if (pushSprite.complete && pushSprite.naturalWidth) {
      drawSpriteFrame(
        ctx,
        pushSprite,
        pushFrame,
        4,
        contactCenter,
        mouseCellWidth * MOUSE_ACTION_SCALE * (1 + pushBounce),
        0.72,
      );
    } else {
      drawSprite(
        ctx,
        mouseSprite,
        contactCenter,
        mouseCellWidth * MOUSE_FALLBACK_SCALE,
        0.72,
      );
    }
  } else if (milkDrinkAnimation) {
    const drinkingProgress = milkDrinkAnimation.progress;
    let drinkFrame = 0;
    if (drinkingProgress >= 0.78) drinkFrame = 3;
    else if (drinkingProgress >= 0.38) {
      drinkFrame = Math.floor((drinkingProgress - 0.38) / 0.1) % 2 === 0 ? 1 : 2;
    } else if (drinkingProgress >= 0.16) drinkFrame = 1;
    const drinkBob = drinkFrame === 2 ? mouseCellWidth * 0.025 : 0;
    if (mouseDrinkingSprite.complete && mouseDrinkingSprite.naturalWidth) {
      drawSpriteFrame(
        ctx,
        mouseDrinkingSprite,
        drinkFrame,
        4,
        { x: mouseCenter.x, y: mouseCenter.y + mouseCellWidth * 0.07 + drinkBob },
        mouseCellWidth * MOUSE_ACTION_SCALE * 1.02,
        0.72,
      );
    } else {
      drawSprite(ctx, mouseSprite, mouseCenter, mouseCellWidth * MOUSE_FALLBACK_SCALE, 0.72);
    }
  } else if (pieBiteAnimation) {
    drawPieBiteMouse(ctx, corners, mouseCenter, mouseCellWidth);
  } else if (carCaptureAnimation) {
    if (!captureSpriteRendered) {
      drawSprite(
        ctx,
        mouseSprite,
        mouseCenter,
        mouseCellWidth * MOUSE_FALLBACK_SCALE,
        0.72,
      );
    }
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
  } else {
    const tunnelDirection = visualMouse.tunnelDirection ?? mouseFacingDirection;
    const mouseWalkSprite = getMouseWalkSprite(tunnelDirection);
    const tunnelActionSprite = visualMouse.tunnelPose === "enter"
      ? mouseTunnelEnterSprite
      : visualMouse.tunnelPose === "exit"
        ? mouseTunnelExitSprite
        : null;
    if (
      (visualMouse.tunnelOpacity ?? 1) > 0 &&
      visualMouse.tunnelPose &&
      tunnelActionSprite?.complete &&
      tunnelActionSprite.naturalWidth
    ) {
      const tunnelFrame = Math.min(
        3,
        Math.floor(clamp(visualMouse.tunnelAmount ?? 0, 0, 0.9999) * 4),
      );
      const entering = visualMouse.tunnelPose === "enter";
      drawSpriteFrame(
        ctx,
        tunnelActionSprite,
        tunnelFrame,
        4,
        mouseCenter,
        mouseCellWidth * (entering ? 0.88 : 1.18),
        entering ? 0.9 : 0.83,
        visualMouse.tunnelOpacity ?? 1,
      );
    } else if (
      (visualMouse.tunnelOpacity ?? 1) > 0 &&
      mouseWalkSprite.complete &&
      mouseWalkSprite.naturalWidth
    ) {
      const walkFrame = mouseMotion
        ? Math.min(3, Math.floor(mouseMotion.progress * 4))
        : tunnelAnimation || tunnelTutorial
          ? Math.floor(((tunnelAnimation ?? tunnelTutorial).progress ?? 0) * 12) % 4
          : 3;
      const size =
        mouseCellWidth *
        MOUSE_IDLE_SCALE *
        mouseStepScale *
        (visualMouse.tunnelScale ?? 1);
      if (visualMouse.tunnelPose) {
        drawTunnelMouseFrame(
          ctx,
          mouseWalkSprite,
          walkFrame,
          mouseCenter,
          size,
          0.72,
          tunnelDirection,
          visualMouse.tunnelPose,
          visualMouse.tunnelAmount,
          visualMouse.tunnelOpacity ?? 1,
        );
      } else {
        drawSpriteFrame(
          ctx,
          mouseWalkSprite,
          walkFrame,
          4,
          mouseCenter,
          size,
          0.72,
          visualMouse.tunnelOpacity ?? 1,
        );
      }
    } else if ((visualMouse.tunnelOpacity ?? 1) > 0) {
      drawSprite(
        ctx,
        mouseSprite,
        mouseCenter,
        mouseCellWidth * MOUSE_FALLBACK_SCALE * mouseStepScale * (visualMouse.tunnelScale ?? 1),
        0.72,
        "source-over",
        null,
        visualMouse.tunnelOpacity ?? 1,
      );
    }
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
  useSkinPreview = true,
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
    useSkinPreview ? createAlbinoSkinPreview(sprite) : sprite,
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

function drawTunnelMouseFrame(
  ctx,
  sprite,
  frameIndex,
  center,
  size,
  baseline,
  direction,
  pose,
  amount,
  opacity = 1,
) {
  const visibleFraction = pose === "enter" ? 1 - amount : amount;
  if (visibleFraction <= 0) return;
  const left = center.x - size / 2;
  const top = center.y - size * baseline;
  const inset = size * 0.025;
  let clipX = left - inset;
  let clipY = top - inset;
  let clipWidth = size + inset * 2;
  let clipHeight = size + inset * 2;

  if (direction === "right") {
    if (pose === "enter") clipWidth = size * visibleFraction + inset;
    else {
      clipX = left + size * (1 - visibleFraction) - inset;
      clipWidth = size * visibleFraction + inset * 2;
    }
  } else if (direction === "left") {
    if (pose === "enter") {
      clipX = left + size * (1 - visibleFraction) - inset;
      clipWidth = size * visibleFraction + inset * 2;
    } else clipWidth = size * visibleFraction + inset;
  } else {
    if (pose === "enter") {
      clipY = top + size * (1 - visibleFraction) - inset;
      clipHeight = size * visibleFraction + inset * 2;
    } else clipHeight = size * visibleFraction + inset;
  }

  ctx.save();
  ctx.beginPath();
  ctx.rect(clipX, clipY, Math.max(0, clipWidth), Math.max(0, clipHeight));
  ctx.clip();
  drawSpriteFrame(ctx, sprite, frameIndex, 4, center, size, baseline, opacity);
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

function rotatingCircuitCellForTile(circuit, tile, offset = circuit.offset ?? 0) {
  const index = (tile.homeIndex + offset + circuit.cells.length) % circuit.cells.length;
  return circuit.cells[index];
}

function rotatingCircuitDestinationMap() {
  const destinations = new Map();
  for (const circuit of rotatingCircuits) {
    const direction = circuit.direction ?? 1;
    for (let index = 0; index < circuit.cells.length; index += 1) {
      const destinationIndex = (index + direction + circuit.cells.length) % circuit.cells.length;
      destinations.set(keyOf(circuit.cells[index]), { ...circuit.cells[destinationIndex] });
    }
  }
  return destinations;
}

function applyRotatingCircuitWalls() {
  if (!rotatingCircuits.length || !maze.length) return;
  for (const circuit of rotatingCircuits) {
    for (const cell of circuit.cells) {
      for (const direction of DIRS) setCellSideWall(maze, cell, direction.wall, false);
    }
  }
  for (const circuit of rotatingCircuits) {
    for (const tile of circuit.tiles) {
      const cell = rotatingCircuitCellForTile(circuit, tile);
      for (const direction of DIRS) {
        if (tile.walls[direction.wall]) {
          setCellSideWall(maze, cell, direction.wall, true);
        }
      }
    }
  }
}

function rotatingEntityMotion(kind, id) {
  return rotatingTilesAnimation?.entityMotions.find(
    (motion) => motion.kind === kind && motion.id === id,
  ) ?? null;
}

function rotatingVisualCell(kind, id, cell) {
  const motion = rotatingEntityMotion(kind, id);
  if (!motion) return cell;
  const amount = smoothStep(rotatingTilesAnimation.progress);
  return {
    row: motion.from.row + (motion.to.row - motion.from.row) * amount,
    col: motion.from.col + (motion.to.col - motion.from.col) * amount,
  };
}

function activeObjectivePush(kind, id) {
  const waterVisual = activeWaterAdvanceVisual();
  const candidates = [
    carMotion?.objectivePush
      ? { push: carMotion.objectivePush, progress: carMotion.progress ?? 0 }
      : null,
    ...(waterVisual?.advance.pushes ?? []).map((push) => ({
      push,
      progress: waterVisual?.progress ?? 0,
    })),
    hingedWallAnimation?.objectivePush
      ? {
          push: hingedWallAnimation.objectivePush,
          progress: hingedWallAnimation.progress ?? 0,
        }
      : null,
  ].filter(Boolean);
  return candidates.find(
    ({ push }) => push.kind === kind && push.id === id,
  ) ?? null;
}

function objectivePushVisualCell(kind, id, cell) {
  const rotatingMotion = rotatingEntityMotion(kind, id);
  if (rotatingMotion) return rotatingVisualCell(kind, id, cell);
  const active = activeObjectivePush(kind, id);
  if (!active) return cell;
  const amount = smoothStep(clamp(active.progress, 0, 1));
  return {
    row: active.push.from.row + (active.push.to.row - active.push.from.row) * amount,
    col: active.push.from.col + (active.push.to.col - active.push.from.col) * amount,
  };
}

function addRotatingEntityMotion(motions, destinations, kind, id, cell) {
  if (!cell) return;
  const destination = destinations.get(keyOf(cell));
  if (!destination) return;
  motions.push({ kind, id, from: { row: cell.row, col: cell.col }, to: destination });
}

function createRotatingTilesTurnState(tutorial = false, nextTurnState = {}) {
  const destinations = rotatingCircuitDestinationMap();
  const entityMotions = [];
  const objectivePushes = nextTurnState.objectivePushes ?? [];
  const addObjectiveMotion = (kind, id, cell) => {
    const push = objectivePushes.find(
      (candidate) => candidate?.kind === kind && candidate.id === id,
    );
    if (!push) {
      addRotatingEntityMotion(entityMotions, destinations, kind, id, cell);
      return;
    }
    const destination = destinations.get(keyOf(push.to)) ?? push.to;
    entityMotions.push({
      kind,
      id,
      from: { ...push.from },
      to: { ...destination },
    });
  };
  addRotatingEntityMotion(
    entityMotions,
    destinations,
    "mouse",
    "mouse",
    nextTurnState.mouse ?? mouse,
  );
  for (const target of cheeseTargets) {
    if (!cheeseWasCollected(target)) {
      addObjectiveMotion("cheese", cheeseIdentity(target), target);
    }
  }
  for (const bottle of milkBottles) {
    addObjectiveMotion("milk", bottle.id, bottle);
    if (bottle.spill) {
      addRotatingEntityMotion(entityMotions, destinations, "milk-spill", bottle.id, bottle.spill);
    }
  }
  for (const rock of rockPositions) {
    const nextRock = nextTurnState.rockPush?.id === rock.id
      ? nextTurnState.rockPush.to
      : rock;
    addRotatingEntityMotion(entityMotions, destinations, "rock", rock.id, nextRock);
  }
  if (car) {
    addRotatingEntityMotion(
      entityMotions,
      destinations,
      "car",
      car.id ?? "catcher",
      nextTurnState.car ?? car,
    );
  }
  for (const tunnel of tunnels) {
    addRotatingEntityMotion(entityMotions, destinations, "tunnel", tunnel.id, tunnel);
  }
  for (const floodedKey of floodedWaterKeys) {
    addRotatingEntityMotion(
      entityMotions,
      destinations,
      "water",
      floodedKey,
      cellFromKey(floodedKey),
    );
  }
  for (const wall of hingedWalls) {
    if (wall.destroyed || !wall.triggerFrom) continue;
    addRotatingEntityMotion(
      entityMotions,
      destinations,
      "hinged-wall",
      wall.id,
      wall.triggerFrom,
    );
  }
  return {
    tutorial,
    destinations,
    entityMotions,
    progress: 0,
    startedAt: null,
    onComplete: null,
    synchronizedWithMouse: false,
  };
}

function applyRotatingEntityMotions(animation) {
  const destinationFor = (kind, id, fallback) =>
    animation.entityMotions.find((motion) => motion.kind === kind && motion.id === id)?.to ?? fallback;
  mouse = { ...destinationFor("mouse", "mouse", mouse) };
  cheeseTargets = cheeseTargets.map((target) => ({
    ...target,
    ...destinationFor("cheese", cheeseIdentity(target), target),
  }));
  milkBottles = milkBottles.map((bottle) => ({
    ...bottle,
    ...destinationFor("milk", bottle.id, bottle),
    spill: bottle.spill
      ? { ...bottle.spill, ...destinationFor("milk-spill", bottle.id, bottle.spill) }
      : null,
  }));
  rockPositions = rockPositions.map((rock) => ({
    ...rock,
    ...destinationFor("rock", rock.id, rock),
  }));
  if (car) car = { ...car, ...destinationFor("car", car.id ?? "catcher", car) };
  tunnels = tunnels.map((tunnel) => ({
    ...tunnel,
    ...destinationFor("tunnel", tunnel.id, tunnel),
  }));
  const movedWaterKeys = new Set();
  for (const floodedKey of floodedWaterKeys) {
    movedWaterKeys.add(keyOf(destinationFor("water", floodedKey, cellFromKey(floodedKey))));
  }
  floodedWaterKeys = movedWaterKeys;

  const translateSegment = (segment, rowDelta, colDelta) =>
    segment.orientation === "horizontal"
      ? { ...segment, line: segment.line + rowDelta, start: segment.start + colDelta }
      : { ...segment, line: segment.line + colDelta, start: segment.start + rowDelta };
  hingedWalls = hingedWalls.map((wall) => {
    const destination = destinationFor("hinged-wall", wall.id, wall.triggerFrom);
    if (!wall.triggerFrom || keyOf(destination) === keyOf(wall.triggerFrom)) return wall;
    const rowDelta = destination.row - wall.triggerFrom.row;
    const colDelta = destination.col - wall.triggerFrom.col;
    return {
      ...wall,
      source: translateSegment(wall.source, rowDelta, colDelta),
      destination: translateSegment(wall.destination, rowDelta, colDelta),
      hinge: { row: wall.hinge.row + rowDelta, col: wall.hinge.col + colDelta },
      triggerFrom: { ...destination },
    };
  });

  const movedHiddenKeys = new Set();
  for (const key of hiddenCheeseKeys) {
    const destination = animation.destinations.get(key);
    movedHiddenKeys.add(destination ? keyOf(destination) : key);
  }
  hiddenCheeseKeys = movedHiddenKeys;
  syncWaterDebugDataset();
}

function clearRotatingTilesAnimation() {
  if (rotatingTilesAnimationFrame !== null) cancelAnimationFrame(rotatingTilesAnimationFrame);
  rotatingTilesAnimation = null;
  rotatingTilesAnimationFrame = null;
}

function commitRotatingTilesAnimation(animation) {
  for (const wall of hingedWalls) {
    if (!wall.destroyed) setSegmentWall(maze, wall.activated ? wall.destination : wall.source, false);
  }
  for (const circuit of rotatingCircuits) {
    circuit.offset =
      ((circuit.offset ?? 0) + (circuit.direction ?? 1) + circuit.cells.length) %
      circuit.cells.length;
  }
  applyRotatingEntityMotions(animation);
  applyRotatingCircuitWalls();
  for (const wall of hingedWalls) {
    if (!wall.destroyed) setSegmentWall(maze, wall.activated ? wall.destination : wall.source, true);
  }
  rotatingTilesAnimation = null;
  rotatingTilesAnimationFrame = null;
  mazeEl.setAttribute("aria-busy", "false");
  syncActiveExit();
}

function finishRotatingTilesAnimation() {
  const animation = rotatingTilesAnimation;
  if (!animation) return;
  commitRotatingTilesAnimation(animation);
  render();
  animation.onComplete?.();
}

function startSynchronizedRotatingTilesTurn(
  target,
  rockPush,
  nextCar,
  objectivePushes = [],
) {
  if (!rotatingCircuits.length || rotatingTilesAnimation) return;
  rotatingTilesAnimation = createRotatingTilesTurnState(false, {
    mouse: target,
    rockPush,
    car: nextCar,
    objectivePushes,
  });
  rotatingTilesAnimation.synchronizedWithMouse = true;
  rotatingTilesAnimation.startedAt = null;
  requestMazeDraw();
}

function rotatePendingWaterAdvance(advance) {
  if (!advance || !rotatingTilesAnimation?.synchronizedWithMouse) return advance;
  return {
    ...advance,
    newKeys: advance.newKeys.map((waterKey) => {
      const destination = rotatingTilesAnimation.destinations.get(waterKey);
      return destination ? keyOf(destination) : waterKey;
    }),
  };
}

function animateRotatingTiles(timestamp) {
  if (!rotatingTilesAnimation) return;
  if (rotatingTilesAnimation.startedAt === null) rotatingTilesAnimation.startedAt = timestamp;
  rotatingTilesAnimation.progress = clamp(
    (timestamp - rotatingTilesAnimation.startedAt) / ROTATING_TILES_DURATION_MS,
    0,
    1,
  );
  drawMaze();
  if (rotatingTilesAnimation.progress >= 1) finishRotatingTilesAnimation();
  else rotatingTilesAnimationFrame = requestAnimationFrame(animateRotatingTiles);
}

function startRotatingTilesTurn(onComplete, tutorial = false) {
  if (!rotatingCircuits.length || rotatingTilesAnimation) {
    onComplete?.();
    return false;
  }
  rotatingTilesAnimation = createRotatingTilesTurnState(tutorial);
  rotatingTilesAnimation.onComplete = onComplete;
  setMovementControlsEnabled(false);
  setPowerControlsEnabled(false);
  mazeEl.setAttribute("aria-busy", "true");
  setMessage(
    tutorial
      ? "Watch: every marked floor piece carries its walls and contents around the circuit."
      : "The rotating floor is shifting...",
  );
  requestMazeDraw();
  if (!canAnimateMouseMotion()) {
    rotatingTilesAnimation.progress = 1;
    finishRotatingTilesAnimation();
  } else {
    rotatingTilesAnimationFrame = requestAnimationFrame(animateRotatingTiles);
  }
  return true;
}

function rotatingTilesTutorialWasSeen() {
  try {
    return globalThis.localStorage?.getItem(ROTATING_TILES_TUTORIAL_STORAGE_KEY) === "seen";
  } catch {
    return false;
  }
}

function forceRotatingTilesTutorialFromUrl() {
  try {
    return new URLSearchParams(globalThis.location?.search ?? "").get("tutorial") === "rotating";
  } catch {
    return false;
  }
}

function clearRotatingTilesTutorial() {
  if (rotatingTilesTutorialTimer !== null) clearTimeout(rotatingTilesTutorialTimer);
  rotatingTilesTutorialTimer = null;
  rotatingTilesTutorialActive = false;
}

function finishRotatingTilesTutorial() {
  try {
    globalThis.localStorage?.setItem(ROTATING_TILES_TUTORIAL_STORAGE_KEY, "seen");
  } catch {
    // The tutorial can repeat next session when storage is unavailable.
  }
  clearRotatingTilesTutorial();
  finishLevelReadyState();
}

function startRotatingTilesTutorial() {
  rotatingTilesTutorialActive = true;
  startRotatingTilesTurn(() => {
    rotatingTilesTutorialTimer = setTimeout(
      finishRotatingTilesTutorial,
      ROTATING_TILES_TUTORIAL_HOLD_MS,
    );
  }, true);
}

function activeTunnels() {
  return tunnels.filter((tunnel) => !tunnel.sealed);
}

function activeTunnelAt(cell) {
  if (!cell) return null;
  return activeTunnels().find(
    (tunnel) => tunnel.row === cell.row && tunnel.col === cell.col,
  ) ?? null;
}

function clearTunnelAnimation() {
  if (tunnelAnimationFrame !== null) cancelAnimationFrame(tunnelAnimationFrame);
  tunnelAnimation = null;
  tunnelAnimationFrame = null;
  mazeEl.setAttribute("aria-busy", "false");
}

function clearTunnelTutorial() {
  if (tunnelTutorialFrame !== null) cancelAnimationFrame(tunnelTutorialFrame);
  tunnelTutorial = null;
  tunnelTutorialFrame = null;
}

function tunnelTutorialWasSeen() {
  try {
    return globalThis.localStorage?.getItem(TUNNEL_TUTORIAL_STORAGE_KEY) === "seen";
  } catch {
    return false;
  }
}

function forceTunnelTutorialFromUrl() {
  try {
    return new URLSearchParams(globalThis.location?.search ?? "").get("tutorial") === "tunnel";
  } catch {
    return false;
  }
}

function tunnelMouseVisualState() {
  const animation = tunnelAnimation ?? tunnelTutorial;
  if (!animation) return null;
  const progress = clamp(animation.progress, 0, 1);
  const from = animation.from;
  const to = animation.to;
  const timings = tunnelSequenceTimings(animation);

  if (animation.kind === "tutorial" && progress < timings.entryStart) {
    const amount = smoothStep(progress / timings.entryStart);
    return {
      row: levelStart.row + (from.row - levelStart.row) * amount,
      col: levelStart.col + (from.col - levelStart.col) * amount,
      step: Math.sin(amount * Math.PI * 2),
      tunnelScale: 1,
      tunnelOpacity: 1,
      tunnelDirection: animation.entryDirection,
    };
  }

  if (progress <= timings.entryEnd) {
    const amount = smoothStep(
      clamp(
        (progress - timings.entryStart) / (timings.entryEnd - timings.entryStart),
        0,
        1,
      ),
    );
    return {
      row: from.row,
      col: from.col,
      step: 0,
      tunnelScale: 1 - amount * 0.08,
      tunnelOpacity: 1,
      tunnelPose: "enter",
      tunnelAmount: amount,
      tunnelDirection: animation.entryDirection,
    };
  }
  if (progress < timings.exitStart) {
    return {
      row: from.row,
      col: from.col,
      step: 0,
      tunnelScale: 0.92,
      tunnelOpacity: 0,
      tunnelDirection: animation.entryDirection,
    };
  }
  if (progress <= timings.exitEnd) {
    const amount = smoothStep(
      clamp(
        (progress - timings.exitStart) / (timings.exitEnd - timings.exitStart),
        0,
        1,
      ),
    );
    return {
      row: to.row,
      col: to.col,
      step: Math.sin(amount * Math.PI) * 0.35,
      tunnelScale: 0.92 + amount * 0.08,
      tunnelOpacity: 1,
      tunnelPose: "exit",
      tunnelAmount: amount,
      tunnelDirection: animation.exitDirection,
    };
  }
  const tutorialFade = animation.kind === "tutorial"
    ? 1 - smoothStep(
        clamp(
          (progress - timings.collapseEnd) / (1 - timings.collapseEnd),
          0,
          1,
        ),
      )
    : 1;
  return {
    row: to.row,
    col: to.col,
    step: 0,
    tunnelScale: 1,
    tunnelOpacity: tutorialFade,
    tunnelDirection: animation.exitDirection,
  };
}

function tunnelExitDirection(destination, fallback = "down") {
  const cell = maze[destination.row]?.[destination.col];
  if (!cell) return fallback;
  const target = remainingCheeseTargets()[0] ?? exit ?? mouse;
  const available = DIRS.filter((direction) => {
    const row = destination.row + direction.row;
    const col = destination.col + direction.col;
    return isInside(row, col) && !cell.walls[direction.wall];
  });
  if (!available.length) return fallback;
  available.sort((first, second) => {
    const firstDistance =
      Math.abs(destination.row + first.row - target.row) +
      Math.abs(destination.col + first.col - target.col);
    const secondDistance =
      Math.abs(destination.row + second.row - target.row) +
      Math.abs(destination.col + second.col - target.col);
    return firstDistance - secondDistance;
  });
  return available[0].key;
}

function finishTunnelAnimation() {
  const animation = tunnelAnimation;
  if (!animation) return;
  tunnelAnimation = null;
  tunnelAnimationFrame = null;
  mouse = { row: animation.to.row, col: animation.to.col };
  mouseFacingDirection = animation.exitDirection ?? mouseFacingDirection;
  const destination = tunnels.find((tunnel) => tunnel.id === animation.destinationId);
  if (destination) destination.sealed = true;
  const remaining = activeTunnels();
  if (remaining.length < 2) {
    for (const tunnel of remaining) tunnel.sealed = true;
  }
  mazeEl.setAttribute("aria-busy", "false");
  render();
  const waterLoss = waterObjectiveDefeatMessage();
  if (waterLoss) {
    loseLevel(waterLoss);
    return;
  }
  if (car && carCatchesMouse(maze, mouse, mouse, car, car)) {
    startCarCaptureAnimation(car, mouse);
    return;
  }
  resolvePlayerArrival(animation.queuedDirection);
}

function animateTunnelTravel(timestamp) {
  if (!tunnelAnimation) return;
  if (tunnelAnimation.startedAt === null) tunnelAnimation.startedAt = timestamp;
  tunnelAnimation.progress = clamp(
    (timestamp - tunnelAnimation.startedAt) / TUNNEL_TRAVEL_DURATION_MS,
    0,
    1,
  );
  drawMaze();
  if (tunnelAnimation.progress >= 1) finishTunnelAnimation();
  else tunnelAnimationFrame = requestAnimationFrame(animateTunnelTravel);
}

function startTunnelTravel(entry, queuedDirection = null) {
  if (!entry || tunnelAnimation) return false;
  const destinations = activeTunnels().filter((tunnel) => tunnel.id !== entry.id);
  if (!destinations.length) {
    entry.sealed = true;
    return false;
  }
  const destination = destinations[
    Math.min(destinations.length - 1, Math.floor(randomUnit() * destinations.length))
  ];
  const entryDirection = mouseFacingDirection;
  const exitDirection = tunnelExitDirection(destination, entryDirection);
  tunnelAnimation = {
    kind: "travel",
    entryId: entry.id,
    destinationId: destination.id,
    from: { row: entry.row, col: entry.col },
    to: { row: destination.row, col: destination.col },
    entryDirection,
    exitDirection,
    queuedDirection,
    progress: 0,
    startedAt: null,
  };
  setMovementControlsEnabled(false);
  setPowerControlsEnabled(false);
  mazeEl.setAttribute("aria-busy", "true");
  setMessage("The tunnel is carrying the mouse beneath the maze...");
  requestMazeDraw();
  if (!canAnimateMouseMotion()) finishTunnelAnimation();
  else tunnelAnimationFrame = requestAnimationFrame(animateTunnelTravel);
  return true;
}

function finishTunnelTutorial() {
  if (!tunnelTutorial) return;
  try {
    globalThis.localStorage?.setItem(TUNNEL_TUTORIAL_STORAGE_KEY, "seen");
  } catch {
    // The tutorial can repeat next session when storage is unavailable.
  }
  clearTunnelTutorial();
  mouseFacingDirection = initialFacingForStart(levelStart);
  finishLevelReadyState();
}

function animateTunnelTutorial(timestamp) {
  if (!tunnelTutorial) return;
  if (tunnelTutorial.startedAt === null) tunnelTutorial.startedAt = timestamp;
  tunnelTutorial.progress = clamp(
    (timestamp - tunnelTutorial.startedAt) / TUNNEL_TUTORIAL_DURATION_MS,
    0,
    1,
  );
  drawMaze();
  if (tunnelTutorial.progress >= 1) finishTunnelTutorial();
  else tunnelTutorialFrame = requestAnimationFrame(animateTunnelTutorial);
}

function startTunnelTutorial() {
  const available = activeTunnels();
  if (available.length < 2) {
    finishLevelReadyState();
    return;
  }
  const entryDirection = carDirectionBetween(levelStart, available[0], mouseFacingDirection);
  const exitDirection = tunnelExitDirection(available[1], entryDirection);
  tunnelTutorial = {
    kind: "tutorial",
    from: { row: available[0].row, col: available[0].col },
    to: { row: available[1].row, col: available[1].col },
    entryDirection,
    exitDirection,
    progress: 0,
    startedAt: null,
  };
  mouseFacingDirection = entryDirection;
  mazeEl.setAttribute("aria-busy", "true");
  setMovementControlsEnabled(false);
  setPowerControlsEnabled(false);
  setMessage("Watch: enter one tunnel and emerge from another. The exit then closes.");
  requestMazeDraw();
  if (!canAnimateMouseMotion()) finishTunnelTutorial();
  else tunnelTutorialFrame = requestAnimationFrame(animateTunnelTutorial);
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

function clearSwipeTutorial() {
  if (swipeTutorialTimer !== null) clearTimeout(swipeTutorialTimer);
  swipeTutorialTimer = null;
  swipeTutorialActive = false;
  swipeTutorialDemoEl.classList.remove("playing");
  swipeTutorialEl.removeAttribute("data-direction");
  swipeTutorialEl.hidden = true;
}

function crystalTutorialWasSeen() {
  try {
    return globalThis.localStorage?.getItem(CRYSTAL_TUTORIAL_STORAGE_KEY) === "seen";
  } catch {
    return false;
  }
}

function forceCrystalTutorialFromUrl() {
  try {
    return new URLSearchParams(globalThis.location?.search ?? "").get("tutorial") === "crystal";
  } catch {
    return false;
  }
}

function tornadoTutorialWasSeen() {
  try {
    return globalThis.localStorage?.getItem(TORNADO_TUTORIAL_STORAGE_KEY) === "seen";
  } catch {
    return false;
  }
}

function forceTornadoTutorialFromUrl() {
  try {
    return new URLSearchParams(globalThis.location?.search ?? "").get("tutorial") === "tornado";
  } catch {
    return false;
  }
}

function powerIntroTutorialWasSeen(powerKey) {
  try {
    const saved = JSON.parse(
      globalThis.localStorage?.getItem(POWER_INTRO_TUTORIAL_STORAGE_KEY) ?? "{}",
    );
    return saved?.[powerKey] === true;
  } catch {
    return false;
  }
}

function forcePowerIntroTutorialFromUrl(powerKey) {
  try {
    return new URLSearchParams(globalThis.location?.search ?? "").get("tutorial") === powerKey;
  } catch {
    return false;
  }
}

function markPowerIntroTutorialSeen(powerKey) {
  try {
    const saved = JSON.parse(
      globalThis.localStorage?.getItem(POWER_INTRO_TUTORIAL_STORAGE_KEY) ?? "{}",
    );
    saved[powerKey] = true;
    globalThis.localStorage?.setItem(POWER_INTRO_TUTORIAL_STORAGE_KEY, JSON.stringify(saved));
  } catch {
    // The tutorial can repeat next session when storage is unavailable.
  }
}

function clearPowerIntroTutorial() {
  for (const timer of powerIntroTutorialTimers) clearTimeout(timer);
  powerIntroTutorialTimers = [];
  powerIntroTutorialActive = false;
  powerIntroTutorialKey = null;
  powerIntroTutorialTarget = null;
  powerIntroTutorialEl.hidden = true;
  powerIntroTutorialEl.removeAttribute("data-phase");
  powerBarEl.classList.remove("power-intro-tutorial-mode");
  hammerPowerButton.classList.remove("power-intro-focus");
  fishingPowerButton.classList.remove("power-intro-focus");
  rocketPowerButton.classList.remove("power-intro-focus");
}

function schedulePowerIntroTutorial(callback, delay) {
  const timer = setTimeout(() => {
    powerIntroTutorialTimers = powerIntroTutorialTimers.filter(
      (candidate) => candidate !== timer,
    );
    callback();
  }, delay);
  powerIntroTutorialTimers.push(timer);
}

function powerIntroButton(powerKey) {
  return {
    hammer: hammerPowerButton,
    fishing: fishingPowerButton,
    rocket: rocketPowerButton,
  }[powerKey] ?? null;
}

function powerIntroMovesMade() {
  return Math.max(0, moveLimit - movesLeft);
}

function routeMoveCount(route) {
  return route?.path?.length ? route.path.length - 1 : Number.POSITIVE_INFINITY;
}

function remainingCheeseRoute(start = mouse) {
  return bestCheeseRoute(maze, start, remainingCheeseTargets());
}

function hammerTutorialOpportunity() {
  const targets = getHammerTargets();
  if (!targets.length) return null;
  const forced = forcePowerIntroTutorialFromUrl("hammer");
  if (!forced && powerIntroMovesMade() < 1) return null;

  const currentDistance = routeMoveCount(remainingCheeseRoute());
  let best = null;
  for (const target of targets) {
    const current = maze[mouse.row]?.[mouse.col];
    const neighbor = maze[target.nextRow]?.[target.nextCol];
    if (!current || !neighbor) continue;
    const currentWall = current.walls[target.dir.wall];
    const neighborWall = neighbor.walls[target.dir.opposite];
    try {
      current.walls[target.dir.wall] = false;
      neighbor.walls[target.dir.opposite] = false;
      const newDistance = routeMoveCount(remainingCheeseRoute());
      const savings = currentDistance - newDistance;
      if (!best || savings > best.savings) best = { target, newDistance, savings };
    } finally {
      current.walls[target.dir.wall] = currentWall;
      neighbor.walls[target.dir.opposite] = neighborWall;
    }
  }

  if (!best || !Number.isFinite(best.newDistance)) return null;
  const rescuesRun = currentDistance > movesLeft && best.newDistance <= movesLeft;
  const meaningfullyShorter = best.savings >= 2;
  const fallbackAfterExploring = powerIntroMovesMade() >= 5 && best.savings > 0;
  return forced || rescuesRun || meaningfullyShorter || fallbackAfterExploring
    ? best.target
    : null;
}

function fishingTutorialOpportunity() {
  if (
    !forcePowerIntroTutorialFromUrl("fishing") &&
    powerIntroMovesMade() < 1
  ) {
    return null;
  }
  return getFishingCatchTarget();
}

function rocketRouteAfterLanding(target) {
  const cheese = cheeseAt(target);
  const milk = milkPuddleAt(target);
  const pieQuarter = target.kind === "pie"
    ? remainingPieQuarters().find((quarter) => quarter.id === target.pieQuarterId)
    : null;
  const cheeseId = cheese ? cheeseIdentity(cheese) : null;
  const hadCheese = cheeseId ? collectedCheeseKeys.has(cheeseId) : false;
  const hadMilk = milk ? collectedMilkIds.has(milk.id) : false;
  const hadPieQuarter = pieQuarter ? eatenPieQuarterIds.has(pieQuarter.id) : false;
  if (cheeseId) collectedCheeseKeys.add(cheeseId);
  if (milk) collectedMilkIds.add(milk.id);
  if (pieQuarter) eatenPieQuarterIds.add(pieQuarter.id);
  try {
    if (allObjectivesComplete()) return 0;
    const landing = target.kind === "pie" && target.mouseDestination
      ? target.mouseDestination
      : target;
    return routeMoveCount(currentObjectiveRoute(maze, landing));
  } finally {
    if (cheeseId && !hadCheese) collectedCheeseKeys.delete(cheeseId);
    if (milk && !hadMilk) collectedMilkIds.delete(milk.id);
    if (pieQuarter && !hadPieQuarter) eatenPieQuarterIds.delete(pieQuarter.id);
  }
}

function rocketTutorialOpportunity() {
  const forced = forcePowerIntroTutorialFromUrl("rocket");
  if (!forced && powerIntroMovesMade() < 1) return null;
  const currentDistance = routeMoveCount(currentObjectiveRoute());
  let best = null;
  for (const target of getRocketTargets()) {
    const landedMilk = milkPuddleAt(target);
    const landedCheese = cheeseAt(target);
    const landedPie = target.kind === "pie";
    const landsOnObjective = Boolean(landedMilk || landedCheese || landedPie);
    const newDistance = landsOnObjective
      ? rocketRouteAfterLanding(target)
      : routeMoveCount(currentObjectiveRoute(maze, target));
    if (!Number.isFinite(newDistance)) continue;
    const savings = currentDistance - newDistance;
    const score = savings + (landedMilk ? 1200 : landsOnObjective ? 1000 : 0);
    if (!best || score > best.score) {
      best = { target, newDistance, savings, score, landsOnObjective };
    }
  }
  if (!best) return null;
  const rescuesRun = currentDistance > movesLeft && best.newDistance <= movesLeft;
  const rescuesLastObjective =
    movesLeft <= 0 && best.landsOnObjective && remainingObjectiveCount() === 1;
  const clearAfterExploring = powerIntroMovesMade() >= 8 && best.savings >= 3;
  return forced || rescuesRun || rescuesLastObjective || clearAfterExploring
    ? best.target
    : null;
}

function powerIntroOpportunity(powerKey) {
  if (powerKey === "hammer") return hammerTutorialOpportunity();
  if (powerKey === "fishing") return fishingTutorialOpportunity();
  if (powerKey === "rocket") return rocketTutorialOpportunity();
  return null;
}

function powerIntroTargetCenter(powerKey, target) {
  const mazeBounds = mazeEl.getBoundingClientRect();
  if (!mazeLayout || !target) {
    return { x: mazeBounds.left + mazeBounds.width / 2, y: mazeBounds.top + mazeBounds.height / 2 };
  }
  if (powerKey === "hammer") {
    const wall = segmentGeometry(target.segment, mazeLayout.corners, mazeLayout.width);
    return {
      x: mazeBounds.left + (wall.p1.x + wall.p2.x) / 2,
      y: mazeBounds.top + (wall.p1.y + wall.p2.y) / 2 + wall.height * 0.5,
    };
  }
  const center = project(
    mazeLayout.corners,
    (target.col + 0.5) / COLS,
    (target.row + 0.5) / ROWS,
  );
  return { x: mazeBounds.left + center.x, y: mazeBounds.top + center.y };
}

function setPowerIntroTutorialTarget(point, phase) {
  powerIntroTutorialEl.style.setProperty("--tutorial-x", `${point.x}px`);
  powerIntroTutorialEl.style.setProperty("--tutorial-y", `${point.y}px`);
  powerIntroTutorialEl.removeAttribute("data-phase");
  void powerIntroTutorialEl.offsetWidth;
  powerIntroTutorialEl.dataset.phase = phase;
}

function demonstrateIntroPower() {
  if (!powerIntroTutorialActive) return;
  if (powerTransform) {
    schedulePowerIntroTutorial(demonstrateIntroPower, 80);
    return;
  }
  const powerKey = powerIntroTutorialKey;
  const target = powerIntroTutorialTarget;
  powerIntroTutorialEl.dataset.phase = "reveal";
  markPowerIntroTutorialSeen(powerKey);
  clearPowerIntroTutorial();
  powerInventory[powerKey] += 1;
  syncPowerAvailability();
  if (powerKey === "hammer") destroyHammerTarget(target);
  else if (powerKey === "fishing") useFishingPower(target);
  else useRocketTarget(target);
}

function startPowerIntroTutorial(powerKey, target) {
  clearPowerIntroTutorial();
  powerIntroTutorialActive = true;
  powerIntroTutorialShownThisRun = true;
  powerIntroTutorialKey = powerKey;
  powerIntroTutorialTarget = powerKey === "hammer"
    ? { ...target, dir: { ...target.dir }, segment: { ...target.segment } }
    : { ...target };
  powerIntroTutorialUnlockedForRun.add(powerKey);
  powerInventory[powerKey] = Math.max(1, powerInventory[powerKey]);
  syncPowerAvailability();
  powerIntroTutorialEl.hidden = false;
  powerBarEl.classList.add("power-intro-tutorial-mode");
  powerIntroButton(powerKey).classList.add("power-intro-focus");
  mazeEl.setAttribute("aria-busy", "true");
  setMovementControlsEnabled(false);
  setPowerControlsEnabled(false);
  setMessage(
    powerKey === "hammer"
      ? "Watch how the Hammer opens a new route."
      : powerKey === "fishing"
        ? "Watch how the Fishing Rod catches cheese diagonally."
        : "Watch how the Rocket crosses walls to reach a useful square.",
  );
  updatePowerUI();
  const buttonBounds = powerIntroButton(powerKey).getBoundingClientRect();
  setPowerIntroTutorialTarget(
    { x: buttonBounds.left + buttonBounds.width / 2, y: buttonBounds.top + buttonBounds.height / 2 },
    "select",
  );

  schedulePowerIntroTutorial(() => {
    if (!powerIntroTutorialActive) return;
    if (powerKey === "hammer") activateHammerPower();
    else if (powerKey === "fishing") activateFishingPower();
    else activateRocketPower();
  }, 560);

  schedulePowerIntroTutorial(() => {
    if (!powerIntroTutorialActive) return;
    setPowerIntroTutorialTarget(
      powerIntroTargetCenter(powerKey, powerIntroTutorialTarget),
      "activate",
    );
  }, 1660);

  schedulePowerIntroTutorial(demonstrateIntroPower, 2320);
}

function maybeStartPowerIntroTutorial() {
  if (powerIntroTutorialActive || powerIntroTutorialShownThisRun || gameOver) return false;
  const config = LEVEL_CONFIGS[level - 1] ?? {};
  const powerKey = config.hammerIntro
    ? "hammer"
    : config.fishingIntro
      ? "fishing"
      : config.rocketIntro
        ? "rocket"
        : null;
  if (
    !powerKey ||
    (powerIntroTutorialWasSeen(powerKey) && !forcePowerIntroTutorialFromUrl(powerKey))
  ) {
    return false;
  }
  const target = powerIntroOpportunity(powerKey);
  if (!target) return false;
  startPowerIntroTutorial(powerKey, target);
  return true;
}

function clearTornadoTutorial() {
  for (const timer of tornadoTutorialTimers) clearTimeout(timer);
  tornadoTutorialTimers = [];
  tornadoTutorialActive = false;
  tornadoTutorialCandidate = null;
  tornadoTutorialSavings = 0;
  tornadoTutorialEl.hidden = true;
  tornadoTutorialEl.removeAttribute("data-phase");
  powerBarEl.classList.remove("tornado-tutorial-mode");
  tornadoPowerButton.classList.remove("tornado-tutorial-focus");
}

function scheduleTornadoTutorial(callback, delay) {
  const timer = setTimeout(() => {
    tornadoTutorialTimers = tornadoTutorialTimers.filter((candidate) => candidate !== timer);
    callback();
  }, delay);
  tornadoTutorialTimers.push(timer);
}

function setTornadoTutorialTarget(point, phase) {
  tornadoTutorialEl.style.setProperty("--tutorial-x", `${point.x}px`);
  tornadoTutorialEl.style.setProperty("--tutorial-y", `${point.y}px`);
  tornadoTutorialEl.removeAttribute("data-phase");
  void tornadoTutorialEl.offsetWidth;
  tornadoTutorialEl.dataset.phase = phase;
}

function tornadoTutorialButtonCenter() {
  const bounds = tornadoPowerButton.getBoundingClientRect();
  return { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 };
}

function tornadoTutorialMouseCenter() {
  return crystalTutorialMouseCenter();
}

function findTornadoTutorialOpportunity() {
  const config = LEVEL_CONFIGS[level - 1] ?? {};
  const collectedCount = collectedCheeseKeys.size;
  if (
    level !== 13 ||
    !config.tornadoIntro ||
    tornadoTutorialActive ||
    tornadoTutorialShownThisRun ||
    collectedCount < 1 ||
    collectedCount >= 3 ||
    (tornadoTutorialWasSeen() && !forceTornadoTutorialFromUrl())
  ) {
    return null;
  }

  const remaining = remainingCheeseTargets();
  if (!remaining.length) return null;
  const currentRoute = bestCheeseRoute(maze, mouse, remaining);
  const currentDistance = currentRoute?.path.length
    ? currentRoute.path.length - 1
    : Number.POSITIVE_INFINITY;
  const candidate = chooseSafeTornadoCandidate(true);
  if (!candidate || !Number.isFinite(candidate.routeDistance)) return null;
  const savings = currentDistance - candidate.routeDistance;
  const minimumSavings = collectedCount === 1
    ? Math.max(4, Math.ceil(currentDistance * 0.12))
    : Math.max(2, Math.ceil(currentDistance * 0.08));
  const clearAdvantage =
    currentDistance > movesLeft ||
    savings >= minimumSavings ||
    collectedCount >= 2 ||
    forceTornadoTutorialFromUrl();
  return clearAdvantage ? { candidate, savings: Math.max(0, savings) } : null;
}

function finishTornadoTutorial() {
  if (!tornadoTutorialActive) return;
  const savedMoves = tornadoTutorialSavings;
  try {
    globalThis.localStorage?.setItem(TORNADO_TUTORIAL_STORAGE_KEY, "seen");
  } catch {
    // The tutorial can repeat next session when storage is unavailable.
  }
  clearTornadoTutorial();
  mazeEl.setAttribute("aria-busy", "false");
  setMovementControlsEnabled(true);
  setPowerControlsEnabled(true);
  setMessage(
    savedMoves > 0
      ? `The tornado opened a route that is ${savedMoves} move${savedMoves === 1 ? "" : "s"} shorter.`
      : "The tornado opened a more useful route through the maze.",
  );
  render();
  saveCampaignState();
}

function demonstrateTornadoUse() {
  if (!tornadoTutorialActive) return;
  if (powerTransform) {
    scheduleTornadoTutorial(demonstrateTornadoUse, 80);
    return;
  }
  if (!tornadoTargeting || !tornadoCandidate) {
    finishTornadoTutorial();
    return;
  }
  tornadoTutorialEl.dataset.phase = "reveal";
  powerInventory.tornado += 1;
  syncPowerAvailability();
  useTornadoPower();
}

function startTornadoTutorial(opportunity) {
  clearTornadoTutorial();
  tornadoTutorialShownThisRun = true;
  tornadoTutorialActive = true;
  tornadoTutorialCandidate = opportunity.candidate;
  tornadoTutorialSavings = opportunity.savings;
  tornadoTutorialUnlockedForRun = true;
  powerInventory.tornado = Math.max(1, powerInventory.tornado);
  syncPowerAvailability();
  tornadoTutorialEl.hidden = false;
  powerBarEl.classList.add("tornado-tutorial-mode");
  tornadoPowerButton.classList.add("tornado-tutorial-focus");
  mazeEl.setAttribute("aria-busy", "true");
  setMovementControlsEnabled(false);
  setPowerControlsEnabled(false);
  setMessage("Watch how the Maze Tornado opens a shorter route.");
  updatePowerUI();
  setTornadoTutorialTarget(tornadoTutorialButtonCenter(), "select");

  scheduleTornadoTutorial(() => {
    if (!tornadoTutorialActive) return;
    activateTornadoPower(tornadoTutorialCandidate);
  }, 560);

  scheduleTornadoTutorial(() => {
    if (!tornadoTutorialActive) return;
    setTornadoTutorialTarget(tornadoTutorialMouseCenter(), "activate");
  }, 1660);

  scheduleTornadoTutorial(demonstrateTornadoUse, 2320);
}

function clearCrystalTutorial() {
  for (const timer of crystalTutorialTimers) clearTimeout(timer);
  crystalTutorialTimers = [];
  crystalTutorialActive = false;
  crystalTutorialEl.hidden = true;
  crystalTutorialEl.removeAttribute("data-phase");
  powerBarEl.classList.remove("crystal-tutorial-mode");
  crystalPowerButton.classList.remove("crystal-tutorial-focus");
}

function scheduleCrystalTutorial(callback, delay) {
  const timer = setTimeout(() => {
    crystalTutorialTimers = crystalTutorialTimers.filter((candidate) => candidate !== timer);
    callback();
  }, delay);
  crystalTutorialTimers.push(timer);
}

function setCrystalTutorialTarget(point, phase) {
  crystalTutorialEl.style.setProperty("--tutorial-x", `${point.x}px`);
  crystalTutorialEl.style.setProperty("--tutorial-y", `${point.y}px`);
  crystalTutorialEl.removeAttribute("data-phase");
  void crystalTutorialEl.offsetWidth;
  crystalTutorialEl.dataset.phase = phase;
}

function crystalTutorialButtonCenter() {
  const bounds = crystalPowerButton.getBoundingClientRect();
  return { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 };
}

function crystalTutorialMouseCenter() {
  const bounds = mazeEl.getBoundingClientRect();
  if (!mazeLayout) return { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 };
  const center = project(
    mazeLayout.corners,
    (mouse.col + 0.5) / COLS,
    (mouse.row + 0.5) / ROWS,
  );
  return { x: bounds.left + center.x, y: bounds.top + center.y };
}

function finishCrystalTutorial() {
  if (!crystalTutorialActive) return;
  try {
    globalThis.localStorage?.setItem(CRYSTAL_TUTORIAL_STORAGE_KEY, "seen");
  } catch {
    // The tutorial can repeat next session when storage is unavailable.
  }
  clearCrystalTutorial();
  finishLevelReadyState();
}

function demonstrateCrystalReveal() {
  if (!crystalTutorialActive) return;
  if (powerTransform) {
    scheduleCrystalTutorial(demonstrateCrystalReveal, 80);
    return;
  }
  if (!crystalTargeting || !crystalCandidatePath.length) {
    finishCrystalTutorial();
    return;
  }

  crystalTutorialEl.dataset.phase = "reveal";
  powerInventory.crystal += 1;
  syncPowerAvailability();
  useCrystalPower();
}

function startCrystalTutorial() {
  clearCrystalTutorial();
  crystalTutorialActive = true;
  crystalTutorialEl.hidden = false;
  powerBarEl.classList.add("crystal-tutorial-mode");
  crystalPowerButton.classList.add("crystal-tutorial-focus");
  mazeEl.setAttribute("aria-busy", "true");
  setMovementControlsEnabled(false);
  setPowerControlsEnabled(false);
  setMessage("Watch how Crystal Vision reveals a route.");
  setCrystalTutorialTarget(crystalTutorialButtonCenter(), "select");

  scheduleCrystalTutorial(() => {
    if (!crystalTutorialActive) return;
    activateCrystalPower();
  }, 560);

  scheduleCrystalTutorial(() => {
    if (!crystalTutorialActive) return;
    setCrystalTutorialTarget(crystalTutorialMouseCenter(), "activate");
  }, 1660);

  scheduleCrystalTutorial(demonstrateCrystalReveal, 2320);
}

const MECHANIC_TUTORIAL_MESSAGES = {
  cheese: "Watch: reach the cheese and eat it to complete the level.",
  milk: "Watch: push the bottle over, then move onto the puddle to drink it.",
  rock: "Watch: push a rock from the open side to move it one square.",
  hinge: "Watch: entering the trigger square makes the hinged wall pivot.",
  car: "Watch: the catcher captures the mouse when its net has a clear path.",
  cockroach: "Watch: the cockroach can carry an objective to another square.",
  pie: "Watch: eat the pie from four sides. Each eaten quarter closes temporarily.",
  catPaw: "Watch the warning shadow, then leave the marked edge before the paw strikes.",
  crow: "Watch the shrinking shadow, then reach the outer edge before the crow dives.",
  cloud: "Watch: moving clouds hide a five-by-five part of the maze.",
  water: "Watch: after four moves, water spreads through every open path.",
};

function mechanicTutorialKindForLevel(config = currentLevelConfig()) {
  if (level === 3 && config.milkCount) return "milk";
  if (level === 9 && config.carMode) return "car";
  if (level === 11 && config.rockMode) return "rock";
  if (level === 22 && (config.hingedWallCount ?? 0) > 0) return "hinge";
  if (level === 15 && config.cockroachMode) return "cockroach";
  if (level === 20 && config.pieCount) return "pie";
  if (config.catPawIntro) return "catPaw";
  if (config.crowIntro) return "crow";
  if (config.cloudMode === "intro") return "cloud";
  if (config.waterIntro) return "water";
  return null;
}

function readMechanicTutorialHistory() {
  try {
    const saved = JSON.parse(
      globalThis.localStorage?.getItem(MECHANIC_TUTORIAL_STORAGE_KEY) ?? "{}",
    );
    return saved && typeof saved === "object" ? saved : {};
  } catch {
    return {};
  }
}

function mechanicTutorialWasSeen(kind) {
  return Boolean(readMechanicTutorialHistory()[kind]);
}

function rememberMechanicTutorial(kind) {
  try {
    const history = readMechanicTutorialHistory();
    history[kind] = true;
    globalThis.localStorage?.setItem(
      MECHANIC_TUTORIAL_STORAGE_KEY,
      JSON.stringify(history),
    );
  } catch {
    // The tutorial may repeat next session when storage is unavailable.
  }
}

function forceMechanicTutorialFromUrl(kind) {
  return new URLSearchParams(globalThis.location?.search ?? "").get("tutorial") === kind;
}

function clearMechanicTutorial() {
  if (mechanicTutorialFrame !== null) cancelAnimationFrame(mechanicTutorialFrame);
  mechanicTutorialFrame = null;
  mechanicTutorial = null;
}

function finishMechanicTutorial() {
  if (!mechanicTutorial) return;
  const { kind } = mechanicTutorial;
  rememberMechanicTutorial(kind);
  clearMechanicTutorial();
  requestMazeDraw();
  finishLevelReadyState();
}

function animateMechanicTutorial(timestamp) {
  if (!mechanicTutorial) return;
  if (mechanicTutorial.startedAt === null) mechanicTutorial.startedAt = timestamp;
  mechanicTutorial.progress = clamp(
    (timestamp - mechanicTutorial.startedAt) / MECHANIC_TUTORIAL_DURATION_MS,
    0,
    1,
  );
  drawMaze();
  if (mechanicTutorial.progress >= 1) finishMechanicTutorial();
  else mechanicTutorialFrame = requestAnimationFrame(animateMechanicTutorial);
}

function startMechanicTutorial(kind) {
  clearMechanicTutorial();
  mechanicTutorial = { kind, progress: 0, startedAt: null };
  mazeEl.setAttribute("aria-busy", "true");
  setMovementControlsEnabled(false);
  setPowerControlsEnabled(false);
  setMessage(MECHANIC_TUTORIAL_MESSAGES[kind] ?? "Watch how this maze element works.");
  updatePowerUI();
  requestMazeDraw();
  if (!canAnimateMouseMotion()) finishMechanicTutorial();
  else mechanicTutorialFrame = requestAnimationFrame(animateMechanicTutorial);
}

function maybeStartMechanicTutorial(introMode = "full") {
  if (introMode === "retry") return false;
  const kind = mechanicTutorialKindForLevel();
  if (!kind || (mechanicTutorialWasSeen(kind) && !forceMechanicTutorialFromUrl(kind))) {
    return false;
  }
  startMechanicTutorial(kind);
  return true;
}

function finishLevelReadyState() {
  mazeEl.setAttribute("aria-busy", "false");
  setMovementControlsEnabled(true);
  setPowerControlsEnabled(true);
  const config = currentLevelConfig();
  const rockMode = config.rockMode;
  const hingedWallCount = config.hingedWallCount ?? 0;
  if (config.milkCount && level === 3) setMessage("Push the bottle over, then step onto the milk to drink it.");
  else if (config.carMode && level === 9) setMessage("Every step wakes the catcher. Keep moving and do not let it reach you.");
  else if (config.cockroachMode && level === 15) {
    setMessage("Every few steps, the cockroach may carry a cheese one or two squares away.");
  }
  else if (config.cockroachMode && level === 16) {
    setMessage("The cockroach may move cheese or unopened milk bottles one or two squares.");
  }
  else if (config.catPawMode && level === 27) {
    setMessage("Watch the board shadow. The cat warns you twice before its paw strikes.");
  }
  else if (config.catPawMode && config.carMode && level === 28) {
    setMessage("Outrun the catcher and leave every shadow before the cat strikes.");
  }
  else if (config.crowMode && level === 37) {
    setMessage("The crow hunts open ground. Reach the thick outer frame before it dives.");
  }
  else if (config.waterIntro) {
    setMessage("The flood starts here after four moves. Keep ahead and protect the cheese.");
  }
  else if (config.waterMode) {
    setMessage("Keep moving. The flood advances through every open passage after each step.");
  }
  else if (config.tunnelIntro) {
    setMessage("Step into a tunnel to emerge from another. Each exit closes after use.");
  }
  else if (config.rotatingTilesIntro) {
    setMessage("Every step moves the marked floor, together with its walls and everything on it.");
  }
  else if (config.crystalIntro) setMessage("Crystal Vision is now unlocked. Its first use is free.");
  else if (config.tornadoIntro && !isPowerUnlocked("tornado")) {
    setMessage("Collect the cheeses. The maze may still surprise you.");
  }
  else if (config.tornadoIntro) setMessage("The Maze Tornado is unlocked. Its first use is free.");
  else if (config.hammerIntro && !isPowerUnlocked("hammer")) {
    setMessage("Keep exploring. The Hammer will unlock when it can open a useful route.");
  }
  else if (config.hammerIntro) setMessage("The Hammer is unlocked. Break an internal wall to open a new route.");
  else if (config.fishingIntro && !isPowerUnlocked("fishing")) {
    setMessage("Keep moving. The Fishing Rod will unlock when a cheese enters diagonal range.");
  }
  else if (config.fishingIntro) setMessage("The Fishing Rod is unlocked. Reel in cheese from a nearby diagonal square.");
  else if (config.rocketIntro && !isPowerUnlocked("rocket")) {
    setMessage("Keep exploring. The Rocket will unlock when it can make a useful jump.");
  }
  else if (config.rocketIntro) setMessage("The Rocket is unlocked. Fly across walls to a nearby square.");
  else if (rockMode === "hidden") setMessage("A cheese is hidden beneath the rock.");
  else if (rockMode === "blocker") setMessage("Push the rock aside to open the shorter route.");
  else if (rockMode === "search") setMessage("One of these rocks is hiding the cheese.");
  else if (hingedWallCount === 1) setMessage("The hinged wall can pivot and close a passage.");
  else if (hingedWallCount > 1) setMessage("Hinged walls may reshape your route.");
  else if (config.cloudMode) setMessage("Moving clouds will briefly hide parts of the route.");
  else setMessage("Study the maze, then swipe one cell at a time.");
  startCloudRun();
  render();
  saveCampaignState();
}

function finishSwipeTutorial() {
  clearSwipeTutorial();
  const needsCheeseTutorial =
    level === 1 &&
    (!mechanicTutorialWasSeen("cheese") || forceMechanicTutorialFromUrl("cheese"));
  if (needsCheeseTutorial) {
    startMechanicTutorial("cheese");
    return;
  }
  finishLevelReadyState();
}

function startSwipeTutorial() {
  clearSwipeTutorial();
  const directions = ["up", "right", "down", "left"];
  let directionIndex = 0;
  swipeTutorialActive = true;
  swipeTutorialEl.hidden = false;
  mazeEl.setAttribute("aria-busy", "true");
  setMovementControlsEnabled(false);
  setPowerControlsEnabled(false);
  setMessage("Swipe in any direction to move the mouse.");
  updatePowerUI();

  const playNextDirection = () => {
    if (!swipeTutorialActive) return;
    if (directionIndex >= directions.length) {
      finishSwipeTutorial();
      return;
    }
    swipeTutorialEl.dataset.direction = directions[directionIndex];
    swipeTutorialDemoEl.classList.remove("playing");
    void swipeTutorialDemoEl.offsetWidth;
    swipeTutorialDemoEl.classList.add("playing");
    directionIndex += 1;
    swipeTutorialTimer = setTimeout(playNextDirection, 740);
  };

  playNextDirection();
}

function finishLevelIntroAnimation() {
  if (!levelIntro) return;
  const introMode = levelIntro.mode;
  levelIntro = null;
  levelIntroFrame = null;
  mouseFacingDirection = initialFacingForStart(levelStart);
  requestMazeDraw();
  const needsSwipeTutorial =
    level === 1 &&
    introMode !== "retry" &&
    (!worldProgress.completedLevels[0] || forceMechanicTutorialFromUrl("cheese"));
  if (needsSwipeTutorial) {
    startSwipeTutorial();
    return;
  }
  const config = LEVEL_CONFIGS[level - 1] ?? {};
  if (maybeStartMechanicTutorial(introMode)) return;
  const needsCrystalTutorial =
    level === 7 &&
    config.crystalIntro &&
    introMode !== "retry" &&
    (!crystalTutorialWasSeen() || forceCrystalTutorialFromUrl());
  if (needsCrystalTutorial) {
    startCrystalTutorial();
    return;
  }
  const needsTunnelTutorial =
    config.tunnelIntro &&
    introMode !== "retry" &&
    (!tunnelTutorialWasSeen() || forceTunnelTutorialFromUrl());
  if (needsTunnelTutorial) {
    startTunnelTutorial();
    return;
  }
  const needsRotatingTilesTutorial =
    config.rotatingTilesIntro &&
    introMode !== "retry" &&
    (!rotatingTilesTutorialWasSeen() || forceRotatingTilesTutorialFromUrl());
  if (needsRotatingTilesTutorial) {
    startRotatingTilesTutorial();
    return;
  }
  if (introMode !== "retry" && maybeStartPowerIntroTutorial()) return;
  finishLevelReadyState();
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
  const completedCarMotion = carMotion;
  const completedRotatingAnimation = rotatingTilesAnimation?.synchronizedWithMouse
    ? rotatingTilesAnimation
    : null;
  const target = completedMotion.to;
  const queuedDirection = queuedMoveDirection;
  mouseMotion = null;
  mouseMotionFrame = null;
  carMotion = null;
  carMotionFrame = null;
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
    const coveredTunnel = tunnels.find(
      (tunnel) =>
        !tunnel.sealed &&
        keyOf(tunnel) === keyOf(completedMotion.rockPush.to),
    );
    if (coveredTunnel) coveredTunnel.sealed = true;
  }
  if (completedCarMotion && car) {
    car = { ...car, ...completedCarMotion.to };
  }
  const objectivePushes = uniqueObjectivePushes(
    completedCarMotion?.objectivePush,
    completedMotion.waterAdvance?.pushes ?? [],
  );
  for (const push of objectivePushes) applyObjectivePush(push);
  mouse = { ...target };
  if (completedRotatingAnimation) {
    commitRotatingTilesAnimation(completedRotatingAnimation);
  }
  movesLeft -= 1;
  noteCloudPlayerAction();
  if (currentLevelConfig().cockroachMode && !cockroachDefeated) {
    cockroachMovesSinceAction += 1;
  }
  advanceCatPawClockAfterMouseMove();
  advanceCrowClockAfterMouseMove();
  const waterLoss = commitWaterAdvance(completedMotion.waterAdvance, {
    applyPushes: false,
  });
  render();
  if (waterLoss) {
    loseLevel(waterLoss);
    return;
  }

  const finishTurn = () => {
    if (
      completedCarMotion &&
      carCatchesMouse(
        maze,
        completedMotion.from,
        mouse,
        completedCarMotion.from,
        car,
      )
    ) {
      const captureCar = keyOf(mouse) === keyOf(car)
        ? completedCarMotion.from
        : car;
      startCarCaptureAnimation(captureCar, mouse);
      return;
    }

    if (completedMotion.hingedWallTriggerId !== null) {
      saveCampaignState();
      return;
    }

    resolvePlayerArrival(queuedDirection);
  };

  finishTurn();
}

function resolvePlayerArrival(queuedDirection = null) {
  if (maybeStartCatPawStrike(queuedDirection)) return;
  if (maybeStartCrowStrike(queuedDirection)) return;
  const reachedTunnel = activeTunnelAt(mouse);
  if (reachedTunnel && startTunnelTravel(reachedTunnel, queuedDirection)) return;
  const reachedCheese = cheeseAt(mouse);
  if (reachedCheese) {
    startCheeseEatingAnimation(reachedCheese);
    return;
  }
  const reachedMilk = milkPuddleAt(mouse);
  if (reachedMilk) {
    startMilkDrinkAnimation(reachedMilk);
    return;
  }
  if (maybeStartPowerIntroTutorial()) return;
  if (movesLeft <= 0) {
    startMouseDefeatAnimation();
    return;
  }
  if (maybeStartCockroach(queuedDirection)) return;
  setMovementControlsEnabled(true);
  setPowerControlsEnabled(true);
  const pawWarning = catPawThreat ? catPawMovesUntilStrike() : Number.POSITIVE_INFINITY;
  const crowWarning = crowThreat ? crowMovesUntilStrike() : Number.POSITIVE_INFINITY;
  setMessage(
    crowWarning === 1
      ? "The crow is very close. Touch a wall before the next move."
      : crowWarning === 2
        ? "A crow-shaped shadow appeared. Find cover beside a wall."
        : pawWarning === 1
      ? "The shadow is darker. Leave the marked edge now."
      : pawWarning === 2
        ? "A shadow appeared. Move away from the marked edge."
        : movesLeft <= 5
          ? "Only a few careful steps remain."
          : "Good. Keep planning each cell.",
    pawWarning <= 2 || crowWarning <= 2,
  );
  saveCampaignState();
  if (queuedDirection) move(queuedDirection);
}

function prepareStationaryWorldTurn(
  actionAnimation,
  projectedSpill = null,
  advanceCar = true,
) {
  if (car && advanceCar) {
    const nextCar = nextCarStepForTurn(maze, car, mouse);
    carMotion = {
      from: { ...car },
      to: nextCar,
      objectivePush: carObjectivePushForStep(car, nextCar),
      progress: 0,
      startedAt: null,
    };
    carFacingDirection = carDirectionBetween(
      carMotion.from,
      carMotion.to,
      carFacingDirection,
    );
  }
  const objectivePushes = uniqueObjectivePushes(
    carMotion?.objectivePush,
    actionAnimation.waterAdvance?.pushes ?? [],
  );
  startSynchronizedRotatingTilesTurn(
    mouse,
    null,
    carMotion?.to ?? car,
    objectivePushes,
  );
  actionAnimation.waterAdvance = rotatePendingWaterAdvance(
    actionAnimation.waterAdvance,
  );
  if (projectedSpill && rotatingTilesAnimation) {
    addRotatingEntityMotion(
      rotatingTilesAnimation.entityMotions,
      rotatingTilesAnimation.destinations,
      "milk-spill",
      actionAnimation.bottleId,
      projectedSpill,
    );
  }
}

function updateStationaryWorldTurn(progress) {
  if (carMotion) carMotion.progress = progress;
  if (rotatingTilesAnimation?.synchronizedWithMouse) {
    rotatingTilesAnimation.progress = clamp(
      (progress - ROTATING_TILES_START_DELAY_RATIO) /
        (1 - ROTATING_TILES_START_DELAY_RATIO),
      0,
      1,
    );
  }
}

function commitStationaryWorldTurn(actionAnimation) {
  const mouseFrom = { ...mouse };
  const completedCarMotion = carMotion;
  const completedRotatingAnimation = rotatingTilesAnimation?.synchronizedWithMouse
    ? rotatingTilesAnimation
    : null;
  carMotion = null;
  carMotionFrame = null;
  if (completedCarMotion && car) car = { ...car, ...completedCarMotion.to };
  const objectivePushes = uniqueObjectivePushes(
    completedCarMotion?.objectivePush,
    actionAnimation.waterAdvance?.pushes ?? [],
  );
  for (const push of objectivePushes) applyObjectivePush(push);
  if (completedRotatingAnimation) commitRotatingTilesAnimation(completedRotatingAnimation);
  movesLeft -= 1;
  noteCloudPlayerAction();
  if (currentLevelConfig().cockroachMode && !cockroachDefeated) {
    cockroachMovesSinceAction += 1;
  }
  advanceCatPawClockAfterMouseMove();
  advanceCrowClockAfterMouseMove();
  const waterLoss = commitWaterAdvance(actionAnimation.waterAdvance, {
    applyPushes: false,
  });
  if (waterLoss) return { waterLoss, carCaught: false, captureCar: null };
  const carCaught = Boolean(
    completedCarMotion &&
      car &&
      carCatchesMouse(
        maze,
        mouseFrom,
        mouse,
        completedCarMotion.from,
        car,
      ),
  );
  const captureCar = carCaught
    ? keyOf(mouse) === keyOf(car)
      ? completedCarMotion.from
      : car
    : null;
  return { waterLoss: null, carCaught, captureCar };
}

function finishMilkKnockAnimation() {
  const animation = milkKnockAnimation;
  if (!animation) return;
  const bottle = milkBottles.find((candidate) => candidate.id === animation.bottleId);
  if (bottle) {
    bottle.knocked = true;
    bottle.direction = animation.direction;
    bottle.spill = { ...animation.spill };
  }
  const turnResult = commitStationaryWorldTurn(animation);
  milkKnockAnimation = null;
  milkKnockAnimationFrame = null;
  mazeEl.setAttribute("aria-busy", "false");
  render();
  if (turnResult.waterLoss) {
    loseLevel(turnResult.waterLoss);
    return;
  }
  if (turnResult.carCaught) {
    startCarCaptureAnimation(turnResult.captureCar, mouse);
    return;
  }
  if (maybeStartCatPawStrike()) return;
  if (maybeStartCrowStrike()) return;
  if (maybeStartPowerIntroTutorial()) return;
  if (movesLeft <= 0) {
    startMouseDefeatAnimation();
    return;
  }
  if (maybeStartCockroach()) return;
  setMovementControlsEnabled(true);
  setPowerControlsEnabled(true);
  setMessage("The milk has spilled. Move onto the puddle to drink it.");
  saveCampaignState();
}

function animateMilkKnock(timestamp) {
  if (!milkKnockAnimation) return;
  if (milkKnockAnimation.startedAt === null) milkKnockAnimation.startedAt = timestamp;
  milkKnockAnimation.progress = clamp(
    (timestamp - milkKnockAnimation.startedAt) / MILK_KNOCK_DURATION_MS,
    0,
    1,
  );
  updateStationaryWorldTurn(milkKnockAnimation.progress);
  drawMaze();
  if (milkKnockAnimation.progress >= 1) finishMilkKnockAnimation();
  else milkKnockAnimationFrame = requestAnimationFrame(animateMilkKnock);
}

function startMilkKnockAnimation(bottle, direction) {
  const spill = bottleSpillForDirection(bottle, direction.key);
  mouseFacingDirection = direction.key;
  milkKnockAnimation = {
    bottleId: bottle.id,
    direction: direction.key,
    spill,
    progress: 0,
    startedAt: null,
    waterAdvance: waterAdvanceForNextMove(),
  };
  prepareStationaryWorldTurn(milkKnockAnimation, spill, false);
  setMovementControlsEnabled(false);
  setPowerControlsEnabled(false);
  mazeEl.setAttribute("aria-busy", "true");
  setMessage("The mouse is tipping the milk bottle...");
  requestMazeDraw();
  if (!canAnimateMouseMotion()) finishMilkKnockAnimation();
  else milkKnockAnimationFrame = requestAnimationFrame(animateMilkKnock);
}

function finishMilkDrinkAnimation() {
  if (!milkDrinkAnimation) return;
  collectedMilkIds.add(milkDrinkAnimation.bottleId);
  milkDrinkAnimation = null;
  milkDrinkAnimationFrame = null;
  mazeEl.setAttribute("aria-busy", "false");
  render();
  if (allObjectivesComplete()) {
    winLevel();
    return;
  }
  if (movesLeft <= 0) {
    startMouseDefeatAnimation();
    return;
  }
  if (maybeStartCockroach()) return;
  setMovementControlsEnabled(true);
  setPowerControlsEnabled(true);
  setMessage(`${remainingObjectiveCount()} pantry objective${remainingObjectiveCount() === 1 ? "" : "s"} remaining.`);
  saveCampaignState();
}

function animateMilkDrink(timestamp) {
  if (!milkDrinkAnimation) return;
  if (milkDrinkAnimation.startedAt === null) milkDrinkAnimation.startedAt = timestamp;
  milkDrinkAnimation.progress = clamp(
    (timestamp - milkDrinkAnimation.startedAt) / MILK_DRINK_DURATION_MS,
    0,
    1,
  );
  drawMaze();
  if (milkDrinkAnimation.progress >= 1) finishMilkDrinkAnimation();
  else milkDrinkAnimationFrame = requestAnimationFrame(animateMilkDrink);
}

function startMilkDrinkAnimation(bottle) {
  milkDrinkAnimation = { bottleId: bottle.id, progress: 0, startedAt: null };
  setMovementControlsEnabled(false);
  setPowerControlsEnabled(false);
  mazeEl.setAttribute("aria-busy", "true");
  setMessage("The mouse is drinking the fresh milk...");
  requestMazeDraw();
  if (!canAnimateMouseMotion()) finishMilkDrinkAnimation();
  else milkDrinkAnimationFrame = requestAnimationFrame(animateMilkDrink);
}

function finishPieBiteAnimation() {
  const animation = pieBiteAnimation;
  if (!animation) return;
  eatenPieQuarterIds.add(animation.quarterId);
  const turnResult = commitStationaryWorldTurn(animation);
  pieBiteAnimation = null;
  pieBiteAnimationFrame = null;
  mazeEl.setAttribute("aria-busy", "false");
  render();
  if (turnResult.waterLoss) {
    loseLevel(turnResult.waterLoss);
    return;
  }
  if (turnResult.carCaught) {
    startCarCaptureAnimation(turnResult.captureCar, mouse);
    return;
  }
  if (allObjectivesComplete()) {
    winLevel();
    return;
  }
  if (movesLeft <= 0) {
    startMouseDefeatAnimation();
    return;
  }
  if (maybeStartCatPawStrike()) return;
  if (maybeStartCrowStrike()) return;
  if (maybeStartCockroach()) return;
  setMovementControlsEnabled(true);
  setPowerControlsEnabled(true);
  const remainingPie = remainingPieQuarters().length;
  setMessage(
    remainingPie > 0
      ? `${remainingPie} pie quarter${remainingPie === 1 ? "" : "s"} remaining.`
      : `${remainingObjectiveCount()} pantry objective${remainingObjectiveCount() === 1 ? "" : "s"} remaining.`,
  );
  saveCampaignState();
}

function animatePieBite(timestamp) {
  if (!pieBiteAnimation) return;
  if (pieBiteAnimation.startedAt === null) pieBiteAnimation.startedAt = timestamp;
  pieBiteAnimation.progress = clamp(
    (timestamp - pieBiteAnimation.startedAt) / PIE_BITE_DURATION_MS,
    0,
    1,
  );
  updateStationaryWorldTurn(pieBiteAnimation.progress);
  drawMaze();
  if (pieBiteAnimation.progress >= 1) finishPieBiteAnimation();
  else pieBiteAnimationFrame = requestAnimationFrame(animatePieBite);
}

function startPieBiteAnimation(quarter, direction) {
  if (!quarter || eatenPieQuarterIds.has(quarter.id) || pieBiteAnimation) return;
  mouseFacingDirection = direction.key;
  pieBiteAnimation = {
    quarterId: quarter.id,
    direction: direction.key,
    progress: 0,
    startedAt: null,
    waterAdvance: waterAdvanceForNextMove(),
  };
  prepareStationaryWorldTurn(pieBiteAnimation, null, false);
  setMovementControlsEnabled(false);
  setPowerControlsEnabled(false);
  mazeEl.setAttribute("aria-busy", "true");
  setMessage("The mouse is nibbling one quarter of the pie...");
  requestMazeDraw();
  if (!canAnimateMouseMotion()) finishPieBiteAnimation();
  else pieBiteAnimationFrame = requestAnimationFrame(animatePieBite);
}

function finishCarCaptureAnimation() {
  carCaptureAnimation = null;
  carCaptureAnimationFrame = null;
  mazeEl.setAttribute("aria-busy", "false");
  loseLevel("The remote-control catcher trapped the mouse in its net.");
}

function animateCarCapture(timestamp) {
  if (!carCaptureAnimation) return;
  if (carCaptureAnimation.startedAt === null) carCaptureAnimation.startedAt = timestamp;
  carCaptureAnimation.progress = clamp(
    (timestamp - carCaptureAnimation.startedAt) / CAR_CAPTURE_DURATION_MS,
    0,
    1,
  );
  drawMaze();
  if (carCaptureAnimation.progress >= 1) finishCarCaptureAnimation();
  else carCaptureAnimationFrame = requestAnimationFrame(animateCarCapture);
}

function startCarCaptureAnimation(captureCar = car, captureTarget = mouse) {
  gameOver = true;
  retryCostsAttempt = true;
  const direction = carDirectionBetween(
    captureCar,
    captureTarget,
    carFacingDirection,
  );
  carFacingDirection = direction;
  carCaptureAnimation = {
    progress: 0,
    startedAt: null,
    direction,
    car: { ...captureCar },
    target: { ...captureTarget },
  };
  controlsPanelEl.hidden = true;
  setMovementControlsEnabled(false);
  setPowerControlsEnabled(false);
  setMessage("The catcher has the mouse in its net...");
  mazeEl.setAttribute("aria-busy", "true");
  requestMazeDraw();
  if (!canAnimateMouseMotion()) finishCarCaptureAnimation();
  else carCaptureAnimationFrame = requestAnimationFrame(animateCarCapture);
}

function animateMouseMotion(timestamp) {
  if (!mouseMotion) return;
  if (mouseMotion.startedAt === null) mouseMotion.startedAt = timestamp;
  mouseMotion.progress = clamp(
    (timestamp - mouseMotion.startedAt) / MOUSE_MOVE_DURATION_MS,
    0,
    1,
  );
  if (carMotion) carMotion.progress = mouseMotion.progress;
  if (rotatingTilesAnimation?.synchronizedWithMouse) {
    rotatingTilesAnimation.progress = clamp(
      (mouseMotion.progress - ROTATING_TILES_START_DELAY_RATIO) /
        (1 - ROTATING_TILES_START_DELAY_RATIO),
      0,
      1,
    );
  }
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
    waterAdvance: waterAdvanceForNextMove(projectedRockPositions(rockPush)),
  };
  if (car) {
    const nextCar = nextCarStepForTurn(maze, car, mouse);
    carMotion = {
      from: { ...car },
      to: nextCar,
      objectivePush: carObjectivePushForStep(car, nextCar),
      progress: 0,
      startedAt: null,
    };
    carFacingDirection = carDirectionBetween(
      carMotion.from,
      carMotion.to,
      carFacingDirection,
    );
  }
  startSynchronizedRotatingTilesTurn(
    target,
    rockPush,
    carMotion?.to ?? car,
    uniqueObjectivePushes(
      carMotion?.objectivePush,
      mouseMotion.waterAdvance?.pushes ?? [],
    ),
  );
  mouseMotion.waterAdvance = rotatePendingWaterAdvance(mouseMotion.waterAdvance);
  movementPanelEl.classList.add("moving");
  mazeEl.setAttribute("aria-busy", "true");

  if (hingedWallTrigger) activateHingedWall(hingedWallTrigger);

  if (!canAnimateMouseMotion()) {
    mouseMotion.progress = 1;
    if (rotatingTilesAnimation?.synchronizedWithMouse) {
      rotatingTilesAnimation.progress = 1;
    }
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

function hingedWallObjectivePush(wall) {
  if (!wall?.triggerFrom || !wall.destination) return null;
  const objectCell = cellsSeparatedBySegment(wall.destination).find(
    (cell) => keyOf(cell) !== keyOf(wall.triggerFrom),
  );
  if (!objectCell || !isInside(objectCell.row, objectCell.col)) return null;
  return objectivePushForStep(wall.triggerFrom, objectCell).push;
}

function finishHingedWallAnimation() {
  if (!hingedWallAnimation) return;
  applyObjectivePush(hingedWallAnimation.objectivePush);
  const wall = hingedWalls.find((candidate) => candidate.id === hingedWallAnimation.wallId);
  if (wall && !wall.destroyed) {
    setSegmentWall(maze, wall.destination, true);
    wall.activated = true;
    wall.moving = false;
  }
  hingedWallAnimation = null;
  hingedWallAnimationFrame = null;
  mazeEl.setAttribute("aria-busy", "false");
  if (maybeStartCatPawStrike()) return;
  const reachedCheese = cheeseAt(mouse);
  if (reachedCheese) {
    startCheeseEatingAnimation(reachedCheese);
    return;
  }
  if (movesLeft <= 0) {
    startMouseDefeatAnimation();
    return;
  }
  if (maybeStartCockroach()) return;
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
  const objectivePush = hingedWallObjectivePush(wall);
  wall.moving = true;
  setSegmentWall(maze, wall.source, false);
  hingedWallAnimation = {
    wallId: wall.id,
    source: { ...wall.source },
    destination: { ...wall.destination },
    hinge: { ...wall.hinge },
    objectivePush,
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
    swipeTutorialActive ||
    mechanicTutorial ||
    crystalTutorialActive ||
    tornadoTutorialActive ||
    powerIntroTutorialActive ||
    tunnelTutorial ||
    tunnelAnimation ||
    rotatingTilesAnimation ||
    rotatingTilesTutorialActive ||
    crystalRevealing ||
    fishingCatchAnimating ||
    rocketFlightAnimation ||
    hingedWallAnimation ||
    milkKnockAnimation ||
    milkDrinkAnimation ||
    pieBiteAnimation ||
    carMotion ||
    carCaptureAnimation ||
    cockroachAnimation ||
    catPawAnimation ||
    crowAnimation ||
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
  const blockingPieQuarter = pieQuarterAt(target);
  if (blockingPieQuarter) {
    if (eatenPieQuarterIds.has(blockingPieQuarter.id)) {
      showInvalidMove("Finish the remaining pie quarters before crossing the dish.");
      return;
    }
    if (
      keyOf(mouse) !== keyOf(blockingPieQuarter.approach) ||
      dir.key !== blockingPieQuarter.direction
    ) {
      showInvalidMove("Reach the open side of that pie quarter first.");
      return;
    }
    startPieBiteAnimation(blockingPieQuarter, dir);
    return;
  }
  const blockingBottle = milkBottleAt(target);
  if (blockingBottle) {
    if (blockingBottle.knocked) {
      showInvalidMove("The fallen bottle blocks that square.");
      return;
    }
    const spill = bottleSpillForDirection(blockingBottle, dir.key);
    const bottleCell = maze[blockingBottle.row][blockingBottle.col];
    if (
      !spill ||
      !isInside(spill.row, spill.col) ||
      bottleCell.walls[dir.wall] ||
      milkBottleAt(spill) ||
      rockAt(spill) ||
      activeTunnelAt(spill) ||
      pieQuarterAt(spill) ||
      waterCellIsFlooded(spill) ||
      remainingCheeseTargets().some((cheese) => keyOf(cheese) === keyOf(spill)) ||
      (car && keyOf(car) === keyOf(spill))
    ) {
      showInvalidMove("The bottle cannot fall in that direction.");
      return;
    }
    startMilkKnockAnimation(blockingBottle, dir);
    return;
  }
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
    milkBottleAt(rockDestination) ||
    pieQuarterAt(rockDestination) ||
    Boolean(car && keyOf(car) === keyOf(rockDestination)) ||
    waterCellIsFlooded(rockDestination) ||
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
  collectedCheeseKeys.add(cheeseIdentity(cheeseEatingTarget));
  cheeseEatingAnimating = false;
  cheeseEatingFrame = null;
  cheeseEatingProgress = 1;
  const remaining = remainingCheeseTargets();
  cheeseEaten = remaining.length === 0 && remainingMilkBottles().length === 0;
  cheeseEatingTarget = null;
  syncActiveExit();
  render();

  if (allObjectivesComplete()) {
    winLevel();
    return;
  }

  gameOver = false;
  if (movesLeft <= 0) {
    startMouseDefeatAnimation();
    return;
  }
  const tornadoOpportunity = findTornadoTutorialOpportunity();
  if (tornadoOpportunity) {
    startTornadoTutorial(tornadoOpportunity);
    return;
  }
  if (maybeStartPowerIntroTutorial()) return;
  if (maybeStartCockroach()) return;
  setMovementControlsEnabled(true);
  setPowerControlsEnabled(true);
  setMessage(`${remainingObjectiveCount()} pantry objective${remainingObjectiveCount() === 1 ? "" : "s"} remaining.`);
  saveCampaignState();
}

function startCheeseEatingAnimation(target = cheeseAt(mouse)) {
  if (!target || cheeseEatingAnimating || cheeseWasCollected(target)) return;
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
    cheeseTargets.length > 1 || milkBottles.length
      ? "The mouse found one of the pantry objectives."
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
  clearCockroachAnimation();
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
  clearCloudRun();
  clearPowerTransformation();
  clearCrystalReveal();
  clearFishingCatchAnimation();
  clearRocketFlightAnimation();
  clearCockroachAnimation();
  clearPowerTargetingState();
  setMovementControlsEnabled(false);
  setPowerControlsEnabled(false);
  updateMoveWarningUI();
  mazeEl.classList.add("win");
  requestMazeDraw();
  const completedLevel = level;
  recordWorldCompletion(completedLevel);
  updateAttemptUI();
  saveCampaignState();
  showWorldMap(
    completedLevel < WORLD_LEVELS.length ? completedLevel + 1 : null,
  );
}

function loseLevel(message = "No moves left. Retry and plan a quieter route.") {
  gameOver = true;
  retryCostsAttempt = true;
  clearCloudRun();
  clearCheeseEatingAnimation();
  clearPieBiteAnimation();
  clearPowerTransformation();
  clearCrystalReveal();
  clearFishingCatchAnimation();
  clearRocketFlightAnimation();
  clearCockroachAnimation();
  clearPowerTargetingState();
  setMovementControlsEnabled(false);
  setPowerControlsEnabled(false);
  updateMoveWarningUI();
  controlsPanelEl.hidden = false;
  retryButton.hidden = false;
  updateAttemptUI();
  setMessage(
    attempts > 0 ? message : "No attempts available. Wait for the next one to retry.",
    true,
  );
  saveCampaignState();
}

function showCampaignComplete() {
  campaignComplete = true;
  gameOver = true;
  retryCostsAttempt = false;
  clearCloudRun();
  clearLevelIntroAnimation();
  clearSwipeTutorial();
  clearCrystalTutorial();
  clearTornadoTutorial();
  clearCheeseEatingAnimation();
  clearPieBiteAnimation();
  clearMouseDefeatAnimation();
  clearPowerTransformation();
  clearCrystalReveal();
  clearFishingCatchAnimation();
  clearRocketFlightAnimation();
  clearCockroachAnimation();
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
  initialMilkBottles = [];
  milkBottles = [];
  collectedMilkIds = new Set();
  initialPie = null;
  pie = null;
  eatenPieQuarterIds = new Set();
  initialCar = null;
  car = null;
  clearMilkAnimations();
  clearCarAnimations();
  initialHingedWalls = [];
  hingedWalls = [];
  clearHingedWallAnimation();
  levelStart = { ...START };
  mouse = { ...START };
  movesLeft = 0;
  render();
  setMessage(`Game over. You cleared the first ${WORLD_LEVELS.length} levels.`);
  retryButton.disabled = true;
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
    else if (getFishingCatchTarget()) setMessage("Tap a highlighted objective to catch it.", true);
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

testResetButton.addEventListener("click", resetTestGame);
levelSheetCloseButton.addEventListener("click", closeWorldLevelSheet);
levelSheetBackdropEl.addEventListener("click", closeWorldLevelSheet);
levelSheetPlayButton.addEventListener("click", () => void startWorldLevel(selectedWorldLevel));
worldMapEl.addEventListener("scroll", syncWorldChapterHeaderToScroll, { passive: true });

document.addEventListener?.("keydown", (event) => {
  if (event.key === "Escape" && !levelSheetEl.hidden) {
    closeWorldLevelSheet();
    return;
  }
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
globalThis.addEventListener?.("popstate", () => {
  if (!gameShellEl.hidden) showWorldMap();
});

new ResizeObserver(requestMazeDraw).observe(mazeEl);

initializeEconomySystem();
initializeAttemptSystem();
setControlMode(controlMode);
restoreCampaignState();
initializeWorldExperience();

const testLevelFromUrl = (() => {
  try {
    if (!globalThis.location?.search || typeof URLSearchParams !== "function") return null;
    const value = Number(new URLSearchParams(globalThis.location.search).get("testLevel"));
    return Number.isInteger(value) && value >= 1 && value <= LEVEL_CONFIGS.length
      ? value
      : null;
  } catch {
    return null;
  }
})();
const testUnlockFromUrl = (() => {
  try {
    if (!globalThis.location?.search || typeof URLSearchParams !== "function") return null;
    const value = Number(new URLSearchParams(globalThis.location.search).get("testUnlock"));
    return Number.isInteger(value) && value >= 1 && value <= LEVEL_CONFIGS.length
      ? value
      : null;
  } catch {
    return null;
  }
})();
if (testUnlockFromUrl !== null) {
  worldProgress.unlockedLevel = Math.max(worldProgress.unlockedLevel, testUnlockFromUrl);
  for (let index = 0; index < testUnlockFromUrl - 1; index += 1) {
    worldProgress.completedLevels[index] = true;
  }
}
if (testLevelFromUrl !== null) {
  worldProgress.unlockedLevel = Math.max(worldProgress.unlockedLevel, testLevelFromUrl);
  level = testLevelFromUrl;
  void startWorldLevel(testLevelFromUrl).then(() => {
    globalThis.__mouseMazeTest = {
      move,
      state: () => ({
        mouse: { ...mouse },
        movesLeft,
        shortestPath: shortestPath.map((cell) => ({ row: cell.row, col: cell.col })),
        cheeses: cheeseTargets.map((cell) => ({ row: cell.row, col: cell.col })),
        milkBottles: milkBottles.map((bottle) => ({
          id: bottle.id,
          row: bottle.row,
          col: bottle.col,
          knocked: bottle.knocked,
          spill: bottle.spill ? { ...bottle.spill } : null,
        })),
        collectedCheeses: [...collectedCheeseKeys],
        pie: pie
          ? {
              row: pie.row,
              col: pie.col,
              quarters: pie.quarters.map((quarter) => ({ ...quarter })),
            }
          : null,
        eatenPieQuarters: [...eatenPieQuarterIds],
        remainingObjectives: remainingObjectiveCount(),
        fishingTargets: getFishingCatchTargets().map((target) => ({
          ...target,
          mouseDestination: target.mouseDestination
            ? { ...target.mouseDestination }
            : null,
        })),
        rocketTargets: getRocketTargets().map((target) => ({
          ...target,
          mouseDestination: target.mouseDestination
            ? { ...target.mouseDestination }
            : null,
        })),
        tornadoUnlocked: isPowerUnlocked("tornado"),
        tornadoTutorialActive,
        cockroach: {
          movesSinceAction: cockroachMovesSinceAction,
          nextTrigger: cockroachNextTrigger,
          actionsUsed: cockroachActionsUsed,
          animating: Boolean(cockroachAnimation),
        },
        catPaw: {
          movesSinceStrike: catPawMovesSinceStrike,
          nextTrigger: catPawNextTrigger,
          movesUntilStrike: catPawMovesUntilStrike(),
          threat: catPawThreat
            ? { ...catPawThreat, cells: catPawThreat.cells.map((cell) => ({ ...cell })) }
            : null,
          striking: Boolean(catPawAnimation),
        },
        crow: {
          active: Boolean(currentLevelConfig().crowMode),
          movesSinceStrike: crowMovesSinceStrike,
          nextTrigger: crowNextTrigger,
          movesUntilStrike: crowMovesUntilStrike(),
          threat: crowThreat
            ? { ...crowThreat, cells: crowThreat.cells.map((cell) => ({ ...cell })) }
            : null,
          striking: Boolean(crowAnimation),
          mouseProtected: crowCellTouchesOuterWall(mouse),
        },
        tunnels: tunnels.map((tunnel) => ({
          id: tunnel.id,
          row: tunnel.row,
          col: tunnel.col,
          sealed: tunnel.sealed,
        })),
        water: {
          active: waterIsActive(),
          origin: { ...waterOrigin },
          moveCount: waterMoveCount,
          flooded: [...floodedWaterKeys],
          warning: waterWarningKeys(),
        },
        tunnelTutorialActive: Boolean(tunnelTutorial),
        tunnelTravelActive: Boolean(tunnelAnimation),
        activeVariantIndex,
      }),
    };
    mazeEl.dataset.testShortestPath = JSON.stringify(shortestPath);
    mazeEl.dataset.testCheeses = JSON.stringify(cheeseTargets);
    mazeEl.dataset.testPie = JSON.stringify(pie);
    mazeEl.dataset.testVariant = String(activeVariantIndex);
    mazeEl.dataset.testAdversities = JSON.stringify(
      Object.entries(ADVERSITY_MODE_PROPERTIES)
        .filter(([, properties]) => properties.some((property) => activeLevelConfig[property]))
        .map(([adversity]) => adversity),
    );
  });
}
