const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
// Her chart already on record from the career reading; rebuild it so the portal keeps rendering hers.
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
const T=new Date('2026-08-12');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`His details check out, by the way. You said his Moon is in Taurus and that is exactly where it falls, so I have read this on solid ground.

The match is a good one, better than most that reach me. Your nadi is clear, which carries the most weight of all, and you both belong to the Deva gana, so your basic natures are alike rather than pulling against each other. The one blemish is bhakoot, since your Moon in Gemini and his in Taurus sit side by side in the two twelve relation, and that is the dosha which classically threatens money and closeness. But it is cancelled in your case, because the lords of your two Moon signs are Mercury and Venus and those two are natural friends. That cancellation is genuine, and it is exactly why I am not worried about the thing the dosha warns of.

As a couple you will suit each other. Your seventh lord Venus sits in his own sign, and the texts say plainly that this gives real happiness through marriage. His Moon is exalted, so he is emotionally steady and loyal, while your Moon sits in the eighth house, which makes you the deeper and more turbulent one. That is a good fit rather than a clash, because his steadiness is what your Moon actually needs. The real risk between you is not temperament, it is silence. An eighth house Moon does not easily say what is wrong, and his seventh lord Mercury is combust, so he does not put feelings into words either. Two quiet people can let a small thing sit for months. Say things early and this marriage will be an easy one.

On money he is the stronger side. His Venus owns his house of gains and sits there in his own strong sign, which is one of the better wealth placements in any chart, so earning and saving come naturally to him. Your side is looser, with Venus and Rahu sitting together in your twelfth house of spending, and Rahu there widens the outflow, usually on comfort, travel or things from abroad. None of this says shortage. It says he accumulates and you spend, so settle early who handles what and keep a little separate rather than pooling every rupee, and money will never become your quarrel.

The in laws will take patience and I will not soften that. Saturn sits strongly in your fourth house of home and Mars sits in his, and neither makes for a warm household at the beginning. You will not be embraced immediately and you will feel weighed for a while. But Saturn is in his own sign there, and Saturn gives late rather than never, so you finish as the one holding that house together and respected in it, just not in the first year or two. Your eighth house Moon also means you absorb their moods more than you should, so keep a little distance early on. He is also manglik from his ascendant, with Mars in that fourth house, while you are not, and that is part of why the home reads tense at the start, though his Mars sits in a friendly sign which softens it considerably. Against clear nadi, matching gana, cancelled bhakoot and your own seventh lord in his own sign, it does not overturn the match.

Your Venus period begins on 10 September 2026 and runs to July 2029, and Venus owns your seventh house, so that stretch is the natural window for the marriage itself.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s560');
x.chart=chart;
x.person={name:'Abina',dob:'1994-12-20',time:'06:18',place:'Lubhu, Lalitpur, Nepal'};
x.spouse={name:'Jems',dob:'1988-11-25',time:'09:55',place:'Thapathali, Kathmandu, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
x.awaiting=false;
s.pandit.activity='s560 Abina x Jems — milan, Bhakoot 2/12 cancelled by Budh-Shukra maitri, Nadi+Gana clean, Shukra AD 10 Sep 2026';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK her lagna',L.signName,'| MD',md.planet,'AD',ad.planet,'| msg',nid,'| spouse recorded');
