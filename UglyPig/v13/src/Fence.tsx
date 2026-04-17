interface FenceProps {
  y: number;
  gapStart: number;
  gapWidth: number;
  gameWidth: number;
}

export function Fence({ y, gapStart, gapWidth, gameWidth }: FenceProps) {
  const FENCE_HEIGHT = 24; // thicker and clearer fence silhouette
  const POST_WIDTH = 20;

  const renderFenceSegment = (width: number, left: number) => {
    const posts = [];
    for (let i = 0; i < width; i += POST_WIDTH) {
      posts.push(
        <div
          key={i}
          className="absolute bg-amber-900 rounded-sm"
          style={{
            width: "6px",
            height: `${FENCE_HEIGHT}px`,
            left: `${left + i + 7}px`,
            top: "0px",
            boxShadow: "inset -1px 0 0 rgba(255,255,255,0.18)",
          }}
        />
      );
    }
    return posts;
  };

  const segmentClass =
    "absolute bg-amber-700 border-y-2 border-amber-900";

  return (
    <>
      <div
        className={segmentClass}
        style={{
          width: `${gapStart}px`,
          height: `${FENCE_HEIGHT}px`,
          left: "0px",
          top: `${y}px`,
        }}
      >
        {/* top rail */}
        <div className="absolute left-0 right-0 top-[4px] h-[3px] bg-amber-200/45" />
        {/* middle rail */}
        <div className="absolute left-0 right-0 top-[10px] h-[3px] bg-amber-200/35" />
        {/* bottom rail */}
        <div className="absolute left-0 right-0 bottom-[4px] h-[3px] bg-amber-200/30" />
        {renderFenceSegment(gapStart, 0)}
      </div>

      <div
        className={segmentClass}
        style={{
          width: `${gameWidth - gapStart - gapWidth}px`,
          height: `${FENCE_HEIGHT}px`,
          left: `${gapStart + gapWidth}px`,
          top: `${y}px`,
        }}
      >
        <div className="absolute left-0 right-0 top-[4px] h-[3px] bg-amber-200/45" />
        <div className="absolute left-0 right-0 top-[10px] h-[3px] bg-amber-200/35" />
        <div className="absolute left-0 right-0 bottom-[4px] h-[3px] bg-amber-200/30" />
        {renderFenceSegment(gameWidth - gapStart - gapWidth, gapStart + gapWidth)}
      </div>
    </>
  );
}
