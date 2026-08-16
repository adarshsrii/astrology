const A=require('./index.js');const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'2006-06-25',time:'09:09',latitude:18.5204,longitude:73.8567,timezone:'Asia/Kolkata'};
const r=A.calculateBirthChart(B);const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra;if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('2006-06-25T09:09:00+05:30'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-16');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`Tvisha ji, something in your chart changed four months ago that is worth knowing before anything else. On 12 April 2026 you finished an eighteen year Rahu mahadasha that began before you were two, and you entered a sixteen year Jupiter mahadasha. Jupiter rules your ninth house of fortune, higher education and foreign lands, so the phase you are stepping into is the more fortunate one and it has only just started.

On career, your ascendant is Cancer and the lord of your tenth house of work is Mars, who is also the single best planet for your ascendant. He sits in your first house, which means your work will be personal to you rather than a job you slot into. He is debilitated there, which is why direction may feel unclear to you at the moment, but that debilitation is cancelled because Jupiter, who exalts in your ascendant sign, sits in an angle. The uncertainty is the starting condition, not the outcome.

The direction itself shows in two places. Venus is in her own sign in your eleventh house of income and networks, and Venus rules both your fourth house of education and that eleventh house, so creative, aesthetic or people facing work suits you, and your income tends to come through your network rather than through cold applications. Mercury sits in your ascendant, which supports communication, writing and analysis. Alongside that your chart pushes outward strongly, since your ascendant lord Moon and your Sun both sit in the twelfth house of foreign lands while Rahu sits in the ninth of higher study abroad. Studying and working outside India is written clearly here rather than merely being possible.

On your partner, the clearest thing in your chart is that Saturn, the lord of your seventh house of marriage, sits in your first house. The seventh lord in the first means the person comes into your own space rather than you having to go looking far for him, so it is quite possible he is already somewhere in your circle. What it does not mean is that anything activates now, because Saturn is the planet of delay and it is his own period that has to run for this to move.

That period is Jupiter with Saturn, from 30 May 2028 to 12 December 2030, and Jupiter also begins aspecting your seventh house by transit around 2029. So of the three possibilities you named, it is not now and it is not ten years away. It is 2028 to 2030, most likely 2029, when you will be about twenty three. Saturn as your seventh lord also says the person will be older than you, or at least noticeably more settled and serious in nature.

As for where, your seventh lord sitting in your own house points to your own environment, your college or your circle of friends, rather than a stranger from somewhere distant. Hold that alongside the foreign pull in the rest of your chart though, because if you are studying abroad by then, that circle will simply be there instead of here.

One thing to know rather than worry about, Mars in your first house gives a mild Manglik dosha. It is the milder form and Mars has his cancellation, but a proper matching before marriage is still worth doing.

Keep Thursdays for Jupiter, since he now rules the next sixteen years of your life and he is the planet carrying your fortune, your higher education and your route abroad.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s632');
x.chart=chart;
x.person={name:'Tvisha Faujdar',dob:'2006-06-25',time:'09:09',place:'Pune, Maharashtra, India'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;x.awaiting=false;
s.pandit.activity='s632 Tvisha — Karka lagna; Rahu MD khatam 12 Apr 2026, Guru MD (9L) shuru 16 saal; career: 10L Mangal yogakarak neech-bhanga in 1st, Shukra swagrihi 11th, Chandra+Surya 12th + Rahu 9th = videsh; partner: 7L Shani in LAGNA (apne circle me, shayad mil chuka) par activate Guru-Shani 30 May 2028-12 Dec 2030, sabse likely 2029; mild Manglik';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK',L.signName,L.degreeInSign.toFixed(2),'| MD',md.planet,'AD',ad.planet,'| msg',nid);
