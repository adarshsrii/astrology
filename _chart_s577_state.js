const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const BR={date:'1999-01-03',time:'16:10',latitude:26.6446,longitude:87.9866,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(BR);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('1999-01-03T16:10:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-12');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`Your marriage will hold, but I will not tell you it comes easy. Both of you have Gemini rising and both are running Mercury mahadasha right now, and that is genuinely the best thing in this match. You think alike and you talk easily, and over a lifetime that carries a marriage further than anything else does.

Where it is weak is the moon signs. Yours is Cancer and his is Aquarius, which fall in the six and eight relation, the hardest of the rashi mismatches in our texts. It does not mean separation. What it actually brings is repeated strain around money and health, and stretches where one of you is doing well while the other is struggling. Your nakshatra natures also differ, Pushya is gentle and principled while Shatabhisha is blunt and independent, so you will misread each other at times and will have to say things out loud instead of assuming.

The reassuring side is just as real. Your nadi is clear, which is the heaviest factor in matching and the one that concerns children and health. Neither of your seventh lords sits in a bad house, so the classical affliction to the spouse does not apply to either of you. His seventh lord Jupiter sits right on his own ascendant and his Venus is exalted, so he will stay committed and will treat this marriage with respect. You both also carry a Mars affliction, yours from the fourth house and his sitting with his Moon, and those largely cancel each other out, so do not let anyone frighten you with the word manglik.

The honest caution is that Sun and Mercury sit in your seventh house. You will feel at times that he takes over the conversation and that your say carries less weight, and ego clashes will be the pattern that keeps returning. Rahu with your Moon adds worry about family and money, in-laws especially, and it makes the mind magnify things. Speak early rather than holding it in.

On timing you are well placed. Jupiter is your seventh lord and its period runs till May 2028, so marrying in this window is supported. His Mercury mahadasha only began in April 2026, so he enters this marriage at the start of a fresh seventeen year chapter, which is good for building something together.

One practical point. His 7:00 am birth time falls right on a boundary, his ascendant is barely half a degree into Gemini, so if he was born even two minutes earlier his whole chart shifts. Please confirm his exact time when you can.

Since you share the same ascendant, Jupiter is the seventh lord for both of you. Keep a Thursday fast together and offer something yellow at a Vishnu temple. That single remedy strengthens the marriage house in both charts at once.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s577');
x.chart=chart;
x.person={name:'Sunita',dob:'1999-01-03',time:'16:10',place:'Jhapa, Nepal'};
x.spouse={name:'boyfriend',dob:'1990-05-19',time:'07:00',place:'Kathmandu, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
x.awaiting=false;
s.pandit.activity='s577 Sunita — milan, Bhakoot 6/8 dosha, Nadi clean, both lagna Gemini, Budh MD';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,L.degreeInSign.toFixed(2),'| Moon',m.signName,m.nakshatra,'| MD',md.planet,'AD',ad.planet,'| msg',nid);
