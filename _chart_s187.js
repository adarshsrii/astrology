const A=require('./index.js');
// Kathmandu 27.7172N 85.3240E; 20 Jan 1991 18:15 NPT (+5:45) => UTC 12:30
const birth={date:'1991-01-20',time:'18:15',latitude:27.7172,longitude:85.3240,timezone:'Asia/Kathmandu'};
const res=A.calculateBirthChart(birth);
const plist=Array.isArray(res.planets)?res.planets:Object.values(res.planets);
const m=plist.find(p=>p.name==='Moon');
console.log('LAGNA',res.lagna.signName,res.lagna.signNumber,res.lagna.nakshatra,'deg',res.lagna.degreeInSign,'| MOON',m.signName,m.nakshatra);
(res.houses||[]).forEach(h=>console.log('H'+(h.houseNumber||h.number),h.signName||h.sign,(h.planets||[]).map(x=>x.name||x).join(',')));
plist.forEach(p=>console.log('P',p.name,p.signName,'deg='+p.degreeInSign,'nak='+p.nakshatra,'dig='+p.dignity,'retro='+p.retrograde,'combust='+p.isCombust));
const L=res.lagna;
[9,10].forEach(dv=>{const dc=A.calculateDivisionalChart(dv,plist,L.signNumber,L.degreeInSign);const lag=dc.lagnaSign.number;
 console.log('--- D'+dv+' LAGNA',dc.lagnaSign.name);
 dc.planets.forEach(p=>console.log('D'+dv,p.planet,p.vargaSignName,'house='+(((p.vargaSignNumber-lag+12)%12)+1)));});
try{console.log('YOGAS',JSON.stringify((A.detectYogas(plist,res.houses,L)||[]).slice(0,15)));}catch(e){console.log('yoga err',e.message)}
const d=A.calculateVimshottariDasha(new Date('1991-01-20T12:30:00Z'),m.nakshatra,(m.longitude%13.3333333),3);
const TODAY=new Date('2026-07-19');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=TODAY&&new Date(p.endDate)>TODAY);
console.log('MD',md.planet,(''+md.startDate).slice(0,10),'→',(''+md.endDate).slice(0,10));
md.subPeriods.forEach(p=>{if(new Date(p.endDate)>new Date('2025-06-01')&&new Date(p.startDate)<new Date('2034-01-01'))console.log(' AD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10));});
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=TODAY&&new Date(p.endDate)>TODAY);
console.log('CUR AD',ad.planet);
(ad.subPeriods||[]).forEach(p=>console.log('   PD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));
const i=md.subPeriods.indexOf(ad);
[1,2].forEach(k=>{const n=md.subPeriods[i+k];if(n){console.log(' NEXT AD',n.planet,(''+n.startDate).slice(0,10),'→',(''+n.endDate).slice(0,10));(n.subPeriods||[]).slice(0,4).forEach(p=>console.log('    PD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));}});
const mi=d.mahaDashas.indexOf(md);if(d.mahaDashas[mi+1])console.log('NEXT MD',d.mahaDashas[mi+1].planet,(''+d.mahaDashas[mi+1].startDate).slice(0,10),'→',(''+d.mahaDashas[mi+1].endDate).slice(0,10));
