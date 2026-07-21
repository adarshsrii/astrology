const A=require('/Users/saurabh/Work/pocket-pandit/astrology-insights/index.js');
const ABBR={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
// Mumbai 19.076N 72.8777E; 25 Jan 2004 20:26 IST => UTC 14:56
const birth={date:'2004-01-25',time:'20:26',latitude:19.076,longitude:72.8777,timezone:'Asia/Kolkata'};
const res=A.calculateBirthChart(birth);
const plist=Array.isArray(res.planets)?res.planets:Object.values(res.planets);
const m=plist.find(p=>p.name==='Moon');
console.log('LAGNA',res.lagna.signName,res.lagna.nakshatra,'| MOON',m.signName,m.nakshatra);
(res.houses||[]).forEach(h=>console.log('H'+(h.houseNumber||h.number),h.signName||h.sign,(h.planets||[]).map(x=>x.name||x).join(',')));
plist.forEach(p=>console.log('P',ABBR[p.name],p.signName||p.sign,'dig='+(p.dignity||''),'retro='+!!p.retrograde));
const d=A.calculateVimshottariDasha(new Date('2004-01-25T14:56:00Z'),m.nakshatra,(m.longitude%13.3333333),3);
console.log('CUR',JSON.stringify(d.currentDasha));
// current MD/AD + pratyantars for next ~2y
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=new Date('2026-07-17')&&new Date(p.endDate)>new Date('2026-07-17'));
console.log('MD',md.planet,(''+md.startDate).slice(0,10),'→',(''+md.endDate).slice(0,10));
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=new Date('2026-07-17')&&new Date(p.endDate)>new Date('2026-07-17'));
console.log(' AD',ad.planet,(''+ad.startDate).slice(0,10),'→',(''+ad.endDate).slice(0,10));
(ad.subPeriods||[]).forEach(p=>console.log('   PD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));
// next AD too
const idx=md.subPeriods.indexOf(ad);
if(md.subPeriods[idx+1]){const n=md.subPeriods[idx+1];console.log(' NEXT AD',n.planet,(''+n.startDate).slice(0,10),'→',(''+n.endDate).slice(0,10));}
