const A=require('./index.js');
// s567 Tilak Bahadur Subedi — 3 May 1996, Bhadrapur Jhapa Nepal, time "evening 8:30-9", stated rashi Tula
const BASE={date:'1996-05-03',latitude:26.5448,longitude:88.0895,timezone:'Asia/Kathmandu'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const LORD={Aries:'Mars',Taurus:'Venus',Gemini:'Mercury',Cancer:'Moon',Leo:'Sun',Virgo:'Mercury',Libra:'Venus',Scorpio:'Mars',Sagittarius:'Jupiter',Capricorn:'Saturn',Aquarius:'Saturn',Pisces:'Jupiter'};
const navSign=lon=>((Math.floor(lon/(30/9))%12)+12)%12;
console.log('=== TIME WINDOW 20:30 - 21:00, and his stated rashi Tula ===');
['20:30','20:45','21:00'].forEach(t=>{const q=A.calculateBirthChart({...BASE,time:t});
 const qp=Array.isArray(q.planets)?q.planets:Object.values(q.planets);
 const mm=qp.find(p=>p.name==='Moon');
 console.log('  ',t,'lagna',q.lagna.signName.padEnd(11),q.lagna.degreeInSign.toFixed(2).padStart(6),'| Moon',mm.signName.padEnd(8),mm.degreeInSign.toFixed(2),mm.nakshatra,
   mm.signName==='Libra'?'  <= matches his Tula':'  <= NOT Tula');});

const B={...BASE,time:'20:45'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const H=p=>(((p.signNumber-L.signNumber+12)%12)+1);
console.log('\nLAGNA',L.signName,L.degreeInSign.toFixed(2),L.nakshatra);
console.log('MOON ',m.signName,m.degreeInSign.toFixed(2),m.nakshatra,'pada',m.nakshatraPada||m.pada);
console.log('\nPLANETS');
pl.forEach(p=>console.log('  ',p.name.padEnd(8),p.signName.padEnd(11),p.degreeInSign.toFixed(2).padStart(6),'H'+String(H(p)).padStart(2),p.nakshatra.padEnd(16),(p.dignity||'').padEnd(12),(p.retrograde?'R':' '),(p.isCombust?'CMB':''),'| D9',SN[navSign(p.longitude)]));
console.log('\nHOUSES');
for(let i=0;i<12;i++){const sn=((L.signNumber-1+i)%12)+1;console.log(' H'+String(i+1).padStart(2),SN[sn-1].padEnd(11),pl.filter(p=>p.signNumber===sn).map(p=>p.name).join(','));}
[[2,'WEALTH'],[3,'CREATIVE/media'],[5,'ROMANCE/creativity'],[7,'PARTNER'],[10,'CAREER'],[11,'GAINS']].forEach(([h,tag])=>{
  const sn=((L.signNumber-1+h-1)%12)+1,ld=LORD[SN[sn-1]],p=pl.find(x=>x.name===ld);
  console.log(' H'+String(h).padStart(2),tag.padEnd(20),SN[sn-1].padEnd(11),'occ:',(pl.filter(x=>x.signNumber===sn).map(x=>x.name).join(',')||'-').padEnd(20),'lord',ld.padEnd(8),'in',p.signName.padEnd(11),'H'+String(H(p)).padStart(2),(p.dignity||'').padEnd(12),p.retrograde?'R':'',p.isCombust?'CMB':'');});
const ve=pl.find(p=>p.name==='Venus');
console.log('VENUS (love/art):',ve.signName,ve.degreeInSign.toFixed(2),'H'+H(ve),ve.dignity||'',ve.retrograde?'R':'',ve.isCombust?'COMBUST':'');
console.log('D9 lagna',SN[navSign(L.longitude)],'| D9 7th',SN[(navSign(L.longitude)+6)%12]);
const d10=A.calculateDivisionalChart(10,pl,L);console.log('D10:',d10.planets.map(p=>p.planet.slice(0,2)+'='+p.vargaSignName.slice(0,3)).join(' '));

let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('1996-05-03T20:45:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-12');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
console.log('\nMAHA',md.planet,(''+md.startDate).slice(0,10),'->',(''+md.endDate).slice(0,10),'| AD now',ad.planet,(''+ad.startDate).slice(0,10),'->',(''+ad.endDate).slice(0,10));
md.subPeriods.forEach(p=>{if(new Date(p.endDate)>new Date('2025-01-01'))console.log('   AD',p.planet.padEnd(8),(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10));});
console.log('  PD inside',ad.planet+':');
(ad.subPeriods||[]).forEach(p=>console.log('     ',p.planet.padEnd(8),(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10),(new Date(p.startDate)<=T&&new Date(p.endDate)>T)?'<== NOW':''));
d.mahaDashas.forEach(p=>{if(new Date(p.endDate)>new Date('2015-01-01')&&new Date(p.startDate)<new Date('2045-01-01'))console.log('MAHA-LINE',p.planet,(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10));});
console.log('\nJUPITER TRANSIT (7th='+SN[((L.signNumber-1+6)%12)]+', 10th='+SN[((L.signNumber-1+9)%12)]+', 11th='+SN[((L.signNumber-1+10)%12)]+')');
for(let y=2026;y<=2030;y++)for(let mo=1;mo<=12;mo+=4){const ds=y+'-'+String(mo).padStart(2,'0')+'-01';
 if(new Date(ds)<new Date('2026-08-01'))continue;
 const q=A.calculateBirthChart({...BASE,date:ds,time:'12:00'});const qp=Array.isArray(q.planets)?q.planets:Object.values(q.planets);
 const j=qp.find(x=>x.name==='Jupiter'),s2=qp.find(x=>x.name==='Saturn');
 console.log('  ',ds,'Ju',(j.signName+' '+j.degreeInSign.toFixed(0)).padEnd(14),'H'+String((((j.signNumber-L.signNumber+12)%12)+1)).padStart(2),
  ' Sa',(s2.signName+' '+s2.degreeInSign.toFixed(0)).padEnd(14),'H'+String((((s2.signNumber-L.signNumber+12)%12)+1)).padStart(2));}
