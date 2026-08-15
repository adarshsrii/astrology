const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'1993-05-27',time:'05:15',latitude:27.55,longitude:83.45,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('1993-05-27T05:15:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-11');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`Dilli Ram ji, bihe huncha, ra jeevansathi pani raamri paunuhuncha. Tara kina abasamma bhaeko chaina, tyo tapaiko chart ma ekdam spashta cha.

Saatau ghar ma Rahu basecha, saatau ghar ko swami Mangal nichha rashi ma pareko cha, ra tehi saatau ghar mathi Shani ko drishti pani cha. Yi tin ota kura ekaipatak pareko le bihe barsau dhilo bhaeko ho. Tara arko dherai balio kura cha, Shukra, jo tapaiko lagna ko swami ra bihe ko karak dubai ho, uni Meen rashi ma sabai bhanda ucha awastha ma egharau ghar ma basnu bhaeko cha. Yehi Shukra le bihe pakka garaucha ra ramro jeevansathi dincha.

Samay ko kura, tapai ahile Shukra ko mahadasha bhitra Brihaspati ko antardasha ma hunuhuncha, 2027 ko October 21 samma, ra yehi nai tapaiko sabai bhanda ramro samay ho. Gochar ma pani Brihaspati Karkat ma ucha bhaera sidhai tapaiko saatau ghar mai heriraheko cha, 2026 ko November ko suru samma, ani feri 2027 ko March dekhi June samma. Yi duita window ma kura chalaunuhos ra magni ko prayas agadi badhaunuhos. 2027 ko madhya tira Shani tapaiko Shukra mathi aaipugcha ra kura feri susta huncha. Tyaso bhaye pani 2028 ra 2029 ma Shani ko antardasha ma bihe hune sambhawana cha, tara ahile ko samay khera falnu hunna.

Jeevansathi kasti aaunchin bhanne kura, Shukra ucha bhaeko le uni dekhna ma raamri, sudhaal, dayalu ra dharmik swabhav ki hunchin ra unko aagaman le tapailai laabh nai garcha. Tara saatau ghar Vrischik ho ra tyaha Rahu basecha, tesaile uni bahira bata sojhi ra shanta dekhine, bhitri man ma chai dridh, gopya ra aafno kura sajilai nabhanne swabhav ki hunchin. Aafno gaun thau bhanda pharak thau, pharak parivesh ya alik tadha bata sambandha jurne sambhawana badhi cha, ra kura achanak milcha.

Ek kura dhyan dinuhos, saatau ghar ma Rahu bhayeko le keti ra unko parivar ko baare ma raamro sanga bujhera matra pakka garnuhos, sunda ramro lagyo bhandaimaa hataar nagarnuhos. Upaya sano cha, mangalbar Hanuman ji ko darshan garnuhos ra Shiva ji ma jal chadhaunuhos.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s549');
x.chart=chart;
x.person={name:'Dilli Ram Parajuli',dob:'1993-05-27',time:'05:15',place:'Rupandehi, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
s.pandit.activity='s549 Dilli Ram — bihe ko samay, Shukra MD / Guru AD ra Guru ko saatau ghar ma drishti';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,L.degreeInSign.toFixed(2),'| Moon',m.signName,m.nakshatra,'| MD',md.planet,'AD',ad.planet,'| msg',nid);
