const sourceMouse = document.querySelector("#sourceMouse");
const canvas = document.querySelector("#skinCanvas");
const context = canvas.getContext("2d", { willReadFrequently: true });
const paletteOutput = document.querySelector("#paletteOutput");

const controls = {
  body: document.querySelector("#bodyColor"),
  head: document.querySelector("#headColor"),
  ears: document.querySelector("#earsColor"),
  eyes: document.querySelector("#eyesColor"),
  tail: document.querySelector("#tailColor"),
  innerEars: document.querySelector("#innerEarsColor"),
  whiskers: document.querySelector("#whiskersColor"),
};

const originalPalette = {
  body: "#666769",
  head: "#99999b",
  ears: "#727375",
  eyes: "#282725",
  tail: "#df8580",
  innerEars: "#ef9995",
  whiskers: "#45413f",
};

const presets = {
  original: originalPalette,
  albino: {
    body: "#e5ddd8",
    head: "#f3efeb",
    ears: "#e8e1dd",
    eyes: "#a31120",
    tail: "#e6aaa5",
    innerEars: "#f1b7b4",
    whiskers: "#7d6663",
  },
  chocolate: {
    body: "#503426",
    head: "#76503b",
    ears: "#5a392b",
    eyes: "#17100d",
    tail: "#b86f65",
    innerEars: "#da9188",
    whiskers: "#2f211b",
  },
  arctic: {
    body: "#9bbac9",
    head: "#d2e4ea",
    ears: "#aecbd7",
    eyes: "#174f78",
    tail: "#9ec8dc",
    innerEars: "#b8d9e6",
    whiskers: "#3f6575",
  },
  forest: {
    body: "#48603e",
    head: "#718465",
    ears: "#536a49",
    eyes: "#202617",
    tail: "#9e765e",
    innerEars: "#c79b82",
    whiskers: "#313d2a",
  },
};

let sourcePixels = null;
let activePreset = "original";

function hexToRgb(hex) {
  const value = Number.parseInt(hex.slice(1), 16);
  return {
    red: (value >> 16) & 255,
    green: (value >> 8) & 255,
    blue: value & 255,
  };
}

function rgbToHsl(red, green, blue) {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  const delta = max - min;
  if (delta === 0) return { hue: 0, saturation: 0, lightness };

  const saturation = delta / (1 - Math.abs(2 * lightness - 1));
  let hue;
  if (max === r) hue = 60 * (((g - b) / delta) % 6);
  else if (max === g) hue = 60 * ((b - r) / delta + 2);
  else hue = 60 * ((r - g) / delta + 4);
  if (hue < 0) hue += 360;
  return { hue, saturation, lightness };
}

function hslToRgb(hue, saturation, lightness) {
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const segment = hue / 60;
  const secondary = chroma * (1 - Math.abs((segment % 2) - 1));
  let r = 0;
  let g = 0;
  let b = 0;

  if (segment < 1) [r, g] = [chroma, secondary];
  else if (segment < 2) [r, g] = [secondary, chroma];
  else if (segment < 3) [g, b] = [chroma, secondary];
  else if (segment < 4) [g, b] = [secondary, chroma];
  else if (segment < 5) [r, b] = [secondary, chroma];
  else [r, b] = [chroma, secondary];

  const match = lightness - chroma / 2;
  return {
    red: Math.round((r + match) * 255),
    green: Math.round((g + match) * 255),
    blue: Math.round((b + match) * 255),
  };
}

function insideEllipse(x, y, centerX, centerY, radiusX, radiusY) {
  const dx = (x - centerX) / radiusX;
  const dy = (y - centerY) / radiusY;
  return dx * dx + dy * dy <= 1;
}

function distanceToSegment(x, y, startX, startY, endX, endY) {
  const segmentX = endX - startX;
  const segmentY = endY - startY;
  const lengthSquared = segmentX * segmentX + segmentY * segmentY;
  const position = Math.max(
    0,
    Math.min(1, ((x - startX) * segmentX + (y - startY) * segmentY) / lengthSquared),
  );
  const nearestX = startX + position * segmentX;
  const nearestY = startY + position * segmentY;
  return Math.hypot(x - nearestX, y - nearestY);
}

