const fs = require("fs");
const path = require("path");

const { copyFileInRedux } = require("./utils");

const limitChanges = new Map([
  ["85602018", 1], // Last Will
  ["23557835", 2], // Dimension Fusion
  ["17484499", 3], // Exchange of the Spirit
  ["4031928", 1], // Change of Heart
  ["511000819", 1], // Chaos Emperor Dragon - Envoy of the End (Pre-Errata)
  ["511003012", 2], // Witch of the Black Forest (Pre-Errata)
  ["69015963", 1], // Cyber-Stein
  ["3078576", 1], // Yata-Garasu
  ["12580477", 1], // Raigeki
  ["34206604", 1], // Magical Scientist
  ["78706415", 1], // Fiber Jar
  ["74191942", 1], // Painful Choice
  ["511003019", 3], // Mind Master (Pre-Errata)
  ["511003116", 3], // Destiny HERO - Disk Commander (Pre-Errata)
  ["511002996", 1], // Imperial Order (Pre-Errata)
  ["33184167", 3], // Tribe-Infecting Virus
  ["34853266", 2], // Tsukuyomi
  ["511002992", 1], // Rescue Cat
  ["31560081", 3], // Magician of Faith
  ["511000818", 1], // Sinister Serpent
  ["68638985", 1], // Slime Toad
  ["20663556", 3], // Substitoad
  ["93369354", 1], // Fishborg Blaster
  ["511000229", 1], // Dark Strike Fighter
  ["511002994", 1], // Goyo Guardian
  ["42703248", 1], // Giant Trunade
  ["79571449", 2], // Graceful Charity
  ["46411259", 3], // Metamorphosis
  ["511000821", 3], // Temple of the Kings (Pre-Errata)
  ["69243953", 3], // Butterfly Dagger - Elma
  ["22046459", 2], // Megamorph
  ["70828912", 1], // Premature Burial
  ["35316708", 3], // Time Seal
  ["511000824", 1], // Ring of Destruction (Pre-Errata)
  ["423705", 0], // Gearfried the Iron Knight
  ["21593987", 3], // Makyura the Destructor (Pre-Errata)
  ["511001039", 1], // Dark Magician of Chaos
  ["35027493", 1], // Deck Devastation Virus
  ["54974237", 1], // Eradicator Epidemic Virus
  ["83764718", 2], // Monster Reborn
  ["5318639", 1], // Mystical Space Typhoon
  ["98777036", 3], // Tragoedia
  ["423585", 3], // Summoner Monk
  ["79106360", 1], // Morphing Jar #2
  ["85087012", 3], // Card Trooper
  ["70583986", 3], // Dewloren, Tiger King of the Ice Barrier
  ["45305419", 1], // Symbol of Heritage
  ["45809008", 3], // Destiny Draw
  ["72302403", 1], // Swords of Revealing Light
  ["72405967", 1], // Royal Tribute
  ["98494543", 3], // Magical Stone Excavation
  ["91623717", 1], // Chain Strike
  ["29843091", 1], // Ojama Trio
  ["62279055", 1], // Magic Cylinder
  ["15800838", 1], // Mind Crush
  ["95308449", 0], // Final Countdown
  ["33396948", 0], // Exodia the Forbidden One
  ["7902349", 3], // Left Arm of the Forbidden One
  ["44519536", 3], // Left Leg of the Forbidden One
  ["70903634", 3], // Right Arm of the Forbidden One
  ["8124921", 3], // Right Leg of the Forbidden One
  ["92826944", 2], // Mezuki
  ["41470137", 2], // Gladiator Beast Bestiari
  ["96216229", 1], // Gladiator Beast War Chariot
  ["28297833", 2], // Necroface
  ["14943837", 3], // Debris Dragon
  ["73580471", 1], // Black Rose Dragon
  ["95503687", 2], // Lumina, Lightsworn Summoner
  ["511002631", 2], // Sangan
  ["27970830", 2], // Gateway of the Six
  ["48686504", 3], // Lonefire Blossom
  ["15341821", 2], // Dandylion
  ["16226796", 3], // Night Assailant (Pre-Errata)
  ["33420078", 2], // Plaguespreader Zombie
  ["50091196", 2], // Formula Synchron
  ["1475311", 3], // Allure of Darkness
  ["2295440", 2], // One for One
  ["32807846", 2], // Reinforcement of the Army
  ["213326", 1], // E - Emergency Call
  ["23434538", 0], // Maxx "C"
  ["43040603", 3], // Monster Gate
  ["58577036", 2], // Reasoning
  ["67169062", 2], // Pot of Avarice
  ["81439173", 2], // Foolish Burial
  ["46052429", 2], // Advanced Ritual Art
  ["14087893", 2], // Book of Moon
  ["48976825", 2], // Burial from a Different Dimension
  ["35059553", 1], // Kaiser Colosseum
  ["83986578", 1], // King Tiger Wanghu
  ["81674782", 1], // Dimensional Fissure
  ["67723438", 2], // Emergency Teleport
  ["73915051", 2], // Scapegoat
  ["3136426", 1], // Level Limit - Area B
  ["85742772", 1], // Gravity Bind
  ["44656491", 1], // Messenger of Peace
  ["27174286", 2], // Return from the Different Dimension
  ["30241314", 1], // Macro Cosmos
  ["44901281", 2], // Saber Hole
  ["57585212", 0], // Self-Destruct Button
  ["46652477", 3], // The Transmigration Prophecy
  ["64697231", 0], // Trap Dustshoot
  ["17078030", 0], // Wall of Revealing Light
  ["32723153", 0], // Magical Explosion
  ["84749824", 1], // Solemn Warning
  ["53334471", 1], // Gozen Match
  ["90846359", 1], // Rivalry of Warlords
  ["82732705", 1], // Skill Drain
  ["53567095", 2], // Icarus Attack
]);

