const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'1995-07-23',time:'09:00',latitude:27.6931,longitude:85.3178,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('1995-07-23T09:00:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-11');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`बालकुमारी जी, विदेश जाने योग तपाईंको कुण्डलीमा राम्रोसँग छ, यो हुन्छ भन्नेमा शंका छैन।

तपाईंको लग्नका स्वामी सूर्य बाह्रौँ भावमा बसेका छन्, र बाह्रौँ भावका स्वामी चन्द्रमा दशौँ भावमा उच्चको भएर बसेका छन्। यी दुई कुराले नै जन्मथलो छाडेर टाढा गएर काम गर्ने योग बनाउँछ। कमाइ पनि त्यहीँबाट हुन्छ, किनभने एघारौँ भावका स्वामी बुध पनि बाह्रौँ भावमै छन्।

समयको कुरा गर्दा, गत सेप्टेम्बर २०२५ देखि तपाईंको बृहस्पतिको महादशा सुरु भएको छ र यिनै बृहस्पतिको दृष्टि तपाईंको बाह्रौँ भावमा पर्छ, त्यसैले विदेशको कुरा अब चल्न थाल्छ। कागजपत्र र आवेदनको काम अक्टोबर २०२६ देखि फेब्रुअरी २०२७ भित्र अगाडि बढ्छ। वास्तवमा जाने समय चाहिँ फेब्रुअरी २०२७ देखि मे २०२७ भित्र देखिन्छ, किनभने त्यस बेला लग्नेश सूर्य र बाह्रौँ भावका स्वामी चन्द्रमाको प्रत्यन्तर दशा चल्छ, र गोचरमा बृहस्पति पनि फेरि तपाईंको बाह्रौँ भावमै फर्केर आउँछन्। यही नै सबैभन्दा बलियो समय हो, यसै बेला प्रयास नछोड्नुहोस्।

विवाहको बारेमा पनि तपाईंले सोध्नुभएको थियो। सातौँ भाव खाली छ र त्यसका स्वामी शनि आठौँ भावमा वक्री भएर बसेका छन्, त्यसैले अहिलेसम्म ढिलाइ भएको हो। तर स्त्रीको कुण्डलीमा पतिका कारक बृहस्पति नै हुन् र अहिले तिनकै महादशा चलिरहेको छ, त्यसैले विवाह यसै दशामा हुन्छ। नोभेम्बर २०२७ देखि बृहस्पतिको महादशाभित्र शनिको अन्तर्दशा सुरु हुन्छ, र शनि नै तपाईंका सातौँ भावका स्वामी हुन्, त्यसैले विवाह सन् २०२८ तिर हुने बलियो सम्भावना छ। कुराकानी भने २०२७ को उत्तरार्धदेखि नै चल्न थाल्छ।

एउटा कुरामा ध्यान दिनुहोस्, सातौँ भावका स्वामी आठौँ भावमा भएकाले विवाह पक्का गर्नुअघि केटाको कुण्डली राम्ररी मिलाएर मात्र अघि बढ्नुहोस्। सानो उपाय, बिहीबार पहेँलो वस्तु दान गर्नुहोस्।`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s537');
x.chart=chart;
x.person={name:'Balkumari',dob:'1995-07-23',bs:'2052-04-07',time:'09:00',place:'Thapathali, Kathmandu, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
s.pandit.activity='s537 Balkumari — videsh yog (lagnesh 12th, 12th lord uchcha 10th), Feb-May 2027; vivah Guru-Shani 2028';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,L.degreeInSign.toFixed(2),'| Moon',m.signName,m.nakshatra,'| MD',md.planet,'AD',ad.planet,'| msg',nid);