function classifyPixel(x, y, red, green, blue, alpha) {
  if (alpha < 18) return null;

  const maximum = Math.max(red, green, blue);
  const minimum = Math.min(red, green, blue);
  const chroma = maximum - minimum;
  const lightness = red * 0.299 + green * 0.587 + blue * 0.114;
  const pink = red > green + 7 && red > blue + 4;
  const dark = lightness < 105;

  const leftInnerEar = insideEllipse(x, y, 92, 120, 70, 90);
  const rightInnerEar = insideEllipse(x, y, 369, 233, 90, 100);
  if (pink && (leftInnerEar || rightInnerEar)) return "innerEars";
  const insideRightEar = insideEllipse(x, y, 371, 233, 112, 122);
  if (pink && x > 300 && y > 305 && !insideRightEar) return "tail";

  const leftEye = insideEllipse(x, y, 80, 292, 27, 38);
  const rightEye = insideEllipse(x, y, 224, 340, 30, 43);
  if (dark && (leftEye || rightEye)) return "eyes";

  const whiskerSegments = [
    [12, 320, 55, 350],
    [10, 347, 57, 359],
    [18, 371, 61, 372],
    [214, 407, 286, 400],
    [205, 426, 282, 441],
    [214, 445, 270, 467],
  ];
  const whisker = whiskerSegments.some((segment) => distanceToSegment(x, y, ...segment) <= 1.8);
  if (lightness < 120 && chroma < 45 && whisker) return "whiskers";

  const insideFace = insideEllipse(x, y, 190, 314, 174, 184);
  const leftOuterEar = insideEllipse(x, y, 106, 113, 98, 108) && !insideFace;
  const rightOuterEar = insideEllipse(x, y, 371, 224, 109, 111);
  if (chroma < 48 && lightness < 184 && (leftOuterEar || rightOuterEar)) return "ears";

  const bodyBoundary = 370 - Math.max(0, y - 235) * 0.35;
  const visibleBody = y > 220 && y < 480 && x > bodyBoundary;
  if (chroma < 48 && visibleBody) return "body";

  if (chroma < 48 && insideFace) return "head";

  return null;
}

function colorize(red, green, blue, targetHex, referenceHex, region) {
  const sourceHsl = rgbToHsl(red, green, blue);
  const target = hexToRgb(targetHex);
  const targetHsl = rgbToHsl(target.red, target.green, target.blue);
  const reference = hexToRgb(referenceHex);
  const referenceHsl = rgbToHsl(reference.red, reference.green, reference.blue);
  const difference = sourceHsl.lightness - referenceHsl.lightness;
  let lightness = difference >= 0
    ? targetHsl.lightness + difference * ((1 - targetHsl.lightness) / (1 - referenceHsl.lightness))
    : targetHsl.lightness + difference * (targetHsl.lightness / referenceHsl.lightness);
  const shadowFloorRatio = region === "innerEars" ? 0.72 : region === "ears" ? 0.62 : 0;
  if (shadowFloorRatio > 0) {
    lightness = Math.max(lightness, targetHsl.lightness * shadowFloorRatio);
  }
  return hslToRgb(targetHsl.hue, targetHsl.saturation, Math.max(0, Math.min(1, lightness)));
}

function currentPalette() {
  return Object.fromEntries(Object.entries(controls).map(([part, control]) => [part, control.value]));
}

function render() {
  if (!sourcePixels) return;
  const palette = currentPalette();
  const rendered = new ImageData(new Uint8ClampedArray(sourcePixels.data), sourcePixels.width, sourcePixels.height);

  for (let y = 0; y < rendered.height; y += 1) {
    for (let x = 0; x < rendered.width; x += 1) {
      const index = (y * rendered.width + x) * 4;
      const region = classifyPixel(
        x,
        y,
        rendered.data[index],
        rendered.data[index + 1],
        rendered.data[index + 2],
        rendered.data[index + 3],
      );
      if (!region) continue;
      const paletteRegion = region;
      if (palette[paletteRegion] === originalPalette[paletteRegion]) continue;

      const result = colorize(
        rendered.data[index],
        rendered.data[index + 1],
        rendered.data[index + 2],
        palette[paletteRegion],
        originalPalette[paletteRegion],
        paletteRegion,
      );
      rendered.data[index] = result.red;
      rendered.data[index + 1] = result.green;
      rendered.data[index + 2] = result.blue;
    }
  }

  context.putImageData(rendered, 0, 0);
  paletteOutput.textContent = `const skinPalette = ${JSON.stringify(palette, null, 2)};`;
}

function applyPreset(name) {
  const preset = presets[name];
  if (!preset) return;
  activePreset = name;
  Object.entries(preset).forEach(([part, color]) => {
    controls[part].value = color;
  });
  document.querySelectorAll("[data-preset]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.preset === name));
  });
  render();
}

Object.values(controls).forEach((control) => {
  control.addEventListener("input", () => {
    activePreset = "custom";
    document.querySelectorAll("[data-preset]").forEach((button) => {
      button.setAttribute("aria-pressed", "false");
    });
    render();
  });
});

document.querySelectorAll("[data-preset]").forEach((button) => {
  button.addEventListener("click", () => applyPreset(button.dataset.preset));
});

document.querySelector("#resetButton").addEventListener("click", () => applyPreset("original"));

document.querySelector("#downloadButton").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `mouse-skin-${activePreset}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
});

document.querySelector("#copyButton").addEventListener("click", async (event) => {
  await navigator.clipboard.writeText(paletteOutput.textContent);
  const button = event.currentTarget;
  button.textContent = "Copied";
  window.setTimeout(() => {
    button.textContent = "Copy palette";
  }, 1200);
});

function initialize() {
  canvas.width = sourceMouse.naturalWidth;
  canvas.height = sourceMouse.naturalHeight;
  context.drawImage(sourceMouse, 0, 0);
  sourcePixels = context.getImageData(0, 0, canvas.width, canvas.height);
  applyPreset("original");
}

if (sourceMouse.complete && sourceMouse.naturalWidth) initialize();
else sourceMouse.addEventListener("load", initialize, { once: true });
