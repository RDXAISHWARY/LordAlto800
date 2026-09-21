export class TripTracker {
  constructor(){ this.reset(); }
  reset(){ this.active=false; this.startedAt=null; this.lastAt=null; this.distanceKm=0; this.fuelLitres=0; this.samples=[]; this.interruptions=0; }
  start(at=Date.now()){ this.reset(); this.active=true; this.startedAt=at; this.lastAt=at; }
  add(sample){ if(!this.active) return; const deltaH=Math.max(0,(sample.timestamp-this.lastAt)/3600000); this.distanceKm += (sample.speed||0)*deltaH; if(sample.fuelRateLph) this.fuelLitres += sample.fuelRateLph*deltaH; this.samples.push(sample); this.lastAt=sample.timestamp; }
  stop(at=Date.now()){ this.active=false; return this.summary(at); }
  summary(at=Date.now()){ const avg=k=>{const v=this.samples.map(s=>s[k]).filter(Number.isFinite);return v.length?v.reduce((a,b)=>a+b,0)/v.length:null}; const max=k=>Math.max(0,...this.samples.map(s=>s[k]).filter(Number.isFinite)); return {startedAt:this.startedAt,endedAt:at,distanceKm:this.distanceKm,drivingSeconds:this.startedAt?(at-this.startedAt)/1000:0,averageSpeed:avg('speed'),maxSpeed:max('speed'),maxRpm:max('rpm'),averageRpm:avg('rpm'),averageCoolant:avg('coolant'),maxCoolant:max('coolant'),averageThrottle:avg('throttle'),averageLoad:avg('load'),fuelLitres:this.fuelLitres||null,economy:this.fuelLitres?this.distanceKm/this.fuelLitres:null,interruptions:this.interruptions}; }
}
