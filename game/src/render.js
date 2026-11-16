import {WIDTH,HEIGHT,COLORS as C,WATER_MAX} from './config.js';
import {makeRng} from './random.js';
export function draw(ctx,w,screen='play'){
 const rect=(x,y,a,b,color)=>{ctx.fillStyle=color;ctx.fillRect(x,y,a,b);};
 const text=(s,x,y,size=22,color=C.cream)=>{ctx.fillStyle=color;ctx.font=`600 ${size}px system-ui`;ctx.fillText(s,x,y);};
 const circle=(x,y,r,color)=>{ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();};
 const cloud=(x,y,color,scale=1)=>{for(const [dx,dy,r] of [[-32,0,29],[0,-14,38],[34,0,28],[0,10,34]])circle(x+dx*scale,y+dy*scale,r*scale,color);};
 const rain=(x,y,width)=>{ctx.strokeStyle=C.rain;ctx.lineWidth=2;for(let i=0;i<17;i++){const dx=((i*37)%width)-width/2,dy=(i*19+w.time*110)%75;ctx.beginPath();ctx.moveTo(x+dx,y+20+dy);ctx.lineTo(x+dx-5,y+32+dy);ctx.stroke();}};
 rect(0,0,WIDTH,HEIGHT,C.earth);circle(1160,155,48,C.sun);
 ctx.strokeStyle=C.grid;ctx.lineWidth=1;for(let x=0;x<WIDTH;x+=64){ctx.beginPath();ctx.moveTo(x,110);ctx.lineTo(x,HEIGHT);ctx.stroke();}for(let y=110;y<HEIGHT;y+=64){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(WIDTH,y);ctx.stroke();}
 const scenery=makeRng((Number(w.seed)>>>0)+917);
 for(let i=0;i<10;i++){const x=scenery.range(35,1245),y=scenery.range(150,640);if(i<6){rect(x-4,y,8,25,C.earthDark);circle(x,y-8,19,C.crop);circle(x-12,y-3,12,C.sprout);circle(x+11,y-6,13,C.crop);}else{circle(x,y,12,'#777c79');circle(x-6,y-4,7,'#a1a39a');}}
 for(const f of w.fields){ctx.fillStyle=C.earthDark;ctx.beginPath();ctx.roundRect(f.x-27,f.y-23,54,46,9);ctx.fill();
  if(f.stage===0){ctx.strokeStyle=C.earth;ctx.lineWidth=2;for(let j=-12;j<=12;j+=12){ctx.beginPath();ctx.moveTo(f.x-21,f.y+j);ctx.lineTo(f.x+21,f.y+j-4);ctx.stroke();}for(const [x,y] of [[-15,-9],[6,-13],[-4,6],[17,12]])circle(f.x+x,f.y+y,2.5,C.sprout);}
  else for(let i=0;i<6;i++){const x=f.x-17+(i%3)*17,y=f.y-10+Math.floor(i/3)*21;rect(x-2,y-8,4,19,C.crop);circle(x-5,y-4,f.stage===2?8:6,f.stage===2?C.ripe:C.sprout);circle(x+5,y-9,f.stage===2?8:6,f.stage===2?C.ripe:C.sprout);}
  if(f.wet>0){ctx.strokeStyle=C.rain;ctx.beginPath();ctx.arc(f.x,f.y,34,0,Math.PI*2);ctx.stroke();}}
 for(const h of w.houses){rect(h.x-20,h.y-12,40,35,C.house);ctx.fillStyle=C.roof;ctx.beginPath();ctx.moveTo(h.x-28,h.y-10);ctx.lineTo(h.x,h.y-35);ctx.lineTo(h.x+28,h.y-10);ctx.fill();rect(h.x-5,h.y+5,10,18,C.ink);rect(h.x-26,h.y-48,52,7,C.ink);rect(h.x-26,h.y-48,52*Math.min(1,h.flood/100),7,C.danger);}
 for(const s of w.storms){rain(s.x,s.y,75);cloud(s.x,s.y,C.storm,.8);}
 circle(w.cloud.x,w.cloud.y+40,66,'#805e4266');if(w.water>0)rain(w.cloud.x,w.cloud.y,145);cloud(w.cloud.x,w.cloud.y,C.cloud,1.2);
 rect(0,0,WIDTH,76,C.ink);text(`DAY ${w.day}/5`,25,34);text(`SCORE ${w.score}`,180,34);text(`HARVEST ${w.dayHarvested}/${w.quota}`,390,34);text('♥'.repeat(Math.max(0,w.lives)),660,35,28,C.danger);text(`ϟ ${w.lightning}`,810,35,28,C.sun);text('WATER',925,32,18);rect(1010,16,235,20,C.earthDark);rect(1010,16,235*w.water/WATER_MAX,20,C.rain);
 text("WIN: meet each day's quota, finish Day 5 — LOSE: 3 floods",25,64,18);rect(0,HEIGHT-45,WIDTH,45,C.ink);text('Mouse / arrows: move cloud — SPACE: lightning — P: pause — R: restart — M: mute',28,HEIGHT-16,20);
 if(screen==='play')return;rect(0,0,WIDTH,HEIGHT,'#171f24d9');ctx.textAlign='center';
 if(screen==='title'){text('RAINKEEPER',640,205,78,C.sun);text('Water the valley, spare the village.',640,258,28);text('Guide your cloud over thirsty fields.',640,330);text('Grow seeds → sprouts → ripe crops → harvest.',640,369);text('Spare houses. Strike storms with SPACE.',640,408);text('Click or press Enter to start',640,490,30,C.sun);text(`BEST SCORE ${w.best||0}`,640,548);}
 else if(screen==='pause'){text('PAUSED',640,230,64,C.sun);text('Mouse / arrows / WASD: move cloud',640,320);text('SPACE: lightning · R: restart · M: mute',640,365);text('P to resume',640,455,30);}
 else{const win=screen==='win';text(win?'THE VALLEY BLOOMS':w.reason==='flooded'?'THE VILLAGE FLOODED':'THE VALLEY DRIED UP',640,260,48,win?C.sprout:C.danger);text(`Final score: ${w.score}`,640,345,32);text(`Total harvested: ${w.harvested} · Days: ${w.day}`,640,399,26);text('Press R to play again',640,490,30,C.sun);}ctx.textAlign='left';
}