const extraPrintEntries = new Map([
  [
    "511000824",
    ["511000825 1 --Ring of Destruction"], // Alternate art; aliases to the same card.
  ],
]);

const poolAdditions = [
  "3642509 3 --Elemental HERO Great Tornado",
  "1945387 3 --Elemental HERO Nova Master",
  "33574806 3 --Elemental HERO Escuridao",
  "62671448 1 --Toad Master",
];

module.exports = function buildLflist({ reduxRoot }) {
  const output = path.join(reduxRoot, "modded", "Redux-11.lflist.conf");

  copyFileInRedux({
    reduxRoot,
    source: path.join(reduxRoot, "vanilla", "2011-Redux.lflist.conf"),
    output,
  });

  const updatedPasscodes = new Map();
  let lflist = fs.readFileSync(output, "utf8");

  lflist = lflist.replace(/^#\[2011-Redux\]\r?\n!2011-Redux$/m, "#[Redux-11]\n!Redux-11");

  lflist = lflist.replace(/^(\d+) ([0-3])(\s+--.*)$/gm, (entry, passcode, _limit, comment) => {
    if (!limitChanges.has(passcode)) {
      return entry;
    }

    updatedPasscodes.set(passcode, (updatedPasscodes.get(passcode) ?? 0) + 1);

    return [
      `${passcode} ${limitChanges.get(passcode)}${comment}`,
      ...(extraPrintEntries.get(passcode) ?? []),
    ].join("\n");
  });

  const invalidPasscodes = [...limitChanges.keys()].filter(
    (passcode) => updatedPasscodes.get(passcode) !== 1,
  );
  if (invalidPasscodes.length > 0) {
    throw new Error(
      `Expected each LF-list card exactly once: ${invalidPasscodes.join(", ")}`,
    );
  }

  const duplicatePoolAdditions = poolAdditions
    .map((entry) => entry.match(/^(\d+) /)[1])
    .filter((passcode) => new RegExp(`^${passcode} [0-3] `, "m").test(lflist));
  if (duplicatePoolAdditions.length > 0) {
    throw new Error(
      `Expected Redux card-pool additions to be absent from baseline LF list: ${duplicatePoolAdditions.join(", ")}`,
    );
  }

  lflist = `${lflist.trimEnd()}\n${poolAdditions.join("\n")}\n`;

  fs.writeFileSync(output, lflist);
};
