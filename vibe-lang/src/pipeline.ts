import { lex } from "./lexer/lexer.js";
import { parse } from "./parser/parser.js";
import { generate, generateConfLua } from "./codegen/codegen.js";

export function compile(source: string, filename: string = "<stdin>"): { mainLua: string; confLua: string } {
  const tokens = lex(source, filename);
  const ast = parse(tokens, filename);
  const mainLua = generate(ast);
  const confLua = generateConfLua();
  return { mainLua, confLua };
}
