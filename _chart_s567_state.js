const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
// Lagna holds Scorpio across his whole stated 20:30-21:00 window, and Moon is Libra
// throughout, matching the Tula rashi he gave. Midpoint used.
const B={date:'1996-05-03',time:'20:45',latitude:26.5448,longitude:88.0895,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('1996-05-03T20:45:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-12');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`Your Moon sits in the twelfth house, and that single placement describes what you are living better than anything you wrote to me. The twelfth is the house of loss and of giving without return. A Moon there pours feeling into people who do not pour it back, and it is why you can drive her to the jail every day and home again and still end up the one holding nothing.

About her the answer is no, and you already have it from her own mouth. Your fifth house of love carries Saturn and Ketu together, Saturn which delays and Ketu which cuts the thread, so one sided love has been a pattern in your chart rather than a thing this one girl did to you. She has told you she is back with him. The chart is not arguing with her.

What you have not been told is that your seventh house of marriage is one of the strongest things you own. Venus rules it and Venus sits in his own sign inside that very house with Mercury beside him, and the texts say plainly that a seventh lord in his own sign gives real happiness through marriage. You are not a man who ends up alone. The woman you marry is simply not this one. That window opens when Saturn enters your seventh house in late 2029 while your Mercury period begins at the same time, and Mercury is sitting right there in that house. So 2029 into 2031 is where your marriage is.

There is a reason nothing has converted for years, and it is not a lack of talent. You have been running Saturn since 2010 and it continues until September 2029, and your Saturn sits in the fifth house, which is creativity and romance both. The one planet ruling nineteen years of your life has been sitting on the exact two things you are asking me about. That ends. From 23 February 2027 your Jupiter period begins, and your Jupiter is in his own sign in the second house of wealth, the best placement in your whole chart. That is when the earning actually starts.

On what to focus on, the chart is specific. Your tenth lord Sun is exalted but sits in the sixth house, and your eleventh lord Mercury sits in the seventh, which is the house of clients and partnership. Both say one thing. You earn through other people, through briefs and clients and a structure someone else sets, not by creating alone and hoping it sells afterwards. Rahu sits in your eleventh house of gains and Rahu is the planet of technology and gaming, so that side is a genuine income channel for you. Venus in his own sign gives you the art and the music honestly, but paid design work for clients is what will pay first. Take small paid briefs rather than building your own things and waiting.

One plain thing outside the chart. Those daily drives are costing you more than the hours. A twelfth house Moon will let you carry that for years if you permit it. Put those hours into client work instead. Offer water to the Sun at sunrise and keep Thursdays for Jupiter, since Jupiter is the planet about to carry you out of this stretch.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s567');
x.chart=chart;
x.person={name:'Tilak Bahadur Subedi',dob:'1996-05-03',time:'20:45 (stated 20:30-21:00; lagna Scorpio throughout)',place:'Bhadrapur, Jhapa, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
x.awaiting=false;
s.pandit.activity='s567 Tilak — Vrischik lagna, Chandra 12th, Shani+Ketu 5th, 7th lord Shukra swagrihi 7th ma; Guru AD 23 Feb 2027';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,L.degreeInSign.toFixed(2),'| Moon',m.signName,m.nakshatra,'| MD',md.planet,'AD',ad.planet,'| msg',nid);
