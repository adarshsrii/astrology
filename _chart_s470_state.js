const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'1998-08-11',time:'01:50',latitude:27.7172,longitude:85.3240,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
const d=A.calculateVimshottariDasha(new Date('1998-08-11T01:50:00+05:45'),m.nakshatra,(m.longitude%13.3333333),3);
const T=new Date('2026-08-05');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`Anup ji, your chart leans toward an arranged marriage, or a love that ends up with your family's approval rather than against it. Venus, who carries romance in your chart, sits in the second house with the Sun, and the second is the house of family, so whatever attraction comes settles inside the family frame. Your seventh lord Jupiter sits in his own sign in the tenth house, which is a formal and respectable route, usually through work or a proper introduction. There is no runaway love signature anywhere in your chart.

The marriage itself is well supported. Jupiter owning your seventh and sitting in his own sign in a kendra alongside the Moon is one of the better marriage placements a chart can have, so your wife will be well regarded and the marriage will lift your standing rather than drain it.

The difficulty sits with Mars. He is in your lagna and throws his aspect straight onto your seventh house, and you are Manglik from the lagna, from the Moon and from Venus, all three. That does not stop the marriage but it does mean the first two or three years carry heat, arguments and a tug of war over who decides. The clean answer to it is to match with a girl who is also Manglik, since that cancels it properly, and until then keep Tuesdays for Hanuman ji.

On timing, you are in a marriage supporting period right now, Mercury mahadasha with Venus, but it closes on 5 January 2027 and the strong part of it runs only to about early November this year. If it does not happen in that stretch, the next and probably better window is November 2027 to April 2029, when the Moon period runs and your Moon sits right beside your seventh lord.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s470');
x.chart=chart;
x.person={name:'Anup Gautam',dob:'1998-08-11',dobBS:'2055-04-26',time:'01:50',place:'Kathmandu, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
s.pandit.activity='s470 Anup Gautam — love vs arranged marriage reading di';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,'MD',md.planet,'AD',ad.planet,'msg',nid);
