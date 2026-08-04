const A=require('./index.js');
const LAT=23.0225,LON=72.5714,TZ='Asia/Kolkata',DATE='1975-12-08',TIME='14:00';
const res=A.calculateBirthChart({date:DATE,time:TIME,latitude:LAT,longitude:LON,timezone:TZ});
const pl=Array.isArray(res.planets)?res.planets:Object.values(res.planets);
const L=res.lagna,m=pl.find(p=>p.name==='Moon');
console.log('LAGNA',L.signName,L.signNumber,L.nakshatra,L.degreeInSign.toFixed(2));
pl.forEach(p=>console.log('P',p.name,p.signName,p.degreeInSign.toFixed(2),'H'+(((p.signNumber-L.signNumber+12)%12)+1),'nak='+p.nakshatra,'pada='+(p.nakshatraPada||p.pada||''),'dig='+p.dignity,(p.retrograde?'R':''),(p.isCombust?'CMB':'')));
console.log('MOON',m.signName,m.nakshatra);
try{const dc=A.calculateDivisionalChart(9,pl,L.signNumber,L.degreeInSign);const lg=dc.lagnaSign.number;
console.log('D9 LAGNA',dc.lagnaSign.name);dc.planets.forEach(p=>console.log(' D9',p.planet,p.vargaSignName,'H'+(((p.vargaSignNumber-lg+12)%12)+1)));}catch(e){}
try{const dc=A.calculateDivisionalChart(10,pl,L.signNumber,L.degreeInSign);const lg=dc.lagnaSign.number;
console.log('D10 LAGNA',dc.lagnaSign.name);dc.planets.forEach(p=>console.log(' D10',p.planet,p.vargaSignName,'H'+(((p.vargaSignNumber-lg+12)%12)+1)));}catch(e){console.log('d10 err',e.message)}
let nak=m.nakshatra;if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date(DATE+'T'+TIME+':00+05:30'),nak,(m.longitude%13.3333333),4);
const T=new Date('2026-07-29');
d.mahaDashas.forEach(p=>console.log('MD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
console.log('CUR MD',md.planet);
md.subPeriods.forEach(p=>console.log('  AD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
console.log('CUR AD',ad.planet);
(ad.subPeriods||[]).forEach(p=>{console.log('   PD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10));
 if(new Date(p.startDate)<=new Date('2027-06-01')&&new Date(p.endDate)>new Date('2026-01-01'))(p.subPeriods||[]).forEach(q=>console.log('      SD',q.planet,(''+q.startDate).slice(0,10),'→',(''+q.endDate).slice(0,10)));});
const nx=md.subPeriods[md.subPeriods.indexOf(ad)+1];
if(nx){console.log('NEXT AD',nx.planet,(''+nx.startDate).slice(0,10),'→',(''+nx.endDate).slice(0,10));}
['2026-07-29','2026-10-15','2027-01-15','2027-04-15','2027-08-15'].forEach(dt=>{
 const t=A.calculateBirthChart({date:dt,time:'12:00',latitude:LAT,longitude:LON,timezone:TZ});
 const tp=Array.isArray(t.planets)?t.planets:Object.values(t.planets);
 console.log('TR',dt,tp.filter(p=>['Jupiter','Saturn','Rahu','Ketu'].includes(p.name)).map(p=>p.name+':'+p.signName+'(L'+(((p.signNumber-L.signNumber+12)%12)+1)+'/M'+(((p.signNumber-m.signNumber+12)%12)+1)+')').join(' '));});
