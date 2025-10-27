from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

OUTPUT_PATH = Path(__file__).resolve().parents[1] / "assets" / "preview.png"

WIDTH, HEIGHT = 1200, 630
BG_COLOR = "#eef3f6"
CARD_COLOR = "#ffffff"
ACCENT = "#2f6b82"
INK = "#1f2a37"
TEXT_MUTED = "#4a5568"


def load_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
  candidates = [
    "/System/Library/Fonts/SFNSRounded.ttf",
    "/System/Library/Fonts/SFNSDisplay.ttf",
    "/System/Library/Fonts/SFNS.ttf",
    "/System/Library/Fonts/Helvetica.ttc",
    "/Library/Fonts/Arial.ttf",
  ]
  for path in candidates:
    font_path = Path(path)
    if font_path.exists():
      try:
        return ImageFont.truetype(str(font_path), size=size)
      except OSError:
        continue
  return ImageFont.load_default()


def main() -> None:
  OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
  image = Image.new("RGB", (WIDTH, HEIGHT), BG_COLOR)
  draw = ImageDraw.Draw(image)

  card_bounds = (80, 90, WIDTH - 80, HEIGHT - 90)
  draw.rounded_rectangle(card_bounds, radius=40, fill=CARD_COLOR)

  title_font = load_font(68)
  subtitle_font = load_font(34)
  body_font = load_font(30)

  title = "Understanding Variability in Visualization"
  subtitle = "30-Minute Expert Interview Invitation"
  body = "DIV-Lab, University of Oklahoma"

  draw.text((140, 180), title, fill=INK, font=title_font)
  draw.text((140, 280), subtitle, fill=ACCENT, font=subtitle_font)
  draw.text((140, 380), body, fill=TEXT_MUTED, font=body_font)

  # Accent glyphs
  draw.line((140, 450, 540, 450), fill=ACCENT, width=6)
  draw.ellipse((540, 438, 560, 458), outline=ACCENT, width=6)
  draw.line((600, 450, 1020, 450), fill=ACCENT, width=6)

  image.save(OUTPUT_PATH, format="PNG", optimize=True)


if __name__ == "__main__":
  main()
