const A=require('/Users/saurabh/Work/pocket-pandit/astrology-insights/index.js');const fs=require('fs');
// Kamble Nilesh — 10 Jul 1999, 10:00 IST, Degloor Maharashtra
const birth={date:'1999-07-10',time:'10:00',latitude:18.5507,longitude:77.5586,timezone:'Asia/Kolkata'};
const res=A.calculateBirthChart(birth);
const plist=Array.isArray(res.planets)?res.planets:Object.values(res.planets);
const ABBR={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const sn=s=>({Aries:1,Taurus:2,Gemini:3,Cancer:4,Leo:5,Virgo:6,Libra:7,Scorpio:8,Sagittarius:9,Capricorn:10,Aquarius:11,Pisces:12})[s];
const houses=(res.houses||[]).map(h=>({num:h.houseNumber||h.number,signNum:sn(h.signName||h.sign),signName:h.signName||h.sign,planets:(h.planets||[]).map(x=>ABBR[x.name||x]||x.name||x)}));
const planets=plist.map(p=>({name:p.name,abbr:ABBR[p.name],sign:p.signName||p.sign,signNum:sn(p.signName||p.sign),nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity||''}));
const m=plist.find(p=>p.name==='Moon');
// 10:00 IST = 04:30 UTC
const d=A.calculateVimshottariDasha(new Date('1999-07-10T04:30:00Z'),m.nakshatra,(m.longitude%13.3333333),2);
const timeline=d.mahaDashas.map(p=>({planet:p.planet,start:p.startDate,end:p.endDate}));
console.log('LAGNA',res.lagna.signName,res.lagna.nakshatra,'| MOON',m.signName,m.nakshatra);
console.log('CUR',JSON.stringify(d.currentDasha));
(res.houses||[]).forEach(h=>console.log('H'+(h.houseNumber||h.number),h.signName,(h.planets||[]).map(x=>x.name||x).join(',')));
planets.forEach(p=>console.log('P',p.abbr,p.sign,'nak='+p.nak,'retro='+p.retro,'dig='+p.dignity));
console.log('--- Dasha 2024-2029 ---');
const W=new Date('2024-01-01'),X=new Date('2029-12-31');
d.mahaDashas.forEach(p=>{const s=new Date(p.startDate),e=new Date(p.endDate);if(e<W||s>X)return;console.log('MD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10));(p.subPeriods||[]).forEach(s2=>{const ss=new Date(s2.startDate),ee=new Date(s2.endDate);if(ee<W||ss>X)return;console.log('  AD',s2.planet,(''+s2.startDate).slice(0,10),'→',(''+s2.endDate).slice(0,10));});});
fs.writeFileSync('/tmp/_chart_s112.json',JSON.stringify({lagnaSign:res.lagna.signName,lagnaSignNum:sn(res.lagna.signName),nakshatra:res.lagna.nakshatra,houses,planets,dasha:{current:d.currentDasha,timeline}}));
console.log('WROTE /tmp/_chart_s112.json');
