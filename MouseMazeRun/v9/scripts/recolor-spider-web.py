import sys
from pathlib import Path

from PIL import Image


def main() -> None:
    source = Path(sys.argv[1])
    destination = Path(sys.argv[2])
    image = Image.open(source).convert("RGBA")
    pixels = image.load()

    for y in range(image.height):
        for x in range(image.width):
            red, green, blue, alpha = pixels[x, y]
            if alpha == 0:
                continue
            lightness = red * 0.299 + green * 0.587 + blue * 0.114
            shade = max(145, min(254, round(142 + lightness * 0.44)))
            pixels[x, y] = (shade, min(255, shade + 1), min(255, shade + 3), alpha)

    destination.parent.mkdir(parents=True, exist_ok=True)
    image.save(destination, optimize=True)
    print(f"Prepared {destination} ({image.width}x{image.height})")


if __name__ == "__main__":
    main()
