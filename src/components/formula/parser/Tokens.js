import { CHAR_TO_INDEX_MAP } from 'components/table/table.constants';

export class OpenParenthsis {
  static pattern() {
    return '\\(';
  }
}

export class CloseParenthesis {
  static pattern() {
    return '\\)';
  }
}

export class SubtractionSign {
  static pattern() {
    return '\\-';
  }

  action(left, right) {
    return left - right;
  }
}

export class AdditionSign {
  static pattern() {
    return '\\+';
  }

  action(left, right) {
    return left + right;
  }
}

export class MultiplySign {
  static pattern() {
    return '\\*';
  }

  action(left, right) {
    return left * right;
  }
}

export class DivideSign {
  static pattern() {
    return '\\/';
  }

  action(left, right) {
    return left / right;
  }
}

export class TableCell {
  static pattern() {
    return '\\$[A-Z]\\d+';
  }

  constructor(value) {
    this.value = value;
    this.innerName = '';
    this.setInnerCellName();
  }

  setInnerCellName() {
    // $A1 -> 0:0
    // $B1 -> 0:1
    const colName = this.value[1];
    const colNumber = CHAR_TO_INDEX_MAP[colName];
    const rowNumber = this.value.slice(2);
    this.innerName = `${rowNumber - 1}:${colNumber}`;
  }

  getValue(visitor) {
    // ask visitor for a value of a cell
    return +visitor.resolveValue(this);
  }
}

export class Numb {
  static pattern() {
    return '(?<![A-Z]\\d*)\\d+'; // match if doesnt look like a TableCell
  }

  constructor(value) {
    this.value = Number(value);
  }

  getValue() {
    return this.value;
  }
}
