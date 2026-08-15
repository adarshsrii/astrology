const fs=require('fs');
const P='/Users/saurabh/Desktop/Jyotish /pandit_state.json';
// No DOB/time anywhere (Supabase keeps only birth_hash + city). No chart written.
// Death-age question declined on purpose: he is an IIT aspirant, so a teenager.
const MSG=`Ayaan, chart banane ke liye do cheezein chahiye. Aapki janm tarikh aur janm ka sahi samay. Jagah aapke app me Jaipur likhi hai, agar wahi janm sthan hai to bas confirm kar dijiye. Samay ke bina lagna nahi banta, aur lagna ke bina naukri ya selection ka koi bhi jawab sirf andaza hoga, aur andaza main aapko dena nahi chahta.

Umar aur mrityu wala sawaal, uska jawab main nahi deta. Shastra me aayu ka vichaar sabse kathin maana gaya hai, ek hi kundli par alag alag niyam ek dusre se ulta phal dete hain, isliye jo bhi number main aapko batata wo galat hone ka pura khatra rakhta, aur bina kisi wajah ke aapke dimag me baith jaata. Jo jyotishi mrityu ki umar bata dete hain, wo aapka bhala nahi kar rahe hote.

Baaki dono sawaalon ka jawab pura milega. Naukri kis umar me lagegi, aur IIT Bombay me selection banta hai ki nahi, yeh dashamesh, panchamesh, vidya ka bhav aur chalti dasha se padha jaata hai. Jo bhi nikalega wahi likhunga, chahe haan ho ya naa.

Aur ek baat, ek insaan ki taraf se. IIT ki taiyari ke dinon me dimag bahut kuch sochta rehta hai, yeh aam baat hai. Aapki umar me kundli ka asli matlab aane wale saalon me hota hai, guzre huon me nahi. Janm tarikh aur samay bhej dijiye, main baaki sab khol kar batata hun.`;
const s=JSON.parse(fs.readFileSync(P,'utf8'));
const x=s.sessions.find(v=>v.id==='s572');
x.person={name:'Ayaan Badaya',dob:'(needed)',time:'(needed)',place:'Jaipur, Rajasthan, India (from app, to confirm)'};
const nid=Math.max(0,...(x.messages||[]).map(v=>v.id||0))+1;
x.messages.push({id:nid,role:'pandit',text:MSG});
x.pending=false;
x.awaiting=false;
s.pandit.activity='s572 Ayaan — janm tarikh+samay maanga, mrityu ka sawaal decline kiya (IIT aspirant, kishor)';
fs.writeFileSync(P,JSON.stringify(s,null,1));
console.log('OK asked for details | msg',nid,'| chart null:',!x.chart);
