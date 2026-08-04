const A=require('./index.js');
const TZ='Asia/Kathmandu';
const HER={date:'1996-07-23',time:'06:15',latitude:27.6766,longitude:85.3247,timezone:TZ};
const HIM={date:'1997-06-17',time:'22:09',latitude:27.7172,longitude:85.3240,timezone:TZ};
function show(tag,B){
 const r=A.calculateBirthChart(B);
 const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
 const L=r.lagna,m=pl.find(p=>p.name==='Moon');
 console.log('===== '+tag+'  lagna '+L.signName+' '+L.degreeInSign.toFixed(2)+' '+L.nakshatra);
 pl.forEach(p=>console.log('  ',p.name,p.signName,p.degreeInSign.toFixed(2),'H'+(((p.signNumber-L.signNumber+12)%12)+1),p.nakshatra,'pada'+(p.nakshatraPada||p.pada||''),p.dignity,(p.retrograde?'R':''),(p.isCombust?'CMB':'')));
 console.log('   MOON',m.signName,m.degreeInSign.toFixed(2),m.nakshatra,'pada',(m.nakshatraPada||m.pada));
 return {r,pl,L,m};
}
// sensitivity +/- 15 min
[-15,0,15].forEach(off=>{
 [['HER',HER],['HIM',HIM]].forEach(([t,B])=>{
  const [h,mi]=B.time.split(':').map(Number);let tot=h*60+mi+off;
  const b2={...B,time:String(Math.floor(tot/60)).padStart(2,'0')+':'+String(tot%60).padStart(2,'0')};
  const r=A.calculateBirthChart(b2);const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
  const mo=pl.find(p=>p.name==='Moon');
  console.log('SENS',t,off+'min',b2.time,'lagna',r.lagna.signName,r.lagna.degreeInSign.toFixed(2),'| Moon',mo.signName,mo.nakshatra,'pada'+(mo.nakshatraPada||mo.pada));
 });});
console.log('');
const H=show('HER 23 Jul 1996 06:15 Lalitpur',HER);
const M=show('HIM 17 Jun 1997 22:09 Kathmandu',HIM);
[['HER',H],['HIM',M]].forEach(([t,X])=>{
 let nak=X.m.nakshatra; if(nak==='Mula')nak='Moola';
 const d=A.calculateVimshottariDasha(new Date(X===H?'1996-07-23T06:15:00+05:45':'1997-06-17T22:09:00+05:45'),nak,(X.m.longitude%13.3333333),3);
 const T=new Date('2026-07-29');
 const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
 console.log('--- '+t+' DASHA: MD '+md.planet+' '+(''+md.startDate).slice(0,10)+' → '+(''+md.endDate).slice(0,10));
 md.subPeriods.forEach(p=>{if(new Date(p.endDate)>new Date('2025-06-01')&&new Date(p.startDate)<new Date('2030-01-01'))console.log('    AD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10));});
 const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
 console.log('    CUR AD',ad.planet);
 (ad.subPeriods||[]).forEach(p=>console.log('       PD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));
});
