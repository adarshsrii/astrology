const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'1994-12-02',time:'07:35',latitude:28.0700,longitude:83.2500,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('1994-12-02T07:35:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-05');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`Tola ji, tapaiko kundali ma career ko yog ramro cha. Lagna ko swami Mangal dashau bhav ma cha ra dashau bhav ko swami Surya lagna mai cha, yani pahilo ra dashau ghar ko aapasma satta pareko cha. Shastra le bhancha, lagna ko swami dashau ma bhaye manche aafnai mehnat le naam ra kamai banaucha, kasaiko sahara le hoina. Suhaune kaam pani tehi ho, aafai agadi badhera jimmewari linu parne, technical ya field ko kaam, ra Guru lagna ma bhaeko le sikaune ya salah dine kaam pani milcha. Bidesh ko yog pani balio cha, Shukra aafnai moolatrikona ma Rahu sanga barhau bhav ma cha, tesaile bidesh ma kamaune bato tapai ko lagi swadeshi bato bhanda badhi khullcha.

Samaya ko kura garda, abhai 4 August dekhi Budh mahadasha bhitra Guru ko antardasha suru bhayo ra 9 November 2028 samma rahancha. Guru tapaiko dhan ra panchau ghar ko swami ho ra lagna kendra mai basnu bhaeko cha, tesaile yo naya kaam, position ra aay badhne samaya ho. Tara Guru mathi Shani ra Mangal duitai ko drishti pareko cha, tesaile phaida sangharsha ra kehi dhilai sanga aaucha, sajilai hoina. January 2024 dekhi ahile samma ko Rahu antardasha ma jun alamal ra asthirata thiyo, tyo phase chai sakiyo. Bidesh nai janne soch cha bhane September 2027 dekhi January 2028 sabai bhanda balio window ho, ra November 2028 dekhi 2031 samma Shani ko antardasha ma ghar jagga ra sthir jagir ko yog cha.

Chandra chai tapaiko lagna mai neech avastha ma cha, tesaile aafno kshamata mathi aafai shanka garne ra dherai sochne bani cha, ra tyo nai tapaiko sabai bhanda thulo baadha ho, kundali hoina. Sombar Shivji lai jal chadhaunus, teti le neech Chandra lai sahayog garcha.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s482');
x.chart=chart;
x.person={name:'Tola',dob:'1994-12-02',dobBS:'2051-08-16',time:'07:35',place:'Gulmi, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
s.pandit.activity='s482 Tola — career reading di';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,'MD',md.planet,'AD',ad.planet,'msg',nid);
