// src/utils/prism-snake.js
import Prism from "prismjs";

// Define the Snake language
Prism.languages.snake = {
  comment: /##.*/, // Single-line comments starting with #
  string: {
    pattern: /(["'])(?:(?!\1)[^\\]|\\.)*\1/, // Strings in single or double quotes
    greedy: true,
  },
  keyword: /\b(Snk_Begin|Snk_Int|Snk_Real|Set|Get|If|Else|Begin|End|Snk_Print|Snk_End)\b/, // Custom keywords
  number: /\b\d+(\.\d+)?\b/, // Numbers
  operator: /[-+*/=<>!]/, // Operators
  punctuation: /[{}[\];(),.:#]/, // Punctuation
};

export default Prism;
