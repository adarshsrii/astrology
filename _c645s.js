const A=require('./index.js');const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'1997-09-03',time:'10:30',latitude:26.6431,longitude:74.0357,timezone:'Asia/Kolkata'};
const r=A.calculateBirthChart(B);const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra;if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('1997-09-03T10:30:00+05:30'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-16');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`Praful ji, sabse pehle ek baat jo aapke chart me saaf dikhti hai. Aapki kamai ki dikkat nahi hai, kharch ki dikkat hai.

Aapka lagna Tula hai. Gyarahvan bhav, jo aamdani ka bhav hai, aapke chart ka sabse mazboot hissa hai. Surya wahan apni hi rashi Simha me moolatrikona me baithe hain, unke saath Budh aur Rahu bhi hain, aur dhan bhav ke swami Mangal lagna me hain. Yaani paisa banane ki kshamta poori hai.

Lekin dasham bhav ke swami Chandra barhau bhav me hain, aur lagna ke swami Shukra bhi usi barhau bhav me hain aur wo neech hain. Barhaun bhav kharch ka bhav hai. Aapka business kamata hai, par jo kamata hai use barhaun bhav kha jata hai, isiliye kabhi stable nahi lagta. Ye zyada kamane se theek nahi hoga, kharch aur naya karz rok kar hi theek hoga.

Karz ki baat karein to abhi ka samay hi sabse bhaari hai. Aap April 2024 se Rahu-Shani ki antardasha me hain aur aapke Shani chhathe bhav me baithe hain, jo karz ka hi bhav hai. Upar se gochar me bhi Shani abhi usi Meen rashi me chal rahe hain jahan aapke janma ke Shani hain, yaani aapki Shani ki wapasi theek karz ke bhav me ho rahi hai. Isiliye pichhle do saal itne kase hue lage. Ye antardasha 7 February 2027 ko khatam hoti hai.

Badlav ka din 7 February 2027 hai. Us din se Rahu-Budh ki antardasha shuru hoti hai jo August 2029 tak chalti hai. Budh aapke navam bhav yaani bhagya ke swami hain aur wo usi gyarahve bhav me baithe hain jahan aapki aamdani ki taakat hai. Aur theek usi samay gochar me Brihaspati bhi aapke gyarahve bhav me aa kar aapke moolatrikona ke Surya ke upar se guzarte hain. Do badi cheezein ek saath. Isiliye stability 2027 se banna shuru hoti hai aur 2029 tak jamti hai, aur karz 2027 se 2028 ke beech utarta hai.

Ek achhi baat jo aapko pata honi chahiye. Chhathe bhav ke swami Brihaspati aapke chart me neech hain, aur karz ke bhav ka swami kamzor hona karz ke liye achha mana jata hai, matlab karz aap par hamesha haavi nahi rahega. Aur Shani, jo Tula lagna ke yogakarak hain, wo bhi usi chhathe bhav me hain, aur chhathe bhav ka Shani lagataar lage rehne wale ko karz aur virodhi dono par jeet deta hai.

Ab doosra sawal, hotel chalega ya kuch aur karna padega. Sach ye hai ki hotel ki line aapke chart ki sabse mazboot line nahi hai. Hotel property aur aatithya ka kaam hai jo Shukra aur chauthe bhav se dekha jata hai, aur aapke Shukra neech hain ani chauthe bhav me baithe Brihaspati bhi neech hain. Aapki asli taakat gyarahvan bhav hai, yaani log, sampark aur len-den. Mangal dhan aur saatve bhav ke swami ho kar lagna me hain, jo seedhe vyapar aur saajhedari wale kaam ko suit karta hai. Isliye hotel band karne ki zarurat nahi, par sirf usi ke bharose mat rahiye, apne sampark aur len-den wale kaam ko saath me badhaiye, wahi zyada tezi se chalega.

Ek cheez zaroor dhyan rakhiye. February 2027 se pehle naya karz mat lijiye. Rahu cheezon ko bada dikhata hai aur chhathe bhav ka Shani use bhaari bana deta hai, is samay liya gaya karz bahut aage tak khinchega.

Chhota upay, sanivar ko til ka tel ya kaale til daan kijiye aur mehnat-mazdoori karne walon ki madad kijiye, kyunki abhi ka poora dabav Shani ka hai aur wahi aapke lagna ke yogakarak bhi hain.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s645');
x.chart=chart;
x.person={name:'Praful',dob:'1997-09-03',time:'10:30',place:'Merta City, Rajasthan, India'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;x.awaiting=false;
s.pandit.activity='s645 Praful — Tula lagna; kamai theek (Surya moolatrikona 11th + Budh + Rahu, 2L Mangal lagna) par 10L Chandra + lagnesh Shukra NEECH dono 12th = kharch ka rog; Rahu-Shani (Shani 6th=karz) + Shani return tak 7 Feb 2027 bhaari; 7 Feb 2027 se Rahu-Budh + Guru gochar 11th = turn, karz 2027-28; hotel weak line (Shukra neech, Guru neech 4th)';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK',L.signName,L.degreeInSign.toFixed(2),'| MD',md.planet,'AD',ad.planet,'| msg',nid);
