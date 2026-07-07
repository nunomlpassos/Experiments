import { useState, useEffect, useCallback, useRef } from "react";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { App as CapacitorApp } from "@capacitor/app";
import { Pig } from "./Pig";
import { Fence } from "./Fence";
import { generateFence } from "./FenceGenerator";
import { GameUI } from "./GameUI";
import { FarmBackground } from "./FarmBackground";
import startScreenImage from "./assets/start-screen.jpg";
import brandLogo from "./assets/brand-logo.jpg";
import pauseIcon from "./assets/pause-icon.png";
import startButtonImage from "./assets/start-button.png";
import exitNoButtonImage from "./assets/exit-no-button.webp";
import exitYesButtonImage from "./assets/exit-yes-button.webp";
import d0 from "./assets/digits/0.png";
import d1 from "./assets/digits/1.png";
import d2 from "./assets/digits/2.png";
import d3 from "./assets/digits/3.png";
import d4 from "./assets/digits/4.png";
import d5 from "./assets/digits/5.png";
import d6 from "./assets/digits/6.png";
import d7 from "./assets/digits/7.png";
import d8 from "./assets/digits/8.png";
import d9 from "./assets/digits/9.png";

const FIRST_FENCE_DELAY = 700;
const MIN_FENCE_VERTICAL_SPACING = 230;
const PIG_SIZE = 42;
const TARGET_FRAME_MS = 1000 / 60;
const FENCE_SEGMENT_HEIGHT = 34;
const FENCE_RAIL_HEIGHT = 7;
const FENCE_RAIL_TOPS = [10, 19];
const CRASH_DURATION_MS = 900;
const RUN_INTRO_DURATION_MS = 1150;
const RUN_INTRO_CORRAL_WIDTH = 340;
const RUN_INTRO_CORRAL_HEIGHT = 238;
const DIFFICULTY_TRANSITION_MS = 1500;
const MIN_DIFFICULTY_REFERENCE_SCORE = 50;
const DIFFICULTY_ASSIST_STORAGE_KEY = "piggyFlyDifficultyAssist";
const DIFFICULTY_ASSIST_OFFSET_STEP = 2;
const DIFFICULTY_ASSIST_MIN_MAX_OFFSET = 6;
const DIFFICULTY_ASSIST_MAX_OFFSET_MULTIPLIER = 1.5;
const DIFFICULTY_ASSIST_ABSOLUTE_MAX_OFFSET = 30;
const DIFFICULTY_ASSIST_CLEAR_AHEAD_STEPS = 2;
const DIFFICULTY_ASSIST_FAILURES_TO_ADJUST = 3;
const GAME_VERSION = "v43.4";
const SHOW_DEBUG_LABELS = false;
const DIGIT_IMAGES = [d0, d1, d2, d3, d4, d5, d6, d7, d8, d9];

interface DifficultyValues {
  level: number;
  pigSpeed: number;
  fenceSpeed: number;
  minGapWidth: number;
  maxGapWidth: number;
}

interface DifficultyTransition {
  from: DifficultyValues;
  to: DifficultyValues;
  startedAt: number;
}

const DIFFICULTY_LEVELS: DifficultyValues[] = [
  { level: 0, pigSpeed: 2.9, fenceSpeed: 1.4, minGapWidth: 170, maxGapWidth: 225 },
  { level: 1, pigSpeed: 3.0, fenceSpeed: 1.5, minGapWidth: 160, maxGapWidth: 220 },
  { level: 2, pigSpeed: 3.2, fenceSpeed: 1.6, minGapWidth: 160, maxGapWidth: 210 },
  { level: 3, pigSpeed: 3.4, fenceSpeed: 1.8, minGapWidth: 150, maxGapWidth: 210 },
  { level: 4, pigSpeed: 3.6, fenceSpeed: 1.9, minGapWidth: 150, maxGapWidth: 200 },
  { level: 5, pigSpeed: 3.8, fenceSpeed: 2.1, minGapWidth: 145, maxGapWidth: 200 },
  { level: 6, pigSpeed: 4.0, fenceSpeed: 2.2, minGapWidth: 145, maxGapWidth: 190 },
  { level: 7, pigSpeed: 4.25, fenceSpeed: 2.4, minGapWidth: 140, maxGapWidth: 180 },
  { level: 8, pigSpeed: 4.5, fenceSpeed: 2.6, minGapWidth: 135, maxGapWidth: 170 },
  { level: 9, pigSpeed: 4.75, fenceSpeed: 2.8, minGapWidth: 130, maxGapWidth: 155 },
  { level: 10, pigSpeed: 5.0, fenceSpeed: 3.0, minGapWidth: 125, maxGapWidth: 145 },
];

const FIRST_INSTALL_RUN_COMPLETE_KEY = "piggyFlyFirstInstallRunComplete";
const STARTING_DIFFICULTY = DIFFICULTY_LEVELS[0];
const MAX_DIFFICULTY_LEVEL = DIFFICULTY_LEVELS[DIFFICULTY_LEVELS.length - 1].level;

interface FenceData {
  id: number;
  y: number;
  gapStart: number;
  gapWidth: number;
  passed: boolean;
}

type CountdownAction = "resume" | "restart" | "continue" | null;
type ExitReturnState = "playing" | "paused" | "gameover" | null;
type DeathCause = "fence" | "wall" | null;

interface RunIntroState {
  active: boolean;
  progress: number;
}

interface PersonalRecords {
  daily: number;
  weekly: number;
  monthly: number;
  dayKey: string;
  weekKey: string;
  monthKey: string;
}

interface PersonalRecordFlags {
  daily: boolean;
  weekly: boolean;
  monthly: boolean;
}

type DifficultyReferenceSource = "F" | "D" | "W" | "M" | "B";

interface DifficultyAssistState {
  offset: number;
  wallFailureCount: number;
  targetMilestone: number | null;
}

const getViewportSize = () => ({
  width: Math.max(320, window.innerWidth),
  height: Math.max(500, window.innerHeight),
});

const PERSONAL_RECORDS_STORAGE_KEY = "piggyFlyPersonalRecords";

const pad2 = (value: number) => String(value).padStart(2, "0");

