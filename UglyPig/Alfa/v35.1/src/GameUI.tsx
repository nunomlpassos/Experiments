import { memo } from "react";
import resumeButton from "./assets/resume-button.webp";
import restartButton from "./assets/restart-button.webp";
import soundOnButton from "./assets/sound-on-button.webp";
import soundOffButton from "./assets/sound-off-button.webp";
import vibrationOnButton from "./assets/vibration-on-button.webp";
import vibrationOffButton from "./assets/vibration-off-button.webp";
import pausedTitle from "./assets/paused-title.webp";
import playAgainButton from "./assets/play-again-button.webp";
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
  personalRecords: PersonalRecords;
  newPersonalRecords: PersonalRecordFlags;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  onToggleSound: () => void;
  onToggleVibration: () => void;
  onResume: () => void;
  onRestart: () => void;
}

function CelebrationEffects() {
  const confetti = Array.from({ length: 18 }, (_, i) => i);
  const fireworks = Array.from({ length: 3 }, (_, i) => i);

  return (
    <>
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(180px) rotate(320deg); opacity: 0; }
        }
        @keyframes boom {
          0% { transform: scale(0.2); opacity: 0.9; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>

      <div className="absolute left-3 top-16 z-50 pointer-events-none">
        {confetti.slice(0, 9).map((i) => (
          <span
            key={`l-${i}`}
            className="absolute block w-2 h-4 rounded"
            style={{
              left: `${(i % 3) * 10}px`,
              background: ["#f59e0b", "#22c55e", "#3b82f6", "#ec4899"][i % 4],
              animation: `confettiFall ${1 + (i % 3) * 0.3}s ease-out ${(i % 4) * 0.1}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="absolute right-3 top-16 z-50 pointer-events-none">
        {confetti.slice(9).map((i) => (
          <span
            key={`r-${i}`}
            className="absolute block w-2 h-4 rounded"
            style={{
              right: `${(i % 3) * 10}px`,
              background: ["#f59e0b", "#22c55e", "#3b82f6", "#ec4899"][i % 4],
              animation: `confettiFall ${1 + (i % 3) * 0.3}s ease-out ${(i % 4) * 0.1}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        {fireworks.map((i) => (
          <span
            key={i}
            className="absolute rounded-full border-2"
            style={{
              left: `${(i - 1) * 42}px`,
              width: "22px",
              height: "22px",
              borderColor: ["#f59e0b", "#60a5fa", "#34d399"][i],
              animation: `boom 1s ease-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </>
  );
}

function PersonalRecordsPanel({
  records,
  newRecords,
  best,
  isNewBest,
  compact = false,
}: {
  records: PersonalRecords;
  newRecords: PersonalRecordFlags;
  best: number;
  isNewBest: boolean;
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
            }`}
          >
            {item.isNew && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-[#e3a008] px-2 py-[1px] text-[8px] font-black text-white leading-none">
                NEW
              </div>
            )}
            <div className="text-[10px] font-black text-[#8e4c18] leading-none mb-1">{item.label}</div>
            <div className="text-[22px] font-black text-[#5a3216] leading-none">{item.value}</div>
          </div>
        ))}
      </div>
      <div
        className={`relative mt-2 rounded-xl border-2 px-3 py-2 text-center shadow-inner ${
          isNewBest ? "bg-[#fff2a8] border-[#e3a008]" : "bg-white/80 border-[#d8c9a8]"
        }`}
      >
        {isNewBest && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-[#e3a008] px-2 py-[1px] text-[8px] font-black text-white leading-none">
            NEW
          </div>
        )}
        <div className="text-[11px] font-black text-green-700 leading-none mb-1">BEST</div>
        <div className="text-[28px] font-black text-green-700 leading-none">{best}</div>
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
  personalRecords,
  newPersonalRecords,
  soundEnabled,
  vibrationEnabled,
  onToggleSound,
  onToggleVibration,
  onResume,
  onRestart,
}: GameUIProps) {
  if (!isGameOver && !isPaused) return null;

  if (isGameOver) {
    return (
      <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center z-40 px-4">
        {isNewBest && <CelebrationEffects />}

        <div className="relative w-[82%] max-w-[320px] rounded-[28px] p-[6px] shadow-2xl bg-[linear-gradient(to_bottom,#F15A18_0%,#C9280D_45%,#9F1708_70%,#641006_100%)]">
          <div className="rounded-[22px] bg-[#f7f0df] p-4">
          <img src={gameOverTitle} alt="Game Over" className="absolute -top-10 left-1/2 -translate-x-1/2 w-[280px] h-auto" draggable={false} />

          {isNewBest && (
            <div className="absolute -top-2 right-2 bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded-full shadow">
              NEW BEST
            </div>
          )}

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

          <PersonalRecordsPanel records={personalRecords} newRecords={newPersonalRecords} best={topScore} isNewBest={isNewBest} />

          {canRestartFromGameOver && (
            <button type="button" onClick={onRestart} className="w-[48%] mx-auto bg-transparent border-0 p-0 block">
              <img src={playAgainButton} alt="Play again" className="w-full h-auto" draggable={false} />
            </button>
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
          <button type="button" onClick={onToggleSound} className="bg-transparent border-0 p-0 scale-[1.02] origin-center" title={soundEnabled ? "Sound ON" : "Sound OFF"}>
            <img src={soundEnabled ? soundOnButton : soundOffButton} alt={soundEnabled ? "Sound ON" : "Sound OFF"} className="w-full h-auto" draggable={false} />
          </button>
          <button type="button" onClick={onToggleVibration} className="bg-transparent border-0 p-0 scale-[1.02] origin-center" title={vibrationEnabled ? "Vibration ON" : "Vibration OFF"}>
            <img src={vibrationEnabled ? vibrationOnButton : vibrationOffButton} alt={vibrationEnabled ? "Vibration ON" : "Vibration OFF"} className="w-full h-auto" draggable={false} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={onResume} className="bg-transparent border-0 p-0 scale-[1.02] origin-center">
            <img src={resumeButton} alt="Resume" className="w-full h-auto" draggable={false} />
          </button>
          <button type="button" onClick={onRestart} className="bg-transparent border-0 p-0 scale-[1.02] origin-center">
            <img src={restartButton} alt="Restart" className="w-full h-auto" draggable={false} />
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}

export const GameUI = memo(GameUIComponent);
