const A=require('./index.js');
const POK={latitude:28.2096,longitude:83.9856,timezone:'Asia/Kathmandu',date:'1996-08-04'};
const f=t=>{const r=A.calculateBirthChart({...POK,time:t});
 const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
 return {lag:r.lagna,moon:pl.find(p=>p.name==='Moon')};};
const hm=m=>String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
console.log('minute-by-minute around the stated 22:30');
for(let m=22*60+0;m<=22*60+45;m+=3){const t=hm(m);const {lag,moon}=f(t);
 console.log('  '+t,'lagna',lag.signName.padEnd(8),lag.degreeInSign.toFixed(2).padStart(6),lag.nakshatra.padEnd(16),'| Moon',moon.signName.padEnd(8),moon.degreeInSign.toFixed(3).padStart(6),moon.nakshatra);}
// exact boundary hunts
const scanLag=()=>{for(let m=22*60;m<=22*60+45;m++){if(f(hm(m)).lag.signName==='Aries')return hm(m);}};
const scanMoon=()=>{for(let m=0;m<=23*60+59;m++){if(f(hm(m)).moon.signName==='Aries')return hm(m);}};
console.log('\n  lagna enters Aries at ~'+scanLag());
console.log('  Moon  enters Aries at ~'+scanMoon());
