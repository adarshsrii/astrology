const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'1996-02-26',time:'15:00',latitude:27.55,longitude:84.35,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('1996-02-26T15:00:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-16');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`Gita ji, pahila euta kura, tapaiko chori ko rashi Vrish nai ho ra Chandra Vrish ma uchcha awastha ma hunuhunxa. Tapaile bhaneko thik ho, ra tesle janma miti ra samaya dubai thik rahechha bhanne pani pushti garxa. Lagna chai Karka ho.

Visa ko kura garda, aaune yog balio xa. Shukra param uchcha bhaera nawau bhav ma basnu bhaeko xa ra nawau bhav nai lamo yatra ra bidesh ko bhav ho. Nawau bhav ka swami Brihaspati aafnai rashi Dhanu ma xan, ra lagna ka swami Chandra uchcha bhaera gyarahau bhav, arthat ichha pura hune bhav ma xan. Yi teen kura le videsh jane kura ma shanka rakhnu pardaina.

Dhilo kina bhairakheko xa tyo pani chart mai dekhinxa. Tehi param uchcha Shukra sangai Ketu ekdam najik, aadha degree bhitra, basnu bhaeko xa, ra Ketu le jun kura chhunxa tyo pugna lagera pani rokinxa. Ani gochar ma Shani aile tapaiko chori kai nawau bhav Meen mathi hindirakheka xan. Pratiksha lamo hunuko karan yi duita hun, yog kamjor bhaera haina.

Samaya bhannu parda, sabai bhanda najikko ramro window 16 September dekhi 6 November 2026 ho, kinaki tyati bela nawau bhav ka swami Brihaspati aafnai rashi ma pratyantar ma aaunxan ra gochar ma pani unaile tehi nawau bhav lai herirakheka xan. Tyo bela nabhaye 24 March dekhi 27 May 2027 sabai bhanda balio samaya ho, kinaki tyo param uchcha Shukra kai pratyantar ho. Ani 17 July 2027 bata Brihaspati kai mahadasha suru hunxa ra unai bidesh ka swami hun, tesaile 2027 bhitra yo kura tungiera janxa.

Bihe ko kura garda chart le arrange nai dekhaunxa. Saptam bhav ka swami Shani nawau bhav ma xan ra nawau bhav bau ra thulo manche ko bhav ho, tesaile bihe ghar parivar ra thulo manche kai madhyam bata milxa. Prem bihe ko lagi chahine jun yog ho, panchamesh ra saptamesh bich ko sambandha, tyo yo chart ma xaina.

Disha ko kura garda, saptam bhav ka swami Shani Meen rashi ma xan ra Parashar le Meen lai uttar disha bhaneka xan, ani saptam bhav mai barhau bhav ka swami Budh basnu bhaeko xa ra barhau bhav videsh ko bhav ho. Tesaile keta uttar tarfa bata, wa ghar bata tadha ra bidesh sanga jodiyeko hune sambhavana sabai bhanda badhi xa. Najikai khojne ho bhane saptam bhav aafai Makar ho ra tyo dakshin disha ho, tara mukhya sanket uttar ra tadha kai xa.

Milan garda euta kura ma dhyan dinus, Mangal aathau bhav ma hunaale mangal dosh xa. Mangal yo lagna ka lagi ramro graha hun tesaile tyati kada haina, tara milan chai ramrari garaunus.

Chhoto upaya, sukrabar Shukra ka lagi safed kapada wa mitho khana daan garaunus, kinaki tapaiko chori ko sabai bhanda balio graha Shukra nai hun ra unai mathi Ketu ko chhaya pareko xa.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s636');
x.chart=chart;
x.person={name:'Chori (Balkumari)',dob:'1996-02-26 (BS 2052-11-14)',time:'15:00',place:'Chitwan / Pokhara, Nepal (dubai bata same lagna)'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
x.awaiting=false;
s.pandit.activity='s636 Gita (chori) — Karka lagna, Chandra Vrish UCHCHA (uska rashi claim sahi); Shukra param-uchcha 9th par Ketu 0.7deg = visa delay; window 16 Sep-6 Nov 2026, phir 24 Mar-27 May 2027, Guru MD 17 Jul 2027; bihe ARRANGE (7L Shani 9th); disha UTTAR; Mangal 8th = manglik';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,L.degreeInSign.toFixed(2),'| Moon',m.signName,m.dignity,'| MD',md.planet,'AD',ad.planet,'| msg',nid);
