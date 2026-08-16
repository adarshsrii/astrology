const A=require('./index.js');const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'2003-02-22',time:'03:35',latitude:28.0833,longitude:83.8833,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra;if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('2003-02-22T03:35:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-16');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`सुन्दर जी, पहिले एउटा कुरा, तपाईंको तुला राशि भन्ने ठीक हो, चन्द्रमा तुलामै हुनुहुन्छ, त्यसैले जन्म मिति र समय दुवै मिल्यो। लग्न धनु हो।

पढाइमा रुकावट किन आइरहेको छ भन्ने कुरा कुण्डलीमा एकदम स्पष्ट देखिन्छ, र यो तपाईंको क्षमताको कमी होइन। पढाइको भाव चौथो हो र त्यसका स्वामी बृहस्पति तपाईंको कुण्डलीमा उच्चको हुनुहुन्छ, अर्थात् क्षमता पूरा छ, तर उहाँ आठौं भावमा बसेर वक्री हुनुहुन्छ। आठौं भाव भनेको रोकावट, बीचमा टुट्ने र फेरि सुरु गर्नुपर्ने भाव हो। त्यसमाथि तपाईं सन् २००९ देखि २०२५ सम्म सोही बृहस्पतिकै महादशामा हुनुहुन्थ्यो, अर्थात् तपाईंको पूरै स्कुल र कलेजको समय आठौं भावमा बसेको ग्रहको दशामा बित्यो। लामो समयदेखिको रुकावटको कारण यही हो।

अब राम्रो कुरा। त्यो सोह्र वर्षे महादशा २१ मार्च २०२५ मै सकिइसकेको छ। र अहिले यही समयमा गोचरमा बृहस्पति ठीक तपाईंको जन्मकालीन बृहस्पति भएकै ठाउँ कर्कट राशिमा फर्केर आउनुभएको छ। यसलाई गुरु फिर्ती भनिन्छ र यसले बृहस्पतिको बाह्र वर्षे नयाँ चक्र सुरु गर्छ। बृहस्पति नै तपाईंको लग्नेश र पढाइको स्वामी हुनुभएकाले यो पढाइका लागि नयाँ सुरुवातको बिन्दु हो।

सुधार कहिलेबाट भन्ने कुरामा, डिसेम्बर २०२६ बाट बृहस्पति गोचरमा तपाईंको नवौं भाव, अर्थात् उच्च शिक्षाको भावमा प्रवेश गर्नुहुन्छ र २०२८ सम्म त्यहीं रहनुहुन्छ। देखिने सुधार त्यहीबेलादेखि सुरु हुन्छ। तर शनि अझै तपाईंको चौथो भावमा गोचर गरिरहनुभएको छ र उहाँ २०२७ को मध्यतिर मात्र सर्नुहुन्छ, त्यसैले पूरै खुल्ने चाहिं २०२७ भित्र हो।

सरकारी जागिरका लागि तपाईंको कुण्डली कमजोर छैन। छैटौं भाव प्रतियोगिता र सेवाको भाव हो, र त्यहाँ राहु उच्च अवस्थामा बस्नुभएको छ, सँगै शनि पनि हुनुहुन्छ। छैटौं भावका स्वामी शुक्र लग्नमै हुनुहुन्छ। अनि तपाईं मार्च २०२५ देखि शनिकै महादशामा हुनुहुन्छ जुन २०४४ सम्म चल्छ, र शनि नै त्यही छैटौं भावमा बस्नुभएको छ। परीक्षा दिएर सरकारी सेवामा पुग्ने बाटो तपाईंका लागि खुला छ।

समयको कुरा गर्दा, परीक्षाको सबैभन्दा बलियो झ्याल १७ मे देखि २९ अक्टोबर २०२७ हो, किनकि त्यसबेला उच्चको राहुको प्रत्यन्तर चल्छ र राहु प्रतियोगिताकै भावमा उच्च हुनुहुन्छ। नियुक्ति चाहिं २४ मार्च २०२८ देखि सुरु हुने शनि-बुधको अन्तर्दशामा बस्छ, जुन डिसेम्बर २०३० सम्म जान्छ, किनकि बुध नै तपाईंको दशम अर्थात् कर्मको भावका स्वामी हुनुहुन्छ।

मार्च २०२८ सम्म शनिकै शनि अन्तर्दशा चल्छ र यो पिस्ने खालको समय हो, मेहनतको तुलनामा नतिजा कम देखिन्छ। तर छैटौं भावको शनिले लगातार लागिरहनेलाई नै फल दिन्छन्, त्यसैले तयारी नछोड्नुहोस्।

सानो उपाय, बिहीबार बृहस्पतिका लागि व्रत गर्नुहोस् वा पहेंलो वस्तु दान गर्नुहोस्, किनकि पढाइ र लग्न दुवै उहाँकै हातमा छ।`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s614');
x.chart=chart;
x.person={name:'Sundar Dhakal',dob:'2003-02-22 (BS 2059/11/10)',time:'03:35',place:'Syangja, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;x.awaiting=false;
s.pandit.activity='s614 Sundar — Dhanu lagna, Tula rashi confirm; padhai block = 4L Guru UCHCHA par 8th bhav + vakri, aur Guru MD 2009-2025 poora school/college; MD khatam 21 Mar 2025 + Guru return abhi; sudhar Dec 2026 (Guru 9th) se, poora 2027; sarkari: Rahu uchcha 6th + Shani MD 6th; exam window 17 May-29 Oct 2027; niyukti Shani-Budh 24 Mar 2028-Dec 2030';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK',L.signName,L.degreeInSign.toFixed(2),'| Moon',m.signName,'| MD',md.planet,'AD',ad.planet,'| msg',nid);
