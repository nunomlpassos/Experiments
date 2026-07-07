export function generateFence(gameWidth: number, minGapWidth = 160, maxGapWidth = 220) {
  const safeMinGapWidth = Math.min(gameWidth, Math.max(1, minGapWidth));
  const safeMaxGapWidth = Math.min(gameWidth, Math.max(safeMinGapWidth, maxGapWidth));
  const gapWidth = Math.floor(Math.random() * (safeMaxGapWidth - safeMinGapWidth + 1)) + safeMinGapWidth;
  
  const maxGapStart = Math.max(0, gameWidth - gapWidth);
  const gapStart = Math.floor(Math.random() * maxGapStart);

  return {
    y: -21,
    gapStart,
    gapWidth,
  };
}
