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

const tokenPatterns = {
  Snk_Begin: {
    pattern: /\bSnk_Begin\b/,
    message: "mot clé pour débuter un programme",
  },
  Snk_Int: {
    pattern: /\bSnk_Int\b/,
    message: "mot clé de déclaration du type entier",
  },
  Snk_Real: {
    pattern: /\bSnk_Real\b/,
    message: "mot clé de déclaration du type réel",
  },
  Set: {
    pattern: /\bSet\b/,
    message: "mot clé pour définir ou assigner une valeur",
  },
  Get: {
    pattern: /\bGet\b/,
    message: "mot clé pour récupérer une valeur",
  },
  from: {
    pattern: /\bfrom\b/,
    message: "mot clé pour spécifier une origine ou une source",
  },
  If: {
    pattern: /\bIf\b/,
    message: "mot clé pour une condition si",
  },
  Else: {
    pattern: /\bElse\b/,
    message: "mot clé pour une condition alternative",
  },
  Begin: {
    pattern: /\bBegin\b/,
    message: "mot clé pour indiquer le début d'un bloc de code",
  },
  End: {
    pattern: /\bEnd\b/,
    message: "mot clé pour indiquer la fin d'un bloc de code",
  },
  Snk_Print: {
    pattern: /\bSnk_Print\b/,
    message: "mot clé pour afficher une sortie",
  },
  Snk_End: {
    pattern: /\bSnk_End\b/,
    message: "mot clé pour terminer un programme",
  },
  Commentaire: {
    pattern: /^\s*##.*/,
    message: "commentaire",
  },
  finLigne: {
    pattern: /^#$/,
    message: "fin ligne",
  },
  nombre: {
    pattern: /^[0-9]+(\.[1-9][0-9]*)?$/,
    message: "un nombre",
  },
  ",": {
    pattern: /,/,
    message: "séparateur",
  },
  identificateur: {
    pattern: /[a-z|A-Z](_?[0-9|a-z|A-Z]*)*/,
    message: "un identificateur",
  },
};

const performLexicalAnalysis = (code) => {
  const code_separated = code
    .split(/([ ,\[\]<>=\n])/)
    .filter((token) => token.trim() !== "");

  const words = [...new Set(code_separated)];
  console.log("Words: ", words);
  let tokens = {};
  words.forEach((word) => {
    for (let [key, { pattern, message }] of Object.entries(tokenPatterns)) {
      if (word.match(pattern)) {
        tokens[word] = message;
        break;
      }
    }
  });
  console.log(tokens);

  return { tokens };
};

const performSyntacticAnalysis = (code) => {
  const code_separated = code.split("\n");
  code_separated.forEach((i) => ({}));
  const isValidSyntax = code.includes("Snk_Begin") && code.includes("Snk_End");

  return { isValid: isValidSyntax };
};

const performSemanticAnalysis = (code) => {
  // Check for semantic errors (e.g., undefined variables, type errors)
  const hasSemanticErrors = false; // Placeholder, implement your logic
  return { isValid: !hasSemanticErrors };
};
