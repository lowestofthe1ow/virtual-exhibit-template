// Utility crypto functions (TypeScript)
// Keep algorithms simple and deterministic; these mirror previous JS behavior.

export function caesarEncrypt(text: string, shift: number) {
  const up = text.toUpperCase();
  const map: string[] = [];
  const outArr: string[] = [];

  for (const ch of up) {
    if (ch >= 'A' && ch <= 'Z') {
      const original = ch.charCodeAt(0) - 65;
      const shifted = (original + shift) % 26;
      const encrypted = String.fromCharCode(shifted + 65);
      outArr.push(encrypted);
      map.push(`${ch} → ${encrypted} (shift ${shift})`);
    } else {
      outArr.push(ch);
      map.push(ch);
    }
  }

  const plain = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const shiftRow = plain.split('').map((letter, index) => String.fromCharCode(((index + shift) % 26) + 65)).join('');

  return { text: outArr.join(''), map, plain, shift: shiftRow };
}

export function caesarDecrypt(text: string, shift: number) {
  const up = text.toUpperCase();
  const map: string[] = [];
  const outArr: string[] = [];

  for (const ch of up) {
    if (ch >= 'A' && ch <= 'Z') {
      const original = ch.charCodeAt(0) - 65;
      const shifted = (original - shift + 26) % 26;
      const decrypted = String.fromCharCode(shifted + 65);
      outArr.push(decrypted);
      map.push(`${ch} → ${decrypted} (shift -${shift})`);
    } else {
      outArr.push(ch);
      map.push(ch);
    }
  }

  const plain = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const shiftRow = plain.split('').map((letter, index) => String.fromCharCode(((index + shift) % 26) + 65)).join('');

  return { text: outArr.join(''), map, plain, shift: shiftRow };
}

export function vigenereEncrypt(plaintext: string, keyword: string) {
  const pt = plaintext.toUpperCase();
  const key = keyword.toUpperCase().replace(/[^A-Z]/g, '');
  let repeated = '';
  let output = '';
  const map: string[] = [];
  let kidx = 0;

  for (const ch of pt) {
    if (ch >= 'A' && ch <= 'Z') {
      const keyChar = key[kidx % key.length];
      const plainVal = ch.charCodeAt(0) - 65;
      const keyVal = keyChar.charCodeAt(0) - 65;
      const cipherVal = (plainVal + keyVal) % 26;
      const cipherChar = String.fromCharCode(cipherVal + 65);
      output += cipherChar;
      repeated += keyChar;
      map.push(`${ch} + ${keyChar} → ${cipherChar}`);
      kidx++;
    } else {
      output += ch;
      repeated += ch;
      map.push(ch);
    }
  }

  return { repeated, text: output, map };
}

export function vigenereDecrypt(ciphertext: string, keyword: string) {
  const ct = ciphertext.toUpperCase();
  const key = keyword.toUpperCase().replace(/[^A-Z]/g, '');
  let repeated = '';
  let output = '';
  const map: string[] = [];
  let kidx = 0;

  for (const ch of ct) {
    if (ch >= 'A' && ch <= 'Z') {
      const keyChar = key[kidx % key.length];
      const cipherVal = ch.charCodeAt(0) - 65;
      const keyVal = keyChar.charCodeAt(0) - 65;
      const plainVal = (cipherVal - keyVal + 26) % 26;
      const plainChar = String.fromCharCode(plainVal + 65);
      output += plainChar;
      repeated += keyChar;
      map.push(`${ch} - ${keyChar} → ${plainChar}`);
      kidx++;
    } else {
      output += ch;
      repeated += ch;
      map.push(ch);
    }
  }

  return { repeated, text: output, map };
}

// ROT13
export function rot13(text: string) {
  return text.replace(/[A-Za-z]/g, (c) => {
    const start = c <= 'Z' ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - start + 13) % 26) + start);
  });
}

// Atbash (A<->Z)
export function atbash(text: string) {
  return text.replace(/[A-Z]/gi, (c) => {
    const isUpper = c === c.toUpperCase();
    const base = isUpper ? 65 : 97;
    const mapped = String.fromCharCode(base + (25 - (c.charCodeAt(0) - base)));
    return mapped;
  });
}

// A1Z26
export function a1z26Decode(numbers: string) {
  return numbers.split(' ').map(group => group.split('-').map(n => {
    const i = Number(n);
    if (!i || i < 1 || i > 26) return '?';
    return String.fromCharCode(65 + i - 1);
  }).join('')).join(' ');
}

// Simple reversed text
export function reverseText(text: string) {
  return text.split('').reverse().join('');
}

/**
 * Enigma simulation helpers
 * This is a simplified model to preserve educational behavior:
 * - Plugboard as pair array
 * - Rotors: per-keypress rotor stepping (simple stepping like original code)
 * - Reflector: simple symmetric mapping (A<->Z, B<->Y)
 */

