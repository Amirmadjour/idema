import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Editor from "@/components/Editor";
import { useEditor } from "@/components/Context/EditorContext";
import clsx from "clsx";
import { v4 as uuidv4 } from "uuid";

export default function ResizableMain() {
  const { editor, setEditor } = useEditor();
  const terminalItems = [
    { id: uuidv4(), value: "lexique", text: "Lexique" },
    { id: uuidv4(), value: "syntax", text: "Syntax" },
    { id: uuidv4(), value: "semantique", text: "Sémantique" },
  ];

  console.log(editor.analysisResult);

  return (
    <ResizablePanelGroup
      direction="vertical"
      className="min-h-[200px] w-full rounded-lg border md:min-w-[450px]"
    >
      <ResizablePanel defaultSize={35}>
        <Editor />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={25}>
        <Tabs defaultValue="lexique" className="w-full h-full">
          <TabsList className="flex items-center justify-start gap-2">
            {terminalItems.map((i) => (
              <TabsTrigger
                key={i.id}
                value={i.value}
                className={clsx(
                  "relative data-[state=active]:bg-background-secondary data-[state=active]:after:content-['']",
                  "data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0",
                  "data-[state=active]:after:h-[2px] data-[state=active]:after:bg-blue-500 data-[state=active]:after:absolute"
                )}
              >
                {i.text}
              </TabsTrigger>
            ))}
          </TabsList>
          {editor.analysisResult && (
            <>
              <TabsContent value="lexique">
                tokens:{" "}
                {JSON.stringify(editor.analysisResult.lexical?.tokens, null, 2)}
              </TabsContent>
              <TabsContent value="syntax">
                is valid :{" "}
                {JSON.stringify(editor.analysisResult.syntax?.isValid, null, 2)}
              </TabsContent>
              <TabsContent value="semantique">
                is valid :{" "}
                {JSON.stringify(
                  editor.analysisResult.semantic?.isValid,
                  null,
                  2
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
