// utils/analyzeCode.js
import { parseProgram, tokenPatterns } from "./parser";

let isValidSyntax;

export const analyzeCode = (code) => {
  const lexicalAnalysis = performLexicalAnalysis(code);
  const syntacticAnalysis = performSyntacticAnalysis(code);
  const semanticAnalysis = performSemanticAnalysis(code);

  return {
    lexical: lexicalAnalysis,
    syntax: syntacticAnalysis,
    semantic: semanticAnalysis,
  };
};

const performLexicalAnalysis = (code) => {
  const code_separated = code.split("\n");
  let i = 0;
  let tokens = {};
  while (i < code_separated.length) {
    const line = code_separated[i]
      .split(/([ ,\[\]<>=\n])/)
      .filter((token) => token.trim() !== "");
    if (line[0].match(tokenPatterns.Commentaire.pattern)) {
      tokens[line[0]] = tokenPatterns.Commentaire.message;
    } else {
      if (line[0].match(tokenPatterns.Snk_Print.pattern)) {
        tokens[line[0]] = tokenPatterns.Snk_Print.message;
      } else {
        line.forEach((word) => {
          for (let [key, { pattern, message }] of Object.entries(
            tokenPatterns
          )) {
            if (word.match(pattern)) {
              tokens[word] = message;
              break;
            }
          }
        });
      }
    }
    i = i + 1;
  }

  return { tokens };
};

const performSyntacticAnalysis = (code) => {
  const result = parseProgram(code);
  if (result.error) {
    isValidSyntax = false;
    return [result];
  }
  isValidSyntax = true;
  return result;
};

const performSemanticAnalysis = (code) => {
  if (isValidSyntax) {
    const code_separated = code
      .split(/([ ,\[\]<>=\n"])/)
      .filter((token) => token.trim() !== "");

    if (
      !code_separated[0].match(tokenPatterns.Snk_Begin.pattern) ||
      !code_separated[code_separated.length - 1].match(
        tokenPatterns.Snk_End.pattern
      )
    ) {
      return {
        Error:
          "Le programme commence toujours par « Snk_Begin » et se termine par « Snk_End »",
      };
    }

    const declaration = [];
    let i = 0;
    while (i < code_separated.length) {
      if (
        code_separated[i].match(tokenPatterns.Snk_Int.pattern) ||
        code_separated[i].match(tokenPatterns.Snk_Real.pattern) ||
        code_separated[i].match(tokenPatterns.Snk_Strg.pattern)
      ) {
        i = i + 1;
        while (!code_separated[i].match(tokenPatterns.finLigne.pattern)) {
          if (code_separated[i] === '"') {
            let str = "";
            i = i + 1;
            while (code_separated[i] !== '"') {
              str = str.concat(code_separated[i]);
              i = i + 1;
            }
            declaration.push(str);
          }
          if (code_separated[i].match(tokenPatterns.identificateur.pattern)) {
            declaration.push(code_separated[i]);
          }
          i = i + 1;
        }
      }
      i = i + 1;
    }

    for (let i = 0; i < code_separated.length; i++) {
      if (code_separated[i].match(tokenPatterns.Set.pattern)) {
        if (declaration.findIndex((e) => e === code_separated[i + 1]) === -1) {
          return {
            Error: `La variable ${code_separated[i + 1]} est non pas déclaré`,
          };
        }
      }

      if (code_separated[i].match(tokenPatterns.Get.pattern)) {
        if (declaration.findIndex((e) => e === code_separated[i + 1]) === -1) {
          return {
            Error: `La variable ${code_separated[i + 1]} est non pas déclaré`,
          };
        }
        if (declaration.findIndex((e) => e === code_separated[i + 3]) === -1) {
          return {
            Error: `La variable ${code_separated[i + 3]} est non pas déclaré`,
          };
        }
      }

      if (code_separated[i].match(tokenPatterns.If.pattern)) {
        if (
          code_separated[i + 2].match(tokenPatterns.identificateur.pattern) &&
          declaration.findIndex((e) => e === code_separated[i + 2]) === -1
        ) {
          return {
            Error: `La variable ${code_separated[i + 2]} est non pas déclaré`,
          };
        }
        if (
          code_separated[i + 4].match(tokenPatterns.identificateur.pattern) &&
          declaration.findIndex((e) => e === code_separated[i + 4]) === -1
        ) {
          return {
            Error: `La variable ${code_separated[i + 4]} est non pas déclaré`,
          };
        }
      }

      if (code_separated[i].match(tokenPatterns.Snk_Print.pattern)) {
        i = i + 1;
        if (code_separated[i] === '"') break;
        while (!code_separated[i].match(tokenPatterns.finLigne.pattern)) {
          if (
            code_separated[i].match(tokenPatterns.identificateur.pattern) &&
            declaration.findIndex((e) => e === code_separated[i]) === -1
          ) {
            return {
              Error: `La variable ${code_separated[i]} est non pas déclaré`,
            };
          }
          i = i + 1;
        }
      }
    }

    return { IsValid: "True " };
  } else {
    return { Error: "Le programme doit etre valid syntaxiquement" };
  }
};
