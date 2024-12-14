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
  console.log("Line to tokenize: ", remainingLine);

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
      throw new Error(`Unexpected token: "${remainingLine}"`);
    }
  }
  console.log("tokens: ", tokens);

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

function parseLine(tokens) {
  if (tokens.length === 0) return;

  const [firstToken, ...restTokens] = tokens;

  // Rule: Standalone keywords
  if (
    ["Snk_Begin", "Snk_End", "Else", "Begin", "End"].includes(firstToken.type)
  ) {
    if (restTokens.length !== 0) {
      throw new Error(`Unexpected tokens after ${firstToken.value}`);
    }
    return { type: "Standalone", keyword: firstToken.value };
  }

  // Rule: Declaration
  if (firstToken.type === "Snk_Real" || firstToken.type === "Snk_Int") {
    return parseDeclaration(tokens);
  }

  // Rule: Printing
  if (firstToken.type === "Snk_Print") {
    return parsePrint(tokens);
  }

  // Rule: Assignment
  if (firstToken.type === "Set" || firstToken.type === "Get") {
    return parseAssignment(tokens);
  }

  // Rule: Comment
  if (firstToken.type === "Commentaire") {
    return { type: "Comment", text: tokens[0].value };
  }

  if (firstToken.type === "If") {
    return parseIfStatement(tokens);
  }

  throw new Error(
    `Unrecognized line type: ${tokens.map((t) => t.value).join(" ")}`
  );
}

// Declaration: Snk_Real ident, ident #
function parseDeclaration(tokens) {
  const [keyword, ...rest] = tokens;
  if (rest[rest.length - 1]?.type !== "finLigne") {
    throw new Error("Declaration must end with #");
  }

  const identifiers = [];
  for (let i = 0; i < rest.length - 1; i++) {
    if (rest[i].type === "identificateur") {
      identifiers.push(rest[i].value);
    } else if (rest[i].type !== "," && rest[i].type !== "finLigne") {
      throw new Error("Invalid token in declaration");
    }
  }

  return { type: "Declaration", keyword: keyword.value, identifiers };
}

// Print: Snk_Print ident, ident # OR Snk_Print "text" #
function parsePrint(tokens) {
  const [keyword, ...rest] = tokens;

  console.log("rest:", rest);

  if (rest[rest.length - 1]?.type !== "finLigne") {
    throw new Error("Print instruction must end with #");
  }

  if (rest[0].type === "identificateur" || rest[0].type === "chaineCharactere") {
    const values = [];
    for (let i = 0; i < rest.length - 1; i++) {
      if (rest[i].type === "identificateur" || rest[i].type === "," || rest[0].type === "chaineCharactere") {
        values.push(rest[i].value);
      } else {
        throw new Error("Invalid token in print instruction");
      }
    }
    return { type: "Print", keyword: keyword.value, values };
  } else if (rest[0].type === "Commentaire") {
    return { type: "Print", text: rest[0].value };
  }
}

// Assignment: Get ident from ident # OR Set ident nombre #
function parseAssignment(tokens) {
  const [keyword, ident1, fromKeyword, ident2, endToken] = tokens;

  if (
    keyword?.type === "Set" &&
    ident1?.type === "identificateur" &&
    fromKeyword?.type === "nombre" &&
    ident2?.type === "finLigne"
  ) {
    return {
      type: "Assignment",
      keyword: keyword.value,
      identifier: ident1.value,
      value: fromKeyword.value,
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
      type: "Assignment",
      keyword: keyword.value,
      identifier: ident1.value,
      from: ident2.value,
    };
  }

  throw new Error("Invalid assignment syntax");
}

function parseIfStatement(tokens) {
  const [keyword, crouche1, ident1, egalite, ident2, crouche2] = tokens;

  if (
    (keyword?.type === "If" &&
      crouche1?.type === "[" &&
      ident1?.type === "nombre") ||
    (ident1.type === "identificateur" && egalite?.type === ">") ||
    egalite?.type === "<" ||
    (egalite?.type === "==" && ident2?.type === "nombre") ||
    (ident2.type === "identificateur" && crouche1?.type === "]")
  ) {
    return {
      type: "If statement",
      keyword: keyword.value,
      identifier: ident1.value,
      egalite: egalite.value,
      secondeIdentifier: ident2.value,
    };
  }

  throw new Error("Invalid If statement syntax");
}

// Example Parse
function parseProgram(input) {
  const lines = input
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  const result = [];
  for (const line of lines) {
    const tokens = tokenizeLine(line);
    result.push(parseLine(tokens));
  }
  return result;
}

const code = `
Snk_Begin
Snk_Int i, j, x1, x2 #
Snk_Real x3 #
Set i 33 #
If [ i==50]
Set x1 10 #
Else
Begin
Get x2 from x3 #
Set k 43.5 #
Snk_Print x2, x3 #
End
Snk_Print " Hello :) " #
Snk_Print i,j #
## ceci est un commentaire
Snk_End
`;

console.log(JSON.stringify(parseProgram(code), null, 2));
