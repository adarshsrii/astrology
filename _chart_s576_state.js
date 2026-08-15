const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
// BS 2049 Chaitra 28 Sat 12:55 = 1993-04-10 (weekday verified Saturday), Annapurna Gaupalika w1, Kaski
const B={date:'1993-04-10',time:'12:55',latitude:28.3757,longitude:83.8117,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('1993-04-10T12:55:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-17');            // the result day, not today
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`तपाईंको लग्न कर्कट हो र अहिले शुक्रको महादशामा मंगलको अन्तर्दशा चलिरहेको छ। तपाईंको शुक्र नवौं भावमा उच्चको भएर बसेको छ, र मंगल पाँचौं र दशौं दुवैको स्वामी भएकाले तपाईंको लागि योगकारक ग्रह हो। भदौ १ र २ गते ठीक त्यही मंगलकै प्रत्यन्तर चलिरहेको हुन्छ, र आकाशमा बृहस्पति उच्च भएर तपाईंकै लग्नमाथि आइपुगेको छ, जुन तपाईंको षष्ठेश अर्थात् जागिरको भावको स्वामी हो। शास्त्रले कर्मेशको दशामा सरकारी तर्फबाट मान्यता र नियुक्ति मिल्छ भन्छ, त्यसैले नतिजा तपाईंको पक्षमा आउने सम्भावना राम्रै देखिन्छ।

तर एउटा कुरा साँचो भन्दिहाल्छु। तपाईंको मंगल बाह्रौं भावमा छ, नतिजा आउने दिन आकाशमा पनि मंगल त्यहीँ बाह्रौंमै पर्छ, अनि राहु तपाईंको जन्मकालीन शनिमाथि बसेको छ। त्यसैले नतिजा राम्रो आए पनि एकैचोटि पूरै टुंगिने सम्भावना कम छ, कि एउटा चरण पास भएर अर्को बाँकी रहन्छ, कि नाम आए पनि केही ढिलाइ वा अल्झन रहन्छ। सबै एकैपटकमै सकिन्छ भन्ने अपेक्षा नराख्नुहोला।

भदौ ५ गतेदेखि कार्तिक ७ सम्म राहुको प्रत्यन्तर चल्छ, त्यो बेला नतिजाबारे हल्ला, अन्योल र मनको बेचैनी बढ्छ, त्यसमा हतारमा कुनै उजुरी वा ठूलो निर्णय नगर्नुहोला। कार्तिक ७ देखि पुष ४ सम्म बृहस्पतिको प्रत्यन्तर चल्छ, र नियुक्ति तथा काम वास्तवमै टुंगिने सबैभन्दा बलियो समय त्यही हो। समग्रमा भदौ महिना तपाईंको लागि नराम्रो छैन, बृहस्पति महिनाभरि तपाईंकै लग्नमा रहन्छ, खाली मन अलि चञ्चल र निद्रा कम हुन सक्छ। मंगलबार हनुमानजीको दर्शन गरेर रातो मसुरो दान गर्नुहोस्, अहिले मंगललाई नै बल चाहिएको छ।`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s576');
x.chart=chart;
x.person={name:'नन्दलाल सुवेदी',dob:'1993-04-10 (BS 2049 Chaitra 28)',time:'12:55',place:'Annapurna Gaupalika w1, Kaski, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
x.awaiting=false;
s.pandit.activity='s576 नन्दलाल — भदौ १-२ लोक सेवा नतिजा, शुक्र MD / मंगल AD+PD, गुरु उच्च लग्नमा';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,L.degreeInSign.toFixed(2),'| Moon',m.signName,m.nakshatra,'| MD',md.planet,'AD',ad.planet,'| msg',nid,'| sessions',s.sessions.length);
