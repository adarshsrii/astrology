const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'1993-02-17',time:'04:00',latitude:27.2167,longitude:86.8000,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('1993-02-17T04:00:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-16');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`भूपन जी, तीनवटा विकल्पमध्ये तपाईंको चार्टले व्यवसायलाई नै साथ दिन्छ। तपाईंको लग्न धनु हो, दशम भावका स्वामी बुध र नवम भावका स्वामी सूर्य दुवै तेस्रो भावमा हुनुहुन्छ, र तेस्रो भाव आफ्नै पहल र आफ्नै मेहनतको भाव हो, त्यसैले कसैको मातहतमा बस्नुभन्दा आफ्नै काम गर्दा राम्रो हुन्छ। शनि आफ्नै राशि मकरमा दोस्रो भावमा बस्नुभएको छ, जुन धनको भाव हो, र त्यो तपाईंको चार्टको सबैभन्दा बलियो कुरा हो। जागिर चल्छ तर त्यसमा सन्तुष्टि आउँदैन। एउटा कुरा ख्याल गर्नुहोस्, मंगल सप्तम भावमा हुनुहुन्छ र सप्तम भाव साझेदारीको पनि भाव हो, त्यसैले व्यवसाय एक्लै वा एकदमै स्पष्ट सर्तमा गर्नुहोस्, पार्टनरशिपमा विवाद आउने सम्भावना धेरै छ।

वैदेशिक यात्रा भने तीनमध्ये सबैभन्दा कमजोर छ। तपाईंको बाह्रौं भाव विदेशको भाव हो र त्यहाँ राहु नीच अवस्थामा बस्नुभएको छ, जसले विदेशमा फाइदाभन्दा खर्च र संघर्ष बढी दिन्छ। तपाईंका बलिया ग्रह, मकरको शनि र मीनको उच्च शुक्र, दुवै घर, जग्गा र परिवारसँगै जोडिएका छन्। विदेशको प्रसंग आउने भए २०२८ को अन्त्यपछि मंगलको महादशामा आउँछ किनकि मंगल नै बाह्रौं भावका स्वामी हुन्, तर त्यो पनि सजिलो बाटो होइन।

विवाहमा मंगल सप्तम भावमा हुनुभएकाले तपाईंलाई पूर्ण मांगलिक दोष छ, र यसले विवाहमा ढिलाइ र विवाहपछि मतभेद ल्याउँछ। तर शुक्र मीनमा उच्चको हुनुहुन्छ र शुक्र नै विवाहका कारक हुन्, त्यसैले विवाह भएपछिको गृहस्थी राम्रै रहन्छ। मिलान राम्ररी गराएर मात्र अघि बढ्नुहोस्, र मंगल दोष भएकै पक्षसँग मिल्यो भने दोष निष्क्रिय हुन्छ। समयको कुरा गर्दा २०२६ को अक्टोबर २२ देखि २०२८ को जुनसम्म चन्द्र-शुक्रको अन्तर्दशा चल्छ, र त्यही तपाईंको विवाहको समय हो।

परिवारको सहयोग छ तर एकतर्फी छैन। चौथो भावमा शुक्र उच्चको हुनुहुन्छ, त्यसैले आमा र घरको तर्फबाट साथ पक्कै पाउनुहुन्छ। दोस्रो भावमा आफ्नै राशिको शनिले परिवारलाई स्थिर त बनाउँछ तर जिम्मेवारी तपाईंकै काँधमा हाल्छ, सहयोग लिनेभन्दा दिने भूमिका तपाईंको हुन्छ। नवम भाव खाली छ र सूर्य तेस्रो भावमा हुनुहुन्छ, त्यसैले बुबाको तर्फबाट ठूलो टेको खोज्नुभयो भने कम पर्न सक्छ। आफ्नै बलमा उठ्ने चार्ट हो यो।

एउटा राम्रो कुरा, तपाईंको साढेसाती २०१५ मा सुरु भएर जनवरी २०२३ मै सकिसकेको छ, त्यसैले गह्रौं वर्षहरू अब पछाडि छन्। सानो उपाय, मंगलबार हनुमानजीको दर्शन गर्नुहोस्, किनकि सप्तमको मंगल नै तपाईंको विवाह र साझेदारी दुवैमा असर पार्ने ग्रह हुन्।`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s640');
x.chart=chart;
x.person={name:'Bhupan Chandra Rai',dob:'1993-02-17 (BS 2049-11-06)',time:'04:00',place:'Khotang, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
x.awaiting=false;
s.pandit.activity='s640 Bhupan — Dhanu lagna; vyavasaya best (10L+9L in 3rd, Shani swagrihi 2nd); videsh weakest (Rahu neech 12th); Mangal 7th = full Manglik, Shukra uchcha 4th; vivah Chandra-Shukra 22 Oct 2026-Jun 2028; Sade Sati ended Jan 2023';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,L.degreeInSign.toFixed(2),'| Moon',m.signName,m.nakshatra,'| MD',md.planet,'AD',ad.planet,'| msg',nid);
