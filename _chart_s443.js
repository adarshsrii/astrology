const A=require('./index.js');
const TZ='Asia/Kolkata';
const BOY={date:'2001-04-27',time:'19:15',latitude:17.3850,longitude:78.4867,timezone:TZ};
const GIRL={date:'2007-01-21',time:'08:31',latitude:18.9891,longitude:75.7601,timezone:TZ};
function show(tag,B){
 const r=A.calculateBirthChart(B);
 const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
 const L=r.lagna,m=pl.find(p=>p.name==='Moon');
 console.log('===== '+tag+'  LAGNA '+L.signName+'('+L.signNumber+') '+L.degreeInSign.toFixed(2)+' '+L.nakshatra);
 pl.forEach(p=>console.log('  ',p.name,p.signName,p.signNumber,p.degreeInSign.toFixed(2),'H'+(((p.signNumber-L.signNumber+12)%12)+1),p.nakshatra,'pada'+(p.nakshatraPada||p.pada||''),p.dignity,(p.retrograde?'R':''),(p.isCombust?'CMB':'')));
 console.log('   MOON',m.signName,m.signNumber,m.degreeInSign.toFixed(2),m.nakshatra,'pada',(m.nakshatraPada||m.pada));
 // manglik by hand: Mars house from Lagna, Moon, Venus
 const ma=pl.find(p=>p.name==='Mars'), ve=pl.find(p=>p.name==='Venus');
 const hFrom=(a,b)=>((a-b+12)%12)+1;
 console.log('   MANGLIK: fromLagna H'+hFrom(ma.signNumber,L.signNumber),'fromMoon H'+hFrom(ma.signNumber,m.signNumber),'fromVenus H'+hFrom(ma.signNumber,ve.signNumber));
 // D9
 const d9=A.calculateDivisionalChart(9,pl.map(p=>({name:p.name,signNumber:p.signNumber,degreeInSign:p.degreeInSign})),L.signNumber,L.degreeInSign);
 console.log('   D9 lagna',d9.lagnaSign.name,d9.lagnaSign.number);
 d9.planets.forEach(p=>console.log('      D9',p.planet,p.vargaSignName,'H'+(((p.vargaSignNumber-d9.lagnaSign.number+12)%12)+1)));
 return {r,pl,L,m};
}
// sensitivity
[-15,0,15].forEach(off=>{
 [['BOY',BOY],['GIRL',GIRL]].forEach(([t,B])=>{
  const [h,mi]=B.time.split(':').map(Number);let tot=h*60+mi+off;
  const b2={...B,time:String(Math.floor(tot/60)).padStart(2,'0')+':'+String(tot%60).padStart(2,'0')};
  const r=A.calculateBirthChart(b2);const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
  const mo=pl.find(p=>p.name==='Moon');
  console.log('SENS',t,off+'min',b2.time,'lagna',r.lagna.signName,r.lagna.degreeInSign.toFixed(2),'| Moon',mo.signName,mo.nakshatra,'pada'+(mo.nakshatraPada||mo.pada));
 });});
console.log('');
const Bo=show('BOY Kartik 27 Apr 2001 19:15 Hyderabad',BOY);
const Gi=show('GIRL Gouri 21 Jan 2007 08:31 Beed',GIRL);

console.log('\n=== MILAN (engine) ===');
try{
 const mil=A.calculateAshtakootMilan(
   {nakshatra:Bo.m.nakshatra,nakshatraPada:(Bo.m.nakshatraPada||Bo.m.pada),moonSign:Bo.m.signName,moonSignNumber:Bo.m.signNumber},
   {nakshatra:Gi.m.nakshatra,nakshatraPada:(Gi.m.nakshatraPada||Gi.m.pada),moonSign:Gi.m.signName,moonSignNumber:Gi.m.signNumber});
 console.log(JSON.stringify(mil,null,1));
}catch(e){console.log('milan err',e.message);}

// Bhakoot by hand (engine has a known off-by-one)
const b=Bo.m.signNumber,g=Gi.m.signNumber;
const fwd=((g-b+12)%12)+1, rev=((b-g+12)%12)+1;
console.log('\nBHAKOOT by hand: boyMoonSign',b,'girlMoonSign',g,'| girl from boy =',fwd,'| boy from girl =',rev);
console.log('  dosha pairs are 6/8, 9/5, 2/12 =>', [[6,8],[9,5],[2,12]].some(([p,q])=>(fwd===p&&rev===q)||(fwd===q&&rev===p))?'BHAKOOT DOSHA':'no bhakoot dosha');

console.log('\n=== DASHA ===');
[['BOY',Bo,'2001-04-27T19:15:00+05:30'],['GIRL',Gi,'2007-01-21T08:31:00+05:30']].forEach(([t,X,iso])=>{
 let nak=X.m.nakshatra; if(nak==='Mula')nak='Moola';
 const d=A.calculateVimshottariDasha(new Date(iso),nak,(X.m.longitude%13.3333333),3);
 const T=new Date('2026-08-03');
 const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
 console.log('--- '+t+' MD '+md.planet+' '+(''+md.startDate).slice(0,10)+' → '+(''+md.endDate).slice(0,10));
 md.subPeriods.forEach(p=>{if(new Date(p.endDate)>new Date('2026-01-01')&&new Date(p.startDate)<new Date('2031-01-01'))console.log('    AD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10));});
 const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
 console.log('    CUR AD',ad.planet);
 (ad.subPeriods||[]).forEach(p=>console.log('       PD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));
 const ni=d.mahaDashas.indexOf(md)+1;
 if(d.mahaDashas[ni]){const n=d.mahaDashas[ni];console.log('    NEXT MD',n.planet,(''+n.startDate).slice(0,10),'→',(''+n.endDate).slice(0,10));
  n.subPeriods.slice(0,4).forEach(p=>console.log('       nAD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10)));}
});
