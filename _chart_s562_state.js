const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'2004-04-02',time:'09:45',latitude:28.0333,longitude:82.4833,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('2004-04-02T09:45:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-11');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`You are not built to stay an employee for life. Venus, your lagna lord, sits in its own sign right in your ascendant along with Mars, so you are self driven and you want your own name on the work. Saturn rules your 10th house of career and sits in the 2nd house in Gemini, which means you earn through dealing, talking, buying and selling. Parashara's rule for the 10th lord placed in a good house is gain both in service and in business, and that is your position exactly.

So practically, job first and your own work later. Take a job for the next few years for the training and the capital, but do not plan on taking orders for twenty years, you will not last in that. Venus type lines suit you best, clothing, fashion, beauty, jewellery, vehicles, hospitality, media and design, or trading in such goods. Mercury and Rahu sit in your 12th house which is a real foreign pull, so a job abroad or an import export line also fits you.

Your twenty year Venus mahadasha ends on 13 September 2027 and you are in the Ketu sub period till then, which is exactly why everything feels unsettled and unclear right now. Do not launch anything big in this phase. Sun mahadasha starts September 2027 for six years, and 2028 to 2030 is your real window to stand on your own.

Your life partner comes in that same phase. July to November 2028 is the strongest, that is the period of Mars, your 7th lord, and marriage most likely falls between 2028 and 2030 when Jupiter crosses your 7th house. Before that there can be attraction but nothing that settles. She will be good looking and well kept, straight in speech, strong willed, emotionally deep and private, loyal but not the quiet obedient type, and most likely someone from your own circle rather than a stranger from far away. One thing you should know, Mars in your ascendant makes you Manglik, so get the charts matched properly before anything is fixed.

The name cannot be told from a chart, and anyone who hands you a full name is guessing. The chart only gives a sound. Your 7th lord is in Rohini second pada, which leans to a name starting with Va or Ba, so take that as a hint and nothing more. Read Hanuman Chalisa on Tuesdays, it helps both the Mars in your ascendant and the work you start.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s562');
x.chart=chart;
x.person={name:'Mukesh Pandeta',dob:'2004-04-02',bs:'2060-12-20',time:'09:45',place:'Ghorahi, Dang, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
s.pandit.activity='s562 Mukesh Pandeta — career (Shani 10th lord in 2nd, Malavya) + partner timing 2028-2030';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,L.degreeInSign.toFixed(2),'| Moon',m.signName,m.nakshatra,'| MD',md.planet,'AD',ad.planet,'| msg',nid);
