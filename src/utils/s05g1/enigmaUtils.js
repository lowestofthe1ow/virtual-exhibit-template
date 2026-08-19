export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ROTOR = "EKMFLGDQVZNTOWYHXUSPAIBRCJ";
const REFLECTOR = {
  A: "Y", Y: "A", B: "R", R: "B", C: "U", U: "C", D: "H", H: "D",
  E: "Q", Q: "E", F: "S", S: "F", G: "L", L: "G", I: "P", P: "I",
  J: "X", X: "J", K: "N", N: "K", M: "O", O: "M", T: "Z", Z: "T",
  V: "W", W: "V",
};

export function encodeLetterPath(letter, state) {
  const inputIndex = ALPHABET.indexOf(letter);
  const shiftedIndex = (inputIndex + state) % 26;
  const afterRotor = ROTOR[shiftedIndex];
  const afterReflector = REFLECTOR[afterRotor];
  const reflectedIndex = ROTOR.indexOf(afterReflector);
  const outputLetter = ALPHABET[(reflectedIndex - state + 26) % 26];

  return {
    input: letter,
    afterRotor,
    afterReflector,
    outputLetter,
  };
}

export function encodeLetter(letter, state) {
  return encodeLetterPath(letter, state).outputLetter;
}

export function encodeWord(word, startState) {
  let s = startState;
  let result = "";
  for (const ch of word) {
    result += encodeLetter(ch, s);
    s = (s + 1) % 26;
  }
  return result;
}
