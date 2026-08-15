const A=require('./index.js');
const BIRGUNJ={latitude:27.0167,longitude:84.8667,timezone:'Asia/Kathmandu'};
const KTM={latitude:27.7172,longitude:85.3240,timezone:'Asia/Kathmandu'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
function show(tag,date,time,loc){
 const r=A.calculateBirthChart({...loc,date,time});
 const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
 const L=r.lagna,m=pl.find(p=>p.name==='Moon');
 console.log('\n===== '+tag+' '+date+' '+time);
 console.log(' LAGNA',L.signName,L.degreeInSign.toFixed(2),L.nakshatra,'| MOON',m.signName,m.degreeInSign.toFixed(2),m.nakshatra,'pada',m.nakshatraPada||m.pada);
 pl.forEach(p=>console.log('   ',p.name.padEnd(8),p.signName.padEnd(11),p.degreeInSign.toFixed(2).padStart(6),'H'+(((p.signNumber-L.signNumber+12)%12)+1),p.nakshatra.padEnd(14),(p.dignity||'').padEnd(12),(p.retrograde?'R':''),(p.isCombust?'CMB':'')));
 for(let i=0;i<12;i++){const sn=((L.signNumber-1+i)%12)+1;const occ=pl.filter(p=>p.signNumber===sn).map(p=>p.name).join(',');if(occ)console.log('   H'+(i+1),SN[sn-1],occ);}
 return {r,pl,L,m};
}
function dasha(tag,date,time,mo,from,to){
 let nak=mo.nakshatra; if(nak==='Mula')nak='Moola';
 const d=A.calculateVimshottariDasha(new Date(date+'T'+time+':00+05:45'),nak,(mo.longitude%13.3333333),3);
 const T=new Date('2026-08-11');
 const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
 const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
 console.log('\n'+tag+' MD',md.planet,(''+md.startDate).slice(0,10),'->',(''+md.endDate).slice(0,10),'| AD',ad.planet,(''+ad.startDate).slice(0,10),'->',(''+ad.endDate).slice(0,10));
 md.subPeriods.forEach(p=>{if(new Date(p.endDate)>new Date(from))console.log('    AD',p.planet.padEnd(8),(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10));});
 d.mahaDashas.forEach(p=>{if(new Date(p.endDate)>new Date('2024-01-01')&&new Date(p.startDate)<new Date(to))console.log('  MAHA',p.planet,(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10));});
 const nx=d.mahaDashas.filter(p=>new Date(p.startDate)>T).slice(0,2);
 nx.forEach(n=>{console.log('  NEXT MD',n.planet,(''+n.startDate).slice(0,10));(n.subPeriods||[]).slice(0,6).forEach(p=>console.log('      AD',p.planet.padEnd(8),(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10)));});
 return d;
}
const U=show('UMESH (Birgunj)','1980-04-12','07:20',BIRGUNJ);
dasha('UMESH','1980-04-12','07:20',U.m,'2025-01-01','2050-01-01');
// place sensitivity for the children: Birgunj vs Kathmandu vs +/-10min
[['UPASHNA','2007-12-23','03:50'],['YESH','2010-12-23','20:30']].forEach(([n,dt,tm])=>{
 [['Birgunj',BIRGUNJ],['Kathmandu',KTM]].forEach(([ln,loc])=>{
  [-10,0,10].forEach(off=>{const [h,mi]=tm.split(':').map(Number);let t=h*60+mi+off;
   const tt=String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0');
   const q=A.calculateBirthChart({...loc,date:dt,time:tt});
   const qp=Array.isArray(q.planets)?q.planets:Object.values(q.planets);
   console.log('SENS',n,ln,tt,'lagna',q.lagna.signName,q.lagna.degreeInSign.toFixed(2),'| Moon',qp.find(p=>p.name==='Moon').signName,qp.find(p=>p.name==='Moon').nakshatra);});});});
const UP=show('UPASHNA (daughter, Birgunj)','2007-12-23','03:50',BIRGUNJ);
dasha('UPASHNA','2007-12-23','03:50',UP.m,'2025-01-01','2045-01-01');
const YE=show('YESH (son, Birgunj)','2010-12-23','20:30',BIRGUNJ);
dasha('YESH','2010-12-23','20:30',YE.m,'2025-01-01','2045-01-01');
