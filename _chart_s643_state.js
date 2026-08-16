const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'1996-03-08',time:'06:45',latitude:26.5679,longitude:88.0847,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('1996-03-08T06:45:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-16');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`Prativa ji, sarkari jagir ko yog tapaiko chart ma xa, tara dhilo aaunxa. Tapaiko lagna Meen ho ra lagnesh Brihaspati aafnai rashi Dhanu ma dasam bhav mai basnu bhaeko xa, jasle Hamsa yog banaunxa, ra Parashar le dasamesh subha bhav ma basyo bhane rajya bata phaida aaunxa bhanera lekheka xan. Ani chhaitho bhav, jun naukri ra pratiyogita ko bhav ho, tesma tesaikai swami Surya ra dasamesh Brihaspati duitai ko drishti xa. Tesaile pariksha diyera sarkari sewa ma pugne bato tapaiko lagi banda xaina.

Aile samma kina bhaeko xaina bhanne pani chart mai dekhinxa. Shani janma ma pani tapaiko lagna mai xan ra aile gochar ma pani Shani tapaikai Meen lagna mathi nai hindirakheka xan. Shani lagna ma hunda mehanat pura hunxa tara natija dhilo aaunxa, ra yo gochar 2028 ko suru tira matra sarxa.

Samaya yesto xa. Tapai 2020 dekhi 2036 samma Brihaspati ko mahadasha ma hunuhunxa ra Brihaspati nai tapaiko lagnesh ra dasamesh dubai hun, tesaile career banaune sabai bhanda ramro samaya yahi ho. 2026 ko antya dekhi Brihaspati gochar ma tapaiko chhaitho bhav ma pasxan ra tyahi bata dasam bhav lai herxan, tesaile prayas tyati bela dekhi sarna thalxa. Tara sacchikai dhoka 2028 pachi kholinxa jaba Shani lagna bata sarxan, ra sabai bhanda balio samaya Brihaspati-Surya ko antardasha ho, 2030 ko antya dekhi 2031 ko madhya samma, kinaki Surya nai tapaiko sewa ko swami ra sarkar ko karak dubai hun. Tayari chodnu hudaina, tara 2028 agadi natija bhanda mehanat nai badhi mahasus hunexa, yo maile lukaeko haina.

Teen mai kun ramro bhanne kura chart aafai le bhandaixa. Tapaiko sewa ko swami Surya, ra sangai Mangal ra Budh pani, barhau bhav ma xan, ani barhau bhav ko swami Shani chai lagna mai xan. Barhau bhav bidesh ko bhav ho ra tapaiko duitai raj yog tyahi bhav ma baneka xan, ra barhau ma baneko raj yog le janmasthan bata tadha gaepachi matra pura phal dinxa. Tesaile prakriti le sarkari sewa nai tapailai sabai bhanda milxa, kinaki Brihaspati aafnai rashi ma dasam ma basne manche ijjat ra sthirta bhaeko kaam mai nai ramro garxa, tara jun jagir aaunxa tyo Jhapa bata tadha, arko sahar wa bidesh mai hune sambhavana badhi xa. Private job chai teen mai sabai bhanda kamjor xa.

Chhoto upaya, bihana suryalai jal chadhaunus, kinaki tapaiko sewa ko swami Surya nai chart ma sabai bhanda kamjor thau ma basnu bhaeko xa.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s643');
x.chart=chart;
x.person={name:'Prativa',dob:'1996-03-08',time:'06:45',place:'Jhapa, Koshi Pradesh, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
x.awaiting=false;
s.pandit.activity='s643 Prativa — Meen lagna, Guru swagrihi dasam (Hamsa); Shani lagna par 2028 samma; sarkari yog xa, balio samaya Guru-Surya 2030-31; 12th ma 3 graha = bidesh';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,L.degreeInSign.toFixed(2),'| Moon',m.signName,m.nakshatra,'| MD',md.planet,'AD',ad.planet,'| msg',nid);
