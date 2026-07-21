const A=require('/Users/saurabh/Work/pocket-pandit/astrology-insights/index.js');
const ABBR={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
function chart(tag,birth,utc){
  const res=A.calculateBirthChart(birth);
  const plist=Array.isArray(res.planets)?res.planets:Object.values(res.planets);
  const m=plist.find(p=>p.name==='Moon');
  console.log('====',tag,'| LAGNA',res.lagna.signName,res.lagna.nakshatra,'| MOON',m.signName,m.nakshatra);
  (res.houses||[]).forEach(h=>console.log('  H'+(h.houseNumber||h.number),h.signName||h.sign,(h.planets||[]).map(x=>x.name||x).join(',')));
  plist.forEach(p=>console.log('  P',ABBR[p.name],p.signName||p.sign,'dig='+(p.dignity||''),'retro='+!!p.retrograde));
  const d=A.calculateVimshottariDasha(new Date(utc),m.nakshatra,(m.longitude%13.3333333),2);
  console.log('  CUR',d.currentDasha.maha+'-'+d.currentDasha.antar);
  const W=new Date('2025-01-01'),X=new Date('2031-12-31');
  d.mahaDashas.forEach(p=>{const s=new Date(p.startDate),e=new Date(p.endDate);if(e<W||s>X)return;console.log('  MD',p.planet,(''+p.startDate).slice(0,10),'→',(''+p.endDate).slice(0,10));(p.subPeriods||[]).forEach(s2=>{const ss=new Date(s2.startDate),ee=new Date(s2.endDate);if(ee<W||ss>X)return;console.log('    AD',p.planet+'-'+s2.planet,(''+s2.startDate).slice(0,10),'→',(''+s2.endDate).slice(0,10));});});
  return {res,plist,m};
}
const H=chart('HARIOM',{date:'2006-02-12',time:'14:30',latitude:26.9,longitude:78.4,timezone:'Asia/Kolkata'},'2006-02-12T09:00:00Z');
const G=chart('AMRITA',{date:'2005-05-18',time:'08:30',latitude:26.22,longitude:78.18,timezone:'Asia/Kolkata'},'2005-05-18T03:00:00Z');
// guna milan: need nakshatraNumber + rashiNumber
const NAK=['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishtha','Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati'];
const SIGN={Aries:1,Taurus:2,Gemini:3,Cancer:4,Leo:5,Virgo:6,Libra:7,Scorpio:8,Sagittarius:9,Capricorn:10,Aquarius:11,Pisces:12};
function inp(o){const nn=NAK.indexOf(o.m.nakshatra)+1;return {nakshatraNumber:nn,nakshatraPada:1,rashiNumber:SIGN[o.m.signName],nakshatraLord:''};}
try{const r=A.calculateAshtakootMilan(inp(H),inp(G));console.log('MILAN total',r.totalPoints,'/',r.maxPoints,'|',r.verdict||r.recommendation||'');r.gunas.forEach(g=>console.log('  ',g.name,g.points+'/'+g.maxPoints));}catch(e){console.log('milan err',e.message);}
