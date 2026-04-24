import gameBackground from "./assets/game-background.jpg";

interface FarmBackgroundProps {
  gameWidth: number;
  gameHeight: number;
}

export function FarmBackground({ gameWidth, gameHeight }: FarmBackgroundProps) {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <img
        src={gameBackground}
        alt="Farm background"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ width: `${gameWidth}px`, height: `${gameHeight}px` }}
      />

      {/* subtle dark overlay for better contrast with UI/game elements */}
      <div className="absolute inset-0 bg-black/10" />
    </div>
  );
}
