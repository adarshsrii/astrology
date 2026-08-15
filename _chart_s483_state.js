const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'1993-12-24',time:'22:01',latitude:28.3833,longitude:82.1667,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
const d=A.calculateVimshottariDasha(new Date('1993-12-24T22:01:00+05:45'),m.nakshatra,(m.longitude%13.3333333),3);
const T=new Date('2026-08-05');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`लेखराज जी, तपाईंको राशि मेष नै हो, लग्न सिंह र चन्द्रमा मेषमा भरणी नक्षत्रमा छन्।

सरकारी जागिरको कुरामा तपाईंको दशौं भाव कमजोर छ। त्यहाँ केतु नीच अवस्थामा बसेका छन् र दशौंको स्वामी शुक्र सूर्यसँग अस्त भएर पाँचौंमा छन्, त्यसैले सरकारी जागिरको बलियो योग तपाईंको कुण्डलीमा देखिँदैन। तर शनि तपाईंको छैटौंको स्वामी भएर सातौंमा मूलत्रिकोणमा बलियो बसेका छन्, र छैटौं भाव नै प्रतिस्पर्धा र सेवाको भाव हो, त्यसैले नोकरी नै तपाईंको बाटो हो, व्यापार होइन। पाँचौंमा चार ग्रह भएकाले परीक्षा दिने क्षमता पनि राम्रो छ। भन्नुपर्दा परीक्षामार्फत सम्भावना छ तर एकै पटकमा हुँदैन, धेरै पटक प्रयास गर्नुपर्ने देखिन्छ।

हालको जागिरमा किन केही चलिरहेको छैन भन्ने पनि स्पष्ट छ। सन् २०२० देखि मङ्गलको महादशा चलिरहेको छ र तपाईंको मङ्गल सूर्यसँग अस्त छन्, त्यसैले यी सात वर्ष अड्किएजस्तै भए। ४ मे २०२७ मा राहुको महादशा सुरु हुन्छ र वास्तविक परिवर्तन त्यहींबाट आउँछ। राहु तपाईंको चौथो भावमा नीच भएकाले उन्नति सरुवा वा घरबाट टाढाको पोस्टिङको रूपमा आउने सम्भावना बढी छ, एउटै ठाउँमा बसेर बढुवा हुने भन्दा।

विवाहमा ढिलाइ भइरहेको कारण कुण्डलीमै छ। शनि आफै सातौं भावमा बसेका छन् र शुक्र अस्त छन्, यी दुवैले विवाह पछाडि सार्छन्। आउँदो वर्षभित्र कुरा चल्न सक्छ तर विवाह भने सन् २०२९ को अन्त्यदेखि २०३१ भित्र हुने सम्भावना सबैभन्दा बलियो छ। त्यो बेला गुरु तपाईंको चन्द्रमाबाट सातौं तुला राशिमा गोचर गर्दै हुन्छन् र राहु-गुरुको अन्तर्दशा पनि जनवरी २०३० देखि सुरु हुन्छ। शनि सातौंमा हुँदा विवाह ढिलो हुन्छ तर टिकाउ हुन्छ, त्यो चाहिँ राम्रो पक्ष हो।

स्वास्थ्यमा ठूलो रोगको संकेत छैन तर हल्का नलिनुहोस्। सिंह लग्न र मूल नक्षत्रमा चार ग्रह भएकाले रक्तचाप, पेटको एसिडिटी र मुटुको क्षेत्रमा ध्यान दिनुपर्छ, र चौथोमा राहु नीच भएकाले तनाव र निद्राको समस्या पनि देखिन्छ। वर्षमा एक पटक रक्तचाप जँचाउनुहोस्।

सानो उपाय, आइतबार सूर्यलाई जल चढाउनुहोस्, सूर्य नै तपाईंको लग्नेश हुन् र तिनकै वरिपरि तीनवटा ग्रह अस्त भएका छन्।`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s483');
x.chart=chart;
x.person={name:'लेखराज डागी',dob:'1993-12-24',dobBS:'2050-09-09',time:'22:01',place:'Salyan, Karnali, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
s.pandit.activity='s483 लेखराज डागी — sarkari jagir, unnati, vivah, swasthya';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,'Moon',m.signName,'MD',md.planet,'AD',ad.planet,'msg',nid);
