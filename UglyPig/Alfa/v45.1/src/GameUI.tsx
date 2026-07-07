import { memo, type CSSProperties } from "react";
import resumeButton from "./assets/resume-button.webp";
import restartButton from "./assets/restart-button.webp";
import soundOnButton from "./assets/sound-on-button.webp";
import soundOffButton from "./assets/sound-off-button.webp";
import vibrationOnButton from "./assets/vibration-on-button.webp";
import vibrationOffButton from "./assets/vibration-off-button.webp";
import pausedTitle from "./assets/paused-title.webp";
import playAgainButton from "./assets/play-again-button.webp";
import continueButton from "./assets/continue-button.webp";
import gameOverTitle from "./assets/game-over-title.webp";

interface PersonalRecords {
  daily: number;
  weekly: number;
  monthly: number;
}

interface PersonalRecordFlags {
  daily: boolean;
  weekly: boolean;
  monthly: boolean;
}

interface GameUIProps {
  score: number;
  lastScore: number;
  topScore: number;
  isGameOver: boolean;
  isPaused: boolean;
  isNewBest: boolean;
  canRestartFromGameOver: boolean;
  canContinueFromGameOver: boolean;
  personalRecords: PersonalRecords;
  newPersonalRecords: PersonalRecordFlags;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  onToggleSound: () => void;
  onToggleVibration: () => void;
  onResume: () => void;
  onRestart: () => void;
  onContinue: () => void;
}

type CelebrationTier = keyof PersonalRecordFlags | "best";

const CELEBRATION_SPARKS = Array.from({ length: 8 }, (_, i) => i);
const CELEBRATION_STARS = Array.from({ length: 16 }, (_, i) => i);
const BEST_CONFETTI = Array.from({ length: 36 }, (_, i) => i);

function getCelebrationDelays(newRecords: PersonalRecordFlags, isNewBest: boolean) {
  const delays: Record<CelebrationTier, number> = {
    daily: 0,
    weekly: 0,
    monthly: 0,
    best: 0,
  };
  let nextDelay = 0.68;

  (["daily", "weekly", "monthly"] as const).forEach((tier) => {
    if (newRecords[tier]) {
      delays[tier] = nextDelay;
      nextDelay += tier === "daily" ? 1.15 : tier === "weekly" ? 1.4 : 1.7;
    }
  });

  if (isNewBest) delays.best = nextDelay;
  return delays;
}

