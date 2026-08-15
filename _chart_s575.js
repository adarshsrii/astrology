const A=require('./index.js');
// s575 Rhim — BS 2052-10-27 = 1996-02-10 (round-trips both ways, Saturday)
// Chakrata, Uttarakhand, INDIA -> Asia/Kolkata, NOT Kathmandu
const BASE={date:'1996-02-10',latitude:30.7025,longitude:77.8628,timezone:'Asia/Kolkata'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
function run(tag,time){
  const B={...BASE,time};
  const r=A.calculateBirthChart(B);
  const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
  const L=r.lagna,m=pl.find(p=>p.name==='Moon');
  const H=p=>(((p.signNumber-L.signNumber+12)%12)+1);
  console.log('\n===== '+tag+' ('+time+' IST) =====');
  console.log('LAGNA',L.signName,L.degreeInSign.toFixed(2),L.nakshatra);
  console.log('MOON ',m.signName,m.degreeInSign.toFixed(2),m.nakshatra,'pada',m.nakshatraPada||m.pada);
  pl.forEach(p=>console.log('  ',p.name.padEnd(8),p.signName.padEnd(11),p.degreeInSign.toFixed(2).padStart(6),'H'+String(H(p)).padStart(2),p.nakshatra.padEnd(16),(p.dignity||'').padEnd(12),(p.retrograde?'R':'')));
  const sn10=((L.signNumber-1+9)%12)+1, sn7=((L.signNumber-1+6)%12)+1, sn12=((L.signNumber-1+11)%12)+1;
  console.log('  10th:',SN[sn10-1],'occ:',pl.filter(p=>p.signNumber===sn10).map(p=>p.name).join(',')||'-');
  console.log('   7th:',SN[sn7-1],'occ:',pl.filter(p=>p.signNumber===sn7).map(p=>p.name).join(',')||'-');
  console.log('  12th:',SN[sn12-1],'occ:',pl.filter(p=>p.signNumber===sn12).map(p=>p.name).join(',')||'-');
  let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
  const d=A.calculateVimshottariDasha(new Date('1996-02-10T'+time+':00+05:30'),nak,(m.longitude%13.3333333),3);
  const T=new Date('2026-08-12');
  const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
  const ad=md&&md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
  console.log('  DASHA now: MD',md.planet,(''+md.startDate).slice(0,10),'->',(''+md.endDate).slice(0,10),'| AD',ad?ad.planet:'?');
  const d10=A.calculateDivisionalChart(10,pl,L);
  console.log('  D10:',d10.planets.map(p=>p.planet+'='+p.vargaSignName).join(' '));
  return {L,m,md:md.planet,ad:ad?ad.planet:'?'};
}
const am=run('IF 1:35 AM (raat)','01:35');
const pm=run('IF 1:35 PM (diuso)','13:35');
console.log('\n\n===== WHAT THE AM/PM AMBIGUITY COSTS =====');
console.log('lagna   :',am.L.signName,'  vs  ',pm.L.signName, am.L.signName===pm.L.signName?'SAME':'DIFFERENT');
console.log('moon sgn:',am.m.signName,'  vs  ',pm.m.signName, am.m.signName===pm.m.signName?'SAME':'DIFFERENT');
console.log('moon nak:',am.m.nakshatra,' vs ',pm.m.nakshatra, am.m.nakshatra===pm.m.nakshatra?'SAME':'DIFFERENT');
console.log('mahadasha:',am.md,' vs ',pm.md, am.md===pm.md?'SAME':'DIFFERENT');
console.log('antardasha:',am.ad,' vs ',pm.ad, am.ad===pm.ad?'SAME':'DIFFERENT');
// also the 1:30-1:40 spread within each meridiem
console.log('\nspread inside the stated 1:30-1:40 window:');
['01:30','01:40','13:30','13:40'].forEach(t=>{const q=A.calculateBirthChart({...BASE,time:t});
  console.log('  ',t,'lagna',q.lagna.signName,q.lagna.degreeInSign.toFixed(2));});
