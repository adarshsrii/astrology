const A=require('./index.js');
const LAT=30.3165,LON=78.0322,TZ='Asia/Kolkata',DATE='2002-05-18',TIME='06:20';
const res=A.calculateBirthChart({date:DATE,time:TIME,latitude:LAT,longitude:LON,timezone:TZ});
const pl=Array.isArray(res.planets)?res.planets:Object.values(res.planets);
const L=res.lagna,m=pl.find(p=>p.name==='Moon');
console.log('LAGNA',L.signName,L.signNumber,L.nakshatra,L.degreeInSign.toFixed(2));
pl.forEach(p=>console.log('P',p.name,p.signName,p.degreeInSign.toFixed(2),'H'+(((p.signNumber-L.signNumber+12)%12)+1),'nak='+p.nakshatra,'pada='+(p.nakshatraPada||p.pada||''),'dig='+p.dignity,(p.retrograde?'R':''),(p.isCombust?'CMB':'')));
try{const dc=A.calculateDivisionalChart(9,pl,L.signNumber,L.degreeInSign);const lg=dc.lagnaSign.number;
console.log('D9 LAGNA',dc.lagnaSign.name);dc.planets.forEach(p=>console.log(' D9',p.planet,p.vargaSignName,'H'+(((p.vargaSignNumber-lg+12)%12)+1)));}catch(e){}
let nak=m.nakshatra;if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date(DATE+'T'+TIME+':00+05:30'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-07-29');
d.mahaDashas.forEach(p=>console.log('MD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
console.log('CUR MD',md.planet);
md.subPeriods.forEach(p=>console.log('  AD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
console.log('CUR AD',ad.planet);
(ad.subPeriods||[]).forEach(p=>console.log('   PD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));
