const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'1995-09-27',time:'12:30',latitude:26.63,longitude:87.45,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('1995-09-27T12:30:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-16');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`Nisha ji, the meeting is closer than the marriage, and both are in your chart.

You have Sagittarius ascendant. The lord of your seventh house of marriage is Mercury and he is exalted, sitting in your tenth house of work. An exalted seventh lord is not a common thing to have, and it says the man will be capable and of good standing. Its placement in the tenth says you meet him through work or a professional setting rather than through a family introduction. Alongside that, Jupiter, who stands for the husband in a woman's chart, sits in your twelfth house, the house of distant places. So the meeting comes through work and away from your own home town, quite possibly with someone carrying a foreign connection.

You are running the antardasha of that same exalted Mercury right now and it lasts until 4 February 2027, so this is genuinely the stretch when your seventh lord is active. Inside it, the sub period until 1 September 2026 belongs to Jupiter, your husband significator, and that is the closest window you have. If someone comes into view in this stretch, take it seriously.

The marriage itself runs on a different timeline. Mercury is retrograde in your chart, and a retrograde seventh lord makes the matter move back and forth rather than straight, so an introduction can come, go quiet and return. You also began a nineteen year Saturn mahadasha in May 2021, and Saturn delays marriage by nature. From 4 February 2027 to March 2028 you run Ketu, a detached and quiet stretch where I would not expect it to settle.

The real period opens on 15 March 2028, when Venus takes over the antardasha and runs to 2031. Venus is the planet of marriage and also owns your eleventh house of wishes fulfilled. Your Venus is debilitated, which is probably why relationships have felt unrewarding so far, but that debilitation is cancelled in your chart, because Mercury, who owns the sign your Venus sits in, is himself exalted and placed in an angle. So it breaks rather than continues. Jupiter also begins aspecting your seventh house by transit from 2029, and 2029 into 2030 is where the marriage actually sits.

One worry you can set down, your Mars is in the eleventh house, so there is no Manglik dosha in your chart.

Keep Thursdays for Jupiter with a simple fast or worship of Vishnu, since Jupiter is both your ascendant lord and the planet standing for your husband, and in your chart he sits in the weakest house and needs the support.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s635');
x.chart=chart;
x.person={name:'Nisha',dob:'1995-09-27',time:'12:30',place:'Mude Sanischare, Morang, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
x.awaiting=false;
s.pandit.activity='s635 Nisha — Dhanu lagna; 7L Budh UCHCHA in 10th but VAKRI = milna kaam se, ghar se door; Guru (pati karak) 12th; Shani-Budh AD tak 4 Feb 2027 (Guru PD tak 1 Sep 2026 = nazdiki window); shaadi Shani-Shukra 2028-31, Guru 7th ko dekhe 2029 = vivah 2029-30; Shukra neech par bhanga; no Manglik';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,L.degreeInSign.toFixed(2),'| Moon',m.signName,m.nakshatra,'| MD',md.planet,'AD',ad.planet,'| msg',nid);
