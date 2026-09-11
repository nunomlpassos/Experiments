import sys
from pathlib import Path

from PIL import Image


FRAME_SIZE = 384


def main() -> None:
    source = Path(sys.argv[1])
    destination = Path(sys.argv[2])
    sheet = Image.open(source).convert("RGBA")
    tile_width = sheet.width // 2
    tile_height = sheet.height // 2
    strip = Image.new("RGBA", (FRAME_SIZE * 4, FRAME_SIZE), (0, 0, 0, 0))

    for index in range(4):
        col = index % 2
        row = index // 2
        tile = sheet.crop(
            (
                col * tile_width,
                row * tile_height,
                (col + 1) * tile_width,
                (row + 1) * tile_height,
            )
        )
        frame = tile.resize((FRAME_SIZE, FRAME_SIZE), Image.Resampling.LANCZOS)
        strip.alpha_composite(frame, (index * FRAME_SIZE, 0))

    destination.parent.mkdir(parents=True, exist_ok=True)
    strip.save(destination, optimize=True)


if __name__ == "__main__":
    main()
