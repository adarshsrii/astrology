const A=require('./index.js');
const B={date:'1991-09-27',latitude:21.2514,longitude:81.6296,timezone:'Asia/Kolkata'};
// how much does the day-long uncertainty move things?
['00:01','06:00','12:00','18:00','23:59'].forEach(t=>{
 const r=A.calculateBirthChart({...B,time:t});
 const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
 const mo=pl.find(p=>p.name==='Moon');
 let nak=mo.nakshatra; if(nak==='Mula')nak='Moola';
 const d=A.calculateVimshottariDasha(new Date('1991-09-27T'+t+':00+05:30'),nak,(mo.longitude%13.3333333),3);
 const T=new Date('2026-08-06');
 const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
 const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
 console.log(t,'lagna',r.lagna.signName.padEnd(11),'Moon',mo.signName.padEnd(9),mo.nakshatra.padEnd(13),mo.degreeInSign.toFixed(1),
  '| MD',md.planet.padEnd(7),(''+md.startDate).slice(0,10),'->',(''+md.endDate).slice(0,10),'| AD',ad.planet);
});
console.log('\n--- non-Moon planets (stable all day, noon values) ---');
const r=A.calculateBirthChart({...B,time:'12:00'});
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
pl.forEach(p=>console.log('  ',p.name.padEnd(8),p.signName.padEnd(11),p.degreeInSign.toFixed(2).padStart(6),p.nakshatra.padEnd(14),p.dignity,(p.retrograde?'R':''),(p.isCombust?'CMB':'')));
