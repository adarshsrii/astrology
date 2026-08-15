const A=require('./index.js');
const B={date:'2000-07-25',time:'04:45',latitude:28.2333,longitude:83.6833,timezone:'Asia/Kathmandu'};
const ISO='2000-07-25T04:45:00+05:45';
[-15,-10,0,10,15].forEach(off=>{
 const [h,mi]=B.time.split(':').map(Number);let tot=h*60+mi+off;
 const tt=String(Math.floor(tot/60)).padStart(2,'0')+':'+String(tot%60).padStart(2,'0');
 const r=A.calculateBirthChart({...B,time:tt});
 const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
 const mo=pl.find(p=>p.name==='Moon');
 console.log('SENS',String(off).padStart(3)+'min',tt,'lagna',r.lagna.signName.padEnd(11),r.lagna.degreeInSign.toFixed(2).padStart(6),'| Moon',mo.signName.padEnd(8),mo.nakshatra,'pada'+(mo.nakshatraPada||mo.pada));
});
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
console.log('\n===== LAGNA '+L.signName+'('+L.signNumber+') '+L.degreeInSign.toFixed(2)+' '+L.nakshatra);
pl.forEach(p=>console.log('  ',p.name.padEnd(8),p.signName.padEnd(11),p.degreeInSign.toFixed(2).padStart(6),'H'+(((p.signNumber-L.signNumber+12)%12)+1),p.nakshatra.padEnd(15),'pada'+(p.nakshatraPada||p.pada||''),p.dignity,(p.retrograde?'R':''),(p.isCombust?'CMB':'')));
console.log('\nHOUSES');
for(let i=0;i<12;i++){const sn=((L.signNumber-1+i)%12)+1;
 console.log('  H'+(i+1),sn,pl.filter(p=>p.signNumber===sn).map(p=>p.name).join(','));}
const d9=A.calculateDivisionalChart(9,pl.map(p=>({name:p.name,signNumber:p.signNumber,degreeInSign:p.degreeInSign})),L.signNumber,L.degreeInSign);
console.log('\nD9 lagna',d9.lagnaSign.name);
try{const y=A.detectYogas(r); console.log('YOGAS',JSON.stringify(y).slice(0,900));}catch(e){console.log('yoga err',e.message);}
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date(ISO),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-06');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
console.log('\n MD '+md.planet+' '+(''+md.startDate).slice(0,10)+' -> '+(''+md.endDate).slice(0,10));
md.subPeriods.forEach(p=>console.log('   AD',p.planet.padEnd(8),(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10)));
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
console.log('   CUR AD',ad.planet);
(ad.subPeriods||[]).forEach(q=>console.log('        PD',q.planet.padEnd(8),(''+q.startDate).slice(0,10),'->',(''+q.endDate).slice(0,10)));
const ni=d.mahaDashas.indexOf(md)+1;
[ni,ni+1].forEach(i=>{const n=d.mahaDashas[i];if(!n)return;
 console.log('   MD',n.planet,(''+n.startDate).slice(0,10),'->',(''+n.endDate).slice(0,10));
 n.subPeriods.slice(0,5).forEach(p=>console.log('      AD',p.planet.padEnd(8),(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10)));});
