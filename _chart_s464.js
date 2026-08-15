const A=require('./index.js');
const TZ='Asia/Kathmandu';
const BASE={date:'2004-04-24',latitude:27.7000,longitude:83.4500,timezone:TZ};
function show(tag,B,iso){
 const r=A.calculateBirthChart(B);
 const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
 const L=r.lagna,m=pl.find(p=>p.name==='Moon');
 console.log('===== '+tag+'  LAGNA '+L.signName+'('+L.signNumber+') '+L.degreeInSign.toFixed(2)+' '+L.nakshatra);
 pl.forEach(p=>console.log('  ',p.name,p.signName,p.signNumber,p.degreeInSign.toFixed(2),'H'+(((p.signNumber-L.signNumber+12)%12)+1),p.nakshatra,'pada'+(p.nakshatraPada||p.pada||''),p.dignity,(p.retrograde?'R':''),(p.isCombust?'CMB':'')));
 const d9=A.calculateDivisionalChart(9,pl.map(p=>({name:p.name,signNumber:p.signNumber,degreeInSign:p.degreeInSign})),L.signNumber,L.degreeInSign);
 console.log('   D9 lagna',d9.lagnaSign.name,d9.lagnaSign.number);
 let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
 const d=A.calculateVimshottariDasha(new Date(iso),nak,(m.longitude%13.3333333),3);
 const T=new Date('2026-08-05');
 const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
 console.log('   MD '+md.planet+' '+(''+md.startDate).slice(0,10)+' -> '+(''+md.endDate).slice(0,10));
 md.subPeriods.forEach(p=>{if(new Date(p.endDate)>new Date('2026-01-01')&&new Date(p.startDate)<new Date('2032-01-01'))console.log('     AD',p.planet,(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10));});
 const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
 console.log('     CUR AD',ad.planet);
 (ad.subPeriods||[]).forEach(p=>console.log('        PD',p.planet,(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10)));
 const ni=d.mahaDashas.indexOf(md)+1;
 if(d.mahaDashas[ni]){const n=d.mahaDashas[ni];console.log('     NEXT MD',n.planet,(''+n.startDate).slice(0,10),'->',(''+n.endDate).slice(0,10));
  n.subPeriods.slice(0,5).forEach(p=>console.log('        nAD',p.planet,(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10)));}
 return {r,pl,L,m,d,md};
}
// AM/PM sensitivity + -/+10 min
[['07:55','AM'],['19:55','PM']].forEach(([t,tag])=>{
 [-10,0,10].forEach(off=>{
  const [h,mi]=t.split(':').map(Number);let tot=h*60+mi+off;
  const tt=String(Math.floor(tot/60)).padStart(2,'0')+':'+String(tot%60).padStart(2,'0');
  const r=A.calculateBirthChart({...BASE,time:tt});
  const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
  const mo=pl.find(p=>p.name==='Moon');
  console.log('SENS',tag,off+'min',tt,'lagna',r.lagna.signName,r.lagna.degreeInSign.toFixed(2),'| Moon',mo.signName,mo.nakshatra,'pada'+(mo.nakshatraPada||mo.pada));
 });});
console.log('');
show('AM 07:55',{...BASE,time:'07:55'},'2004-04-24T07:55:00+05:45');
console.log('');
show('PM 19:55',{...BASE,time:'19:55'},'2004-04-24T19:55:00+05:45');
