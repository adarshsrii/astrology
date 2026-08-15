const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
// 5:30 resolved to MORNING: only the AM chart puts Saturn in the 8th, which is his own premise.
const B={date:'2006-01-27',time:'05:30',latitude:27.2333,longitude:85.9167,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('2006-01-27T05:30:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-12');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`Ho, tapaiko aathau bhav ma sacchai Shani baseko cha, Karkat rashi ma ra bakri avastha ma. Samaya bihana 5:30 nai rahechha, kinabhane tyo bela matra lagna Dhanu parcha ra Shani aathau gharma basxa. Beluka 5:30 hunthyo bhane Shani pahilo gharma parthyo, tesaile tapaile sodheko prashna le nai samaya pakka pariidiyo.

Pahila man bata dar hatanus. Aathau gharko Shani lai manisharu jati darlagdo bhanchan, tyati hoina. Shani aayu ko karak ho ra aathau ghar aayu kai ghar ho, tesaile u aaphnai kaam garne thaau ma baseko jasto ho. Tapaiko aathau gharko swami Chandrama kendra ma baseko cha, ra shastra le tyaslai dirgha aayu ko lakshan bhancha. Yo tapaiko kundali ko baliyo paksha ho, kamjori haina.

Yesle asar garne kura arkai cha. Shani tapaiko dosro ghar, arthat dhan ra parivar ko swami ho, ra tyo aathau gharma pareko cha, tesaile paisa aauncha tara tikdaina ra bachat garna gahro huncha. Kasailai rin nadinus ra kasaiko lagi jamani nabasnus, yo duitai le tapailai nai marka parcha. Ramro paksha yo cha ki aathau ghar gahiro ra lukeko kura ko ghar ho, tapailai khotalne swabhav cha, ra research, anusandhan, chikitsa athawa arkako paisa sanga jodiine kaam jastai bank, bima, lekha pariikshan ma tapai ramro garnu huncha.

Swasthya ma Shani le achanak rog dindaina, bistarai aaune purano khalko samasya dincha, prayah jodni dukhne, gyastric ra vaat sambandhi. Niyamit dincharya nai tapaiko thulo aushadhi ho.

Samaya ko kura garda tapai Shukra ko mahadasha ma hunuhuncha jun 2029 ko madhya samma cha, ra bhitra Budh ko antardasha 2028 ko May samma cha. Budh tapaiko dashamesh, arthat karma ko swami ho, tesaile yi tin barsa nai sip ra padhai banaune samaya ho. Yehi bela gareko mehanat Shani le dhilo garera bhaye pani firta dincha, u dhilo dincha tara chhoddaina. Sanibar Shani lai tel ra kalo til chadhaunus ra ghar ka budha pakaharuko seva garnus, tyeti nai paryapta cha.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s561');
x.chart=chart;
x.person={name:'Bhanubhakta Chaulagai',dob:'2006-01-27 (BS 2062-10-14, Friday)',time:'05:30 (AM confirmed by Saturn-in-8th)',place:'Sindhuli, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
x.awaiting=false;
s.pandit.activity='s561 Bhanubhakta — Shani 8th bhav, Dhanu lagna, aathau swami Chandra kendra ma, dirgha aayu';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,L.degreeInSign.toFixed(2),'| Moon',m.signName,m.nakshatra,'| Saturn H',(((pl.find(p=>p.name==='Saturn').signNumber-L.signNumber+12)%12)+1),'| MD',md.planet,'AD',ad.planet,'| msg',nid);
