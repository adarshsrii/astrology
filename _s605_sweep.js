const A=require('./index.js');
const base={date:'1995-09-03',latitude:26.5448,longitude:88.0895,timezone:'Asia/Kathmandu'};
const mk=(h,mi)=>A.calculateBirthChart({...base,time:String(h).padStart(2,'0')+':'+String(mi).padStart(2,'0')});
console.log('=== SWEEP: when does LAGNA flip, when does MOON enter Dhanu ===');
for(let mi=0;mi<=75;mi+=5){
  const t=15*60+0+mi; const h=Math.floor(t/60), m2=t%60;
  const r=mk(h,m2);
  const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
  const mo=pl.find(p=>p.name==='Moon');
  const d9=A.calculateDivisionalChart(9,pl,r.lagna.signNumber,r.lagna.degreeInSign);
  const d9l=d9&&(d9.lagnaSign||d9.lagna||d9.ascendant);
  console.log(' ',String(h).padStart(2,'0')+':'+String(m2).padStart(2,'0'),
    '| lagna',r.lagna.signName.padEnd(11),r.lagna.degreeInSign.toFixed(2).padStart(5),
    '| moon',mo.signName.padEnd(11),mo.degreeInSign.toFixed(2).padStart(5),mo.nakshatra.padEnd(8),
    '| D9lag',typeof d9l==='object'?JSON.stringify(d9l).slice(0,40):d9l);
}
console.log('\n=== D9 object shape at 15:30 ===');
const r=mk(15,30); const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const d9=A.calculateDivisionalChart(9,pl,r.lagna.signNumber,r.lagna.degreeInSign);
console.log(JSON.stringify(d9,null,1).slice(0,1200));
