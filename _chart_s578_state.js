const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'1995-04-18',time:'05:30',latitude:28.0333,longitude:82.4833,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('1995-04-18T05:30:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-14');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`Yam Prasad ji, pahila miti. BS 2052 Baisakh 5 bhaneko 18 April 1995 ho ra tyo din mangalbar pareko rahecha, tesaile miti mileko cha ra yehi aadhar ma hereko chu.

Tapaiko kundali le microfinance kai kaam lai saath dincha, ra yo sanjog hoina. Chhaithau bhav rin, karja ra sewa ko bhav ho, ra tyesko swami Surya tapaiko dosro bhav, arthat dhan ko bhav ma uchcha bhaera baseko cha. Paisa udharo dine kaam bata nai tapaiko aamdani banchha bhanne yo ekdam saaf sanket ho. Dashamsha ma pani Shani uchcha ra Budh aaphnai rashi ma parcha, jasle lamo samaya samma ek sansthagat career chalcha bhanne dekhaucha. Line thik cha, badalne kura sochnu pardaina.

Tapaiko kundali ma ek ramro yog pani cha. Panchamesh Chandrama nawau bhav ma ra nawamesh Mangal panchau bhav ma, dubai le eak arka ko ghar liera basekaa chhan. Yo dui trikon ka swami ko parivartan ho ra bhagya ko baliyo yog manincha. Tara dubai neech avastha ma chhan, tesaile phal aaucha tara sangharsha ra dhilo sanga aaucha, chhodera bhagne le paudaina.

Ahile ko manasthiti pani bujhchu. 2024 ko Bhadau dekhi Ketu ko mahadasha suru bhaeko cha ra 2031 samma chalcha, ra tapaiko Ketu tyahi dosro, paisa kai bhav ma baseko cha. Ketu le vairagya ra asantusti dincha, tesaile jati kamae pani pugena bhanne lagcha. Yo tapaiko kaam bigreko kaaran hoina, dasha kai swabhav ho. Yehi bela hatar garera jagir chhodne wa line phernay nirnaya nagarnus.

Career ko sabaibhanda ramro window Bhadau 2028 dekhi Asar 2029 samma ho, tyo bela Guru ko antardasha chalcha ra Guru tapaiko dashamesh ho. Tara asli kura tyo pachhi cha. Bhadau 2031 dekhi Shukra ko bis barse mahadasha suru huncha ra tapaiko Shukra lagna mai uchcha cha, tesaile tyo tapaiko jeevan ko sabaibhanda baliyo samaya hunecha.

Ek kura ma dhyan dinus. Tapaiko dhanesh Mangal neech cha ra ekadashesh Shani baarhau bhav ma parcha, tesaile kamai ramro bhaye pani bachat garna gahro huncha ra kharcha le nai khaidincha. Aamdani badhne bela mai bachat ko niyam banaunus, natra hatma kehi rahdaina. Bihana suryodaya ma Surya lai jal chadhaunus, kinabhane Surya nai tapaiko chhaithau bhav ko swami ho ra uchcha bhaera tapailai kamai dincha, ra Ketu ko lagi Ganesh ji ko smaran garnus.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s578');
x.chart=chart;
x.person={name:'Yam Prasad Bohara',dob:'1995-04-18 (BS 2052-01-05, Tuesday, verified)',time:'05:30',place:'Dang, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
x.awaiting=false;
s.pandit.activity='s578 Yam Prasad — microfinance, chhaithesh Surya uchcha dhan bhav ma, 5-9 parivartan, Ketu MD to 2031, Shukra MD 2031';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,L.degreeInSign.toFixed(2),'| Moon',m.signName,m.nakshatra,'| MD',md.planet,'AD',ad.planet,'| msg',nid);
