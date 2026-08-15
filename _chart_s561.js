const A=require('./index.js');
// s561 Bhanubhakta Chaulagai — BS 2062-10-14, time "5:30" (no AM/PM), Sindhuli Nepal
// He asks "8 bhab ma sani bhaya k hunchh" — so which branch actually puts Saturn in the 8th?
const BASE={date:'2006-01-27',latitude:27.2333,longitude:85.9167,timezone:'Asia/Kathmandu'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
function run(tag,time){
  const B={...BASE,time};
  const r=A.calculateBirthChart(B);
  const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
  const L=r.lagna,m=pl.find(p=>p.name==='Moon');
  const H=p=>(((p.signNumber-L.signNumber+12)%12)+1);
  const sa=pl.find(p=>p.name==='Saturn');
  console.log('\n===== '+tag+' ('+time+') =====');
  console.log('LAGNA',L.signName,L.degreeInSign.toFixed(2),L.nakshatra);
  console.log('MOON ',m.signName,m.degreeInSign.toFixed(2),m.nakshatra,'pada',m.nakshatraPada||m.pada);
  console.log('>>> SATURN in H'+H(sa),sa.signName,sa.degreeInSign.toFixed(2),sa.dignity,sa.retrograde?'R':'', H(sa)===8?'  <<< MATCHES HIS QUESTION':'');
  pl.forEach(p=>console.log('  ',p.name.padEnd(8),p.signName.padEnd(11),p.degreeInSign.toFixed(2).padStart(6),'H'+String(H(p)).padStart(2),p.nakshatra.padEnd(16),(p.dignity||'').padEnd(12),(p.retrograde?'R':'')));
  for(let i=0;i<12;i++){const sn=((L.signNumber-1+i)%12)+1;const occ=pl.filter(p=>p.signNumber===sn).map(p=>p.name).join(',');if(occ)console.log('   H'+String(i+1).padStart(2),SN[sn-1].padEnd(11),occ);}
  let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
  const d=A.calculateVimshottariDasha(new Date('2006-01-27T'+time+':00+05:45'),nak,(m.longitude%13.3333333),3);
  const T=new Date('2026-08-12');
  const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
  const ad=md&&md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
  console.log('  DASHA now: MD',md.planet,(''+md.startDate).slice(0,10),'->',(''+md.endDate).slice(0,10),'| AD',ad?ad.planet:'?',ad?(''+ad.startDate).slice(0,10)+' -> '+(''+ad.endDate).slice(0,10):'');
  if(md)md.subPeriods.forEach(p=>{if(new Date(p.endDate)>new Date('2026-01-01')&&new Date(p.startDate)<new Date('2030-01-01'))console.log('     AD',p.planet.padEnd(8),(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10));});
  return {L,m,sa,h:H(sa),md:md.planet};
}
const am=run('IF 5:30 AM','05:30');
const pm=run('IF 5:30 PM','17:30');
console.log('\n===== VERDICT =====');
console.log('5:30 AM -> lagna',am.L.signName,', Saturn in house',am.h);
console.log('5:30 PM -> lagna',pm.L.signName,', Saturn in house',pm.h);
console.log('His premise (Saturn in 8th) fits:',am.h===8?'THE AM CHART':'', pm.h===8?'THE PM CHART':'', (am.h!==8&&pm.h!==8)?'NEITHER':'');
console.log('\nlagna stability around 5:30 AM:');
['05:00','05:15','05:30','05:45','06:00'].forEach(t=>{const q=A.calculateBirthChart({...BASE,time:t});
  const qp=Array.isArray(q.planets)?q.planets:Object.values(q.planets);
  const s2=qp.find(p=>p.name==='Saturn');
  console.log('  ',t,'lagna',q.lagna.signName,q.lagna.degreeInSign.toFixed(2),'| Saturn H'+((((s2.signNumber-q.lagna.signNumber+12)%12)+1)));});
