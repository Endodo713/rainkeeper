import {WIDTH,HEIGHT} from './config.js';
import {createWorld,step,EVENTS} from './world.js';
import {draw} from './render.js';
import {createInput} from './input.js';
import {createAudio} from './audio.js';
import {stageShot} from './shots.js';
const canvas=document.querySelector('canvas');canvas.width=WIDTH;canvas.height=HEIGHT;
const ctx=canvas.getContext('2d'),params=new URLSearchParams(location.search),seed=Number(params.get('seed')??1),shot=params.get('shot');
let world=createWorld(seed),screen='title',best=0,last=0,accumulator=0;
try{best=Number(localStorage.getItem('rainkeeper-best'))||0;}catch{}
world.best=best;
const input=createInput(canvas),audio=createAudio();
const save=()=>{best=Math.max(best,world.score);world.best=best;try{localStorage.setItem('rainkeeper-best',String(best));}catch{}};
const restart=()=>{save();world=createWorld(seed);world.best=best;screen='play';accumulator=0;audio.click();};
if(shot){screen=stageShot(shot,world).screen;draw(ctx,world,screen);}else requestAnimationFrame(frame);
function frame(now){const elapsed=Math.min(.2,(now-last)/1000||0);last=now;
 if(input.pressed.mute)audio.toggleMute();
 if(screen==='title'){if(input.pressed.enter||input.pressed.any)restart();}
 else if(input.pressed.restart||((screen==='win'||screen==='lose')&&input.pressed.enter))restart();
 else if(input.pressed.pause){if(screen==='play')screen='pause';else if(screen==='pause')screen='play';}
 if(screen==='play'){accumulator+=elapsed;let lightning=input.lightning;while(accumulator>=1/60&&screen==='play'){step(world,1/60,{...input,lightning});lightning=false;accumulator-=1/60;for(const event of world.events){if(event===EVENTS.lightning)audio.thunder();else if(typeof audio[event]==='function')audio[event]();}if(world.status!=='playing'){screen=world.status;save();}}}else accumulator=0;
 audio.rain(screen==='play'&&world.water>0);draw(ctx,world,screen);input.clearPressed();requestAnimationFrame(frame);
}
