"""The hamster catalog.

Prices were generated once with random.Random(31102026), each a whole
number of dollars between $50 and $100. `compare_at` is the "was" price
shown struck through on the items that are on sale.
Edit anything here freely; the order below is the "Featured" order.
"""

PRODUCTS = [
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

# The four food icons in food_icons/, offered as a snack with every hamster.
SNACKS = [
    {"id": "apple", "file": "Red_Apple_Emoji_large.png", "name": "Apple"},
    {"id": "pizza", "file": "Slice_Of_Pizza_Emoji_large.png", "name": "Pizza"},
    {"id": "lemon", "file": "Lemon_Emoji_large.png", "name": "Lemon"},
    {"id": "eggplant", "file": "Eggplant_Emoji_large.png", "name": "Eggplant"},
]
