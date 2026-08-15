const A=require('./index.js');
const B={date:'2004-04-02',time:'09:45',latitude:28.0333,longitude:82.4833,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
console.log('LAGNA',L.signName,L.degreeInSign.toFixed(2),L.nakshatra);
console.log('MOON ',m.signName,m.degreeInSign.toFixed(2),m.nakshatra,'pada',m.nakshatraPada||m.pada);
pl.forEach(p=>console.log('  ',p.name.padEnd(8),p.signName.padEnd(11),p.degreeInSign.toFixed(2).padStart(6),'H'+(((p.signNumber-L.signNumber+12)%12)+1),p.nakshatra.padEnd(14),(p.dignity||'').padEnd(11),(p.retrograde?'R':''),(p.isCombust?'CMB':'')));
console.log('\nHOUSES');
for(let i=0;i<12;i++){const sn=((L.signNumber-1+i)%12)+1;console.log(' H'+(i+1),SN[sn-1].padEnd(11),pl.filter(p=>p.signNumber===sn).map(p=>p.name).join(','));}
[-10,0,10].forEach(off=>{let t=9*60+45+off;const tt=String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0');
 const q=A.calculateBirthChart({...B,time:tt});const qp=Array.isArray(q.planets)?q.planets:Object.values(q.planets);
 console.log('SENS',off,tt,'lagna',q.lagna.signName,q.lagna.degreeInSign.toFixed(2),'| Moon',qp.find(p=>p.name==='Moon').signName,qp.find(p=>p.name==='Moon').nakshatra);});
[9,10].forEach(n=>{try{const dv=A.calculateDivisionalChart(n,pl,L);
 console.log('\nD'+n,JSON.stringify(dv).slice(0,600));}catch(e){console.log('D'+n,'ERR',e.message);}});
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('2004-04-02T09:45:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-11');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
console.log('\nMD',md.planet,(''+md.startDate).slice(0,10),'->',(''+md.endDate).slice(0,10),'| AD now',ad.planet,(''+ad.startDate).slice(0,10),'->',(''+ad.endDate).slice(0,10));
md.subPeriods.forEach(p=>console.log('   AD',p.planet,(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10)));
d.mahaDashas.forEach(p=>{if(new Date(p.endDate)>new Date('2020-01-01')&&new Date(p.startDate)<new Date('2050-01-01'))console.log('MAHA',p.planet,(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10));});
try{console.log('\nYOGAS',(A.detectYogas(r)||[]).map(y=>y.name||y).slice(0,25).join(' | '));}catch(e){console.log('yoga err',e.message);}
