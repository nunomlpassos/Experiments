import { memo } from "react";

interface FenceProps {
  y: number;
  gapStart: number;
  gapWidth: number;
  gameWidth: number;
}

const FENCE_HEIGHT = 34;

function FenceSegment({ width, left, y }: { width: number; left: number; y: number }) {
  if (width <= 0) return null;

  return (
    <div
      className="absolute"
      style={{
        left: `${left}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${FENCE_HEIGHT}px`,
      }}
    >
      {/* Main wood body with much cheaper rendering than dozens of picket divs */}
      <div
        className="absolute inset-0 border border-amber-900"
        style={{
          background:
            "repeating-linear-gradient(90deg, #b66f16 0px, #d7922b 9px, #ab6310 18px)",
        }}
      />

      {/* horizontal rails */}
      <div className="absolute left-0 right-0 top-[8px] h-[4px] bg-amber-200/35" />
      <div className="absolute left-0 right-0 top-[20px] h-[4px] bg-amber-200/25" />
    </div>
  );
}

function FenceComponent({ y, gapStart, gapWidth, gameWidth }: FenceProps) {
  const rightWidth = gameWidth - gapStart - gapWidth;

  return (
    <>
      <FenceSegment width={gapStart} left={0} y={y} />
      <FenceSegment width={rightWidth} left={gapStart + gapWidth} y={y} />
    </>
  );
}

export const Fence = memo(FenceComponent);
