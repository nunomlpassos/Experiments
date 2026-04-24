export function generateFence(gameWidth: number) {
  const minGapWidth = 140; // wider gap for casual players
  const maxGapWidth = 200;
  const gapWidth = Math.floor(Math.random() * (maxGapWidth - minGapWidth + 1)) + minGapWidth;
  
  const maxGapStart = gameWidth - gapWidth;
  const gapStart = Math.floor(Math.random() * maxGapStart);

  return {
    y: -21,
    gapStart,
    gapWidth,
  };
}