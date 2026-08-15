const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'1996-08-04',time:'22:30',latitude:28.2096,longitude:83.9856,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('1996-08-04T22:30:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-06');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`Arati ji, tapaiko chart galat chaina. Tara tapai rashi ko ekdam kinara ma janminu bhayeko rahecha, ra tyahi karan le farak farak chart ma farak kura dekhincha. Tapaiko shanka thik ho, ra ma tyo kina bhayeko ho bhanne kura pakka nikalera bhandaichu.

Pahila miti pakka bhayo. 4 August 1996 ma saccai Aitabar parcha, tesaile tapaile bhaneko miti ra bar dubai milcha. Rati 10:30, Pokhara.

Ahile tyo samaya ma tapaiko chart yasto cha. Tapaiko Chandra Mesh rashi ma cha, tara matra 0 degree 11 minute ma, arthat Mesh ko ekdam pahilo chhoti. Chandra le Meen chhodera Mesh ma pravesh gareko tyo rati 10:10 baje matra ho, tapai janmanu bhanda 20 minute agadi. Ani tapaiko lagna pani Mesh ma cha, tara matra 2 degree 20 minute ma. Lagna le Mesh ma pravesh gareko rati 10:24 baje, tapai janmanu bhanda 6 minute matra agadi.

Yehi ho puro kura. Yadi tapaiko satya janma samaya 10:23 baje rahecha bhane tapaiko lagna Meen huncha, Mesh hoina. Ra yadi 10:08 baje rahecha bhane Chandra pani Meen ra Revati nakshatra ma janchha. 20 minute ko sano pharak le tapaiko rashi nai ulto pardincha. Yo tapaiko doshi hoina, na app ko, yo tapaiko janma samaya kai swabhav ho.

Arko kura pani cha. Purano Nepali patro ra aajbholi ka software le ayanamsa, arthat gananako aadhar, alik alik farak prayog garchan. Samanya chart ma yo pharak thaha samma hudaina. Tara tapaiko Chandra sima bata matra 11 minute tadha cha, ek degree pani pugeko chaina, tesaile yaha tyo sano pharak le pani rashi badali dincha.

Malai ek kura bhanidinuhos. Tapaiko ghar ma rakheko purano janma patrika ma ke lekheko cha, Meen rashi ra Revati nakshatra, ki Mesh rashi ra Ashwini nakshatra? Yadi patrika ma Meen lekheko cha bhane tapaiko satya janma samaya 10:30 bhanda ali agadi ho, ra tyo purano patrika lai nai thik manera padhnu parcha.

Tyo pakka bhaye pachi malai bhannuhos. Chart tayar cha, matra yo ek minute ko kura milaunu paryo, ani ma tapaiko prashna ko puro jawab dinchhu.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s489');
x.chart=chart;
x.person={name:'Arati Pokhrel',dob:'1996-08-04',time:'22:30',place:'Pokhara, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false; x.awaiting=true;
s.pandit.activity='s489 Arati — rashi sandhi (Meen/Mesh kinara) samjhaayo, patrika confirm maangyo';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,L.degreeInSign.toFixed(2),'Moon',m.signName,m.degreeInSign.toFixed(2),m.nakshatra,'MD',md.planet,'AD',ad.planet,'msg',nid);
