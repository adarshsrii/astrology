const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'2005-06-21',time:'05:38',latitude:26.7288,longitude:85.9266,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('2005-06-21T05:38:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-05');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`Swarnim ji, keep going, but not with all of them. Your chart is clear that the capacity is real. Your lagna lord Mercury sits in his own sign right in the ascendant with the Sun and Venus beside him, which is the build of someone who genuinely can lead several things at once, so what you are feeling is not a sign that you took on work beyond your ability.

Where it is actually coming from is your Moon, which is debilitated and sitting in the sixth house. That is emotional reserve, not ability. Your mind lives inside the problems of whatever you are running, so you feel drained long before you are anywhere near failing at it. And Mars sits with Rahu in your tenth house, which is the combination that makes a person keep saying yes to one more thing well past the point where it makes sense. Put those together and the picture is not someone who should stop, it is someone carrying more than any one person should at twenty one.

So the answer is cut, not quit. Pick the two that matter most and either hand over or park the rest without guilt. You will lose far less than you think and you will get the energy back.

On timing, your Venus mahadasha began in December 2025 and runs for twenty years with Venus sitting in your own ascendant, so you are seven months into the most personally supportive stretch of your life so far. Withdrawing now would be quitting at the start of your own run. Until about the middle of September this year the period actively backs pushing your own initiatives. From mid September to the end of December the sub period belongs to that weak Moon, and that is when the tiredness will be at its worst, so plan the lightest load you can for those three months and do not start anything new in them. From late December the drive comes back properly.

Offer water to Shivji on Mondays for the Moon, and protect your sleep, in your chart that is not a small thing.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s474');
x.chart=chart;
x.person={name:'Swarnim',dob:'2005-06-21',time:'05:38',place:'Janakpur, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
s.pandit.activity='s474 Swarnim — withdraw or continue reading di';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,'MD',md.planet,'AD',ad.planet,'msg',nid);
