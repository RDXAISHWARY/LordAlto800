export function fuelRateFromMaf(mafGramsPerSecond, fuelTrim = 0) {
  if (!Number.isFinite(mafGramsPerSecond) || mafGramsPerSecond <= 0) return null;
  const afr = 14.7; const petrolDensityGPerL = 745;
  return (mafGramsPerSecond * (1 + fuelTrim / 100) / afr) * 3600 / petrolDensityGPerL;
}
export function economyKmPerL(speedKph, fuelRateLph) {
  if (!Number.isFinite(speedKph) || speedKph < 1 || !Number.isFinite(fuelRateLph) || fuelRateLph <= 0) return null;
  return speedKph / fuelRateLph;
}
export function economyFromTelemetry(values) {
  const rate = fuelRateFromMaf(values.maf, values.stft || 0); return {rateLph:rate, economy: economyKmPerL(values.speed, rate), source:rate ? 'ESTIMATED FROM MAF' : 'DATA UNAVAILABLE'};
}
