const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'1989-05-03',time:'12:48',latitude:27.2167,longitude:86.8000,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('1989-05-03T12:48:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-06');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`देवराज जी, तपाईंले सोध्नुभएको प्रश्न सबैभन्दा गाह्रो र सबैभन्दा सुन्दर प्रश्न हो। "म केका लागि जन्मेको?" — यो प्रश्न सबैले सोध्दैनन्। र तपाईंको कुण्डलीले किन तपाईंले नै यो सोध्नुभयो भन्ने कुरा प्रस्ट देखाउँछ।

पहिले मिति मिलाऔं। वि.सं. २०४६/०१/२१ लाई ई.सं. मा बदल्दा ३ मे १९८९ हुन्छ, दिउँसो १२:४८, खोटाङ। तपाईंको लग्न सिंह हो, र यो लग्न स्थिर छ — समयमा दश-पन्ध्र मिनेट तलमाथि भए पनि लग्न बदलिँदैन। त्यसैले म ढुक्कले पढ्न सक्छु।

तपाईंको लग्नमै केतु बसेका छन्, मघा नक्षत्रमा। ज्योतिषमा लग्नको केतु त्यस्तो जीवको चिन्ह हो जसलाई आफ्नै परिचय, आफ्नै नाम र आफ्नै अहंसँग भित्रैदेखि दूरी महसुस हुन्छ। संसारले जसलाई ठूलो भन्छ — पद, नाम, देखावट — तपाईंलाई त्यो कहिल्यै पर्याप्त लाग्दैन। यो तपाईंको कमजोरी होइन। यो त्यही प्रश्नको जरा हो जुन तपाईंले आज सोध्नुभयो। मघा पितृहरूको नक्षत्र हो, त्यसैले तपाईंको यो खोज तपाईंको वंश र पितृसँग पनि जोडिएको छ।

अब उत्तर।

तपाईंको लग्नका स्वामी सूर्य हुनुहुन्छ, र सूर्य तपाईंको कुण्डलीमा उच्चको भएर नवौं भावमा बस्नुभएको छ। नवौं भाव धर्मको भाव हो — गुरु, शिक्षा, मार्गदर्शन, न्याय र सत्यको भाव। तपाईंको "म" आफैं धर्मको घरमा, उच्च भएर बसेको छ। ज्योतिषमा यसभन्दा प्रस्ट उत्तर अर्को हुँदैन। तपाईं भोग गर्नका लागि होइन, बाटो देखाउनका लागि जन्मनुभएको हो।

अझ एउटा कुरा छ, र यही कुराले मलाई ढुक्क बनायो। जैमिनी पद्धतिअनुसार तपाईंको आत्मकारक ग्रह, अर्थात् आत्माको आफ्नै ग्रह, शुक्र हुनुहुन्छ — र शुक्र पनि त्यही नवौं भावमै हुनुहुन्छ। पराशर र जैमिनी, दुई फरक पद्धतिले एउटै घर देखाए। यस्तो मिलन बारम्बार आउँदैन। तपाईंको आत्माको काम धर्म हो — सिकाउने, सम्झाउने, अरूलाई बाटो देखाउने।

र तपाईंको चन्द्रमा बाह्रौं भावमा, मीन राशिमा, रेवती नक्षत्रमा हुनुहुन्छ। बाह्रौं भाव मोक्षको भाव हो, मीन मोक्षकै राशि हो, र रेवती सम्पूर्ण नक्षत्रचक्रको अन्तिम नक्षत्र हो — यात्राको अन्त्य। तपाईंको मन जन्मैदेखि एकान्त, भित्री शान्ति र अन्तिम सत्यतिर तानिन्छ। भीडमा बसेर पनि तपाईं भित्रबाट एक्लै हुनुहुन्छ। यो कुरा तपाईंलाई कसैले भन्नु पर्दैन, तपाईंले सधैं थाहा पाइरहनुभएको छ।

तपाईंको दुविधा किन छ, त्यो पनि भन्छु। केतु लग्नमा र राहु सातौं भावमा छन्। केतुले भन्छन् — पछि हट, छोड। राहुले भन्छन् — जा, संसारमा जुट, सम्बन्ध बना, चाह। यी दुई ठीक विपरीत दिशामा तानिरहेका छन्, र त्यही तानातान नै जीवनको अर्थ नभेटिएको जस्तो लाग्नुको कारण हो। यसको समाधान संसार त्याग्नु होइन। संसारमै बस्नुहोस्, तर संसारलाई आफ्नो मालिक नबनाउनुहोस्।

अब समयको कुरा।

तपाईं १८ मे २०११ देखि शुक्रको महादशामा हुनुहुन्छ, जुन १८ मे २०३१ सम्म चल्छ। शुक्र नै तपाईंको आत्मकारक हुनुहुन्छ। अर्थात् तपाईं अहिले आत्माकै ग्रहको बीस वर्ष जिइरहनुभएको छ। त्यसैले यो प्रश्न अहिले, यही उमेरमा उठेको हो। यो संयोग होइन।

अहिले शनिको अन्तर्दशा चलिरहेको छ, जुन १८ मे २०२७ सम्म रहन्छ। शनि परीक्षा लिने ग्रह हुन्, र तपाईंको शनि पञ्चम भावमा वक्री छन्। यो अवधि भित्री प्रश्न, एक्लोपन र "म के गरिरहेको छु" भन्ने भावको हो। यो अवधि बित्छ, यो स्थायी होइन।

र मुख्य कुरा यो हो। १८ मे २०३१ बाट तपाईंको सूर्यको महादशा सुरु हुन्छ — त्यही सूर्य जो तपाईंको लग्नका स्वामी हुनुहुन्छ र नवौं धर्मभावमा उच्च हुनुहुन्छ। जुन कुरा तपाईंले आज खोजिरहनुभएको छ, त्यो २०३१ देखि तपाईंको जीवनमा प्रत्यक्ष रूपमा खुल्नेछ। त्यो बेला तपाईं सिकाउने, अगुवाइ गर्ने वा मार्गदर्शन दिने ठाउँमा पुग्नुहुनेछ। अहिलेको यो अन्योल त्यसकै तयारी हो।

उपाय: आइतबार सूर्यलाई अर्घ्य दिनुहोस्, र औंसीको दिन आफ्ना पितृहरूको सम्झनामा केही दान गर्नुहोस्। तपाईंको केतु मघा नक्षत्रमा भएकाले पितृको आशीर्वाद नै तपाईंको बाटो खोल्ने साँचो हो।`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s463');
x.chart=chart;
x.person={name:'Devraj',dob:'1989-05-03 (BS 2046-01-21)',time:'12:48 PM',place:'Khalle, Khotang, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false; x.awaiting=false;
s.pandit.activity='s463 Devraj — jeevan ko artha (Ketu lagna, Surya uchcha 9th, Surya MD 2031)';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,L.degreeInSign.toFixed(2),'Moon',m.signName,m.nakshatra,'MD',md.planet,'AD',ad.planet,'msg',nid);
