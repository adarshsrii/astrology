// Self-check for Nepali ('ne') output.  node nepali-localization.check.js
//
// 73% of this app's users are in Nepal. Before this check existed, lang 'ne'
// silently returned ENGLISH from the panchang and English yoga descriptions,
// because 'ne' had no tables and fell through the `lang === 'hi'` branch.
// This asserts that it cannot happen again — it is deliberately pointed at the
// COMPILED dist, because index.rn.js loads dist/ and a TypeScript-only change
// reaches no user.
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const E = require('./index.rn.js');

const DEVANAGARI = /[ऀ-ॿ]/;

// ── 1. Panchang must come back in Devanagari for 'ne', not English ──────────

const KTM = ['1992-05-03', 27.7172, 85.3240, 'Asia/Kathmandu'];
const en = E.calculateFullPanchang(...KTM, 'en');
const hi = E.calculateFullPanchang(...KTM, 'hi');
const ne = E.calculateFullPanchang(...KTM, 'ne');

const FIELDS = [
  ['tithi',     p => p.tithi[0].name],
  ['nakshatra', p => p.nakshatra[0].name],
  ['yoga',      p => p.yoga[0].name],
  ['vara',      p => p.vara.name],
  // same `localized` branch — if these regress, so has the whole panchang
  ['karana',    p => p.karana[0].name],
  ['moonSign',  p => p.moonSign.name],
  ['paksha',    p => p.paksha],
  ['hinduMonth',p => p.hinduMonth],
];

for (const [label, get] of FIELDS) {
  const neVal = get(ne);
  const enVal = get(en);
  assert.ok(DEVANAGARI.test(neVal), `ne ${label} must be Devanagari, got "${neVal}"`);
  assert.notEqual(neVal, enVal, `ne ${label} is still the English string "${enVal}"`);
}

// ── 2. Nepali must be NEPALI, not the Hindi table copied wholesale ──────────
// Weekdays are the clearest real difference: Hindi -वार vs Nepali -बार, and
// Sunday is आइतबार, not रविवार. A bulk copy of the Hindi table passes test 1
// and fails here, which is the point.
assert.equal(hi.vara.name, 'रविवार',   'hi weekday regressed');
assert.equal(ne.vara.name, 'आइतबार',  `ne weekday must be Nepali आइतबार, got "${ne.vara.name}"`);
assert.ok(!/वार$/.test(ne.vara.name), 'ne weekday uses the Hindi -वार ending');

// ── 3. 'en' and 'hi' must be untouched ─────────────────────────────────────
assert.equal(en.tithi[0].name, 'Shukla Pratipada', 'en tithi regressed');
assert.equal(en.vara.name, 'Sunday', 'en weekday regressed');
assert.equal(hi.tithi[0].name, 'शुक्ल प्रतिपदा', 'hi tithi regressed');
// an unrecognised lang must still fall through to English, as it always did
assert.equal(E.calculateFullPanchang(...KTM, 'fr').vara.name, 'Sunday',
  'an unknown lang must still fall through to English');

// ── 4. Every yoga entry carries a non-empty nameNe + descriptionNe ─────────
// Read the COMPILED file so unreached yoga branches are covered too — running
// one chart only exercises the handful of yogas that chart happens to form.
const compiled = fs.readFileSync(
  path.join(__dirname, 'dist/panchang/src/birthchart/analysis/yogas.js'), 'utf8');
const count = k => (compiled.match(new RegExp('\\b' + k + ':', 'g')) || []).length;
const hiNames = count('nameHi'), neNames = count('nameNe');
const hiDescs = count('descriptionHi'), neDescs = count('descriptionNe');
assert.ok(hiNames > 0, 'no yoga entries found — did dist get rebuilt?');
assert.equal(neNames, hiNames, `${hiNames} yogas have nameHi but only ${neNames} have nameNe`);
assert.equal(neDescs, hiDescs, `${hiDescs} yogas have descriptionHi but only ${neDescs} have descriptionNe`);
assert.ok(!/nameNe:\s*(''|""|``)/.test(compiled), 'a yoga has an empty nameNe');
assert.ok(!/descriptionNe:\s*(''|""|``)/.test(compiled), 'a yoga has an empty descriptionNe');

