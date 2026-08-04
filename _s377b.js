const A=require('./index.js');
const LAT=27.5049,LON=83.4501,TZ='Asia/Kathmandu';
const res=A.calculateBirthChart({date:'2002-10-24',time:'00:55',latitude:LAT,longitude:LON,timezone:TZ});
const plist=Array.isArray(res.planets)?res.planets:Object.values(res.planets);
const L=res.lagna,m=plist.find(p=>p.name==='Moon');
const d=A.calculateVimshottariDasha(new Date('2002-10-24T00:55:00+05:45'),m.nakshatra,(m.longitude%13.3333333),4);
const md=d.mahaDashas.find(p=>p.planet==='Rahu');
['Jupiter','Saturn'].forEach(n=>{const ad=md.subPeriods.find(p=>p.planet===n);
 console.log('== Rahu-'+n,(''+ad.startDate).slice(0,10),'→',(''+ad.endDate).slice(0,10));
 (ad.subPeriods||[]).forEach(p=>console.log('   PD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));});
// Jupiter/Saturn transits over 7th (Capricorn) and Moon sign Taurus
['2026-07-29','2027-01-15','2027-07-15','2028-01-15','2028-07-15','2029-01-15','2029-07-15','2030-01-15'].forEach(dt=>{
 const t=A.calculateBirthChart({date:dt,time:'12:00',latitude:LAT,longitude:LON,timezone:TZ});
 const tp=Array.isArray(t.planets)?t.planets:Object.values(t.planets);
 console.log('TR',dt,tp.filter(p=>['Jupiter','Saturn'].includes(p.name)).map(p=>p.name+':'+p.signName+'(L'+(((p.signNumber-L.signNumber+12)%12)+1)+'/M'+(((p.signNumber-m.signNumber+12)%12)+1)+')').join(' '));
});
