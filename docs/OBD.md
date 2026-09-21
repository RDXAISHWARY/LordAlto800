# Read-only OBD implementation

`src/core/pids.js` defines standard Mode 01 PIDs as data: identifier, mode, number, display name, unit, bounds, update tier, and decoding formula. `parsePidResponse` accepts only the expected `41 <PID>` response and rejects malformed/incomplete payloads. `decodeSupportedPids` decodes Mode 01 PID bitmaps; a completed transport must query each advertised range and enable a parameter only after support is confirmed.

The current browser transport may open the native Bluetooth chooser but does not pretend to have a universal serial implementation. ELM327 GATT/serial framing differs between platforms. A platform-specific transport should initialize its adapter, use automatic protocol detection (not protocol forcing), request only Mode 01 readings plus read-only DTC modes 03, 07, and 0A, preserve raw request/response debug logs, timeout safely, and reconnect after loss.

There is **no write command interface**. Do not add Mode 04 (clear DTCs), configuration writes, CAN transmission, coding, flashing, or adaptations. The demo adapter implements the same read-side telemetry shape but has a separate, explicit `DEMO` mode.
