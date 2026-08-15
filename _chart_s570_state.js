const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'2006-01-01',time:'10:00',latitude:27.7172,longitude:85.3240,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('2006-01-01T10:00:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-12');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`Your Masters will most likely be abroad, and the chart is quite direct about it. Jupiter, the planet of higher learning, sits in your ninth house, which is the house of higher study itself. The lord of that ninth house is Venus, and Venus sits in your twelfth house, the house of foreign lands. When the lord of higher education sits in the house of foreign residence, the degree gets taken outside the country. Your fourth lord of education happens to be Venus as well, so the chart says the same thing twice over.

On where exactly, let me be straight about what a chart can and cannot give. It shows the direction and the character of a place, never the name of a country. Yours leans west rather than east, and the Capricorn placements suggest a cold climate with old, structured, well established institutions rather than somewhere warm and informal. Europe, Britain or North America sits better with your chart than the nearer options do.

The timing is the useful part. You are in the Mars period now and it ends on 4 January 2027, and Mars owns your tenth house of work, which is precisely why you are already doing the work you mentioned. That entire phase closes in January. From 4 January 2027 an eighteen year Rahu period begins, and Rahu is the planet of foreign places and of breaking away from where you began. Transiting Rahu also passes through your twelfth house of foreign lands across 2027 and 2028. So the applications and the move belong to those two years, and Jupiter crosses your ninth house of higher study in 2029, which is when the studying itself most likely lands.

On money, the work you are doing now is not where your income gets decided. Rahu sits in your second house of wealth, so the eighteen year period starting in January 2027 is what actually changes your earning. Income begins climbing from 2027, but real independence, the point where you stand without anyone behind you, settles closer to 2029 and 2030, when Jupiter, who owns both your second house of wealth and your eleventh of gains, crosses that ninth house. You are twenty. Nothing in this chart says you are behind.

One small thing for later. You gave the time as a round ten o'clock. Everything above comes from the main chart and holds comfortably either side of that, so it stands as written. But if you ever ask about marriage, find the exact minute first, because the finer chart used for that question shifts every few minutes at your hour of birth.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s570');
x.chart=chart;
x.person={name:'Prisha Malla',dob:'2006-01-01',time:'10:00 (rounded)',place:'Kathmandu, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
x.awaiting=false;
s.pandit.activity='s570 Prisha — Masters videsh ma, 9th lord Shukra 12th ma, Rahu MD 4 Jan 2027, Guru 9th ma 2029';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,L.degreeInSign.toFixed(2),'| Moon',m.signName,m.nakshatra,'| MD',md.planet,'AD',ad.planet,'| msg',nid);
