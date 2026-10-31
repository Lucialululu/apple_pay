# Hammie Shop 🐹

A tiny, just-for-fun storefront for hand-drawn hamsters, built with Streamlit.

Browse eighteen moods (Sus, Queen, Bleh, Phone…), open any hamster for its own
page, pick a free snack, and add it to the cart. Checkout is pretend: there is
no real payment, just a small celebration.

## Run it locally

Needs [uv](https://docs.astral.sh/uv/). uv installs the right Python and the
dependencies for you on the first run.

```bash
uv run streamlit run app.py
```

## Deploy on Streamlit Community Cloud

1. Push this repo to GitHub.
2. Go to https://share.streamlit.io → **Create app** → pick this repo, branch `main`, main file `app.py`.
3. Deploy.

## What's where

| Path | What it is |
| --- | --- |
| `pyproject.toml`, `uv.lock`, `.python-version` | Dependencies and Python version, managed by uv. |
| `app.py` | Streamlit entry point. Inlines the images and renders the shop full-screen. |
| `products.py` | The catalog: names, moods, descriptions and prices ($50–$100). Edit freely. |
| `shop/index.html`, `shop/styles.css`, `shop/app.js` | The storefront: layout, styles, cart and animations. |
| `hamster_images/` | The hamster drawings (the products). |
| `food_icons/` | Snack icons, offered with every hamster. |

The cart is saved in the visitor's own browser, so it survives a refresh.
