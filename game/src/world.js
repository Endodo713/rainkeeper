import * as C from './config.js';
import {makeRng} from './random.js';
export const EVENTS={harvest:'harvest',flood:'flood',lightning:'lightning',win:'win',lose:'lose'};
export function createWorld(seed=1){return reset({seed,dayHarvested:0,cloud:{x:C.WIDTH/2,y:260}},seed);}
export function reset(w,seed=w.seed){const r=makeRng(seed);Object.assign(w,{seed,r,rng:r,time:0,day:1,dayTime:0,quota:C.QUOTAS[0],harvested:0,dayHarvested:0,score:0,lives:3,lightning:C.LIGHTNING_MAX,water:C.WATER_MAX,status:'playing',reason:'',events:[]});w.fields=[];w.houses=[];w.storms=[];
 for(let i=0;i<C.FIELD_COUNT;i++)w.fields.push({x:r.range(70,C.WIDTH-70),y:r.range(150,C.HEIGHT-95),stage:r()<.45?0:1,wet:0,dry:0});
 for(let i=0;i<C.HOUSE_COUNT;i++){let h;for(let tries=0;tries<20;tries++){h={x:r.range(100,C.WIDTH-100),y:r.range(170,C.HEIGHT-110),flood:0};if(w.fields.every(f=>Math.hypot(f.x-h.x,f.y-h.y)>=90))break;}w.houses.push(h);}
 for(let i=0;i<C.STORM_BASE+2;i++)w.storms.push({x:r.range(0,C.WIDTH),y:r.range(140,C.HEIGHT-130),vx:r.range(-1,1)*C.STORM_SPEED,vy:r.range(-.3,.3)*C.STORM_SPEED,rain:r.range(20,45)});return w;}
export function step(w,dt,input={}){if(w.status!=='playing')return w;w.events=[];w.time+=dt;w.dayTime+=dt;const k=input.keys||{},dx=+!!k.right-+!!k.left,dy=+!!k.down-+!!k.up;
 if(dx||dy){const n=Math.hypot(dx,dy);w.cloud.x+=dx/n*C.CLOUD_SPEED*dt;w.cloud.y+=dy/n*C.CLOUD_SPEED*dt;}else{const t=input.pointer||w.cloud;w.cloud.x+=(t.x-w.cloud.x)*Math.min(1,dt*5);w.cloud.y+=(t.y-w.cloud.y)*Math.min(1,dt*5);}w.cloud.x=Math.max(35,Math.min(C.WIDTH-35,w.cloud.x));w.cloud.y=Math.max(100,Math.min(C.HEIGHT-70,w.cloud.y));
 const raining=w.water>0;w.water=raining?Math.max(0,w.water-C.RAIN_DRAIN*dt):Math.min(C.WATER_MAX,w.water+C.WATER_REFILL*dt);
 const harvest=f=>{w.harvested++;w.dayHarvested++;w.score+=100;f.stage=0;f.wet=0;w.events.push(EVENTS.harvest);};
 for(const f of w.fields){if(raining&&Math.hypot(f.x-w.cloud.x,f.y-w.cloud.y)<C.RAIN_RADIUS){f.wet+=dt;f.dry=0;if(f.stage<2&&f.wet>C.CROP_GROW){f.stage++;f.wet=0;}else if(f.stage===2&&f.wet>.7)harvest(f);}else{f.dry+=dt;f.wet=Math.max(0,f.wet-dt);if(f.stage===2&&f.dry>C.CROP_WITHER/(1+(w.day-1)*.35)){f.stage=0;f.dry=0;}}}
 for(const h of w.houses){if(raining&&Math.hypot(h.x-w.cloud.x,h.y-w.cloud.y)<C.RAIN_RADIUS)h.flood+=dt*8;h.flood=Math.max(0,h.flood-dt*1.5);if(h.flood>=100){h.flood=0;w.lives--;w.events.push(EVENTS.flood);if(w.lives<=0){w.status='lose';w.reason='flooded';w.events.push(EVENTS.lose);}}}
 for(const s of w.storms){s.x+=s.vx*dt;s.y+=s.vy*dt;if(s.x<-80)s.x=C.WIDTH+80;if(s.x>C.WIDTH+80)s.x=-80;for(const h of w.houses)if(Math.hypot(h.x-s.x,h.y-s.y)<65)h.flood+=dt*5;}
 if(input.lightning&&w.lightning>0){w.lightning--;const near=w.storms.sort((a,b)=>Math.hypot(a.x-w.cloud.x,a.y-w.cloud.y)-Math.hypot(b.x-w.cloud.x,b.y-w.cloud.y))[0];if(near&&Math.hypot(near.x-w.cloud.x,near.y-w.cloud.y)<260)w.storms.splice(w.storms.indexOf(near),1);else{const f=w.fields.filter(f=>f.stage===2).sort((a,b)=>b.dry-a.dry)[0];if(f)harvest(f);}w.events.push(EVENTS.lightning);}
 if(w.dayHarvested>=w.quota){if(w.day>=C.DAYS){w.status='win';w.events.push(EVENTS.win);}else{w.day++;w.dayTime=0;w.dayHarvested=0;w.quota=C.QUOTAS[w.day-1];w.lightning=Math.min(C.LIGHTNING_MAX,w.lightning+1);}}else if(w.dayTime>=C.DAY_LENGTH){w.status='lose';w.reason='drought';w.events.push(EVENTS.lose);}return w;}
