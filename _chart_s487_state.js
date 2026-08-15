const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'2000-07-25',time:'04:45',latitude:28.2333,longitude:83.6833,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('2000-07-25T04:45:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-06');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`Lumanath ji, hunchha, sabai kura bistrit ma herera bhandaichu. Tara pahila ek kura, jasle malai nai khusi banayo.

Tapaiko janma miti 2057 saal Shrawan 10 lai AD ma badalda 25 July 2000 huncha. Tyo miti anusar tapaiko Chandra Mesh rashi ko Bharani nakshatra ma parcha. Ra Bharani nakshatra ko akshar hunchan Li, Lu, Le, Lo. Tapaiko nwaran naam Lumanath, arthat Lu bata suru huncha. Tapaiko nwaran garne pandit le tyahi Bharani nakshatra herera naam rakheko rahecha. Yesle ke prashta huncha bhane tapaile diyeko miti ekdam thik cha, ra mero ganana ra tapaiko janma patrika dubai euta thau ma milyo. Yo dherai ramro kura ho, ahile ma nishchinta bhaera padhna sakchhu.

Tapaiko lagna Mithun ho, ra lagna ko swami Budh aaphno gharma, lagna mai baseko cha. Yo sadharan kura hoina. Yo Bhadra Mahapurusha yoga ho, Pancha Mahapurusha yoga madhye ek. Yesko artha ho tapaiko buddhi, bolne kala ra bujhne shakti nai tapaiko sabai bhanda thulo sampatti ho. Tapai ko unnati kasai ko kripa le hoina, aaphnai dimag ra kura garne shaili le huncha. Padhai, lekhai, bolna parne kaam, byapar, sikaune kaam, prabidhi, yi sabai tapai lai suhaunchan.

Dhan ko kura. Tapaiko dosro bhav, arthat dhan ra parivar ko bhav ma char wota graha basechan, Surya, Mangal, Shukra ra Rahu. Yeti graha euta gharma hunu bhaneko tapaiko jeevan ma paisa ra parivar dubai thulo bishaya banchan bhanne ho. Ra ek sundar kura cha, tapaiko Mangal Karkat ma niche cha tara Chandra Mesh ma cha, arthat Mangal Chandra ko gharma ra Chandra Mangal ko gharma, dubaile gharsasa sateka chan. Yo parivartan yoga ho, ra yesle Mangal ko nichata purai hatai dinchha. Sano dekhieko kamjori aafai sudhriyeko cha.

Ahile tapai Chandra ko mahadasha ma hunuhunchha, jo 3 July 2024 dekhi suru bhaera 4 July 2034 samma cha. Chandra tapaiko dhan bhav ko swami ho ra aaya bhav, arthat ekaharau bhav ma baseko cha. Sojho bhasha ma, yo das barsa nai tapaiko kamai jamaune das barsa ho. Yo samay khali najanos.

Ab bidesh ko kura, ra yo tapaiko chart ko sabai bhanda balio sanket ho. Tapaiko karma bhav ko swami Brihaspati ra bhagya bhav ko swami Shani, duitai barhau bhav ma sangai baseka chan. Barhau bhav bidesh ko bhav ho. Karma ra bhagya duitai ko swami bidesh ma pugnu bhaneko tapaiko kaam ra bhagya dubai desh bahira kholinchha bhanne ho. Yo yoga bina karan aaudaina.

Samaya pani prashta cha. Ahile dekhi 3 June 2027 samma Rahu ko antardasha chalcha, ra Rahu tapaiko dhan bhav ma cha. Yo samay man chanchal huncha, hatar lagchha, paisa ko lagi kehi garihalum jasto lagchha. Yehi bela hatar ma nirnaya nagarnuhos. Tyaspachi 3 June 2027 dekhi 2 October 2028 samma Brihaspati ko antardasha aauchha, ra Brihaspati nai tapaiko karma bhav ko swami hunuhunchha jo bidesh ma baseko cha. Bidesh jane, bidesh ma kaam suru hune sabai bhanda balio dhoka tyahi ho. Madhya 2027 dekhi 2028 ko ant samma.

Biha ko kura. Tapaiko satau bhav ko swami pani tyahi Brihaspati nai ho, ra uni barhau bhav ma chan. Yesko artha ho tapaiko jeevan sathi tapaiko aaphnai thau ko hoina, tada ko, arko jilla wa bidesh sanga sambandhit hunechha. Ra kinabhane tyahi Brihaspati le karma ra biha duitai chalauchan, 2027 dekhi 2028 ko tyo avadhi ma bidesh ra biha, duitai kura sangai aaune sambhavana chha.

Ek do wota imandaar chetavani pani dinchhu, kinaki tapaile bistrit ma bhannu bhayeko cha. Rahu tapaiko dhan bhav ma bhaeko le paisa ra parivar ko bich ma kura milaunu parne bela aauchha, khaas gari jagga, ansha wa sajhedari ma. Kunai pani sajhedari mukh ko kura ma nagarnuhos, lekhera garnuhos. Ra rin liyera hatar ma lagani nagarnuhos, khaas gari 2027 ko June agadi.

Ketu tapaiko aathau bhav ma cha. Yo naramro hoina. Yesle tapailai gahiro kura bujhne, khoji garne ra bhitri gyan tira jhukne swabhav dinchha. Tapaiko manma dharma ra adhyatma tira ek prakar ko tanaav sadhai rahanchha, ra tyo tapaiko lagi shanti ko bato pani ho.

Ek sano imandaar kura. Bihana 4:45 ma tapaiko lagna Mithun ho, ra lagna 4:52 tira Karkat ma jancha. Arthat tapai sima bata 7 minute matra ojhel ma hunuhunchha. Tapaiko janma patrika ma lagna Mithun lekheko cha bhane sabai kura milyo. Yadi kunai din patrika ma Karkat lekheko dekhnu bhayo bhane malai bhannuhos, ma feri hernechhu.

Upaya: Budhbaar ko din hariyo mung daan garnuhos, kinaki Budh nai tapaiko lagna ko swami ra tapaiko sabai bhanda thulo bal hunuhunchha. Ra Brihaspati ko lagi Bihibaar bratha basna sake ramro, kinaki tyahi graha le tapaiko bidesh ra biha duitai kholnechha.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s487');
x.chart=chart;
x.person={name:'Lumanath Subedi',dob:'2000-07-25 (BS 2057-04-10)',time:'04:45 AM',place:'Chuwa, Kushma, Parbat, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false; x.awaiting=false;
s.pandit.activity='s487 Lumanath — puro jeevan reading (Bhadra yoga, bidesh 2027-28)';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,L.degreeInSign.toFixed(2),'Moon',m.signName,m.nakshatra,'pada'+(m.nakshatraPada||m.pada),'MD',md.planet,'AD',ad.planet,'msg',nid);
