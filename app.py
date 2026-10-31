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

from products import PRODUCTS, SNACKS

ROOT = Path(__file__).parent
HAMSTERS = ROOT / "hamster_images"
FOOD = ROOT / "food_icons"
SHOP = ROOT / "shop"

st.set_page_config(
    page_title="Hammie Shop: hand-drawn hamsters",
    page_icon="🐹",
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


def to_data_uri(path: Path, max_side: int, fmt: str) -> str:
    """Shrink an image and inline it, so the page needs no static file server."""
    img = Image.open(path)
    img.thumbnail((max_side, max_side))
    buf = io.BytesIO()
    if fmt == "JPEG":
        img.convert("RGB").save(buf, "JPEG", quality=84, optimize=True)
        mime = "image/jpeg"
    else:
        img.save(buf, "PNG", optimize=True)
        mime = "image/png"
    return f"data:{mime};base64," + base64.b64encode(buf.getvalue()).decode()


@st.cache_data(show_spinner=False)
def build_page(version: float) -> str:
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
                "img": to_data_uri(HAMSTERS / p["file"], 760, "JPEG"),
            }
        )
    snacks = [
        {"id": s["id"], "name": s["name"], "img": to_data_uri(FOOD / s["file"], 160, "PNG")}
        for s in SNACKS
    ]
    payload = json.dumps({"products": products, "snacks": snacks}).replace("</", "<\\/")

    html = (SHOP / "index.html").read_text(encoding="utf-8")
    css = (SHOP / "styles.css").read_text(encoding="utf-8")
    js = (SHOP / "app.js").read_text(encoding="utf-8")
    return (
        html.replace("/*__CSS__*/", css)
        .replace("/*__DATA__*/", f"window.__SHOP__ = {payload};")
        .replace("/*__JS__*/", js)
    )


# Rebuild the cached page whenever any source file changes.
version = max(f.stat().st_mtime for f in [*SHOP.iterdir(), ROOT / "products.py"])
components.html(build_page(version), height=900, scrolling=True)
