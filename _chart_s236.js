const A=require('./index.js');
const LAT=27.43,LON=85.03,TZ='Asia/Kathmandu';
const res=A.calculateBirthChart({date:'1999-05-24',time:'12:15',latitude:LAT,longitude:LON,timezone:TZ});
const plist=Array.isArray(res.planets)?res.planets:Object.values(res.planets);
const L=res.lagna,m=plist.find(p=>p.name==='Moon');
console.log('LAGNA',L.signName,L.signNumber,L.nakshatra,'deg',L.degreeInSign.toFixed(2));
(res.houses||[]).forEach(h=>console.log('H'+(h.houseNumber||h.number),h.signName||h.sign,(h.planets||[]).map(x=>x.name||x).join(',')));
plist.forEach(p=>console.log('P',p.name,p.signName,'deg='+p.degreeInSign.toFixed(1),'nak='+p.nakshatra,'dig='+p.dignity,'retro='+p.retrograde,'combust='+p.isCombust));
[9,24].forEach(dv=>{try{const dc=A.calculateDivisionalChart(dv,plist,L.signNumber,L.degreeInSign);const lag=dc.lagnaSign.number;
 console.log('--- D'+dv+' LAGNA',dc.lagnaSign.name);
 dc.planets.forEach(p=>console.log('D'+dv,p.planet,p.vargaSignName,'house='+(((p.vargaSignNumber-lag+12)%12)+1)));}catch(e){console.log('D'+dv+' ERR',e.message)}});
try{console.log('YOGAS',JSON.stringify((A.detectYogas(plist,res.houses,L)||[]).slice(0,12)));}catch(e){}
const d=A.calculateVimshottariDasha(new Date('1999-05-24T06:30:00Z'),m.nakshatra,(m.longitude%13.3333333),3);
const TODAY=new Date('2026-07-22');
d.mahaDashas.forEach(p=>console.log('MD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=TODAY&&new Date(p.endDate)>TODAY);
console.log('CUR MD',md.planet,(''+md.startDate).slice(0,10),'→',(''+md.endDate).slice(0,10));
md.subPeriods.forEach(p=>{if(new Date(p.endDate)>new Date('2020-01-01'))console.log('  AD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10));});
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=TODAY&&new Date(p.endDate)>TODAY);
console.log('CUR AD',ad.planet);
(ad.subPeriods||[]).forEach(p=>console.log('   PD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));
const mi=d.mahaDashas.indexOf(md);
if(d.mahaDashas[mi-1]){const pm=d.mahaDashas[mi-1];console.log('PREV MD',pm.planet,(''+pm.startDate).slice(0,10),'→',(''+pm.endDate).slice(0,10));pm.subPeriods.forEach(p=>{if(new Date(p.endDate)>new Date('2019-01-01'))console.log('  prevAD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10));});}
['2026-07-22','2026-12-05','2027-02-15'].forEach(dt=>{const t=A.calculateBirthChart({date:dt,time:'12:00',latitude:LAT,longitude:LON,timezone:TZ});
console.log('--- TRANSIT',dt);
(Array.isArray(t.planets)?t.planets:Object.values(t.planets)).forEach(p=>{if(['Jupiter','Saturn','Rahu','Ketu'].includes(p.name))console.log('TR',p.name,p.signName,'fromLagna=H'+(((p.signNumber-L.signNumber+12)%12)+1),'fromMoon=H'+(((p.signNumber-m.signNumber+12)%12)+1));});});
try{console.log('SADESATI',JSON.stringify(A.calculateSadeSatiPeriod(m.signNumber,new Date('2026-07-22')).slice?JSON.parse('null'):null));}catch(e){}
