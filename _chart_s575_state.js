const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
// No chart written: 1:30-1:40 with no AM/PM gives Scorpio vs Gemini lagna.
// Every question he asked is house-based, so the reading waits for the time.
const MSG=`Namaste Rhim. Your date is settled, 2052 Magh 27 does come to 10 February 1996 and that was a Saturday, so that part matches perfectly.

But I need one thing from you before I read anything. You have written the time as around 1:30 to 1:40 without saying whether that was night or afternoon, and those two give opposite charts. At 1:35 at night your ascendant is Scorpio. At 1:35 in the afternoon it is Gemini. Everything you have asked me, which field suits you, your education, marriage, wealth, and whether Nepal or abroad is better for you, is read from the houses, and the houses are counted from the ascendant. If I pick the wrong one, every single answer I give you will be wrong, so I would rather ask than guess.

So tell me please, was it half past one at night or half past one in the afternoon.

One more thing if it was the afternoon. Your ascendant shifts from Taurus to Gemini right in the middle of that ten minute window, so in that case I will also need the exact minute if anyone at home remembers it, or at least whether it was nearer 1:30 or nearer 1:40. If it was night then the ten minute range does not trouble me, Scorpio holds across the whole window.

What I can already tell you is that the birth date itself carries some good strength. Jupiter is in its own sign, Venus is exalted and Saturn is in its own sign, and none of that changes with the time. Send me the time and I will give you the full reading on career, study, marriage and the foreign question.`;
const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s575');
x.person={name:'Rhim',dob:'1996-02-10 (BS 2052-10-27, Saturday, verified)',time:'1:30-1:40, AM/PM NOT GIVEN',place:'Chakrata, Uttarakhand, India'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:MSG});
x.pending=false;
x.awaiting=false;
s.pandit.activity='s575 Rhim — samaya AM/PM chahiyo, lagna Scorpio ki Gemini, chart rokeko';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK asked for time | msg',nid,'| chart left null:',x.chart===null||x.chart===undefined);
