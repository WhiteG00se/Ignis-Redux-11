const { DatabaseSync } = require("node:sqlite");
const fs = require("fs");
const path = require("path");

const { copyFileInRedux } = require("./utils");

const errataPasscodes = [
  511002993, // Brionac, Dragon of the Ice Barrier
  511000819, // Chaos Emperor Dragon - Envoy of the End
  511001039, // Dark Magician of Chaos
  511000229, // Dark Strike Fighter
  511003116, // Destiny HERO - Disk Commander
  511002996, // Imperial Order
  21593987, // Makyura the Destructor
  511003019, // Mind Master
  16226796, // Night Assailant
  511002992, // Rescue Cat
  511000824, // Ring of Destruction
  511000825, // Ring of Destruction alternate art
  511002631, // Sangan
  511000818, // Sinister Serpent
  511003012, // Witch of the Black Forest
];
const errataNamePrefix = "[Redux] ";

module.exports = function buildCardsUnofficialDb({ reduxRoot }) {
  const output = path.join(reduxRoot, "modded", "cards-unofficial.cdb");

  copyFileInRedux({
    reduxRoot,
    source: path.join(reduxRoot, "vanilla", "cards-unofficial.cdb"),
    output,
  });

  const db = new DatabaseSync(output);
  const lflist = fs.readFileSync(
    path.join(reduxRoot, "modded", "Redux-11.lflist.conf"),
    "utf8",
  );
  const whitelistPasscodes = new Set(
    [...lflist.matchAll(/^(\d+) [0-3](?= --)/gm)].map((entry) => Number(entry[1])),
  );
  const whitelistedPrintPasscodes = new Set([
    ...whitelistPasscodes,
    511000825, // Ring of Destruction (Pre-Errata) alternate art
  ]);
  // EDOPro labels supplemental legacy cards as Illegal (ot = 8); Redux permits its
  // selected versions as normal OCG/TCG cards (ot = 3).
  const allowWhitelistedCard = db.prepare(
    "UPDATE datas SET ot = 3 WHERE id = ? AND ot = 8",
  );
  const removePreErrataSuffix = db.prepare(
    "UPDATE texts SET name = replace(name, ' (Pre-Errata)', '') WHERE id = ? AND name LIKE '% (Pre-Errata)%'",
  );
  for (const passcode of whitelistedPrintPasscodes) {
    allowWhitelistedCard.run(passcode);
    removePreErrataSuffix.run(passcode);
  }

  const makyuraStatsResult = db
    .prepare("UPDATE datas SET atk = ?, def = ? WHERE id = ?")
    .run(1900, 1900, 21593987); // Makyura the Destructor (Pre-Errata)
  const witchTextResult = db
    .prepare("UPDATE texts SET desc = ? WHERE id = ?")
    .run(
      'When this card is sent from the field to the Graveyard: Add 1 monster with less than 1000 DEF from your Deck to your hand. You can only use this effect of "Witch of the Black Forest" once per turn.',
      511003012,
    ); // Witch of the Black Forest (Pre-Errata)
  const nightAssailantTextResult = db
    .prepare("UPDATE texts SET desc = ? WHERE id = ?")
    .run(
      'FLIP: Target 1 monster your opponent controls; destroy that target. When this card is sent from the hand to the GY: Target 1 Flip monster in your GY, except this card; return that target to the hand. You can only use this effect of "Night Assailant" once per turn.',
      16226796,
    ); // Night Assailant (Pre-Errata)
  const sanganTextResult = db
    .prepare("UPDATE texts SET desc = ? WHERE id = ?")
    .run(
      'When this card is sent from the field to the Graveyard: Add 1 monster with 1500 or less ATK from your Deck to your hand. You can only use this effect of "Sangan" once per turn.',
      511002631,
    ); // Sangan (Pre-Errata)
  const rescueCatTextResult = db
    .prepare("UPDATE texts SET desc = ? WHERE id = ?")
    .run(
      'You can send this card to the Graveyard; Special Summon 2 Level 3 or lower Beast-Type monsters from your Deck, but destroy them during the End Phase. You can only use this effect of "Rescue Cat" once per turn.',
      511002992,
    ); // Rescue Cat (Pre-Errata)
  const mindMasterTextResult = db
    .prepare("UPDATE texts SET desc = ? WHERE id = ?")
    .run(
      'You can only use this effect of "Mind Master" once per turn. You can Tribute 1 monster; Special Summon 1 Level 4 or lower Psychic-Type monster from your hand, Deck, or GY.',
      511003019,
    ); // Mind Master (Pre-Errata)
  const diskCommanderTextResult = db
    .prepare("UPDATE texts SET desc = ? WHERE id = ?")
    .run(
      'If this card is Special Summoned: Draw 1 card. You can only use this effect of "Destiny HERO - Disk Commander" once per turn.',
      511003116,
    ); // Destiny HERO - Disk Commander (Pre-Errata)
  const imperialOrderTextResult = db
    .prepare("UPDATE texts SET desc = ?, str1 = ? WHERE id = ?")
    .run(
      "Negate all Spell effects on the field. Once per turn, during your End Phase, you can pay 1700 LP or destroy this card.",
      "Pay 1700 LP?",
      511002996,
    ); // Imperial Order (Pre-Errata)
  const chaosEmperorDragonTextResult = db
    .prepare("UPDATE texts SET desc = ?, str2 = ? WHERE id = ?")
    .run(
      "Cannot be Normal Summoned/Set. Must first be Special Summoned (from your hand) by banishing 3 LIGHT or DARK monsters from your GY, including at least 1 LIGHT and 1 DARK monster. If this card is Special Summoned: You can destroy all other cards on the field, then both players gain 300 LP for each card destroyed by this effect.",
      "Destroy other cards and gain LP",
      511000819,
    ); // Chaos Emperor Dragon - Envoy of the End (Pre-Errata)
  const darkMagicianOfChaosTextResult = db
    .prepare("UPDATE texts SET desc = ? WHERE id = ?")
    .run(
      'When this card is Normal or Special Summoned: You can target 1 Spell in your Graveyard; add it to your hand. You can only use this effect of "Dark Magician of Chaos" once per turn. Banish any monster this card destroys by battle, instead of sending it to the Graveyard. If this face-up card would leave the field, banish it instead.',
      511001039,
    ); // Dark Magician of Chaos (Pre-Errata)
  const darkStrikeFighterTextResult = db
    .prepare("UPDATE texts SET desc = ? WHERE id = ?")
    .run(
      '1 Tuner + 1+ non-Tuner monsters\r\nYou can Tribute 1 monster; inflict damage to your opponent equal to the Tributed monster\'s Level on the field x 200. You can only use this effect of "Dark Strike Fighter" once per turn.',
      511000229,
    ); // Dark Strike Fighter (Pre-Errata)
  const sinisterSerpentTextResult = db
    .prepare("UPDATE texts SET desc = ? WHERE id = ?")
    .run(
      'During your Standby Phase, if there is a "Sinister Serpent" in your Graveyard: You can add this card from your Graveyard to your hand. You can only use this effect of "Sinister Serpent" once per turn.',
      511000818,
    ); // Sinister Serpent (Pre-Errata)
  const brionacTextResult = db
    .prepare("UPDATE texts SET desc = ? WHERE id = ?")
    .run(
      '1 Tuner + 1+ non-Tuner monsters\r\nYou can discard any number of cards, then target an equal number of cards on the field; return them to the hand. You can only use this effect of "Brionac, Dragon of the Ice Barrier" once per turn.',
      511002993,
    ); // Brionac, Dragon of the Ice Barrier (Pre-Errata)
  const ringOfDestructionTextResult = db
    .prepare("UPDATE texts SET desc = ? WHERE id IN (?, ?)")
    .run(
      "Pay 1500 LP, then target 1 face-up monster; destroy it, and if you do, both players gain LP equal to its ATK.",
      511000824,
      511000825,
    ); // Ring of Destruction (Pre-Errata)
  const markErrataName = db.prepare("UPDATE texts SET name = ? || name WHERE id = ?");
  const errataNameResults = errataPasscodes.map((id) =>
    markErrataName.run(errataNamePrefix, id),
  );
  const illegalWhitelistedCards = db
    .prepare("SELECT id FROM datas WHERE ot = 8")
    .all()
    .filter((card) => whitelistedPrintPasscodes.has(card.id));
  const suffixedWhitelistedCards = db
    .prepare("SELECT id FROM texts WHERE name LIKE '% (Pre-Errata)%'")
    .all()
    .filter((card) => whitelistedPrintPasscodes.has(card.id));
  db.close();

  if (illegalWhitelistedCards.length > 0) {
    throw new Error("Expected Redux whitelist cards not to use the Illegal scope");
  }
  if (suffixedWhitelistedCards.length > 0) {
    throw new Error("Expected Redux whitelist card names without Pre-Errata suffixes");
  }
  if (Number(makyuraStatsResult.changes) !== 1) {
    throw new Error("Expected to update Makyura the Destructor (Pre-Errata) once");
  }
  if (Number(witchTextResult.changes) !== 1) {
    throw new Error("Expected to update Witch of the Black Forest (Pre-Errata) text once");
  }
  if (Number(nightAssailantTextResult.changes) !== 1) {
    throw new Error("Expected to update Night Assailant (Pre-Errata) text once");
  }
  if (Number(sanganTextResult.changes) !== 1) {
    throw new Error("Expected to update Sangan (Pre-Errata) text once");
  }
  if (Number(rescueCatTextResult.changes) !== 1) {
    throw new Error("Expected to update Rescue Cat (Pre-Errata) text once");
  }
  if (Number(mindMasterTextResult.changes) !== 1) {
    throw new Error("Expected to update Mind Master (Pre-Errata) text once");
  }
  if (Number(diskCommanderTextResult.changes) !== 1) {
    throw new Error(
      "Expected to update Destiny HERO - Disk Commander (Pre-Errata) text once",
    );
  }
  if (Number(imperialOrderTextResult.changes) !== 1) {
    throw new Error("Expected to update Imperial Order (Pre-Errata) text once");
  }
  if (Number(chaosEmperorDragonTextResult.changes) !== 1) {
    throw new Error(
      "Expected to update Chaos Emperor Dragon - Envoy of the End (Pre-Errata) text once",
    );
  }
  if (Number(darkMagicianOfChaosTextResult.changes) !== 1) {
    throw new Error("Expected to update Dark Magician of Chaos (Pre-Errata) text once");
  }
  if (Number(darkStrikeFighterTextResult.changes) !== 1) {
    throw new Error("Expected to update Dark Strike Fighter (Pre-Errata) text once");
  }
  if (Number(sinisterSerpentTextResult.changes) !== 1) {
    throw new Error("Expected to update Sinister Serpent (Pre-Errata) text once");
  }
  if (Number(brionacTextResult.changes) !== 1) {
    throw new Error("Expected to update Brionac, Dragon of the Ice Barrier (Pre-Errata) text once");
  }
  if (Number(ringOfDestructionTextResult.changes) !== 2) {
    throw new Error("Expected to update Ring of Destruction (Pre-Errata) text twice");
  }
  if (errataNameResults.some((result) => Number(result.changes) !== 1)) {
    throw new Error("Expected to mark each supplemental Redux errata card name once");
  }
};
