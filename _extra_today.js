const A=require('./index.js');
const P=[
 {id:'s505',name:'Saugatraj',date:'1996-08-23',time:'08:00',lat:26.6603,lon:87.7000,tz:'Asia/Kathmandu'},
 {id:'s509',name:'Lila',     date:'1995-09-13',time:'23:30',lat:26.9800,lon:84.8500,tz:'Asia/Kolkata'},
 {id:'s510',name:'Rita',     date:'2000-03-27',time:'08:55',lat:28.2096,lon:83.9856,tz:'Asia/Kathmandu'},
 {id:'s503',name:'Naina',    date:'1993-01-02',time:'14:45',lat:27.6667,lon:85.3167,tz:'Asia/Kathmandu'},
 {id:'s512',name:'Pitambar', date:'1999-03-31',time:'08:55',lat:27.3500,lon:87.6667,tz:'Asia/Kathmandu'},
 {id:'s513',name:'Rakesh',   date:'1989-04-17',time:'03:25',lat:28.6000,lon:81.6333,tz:'Asia/Kathmandu'},
 {id:'s514',name:'Thaneshwor',date:'1989-08-20',time:'02:10',lat:28.0700,lon:83.2500,tz:'Asia/Kathmandu'},
 {id:'s515',name:'Utsav',    date:'1999-02-15',time:'22:41',lat:27.7172,lon:85.3240,tz:'Asia/Kathmandu'},
 {id:'s516',name:'Tara',     date:'1990-11-16',time:'15:15',lat:27.1728,lon:87.0497,tz:'Asia/Kathmandu'},
];
const short=o=>JSON.stringify(o);
for(const b of P){
 const r=A.calculateBirthChart({date:b.date,time:b.time,latitude:b.lat,longitude:b.lon,timezone:b.tz});
 const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
 const L=r.lagna;
 console.log('\n===== '+b.id+' '+b.name+' =====');
 try{const mg=A.analyzeManglik(r);console.log(' MANGLIK:',short(mg).slice(0,400));}catch(e){console.log(' manglik err',e.message);}
 try{const gm=A.analyzeGandaMoola(r);console.log(' GANDAMOOLA:',short(gm).slice(0,300));}catch(e){}
 try{const ks=A.analyzeKaalSarp(r);console.log(' KAALSARP:',short(ks).slice(0,250));}catch(e){}
 try{const y=A.detectYogas(r);const list=(y.yogas||y||[]);console.log(' YOGAS:',(Array.isArray(list)?list:[]).map(x=>x.name||x).slice(0,14).join(' | '));}catch(e){console.log(' yoga err',e.message);}
 try{const ss=A.calculateSadeSatiPeriod(r);console.log(' SADESATI:',short(ss).slice(0,320));}catch(e){}
 // D7 children
 try{const d7=A.calculateDivisionalChart(7,pl.map(p=>({name:p.name,signNumber:p.signNumber,degreeInSign:p.degreeInSign})),L.signNumber,L.degreeInSign);
   console.log(' D7 lagna',d7.lagnaSign.name,'|',d7.planets.map(p=>p.planet.slice(0,2)+':H'+(((p.vargaSignNumber-d7.lagnaSign.number+12)%12)+1)).join(' '));}catch(e){}
 // D10 career
 try{const d10=A.calculateDivisionalChart(10,pl.map(p=>({name:p.name,signNumber:p.signNumber,degreeInSign:p.degreeInSign})),L.signNumber,L.degreeInSign);
   console.log(' D10 lagna',d10.lagnaSign.name,'|',d10.planets.map(p=>p.planet.slice(0,2)+':H'+(((p.vargaSignNumber-d10.lagnaSign.number+12)%12)+1)).join(' '));}catch(e){}
}
