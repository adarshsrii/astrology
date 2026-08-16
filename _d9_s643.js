const A=require('./index.js');
const B={date:'1996-03-08',time:'06:45',latitude:26.5679,longitude:88.0847,timezone:'Asia/Kathmandu'};
const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
// D9 + birth-time sensitivity sweep
[-10,-5,0,5,10].forEach(off=>{
  const t=new Date(Date.UTC(1996,2,8,6,45)+off*60000);
  const hh=String(t.getUTCHours()).padStart(2,'0'), mm=String(t.getUTCMinutes()).padStart(2,'0');
  const r=A.calculateBirthChart({...B,time:hh+':'+mm});
  const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
  const d9=A.calculateDivisionalChart(9,pl,r.lagna.signNumber,r.lagna.degreeInSign);
  const l9=d9.lagna||d9.lagnaSign;
  console.log(off+'min  D1 lagna',r.lagna.signName,r.lagna.degreeInSign.toFixed(2),' D9 lagna',(l9&&(l9.signName||SN[(l9.signNumber||l9)-1]))||JSON.stringify(l9).slice(0,60));
  if(off===0){
    const p9=Array.isArray(d9.planets)?d9.planets:Object.values(d9.planets||{});
    p9.forEach(p=>console.log('    D9',p.name,p.signName||SN[p.signNumber-1]));
  }
});
