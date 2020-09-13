import { FormulaParser } from 'components/formula/parser/Parser';

export function parse(value = '') {
  const result = { number: null, formula: null, error: null };
  if (!value) {
    return result;
  }
  if (value.startsWith('=')) {
    try {
      const formulaResult = FormulaParser.parse(value.slice(1), {
        getValue(arg) {
          console.log('visitor arg', arg);
          return 0;
        },
      });
      result.formula = value;
      result.number = formulaResult;
      return result;
    } catch (e) {
      console.warn('Parse error', e.message);
      result.error = 'Error parsing formula';
      return result;
    }
  } else if (/\d+(\.\d+)?/.test(value)) {
    result.number = value;
    return result;
  } else {
    result.error = 'Wrong input';
    return result;
  }
}
