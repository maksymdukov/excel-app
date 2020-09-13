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
    return `\\$[A-Z]\\d+`;
  }

  constructor(value) {
    this.value = value;
  }

  getValue(visitor) {
    // ask visitor for a value of a cell
    return visitor.getValue(this);
  }
}

export class Numb {
  static pattern() {
    return `(?<![A-Z]\\d*)\\d+`; // match if doesnt look like a TableCell
  }

  constructor(value) {
    this.value = +value;
  }

  getValue() {
    return this.value;
  }
}
