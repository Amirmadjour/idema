"use client";
import { createContext, useContext, useState } from "react";

// Create a context
const EditorContext = createContext();

export const EditorProvider = ({ children }) => {
  const [editor, setEditor] = useState({
    code: "",
    analysisResult: "",
  });

  const analyzeCode = async () => {
    console.log("code: ", JSON.stringify(editor.code));
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ code: editor.code }), // Wrap code in an object for clarity
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to analyze code.");
      }

      const data = await response.json();
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
