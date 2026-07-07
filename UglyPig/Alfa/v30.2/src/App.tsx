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

const PIG_SPEED_X = 3.96; // 10% slower
const FENCE_SPEED = 1.89; // 10% slower
const FENCE_SPAWN_INTERVAL = 2200; // more spacing between fences
const FIRST_FENCE_DELAY = 700;
const PIG_SIZE = 42;
const FENCE_SEGMENT_HEIGHT = 34;
const FENCE_RAIL_HEIGHT = 7;
const FENCE_RAIL_TOPS = [10, 19];
const FENCE_PICKET_WIDTH = 12;
const FENCE_PICKET_GAP = 8;
const CRASH_DURATION_MS = 900;
const DIGIT_IMAGES = [d0, d1, d2, d3, d4, d5, d6, d7, d8, d9];

interface FenceData {
  id: number;
  y: number;
  gapStart: number;
  gapWidth: number;
  passed: boolean;
}

type CountdownAction = "resume" | "restart" | null;
type ExitReturnState = "playing" | "paused" | "gameover" | null;

const getViewportSize = () => ({
  width: Math.max(320, window.innerWidth),
  height: Math.max(500, window.innerHeight),
});

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

  FENCE_RAIL_TOPS.forEach((railTop) => {
    rects.push({
      x: left - 8,
      y: top + railTop,
      w: width + 16,
      h: FENCE_RAIL_HEIGHT,
    });
  });

  const addPost = (x: number) => {
    rects.push(
      { x: x + 2, y: top, w: 8, h: 5 },
      { x, y: top + 5, w: 12, h: 27 }
    );
  };

  addPost(left - 2);
  addPost(left + width - 10);

  let cursor = 10;
  let idx = 0;
  while (cursor + FENCE_PICKET_WIDTH < width - 10) {
    const picketHeight = idx % 2 === 0 ? 24 : 28;
    const picketLeft = left + cursor;
    const picketTop = top + FENCE_SEGMENT_HEIGHT - 2 - picketHeight;

    rects.push(
      { x: picketLeft + 4, y: picketTop, w: 4, h: picketHeight * 0.08 },
      { x: picketLeft + 3, y: picketTop + picketHeight * 0.08, w: 6, h: picketHeight * 0.07 },
      { x: picketLeft + 1, y: picketTop + picketHeight * 0.15, w: 10, h: picketHeight * 0.05 },
      { x: picketLeft, y: picketTop + picketHeight * 0.2, w: FENCE_PICKET_WIDTH, h: picketHeight * 0.8 }
    );

    cursor += FENCE_PICKET_WIDTH + FENCE_PICKET_GAP;
    idx += 1;
  }

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

function PigHitboxDebug({
  x,
  y,
  size,
  direction,
  crashOffsetY = 0,
}: {
  x: number;
  y: number;
  size: number;
  direction: number;
  crashOffsetY?: number;
}) {
  return (
    <>
      {PIG_HIT_SPANS.flatMap((span, spanIndex) =>
        span.segments.map(([x0, x1], segmentIndex) => {
          const leftNorm = direction === -1 ? 1 - x1 : x0;
          const rightNorm = direction === -1 ? 1 - x0 : x1;

          return (
            <div
              key={`${spanIndex}-${segmentIndex}`}
              className="absolute pointer-events-none z-20 bg-red-500/35 border border-red-600"
              style={{
                left: `${x + leftNorm * size}px`,
                top: `${y + crashOffsetY + span.y0 * size}px`,
                width: `${(rightNorm - leftNorm) * size}px`,
                height: `${(span.y1 - span.y0) * size}px`,
              }}
            />
          );
        })
      )}
    </>
  );
}

