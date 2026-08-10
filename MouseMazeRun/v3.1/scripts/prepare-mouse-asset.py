import sys
from pathlib import Path

from PIL import Image, ImageDraw


def main() -> None:
    source = Path(sys.argv[1])
    destination = Path(sys.argv[2])
    image = Image.open(source).convert("RGBA")

    pixels = image.load()
    background = Image.new("L", image.size, 0)
    background_pixels = background.load()

    for y in range(image.height):
        for x in range(image.width):
            red, green, blue, _ = pixels[x, y]
            neutral = max(red, green, blue) - min(red, green, blue) <= 16
            if neutral and min(red, green, blue) >= 205:
                background_pixels[x, y] = 255

    ImageDraw.floodfill(background, (0, 0), 128, thresh=0)

    for y in range(image.height):
        for x in range(image.width):
            if background_pixels[x, y] == 128:
                red, green, blue, _ = pixels[x, y]
                pixels[x, y] = (red, green, blue, 0)

    bounds = image.getbbox()
    if not bounds:
        raise RuntimeError("No foreground remained after background removal")

    padding = 18
    left = max(0, bounds[0] - padding)
    top = max(0, bounds[1] - padding)
    right = min(image.width, bounds[2] + padding)
    bottom = min(image.height, bounds[3] + padding)
    destination.parent.mkdir(parents=True, exist_ok=True)
    image.crop((left, top, right, bottom)).save(destination, optimize=True)


if __name__ == "__main__":
    main()
