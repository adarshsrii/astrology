const A=require('./index.js');
const B={date:'2000-02-02',time:'03:56',latitude:27.6588,longitude:85.3247,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
console.log('LAGNA',L.signName,L.degreeInSign.toFixed(2));
pl.forEach(p=>{const h=((p.signNumber-L.signNumber+12)%12)+1;
 console.log(p.name.padEnd(8),p.signName.padEnd(12),p.degreeInSign.toFixed(2).padStart(6),'H'+h,p.nakshatra,p.retrograde?'R':'',p.dignity||'');});
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('2000-02-02T03:56:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-16');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const pd=(ad.subPeriods||[]).find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
console.log('\nMD',md.planet,(''+md.startDate).slice(0,10),(''+md.endDate).slice(0,10));
console.log('AD',ad.planet,(''+ad.startDate).slice(0,10),(''+ad.endDate).slice(0,10),'| PD',pd&&pd.planet);
console.log('\n-- ADs in current MD --');
md.subPeriods.forEach(p=>console.log('  ',p.planet,(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10)));
console.log('\n-- PDs covering Aug2026-Aug2027 --');
md.subPeriods.forEach(a=>(a.subPeriods||[]).forEach(p=>{
 const s=new Date(p.startDate),e=new Date(p.endDate);
 if(e>new Date('2026-08-01')&&s<new Date('2027-10-01'))
  console.log('   ',a.planet+'-'+p.planet,(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10));}));
console.log('\n-- MD timeline --');
d.mahaDashas.forEach(p=>console.log('  ',p.planet,(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10)));
console.log('\n-- SWEEP +-10min --');
[-10,-5,0,5,10].forEach(o=>{const t=new Date(Date.UTC(2000,1,2,3,56)+o*60000);
 const rr=A.calculateBirthChart({...B,time:String(t.getUTCHours()).padStart(2,'0')+':'+String(t.getUTCMinutes()).padStart(2,'0')});
 console.log('  ',(o+'min').padStart(6),'D1',rr.lagna.signName,rr.lagna.degreeInSign.toFixed(2));});
console.log('\n-- TRANSITS Ju/Sa/Ra --');
['2026-08-16','2026-11-01','2027-02-01','2027-05-01','2027-08-01'].forEach(ds=>{
 const t=A.calculateBirthChart({date:ds,time:'12:00',latitude:27.6588,longitude:85.3247,timezone:'Asia/Kathmandu'});
 const tp=Array.isArray(t.planets)?t.planets:Object.values(t.planets);
 console.log('  ',ds,['Jupiter','Saturn','Rahu'].map(n=>{const p=tp.find(x=>x.name===n);return n.slice(0,2)+':'+p.signName+' '+p.degreeInSign.toFixed(1)+(p.retrograde?'R':'')}).join('  '));});
