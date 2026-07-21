const A=require('/Users/saurabh/Work/pocket-pandit/astrology-insights/index.js');
const ABBR={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
function full(tag,birth,utc){
  const res=A.calculateBirthChart(birth);
  const plist=Array.isArray(res.planets)?res.planets:Object.values(res.planets);
  const m=plist.find(p=>p.name==='Moon');
  console.log('====',tag,'====');
  console.log('LAGNA',res.lagna.signName,res.lagna.nakshatra,'| MOON',m.signName,m.nakshatra);
  (res.houses||[]).forEach(h=>console.log('H'+(h.houseNumber||h.number),h.signName||h.sign,(h.planets||[]).map(x=>x.name||x).join(',')));
  plist.forEach(p=>console.log('P',ABBR[p.name],p.signName||p.sign,'nak='+p.nakshatra,'retro='+!!p.retrograde,'dig='+(p.dignity||'')));
  const mg=A.analyzeManglik(res); console.log('MANGLIK', JSON.stringify(mg&&(mg.isManglik!==undefined?{is:mg.isManglik,type:mg.type||mg.severity}:mg)).slice(0,200));
  const d=A.calculateVimshottariDasha(new Date(utc),m.nakshatra,(m.longitude%13.3333333),2);
  console.log('CUR',JSON.stringify(d.currentDasha));
  const W=new Date('2025-06-01'),X=new Date('2031-12-31');
  d.mahaDashas.forEach(p=>{const s=new Date(p.startDate),e=new Date(p.endDate);if(e<W||s>X)return;console.log('MD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10));(p.subPeriods||[]).forEach(s2=>{const ss=new Date(s2.startDate),ee=new Date(s2.endDate);if(ee<W||ss>X)return;console.log('  AD',s2.planet,(''+s2.startDate).slice(0,10),'→',(''+s2.endDate).slice(0,10));});});
  return res;
}
const her=full('SAKSHI',{date:'2001-11-30',time:'22:45',latitude:27.017,longitude:84.867,timezone:'Asia/Kathmandu'},'2001-11-30T17:00:00Z');
const him=full('HIM',{date:'1995-10-21',time:'23:50',latitude:22.5726,longitude:88.3639,timezone:'Asia/Kolkata'},'1995-10-21T18:20:00Z');
try{
  const mil=A.calculateAshtakootMilan(her,him);
  console.log('MILAN', JSON.stringify(mil).slice(0,600));
}catch(e){
  try{const mil=A.calculateAshtakootMilan(him,her);console.log('MILAN-rev',JSON.stringify(mil).slice(0,600));}
  catch(e2){console.log('MILAN err',e.message,'|',e2.message)}
}
