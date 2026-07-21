const A=require('/Users/saurabh/Work/pocket-pandit/astrology-insights/index.js');
const ABBR={Sun:'Su',Moon:'Mo',Ma:'Ma'};
function full(tag,birth,utc){
  const res=A.calculateBirthChart(birth);
  const plist=Array.isArray(res.planets)?res.planets:Object.values(res.planets);
  const m=plist.find(p=>p.name==='Moon');
  console.log('====',tag,'====');
  console.log('LAGNA',res.lagna.signName,res.lagna.nakshatra,'| MOON',m.signName,m.nakshatra);
  (res.houses||[]).forEach(h=>console.log('H'+(h.houseNumber||h.number),h.signName||h.sign,(h.planets||[]).map(x=>x.name||x).join(',')));
  try{console.log('MANGLIK',JSON.stringify(A.analyzeManglik(plist,res.lagna)).slice(0,250));}catch(e){
    try{console.log('MANGLIK2',JSON.stringify(A.analyzeManglik(plist)).slice(0,250));}catch(e2){console.log('MG err',e2.message)}}
  const d=A.calculateVimshottariDasha(new Date(utc),m.nakshatra,(m.longitude%13.3333333),2);
  console.log('CUR',JSON.stringify(d.currentDasha));
  const W=new Date('2025-06-01'),X=new Date('2031-12-31');
  d.mahaDashas.forEach(p=>{const s=new Date(p.startDate),e=new Date(p.endDate);if(e<W||s>X)return;console.log('MD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10));(p.subPeriods||[]).forEach(s2=>{const ss=new Date(s2.startDate),ee=new Date(s2.endDate);if(ee<W||ss>X)return;console.log('  AD',s2.planet,(''+s2.startDate).slice(0,10),'→',(''+s2.endDate).slice(0,10));});});
  return {res,plist,moon:m};
}
const her=full('SAKSHI',{date:'2001-11-30',time:'22:45',latitude:27.017,longitude:84.867,timezone:'Asia/Kathmandu'},'2001-11-30T17:00:00Z');
const him=full('HIM',{date:'1995-10-21',time:'23:50',latitude:22.5726,longitude:88.3639,timezone:'Asia/Kolkata'},'1995-10-21T18:20:00Z');
for(const args of [[her.res,him.res],[her.moon,him.moon],[{nakshatra:her.moon.nakshatra,sign:her.moon.signName},{nakshatra:him.moon.nakshatra,sign:him.moon.signName}]]){
  try{console.log('MILAN',JSON.stringify(A.calculateAshtakootMilan(args[0],args[1])).slice(0,800));break}catch(e){console.log('milan try fail:',e.message.slice(0,80))}
}
