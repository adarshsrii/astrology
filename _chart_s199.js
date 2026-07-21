const A=require('./index.js');
const LAT=27.62,LON=85.54,TZ='Asia/Kathmandu';
const res=A.calculateBirthChart({date:'1980-09-13',time:'17:35',latitude:LAT,longitude:LON,timezone:TZ});
const plist=Array.isArray(res.planets)?res.planets:Object.values(res.planets);
const L=res.lagna,m=plist.find(p=>p.name==='Moon');
console.log('LAGNA',L.signName,L.signNumber,L.nakshatra,'deg',L.degreeInSign.toFixed(2));
(res.houses||[]).forEach(h=>console.log('H'+(h.houseNumber||h.number),h.signName||h.sign,(h.planets||[]).map(x=>x.name||x).join(',')));
plist.forEach(p=>console.log('P',p.name,p.signName,'deg='+p.degreeInSign.toFixed(1),'nak='+p.nakshatra,'dig='+p.dignity,'retro='+p.retrograde,'combust='+p.isCombust));
[9,10].forEach(dv=>{const dc=A.calculateDivisionalChart(dv,plist,L.signNumber,L.degreeInSign);const lag=dc.lagnaSign.number;
 console.log('--- D'+dv+' LAGNA',dc.lagnaSign.name);
 dc.planets.forEach(p=>console.log('D'+dv,p.planet,p.vargaSignName,'house='+(((p.vargaSignNumber-lag+12)%12)+1)));});
try{console.log('YOGAS',JSON.stringify((A.detectYogas(plist,res.houses,L)||[]).slice(0,12)));}catch(e){}
const d=A.calculateVimshottariDasha(new Date('1980-09-13T12:05:00Z'),m.nakshatra,(m.longitude%13.3333333),3);
const TODAY=new Date('2026-07-20');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=TODAY&&new Date(p.endDate)>TODAY);
console.log('CUR MD',md.planet,(''+md.startDate).slice(0,10),'→',(''+md.endDate).slice(0,10));
md.subPeriods.forEach(p=>{if(new Date(p.endDate)>new Date('2025-01-01'))console.log('  AD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10));});
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=TODAY&&new Date(p.endDate)>TODAY);
console.log('CUR AD',ad.planet);
(ad.subPeriods||[]).forEach(p=>console.log('   PD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));
const i=md.subPeriods.indexOf(ad);const nx=md.subPeriods[i+1];
if(nx){console.log(' NEXT AD',nx.planet,(''+nx.startDate).slice(0,10),'→',(''+nx.endDate).slice(0,10));(nx.subPeriods||[]).slice(0,5).forEach(p=>console.log('    PD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));}
const mi=d.mahaDashas.indexOf(md);if(d.mahaDashas[mi+1])console.log('NEXT MD',d.mahaDashas[mi+1].planet,(''+d.mahaDashas[mi+1].startDate).slice(0,10));
const t=A.calculateBirthChart({date:'2026-07-20',time:'12:00',latitude:LAT,longitude:LON,timezone:TZ});
(Array.isArray(t.planets)?t.planets:Object.values(t.planets)).forEach(p=>{if(['Jupiter','Saturn','Rahu','Ketu','Mars'].includes(p.name))console.log('TRANSIT',p.name,p.signName,'H'+(((p.signNumber-L.signNumber+12)%12)+1));});
