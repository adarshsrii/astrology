const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
// Uses her latest stated time 1:57am. 1:47 gives the same D1 lagna/Moon/dasha, so the reading holds either way.
const B={date:'1990-07-05',time:'01:57',latitude:27.0333,longitude:85.0000,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('1990-07-05T01:57:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-12');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`Your chart explains the exact thing you are feeling about work. Rahu sits in your tenth house of career, and your tenth lord Saturn is retrograde in the very last degree of its sign, so the career house itself is unsettled by construction. That is why nothing has felt permanent so far, and it is not a failure of your effort.

The settling does come, but through a change rather than through waiting it out. From December 2026 to December 2029 you run the Rahu period, and Rahu sits in that same tenth house, so those three years carry the real career move. It will likely feel like a risk when you take it, quite possibly with a foreign linked or modern sector organisation, and that is the one that holds. From December 2029 Jupiter takes over and consolidates it. Your strongest ability is communication, since Mercury sits in his own sign along with the Sun and Jupiter in your third house, so teaching, training, advisory or media and content work suits you far better than quiet back office work.

On marriage the news is better than you may be expecting. Your seventh lord is Venus and Venus sits in his own sign Taurus, and the texts say plainly that a seventh lord in his own sign gives real happiness through marriage. You are also running the Venus mahadasha itself, which began in 2019 and runs until 2039, so you are living inside the marriage giving stretch of your life. You are manglik from the ascendant and from Venus, and that is part of why this has taken so long, but your Mars sits in his own sign Aries, which is the classical cancellation of that dosha. Do not let anyone use that word to block a match for you.

For timing there is a live window running now until October 2026, and then the years to watch are 2029 into 2030, when Jupiter transits your seventh house just as the Venus and Jupiter period begins together. I would call that later one the strongest, and I am not going to pretend the wait is short, but the placement itself is genuinely sound.

About him, Venus sitting in your second house means he comes through family, most likely an introduction through relatives rather than a chance meeting. He will be financially steady, well mannered and comfortable in life, and the marriage will be materially secure. In the navamsa your seventh house is Gemini, so he will be intelligent and talkative, someone you can actually hold a conversation with.

One small check. You have given the time as 1:47 am once and as 1:57 am this time. Both give the same ascendant, so everything above holds either way, but if you were born even three minutes after 1:57 the ascendant moves into Taurus and a good deal would shift. Confirm it if any record exists at home.

Keep Friday for Venus, offer or wear white, and give something sweet to young girls that day. Venus rules both the questions you asked me, so strengthening him serves the career and the marriage at once.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s573');
x.chart=chart;
x.person={name:'Sneha Adhikari',dob:'1990-07-05',time:'01:57 (she also stated 01:47; same D1 lagna)',place:'Kalaiya, Bara, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
x.awaiting=false;
s.pandit.activity='s573 Sneha — career+vivah, Mesh lagna, Rahu 10th, Shukra 7th lord own sign, Shukra MD; s479 same person NEVER answered';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,L.degreeInSign.toFixed(2),'| Moon',m.signName,m.nakshatra,'| MD',md.planet,'AD',ad.planet,'| msg',nid);
