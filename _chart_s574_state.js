const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'1999-11-10',time:'10:35',latitude:26.4525,longitude:87.2718,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('1999-11-10T10:35:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-12');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`Yes, marriage is there for you, and the likeliest window is late 2027 into early 2028. You entered a twenty year Venus period in December 2024, and Venus is the planet of marriage itself. Within it, the stretch from August 2027 to February 2028 belongs to Mercury, who owns your seventh house, so the marriage karaka and the marriage lord are running together there. There is a smaller earlier window from September 2026 to February 2027, but the later one is the stronger of the two.

Now the part I want you to hear properly, because your chart looks harsh at first glance. Four of your planets sit debilitated, Venus among them, your seventh lord Mercury sits in the twelfth house, and you are manglik from the ascendant, from the Moon and from Venus. Anyone reading only that much would frighten you. But every one of those four debilitated planets has its dispositor sitting in an angle, which cancels the debilitation, and Jupiter throws his aspect straight onto your Mars, which is the classical cancellation of manglik dosha. So do not carry fear about that word.

The most telling thing in your chart is this. Venus is debilitated in your birth chart but exalted in your navamsa, and the navamsa is the chart we read for marriage above all others. That combination has one clear meaning. The marriage looks difficult from the outside and in its early stretch, and then it becomes genuinely good. Your later married years will be considerably better than your first ones, and that is not a small thing to know in advance.

About him, the seventh lord in the twelfth points to someone not from your own place, either from elsewhere or settled away, and this marriage may well take you away from Biratnagar. Mercury there suggests an educated man who is quick with words, and since it is retrograde it can also mean someone already known to you coming back into the picture. In the navamsa your seventh lord Mars sits in his own sign, so he will be strong willed and firm, and the marriage will have real staying power.

The honest caution is the early years. Debilitated Venus together with the Mars affliction brings friction at the start, and that twelfth house placement can mean stretches of living apart for work or study. Your Moon is also debilitated in the twelfth, so you hold a great deal inside. Say things out loud rather than withdrawing, because most of the difficulty in those first years will come from what goes unsaid rather than from anything truly wrong between you.

Keep Thursday for Jupiter and offer something yellow. Jupiter is your ascendant lord, he is the karaka of the husband for a woman, and he is the very planet cancelling your manglik dosha, so that single observance covers all three at once.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s574');
x.chart=chart;
x.person={name:'Prabeshika',dob:'1999-11-10',time:'10:35',place:'Biratnagar, Morang, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
x.awaiting=false;
s.pandit.activity='s574 Prabeshika — vivah, Shukra MD, 7th lord Budh PD Aug 2027-Feb 2028, neecha bhanga x4, Shukra D9 uchcha';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,L.degreeInSign.toFixed(2),'| Moon',m.signName,m.nakshatra,'| MD',md.planet,'AD',ad.planet,'| msg',nid);
