const A=require('./index.js');
const LAT=-28.33,LON=153.40,TZ='Australia/Sydney';
function sign(d,name){const t=A.calculateBirthChart({date:d,time:'12:00',latitude:LAT,longitude:LON,timezone:TZ});
 const tp=Array.isArray(t.planets)?t.planets:Object.values(t.planets);const p=tp.find(x=>x.name===name);return p.signName;}
function scan(name,from,to){let prev=sign(from,name),d=new Date(from+'T00:00:00Z'),end=new Date(to+'T00:00:00Z'),out=[];
 while(d<end){d=new Date(d.getTime()+86400000*3);const ds=d.toISOString().slice(0,10);const s=sign(ds,name);
 if(s!==prev){ // binary refine by day
   let a=new Date(d.getTime()-86400000*3);
   for(let i=0;i<4;i++){a=new Date(a.getTime()+86400000);const as=a.toISOString().slice(0,10);if(sign(as,name)===s){out.push(prev+'→'+s+' '+as);break;}}
   prev=s;}}
 console.log(name,out.join(' | '));}
scan('Saturn','2026-07-01','2028-06-01');
scan('Jupiter','2026-07-01','2028-10-01');
