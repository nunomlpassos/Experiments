import sys
from pathlib import Path

from PIL import Image


def main() -> None:
    source = Path(sys.argv[1])
    destination = Path(sys.argv[2])
    strip = Image.open(source).convert("RGBA")
    frame_size = strip.height
    frame_count = strip.width // frame_size
    mirrored = Image.new("RGBA", strip.size, (0, 0, 0, 0))

    for index in range(frame_count):
        frame = strip.crop(
            (
                index * frame_size,
                0,
                (index + 1) * frame_size,
                frame_size,
            )
        )
        frame = frame.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
        mirrored.alpha_composite(frame, (index * frame_size, 0))

    destination.parent.mkdir(parents=True, exist_ok=True)
    mirrored.save(destination, optimize=True)


if __name__ == "__main__":
    main()
