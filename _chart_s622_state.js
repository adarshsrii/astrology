const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'1995-12-02',time:'15:30',latitude:26.60,longitude:87.90,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('1995-12-02T15:30:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-16');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`Malika ji, tapaiko lagna Mesh ho ra Chandra Meen rashi ma xan. Aile jun garho mahasus bhairakheko xa, tyo chart ma saaf dekhinxa.

Aile tapailai Sade Sati ko bich ko ra sabai bhanda gahiro bhag chalirakheko xa. Shani gochar ma sidhai tapaiko Chandra rashi Meen mathi baseka xan, ra tyahi Meen tapaiko barhau bhav pani ho. Yo 2023 ko January dekhi suru bhaeko ho, bich ko yo bhag 2028 ko suru samma chalxa, tespachi halka hunxa ra 2030 tira pura sakinxa. Man ma bojh, nidra ramro na hune, ra kehi pani agadi nabadheko jasto lagne, tyo yahi bata aaeko ho.

Dasha ko kura garda tapai 2010 dekhi 2030 samma Shukra ko mahadasha ma hunuhunxa, ra tesai bhitra 27 November 2026 samma Shani ko antardasha chalirakheko xa. Tesaile pachhilla teen barsha Shani dubai tarfa bata, dasha ra gochar dubai bata, tapai mathi pareko xa. Yi duita ekai chotima aaunu nai yo samay yati gadhaungo hunuko karan ho.

Tara euta kura ma dhyan dinus. Tapaiko janma ko Shani chai aafnai rashi Kumbha ma, gyarahau bhav ma balio bhaera baseka xan, ra tinai Shani tapaiko dasam ra gyarahau, arthat kaam ra aamdani dubai ka swami hun. Tesaile kaam ra aamdani ko jag bhitri rup ma bigreko haina. Jun garho xa tyo mahasus ma xa, aadhar ma haina, ra yo farak thulo xa.

Badalne bindu 27 November 2026 ho, jaba Shani ko antardasha sakiera Budh ko antardasha suru hunxa ra tyo 2029 samma janxa. Tyati bela dekhi yo gadhaungopan ghatna thalxa.

Tapaiko aathau bhav ma teen graha, Surya, Budh ra Brihaspati baseka xan, tesaile tapaiko jeevan sojho line ma na gaera acchanak morh liera aghi badhne swabhav ko xa. Ani Chandra barhau bhav ma hunda man sadhai kehi na kehi socirahne hunxa, tyo Sade Sati ko matra kura haina, tyo tapaiko janma kai swabhav ho.

Chhoto upaya, sanibar kalo til ra tel daan garnus ra sakeko manche lai sahayog garnus, kinaki aile ko sabai bhanda thulo dabab Shani kai ho.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s622');
x.chart=chart;
x.person={name:'Malika',dob:'1995-12-02 (BS 2052/08/16)',time:'15:30',place:'Maharanijhoda, Jhapa, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
x.awaiting=false;
s.pandit.activity='s622 Malika — Mesh lagna, Chandra Meen; Sade Sati PEAK (Shani Chandra mathi, 12th bhav) Jan2023-2028, ant 2030; Shukra MD, Shani AD tak 27 Nov 2026; janma Shani swagrihi 11th (10+11 swami) = jag thik';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,L.degreeInSign.toFixed(2),'| Moon',m.signName,m.nakshatra,'| MD',md.planet,'AD',ad.planet,'| msg',nid);
