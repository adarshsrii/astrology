const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'2003-07-11',time:'08:25',latitude:27.7333,longitude:85.3833,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('2003-07-11T08:25:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-11');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`Career and money first. Your career lord Venus sits in the eleventh house of income along with your ascendant lord, so your career and your earnings rise together rather than separately. Rahu is exalted in your tenth house, which is a strong career placement and points towards modern or foreign linked work rather than an ordinary local job. So yes, you will earn enough to support your family comfortably. One honest catch, your second lord Mercury sits in the twelfth house, which means money leaves as fast as it comes in. You will earn plenty and save little unless you make the saving automatic from your very first salary.

On going abroad, yes, clearly, and it leans to study before work. Jupiter is exalted in your twelfth house of foreign lands, and Jupiter also rules your fifth house of education, so higher study abroad is written plainly in your chart. The timing is close. From November 2026 to May 2027 you run the sub period of Rahu, your exalted tenth house planet, and from May to October 2027 the sub period of that same exalted Jupiter. Jupiter also comes back to its own birth position in your twelfth house around October 2026. So start your applications from late 2026 and expect the move itself in 2027, most likely between May and October.

On which country, I will not name one, and I would rather tell you that straight. No chart names a country honestly and anyone who gives you one is inventing it. What your chart does say is that it happens, and that it happens for study.

Your partner. Your seventh lord Saturn sits in the eleventh house of friends and social circles with Venus right beside it, so you meet him through your own circle, through friends or through your study or work network, and it moves towards love rather than a formal arrangement. Given the timing above there is a fair chance you meet him in the new place rather than at home. The likely meeting window is late 2027 to the middle of 2028, when Saturn, your seventh lord, takes its own sub period. The marriage itself comes later, around 2031 to 2032, when Venus and Mars run together and Mars is the planet sitting in your seventh house.

On same community or different, your chart leans to different. Saturn ruling the seventh usually brings someone from another background, and with the foreign pull this chart carries, a match outside your own community is the more likely one. Take that as a lean and not a fixed rule.

One thing you should know before anything is fixed. Mars sits in your seventh house, which makes you Manglik. It does not spoil a marriage, but the charts should be matched properly, and expect a strong willed partner, so there will be some heat in the relationship.

Your Moon is debilitated in the fourth house, which is why home never quite feels settled to you and why going away will suit you better than staying. Offer water at a Shiva temple on Mondays, it helps that Moon.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s552');
x.chart=chart;
x.person={name:'Susmita Bala',dob:'2003-07-11',bs:'2060-03-27 (Ashar 27)',time:'08:25',place:'Nepal Medical College, Kathmandu, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
s.pandit.activity='s552 Susmita — videsh study 2027 (Guru uccha 12th), aamdani 11th, partner late 2027-2028 bhet';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,L.degreeInSign.toFixed(2),'| Moon',m.signName,m.nakshatra,'| MD',md.planet,'AD',ad.planet,'| msg',nid);
