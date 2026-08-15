const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'2001-12-06',time:'07:45',latitude:22.6572,longitude:88.8642,timezone:'Asia/Kolkata'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('2001-12-06T07:45:00+05:30'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-12');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`Your first attempt failing was not bad luck. In your chart the lords of four houses that a civil service selection rests on all sit together in the twelfth house, which is the house of loss. Your tenth lord Mercury which carries the government post, your sixth lord Venus which carries competition, your eleventh lord of fulfilment, and your ninth lord the Sun, every one of them in the twelfth, and two of them burnt by the Sun's closeness. On 24 May 2026 you were running Venus, and Venus is one of those burnt planets. The chart matches exactly what happened to you.

One placement of yours is genuinely strong for this line though, and you should not throw it away. Saturn sits in your sixth house, and Saturn there is among the best placements in the whole chart for competitive examinations. It means you can outlast other people, that a long grinding preparation will not break you, and that whatever comes will come through persistence rather than through one brilliant quick run. Saturn gives late, but Saturn does give.

On timing, your Saturn sub period runs until 19 May 2028, so the 2027 attempt is the strongest of the near ones and worth preparing for properly. The larger window comes after that. From May 2028 you enter the sub period of Mercury, who owns your tenth house of government position, and Jupiter crosses that same tenth house in 2029 and then your eleventh house of fulfilment in 2030. If a selection comes, 2029 and 2030 is where it sits, not this year and not the next.

You asked about a good rank, and I would be doing you no favour by softening this. These placements do not show a top rank. Selection with persistence is possible, a high rank is not what your chart says. There is something else in it you should weigh seriously. A twelfth house stellium together with Saturn in the sixth is the classical signature of hospitals and health service, and you already hold a BSc Nursing. That is not coincidence, it is your chart naming the field it actually supports. The health services route, whether that is the medical and health cadre inside the civil services, a state health post, or a government nursing officer position, sits far better with your placements than the general administrative route. Keep preparing, but put applications in on that side too, because that is the door your chart has left standing open.

Give arghya to the Sun at sunrise on Sundays. The Sun is the planet burning your career and competition lords in this chart, and it is also the planet of government authority itself, so it is the right one to work on for the very thing you are chasing.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s568');
x.chart=chart;
x.person={name:'Sanganika Naskar',dob:'2001-12-06',time:'07:45',place:'Basirhat, West Bengal, India'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
x.awaiting=false;
s.pandit.activity='s568 Sanganika — UPSC, 10/6/11/9 lords all in 12th (2 combust), Shani 6th ma balio, Budh AD 2028+, Guru 10th 2029';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,L.degreeInSign.toFixed(2),'| Moon',m.signName,m.nakshatra,'| MD',md.planet,'AD',ad.planet,'| msg',nid);
