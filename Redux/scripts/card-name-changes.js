// Passcodes whose printed card title should be re-rendered on Redux card images.
// Only list cards where Redux intentionally changes the display name in .cdb.
// Errata-only cards that keep the same title (including pre-errata prints) stay off this list.
module.exports = new Set([
  68638985, // Frog the Jam (was Slime Toad / FROG THE JAM)
  73262676, // Alien "A" Cell Scatter Burst
  97697678, // Alien Mothership Musk'I
  96875080, // Alien Orbital Bombardment
  24082387, // Alien Crop Circles
  21768554, // Alien Mass Hypnosis
  53291093, // Alien Mysterious Triangle
  60946968, // Alien Otherworld - The "A" Zone
  39163598, // Alien Planet Pollutant Virus
  51192573, // Alien Cosmic Horror Gangi'el
]);
