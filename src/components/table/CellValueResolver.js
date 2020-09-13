import { FormulaParser } from 'components/formula/parser/Parser';

export class CellValueResolver {
  constructor(table) {
    this.table = table;
    this.cache = {};
    this.dependsOn = {}; // A1 contains $B1 in its formula
    this.dependees = {}; // B1 influences A1
    this.idStack = []; // for recursive resolution of cells
  }

  // used as visitor in formula resolution
  resolveValue(cellToken) {
    const depCellName = cellToken.innerName;
    const currentlyCalculatedId = this.idStack[this.idStack.length - 1];
    this.dependsOn[currentlyCalculatedId].push(depCellName);
    if (this.cache[depCellName]) {
      // has been calculated before
      return this.cache[depCellName];
    }

    // cell is probably a number
    const depCellValue = this.table.store.getState().numberState[depCellName];
    if (depCellValue) {
      if (Number.isNaN(Number(depCellValue))) {
        throw new Error(`Incorrect cell ${depCellName}`);
      }
      return depCellValue;
    }

    // dependant is a formula. need to calculate
    const depCellFormula = this.table.store.getState().formulaState[
      depCellName
    ];
    if (depCellFormula) {
      const result = this.parseValue(depCellFormula, depCellName);
      return result.number;
    }

    throw new Error('Pointing at the empty Cell');
  }

  parseStart(id) {
    this.idStack.push(id);
    // run through this.dependsOn[id] and clean up respective this.dependants
    if (this.dependsOn[id]) {
      this.dependsOn[id].forEach((cell) => {
        if (this.dependees[cell]) {
          this.dependees[cell] = this.dependees[cell].filter((c) => c !== id);
        }
      });
    }
    // clear
    this.dependsOn[id] = [];
  }

  parseFinish(id) {
    // this.dependsOn:  '0:0' is dependant on ['0:1', '0:2' ...]
    // this.dependees: '0:1' has dependees ['0.0']
    if (this.dependsOn[id]) {
      this.dependsOn[id].forEach((cell) => {
        if (!this.dependees[cell]) {
          this.dependees[cell] = [];
        }
        this.dependees[cell].push(id);
      });
    }

    this.idStack.pop();

    // go through dependees and recalculate them
    if (this.dependees[id]) {
      this.dependees[id].forEach((cell) => {
        const depCellFormula = this.table.store.getState().formulaState[cell];
        if (depCellFormula) {
          const { number, error } = this.parseValue(depCellFormula, cell);
          this.table.updateCellValue(`[data-id="${cell}"]`, error || number);
        }
      });
    }
  }

  removeCache(id) {
    if (this.cache[id]) {
      delete this.cache[id];
    }
  }

  parseValue(value = '', id) {
    const result = { number: null, formula: null, error: null };
    this.parseStart(id);
    if (!value) {
      this.removeCache(id);
      this.parseFinish(id);
      return result;
    }
    if (value.startsWith('=')) {
      try {
        const formulaResult = FormulaParser.parse(value.slice(1), this);
        result.formula = value;
        result.number = formulaResult;
        this.cache[id] = result.number;
        return result;
      } catch (e) {
        this.removeCache(id);
        console.warn('Parse error', e.message);
        result.error = e.message || 'Error parsing formula';
        return result;
      } finally {
        this.parseFinish(id);
      }
    } else if (/^\d+(\.\d+)?$/.test(value)) {
      result.number = value;
      this.cache[id] = value;
      this.parseFinish(id);
      return result;
    } else {
      result.error = 'Wrong input';
      // TODO
      // propagate errors on the dependees
      this.removeCache(id);
      this.parseFinish(id);
      return result;
    }
  }
}
