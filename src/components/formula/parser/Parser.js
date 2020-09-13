import { Tokenizer } from './Tokenizer';
import { Lexer } from './Lexer';

export class FormulaParser {
  static parse(input, visitor) {
    const tokens = Tokenizer.parse(input);
    if (!tokens.length) {
      throw new Error('Empty formula');
    }
    if (tokens.length === 1) {
      return tokens[0].getValue(visitor);
    }
    const expression = Lexer.runLexing(tokens);
    return expression.getValue(visitor);
  }
}
