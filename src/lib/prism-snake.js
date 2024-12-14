import Prism from "prismjs";
import "./prism-snake-custom.css" 

Prism.languages.snake = {
  comment: /##.*/, 
  string: {
    pattern: /(["'])(?:(?!\1)[^\\]|\\.)*\1/, 
    greedy: true,
  },
  keyword: /\b(Snk_Begin|Snk_Int|Snk_Real|Snk_Strg|Set|Get|from|If|Else|Begin|End|Snk_Print|Snk_End)\b/,
  number: /\b\d+(\.\d+)?\b/, 
  operator: /[-+*/=<>!]/, 
  punctuation: /[{}[\];(),.:#]/, 
  other: /./,
};

export default Prism;
