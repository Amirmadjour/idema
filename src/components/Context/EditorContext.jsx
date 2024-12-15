"use client";
import { createContext, useContext, useState, useEffect } from "react";

// Create a context
const EditorContext = createContext();

export const EditorProvider = ({ children }) => {
  const [editor, setEditor] = useState({
    tabs: [{ tabTitle: "snake.snk", tabContent: "If a > b :" }],
    activeTab: 0,
    analysisResult: "",
  });

  const analyzeCode = async () => {
    const code = editor.tabs[editor.activeTab].tabContent;
    console.log("code: ", JSON.stringify(code));
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ code: code }), // Wrap code in an object for clarity
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to analyze code.");
      }

      const data = await response.json();
      console.log(data);
      setEditor((prev) => ({ ...prev, analysisResult: data }));
    } catch (error) {
      console.log("Error analyzing code:", error);
      setEditor((prev) => ({
        ...prev,
        analysisResult: "Error analyzing code: No code was provided.",
      }));
    }
  };

  return (
    <EditorContext.Provider value={{ editor, setEditor, analyzeCode }}>
      {children}
    </EditorContext.Provider>
  );
};

// Custom hook to access the context
export const useEditor = () => useContext(EditorContext);
