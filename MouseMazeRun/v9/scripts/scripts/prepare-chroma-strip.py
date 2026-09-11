import sys
from pathlib import Path

from PIL import Image


FRAME_SIZE = 512
FRAME_PADDING = 22


def remove_green_screen(image: Image.Image) -> Image.Image:
    image = image.convert("RGBA")
    pixels = image.load()

    for y in range(image.height):
        for x in range(image.width):
            red, green, blue, _ = pixels[x, y]
            dominant_green = green - max(red, blue)
            if green < 95 or dominant_green < 18:
                continue

            removal = max(0.0, min(1.0, (dominant_green - 18) / 118))
            alpha = round(255 * (1 - removal))
            if alpha <= 4:
                pixels[x, y] = (0, 0, 0, 0)
                continue

            clean_green = min(green, max(red, blue) + 10)
            pixels[x, y] = (red, clean_green, blue, alpha)

    return image


def main() -> None:
    source = Path(sys.argv[1])
    destination = Path(sys.argv[2])
    frame_count = int(sys.argv[3]) if len(sys.argv) > 3 else 6
    image = remove_green_screen(Image.open(source))
    source_frame_width = image.width / frame_count
    alpha = image.getchannel("A")
    foreground_per_column = [
        sum(1 for y in range(image.height) if alpha.getpixel((x, y)) > 10)
        for x in range(image.width)
    ]
    search_radius = max(12, round(source_frame_width * 0.2))
    separators = [0]
    for index in range(1, frame_count):
        expected = round(source_frame_width * index)
        start = max(separators[-1] + 1, expected - search_radius)
        end = min(image.width - 1, expected + search_radius)
        separator = min(
            range(start, end + 1),
            key=lambda x: (foreground_per_column[x], abs(x - expected)),
        )
        separators.append(separator)
    separators.append(image.width)
    frames = []
    bounds = []

    for index in range(frame_count):
        left = separators[index]
        right = separators[index + 1]
        frame = image.crop((left, 0, right, image.height))
        alpha = frame.getchannel("A")
        bbox = alpha.point(lambda value: 255 if value > 10 else 0).getbbox()
        if not bbox:
            raise RuntimeError(f"No foreground remained in frame {index + 1}")
        frames.append(frame)
        bounds.append(bbox)

    max_width = max(right - left for left, _, right, _ in bounds)
    max_height = max(bottom - top for _, top, _, bottom in bounds)
    scale = min(
        (FRAME_SIZE - FRAME_PADDING * 2) / max_width,
        (FRAME_SIZE - FRAME_PADDING * 2) / max_height,
    )

    strip = Image.new("RGBA", (FRAME_SIZE * frame_count, FRAME_SIZE), (0, 0, 0, 0))
    baseline = FRAME_SIZE - FRAME_PADDING
    for index, (frame, bbox) in enumerate(zip(frames, bounds)):
        cropped = frame.crop(bbox)
        width = max(1, round(cropped.width * scale))
        height = max(1, round(cropped.height * scale))
        resized = cropped.resize((width, height), Image.Resampling.LANCZOS)
        x = index * FRAME_SIZE + (FRAME_SIZE - width) // 2
        y = baseline - height
        strip.alpha_composite(resized, (x, y))

    destination.parent.mkdir(parents=True, exist_ok=True)
    strip.save(destination, optimize=True)
    print(f"Prepared {destination} ({strip.width}x{strip.height})")


if __name__ == "__main__":
    main()
