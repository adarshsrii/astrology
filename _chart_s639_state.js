const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'2000-02-02',time:'03:56',latitude:27.6588,longitude:85.3247,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('2000-02-02T03:56:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-16');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`Prasanna ji, within the next twelve months it is possible but not certain.

You are running the mahadasha of the Sun, which began in July 2022 and runs to July 2028. The Sun is the planet the classical texts give royal status, and in your chart he also owns your ninth house of fortune, so this whole stretch is the right stretch of your life for a government entry.

What slows it is the sub period you are in now. From May 2026 to 20 March 2027 you run the Sun with Mercury. Parashara gives this sub period its good results when Mercury sits in an angle or a trine from the ascendant, or joins the ninth lord, or occupies the ninth, fifth or tenth. Your Mercury sits in the third house and meets none of those, so for you this is a middling period rather than a pushing one. It does not block you, it simply does not carry you.

Inside the year you asked about, the window to watch is 19 December 2026 to 29 January 2027. Jupiter runs at the third level then, and Jupiter is your ascendant lord sitting in your fifth house of examinations, while by transit he is passing through your ninth house of fortune at the same time. If something lands within twelve months, it lands there.

The stretch right after that is weak. From 29 January to 20 March 2027 Saturn takes over, and your Saturn is debilitated in that same fifth house of examinations with nothing in your chart cancelling the debilitation. March to July 2027 belongs to Ketu and stays unsettled.

Things improve from 25 July 2027, when Venus runs until July 2028. Venus owns your sixth house of service and your eleventh house of gains, and sits right on your ascendant, which is both an angle and a trine, and that is the exact placement Parashara names for the good results of this period including favour from the king. Venus also stands twelfth from the Sun though, so the same text says such a period is moderate at its start, good in the middle and troubled at the end. Late 2027 into 2028 is the sweet spot.

So within one year there is one real window, around the turn of the coming year, and the appointment sits more comfortably in the year after that. Do not let the weak stretch in early 2027 stop your preparation, because the period right behind it is the one built to deliver. Offer water to the Sun at sunrise every day, since the Sun is both your dasha lord and the planet that carries government work in your chart.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s639');
x.chart=chart;
x.person={name:'Prasanna Acharya',dob:'2000-02-02',time:'03:56',place:'Lalitpur, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
x.awaiting=false;
s.pandit.activity='s639 Prasanna — Dhanu lagna; Surya MD 2022-28 (9L+govt karak) good base, but Surya-Budh medium per BPHS Ch52 (Budh in 3rd, no kendra/trikona); best 1-yr window 19 Dec 2026-29 Jan 2027; Shani neech 5th no bhanga; Surya-Shukra from 25 Jul 2027 strongest';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,L.degreeInSign.toFixed(2),'| Moon',m.signName,m.nakshatra,'| MD',md.planet,'AD',ad.planet,'| msg',nid);
