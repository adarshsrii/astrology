const A=require('/Users/saurabh/Work/pocket-pandit/astrology-insights/index.js');
const ABBR={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
// Malangwa, Sarlahi, Nepal — 17 Feb 1991, 01:00 NPT (UTC+5:45) = 1991-02-16T19:15:00Z
const birth={date:'1991-02-17',time:'01:00',latitude:26.8656,longitude:85.5622,timezone:'Asia/Kathmandu'};
const res=A.calculateBirthChart(birth);
const plist=Array.isArray(res.planets)?res.planets:Object.values(res.planets);
const m=plist.find(p=>p.name==='Moon');
console.log('LAGNA',res.lagna.signName,res.lagna.nakshatra,'| MOON',m.signName,m.nakshatra,'<- user claims Meen/Pisces');
(res.houses||[]).forEach(h=>console.log('H'+(h.houseNumber||h.number),h.signName||h.sign,(h.planets||[]).map(x=>x.name||x).join(',')));
plist.forEach(p=>console.log('P',ABBR[p.name],p.signName||p.sign,'nak='+p.nakshatra,'retro='+!!p.retrograde,'dig='+(p.dignity||'')));
const d=A.calculateVimshottariDasha(new Date('1991-02-16T19:15:00Z'),m.nakshatra,(m.longitude%13.3333333),2);
console.log('CUR',JSON.stringify(d.currentDasha));
console.log('--- full MD timeline ---');
d.mahaDashas.forEach(p=>console.log('MD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));
console.log('--- AD detail 2008-2032 ---');
const W=new Date('2008-01-01'),X=new Date('2032-12-31');
d.mahaDashas.forEach(p=>{const s=new Date(p.startDate),e=new Date(p.endDate);if(e<W||s>X)return;(p.subPeriods||[]).forEach(s2=>{const ss=new Date(s2.startDate),ee=new Date(s2.endDate);if(ee<W||ss>X)return;console.log('  AD',p.planet+'-'+s2.planet,(''+s2.startDate).slice(0,10),'→',(''+s2.endDate).slice(0,10));});});
try{console.log('YOGAS',JSON.stringify((A.detectYogas(res)||[]).map(y=>y.name||y)).slice(0,400));}catch(e){console.log('yoga err',e.message.slice(0,60))}