// ── 5. …and they are real Nepali at runtime, on a chart that forms yogas ───
const chart = E.calculateBirthChart({
  date: '1992-05-03', time: '22:05', latitude: 27.7172, longitude: 85.3240,
  timezone: 'Asia/Kathmandu',
});
const { yogas } = E.detectYogas(chart.planets, chart.houses, chart.lagna.signNumber);
assert.ok(yogas.length > 0, 'fixture chart formed no yogas — pick another chart');
for (const y of yogas) {
  assert.ok(y.nameNe && DEVANAGARI.test(y.nameNe),
    `yoga "${y.name}" has no Nepali name (got "${y.nameNe}")`);
  assert.ok(y.descriptionNe && DEVANAGARI.test(y.descriptionNe),
    `yoga "${y.name}" has no Nepali description`);
  assert.notEqual(y.descriptionNe, y.description,
    `yoga "${y.name}" descriptionNe is still the English text`);
  // Nepali prose ends छ/छन्/हुन्छ, not Hindi है/हैं. A Hindi paste fails here.
  assert.ok(!/\sहै।|\sहैं।|\sहोता है/.test(y.descriptionNe),
    `yoga "${y.name}" descriptionNe reads as Hindi (है/हैं), not Nepali`);
}

// ── 6. No Latin letter may reach a localized yoga string ───────────────────
// Yoga names and descriptions interpolate a planet, and they used to splice the
// raw ENGLISH name into Devanagari prose — "राजयोग (Jupiter-Mars परिवर्तन)".
// Asserting "no Latin letter" rather than listing nine planet names is both
// simpler and stronger: it catches ANY future interpolation of ANY English
// word, not only the ones we already know about. This chart is chosen because
// it forms several yogas through the interpolating branches.
const LATIN = /[A-Za-z]/;
const interp = E.calculateBirthChart({
  date: '1992-05-03', time: '22:05', latitude: 25.99, longitude: 79.45,
  timezone: 'Asia/Kolkata',
});
const iy = E.detectYogas(interp.planets, interp.houses, interp.lagna.signNumber).yogas;
assert.ok(iy.length >= 3, `fixture chart formed only ${iy.length} yogas — pick another`);
assert.ok(iy.some(y => y.name.includes('(')),
  'fixture chart formed no interpolating yoga — this check would prove nothing');
for (const y of iy) {
  for (const f of ['nameHi', 'nameNe', 'descriptionHi', 'descriptionNe']) {
    assert.ok(!LATIN.test(y[f]),
      `${f} of "${y.name}" leaks English into Devanagari: "${y[f]}"`);
  }
}
// the English `name` is the dedupe key and the hasGajakesariYoga matcher — it
// must stay English, so guard against "fixing" it too
assert.ok(iy.every(y => LATIN.test(y.name)), 'the English yoga name must stay English');

// ── 7. The graha map is exported and falls back, not undefined ─────────────
assert.equal(E.grahaName('Mars', 'hi'), 'मंगल', 'grahaName hi regressed');
assert.equal(E.grahaName('Mars', 'ne'), 'मंगल', 'grahaName ne regressed');
assert.equal(E.grahaName('Ketu', 'ne'), 'केतु', 'Ketu must be covered');
assert.equal(E.grahaName('Rahu', 'hi'), 'राहु', 'Rahu must be covered');
for (const g of ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu']) {
  for (const l of ['hi','ne']) {
    assert.ok(E.grahaName(g, l) && !LATIN.test(E.grahaName(g, l)), `${g}/${l} not mapped`);
  }
}
assert.equal(E.grahaName('Sun', 'en'), 'Sun', 'en must pass the English name through');
assert.equal(E.grahaName('Chiron', 'ne'), 'Chiron',
  'an unknown graha must fall back to the English name, never undefined');

console.log(`nepali-localization.check.js — all assertions passed (${hiNames} yogas, ${yogas.length} + ${iy.length} formed on the two fixture charts)`);
