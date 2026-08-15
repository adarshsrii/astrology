const A=require('./index.js');
const P=[
 {id:'s505',name:'Saugatraj Rai', date:'1996-08-23',time:'08:00',lat:26.6603,lon:87.7000,tz:'Asia/Kathmandu',off:'+05:45',place:'Damak, Jhapa'},
 {id:'s509',name:'Lila',          date:'1995-09-13',time:'23:30',lat:26.9800,lon:84.8500,tz:'Asia/Kolkata',  off:'+05:30',place:'Raxaul, Bihar'},
 {id:'s510',name:'Rita Gurung',   date:'2000-03-27',time:'08:55',lat:28.2096,lon:83.9856,tz:'Asia/Kathmandu',off:'+05:45',place:'Pokhara'},
 {id:'s503',name:'Naina Byanjankar',date:'1993-01-02',time:'14:45',lat:27.6667,lon:85.3167,tz:'Asia/Kathmandu',off:'+05:45',place:'Lalitpur'},
 {id:'s512',name:'Pitambar Khatiwada',date:'1999-03-31',time:'08:55',lat:27.3500,lon:87.6667,tz:'Asia/Kathmandu',off:'+05:45',place:'Taplejung'},
 {id:'s513',name:'Rakesh Giri',   date:'1989-04-17',time:'03:25',lat:28.6000,lon:81.6333,tz:'Asia/Kathmandu',off:'+05:45',place:'Surkhet'},
 {id:'s514',name:'Thaneshwor Aryal',date:'1989-08-20',time:'02:10',lat:28.0700,lon:83.2500,tz:'Asia/Kathmandu',off:'+05:45',place:'Gulmi'},
 {id:'s515',name:'Utsav Phuyal',  date:'1999-02-15',time:'22:41',lat:27.7172,lon:85.3240,tz:'Asia/Kathmandu',off:'+05:45',place:'Kathmandu'},
 {id:'s516',name:'Tara',          date:'1990-11-16',time:'15:15',lat:27.1728,lon:87.0497,tz:'Asia/Kathmandu',off:'+05:45',place:'Bhojpur'},
];
const T=new Date('2026-08-09');
const hFrom=(a,b)=>((a-b+12)%12)+1;
for(const b of P){
 const B={date:b.date,time:b.time,latitude:b.lat,longitude:b.lon,timezone:b.tz};
 const r=A.calculateBirthChart(B);
 const pl=Array.isArray(r.planets)?r.planets:Object.values(r.planets);
 const L=r.lagna,m=pl.find(p=>p.name==='Moon');
 console.log('\n'+'#'.repeat(80));
 console.log(`${b.id} ${b.name}  ${b.date} ${b.time} ${b.place}`);
 console.log('LAGNA',L.signName,'('+L.signNumber+')',L.degreeInSign.toFixed(2),'| Moon',m.signName,m.nakshatra);
 pl.forEach(p=>console.log('  ',p.name.padEnd(8),p.signName.padEnd(12),p.degreeInSign.toFixed(2).padStart(6),'H'+String(hFrom(p.signNumber,L.signNumber)).padStart(2),p.nakshatra.padEnd(14),(p.dignity||'').padEnd(12),(p.retrograde?'R ':'  ')+(p.isCombust?'CMB':'')));
 // lagna-lord + key house lords
 const LORD=['Mars','Venus','Mercury','Moon','Sun','Mercury','Venus','Mars','Jupiter','Saturn','Saturn','Jupiter'];
 [1,2,4,5,7,9,10,11].forEach(h=>{const sn=((L.signNumber-1+h-1)%12)+1;const lp=pl.find(p=>p.name===LORD[sn-1]);
   console.log(`   H${h} = ${['Ar','Ta','Ge','Cn','Le','Vi','Li','Sc','Sg','Cp','Aq','Pi'][sn-1]}, lord ${LORD[sn-1]} in H${hFrom(lp.signNumber,L.signNumber)} (${lp.signName}, ${lp.dignity})  occupants: ${pl.filter(p=>p.signNumber===sn).map(p=>p.name).join(',')||'-'}`);});
 const ma=pl.find(p=>p.name==='Mars'),ve=pl.find(p=>p.name==='Venus'),ju=pl.find(p=>p.name==='Jupiter');
 console.log('   MANGLIK fromLagna H'+hFrom(ma.signNumber,L.signNumber),'fromMoon H'+hFrom(ma.signNumber,m.signNumber),'fromVenus H'+hFrom(ma.signNumber,ve.signNumber));
 const d9=A.calculateDivisionalChart(9,pl.map(p=>({name:p.name,signNumber:p.signNumber,degreeInSign:p.degreeInSign})),L.signNumber,L.degreeInSign);
 console.log('   D9 lagna',d9.lagnaSign.name,'|',d9.planets.map(p=>p.planet.slice(0,2)+':'+p.vargaSignName.slice(0,3)+'/H'+(((p.vargaSignNumber-d9.lagnaSign.number+12)%12)+1)).join(' '));
 let nak=m.nakshatra; if(nak==='Mula')nak='Moola';
 const d=A.calculateVimshottariDasha(new Date(b.date+'T'+b.time+':00'+b.off),nak,(m.longitude%13.3333333),3);
 const md=d.mahaDashas.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
 const ad=md.subPeriods.find(p=>new Date(p.startDate)<=T&&new Date(p.endDate)>T);
 console.log('   DASHA MD',md.planet,(''+md.startDate).slice(0,10),'->',(''+md.endDate).slice(0,10),' AD',ad.planet,(''+ad.startDate).slice(0,10),'->',(''+ad.endDate).slice(0,10));
 console.log('   next ADs:',md.subPeriods.filter(p=>new Date(p.endDate)>T).slice(0,5).map(p=>p.planet+' '+(''+p.startDate).slice(0,10)).join(' | '));
 const nextMD=d.mahaDashas.find(p=>new Date(p.startDate)>T);
 if(nextMD) console.log('   next MD',nextMD.planet,(''+nextMD.startDate).slice(0,10));
}
