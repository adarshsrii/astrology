const A=require('./index.js');
// s570 Prisha Malla — 2006-01-01, 10:00 AM, Kathmandu
const B={date:'2006-01-01',time:'10:00',latitude:27.7172,longitude:85.3240,timezone:'Asia/Kathmandu'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const LORD={Aries:'Mars',Taurus:'Venus',Gemini:'Mercury',Cancer:'Moon',Leo:'Sun',Virgo:'Mercury',Libra:'Venus',Scorpio:'Mars',Sagittarius:'Jupiter',Capricorn:'Saturn',Aquarius:'Saturn',Pisces:'Jupiter'};
const navSign=lon=>((Math.floor(lon/(30/9))%12)+12)%12;
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const H=p=>(((p.signNumber-L.signNumber+12)%12)+1);
console.log('LAGNA',L.signName,L.degreeInSign.toFixed(2),L.nakshatra);
console.log('MOON ',m.signName,m.degreeInSign.toFixed(2),m.nakshatra,'pada',m.nakshatraPada||m.pada);
console.log('\nPLANETS');
pl.forEach(p=>console.log('  ',p.name.padEnd(8),p.signName.padEnd(11),p.degreeInSign.toFixed(2).padStart(6),'H'+String(H(p)).padStart(2),p.nakshatra.padEnd(16),(p.dignity||'').padEnd(12),(p.retrograde?'R':' '),(p.isCombust?'CMB':''),'| D9',SN[navSign(p.longitude)]));
console.log('\nHOUSES');
for(let i=0;i<12;i++){const sn=((L.signNumber-1+i)%12)+1;console.log(' H'+String(i+1).padStart(2),SN[sn-1].padEnd(11),pl.filter(p=>p.signNumber===sn).map(p=>p.name).join(','));}
[[2,'WEALTH'],[4,'EDUCATION base'],[9,'HIGHER STUDY/foreign travel'],[10,'CAREER'],[11,'GAINS'],[12,'FOREIGN residence']].forEach(([h,tag])=>{
  const sn=((L.signNumber-1+h-1)%12)+1,ld=LORD[SN[sn-1]],p=pl.find(x=>x.name===ld);
  console.log(' H'+String(h).padStart(2),tag.padEnd(26),SN[sn-1].padEnd(11),'occ:',(pl.filter(x=>x.signNumber===sn).map(x=>x.name).join(',')||'-').padEnd(20),'lord',ld.padEnd(8),'in',p.signName.padEnd(11),'H'+H(p),p.dignity||'',p.retrograde?'R':'');});
console.log('\nSENSITIVITY (10:00 is a round number)');
[-20,-10,0,10,20].forEach(off=>{let t=600+off;const tt=String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0');
  const q=A.calculateBirthChart({...B,time:tt});
  console.log('  ',String(off).padStart(3),tt,'lagna',q.lagna.signName,q.lagna.degreeInSign.toFixed(2),'| D9 lagna',SN[navSign(q.lagna.longitude)]);});
const d9=A.calculateDivisionalChart(9,pl,L);
const d10=A.calculateDivisionalChart(10,pl,L);
console.log('\nD10 (career):',d10.planets.map(p=>p.planet.slice(0,2)+'='+p.vargaSignName.slice(0,3)).join(' '));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('2006-01-01T10:00:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-12');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
console.log('\nMAHA',md.planet,(''+md.startDate).slice(0,10),'->',(''+md.endDate).slice(0,10),'| AD now',ad.planet,(''+ad.startDate).slice(0,10),'->',(''+ad.endDate).slice(0,10));
md.subPeriods.forEach(p=>{if(new Date(p.endDate)>new Date('2026-01-01')&&new Date(p.startDate)<new Date('2034-01-01'))console.log('   AD',p.planet.padEnd(8),(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10));});
console.log('  PD inside',ad.planet+':');
(ad.subPeriods||[]).forEach(p=>console.log('     ',p.planet.padEnd(8),(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10),(new Date(p.startDate)<=T&&new Date(p.endDate)>T)?'<== NOW':''));
d.mahaDashas.forEach(p=>{if(new Date(p.endDate)>new Date('2020-01-01')&&new Date(p.startDate)<new Date('2045-01-01'))console.log('MAHA-LINE',p.planet,(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10));});
console.log('\nJUPITER/SATURN TRANSIT (9th='+SN[((L.signNumber-1+8)%12)]+', 12th='+SN[((L.signNumber-1+11)%12)]+', 10th='+SN[((L.signNumber-1+9)%12)]+')');
for(let y=2026;y<=2030;y++)for(let mo=1;mo<=12;mo+=4){const ds=y+'-'+String(mo).padStart(2,'0')+'-01';
 if(new Date(ds)<new Date('2026-08-01'))continue;
 const q=A.calculateBirthChart({...B,date:ds,time:'12:00'});const qp=Array.isArray(q.planets)?q.planets:Object.values(q.planets);
 const j=qp.find(x=>x.name==='Jupiter'),s2=qp.find(x=>x.name==='Saturn'),ra=qp.find(x=>x.name==='Rahu');
 console.log('  ',ds,'Ju',(j.signName+' '+j.degreeInSign.toFixed(0)).padEnd(14),'H'+String((((j.signNumber-L.signNumber+12)%12)+1)).padStart(2),
  ' Sa',(s2.signName+' '+s2.degreeInSign.toFixed(0)).padEnd(14),'H'+String((((s2.signNumber-L.signNumber+12)%12)+1)).padStart(2),
  ' Ra H'+String((((ra.signNumber-L.signNumber+12)%12)+1)).padStart(2));}
