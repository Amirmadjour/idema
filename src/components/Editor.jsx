"use client";

import { useEditor } from "@/components/Context/EditorContext";
import { useEffect, useRef, useState } from "react";
import Prism from "@/lib/prism-snake";
import "prismjs/themes/prism.css";

const Editor = () => {
  const { editor, setEditor } = useEditor();
  const textRef = useRef(null);
  const textAreaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isClient, setIsClient] = useState(false);

  const handleChange = (event) => {
    const value = event.target.value;
    setEditor((prev) => ({ ...prev, code: value }));
    setCursorPosition(event.target.selectionStart); // Update cursor position
  };

  const handleKeyUp = (event) => {
    setCursorPosition(event.target.selectionStart); // Update cursor position
  };

  const handleScroll = () => {
    if (textAreaRef.current && textRef.current) {
      textRef.current.scrollTop = textAreaRef.current.scrollTop;
      textRef.current.scrollLeft = textAreaRef.current.scrollLeft;
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && textRef.current) {
      // Syntax-highlighted content
      const highlightedCode = Prism.highlight(
        editor.code,
        Prism.languages.snake,
        "snake"
      );

      // Insert cursor manually
      const cursorSpan = `<span class="cursor">|</span>`;
      const beforeCursor = highlightedCode.slice(0, cursorPosition);
      const afterCursor = highlightedCode.slice(cursorPosition);
      textRef.current.innerHTML = beforeCursor + cursorSpan + afterCursor;
    }

    if (lineNumbersRef.current) {
      const lineCount = editor.code.split("\n").length;
      const lines = Array.from({ length: lineCount }, (_, i) => i + 1).join(
        "\n"
      );
      lineNumbersRef.current.textContent = lines;
    }
  }, [editor.code, cursorPosition, isClient]);

  return (
    <div className="w-full h-full flex relative">
      <div
        ref={lineNumbersRef}
        className="absolute h-full bg-background-secondary text-right text-foreground p-2 pr-4 z-10"
        style={{
          fontFamily: "monospace",
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          userSelect: "none",
        }}
      ></div>

      <textarea
        ref={textAreaRef}
        className="absolute inset-0 w-full h-full opacity-0 border p-2 pl-10 bg-transparent caret-transparent"
        value={editor.code}
        onChange={handleChange}
        onKeyUp={handleKeyUp}
        onScroll={handleScroll}
        placeholder="Enter your Snake code here"
        style={{
          fontFamily: "monospace",
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
        }}
      />
      <div
        ref={textRef}
        className="absolute inset-0 w-full h-full p-2 pl-10 whitespace-pre-wrap overflow-auto bg-background text-left border-opacity-50 pointer-events-none"
        style={{
          fontFamily: "monospace",
        }}
        aria-hidden="true"
      ></div>
    </div>
  );
};

export default Editor;
