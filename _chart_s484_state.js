const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'2005-04-17',time:'07:59',latitude:27.7172,longitude:85.3240,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
const d=A.calculateVimshottariDasha(new Date('2005-04-17T07:59:00+05:45'),m.nakshatra,(m.longitude%13.3333333),3);
const T=new Date('2026-08-05');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`Raunak ji, the job comes in the stretch between October 2026 and July 2027, and that is close.

You are in the Mercury mahadasha with the Rahu sub period, which began on 25 May 2026 and runs to December 2028, and Rahu is sitting in your eleventh house, the house of income. That is the period that turns effort into earning. Inside it the sharpest window is 11 October 2026 to February 2027, when Jupiter, who owns your eleventh house, holds the sub sub period, and then February to July 2027, when Saturn, the lord of your tenth house of work, holds it. Those two stretches back to back are when the first job actually lands.

There is a good structure sitting underneath this. Mercury owns your fifth house of education and sits in the eleventh, while Jupiter owns your eleventh and sits in the fifth, so the two have exchanged houses. In plain terms, whatever you study converts directly into your income. That is not a common placement, and it means you should finish your qualification and use it rather than grabbing whatever comes first.

Mars is exalted in your ninth house and he also owns your twelfth, so a job with a foreign link, or work that takes you out of the country, is quite likely and it suits you well.

One honest note. Mercury, your mahadasha lord, is debilitated, so the first job may pay less than you feel you are worth and you may be undervalued at the start. Do not judge the whole path by the first salary, the exchange in your chart pays out over years, not in the first offer.

Offer green moong on Wednesdays for Mercury.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s484');
x.chart=chart;
x.person={name:'Raunak Mishra',dob:'2005-04-17',time:'07:59',place:'Kathmandu, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
s.pandit.activity='s484 Raunak — job timing reading di';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,'MD',md.planet,'AD',ad.planet,'msg',nid);
