const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'2025-11-02',time:'20:35',latitude:27.6667,longitude:85.3167,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('2025-11-02T20:35:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-11');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`Let me take the medical question first and be straight with you, because you deserve a straight answer on it. A birth chart cannot tell you whether a child has autism or any neurological condition. Jyotish has no dependable reading for that, and an astrologer who hands you a yes or a no on it is guessing about something far too important to guess about. If you have noticed anything in your child's development, take them to a paediatrician and have it looked at properly. That is the right door for that question and going early costs nothing. What I write below is about temperament and life, and please do not take it as a medical clearance either.

Now, what the chart does show, and there is one thing in it you will find genuinely useful. The Moon sits with Saturn in this chart, and a Moon with Saturn usually means a quiet child, serious for their age, slow to warm to new people, settling on their own schedule rather than on anybody else's. That is temperament, and it is very often mistaken by anxious parents for something bigger. Along with that, Saturn's own mahadasha runs from birth right up to 2042, so the whole childhood moves at a steady and unhurried pace. Your child will reach things later than the child next door and then hold them more firmly. Comparing them with other children will tell you nothing true.

The chart itself is a good one. Jupiter is exalted in the second house of speech and learning and it casts its aspect directly on the Moon, which classically protects the mind and gives a calm, thoughtful nature. Mars sits in its own sign in the sixth house, which gives a sturdy constitution and real recovering power. Venus is strongly placed in the fifth, so creativity is genuine here, expect ability with the hands, with music, or with design. Rahu in its own sign in the ninth points to a foreign connection later on, so do not be surprised if study or work eventually takes them out of Nepal.

The working life is marked by responsibility rather than shine, with the Moon and Saturn in the tenth house giving a public and service minded career built slowly. From 2042, at sixteen, Mercury takes over for seventeen years, and that is the stretch that really forms them, so the making of this life happens in the late teens and twenties rather than in childhood.

Raise them patiently and this chart does well. And for the health worry, please go to a doctor and not to a chart.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s555');
x.chart=chart;
x.person={name:'Saishav Dangol (child)',dob:'2025-11-02',time:'20:35',place:'Patan Hospital, Lalitpur, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
s.pandit.activity='s555 baby — medical prediction refused, doctor ma pathayo; swabhav + jeevan ko path diyo';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,L.degreeInSign.toFixed(2),'| Moon',m.signName,m.nakshatra,'| MD',md.planet,'| msg',nid);
