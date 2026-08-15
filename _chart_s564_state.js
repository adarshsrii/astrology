const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'1997-07-09',time:'02:15',latitude:28.2719,longitude:83.5892,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('1997-07-09T02:15:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-11');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`The gap will not be long, so do not lose sleep over resigning. Your 10th lord Saturn sits in the 11th house, which is one of the better placements for a working life. It means your income rises through changing jobs rather than by sitting still, and it also means the next job reaches you through people who already know you rather than through a cold application. Work your contacts and old colleagues through September, that is the channel that will actually open for you.

On timing, you are in Moon mahadasha and the Venus sub period runs till 25 September. Venus rules your 6th house of service, so interviews, talks and the offer stage belong to this window. The joining itself lands a little after. The Mars sub period starts on 10 October, and around the middle to end of October transiting Jupiter, exalted at present, makes an exact aspect onto your 10th lord Saturn. October to November 2026 is your joining window, late October being the strongest. Expect a few weeks of gap after 10 September, not months. If something falls through there, that same Jupiter aspect returns between February and June 2027.

About the kind of place, Saturn in Pisces Revati with Ketu in your 10th house points to a structured, established, process driven company, bigger than where you are now, and quite possibly one with foreign clients or a foreign parent. The role will lean technical or analytical rather than front facing. Saturn will make it demanding, so expect hours and procedure rather than a relaxed office.

On salary I will not hand you a figure, no chart gives that honestly. What the chart does say is that the pay goes up and the move is worth making financially. But Jupiter, your 11th lord, is debilitated, so it will be a solid step up and not a jump into another bracket. Negotiate properly at the offer stage, the increase here comes from asking, not from the company offering it on its own.

One thing to keep in mind. Ketu sits in your 10th house and Rahu sits with your Moon in the 4th, so restlessness with work is a standing pattern in your chart and not only a problem with this employer. Choose the next place for what you will learn there, otherwise the same feeling comes back in about two years. Your Saturn return completes around May 2027, and whatever you join now becomes the base of the next long stretch of your career.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s564');
x.chart=chart;
x.person={name:'Sangam',dob:'1997-07-09',time:'02:15',place:'Baglung, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
s.pandit.activity='s564 Sangam — job change, Chandra MD / Mangal AD 10 Oct ra Guru ko drishti dashamesh mathi';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,L.degreeInSign.toFixed(2),'| Moon',m.signName,m.nakshatra,'| MD',md.planet,'AD',ad.planet,'| msg',nid);
