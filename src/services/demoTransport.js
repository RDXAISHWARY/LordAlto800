import {PID_CATALOG} from '../core/pids.js';
export const DEMO_MODES=['IDLE','CITY','ACCELERATION','CRUISING','DECELERATION'];
export class DemoTransport {
  constructor(){this.mode='CITY';this.t=0;this.connected=false;}
  async scan(){return [{id:'demo-alto',name:'Demo Alto 800 adapter',kind:'simulator'}];}
  async connect(){this.connected=true;return {adapter:'Demo Alto 800 adapter',protocol:'SIMULATED OBD-II',supportedPids:PID_CATALOG.map(p=>p.pid)};}
  disconnect(){this.connected=false;}
  tick(){this.t+=.25; const wave=Math.sin(this.t); const modes={IDLE:[850,0,3],CITY:[1950,36,22],ACCELERATION:[4100,68,72],CRUISING:[2700,62,28],DECELERATION:[1500,40,5]}; const [rpm,speed,throttle]=modes[this.mode]; const v=x=>x+(wave*0.5+Math.sin(this.t*2)*.5); const maf=Math.max(1, rpm/520+(throttle/15)); return {timestamp:Date.now(),rpm:Math.round(v(rpm)),speed:Math.max(0,v(speed)),coolant:Math.min(91,v(84+this.t/100)),load:Math.max(3,v(throttle*.82)),throttle:Math.max(0,v(throttle)),intakeTemp:v(30),stft:v(1.5),ltft:1.1,maf,map:Math.round(25+throttle*.7),fuelLevel:72-(this.t/6000),voltage:v(13.9),runtime:Math.floor(this.t),o2:'RESPONDING'};}
}
