export const MAX_BITS = 64;
export const WIDTH_OPTIONS = ['auto', 4, 8, 16, 32, 64];
export const OPERATIONS = ['ADD', 'SUB', 'AND', 'OR', 'XOR', 'NOT', 'SHL', 'SHR'];

export function normalizeBinary(value) {
  return String(value ?? '').trim();
}

export function validateBinary(value, label = 'Operand', selectedWidth = 'auto') {
  const binary = normalizeBinary(value);
  if (!binary) return `${label} is required.`;
  if (!/^[01]+$/.test(binary)) return `${label} must contain only 0 and 1.`;
  if (binary.length > MAX_BITS) return `${label} must be ${MAX_BITS} bits or fewer.`;
  if (selectedWidth !== 'auto' && binary.length > Number(selectedWidth)) {
    return `${label} exceeds the selected ${selectedWidth}-bit width.`;
  }
  return '';
}

export function resolveWidth(aInput, bInput = '', selectedWidth = 'auto') {
  if (selectedWidth !== 'auto') return Number(selectedWidth);
  return Math.max(normalizeBinary(aInput).length, normalizeBinary(bInput).length, 1);
}

export function binaryToBigInt(value) {
  return BigInt(`0b${value}`);
}

function bitsLsb(binary) {
  return [...binary].reverse().map(Number);
}

function toBinary(value, width) {
  return value.toString(2).padStart(width, '0');
}

function isNegative(value, width) {
  return ((value >> BigInt(width - 1)) & 1n) === 1n;
}

/**
 * Derive carries recursively, as a ripple-carry circuit does.
 * carries[0] is C0 and carries[width] is the final carry-out.
 */
export function deriveRippleCarries(generate, propagate, initialCarry) {
  const carries = [Number(initialCarry)];
  for (let bit = 0; bit < generate.length; bit += 1) {
    carries.push(generate[bit] | (propagate[bit] & carries[bit]));
  }
  return carries;
}

/**
 * Derive each carry directly from the expanded lookahead expression:
 * Cn = G(n-1) OR P(n-1)G(n-2) OR ... OR P(n-1)...P0C0.
 * No computed carry is used to derive a later carry.
 */
export function deriveLookaheadCarries(generate, propagate, initialCarry) {
  const carries = [Number(initialCarry)];
  for (let nextCarry = 1; nextCarry <= generate.length; nextCarry += 1) {
    let carry = 0;
    let propagateProduct = 1;
    for (let source = nextCarry - 1; source >= 0; source -= 1) {
      carry |= propagateProduct & generate[source];
      propagateProduct &= propagate[source];
    }
    carry |= propagateProduct & Number(initialCarry);
    carries.push(carry);
  }
  return carries;
}

export function carryExpression(nextCarry) {
  if (nextCarry < 1) return 'C0';
  const terms = [];
  let prefix = '';
  for (let source = nextCarry - 1; source >= 0; source -= 1) {
    terms.push(`${prefix}G${source}`);
    prefix += `P${source}`;
  }
  terms.push(`${prefix}C0`);
  return `C${nextCarry} = ${terms.join(' OR ')}`;
}

export function computeAdderTrace(aBinary, bEffectiveBinary, initialCarry = 0, mode = 'RCA') {
  if (aBinary.length !== bEffectiveBinary.length) {
    throw new Error('Adder operands must have the same width.');
  }
  const aBits = bitsLsb(aBinary);
  const bBits = bitsLsb(bEffectiveBinary);
  const generate = aBits.map((a, bit) => a & bBits[bit]);
  // The exhibit proposal intentionally defines propagate with OR.
  const propagate = aBits.map((a, bit) => a | bBits[bit]);
  const rippleCarries = deriveRippleCarries(generate, propagate, initialCarry);
  const lookaheadCarries = deriveLookaheadCarries(generate, propagate, initialCarry);
  const carries = mode === 'CLA' ? lookaheadCarries : rippleCarries;
  const sumBits = aBits.map((a, bit) => a ^ bBits[bit] ^ carries[bit]);
  const stages = aBits.map((aBit, bit) => ({
    bit,
    aBit,
    bBit: bBits[bit],
    generate: generate[bit],
    propagate: propagate[bit],
    carryIn: carries[bit],
    sumBit: sumBits[bit],
    carryOut: carries[bit + 1],
    expression: carryExpression(bit + 1),
  }));

  return {
    mode,
    generate,
    propagate,
    carries,
    rippleCarries,
    lookaheadCarries,
    sumBits,
    stages,
    finalCarry: carries[aBits.length],
  };
}

