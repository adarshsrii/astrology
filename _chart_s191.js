const A=require('./index.js');
const LAT=27.70,LON=83.45,TZ='Asia/Kathmandu';
const res=A.calculateBirthChart({date:'1995-12-12',time:'17:45',latitude:LAT,longitude:LON,timezone:TZ});
const plist=Array.isArray(res.planets)?res.planets:Object.values(res.planets);
const L=res.lagna, m=plist.find(p=>p.name==='Moon');
console.log('LAGNA',L.signName,L.signNumber,L.nakshatra,'deg',L.degreeInSign.toFixed(2));
(res.houses||[]).forEach(h=>console.log('H'+(h.houseNumber||h.number),h.signName||h.sign,(h.planets||[]).map(x=>x.name||x).join(',')));
plist.forEach(p=>console.log('P',p.name,p.signName,'deg='+p.degreeInSign.toFixed(1),'nak='+p.nakshatra,'dig='+p.dignity,'retro='+p.retrograde));
[9].forEach(dv=>{const dc=A.calculateDivisionalChart(dv,plist,L.signNumber,L.degreeInSign);const lag=dc.lagnaSign.number;
 console.log('--- D'+dv+' LAGNA',dc.lagnaSign.name);
 dc.planets.forEach(p=>console.log('D'+dv,p.planet,p.vargaSignName,'house='+(((p.vargaSignNumber-lag+12)%12)+1)));});
try{console.log('YOGAS',JSON.stringify((A.detectYogas(plist,res.houses,L)||[]).slice(0,10)));}catch(e){}
const TODAY=new Date('2026-07-20');
[['12Dec(Ashlesha)','1995-12-12T12:00:00Z'],['13Dec(Magha)','1995-12-13T12:00:00Z']].forEach(([lbl,utc],i)=>{
 const r2=A.calculateBirthChart({date:i?'1995-12-13':'1995-12-12',time:'17:45',latitude:LAT,longitude:LON,timezone:TZ});
 const p2=Array.isArray(r2.planets)?r2.planets:Object.values(r2.planets);
 const mm=p2.find(p=>p.name==='Moon');
 const d=A.calculateVimshottariDasha(new Date(utc),mm.nakshatra,(mm.longitude%13.3333333),3);
 const md=d.mahaDashas.find(p=>new Date(p.startDate)<=TODAY&&new Date(p.endDate)>TODAY);
 console.log('=== '+lbl+' MD',md.planet,(''+md.startDate).slice(0,10),'→',(''+md.endDate).slice(0,10));
 md.subPeriods.forEach(p=>{if(new Date(p.endDate)>new Date('2025-01-01'))console.log('   AD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10));});
 const mi=d.mahaDashas.indexOf(md); if(d.mahaDashas[mi+1])console.log('   NEXT MD',d.mahaDashas[mi+1].planet,(''+d.mahaDashas[mi+1].startDate).slice(0,10));
});
const t=A.calculateBirthChart({date:'2026-07-20',time:'12:00',latitude:LAT,longitude:LON,timezone:TZ});
(Array.isArray(t.planets)?t.planets:Object.values(t.planets)).forEach(p=>{if(['Jupiter','Saturn','Rahu','Ketu'].includes(p.name))console.log('TRANSIT',p.name,p.signName,'houseFromLagna='+(((p.signNumber-L.signNumber+12)%12)+1));});
