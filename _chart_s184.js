const A=require('/Users/saurabh/Work/pocket-pandit/astrology-insights/index.js');
const ABBR={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
// Chennai 13.0827N 80.2707E; 7 Jul 1998 05:44 IST => UTC 00:14
const birth={date:'1998-07-07',time:'05:44',latitude:13.0827,longitude:80.2707,timezone:'Asia/Kolkata'};
const res=A.calculateBirthChart(birth);
const plist=Array.isArray(res.planets)?res.planets:Object.values(res.planets);
const m=plist.find(p=>p.name==='Moon');
console.log('LAGNA',res.lagna.signName,res.lagna.signNumber,res.lagna.nakshatra,'| MOON',m.signName,m.nakshatra);
(res.houses||[]).forEach(h=>console.log('H'+(h.houseNumber||h.number),h.signName||h.sign,(h.planets||[]).map(x=>x.name||x).join(',')));
plist.forEach(p=>console.log('P',ABBR[p.name],p.signName||p.sign,'deg='+(p.degree||p.longitude||0).toFixed(2),'nak='+p.nakshatra,'dig='+(p.dignity||''),'retro='+!!p.retrograde,'house='+(p.house||'')));
console.log('--- MANGLIK', JSON.stringify(A.analyzeManglik(plist,res.houses)).slice(0,400));
try{const d9=A.calculateDivisionalChart({...res,planets:plist},9);const l9=d9.lagna||d9.ascendant;console.log('--- D9 LAGNA',JSON.stringify(l9).slice(0,200));(d9.planets?(Array.isArray(d9.planets)?d9.planets:Object.values(d9.planets)):[]).forEach(p=>console.log('D9',ABBR[p.name]||p.name,p.signName||p.sign));}catch(e){console.log('D9 ERR',e.message)}
const d=A.calculateVimshottariDasha(new Date('1998-07-07T00:14:00Z'),m.nakshatra,(m.longitude%13.3333333),3);
const TODAY=new Date('2026-07-19');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=TODAY&&new Date(p.endDate)>TODAY);
console.log('MD',md.planet,(''+md.startDate).slice(0,10),'→',(''+md.endDate).slice(0,10));
md.subPeriods.forEach(p=>{const st=new Date(p.startDate),en=new Date(p.endDate);if(en>new Date('2026-01-01')&&st<new Date('2032-01-01'))console.log(' AD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10));});
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=TODAY&&new Date(p.endDate)>TODAY);
console.log('CUR AD',ad.planet);
(ad.subPeriods||[]).forEach(p=>console.log('   PD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));
const idx=md.subPeriods.indexOf(ad);
[1,2].forEach(k=>{const n=md.subPeriods[idx+k];if(n){console.log(' NEXT AD',n.planet,(''+n.startDate).slice(0,10),'→',(''+n.endDate).slice(0,10));(n.subPeriods||[]).slice(0,5).forEach(p=>console.log('    PD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));}});
const mdi=d.mahaDashas.indexOf(md); if(d.mahaDashas[mdi+1]){const nm=d.mahaDashas[mdi+1];console.log('NEXT MD',nm.planet,(''+nm.startDate).slice(0,10),'→',(''+nm.endDate).slice(0,10));}
