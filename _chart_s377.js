const A=require('./index.js');
const LAT=27.5049,LON=83.4501,TZ='Asia/Kathmandu';
const DATE='2002-10-24',TIME='00:55';
const res=A.calculateBirthChart({date:DATE,time:TIME,latitude:LAT,longitude:LON,timezone:TZ});
const plist=Array.isArray(res.planets)?res.planets:Object.values(res.planets);
const L=res.lagna,m=plist.find(p=>p.name==='Moon');
console.log('LAGNA',L.signName,L.signNumber,L.nakshatra,'deg',L.degreeInSign.toFixed(2));
plist.forEach(p=>console.log('P',p.name,p.signName,p.degreeInSign.toFixed(2),'H'+(((p.signNumber-L.signNumber+12)%12)+1),'nak='+p.nakshatra,'pada='+(p.nakshatraPada||p.pada||''),'dig='+p.dignity,(p.retrograde?'R':''),(p.isCombust?'COMBUST':'')));
console.log('MOON sign',m.signName,m.signNumber,m.nakshatra);
try{console.log('YOGAS',(A.detectYogas(plist,res.houses,L)||[]).map(y=>y.name||y).join(', '));}catch(e){console.log('yoga err',e.message)}
try{console.log('MANGLIK',JSON.stringify(A.analyzeManglik(plist,L)));}catch(e){console.log('mang err',e.message)}
try{const dc=A.calculateDivisionalChart(9,plist,L.signNumber,L.degreeInSign);const lag=dc.lagnaSign.number;
console.log('D9 LAGNA',dc.lagnaSign.name);
dc.planets.forEach(p=>console.log(' D9',p.planet,p.vargaSignName,'H'+(((p.vargaSignNumber-lag+12)%12)+1)));}catch(e){console.log('d9 err',e.message)}
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date(DATE+'T'+TIME+':00+05:45'),nak,(m.longitude%13.3333333),3);
const TODAY=new Date('2026-07-29');
d.mahaDashas.forEach(p=>console.log('MD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=TODAY&&new Date(p.endDate)>TODAY);
console.log('CUR MD',md.planet);
md.subPeriods.forEach(p=>console.log('  AD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=TODAY&&new Date(p.endDate)>TODAY);
console.log('CUR AD',ad.planet);
(ad.subPeriods||[]).forEach(p=>console.log('   PD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));
const mi=d.mahaDashas.indexOf(md);const nm=d.mahaDashas[mi+1];
if(nm){console.log('NEXT MD',nm.planet,(''+nm.startDate).slice(0,10),'→',(''+nm.endDate).slice(0,10));
nm.subPeriods.slice(0,5).forEach(p=>console.log('  nAD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));}
