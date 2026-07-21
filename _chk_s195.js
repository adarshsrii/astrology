const A=require('./index.js');
const LAT=29.2600, LON=80.4800, TZ='Asia/Kathmandu';
// sunrise on both candidate dates
['1986-03-05','1986-03-06'].forEach(d=>{
  try{const sr=A.calculateSunriseSunset(new Date(d+'T00:00:00+05:45'),LAT,LON,TZ);
  console.log('SUNRISE',d,JSON.stringify(sr));}catch(e){console.log('sr err',d,e.message);}
});
const cands=[
 ['A  05Mar 00:03','1986-03-05','00:03'],
 ['B  06Mar 00:03','1986-03-06','00:03'],
 ['C  05Mar sunrise~06:36','1986-03-05','06:36'],
 ['D  06Mar sunrise~06:35','1986-03-06','06:35'],
];
cands.forEach(([lbl,date,time])=>{
 const res=A.calculateBirthChart({date,time,latitude:LAT,longitude:LON,timezone:TZ});
 const pl=Array.isArray(res.planets)?res.planets:Object.values(res.planets);
 const m=pl.find(p=>p.name==='Moon');
 console.log(lbl,'| LAGNA',res.lagna.signName,res.lagna.degreeInSign.toFixed(1),'| MOON',m.signName,m.degreeInSign.toFixed(1),m.nakshatra);
});
