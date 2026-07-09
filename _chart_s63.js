const A=require('/Users/saurabh/Work/pocket-pandit/astrology-insights/index.js');const fs=require('fs');
// Tika Pathak — BS 2055/02/19 (Jestha 19) => AD 1998-06-02, 01:15 Syangja Nepal (UTC+5:45)
// User gave: weekday Tuesday, Moon rashi Singha (Leo) — use to VERIFY conversion.
const cands=['1998-06-01','1998-06-02','1998-06-03'];
const wd=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
for(const dt of cands){
  const birth={date:dt,time:'01:15',latitude:28.0906,longitude:83.8733,timezone:'Asia/Kathmandu'};
  const res=A.calculateBirthChart(birth);
  const plist=Array.isArray(res.planets)?res.planets:Object.values(res.planets);
  const m=plist.find(p=>p.name==='Moon');
  const w=wd[new Date(dt+'T01:15:00+05:45').getUTCDay==null?0:new Date(dt+'T01:15:00').getDay()];
  console.log(dt,'weekday='+new Date(dt).toLocaleDateString('en-US',{weekday:'long',timeZone:'UTC'}),'| Moon',m.signName,m.nakshatra,'| Lagna',res.lagna.signName);
}
