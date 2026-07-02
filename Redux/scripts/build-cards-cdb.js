const { DatabaseSync } = require("node:sqlite");
const path = require("path");

const { copyFileInRedux } = require("./utils");

const errataMarkers = new Map([
  [72989440, "\u2b07\ufe0f"], // Black Luster Soldier - Envoy of the Beginning alternate art
  [72989439, "⬇️"], // Black Luster Soldier - Envoy of the Beginning
  [69243953, "⬆️"], // Butterfly Dagger - Elma
  [4031928, "⬇️"], // Change of Heart
  [69015963, "♻️"], // Cyber-Stein
  [53129443, "⬇️"], // Dark Hole
  [23557835, "♻️"], // Dimension Fusion
  [40044918, "⬇️"], // Elemental HERO Stratos
  [40044919, "⬇️"], // Elemental HERO Stratos alternate art
  [17484499, "⬇️"], // Exchange of the Spirit
  [78706415, "\u267b\ufe0f"], // Fiber Jar
  [93369354, "⬇️"], // Fishborg Blaster
  [27970830, "⬇️"], // Gateway of the Six
  [85742772, "\u2b07\ufe0f"], // Gravity Bind
  [91351370, "\u2b07\ufe0f"], // Black Whirlwind
  [85602018, "⬇️"], // Last Will
  [3136426, "\u2b07\ufe0f"], // Level Limit - Area B
  [34206604, "♻️"], // Magical Scientist
  [23434538, "\u2b07\ufe0f"], // Maxx "C"
  [44656491, "\u2b07\ufe0f"], // Messenger of Peace
  [74191942, "⬇️"], // Painful Choice
  [82732705, "⬆️"], // Skill Drain
  [84749824, "⬆️"], // Solemn Warning
  [52687916, "⬇️"], // Trishula, Dragon of the Ice Barrier
  [3078576, "⬇️"], // Yata-Garasu
  [12580477, "\u2b07\ufe0f"], // Raigeki
  [12580478, "\u2b07\ufe0f"], // Raigeki alternate art
  [83764718, "\u2b07\ufe0f"], // Monster Reborn
  [83764719, "\u2b07\ufe0f"], // Monster Reborn alternate art
  [79571449, "\u2b07\ufe0f"], // Graceful Charity
  [68638985, "\u267b\ufe0f"], // Slime Toad
  [46239604, "\u2b07\ufe0f"], // Dupe Frog
  [62671448, "\u267b\ufe0f"], // Toad Master
  [9126351, "\u2b06\ufe0f"], // Swap Frog
  [20663556, "\u267b\ufe0f"], // Substitoad
  [21502796, "\u2b07\ufe0f"], // Ryko, Lightsworn Hunter
  [86099788, "\u2b07\ufe0f"], // The Last Warrior from Another Planet
]);
const errataNamePrefix = "[Redux] ";
const blackLusterSoldierPasscodes = [72989439, 72989440];

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
      "If this card is Normal or Special Summoned, or flipped face-up: You can Special Summon 1 Fusion Monster from your Extra Deck in face-up Defense Position, but its ATK becomes 0, also if it is Level 7 or higher, negate its effects.",
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
  const elementalHeroStratosTextResult = db
    .prepare("UPDATE texts SET desc = ? WHERE id IN (?, ?)")
    .run(
      'When this card is Normal or Special Summoned: You can activate 1 of these effects.\r\n\u25cf Destroy Spells/Traps on the field, up to the number of "HERO" monsters you control, except this card.\r\n\u25cf Add 1 "HERO" monster from your Deck to your hand.\r\nYou can only use this effect of "Elemental HERO Stratos" once per turn.',
      40044918,
      40044919,
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
    .prepare("UPDATE texts SET desc = ?, str2 = ?, str3 = ? WHERE id = ?")
    .run(
      'Each time a "Six Samurai" monster(s) is Normal or Special Summoned, place 2 Bushido Counters on this card. You can only control 1 face-up "Gateway of the Six". You can remove Bushido Counters from your field to activate these effects.\n\u25cf2 Counters: Target 1 "Six Samurai" or "Shien" Effect Monster; that target gains 500 ATK until the end of this turn.\n\u25cf4 Counters: Target 1 "Shien" Effect Monster in your GY; Special Summon that target.\n\u25cf6 Counters: Add 1 "Six Samurai" monster from your Deck or GY to your hand.',
      '4 Counters: Target 1 "Shien" Effect Monster in your GY; Special Summon that target.',
      '6 Counters: Add 1 "Six Samurai" monster from your Deck or GY to your hand.',
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
      "Slime Toad",
      '(This card is always treated as a "Frog" card.) Its actual name is "FROG THE JAM"!\nIf this card is Normal or Special Summoned from your hand, or flipped face-up: You can target 1 "Frog" monster in your GY; equip that target to this card. This card gains level, ATK and DEF equal to the original stats of the equipped monster. You can only use this effect of "Slime Toad" once per turn.',
      'Equip 1 "Frog" monster from your GY to this card',
      68638985,
    );
  const frogSetcodeResult = db
    .prepare("UPDATE datas SET setcode = ? WHERE id IN (?, ?)")
    .run(0x12, 68638985, 20663556);
  const slimeToadTypeResult = db
    .prepare("UPDATE datas SET type = (type | ?) & ~? WHERE id = ?")
    .run(0x1020, 0x10, 68638985);
  const toadMasterTextResult = db
    .prepare("UPDATE texts SET desc = ?, str1 = ?, str2 = ? WHERE id = ?")
    .run(
      '(This card is always treated as a "Frog" card.)\nYou can discard 1 WATER monster to Special Summon this card from your hand.\nIf this card is sent to the GY, Special Summon 1 "Tadpole Token" (Aqua-Type/WATER/Level 2/Tuner/ATK 500/DEF 500).',
      "Discard 1 WATER monster to Special Summon this card",
      'Special Summon 1 "Tadpole Token"',
      62671448,
    );
  const toadMasterDataResult = db
    .prepare("UPDATE datas SET type = (type | ?) & ~?, setcode = ? WHERE id = ?")
    .run(0x1020, 0x10, 0x12, 62671448);
  const tadpoleTokenDataResult = db
    .prepare(
      `INSERT INTO datas (
        id, ot, alias, setcode, type, atk, def, level, race, attribute, category
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(62671449, 1, 0, 0, 0x5011, 500, 500, 2, 0x40, 0x2, 0);
  const tadpoleTokenTextResult = db
    .prepare(
      `INSERT INTO texts (
        id, name, desc, str1, str2, str3, str4, str5, str6, str7, str8, str9,
        str10, str11, str12, str13, str14, str15, str16
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      62671449,
      "Tadpole Token",
      'Special Summoned with the effect of "[Redux] Toad Master".',
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    );
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
  const markErrataName = db.prepare("UPDATE texts SET name = ? || name || ? WHERE id = ?");
  const errataNameResults = [...errataMarkers].map(([id, marker]) =>
    markErrataName.run(errataNamePrefix, ` ${marker}`, id),
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
  if (Number(elementalHeroStratosTextResult.changes) !== 2) {
    throw new Error("Expected to update Elemental HERO Stratos text twice");
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
  if (Number(swapFrogTextResult.changes) !== 1) {
    throw new Error("Expected to update Swap Frog text once");
  }
  if (Number(slimeToadTextResult.changes) !== 1) {
    throw new Error("Expected to update Slime Toad text once");
  }
  if (Number(frogSetcodeResult.changes) !== 2) {
    throw new Error("Expected to update Frog setcodes twice");
  }
  if (Number(slimeToadTypeResult.changes) !== 1) {
    throw new Error("Expected to update Slime Toad type once");
  }
  if (Number(toadMasterTextResult.changes) !== 1) {
    throw new Error("Expected to update Toad Master text once");
  }
  if (Number(toadMasterDataResult.changes) !== 1) {
    throw new Error("Expected to update Toad Master data once");
  }
  if (Number(tadpoleTokenDataResult.changes) !== 1) {
    throw new Error("Expected to add Tadpole Token data once");
  }
  if (Number(tadpoleTokenTextResult.changes) !== 1) {
    throw new Error("Expected to add Tadpole Token text once");
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
  if (errataNameResults.some((result) => Number(result.changes) !== 1)) {
    throw new Error("Expected to mark each official Redux errata card name once");
  }
};