const getPersonalRecordKeys = (date = new Date()) => {
  const dayKey = `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
  const monthKey = `${date.getFullYear()}-${pad2(date.getMonth() + 1)}`;

  const isoDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = isoDate.getUTCDay() || 7;
  isoDate.setUTCDate(isoDate.getUTCDate() + 4 - dayNumber);
  const weekYear = isoDate.getUTCFullYear();
  const yearStart = new Date(Date.UTC(weekYear, 0, 1));
  const weekNumber = Math.ceil(((isoDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);

  return { dayKey, weekKey: `${weekYear}-W${pad2(weekNumber)}`, monthKey };
};

const createEmptyPersonalRecords = (date = new Date()): PersonalRecords => ({
  daily: 0,
  weekly: 0,
  monthly: 0,
  ...getPersonalRecordKeys(date),
});

const normalizePersonalRecords = (saved: unknown, date = new Date()): PersonalRecords => {
  const current = createEmptyPersonalRecords(date);
  if (!saved || typeof saved !== "object") return current;

  const records = saved as Partial<PersonalRecords>;
  return {
    dayKey: current.dayKey,
    weekKey: current.weekKey,
    monthKey: current.monthKey,
    daily: records.dayKey === current.dayKey ? Math.max(0, Number(records.daily) || 0) : 0,
    weekly: records.weekKey === current.weekKey ? Math.max(0, Number(records.weekly) || 0) : 0,
    monthly: records.monthKey === current.monthKey ? Math.max(0, Number(records.monthly) || 0) : 0,
  };
};

const updatePersonalRecordsForScore = (records: PersonalRecords, score: number) => {
  const currentRecords = normalizePersonalRecords(records);
  const newRecords: PersonalRecordFlags = { daily: false, weekly: false, monthly: false };
  const nextRecords = { ...currentRecords };

  if (score > nextRecords.daily) {
    nextRecords.daily = score;
    newRecords.daily = true;
  }
  if (score > nextRecords.weekly) {
    nextRecords.weekly = score;
    newRecords.weekly = true;
  }
  if (score > nextRecords.monthly) {
    nextRecords.monthly = score;
    newRecords.monthly = true;
  }

  return { records: nextRecords, newRecords };
};

const getCelebrationSequenceDurationMs = (newRecords: PersonalRecordFlags, isNewBest: boolean) => {
  let nextDelayMs = 680;
  let sequenceEndMs = 0;

  if (newRecords.daily) {
    sequenceEndMs = nextDelayMs + 1350;
    nextDelayMs += 1150;
  }
  if (newRecords.weekly) {
    sequenceEndMs = nextDelayMs + 1650;
    nextDelayMs += 1400;
  }
  if (newRecords.monthly) {
    sequenceEndMs = nextDelayMs + 1950;
    nextDelayMs += 1700;
  }
  if (isNewBest) {
    sequenceEndMs = nextDelayMs + 2300;
  }

  return sequenceEndMs > 0 ? sequenceEndMs + 300 : 0;
};

const getDifficultyForLevel = (level: number) =>
  DIFFICULTY_LEVELS[Math.min(DIFFICULTY_LEVELS.length - 1, Math.max(0, level))];

const getDifficultyStep = (referenceScore: number) =>
  Math.max(5, Math.ceil(referenceScore / MAX_DIFFICULTY_LEVEL));

const getRecentDifficultyReference = (records: PersonalRecords) => {
  const currentRecords = normalizePersonalRecords(records);
  const recentReference = Math.max(currentRecords.daily, currentRecords.weekly, currentRecords.monthly);

  if (recentReference <= 0) {
    return { referenceScore: 0, source: "B" as DifficultyReferenceSource };
  }

  if (currentRecords.daily === recentReference) {
    return { referenceScore: recentReference, source: "D" as DifficultyReferenceSource };
  }
  if (currentRecords.weekly === recentReference) {
    return { referenceScore: recentReference, source: "W" as DifficultyReferenceSource };
  }

  return { referenceScore: recentReference, source: "M" as DifficultyReferenceSource };
};

const getRunDifficultySettings = (
  isFirstInstallRun: boolean,
  topScore: number,
  personalRecords: PersonalRecords,
  sessionReferenceScore: number,
  sessionReferenceSource: DifficultyReferenceSource
) => {
  if (isFirstInstallRun) {
    return {
      referenceScore: MIN_DIFFICULTY_REFERENCE_SCORE,
      step: getDifficultyStep(MIN_DIFFICULTY_REFERENCE_SCORE),
      source: "F" as DifficultyReferenceSource,
    };
  }

  const recentReference = getRecentDifficultyReference(personalRecords);
  const referenceBase =
    recentReference.referenceScore > 0 ? recentReference.referenceScore : Math.max(0, topScore);
  const calculatedReferenceScore = Math.max(MIN_DIFFICULTY_REFERENCE_SCORE, referenceBase);
  const referenceScore = Math.max(sessionReferenceScore, calculatedReferenceScore);
  const calculatedSource =
    recentReference.referenceScore > 0 ? recentReference.source : ("B" as DifficultyReferenceSource);

  return {
    referenceScore,
    step: getDifficultyStep(referenceScore),
    source: sessionReferenceScore > calculatedReferenceScore ? sessionReferenceSource : calculatedSource,
  };
};

const createDifficultyAssistState = (): DifficultyAssistState => ({
  offset: 0,
  wallFailureCount: 0,
  targetMilestone: null,
});

const roundUpToAssistStep = (value: number) =>
  Math.ceil(value / DIFFICULTY_ASSIST_OFFSET_STEP) * DIFFICULTY_ASSIST_OFFSET_STEP;

const getDifficultyAssistMaxOffset = (step: number) =>
  Math.min(
    DIFFICULTY_ASSIST_ABSOLUTE_MAX_OFFSET,
    Math.max(
      DIFFICULTY_ASSIST_MIN_MAX_OFFSET,
      roundUpToAssistStep(step * DIFFICULTY_ASSIST_MAX_OFFSET_MULTIPLIER)
    )
  );

const clampDifficultyAssistForStep = (
  assist: DifficultyAssistState,
  step: number
): DifficultyAssistState => ({
  ...assist,
  offset: Math.min(getDifficultyAssistMaxOffset(step), Math.max(0, assist.offset)),
});

const normalizeDifficultyAssistState = (saved: unknown): DifficultyAssistState => {
  const empty = createDifficultyAssistState();
  if (!saved || typeof saved !== "object") return empty;

  const assist = saved as Partial<DifficultyAssistState>;
  const targetMilestone =
    typeof assist.targetMilestone === "number" && Number.isFinite(assist.targetMilestone)
      ? Math.max(0, Math.floor(assist.targetMilestone))
      : null;

  return {
    offset: Math.min(
      DIFFICULTY_ASSIST_ABSOLUTE_MAX_OFFSET,
      Math.max(0, Math.floor(Number(assist.offset) || 0))
    ),
    wallFailureCount: Math.max(0, Math.floor(Number(assist.wallFailureCount) || 0)),
    targetMilestone,
  };
};

const saveDifficultyAssistState = (assist: DifficultyAssistState) => {
  try {
    localStorage.setItem(DIFFICULTY_ASSIST_STORAGE_KEY, JSON.stringify(assist));
  } catch (e) {
    console.error("Could not save difficulty assist state", e);
  }
};

const getNextDifficultyMilestone = (topScore: number, step: number) => {
  const currentLevel = Math.floor(Math.max(0, topScore) / step);
  if (currentLevel >= MAX_DIFFICULTY_LEVEL) return null;
  return (currentLevel + 1) * step;
};

const getRunFailureMilestone = (score: number, step: number) => {
  const currentLevel = Math.floor(Math.max(0, score) / step);
  if (currentLevel >= MAX_DIFFICULTY_LEVEL) return null;
  return (currentLevel + 1) * step;
};

const updateDifficultyAssistAfterRun = (
  assist: DifficultyAssistState,
  score: number,
  step: number,
  isNewBest = false
): DifficultyAssistState => {
  const currentAssist = clampDifficultyAssistForStep(assist, step);
  const maxOffset = getDifficultyAssistMaxOffset(step);

  if (isNewBest) {
    return createDifficultyAssistState();
  }

  if (currentAssist.targetMilestone !== null && score >= currentAssist.targetMilestone) {
    const clearlyPassedMilestone =
      score >= currentAssist.targetMilestone + step * DIFFICULTY_ASSIST_CLEAR_AHEAD_STEPS;

    return {
      offset: clearlyPassedMilestone
        ? 0
        : Math.max(0, currentAssist.offset - DIFFICULTY_ASSIST_OFFSET_STEP),
      wallFailureCount: 0,
      targetMilestone: null,
    };
  }

  const runFailureMilestone = getRunFailureMilestone(score, step);
  if (runFailureMilestone === null) {
    return { ...assist, wallFailureCount: 0, targetMilestone: null };
  }

  const wallFailureCount =
    currentAssist.targetMilestone === runFailureMilestone ? currentAssist.wallFailureCount + 1 : 1;

  if (wallFailureCount >= DIFFICULTY_ASSIST_FAILURES_TO_ADJUST) {
    return {
      offset: Math.min(maxOffset, currentAssist.offset + DIFFICULTY_ASSIST_OFFSET_STEP),
      wallFailureCount: 0,
      targetMilestone: runFailureMilestone,
    };
  }

  return {
    ...currentAssist,
    wallFailureCount,
    targetMilestone: runFailureMilestone,
  };
};

const getDifficultyLevelForScore = (score: number, step: number, offset: number) =>
  Math.min(MAX_DIFFICULTY_LEVEL, Math.floor(Math.max(0, score - offset) / step));

const easeDifficulty = (value: number) => 1 - Math.pow(1 - value, 3);

const easeRunIntro = (value: number) => 1 - Math.pow(1 - value, 3);

const interpolateDifficulty = (from: DifficultyValues, to: DifficultyValues, progress: number): DifficultyValues => {
  const t = easeDifficulty(Math.min(1, Math.max(0, progress)));
  const lerp = (a: number, b: number) => a + (b - a) * t;

  return {
    level: to.level,
    pigSpeed: lerp(from.pigSpeed, to.pigSpeed),
    fenceSpeed: lerp(from.fenceSpeed, to.fenceSpeed),
    minGapWidth: Math.round(lerp(from.minGapWidth, to.minGapWidth)),
    maxGapWidth: Math.round(lerp(from.maxGapWidth, to.maxGapWidth)),
  };
};

interface RectHitbox {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface PigHitSpan {
  y0: number;
  y1: number;
  segments: Array<[number, number]>;
}

const PIG_HIT_SPANS: PigHitSpan[] = [
  { y0: 0, y1: 0.041, segments: [[0.42, 0.61]] },
  { y0: 0.041, y1: 0.083, segments: [[0.375, 0.658]] },
  { y0: 0.083, y1: 0.124, segments: [[0.353, 0.678]] },
  { y0: 0.124, y1: 0.166, segments: [[0.111, 0.261], [0.318, 0.682]] },
  { y0: 0.166, y1: 0.207, segments: [[0.063, 0.684]] },
  { y0: 0.207, y1: 0.249, segments: [[0.033, 0.734]] },
  { y0: 0.249, y1: 0.29, segments: [[0.015, 0.769]] },
  { y0: 0.29, y1: 0.333, segments: [[0.006, 0.878]] },
  { y0: 0.333, y1: 0.373, segments: [[0.002, 0.933]] },
  { y0: 0.373, y1: 0.416, segments: [[0.006, 0.963]] },
  { y0: 0.416, y1: 0.456, segments: [[0.022, 0.982]] },
  { y0: 0.456, y1: 0.499, segments: [[0.026, 0.993]] },
  { y0: 0.499, y1: 0.542, segments: [[0.017, 0.996]] },
  { y0: 0.542, y1: 0.582, segments: [[0.013, 0.994]] },
  { y0: 0.582, y1: 0.625, segments: [[0.011, 0.989]] },
  { y0: 0.625, y1: 0.665, segments: [[0.013, 0.972]] },
  { y0: 0.665, y1: 0.708, segments: [[0.017, 0.939]] },
  { y0: 0.708, y1: 0.748, segments: [[0.026, 0.863]] },
  { y0: 0.748, y1: 0.791, segments: [[0.039, 0.839]] },
  { y0: 0.791, y1: 0.832, segments: [[0.055, 0.806]] },
  { y0: 0.832, y1: 0.874, segments: [[0.078, 0.767]] },
  { y0: 0.874, y1: 0.915, segments: [[0.111, 0.712]] },
  { y0: 0.915, y1: 0.957, segments: [[0.152, 0.643]] },
  { y0: 0.957, y1: 1, segments: [[0.222, 0.538]] },
];

const pigMaskIntersectsRect = (pigX: number, pigY: number, pigSize: number, direction: number, rect: RectHitbox) => {
  const rectLeft = rect.x;
  const rectRight = rect.x + rect.w;
  const rectTop = rect.y;
  const rectBottom = rect.y + rect.h;

  return PIG_HIT_SPANS.some((span) => {
    const spanTop = pigY + span.y0 * pigSize;
    const spanBottom = pigY + span.y1 * pigSize;

    if (spanBottom < rectTop || spanTop > rectBottom) {
      return false;
    }

    return span.segments.some(([x0, x1]) => {
      const leftNorm = direction === -1 ? 1 - x1 : x0;
      const rightNorm = direction === -1 ? 1 - x0 : x1;
      const segmentLeft = pigX + leftNorm * pigSize;
      const segmentRight = pigX + rightNorm * pigSize;

      return segmentRight >= rectLeft && segmentLeft <= rectRight;
    });
  });
};

const createFenceSegmentHitboxes = (left: number, top: number, width: number): RectHitbox[] => {
  if (width <= 0) return [];

  const rects: RectHitbox[] = [];

  rects.push({
    x: left - 8,
    y: top + FENCE_RAIL_TOPS[0],
    w: width + 16,
    h: FENCE_RAIL_TOPS[1] + FENCE_RAIL_HEIGHT - FENCE_RAIL_TOPS[0],
  });

  if (width > 20) {
    rects.push({
      x: left + 10,
      y: top + 20,
      w: width - 20,
      h: FENCE_SEGMENT_HEIGHT - 22,
    });
  }

  const addPost = (x: number) => {
    rects.push(
      { x: x + 2, y: top, w: 8, h: 5 },
      { x, y: top + 5, w: 12, h: 27 }
    );
  };

  addPost(left - 2);
  addPost(left + width - 10);

  return rects;
};

const createFenceHitboxes = (fence: FenceData, gameWidth: number): RectHitbox[] => {
  const gapRight = fence.gapStart + fence.gapWidth;
  return [
    ...createFenceSegmentHitboxes(0, fence.y, fence.gapStart),
    ...createFenceSegmentHitboxes(gapRight, fence.y, gameWidth - gapRight),
  ];
};

const pigMaskIntersectsAnyRect = (pigX: number, pigY: number, pigSize: number, direction: number, rects: RectHitbox[]) =>
  rects.some((rect) => pigMaskIntersectsRect(pigX, pigY, pigSize, direction, rect));

function IntroFenceRun({
  width,
  left,
  top,
  rotate = 0,
  opacity = 1,
}: {
  width: number;
  left: number;
  top: number;
  rotate?: number;
  opacity?: number;
}) {
  const railOffsetTop = 10;
  const railOffsetBottom = 19;
  const picketWidth = 12;
  const picketGap = 8;
  const pickets = [];
  let cursor = 10;
  let idx = 0;

  while (cursor + picketWidth < width - 10) {
    const h = idx % 2 === 0 ? 24 : 28;
    pickets.push(
      <div
        key={idx}
        className="absolute"
        style={{
          left: `${cursor}px`,
          bottom: "2px",
          width: `${picketWidth}px`,
          height: `${h}px`,
          background: "linear-gradient(90deg, #be7a17 0%, #d9962f 45%, #b96e10 100%)",
          border: "1px solid #8c4f06",
          borderBottomWidth: "2px",
          clipPath: "polygon(50% 0%, 100% 20%, 100% 100%, 0% 100%, 0% 20%)",
          boxShadow: "inset -1px 0 0 rgba(255,255,255,0.25), inset 1px 0 0 rgba(0,0,0,0.12)",
        }}
      />
    );
    cursor += picketWidth + picketGap;
    idx += 1;
  }

  return (
    <div
      className="absolute"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: "34px",
        opacity,
        transform: `rotate(${rotate}deg)`,
        transformOrigin: "center center",
      }}
    >
      <div
        className="absolute"
        style={{
          left: "-8px",
          right: "-8px",
          top: `${railOffsetTop}px`,
          height: "7px",
          borderRadius: "5px",
          background: "linear-gradient(90deg, #a86410 0%, #c7801d 45%, #a15f0b 100%)",
          border: "1px solid #854b06",
        }}
      />
      <div
        className="absolute"
        style={{
          left: "-8px",
          right: "-8px",
          top: `${railOffsetBottom}px`,
          height: "7px",
          borderRadius: "5px",
          background: "linear-gradient(90deg, #a86410 0%, #c7801d 45%, #a15f0b 100%)",
          border: "1px solid #854b06",
        }}
      />
      <div
        className="absolute"
        style={{
          left: "-2px",
          bottom: "0px",
          width: "12px",
          height: "32px",
          borderRadius: "7px",
          background: "linear-gradient(90deg, #9f5c0f 0%, #c98420 50%, #93540c 100%)",
          border: "1px solid #7b4606",
        }}
      />
      <div
        className="absolute"
        style={{
          right: "-2px",
          bottom: "0px",
          width: "12px",
          height: "32px",
          borderRadius: "7px",
          background: "linear-gradient(90deg, #9f5c0f 0%, #c98420 50%, #93540c 100%)",
          border: "1px solid #7b4606",
        }}
      />
      {pickets}
    </div>
  );
}

function IntroCorral({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="absolute z-10 pointer-events-none"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${RUN_INTRO_CORRAL_WIDTH}px`,
        height: `${RUN_INTRO_CORRAL_HEIGHT}px`,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          filter: "drop-shadow(0 8px 5px rgba(72, 39, 5, 0.24))",
        }}
      >
        <IntroFenceRun width={304} left={18} top={18} />
        <IntroFenceRun width={172} left={-52} top={102} rotate={90} />
        <IntroFenceRun width={172} left={220} top={102} rotate={90} />
        <IntroFenceRun width={120} left={18} top={184} />
        <IntroFenceRun width={120} left={202} top={184} />
        <IntroFenceRun width={58} left={116} top={166} rotate={90} />
        <IntroFenceRun width={58} left={166} top={166} rotate={90} />
      </div>
    </div>
  );
}

