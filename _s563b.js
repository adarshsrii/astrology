const A=require('./index.js');
const B={date:'1979-05-05',time:'09:45',latitude:27.8667,longitude:84.9167,timezone:'Asia/Kathmandu'};
const r=A.calculateBirthChart(B);
[4,9].forEach(n=>{try{const dv=A.calculateDivisionalChart(n,r);const dl=dv.lagna||dv.ascendant;
 console.log('D'+n,'lagna',dl&&(dl.signName||dl.sign));
 const dp=dv.planets?(Array.isArray(dv.planets)?dv.planets:Object.values(dv.planets)):[];
 dp.forEach(p=>console.log('   ',p.name,p.signName||p.sign));}catch(e){console.log('D'+n,'ERR',e.message);}});
// transits now + monthly for 24 months
const KTM={latitude:27.7172,longitude:85.3240,timezone:'Asia/Kathmandu'};
function tr(dstr){const q=A.calculateBirthChart({...KTM,date:dstr,time:'12:00'});
 const qp=Array.isArray(q.planets)?q.planets:Object.values(q.planets);
 const g=n=>{const p=qp.find(x=>x.name===n);return p.signName+' '+p.degreeInSign.toFixed(1)+(p.retrograde?'R':'');};
 return dstr+'  Sa '+g('Saturn').padEnd(18)+' Ju '+g('Jupiter').padEnd(18)+' Ra '+g('Rahu');}
console.log('\nTRANSITS (Gemini lagna: Virgo=4th, Leo=3rd, Pisces=10th, Aries=11th)');
for(let y=2026;y<=2028;y++)for(let mo=1;mo<=12;mo+=1){const d=y+'-'+String(mo).padStart(2,'0')+'-01';
 if(new Date(d)<new Date('2026-07-01')||new Date(d)>new Date('2028-12-31'))continue;console.log(tr(d));}