function FenceHitboxDebug({ fence, gameWidth }: { fence: FenceData; gameWidth: number }) {
  const hitRects = createFenceHitboxes(fence, gameWidth);

  return (
    <>
      {hitRects.map((rect, index) =>
        rect.w <= 0 ? null : (
          <div
            key={`${fence.id}-${index}`}
            className="absolute pointer-events-none z-20 bg-red-500/35 outline outline-1 outline-red-700"
            style={{
              left: `${rect.x}px`,
              top: `${rect.y}px`,
              width: `${rect.w}px`,
              height: `${rect.h}px`,
            }}
          />
        )
      )}
    </>
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
  });

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [splashPhase, setSplashPhase] = useState<"show" | "fade" | "done">("show");
  const [hasStarted, setHasStarted] = useState(false);
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
    lastSpawnTime: 0,
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
  });

  const audioCtxRef = useRef<AudioContext | null>(null);
  const PIG_Y = gameSize.height / 2 - PIG_SIZE / 2;

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
    state.lastScore = state.score;
    state.pigX = gameSize.width / 2;
    state.pigDirection = 1;
    state.score = 0;
    state.fences = [];
    state.isGameOver = false;
    state.lastSpawnTime = performance.now();
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
  }, [gameSize.width]);

  useEffect(() => {
    try {
      const savedTopScore = localStorage.getItem("piggyFlyTopScore");
      if (savedTopScore) {
        const parsedScore = parseInt(savedTopScore, 10);
        gameStateRef.current.topScore = parsedScore;
        setRenderState((prev) => ({ ...prev, topScore: parsedScore }));
      }

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

  const startCountdown = useCallback((action: Exclude<CountdownAction, null>) => {
    countdownActionRef.current = action;
    setIsPaused(false);
    gameStateRef.current.showGameOverMenu = false;
    setCountdown(3);
  }, []);

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
        resetRun();
        pausedAtRef.current = null;
      } else {
        // Resume path: preserve fence spacing by compensating paused time.
        const now = performance.now();
        if (pausedAtRef.current !== null) {
          const pausedDuration = now - pausedAtRef.current;
          gameStateRef.current.lastSpawnTime += pausedDuration;
          pausedAtRef.current = null;
        }
      }
      return;
    }

    const t = setTimeout(() => setCountdown((c) => (c === null ? null : c - 1)), 1000);
    return () => clearTimeout(t);
  }, [countdown, resetRun]);

  const toggleDirection = useCallback(() => {
    const state = gameStateRef.current;
    if (splashPhase !== "done" || !hasStarted || isPaused || countdown !== null || isLandscape || showExitConfirm) return;

    if (state.showOnboarding) state.showOnboarding = false;

    // Restart from game-over must only happen via the Game Over button.
    if (state.isGameOver) return;

    state.pigDirection *= -1;
    playTone(620, 0.05, "triangle");
  }, [playTone, hasStarted, isPaused, countdown, isLandscape, showExitConfirm]);

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
          setHasStarted(true);
          startCountdown("resume");
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
  }, [toggleDirection, hasStarted, showExitConfirm, handleExitNo, openExitConfirm, startCountdown]);

  useEffect(() => {
    let animationFrameId: number;

    const gameLoop = (timestamp: number) => {
      const state = gameStateRef.current;
      let gameOverTriggered = false;
      let scoreTriggered = false;

      let crashRotation = 0;
      let crashOffsetY = state.crashFinalOffsetY;

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

      if (hasStarted && !state.isGameOver && !isPaused && countdown === null && !isLandscape) {
        state.pigX += state.pigDirection * PIG_SPEED_X;

        if (state.pigX <= 0 || state.pigX + PIG_SIZE >= gameSize.width) {
          state.isGameOver = true;
          state.crashActive = true;
          state.crashStartAt = timestamp;
          state.crashFinalOffsetY = 0;
          state.showGameOverMenu = false;
          setIsPaused(false);
          gameOverTriggered = true;
        }

        if (state.lastSpawnTime === 0) state.lastSpawnTime = timestamp;

        const currentInterval = state.hasSpawnedFirstFence ? FENCE_SPAWN_INTERVAL : FIRST_FENCE_DELAY;
        if (timestamp - state.lastSpawnTime > currentInterval) {
          const newFence = generateFence(gameSize.width);
          state.fences.push({ id: state.fenceId++, y: newFence.y, gapStart: newFence.gapStart, gapWidth: newFence.gapWidth, passed: false });
          state.lastSpawnTime = timestamp;
          state.hasSpawnedFirstFence = true;
        }

        state.fences = state.fences.map((f) => ({ ...f, y: f.y + FENCE_SPEED })).filter((f) => f.y < gameSize.height);

        state.fences.forEach((fence) => {
          const fenceHitboxes = createFenceHitboxes(fence, gameSize.width);
          const hitFence = pigMaskIntersectsAnyRect(state.pigX, PIG_Y, PIG_SIZE, state.pigDirection, fenceHitboxes);

          if (hitFence) {
            state.isGameOver = true;
            state.crashActive = true;
            state.crashStartAt = timestamp;
            state.crashFinalOffsetY = 0;
            state.showGameOverMenu = false;
            setIsPaused(false);
            gameOverTriggered = true;
          }

          if (!fence.passed && fence.y > PIG_Y + PIG_SIZE) {
            fence.passed = true;
            state.score++;
            scoreTriggered = true;
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
        state.gameOverReadyAt = performance.now() + 4000;

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
      }

      let shakeX = 0;
      if (state.impactFrames > 0) {
        shakeX = (Math.random() - 0.5) * 12;
        state.impactFrames -= 1;
      }

      const gameOverWaitMs = Math.max(0, state.gameOverReadyAt - performance.now());
      const canRestartFromGameOver = state.showGameOverMenu ? gameOverWaitMs <= 0 : false;

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
      });

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [playTone, playPigHitSound, triggerVibration, isPaused, countdown, hasStarted, isLandscape, gameSize.width, gameSize.height, PIG_Y]);

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
            <img src={startScreenImage} alt="Ugly Pig start screen" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/25" />

            <div className="absolute inset-0 flex items-end justify-center pb-20">
              <button
                type="button"
                className="rounded-2xl bg-transparent p-0 border-0 shadow-none"
                onClick={(e) => {
                  e.stopPropagation();
                  setHasStarted(true);
                  startCountdown("resume");
                }}
              >
                <img src={startButtonImage} alt="Start" className="w-[260px] md:w-[300px] h-auto" draggable={false} />
              </button>
            </div>
          </div>
        )}

        {hasStarted && (isPaused || countdown !== null || renderState.isGameOver) && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 text-center z-30 pointer-events-none px-2 w-full flex justify-center">
            <span className="text-sm md:text-base font-black text-white bg-black/50 px-3 py-2 rounded-2xl whitespace-nowrap text-center max-w-[96vw]">
              Click to change directions and avoid fences
            </span>
          </div>
        )}

        {!renderState.isGameOver && countdown === null && !isPaused && hasStarted && !isLandscape && (
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

        <Pig
          x={renderState.pigX}
          y={PIG_Y}
          direction={renderState.pigDirection}
          size={PIG_SIZE}
          crashRotation={renderState.crashRotation}
          crashOffsetY={renderState.crashOffsetY}
        />

        {renderState.fences.map((fence) => (
          <Fence key={fence.id} y={fence.y} gapStart={fence.gapStart} gapWidth={fence.gapWidth} gameWidth={gameSize.width} />
        ))}

        <PigHitboxDebug
          x={renderState.pigX}
          y={PIG_Y}
          size={PIG_SIZE}
          direction={renderState.pigDirection}
          crashOffsetY={renderState.crashOffsetY}
        />

        {renderState.fences.map((fence) => (
          <FenceHitboxDebug key={`debug-${fence.id}`} fence={fence} gameWidth={gameSize.width} />
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
          soundEnabled={soundEnabled}
          vibrationEnabled={vibrationEnabled}
          onToggleSound={() => setSoundEnabled((s) => !s)}
          onToggleVibration={() => setVibrationEnabled((v) => !v)}
          onResume={() => startCountdown("resume")}
          onRestart={() => startCountdown("restart")}
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
                  className="bg-white border-2 border-[#d8c9a8] text-[#5a3216] font-black text-xl py-3 rounded-2xl"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={handleExitNo}
                >
                  No
                </button>
                <button
                  className="bg-red-600 border-2 border-red-700 text-white font-black text-xl py-3 rounded-2xl"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => {
                    CapacitorApp.exitApp();
                  }}
                >
                  Yes
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
