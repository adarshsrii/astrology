const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'2005-07-12',time:'18:00',latitude:27.6931,longitude:85.3157,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('2005-07-12T18:00:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-05');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`Babina ji, career is the strong side of your chart. Moon and Jupiter sit together in your tenth house, a Gajakesari yoga right in the house of work, so you are meant to be known for what you do, and teaching, counselling, health or research type work suits you far more than a routine job. But the lord of your tenth, Mercury, is in the eighth with Saturn and Venus, so the path will not be a straight line, expect a change of field or a restart along the way, and till 2028 things will still feel unsettled while you find your direction. The real lift starts around October 2028 and runs to early 2031, that is the Jupiter period inside your Rahu dasha and Jupiter is your lagna lord sitting in a kendra, so work, recognition and money rise together then.

Love is the harder side. Your seventh lord sits in the eighth house, Venus is with Saturn in that same eighth, and Sun is in the seventh, which means deep attachment but delay, secrecy and repeated ups and downs. You are Manglik from both the lagna and the Moon as well. So a relationship in the next two or three years can feel intense but will most likely stay complicated, and I would not count on it reaching marriage. Marriage settles better after 2028, most likely between 2029 and 2031, and with a serious, mature minded partner rather than a light romance.

Right now you are in the Rahu period till October 2028, with Rahu and Mars together in your fourth house, so the mind stays restless and home matters feel tense. Avoid big decisions taken in anger during this stretch and do not commit to anyone in a hurry. Reading Hanuman Chalisa on Tuesdays will calm both the Mars and the Rahu side.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s481');
x.chart=chart;
x.person={name:'Babina Sapkota',dob:'2005-07-12',time:'18:00',place:'Thapathali, Kathmandu, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
s.pandit.activity='s481 Babina Sapkota — career + love reading di';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,'MD',md.planet,'AD',ad.planet,'msg',nid);
