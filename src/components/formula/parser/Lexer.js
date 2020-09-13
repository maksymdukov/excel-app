import * as Tokens from './Tokens.js';
import { Tokenizer } from './Tokenizer.js';

class Expression {
  constructor() {
    this.left = null;
    this.right = null;
    this.sign = null;
    this.minusLeft = false;
    this.minusRight = false;
    this.minusExpr = false;
  }

  getValue(visitor) {
    let left = this.left.getValue(visitor);
    let right = this.right.getValue(visitor);
    if (this.minusLeft) {
      left = -left;
    }

    if (this.minusRight) {
      right = -right;
    }

    const result = this.sign.action(left, right, visitor);
    return this.minusExpr ? -result : result;
  }
}

export class Lexer {
  static lexing(
    tokens,
    exp,
    start = 0,
    multipleDivideEnd = false,
    minusPlusEnd = false
  ) {
    let idx = start;
    while (idx <= tokens.length - 1) {
      const token = tokens[idx];
      switch (token.constructor) {
        case Tokens.OpenParenthsis:
          const newExp = new Expression();
          if (!exp.left && !exp.right && exp.minusLeft) {
            newExp.minusRight = exp.minusRight;
            newExp.minusExpr = exp.minusLeft;
            newExp.minusLeft = false;
            exp.minusLeft = false;
            exp.minusRight = false;
            exp.minusExpr = false;
          }
          const endIdx = Lexer.lexing(tokens, newExp, idx + 1);
          if (exp.left) {
            exp.right = newExp;
          } else {
            exp.left = newExp;
          }
          idx = endIdx + 1;
          break;
        case Tokens.CloseParenthesis:
          if (minusPlusEnd) {
            return idx - 1;
          }
          if (multipleDivideEnd) {
            return idx - 1;
          }
          return idx;
          break;
        case Tokens.AdditionSign:
        case Tokens.SubtractionSign:
          if (!exp.left && !exp.right) {
            // minus at the beginning
            // _-_ 10 + 10    (on the minus sign)
            exp.minusLeft = true;
            idx++;
            break;
          }

          if (exp.left && !exp.right && exp.sign) {
            exp.minusRight = true;
            idx++;
            break;
          }

        case Tokens.MultiplySign:
        case Tokens.DivideSign:
          if (exp.right && exp.left && exp.sign) {
            // already have an expression 3 + 5 _+_ 6 + 7
            // lets create new one where current exp will be as left arm
            const substituteExp = new Expression();
            substituteExp.left = exp.left;
            substituteExp.right = exp.right;
            substituteExp.sign = exp.sign;
            substituteExp.minusRight = exp.minusRight;
            substituteExp.minusLeft = exp.minusLeft;
            substituteExp.minusExpr = exp.minusExpr;

            exp.left = substituteExp;
            exp.right = null;
            exp.sign = token;
            exp.minusRight = false;
            exp.minusLeft = false;
            exp.minusExpr = false;
            const endIdx = Lexer.lexing(
              tokens,
              exp,
              idx + 1,
              multipleDivideEnd,
              true
            );
            idx = endIdx + 1;
          } else {
            exp.sign = token;
            idx++;
          }
          break;
        case Tokens.Numb:
        case Tokens.TableCell:
          if (exp.left) {
            if (
              tokens[idx + 1] instanceof Tokens.MultiplySign ||
              tokens[idx + 1] instanceof Tokens.DivideSign
            ) {
              // next sign is multiply or divide -> 1 + _2_ * 3 * 4
              const newExp = new Expression();
              exp.right = newExp;
              newExp.left = token;
              const endIdx = Lexer.lexing(
                tokens,
                newExp,
                idx + 1,
                true,
                minusPlusEnd
              );
              idx = endIdx + 1;
              break;
            } else if (
              tokens[idx + 1] instanceof Tokens.AdditionSign ||
              tokens[idx + 1] instanceof Tokens.SubtractionSign
            ) {
              if (multipleDivideEnd) {
                // we were gathering multiple or divide expression
                // ex 1 + 1 * 2 * _4_ + 1 / 10
                // lets return
                exp.right = token;
                return idx;
              }
            }
            exp.right = token;
          } else {
            exp.left = token;
          }
          idx++;
          break;
        default:
          break;
      }
    }
    return idx;
  }
}

const tokens = Tokenizer.parse('-(1+5) + (3+5) + (2+5+(3+4 * 5))');
