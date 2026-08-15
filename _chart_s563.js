const A=require('./index.js');
const B={date:'1979-05-05',time:'09:45',latitude:27.8667,longitude:84.9167,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
console.log('LAGNA',L.signName,L.degreeInSign.toFixed(2),L.nakshatra);
console.log('MOON ',m.signName,m.degreeInSign.toFixed(2),m.nakshatra,'pada',m.nakshatraPada||m.pada);
pl.forEach(p=>console.log('  ',p.name.padEnd(8),p.signName.padEnd(11),p.degreeInSign.toFixed(2).padStart(6),'H'+(((p.signNumber-L.signNumber+12)%12)+1),p.nakshatra.padEnd(14),p.dignity,(p.retrograde?'R':''),(p.isCombust?'CMB':'')));
console.log('\nHOUSES');
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
for(let i=0;i<12;i++){const sn=((L.signNumber-1+i)%12)+1;console.log(' H'+(i+1),SN[sn-1],pl.filter(p=>p.signNumber===sn).map(p=>p.name).join(','));}
// sensitivity +/-10
[-10,0,10].forEach(off=>{let t=9*60+45+off;const tt=String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0');
 const q=A.calculateBirthChart({...B,time:tt});const qp=Array.isArray(q.planets)?q.planets:Object.values(q.planets);
 console.log('SENS',off,tt,'lagna',q.lagna.signName,q.lagna.degreeInSign.toFixed(2),'| Moon',qp.find(p=>p.name==='Moon').signName,qp.find(p=>p.name==='Moon').nakshatra);});
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('1979-05-05T09:45:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-11');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const pd=ad.subPeriods&&ad.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
console.log('\nMD',md.planet,(''+md.startDate).slice(0,10),'->',(''+md.endDate).slice(0,10));
md.subPeriods.forEach(p=>{const e=new Date(p.endDate);if(e>new Date('2024-01-01')&&new Date(p.startDate)<new Date('2034-01-01'))console.log('   AD',p.planet,(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10));});
console.log('  now AD',ad.planet,'PD',pd&&pd.planet,pd&&(''+pd.startDate).slice(0,10),pd&&(''+pd.endDate).slice(0,10));
d.mahaDashas.forEach(p=>{if(new Date(p.endDate)>new Date('2020-01-01'))console.log('MAHA',p.planet,(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10));});
// D4 (chaturthamsa, property) + D9
['D4','D9'].forEach(k=>{try{const dv=A.calculateDivisionalChart(r,k);const dl=dv.lagna||dv.ascendant;console.log('\n'+k,'lagna',dl&&(dl.signName||dl.sign));(dv.planets?(Array.isArray(dv.planets)?dv.planets:Object.values(dv.planets)):[]).forEach(p=>console.log('  ',p.name,p.signName||p.sign));}catch(e){console.log(k,'ERR',e.message);}});
