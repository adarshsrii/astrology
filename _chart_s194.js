const A=require('./index.js');
const LAT=23.9200,LON=90.7150,TZ='Asia/Dhaka';
const res=A.calculateBirthChart({date:'2006-12-01',time:'15:28',latitude:LAT,longitude:LON,timezone:TZ});
const plist=Array.isArray(res.planets)?res.planets:Object.values(res.planets);
const L=res.lagna,m=plist.find(p=>p.name==='Moon');
console.log('LAGNA',L.signName,L.signNumber,L.nakshatra,'deg',L.degreeInSign.toFixed(2));
(res.houses||[]).forEach(h=>console.log('H'+(h.houseNumber||h.number),h.signName||h.sign,(h.planets||[]).map(x=>x.name||x).join(',')));
plist.forEach(p=>console.log('P',p.name,p.signName,'deg='+p.degreeInSign.toFixed(1),'nak='+p.nakshatra,'dig='+p.dignity,'retro='+p.retrograde,'combust='+p.isCombust));
[9].forEach(dv=>{const dc=A.calculateDivisionalChart(dv,plist,L.signNumber,L.degreeInSign);const lag=dc.lagnaSign.number;
 console.log('--- D'+dv+' LAGNA',dc.lagnaSign.name);
 dc.planets.forEach(p=>console.log('D'+dv,p.planet,p.vargaSignName,'house='+(((p.vargaSignNumber-lag+12)%12)+1)));});
try{console.log('YOGAS',JSON.stringify((A.detectYogas(plist,res.houses,L)||[]).slice(0,10)));}catch(e){}
const d=A.calculateVimshottariDasha(new Date('2006-12-01T09:28:00Z'),m.nakshatra,(m.longitude%13.3333333),3);
const TODAY=new Date('2026-07-20');
d.mahaDashas.slice(0,5).forEach(p=>console.log('MD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=TODAY&&new Date(p.endDate)>TODAY);
console.log('CUR MD',md.planet);
md.subPeriods.forEach(p=>console.log('  AD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=TODAY&&new Date(p.endDate)>TODAY);
console.log('CUR AD',ad.planet);
const mi=d.mahaDashas.indexOf(md);
if(d.mahaDashas[mi+1]){const nx=d.mahaDashas[mi+1];console.log('NEXT MD',nx.planet,(''+nx.startDate).slice(0,10),'→',(''+nx.endDate).slice(0,10));
 nx.subPeriods.slice(0,6).forEach(p=>console.log('   AD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));}
const t=A.calculateBirthChart({date:'2026-07-20',time:'12:00',latitude:LAT,longitude:LON,timezone:TZ});
(Array.isArray(t.planets)?t.planets:Object.values(t.planets)).forEach(p=>{if(['Jupiter','Saturn','Rahu','Ketu'].includes(p.name))console.log('TRANSIT',p.name,p.signName,'H'+(((p.signNumber-L.signNumber+12)%12)+1));});
