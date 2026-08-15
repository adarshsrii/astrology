const A=require('./index.js');
const at=(iso)=>{const r=A.calculateBirthChart({date:iso,time:'12:00',latitude:-28.33,longitude:153.40,timezone:'Australia/Sydney'});
 const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
 const g={};pl.forEach(p=>g[p.name]={sign:p.signName,deg:p.degreeInSign,retro:!!p.retrograde});return g;};
const NOW=at('2026-08-07');
console.log('TRANSITS on 2026-08-07 (sidereal):');
['Saturn','Jupiter','Rahu','Ketu'].forEach(n=>console.log('  ',n.padEnd(8),NOW[n].sign.padEnd(12),NOW[n].deg.toFixed(2),NOW[n].retro?'R':''));
// scan for ingresses
const start=new Date('2026-08-01'), end=new Date('2030-06-01');
const track=['Saturn','Jupiter','Rahu','Ketu'];
let prev=null, prevD=null;
console.log('\nINGRESSES 2026-08 to 2030-06:');
for(let d=new Date(start); d<end; d.setDate(d.getDate()+1)){
 const iso=d.toISOString().slice(0,10);
 const g=at(iso);
 if(prev){ track.forEach(n=>{ if(g[n].sign!==prev[n].sign){
   console.log('  '+iso, n.padEnd(8), prev[n].sign+' -> '+g[n].sign, g[n].retro?'(retrograde)':'');
 }});}
 prev=g;
}
