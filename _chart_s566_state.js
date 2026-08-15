const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
// She sent details but NO question. Also 07:00 sits ~6 min after the Scorpio->Sagittarius
// lagna change, so no chart is written until the time and the question are confirmed.
const MSG=`Anjana, your details have reached me and the date checks out. BS 2057/08/30 comes to 15 December 2000, and that day was indeed a Friday, so your date and the weekday agree with each other.

One thing before I read anything properly. Seven o'clock sits right on a boundary in your chart. At 7:00 your ascendant is Sagittarius, but it had only just changed over, and if you were born even six or seven minutes earlier it is Scorpio instead, which shifts every house in the chart. Your Moon is in Cancer under Ashlesha nakshatra either way, so that much is settled. If anyone at home remembers the time more exactly, or if it is written down somewhere, please tell me.

And tell me what you want to know. You have sent me the birth details but not the question, so say what I should look at, whether it is marriage, career, study, money or health, and I will read it properly for you.`;
const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s566');
x.person={name:'Anjana',dob:'2000-12-15 (BS 2057-08-30, Friday, verified)',time:'07:00 (on Scorpio/Sagittarius lagna cusp, confirm)',place:'Nuwakot, Nepal'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:MSG});
x.pending=false;
x.awaiting=false;
s.pandit.activity='s566 Anjana — miti verified (Friday 15 Dec 2000), prashna maagyo + samaya lagna sandhi ma cha';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK asked for question + exact time | msg',nid,'| chart left null:',!x.chart);
