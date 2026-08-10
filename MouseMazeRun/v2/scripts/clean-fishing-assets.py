"""Remove enclosed neutral-white background regions from fishing sprites."""

from collections import deque
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"


def is_trapped_background(pixel):
    red, green, blue, alpha = pixel
    return (
        alpha > 16
        and min(red, green, blue) > 225
        and max(red, green, blue) - min(red, green, blue) < 14
    )


def clear_large_light_components(image, minimum_size):
    cleaned = image.convert("RGBA")
    pixels = cleaned.load()
    width, height = cleaned.size
    visited = set()

    for y in range(height):
        for x in range(width):
            if (x, y) in visited or not is_trapped_background(pixels[x, y]):
                continue

            queue = deque([(x, y)])
            visited.add((x, y))
            component = []

            while queue:
                current_x, current_y = queue.popleft()
                component.append((current_x, current_y))
                for next_x, next_y in (
                    (current_x - 1, current_y),
                    (current_x + 1, current_y),
                    (current_x, current_y - 1),
                    (current_x, current_y + 1),
                ):
                    if not (0 <= next_x < width and 0 <= next_y < height):
                        continue
                    if (next_x, next_y) in visited:
                        continue
                    if not is_trapped_background(pixels[next_x, next_y]):
                        continue
                    visited.add((next_x, next_y))
                    queue.append((next_x, next_y))

            if len(component) >= minimum_size:
                for component_x, component_y in component:
                    red, green, blue, _ = pixels[component_x, component_y]
                    pixels[component_x, component_y] = (red, green, blue, 0)

    return cleaned


def clean_power_icon():
    source = Image.open(ASSETS / "fishing-power.png")
    cleaned = clear_large_light_components(source, minimum_size=1000)
    cleaned.save(ASSETS / "fishing-power-transparent-v2.png")


def clean_transform_strip():
    source = Image.open(
        ASSETS / "power-transform-fishing-strip-v2.png",
    ).convert("RGBA")
    frame_width = source.height
    frame_count = source.width // frame_width
    output = Image.new("RGBA", source.size, (0, 0, 0, 0))

    for frame_index in range(frame_count):
        left = frame_index * frame_width
        frame = source.crop((left, 0, left + frame_width, source.height))
        cleaned = clear_large_light_components(frame, minimum_size=100)
        output.alpha_composite(cleaned, (left, 0))

    output.save(ASSETS / "power-transform-fishing-strip-v3.png")


if __name__ == "__main__":
    clean_power_icon()
    clean_transform_strip()
