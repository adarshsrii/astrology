const A=require('./index.js');const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'2001-02-09',time:'01:13',latitude:28.2096,longitude:83.9856,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra;if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('2001-02-09T01:13:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-16');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`सञ्जय जी, पहिले एउटा कुरा, तपाईंको राशि सिंह भन्नुभएको ठीक हो, चन्द्रमा सिंह राशिको मघा नक्षत्रमै हुनुहुन्छ, त्यसैले मिति र समय दुवै मिल्यो। लग्न वृश्चिक हो।

छात्रवृत्तिको कुरा गर्दा तपाईंको कुण्डलीले यसलाई राम्रोसँग साथ दिन्छ। बाह्रौं भाव विदेशको भाव हो र त्यसका स्वामी शुक्र मीन राशिमा उच्चको भएर पाँचौं भाव, अर्थात् विद्या र बुद्धिको भावमा बस्नुभएको छ। विदेशका स्वामी उच्च भएर पढाइकै भावमा बस्नु भनेको योग्यताकै आधारमा विदेशबाट पढाइको सहयोग आउने संकेत हो, र छात्रवृत्ति भनेकै त्यही हो। त्यसमाथि नवौं भाव अर्थात् उच्च शिक्षाका स्वामी चन्द्रमा दशम भाव अर्थात् कर्मको भावमा हुनुहुन्छ।

सिभिल इन्जिनियरिङ नै किन भन्ने पनि प्रस्ट छ। लग्नेश मंगल आफ्नै राशि वृश्चिकमा लग्नमै बस्नुभएको छ, र मंगल नै निर्माण, जग्गा र संरचनाका कारक हुन्। यो लाइन तपाईंका लागि संयोगले परेको होइन।

समयको कुरा गर्दा अहिले नै राम्रो छ। गोचरमा बृहस्पति तपाईंको नवौं भाव, अर्थात् उच्च शिक्षाको भावमा हुनुहुन्छ र त्यहींबाट उहाँले पाँचौं भावमा बसेका उच्चको शुक्रलाई हेरिरहनुभएको छ। साथै २३ जनवरी २०२७ सम्म चन्द्रमाको अन्तर्दशा चल्छ र चन्द्रमा नै उच्च शिक्षाका स्वामी हुन्। त्यसैले आवेदनको सबैभन्दा राम्रो समय अहिलेदेखि २०२७ भित्रै हो, ढिलो नगर्नुहोस्।

एउटा कुरा भने ख्याल गर्नुहोस्। बुध वक्री भएर चौथो भावमा हुनुहुन्छ र उहाँ आठौं तथा एघारौं भावका स्वामी हुन्, अनि राहु आठौं भावमै हुनुहुन्छ। यसले कागजपत्र र रकमको निर्णय एक पटकमै नटुंगिएर फेरि हेरिने अवस्था ल्याउँछ। पहिलो पटकमै नभए त्यो अस्वीकार होइन, प्रक्रिया दोहोरिने मात्र हो।

अब लोकसेवाको कुरा। यसका लागि तपाईं ठीक समयमा हुनुहुन्छ। ६ अप्रिल २०२६ बाट तपाईंको सूर्यको महादशा सुरु भइसकेको छ र यो २०३२ सम्म चल्छ। सूर्य नै तपाईंको दशम अर्थात् कर्मका स्वामी हुन् र सरकारका कारक पनि उनै हुन्। अनि छैटौं भाव प्रतियोगिता र परीक्षाको भाव हो, र त्यसका स्वामी मंगल आफ्नै राशिमा लग्नमै बलियो भएर बस्नुभएको छ।

परीक्षाको सबैभन्दा बलियो झ्याल २३ जनवरी २०२७ देखि ३१ मे २०२७ हो, किनकि त्यसबेला सूर्यको महादशामा मंगलकै अन्तर्दशा चल्छ, अर्थात् सरकारका कारक र प्रतियोगिताका स्वामी एकसाथ सक्रिय हुन्छन्। त्यो छोटो तर बलियो समय हो। त्यसपछि जुन २०२७ देखि अप्रिल २०२८ सम्म राहुको अन्तर्दशा चल्छ र राहु आठौं भावमा हुनाले त्यस अवधिमा नतिजा ढिलो हुने वा अलमलिने सम्भावना रहन्छ। दोस्रो राम्रो झ्याल २४ अप्रिल २०२८ देखि १० फेब्रुअरी २०२९ हो।

अन्तिममा एउटा व्यावहारिक कुरा। तपाईंले सोध्नुभएका दुई कुरा एउटै वर्षमा एकअर्कासँग बाझिन्छन्। लोकसेवाको झ्याल छोटो छ, जनवरीदेखि मे २०२७ सम्म मात्र, तर विदेशको ढोका लामो समय खुल्लै रहन्छ, अहिलेदेखि २०२७ हुँदै र फेरि २०३१ मा शुक्रको अन्तर्दशामा। त्यसैले आवेदन नछोडी सन् २०२७ को सुरुमा लोकसेवा पनि दिनुहोस्, छोटो झ्यालचाहिं छाड्नु हुँदैन।

सानो उपाय, आइतबार बिहान सूर्यलाई अर्घ्य दिनुहोस्, किनकि अब छ वर्ष तपाईंको जीवन सूर्यकै हातमा छ र सरकारी सेवा पनि उनैले बोक्छन्।`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s606');
x.chart=chart;
x.person={name:'Sanjaya Paudel',dob:'2001-02-09 (BS 2057/10/27)',time:'01:13',place:'Pokhara, Kaski, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;x.awaiting=false;
s.pandit.activity='s606 Sanjaya (Nepali me) — Vrischik lagna, Simha rashi confirm; scholarship: 12L Shukra UCHCHA in 5th + Guru gochar 9th dekh raha 5th ko = apply ab se 2027 tak; Loksewa: Surya MD 6 Apr 2026-2032 (10L+govt karak), 6L Mangal swagrihi lagna; exam window 23 Jan-31 May 2027; Rahu AD 2027-28 dhila; dono goal 2027 me takra rahe hain';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK',L.signName,L.degreeInSign.toFixed(2),'| Moon',m.signName,'| MD',md.planet,'AD',ad.planet,'| msg',nid);
