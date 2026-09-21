import test from 'node:test'; import assert from 'node:assert/strict';
import {PID_CATALOG,parsePidResponse,decodeSupportedPids} from '../src/core/pids.js';
import {economyKmPerL,fuelRateFromMaf} from '../src/core/fuel.js'; import {TripTracker} from '../src/core/trip.js';
const pid=id=>PID_CATALOG.find(p=>p.id===id);
test('parses standard RPM, speed, and coolant PID formulas',()=>{assert.equal(parsePidResponse(pid('rpm'),'41 0C 1A F8'),1726);assert.equal(parsePidResponse(pid('speed'),'41 0D 42'),66);assert.equal(parsePidResponse(pid('coolant'),'41 05 80'),88)});
test('rejects invalid PID responses',()=>assert.throws(()=>parsePidResponse(pid('rpm'),'41 0D 42')));
test('decodes supported PID bitmap',()=>{const ids=decodeSupportedPids('41 00 FF 00 00 01');assert.deepEqual(ids.slice(0,8),[1,2,3,4,5,6,7,8]);assert(ids.includes(32));});
test('fuel economy protects division by zero',()=>{assert.equal(economyKmPerL(0,2),null);assert.equal(economyKmPerL(60,0),null);assert.equal(economyKmPerL(60,3),20);assert(fuelRateFromMaf(10)>0);});
test('trip integrates distance and fuel data',()=>{const t=new TripTracker();t.start(0);t.add({timestamp:3600000,speed:60,rpm:2000,coolant:88,fuelRateLph:3});const s=t.stop(3600000);assert.equal(s.distanceKm,60);assert.equal(s.fuelLitres,3);assert.equal(s.economy,20);});
