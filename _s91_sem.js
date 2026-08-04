const A=require('./index.js');
const LAT=-28.33,LON=153.40,TZ='Australia/Sydney';
const res=A.calculateBirthChart({date:'1992-11-02',time:'03:12',latitude:LAT,longitude:LON,timezone:TZ});
const plist=Array.isArray(res.planets)?res.planets:Object.values(res.planets);
const L=res.lagna,m=plist.find(p=>p.name==='Moon');
const d=A.calculateVimshottariDasha(new Date('1992-11-01T17:12:00Z'),m.nakshatra,(m.longitude%13.3333333),4);
const TODAY=new Date('2026-07-29');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=TODAY&&new Date(p.endDate)>TODAY);
console.log('MD',md.planet,(''+md.startDate).slice(0,10),'→',(''+md.endDate).slice(0,10));
md.subPeriods.forEach(p=>{if(new Date(p.endDate)>new Date('2025-01-01'))console.log(' AD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10));});
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=TODAY&&new Date(p.endDate)>TODAY);
console.log('CUR AD',ad.planet);
(ad.subPeriods||[]).forEach(p=>{if(new Date(p.endDate)>new Date('2026-01-01'))console.log('   PD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10));});
const nx=md.subPeriods[md.subPeriods.indexOf(ad)+1];
if(nx){console.log('NEXT AD',nx.planet,(''+nx.startDate).slice(0,10),'→',(''+nx.endDate).slice(0,10));
(nx.subPeriods||[]).slice(0,5).forEach(p=>console.log('   nPD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));}
console.log('--- natal deg');
plist.forEach(p=>console.log(p.name,p.signName,p.degreeInSign.toFixed(2),p.nakshatra,'H'+(((p.signNumber-L.signNumber+12)%12)+1)));
console.log('Moon sign',m.signName,m.signNumber);
['2026-07-29','2026-10-15','2026-12-15','2027-03-15','2027-06-15','2027-09-15'].forEach(dt=>{
 const t=A.calculateBirthChart({date:dt,time:'12:00',latitude:LAT,longitude:LON,timezone:TZ});
 const tp=Array.isArray(t.planets)?t.planets:Object.values(t.planets);
 const s=tp.filter(p=>['Jupiter','Saturn','Rahu','Ketu'].includes(p.name)).map(p=>p.name+':'+p.signName+p.degreeInSign.toFixed(0)+'(L'+(((p.signNumber-L.signNumber+12)%12)+1)+'/M'+(((p.signNumber-m.signNumber+12)%12)+1)+')').join('  ');
 console.log('TR',dt,s);
});
