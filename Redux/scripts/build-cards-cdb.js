const { DatabaseSync } = require("node:sqlite");
const path = require("path");

const { copyFileInRedux } = require("./utils");
const { official: errataPasscodes } = require("./redux-errata-passcodes");
const errataNamePrefix = "[Redux] ";
const blackLusterSoldierPasscodes = [72989439, 72989440];
const alienSpellTrapPasscodes = [
  73262676, // "A" Cell Scatter Burst
  17490535, // Alien Brain
  24082387, // Crop Circles
  21768554, // Mass Hypnosis
  53291093, // Mysterious Triangle
  60946968, // Otherworld - The "A" Zone
  39163598, // Planet Pollutant Virus
  96875080, // Orbital Bombardment
];

module.exports = function buildCardsDb({ reduxRoot }) {
  const output = path.join(reduxRoot, "modded", "cards.cdb");

  copyFileInRedux({
    reduxRoot,
    source: path.join(reduxRoot, "vanilla", "cards.cdb"),
    output,
  });

  const db = new DatabaseSync(output);
  const blackLusterSoldierAlternateArtResult = db
    .prepare(
      `INSERT INTO datas (
        id, ot, alias, setcode, type, atk, def, level, race, attribute, category
      )
      SELECT ?, ot, ?, setcode, type, atk, def, level, race, attribute, category
      FROM datas
      WHERE id = ?`,
    )
    .run(72989440, 72989439, 72989439);
  const blackLusterSoldierAlternateArtTextResult = db
    .prepare(
      `INSERT INTO texts (
        id, name, desc, str1, str2, str3, str4, str5, str6, str7, str8, str9,
        str10, str11, str12, str13, str14, str15, str16
      )
      SELECT ?, name, desc, str1, str2, str3, str4, str5, str6, str7, str8, str9,
        str10, str11, str12, str13, str14, str15, str16
      FROM texts
      WHERE id = ?`,
    )
    .run(72989440, 72989439);
  const lastWillTextResult = db
    .prepare("UPDATE texts SET desc = ?, str2 = ? WHERE id = ?")
    .run(
      'If a monster on your side of the field was sent to your Graveyard this turn, you can Special Summon 1 monster with an ATK of 1500 points or less from your Deck once during this turn. Then shuffle your Deck. You can only activate 1 "Last Will" per turn. You cannot inflict battle damage the turn you activate this card.',
      "You cannot inflict battle damage this turn",
      85602018,
    );
  const changeOfHeartTextResult = db
    .prepare("UPDATE texts SET desc = ?, str1 = ? WHERE id = ?")
    .run(
      "Discard 1 card, then target 1 monster your opponent controls; take control of it until the End Phase. For as long as that monster remains on the field, it cannot inflict battle damage.",
      "That monster cannot inflict battle damage while it remains on the field",
      4031928,
    );
  const darkHoleTextResult = db
    .prepare("UPDATE texts SET desc = ?, str1 = ? WHERE id = ?")
    .run(
      "Destroy all monsters on the field. You cannot inflict battle damage the turn you activate this card.",
      "You cannot inflict battle damage this turn",
      53129443,
    );
  const raigekiTextResult = db
    .prepare("UPDATE texts SET desc = ?, str1 = ? WHERE id IN (?, ?)")
    .run(
      "Discard 1 card; destroy all monsters your opponent controls. You cannot inflict battle damage the turn you activate this card.",
      "You cannot inflict battle damage this turn",
      12580477,
      12580478,
    );
  const alienWarriorTextResult = db
    .prepare("UPDATE texts SET desc = ?, str1 = ? WHERE id = ?")
    .run(
      'If this card is destroyed: You can place 2 A-Counters on face-up non-"Alien" card(s). (If a monster with an A-Counter battles an "Alien" monster, it loses 300 ATK/DEF for each A-Counter during damage calculation only.)',
      'Place 2 A-Counters on face-up non-"Alien" card(s)',
      98719226,
    );
  const alienMotherTextResult = db
    .prepare("UPDATE texts SET desc = ?, str1 = ?, str2 = ? WHERE id = ?")
    .run(
      'If there are 5 or more A-Counters on the field: You can remove 2 A-Counters from anywhere on the field; Special Summon this card from your hand or GY. If this card destroys a monster with an A-Counter by battle: Special Summon that monster to your side of the field. Your opponent cannot target this card for attacks while you control a monster Special Summoned by this effect. When this card leaves the field, destroy all monsters Special Summoned by this effect. You can only control 1 Level 6 or higher "Alien" monster.',
      "Special Summon this card from your hand or GY",
      "Special Summon the monster destroyed by battle",
      24104865,
    );
  const alienOverlordTextResult = db
    .prepare("UPDATE texts SET desc = ?, str1 = ? WHERE id = ?")
    .run(
      'You can remove 2 A-Counters from anywhere on the field to Special Summon this card from your hand. Once per turn, you can place 1 A-Counter on each face-up non-"Alien" card. (If a monster with an A-Counter battles an "Alien" monster, it loses 300 ATK and DEF for each A-Counter during damage calculation only.) You can only control 1 Level 6 or higher "Alien" monster.',
      'Place 1 A-Counter on each face-up non-"Alien" card',
      63253763,
    );
  const alienHunterTextResult = db
    .prepare("UPDATE texts SET desc = ?, str1 = ?, str2 = ? WHERE id = ?")
    .run(
      'During your Main Phase, if you control no monsters and this card is in your GY: You can place 1 "Alien" card from your hand on the bottom of your Deck; Special Summon this card. If this card is Special Summoned this way, you can place 1 A-Counter on 1 face-up non-"Alien" card. You can only use this effect of "Alien Hunter" once per turn.',
      "Special Summon this card from your GY",
      'Place 1 A-Counter on 1 face-up non-"Alien" card',
      62315111,
    );
  const alienGreyTextResult = db
    .prepare("UPDATE texts SET desc = ?, str1 = ?, str2 = ?, str3 = ? WHERE id = ?")
    .run(
      'If this card is Normal or Special Summoned, or flipped face-up: Draw 1 card. During either player\'s End Phase: You can banish this card from your GY; send 1 Spell/Trap from your Deck to the GY. You can only use 1 "Alien" GY effect that banishes itself per turn.',
      "Draw 1 card",
      "Send 1 Spell/Trap from your Deck to the GY",
      "",
      62437709,
    );
  const alienDogTextResult = db
    .prepare("UPDATE texts SET desc = ?, str1 = ?, str2 = ? WHERE id = ?")
    .run(
      'While you control a face-up "Alien" monster and this card is in your hand: You can Special Summon this card. Once per turn: You can place 1 A-Counter on 1 face-up non-"Alien" card. (If a monster with an A-Counter battles an "Alien" monster, it loses 300 ATK and DEF for each A-Counter during damage calculation only.)',
      "Special Summon this card from your hand",
      'Place 1 A-Counter on 1 face-up non-"Alien" card',
      15475415,
    );
  const alienDogTypeResult = db
    .prepare("UPDATE datas SET type = (type | ?) WHERE id = ?")
    .run(0x1000, 15475415);
  const alienShocktrooperTextResult = db
    .prepare("UPDATE texts SET desc = ?, str1 = ? WHERE id = ?")
    .run(
      'If this card battles a monster with an A-Counter on it, during the Battle Step: You can banish 1 card from your GY, then send 1 banished card to the GY.',
      "Banish 1 card from your GY, then send 1 banished card to the GY",
      97127906,
    );
  const alienShocktrooperTypeResult = db
    .prepare("UPDATE datas SET type = (type | ?) & ~? WHERE id = ?")
    .run(0x20, 0x10, 97127906);
  const alienCosmicHorrorGangielTextResult = db
    .prepare("UPDATE texts SET name = ?, desc = ?, str1 = ?, str2 = ? WHERE id = ?")
    .run(
      "Alien Cosmic Horror Gangi'el",
      'If you have exactly 3 banished "Alien" cards: You can Special Summon this card from your hand. You can remove 1 A-Counter from anywhere on the field, and move 1 banished "Alien" card to your GY, then target 1 card on the field; return that target to its owner\'s hand. You can only use this effect of "Alien Cosmic Horror Gangi\'el" once per turn. You can only control 1 Level 6 or higher "Alien" monster.',
      "Special Summon this card from your hand",
      "Return 1 card on the field to its owner's hand",
      51192573,
    );
  const alienCosmicHorrorGangielSetcodeResult = db
    .prepare("UPDATE datas SET setcode = ? WHERE id = ?")
    .run(0xc, 51192573);
  const alienAmmoniteTextResult = db
    .prepare("UPDATE texts SET desc = ?, str1 = ? WHERE id = ?")
    .run(
      'If this card is Normal or Special Summoned from your hand or GY: You can target 1 Level 4 or lower "Alien" monster in your GY; Special Summon it. You can only use this effect of "Alien Ammonite" once per turn.',
      'Special Summon 1 Level 4 or lower "Alien" monster from your GY',
      652362,
    );
  const alienMothershipMuusikiTextResult = db
    .prepare("UPDATE texts SET name = ?, desc = ?, str1 = ?, str2 = ?, str3 = ? WHERE id = ?")
    .run(
      "Alien Mothership Musk'I",
      'You can Special Summon this card from your hand if you control no monsters and your opponent controls a monster. You can discard 1 card; activate 1 of these effects. You can only use this effect of "Alien Mothership Musk\'I" once per turn.\n●Special Summon 1 Level 4 or lower "Alien" monster from your Deck.\n●Add 1 "Alien" card from your Deck or GY to your hand.',
      "Special Summon this card from your hand",
      'Special Summon 1 Level 4 or lower "Alien" monster from your Deck',
      'Add 1 "Alien" card from your Deck or GY to your hand',
      97697678,
    );
  const alienMothershipMuusikiSetcodeResult = db
    .prepare("UPDATE datas SET setcode = ? WHERE id = ?")
    .run(0xc, 97697678);
  const aCellScatterBurstTextResult = db
    .prepare("UPDATE texts SET name = ?, desc = ?, str1 = ?, str2 = ? WHERE id = ?")
    .run(
      'Alien "A" Cell Scatter Burst',
      'Tribute 1 "Alien" monster; distribute new A-Counters equal to its Level among face-up non-"Alien" cards. After this effect resolves, you can draw 1 card. During your Main Phase: You can banish this card from your GY; Special Summon 1 "Alien" monster from your hand. You can only use 1 "Alien" GY effect that banishes itself per turn.',
      "Draw 1 card",
      'Special Summon 1 "Alien" monster from your hand',
      73262676,
    );
  const orbitalBombardmentTextResult = db
    .prepare("UPDATE texts SET name = ?, desc = ?, str1 = ?, str2 = ? WHERE id = ?")
    .run(
      "Alien Orbital Bombardment",
      'Send 1 "Alien" monster from your hand or field to the GY, then target 1 card on the field; place that target on the bottom of the owner\'s Deck. You can banish this card from your GY; place 1 A-Counter on 1 face-up non-"Alien" card. You can only use 1 "Alien" GY effect that banishes itself per turn.',
      "Place 1 card on the bottom of the owner's Deck",
      'Place 1 A-Counter on 1 face-up non-"Alien" card',
      96875080,
    );
  const codeAAncientRuinsTextResult = db
    .prepare("UPDATE texts SET name = ?, desc = ?, str1 = ?, str2 = ? WHERE id = ?")
    .run(
      "Code A Ancient Ruins",
      'Each time a face-up "Alien" monster(s) is destroyed, place 1 A-Counter on 1 face-up non-"Alien" card. You can remove 2 A-Counters from anywhere on the field; Special Summon 1 Reptile monster from your hand or GY. You can only use this effect of "Code A Ancient Ruins" once per turn.',
      "Special Summon 1 Reptile monster from your hand or GY",
      'Place 1 A-Counter on 1 face-up non-"Alien" card',
      99342953,
    );
  const cropCirclesTextResult = db
    .prepare("UPDATE texts SET name = ?, desc = ?, str1 = ?, str2 = ? WHERE id = ?")
    .run(
      "Alien Crop Circles",
      'Activate only if there are A-Counters on the field. Flip all cards that can be flipped face-down. You can banish this card from your GY; add 1 "Alien" card from your Deck to your hand. You can only use 1 "Alien" GY effect that banishes itself per turn.',
      "Flip all cards that can be flipped face-down",
      'Add 1 "Alien" card from your Deck to your hand',
      24082387,
    );
  const massHypnosisTextResult = db
    .prepare("UPDATE texts SET name = ?, desc = ?, str1 = ?, str2 = ?, str3 = ? WHERE id = ?")
    .run(
      "Alien Mass Hypnosis",
      'Target up to 2 face-up monsters your opponent controls with A-Counters, and take control of them. Monsters taken by this effect cannot inflict battle damage this turn. During each of your End Phases, destroy this card. You can banish this card from your GY and discard the bottom card of your Deck; flip 1 face-up card on the field face-down. You can only use 1 "Alien" GY effect that banishes itself per turn.',
      "During each of your End Phases, destroy this card",
      "Monsters taken cannot inflict battle damage this turn",
      "Flip 1 face-up card on the field face-down",
      21768554,
    );
  const alienNamedSpellTrapTextResults = [
    [53291093, "Alien Mysterious Triangle"],
    [60946968, 'Alien Otherworld - The "A" Zone'],
    [39163598, "Alien Planet Pollutant Virus"],
  ].map(([id, name]) => db.prepare("UPDATE texts SET name = ? WHERE id = ?").run(name, id));
  const alienSpellTrapSetcodeResult = db
    .prepare(
      `UPDATE datas
      SET setcode = ?
      WHERE id IN (${alienSpellTrapPasscodes.map(() => "?").join(", ")})`,
    )
    .run(0xc, ...alienSpellTrapPasscodes);
  const monsterRebornTextResult = db
    .prepare("UPDATE texts SET desc = ? WHERE id IN (?, ?)")
    .run(
      "Discard 1 card, then target 1 monster in either GY; Special Summon it in Attack Position, and equip it with this card. When this card leaves the field, destroy the equipped monster.",
      83764718,
      83764719,
    );
  const monsterRebornTypeResult = db
    .prepare("UPDATE datas SET type = ? WHERE id IN (?, ?)")
    .run(0x40002, 83764718, 83764719);
  const gracefulCharityTextResult = db
    .prepare("UPDATE texts SET desc = ? WHERE id = ?")
    .run(
      "Draw 3 cards, then banish 3 cards from your hand.",
      79571449,
    );
  const dimensionFusionTextResult = db
    .prepare("UPDATE texts SET desc = ?, str1 = ? WHERE id = ?")
    .run(
      'Banish 1 card from your hand; both players Special Summon as many of their banished monsters as possible, then banish this card. You can only activate 1 "Dimension Fusion" per turn. You cannot inflict battle damage the turn you activate this card.',
      "You cannot inflict battle damage this turn",
      23557835,
    );
  const cyberSteinTextResult = db
    .prepare("UPDATE texts SET desc = ? WHERE id = ?")
    .run(
      "If this card is Normal or Special Summoned, or flipped face-up: You can Special Summon 1 Level 10 or lower Fusion Monster from your Extra Deck in face-up Defense Position, but its ATK becomes 0, also if it is Level 7 or higher, negate its effects.",
      69015963,
    );
  const cyberSteinSetcodeResult = db
    .prepare("UPDATE datas SET setcode = ? WHERE id = ?")
    .run(0x93, 69015963);
  const lastWarriorTextResult = db
    .prepare("UPDATE texts SET desc = ? WHERE id = ?")
    .run(
      '"Zombyra the Dark" + "Maryokutai"\nNeither player can Special Summon monsters.',
      86099788,
    );
  const ojamaKingTextResult = db
    .prepare("UPDATE texts SET desc = ? WHERE id = ?")
    .run(
      '"Ojama Green" + "Ojama Yellow" + "Ojama Black"\nMust first be Fusion Summoned. Choose up to 3 of your opponent\'s unused Monster Zones. Those zones cannot be used.',
      90140980,
    );
  const ojamaKnightTextResult = db
    .prepare("UPDATE texts SET desc = ? WHERE id = ?")
    .run(
      '2 "Ojama" monsters\nMust first be Fusion Summoned. Choose up to 2 of your opponent\'s unused Monster Zones. Those zones cannot be used.',
      40391316,
    );
  const yataGarasuTextResult = db
    .prepare("UPDATE texts SET desc = ?, str1 = ?, str2 = ? WHERE id = ?")
    .run(
      "Cannot be Special Summoned. During the End Phase of the turn this card was Normal Summoned or flipped face-up: Return it to the hand. If this card inflicts battle damage to your opponent: Skip their next Draw Phase, unless they have 1 or fewer cards in their hand during that Draw Phase.",
      "Skip your opponent's next Draw Phase unless they have 1 or fewer cards in their hand",
      'Affected by "Yata-Garasu": will skip next Draw Phase unless you have 1 or fewer cards in hand',
      3078576,
    );
  const magicalScientistTextResult = db
    .prepare("UPDATE texts SET desc = ? WHERE id = ?")
    .run(
      'If this card is Normal or Special Summoned, or flipped face-up: You can Special Summon 1 Level 6 or lower Fusion Monster from your Extra Deck in face-up Defense Position, but it cannot inflict battle damage until your next End Phase.',
      34206604,
    );
  const maxxCTextResult = db
    .prepare("UPDATE texts SET desc = ? WHERE id = ?")
    .run(
      'When your opponent Special Summons a monster(s): You can send this card from your hand to the GY; draw 1 card, also each time your opponent Special Summons a monster(s) this turn, draw 1 card. You can only draw up to 2 cards with the effect of "Maxx "C"" per turn.',
      23434538,
    );
  const fiberJarTextResult = db
    .prepare("UPDATE texts SET desc = ? WHERE id = ?")
    .run(
      "If this card is Normal or Special Summoned, or flipped face-up: Set both players' LP to 8000.",
      78706415,
    );
  const fiberJarTypeResult = db
    .prepare("UPDATE datas SET type = (type | ?) & ~? WHERE id = ?")
    .run(0x1000, 0x200000, 78706415);
  const painfulChoiceTextResult = db
    .prepare("UPDATE texts SET desc = ?, str1 = ? WHERE id = ?")
    .run(
      "Pay half your LP; select 2 cards from your Deck and show them to your opponent. Your opponent selects 1 card among them. Add that card to your hand and discard the remaining card to the Graveyard.",
      "Select 2 cards from your Deck",
      74191942,
    );
  const blackLusterSoldierTextResult = db
    .prepare("UPDATE texts SET desc = ? WHERE id IN (?, ?)")
    .run(
      "Cannot be Normal Summoned/Set. Must first be Special Summoned (from your hand) by banishing 1 LIGHT and 1 DARK monster from your GY. Once per turn, you can activate 1 of these effects.\r\n● Target 1 face-up monster on the field; banish it. This card cannot attack the turn this effect is activated.\r\n● If this attacking card destroys an opponent's monster by battle: It can make a second attack in a row, but it cannot inflict battle damage with that attack.",
      ...blackLusterSoldierPasscodes,
    );
  const solemnWarningTextResult = db
    .prepare("UPDATE texts SET desc = ? WHERE id = ?")
    .run(
      "When a monster(s) would be Summoned, OR when a Spell/Trap Card, or monster effect, is activated that includes an effect that Special Summons a monster(s): Pay 1000 LP; negate the Summon or activation, and if you do, destroy it.",
      84749824,
    );
  const skillDrainTextResult = db
    .prepare("UPDATE texts SET desc = ? WHERE id = ?")
    .run(
      "Negate the effects of all face-up monsters while they are face-up on the field (but their effects can still be activated).",
      82732705,
    );
  const gatewayOfTheSixTextResult = db
    .prepare("UPDATE texts SET desc = ?, str1 = ?, str2 = ?, str3 = ? WHERE id = ?")
    .run(
      'Each time a "Six Samurai" monster(s) is Normal or Special Summoned, place 2 Bushido Counters on this card. You can only control 1 "Gateway of the Six". You can remove Bushido Counters from your field to activate these effects. You can only use each of these effects of "Gateway of the Six" once per turn.\n● 2 Counters: Target 1 "Six Samurai" monster; that target gains 300 ATK.\n● 4 Counters: Add 1 "Six Samurai" monster from your Deck or GY to your hand.\n● 6 Counters: Target 1 "Shien" monster in your GY; Special Summon that target.',
      '2 Counters: Target 1 face-up "Six Samurai" monster; that target gains 300 ATK.',
      '4 Counters: Add 1 "Six Samurai" monster from your Deck or GY to your hand.',
      '6 Counters: Target 1 "Shien" monster in your GY; Special Summon that target.',
      27970830,
    );
  const blackWhirlwindTextResult = db
    .prepare("UPDATE texts SET desc = ? WHERE id = ?")
    .run(
      'When a "Blackwing" monster is Normal Summoned to your field: You can add 1 "Blackwing" monster from your Deck to your hand with less ATK than that monster. You can only use this effect of "Black Whirlwind" once per turn.',
      91351370,
    );
  const trishulaTextResult = db
    .prepare("UPDATE texts SET desc = ? WHERE id = ?")
    .run(
      '1 Tuner + 2+ non-Tuner monsters\nWhen this card is Synchro Summoned: You can banish up to 1 card each from your opponent\'s hand, field, and GY. (The card in the hand is chosen at random.) You can only use this effect of "Trishula, Dragon of the Ice Barrier" once per Duel.',
      52687916,
    );
  const fishborgBlasterTextResult = db
    .prepare("UPDATE texts SET desc = ? WHERE id = ?")
    .run(
      'If you control a face-up Level 3 or lower WATER monster: You can discard 1 card; Special Summon this card from your Graveyard. You can only use this effect of "Fishborg Blaster" once per turn. If this card is used as a Synchro Material Monster, all other Synchro Material Monsters must be WATER.',
      93369354,
    );
  const butterflyDaggerElmaTextResult = db
    .prepare("UPDATE texts SET desc = ? WHERE id = ?")
    .run(
      "The equipped monster gains 800 ATK/DEF. When this card is destroyed and sent to the Graveyard while equipped: You can return this card to the hand.",
      69243953,
    );
  const crimsonShadowArmorNinjaTextResult = db
    .prepare("UPDATE texts SET desc = ?, str1 = ? WHERE id = ?")
    .run(
      '2 Level 5 monsters\nDuring either player\'s turn (Quick Effect): You can detach 2 Xyz Materials from this card; this turn, face-up "Ninja" monsters cannot be destroyed by battle or by card effects.',
      "Destruction immunity",
      19333131,
    );
  const gigaBrilliantTextResult = db
    .prepare("UPDATE texts SET desc = ?, str1 = ? WHERE id = ?")
    .run(
      "2 Level 3 monsters\nOnce per turn: You can detach 1 Xyz Material from this card; all face-up monsters you currently control gain 300 ATK/DEF.",
      "Gain ATK/DEF",
      47805931,
    );
  const crystalzeroTextResult = db
    .prepare("UPDATE texts SET desc = ? WHERE id = ?")
    .run(
      "2 Level 5 monsters\nDuring either player's turn: You can detach 1 Xyz Material from this card, then target 1 face-up monster on the field; its ATK becomes half its current ATK until the end of your turn.",
      62070231,
    );
  const swapFrogTextResult = db
    .prepare("UPDATE texts SET desc = ?, str1 = ?, str2 = ? WHERE id = ?")
    .run(
      'You can discard 1 WATER monster to Special Summon this card from your hand. When this card is Summoned, you can select and send 1 Level 2 or lower Aqua-Type WATER monster from your Deck or your side of the field to the Graveyard. Once per turn, you can return 1 monster you control to your hand to Normal Summon 1 "Frog" monster, except "Swap Frog", in addition to your Normal Summon or Set this turn.',
      "Send 1 Level 2 or lower Aqua-Type WATER monster to the Graveyard",
      "Return 1 monster to gain an additional Normal Summon",
      9126351,
    );
  const slimeToadTextResult = db
    .prepare("UPDATE texts SET name = ?, desc = ?, str1 = ? WHERE id = ?")
    .run(
      "Frog the Jam",
      'If this card is Normal or Special Summoned from your hand, or flipped face-up: You can target 1 "Frog" monster in your GY; equip that target to this card. This card gains level, ATK and DEF equal to the original stats of the equipped monster. You can only use this effect of "Frog the Jam" once per turn.',
      'Equip 1 "Frog" monster from your GY to this card',
      68638985,
    );
  const frogSetcodeResult = db
    .prepare("UPDATE datas SET setcode = ? WHERE id IN (?, ?, ?)")
    .run(0x12, 68638985, 20663556, 62671448);
  const slimeToadTypeResult = db
    .prepare("UPDATE datas SET type = (type | ?) & ~? WHERE id = ?")
    .run(0x1020, 0x10, 68638985);
  const toadMasterTextResult = db
    .prepare("UPDATE texts SET desc = ?, str1 = ?, str2 = ? WHERE id = ?")
    .run(
      '(This card is always treated as a "Frog" card.)\nA hermit frog that has been in existence for thousands of years, it attacks with tadpoles.',
      "",
      "",
      62671448,
    );
  const toadMasterTypeResult = db
    .prepare("UPDATE datas SET type = (type | ?) & ~? WHERE id = ?")
    .run(0x1010, 0x20, 62671448);
  const substitoadTextResult = db
    .prepare("UPDATE texts SET desc = ?, str1 = ? WHERE id = ?")
    .run(
      '(This card is always treated as a "Frog" card.)\nDuring your turn (Quick Effect): You can Tribute 1 monster; Special Summon 1 "Frog" monster from your hand, Deck, or GY. You can only Special Summon each "Frog" monster up to twice per turn with a "Substitoad" effect.',
      'Special Summon 1 "Frog" monster from your hand, Deck, or GY',
      20663556,
    );
  const dupeFrogTextResult = db
    .prepare("UPDATE texts SET desc = ?, str1 = ? WHERE id = ?")
    .run(
      'This card\'s name becomes "Des Frog" while on the field. Monsters your opponent controls cannot target monsters for attacks, except "Des Frog". If this card is sent from the field to the GY: During the End Phase of this turn, you can add 1 "Frog" monster from your Deck or GY to your hand, except "Dupe Frog". You can only use this effect of "Dupe Frog" once per turn.',
      "Add 1 Frog in the End Phase",
      46239604,
    );
  const rykoTextResult = db
    .prepare("UPDATE texts SET desc = ?, str1 = ? WHERE id = ?")
    .run(
      "FLIP: You can target 1 card on the field; destroy that target. Send the top 3 cards of your Deck to the GY.",
      "Destroy 1 targeted card on the field",
      21502796,
    );
  const levelLimitAreaBTextResult = db
    .prepare("UPDATE texts SET desc = ? WHERE id = ?")
    .run(
      "All face-up Level 4 or higher monsters on the field are changed to Defense Position. Once per turn, during your End Phase, pay 1000 LP or destroy this card.",
      3136426,
    );
  const messengerOfPeaceTextResult = db
    .prepare("UPDATE texts SET desc = ? WHERE id = ?")
    .run(
      "Monsters with 1500 or more ATK cannot declare an attack. Once per turn, during your End Phase, pay 1000 LP or destroy this card.",
      44656491,
    );
  const gravityBindTextResult = db
    .prepare("UPDATE texts SET desc = ? WHERE id = ?")
    .run(
      "Level 4 or higher monsters cannot attack. Once per turn, during your End Phase, pay 1000 LP or destroy this card.",
      85742772,
    );
  const xSaberAirbellumTextResult = db
    .prepare("UPDATE texts SET desc = ? WHERE id = ?")
    .run(
      'If this card inflicts battle damage to your opponent by a direct attack: Discard 1 random card from your opponent\'s hand. You can only use this effect of "X-Saber Airbellum" once per turn.',
      90508760,
    );
  const xxSaberGottomsTextResult = db
    .prepare("UPDATE texts SET desc = ? WHERE id = ?")
    .run(
      '1 Tuner + 1 or more EARTH monsters\nYou can Tribute 1 "X-Saber" monster; discard 1 random card from your opponent\'s hand. You can only use this effect of "XX-Saber Gottoms" once per turn.',
      52352005,
    );
  const cosmicFortressGolgarTextResult = db
    .prepare("UPDATE texts SET desc = ? WHERE id = ?")
    .run(
      "1 Reptile + 1 or more non-Tuner monsters\nOnce per turn, you can select any number of face-up Spell or Trap Cards. Return those cards to their owners' hands, and distribute new A-Counters among monsters on the field equal to the number of cards returned. Once per turn, you can remove 2 A-Counters from anywhere on the field to destroy 1 card your opponent controls.",
      68319538,
    );
  const fieldMarshalTextResult = db
    .prepare("UPDATE texts SET desc = ?, str1 = ? WHERE id = ?")
    .run(
      "1 Tuner + 1+ monsters\nThis card inflicts piercing battle damage. If this card inflicts battle damage to your opponent: Draw 1 card.",
      "Draw 1 card",
      69461394,
    );
  const markErrataName = db.prepare("UPDATE texts SET name = ? || name WHERE id = ?");
  const errataNameResults = errataPasscodes.map((id) =>
    markErrataName.run(errataNamePrefix, id),
  );
  db.close();

  if (Number(lastWillTextResult.changes) !== 1) {
    throw new Error("Expected to update Last Will text once");
  }
  if (Number(changeOfHeartTextResult.changes) !== 1) {
    throw new Error("Expected to update Change of Heart text once");
  }
  if (Number(darkHoleTextResult.changes) !== 1) {
    throw new Error("Expected to update Dark Hole text once");
  }
  if (Number(raigekiTextResult.changes) !== 2) {
    throw new Error("Expected to update Raigeki text twice");
  }
  if (Number(alienWarriorTextResult.changes) !== 1) {
    throw new Error("Expected to update Alien Warrior text once");
  }
  if (Number(alienMotherTextResult.changes) !== 1) {
    throw new Error("Expected to update Alien Mother text once");
  }
  if (Number(alienOverlordTextResult.changes) !== 1) {
    throw new Error("Expected to update Alien Overlord text once");
  }
  if (Number(alienHunterTextResult.changes) !== 1) {
    throw new Error("Expected to update Alien Hunter text once");
  }
  if (Number(alienGreyTextResult.changes) !== 1) {
    throw new Error("Expected to update Alien Grey text once");
  }
  if (Number(alienDogTextResult.changes) !== 1) {
    throw new Error("Expected to update Alien Dog text once");
  }
  if (Number(alienDogTypeResult.changes) !== 1) {
    throw new Error("Expected to update Alien Dog type once");
  }
  if (Number(alienShocktrooperTextResult.changes) !== 1) {
    throw new Error("Expected to update Alien Shocktrooper text once");
  }
  if (Number(alienShocktrooperTypeResult.changes) !== 1) {
    throw new Error("Expected to update Alien Shocktrooper type once");
  }
  if (Number(alienCosmicHorrorGangielTextResult.changes) !== 1) {
    throw new Error("Expected to update Alien Cosmic Horror Gangi'el text once");
  }
  if (Number(alienCosmicHorrorGangielSetcodeResult.changes) !== 1) {
    throw new Error("Expected to update Alien Cosmic Horror Gangi'el setcode once");
  }
  if (Number(alienAmmoniteTextResult.changes) !== 1) {
    throw new Error("Expected to update Alien Ammonite text once");
  }
  if (Number(alienMothershipMuusikiTextResult.changes) !== 1) {
    throw new Error("Expected to update Alien Mothership Musk'i text once");
  }
  if (Number(alienMothershipMuusikiSetcodeResult.changes) !== 1) {
    throw new Error("Expected to update Alien Mothership Musk'i setcode once");
  }
  if (Number(aCellScatterBurstTextResult.changes) !== 1) {
    throw new Error('Expected to update "A" Cell Scatter Burst text once');
  }
  if (Number(orbitalBombardmentTextResult.changes) !== 1) {
    throw new Error("Expected to update Orbital Bombardment text once");
  }
  if (Number(codeAAncientRuinsTextResult.changes) !== 1) {
    throw new Error("Expected to update Code A Ancient Ruins text once");
  }
  if (Number(cropCirclesTextResult.changes) !== 1) {
    throw new Error("Expected to update Crop Circles text once");
  }
  if (Number(massHypnosisTextResult.changes) !== 1) {
    throw new Error("Expected to update Mass Hypnosis text once");
  }
  if (alienNamedSpellTrapTextResults.some((result) => Number(result.changes) !== 1)) {
    throw new Error("Expected to update Alien Spell/Trap names once each");
  }
  if (Number(alienSpellTrapSetcodeResult.changes) !== alienSpellTrapPasscodes.length) {
    throw new Error("Expected to update Alien Spell/Trap setcodes");
  }
  if (Number(monsterRebornTextResult.changes) !== 2) {
    throw new Error("Expected to update Monster Reborn text twice");
  }
  if (Number(monsterRebornTypeResult.changes) !== 2) {
    throw new Error("Expected to update Monster Reborn type twice");
  }
  if (Number(gracefulCharityTextResult.changes) !== 1) {
    throw new Error("Expected to update Graceful Charity text once");
  }
  if (Number(dimensionFusionTextResult.changes) !== 1) {
    throw new Error("Expected to update Dimension Fusion text once");
  }
  if (Number(cyberSteinTextResult.changes) !== 1) {
    throw new Error("Expected to update Cyber-Stein text once");
  }
  if (Number(cyberSteinSetcodeResult.changes) !== 1) {
    throw new Error("Expected to update Cyber-Stein setcode once");
  }
  if (Number(lastWarriorTextResult.changes) !== 1) {
    throw new Error("Expected to update The Last Warrior from Another Planet text once");
  }
  if (Number(ojamaKingTextResult.changes) !== 1) {
    throw new Error("Expected to update Ojama King text once");
  }
  if (Number(ojamaKnightTextResult.changes) !== 1) {
    throw new Error("Expected to update Ojama Knight text once");
  }
  if (Number(yataGarasuTextResult.changes) !== 1) {
    throw new Error("Expected to update Yata-Garasu text once");
  }
  if (Number(magicalScientistTextResult.changes) !== 1) {
    throw new Error("Expected to update Magical Scientist text once");
  }
  if (Number(maxxCTextResult.changes) !== 1) {
    throw new Error('Expected to update Maxx "C" text once');
  }
  if (Number(fiberJarTextResult.changes) !== 1) {
    throw new Error("Expected to update Fiber Jar text once");
  }
  if (Number(fiberJarTypeResult.changes) !== 1) {
    throw new Error("Expected to update Fiber Jar type once");
  }
  if (Number(painfulChoiceTextResult.changes) !== 1) {
    throw new Error("Expected to update Painful Choice text once");
  }
  if (Number(blackLusterSoldierAlternateArtResult.changes) !== 1) {
    throw new Error(
      "Expected to add Black Luster Soldier - Envoy of the Beginning alternate art data once",
    );
  }
  if (Number(blackLusterSoldierAlternateArtTextResult.changes) !== 1) {
    throw new Error(
      "Expected to add Black Luster Soldier - Envoy of the Beginning alternate art text once",
    );
  }
  if (Number(blackLusterSoldierTextResult.changes) !== 2) {
    throw new Error(
      "Expected to update Black Luster Soldier - Envoy of the Beginning text twice",
    );
  }
  if (Number(solemnWarningTextResult.changes) !== 1) {
    throw new Error("Expected to update Solemn Warning text once");
  }
  if (Number(skillDrainTextResult.changes) !== 1) {
    throw new Error("Expected to update Skill Drain text once");
  }
  if (Number(gatewayOfTheSixTextResult.changes) !== 1) {
    throw new Error("Expected to update Gateway of the Six text once");
  }
  if (Number(blackWhirlwindTextResult.changes) !== 1) {
    throw new Error("Expected to update Black Whirlwind text once");
  }
  if (Number(trishulaTextResult.changes) !== 1) {
    throw new Error("Expected to update Trishula, Dragon of the Ice Barrier text once");
  }
  if (Number(fishborgBlasterTextResult.changes) !== 1) {
    throw new Error("Expected to update Fishborg Blaster text once");
  }
  if (Number(butterflyDaggerElmaTextResult.changes) !== 1) {
    throw new Error("Expected to update Butterfly Dagger - Elma text once");
  }
  if (Number(crimsonShadowArmorNinjaTextResult.changes) !== 1) {
    throw new Error("Expected to update Number 12: Crimson Shadow Armor Ninja text once");
  }
  if (Number(gigaBrilliantTextResult.changes) !== 1) {
    throw new Error("Expected to update Number 20: Giga-Brilliant text once");
  }
  if (Number(crystalzeroTextResult.changes) !== 1) {
    throw new Error("Expected to update Number 94: Crystalzero text once");
  }
  if (Number(swapFrogTextResult.changes) !== 1) {
    throw new Error("Expected to update Swap Frog text once");
  }
  if (Number(slimeToadTextResult.changes) !== 1) {
    throw new Error("Expected to update Frog the Jam text once");
  }
  if (Number(frogSetcodeResult.changes) !== 3) {
    throw new Error("Expected to update Frog setcodes three times");
  }
  if (Number(slimeToadTypeResult.changes) !== 1) {
    throw new Error("Expected to update Frog the Jam type once");
  }
  if (Number(toadMasterTextResult.changes) !== 1) {
    throw new Error("Expected to update Toad Master text once");
  }
  if (Number(toadMasterTypeResult.changes) !== 1) {
    throw new Error("Expected to update Toad Master type once");
  }
  if (Number(substitoadTextResult.changes) !== 1) {
    throw new Error("Expected to update Substitoad text once");
  }
  if (Number(dupeFrogTextResult.changes) !== 1) {
    throw new Error("Expected to update Dupe Frog text once");
  }
  if (Number(rykoTextResult.changes) !== 1) {
    throw new Error("Expected to update Ryko, Lightsworn Hunter text once");
  }
  if (Number(levelLimitAreaBTextResult.changes) !== 1) {
    throw new Error("Expected to update Level Limit - Area B text once");
  }
  if (Number(messengerOfPeaceTextResult.changes) !== 1) {
    throw new Error("Expected to update Messenger of Peace text once");
  }
  if (Number(gravityBindTextResult.changes) !== 1) {
    throw new Error("Expected to update Gravity Bind text once");
  }
  if (Number(xSaberAirbellumTextResult.changes) !== 1) {
    throw new Error("Expected to update X-Saber Airbellum text once");
  }
  if (Number(xxSaberGottomsTextResult.changes) !== 1) {
    throw new Error("Expected to update XX-Saber Gottoms text once");
  }
  if (Number(cosmicFortressGolgarTextResult.changes) !== 1) {
    throw new Error("Expected to update Cosmic Fortress Gol'gar text once");
  }
  if (Number(fieldMarshalTextResult.changes) !== 1) {
    throw new Error("Expected to update Ally of Justice Field Marshal text once");
  }
  if (errataNameResults.some((result) => Number(result.changes) !== 1)) {
    throw new Error("Expected to mark each official Redux errata card name once");
  }
};
