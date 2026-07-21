const A=require('/Users/saurabh/Work/pocket-pandit/astrology-insights/index.js');
const ABBR={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const sn=s=>({Aries:1,Taurus:2,Gemini:3,Cancer:4,Leo:5,Virgo:6,Libra:7,Scorpio:8,Sagittarius:9,Capricorn:10,Aquarius:11,Pisces:12})[s];
function full(tag,birth,utc){
  const res=A.calculateBirthChart(birth);
  const plist=Array.isArray(res.planets)?res.planets:Object.values(res.planets);
  const m=plist.find(p=>p.name==='Moon');
  console.log('====',tag,'====');
  console.log('LAGNA',res.lagna.signName,res.lagna.nakshatra,'| MOON',m.signName,m.nakshatra);
  (res.houses||[]).forEach(h=>console.log('H'+(h.houseNumber||h.number),h.signName||h.sign,(h.planets||[]).map(x=>x.name||x).join(',')));
  plist.forEach(p=>console.log('P',ABBR[p.name],p.signName||p.sign,'nak='+p.nakshatra,'retro='+!!p.retrograde,'dig='+(p.dignity||'')));
  const d=A.calculateVimshottariDasha(new Date(utc),m.nakshatra,(m.longitude%13.3333333),2);
  console.log('CUR',JSON.stringify(d.currentDasha));
  const W=new Date('2025-01-01'),X=new Date('2036-12-31');
  d.mahaDashas.forEach(p=>{const s=new Date(p.startDate),e=new Date(p.endDate);if(e<W||s>X)return;console.log('MD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10));});
  try{const d7=A.calculateDivisionalChart(res,'D7');console.log('D7 lagna',d7&&d7.lagna&&(d7.lagna.signName||d7.lagna.sign));
    const pl7=d7&&(Array.isArray(d7.planets)?d7.planets:Object.values(d7.planets||{}));
    (pl7||[]).forEach(p=>console.log('D7',ABBR[p.name]||p.name,p.signName||p.sign));}catch(e){console.log('D7 err',e.message)}
  return {res,d,plist};
}
const rima=full('RIMA',{date:'1992-10-26',time:'07:05',latitude:19.076,longitude:72.8777,timezone:'Asia/Kolkata'},'1992-10-26T01:35:00Z');
const jay=full('JAY',{date:'1987-06-16',time:'03:05',latitude:19.076,longitude:72.8777,timezone:'Asia/Kolkata'},'1987-06-15T21:35:00Z');
