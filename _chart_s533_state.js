const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'1995-09-19',time:'10:00',latitude:27.6667,longitude:85.3167,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('1995-09-19T10:00:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-11');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`Harsik ji, bihe huncha, tara tapaiko kundali ma dhilo hune karan spashta cha, ra tyo tapaile aafai le abasamma bhogisakeko kura ho.

Saatau ghar ma Ketu basecha, saatau ghar ka swami Mangal lagna mai Rahu sanga basnu bhaeko cha, ra bihe ka karak Shukra, jo tapaiko lagna ka swami pani hun, baahrau ghar ma nichha ra asta awastha ma chan. Yati kura ek thau ma pareko le nai bihe ko kura barsau agadi badhena. Tara thulo rahat pani cha, tyahi Shukra sanga uccha ko Budh basnu bhaeko cha ra tesle Shukra ko nichha bhang gardincha. Yehi karan le bihe hunchha, ra dhilo bhaye pani ramro nai huncha.

Ahile ko samay nai tapaiko sabai bhanda ramro samay ho. Budh ko mahadasha bhitra Shukra ko antardasha chaleko cha, 13 June 2028 samma. Shukra tapaiko lagnesh ra bihe ka karak dubai hun, ra mahadasha ka swami Budh sangai basnu bhaeko cha. Yo bhanda ramro yog tapaiko jeevan ma chhitai feri audaina. Yesai bhitra January dekhi June 2027 samma, ra feri November 2027 dekhi April 2028 samma, yi duita sabai bhanda balio window hun.

Tesaile parkhera nabasnuhos, ahile dekhi nai kura chalaunuhos. July 2027 pachi Shani tapaiko saatau ghar ma pravesh garcha ra tyasle kura lai sustaucha, tesaile tyo bhanda agadi nai kura agadi badhaunu ramro huncha.

Ek kura saaf bhanidinchu. Lagna ma Mangal bhaeko le tapai manglik hunuhuncha, tesaile kundali milan raamro sanga garaunuhos, hataar ma nagarnuhos. Ra Ketu saatau ghar ma bhaeko le kahilekahi tapai aafaikoman adhkalto huncha, aafule pani puro man banaunu parcha. Yo dhilo ma tyo pani ek karan ho, sabai kura bahira ko dosh haina.

Upaya sano cha, mangalbar Hanuman ji ko darshan garnuhos ra shukrabar seto vastu daan garnuhos.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s533');
x.chart=chart;
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
s.pandit.activity='s533 Harsik — bihe ko samay, Shukra AD 13 Jun 2028 samma, Jan-Jun 2027 ra Nov 2027-Apr 2028 balio';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,L.degreeInSign.toFixed(2),'| MD',md.planet,'AD',ad.planet,'| msg',nid);
