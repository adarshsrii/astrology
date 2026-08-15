const A=require('./index.js');
const B={date:'2004-04-24',time:'07:55',latitude:27.7000,longitude:83.4500,timezone:'Asia/Kathmandu'};
const ISO='2004-04-24T07:55:00+05:45';
[-10,0,10].forEach(off=>{
 const [h,mi]=B.time.split(':').map(Number);let tot=h*60+mi+off;
 const tt=String(Math.floor(tot/60)).padStart(2,'0')+':'+String(tot%60).padStart(2,'0');
 const r=A.calculateBirthChart({...B,time:tt});
 const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
 const mo=pl.find(p=>p.name==='Moon');
 console.log('SENS',off+'min',tt,'lagna',r.lagna.signName,r.lagna.degreeInSign.toFixed(2),'| Moon',mo.signName,mo.nakshatra);
});
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
console.log('\n===== LAGNA '+L.signName+'('+L.signNumber+') '+L.degreeInSign.toFixed(2)+' '+L.nakshatra);
pl.forEach(p=>console.log('  ',p.name,p.signName,p.signNumber,p.degreeInSign.toFixed(2),'H'+(((p.signNumber-L.signNumber+12)%12)+1),p.nakshatra,'pada'+(p.nakshatraPada||p.pada||''),p.dignity,(p.retrograde?'R':''),(p.isCombust?'CMB':'')));
console.log('\nHOUSES');
for(let i=0;i<12;i++){const sn=((L.signNumber-1+i)%12)+1;
 console.log('  H'+(i+1),sn,pl.filter(p=>p.signNumber===sn).map(p=>p.name).join(','));}
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date(ISO),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-06');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
console.log('\n MD '+md.planet+' '+(''+md.startDate).slice(0,10)+' -> '+(''+md.endDate).slice(0,10));
md.subPeriods.forEach(p=>console.log('   AD',p.planet,(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10)));
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
console.log('   CUR AD',ad.planet);
md.subPeriods.filter(p=>new Date(p.endDate)>T&&new Date(p.startDate)<new Date('2029-01-01')).forEach(p=>{
 console.log('   >> AD',p.planet,(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10));
 (p.subPeriods||[]).forEach(q=>console.log('        PD',q.planet,(''+q.startDate).slice(0,10),'->',(''+q.endDate).slice(0,10)));});
const ni=d.mahaDashas.indexOf(md)+1;
const n=d.mahaDashas[ni];
if(n){console.log('   NEXT MD',n.planet,(''+n.startDate).slice(0,10),'->',(''+n.endDate).slice(0,10));
 n.subPeriods.slice(0,4).forEach(p=>console.log('      AD',p.planet,(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10)));}
