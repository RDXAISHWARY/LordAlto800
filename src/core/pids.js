export const PID_CATALOG = [
  ['rpm',0x0c,'RPM','rpm','fast',0,8000, b => ((b[0]*256)+b[1])/4],
  ['speed',0x0d,'Vehicle speed','km/h','fast',0,255, b => b[0]],
  ['coolant',0x05,'Coolant temperature','°C','normal',-40,215, b => b[0]-40],
  ['load',0x04,'Calculated engine load','%','normal',0,100, b => b[0]*100/255],
  ['throttle',0x11,'Throttle position','%','normal',0,100, b => b[0]*100/255],
  ['intakeTemp',0x0f,'Intake air temperature','°C','slow',-40,215, b => b[0]-40],
  ['runtime',0x1f,'Engine runtime','s','slow',0,65535, b => b[0]*256+b[1]],
  ['stft',0x06,'Short-term fuel trim','%','slow',-100,99.2, b => (b[0]-128)*100/128],
  ['ltft',0x07,'Long-term fuel trim','%','slow',-100,99.2, b => (b[0]-128)*100/128],
  ['maf',0x10,'Mass air flow','g/s','normal',0,655.35, b => (b[0]*256+b[1])/100],
  ['map',0x0b,'Intake manifold pressure','kPa','slow',0,255, b => b[0]],
  ['fuelLevel',0x2f,'Fuel level','%','slow',0,100, b => b[0]*100/255],
  ['voltage',0x42,'ECU/OBD voltage','V','slow',0,65.535, b => (b[0]*256+b[1])/1000]
].map(([id,pid,name,units,interval,min,max,formula]) => ({id,mode:1,pid,name,formula,units,interval,min,max}));

export function parsePidResponse(pid, raw) {
  const cleaned = raw.replace(/\s/g, '').toUpperCase();
  const prefix = `41${pid.pid.toString(16).padStart(2,'0').toUpperCase()}`;
  if (!cleaned.startsWith(prefix) || /[^0-9A-F]/.test(cleaned)) throw new Error('Malformed or unexpected OBD response');
  const hex = cleaned.slice(prefix.length); if (hex.length < 2 || hex.length % 2 || (pid.id === 'rpm' && hex.length < 4)) throw new Error('Incomplete OBD response');
  const bytes = hex.match(/../g).map(v => parseInt(v,16)); return pid.formula(bytes);
}

export function decodeSupportedPids(raw, base = 0) {
  const hex = raw.replace(/\s/g,'').toUpperCase(); if (!hex.startsWith('4100') || hex.length < 12) throw new Error('Invalid supported PID response');
  const bits = parseInt(hex.slice(4,12),16).toString(2).padStart(32,'0');
  return [...bits].flatMap((bit,index) => bit === '1' ? [base + index + 1] : []);
}
