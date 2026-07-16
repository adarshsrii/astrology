const A=require('/Users/saurabh/Work/pocket-pandit/astrology-insights/index.js');const fs=require('fs');
// Waddepally Sunitha — 4 Nov 1983, 04:45 IST, Secunderabad/Hyderabad
const birth={date:'1983-11-04',time:'04:45',latitude:17.4399,longitude:78.4983,timezone:'Asia/Kolkata'};
const res=A.calculateBirthChart(birth);
const plist=Array.isArray(res.planets)?res.planets:Object.values(res.planets);
const ABBR={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const sn=s=>({Aries:1,Taurus:2,Gemini:3,Cancer:4,Leo:5,Virgo:6,Libra:7,Scorpio:8,Sagittarius:9,Capricorn:10,Aquarius:11,Pisces:12})[s];
const houses=(res.houses||[]).map(h=>({num:h.houseNumber||h.number,signNum:sn(h.signName||h.sign),signName:h.signName||h.sign,planets:(h.planets||[]).map(x=>ABBR[x.name||x]||x.name||x)}));
const planets=plist.map(p=>({name:p.name,abbr:ABBR[p.name],sign:p.signName||p.sign,signNum:sn(p.signName||p.sign),nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity||''}));
const m=plist.find(p=>p.name==='Moon');
// 04:45 IST = prev day 23:15 UTC
const d=A.calculateVimshottariDasha(new Date('1983-11-03T23:15:00Z'),m.nakshatra,(m.longitude%13.3333333),3);
console.log('LAGNA',res.lagna.signName,res.lagna.nakshatra,'| MOON',m.signName,m.nakshatra);
console.log('CUR',JSON.stringify(d.currentDasha));
(res.houses||[]).forEach(h=>console.log('H'+(h.houseNumber||h.number),h.signName,(h.planets||[]).map(x=>x.name||x).join(',')));
planets.forEach(p=>console.log('P',p.abbr,p.sign,'nak='+p.nak,'retro='+p.retro,'dig='+p.dignity));
console.log('--- MD/AD/PD covering 2026-2027 ---');
const W=new Date('2026-01-01'),X=new Date('2027-12-31');
d.mahaDashas.forEach(p=>{const s=new Date(p.startDate),e=new Date(p.endDate);if(e<W||s>X)return;console.log('MD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10));
(p.subPeriods||[]).forEach(s2=>{const ss=new Date(s2.startDate),ee=new Date(s2.endDate);if(ee<W||ss>X)return;console.log('  AD',s2.planet,(''+s2.startDate).slice(0,10),'→',(''+s2.endDate).slice(0,10));
(s2.subPeriods||[]).forEach(s3=>{const a=new Date(s3.startDate),b=new Date(s3.endDate);if(b<W||a>X)return;console.log('    PD',s3.planet,(''+s3.startDate).slice(0,10),'→',(''+s3.endDate).slice(0,10));});});});
const timeline=d.mahaDashas.map(p=>({planet:p.planet,start:p.startDate,end:p.endDate}));
fs.writeFileSync('/tmp/_chart_s110.json',JSON.stringify({lagnaSign:res.lagna.signName,lagnaSignNum:sn(res.lagna.signName),nakshatra:res.lagna.nakshatra,houses,planets,dasha:{current:d.currentDasha,timeline}}));
console.log('WROTE /tmp/_chart_s110.json');
