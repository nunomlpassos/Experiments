import sys
from pathlib import Path

from PIL import Image


FRAME_SIZE = 384
SUBJECT_SIZE = 330
BOTTOM_ANCHOR = 354


def main() -> None:
    source = Path(sys.argv[1])
    destination = Path(sys.argv[2])
    use_shared_scale = "--shared-scale" in sys.argv[3:]
    sheet = Image.open(source).convert("RGBA")
    tile_width = sheet.width // 2
    tile_height = sheet.height // 2
    subjects = []

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
        bounds = tile.getbbox()
        if not bounds:
            raise RuntimeError(f"Frame {index + 1} has no visible mouse")

        subjects.append(tile.crop(bounds))

    shared_scale = None
    if use_shared_scale:
        shared_scale = min(
            SUBJECT_SIZE / max(subject.width for subject in subjects),
            SUBJECT_SIZE / max(subject.height for subject in subjects),
        )

    frames = []
    for subject in subjects:
        scale = shared_scale or min(
            SUBJECT_SIZE / subject.width,
            SUBJECT_SIZE / subject.height,
        )
        resized = subject.resize(
            (
                max(1, round(subject.width * scale)),
                max(1, round(subject.height * scale)),
            ),
            Image.Resampling.LANCZOS,
        )
        frame = Image.new("RGBA", (FRAME_SIZE, FRAME_SIZE), (0, 0, 0, 0))
        left = (FRAME_SIZE - resized.width) // 2
        top = BOTTOM_ANCHOR - resized.height
        frame.alpha_composite(resized, (left, top))
        frames.append(frame)

    strip = Image.new("RGBA", (FRAME_SIZE * len(frames), FRAME_SIZE), (0, 0, 0, 0))
    for index, frame in enumerate(frames):
        strip.alpha_composite(frame, (index * FRAME_SIZE, 0))

    destination.parent.mkdir(parents=True, exist_ok=True)
    strip.save(destination, optimize=True)


if __name__ == "__main__":
    main()
