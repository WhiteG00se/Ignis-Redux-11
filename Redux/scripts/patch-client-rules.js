const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
const clientPath = path.join(repoRoot, "Ignis-Redux-11.exe");

const masterRule1Param = 0x000d0700;
const redux11Param = 0x000d0500;
const redux11ForbiddenTypes = 0x05000000;
const expectedMasterRule1References = 7;

function uint32le(value) {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32LE(value);
  return buffer;
}

function findOffsets(binary, needle) {
  const offsets = [];
  let from = 0;
  while (true) {
    const offset = binary.indexOf(needle, from);
    if (offset === -1) {
      return offsets;
    }
    offsets.push(offset);
    from = offset + needle.length;
  }
}

function replaceExactCount(binary, original, replacement, expectedCount, description) {
  const offsets = findOffsets(binary, original);
  if (offsets.length !== expectedCount) {
    throw new Error(
      `Expected ${expectedCount} ${description} occurrence(s), found ${offsets.length}. ` +
        "Recheck the upstream client before applying Redux rules.",
    );
  }
  for (const offset of offsets) {
    replacement.copy(binary, offset);
  }
}

function findTextCodeCave(binary, requiredBytes) {
  const peOffset = binary.readUInt32LE(0x3c);
  const sectionCount = binary.readUInt16LE(peOffset + 6);
  const optionalHeaderSize = binary.readUInt16LE(peOffset + 20);
  const sectionsOffset = peOffset + 24 + optionalHeaderSize;

  for (let index = 0; index < sectionCount; index += 1) {
    const sectionOffset = sectionsOffset + index * 40;
    const name = binary
      .subarray(sectionOffset, sectionOffset + 8)
      .toString("ascii")
      .replace(/\0.*$/, "");
    if (name !== ".text") {
      continue;
    }

    const rawSize = binary.readUInt32LE(sectionOffset + 16);
    const rawOffset = binary.readUInt32LE(sectionOffset + 20);
    let runStart = -1;
    for (let offset = rawOffset; offset < rawOffset + rawSize; offset += 1) {
      if (binary[offset] === 0xcc) {
        if (runStart === -1) {
          runStart = offset;
        }
      } else {
        if (runStart !== -1 && offset - runStart >= requiredBytes) {
          return runStart;
        }
        runStart = -1;
      }
    }
  }

  throw new Error("Could not find executable padding for the Redux-11 default rule patch.");
}

function patchDefaultForbiddenTypes(binary) {
  const original = Buffer.from("898f8c000000898fac000000", "hex");
  const offsets = findOffsets(binary, original);
  if (offsets.length !== 1) {
    throw new Error(
      `Expected one default forbidden-types initializer, found ${offsets.length}. ` +
        "Recheck the upstream client before applying Redux rules.",
    );
  }

  // Call a tiny routine from padding because the original zero write is shorter
  // than a write of the MR1 forbidden-type constant.
  const injected = Buffer.alloc(11);
  injected[0] = 0xc7;
  injected[1] = 0x87;
  injected.writeUInt32LE(0x8c, 2);
  injected.writeUInt32LE(redux11ForbiddenTypes, 6);
  injected[10] = 0xc3;

  const callOffset = offsets[0];
  const injectedOffset = findTextCodeCave(binary, injected.length);
  injected.copy(binary, injectedOffset);

  const call = Buffer.alloc(6, 0x90);
  call[0] = 0xe8;
  call.writeInt32LE(injectedOffset - (callOffset + 5), 1);
  call.copy(binary, callOffset);
}

function patchClientBinary(binary) {
  replaceExactCount(
    binary,
    uint32le(masterRule1Param),
    uint32le(redux11Param),
    expectedMasterRule1References,
    "Master Rule 1 parameter",
  );

  replaceExactCount(
    binary,
    Buffer.from("c7878000000000e80200c78790000000b4000000", "hex"),
    Buffer.from("c7878000000000050d00c78790000000b4000000", "hex"),
    1,
    "first-run duel-parameter initializer",
  );

  patchDefaultForbiddenTypes(binary);
}

function patchClientFile(target = clientPath) {
  const binary = fs.readFileSync(target);
  patchClientBinary(binary);
  fs.writeFileSync(target, binary);
}

if (require.main === module) {
  patchClientFile();
  console.log("Patched client default duel preset as Redux-11.");
}

module.exports = {
  patchClientBinary,
  patchClientFile,
};
