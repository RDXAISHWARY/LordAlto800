import {decodeSupportedPids, parsePidResponse} from '../core/pids.js';
/** Read-only ELM327-style adapter service. It has no write/coding/clear-DTC API. */
export class ObdTransport {
  constructor(){this.device=null;this.state='DISCONNECTED';this.log=[];}
  async scan(){ if(!navigator.bluetooth) throw new Error('Web Bluetooth is unavailable in this browser. Use Demo Mode or a supported desktop wrapper.'); this.state='SCANNING'; const device=await navigator.bluetooth.requestDevice({acceptAllDevices:true,optionalServices:[0xfff0]}); return [{id:device.id,name:device.name||'Bluetooth OBD adapter',device}]; }
  async connect(adapter){ this.state='CONNECTING'; this.device=adapter.device; /* GATT framing varies by adapter; platform wrappers can implement this transport. */ throw new Error('Bluetooth adapter selected. This web build requires a platform Bluetooth serial bridge for ELM327 communication.'); }
  parse(pid,raw){return parsePidResponse(pid,raw)}
  supported(raw,base){return decodeSupportedPids(raw,base)}
}
