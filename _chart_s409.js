const A=require('./index.js');
const TZ='Asia/Kathmandu';
const B={date:'2003-07-31',time:'22:02',latitude:28.2096,longitude:83.9856,timezone:TZ};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
console.log('LAGNA',L.signName,L.signNumber,L.degreeInSign.toFixed(2),L.nakshatra);
pl.forEach(p=>console.log('  ',p.name,p.signName,p.signNumber,p.degreeInSign.toFixed(2),'H'+(((p.signNumber-L.signNumber+12)%12)+1),p.nakshatra,'pada'+(p.nakshatraPada||p.pada||''),p.dignity,(p.retrograde?'R':''),(p.isCombust?'CMB':'')));
console.log('MOON',m.signName,m.degreeInSign.toFixed(2),m.nakshatra,'pada',(m.nakshatraPada||m.pada));

// sensitivity +/- 10 min
[-10,0,10].forEach(off=>{
 const [h,mi]=B.time.split(':').map(Number);let tot=h*60+mi+off;
 const b2={...B,time:String(Math.floor(tot/60)).padStart(2,'0')+':'+String(tot%60).padStart(2,'0')};
 const r2=A.calculateBirthChart(b2);const p2=Array.isArray(r2.planets)?r2.planets:Object.values(r2.planets);
 const mo=p2.find(p=>p.name==='Moon');
 console.log('SENS',off+'min',b2.time,'lagna',r2.lagna.signName,r2.lagna.degreeInSign.toFixed(2),'| Moon',mo.signName,mo.nakshatra);
});

// D9
const d9=A.calculateDivisionalChart(9,pl.map(p=>({name:p.name,signNumber:p.signNumber,degreeInSign:p.degreeInSign})),L.signNumber,L.degreeInSign);
console.log('=== D9 === lagna',d9.lagnaSign.name||d9.lagnaSign.signName,JSON.stringify(d9.lagnaSign));
d9.planets.forEach(p=>console.log('   D9',p.planet,p.vargaSignName,'H'+(((p.vargaSignNumber-d9.lagnaSign.number+12)%12)+1)));

// Manglik
try{console.log('MANGLIK',JSON.stringify(A.analyzeManglik(r)).slice(0,700));}catch(e){console.log('manglik err',e.message);}
try{console.log('KAALSARP',JSON.stringify(A.analyzeKaalSarp(r)).slice(0,300));}catch(e){}

// Dasha
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('2003-07-31T22:02:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-03');
console.log('=== MAHADASHAS ===');
d.mahaDashas.forEach(p=>console.log('  MD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
console.log('CURRENT MD',md.planet,(''+md.startDate).slice(0,10),'→',(''+md.endDate).slice(0,10));
md.subPeriods.forEach(p=>console.log('   AD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
console.log('CURRENT AD',ad.planet);
(ad.subPeriods||[]).forEach(p=>console.log('      PD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));
// next MD subperiods too
const nextIdx=d.mahaDashas.indexOf(md)+1;
if(d.mahaDashas[nextIdx]){const n=d.mahaDashas[nextIdx];console.log('NEXT MD',n.planet,(''+n.startDate).slice(0,10),'→',(''+n.endDate).slice(0,10));
 n.subPeriods.slice(0,5).forEach(p=>console.log('   nAD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));}
