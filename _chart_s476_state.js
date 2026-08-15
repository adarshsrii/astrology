const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'1994-12-15',time:'09:05',latitude:28.4089,longitude:77.3178,timezone:'Asia/Kolkata'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('1994-12-15T09:05:00+05:30'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-05');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`Anshuka ji, the strongest marriage window in your chart is April 2029 to 2032, and within that 2029 to 2030 is where it most likely lands, because that is the Venus period inside your Rahu dasha and Venus sits in her own sign Libra as the karaka of marriage. There is a smaller opening around the middle of 2027 while your seventh lord period is still running, so if a proposal is already in motion it can complete then, but I would not expect it inside this year.

The delay you have been feeling has a clear reason. Your seventh lord Mercury is combust with the Sun and placed in the twelfth house at the very last degree of Scorpio, which is about the weakest spot a seventh lord can sit in, so proposals come, look promising and then quietly fall away. That is the chart, not anything you are doing wrong. One good thing is that you are not Manglik at all, Mars is in the ninth and does not create that dosha.

About his looks, your seventh house is Gemini and its lord sits in Scorpio in Jyeshtha, so he will look younger than his age, slim to medium built, wheatish, with sharp intense eyes and a quiet reserved manner that opens up only slowly. Venus in her own sign makes him genuinely good looking and well groomed. He will most likely be from a different city than yours, and he will reach you through your own circle, friends, work or a social connection, rather than through a formal arrangement.

Offer green moong on Wednesdays, that supports the weak Mercury which is exactly what needs strength in your case.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s476');
x.chart=chart;
x.person={name:'Anshuka',dob:'1994-12-15',time:'09:05',place:'Faridabad, Haryana, India'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
s.pandit.activity='s476 Anshuka — marriage timing + spouse looks reading di';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,'MD',md.planet,'AD',ad.planet,'msg',nid);
