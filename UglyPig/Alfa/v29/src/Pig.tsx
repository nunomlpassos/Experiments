import pigRightImage from "./assets/pig-right.webp";

interface PigProps {
  x: number;
  y: number;
  direction: number;
  size?: number;
  crashRotation?: number;
  crashOffsetY?: number;
}

export function Pig({ x, y, direction, size = 44, crashRotation = 0, crashOffsetY = 0 }: PigProps) {
  return (
    <div
      className="absolute"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${x}px`,
        top: `${y + crashOffsetY}px`,
        transform: `${direction === -1 ? "scaleX(-1)" : "scaleX(1)"} rotate(${crashRotation}deg)`,
        transformOrigin: "50% 50%",
      }}
    >
      <img src={pigRightImage} alt="Pig" className="w-full h-full object-contain select-none pointer-events-none" draggable={false} />
    </div>
  );
}
