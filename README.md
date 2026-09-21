# Alto 800 OBD Telemetry Dashboard

A local-first, responsive OBD-II dashboard for a **2012 Maruti Suzuki Alto 800 petrol**. It uses an original dark/amber motorsport interface—not game assets—and is deliberately **read-only**: it has no DTC clearing, coding, flashing, adaptation, CAN-write, key, or immobilizer function.

## Run

This dependency-free web build requires Python 3 and a modern browser:

```sh
npm test
npm start
# open http://localhost:4173
```

Choose **START DEMO** to exercise the complete dashboard without a vehicle. It is visibly labelled `DEMO MODE — NO VEHICLE CONNECTED` and is never substituted for live data. Demo scenarios: idle, city, acceleration, cruising, and deceleration.

## Platforms and Bluetooth

The UI works on desktop and mobile browsers. Bluetooth discovery uses the Web Bluetooth chooser where the browser supports it. A production desktop/mobile wrapper must provide a Bluetooth serial/GATT bridge appropriate to its operating system and adapter; ELM327 framing is intentionally isolated in `src/services/obdTransport.js`. The dashboard will clearly report this limitation instead of fabricating a connection.

Use a compatible, genuine Bluetooth OBD-II adapter and only with the vehicle safely parked for setup. The vehicle determines available PIDs—unsupported values must remain unavailable. The target profile is in `vehicles/alto800_2012.json`, but transports are not vehicle-specific.

## Data, trips, and economy

Trips and summaries stay in browser IndexedDB and can be exported as CSV or JSON. The dashboard integrates speed over elapsed time for distance and integrates fuel rate when calculable. Direct fuel rate is preferred if a future transport provides it. Otherwise it estimates fuel rate from MAF, stoichiometric AFR (14.7), petrol density (745 g/L), and short-term trim; resulting economy is explicitly labelled **ESTIMATED FROM MAF**. At speeds under 1 km/h it displays `-- km/L` to prevent misleading divide-by-zero results. See [fuel calculation details](docs/FUEL_ECONOMY.md).

Coolant warnings are configurable software display thresholds (defaults 105 °C warning / 115 °C critical), not official Maruti limits or a diagnosis. ECU/OBD voltage is not battery-terminal voltage. OBD data cannot provide a complete mechanical-health assessment.

## Architecture and development

* `src/core/` — PID definitions/parsing, fuel calculations, and trip math.
* `src/services/` — isolated read-only transport contracts, simulator, and IndexedDB/export storage.
* `src/main.js` / `src/styles.css` — responsive presentation and user interaction.
* `vehicles/` — portable vehicle-display profile.
* `test/` — Node automated unit tests for parsing, invalid responses, calculations, and trips.

The polling tier metadata allows fast (200 ms), normal (1 s), and slow (5 s) requests, so a full transport can schedule without overwhelming an ECU. Review [OBD implementation notes](docs/OBD.md) before adding a platform transport. No telemetry leaves the device and no server, accounts, or personal data are used.
