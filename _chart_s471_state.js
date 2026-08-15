const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'1991-09-14',time:'10:30',latitude:27.6644,longitude:85.3188,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('1991-09-14T10:30:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-06');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`Ashiya ji, thank you for checking with your mother. 10:30 in the morning gives a completely different chart from the evening time you first gave me, and now I can answer you properly.

On children. You will have children, and most likely one, with a real possibility of two. Not more than that. The reason is clear in your chart. Your fifth house, the house of children, is aspected by Jupiter, who is the natural giver of children, and that aspect is what guarantees you become a mother. But the same house is also aspected by the Sun and by Mercury, and both of those are barren planets. Jupiter opens the door, the Sun and Mercury keep the number small. So one child is certain in this chart, a second is possible, a large family is not.

On the year, and this is the part I can tell you with confidence. Your birth Moon sits in Scorpio in Anuradha, well away from any boundary, and your dasha is calculated from that Moon, so the timing in your chart is solid.

You are running the Ketu mahadasha, which ends on 20 December 2027. Ketu is the planet of detachment and letting go, and it is the least fertile period in any chart. That is why this has not happened yet, and I want you to hear that clearly, because it is a period, not a defect in you.

On 20 December 2027 your Venus mahadasha begins and it runs for twenty years. Venus is the planet of fertility and of married life, and in your chart she sits in Cancer, which is the most fertile sign of the zodiac, and she sits in a strong angular house. The first sub period of that mahadasha is Venus in her own period, from 20 December 2027 to 20 April 2031. That is your window. I would expect your first child between 2028 and 2030.

Now your life more generally. Your Moon is debilitated in Scorpio, and that is the honest weight in this chart. It means you have carried worry inwardly, felt things more deeply than you show, and there have likely been years where you held things together for others while nobody asked how you were. But your chart cancels that debility, and it cancels it through Venus, who sits strong in an angular house. In plain language, the emotional weight of your life lifts, and it lifts in the very same Venus period that brings the child. The same planet does both.

Saturn is in his own sign in your fourth house, which is the house of home and mother. Slow, but solid. Property, a settled home and stability in the family come to you and stay. Nothing in your life arrives quickly, but what arrives does not leave.

The Sun, Mercury and Jupiter sit together in your eleventh house of income and gains. Your earning comes through people, contacts and networks rather than through one fixed job, and that group of three is a genuinely good placement for money reaching you steadily.

One small honest point. At 10:30 your lagna is Libra with about ten minutes to spare, as the lagna turns to Scorpio at 10:40. If a written record, a hospital paper or a birth certificate, ever shows the time was 10:40 or later, send it to me and I will re read the fine detail. The children answer and all the timing above stay the same either way, because those come from the Moon and the dasha, not from the lagna.

Remedy: keep the Thursday fast for Jupiter, who is the one granting you the child, and offer water to a peepal tree on Saturdays for the Moon's relief.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s471');
x.chart=chart;
x.person={name:'Ashiya Shrestha',dob:'1991-09-14',time:'10:30 AM',place:'Lalitpur, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false; x.awaiting=false;
s.pandit.activity='s471 Ashiya — santan sankhya + varsh (Venus MD 2028-30) reading di';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,L.degreeInSign.toFixed(2),'Moon',m.signName,m.nakshatra,'MD',md.planet,'AD',ad.planet,'msg',nid);
