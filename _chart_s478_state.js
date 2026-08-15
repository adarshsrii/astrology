const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'1997-08-26',time:'15:12',latitude:28.2700,longitude:83.5900,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('1997-08-26T15:12:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-05');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`Bujita ji, that is enough to work with. Anywhere between 3 and 3.25 your lagna stays Sagittarius, so the reading holds either way.

Taking the timing first, because you are inside the window right now. Your Jupiter mahadasha is running and since 19 May 2026 the sub period belongs to Mercury, who owns your seventh house of marriage, while Jupiter himself is the karaka of the husband in a woman's chart. Those two together make this the marriage period, and it runs to 23 August 2028. The sharpest stretch inside it is 31 October 2026 to 18 March 2027, and there is a second one from 26 December 2027 to April 2028. If it does not complete in those, the next real opening is from July 2029.

As for whether you already know him, your seventh lord Mercury sits in the ninth house with the Sun and Rahu, and the ninth is the house of distance, higher study and elders. That says he is not someone in your daily circle at present. He comes from another place or another region and he reaches you through an introduction, an elder, or through study or travel rather than through your friend group. Mercury is retrograde there, so the connection tends to come back around rather than arrive brand new, which often shows up as a proposal that was raised once before and returns, or someone you crossed paths with briefly and did not think about again.

On his profession, your seventh house is Gemini and its lord sits with the Sun in Leo in the ninth, so he will be an educated professional in a Mercury line, most likely IT or software, accounts, banking or finance, teaching, or an administrative or government post. Rahu sitting there adds a foreign link, so work connected to abroad, or a stretch of working overseas, is likely.

There is one thing in your chart that a quick reading would get wrong. Jupiter, the planet of the husband for you, is debilitated, and on the surface that reads as a poor or badly delayed marriage. In your case the debilitation is cancelled twice, Saturn who owns the sign Jupiter sits in is placed in a kendra, and in your navamsa Jupiter is exalted. So the match looks weak on the surface and is genuinely strong underneath. Your husband may not seem impressive at the first meeting and will turn out far more solid than he looks. You are also not Manglik from either the lagna or the Moon, so that will not stand in the way.

Keep Thursdays for Jupiter, offer something yellow or a little haldi at a temple, since he is the planet carrying your marriage.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s478');
x.chart=chart;
x.person={name:'Bujita',dob:'1997-08-26',time:'15:00-15:25 (read at 15:12)',place:'Baglung, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
s.pandit.activity='s478 Bujita — marriage + spouse reading di (time narrowed)';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,'MD',md.planet,'AD',ad.planet,'msg',nid);
