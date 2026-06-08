const { DatabaseSync } = require("node:sqlite");
const path = require("path");

const { copyFileInRedux } = require("./utils");

const errataMarkers = new Map([
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
  [85602018, "⬇️"], // Last Will
  [34206604, "♻️"], // Magical Scientist
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
  [9126351, "\u2b06\ufe0f"], // Swap Frog
  [21502796, "\u2b07\ufe0f"], // Ryko, Lightsworn Hunter
  [86099788, "\u2b07\ufe0f"], // The Last Warrior from Another Planet
]);
const errataNamePrefix = "[Redux] ";

module.exports = function buildCardsDb({ reduxRoot }) {
  const output = path.join(reduxRoot, "modded", "cards.cdb");

  copyFileInRedux({
    reduxRoot,
    source: path.join(reduxRoot, "vanilla", "cards.cdb"),
    output,
  });

  const db = new DatabaseSync(output);
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
      '(This card is not treated as a "Cyber" card.)\nIf this card is Normal or Special Summoned, or flipped face-up: You can Special Summon 1 Fusion Monster from your Extra Deck in face-up Defense Position, but its ATK becomes 0, also if it is Level 7 or higher, negate its effects.',
      69015963,
    );
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
  const fiberJarTextResult = db
    .prepare("UPDATE texts SET desc = ? WHERE id = ?")
    .run(
      "If this card is Normal or Special Summoned, or flipped face-up: Set both players' LP to 8000.",
      78706415,
    );
  const painfulChoiceTextResult = db
    .prepare("UPDATE texts SET desc = ?, str1 = ? WHERE id = ?")
    .run(
      "Pay half your LP; select 2 cards from your Deck and show them to your opponent. Your opponent selects 1 card among them. Add that card to your hand and discard the remaining card to the Graveyard.",
      "Select 2 cards from your Deck",
      74191942,
    );
  const blackLusterSoldierTextResult = db
    .prepare("UPDATE texts SET desc = ? WHERE id = ?")
    .run(
      "Cannot be Normal Summoned/Set. Must first be Special Summoned (from your hand) by banishing 1 LIGHT and 1 DARK monster from your GY. Once per turn, you can activate 1 of these effects.\r\n● Target 1 face-up monster on the field; banish it. This card cannot attack the turn this effect is activated.\r\n● If this attacking card destroys an opponent's monster by battle: It can make a second attack in a row, but it cannot inflict battle damage with that attack.",
      72989439,
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
    .prepare("UPDATE texts SET desc = ? WHERE id = ?")
    .run(
      'Each time a "Six Samurai" monster(s) is Normal or Special Summoned, place 1 Bushido Counter on this card. You can remove Bushido Counters from your field to activate these effects.\n\u25cf2 Counters: Target 1 "Six Samurai" or "Shien" Effect Monster; that target gains 500 ATK until the end of this turn.\n\u25cf4 Counters: Add 1 "Six Samurai" monster from your Deck or GY to your hand.\n\u25cf6 Counters: Target 1 "Shien" Effect Monster in your GY; Special Summon that target.',
      27970830,
    );
  const trishulaTextResult = db
    .prepare("UPDATE texts SET desc = ? WHERE id = ?")
    .run(
      '1 Tuner + 2+ non-Tuner monsters\nWhen this card is Synchro Summoned: You can banish up to 1 card each from your opponent\'s hand, field, and GY. (The card in the hand is chosen at random.) You can only use this effect of "Trishula, Dragon of the Ice Barrier" once per turn.',
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
  const rykoTextResult = db
    .prepare("UPDATE texts SET desc = ?, str1 = ? WHERE id = ?")
    .run(
      "FLIP: You can target 1 card on the field; destroy that target. Send the top 3 cards of your Deck to the GY.",
      "Destroy 1 targeted card on the field",
      21502796,
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
  if (Number(lastWarriorTextResult.changes) !== 1) {
    throw new Error("Expected to update The Last Warrior from Another Planet text once");
  }
  if (Number(yataGarasuTextResult.changes) !== 1) {
    throw new Error("Expected to update Yata-Garasu text once");
  }
  if (Number(magicalScientistTextResult.changes) !== 1) {
    throw new Error("Expected to update Magical Scientist text once");
  }
  if (Number(fiberJarTextResult.changes) !== 1) {
    throw new Error("Expected to update Fiber Jar text once");
  }
  if (Number(painfulChoiceTextResult.changes) !== 1) {
    throw new Error("Expected to update Painful Choice text once");
  }
  if (Number(blackLusterSoldierTextResult.changes) !== 1) {
    throw new Error(
      "Expected to update Black Luster Soldier - Envoy of the Beginning text once",
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
  if (Number(rykoTextResult.changes) !== 1) {
    throw new Error("Expected to update Ryko, Lightsworn Hunter text once");
  }
  if (errataNameResults.some((result) => Number(result.changes) !== 1)) {
    throw new Error("Expected to mark each official Redux errata card name once");
  }
};
