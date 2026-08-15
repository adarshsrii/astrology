const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'1994-12-20',time:'06:18',latitude:27.6167,longitude:85.3667,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('1994-12-20T06:18:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-11');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`Do not resign in the next few weeks. What you are feeling right now is the Ketu period, which runs until 10 September 2026, and Ketu makes a person want to walk out of a place with nothing waiting on the other side. Sit the month out. From 10 September your Venus period starts and it runs for close to three years, and that is the one that actually carries the change you are looking for.

Your chart is a strong career chart, so the restlessness is not a sign that you are in the wrong line. Mars, your ascendant lord, sits in the 10th house of career where it holds its full directional strength, so you are built to drive your own work rather than be carried along by someone else's. Saturn sits in its own sign in the 4th and forms Sasa yoga, and Jupiter sits in your ascendant, so you have both steadiness and good judgement. Your 10th lord Sun sits in the 2nd, which ties your career and your money together, a rise in one shows up in the other.

On the choice itself, yes, a better opportunity does come, and it appears in that Venus period from September. Venus rules both your 7th house of partnership and your 12th of foreign matters and it sits in its own sign, so what opens up is either a venture with a partner or something with a foreign link or foreign clients. A startup is supported here. One caution and please take it seriously, Rahu sits on your Venus almost to the exact degree, so the partner and the paperwork are precisely where this can go wrong for you. Check whoever you tie yourself to and keep every agreement written and plain.

For the five years ahead, September 2026 to 2029 is the building stretch, and August 2027 is strong within it when Jupiter passes over your Mars in the 10th. The real position and recognition come between mid 2029 and mid 2030 when the Sun, your 10th lord, runs its own period. That is when the title and the authority arrive, so treat the years before it as construction rather than waiting.

One honest thing. You are in a long Mercury period, and Mercury is combust in your chart and rules your 8th house, so recognition tends to reach you later than your work deserves. Keep your contributions on record and do not sit waiting to be noticed. Offer water to the sun in the morning, it suits your 10th lord well.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s560');
x.chart=chart;
x.person={name:'Abina',dob:'1994-12-20',time:'06:18',place:'Lubhu, Lalitpur, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
s.pandit.activity='s560 Abina — career, Ketu AD 10 Sep samma, Shukra AD 3 barsa, Surya AD 2029-30 peak';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,L.degreeInSign.toFixed(2),'| Moon',m.signName,m.nakshatra,'| MD',md.planet,'AD',ad.planet,'| msg',nid);
