// Signed 16-bit two's-complement math. The numbers are real (specs/principles.md):
// every readout in the exhibit derives from these, so binary / decimal / hex always
// agree. `velocity` is the true horizontal velocity fed into a 16-bit register.
export const U16 = 65536;
export const INT16_MAX = 32767;
export const INT16_MIN = -32768;

/** The raw 16-bit pattern stored (velocity & 0xFFFF), always 0..65535. */
export function pattern16(velocity) {
  return ((Math.round(velocity) % U16) + U16) % U16;
}

/** The signed interpretation of that pattern: 0..32767, then wraps to -32768..-1. */
export function toSigned16(velocity) {
  const p = pattern16(velocity);
  return p >= 32768 ? p - U16 : p;
}

/** 16-char binary string, MSB first (MSB = sign bit). */
export function bits16(velocity) {
  return pattern16(velocity).toString(2).padStart(16, '0');
}

/** Hex readout, e.g. 0x7FFF, 0x8000. */
export function hex16(velocity) {
  return '0x' + pattern16(velocity).toString(16).toUpperCase().padStart(4, '0');
}

/** True at the exact overflow boundary and beyond (sign bit set). */
export function isOverflowed(velocity) {
  return pattern16(velocity) >= 32768;
}
