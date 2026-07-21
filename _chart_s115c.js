const A=require('/Users/saurabh/Work/pocket-pandit/astrology-insights/index.js');
console.log('SHODASH keys:', JSON.stringify(Object.keys(A.SHODASHVARGA_CHARTS||{})));
const birth={date:'1992-10-26',time:'07:05',latitude:19.076,longitude:72.8777,timezone:'Asia/Kolkata'};
const res=A.calculateBirthChart(birth);
const plist=Array.isArray(res.planets)?res.planets:Object.values(res.planets);
const m=plist.find(p=>p.name==='Moon');
const d=A.calculateVimshottariDasha(new Date('1992-10-26T01:35:00Z'),m.nakshatra,(m.longitude%13.3333333),2);
d.mahaDashas.forEach(p=>{if(p.planet!=='Saturn')return;(p.subPeriods||[]).forEach(s2=>console.log('AD',s2.planet,(''+s2.startDate).slice(0,10),'→',(''+s2.endDate).slice(0,10)));});
for(const k of [7,'7','saptamsa','Saptamsa','D-7']){
  try{const d7=A.calculateDivisionalChart(res,k);console.log('OK arg',k,'lagna',d7&&d7.lagna&&(d7.lagna.signName||d7.lagna.sign));break}catch(e){console.log('fail',k,e.message.slice(0,60))}
}
