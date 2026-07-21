const A=require('./index.js');
const ABBR={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
// Pokhara 28.2096N 83.9856E; 23 Aug 1987 17:40 NPT (+5:45) => UTC 11:55
const birth={date:'1987-08-23',time:'17:40',latitude:28.2096,longitude:83.9856,timezone:'Asia/Kathmandu'};
const res=A.calculateBirthChart(birth);
const plist=Array.isArray(res.planets)?res.planets:Object.values(res.planets);
const m=plist.find(p=>p.name==='Moon');
console.log('LAGNA',res.lagna.signName,res.lagna.signNumber,res.lagna.nakshatra,'| MOON',m.signName,m.nakshatra);
(res.houses||[]).forEach(h=>console.log('H'+(h.houseNumber||h.number),h.signName||h.sign,(h.planets||[]).map(x=>x.name||x).join(',')));
plist.forEach(p=>console.log('P',ABBR[p.name],p.signName||p.sign,'deg='+p.degreeInSign,'nak='+p.nakshatra,'dig='+(p.dignity||''),'retro='+!!p.retrograde));
const L=res.lagna;
[7,9].forEach(dv=>{
 const dc=A.calculateDivisionalChart(dv,plist,L.signNumber,L.degreeInSign);
 const lag=dc.lagnaSign.number;
 console.log('--- D'+dv+' LAGNA',dc.lagnaSign.name);
 dc.planets.forEach(p=>console.log('D'+dv,p.planet,p.vargaSignName,'house='+(((p.vargaSignNumber-lag+12)%12)+1)));
});
const d=A.calculateVimshottariDasha(new Date('1987-08-23T11:55:00Z'),m.nakshatra,(m.longitude%13.3333333),3);
const TODAY=new Date('2026-07-19');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=TODAY&&new Date(p.endDate)>TODAY);
console.log('MD',md.planet,(''+md.startDate).slice(0,10),'→',(''+md.endDate).slice(0,10));
md.subPeriods.forEach(p=>{if(new Date(p.endDate)>new Date('2025-01-01')&&new Date(p.startDate)<new Date('2033-01-01'))console.log(' AD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10));});
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=TODAY&&new Date(p.endDate)>TODAY);
console.log('CUR AD',ad.planet);
(ad.subPeriods||[]).forEach(p=>console.log('   PD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));
const i=md.subPeriods.indexOf(ad);
[1,2].forEach(k=>{const n=md.subPeriods[i+k];if(n){console.log(' NEXT AD',n.planet,(''+n.startDate).slice(0,10),'→',(''+n.endDate).slice(0,10));(n.subPeriods||[]).forEach(p=>console.log('    PD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));}});
const mi=d.mahaDashas.indexOf(md);if(d.mahaDashas[mi+1])console.log('NEXT MD',d.mahaDashas[mi+1].planet,(''+d.mahaDashas[mi+1].startDate).slice(0,10),'→',(''+d.mahaDashas[mi+1].endDate).slice(0,10));
