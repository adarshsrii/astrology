const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'2004-04-24',time:'07:55',latitude:27.7000,longitude:83.4500,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('2004-04-24T07:55:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-06');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`Nisha ji, yes, the visa goes through, and 2027 is the right year for it. The strongest window is May to October 2027.

You have Taurus lagna. Your twelfth house, the house of foreign lands, holds an exalted Sun together with Rahu, and that is one of the clearest going abroad signatures a chart can carry. The lord of that twelfth house, Mars, sits right in your own lagna. Living outside the country is not a maybe in your chart, it is built into it.

On the timing. You are in Jupiter mahadasha with the Jupiter sub period running to 17 October 2027. Inside it, Mars holds the sub sub period from 8 May to 22 June 2027, and Rahu from 22 June to 17 October 2027. Mars owns your twelfth house and Rahu sits inside it, so those two stretches back to back are your actual departure window. Time your application so the decision lands in that period, which means filing by early 2027.

The dependent route is the stronger of the two doors. In your chart Mars owns the seventh house of partner and the twelfth house of foreign at the same time, and both sit in your lagna alongside Venus. Going abroad along with your partner is written more clearly than going alone, so the Australia student dependent plan suits your chart better than a solo attempt.

The Gulf working visa is possible but it is not your first door. Saturn owns both your ninth and tenth houses and his period only begins in October 2027, so work abroad opens after Australia, not before it. Keep the Gulf as your second option, not your main plan.

One honest warning. Jupiter is retrograde in your chart, and Mercury, who governs papers and documents, sits weak in your eleventh house. Expect one rejection, or a file sent back for a missing document. Do not read that as a no. Venus is strong in her own sign in your lagna and repairs that weakness, so the corrected file is the one that passes.

Right now nothing is moving, and there is a reason. Till mid September 2026 you are running a Ketu sub period, which is why everything feels stuck and delayed. From 16 September 2026 Venus takes over and the movement begins.

Remedy: offer water to the rising Sun on Sunday mornings, and keep the Thursday fast for Jupiter if you can.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s464');
x.chart=chart;
x.person={name:'Nisha',dob:'2004-04-24',time:'07:55 AM',place:'Butwal, Rupandehi, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
s.pandit.activity='s464 Nisha — Australia visa timing reading di';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,'MD',md.planet,'AD',ad.planet,'msg',nid,'houses',houses.length);