export default function App() {
  const [gameSize, setGameSize] = useState(() =>
    typeof window === "undefined" ? { width: 400, height: 700 } : getViewportSize()
  );

  const [renderState, setRenderState] = useState({
    pigX: gameSize.width / 2,
    pigDirection: 1,
    score: 0,
    lastScore: 0,
    topScore: 0,
    fences: [] as FenceData[],
    isGameOver: false,
    showOnboarding: true,
    shakeX: 0,
    crashRotation: 0,
    crashOffsetY: 0,
    showGameOverMenu: false,
    isNewBest: false,
    canRestartFromGameOver: false,
    canContinueFromGameOver: false,
    personalRecords: createEmptyPersonalRecords(),
    newPersonalRecords: { daily: false, weekly: false, monthly: false } as PersonalRecordFlags,
    difficultyLevel: STARTING_DIFFICULTY.level,
    difficultyReferenceScore: MIN_DIFFICULTY_REFERENCE_SCORE,
    difficultyReferenceSource: "F" as DifficultyReferenceSource,
    difficultyStep: 5,
    difficultyOffset: 0,
    difficultyWallFailureCount: 0,
    showIntroCorral: false,
    introCorralY: gameSize.height,
  });

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [splashPhase, setSplashPhase] = useState<"show" | "fade" | "done">("show");
  const [hasStarted, setHasStarted] = useState(false);
  const [runIntro, setRunIntro] = useState<RunIntroState>({ active: false, progress: 0 });
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const exitReturnStateRef = useRef<ExitReturnState>(null);

  const countdownActionRef = useRef<CountdownAction>(null);
  const pausedAtRef = useRef<number | null>(null);
  const lastTapRef = useRef(0);

  const gameStateRef = useRef({
    pigX: gameSize.width / 2,
    pigDirection: 1,
    score: 0,
    lastScore: 0,
    topScore: 0,
    fences: [] as FenceData[],
    isGameOver: false,
    gameTime: 0,
    lastSpawnTime: 0,
    lastFrameTime: 0,
    fenceId: 0,
    showOnboarding: true,
    impactFrames: 0,
    hasSpawnedFirstFence: false,
    crashActive: false,
    crashStartAt: 0,
    crashFinalOffsetY: 0,
    showGameOverMenu: false,
    isNewBest: false,
    gameOverReadyAt: 0,
    runLastScoreReference: 0,
    hasUsedContinue: false,
    deathCause: null as DeathCause,
    deathFenceId: null as number | null,
    personalRecords: createEmptyPersonalRecords(),
    newPersonalRecords: { daily: false, weekly: false, monthly: false } as PersonalRecordFlags,
    isFirstInstallRun: true,
    difficultyValues: STARTING_DIFFICULTY,
    difficultyTargetLevel: STARTING_DIFFICULTY.level,
    difficultyReferenceScore: MIN_DIFFICULTY_REFERENCE_SCORE,
    difficultySessionReferenceScore: MIN_DIFFICULTY_REFERENCE_SCORE,
    difficultyReferenceSource: "F" as DifficultyReferenceSource,
    difficultyStep: 5,
    difficultyOffset: 0,
    difficultyWallMilestone: null as number | null,
    difficultyAssist: createDifficultyAssistState(),
    pendingDifficultyAssistScore: null as number | null,
    difficultyTransition: null as DifficultyTransition | null,
    showIntroCorral: false,
    introCorralY: gameSize.height,
  });

  const audioCtxRef = useRef<AudioContext | null>(null);
  const PIG_Y = gameSize.height / 2 - PIG_SIZE / 2;
  const introCorralX = gameSize.width / 2 - RUN_INTRO_CORRAL_WIDTH / 2;
  const introProgress = easeRunIntro(runIntro.progress);
  const introPigStartY = renderState.introCorralY + 64;
  const introPigY = runIntro.active ? introPigStartY + (PIG_Y - introPigStartY) * introProgress : PIG_Y;
  const introPigXOffset = Math.sin(runIntro.progress * Math.PI * 3) * 5;
  const renderedPigX = runIntro.active ? gameSize.width / 2 - PIG_SIZE / 2 + introPigXOffset : renderState.pigX;
  const renderedPigDirection = runIntro.active ? 1 : renderState.pigDirection;

  useEffect(() => {
    const onResize = () => {
      const next = getViewportSize();
      setGameSize(next);
      setIsLandscape(next.width > next.height);

      const state = gameStateRef.current;
      state.pigX = Math.min(next.width - PIG_SIZE, Math.max(0, state.pigX));
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (screen.orientation?.lock) {
      screen.orientation.lock("portrait").catch(() => {});
    }
  }, []);

  const triggerVibration = useCallback(
    (kind: "score" | "impact") => {
      if (!vibrationEnabled) return;
      const isNative = !!(window as any)?.Capacitor?.isNativePlatform?.();

      if (isNative) {
        if (kind === "impact") Haptics.impact({ style: ImpactStyle.Heavy }).catch(() => {});
        else Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
        return;
      }

      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        if (kind === "impact") navigator.vibrate([45, 35, 45]);
        else navigator.vibrate(12);
      }
    },
    [vibrationEnabled]
  );

  const playTone = useCallback(
    (freq: number, duration = 0.08, type: OscillatorType = "square") => {
      if (!soundEnabled) return;
      try {
        if (!audioCtxRef.current) {
          const Ctx = window.AudioContext || (window as any).webkitAudioContext;
          if (!Ctx) return;
          audioCtxRef.current = new Ctx();
        }

        const ctx = audioCtxRef.current;
        if (!ctx) return;

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.type = type;
        oscillator.frequency.value = freq;
        gainNode.gain.value = 0.065;

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        const now = ctx.currentTime;
        gainNode.gain.setValueAtTime(0.075, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

        oscillator.start(now);
        oscillator.stop(now + duration);
      } catch {
        // ignore audio errors silently
      }
    },
    [soundEnabled]
  );

  const playPigHitSound = useCallback(() => {
    playTone(420, 0.08, "sawtooth");
    setTimeout(() => playTone(340, 0.11, "triangle"), 70);
  }, [playTone]);

  const resetRun = useCallback(() => {
    const state = gameStateRef.current;
    if (state.pendingDifficultyAssistScore !== null) {
      state.difficultyAssist = updateDifficultyAssistAfterRun(
        state.difficultyAssist,
        state.pendingDifficultyAssistScore,
        state.difficultyStep,
        state.isNewBest
      );
      saveDifficultyAssistState(state.difficultyAssist);
      state.pendingDifficultyAssistScore = null;
    }

    state.lastScore = state.score;
    state.runLastScoreReference = state.lastScore;
    state.pigX = gameSize.width / 2;
    state.pigDirection = 1;
    state.score = 0;
    state.fences = [];
    state.isGameOver = false;
    state.gameTime = 0;
    state.lastSpawnTime = 0;
    state.lastFrameTime = 0;
    state.fenceId = 0;
    state.impactFrames = 0;
    state.showOnboarding = false;
    state.hasSpawnedFirstFence = false;
    state.crashActive = false;
    state.crashStartAt = 0;
    state.crashFinalOffsetY = 0;
    state.showGameOverMenu = false;
    state.isNewBest = false;
    state.gameOverReadyAt = 0;
    state.hasUsedContinue = false;
    state.deathCause = null;
    state.deathFenceId = null;
    state.newPersonalRecords = { daily: false, weekly: false, monthly: false };
    const difficultySettings = getRunDifficultySettings(
      state.isFirstInstallRun,
      state.topScore,
      state.personalRecords,
      state.difficultySessionReferenceScore,
      state.difficultyReferenceSource
    );
    const difficultyWallMilestone = getNextDifficultyMilestone(state.topScore, difficultySettings.step);
    state.difficultyAssist = clampDifficultyAssistForStep(state.difficultyAssist, difficultySettings.step);
    state.difficultyReferenceScore = difficultySettings.referenceScore;
    state.difficultySessionReferenceScore = difficultySettings.referenceScore;
    state.difficultyReferenceSource = difficultySettings.source;
    state.difficultyStep = difficultySettings.step;
    state.difficultyOffset = state.difficultyAssist.offset;
    state.difficultyWallMilestone = difficultyWallMilestone;
    state.difficultyValues = STARTING_DIFFICULTY;
    state.difficultyTargetLevel = STARTING_DIFFICULTY.level;
    state.difficultyTransition = null;
    state.showIntroCorral = true;
    state.introCorralY = Math.max(gameSize.height - RUN_INTRO_CORRAL_HEIGHT - 18, gameSize.height * 0.72);
  }, [gameSize.width, gameSize.height]);

  useEffect(() => {
    try {
      const savedTopScore = localStorage.getItem("piggyFlyTopScore");
      if (savedTopScore) {
        const parsedScore = parseInt(savedTopScore, 10);
        gameStateRef.current.topScore = parsedScore;
        setRenderState((prev) => ({ ...prev, topScore: parsedScore }));
      }

      const savedPersonalRecords = localStorage.getItem(PERSONAL_RECORDS_STORAGE_KEY);
      if (savedPersonalRecords) {
        const records = normalizePersonalRecords(JSON.parse(savedPersonalRecords));
        gameStateRef.current.personalRecords = records;
        setRenderState((prev) => ({ ...prev, personalRecords: records }));
      }

      const isFirstInstallRun = localStorage.getItem(FIRST_INSTALL_RUN_COMPLETE_KEY) !== "true";
      const difficultySettings = getRunDifficultySettings(
        isFirstInstallRun,
        gameStateRef.current.topScore,
        gameStateRef.current.personalRecords,
        gameStateRef.current.difficultySessionReferenceScore,
        gameStateRef.current.difficultyReferenceSource
      );
      const savedDifficultyAssist = localStorage.getItem(DIFFICULTY_ASSIST_STORAGE_KEY);
      const difficultyAssist = clampDifficultyAssistForStep(normalizeDifficultyAssistState(
        savedDifficultyAssist ? JSON.parse(savedDifficultyAssist) : null
      ), difficultySettings.step);
      const difficultyWallMilestone = getNextDifficultyMilestone(
        gameStateRef.current.topScore,
        difficultySettings.step
      );
      gameStateRef.current.isFirstInstallRun = isFirstInstallRun;
      gameStateRef.current.difficultyReferenceScore = difficultySettings.referenceScore;
      gameStateRef.current.difficultySessionReferenceScore = difficultySettings.referenceScore;
      gameStateRef.current.difficultyReferenceSource = difficultySettings.source;
      gameStateRef.current.difficultyStep = difficultySettings.step;
      gameStateRef.current.difficultyOffset = difficultyAssist.offset;
      gameStateRef.current.difficultyWallMilestone = difficultyWallMilestone;
      gameStateRef.current.difficultyAssist = difficultyAssist;
      setRenderState((prev) => ({
        ...prev,
        difficultyReferenceScore: difficultySettings.referenceScore,
        difficultyReferenceSource: difficultySettings.source,
        difficultyStep: difficultySettings.step,
        difficultyOffset: difficultyAssist.offset,
        difficultyWallFailureCount: difficultyAssist.wallFailureCount,
      }));

      const savedSound = localStorage.getItem("piggyFlySoundEnabled");
      if (savedSound !== null) setSoundEnabled(savedSound === "true");

      const savedVibration = localStorage.getItem("piggyFlyVibrationEnabled");
      if (savedVibration !== null) setVibrationEnabled(savedVibration === "true");
    } catch (e) {
      console.error("Could not load saved settings", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("piggyFlySoundEnabled", String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem("piggyFlyVibrationEnabled", String(vibrationEnabled));
  }, [vibrationEnabled]);

  useEffect(() => {
    const showTimer = setTimeout(() => setSplashPhase("fade"), 2000);
    const hideTimer = setTimeout(() => setSplashPhase("done"), 2600);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const removeContinueFences = useCallback((cause: DeathCause, fenceId: number | null) => {
    const state = gameStateRef.current;

    if (cause === "fence" && fenceId !== null) {
      const hitIndex = state.fences.findIndex((fence) => fence.id === fenceId);
      if (hitIndex >= 0) {
        const removeIds = new Set(state.fences.slice(hitIndex, hitIndex + 2).map((fence) => fence.id));
        state.fences = state.fences.filter((fence) => !removeIds.has(fence.id));
      }
      return;
    }

    const nextFence = state.fences
      .filter((fence) => !fence.passed && fence.y <= PIG_Y + PIG_SIZE)
      .sort((a, b) => b.y - a.y)[0];
    if (nextFence) {
      state.fences = state.fences.filter((fence) => fence.id !== nextFence.id);
    }
  }, [PIG_Y]);

  const continueRun = useCallback(() => {
    const state = gameStateRef.current;
    if (state.hasUsedContinue || state.score >= state.runLastScoreReference) return;

    const deathCause = state.deathCause;
    const deathFenceId = state.deathFenceId;
    removeContinueFences(deathCause, deathFenceId);

    state.hasUsedContinue = true;
    state.pigX = gameSize.width / 2;
    state.pigDirection = 1;
    state.isGameOver = false;
    state.crashActive = false;
    state.crashStartAt = 0;
    state.crashFinalOffsetY = 0;
    state.impactFrames = 0;
    state.showGameOverMenu = false;
    state.gameOverReadyAt = 0;
    state.deathCause = null;
    state.deathFenceId = null;
    state.pendingDifficultyAssistScore = null;
    state.lastFrameTime = 0;
    pausedAtRef.current = null;
  }, [gameSize.width, removeContinueFences]);

  const startCountdown = useCallback((action: Exclude<CountdownAction, null>) => {
    if (action === "continue") {
      continueRun();
    }
    countdownActionRef.current = action;
    setIsPaused(false);
    gameStateRef.current.showGameOverMenu = false;
    setCountdown(3);
  }, [continueRun]);

  const beginRunIntro = useCallback(() => {
    resetRun();
    setHasStarted(true);
    setIsPaused(false);
    setCountdown(null);
    setRunIntro({ active: true, progress: 0 });
  }, [resetRun]);

  useEffect(() => {
    if (!runIntro.active) return;

    let animationFrameId = 0;
    const startedAt = performance.now();

    const animateIntro = (timestamp: number) => {
      const progress = Math.min(1, (timestamp - startedAt) / RUN_INTRO_DURATION_MS);
      setRunIntro({ active: progress < 1, progress });

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateIntro);
        return;
      }

      gameStateRef.current.lastFrameTime = 0;
    };

    animationFrameId = requestAnimationFrame(animateIntro);
    return () => cancelAnimationFrame(animationFrameId);
  }, [runIntro.active]);

  const handleExitNo = useCallback(() => {
    setShowExitConfirm(false);

    const previous = exitReturnStateRef.current;
    if (previous === "paused") {
      setIsPaused(true);
    } else if (previous === "gameover") {
      gameStateRef.current.showGameOverMenu = true;
      setIsPaused(false);
    } else if (previous === "playing" && hasStarted && !gameStateRef.current.isGameOver) {
      startCountdown("resume");
    }

    exitReturnStateRef.current = null;
  }, [hasStarted, startCountdown]);

  const openExitConfirm = useCallback(() => {
    if (showExitConfirm) return;

    const state = gameStateRef.current;
    if (state.showGameOverMenu || state.isGameOver) {
      exitReturnStateRef.current = "gameover";
    } else if (isPaused) {
      exitReturnStateRef.current = "paused";
    } else {
      exitReturnStateRef.current = "playing";
      if (hasStarted && countdown === null) {
        pausedAtRef.current = performance.now();
        setIsPaused(true);
      }
    }

    setShowExitConfirm(true);
  }, [showExitConfirm, isPaused, hasStarted, countdown]);

  useEffect(() => {
    const isNative = !!(window as any)?.Capacitor?.isNativePlatform?.();
    if (!isNative) return;

    const subPromise = CapacitorApp.addListener("backButton", () => {
      if (showExitConfirm) {
        handleExitNo();
        return;
      }
      openExitConfirm();
    });

    return () => {
      subPromise.then((s) => s.remove()).catch(() => {});
    };
  }, [showExitConfirm, openExitConfirm, handleExitNo]);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown <= 0) {
      const action = countdownActionRef.current;
      countdownActionRef.current = null;
      setCountdown(null);

      if (action === "restart") {
        // Full reset path: do not carry over paused timing, or spawns can be delayed too much.
        beginRunIntro();
        pausedAtRef.current = null;
      } else {
        // Spawn timing follows effective game time, so real paused duration is ignored.
        pausedAtRef.current = null;
      }
      return;
    }

    const t = setTimeout(() => setCountdown((c) => (c === null ? null : c - 1)), 1000);
    return () => clearTimeout(t);
  }, [countdown, beginRunIntro]);

  const toggleDirection = useCallback(() => {
    const state = gameStateRef.current;
    if (splashPhase !== "done" || !hasStarted || runIntro.active || isPaused || countdown !== null || isLandscape || showExitConfirm) return;

    if (state.showOnboarding) state.showOnboarding = false;

    // Restart from game-over must only happen via the Game Over button.
    if (state.isGameOver) return;

    state.pigDirection *= -1;
    playTone(620, 0.05, "triangle");
  }, [playTone, hasStarted, runIntro.active, isPaused, countdown, isLandscape, showExitConfirm]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      const now = performance.now();
      if (now - lastTapRef.current < 120) return;
      lastTapRef.current = now;
      e.preventDefault();
      toggleDirection();
    },
    [toggleDirection]
  );

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (!hasStarted) {
          beginRunIntro();
          return;
        }
        toggleDirection();
      }
      if (e.code === "Escape") {
        e.preventDefault();
        if (showExitConfirm) {
          handleExitNo();
          return;
        }
        openExitConfirm();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [toggleDirection, hasStarted, showExitConfirm, handleExitNo, openExitConfirm, beginRunIntro]);

  useEffect(() => {
    let animationFrameId: number;

    const gameLoop = (timestamp: number) => {
      const state = gameStateRef.current;
      let gameOverTriggered = false;
      let scoreTriggered = false;

      let crashRotation = 0;
      let crashOffsetY = state.crashFinalOffsetY;
      const previousFrameTime = state.lastFrameTime || timestamp;
      const effectiveFrameMs = Math.min(TARGET_FRAME_MS * 2, Math.max(0, timestamp - previousFrameTime));
      const frameScale = effectiveFrameMs / TARGET_FRAME_MS;
      state.lastFrameTime = timestamp;

      if (state.crashActive) {
        const elapsed = timestamp - state.crashStartAt;
        const p = Math.min(1, elapsed / CRASH_DURATION_MS);
        crashRotation = 720 * p;
        crashOffsetY = p * (gameSize.height - PIG_Y + 80);
        if (p >= 1) {
          state.crashActive = false;
          state.crashFinalOffsetY = crashOffsetY;
          state.showGameOverMenu = true;
        }
      } else if (state.isGameOver) {
        crashRotation = 720;
      }

      if (hasStarted && !runIntro.active && !state.isGameOver && !isPaused && countdown === null && !isLandscape) {
        state.gameTime += effectiveFrameMs;

        if (state.difficultyTransition) {
          const progress = (state.gameTime - state.difficultyTransition.startedAt) / DIFFICULTY_TRANSITION_MS;
          if (progress >= 1) {
            state.difficultyValues = state.difficultyTransition.to;
            state.difficultyTransition = null;
          } else {
            state.difficultyValues = interpolateDifficulty(
              state.difficultyTransition.from,
              state.difficultyTransition.to,
              progress
            );
          }
        }

        const difficulty = state.difficultyValues;
        state.pigX += state.pigDirection * difficulty.pigSpeed * frameScale;

        if (state.pigX <= 0 || state.pigX + PIG_SIZE >= gameSize.width) {
          state.isGameOver = true;
          state.crashActive = true;
          state.crashStartAt = timestamp;
          state.crashFinalOffsetY = 0;
          state.showGameOverMenu = false;
          state.deathCause = "wall";
          state.deathFenceId = null;
          setIsPaused(false);
          gameOverTriggered = true;
        }

        if (state.lastSpawnTime === 0) state.lastSpawnTime = state.gameTime;

        const newestFenceY = state.fences.length > 0 ? state.fences[state.fences.length - 1].y : Infinity;
        const hasVerticalSpace = newestFenceY >= MIN_FENCE_VERTICAL_SPACING;
        const canSpawnByTime = state.hasSpawnedFirstFence || state.gameTime - state.lastSpawnTime > FIRST_FENCE_DELAY;
        if (canSpawnByTime && hasVerticalSpace) {
          const newFence = generateFence(gameSize.width, difficulty.minGapWidth, difficulty.maxGapWidth);
          state.fences.push({ id: state.fenceId++, y: newFence.y, gapStart: newFence.gapStart, gapWidth: newFence.gapWidth, passed: false });
          state.lastSpawnTime = state.gameTime;
          state.hasSpawnedFirstFence = true;
        }

        state.fences = state.fences.map((f) => ({ ...f, y: f.y + difficulty.fenceSpeed * frameScale })).filter((f) => f.y < gameSize.height);
        if (state.showIntroCorral) {
          state.introCorralY += difficulty.fenceSpeed * frameScale;
          if (state.introCorralY > gameSize.height + 24) {
            state.showIntroCorral = false;
          }
        }

        state.fences.forEach((fence) => {
          const fenceHitboxes = createFenceHitboxes(fence, gameSize.width);
          const hitFence = pigMaskIntersectsAnyRect(state.pigX, PIG_Y, PIG_SIZE, state.pigDirection, fenceHitboxes);

          if (!gameOverTriggered && hitFence) {
            state.isGameOver = true;
            state.crashActive = true;
            state.crashStartAt = timestamp;
            state.crashFinalOffsetY = 0;
            state.showGameOverMenu = false;
            state.deathCause = "fence";
            state.deathFenceId = fence.id;
            setIsPaused(false);
            gameOverTriggered = true;
          }

          if (!fence.passed && fence.y > PIG_Y + PIG_SIZE) {
            fence.passed = true;
            state.score++;
            scoreTriggered = true;

            const nextDifficultyLevel = getDifficultyLevelForScore(
              state.score,
              state.difficultyStep,
              state.difficultyOffset
            );
            if (nextDifficultyLevel > state.difficultyTargetLevel) {
              state.difficultyTargetLevel = nextDifficultyLevel;
              state.difficultyTransition = {
                from: state.difficultyValues,
                to: getDifficultyForLevel(nextDifficultyLevel),
                startedAt: state.gameTime,
              };
            }
          }
        });
      }

      if (scoreTriggered) {
        playTone(900, 0.06, "sine");
        triggerVibration("score");
      }

      if (gameOverTriggered) {
        state.impactFrames = 16;
        playPigHitSound();
        triggerVibration("impact");

        if (state.isFirstInstallRun) {
          state.isFirstInstallRun = false;
          try {
            localStorage.setItem(FIRST_INSTALL_RUN_COMPLETE_KEY, "true");
          } catch (e) {
            console.error("Could not save first install run state", e);
          }
        }

        if (state.score > state.topScore) {
          state.topScore = state.score;
          state.isNewBest = true;
          try {
            localStorage.setItem("piggyFlyTopScore", state.topScore.toString());
          } catch (e) {
            console.error("Could not save top score", e);
          }
        } else {
          state.isNewBest = false;
        }

        state.pendingDifficultyAssistScore = state.score;

        const personalRecordResult = updatePersonalRecordsForScore(state.personalRecords, state.score);
        state.personalRecords = personalRecordResult.records;
        state.newPersonalRecords = personalRecordResult.newRecords;
        const celebrationSequenceMs = getCelebrationSequenceDurationMs(
          personalRecordResult.newRecords,
          state.isNewBest
        );
        state.gameOverReadyAt =
          performance.now() + Math.max(4000, CRASH_DURATION_MS + celebrationSequenceMs);

        if (
          personalRecordResult.newRecords.daily ||
          personalRecordResult.newRecords.weekly ||
          personalRecordResult.newRecords.monthly
        ) {
          try {
            localStorage.setItem(PERSONAL_RECORDS_STORAGE_KEY, JSON.stringify(personalRecordResult.records));
          } catch (e) {
            console.error("Could not save personal records", e);
          }
        }
      }

      let shakeX = 0;
      if (state.impactFrames > 0) {
        shakeX = (Math.random() - 0.5) * 12;
        state.impactFrames -= 1;
      }

      const gameOverWaitMs = Math.max(0, state.gameOverReadyAt - performance.now());
      const canRestartFromGameOver = state.showGameOverMenu ? gameOverWaitMs <= 0 : false;
      const canContinueFromGameOver =
        canRestartFromGameOver && !state.hasUsedContinue && state.score < state.runLastScoreReference;

      setRenderState({
        pigX: state.pigX,
        pigDirection: state.pigDirection,
        score: state.score,
        lastScore: state.lastScore,
        topScore: state.topScore,
        fences: state.fences,
        isGameOver: state.isGameOver,
        showOnboarding: state.showOnboarding,
        shakeX,
        crashRotation,
        crashOffsetY,
        showGameOverMenu: state.showGameOverMenu,
        isNewBest: state.isNewBest,
        canRestartFromGameOver,
        canContinueFromGameOver,
        personalRecords: state.personalRecords,
        newPersonalRecords: state.newPersonalRecords,
        difficultyLevel: state.difficultyTargetLevel,
        difficultyReferenceScore: state.difficultyReferenceScore,
        difficultyReferenceSource: state.difficultyReferenceSource,
        difficultyStep: state.difficultyStep,
        difficultyOffset: state.difficultyOffset,
        difficultyWallFailureCount: state.difficultyAssist.wallFailureCount,
        showIntroCorral: state.showIntroCorral,
        introCorralY: state.introCorralY,
      });

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [playTone, playPigHitSound, triggerVibration, isPaused, countdown, hasStarted, runIntro.active, isLandscape, gameSize.width, gameSize.height, PIG_Y]);

  return (
    <div className="w-screen h-screen bg-sky-300 overflow-hidden">
      <div
        className="relative border-4 border-amber-900 overflow-hidden w-screen h-screen"
        style={{ transform: `translateX(${renderState.shakeX}px)`, touchAction: "manipulation" }}
        onPointerDown={(e) => {
          if (showExitConfirm) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          handlePointerDown(e);
        }}
      >
        {splashPhase !== "done" && (
          <div
            className={`absolute inset-0 z-[90] bg-white flex items-center justify-center transition-opacity duration-600 ${splashPhase === "fade" ? "opacity-0" : "opacity-100"}`}
          >
            <img src={brandLogo} alt="Barnun" className="w-[72%] max-w-[420px] object-contain" />
          </div>
        )}

        <FarmBackground gameWidth={gameSize.width} gameHeight={gameSize.height} />

        {isLandscape && (
          <div className="absolute inset-0 z-[60] bg-black/80 flex items-center justify-center text-center px-6">
            <div className="text-white font-black text-2xl">Rotate device to portrait 📱</div>
          </div>
        )}

        {!hasStarted && (
          <div
            className={`absolute inset-0 z-50 transition-opacity duration-700 ${
              splashPhase === "show" ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <img src={startScreenImage} alt="Runaway Pig start screen" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/25" />

            <div className="absolute inset-0 flex items-end justify-center pb-20">
              <button
                type="button"
                className="rounded-2xl bg-transparent p-0 border-0 shadow-none"
                onClick={(e) => {
                  e.stopPropagation();
                  beginRunIntro();
                }}
              >
                <img src={startButtonImage} alt="Start" className="w-[260px] md:w-[300px] h-auto" draggable={false} />
              </button>
            </div>

            {SHOW_DEBUG_LABELS && (
              <div className="absolute bottom-3 right-3 z-[60] rounded-md bg-black/45 px-2 py-1 text-[11px] font-black text-white/90">
                {GAME_VERSION}
              </div>
            )}
          </div>
        )}

        {hasStarted && (isPaused || countdown !== null || renderState.isGameOver) && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 text-center z-30 pointer-events-none px-2 w-full flex justify-center">
            <span className="text-sm md:text-base font-black text-white bg-black/50 px-3 py-2 rounded-2xl whitespace-nowrap text-center max-w-[96vw]">
              Click to change directions and avoid fences
            </span>
          </div>
        )}

        {!renderState.isGameOver && countdown === null && !runIntro.active && !isPaused && hasStarted && !isLandscape && (
          <button
            type="button"
            className="absolute top-2 right-2 z-30 w-14 h-14 appearance-none bg-transparent border-0 p-0 m-0 shadow-none outline-none"
            style={{ WebkitTapHighlightColor: "transparent" }}
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              pausedAtRef.current = performance.now();
              setIsPaused(true);
            }}
            aria-label="Pause"
            title="Pause"
          >
            <img src={pauseIcon} alt="Pause" className="w-full h-full object-contain" draggable={false} />
          </button>
        )}

        {SHOW_DEBUG_LABELS && hasStarted && (
          <div className="absolute top-16 left-2 z-30 rounded-lg bg-black/55 px-2 py-2 text-[10px] font-black text-white shadow-lg pointer-events-none">
            NIVEL {renderState.difficultyLevel} | SRC {renderState.difficultyReferenceSource} | REF{" "}
            {renderState.difficultyReferenceScore} | STEP {renderState.difficultyStep} | OFF {renderState.difficultyOffset} | FAIL{" "}
            {renderState.difficultyWallFailureCount}
          </div>
        )}

        {renderState.showIntroCorral && (
          <IntroCorral x={introCorralX} y={runIntro.active ? Math.min(renderState.introCorralY, gameSize.height - RUN_INTRO_CORRAL_HEIGHT - 18) : renderState.introCorralY} />
        )}

        <Pig
          x={renderedPigX}
          y={introPigY}
          direction={renderedPigDirection}
          size={PIG_SIZE}
          crashRotation={renderState.crashRotation}
          crashOffsetY={runIntro.active ? 0 : renderState.crashOffsetY}
        />

        {renderState.fences.map((fence) => (
          <Fence key={fence.id} y={fence.y} gapStart={fence.gapStart} gapWidth={fence.gapWidth} gameWidth={gameSize.width} />
        ))}

        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-[2px] select-none">
          {String(renderState.score)
            .split("")
            .map((digit, idx) => {
              const n = Number(digit);
              const src = Number.isNaN(n) ? d0 : DIGIT_IMAGES[n];
              return <img key={`${digit}-${idx}`} src={src} alt={digit} className="h-14 w-auto" draggable={false} />;
            })}
        </div>

        <GameUI
          score={renderState.score}
          lastScore={renderState.lastScore}
          topScore={renderState.topScore}
          isGameOver={renderState.showGameOverMenu && countdown === null}
          isPaused={isPaused && countdown === null}
          isNewBest={renderState.isNewBest}
          canRestartFromGameOver={renderState.canRestartFromGameOver}
          canContinueFromGameOver={renderState.canContinueFromGameOver}
          personalRecords={renderState.personalRecords}
          newPersonalRecords={renderState.newPersonalRecords}
          soundEnabled={soundEnabled}
          vibrationEnabled={vibrationEnabled}
          onToggleSound={() => setSoundEnabled((s) => !s)}
          onToggleVibration={() => setVibrationEnabled((v) => !v)}
          onResume={() => startCountdown("resume")}
          onRestart={() => startCountdown("restart")}
          onContinue={() => startCountdown("continue")}
        />

        {countdown !== null && hasStarted && (
          <div className="absolute inset-0 z-50 bg-black/35 flex items-center justify-center pointer-events-none">
            <div
              className="text-white font-black drop-shadow-[0_4px_8px_rgba(0,0,0,0.75)] transition-all duration-700 ease-out"
              style={{
                fontSize: "128px",
                transform: `scale(${1 + (3 - Math.max(countdown, 1)) * 0.14})`,
                opacity: 0.95,
              }}
            >
              {countdown}
            </div>
          </div>
        )}

        {showExitConfirm && (
          <div
            className="absolute inset-0 z-[70] bg-black/55 flex items-center justify-center px-4"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <div
              className="relative w-[90%] max-w-[352px] rounded-[28px] p-[6px] shadow-2xl bg-[linear-gradient(to_bottom,#A6CE12_0%,#88A808_45%,#789808_70%,#588008_100%)]"
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <div className="rounded-[22px] bg-[#f7f0df] p-5 text-center">
              <div className="pt-2 text-2xl font-black text-[#5a3216] mb-4">Exit game?</div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="h-[62px] rounded-2xl bg-transparent p-0 border-0 shadow-none"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={handleExitNo}
                  aria-label="No"
                >
                  <img src={exitNoButtonImage} alt="No" className="w-full h-full object-contain" draggable={false} />
                </button>
                <button
                  type="button"
                  className="h-[62px] rounded-2xl bg-transparent p-0 border-0 shadow-none"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => {
                    CapacitorApp.exitApp();
                  }}
                  aria-label="Yes"
                >
                  <img src={exitYesButtonImage} alt="Yes" className="w-full h-full object-contain" draggable={false} />
                </button>
              </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
