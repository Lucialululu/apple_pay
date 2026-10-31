"""The hamster catalog.

Prices are whole dollars between $50 and $100, generated once with Python's
random module (wave 1 with seed 31102026, wave 2 with seed 20261031).
`compare_at` is the "was" price shown struck through on items that are on sale.
`file` is relative to hamster_images/. `new` puts a NEW tag on the card.
The order below is the "Featured" order. Edit anything freely.
"""

PRODUCTS = [
    # ---- Wave 2 (shown first, tagged NEW) ----
    {"id": "hold_it_in", "file": "wave_2/hamster_I_gotta_hold_it_in.jpg", "name": "Hold-It-In Hamster", "mood": "Holding it in", "price": 69, "compare_at": 87, "new": True,
     "blurb": "Cheeks clenched, smile locked, eyes watering slightly. Someone said something hilarious at a funeral and this hamster will not be the one who breaks."},
    {"id": "cooked", "file": "wave_2/hamster_cokked.JPG", "name": "Cooked Hamster", "mood": "Overheated", "price": 54, "compare_at": None, "new": True,
     "blurb": "Fell asleep in the sun, woke up medium-rare. Gently steaming. Please do not touch, it is still a bit warm."},
    {"id": "ded", "file": "wave_2/hamster_ded.JPG", "name": "Ded Hamster", "mood": "Dramatically deceased", "price": 63, "compare_at": 75, "new": True,
     "blurb": "Saw the group chat at 7am and simply lay down. Comes with its own flowers. Will be back to normal by lunch."},
    {"id": "disgusted", "file": "wave_2/hamster_disgusted.JPG", "name": "Disgusted Hamster", "mood": "Grossed out", "price": 90, "compare_at": 110, "new": True,
     "blurb": "Someone put pineapple on the sunflower seeds. The face says everything a strongly worded letter would."},
    {"id": "eyebrow", "file": "wave_2/hamster_eyebrow_raised.JPG", "name": "Eyebrow Hamster", "mood": "Skeptical", "price": 98, "compare_at": None, "new": True,
     "blurb": "One eyebrow, fully deployed. Your excuse has been received and is being reviewed with great suspicion."},
    {"id": "glad", "file": "wave_2/hamster_glad.JPG", "name": "Glad Hamster", "mood": "Content", "price": 87, "compare_at": 99, "new": True,
     "blurb": "A soft blush and a small, satisfied smile. The look of someone whose nap went exactly to plan."},
    {"id": "hmmm", "file": "wave_2/hamster_hmmm.JPG", "name": "Hmmm Hamster", "mood": "Pondering", "price": 55, "compare_at": 73, "new": True,
     "blurb": "Lips pursed, thinking very hard about whether to have a second snack. The answer is always yes, but the ritual matters."},
    {"id": "knocked_out", "file": "wave_2/hamster_knocked_out.JPG", "name": "Knocked-Out Hamster", "mood": "Out cold", "price": 61, "compare_at": None, "new": True,
     "blurb": "Ten minutes into the movie, one drool trail later. Ideal for anyone who 'is just resting their eyes'."},
    {"id": "no_you_did_not", "file": "wave_2/hamster_no_you_did_not.JPG", "name": "Oh-No-You-Didn't Hamster", "mood": "Offended", "price": 74, "compare_at": None, "new": True,
     "blurb": "You did. You really did. And this hamster will be bringing it up at every family dinner from now on."},
    {"id": "not_impressed", "file": "wave_2/hamster_not_impressed.JPG", "name": "Not-Impressed Hamster", "mood": "Deadpan", "price": 73, "compare_at": None, "new": True,
     "blurb": "Watched your magic trick. Saw the card up your sleeve. Said nothing, which somehow hurts more."},
    {"id": "broke", "file": "wave_2/hamster_poor.JPG", "name": "Broke Hamster", "mood": "Broke", "price": 65, "compare_at": 83, "new": True,
     "blurb": "Opened the wallet, found only flies. Payday is in nine days. Probably the most relatable hamster we've ever drawn."},
    {"id": "sobbing", "file": "wave_2/hamster_sad.JPG", "name": "Sobbing Hamster", "mood": "Sobbing", "price": 60, "compare_at": None, "new": True,
     "blurb": "Two waterfalls of tears and an open-mouth wail. The sad hamster's dramatic older sibling. Tissues not included."},
    {"id": "smug", "file": "wave_2/hamster_smug.JPG", "name": "Smug Hamster", "mood": "Smug", "price": 81, "compare_at": None, "new": True,
     "blurb": "Was right about the thing. Will not say 'I told you so' out loud. Doesn't need to."},
    {"id": "sniff", "file": "wave_2/hamster_sniff.JPG", "name": "Sniffly Hamster", "mood": "Sniffly", "price": 71, "compare_at": None, "new": True,
     "blurb": "Red nose, wobbly lip, trying very hard to be brave. Needs a hug and possibly a warm drink."},
    {"id": "super_mad", "file": "wave_2/hamster_super_mad.JPG", "name": "Super-Mad Hamster", "mood": "Fuming", "price": 74, "compare_at": None, "new": True,
     "blurb": "Brows so heavy they've become a single storm cloud. Do not ask what happened. Do not ask."},
    {"id": "sweaty", "file": "wave_2/hamster_sweating.JPG", "name": "Sweaty Hamster", "mood": "Melting", "price": 75, "compare_at": None, "new": True,
     "blurb": "It is 31 degrees and this hamster wore a fur coat. Every summer, the same mistake."},
    {"id": "very_annoyed", "file": "wave_2/hamster_very_annoyed.JPG", "name": "Very Annoyed Hamster", "mood": "Screaming", "price": 85, "compare_at": None, "new": True,
     "blurb": "The Wi-Fi dropped mid-upload. Again. Eyes burning, mouth wide, fully committed to the scream."},
    {"id": "helmet", "file": "wave_2/hamster_war.jpg", "name": "Helmet Hamster", "mood": "On duty", "price": 61, "compare_at": 71, "new": True,
     "blurb": "Helmet on, face blank, ready for the weekly team meeting. Has seen things. Mostly spreadsheets."},

    # ---- Wave 1 ----
    {
        "id": "happy",
        "file": "hamster_happy.JPG",
        "name": "Happy Hamster",
        "mood": "Delighted",
        "price": 65,
        "compare_at": None,
        "blurb": "Blushing, beaming, mildly embarrassed about it. The Happy Hamster "
        "is the friend who texts you back within the minute. Hang it where "
        "good news usually arrives.",
    },
    {
        "id": "queen",
        "file": "hamster_queen.JPG",
        "name": "Queen Hamster",
        "mood": "Regal",
        "price": 94,
        "compare_at": None,
        "blurb": "Emerald eyes, zero apologies. The Queen does not chase sunflower "
        "seeds; the seeds come to her. Recommended for anyone who has ever "
        "been asked to 'tone it down'.",
    },
    {
        "id": "sus",
        "file": "hamster_sus.JPG",
        "name": "Sus Hamster",
        "mood": "Suspicious",
        "price": 50,
        "compare_at": None,
        "blurb": "Someone ate the last cracker and the Sus Hamster has a list of "
        "names. Our most affordable hamster, which is itself a little suspicious.",
    },
    {
        "id": "tongue",
        "file": "hamster_tongue.JPG",
        "name": "Bleh Hamster",
        "mood": "Unhinged",
        "price": 59,
        "compare_at": 74,
        "blurb": "Full tongue, full commitment. The Bleh Hamster is the face you make "
        "when the group photo is taken on the count of two.",
    },
    {
        "id": "phone",
        "file": "hamster_phone.JPG",
        "name": "Phone Hamster",
        "mood": "Unimpressed",
        "price": 70,
        "compare_at": 80,
        "blurb": "Side-eye, phone in paw, already screenshotting your message for the "
        "group chat. A modern classic.",
    },
    {
        "id": "in_awe",
        "file": "hamster_in_awe.JPG",
        "name": "In-Awe Hamster",
        "mood": "Amazed",
        "price": 68,
        "compare_at": None,
        "blurb": "Has just seen a cucumber slice for the first time and will never be "
        "the same. For people who still say 'whoa' out loud.",
    },
    {
        "id": "noting",
        "file": "hamster_noting.JPG",
        "name": "Noting Hamster",
        "mood": "Taking notes",
        "price": 88,
        "compare_at": None,
        "blurb": "Glasses on, keyboard out. The Noting Hamster writes down everything "
        "you said in that meeting, especially the parts you'd like back.",
    },
    {
        "id": "nope",
        "file": "hamster_nope.JPG",
        "name": "Nope Hamster",
        "mood": "Declining",
        "price": 61,
        "compare_at": 79,
        "blurb": "One finger, one word: no. Perfect gift for anyone learning to set "
        "boundaries, or anyone who already has.",
    },
    {
        "id": "frustrated",
        "file": "hamster_frustrated.JPG",
        "name": "Frustrated Hamster",
        "mood": "Grinding teeth",
        "price": 99,
        "compare_at": None,
        "blurb": "Every single tooth, clenched. Our most expensive hamster, priced "
        "accordingly by a hamster who is very, very done.",
    },
    {
        "id": "mad",
        "file": "hamster_mad.JPG",
        "name": "Mad Hamster",
        "mood": "Steaming",
        "price": 60,
        "compare_at": None,
        "blurb": "Comes with two free clouds of steam. The wheel stopped working and "
        "somebody is going to hear about it.",
    },
    {
        "id": "shh",
        "file": "hamster_shh.JPG",
        "name": "Shh Hamster",
        "mood": "Secretive",
        "price": 72,
        "compare_at": 90,
        "blurb": "Knows where the snacks are hidden. Will not tell you. Ideal for "
        "libraries, nurseries, and open-plan offices.",
    },
    {
        "id": "relieved",
        "file": "hamster_relieved.JPG",
        "name": "Relieved Hamster",
        "mood": "Phew",
        "price": 84,
        "compare_at": 102,
        "blurb": "The deadline moved. The Relieved Hamster melts into the exhale the "
        "rest of us are still waiting for.",
    },
    {
        "id": "what",
        "file": "hamster_what.JPG",
        "name": "What Hamster",
        "mood": "Confused",
        "price": 87,
        "compare_at": 97,
        "blurb": "Read the email three times. Still has no idea what was asked. "
        "Relatable to the bone.",
    },
    {
        "id": "idk",
        "file": "hamster_idk.JPG",
        "name": "IDK Hamster",
        "mood": "Uncertain",
        "price": 92,
        "compare_at": 102,
        "blurb": "Asked where dinner should be. Has no opinions, only a small "
        "trembling mouth. Pairs well with any group decision.",
    },
    {
        "id": "oof",
        "file": "hamster_oof.JPG",
        "name": "Oof Hamster",
        "mood": "Mortified",
        "price": 96,
        "compare_at": None,
        "blurb": "Just remembered something embarrassing from 2014. Wide-mouthed, "
        "wide-eyed, entirely understandable.",
    },
    {
        "id": "triggered",
        "file": "hamster_triggered.JPG",
        "name": "Triggered Hamster",
        "mood": "Rattled",
        "price": 75,
        "compare_at": None,
        "blurb": "Someone moved the bedding. A small hamster with a very large "
        "reaction. Handle with care.",
    },
    {
        "id": "sad",
        "file": "hamster_sad.JPG",
        "name": "Sad Hamster",
        "mood": "Glum",
        "price": 93,
        "compare_at": None,
        "blurb": "A quiet frown for quiet Sundays. Adopting one is scientifically "
        "proven* to cheer it up. (*not proven)",
    },
    {
        "id": "sick",
        "file": "hamster_sick.JPG",
        "name": "Sick Hamster",
        "mood": "Under the weather",
        "price": 53,
        "compare_at": None,
        "blurb": "Oxygen mask on, spirit intact. For the friend who 'just has a "
        "little cold' and is absolutely dying.",
    },
]

# The four food icons in food_icons/. They only appear in the Apple Pay
# checkout game: apples are worth $5 each, the rest are decoys.
FRUIT = [
    {"id": "apple", "file": "Red_Apple_Emoji_large.png", "value": 5},
    {"id": "pizza", "file": "Slice_Of_Pizza_Emoji_large.png", "value": 0},
    {"id": "lemon", "file": "Lemon_Emoji_large.png", "value": 0},
    {"id": "eggplant", "file": "Eggplant_Emoji_large.png", "value": 0},
]
