const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'2001-08-20',time:'03:38',latitude:27.6833,longitude:84.4333,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('2001-08-20T03:38:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-11');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`Both are genuinely in your chart, which is exactly why you cannot decide between them. So take the order your chart gives instead of choosing one and dropping the other.

Loksewa comes first, and it has a narrow window. Your 10th lord Mars sits in its own sign in the 5th house, the house of intelligence and examinations, which is one of the better combinations there is for clearing a competitive exam, and Ketu in your 6th house is the placement that beats competition. Your Sun, the planet of government and authority, is in its own moolatrikona sign as well. The capability is real, this is not a consolation answer.

The timing matters more than the capability. Your Mars antardasha runs from 11 November 2026 to 12 June 2027, and that is your 10th lord running its own period in its own sign. Aim your attempt squarely inside that window. Prepare through the coming months and sit the exam within it rather than after it.

Abroad is also strong and it opens right afterwards. Jupiter, your 9th lord of long journeys, along with Venus and Rahu, all sit together in your 12th house of foreign lands. Three planets there, two of them house lords, is a heavy foreign pull. Your Rahu antardasha begins on 12 June 2027 and runs eighteen months, and Jupiter follows it through to April 2030. That whole stretch stands behind going out.

So the plain answer is this. Give loksewa one honest attempt between November 2026 and June 2027. If it has not come through by that June, do not sit repeating attempts year after year, turn to the foreign route, because from that month the chart itself moves behind it. And keep in mind that the 12th house is the heavier side of your chart, so there is a fair chance abroad is where you eventually settle. Offer water to the sun in the morning while you prepare, it suits the Sun in your chart.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s559');
x.chart=chart;
x.person={name:'Samikshya Shrestha',dob:'2001-08-20',bs:'2058-05-04',time:'03:38',place:'Chitwan, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
s.pandit.activity='s559 Samikshya — loksewa vs videsh: Mangal AD Nov 2026-Jun 2027 exam, Rahu AD Jun 2027 videsh';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,L.degreeInSign.toFixed(2),'| Moon',m.signName,m.nakshatra,'| MD',md.planet,'AD',ad.planet,'| msg',nid);
