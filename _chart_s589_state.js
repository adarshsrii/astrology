const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'1998-06-14',time:'23:21',latitude:27.7172,longitude:85.3240,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('1998-06-14T23:21:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-13');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`The thing you feel blocking you is real, and it sits in your chart in three separate places, so let me name it rather than talk you out of it. Your ascendant lord is Saturn, and your Saturn is debilitated. Ketu sits on your ascendant almost exactly, within a fifth of a degree of it. And your tenth lord Mars is combust, burnt by closeness to the Sun. All three of those fall on the axis of the self and of visible achievement, so the pattern is that you work, the work is sound, and it does not show or land the way it should. That is not imagination and it is not a fault in you.

The timing is the part that will help you most. You have been in Jupiter mahadasha since August 2022 and it runs until 2038, but inside it you are currently in the Saturn sub period, and Saturn is that same debilitated ascendant lord. You are living the sub period of the one planet in your chart that sits in its fall, and it ends on 22 April 2027. That date is your barrier lifting. From then until July 2029 you run Mercury, and your Mercury is in his own sign in the fifth house of intellect and study, so the mind and the studying become the strong thing at precisely the moment the block releases.

Your money is far better than your present feeling suggests. Jupiter sits in his own sign Pisces in your second house of wealth, Jupiter also owns your eleventh house of gains, and you are inside Jupiter's own sixteen year period right now. Wealth is the genuinely well built part of this chart, and your financial future is not what you should be spending worry on.

On going abroad, the answer is yes, but not smoothly and not yet. Your Moon sits in the twelfth house of foreign lands, which does support living away from where you were born. But the lord of that twelfth house is the same debilitated Saturn, and your ninth lord of higher education sits right beside it, so the process side, the applications and the paperwork and the visa, is exactly where the friction lands, and that is why pushing at it now feels like hitting a wall. Rahu moves through your twelfth house across 2027 and 2028, and Jupiter crosses your ninth house of higher study in 2029 and 2030. The real window is 2028 into 2029, and effort spent before April 2027 will cost you more than it returns. A chart gives the direction and the conditions and never the name of a country, so I will not tell you it says America. It says abroad, by a slow and paperwork heavy road.

Health and relationships more briefly. Your sixth and eighth houses are both empty, which is genuinely good news, so there is no structural illness written here, and your sixth lord sitting in the twelfth actually works in your favour. What you will feel is nervous rather than physical, poor sleep, low energy and a mind that will not settle, which is the Moon in the twelfth together with Ketu on the ascendant, and it always worsens in the stretches when you push hardest. Relationships are the weaker area. Rahu sits in your seventh house and your seventh lord stands in the very last degree of its sign, so attraction arrives suddenly while commitment settles late, and the person is likely to come from a different background or place from yours, which fits the foreign thread running through the rest of your chart.

Keep Saturdays for Saturn, with oil and some service to people who work with their hands, because Saturn rules both your ascendant and your twelfth house of foreign settlement, so the same planet carries both the block and the journey out. A Ganesh prayer for the Ketu sitting on your ascendant would not go astray alongside it.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s589');
x.chart=chart;
x.person={name:'Romi Baidya',dob:'1998-06-14',time:'23:21',place:'Kathmandu, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
x.awaiting=false;
s.pandit.activity='s589 Romi — Kumbha lagna, Shani neech lagnesh + Ketu lagna par = barrier; Guru-Shani AD ends 22 Apr 2027; videsh 2028-29';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,L.degreeInSign.toFixed(2),'| Moon',m.signName,m.nakshatra,'| MD',md.planet,'AD',ad.planet,'| msg',nid);
