#!/usr/bin/env node
// Self-check for the two Ashtakoot fixes. Assert-based, no framework.
// Both blocks FAIL against the pre-fix code, which is the point.
const fs = require('fs');
const src = fs.readFileSync(__dirname + '/ashtakoot.ts', 'utf8');
let fail = 0;
const ok = (c, m) => { if (!c) { console.log('FAIL ' + m); fail++; } };

// A missing table must FAIL, not throw — a crash here hides every later check.
const numTable = (marker) => {
  const part = src.split(marker)[1];
  if (!part) { ok(false, 'table missing from source: ' + marker); return []; }
  return JSON.parse('[' + part.split('];')[0]
    .replace(/\/\*[^*]*\*\//g, '').replace(/\s/g, '').replace(/,$/, '') + ']');
};
const strTable = (marker) => {
  const part = src.split(marker)[1];
  if (!part) { ok(false, 'table missing from source: ' + marker); return []; }
  return (part.split('];')[0].replace(/\/\*[^*]*\*\//g, '').match(/'([A-Za-z]+)'/g) || [])
    .map(x => x.replace(/'/g, ''));
};

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
const nadi = numTable('const NAKSHATRA_NADI: number[] = [');
ok(nadi.length === 27, 'nadi table has 27 entries');
const CLASSICAL = [0,1,2,2,1,0,0,1,2, 2,1,0,0,1,2,2,1,0, 0,1,2,2,1,0,0,1,2];
CLASSICAL.forEach((v, i) => ok(nadi[i] === v, 'nadi[' + (i+1) + '] should be ' + v + ', got ' + nadi[i]));
ok(!(nadi.slice(0,9).join('') === nadi.slice(9,18).join('')),
   'middle nine must NOT repeat the first nine (that was the bug)');
// the pairs that were inverted
ok(nadi[9]  === 2, 'Magha is Antya');
ok(nadi[12] === 0, 'Hasta is Adi');
ok(nadi[17] === 0, 'Jyeshtha is Adi');

// ---- Gana: Swati is Deva, Jyeshtha is Rakshasa (they were swapped) ----
const gana = numTable('const NAKSHATRA_GANA: number[] = [');
ok(gana.length === 27, 'gana table has 27 entries');
// 0=Deva 1=Manushya 2=Rakshasa
const GANA_CLASSICAL = [0,1,2,1,0,1,0,0,2, 2,1,1,0,2,0,2,0,2, 2,1,1,0,2,2,1,1,0];
GANA_CLASSICAL.forEach((v, i) => ok(gana[i] === v, 'gana[' + (i+1) + '] should be ' + v + ', got ' + gana[i]));
ok(gana[14] === 0, 'Swati is Deva (old code had it Rakshasa)');
ok(gana[17] === 2, 'Jyeshtha is Rakshasa (old code had it Deva)');

// ---- Varna is read from the RASHI, not the nakshatra ----
ok(/const gv = RASHI_VARNA\[groom\.rashiNumber - 1\]/.test(src),
   'calcVarna must index RASHI_VARNA by rashiNumber (old code used NAKSHATRA_VARNA)');
ok(!/NAKSHATRA_VARNA/.test(src), 'the nakshatra varna table must be gone, not left to be re-used');
const rvarna = numTable('const RASHI_VARNA: number[] = [');
// Brahmin 3: Karka/Vrischik/Meen · Kshatriya 2: Mesh/Simha/Dhanu
// Vaishya 1: Vrishabh/Kanya/Makar · Shudra 0: Mithun/Tula/Kumbha
[[4,3],[8,3],[12,3],[1,2],[5,2],[9,2],[2,1],[6,1],[10,1],[3,0],[7,0],[11,0]]
  .forEach(([rashi, v]) => ok(rvarna[rashi-1] === v,
    'RASHI_VARNA rashi ' + rashi + ' should be ' + v + ', got ' + rvarna[rashi-1]));
// the real pair that scored wrong: groom Kumbha (Shudra 0) vs bride Kanya (Vaishya 1)
ok((rvarna[10] >= rvarna[5] ? 1 : 0) === 0,
   'Kumbha groom / Kanya bride is 0 of 1 (engine used to hand out a free point)');

// ---- Graha Maitri compares RASHI lords, not nakshatra lords ----
ok(/const gl = RASHI_LORD\[groom\.rashiNumber - 1\]/.test(src),
   'calcGrahaMaitri must use RASHI_LORD (old code used nakshatraLord)');
ok(!/const gl = groom\.nakshatraLord/.test(src), 'nakshatraLord must no longer drive Graha Maitri');
const lords = strTable('const RASHI_LORD: string[] = [');
ok(lords.length === 12, 'RASHI_LORD has 12 entries');
[[1,'Mars'],[2,'Venus'],[3,'Mercury'],[4,'Moon'],[5,'Sun'],[6,'Mercury'],
 [7,'Venus'],[8,'Mars'],[9,'Jupiter'],[10,'Saturn'],[11,'Saturn'],[12,'Jupiter']]
  .forEach(([r, l]) => ok(lords[r-1] === l,
    'RASHI_LORD rashi ' + r + ' should be ' + l + ', got ' + lords[r-1]));
// the live pair this was found on: Makar Moon (Saturn) vs Tula Moon (Venus), mutual friends
ok(lords[9] === 'Saturn' && lords[6] === 'Venus',
   'Makar/Tula resolve to Saturn/Venus, who are mutual friends = full 5');


// ---- dist must not drift from source ----
// The app (index.rn.js) requires dist/, not the .ts. Bhakoot was fixed in source
// months ago and dist still carried the old `|| 12`, so every app user kept the
// bug. Rebuild with: npx tsc --outDir dist --rootDir . --declaration --skipLibCheck \
//   --module commonjs --target ES2020 --esModuleInterop --resolveJsonModule \
//   panchang/src/birthchart/analysis/ashtakoot.ts
const distPath = __dirname + '/../../../../dist/panchang/src/birthchart/analysis/ashtakoot.js';
if (!fs.existsSync(distPath)) {
  ok(false, 'dist build missing at ' + distPath);
} else {
  const d = fs.readFileSync(distPath, 'utf8');
  ok(/const diff = \(\(groom\.rashiNumber - bride\.rashiNumber \+ 12\) % 12\) \+ 1;/.test(d),
     'dist calcBhakoot must carry the inclusive +1 (dist was stale and shipped the old bug)');
  ok(/RASHI_VARNA\[groom\.rashiNumber - 1\]/.test(d), 'dist calcVarna must use RASHI_VARNA');
  ok(/RASHI_LORD\[groom\.rashiNumber - 1\]/.test(d), 'dist calcGrahaMaitri must use RASHI_LORD');
  const dg = (d.split('NAKSHATRA_GANA = [')[1] || '').split('];')[0]
    .replace(/\/\*[^*]*\*\//g, '').replace(/\s/g, '').split(',').filter(x => x !== '');
  ok(dg[14] === '0' && dg[17] === '2', 'dist Gana must have Swati Deva / Jyeshtha Rakshasa');
}


console.log(fail ? '\n' + fail + ' FAILED' : 'all ashtakoot checks pass');
process.exit(fail ? 1 : 0);
