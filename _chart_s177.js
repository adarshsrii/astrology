const A=require('./index.js');
// Deoria UP 26.5024N 83.7791E; 16 Aug 2001 01:50 IST => UTC 15 Aug 20:20
const birth={date:'2001-08-16',time:'01:50',latitude:26.5024,longitude:83.7791,timezone:'Asia/Kolkata'};
const res=A.calculateBirthChart(birth);
const plist=Array.isArray(res.planets)?res.planets:Object.values(res.planets);
const m=plist.find(p=>p.name==='Moon');
console.log('LAGNA',res.lagna.signName,res.lagna.signNumber,res.lagna.nakshatra,'deg',res.lagna.degreeInSign,'| MOON',m.signName,m.nakshatra);
(res.houses||[]).forEach(h=>console.log('H'+(h.houseNumber||h.number),h.signName||h.sign,(h.planets||[]).map(x=>x.name||x).join(',')));
plist.forEach(p=>console.log('P',p.name,p.signName,'deg='+p.degreeInSign,'nak='+p.nakshatra,'dig='+p.dignity,'retro='+p.retrograde,'combust='+p.isCombust));
const Y=A.detectYogas(plist,res.houses,res.lagna.signNumber);
console.log('YOGAS RAW KEYS',Object.keys(Y));
console.log(JSON.stringify(Y,null,1).slice(0,3000));
