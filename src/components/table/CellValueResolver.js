import { FormulaParser } from 'components/formula/parser/Parser';

export class CellValueResolver {
  constructor(table) {
    this.table = table;
    this.cache = {};
    this.dependsOn = {}; // A1 contains $B1 in its formula
    this.dependees = {}; // B1 influences A1
    this.idStack = []; // to remember the recursive sequence of ids when following chain of recursive formulas
  }

  // used as a visitor pattern in FormulaParser
  resolveValue(cellToken) {
    const depCellName = cellToken.innerName;
    const currentlyCalculatedId = this.idStack[this.idStack.length - 1];
    this.dependsOn[currentlyCalculatedId].push(depCellName);
    if (this.cache[depCellName]) {
      // has been calculated before
      if (Number.isNaN(Number(this.cache[depCellName]))) {
        throw new Error(`Incorrect cell ${depCellName}`);
      }
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
      // recursive call to resolve cell in this formula
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
          // recursive call to update dependees if it's 'dependant' changes
          const { number, error } = this.parseValue(depCellFormula, cell);
          this.table.updateCellValue(cell, error || number);
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
      // no value provided
      this.removeCache(id);
    } else if (value.startsWith('=')) {
      // value is formula
      try {
        const formulaResult = FormulaParser.parse(value.slice(1), this); // this - visitor
        result.formula = value;
        result.number = formulaResult;
        this.cache[id] = result.number;
      } catch (e) {
        // value is invalid formula
        console.warn('Parse error', e.message);
        result.error = e.message || 'Error parsing formula';
        this.cache[id] = result.error;
        result.formula = value;
      }
    } else if (/^\d+(\.\d+)?$/.test(value)) {
      // value is a number
      result.number = value;
      this.cache[id] = value;
    } else {
      // value is a text
      result.number = value;
      this.cache[id] = value;
    }
    this.parseFinish(id);
    return result;
  }
}
