const A=require('./index.js');
const K={latitude:26.5679,longitude:88.0847,timezone:'Asia/Kathmandu'};
const want=['Saturn','Jupiter','Rahu'];
function pos(ds){const r=A.calculateBirthChart({date:ds,time:'12:00',...K});
 const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
 return want.map(n=>{const p=pl.find(x=>x.name===n);return n+':'+p.signName+' '+p.degreeInSign.toFixed(1)+(p.retrograde?'R':'')}).join('  ');}
['2026-08-16','2026-12-01','2027-03-01','2027-07-01','2028-01-01','2028-07-01','2029-01-01','2029-07-01','2030-01-01','2030-07-01','2031-01-01','2031-07-01']
 .forEach(d=>console.log(d,pos(d)));
