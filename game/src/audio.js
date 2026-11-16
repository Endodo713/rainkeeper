export function createAudio(){
 let ctx=null,bus=null,noise=null,rainSource=null,rainGain=null,wantsRain=false,failed=false;
 const api={muted:false};
 function unlock(){if(failed)return;try{if(!ctx){const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio){failed=true;return;}ctx=new Audio();bus=ctx.createGain();bus.gain.value=api.muted?0:.22;bus.connect(ctx.destination);noise=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);const data=noise.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;}ctx.resume().catch(()=>{});api.rain(wantsRain);}catch{failed=true;}}
 window.addEventListener('pointerdown',unlock);window.addEventListener('keydown',unlock);
 function tone(freq,delay=0,length=.16,type='sine'){if(!ctx||failed||api.muted)return;try{const t=ctx.currentTime+delay,o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.4,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+length);o.connect(g);g.connect(bus);o.start(t);o.stop(t+length+.02);}catch{}}
 api.rain=on=>{wantsRain=on;if(!ctx||failed)return;try{if(!rainSource){rainSource=ctx.createBufferSource();rainSource.buffer=noise;rainSource.loop=true;const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=1600;rainGain=ctx.createGain();rainGain.gain.value=0;rainSource.connect(filter);filter.connect(rainGain);rainGain.connect(bus);rainSource.start();}rainGain.gain.setTargetAtTime(on?.16:0,ctx.currentTime,.1);}catch{}};
 api.harvest=()=>{tone(660);tone(990,.1);};api.click=()=>tone(440,0,.06);
 api.thunder=()=>{if(!ctx||failed||api.muted)return;try{const s=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain();s.buffer=noise;f.type='lowpass';f.frequency.value=320;g.gain.setValueAtTime(2,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.8);s.connect(f);f.connect(g);g.connect(bus);s.start();s.stop(ctx.currentTime+.85);}catch{}};
 api.flood=()=>{tone(110,0,.5,'triangle');tone(82,.25,.6,'triangle');};api.win=()=>[262,330,392,524,660].forEach((f,i)=>tone(f,i*.14,.3));api.lose=()=>[330,294,247,165].forEach((f,i)=>tone(f,i*.2,.4));
 api.toggleMute=()=>{api.muted=!api.muted;if(bus)bus.gain.value=api.muted?0:.22;return api.muted;};return api;
}
