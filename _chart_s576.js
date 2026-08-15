const A=require('./index.js');
// s576 नन्दलाल सुवेदी — BS 2049 Chaitra 28 Sat 12:55 = 1993-04-10 (weekday verified Saturday)
// Annapurna Gaupalika w1, Kaski, Nepal (Ghandruk area)
const B={date:'1993-04-10',time:'12:55',latitude:28.3757,longitude:83.8117,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const H=p=>(((p.signNumber-L.signNumber+12)%12)+1);
console.log('LAGNA',L.signName,L.degreeInSign.toFixed(2),L.nakshatra);
console.log('MOON ',m.signName,m.degreeInSign.toFixed(2),m.nakshatra,'pada',m.nakshatraPada||m.pada);
console.log('\nPLANETS');
pl.forEach(p=>console.log('  ',p.name.padEnd(8),p.signName.padEnd(11),p.degreeInSign.toFixed(2).padStart(6),'H'+H(p),p.nakshatra.padEnd(14),(p.dignity||'').padEnd(12),(p.retrograde?'R':' '),(p.isCombust?'CMB':'')));
console.log('\nHOUSES');
for(let i=0;i<12;i++){const sn=((L.signNumber-1+i)%12)+1;console.log(' H'+String(i+1).padStart(2),SN[sn-1].padEnd(11),pl.filter(p=>p.signNumber===sn).map(p=>p.name).join(','));}

// birth-time sensitivity
console.log('\nSENSITIVITY +/-10min');
[-10,-5,0,5,10].forEach(off=>{let t=12*60+55+off;const tt=String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0');
 const q=A.calculateBirthChart({...B,time:tt});const qp=Array.isArray(q.planets)?q.planets:Object.values(q.planets);
 const d9=A.calculateDivisionalChart(9,qp,q.lagna);
 console.log('  ',String(off).padStart(3),tt,'lagna',q.lagna.signName,q.lagna.degreeInSign.toFixed(2),'| D9 lagna',d9.lagna?(d9.lagna.vargaSignName||d9.lagna.signName):'?');});

const d9=A.calculateDivisionalChart(9,pl,L);console.log('\nD9');d9.planets.forEach(p=>console.log('   ',p.planet.padEnd(8),p.vargaSignName));
const d10=A.calculateDivisionalChart(10,pl,L);console.log('\nD10 (career)');d10.planets.forEach(p=>console.log('   ',p.planet.padEnd(8),p.vargaSignName));

let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('1993-04-10T12:55:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-17');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
console.log('\nMAHA',md.planet,(''+md.startDate).slice(0,10),'->',(''+md.endDate).slice(0,10));
md.subPeriods.forEach(p=>{if(new Date(p.endDate)>new Date('2025-01-01'))console.log('   AD',p.planet.padEnd(8),(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10));});
console.log('  ON 17 AUG 2026 -> AD',ad.planet);
(ad.subPeriods||[]).forEach(p=>console.log('     PD',p.planet.padEnd(8),(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10),
  (new Date(p.startDate)<=T&&new Date(p.endDate)>T)?'  <== on result day':''));
d.mahaDashas.forEach(p=>{if(new Date(p.endDate)>new Date('2020-01-01')&&new Date(p.startDate)<new Date('2045-01-01'))console.log('MAHA-LINE',p.planet,(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10));});

// transits across Bhadau 2083 (17 Aug - 16 Sep 2026), daily for the two key days
const KA={latitude:28.3757,longitude:83.8117,timezone:'Asia/Kathmandu'};
const at=iso=>{const q=A.calculateBirthChart({...KA,date:iso,time:'10:00'});const qp=Array.isArray(q.planets)?q.planets:Object.values(q.planets);
 const g={};qp.forEach(p=>g[p.name]={sign:p.signName,signNumber:p.signNumber,deg:p.degreeInSign,retro:!!p.retrograde,nak:p.nakshatra});return g;};
console.log('\nTRANSITS on the two days (house = from natal lagna '+L.signName+')');
['2026-08-17','2026-08-18'].forEach(iso=>{const g=at(iso);console.log(' ',iso);
 ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'].forEach(n=>{
  const h=(((g[n].signNumber-L.signNumber+12)%12)+1);
  console.log('     ',n.padEnd(8),g[n].sign.padEnd(11),g[n].deg.toFixed(1).padStart(5),'H'+String(h).padStart(2),g[n].nak.padEnd(14),g[n].retro?'R':'');});});
console.log('\nBHADAU WEEKLY (Ju/Sa/Ma/Su/Me)');
['2026-08-17','2026-08-24','2026-08-31','2026-09-07','2026-09-14'].forEach(iso=>{const g=at(iso);
 const f=n=>(g[n].sign+' '+g[n].deg.toFixed(0)+(g[n].retro?'R':'')).padEnd(16);
 console.log(' ',iso,'Ju',f('Jupiter'),'Sa',f('Saturn'),'Ma',f('Mars'),'Su',f('Sun'),'Me',f('Mercury'));});

// panchang for the two days
console.log('\nPANCHANG');
['2026-08-17','2026-08-18'].forEach(iso=>{try{const p=A.calculatePanchang(new Date(iso+'T06:00:00+05:45'),28.3757,83.8117);
 console.log(' ',iso,JSON.stringify({tithi:p.tithi&&(p.tithi.name||p.tithi),nak:p.nakshatra&&(p.nakshatra.name||p.nakshatra),yoga:p.yoga&&(p.yoga.name||p.yoga),karana:p.karana&&(p.karana.name||p.karana)}));}catch(e){console.log(' ',iso,'panchang err',e.message);}});
try{const ss=A.calculateSadeSatiPeriod(new Date('1993-04-10T12:55:00+05:45'),m.signNumber);
 console.log('\nSADE SATI',JSON.stringify(ss).slice(0,600));}catch(e){console.log('sadesati err',e.message);}
