const A=require('./index.js');
// s574 Prabeshika — 1999-11-10, 10:35 am, Biratnagar, Morang, Nepal
const B={date:'1999-11-10',time:'10:35',latitude:26.4525,longitude:87.2718,timezone:'Asia/Kathmandu'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const navSign=lon=>((Math.floor(lon/(30/9))%12)+12)%12;   // D9 sign index 0-11 from absolute longitude
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const H=p=>(((p.signNumber-L.signNumber+12)%12)+1);
console.log('LAGNA',L.signName,L.degreeInSign.toFixed(2),L.nakshatra,'| abs',(L.longitude||0).toFixed(2));
console.log('MOON ',m.signName,m.degreeInSign.toFixed(2),m.nakshatra,'pada',m.nakshatraPada||m.pada);
console.log('\nPLANETS');
pl.forEach(p=>console.log('  ',p.name.padEnd(8),p.signName.padEnd(11),p.degreeInSign.toFixed(2).padStart(6),'H'+String(H(p)).padStart(2),p.nakshatra.padEnd(16),(p.dignity||'').padEnd(12),(p.retrograde?'R':' '),(p.isCombust?'CMB':''),'| D9',SN[navSign(p.longitude)]));
console.log('\nHOUSES');
for(let i=0;i<12;i++){const sn=((L.signNumber-1+i)%12)+1;console.log(' H'+String(i+1).padStart(2),SN[sn-1].padEnd(11),pl.filter(p=>p.signNumber===sn).map(p=>p.name).join(','));}
const sn7=((L.signNumber-1+6)%12)+1;
const LORD={Aries:'Mars',Taurus:'Venus',Gemini:'Mercury',Cancer:'Moon',Leo:'Sun',Virgo:'Mercury',Libra:'Venus',Scorpio:'Mars',Sagittarius:'Jupiter',Capricorn:'Saturn',Aquarius:'Saturn',Pisces:'Jupiter'};
const l7=LORD[SN[sn7-1]], p7=pl.find(p=>p.name===l7);
console.log('\n7TH HOUSE:',SN[sn7-1],'| occupants:',pl.filter(p=>p.signNumber===sn7).map(p=>p.name).join(',')||'(empty)');
console.log('7TH LORD:',l7,'in',p7.signName,p7.degreeInSign.toFixed(2),'H'+H(p7),p7.dignity||'',p7.retrograde?'R':'');
const ve=pl.find(p=>p.name==='Venus'), ju=pl.find(p=>p.name==='Jupiter'), ma=pl.find(p=>p.name==='Mars');
console.log('VENUS  H'+H(ve),ve.signName,ve.dignity||'');
console.log('JUPITER (pati karaka) H'+H(ju),ju.signName,ju.dignity||'');
console.log('MARS   H'+H(ma),ma.signName,'| manglik houses from lagna 1,2,4,7,8,12 ->',[1,2,4,7,8,12].includes(H(ma))?'MANGLIK from lagna':'not manglik from lagna');
const hFromMoon=(((ma.signNumber-m.signNumber+12)%12)+1);
console.log('MARS from MOON: H'+hFromMoon,'->',[1,2,4,7,8,12].includes(hFromMoon)?'MANGLIK from Chandra':'not manglik from Chandra');
const hFromVen=(((ma.signNumber-ve.signNumber+12)%12)+1);
console.log('MARS from VENUS: H'+hFromVen,'->',[1,2,4,7,8,12].includes(hFromVen)?'MANGLIK from Venus':'not manglik from Venus');

console.log('\nD9 LAGNA + SENSITIVITY (marriage needs this stable)');
[-10,-6,-3,0,3,6,10].forEach(off=>{let t=10*60+35+off;const tt=String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0');
 const q=A.calculateBirthChart({...B,time:tt});
 console.log('  ',String(off).padStart(3),tt,'D1 lagna',q.lagna.signName,q.lagna.degreeInSign.toFixed(2),'| D9 lagna',SN[navSign(q.lagna.longitude)]);});
console.log('  D9 7th house from D9 lagna:',SN[(navSign(L.longitude)+6)%12]);
console.log('  D9 occupants:',pl.map(p=>p.name+'='+SN[navSign(p.longitude)]).join(' '));

let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('1999-11-10T10:35:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-12');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
console.log('\nDASHA now: MD',md.planet,(''+md.startDate).slice(0,10),'->',(''+md.endDate).slice(0,10),'| AD',ad.planet,(''+ad.startDate).slice(0,10),'->',(''+ad.endDate).slice(0,10));
md.subPeriods.forEach(p=>{if(new Date(p.endDate)>new Date('2026-01-01'))console.log('   AD',p.planet.padEnd(8),(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10),
  [l7,'Venus','Jupiter'].includes(p.planet)?'  <== 7th-lord / Venus / Guru':'');});
d.mahaDashas.forEach(p=>{if(new Date(p.endDate)>new Date('2024-01-01')&&new Date(p.startDate)<new Date('2040-01-01'))console.log('MAHA',p.planet,(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10));});
// current AD's pratyantar
console.log('\nPD inside current AD',ad.planet+':');
(ad.subPeriods||[]).forEach(p=>console.log('   ',p.planet.padEnd(8),(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10)));

// Jupiter transit over 7th house / natal Moon, 2026-2029
const KTM={latitude:26.4525,longitude:87.2718,timezone:'Asia/Kathmandu'};
console.log('\nJUPITER TRANSIT (7th house is '+SN[sn7-1]+', natal Moon '+m.signName+')');
for(let y=2026;y<=2029;y++)for(let mo=1;mo<=12;mo+=2){const ds=y+'-'+String(mo).padStart(2,'0')+'-01';
 if(new Date(ds)<new Date('2026-08-01'))continue;
 const q=A.calculateBirthChart({...KTM,date:ds,time:'12:00'});const qp=Array.isArray(q.planets)?q.planets:Object.values(q.planets);
 const j=qp.find(x=>x.name==='Jupiter'),s2=qp.find(x=>x.name==='Saturn');
 console.log('  ',ds,'Ju',(j.signName+' '+j.degreeInSign.toFixed(0)+(j.retrograde?'R':'')).padEnd(16),'Sa',(s2.signName+' '+s2.degreeInSign.toFixed(0)+(s2.retrograde?'R':'')).padEnd(16),
   j.signNumber===sn7?'<= Ju ON 7TH HOUSE':'', j.signNumber===m.signNumber?'<= Ju on natal Moon':'');}
