import { mkdir, readFile, writeFile } from "node:fs/promises";
import vm from "node:vm";

const sourceUrl = new URL("../game.js", import.meta.url);
const outputUrl = new URL("../levels.generated.js", import.meta.url);
const chunksUrl = new URL("../levels/", import.meta.url);
const levelsPerSection = 10;
const source = await readFile(sourceUrl, "utf8");
const gameWithoutBootstrap = source.replace(
  /\ninitializePerformanceMetrics\(\);[\s\S]*$/,
  "\n",
);
const appendMissing = process.argv.includes("--append-missing");
const searchAttempts = process.argv.includes("--search-attempts");
const levelsArgument = process.argv.find((argument) => argument.startsWith("--levels="));
const regenerateLevelIndexes = new Set(
  (levelsArgument?.slice("--levels=".length) ?? "")
    .split(",")
    .map((value) => Number(value.trim()) - 1)
    .filter((value) => Number.isInteger(value) && value >= 0),
);
if (levelsArgument && !regenerateLevelIndexes.size) {
  throw new Error(`No valid level numbers found in ${levelsArgument}.`);
}
const existingLevels = appendMissing || regenerateLevelIndexes.size
  ? await readFile(outputUrl, "utf8").catch(() => "")
  : "";

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
    dataset: {},
    disabled: false,
    hidden: false,
    offsetWidth: 0,
    style: { setProperty() {} },
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
const sandbox = {
  addEventListener() {},
  Image: class {
    addEventListener() {}
    decode() { return Promise.resolve(); }
  },
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
sandbox.window = sandbox;
sandbox.__regenerateLevelIndexes = [...regenerateLevelIndexes];
sandbox.__searchRegeneratedAttempts = searchAttempts;
sandbox.__selectiveLevelGeneration = Boolean(levelsArgument);

if (existingLevels) {
  vm.runInNewContext(existingLevels, sandbox, {
    filename: "levels.generated.js",
    timeout: 30000,
  });
}

const generation = `
const reusableVariants = globalThis.__MOUSE_MAZE_PREGENERATED_LEVELS__;
const regenerateLevelIndexes = new Set(globalThis.__regenerateLevelIndexes ?? []);
const selectiveLevelGeneration = Boolean(globalThis.__selectiveLevelGeneration);
// buildLevelVariant normally prefers the already generated data. Temporarily
// hide it so explicitly selected levels are actually rebuilt.
globalThis.__MOUSE_MAZE_PREGENERATED_LEVELS__ = undefined;
globalThis.__generatedLevelVariants = [];

function needsFullGameplayValidation(config, variantIndex) {
  const resolved = resolveLevelConfigForVariant(config, variantIndex);
  return Boolean(resolved.activeAdversities?.length);
}

function calibrateFullGameplayVariant(config, levelIndex, variantIndex, variant) {
  const savedPregenerated = globalThis.__MOUSE_MAZE_PREGENERATED_LEVELS__;
  const candidateLevels = [];
  candidateLevels[levelIndex] = [];
  globalThis.__MOUSE_MAZE_PREGENERATED_LEVELS__ = candidateLevels;
  level = levelIndex + 1;
  try {
    const allowanceVariations = config.difficultyCode === "I"
      ? [0, 1, 0, -1, 0]
      : [0, 2, -1, 1, -2];
    const allowanceTarget = Math.max(
      1,
      (DIFFICULTY_MOVE_ALLOWANCE_GUIDELINE[config.difficultyCode] ?? 3) +
        allowanceVariations[variantIndex % allowanceVariations.length] +
        (config.moveAllowanceAdjustment ?? 0),
    );
    const structuralDistance = Math.max(
      variant.path.length - 1,
      (variant.alternatePath?.length ?? 1) - 1,
    ) + (variant.spiderWebExtraCost ?? 0);
    const maximumLuckBudget = Number.isFinite(
      variant.carrotSolution?.allPatchesDistance,
    )
      ? variant.carrotSolution.allPatchesDistance - 1
      : MAX_MOVES_PER_LEVEL;
    const minimumBudget = Math.min(
      MAX_MOVES_PER_LEVEL,
      maximumLuckBudget,
      structuralDistance + allowanceTarget,
    );
    const maximumBudget = Math.min(
      MAX_MOVES_PER_LEVEL,
      maximumLuckBudget,
      structuralDistance + Math.max(allowanceTarget, 12),
    );
    const resolved = resolveLevelConfigForVariant(config, variantIndex);
    const cockroachTriggers = resolved.cockroachMode
      ? Array.from(
          { length: COCKROACH_MAX_TRIGGER_MOVES - COCKROACH_MIN_TRIGGER_MOVES + 1 },
          (_, index) => COCKROACH_MIN_TRIGGER_MOVES + index,
        )
      : [null];
    const catPawTriggers = resolved.catPawMode ? CAT_PAW_TRIGGER_MOVES : [null];
    const triggerCombinationCount = cockroachTriggers.length * catPawTriggers.length;
    const scenarioSalts = triggerCombinationCount >= 6
      ? [0]
      : triggerCombinationCount >= 3
        ? [0, 0x9e3779b9]
        : [0, 0x9e3779b9, 0x3c6ef372, 0xdaa66d2b, 0x78dde6e4, 0x1715609d];
    let calibratedScenarios = null;
    let selected = null;
    let selectedBudget = null;
    for (let budget = minimumBudget; budget <= maximumBudget; budget += 1) {
      const scenarios = [];
      for (const cockroachTrigger of cockroachTriggers) {
        for (const catPawTrigger of catPawTriggers) {
          for (const seedOffset of scenarioSalts) {
            const scenarioSeedOffset = (
              seedOffset ^
              Math.imul((cockroachTrigger ?? 11) + 1, 0x45d9f3b) ^
              Math.imul((catPawTrigger ?? 13) + 1, 0x119de1f3)
            ) >>> 0;
            const trial = { ...variant, moveLimit: budget, adversityPlan: null };
            candidateLevels[levelIndex][variantIndex] = trial;
            loadLevelVariant(config, variantIndex, "retry");
            if (cockroachTrigger !== null) {
              cockroachMovesSinceAction = 0;
              cockroachNextTrigger = cockroachTrigger;
            }
            if (catPawTrigger !== null) {
              catPawMovesSinceStrike = 0;
              catPawNextTrigger = catPawTrigger;
            }
            const forecast = buildCrystalForecast(
              variant.path.slice(1),
              scenarioSeedOffset,
            );
            scenarios.push({
              budget,
              forecast,
              seedOffset: scenarioSeedOffset,
              cockroachInitialTrigger: cockroachTrigger,
              catPawInitialTrigger: catPawTrigger,
            });
          }
        }
      }
      scenarios.sort((first, second) =>
        Number(second.forecast.complete) - Number(first.forecast.complete) ||
        first.forecast.frames.length - second.forecast.frames.length
      );
      const completeScenarios = scenarios.filter((scenario) => scenario.forecast.complete);
      globalThis.__lastGameplayCalibrationDiagnostic = {
        complete: completeScenarios.length,
        total: scenarios.length,
        actionRange: completeScenarios.length
          ? [
              Math.min(...completeScenarios.map((scenario) => scenario.forecast.frames.length)),
              Math.max(...completeScenarios.map((scenario) => scenario.forecast.frames.length)),
            ]
          : [],
        budget,
      };
      if (completeScenarios.length < Math.ceil(scenarios.length * 2 / 3)) continue;
      const medianScenario = scenarios[Math.floor(scenarios.length / 2)];
      if (!medianScenario?.forecast.complete) continue;
      const calibratedActionDistance = variant.carrotSolution
        ? structuralDistance
        : medianScenario.forecast.frames.length;
      const medianSpareMoves = budget - calibratedActionDistance;
      if (config.difficultyCode === "I" && (medianSpareMoves < 2 || medianSpareMoves > 6)) {
        continue;
      }
      calibratedScenarios = scenarios;
      selected = medianScenario;
      selectedBudget = budget;
      break;
    }
    if (!calibratedScenarios || !selected || selectedBudget === null) return null;
    return {
      ...variant,
      moveLimit: selectedBudget,
      adversityPlan: {
        structuralDistance,
        scenarioActions: calibratedScenarios.map((scenario) => ({
          seedOffset: scenario.seedOffset,
          cockroachInitialTrigger: scenario.cockroachInitialTrigger,
          catPawInitialTrigger: scenario.catPawInitialTrigger,
          actions: scenario.forecast.frames.length,
          complete: scenario.forecast.complete,
          failure: scenario.forecast.failure,
        })),
        seedOffset: selected.seedOffset,
        cockroachInitialTrigger: selected.cockroachInitialTrigger,
        catPawInitialTrigger: selected.catPawInitialTrigger,
        expectedActions: selected.forecast.expectedActions,
        decisions: selected.forecast.decisions,
      },
    };
  } finally {
    globalThis.__MOUSE_MAZE_PREGENERATED_LEVELS__ = savedPregenerated;
  }
}

function buildValidatedVariant(config, levelIndex, variantIndex) {
  const savedAttempts = config.variantAttempts;
  let candidate = buildLevelVariant(config, variantIndex);
  if (!needsFullGameplayValidation(config, variantIndex)) return candidate;
  let calibrated = calibrateFullGameplayVariant(
    config,
    levelIndex,
    variantIndex,
    candidate,
  );
  if (calibrated) return calibrated;
  console.log(
    "  Level " + (levelIndex + 1) + ", variant " + (variantIndex + 1) +
      ": initial complete-game sample " +
      JSON.stringify(globalThis.__lastGameplayCalibrationDiagnostic ?? {}),
  );

  const firstRetry = Math.max(0, (candidate.attempt ?? -1) + 1);
  try {
    for (let attempt = firstRetry; attempt < 1400; attempt += 1) {
      if (attempt > firstRetry && attempt % 100 === 0) {
        console.log(
          "  Level " + (levelIndex + 1) + ", variant " + (variantIndex + 1) +
            ": tested " + attempt + " complete-game candidates; last sample " +
            JSON.stringify(globalThis.__lastGameplayCalibrationDiagnostic ?? {}),
        );
      }
      const forcedAttempts = Array.isArray(savedAttempts) ? [...savedAttempts] : [];
      forcedAttempts[variantIndex] = attempt;
      config.variantAttempts = forcedAttempts;
      try {
        candidate = buildLevelVariant(config, variantIndex);
      } catch {
        continue;
      }
      calibrated = calibrateFullGameplayVariant(
        config,
        levelIndex,
        variantIndex,
        candidate,
      );
      if (calibrated) return calibrated;
    }
  } finally {
    config.variantAttempts = savedAttempts;
  }
  throw new Error(
    "Could not generate a full-gameplay-safe variant for level " +
      (levelIndex + 1) + ", variant " + (variantIndex + 1),
  );
}

for (const [levelIndex, config] of LEVEL_CONFIGS.entries()) {
  console.log("Generating level " + (levelIndex + 1) + " of " + LEVEL_CONFIGS.length + "...");
  const savedVariantAttempts = config?.variantAttempts;
  if (
    config &&
    globalThis.__searchRegeneratedAttempts &&
    regenerateLevelIndexes.has(levelIndex)
  ) {
    config.variantAttempts = undefined;
  }
  globalThis.__generatedLevelVariants[levelIndex] = !config
    ? []
    : !regenerateLevelIndexes.has(levelIndex) &&
        reusableVariants?.[levelIndex]?.length === VARIANTS_PER_LEVEL
      ? reusableVariants[levelIndex]
      : selectiveLevelGeneration && !regenerateLevelIndexes.has(levelIndex)
        ? (reusableVariants?.[levelIndex] ?? [])
      : Array.from({ length: VARIANTS_PER_LEVEL }, (_, variantIndex) =>
          buildValidatedVariant(config, levelIndex, variantIndex)
        );
  if (config) config.variantAttempts = savedVariantAttempts;
}
globalThis.__MOUSE_MAZE_PREGENERATED_LEVELS__ = reusableVariants;
`;

vm.runInNewContext(gameWithoutBootstrap + generation, sandbox, {
  filename: "game.js",
  timeout: 900000,
});

const serialized = JSON.stringify(sandbox.__generatedLevelVariants);
await writeFile(
  outputUrl,
  `/* Generated by scripts/generate-level-variants.mjs. Do not edit. */\n` +
    `globalThis.__MOUSE_MAZE_PREGENERATED_LEVELS__=${serialized};\n`,
  "utf8",
);

await mkdir(chunksUrl, { recursive: true });
for (
  let startIndex = 0;
  startIndex < sandbox.__generatedLevelVariants.length;
  startIndex += levelsPerSection
) {
  const sectionNumber = Math.floor(startIndex / levelsPerSection) + 1;
  const sectionLevels = sandbox.__generatedLevelVariants.slice(
    startIndex,
    startIndex + levelsPerSection,
  );
  const sectionSource =
    `/* Generated by scripts/generate-level-variants.mjs. Do not edit. */\n` +
    `(() => {\n` +
    `  const target = globalThis.__MOUSE_MAZE_PREGENERATED_LEVELS__ ??= [];\n` +
    `  const levels = ${JSON.stringify(sectionLevels)};\n` +
    `  for (let index = 0; index < levels.length; index += 1) {\n` +
    `    target[${startIndex} + index] = levels[index];\n` +
    `  }\n` +
    `})();\n`;
  await writeFile(new URL(`section-${sectionNumber}.js`, chunksUrl), sectionSource, "utf8");
}

const variantCount = sandbox.__generatedLevelVariants.reduce(
  (total, variants) => total + variants.length,
  0,
);
console.log(`Generated ${variantCount} fixed level variants.`);
console.log(
  `Generated ${Math.ceil(sandbox.__generatedLevelVariants.length / levelsPerSection)} level-section chunks.`,
);
if (regenerateLevelIndexes.size) {
  for (const levelIndex of regenerateLevelIndexes) {
    const firstVariant = sandbox.__generatedLevelVariants[levelIndex]?.[0];
    const rows = firstVariant?.grid?.length ?? 0;
    const cols = firstVariant?.grid?.[0]?.length ?? 0;
    console.log(`Regenerated level ${levelIndex + 1}: ${rows}x${cols}.`);
  }
}