function CelebrationStyles() {
  return (
    <style>{`
      .pr-celebration-card {
        isolation: isolate;
        overflow: visible;
        will-change: transform, filter;
      }
      .pr-card-content {
        position: relative;
        z-index: 3;
      }
      .pr-card-effects {
        position: absolute;
        inset: -8px;
        z-index: 1;
        pointer-events: none;
      }
      .pr-card-effects .pr-halo,
      .pr-card-effects .pr-ring,
      .pr-card-effects .pr-burst {
        position: absolute;
        inset: 0;
        border-radius: 18px;
        opacity: 0;
      }
      .pr-card-effects .pr-halo {
        background: radial-gradient(circle, rgba(255,246,165,.92) 0%, rgba(255,190,42,.48) 47%, rgba(255,161,0,0) 74%);
        filter: blur(5px);
      }
      .pr-card-effects .pr-ring {
        border: 3px solid rgba(255,202,57,.95);
        box-shadow: 0 0 12px rgba(255,174,0,.85), inset 0 0 9px rgba(255,223,112,.65);
      }
      .pr-weekly .pr-ring,
      .pr-monthly .pr-ring {
        inset: -12px;
        border-radius: 999px;
      }
      .pr-weekly .pr-ring-secondary,
      .pr-monthly .pr-ring-secondary {
        inset: -23px;
        border-width: 2px;
        opacity: 0;
      }
      .pr-card-effects .pr-burst {
        inset: -18px;
        border-radius: 50%;
        background: repeating-conic-gradient(
          from 4deg,
          rgba(255,195,42,.68) 0deg 5deg,
          transparent 5deg 17deg
        );
        filter: blur(.4px);
      }
      .pr-spark {
        position: absolute;
        width: 5px;
        height: 5px;
        border-radius: 999px;
        background: #fff8b8;
        box-shadow: 0 0 7px 2px #ffbf2f;
        opacity: 0;
      }
      .pr-daily-card {
        animation: prDailyCard 1.35s cubic-bezier(.2,.85,.3,1.25) var(--pr-delay) both;
      }
      .pr-weekly-card {
        animation: prWeeklyCard 1.65s cubic-bezier(.2,.85,.3,1.25) var(--pr-delay) both;
      }
      .pr-monthly-card {
        animation: prMonthlyCard 1.95s cubic-bezier(.18,.88,.25,1.3) var(--pr-delay) both;
      }
      .pr-best-card {
        animation: prBestCard 2.3s cubic-bezier(.16,.9,.22,1.28) var(--pr-delay) both;
      }
      .pr-daily .pr-halo {
        animation: prHalo 1.28s ease-out var(--pr-delay) both;
      }
      .pr-weekly .pr-halo {
        animation: prHalo 1.55s ease-out var(--pr-delay) both;
      }
      .pr-weekly .pr-ring {
        animation: prRing 1.6s ease-out var(--pr-delay) both;
      }
      .pr-weekly .pr-ring-secondary {
        animation-delay: calc(var(--pr-delay) + .18s);
      }
      .pr-monthly .pr-halo {
        animation: prHalo 1.85s ease-out var(--pr-delay) both;
      }
      .pr-monthly .pr-ring {
        animation: prRing 1.9s ease-out var(--pr-delay) both;
      }
      .pr-monthly .pr-ring-secondary {
        animation-delay: calc(var(--pr-delay) + .2s);
      }
      .pr-monthly .pr-burst {
        animation: prBurst 1.9s ease-out var(--pr-delay) both;
      }
      .pr-best .pr-halo {
        inset: -12px;
        animation: prBestHalo 2.2s ease-out var(--pr-delay) both;
      }
      .pr-best .pr-ring {
        inset: -4px;
        border-width: 4px;
        animation: prBestRing 2.2s ease-out var(--pr-delay) both;
      }
      .pr-best .pr-burst {
        inset: -38px;
        animation: prBestBurst 2.3s ease-out var(--pr-delay) both;
      }
      .pr-daily .pr-spark,
      .pr-weekly .pr-spark,
      .pr-monthly .pr-spark,
      .pr-best .pr-spark {
        animation: prSpark 1.25s ease-out calc(var(--pr-delay) + var(--spark-delay)) both;
      }
      .pr-monthly-flash {
        position: absolute;
        inset: 0;
        z-index: 41;
        pointer-events: none;
        background: radial-gradient(circle at 50% 52%, rgba(255,230,125,.34), rgba(255,196,45,.08) 40%, transparent 72%);
        opacity: 0;
        animation: prScreenFlash 1.55s ease-out var(--pr-delay) both;
      }
      .pr-menu-aura {
        position: absolute;
        left: 50%;
        top: 50%;
        z-index: 0;
        width: 91%;
        max-width: 356px;
        height: 69%;
        max-height: 620px;
        border-radius: 40px;
        border: 4px solid rgba(255,207,62,.8);
        box-shadow:
          0 0 18px 6px rgba(255,190,35,.72),
          0 0 46px 18px rgba(255,168,0,.42),
          inset 0 0 22px rgba(255,225,112,.52);
        opacity: 0;
        pointer-events: none;
        animation: prMenuAura 1.95s ease-out var(--pr-delay) both;
      }
      .pr-best-menu-aura {
        width: 94%;
        max-width: 368px;
        height: 72%;
        border-color: rgba(255,220,91,.95);
        box-shadow:
          0 0 22px 8px rgba(255,205,47,.88),
          0 0 58px 24px rgba(255,153,0,.52),
          inset 0 0 28px rgba(255,236,145,.65);
        animation-duration: 2.3s;
      }
      .pr-celebration-star {
        position: absolute;
        left: 50%;
        top: 53%;
        z-index: 22;
        color: #ffe56d;
        font-size: var(--star-size);
        line-height: 1;
        opacity: 0;
        pointer-events: none;
        text-shadow: 0 0 7px #ffae00, 0 0 14px rgba(255,188,34,.9);
        animation: prStarBurst 1.65s ease-out calc(var(--pr-delay) + var(--star-delay)) both;
      }
      .pr-best-confetti {
        position: absolute;
        left: 50%;
        top: 56%;
        z-index: 55;
        width: 7px;
        height: 12px;
        border-radius: 2px;
        opacity: 0;
        pointer-events: none;
        background: var(--confetti-color);
        animation: prBestConfetti 2.25s cubic-bezier(.16,.75,.26,1) calc(var(--pr-delay) + var(--confetti-delay)) both;
      }
      @keyframes prDailyCard {
        0%, 100% { transform: scale(1); }
        42% { transform: scale(1.055); }
      }
      @keyframes prWeeklyCard {
        0%, 100% { transform: scale(1); }
        28% { transform: scale(1.075); }
        54% { transform: scale(1.025); }
        72% { transform: scale(1.06); }
      }
      @keyframes prMonthlyCard {
        0%, 100% { transform: scale(1); }
        30% { transform: scale(1.1) rotate(-.7deg); }
        52% { transform: scale(1.035) rotate(.4deg); }
        70% { transform: scale(1.07); }
      }
      @keyframes prBestCard {
        0% { transform: scale(1); filter: brightness(1); }
        26% { transform: scale(1.13); filter: brightness(1.2); }
        46% { transform: scale(1.045); }
        64% { transform: scale(1.09); }
        100% { transform: scale(1); filter: brightness(1); }
      }
      @keyframes prHalo {
        0% { transform: scale(.72); opacity: 0; }
        32% { opacity: .95; }
        100% { transform: scale(1.34); opacity: 0; }
      }
      @keyframes prRing {
        0% { transform: scale(.72); opacity: 0; }
        25% { opacity: 1; }
        100% { transform: scale(1.42); opacity: 0; }
      }
      @keyframes prBurst {
        0% { transform: scale(.35) rotate(0deg); opacity: 0; }
        24% { opacity: .62; }
        100% { transform: scale(1.35) rotate(16deg); opacity: 0; }
      }
      @keyframes prBestHalo {
        0% { transform: scale(.55); opacity: 0; }
        28% { opacity: 1; }
        72% { opacity: .82; }
        100% { transform: scale(1.4); opacity: 0; }
      }
      @keyframes prBestRing {
        0% { transform: scale(.65); opacity: 0; }
        22% { opacity: 1; }
        55% { opacity: .9; }
        100% { transform: scale(1.48); opacity: 0; }
      }
      @keyframes prBestBurst {
        0% { transform: scale(.3) rotate(-8deg); opacity: 0; }
        22% { opacity: .95; }
        100% { transform: scale(1.45) rotate(18deg); opacity: 0; }
      }
      @keyframes prSpark {
        0% { transform: translate(0,0) scale(.3); opacity: 0; }
        25% { opacity: 1; }
        100% { transform: translate(var(--spark-x), var(--spark-y)) scale(0); opacity: 0; }
      }
      @keyframes prScreenFlash {
        0%, 100% { opacity: 0; }
        35% { opacity: 1; }
      }
      @keyframes prMenuAura {
        0% { transform: translate(-50%, -50%) scale(.88); opacity: 0; }
        22% { opacity: .95; }
        58% { transform: translate(-50%, -50%) scale(1.035); opacity: .82; }
        100% { transform: translate(-50%, -50%) scale(1.08); opacity: 0; }
      }
      @keyframes prStarBurst {
        0% { transform: translate(-50%, -50%) scale(.2) rotate(0deg); opacity: 0; }
        20% { opacity: 1; }
        70% { opacity: .95; }
        100% { transform: translate(calc(-50% + var(--star-x)), calc(-50% + var(--star-y))) scale(1.15) rotate(var(--star-rotate)); opacity: 0; }
      }
      @keyframes prBestConfetti {
        0% { transform: translate(-50%, -50%) rotate(0deg) scale(.5); opacity: 0; }
        12% { opacity: 1; }
        100% { transform: translate(calc(-50% + var(--confetti-x)), var(--confetti-y)) rotate(var(--confetti-rotate)) scale(1); opacity: 0; }
      }
      @media (prefers-reduced-motion: reduce) {
        .pr-celebration-card,
        .pr-card-effects *,
        .pr-monthly-flash,
        .pr-menu-aura,
        .pr-celebration-star,
        .pr-best-confetti {
          animation-duration: .01ms !important;
          animation-delay: 0ms !important;
        }
      }
    `}</style>
  );
}

