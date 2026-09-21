# Fuel-economy methodology

1. If a verified ECU fuel-rate PID is provided by a future adapter, use it as direct litres/hour.
2. Otherwise, only when MAF exists, calculate estimated fuel rate: `MAF g/s × (1 + STFT/100) ÷ 14.7 × 3600 ÷ 745`. The result is litres/hour using a nominal petrol density of 745 g/L.
3. Instantaneous economy is `speed km/h ÷ fuel rate L/h`. At speed below 1 km/h or missing/zero fuel rate, display `-- km/L`; do not divide by zero.
4. During a trip, distance accumulates `speed × elapsed hours`; calculable fuel accumulates `fuel rate × elapsed hours`. Trip economy is total distance divided by total estimated/direct fuel.

MAF-based results are estimates, not measurements. Variations in AFR, petrol density, fuel trims, sensor accuracy, ECU implementation, and sampling affect them. Fuel level is never inferred: it is displayed only when PID 01 2F is actually supported.