export function computeALU({ operation, aInput, bInput = '0', width = 'auto', mode = 'RCA', carryIn }) {
  const op = String(operation).toUpperCase();
  if (!OPERATIONS.includes(op)) throw new Error(`Unsupported ALU operation: ${operation}`);

  const aSource = normalizeBinary(aInput);
  const bSource = normalizeBinary(bInput);
  const unary = ['NOT', 'SHL', 'SHR'].includes(op);
  const resolvedWidth = resolveWidth(aSource, unary ? '' : bSource, width);
  const aError = validateBinary(aSource, 'Operand A', width);
  const bError = unary ? '' : validateBinary(bSource, 'Operand B', width);
  if (aError || bError) throw new Error(aError || bError);

  const paddedA = aSource.padStart(resolvedWidth, '0');
  const paddedB = (bSource || '0').padStart(resolvedWidth, '0');
  const aValue = binaryToBigInt(paddedA);
  const bValue = binaryToBigInt(paddedB);
  const widthBig = BigInt(resolvedWidth);
  const mask = (1n << widthBig) - 1n;

  let resultValue = 0n;
  let effectiveB = paddedB;
  let initialCarry = Number(carryIn ?? 0);
  let trace = null;
  let borrow = false;
  let carry = false;
  let overflow = false;
  const warnings = [];

  if (op === 'ADD' || op === 'SUB') {
    initialCarry = op === 'SUB' ? 1 : Number(carryIn ?? 0);
    if (op === 'SUB') {
      effectiveB = toBinary((~bValue) & mask, resolvedWidth);
      borrow = aValue < bValue;
    }
    trace = computeAdderTrace(paddedA, effectiveB, initialCarry, mode);
    resultValue = binaryToBigInt([...trace.sumBits].reverse().join(''));
    carry = Boolean(trace.finalCarry);
    overflow = op === 'ADD'
      ? isNegative(aValue, resolvedWidth) === isNegative(bValue, resolvedWidth)
        && isNegative(resultValue, resolvedWidth) !== isNegative(aValue, resolvedWidth)
      : isNegative(aValue, resolvedWidth) !== isNegative(bValue, resolvedWidth)
        && isNegative(resultValue, resolvedWidth) !== isNegative(aValue, resolvedWidth);
    if (op === 'ADD' && carry) warnings.push('Unsigned carry overflow: the full sum is wider than the selected word.');
    if (op === 'SUB' && borrow) warnings.push('Borrow occurred, so the no-borrow Carry flag is 0.');
  } else if (op === 'AND') {
    resultValue = aValue & bValue;
  } else if (op === 'OR') {
    resultValue = aValue | bValue;
  } else if (op === 'XOR') {
    resultValue = aValue ^ bValue;
  } else if (op === 'NOT') {
    resultValue = (~aValue) & mask;
  } else if (op === 'SHL') {
    carry = isNegative(aValue, resolvedWidth);
    resultValue = (aValue << 1n) & mask;
  } else if (op === 'SHR') {
    carry = (aValue & 1n) === 1n;
    resultValue = aValue >> 1n;
  }

  const resultBinary = toBinary(resultValue & mask, resolvedWidth);
  const fullResultBinary = (op === 'ADD' || op === 'SUB') && carry ? `1${resultBinary}` : resultBinary;
  const flags = {
    Z: resultValue === 0n,
    C: carry,
    N: isNegative(resultValue, resolvedWidth),
    V: overflow,
  };

  return {
    operation: op,
    mode,
    width: resolvedWidth,
    paddedA,
    paddedB,
    effectiveB,
    initialCarry,
    aValue,
    bValue,
    resultValue,
    resultBinary,
    fullResultBinary,
    resultBits: [...resultBinary].map(Number),
    hexadecimal: `0x${resultValue.toString(16).toUpperCase().padStart(Math.ceil(resolvedWidth / 4), '0')}`,
    decimal: resultValue.toString(),
    carry,
    borrow,
    overflow,
    flags,
    warnings,
    trace,
  };
}
