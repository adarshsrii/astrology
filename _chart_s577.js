const A=require('./index.js');
// s577 Sunita — bride 3 Jan 1999 16:10 Jhapa (Birtamod) | groom 19 May 1990 07:00 Kathmandu
const BR={date:'1999-01-03',time:'16:10',latitude:26.6446,longitude:87.9866,timezone:'Asia/Kathmandu'};
const GR={date:'1990-05-19',time:'07:00',latitude:27.7172,longitude:85.3240,timezone:'Asia/Kathmandu'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];

function show(tag,B){
  const r=A.calculateBirthChart(B);
  const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
  const L=r.lagna,m=pl.find(p=>p.name==='Moon');
  const H=p=>(((p.signNumber-L.signNumber+12)%12)+1);
  console.log('\n===== '+tag+' =====');
  console.log('LAGNA',L.signName,L.degreeInSign.toFixed(2),L.nakshatra);
  console.log('MOON ',m.signName,m.degreeInSign.toFixed(2),m.nakshatra,'pada',m.nakshatraPada||m.pada);
  pl.forEach(p=>console.log('  ',p.name.padEnd(8),p.signName.padEnd(11),p.degreeInSign.toFixed(2).padStart(6),'H'+String(H(p)).padStart(2),p.nakshatra.padEnd(16),(p.dignity||'').padEnd(12),(p.retrograde?'R':' '),(p.isCombust?'CMB':'')));
  console.log(' HOUSES');
  for(let i=0;i<12;i++){const sn=((L.signNumber-1+i)%12)+1;console.log('   H'+String(i+1).padStart(2),SN[sn-1].padEnd(11),pl.filter(p=>p.signNumber===sn).map(p=>p.name).join(','));}
  // 7th house + lord
  const sn7=((L.signNumber-1+6)%12)+1;
  console.log(' 7TH HOUSE:',SN[sn7-1],'occupants:',pl.filter(p=>p.signNumber===sn7).map(p=>p.name).join(',')||'(empty)');
  try{const mg=A.analyzeManglik(pl,L);console.log(' MANGLIK:',JSON.stringify(mg).slice(0,400));}catch(e){console.log(' manglik err',e.message);}
  // lagna stability
  [-10,0,10].forEach(off=>{const [hh,mm]=B.time.split(':').map(Number);let t=hh*60+mm+off;
    const tt=String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0');
    const q=A.calculateBirthChart({...B,time:tt});
    console.log('  SENS',String(off).padStart(3),tt,'lagna',q.lagna.signName,q.lagna.degreeInSign.toFixed(2));});
  const d9=A.calculateDivisionalChart(9,pl,L);
  console.log(' D9:',d9.planets.map(p=>p.planet+'='+p.vargaSignName).join('  '));
  let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
  const d=A.calculateVimshottariDasha(new Date(B.date+'T'+B.time+':00+05:45'),nak,(m.longitude%13.3333333),3);
  const T=new Date('2026-08-12');
  const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
  const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
  console.log(' DASHA now: MD',md.planet,(''+md.startDate).slice(0,10),'->',(''+md.endDate).slice(0,10),'| AD',ad.planet,(''+ad.startDate).slice(0,10),'->',(''+ad.endDate).slice(0,10));
  md.subPeriods.forEach(p=>{if(new Date(p.endDate)>new Date('2026-01-01')&&new Date(p.startDate)<new Date('2029-06-01'))console.log('    AD',p.planet.padEnd(8),(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10));});
  return {r,pl,L,m};
}
const b=show('BRIDE Sunita',BR);
const g=show('GROOM',GR);

console.log('\n\n===== ASHTAKOOT MILAN (engine) =====');
try{const mil=A.calculateAshtakootMilan(
   {moonSign:b.m.signName,moonSignNumber:b.m.signNumber,nakshatra:b.m.nakshatra,nakshatraPada:b.m.nakshatraPada||b.m.pada,moonLongitude:b.m.longitude},
   {moonSign:g.m.signName,moonSignNumber:g.m.signNumber,nakshatra:g.m.nakshatra,nakshatraPada:g.m.nakshatraPada||g.m.pada,moonLongitude:g.m.longitude});
 console.log(JSON.stringify(mil,null,1));}catch(e){console.log('milan err',e.message);}

// HAND CHECK of Bhakoot (engine has a known off-by-one) + Nadi + Gana
console.log('\n===== HAND CHECK =====');
const bs=b.m.signNumber, gs=g.m.signNumber;
const fwd=((gs-bs+12)%12)+1;   // bride -> groom
const rev=((bs-gs+12)%12)+1;   // groom -> bride
console.log('bride moon sign',b.m.signName,'('+bs+')  groom moon sign',g.m.signName,'('+gs+')');
console.log('count bride->groom =',fwd,' groom->bride =',rev);
const pair=[fwd,rev].sort((x,y)=>x-y).join('/');
const bad=['2/12','5/9','6/8'];
console.log('mutual pair =',pair,'-> Bhakoot',bad.includes(pair)?'DOSHA (0/7)':'OK (7/7)');
const NAK=['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishtha','Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati'];
const NADI=['Adi','Madhya','Antya'];
const nadiOf=n=>{const i=NAK.findIndex(x=>x.toLowerCase()===String(n).toLowerCase().replace('moola','mula'));return i<0?'?':NADI[[0,1,2,2,1,0,0,1,2,2,1,0,0,1,2,2,1,0,0,1,2,2,1,0,0,1,2][i]];};
console.log('bride nak',b.m.nakshatra,'nadi',nadiOf(b.m.nakshatra),'| groom nak',g.m.nakshatra,'nadi',nadiOf(g.m.nakshatra),
  '->','Nadi',nadiOf(b.m.nakshatra)===nadiOf(g.m.nakshatra)?'DOSHA (0/8)':'OK (8/8)');
