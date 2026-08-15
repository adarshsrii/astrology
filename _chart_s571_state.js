const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
// HELD. role:'note' so the "जातक को भेजें" send button (which picks the last pandit-role
// message) cannot relay this to the user. awaiting:true so पूछें reappears for override.
const NOTE=`FLAGGED, DUPLICATE, ROLE SWAP. Answer held, press पूछें again to answer anyway.

This is the same chart pair as s360 and s435, now with the roles reversed.

s360 "Prakriti A harma", dev 9bc32c98, her own DOB 12 Sep 1994 08:04 Dehradun, partner 27-10-1994 6:50am Palpa. She got TWO full free readings there, love vs arranged marriage and then the breakup timing on this same boy. Paywall armed 1 Aug, never paid.

s435 "Prakriti Sharma", dev 3ff852d9, identical birth_hash to s360 (05a35c8307b5da08...), and the device was created 72 SECONDS after s360 went dead, so it is the same handset reinstalled. I already flagged and held it. Paywall armed 2 Aug, never paid.

s571 (this one), dev fe9546f9, arrives 12 Aug presenting the SAME PAIR with the boy as primary and the girl as partner, asking the same underlying question she asked twice, when will we get back together. Her exact birth time 8:04 am is quoted, which she had. In s360 she wrote "are there any chances of him coming back" and "tell me clearly his chances of coming back"; this message reframes that as "she is having a lot of prblm to move on".

All three devices are the same phone model NE2213, locale en-GB, timezone Asia/Kathmandu. Zero payments from any of the three.

s571 carries a different birth_hash (b4b1f5c7d6fadd46...) only because the birth data entered this time is his, Palpa Nepal, not hers.

Fair caveat, it could genuinely be Bishnu. A real couple can both install the app, NE2213 is a common handset, and she may have been born in Dehradun while living in Nepal, which would explain the Kathmandu timezone on her devices. But either way this chart pair has already had two free readings on exactly this question and the paywall was declined twice, so the call is yours.`;
const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s571');
x.person={name:'Bishnu Gyawali (claimed)',dob:'1994-10-27',time:'06:50',place:'Palpa, Nepal'};
x.spouse={name:'partner',dob:'1994-09-12',time:'08:04',place:'Dehradun, India'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'note',text:NOTE});
x.pending=false;
x.awaiting=true;          // पूछें reappears so Saurabh can override
s.pandit.activity='s571 FLAGGED role-swap of s360/s435 (same pair, 3rd device, 2 free readings already) — answer held';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('HELD | note id',nid,'| role note | awaiting:',x.awaiting,'| chart written:',!!x.chart);
