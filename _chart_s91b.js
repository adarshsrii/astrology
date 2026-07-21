const A=require('./index.js');
// Murwillumbah NSW -28.3283, 153.3983; 2 Nov 1992 03:12:33 AEDT (+11) => UTC 1 Nov 16:12
const birth={date:'1992-11-02',time:'03:12',latitude:-28.3283,longitude:153.3983,timezone:'Australia/Sydney'};
const res=A.calculateBirthChart(birth);
const plist=Array.isArray(res.planets)?res.planets:Object.values(res.planets);
const m=plist.find(p=>p.name==='Moon');
const L=res.lagna;
console.log('LAGNA',L.signName,L.signNumber,L.nakshatra,'deg',L.degreeInSign,'| MOON',m.signName,m.nakshatra);
(res.houses||[]).forEach(h=>console.log('H'+(h.houseNumber||h.number),h.signName||h.sign,(h.planets||[]).map(x=>x.name||x).join(',')));
plist.forEach(p=>console.log('P',p.name,p.signName,'deg='+p.degreeInSign,'nak='+p.nakshatra,'dig='+p.dignity,'retro='+p.retrograde));
[9].forEach(dv=>{const dc=A.calculateDivisionalChart(dv,plist,L.signNumber,L.degreeInSign);const lag=dc.lagnaSign.number;
 console.log('--- D'+dv+' LAGNA',dc.lagnaSign.name);
 dc.planets.forEach(p=>console.log('D'+dv,p.planet,p.vargaSignName,'house='+(((p.vargaSignNumber-lag+12)%12)+1)));});
const d=A.calculateVimshottariDasha(new Date('1992-11-01T16:12:00Z'),m.nakshatra,(m.longitude%13.3333333),3);
const TODAY=new Date('2026-07-20');
d.mahaDashas.forEach(p=>console.log('MD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=TODAY&&new Date(p.endDate)>TODAY);
console.log('CUR MD',md.planet);
md.subPeriods.forEach(p=>console.log(' AD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=TODAY&&new Date(p.endDate)>TODAY);
console.log('CUR AD',ad.planet);
const mars=md.subPeriods.find(p=>p.planet==='Mars');
if(mars)(mars.subPeriods||[]).forEach(p=>console.log('  RaMa-PD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));
const sat=d.mahaDashas.find(p=>p.planet==='Saturn');
if(sat){console.log('SAT MD',(''+sat.startDate).slice(0,10),'→',(''+sat.endDate).slice(0,10));
 sat.subPeriods.forEach(p=>console.log('  SatAD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));}
