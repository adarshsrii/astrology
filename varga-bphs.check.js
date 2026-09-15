/**
 * Divisional-chart start rasis, checked against Brihat Parashara Hora Shastra Ch. 6.
 * Runs against dist/ — the bundle the phone loads — so a source-only fix still fails.
 *
 * WHY THIS EXISTS. D16, D20 and D45 keyed their start rasi on the sign's ELEMENT
 * (period 4). BPHS keys all three on MODALITY (period 3). The two coincide only for
 * Aries..Cancer, so every planet in the eight signs Leo..Pisces landed in the wrong
 * varga sign — 8 of 12 signs wrong in each of the three charts.
 *
 *   v16 Shodashamsa  "Starting from Mesh for a Movable Rasi, from Simh for a Fixed
 *                     Rasi and from Dhanu for a Dual Rasi"
 *   v17 Vimshamsa    "From Mesh for a Movable Rasi, from Dhanu for a Fixed Rasi and
 *                     from Simh for a Common Rasi"          <- note: NOT the same order
 *   v31 Akshavedamsa "Mesh, Simh and Dhanu ... for Movable, Immovable and Common"
 *
 * ponytail: asserts the START rasi only (planet at 0 deg of each sign). The
 * part-index arithmetic is shared by every varga and is covered by the others passing.
 */
const assert = require('assert');
const { calculateDivisionalChart } = require('./dist/panchang/src/birthchart/divisional/calculator');

const norm = (s) => (((s - 1) % 12) + 12) % 12 + 1;
const modality = (s) => (s - 1) % 3;            // 0 movable, 1 fixed, 2 dual
const start = (s, table) => norm(table[modality(s)]);

const CASES = [
  { d: 16, table: [1, 5, 9], sloka: 'v16' },
  { d: 20, table: [1, 9, 5], sloka: 'v17' },
  { d: 45, table: [1, 5, 9], sloka: 'v31' },
];

for (const { d, table, sloka } of CASES) {
  for (let sign = 1; sign <= 12; sign++) {
    const got = calculateDivisionalChart(
      d, [{ name: 'X', signNumber: sign, degreeInSign: 0 }], 1, 0,
    ).planets[0].vargaSignNumber;
    const want = start(sign, table);
    assert.strictEqual(
      got, want,
      `D${d} (BPHS Ch.6 ${sloka}): a planet at 0 deg of sign ${sign} must start in sign ` +
      `${want}, got ${got}. The start rasi must key on MODALITY, not element — and REBUILD dist.`,
    );
  }
  console.log(`ok  D${d} start rasi matches BPHS Ch.6 ${sloka} for all 12 signs`);
}

// The nodes are NOT forced opposite in the vargas, and that is correct, not a bug:
// nothing in BPHS Ch.6 carves out Rahu/Ketu, and a start rule of period 2 or 3 is
// unchanged by the 6 signs between them. Pinned so nobody "fixes" it into Rahu+6.
const nodes = calculateDivisionalChart(24, [
  { name: 'Rahu', signNumber: 9, degreeInSign: 9.51 },
  { name: 'Ketu', signNumber: 3, degreeInSign: 9.51 },
], 1, 0).planets;
assert.strictEqual(
  nodes[0].vargaSignNumber, nodes[1].vargaSignNumber,
  'D24: with an odd/even start rule the nodes legitimately share a varga sign. ' +
  'If this changed, someone forced Ketu = Rahu + 6, which BPHS does not say.',
);
console.log('ok  nodes are left to the ordinary varga rules (BPHS carves out no exception)');

console.log('\nAll checks passed.');
