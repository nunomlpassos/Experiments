import sys
from pathlib import Path

from PIL import Image


FRAME_SIZE = 384
SHEET_COLUMNS = 4
SHEET_ROWS = 2
FRAME_COUNT = SHEET_COLUMNS * SHEET_ROWS
TILE_INSET = 6


def keep_largest_alpha_component(frame: Image.Image) -> Image.Image:
    alpha = frame.getchannel("A")
    width, height = alpha.size
    mask = bytearray(value > 16 for value in alpha.tobytes())
    visited = bytearray(width * height)
    largest: list[int] = []

    for start in range(width * height):
        if not mask[start] or visited[start]:
            continue
        component: list[int] = []
        stack = [start]
        visited[start] = 1
        while stack:
            index = stack.pop()
            component.append(index)
            x = index % width
            y = index // width
            for neighbor in (
                index - 1 if x else -1,
                index + 1 if x + 1 < width else -1,
                index - width if y else -1,
                index + width if y + 1 < height else -1,
            ):
                if neighbor >= 0 and mask[neighbor] and not visited[neighbor]:
                    visited[neighbor] = 1
                    stack.append(neighbor)
        if len(component) > len(largest):
            largest = component

    kept = bytearray(width * height)
    original_alpha = alpha.tobytes()
    for index in largest:
        kept[index] = original_alpha[index]
    cleaned = frame.copy()
    cleaned.putalpha(Image.frombytes("L", (width, height), bytes(kept)))
    return cleaned


def fit_frame_to_bbox(frame: Image.Image, target_bbox: tuple[int, int, int, int]) -> Image.Image:
    source_bbox = frame.getbbox()
    if not source_bbox:
        return frame

    subject = frame.crop(source_bbox)
    target_width = target_bbox[2] - target_bbox[0]
    target_height = target_bbox[3] - target_bbox[1]
    scale = min(target_width / subject.width, target_height / subject.height)
    resized = subject.resize(
        (
            max(1, round(subject.width * scale)),
            max(1, round(subject.height * scale)),
        ),
        Image.Resampling.LANCZOS,
    )
    fitted = Image.new("RGBA", (FRAME_SIZE, FRAME_SIZE), (0, 0, 0, 0))
    target_center_x = (target_bbox[0] + target_bbox[2]) / 2
    target_center_y = (target_bbox[1] + target_bbox[3]) / 2
    fitted.alpha_composite(
        resized,
        (
            round(target_center_x - resized.width / 2),
            round(target_center_y - resized.height / 2),
        ),
    )
    return fitted


def main() -> None:
    source = Path(sys.argv[1])
    destination = Path(sys.argv[2])
    final_reference = Path(sys.argv[3]) if len(sys.argv) > 3 else None
    sheet = Image.open(source).convert("RGBA")
    final_frame = (
        Image.open(final_reference)
        .convert("RGBA")
        .resize((FRAME_SIZE, FRAME_SIZE), Image.Resampling.LANCZOS)
        if final_reference
        else None
    )
    tile_width = sheet.width // SHEET_COLUMNS
    tile_height = sheet.height // SHEET_ROWS
    strip = Image.new("RGBA", (FRAME_SIZE * FRAME_COUNT, FRAME_SIZE), (0, 0, 0, 0))

    for index in range(FRAME_COUNT):
        if final_frame and index == FRAME_COUNT - 1:
            frame = final_frame
        else:
            col = index % SHEET_COLUMNS
            row = index // SHEET_COLUMNS
            tile = sheet.crop(
                (
                    col * tile_width + TILE_INSET,
                    row * tile_height + TILE_INSET,
                    (col + 1) * tile_width - TILE_INSET,
                    (row + 1) * tile_height - TILE_INSET,
                )
            )
            frame = tile.resize((FRAME_SIZE, FRAME_SIZE), Image.Resampling.LANCZOS)
            if final_frame and index == FRAME_COUNT - 2:
                frame = keep_largest_alpha_component(frame)
                frame = fit_frame_to_bbox(frame, final_frame.getbbox())
        strip.alpha_composite(frame, (index * FRAME_SIZE, 0))

    destination.parent.mkdir(parents=True, exist_ok=True)
    strip.save(destination, optimize=True)


if __name__ == "__main__":
    main()
