const A=require('./index.js'),fs=require('fs');
const SP='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'1995-09-03',time:'15:30',latitude:26.5448,longitude:88.0895,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SIGN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[];
for(let n=1;n<=12;n++){const sn=((L.signNumber-1+n-1)%12)+1;
  houses.push({num:n,signNum:sn,signName:SIGN[sn-1],
    planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])});}
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,
  nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity||''}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('1995-09-03T15:30:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-17');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
  dasha:{current:{maha:md.planet,antar:ad.planet},
    timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const TEXT=`नमस्ते। छोरीको चार्ट हेरें। दिनको ३:३० ले लग्न धनु आउँछ र चन्द्रमा पनि धनुमै मूल नक्षत्रमा पर्छ, तपाईंले भन्नुभएको धनु राशि मिल्यो, त्यसैले समय ठीक छ।

ढिलो हुनुको कारण प्रस्ट छ। जन्मदेखि २०२२ सम्म शुक्रको महादशा चल्यो, तर उहाँको शुक्र सूर्यको एकदमै नजिक परेर दग्ध छ, अनि शनिको दृष्टि शुक्र र गुरु दुवैमाथि परेको छ। विवाहका दुवै कारक ग्रह यसरी कमजोर हुँदा बीसको दशकभरि कुरा चल्दाचल्दै रोकिइरह्यो। यो छोरीको कुनै दोष होइन, ग्रहको समय नमिलेको हो।

राम्रो पक्ष के छ भने विवाह भावको स्वामी बुध उच्चको छ। शास्त्रले उच्च सप्तमेश भएमा विवाहबाट पूर्ण सुख पाइन्छ भन्छ, त्यसैले ढिलो भए पनि सम्बन्ध राम्रै हुन्छ।

समयको कुरा गर्दा अहिले सूर्य महादशामा बुधको अन्तर्दशा चलिरहेको छ, मार्च २०२७ सम्म। यसै बेला कुरा अघि बढ्न सक्छ। तर सबैभन्दा बलियो समय भने २०२७ को अन्त्यदेखि २०२८ को मध्यसम्म हो, त्यतिबेला शुक्रको अन्तर्दशा चल्छ र गुरुले गोचरमा जन्मकुण्डलीको शुक्रलाई हेर्छ। विवाह त्यही बीचमा हुने सम्भावना सबैभन्दा बढी देख्छु।

केटा कहाँको भन्ने कुरामा, गुरु बाह्रौं भावमा र शुक्र नवौं भावमा छन्, यी दुवै टाढाका भाव हुन्। त्यसैले केटा आफ्नै ठाउँको हुँदैन। नेपालभित्रकै भए पनि घरदेखि टाढाको, नत्र विदेशमा काम गर्ने केटासँग सम्बन्ध जुर्ने बलियो सम्भावना छ, र चिनजान काम वा जागिरको सिलसिलाबाट हुने देखिन्छ।

मंगल दोष छैन, त्यो चिन्ता लिनुपर्दैन। सानो उपाय, छोरीले बिहीबार बेसार वा पहेंलो वस्तु दान गरून् र ॐ गुरवे नमः जप गरून्।

एउटा कुरा मात्र, ३:३० र ३:३५ को बीचमा लग्न धनुबाट मकरमा सर्छ। जन्मपत्रीमा लग्न लेखिएको छ भने भनिदिनुहोस्, मकर रहेछ भने केटा कहाँको भन्ने जवाफ अलि फरक पर्छ।`;

const st=JSON.parse(fs.readFileSync(SP,'utf8'));
const s=st.sessions.find(x=>x.id==='s605');
if(!s)throw new Error('s605 not found');
s.chart=chart;
s.person={name:'Ekkumari Paudel (chhori)',dob:'3 Sep 1995 (BS 2052)',time:'15:30 (diuso 3:30)',place:'Bhadrapur, Jhapa, Nepal'};
const maxId=Math.max(0,...s.messages.map(x=>+x.id||0));
s.messages.push({id:maxId+1,role:'pandit',text:TEXT});
s.pending=false; s.awaiting=false;
st.pandit=st.pandit||{}; st.pandit.activity='s605 chhoriko bihe reading pathaiyo';
fs.writeFileSync(SP,JSON.stringify(st));
console.log('WROTE s605. lagna',chart.lagnaSign,'| moon',m.signName,m.nakshatra,'| MD',md.planet,'AD',ad.planet);
console.log('msg id',maxId+1,'| chars',TEXT.length);
