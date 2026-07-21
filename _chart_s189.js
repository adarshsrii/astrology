const A=require('./index.js');
const LAT=27.90,LON=85.16,TZ='Asia/Kathmandu';
['16:20','16:30','16:45','17:00'].forEach(t=>{
 const r=A.calculateBirthChart({date:'1997-04-05',time:t,latitude:LAT,longitude:LON,timezone:TZ});
 console.log('t='+t,'LAGNA',r.lagna.signName,r.lagna.degreeInSign.toFixed(1));
});
const res=A.calculateBirthChart({date:'1997-04-05',time:'16:30',latitude:LAT,longitude:LON,timezone:TZ});
const plist=Array.isArray(res.planets)?res.planets:Object.values(res.planets);
const L=res.lagna,m=plist.find(p=>p.name==='Moon');
console.log('=== LEO LAGNA CHART (16:30) ===');
(res.houses||[]).forEach(h=>console.log('H'+(h.houseNumber||h.number),h.signName||h.sign,(h.planets||[]).map(x=>x.name||x).join(',')));
plist.forEach(p=>console.log('P',p.name,p.signName,'deg='+p.degreeInSign.toFixed(1),'nak='+p.nakshatra,'dig='+p.dignity,'retro='+p.retrograde));
console.log('MOON SIGN (Chandra lagna):',m.signName);
// houses counted from Moon
plist.forEach(p=>{const h=((p.signNumber-m.signNumber+12)%12)+1;console.log('  fromMoon',p.name,'H'+h);});
const d=A.calculateVimshottariDasha(new Date('1997-04-05T10:45:00Z'),m.nakshatra,(m.longitude%13.3333333),3);
const TODAY=new Date('2026-07-20');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=TODAY&&new Date(p.endDate)>TODAY);
console.log('MD',md.planet,(''+md.startDate).slice(0,10),'→',(''+md.endDate).slice(0,10));
md.subPeriods.forEach(p=>{if(new Date(p.endDate)>new Date('2025-01-01'))console.log('  AD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10));});
const mi=d.mahaDashas.indexOf(md);if(d.mahaDashas[mi+1])console.log('NEXT MD',d.mahaDashas[mi+1].planet,(''+d.mahaDashas[mi+1].startDate).slice(0,10));
const t=A.calculateBirthChart({date:'2026-07-20',time:'12:00',latitude:LAT,longitude:LON,timezone:TZ});
(Array.isArray(t.planets)?t.planets:Object.values(t.planets)).forEach(p=>{if(['Jupiter','Saturn','Rahu','Ketu'].includes(p.name))console.log('TRANSIT',p.name,p.signName,'fromLeoLagna=H'+(((p.signNumber-L.signNumber+12)%12)+1),'fromMoon=H'+(((p.signNumber-m.signNumber+12)%12)+1));});
