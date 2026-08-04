const A=require('./index.js');
const TZ='Asia/Kathmandu';
const B={date:'1984-07-25',time:'10:05',latitude:27.6710,longitude:85.4298,timezone:TZ};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
console.log('LAGNA',L.signName,L.signNumber,L.degreeInSign.toFixed(2),L.nakshatra);
pl.forEach(p=>console.log('  ',p.name,p.signName,p.signNumber,p.degreeInSign.toFixed(2),'H'+(((p.signNumber-L.signNumber+12)%12)+1),p.nakshatra,'pada'+(p.nakshatraPada||p.pada||''),p.dignity,(p.retrograde?'R':''),(p.isCombust?'CMB':'')));
console.log('MOON',m.signName,m.signNumber,m.degreeInSign.toFixed(2),m.nakshatra);
[-15,0,15].forEach(off=>{const [h,mi]=B.time.split(':').map(Number);let tot=h*60+mi+off;
 const b2={...B,time:String(Math.floor(tot/60)).padStart(2,'0')+':'+String(tot%60).padStart(2,'0')};
 const r2=A.calculateBirthChart(b2);console.log('SENS',off,b2.time,r2.lagna.signName,r2.lagna.degreeInSign.toFixed(2));});

const d9=A.calculateDivisionalChart(9,pl.map(p=>({name:p.name,signNumber:p.signNumber,degreeInSign:p.degreeInSign})),L.signNumber,L.degreeInSign);
console.log('D9 lagna',d9.lagnaSign.name);
d9.planets.forEach(p=>console.log('   D9',p.planet,p.vargaSignName,'H'+(((p.vargaSignNumber-d9.lagnaSign.number+12)%12)+1)));

// Sade Sati (authoritative from engine)
try{const ss=A.calculateSadeSatiPeriod(new Date('2026-08-03'),m.signNumber);console.log('SADESATI',JSON.stringify(ss).slice(0,900));}catch(e){console.log('sadesati err',e.message);}

// Where are Saturn and Jupiter NOW (sidereal) - use a chart cast for today at his place
const now=A.calculateBirthChart({date:'2026-08-03',time:'12:00',latitude:27.6710,longitude:85.4298,timezone:TZ});
const np=Array.isArray(now.planets)?now.planets:Object.values(now.planets);
np.filter(p=>['Saturn','Jupiter','Rahu','Ketu'].includes(p.name)).forEach(p=>console.log('TRANSIT NOW',p.name,p.signName,p.degreeInSign.toFixed(2),(p.retrograde?'R':'')));
// Saturn ingress scan
['2027-01-15','2027-04-15','2027-06-15','2027-08-15','2027-10-15','2028-01-15','2028-04-15'].forEach(dt=>{
 const c=A.calculateBirthChart({date:dt,time:'12:00',latitude:27.6710,longitude:85.4298,timezone:TZ});
 const cp=Array.isArray(c.planets)?c.planets:Object.values(c.planets);
 const sa=cp.find(p=>p.name==='Saturn'),ju=cp.find(p=>p.name==='Jupiter');
 console.log('  ',dt,'Saturn',sa.signName,sa.degreeInSign.toFixed(1),'| Jupiter',ju.signName,ju.degreeInSign.toFixed(1));});

let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('1984-07-25T10:05:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-03');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
console.log('MD',md.planet,(''+md.startDate).slice(0,10),'→',(''+md.endDate).slice(0,10));
md.subPeriods.forEach(p=>{if(new Date(p.endDate)>new Date('2025-01-01')&&new Date(p.startDate)<new Date('2034-01-01'))console.log('   AD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10));});
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
console.log('CUR AD',ad.planet);
(ad.subPeriods||[]).forEach(p=>console.log('      PD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));
const ni=d.mahaDashas.indexOf(md)+1;
if(d.mahaDashas[ni])console.log('NEXT MD',d.mahaDashas[ni].planet,(''+d.mahaDashas[ni].startDate).slice(0,10),'→',(''+d.mahaDashas[ni].endDate).slice(0,10));
