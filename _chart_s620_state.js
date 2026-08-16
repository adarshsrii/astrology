const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'2000-05-12',time:'10:00',latitude:27.5833,longitude:85.5167,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('2000-05-12T10:00:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-16');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`Rojeena ji, your chart is genuinely strong for a banking career, and between the two, it favours the government one.

Your ascendant is Cancer and your tenth house of career holds four planets, with the Sun exalted right there. The Sun is the significator of government and it also rules your second house of wealth, so government and money come through the same planet in your chart, sitting at the top of it in its best possible position. Parashara says that when the lord of the second house sits in an angle together with Jupiter and Venus the person becomes wealthy, and that is exactly your combination, all three of them in the tenth. Jupiter there also rules your sixth house of employment, so service in a financial institution is written quite clearly.

On timing, you have been running Rahu's sub period since May 2025 and Rahu sits right on your ascendant, within a degree and a half of it. Rahu periods are the ones where you apply and prepare and the result stays unclear, which is why nothing has landed yet. It runs until 11 November 2026. So a job within this year is not what I see, and if something in a private bank does come before then it will be temporary or not the one you actually want.

From 11 November 2026 you enter Jupiter's sub period, running to March 2028. Jupiter is your employment lord and your fortune lord at once, sitting in that same tenth house with the exalted Sun. On nearly the same date Jupiter also enters your second house by transit and begins aspecting your tenth house from there. That is your appointment window, and 2027 is the year, particularly the second half once Jupiter settles into Leo in July.

Saturn does sit debilitated in your tenth house, and that is why career has felt blocked and slower than it should for a chart this strong. But the Sun is exalted in that very same sign and Mars sits in an angle from your Moon, and both of those cancel the debilitation, so what it gives is a late start and then a better rise than the people around you. The delay is not a no.

Keep preparing for the government bank rather than settling early. A private bank job meanwhile is fine as experience and will not harm you, but the lasting one in your chart is the government side. Offer water to the Sun on Sunday mornings, since the Sun is both your wealth lord and the planet carrying the government job.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s620');
x.chart=chart;
x.person={name:'Rojeena Basnet',dob:'2000-05-12 (BS 2057-01-30)',time:'10:00',place:'Panauti, Kavrepalanchok, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
x.awaiting=false;
s.pandit.activity='s620 Rojeena — Karka lagna, Surya uchcha dasam + Dhana yoga; Rahu AD tak 11 Nov 2026 = no job this year; Chandra-Guru AD 2027 = sarkari bank window';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,L.degreeInSign.toFixed(2),'| Moon',m.signName,m.nakshatra,'| MD',md.planet,'AD',ad.planet,'| msg',nid);
