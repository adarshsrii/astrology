// Self-check for the panchang sunrise/sunset + ayana fixes.  node panchang.check.js
const assert = require('assert');
const E = require('./index.js');
const W = d => new Date(d).toISOString().slice(11, 16);   // engine convention: UTC fields = local wall clock
const mins = d => { const [h, m] = W(d).split(':').map(Number); return h * 60 + m; };

const CASES = [
  // city,        lat,      lon,      tz,               sunrise, sunset  (Swiss Ephemeris reference)
  ['Kathmandu', 27.7172,  85.3240, 'Asia/Kathmandu',   '05:46', '18:14'],
  ['Delhi',     28.6139,  77.2090, 'Asia/Kolkata',     '06:03', '18:32'],
  ['London',    51.5074,  -0.1278, 'Europe/London',    '06:27', '19:26'],
];

for (const [city, lat, lon, tz, wantRise, wantSet] of CASES) {
  const p = E.calculatePanchang(new Date('2026-09-10T00:00:00Z'), lat, lon, tz, city);

  // 1. a day cannot be negative, and cannot be absurd
  assert.ok(p.dinamana.hours > 0, `${city}: dinamana must be positive, got ${p.dinamana.hours}h`);
  assert.ok(p.dinamana.hours >= 6 && p.dinamana.hours <= 18, `${city}: dinamana ${p.dinamana.hours}h out of range`);

  // 2. day + night = 24h
  const total = p.dinamana.hours * 60 + p.dinamana.minutes + p.ratrimana.hours * 60 + p.ratrimana.minutes;
  assert.ok(Math.abs(total - 1440) <= 1, `${city}: day+night = ${total}min, expected 1440`);

  // 3. sunrise before sunset
  assert.ok(mins(p.sunrise) < mins(p.sunset), `${city}: sunrise ${W(p.sunrise)} not before sunset ${W(p.sunset)}`);

  // 4. within 3 minutes of the ephemeris reference
  for (const [label, got, want] of [['sunrise', p.sunrise, wantRise], ['sunset', p.sunset, wantSet]]) {
    const [wh, wm] = want.split(':').map(Number);
    const drift = Math.abs(mins(got) - (wh * 60 + wm));
    assert.ok(drift <= 3, `${city} ${label}: got ${W(got)}, expected ~${want} (off by ${drift}min)`);
  }
}

// 5. ayana turns at the solstices, not at 0/180
const ay = (m, d) => E.calculatePanchang(new Date(`2026-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}T00:00:00Z`),
                                          27.7172, 85.3240, 'Asia/Kathmandu', 'KTM').ayana.drik;
assert.equal(ay(9, 10), 'Dakshinayana', 'Sept (sidereal Leo) is Dakshinayana — the old 0/180 split said Uttarayana');
assert.equal(ay(2, 10), 'Uttarayana',   'Feb is Uttarayana');
assert.equal(ay(6, 10), 'Uttarayana',    'mid-June is still Uttarayana — it runs to Karka Sankranti');
assert.equal(ay(1,  1), 'Dakshinayana', 'early Jan, before Makara Sankranti');
assert.equal(ay(1, 16), 'Uttarayana',   'after Makara Sankranti (~14 Jan) Uttarayana begins');
assert.equal(ay(7, 16), 'Dakshinayana', 'after Karka Sankranti (~16 Jul) Dakshinayana begins');

console.log('panchang.check.js — all assertions passed');
