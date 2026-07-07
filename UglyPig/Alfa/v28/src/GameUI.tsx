import { memo } from "react";
import resumeButton from "./assets/resume-button.webp";
import restartButton from "./assets/restart-button.webp";
import soundOnButton from "./assets/sound-on-button.webp";
import soundOffButton from "./assets/sound-off-button.webp";
import vibrationOnButton from "./assets/vibration-on-button.webp";
import vibrationOffButton from "./assets/vibration-off-button.webp";
import pausedTitle from "./assets/paused-title.webp";
import playAgainButton from "./assets/play-again-button.webp";

interface GameUIProps {
  score: number;
  lastScore: number;
  topScore: number;
  isGameOver: boolean;
  isPaused: boolean;
  isNewBest: boolean;
  canRestartFromGameOver: boolean;
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

function GameUIComponent({
  score,
  lastScore,
  topScore,
  isGameOver,
  isPaused,
  isNewBest,
  canRestartFromGameOver,
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

        <div className="relative w-[84%] max-w-[326px] rounded-[28px] border-[6px] border-lime-500 bg-[#f7f0df] p-4 shadow-2xl">
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-2xl bg-[#b96a2b] px-8 py-2 text-white text-[33px] font-black tracking-wide border-4 border-[#8e4c18] leading-[0.95]">GAME OVER</div>

          {isNewBest && (
            <div className="absolute -top-2 right-2 bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded-full shadow">
              NEW BEST
            </div>
          )}

          <div className="pt-10 flex flex-col gap-3 mb-4">
            <div className="flex justify-between items-center border-b border-[#d8c9a8] pb-2">
              <span className="text-[#5a3216] text-xl font-black">Score:</span>
              <span className="text-[#5a3216] text-2xl font-black">{score}</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#d8c9a8] pb-2">
              <span className="text-slate-600 text-xl font-black">Last Run:</span>
              <span className="text-slate-700 text-2xl font-black">{lastScore}</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#d8c9a8] pb-2">
              <span className="text-green-700 text-xl font-black">Best:</span>
              <span className="text-green-700 text-2xl font-black">{topScore}</span>
            </div>
          </div>

          {canRestartFromGameOver && (
            <button type="button" onClick={onRestart} className="w-[82%] mx-auto bg-transparent border-0 p-0 block">
              <img src={playAgainButton} alt="Play again" className="w-full h-auto" draggable={false} />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center z-40 px-4">
      <div className="relative w-[90%] max-w-[352px] rounded-[28px] border-[6px] border-lime-500 bg-[#f7f0df] p-5 shadow-2xl">
        <img src={pausedTitle} alt="Paused" className="absolute -top-10 left-1/2 -translate-x-1/2 w-[280px] h-auto" draggable={false} />
        <div className="pt-10 flex flex-col gap-3 mb-4">
          <div className="flex justify-between items-center border-b border-[#d8c9a8] pb-2">
            <span className="text-[#5a3216] text-xl font-black">Score:</span>
            <span className="text-[#5a3216] text-2xl font-black">{score}</span>
          </div>
          <div className="flex justify-between items-center border-b border-[#d8c9a8] pb-2">
            <span className="text-slate-600 text-xl font-black">Last Run:</span>
            <span className="text-slate-700 text-2xl font-black">{lastScore}</span>
          </div>
          <div className="flex justify-between items-center border-b border-[#d8c9a8] pb-2">
            <span className="text-green-700 text-xl font-black">Best:</span>
            <span className="text-green-700 text-2xl font-black">{topScore}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <button type="button" onClick={onToggleSound} className="bg-transparent border-0 p-0" title={soundEnabled ? "Sound ON" : "Sound OFF"}>
            <img src={soundEnabled ? soundOnButton : soundOffButton} alt={soundEnabled ? "Sound ON" : "Sound OFF"} className="w-full h-auto" draggable={false} />
          </button>
          <button type="button" onClick={onToggleVibration} className="bg-transparent border-0 p-0" title={vibrationEnabled ? "Vibration ON" : "Vibration OFF"}>
            <img src={vibrationEnabled ? vibrationOnButton : vibrationOffButton} alt={vibrationEnabled ? "Vibration ON" : "Vibration OFF"} className="w-full h-auto" draggable={false} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={onResume} className="bg-transparent border-0 p-0">
            <img src={resumeButton} alt="Resume" className="w-full h-auto" draggable={false} />
          </button>
          <button type="button" onClick={onRestart} className="bg-transparent border-0 p-0">
            <img src={restartButton} alt="Restart" className="w-full h-auto" draggable={false} />
          </button>
        </div>
      </div>
    </div>
  );
}

export const GameUI = memo(GameUIComponent);
