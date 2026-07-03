const path = require("path");

const buildCardsDb = require("./build-cards-cdb");
const buildCardsUnofficialDb = require("./build-cards-unofficial-cdb");
const buildLflist = require("./build-lflist");
const verifyErrataArtwork = require("./verify-errata-artwork");
const { cleanDirectory } = require("./utils");

const reduxRoot = path.resolve(__dirname, "..");
const moddedDir = path.join(reduxRoot, "modded");

const buildTargets = [
  buildLflist,
  buildCardsDb,
  buildCardsUnofficialDb,
];

cleanDirectory(reduxRoot, moddedDir);

for (const buildTarget of buildTargets) {
  buildTarget({ reduxRoot });
}

verifyErrataArtwork({ reduxRoot });

console.log(`Built ${buildTargets.length} Redux target(s) into ${moddedDir}`);
