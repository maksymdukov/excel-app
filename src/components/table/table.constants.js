export const CODES = {
  A: 65,
  Z: 90,
};

export const DEFAULT_WIDTH = 120; // default col width
export const DEFAULT_HEIGHT = 24; // default row height

export const CHAR_TO_INDEX_MAP = Array.from({
  length: CODES.Z - CODES.A,
}).reduce((acc, _, idx) => {
  const char = String.fromCharCode(CODES.A + idx);
  acc[char] = idx;
  return acc;
}, {});
