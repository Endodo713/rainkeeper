export function createInput(canvas){
 const held=new Set(),input={keys:{up:false,down:false,left:false,right:false},pointer:null,lightning:false,pressed:{enter:false,restart:false,pause:false,mute:false,any:false}};
 const sync=()=>{for(const [name,keys] of Object.entries({up:['arrowup','w'],down:['arrowdown','s'],left:['arrowleft','a'],right:['arrowright','d']}))input.keys[name]=keys.some(k=>held.has(k));};
 window.addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(k.startsWith('arrow')||e.code==='Space')e.preventDefault();held.add(k);sync();if(e.repeat)return;input.pressed.any=true;if(e.code==='Space')input.lightning=true;const action={enter:'enter',r:'restart',p:'pause',escape:'pause',m:'mute'}[k];if(action)input.pressed[action]=true;});
 window.addEventListener('keyup',e=>{held.delete(e.key.toLowerCase());sync();});
 window.addEventListener('blur',()=>{held.clear();sync();input.clearPressed();});
 canvas.addEventListener('pointermove',e=>{const b=canvas.getBoundingClientRect();input.pointer={x:(e.clientX-b.left)*canvas.width/b.width,y:(e.clientY-b.top)*canvas.height/b.height};});
 canvas.addEventListener('pointerleave',()=>{input.pointer=null;});canvas.addEventListener('click',()=>{input.pressed.any=true;});
 input.clearPressed=()=>{input.lightning=false;for(const key in input.pressed)input.pressed[key]=false;};input.consume=input.clearPressed;return input;
}
