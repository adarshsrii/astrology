const A=require('./index.js');
const B={date:'1995-07-23',time:'09:00',latitude:27.6931,longitude:85.3178,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
console.log('LAGNA',L.signName,L.degreeInSign.toFixed(2),L.nakshatra);
console.log('MOON ',m.signName,m.degreeInSign.toFixed(2),m.nakshatra,'pada',m.nakshatraPada||m.pada);
pl.forEach(p=>console.log('  ',p.name.padEnd(8),p.signName.padEnd(11),p.degreeInSign.toFixed(2).padStart(6),'H'+(((p.signNumber-L.signNumber+12)%12)+1),p.nakshatra.padEnd(14),(p.dignity||'').padEnd(12),(p.retrograde?'R':''),(p.isCombust?'CMB':'')));
console.log('\nHOUSES');
for(let i=0;i<12;i++){const sn=((L.signNumber-1+i)%12)+1;console.log(' H'+(i+1),SN[sn-1].padEnd(11),pl.filter(p=>p.signNumber===sn).map(p=>p.name).join(','));}
[-15,0,15].forEach(off=>{let t=9*60+off;const tt=String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0');
 const q=A.calculateBirthChart({...B,time:tt});const qp=Array.isArray(q.planets)?q.planets:Object.values(q.planets);
 console.log('SENS',String(off).padStart(3),tt,'lagna',q.lagna.signName,q.lagna.degreeInSign.toFixed(2),'| Moon',qp.find(p=>p.name==='Moon').signName,qp.find(p=>p.name==='Moon').nakshatra);});
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('1995-07-23T09:00:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-11');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const pd=ad.subPeriods&&ad.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
console.log('\nMD',md.planet,(''+md.startDate).slice(0,10),'->',(''+md.endDate).slice(0,10),'| AD',ad.planet,(''+ad.startDate).slice(0,10),'->',(''+ad.endDate).slice(0,10),'| PD',pd&&pd.planet,pd&&(''+pd.startDate).slice(0,10),pd&&(''+pd.endDate).slice(0,10));
md.subPeriods.forEach(p=>{if(new Date(p.endDate)>new Date('2025-06-01'))console.log('   AD',p.planet.padEnd(8),(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10));});
(ad.subPeriods||[]).forEach(p=>console.log('     PD',p.planet.padEnd(8),(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10)));
d.mahaDashas.forEach(p=>{if(new Date(p.endDate)>new Date('2020-01-01')&&new Date(p.startDate)<new Date('2040-01-01'))console.log('MAHA',p.planet,(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10));});
const nx=d.mahaDashas.find(p=>new Date(p.startDate)>T);
if(nx){console.log('NEXT MD',nx.planet,(''+nx.startDate).slice(0,10));nx.subPeriods.slice(0,5).forEach(p=>console.log('     AD',p.planet.padEnd(8),(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10)));}
const KTM={latitude:27.7172,longitude:85.3240,timezone:'Asia/Kathmandu'};
console.log('\nTRANSITS');
for(let y=2026;y<=2029;y++)for(const mo of [1,3,5,7,9,11]){const ds=y+'-'+String(mo).padStart(2,'0')+'-01';
 if(new Date(ds)<new Date('2026-08-01'))continue;
 const q=A.calculateBirthChart({...KTM,date:ds,time:'12:00'});const qp=Array.isArray(q.planets)?q.planets:Object.values(q.planets);
 const g=n=>{const p=qp.find(x=>x.name===n);return (p.signName+' '+p.degreeInSign.toFixed(0)+(p.retrograde?'R':'')).padEnd(15);};
 console.log(' ',ds,'Ju',g('Jupiter'),'Sa',g('Saturn'),'Ra',g('Rahu'));}
