const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'2001-03-23',time:'05:10',latitude:28.0000,longitude:84.6333,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('2001-03-23T05:10:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-05');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`Shantamani ji, your Kumbha rasi is correct, the Moon is in Aquarius in Shatabhisha and your lagna is Aquarius as well.

Career is the strongest thing in your chart. Mars sits in his own sign Scorpio right in the tenth house, which is close to the best a work house can look, and your lagna lord Saturn aspects it, so technical, engineering, security or a government line suits you and government service is genuinely open to you, not just a hope. Your first proper job comes with the Mercury period starting 4 November 2026. The Saturn-Saturn stretch you are sitting in now is slow by design, which is why nothing has moved so far. In study, Rahu in your fifth house means the ordinary syllabus route is not your strength, you do better with technical or unusual subjects. Money is solid, your second lord Jupiter is in a kendra and Venus is exalted in the second itself, so financial stability is built into your chart, it just comes steadily rather than in one jump.

On marriage, you will most likely meet her during the Mercury period, somewhere between 2027 and 2029, but the marriage itself falls in Saturn-Venus, from about August 2030 to 2032. It will probably start as your own liking and then get family approval rather than being a purely arranged match, because Rahu in the fifth pulls you toward love while your seventh lord sits in the second, the house of family. She will most likely be from your own community and not far from home. Her nature will be gentle, giving and family minded with a religious side, and since your seventh lord sits with exalted Venus in the family house, she fits into your family well and your life after marriage improves in both money and peace.

Your own family situation is warm but heavy. Jupiter and Saturn are both in your fourth house, so you are respected at home but the responsibility for the family falls on you more than on anyone else, and you feel that weight before you feel the reward.

About going abroad, your chart does not show permanent foreign settlement. Saturn, your lagna lord, sits in the fourth and anchors you to your own land. A work stint or travel is possible but you will build your real life in Nepal, and that is not a smaller outcome for you, it is where that strong tenth house actually pays. Health shows nothing structural, your sixth lord Moon sits in the lagna in Shatabhisha, so the stomach, sleep and nerves are your weak points and they follow your worry rather than any disease. Success will be real but slow, that is Saturn's way, and it opens properly from 2030.

Offer water to Shivji on Saturdays and keep your sleep regular, that covers both the Saturn period and your Moon.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s473');
x.chart=chart;
x.person={name:'Shantamani',dob:'2001-03-23',dobBS:'2057-12-10',time:'05:10',place:'Gorkha, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.pending=false;
s.pandit.activity='s473 Shantamani — full life reading di';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,'Moon',m.signName,'MD',md.planet,'AD',ad.planet,'msg',nid);