export type PlugPair = { a: string; b: string };
export type EnigmaState = {
  rotorPositions: number[]; // 3 numbers 0..25
  ringSettings: number[]; // 3 numbers 1..26
  plugPairs: PlugPair[]; // up to N pairs
  output: string;
  feedback: string;
  activeStage?: string;
  path: string[];
  history: string[];
};

export function defaultEnigmaState(): EnigmaState {
  return {
    rotorPositions: [0, 0, 0],
    ringSettings: [1, 1, 1],
    plugPairs: [{ a: 'A', b: 'M' }, { a: 'T', b: 'R' }],
    output: '',
    feedback: 'Enigma is ready.',
    activeStage: '',
    path: [],
    history: ['Enigma is ready.']
  };
}

function swapPlugboard(state: EnigmaState, ch: string) {
  const pair = state.plugPairs.find(p => p.a === ch || p.b === ch);
  if (!pair) return ch;
  return pair.a === ch ? pair.b : pair.a;
}

function reflect(ch: string) {
  const idx = ch.charCodeAt(0) - 65;
  const reflected = 25 - idx;
  return String.fromCharCode(reflected + 65);
}

function processRotorChar(letter: string, position: number, ring: number, reverse = false) {
  const idx = letter.charCodeAt(0) - 65;
  const offset = (position - (ring - 1) + 26) % 26;
  let mapped = (idx + offset) % 26;
  if (reverse) {
    mapped = (mapped - offset + 26) % 26;
  }
  return String.fromCharCode(mapped + 65);
}

export function processEnigmaKeypress(state: EnigmaState, key: string): EnigmaState {
  const next = JSON.parse(JSON.stringify(state)) as EnigmaState;
  const input = key.toUpperCase();
  const steps: string[] = [];
  const history: string[] = [];

  next.activeStage = 'stageKeyboard';
  steps.push('stageKeyboard');
  history.push(`Key ${input} pressed.`);

  const plugIn = swapPlugboard(next, input);
  next.activeStage = 'stagePlugboard';
  steps.push('stagePlugboard');
  history.push(`Plugboard swaps ${input} with ${plugIn}.`);

  const r1 = processRotorChar(plugIn, next.rotorPositions[0], next.ringSettings[0], false);
  next.activeStage = 'stageRotor1';
  steps.push('stageRotor1');
  history.push(`Rotor I transforms ${plugIn} → ${r1}.`);

  const r2 = processRotorChar(r1, next.rotorPositions[1], next.ringSettings[1], false);
  next.activeStage = 'stageRotor2';
  steps.push('stageRotor2');
  history.push(`Rotor II transforms ${r1} → ${r2}.`);

  const r3 = processRotorChar(r2, next.rotorPositions[2], next.ringSettings[2], false);
  next.activeStage = 'stageRotor3';
  steps.push('stageRotor3');
  history.push(`Rotor III transforms ${r2} → ${r3}.`);

  const reflected = reflect(r3);
  next.activeStage = 'stageReflector';
  steps.push('stageReflector');
  history.push(`Reflector redirects ${r3} back through the machine.`);

  const back3 = processRotorChar(reflected, next.rotorPositions[2], next.ringSettings[2], true);
  next.activeStage = 'stageRotor3Back';
  steps.push('stageRotor3Back');
  history.push(`Rotor III returns ${reflected} → ${back3}.`);

  const back2 = processRotorChar(back3, next.rotorPositions[1], next.ringSettings[1], true);
  next.activeStage = 'stageRotor2Back';
  steps.push('stageRotor2Back');
  history.push(`Rotor II returns ${back3} → ${back2}.`);

  const back1 = processRotorChar(back2, next.rotorPositions[0], next.ringSettings[0], true);
  next.activeStage = 'stageRotor1Back';
  steps.push('stageRotor1Back');
  history.push(`Rotor I returns ${back2} → ${back1}.`);

  const plugOut = swapPlugboard(next, back1);
  next.activeStage = 'stagePlugboardBack';
  steps.push('stagePlugboardBack');
  history.push(`Plugboard swaps ${back1} with ${plugOut}.`);

  next.output = (next.output || '') + plugOut;
  next.activeStage = 'stageLampboard';
  steps.push('stageLampboard');
  history.push(`Lampboard lights ${plugOut}.`);

  next.path = steps;
  next.history = history;

  next.rotorPositions[0] = (next.rotorPositions[0] + 1) % 26;
  if (next.rotorPositions[0] === 0) {
    next.rotorPositions[1] = (next.rotorPositions[1] + 1) % 26;
    if (next.rotorPositions[1] === 0) {
      next.rotorPositions[2] = (next.rotorPositions[2] + 1) % 26;
    }
  }

  next.history = [
    ...history,
    `Rotor I advanced one position.`,
    ...(next.rotorPositions[0] === 0 ? ['Rotor II advanced one position.'] : []),
    ...(next.rotorPositions[0] === 0 && next.rotorPositions[1] === 0 ? ['Rotor III advanced one position.'] : []),
    'Because the rotors advance after each keypress, repeated letters usually encrypt differently.'
  ];

  return next;
}