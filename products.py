"""The hamster catalog.

Prices are whole dollars between $50 and $100, generated once with Python's
random module (wave 1 seed 31102026, wave 2 seed 20261031, wave 3 seed 20261107).
`compare_at` is the "was" price shown struck through on items that are on sale.
`file` is relative to hamster_images/. The wave comes from the folder
(wave_3/ -> wave 3, wave_2/ -> wave 2, otherwise wave 1); the newest wave
gets a NEW tag on its cards.
The order below is the "Featured" order. Edit anything freely.
"""

PRODUCTS = [
    # ---- Wave 3 (newest: shown first, tagged NEW) ----
    {"id": "finally_free", "file": "wave_3/hamster_FINALLY_FREE.JPG", "name": "Finally-Free Hamster", "mood": "Liberated", "price": 86, "compare_at": None,
     "blurb": "Chains broken, mouth wide open, screaming into the sunset. It is 17:00 on a Friday and nobody can stop this hamster now."},
    {"id": "i_cry", "file": "wave_3/hamster_I_cry.JPG", "name": "I-Cry Hamster", "mood": "Ugly crying", "price": 78, "compare_at": None,
     "blurb": "Tears, snot, the full performance. Cried at the dog-food advert again. No regrets, just tissues."},
    {"id": "worried", "file": "wave_3/hamster_a_bit_worried.JPG", "name": "A-Bit-Worried Hamster", "mood": "Peeking", "price": 59, "compare_at": None,
     "blurb": "Peeks in from the side of the frame to check if the meeting is still happening. Hoping very much that it isn't."},
    {"id": "defeated", "file": "wave_3/hamster_defeated.JPG", "name": "Defeated Hamster", "mood": "Defeated", "price": 69, "compare_at": 81,
     "blurb": "Eyes closed, tiny frown, accepting fate with dignity. Lost the board game. Again. To a child."},
    {"id": "lock_in", "file": "wave_3/hamster_fastest_lock_in_of_all_times.JPG", "name": "Locked-In Hamster", "mood": "Locked in", "price": 94, "compare_at": 114,
     "blurb": "The fastest lock-in of all time. Speed lines, dramatic shadows, deadline in four minutes. Do not disturb, it is in the zone."},
    {"id": "demons", "file": "wave_3/hamster_fighting_back_demons.JPG", "name": "Fighting-Demons Hamster", "mood": "Resisting", "price": 69, "compare_at": 81,
     "blurb": "Biting its lip, refusing to open the fridge a fourth time. A heroic struggle, mostly against snacks."},
    {"id": "holding_tears", "file": "wave_3/hamster_fighting_back_tears.JPG", "name": "Holding-Back-Tears Hamster", "mood": "Wobbly", "price": 75, "compare_at": 87,
     "blurb": "The lip is wobbling. The eyes are brave. Someone said 'are you okay?' and now it's touch and go."},
    {"id": "freezing", "file": "wave_3/hamster_freexing.JPG", "name": "Freezing Hamster", "mood": "Frozen solid", "price": 71, "compare_at": 83,
     "blurb": "Blue, snowed on, icicles in the eyebrows. Somebody turned the heating off in October. In Denmark."},
    {"id": "gg_cooked", "file": "wave_3/hamster_gg_i_am_cooked.JPG", "name": "GG-I'm-Cooked Hamster", "mood": "Cooked", "price": 68, "compare_at": None,
     "blurb": "Opened the exam paper. Read question one. Calmly accepted that it is over. A quiet 'gg'."},
    {"id": "guitar", "file": "wave_3/hamster_guitar.JPG", "name": "Guitar Hamster", "mood": "Rocking out", "price": 61, "compare_at": None,
     "blurb": "Knows exactly three chords and plays them with total confidence. Will absolutely play Wonderwall at your party."},
    {"id": "eyes_on_you", "file": "wave_3/hamster_i_have_got_my_eyes_on_you.JPG", "name": "Eyes-On-You Hamster", "mood": "Watching", "price": 90, "compare_at": None,
     "blurb": "Squinting, chewing, keeping track of exactly who took the last cookie. It has its eyes on you. Yes, you."},
    {"id": "idek", "file": "wave_3/hamster_idek.JPG", "name": "IDEK Hamster", "mood": "Baffled", "price": 100, "compare_at": None,
     "blurb": "I don't even know. Neither does this hamster. Our priciest hamster, for reasons nobody can explain."},
    {"id": "im_done", "file": "wave_3/hamster_im_done.JPG", "name": "I'm-Done Hamster", "mood": "Done", "price": 99, "compare_at": 119,
     "blurb": "Clocked out emotionally around 14:30. Teeth clenched, soul elsewhere. Please leave a message after the sigh."},
    {"id": "not_sad", "file": "wave_3/hamster_no_im_not_sad.JPG", "name": "Not-Sad Hamster", "mood": "Totally fine", "price": 90, "compare_at": None,
     "blurb": "No, it is not sad. That single tear is allergies. Everything is fine. Stop asking."},
    {"id": "still_not_impressed", "file": "wave_3/hamster_not_impressed.JPG", "name": "Still-Not-Impressed Hamster", "mood": "Unmoved", "price": 65, "compare_at": None,
     "blurb": "The sequel nobody asked for. Has seen your new trick, and it is still not impressed. Sorry."},
    {"id": "oopsss", "file": "wave_3/hamster_oopsss.JPG", "name": "Oopsss Hamster", "mood": "Mortified", "price": 53, "compare_at": None,
     "blurb": "Replied-all. Face draining of all colour from the top down. Our cheapest hamster, because it is already embarrassed enough."},
    {"id": "pleading", "file": "wave_3/hamster_pleading.JPG", "name": "Pleading Hamster", "mood": "Pleading", "price": 83, "compare_at": 103,
     "blurb": "Big wet eyes, tiny trembling mouth. Please. One more episode. Just one."},
    {"id": "pleading_more", "file": "wave_3/hamster_pleading_even_more.JPG", "name": "Pleading-Even-More Hamster", "mood": "Begging", "price": 59, "compare_at": None,
     "blurb": "Pleaded so hard it knocked $24 off its own price. Works every time. Do not make eye contact."},
    {"id": "shocked", "file": "wave_3/hamster_shocked.JPG", "name": "Shocked Hamster", "mood": "Shook", "price": 97, "compare_at": 117,
     "blurb": "Round eyes, flushed cheeks, completely stunned. Just found out what the rent is now."},
    {"id": "happy_tears", "file": "wave_3/hamster_tears_of_happiness.JPG", "name": "Happy-Tears Hamster", "mood": "Overjoyed", "price": 54, "compare_at": None,
     "blurb": "Crying, but the good kind. Someone brought cake to the office and it was not even a birthday."},

    # ---- Wave 2 ----
    {"id": "hold_it_in", "file": "wave_2/hamster_I_gotta_hold_it_in.jpg", "name": "Hold-It-In Hamster", "mood": "Holding it in", "price": 69, "compare_at": 87,
     "blurb": "Cheeks clenched, smile locked, eyes watering slightly. Someone said something hilarious at a funeral and this hamster will not be the one who breaks."},
    {"id": "cooked", "file": "wave_2/hamster_cokked.JPG", "name": "Cooked Hamster", "mood": "Overheated", "price": 54, "compare_at": None,
     "blurb": "Fell asleep in the sun, woke up medium-rare. Gently steaming. Please do not touch, it is still a bit warm."},
    {"id": "ded", "file": "wave_2/hamster_ded.JPG", "name": "Ded Hamster", "mood": "Dramatically deceased", "price": 63, "compare_at": 75,
     "blurb": "Saw the group chat at 7am and simply lay down. Comes with its own flowers. Will be back to normal by lunch."},
    {"id": "disgusted", "file": "wave_2/hamster_disgusted.JPG", "name": "Disgusted Hamster", "mood": "Grossed out", "price": 90, "compare_at": 110,
     "blurb": "Someone put pineapple on the sunflower seeds. The face says everything a strongly worded letter would."},
    {"id": "eyebrow", "file": "wave_2/hamster_eyebrow_raised.JPG", "name": "Eyebrow Hamster", "mood": "Skeptical", "price": 98, "compare_at": None,
     "blurb": "One eyebrow, fully deployed. Your excuse has been received and is being reviewed with great suspicion."},
    {"id": "glad", "file": "wave_2/hamster_glad.JPG", "name": "Glad Hamster", "mood": "Content", "price": 87, "compare_at": 99,
     "blurb": "A soft blush and a small, satisfied smile. The look of someone whose nap went exactly to plan."},
    {"id": "hmmm", "file": "wave_2/hamster_hmmm.JPG", "name": "Hmmm Hamster", "mood": "Pondering", "price": 55, "compare_at": 73,
     "blurb": "Lips pursed, thinking very hard about whether to have a second snack. The answer is always yes, but the ritual matters."},
    {"id": "knocked_out", "file": "wave_2/hamster_knocked_out.JPG", "name": "Knocked-Out Hamster", "mood": "Out cold", "price": 61, "compare_at": None,
     "blurb": "Ten minutes into the movie, one drool trail later. Ideal for anyone who 'is just resting their eyes'."},
    {"id": "no_you_did_not", "file": "wave_2/hamster_no_you_did_not.JPG", "name": "Oh-No-You-Didn't Hamster", "mood": "Offended", "price": 74, "compare_at": None,
     "blurb": "You did. You really did. And this hamster will be bringing it up at every family dinner from now on."},
    {"id": "not_impressed", "file": "wave_2/hamster_not_impressed.JPG", "name": "Not-Impressed Hamster", "mood": "Deadpan", "price": 73, "compare_at": None,
     "blurb": "Watched your magic trick. Saw the card up your sleeve. Said nothing, which somehow hurts more."},
    {"id": "broke", "file": "wave_2/hamster_poor.JPG", "name": "Broke Hamster", "mood": "Broke", "price": 65, "compare_at": 83,
     "blurb": "Opened the wallet, found only flies. Payday is in nine days. Probably the most relatable hamster we've ever drawn."},
    {"id": "sobbing", "file": "wave_2/hamster_sad.JPG", "name": "Sobbing Hamster", "mood": "Sobbing", "price": 60, "compare_at": None,
     "blurb": "Two waterfalls of tears and an open-mouth wail. The sad hamster's dramatic older sibling. Tissues not included."},
    {"id": "smug", "file": "wave_2/hamster_smug.JPG", "name": "Smug Hamster", "mood": "Smug", "price": 81, "compare_at": None,
     "blurb": "Was right about the thing. Will not say 'I told you so' out loud. Doesn't need to."},
    {"id": "sniff", "file": "wave_2/hamster_sniff.JPG", "name": "Sniffly Hamster", "mood": "Sniffly", "price": 71, "compare_at": None,
     "blurb": "Red nose, wobbly lip, trying very hard to be brave. Needs a hug and possibly a warm drink."},
    {"id": "super_mad", "file": "wave_2/hamster_super_mad.JPG", "name": "Super-Mad Hamster", "mood": "Fuming", "price": 74, "compare_at": None,
     "blurb": "Brows so heavy they've become a single storm cloud. Do not ask what happened. Do not ask."},
    {"id": "sweaty", "file": "wave_2/hamster_sweating.JPG", "name": "Sweaty Hamster", "mood": "Melting", "price": 75, "compare_at": None,
     "blurb": "It is 31 degrees and this hamster wore a fur coat. Every summer, the same mistake."},
    {"id": "very_annoyed", "file": "wave_2/hamster_very_annoyed.JPG", "name": "Very Annoyed Hamster", "mood": "Screaming", "price": 85, "compare_at": None,
     "blurb": "The Wi-Fi dropped mid-upload. Again. Eyes burning, mouth wide, fully committed to the scream."},
    {"id": "helmet", "file": "wave_2/hamster_war.jpg", "name": "Helmet Hamster", "mood": "On duty", "price": 61, "compare_at": 71,
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

# The food icons in food_icons/. They only appear in the Apple Pay checkout
# game. `value` is what catching one is worth ($0 = a decoy), `weight` is how
# often it falls compared to the others, and `speed` makes it fall faster.
FRUIT = [
    {"id": "apple", "file": "Red_Apple_Emoji_large.png", "value": 5, "weight": 44, "speed": 1.0},
    {"id": "green_apple", "file": "Green_Apple_Emoji_large.png", "value": 25, "weight": 8, "speed": 1.35},
    {"id": "pizza", "file": "Slice_Of_Pizza_Emoji_large.png", "value": 0, "weight": 16, "speed": 1.0},
    {"id": "lemon", "file": "Lemon_Emoji_large.png", "value": 0, "weight": 16, "speed": 1.0},
    {"id": "eggplant", "file": "Eggplant_Emoji_large.png", "value": 0, "weight": 16, "speed": 1.0},
]
