const A=require('./index.js');
const places={'Chitwan(Parsa)':[27.5500,84.3500],'Pokhara':[28.2096,83.9856]};
for(const [nm,[la,lo]] of Object.entries(places)){
 const r=A.calculateBirthChart({date:'1996-02-26',time:'15:00',latitude:la,longitude:lo,timezone:'Asia/Kathmandu'});
 const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
 const mo=pl.find(p=>p.name==='Moon');
 console.log(nm,'-> LAGNA',r.lagna.signName,r.lagna.degreeInSign.toFixed(2),'| MOON',mo.signName,mo.degreeInSign.toFixed(2),mo.nakshatra);
}
console.log('');
const B={date:'1996-02-26',time:'15:00',latitude:27.55,longitude:84.35,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
pl.forEach(p=>{const h=((p.signNumber-L.signNumber+12)%12)+1;
 console.log(p.name.padEnd(8),p.signName.padEnd(12),p.degreeInSign.toFixed(2).padStart(6),'H'+h,p.nakshatra,p.retrograde?'R':'',p.dignity||'');});
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('1996-02-26T15:00:00+05:45'),nak,(m.longitude%13.3333333),3);
const T=new Date('2026-08-16');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const pd=(ad.subPeriods||[]).find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
console.log('\nMD',md.planet,(''+md.startDate).slice(0,10),(''+md.endDate).slice(0,10));
console.log('AD',ad.planet,(''+ad.startDate).slice(0,10),(''+ad.endDate).slice(0,10));
console.log('PD',pd&&pd.planet,pd&&(''+pd.startDate).slice(0,10),pd&&(''+pd.endDate).slice(0,10));
console.log('\n-- ADs in MD --'); md.subPeriods.forEach(p=>console.log('  ',p.planet,(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10)));
console.log('\n-- PDs in current AD --'); (ad.subPeriods||[]).forEach(p=>console.log('    ',p.planet,(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10)));
console.log('\n-- SWEEP +-20min --');
[-20,-10,0,10,20].forEach(o=>{const t=new Date(Date.UTC(1996,1,26,15,0)+o*60000);
 const rr=A.calculateBirthChart({...B,time:String(t.getUTCHours()).padStart(2,'0')+':'+String(t.getUTCMinutes()).padStart(2,'0')});
 const rp=Array.isArray(rr.planets)?rr.planets:Object.values(rr.planets);
 console.log('  ',(o+'min').padStart(6),'D1',rr.lagna.signName,rr.lagna.degreeInSign.toFixed(2),'| Moon',rp.find(p=>p.name==='Moon').signName);});
console.log('\n-- MANGLIK --'); console.log(JSON.stringify(A.analyzeManglik(pl,r.houses,L.signNumber)));
console.log('\n-- TRANSITS --');
['2026-08-16','2026-11-01','2027-01-01','2027-04-01','2027-08-01','2028-01-01'].forEach(ds=>{
 const t=A.calculateBirthChart({date:ds,time:'12:00',latitude:27.55,longitude:84.35,timezone:'Asia/Kathmandu'});
 const tp=Array.isArray(t.planets)?t.planets:Object.values(t.planets);
 console.log('  ',ds,['Jupiter','Saturn','Rahu'].map(n=>{const p=tp.find(x=>x.name===n);return n.slice(0,2)+':'+p.signName+' '+p.degreeInSign.toFixed(1)+(p.retrograde?'R':'')}).join('  '));});
