const A=require('./index.js');
const birth={date:'1998-07-07',time:'05:44',latitude:13.0827,longitude:80.2707,timezone:'Asia/Kolkata'};
const res=A.calculateBirthChart(birth);
const plist=Array.isArray(res.planets)?res.planets:Object.values(res.planets);
const L=res.lagna;
const d9=A.calculateDivisionalChart(9,plist,L.signNumber,L.degree!=null?L.degree:(L.longitude%30));
console.log('D9 LAGNA',d9.lagnaSignName||d9.lagnaSign||JSON.stringify(d9.lagna).slice(0,120));
(d9.planets||[]).forEach(p=>console.log('D9',p.name,p.signName||p.sign,'house='+(p.house||'')));
// Jupiter + Saturn transit signs, 1st of each month 2026-2028
const SIGN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
let prev='';
for(let y=2026;y<=2029;y++)for(let mo=1;mo<=12;mo++){
  const dt=`${y}-${String(mo).padStart(2,'0')}-01`;
  const t=A.calculateBirthChart({date:dt,time:'12:00',latitude:13.0827,longitude:80.2707,timezone:'Asia/Kolkata'});
  const tp=Array.isArray(t.planets)?t.planets:Object.values(t.planets);
  const ju=tp.find(p=>p.name==='Jupiter'), sa=tp.find(p=>p.name==='Saturn'), ra=tp.find(p=>p.name==='Rahu');
  const key=ju.signName+'|'+sa.signName+'|'+ra.signName;
  if(key!==prev){console.log('TRANSIT',dt,'Ju='+ju.signName,'Sa='+sa.signName,'Ra='+ra.signName);prev=key;}
}
