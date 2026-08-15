const A=require('./index.js');
const B={date:'1991-09-14',time:'10:30',latitude:27.6644,longitude:85.3188,timezone:'Asia/Kathmandu'};
const ISO='1991-09-14T10:30:00+05:45';
[-15,-10,0,10,15].forEach(off=>{
 const [h,mi]=B.time.split(':').map(Number);let tot=h*60+mi+off;
 const tt=String(Math.floor(tot/60)).padStart(2,'0')+':'+String(tot%60).padStart(2,'0');
 const r=A.calculateBirthChart({...B,time:tt});
 const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
 const mo=pl.find(p=>p.name==='Moon');
 const d7=A.calculateDivisionalChart(7,pl.map(p=>({name:p.name,signNumber:p.signNumber,degreeInSign:p.degreeInSign})),r.lagna.signNumber,r.lagna.degreeInSign);
 console.log('SENS',String(off).padStart(3)+'min',tt,'lagna',r.lagna.signName.padEnd(11),r.lagna.degreeInSign.toFixed(2).padStart(6),'| D7 lagna',d7.lagnaSign.name.padEnd(11),'| Moon',mo.signName,mo.nakshatra);
});
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
console.log('\n===== LAGNA '+L.signName+'('+L.signNumber+') '+L.degreeInSign.toFixed(2)+' '+L.nakshatra);
pl.forEach(p=>console.log('  ',p.name.padEnd(8),p.signName.padEnd(11),p.degreeInSign.toFixed(2).padStart(6),'H'+(((p.signNumber-L.signNumber+12)%12)+1),p.nakshatra.padEnd(15),'pada'+(p.nakshatraPada||p.pada||''),p.dignity,(p.retrograde?'R':''),(p.isCombust?'CMB':'')));
console.log('\nHOUSES');
for(let i=0;i<12;i++){const sn=((L.signNumber-1+i)%12)+1;
 console.log('  H'+(i+1),sn,pl.filter(p=>p.signNumber===sn).map(p=>p.name).join(','));}
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const h5sign=((L.signNumber-1+4)%12)+1;
console.log('\n5TH HOUSE sign',SN[h5sign-1]);
const d7=A.calculateDivisionalChart(7,pl.map(p=>({name:p.name,signNumber:p.signNumber,degreeInSign:p.degreeInSign})),L.signNumber,L.degreeInSign);
console.log('D7 (Saptamsha, children) lagna',d7.lagnaSign.name,d7.lagnaSign.number);
d7.planets.forEach(p=>console.log('   D7',p.planet.padEnd(8),p.vargaSignName.padEnd(11),'H'+(((p.vargaSignNumber-d7.lagnaSign.number+12)%12)+1)));
const d9=A.calculateDivisionalChart(9,pl.map(p=>({name:p.name,signNumber:p.signNumber,degreeInSign:p.degreeInSign})),L.signNumber,L.degreeInSign);
console.log('D9 lagna',d9.lagnaSign.name);
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date(ISO),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-06');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
console.log('\n MD '+md.planet+' '+(''+md.startDate).slice(0,10)+' -> '+(''+md.endDate).slice(0,10));
md.subPeriods.forEach(p=>console.log('   AD',p.planet.padEnd(8),(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10)));
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
console.log('   CUR AD',ad.planet);
md.subPeriods.filter(p=>new Date(p.endDate)>T&&new Date(p.startDate)<new Date('2032-01-01')).forEach(p=>{
 console.log('   >> AD',p.planet,(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10));
 (p.subPeriods||[]).forEach(q=>console.log('        PD',q.planet.padEnd(8),(''+q.startDate).slice(0,10),'->',(''+q.endDate).slice(0,10)));});
const ni=d.mahaDashas.indexOf(md)+1;
const n=d.mahaDashas[ni];
if(n){console.log('   NEXT MD',n.planet,(''+n.startDate).slice(0,10),'->',(''+n.endDate).slice(0,10));
 n.subPeriods.slice(0,5).forEach(p=>console.log('      AD',p.planet.padEnd(8),(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10)));}
