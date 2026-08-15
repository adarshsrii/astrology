const A=require('./index.js');
// s560 Abina (on record: 1994-12-20 06:18 Lubhu Lalitpur) x Jems (1988-11-25 09:55 Thapathali KTM)
const HER={date:'1994-12-20',time:'06:18',latitude:27.6167,longitude:85.3667,timezone:'Asia/Kathmandu'};
const HIM={date:'1988-11-25',time:'09:55',latitude:27.6931,longitude:85.3183,timezone:'Asia/Kathmandu'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const LORD={Aries:'Mars',Taurus:'Venus',Gemini:'Mercury',Cancer:'Moon',Leo:'Sun',Virgo:'Mercury',Libra:'Venus',Scorpio:'Mars',Sagittarius:'Jupiter',Capricorn:'Saturn',Aquarius:'Saturn',Pisces:'Jupiter'};
const navSign=lon=>((Math.floor(lon/(30/9))%12)+12)%12;
function show(tag,B){
  const r=A.calculateBirthChart(B);
  const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
  const L=r.lagna,m=pl.find(p=>p.name==='Moon');
  const H=p=>(((p.signNumber-L.signNumber+12)%12)+1);
  console.log('\n===== '+tag+' =====');
  console.log('LAGNA',L.signName,L.degreeInSign.toFixed(2),'| MOON',m.signName,m.degreeInSign.toFixed(2),m.nakshatra,'pada',m.nakshatraPada||m.pada);
  pl.forEach(p=>console.log('  ',p.name.padEnd(8),p.signName.padEnd(11),p.degreeInSign.toFixed(2).padStart(6),'H'+String(H(p)).padStart(2),p.nakshatra.padEnd(16),(p.dignity||'').padEnd(12),(p.retrograde?'R':' '),(p.isCombust?'CMB':'')));
  [[2,'DHAN/family'],[4,'HOME'],[7,'SPOUSE'],[8,'in-law wealth/joint'],[11,'GAINS']].forEach(([h,tag2])=>{
    const sn=((L.signNumber-1+h-1)%12)+1,ld=LORD[SN[sn-1]],p=pl.find(x=>x.name===ld);
    console.log('   H'+String(h).padStart(2),tag2.padEnd(20),SN[sn-1].padEnd(11),'occ:',(pl.filter(x=>x.signNumber===sn).map(x=>x.name).join(',')||'-').padEnd(22),'lord',ld,'H'+H(p),p.dignity||'',p.retrograde?'R':'');});
  const ma=pl.find(p=>p.name==='Mars');
  const mg=[H(ma),(((ma.signNumber-m.signNumber+12)%12)+1)];
  console.log('   MANGLIK: from lagna H'+mg[0],[1,2,4,7,8,12].includes(mg[0])?'YES':'no','| from Moon H'+mg[1],[1,2,4,7,8,12].includes(mg[1])?'YES':'no','| Mars in',ma.signName,ma.dignity||'');
  let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
  const d=A.calculateVimshottariDasha(new Date(B.date+'T'+B.time+':00+05:45'),nak,(m.longitude%13.3333333),3);
  const T=new Date('2026-08-12');
  const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
  const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
  console.log('   DASHA MD',md.planet,'AD',ad.planet,(''+ad.startDate).slice(0,10),'->',(''+ad.endDate).slice(0,10));
  md.subPeriods.forEach(p=>{if(new Date(p.endDate)>new Date('2026-01-01')&&new Date(p.startDate)<new Date('2031-01-01'))console.log('      AD',p.planet.padEnd(8),(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10));});
  console.log('   D9 lagna',SN[navSign(L.longitude)],'| D9:',pl.map(p=>p.name.slice(0,2)+'='+SN[navSign(p.longitude)].slice(0,3)).join(' '));
  return {L,m,pl,H};
}
const her=show('ABINA (bride)',HER);
const him=show('JEMS (groom)',HIM);
console.log('\n>>> CROSS-CHECK: she said his moon sign is TAURUS. Engine says:',him.m.signName, him.m.signName==='Taurus'?'MATCH, his data is good':'MISMATCH');

console.log('\n===== MILAN, HAND COMPUTED =====');
const bs=her.m.signNumber, gs=him.m.signNumber;
const fwd=((gs-bs+12)%12)+1, rev=((bs-gs+12)%12)+1;
console.log('bride moon',her.m.signName,'| groom moon',him.m.signName,'| counts',fwd,'/',rev);
const pair=[fwd,rev].sort((a,b)=>a-b).join('/');
console.log('BHAKOOT pair',pair,'->',['2/12','5/9','6/8'].includes(pair)?'DOSHA 0/7':'OK 7/7');
const NAK=['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishtha','Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati'];
const idx=n=>NAK.findIndex(x=>x.toLowerCase()===String(n).toLowerCase().replace('moola','mula'));
const NADI=['Adi','Madhya','Antya'], nadiMap=[0,1,2,2,1,0,0,1,2,2,1,0,0,1,2,2,1,0,0,1,2,2,1,0,0,1,2];
const GANA=['Deva','Manushya','Rakshasa'], ganaMap=[0,1,2,1,0,1,0,0,2,2,1,1,0,2,0,2,0,2,2,1,1,0,2,2,1,1,0];
const bi=idx(her.m.nakshatra), gi=idx(him.m.nakshatra);
console.log('NADI  bride',NADI[nadiMap[bi]],'groom',NADI[nadiMap[gi]],'->',nadiMap[bi]===nadiMap[gi]?'DOSHA 0/8':'OK 8/8');
console.log('GANA  bride',GANA[ganaMap[bi]],'groom',GANA[ganaMap[gi]]);
// Tara
const t1=((gi-bi+27)%27+1)%9, t2=((bi-gi+27)%27+1)%9;
console.log('TARA  bride->groom rem',t1,'groom->bride rem',t2,'( 3,5,7 are inauspicious )');
// graha maitri via moon-sign lords
console.log('GRAHA MAITRI  bride lord',LORD[her.m.signName],'| groom lord',LORD[him.m.signName]);
