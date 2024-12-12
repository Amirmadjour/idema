// utils/analyzeCode.js

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
  // Tokenize the code into meaningful parts (e.g., keywords, identifiers)
  const code_separated = code.split(/\s+/); // A simple split (can be more complex)
  const tokenPatterns = {
    Snk_Begin: {
      pattern: /\bSnk_Begin\b/,
      message: "mot clé de début de programme",
    },
    Snk_Int: {
      pattern: /\bSnk_Int\b/,
      message: "mot clé de déclaration du type entier",
    },
    Snk_Real: {
      pattern: /\bSnk_Real\b/,
      message: "mot clé de déclaration du type réel",
    },
    ",": {
      pattern: /\b\,\b/,
      message: "Séparateur",
    },
    "#": {
      pattern: /#/,
      message: "Fin instruction",
    },
  };

  const words = [...new Set(code_separated)];
  console.log("Words: ", words);
  let tokens = {};
  words.forEach((word) => {
    for (let [key, { pattern, message }] of Object.entries(tokenPatterns)) {
      if (word.match(pattern)) {
        tokens[key] = message;
      }
    }
  });
  console.log(tokens);

  return { tokens };
};

const performSyntacticAnalysis = (code) => {
  // Parse the tokens and check for syntax validity
  const isValidSyntax = code.includes("Snk_Begin") && code.includes("Snk_End");
  return { isValid: isValidSyntax };
};

const performSemanticAnalysis = (code) => {
  // Check for semantic errors (e.g., undefined variables, type errors)
  const hasSemanticErrors = false; // Placeholder, implement your logic
  return { isValid: !hasSemanticErrors };
};
