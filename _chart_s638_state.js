const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'2005-02-26',time:'17:52',latitude:30.2458,longitude:75.8421,timezone:'Asia/Kolkata'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('2005-02-26T17:52:00+05:30'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-16');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`Prachi ji, your chart supports a love marriage, so the question is really about timing and about one specific obstacle rather than about whether it can happen.

Your ascendant is Leo and your seventh house of marriage holds three planets, Venus, the Sun and Mercury. Venus is the natural significator of marriage and sits right there, and the Sun is your ascendant lord, so you yourself are tied closely to that house. Beyond that, the lord of your seventh house, Saturn, sits in your eleventh, and the lord of your eleventh, Mercury, sits in your seventh. The two have exchanged places completely. The eleventh house is your own circle and your own wishes, so this exchange says the marriage comes by your own choosing and through your own circle rather than by an arrangement made for you.

The block is not the relationship. Your fifth lord Jupiter, which rules romance, is retrograde in your second house, and the second house is family. A retrograde planet keeps going back over the same ground, so the matter circles back to the question of family approval and never settles. The obstacle sits with the family, not with the person and not with your fate.

You are running the mahadasha of Rahu since October 2021, and Rahu is the planet that crosses conventional lines, which is why a marriage of your own choosing suits this stretch of your life. But the sub period running until 26 November 2026 belongs to that same retrograde Jupiter, which is why nothing is resolving right now. Do not push your family for a decision before that date, because the answer you get will be no.

From 26 November 2026 Saturn takes over until October 2029, and Saturn is your seventh lord of marriage. Around the same time Jupiter enters your own sign by transit and begins aspecting your seventh house and all three planets in it. That is your window, and 2027 into 2028 is the real period. That is when to raise it at home.

Saturn is retrograde and also owns your sixth house of disputes, so this will not be quick or free of resistance. Saturn gives through patience and steadiness and never through confrontation. Force it and the sixth house side of him answers instead, and you get a fight rather than a wedding.

Since the eleventh house sits at the centre of that exchange, use your circle. Support carried through friends, and through elders who know both sides, will move this much further than a direct appeal from you alone. Keep Mondays for Shiva and Parvati, which is the traditional worship for a marriage one wants.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s638');
x.chart=chart;
x.person={name:'Prachi Sharma',dob:'2005-02-26',time:'17:52',place:'Sangrur, Punjab, India'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
x.awaiting=false;
s.pandit.activity='s638 Prachi — Simha lagna; 7L Shani<->11L Budh PARIVARTANA = love marriage yog; Shukra+Surya+Budh in 7th; block = 5L Guru vakri in 2nd (parivar); Rahu MD, Guru AD tak 26 Nov 2026 (na dabao), phir Rahu-Shani 2027-28 = window';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,L.degreeInSign.toFixed(2),'| Moon',m.signName,m.nakshatra,'| MD',md.planet,'AD',ad.planet,'| msg',nid);
