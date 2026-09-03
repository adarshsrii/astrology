#!/usr/bin/env node
// Self-check for the two Ashtakoot fixes. Assert-based, no framework.
// Both blocks FAIL against the pre-fix code, which is the point.
const fs = require('fs');
const src = fs.readFileSync(__dirname + '/ashtakoot.ts', 'utf8');
let fail = 0;
const ok = (c, m) => { if (!c) { console.log('FAIL ' + m); fail++; } };

// ---- Bhakoot: inclusive count ----
const m = src.match(/const diff = \(\(groom\.rashiNumber - bride\.rashiNumber \+ 12\) % 12\)([^;]*);/);
ok(!!m, 'bhakoot diff line present');
// Read the real expression out of the source and run THAT, so this fails if the
// file reverts. Reimplementing the fixed formula here would pass either way.
const tail = m ? m[1].trim() : '';
ok(tail === '+ 1', "bhakoot must use inclusive '+ 1', found '" + tail + "'");
const bhakoot = new Function('g', 'b',
  'const diff = ((g - b + 12) % 12) ' + tail + ';' +
  'return new Set([2,5,6,8,9,12]).has(diff) ? 0 : 7;');
ok(bhakoot(5,5) === 7,  'same rashi is NOT a Bhakoot dosha (old code scored 0)');
ok(bhakoot(6,5) === 0,  '2-12 pair IS a dosha (old code scored 7)');
ok(bhakoot(5,6) === 0,  '2-12 the other way round is a dosha');
ok(bhakoot(9,5) === 0,  '5-9 pair is a dosha');
ok(bhakoot(10,5) === 0, '6-8 pair is a dosha');
ok(bhakoot(8,5) === 7,  '4-10 is clean');
ok(bhakoot(7,5) === 7,  '3-11 is clean');

// ---- Nadi: middle nine mirror, they do not repeat ----
const nadi = JSON.parse('[' + src.split('const NAKSHATRA_NADI: number[] = [')[1]
  .split('];')[0].replace(/\/\*[^*]*\*\//g, '').replace(/\s/g, '').replace(/,$/, '') + ']');
ok(nadi.length === 27, 'nadi table has 27 entries');
const CLASSICAL = [0,1,2,2,1,0,0,1,2, 2,1,0,0,1,2,2,1,0, 0,1,2,2,1,0,0,1,2];
CLASSICAL.forEach((v, i) => ok(nadi[i] === v, 'nadi[' + (i+1) + '] should be ' + v + ', got ' + nadi[i]));
ok(!(nadi.slice(0,9).join('') === nadi.slice(9,18).join('')),
   'middle nine must NOT repeat the first nine (that was the bug)');
// the pairs that were inverted
ok(nadi[9]  === 2, 'Magha is Antya');
ok(nadi[12] === 0, 'Hasta is Adi');
ok(nadi[17] === 0, 'Jyeshtha is Adi');

console.log(fail ? '\n' + fail + ' FAILED' : 'all ashtakoot checks pass');
process.exit(fail ? 1 : 0);
