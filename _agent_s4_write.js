const fs=require('fs');
const chart=JSON.parse(fs.readFileSync('/private/tmp/_chart_s4.json','utf8'));
const answer=[
"## Shaadi ka yog — Ramesh ji",
"",
"**Aapki kundali shaadi ke liye bahut shubh hai — aur sab sanket kehte hain ki vivah aap kar chuke honge, lagbhag 2010 se 2014 ke beech (25-29 saal ki umar).** Agar abhi tak nahi hua to ghabraiye mat, raah khuli hai.",
"",
"Dekhiye — aapka **7vaa ghar (vivah ka ghar)** khaali nahi, usme **Guru, Surya aur Budh** baithe hain. Guru saatve ghar me ho to jeevansaathi samajhdaar aur sanskaari milta hai. Sabse khaas — **Shukra aapke 9ve bhaav me uchcha (exalted)** hai. Shukra hi pati ke liye patni ka karak hai; uchcha Shukra matlab bhagyashaali, prem-bhari aur dharmik saathi. Isi liye vivah Guru ki mahadasha (1999-2015) me hi hona tha — aur wahi sabse sambhav samay raha.",
"",
"Abhi **Shani-Surya** ka samay chal raha hai (2025-2026), uske baad **Shani-Chandra** (2026-2028). Chandra aapke lagna ke swami hain — yeh do saal parivaar, ghar aur grihasthi me sukh aur thodi nayi shuruaat ka samay hai; rishton me mithaas laautega.",
"",
"**Chhota upaay:** Har **shukravaar** kuch safed-meetha (kheer ya mishri) apni saathi/ghar me baatiye, aur Maa Lakshmi ko safed phool chadhaiye. Shukra prasann to grihasth jeevan me prem aur shanti dono badhenge.",
"",
"Shubhkaamnaayein. 🙏"
].join("\\n");
const out={
  sessionId:"s4",
  reqId:2,
  person:{name:"Ramesh",dob:"2 Feb 1985",time:"16:45",place:"Delhi, India"},
  chart:chart,
  answer:answer
};
fs.writeFileSync('/Users/saurabh/Desktop/Jyotish /inbox/result-2.json',JSON.stringify(out,null,2));
console.log('written');
