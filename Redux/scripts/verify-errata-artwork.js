const fs = require("fs");
const path = require("path");

const { official, unofficial } = require("./redux-errata-passcodes");

module.exports = function verifyErrataArtwork({ reduxRoot }) {
  const assetsDir = path.join(reduxRoot, "assets", "pics");
  const missing = [];

  for (const id of [...official, ...unofficial]) {
    const imagePath = path.join(assetsDir, `${id}.jpg`);
    if (!fs.existsSync(imagePath)) {
      missing.push(id);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing Redux errata artwork in Redux/assets/pics/: ${missing.join(", ")}. ` +
        "Run: powershell -NoProfile -ExecutionPolicy Bypass -File Redux/scripts/render-card-image-text.ps1",
    );
  }
};
