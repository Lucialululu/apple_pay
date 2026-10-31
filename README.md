# Hammie Shop

A small just-for-fun webshop for hamsters depicting different moods, built with Streamlit.

<p align="center">
  <img src="store_examples/front_page.png" width="500" alt="Hammie Shop front page" />
</p>

You can browse 56 hamster moods, search by name
or mood, filter by new, on sale or saved, and heart the ones you like. Open any
hamster for its own page and add it to the cart. Spend $150 and a free mystery
hamster joins your order.

<p align="center">
  <img src="store_examples/item_examples.png" width="500" alt="Hammie Shop item example" />
</p>


Every visit gets a **spin-the-wheel** popup after 10 seconds: every slice wins a discount code
(5–30% off) that is applied to the cart automatically. Codes can also be typed
in the cart.

Checkout takes Apple Pay. Tap the apples (red ones are worth $5, the rare green
ones $25, and the pizza, lemons and eggplants are decoys) until you have
collected the total, and the payment goes through.

After paying, **My hamsters** (the Purchases tab) lists every order. If you
spent $150 or more, a mystery hamster card waits there: tap it to reveal which
hamster you got for free. No real money is involved unless you want to donate :).

## Run it locally

Needs [uv](https://docs.astral.sh/uv/), uv installs the right Python and the
dependencies for you on the first run.

```bash
uv run streamlit run app.py
```

## What is where

| Path | What it is |
| --- | --- |
| `pyproject.toml`, `uv.lock`, `.python-version` | Dependencies and Python version, managed by uv. |
| `app.py` | Streamlit entry point. Inlines the images and renders the shop full-screen. |
| `hamster_images/hamster_what.JPG` | Also the shop's logo and browser-tab icon. |
| `products.py` | The catalog (names, moods, descriptions, prices $50–$100) and the fruit for the checkout game. Edit freely. |
| `shop/index.html`, `shop/styles.css`, `shop/app.js` | The storefront: layout, styles, cart and animations. |
| `hamster_images/` | The hamster drawings (the products). Each new drop gets its own folder (`wave_2/`, `wave_3/`…); the newest folder's hamsters are tagged NEW. |
| `food_icons/` | The fruit that falls during the Apple Pay checkout. |

The cart, saved hamsters and purchases are kept in the visitor's own browser, so
they survive a refresh.


<p align="center">
  <img src="hamster_images/hamster_in_awe.JPG" width="500" alt="Hammie Shop item example" />
</p>
