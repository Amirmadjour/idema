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
  const [isClient, setIsClient] = useState(false);

  const handleChange = (event) => {
    setEditor((prev) => {
      const index = prev.activeTab;
      const updatedTabs = [...prev.tabs];
      updatedTabs[index] = {
        ...updatedTabs[index],
        tabContent: event.target.value,
      };
      return { ...prev, tabs: updatedTabs };
    });
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && textRef.current) {
      const code = editor.tabs[editor.activeTab]?.tabContent;
      if (code != undefined) {
        textRef.current.innerHTML = Prism.highlight(
          code,
          Prism.languages.snake,
          "snake"
        );
      }
    }

    if (lineNumbersRef.current) {
      const code = editor.tabs[editor.activeTab]?.tabContent;
      if (code) {
        const lineCount = code.split("\n").length;
        const lines = Array.from({ length: lineCount }, (_, i) => i + 1).join(
          "\n"
        );
        lineNumbersRef.current.textContent = lines;
      }
    }
  }, [editor.tabs[editor.activeTab]?.tabContent, isClient]);

  const handleScroll = () => {
    if (textAreaRef.current && textRef.current) {
      textRef.current.scrollTop = textAreaRef.current.scrollTop;
      textRef.current.scrollLeft = textAreaRef.current.scrollLeft;
    }
  };

  return (
    <div className="w-full h-full flex relative">
      <div
        ref={lineNumbersRef}
        className="asbolute h-full bg-background-secondary text-right text-foreground p-2 pr-4 z-10"
        style={{
          fontFamily: "monospace",
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          userSelect: "none",
        }}
      ></div>

      <textarea
        ref={textAreaRef}
        className="absolute inset-0 w-full h-full opacity-90 border p-2 pl-10 bg-background text-transparent caret-foreground"
        value={editor.tabs[editor.activeTab]?.tabContent}
        onChange={handleChange}
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
        className="absolute inset-0 w-full h-full p-2 pl-10 whitespace-pre-wrap overflow-auto text-left border-opacity-50 pointer-events-none"
        style={{
          fontFamily: "monospace",
        }}
        aria-hidden="true"
      ></div>
    </div>
  );
};

export default Editor;
