const A=require('./index.js');
const B={date:'2004-04-02',time:'09:45',latitude:28.0333,longitude:82.4833,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
const L=r.lagna,m=pl.find(p=>p.name==='Moon');
try{const mg=A.analyzeManglik(r);console.log('MANGLIK',JSON.stringify(mg).slice(0,500));}catch(e){try{const mg=A.analyzeManglik(pl,L);console.log('MANGLIK2',JSON.stringify(mg).slice(0,500));}catch(e2){console.log('manglik err',e.message,'/',e2.message);}}
[9,10].forEach(n=>{const dv=A.calculateDivisionalChart(n,pl,L);
 console.log('\nD'+n,'lagnaKeys',Object.keys(dv).join(','));
 console.log('  lagna:',JSON.stringify(dv.lagna||dv.ascendant||dv.vargaLagna));
 dv.planets.forEach(p=>console.log('   ',p.planet.padEnd(8),p.vargaSignName));});
const mars=pl.find(p=>p.name==='Mars');
console.log('\nMars',mars.signName,mars.degreeInSign.toFixed(2),mars.nakshatra,'pada',mars.nakshatraPada||mars.pada);
const ven=pl.find(p=>p.name==='Venus');
console.log('Venus',ven.signName,ven.degreeInSign.toFixed(2),ven.nakshatra,'pada',ven.nakshatraPada||ven.pada);
let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('2004-04-02T09:45:00+05:45'),nak,(m.longitude%13.3333333),3);
const sun=d.mahaDashas.find(p=>p.planet==='Sun');
console.log('\nSUN MD',(''+sun.startDate).slice(0,10),'->',(''+sun.endDate).slice(0,10));
sun.subPeriods.forEach(p=>console.log('   AD',p.planet.padEnd(8),(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10)));
const moon=d.mahaDashas.find(p=>p.planet==='Moon');
console.log('MOON MD',(''+moon.startDate).slice(0,10),'->',(''+moon.endDate).slice(0,10));
moon.subPeriods.slice(0,5).forEach(p=>console.log('   AD',p.planet.padEnd(8),(''+p.startDate).slice(0,10),'->',(''+p.endDate).slice(0,10)));
// transits Jupiter/Saturn 2026-2031 (Taurus lagna: Scorpio=7th, Aquarius=10th, Gemini=2nd)
const KTM={latitude:27.7172,longitude:85.3240,timezone:'Asia/Kathmandu'};
console.log('\nTRANSITS');
for(let y=2026;y<=2031;y++)for(const mo of [1,4,7,10]){const ds=y+'-'+String(mo).padStart(2,'0')+'-01';
 if(new Date(ds)<new Date('2026-08-01'))continue;
 const q=A.calculateBirthChart({...KTM,date:ds,time:'12:00'});const qp=Array.isArray(q.planets)?q.planets:Object.values(q.planets);
 const g=n=>{const p=qp.find(x=>x.name===n);return (p.signName+' '+p.degreeInSign.toFixed(0)+(p.retrograde?'R':'')).padEnd(16);};
 console.log(' ',ds,'Ju',g('Jupiter'),'Sa',g('Saturn'),'Ra',g('Rahu'));}
