import * as Tokens from './Tokens.js';

export class Tokenizer {
  static tokenTypes = Object.values(Tokens);

  static parse(input) {
    const rawRegexps = Tokenizer.tokenTypes.map((token) => token.pattern());
    const regexp = new RegExp(rawRegexps.join('|'), 'g');
    let matches = input.match(regexp);
    matches = matches.map((token) => {
      for (let index = 0; index < Tokenizer.tokenTypes.length; index++) {
        const TokenType = Tokenizer.tokenTypes[index];
        const reg = new RegExp(TokenType.pattern());
        if (reg.test(token)) {
          return new TokenType(token);
        }
      }
    });
    return matches;
  }
}
