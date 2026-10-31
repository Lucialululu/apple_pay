# Hammie Shop 🐹

A tiny, just-for-fun storefront for hand-drawn hamsters, built with Streamlit.

Browse 56 moods across three waves (Sus, Queen, Ded, Guitar…), search by name
or mood, filter by new, on sale or saved, and heart the ones you like. Open any
hamster for its own page and add it to the cart. Spend $150 and a free mystery
sticker joins your order.

New visitors get a **spin-the-wheel** popup: every slice wins a discount code
(5–30% off) that is applied to the cart automatically. Codes can also be typed
in the cart.

Checkout takes Apple Pay, literally: pick **Pay with Apple Pay** and fruit
starts falling. Tap the apples (each is worth $5, the pizza, lemons and
eggplants are decoys) until you've collected the total, and the payment goes
through. No real money is involved.

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
| `hamster_images/hamster_what.JPG` | Also the shop's logo and browser-tab icon. |
| `products.py` | The catalog (names, moods, descriptions, prices $50–$100) and the fruit for the checkout game. Edit freely. |
| `shop/index.html`, `shop/styles.css`, `shop/app.js` | The storefront: layout, styles, cart and animations. |
| `hamster_images/` | The hamster drawings (the products). Each new drop gets its own folder (`wave_2/`, `wave_3/`…); the newest folder's hamsters are tagged NEW. |
| `food_icons/` | The fruit that falls during the Apple Pay checkout. |

The cart is saved in the visitor's own browser, so it survives a refresh.
