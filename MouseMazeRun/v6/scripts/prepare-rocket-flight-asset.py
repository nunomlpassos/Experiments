"""Prepare an upright, flame-free rocket body for the flight animation."""

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
SOURCE = ASSETS / "rocket-power.png"
OUTPUT = ASSETS / "rocket-flight-body.png"


def remove_baked_flame(image):
    cleaned = image.convert("RGBA")
    pixels = cleaned.load()
    width, height = cleaned.size

    # The flame begins below the rocket's diagonal nozzle edge. Keeping this
    # boundary diagonal preserves the full pink nozzle while removing only fire.
    for y in range(height):
        for x in range(width):
            if y > 0.28 * x + 790 and x < width * 0.55:
                red, green, blue, alpha = pixels[x, y]
                if alpha > 0:
                    pixels[x, y] = (red, green, blue, 0)
            elif y > 0.2 * x + 720 and x < width * 0.55:
                red, green, blue, alpha = pixels[x, y]
                if alpha > 0 and red > 130 and blue < 80:
                    pixels[x, y] = (red, green, blue, 0)

    return cleaned


def crop_to_subject(image, padding=18):
    bounds = image.getchannel("A").getbbox()
    if not bounds:
        return image
    left, top, right, bottom = bounds
    return image.crop(
        (
            max(0, left - padding),
            max(0, top - padding),
            min(image.width, right + padding),
            min(image.height, bottom + padding),
        ),
    )


def main():
    source = Image.open(SOURCE)
    body = remove_baked_flame(source)
    upright = body.rotate(15, resample=Image.Resampling.BICUBIC, expand=True)
    prepared = crop_to_subject(upright)
    prepared = prepared.crop((0, 0, prepared.width, prepared.height - 35))
    prepared.save(OUTPUT)


if __name__ == "__main__":
    main()