function CardCelebrationEffects({ tier, delay }: { tier: CelebrationTier; delay: number }) {
  const intensity = tier === "daily" ? 3 : tier === "weekly" ? 5 : tier === "monthly" ? 7 : 8;
  const distance = tier === "daily" ? 13 : tier === "weekly" ? 20 : tier === "monthly" ? 27 : 38;

  return (
    <div
      className={`pr-card-effects pr-${tier}`}
      style={{ "--pr-delay": `${delay}s` } as CSSProperties}
    >
      <span className="pr-halo" />
      {tier !== "daily" && <span className="pr-ring" />}
      {(tier === "weekly" || tier === "monthly") && <span className="pr-ring pr-ring-secondary" />}
      {(tier === "monthly" || tier === "best") && <span className="pr-burst" />}
      {CELEBRATION_SPARKS.slice(0, intensity).map((i) => {
        const angle = (Math.PI * 2 * i) / intensity - Math.PI / 2;
        return (
          <span
            key={i}
            className="pr-spark"
            style={
              {
                left: `${50 + Math.cos(angle) * 32}%`,
                top: `${50 + Math.sin(angle) * 32}%`,
                "--spark-x": `${Math.cos(angle) * distance}px`,
                "--spark-y": `${Math.sin(angle) * distance}px`,
                "--spark-delay": `${0.08 + (i % 3) * 0.06}s`,
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
}

function CelebrationEffects({
  newRecords,
  isNewBest,
  delays,
}: {
  newRecords: PersonalRecordFlags;
  isNewBest: boolean;
  delays: Record<CelebrationTier, number>;
}) {
  if (!newRecords.monthly && !isNewBest) return null;
  const starDelay = isNewBest ? delays.best : delays.monthly;
  const starCount = isNewBest ? CELEBRATION_STARS.length : 10;

  return (
    <>
      {newRecords.monthly && (
        <>
          <div
            className="pr-monthly-flash"
            style={{ "--pr-delay": `${delays.monthly}s` } as CSSProperties}
          />
          <div
            className="pr-menu-aura"
            style={{ "--pr-delay": `${delays.monthly}s` } as CSSProperties}
          />
        </>
      )}
      {isNewBest && (
        <div
          className="pr-menu-aura pr-best-menu-aura"
          style={{ "--pr-delay": `${delays.best}s` } as CSSProperties}
        />
      )}
      {CELEBRATION_STARS.slice(0, starCount).map((i) => {
        const angle = (Math.PI * 2 * i) / starCount - Math.PI / 2;
        const radiusX = (isNewBest ? 150 : 118) + (i % 3) * 12;
        const radiusY = (isNewBest ? 210 : 150) + (i % 4) * 10;
        return (
          <span
            key={`star-${i}`}
            className="pr-celebration-star"
            style={
              {
                "--pr-delay": `${starDelay}s`,
                "--star-delay": `${(i % 5) * 0.055}s`,
                "--star-x": `${Math.cos(angle) * radiusX}px`,
                "--star-y": `${Math.sin(angle) * radiusY}px`,
                "--star-rotate": `${120 + i * 38}deg`,
                "--star-size": `${12 + (i % 4) * 3}px`,
              } as CSSProperties
            }
          >
            ★
          </span>
        );
      })}
      {isNewBest &&
        BEST_CONFETTI.map((i) => {
          const angle = (Math.PI * 2 * i) / BEST_CONFETTI.length;
          const radius = 135 + (i % 6) * 18;
          return (
          <span
            key={i}
            className="pr-best-confetti"
            style={
              {
                "--pr-delay": `${delays.best}s`,
                "--confetti-delay": `${(i % 6) * 0.035}s`,
                "--confetti-x": `${Math.cos(angle) * radius}px`,
                "--confetti-y": `${Math.sin(angle) * radius + 98}px`,
                "--confetti-rotate": `${220 + i * 31}deg`,
                "--confetti-color": ["#f5b91c", "#f97316", "#22c55e", "#3b82f6", "#ef4444", "#a855f7"][i % 6],
              } as CSSProperties
            }
          />
          );
        })}
    </>
  );
}

function PersonalRecordsPanel({
  records,
  newRecords,
  best,
  isNewBest,
  celebrationDelays,
  compact = false,
}: {
  records: PersonalRecords;
  newRecords: PersonalRecordFlags;
  best: number;
  isNewBest: boolean;
  celebrationDelays?: Record<CelebrationTier, number>;
  compact?: boolean;
}) {
  const items = [
    { key: "daily", label: "DAY", value: records.daily, isNew: newRecords.daily },
    { key: "weekly", label: "WEEK", value: records.weekly, isNew: newRecords.weekly },
    { key: "monthly", label: "MONTH", value: records.monthly, isNew: newRecords.monthly },
  ];

  return (
    <div className={compact ? "mb-3" : "mb-4"}>
      <div className="text-center text-[#5a3216] text-[13px] font-black tracking-wide mb-2">PERSONAL RECORDS</div>
      <div className="grid grid-cols-3 gap-2">
        {items.map((item) => (
          <div
            key={item.key}
            className={`relative rounded-xl border-2 px-1 py-2 text-center shadow-inner ${
              item.isNew ? "bg-[#fff2a8] border-[#e3a008]" : "bg-white/70 border-[#d8c9a8]"
            } ${item.isNew ? `pr-celebration-card pr-${item.key}-card` : ""}`}
            style={
              item.isNew
                ? ({ "--pr-delay": `${celebrationDelays?.[item.key as keyof PersonalRecordFlags] ?? 0}s` } as CSSProperties)
                : undefined
            }
          >
            {item.isNew && (
              <CardCelebrationEffects
                tier={item.key as keyof PersonalRecordFlags}
                delay={celebrationDelays?.[item.key as keyof PersonalRecordFlags] ?? 0}
              />
            )}
            <div className="pr-card-content text-[10px] font-black text-[#8e4c18] leading-none mb-1">{item.label}</div>
            <div className="pr-card-content text-[22px] font-black text-[#5a3216] leading-none">{item.value}</div>
          </div>
        ))}
      </div>
      <div
        className={`relative mt-2 rounded-xl border-2 px-3 py-2 text-center shadow-inner ${
          isNewBest ? "bg-[#fff2a8] border-[#e3a008]" : "bg-white/80 border-[#d8c9a8]"
        } ${isNewBest ? "pr-celebration-card pr-best-card" : ""}`}
        style={
          isNewBest
            ? ({ "--pr-delay": `${celebrationDelays?.best ?? 0}s` } as CSSProperties)
            : undefined
        }
      >
        {isNewBest && <CardCelebrationEffects tier="best" delay={celebrationDelays?.best ?? 0} />}
        <div className="pr-card-content text-[11px] font-black text-green-700 leading-none mb-1">BEST</div>
        <div className="pr-card-content text-[28px] font-black text-green-700 leading-none">{best}</div>
      </div>
    </div>
  );
}

function GameUIComponent({
  score,
  lastScore,
  topScore,
  isGameOver,
  isPaused,
  isNewBest,
  canRestartFromGameOver,
  canContinueFromGameOver,
  personalRecords,
  newPersonalRecords,
  soundEnabled,
  vibrationEnabled,
  onToggleSound,
  onToggleVibration,
  onResume,
  onRestart,
  onContinue,
}: GameUIProps) {
  if (!isGameOver && !isPaused) return null;

  if (isGameOver) {
    const celebrationDelays = getCelebrationDelays(newPersonalRecords, isNewBest);

    return (
      <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center z-40 px-4">
        <CelebrationStyles />
        <CelebrationEffects newRecords={newPersonalRecords} isNewBest={isNewBest} delays={celebrationDelays} />

        <div className="relative z-10 w-[82%] max-w-[320px] rounded-[28px] p-[6px] shadow-2xl bg-[linear-gradient(to_bottom,#F15A18_0%,#C9280D_45%,#9F1708_70%,#641006_100%)]">
          <div className="rounded-[22px] bg-[#f7f0df] p-4">
          <img src={gameOverTitle} alt="Game Over" className="absolute -top-10 left-1/2 -translate-x-1/2 w-[280px] h-auto" draggable={false} />

          <div className="pt-14 flex flex-col gap-3 mb-4">
            <div className="flex justify-between items-center border-b border-[#d8c9a8] pb-2">
              <span className="text-[#5a3216] text-xl font-black">Score:</span>
              <span className="text-[#5a3216] text-2xl font-black">{score}</span>
            </div>
            <div className="hidden justify-between items-center border-b border-[#d8c9a8] pb-2">
              <span className="text-slate-600 text-xl font-black">Last Run:</span>
              <span className="text-slate-700 text-2xl font-black">{lastScore}</span>
            </div>
            <div className="hidden justify-between items-center border-b border-[#d8c9a8] pb-2">
              <span className="text-green-700 text-xl font-black">Best:</span>
              <span className="text-green-700 text-2xl font-black">{topScore}</span>
            </div>
          </div>

          <PersonalRecordsPanel
            records={personalRecords}
            newRecords={newPersonalRecords}
            best={topScore}
            isNewBest={isNewBest}
            celebrationDelays={celebrationDelays}
          />

          {canRestartFromGameOver && (
            canContinueFromGameOver ? (
              <div className="grid grid-cols-2 gap-3 items-center">
                <button type="button" onClick={onContinue} className="pressable-button bg-transparent border-0 p-0 block">
                  <img src={continueButton} alt="Continue" className="w-full h-auto" draggable={false} />
                </button>
                <button type="button" onClick={onRestart} className="pressable-button bg-transparent border-0 p-0 block">
                  <img src={playAgainButton} alt="Play again" className="w-full h-auto" draggable={false} />
                </button>
              </div>
            ) : (
              <button type="button" onClick={onRestart} className="pressable-button w-[48%] mx-auto bg-transparent border-0 p-0 block">
                <img src={playAgainButton} alt="Play again" className="w-full h-auto" draggable={false} />
              </button>
            )
          )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center z-40 px-4">
      <div className="relative w-[90%] max-w-[352px] rounded-[28px] p-[6px] shadow-2xl bg-[linear-gradient(to_bottom,#A6CE12_0%,#88A808_45%,#789808_70%,#588008_100%)]">
        <div className="rounded-[22px] bg-[#f7f0df] p-5">
        <img src={pausedTitle} alt="Paused" className="absolute -top-10 left-1/2 -translate-x-1/2 w-[280px] h-auto" draggable={false} />
        <div className="pt-10 flex flex-col gap-3 mb-4">
          <div className="flex justify-between items-center border-b border-[#d8c9a8] pb-2">
            <span className="text-[#5a3216] text-xl font-black">Score:</span>
            <span className="text-[#5a3216] text-2xl font-black">{score}</span>
          </div>
          <div className="hidden justify-between items-center border-b border-[#d8c9a8] pb-2">
            <span className="text-slate-600 text-xl font-black">Last Run:</span>
            <span className="text-slate-700 text-2xl font-black">{lastScore}</span>
          </div>
          <div className="hidden justify-between items-center border-b border-[#d8c9a8] pb-2">
            <span className="text-green-700 text-xl font-black">Best:</span>
            <span className="text-green-700 text-2xl font-black">{topScore}</span>
          </div>
        </div>
        <PersonalRecordsPanel
          records={personalRecords}
          newRecords={{ daily: false, weekly: false, monthly: false }}
          best={topScore}
          isNewBest={false}
          compact
        />
        <div className="grid grid-cols-2 gap-3 mb-3">
          <button type="button" onClick={onToggleSound} className="pressable-button pressable-button-large bg-transparent border-0 p-0 origin-center" title={soundEnabled ? "Sound ON" : "Sound OFF"}>
            <img src={soundEnabled ? soundOnButton : soundOffButton} alt={soundEnabled ? "Sound ON" : "Sound OFF"} className="w-full h-auto" draggable={false} />
          </button>
          <button type="button" onClick={onToggleVibration} className="pressable-button pressable-button-large bg-transparent border-0 p-0 origin-center" title={vibrationEnabled ? "Vibration ON" : "Vibration OFF"}>
            <img src={vibrationEnabled ? vibrationOnButton : vibrationOffButton} alt={vibrationEnabled ? "Vibration ON" : "Vibration OFF"} className="w-full h-auto" draggable={false} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={onResume} className="pressable-button pressable-button-large bg-transparent border-0 p-0 origin-center">
            <img src={resumeButton} alt="Resume" className="w-full h-auto" draggable={false} />
          </button>
          <button type="button" onClick={onRestart} className="pressable-button pressable-button-large bg-transparent border-0 p-0 origin-center">
            <img src={restartButton} alt="Restart" className="w-full h-auto" draggable={false} />
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}

export const GameUI = memo(GameUIComponent);
