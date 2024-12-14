export const tokenPatterns = {
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
  Snk_Strg: {
    pattern: /\Snk_Strg\b/,
    message: "mot clé de déclaration d'une chaine de caractère",
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
  ",": {
    pattern: /,/,
    message: "séparateur",
  },
  chaineCharactere: {
    pattern: /".*"/,
    message: "Chaine de caractere",
  },
  identificateur: {
    pattern: /[a-z|A-Z](_?[0-9|a-z|A-Z]*)*/,
    message: "un identificateur",
  },
  nombre: {
    pattern: /[0-9]+(\.[1-9][0-9]*)?/,
    message: "un nombre",
  },
  "[": {
    pattern: /\[/,
    message: "Croche gauche",
  },
  "]": {
    pattern: /\]/,
    message: "Croche droite",
  },
  ">": {
    pattern: />/,
    message: "Supérieure",
  },
  "<": {
    pattern: /</,
    message: "Inférieure",
  },
  "==": {
    pattern: /==/,
    message: "Egalité",
  },
  finLigne: {
    pattern: /^#$/,
    message: "fin ligne",
  },
};

function tokenizeLine(line) {
  const tokens = [];
  let remainingLine = line.trim();

  while (remainingLine.length > 0) {
    let matched = false;

    // Iterate through token patterns
    for (const [tokenType, { pattern }] of Object.entries(tokenPatterns)) {
      const match = remainingLine.match(pattern);

      if (match && match.index === 0) {
        tokens.push({ type: tokenType, value: match[0] });
        remainingLine = remainingLine.slice(match[0].length).trim();
        matched = true;
        break;
      }
    }

    if (!matched) {
      return { error: `Unexpected token: "${remainingLine}"` };
      throw new Error(`Unexpected token: "${remainingLine}"`);
    }
  }

  return tokens;
}

// Example Tokenization
// const line = "Snk_Real x, y #";
// console.log(tokenizeLine(line));
// Output: [
//   { type: 'Snk_Real', value: 'Snk_Real' },
//   { type: 'identificateur', value: 'x' },
//   { type: ',', value: ',' },
//   { type: 'identificateur', value: 'y' },
//   { type: 'finLigne', value: '#' }
// ]

function parseLine(tokens, line) {
  if (tokens.length === 0) return;

  const [firstToken, ...restTokens] = tokens;

  // Rule: Standalone keywords
  if (
    ["Snk_Begin", "Snk_End", "Else", "Begin", "End"].includes(firstToken.type)
  ) {
    if (restTokens.length !== 0) {
      return { error: `Unexpected tokens after ${firstToken.value}` };
      throw new Error(`Unexpected tokens after ${firstToken.value}`);
    }
    switch (firstToken.type) {
      case "Snk_Begin":
        return { ligne: line, message: "Début de programme" };
      case "Snk_End":
        return { ligne: line, message: "Fin de programme" };
      case "Else":
        return { ligne: line, message: "Bloc Else" };
      case "Begin":
        return { ligne: line, message: "Début de bloc de code" };
      case "End":
        return { ligne: line, message: "Fin de bloc de code" };
    }
  }

  // Rule: Declaration
  if (
    firstToken.type === "Snk_Real" ||
    firstToken.type === "Snk_Int" ||
    firstToken.type === "Snk_Strg"
  ) {
    return parseDeclaration(tokens, firstToken.type, line);
  }

  // Rule: Printing
  if (firstToken.type === "Snk_Print") {
    return parsePrint(tokens, line);
  }

  // Rule: Assignment
  if (firstToken.type === "Set" || firstToken.type === "Get") {
    return parseAssignment(tokens, line);
  }

  // Rule: Comment
  if (firstToken.type === "Commentaire") {
    return { ligne: line, message: "Un commentaire" };
  }

  if (firstToken.type === "If") {
    return parseIfStatement(tokens, line);
  }

  return {
    error: `Unrecognized line type: ${tokens.map((t) => t.value).join(" ")}`,
  };
  throw new Error(
    `Unrecognized line type: ${tokens.map((t) => t.value).join(" ")}`
  );
}

// Declaration: Snk_Real ident, ident #
function parseDeclaration(tokens, firstToken, line) {
  const [keyword, ...rest] = tokens;
  if (rest[rest.length - 1]?.type !== "finLigne") {
    return { error: "Declaration must end with #" };
    throw new Error("Declaration must end with #");
  }

  if (firstToken == "Snk_Real" || firstToken == "Snk_Int") {
    const identifiers = [];
    for (let i = 0; i < rest.length - 1; i++) {
      if (rest[i].type === "identificateur") {
        identifiers.push(rest[i].value);
      } else if (rest[i].type !== "," && rest[i].type !== "finLigne") {
        return { error: "Invalid token in declaration" };
        throw new Error("Invalid token in declaration");
      }
    }

    switch (firstToken) {
      case "Snk_Real":
        return {
          ligne: line,
          message: `Declaration de ${identifiers.length} variables de type réels`,
        };
      case "Snk_Int":
        return {
          ligne: line,
          message: `Declaration de ${identifiers.length} variables de type entiers`,
        };
    }
  }
  if (firstToken === "Snk_Strg") {
    if (
      rest.length !== 2 ||
      rest[0].type !== "chaineCharactere"
    ) {
      return { error: "Invalid Print declaration syntax" };
    }
    return {ligne: line, message: `Declaration d'une chaine de caractère ${rest[0].value}`}
  }
}

// Print: Snk_Print ident, ident # OR Snk_Print "text" #
function parsePrint(tokens, line) {
  const [keyword, ...rest] = tokens;

  if (rest[rest.length - 1]?.type !== "finLigne") {
    return { error: "Print instruction must end with #" };
    throw new Error("Print instruction must end with #");
  }

  if (rest[0].type === "identificateur") {
    const values = [];
    for (let i = 0; i < rest.length - 1; i++) {
      if (rest[i].type === "identificateur") {
        values.push(rest[i].value);
      } else {
        if (rest[i].type !== ",") {
          return { error: "Invalid token in print instruction" };
          throw new Error("Invalid token in print instruction");
        }
      }
    }
    return { ligne: line, message: `Affichage de ${values.length} variables` };
  } else if (rest[0].type === "chaineCharactere") {
    return {
      ligne: line,
      message: `Affichage de ${rest[0].value}`,
    };
  }
}

// Assignment: Get ident from ident # OR Set ident nombre #
function parseAssignment(tokens, line) {
  const [keyword, ident1, fromKeyword, ident2, endToken] = tokens;

  if (
    keyword?.type === "Set" &&
    ident1?.type === "identificateur" &&
    fromKeyword?.type === "nombre" &&
    ident2?.type === "finLigne"
  ) {
    return {
      ligne: line,
      message: `Affectation de ${fromKeyword.value} a ${ident1.value}`,
    };
  }

  if (
    keyword?.type === "Get" &&
    ident1?.type === "identificateur" &&
    fromKeyword?.type === "from" &&
    ident2?.type === "identificateur" &&
    endToken?.type === "finLigne"
  ) {
    return {
      ligne: line,
      message: `Affectation de ${ident2.value} & ${ident1.value}`,
    };
  }

  return { error: "Invalid assignment syntax" };
  throw new Error("Invalid assignment syntax");
}

function parseIfStatement(tokens, line) {
  const [keyword, crouche1, ident1, egalite, ident2, crouche2] = tokens;

  if (
    keyword?.type === "If" &&
    crouche1?.type === "[" &&
    (ident1?.type === "nombre" || ident1.type === "identificateur") &&
    (egalite?.type === ">" ||
      egalite?.type === "<" ||
      egalite?.type === "==") &&
    (ident2?.type === "nombre" || ident2.type === "identificateur") &&
    crouche2?.type === "]"
  ) {
    let egelite_msg;
    switch (egalite.type) {
      case "==":
        egelite_msg = "est égale a";
        break;
      case ">":
        egelite_msg = "est supérieure a";
        break;
      case "<":
        egelite_msg = "est inférieure a";
        break;
    }
    return {
      ligne: line,
      message: `Si ${ident1.value} ${egelite_msg} ${ident2.value}`,
    };
  }

  return { error: "Invalid If statement syntax" };
  throw new Error("Invalid If statement syntax");
}

// Example Parse
export function parseProgram(input) {
  const lines = input
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  const result = [];
  for (const line of lines) {
    const tokens = tokenizeLine(line);
    if (tokens?.error) {
      return tokens;
    } else {
      const parseResult = parseLine(tokens, line);
      if (parseResult.error) {
        return parseResult;
      } else {
        result.push(parseLine(tokens, line));
      }
    }
  }
  return result;
}

// const code = `
// Snk_Begin
// Snk_Int i, j, x1, x2 #
// Snk_Real x3 #
// Set i 33 #
// If [ i==50]
// Set x1 10 #
// Else
// Begin
// Get x2 from x3 #
// Set k 43.5 #
// Snk_Print x2, x3 #
// End
// Snk_Print " Hello :) " #
// Snk_Print i,j #
// ## ceci est un commentaire
// Snk_End
// `;
//
// console.log(JSON.stringify(parseProgram(code), null, 2));
