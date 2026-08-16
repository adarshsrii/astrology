const A=require('./index.js');const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'2008-07-28',time:'23:00',latitude:26.62,longitude:88.05,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra;if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('2008-07-28T23:00:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-16');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`Bishal ji, tapaile samay "11 baje tira" bhannu bhaeko le pahila euta kura. 11 baje ko aas paas janma bhaeko ho bhane lagna Mesh hunxa, tara belka 10:40 aghi bhaeko rahecha bhane lagna Meen ma badalinxa ra ghar haru sarxa. Ghar mai janma bhaeko hunale ghar ma kasaile samay lekheko wa samjheko xa ki sodhnus, thaha bhaye pachhi ma thik sanga milaidinxu. Aile ma Mesh lagna kai aadhaar ma bhanxu.

Padhai tapaiko chart ko sabai bhanda balio pakshya ho. Chautho bhav padhai ko bhav ho ra tesko swami Chandra Vrish ma uchcha bhaera dosro bhav ma xan, panchau bhav ka swami Surya chautho bhav mai xan, ani chautho bhav ma nai Surya, Budh ra Shukra teenai basnu bhaeko xa. Yesto chart bhaeko manche padhera nai aghi badhxa, chhitai kaam ma pasera haina.

Hisab ko course tapailai suhaunxa. Budh nai hisab, byapar ra ganana ka karak hun ra tinai tapaiko padhai kai bhav ma basnu bhaeko xa, ani dosro bhav, jun dhan ko bhav ho, tyahan Chandra uchcha bhaera basnu bhaeko xa. Tesaile commerce, management wa finance ko line tapaiko chart sanga milxa.

Bidesh ki Nepal bhanne ma chart le bidesh nai bhanxa. Brihaspati aafnai rashi Dhanu ma nawau bhav ma basnu bhaeko xa, ra tinai Brihaspati tapaiko nawau bhav, arthat uchcha shiksha ra lamo yatra, ani barhau bhav, arthat bidesh bas, dubai ka swami hun. Euta grah le bidesh sambandhi duitai bhav samatera aafnai gharma balio bhaera basnu tapaiko kundali ko sabai bhanda ramro kura ho.

Tara Brihaspati vakri hunuhunxa, tesaile bidesh ko kura sojho line ma jaadaina, bich ma ek choti ruknu ra feri suru garnu parne hunxa. Tesaile samay yasari milaunus. Aile dekhi 15 July 2027 samma Rahu-Budh ko antardasha xa ra Budh padhai kai bhav ma hunale yo padhai, taiyari ra application ko samay ho. Tespachi August 2028 samma Ketu ko antardasha xa, ra tyo tal-mathi hune samay ho, tehi bela matra bharosa garera niskine yojana nabanaunus. Asli ra sthir samay 2 August 2028 dekhi suru hunxa jaba Shukra ko antardasha aaunxa ra tyo 2031 samma janxa. Tesaile Nepal mai bachelor sakera 2028 ra 2029 tira bidesh ma masters wa uchcha adhyayan ma jane yojana nai tapaiko chart sanga sabai bhanda milne bato ho.

Euta kura ma dhyan dinus. Chautho bhav ma Shukra sangai Ketu ekdam najik, aadha degree bhitra basnu bhaeko xa, ra tesle bich ma bichar badalne wa course chhodera arko samatne swabhav dinxa. Ek choti rojepachi tehi line ma tikirahanus, badalirahanu bhayo bhane samay khera janxa.

Chhoto upaya, bihibar Brihaspati ka lagi vrat wa kesari rang ko daan garnus, kinaki tapaiko sabai bhanda balio grah unai hun ra bidesh ra uchcha shiksha dubai unaikai hatma xa.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s616');
x.chart=chart;
x.person={name:'Bishal Ban',dob:'2008-07-28 (BS 2065 Shrawan 13)',time:'~23:00 (approx)',place:'Haldibari-3 Aapgachi, Jhapa, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;x.awaiting=false;
s.pandit.activity='s616 Bishal — Mesh lagna (time approx, 10:40pm se pehle Meen); padhai strong (4L Chandra uchcha 2nd, 4th me 4 graha); Guru swagrihi 9th + 9/12 swami = BIDESH, par vakri; Rahu-Budh tak 15 Jul 2027 taiyari, Ketu AD 2027-28 tal-mathi, Shukra AD 2 Aug 2028-2031 = asli window; commerce/finance fits';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK',L.signName,L.degreeInSign.toFixed(2),'| MD',md.planet,'AD',ad.planet,'| msg',nid);
