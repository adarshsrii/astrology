const A=require('./index.js');
const POK={latitude:28.2096,longitude:83.9856,timezone:'Asia/Kathmandu'};
function show(tag,date,time){
 const r=A.calculateBirthChart({...POK,date,time});
 const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
 const L=r.lagna,m=pl.find(p=>p.name==='Moon');
 console.log('\n===== '+tag+'  '+date+' '+time);
 console.log('  LAGNA '+L.signName+' '+L.degreeInSign.toFixed(2)+'  '+L.nakshatra);
 console.log('  MOON  '+m.signName+' '+m.degreeInSign.toFixed(2)+'  '+m.nakshatra+' pada'+(m.nakshatraPada||m.pada));
 pl.forEach(p=>console.log('   ',p.name.padEnd(8),p.signName.padEnd(11),p.degreeInSign.toFixed(2).padStart(6),'H'+(((p.signNumber-L.signNumber+12)%12)+1),p.nakshatra.padEnd(15),p.dignity,(p.retrograde?'R':''),(p.isCombust?'CMB':'')));
 return {r,pl,L,m};
}
// sensitivity on the stated time
[-10,0,10].forEach(off=>{
 let tot=22*60+30+off;
 const tt=String(Math.floor(tot/60)).padStart(2,'0')+':'+String(tot%60).padStart(2,'0');
 const r=A.calculateBirthChart({...POK,date:'1996-08-04',time:tt});
 const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
 const mo=pl.find(p=>p.name==='Moon');
 console.log('SENS',off+'min',tt,'lagna',r.lagna.signName,r.lagna.degreeInSign.toFixed(2),'| Moon',mo.signName,mo.nakshatra);
});
const C=show('CORRECT (4 Aug 1996, Sunday)','1996-08-04','22:30');
const W=show('IF APP READ 04/08 AS 8 APRIL','1996-04-08','22:30');

// dasha on the correct one
let nak=C.m.nakshatra; if(nak==='Mula')nak='Moola';
const d=A.calculateVimshottariDasha(new Date('1996-08-04T22:30:00+05:45'),nak,(C.m.longitude%13.3333333),3);
const T=new Date('2026-08-06');
const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
console.log('\nDASHA (correct chart)  MD',md.planet,(''+md.startDate).slice(0,10),'->',(''+md.endDate).slice(0,10),'| AD',ad.planet,(''+ad.startDate).slice(0,10),'->',(''+ad.endDate).slice(0,10));
console.log('\nHOUSES (correct)');
for(let i=0;i<12;i++){const sn=((C.L.signNumber-1+i)%12)+1;
 console.log('  H'+(i+1),sn,C.pl.filter(p=>p.signNumber===sn).map(p=>p.name).join(','));}
