"""Hammie Shop: a tiny hamster storefront, served by Streamlit.

The storefront itself is one self-contained HTML/CSS/JS page (in shop/)
rendered full-screen inside a Streamlit component, so all browsing, the
product pages, the cart and the animations run in the browser with no
page reloads.
"""

import base64
import io
import json
from pathlib import Path

import streamlit as st
import streamlit.components.v1 as components
from PIL import Image

from products import FRUIT, PRODUCTS

ROOT = Path(__file__).parent
HAMSTERS = ROOT / "hamster_images"
FOOD = ROOT / "food_icons"
SHOP = ROOT / "shop"
LOGO_SOURCE = HAMSTERS / "hamster_what.JPG"
# A square cut of hamster_what with the hamster in the middle. The drawing's
# centre line sits right of the photo's centre, so we centre on the hamster.
LOGO_CENTER_X = 660  # pixel column of the hamster's nose
LOGO_TOP = 270       # a little space above the head
LOGO_SIZE = 860      # side of the square; smaller zooms in on the face


def logo_image(size: int) -> Image.Image:
    img = Image.open(LOGO_SOURCE).convert("RGB")
    left = LOGO_CENTER_X - LOGO_SIZE // 2
    square = Image.new("RGB", (LOGO_SIZE, LOGO_SIZE), "white")
    square.paste(img.crop((left, LOGO_TOP, left + LOGO_SIZE, LOGO_TOP + LOGO_SIZE)), (0, 0))
    return square.resize((size, size), Image.LANCZOS)


st.set_page_config(
    page_title="Hammie Shop: hand-drawn hamsters",
    page_icon=logo_image(128),
    layout="wide",
    initial_sidebar_state="collapsed",
)

# Make Streamlit step aside: no header, no padding, and the shop fills the window.
st.markdown(
    """
    <style>
      header[data-testid="stHeader"], #MainMenu, footer,
      [data-testid="stToolbar"], [data-testid="stDecoration"],
      [data-testid="stStatusWidget"] { display: none !important; }
      html, body, .stApp { background: #07070d !important; }
      .block-container, [data-testid="stMainBlockContainer"] {
        padding: 0 !important; max-width: 100% !important;
      }
      [data-testid="stVerticalBlock"] { gap: 0 !important; }
      [data-testid="stAppViewContainer"] { overflow: hidden !important; }
      .stApp iframe { height: 100vh !important; height: 100dvh !important;
                      width: 100% !important; border: 0 !important; display: block; }
    </style>
    """,
    unsafe_allow_html=True,
)


def whiten_paper(img: Image.Image) -> Image.Image:
    """Some scans have a light grey background. Stretch the levels so the
    paper colour becomes pure white and every drawing sits on the same page."""
    w, h = img.size
    corners = [img.getpixel((x, y)) for x, y in [(2, 2), (w - 3, 2), (2, h - 3), (w - 3, h - 3)]]
    paper = max(corners, key=sum)
    if min(paper) < 200 or min(paper) >= 252:
        return img  # coloured corner (e.g. a drawn sun) or already white
    luts = []
    for level in paper:
        luts += [min(255, round(v * 255 / level)) for v in range(256)]
    return img.point(luts)


def to_data_uri(path: Path, max_side: int, fmt: str) -> str:
    """Shrink an image and inline it, so the page needs no static file server."""
    img = Image.open(path)
    img.thumbnail((max_side, max_side))
    if fmt == "JPEG":
        img = whiten_paper(img.convert("RGB"))
    buf = io.BytesIO()
    if fmt == "JPEG":
        img.convert("RGB").save(buf, "JPEG", quality=84, optimize=True)
        mime = "image/jpeg"
    else:
        img.save(buf, "PNG", optimize=True)
        mime = "image/png"
    return f"data:{mime};base64," + base64.b64encode(buf.getvalue()).decode()


def wave_of(file: str) -> int:
    folder = file.split("/")[0]
    return int(folder.split("_")[1]) if folder.startswith("wave_") else 1


@st.cache_data(show_spinner=False)
def build_page(version: float) -> str:
    latest = max(wave_of(p["file"]) for p in PRODUCTS)
    products = []
    for n, p in enumerate(PRODUCTS, start=1):
        products.append(
            {
                "id": p["id"],
                "no": n,
                "name": p["name"],
                "mood": p["mood"],
                "price": p["price"],
                "compare": p["compare_at"],
                "blurb": p["blurb"],
                "wave": wave_of(p["file"]),
                "new": wave_of(p["file"]) == latest,
                "img": to_data_uri(HAMSTERS / p["file"], 680, "JPEG"),
            }
        )
    fruit = [
        {
            "id": f["id"],
            "value": f["value"],
            "weight": f.get("weight", 10),
            "speed": f.get("speed", 1.0),
            "img": to_data_uri(FOOD / f["file"], 160, "PNG"),
        }
        for f in FRUIT
    ]
    buf = io.BytesIO()
    logo_image(200).save(buf, "JPEG", quality=90)
    logo = "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()
    payload = json.dumps({"products": products, "fruit": fruit, "logo": logo, "latestWave": latest}).replace("</", "<\\/")

    html = (SHOP / "index.html").read_text(encoding="utf-8")
    css = (SHOP / "styles.css").read_text(encoding="utf-8")
    js = (SHOP / "app.js").read_text(encoding="utf-8")
    return (
        html.replace("/*__CSS__*/", css)
        .replace("/*__DATA__*/", f"window.__SHOP__ = {payload};")
        .replace("/*__JS__*/", js)
    )


# Rebuild the cached page whenever any source file changes.
version = max(f.stat().st_mtime for f in [*SHOP.iterdir(), ROOT / "products.py", ROOT / "app.py"])
components.html(build_page(version), height=900, scrolling=True)
