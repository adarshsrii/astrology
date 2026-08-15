const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'1979-05-05',time:'09:45',latitude:27.8667,longitude:84.9167,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('1979-05-05T09:45:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-11');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`Tapaiko aafnai ghar huncha, tyo pakka ho. Tara aafnai kamai ra mehanet le banaunu huncha, kasaile taiyar parera hatma dine kura hoina, tyahi le abasamma dhilo bhaeko ho.

Kundali ma char au bhav khali cha ra tesko swami Budh kamjor rashi ma pareko cha, tyahi le ghar ko kura barsau dekhi atkiyeko. Tara tyahi Budh dasau bhav ma uccha ko Shukra sanga basecha, uccha ko Brihaspati le tyaslai heriraheko cha, ra jagga ko karak Mangal le sidhai char au bhav ma drishti dincha. Yo yog le ghar dincha, matra samay lagayera dincha.

Ahile Mangal ko mahadasha bhitra Shukra ko antardasha chaleko cha, 2027 ko September samma, ra yehi nai ghar ko lagi tapaiko sabai bhanda ramro samay ho. Ek adchan chai cha, gochar ma Shani ahile tapaiko janma ko Shukra mathi nai basirakheko cha, tesaile paisa, karja ra kagajpatra ko kaam ahile susta ra dhilo cha. Tyo Shani 2027 ko Chaitra Baishakh tira tyo thau bata hatchha.

Tesaile 2027 ko suru samma thulo lagani ma nahamnuhos, kagajpatra, naapi ra jagga ko kaam matra milaunuhos. 2027 ko madhya dekhi September bhitra kharid, karja ya nirmaan suru garnu ramro huncha. Ghar taiyar bhaera basne kura chai 2028 ko August pachi dekhi 2029 bhitra dekhincha, kinabhane tyo bela Brihaspati tapaiko char au bhav mai pravesh garcha.

Sano upaya, mangalbar masuro ko dal ra rato kapada daan garnuhos, ra kaam suru garda bhumi pujan nachutaunuhos.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s563');
x.chart=chart;
x.person={name:'Madhu Sharma',dob:'1979-05-05',time:'09:45',place:'Dhading, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
s.pandit.activity='s563 Madhu Sharma — ghar ko prashna, Mangal MD / Shukra AD ra Brihaspati ko char au bhav pravesh ma timing diyo';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,L.degreeInSign.toFixed(2),'| Moon',m.signName,m.nakshatra,'| MD',md.planet,'AD',ad.planet,'| msg',nid);
