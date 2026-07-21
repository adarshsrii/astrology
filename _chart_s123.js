const A=require('/Users/saurabh/Work/pocket-pandit/astrology-insights/index.js');
const ABBR={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
// Itahari, Nepal ~26.66N 87.28E; 27 Oct 1993 00:08 NPT => UTC 1993-10-26T18:23:00Z
const birth={date:'1993-10-27',time:'00:08',latitude:26.66,longitude:87.28,timezone:'Asia/Kathmandu'};
const res=A.calculateBirthChart(birth);
const plist=Array.isArray(res.planets)?res.planets:Object.values(res.planets);
const m=plist.find(p=>p.name==='Moon');
console.log('LAGNA',res.lagna.signName,res.lagna.nakshatra,'| MOON',m.signName,m.nakshatra);
(res.houses||[]).forEach(h=>console.log('H'+(h.houseNumber||h.number),h.signName||h.sign,(h.planets||[]).map(x=>x.name||x).join(',')));
plist.forEach(p=>console.log('P',ABBR[p.name],p.signName||p.sign,'dig='+(p.dignity||''),'retro='+!!p.retrograde));
const d=A.calculateVimshottariDasha(new Date('1993-10-26T18:23:00Z'),m.nakshatra,(m.longitude%13.3333333),2);
console.log('CUR',JSON.stringify(d.currentDasha));
const W=new Date('2024-06-01'),X=new Date('2030-12-31');
d.mahaDashas.forEach(p=>{const s=new Date(p.startDate),e=new Date(p.endDate);if(e<W||s>X)return;console.log('MD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10));(p.subPeriods||[]).forEach(s2=>{const ss=new Date(s2.startDate),ee=new Date(s2.endDate);if(ee<W||ss>X)return;console.log('  AD',p.planet+'-'+s2.planet,(''+s2.startDate).slice(0,10),'→',(''+s2.endDate).slice(0,10));});});
