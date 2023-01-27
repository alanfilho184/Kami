function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

permissoes = new Map([
    ["ADD_REACTIONS", "Add reactions"],
    ["VIEW_CHANNEL", "Read text channels & see voice channels"],
    ["SEND_MESSAGES", "Send messages"],
    ["EMBED_LINKS", "Embed links"],
    ["ATTACH_FILES", "Attach files"],
    ["USE_EXTERNAL_EMOJIS", "Use external emojis"],
    ["MANAGE_MESSAGES", "Manage messages"],
    ["READ_MESSAGE_HISTORY", "Read message history"]
])

const atributos = ["name", "height", "age", "weight", "career", "skills", "equipment", "constitution", "disposition", "strength", "dexterity", "luck", "acrobatics",
    "intelligence", "insight", "charisma", "agility", "knowledge", "stealth", "perception", "survival", "will", "magic", "sanity", "languages", "sciences", "erudition",
    "investigation", "medicine", "mythsofcthulhu", "occultism", "occupation", "politics", "description", "image", "defects", "fight", "meleeweapons", "fireweapons", "fatigue", "memory",
    "lucidity", "extras", "health", "search", "hear", "class", "trainanimals", "athletics", "actuation", "ride", "healing", "diplomacy", "deception", "identifyspells",
    "initiative", "intimidation", "intuition", "ladding", "getinformation", "wisdom", "level", "divinity", "dislocation", "trend", "bodytobody", "rangedattacks",
    "weapons", "shield", "raceskills", "classskills", "talents", "money", "idioms", "arcanism", "bluff", "history", "dealingwithanimals", "nature",
    "persuasion", "prestidigitation", "religion", "armorclass", "contacts", "cuteness", "endurance", "race", "defense", "shield", "appearance", "theft", "guile", "manualskills", "military",
    "navy", "abilities", "resilience", "war", "gambling", "piloting", "reflexes", "nobility", "aim", "mana"]

function returnAtb() {
    return ["name", "height", "age", "weight", "career", "skills", "equipment", "constitution", "disposition", "strength", "dexterity", "luck", "acrobatics",
        "intelligence", "insight", "charisma", "agility", "knowledge", "stealth", "perception", "survival", "will", "magic", "sanity", "languages", "sciences", "erudition",
        "investigation", "medicine", "mythsofcthulhu", "occultism", "occupation", "politics", "description", "image", "defects", "fight", "meleeweapons", "fireweapons", "fatigue", "memory",
        "lucidity", "extras", "health", "search", "hear", "class", "trainanimals", "athletics", "actuation", "ride", "healing", "diplomacy", "deception", "identifyspells",
        "initiative", "intimidation", "intuition", "ladding", "getinformation", "wisdom", "level", "divinity", "dislocation", "trend", "bodytobody", "rangedattacks",
        "weapons", "shield", "raceskills", "classskills", "talents", "money", "idioms", "arcanism", "bluff", "history", "dealingwithanimals", "nature",
        "persuasion", "prestidigitation", "religion", "armorclass", "contacts", "cuteness", "endurance", "race", "defense", "shield", "appearance", "theft", "guile", "manualskills", "military",
        "navy", "abilities", "resilience", "war", "gambling", "piloting", "reflexes", "nobility", "aim", "mana"]
}

const atributosF = ["Name", "Height", "Age", "Weight", "Career", "Skills", "Equipment", "Constitution", "Disposition", "Strength", "Dexterity", "Luck", "Acrobatics",
    "Intelligence", "Insight", "Charisma", "Agility", "Knowledge", "Stealth", "Perception", "Survival", "Will", "Magic", "Sanity", "Languages", "Sciences", "Erudition",
    "Investigation", "Medicine", "Mysths Of Cthulhu", "Occultism", "Occupation", "Politics", "Description", "Image", "Defects", "Fight", "Melee Weapons", "Fire Weapons", "Fatigue", "Memory",
    "Lucidity", "Extras", "Health", "Search", "Hear", "Class", "Train Animals", "Athletics", "Actuation", "Ride", "Healing", "Diplomacy", "Decption", "Identify Spells",
    "Initiative", "Intimidation", "Intuition", "Ladding", "Get Information", "Wisdom", "Level", "Divinity", "Dislocation", "Trend", "Body to body", "Ranged Attacks",
    "Weapons", "Shield", "Race Skills", "Class Skills", "Talents", "Money", "Idioms", "Arcanism", "Bluff", "History", "Dealing With Animals", "Nature",
    "Persuasion", "Prestidigitation", "Religion", "Armor Class", "Contacts", "Cuteness", "Endurance", "Race", "Defense", "Shield", "Appearance", "Theft", "Guile", "Manual Skills", "Military",
    "Navy", "Abilities", "Resilience", "War", "Gambling", "Piloting", "Reflexes", "Nobility", "Aim", "Mana"]

const atributosI1 = ["name", "age", "height", "weight", "class", "race", "sanity", "health", "level", "mana", "money", "religion", "divinity"]

const atributosIF1 = ["Name", "Age", "Height", "Weight", "Class", "Race", "Sanity", "Health", "Mana", "Level", "Money", "Religion", "Divinity"]

const atributosI2 = ["career", "skills", "defects", "equipments", "talents", "classskills", "raceskills", "manualskills", "abilities"]

const atributosIF2 = ["Career", "Skills", "Defects", "Equipments", "Talentos", "Class Skills", "Race Skills", "Manual Skills", "Abilities"]

