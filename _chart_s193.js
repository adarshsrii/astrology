const A=require('./index.js');
// Munger, Bihar 25.3748N 86.4735E; 17 Feb 1987 23:58 IST (+5:30) => UTC 18:28
const birth={date:'1987-02-17',time:'23:58',latitude:25.3748,longitude:86.4735,timezone:'Asia/Kolkata'};
const res=A.calculateBirthChart(birth);
const plist=Array.isArray(res.planets)?res.planets:Object.values(res.planets);
const m=plist.find(p=>p.name==='Moon');
const L=res.lagna;
console.log('LAGNA',L.signName,L.signNumber,L.nakshatra,'deg',L.degreeInSign,'| MOON',m.signName,m.nakshatra);
(res.houses||[]).forEach(h=>console.log('H'+(h.houseNumber||h.number),h.signName||h.sign,(h.planets||[]).map(x=>x.name||x).join(',')));
plist.forEach(p=>console.log('P',p.name,p.signName,'deg='+p.degreeInSign,'nak='+p.nakshatra,'dig='+p.dignity,'retro='+p.retrograde));
[9,10].forEach(dv=>{const dc=A.calculateDivisionalChart(dv,plist,L.signNumber,L.degreeInSign);const lag=dc.lagnaSign.number;
 console.log('--- D'+dv+' LAGNA',dc.lagnaSign.name);
 dc.planets.forEach(p=>console.log('D'+dv,p.planet,p.vargaSignName,'house='+(((p.vargaSignNumber-lag+12)%12)+1)));});
try{console.log('YOGAS',JSON.stringify((A.detectYogas(plist,res.houses,L)||[]).slice(0,12)));}catch(e){}
const d=A.calculateVimshottariDasha(new Date('1987-02-17T18:28:00Z'),m.nakshatra,(m.longitude%13.3333333),3);
const TODAY=new Date('2026-07-20');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=TODAY&&new Date(p.endDate)>TODAY);
console.log('CUR MD',md.planet,(''+md.startDate).slice(0,10),'→',(''+md.endDate).slice(0,10));
md.subPeriods.forEach(p=>console.log(' AD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=TODAY&&new Date(p.endDate)>TODAY);
console.log('CUR AD',ad.planet);
const i=md.subPeriods.indexOf(ad);
[0,1,2].forEach(k=>{const n=md.subPeriods[i+k];if(n){console.log('AD',n.planet,(''+n.startDate).slice(0,10),'→',(''+n.endDate).slice(0,10));(n.subPeriods||[]).forEach(p=>console.log('   PD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));}});
const mi=d.mahaDashas.indexOf(md);if(d.mahaDashas[mi+1])console.log('NEXT MD',d.mahaDashas[mi+1].planet,(''+d.mahaDashas[mi+1].startDate).slice(0,10));
// transits now
const t=A.calculateBirthChart({date:'2026-07-20',time:'12:00',latitude:25.3748,longitude:86.4735,timezone:'Asia/Kolkata'});
const tp=Array.isArray(t.planets)?t.planets:Object.values(t.planets);
tp.forEach(p=>{if(['Jupiter','Saturn','Rahu','Ketu'].includes(p.name))console.log('TRANSIT',p.name,p.signName,p.degreeInSign.toFixed(1),'houseFromLagna='+(((p.signNumber-L.signNumber+12)%12)+1),'fromMoon='+(((p.signNumber-m.signNumber+12)%12)+1));});
