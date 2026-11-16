import {reset,step} from './world.js';
import {RAIN_RADIUS} from './config.js';
export function stageShot(name,world){
 reset(world,world.seed);
 if(!['play','win','lose'].includes(name)){world.best=0;return {screen:'title',best:0};}
 let target=null,previousStage=0,previousHarvest=0;
 const careless=name==='lose',limit=name==='play'?780:30000;
 for(let i=0;i<limit&&world.status==='playing';i++){
  if(target&&((target.stage===0&&previousStage>0)||world.harvested>previousHarvest))target=null;
  if(!target){target=[...world.fields].sort((a,b)=>b.stage-a.stage||b.dry-a.dry)[0];}
  let pointer={x:target.x,y:target.y},lightning=false;
  if(careless)pointer={x:world.houses[0].x,y:world.houses[0].y};
  else{
   for(const h of world.houses){const dx=pointer.x-h.x,dy=pointer.y-h.y,d=Math.hypot(dx,dy);if(d<RAIN_RADIUS+8){pointer={x:h.x+(dx||1)/(d||1)*(RAIN_RADIUS+10),y:h.y+dy/(d||1)*(RAIN_RADIUS+10)};}}
   lightning=world.lightning>0&&world.storms.some(s=>Math.hypot(world.cloud.x-s.x,world.cloud.y-s.y)<250&&world.houses.some(h=>Math.hypot(s.x-h.x,s.y-h.y)<120));
  }
  previousStage=target.stage;previousHarvest=world.harvested;
  step(world,1/30,{pointer,lightning});
 }
 const screen=world.status==='win'?'win':world.status==='lose'?'lose':name==='play'?'play':'title';
 world.best=world.score;return {screen,best:world.best};
}