const atributosStatus = ["disposition", "dexterity", "acrobatics", "insight", "agility", "stealth", "survival", "magic", "languages", "erudition", "medicine", "occultism",
    "politics", "strength", "luck", "intelligence", "charisma", "knowledge", "perception", "will", "sciences", "investigation", "occupation", "fight", "fireweapons", "meleeweapons",
    "mythsofcthulhu", "fatigue", "lucidity", "memory", "search", "hear", "constitution", "trainanimals", "athlectics", "actuation", "ride", "healing", "diplomacy", "deception",
    "identifyspells", "initiative", "intimidation", "intuition", "ladding", "getinformation", "wisdom", "dislocation", "trend", "bodytobody", "rangedattacks", "weapons",
    "shield", "idioms", "arcanism", "bluff", "history", "dealingwithanimals", "nature", "persuasion", "prestidigitation", "armorclass", "contacts", "cuteness", "endurance",
    "defense", "shield", "appearance", "theft", "guile", "military", "navy", "resilience", "war", "gambling", "piloting", "reflexes", "nobility", "aim"]

const atributosStatusF = ["Disposition", "Dexterity", "Acrobatics", "Insight", "Agility", "Stealth", "Survival", "Magic", "Languages", "Erudition", "Medicine", "Occultism",
    "Politics", "Strength", "Luck", "Intelligence", "Charisma", "Knowledge", "Perception", "Will", "Sciences", "Investigation", "Occupation", "Fight", "Fire Weapons", "Melee Weapons",
    "Mysths Of Cthulhu", "Fatigue", "Lucidity", "Memory", "Search", "Hear", "Constitution", "Train Animals", "Athlectics", "Actuation", "Ride", "Healing", "Diplomacy", "Deception",
    "Identify Spells", "Initiative", "Intimidation", "Intuition", "Ladding", "Get Information", "Wisdom", "Dislocation", "Trend", "Body to Body", "Ranged Attacks",
    "Weapons", "Shield", "Idioms", "Arcanism", "Bluff", "History", "Dealing With Animals", "Nature", "Persuasion", "Prestidigitation", "Armor Class", "Contacts", "Cuteness",
    "Endurance", "Defense", "Shield", "Appearance", "Theft", "Guile", "Military", "Navy", "Abilities", "Resilience", "War", "Gambling", "Piloting", "Reflexes", "Nobility", "Aim"]

function footer() {
    return `${new Date().getFullYear()} © Kami`
}

const inPerm = ["Nightmares", "Panic attacks", "Deliriums", "Body tremors", "Furious access", "Catatonia", "Blindness", "Schizophrenia", "Psychosis",
    "Multiple personalities", "Severe manic-depressive", "Pyromania", "Extremely serious phobia", "Capgras Syndrome", "Prosopgnosis"]

const inTemp = ["Passes out immediately", "Starts screaming non-stop and stays immobilized", "Run away in panic", "Start laughing in despair", "Feels an uncontrollable fear and gets paralyzed",
    "Horrendous situation-related hallucination",
    "Without action and totally suggestible, it loses its own will", "Delirium", "Fall to the ground and assume fetal position, ignoring events", "Begins to eat something strange",
    "Start talking fast about meaningless things", "He cries compulsively in despair",
    "Think you're powerful and you can do anything", "Lose the Speech", "Lose the hearing", "Lose your sight",
    "See your allies as the living dead", "See your arms turning into tentacles",
    "Begins to pray compulsively", "Forget your own identity", "Forget the language you speak", "Doesn't recognize any ally, considers everyone as enemies",
    "Recognizes the enemy as your best friend", "Look at your allies and think they are your mother or your father", "Infantilism, reverts the mental age to the age of 3 years",
    "Can't breathe properly, gets dizzy and moves slowly",
    "Walks in circles talking compulsively", "Starts to sweat and blink non-stop, while the body shakes uncontrollably",
    "Your face is taken by an uncontrollable nervous tic", "He hugs himself, closes his eyes and screams non-stop that everything is just a nightmare and that he will wake up anytime",
    "Hug an ally and does not let go while the insanity lasts", "Starts singing a childhood song while he cries of fear",
    "Start reliving a childhood scene with your father or mother", "He has amnesia and forgets who he is and what he's doing there", "Legs shake non-stop and have difficulty walking or standing",
    "Listens to his own heartbeat like deafening sounds", `He shouts "All is lost!" and throws himself on the ground screaming and crying`,
    `Close your eyes and say "this is all a dream!" and believe that you can make everything disappear with your mind`, "Look at your allies and see them as horrendous monsters",
    "Believes that his feet are glued to the ground and can't get them out",
    "Begins to hear all sounds deafeningly", "Begins to find all smells unbearable",
    "Gets very strong colors in everything he sees and he can no longer keep his eyes open", "Thinks the ground gains a liquid consistency and he feels it is sinking, as in quicksand",
    "Starts talking to himself, trying to convince himself that he is not crazy",
    "Fall to his knees and raise his hands to heaven asking forgiveness",
    "It is afflicted with very strong and crazy headaches", "Sees everything as if it were in a strong fog, rubbing his eyes to see if he can clear his sight",
    "Starts speaking desperately in an invented language that no one understands",
    "He has a very strong vertigo and sees that everything is spinning, as if he was drunk", "You see mystical runes appearing all over your body, covering your skin",
    "Sees someone who died in his family appear in the distance and wave to him",
    "Open your mouth and keep shouting but no sound comes out of your mouth", "See a happy memory of the past and disconnected from the present, experiencing it as if it were happening now",
    "Enters a frenzy of fury and attacks his allies",
    "Feels that the whole body is anesthetized and difficult to move", "Feel horrible shivers in your spine, which make you move your body violently"]


module.exports = {
    permissoes,
    atributos,
    atributosF,
    atributosI1,
    atributosIF1,
    atributosI2,
    atributosIF2,
    atributosStatus,
    atributosStatusF,
    footer,
    inPerm,
    inTemp,
    returnAtb
}