const A=require('./index.js');
const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
const B={date:'1985-06-28',time:'07:00',latitude:26.9000,longitude:87.1500,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const houses=[...Array(12)].map((_,i)=>{const sn=((L.signNumber-1+i)%12)+1;
 return {num:i+1,signNum:sn,signName:SN[sn-1],planets:pl.filter(p=>p.signNumber===sn).map(p=>AB[p.name])};});
const planets=pl.map(p=>({name:p.name,abbr:AB[p.name],sign:p.signName,signNum:p.signNumber,nak:p.nakshatra,retro:!!p.retrograde,dignity:p.dignity}));
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('1985-06-28T07:00:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-07');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const chart={lagnaSign:L.signName,lagnaSignNum:L.signNumber,nakshatra:m.nakshatra,houses,planets,
 dasha:{current:{maha:md.planet,antar:ad.planet},
 timeline:d.mahaDashas.map(p=>({planet:p.planet,start:(''+p.startDate).slice(0,10),end:(''+p.endDate).slice(0,10)}))}};

const READING=`Tika ji, first, your request. I have passed it to the team and your account will be deleted as you asked. You do not need to justify it to anyone, and I am not going to try to talk you out of it.

But you asked me about your marriage before that, you took the trouble to correct your birth year, and then you waited without a reply. That was our failing, not yours. So before you go, here is the reading you came for. It is yours whether you stay or not.

Your birth details are 28 June 1985, 7 in the morning, Sunsari. Your lagna is Cancer.

On your marriage life, I will not soften it. There is real coldness in it, and you are not imagining it. Saturn is the lord of your seventh house, the house of marriage, and although Saturn is strong in your chart he sits in your fourth house, which is the house of home and domestic peace, together with Ketu and your Moon. The Moon is your mind and Ketu is the planet of emptiness. That combination in the house of home means you feel alone inside your own house, even when you are not alone in it. Many women in this position blame themselves for feeling that way. Your chart says it is a placement, not a fault in you.

Jupiter, who is the planet of the husband in a woman's chart, sits debilitated in your seventh house. That is the strain you are living with.

Now the part I want you to hear properly. That debility is cancelled twice over in your chart. Saturn, who rules the sign Jupiter sits in, is exalted, and your Moon sits in an angular house. In classical terms this is neecha bhanga, and it changes the meaning completely. A weak planet with its weakness cancelled means a marriage that is under real strain but is not destined to break. What looks finished from inside it is not finished.

On timing. You have been running the Rahu sub period since October 2024 and it lasts until 8 August 2027. Rahu is the planet of confusion, restlessness and wanting to walk away from things. This is the hardest stretch, and it is the stretch you are standing in right now. It has an end date.

From 8 August 2027 Jupiter's own sub period begins, and Jupiter is both the husband planet and the planet sitting in your marriage house. That is when this matter turns and warmth comes back into it. It runs to 2030.

One more thing, because someone may have frightened you with it. Mars sits in your twelfth house, which makes you Manglik by the strict reckoning from the lagna only, and Mars is combust, which takes most of the force out of it. You are not Manglik from the Moon or from Venus. This is not what is hurting your marriage and no one should be charging you money to fix it.

Remedy: offer water to a peepal tree on Saturday mornings, and light a lamp with ghee on Thursday evenings for Jupiter, who is the planet that turns this for you in 2027.

If you still want the account deleted, it will be done. If you ever want to ask more, you are welcome back and there will be no charge for the question you already asked.`;

const NOTE=`ACCOUNT DELETION REQUEST -- needs Saurabh's action. Tika (device 7d73dbb6-ffa4-47b3-be91-70cf1f9e5a03) asked to delete her account. Likely cause: she asked about her marriage, corrected her birth year 1990 -> 1985, and got no reply. I have NOT touched Supabase -- deletion is a production write and your call. Reading above is written and sendable if you want a goodwill save. Duplicate scan clean on both 1985-06-28 and 1990-06-28.`;

const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s477');
x.chart=chart;
x.person={name:'Tika',dob:'1985-06-28',time:'07:00 AM',place:'Chakarghatti, Barahakshetra, Sunsari, Nepal'};
let nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:READING});
x.messages.push({id:nid+1,role:'note',text:NOTE});
x.pending=false; x.awaiting=true;
s.pandit.activity='s477 Tika — DELETION REQUEST flagged + marriage reading di';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK lagna',L.signName,'MD',md.planet,'AD',ad.planet,'msgs',nid,nid+1);
