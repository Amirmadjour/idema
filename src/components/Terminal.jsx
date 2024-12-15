import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEditor } from "@/components/Context/EditorContext";
import clsx from "clsx";
import { v4 as uuidv4 } from "uuid";
import { ScrollArea } from "./ui/scroll-area";

const Terminal = () => {
  const { editor, setEditor } = useEditor();
  const terminalItems = [
    { id: uuidv4(), value: "lexique", text: "Lexique" },
    { id: uuidv4(), value: "syntax", text: "Syntax" },
    { id: uuidv4(), value: "semantique", text: "Sémantique" },
  ];

  return (
    <Tabs
      defaultValue="lexique"
      className="w-full h-full flex flex-col items-start justify-start"
    >
      <TabsList className="flex items-center justify-start gap-2 w-full">
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
      {editor.analysisResult ? (
        editor.tabs[editor.activeTab]?.tabTitle?.split(".")[1] === "snk" ? (
          <>
            <TabsContent value="lexique" className="h-full min-h-0 w-full">
              {editor.analysisResult.lexical?.tokens && (
                <ScrollArea className="max-h-full max-w-full h-full w-full">
                  {Object.entries(editor.analysisResult.lexical?.tokens).map(
                    ([key, value]) => (
                      <div key={key}>
                        <strong>{key}:</strong> {JSON.stringify(value)}
                      </div>
                    )
                  )}
                </ScrollArea>
              )}
            </TabsContent>
            <TabsContent value="syntax" className="h-full min-h-0 w-full">
              {editor.analysisResult.syntax && (
                <ScrollArea className="max-h-full max-w-full h-full w-full">
                  {editor.analysisResult.syntax.map((i, index) => (
                    <div key={index}>
                      <strong>{i.ligne ? i.ligne : "Error"}:</strong>{" "}
                      {i.error ? i.error : JSON.stringify(i.message)}
                    </div>
                  ))}
                </ScrollArea>
              )}
            </TabsContent>
            <TabsContent value="semantique" className="h-full min-h-0 w-full">
              {editor.analysisResult.semantic && (
                <ScrollArea className="max-h-full max-w-full h-full w-full">
                  <strong>{Object.keys(editor.analysisResult.semantic)}</strong>{" "}
                  : {Object.values(editor.analysisResult.semantic)}
                </ScrollArea>
              )}
            </TabsContent>
          </>
        ) : (
          <div className="w-full bg-destructive text-destructive-foreground py-1.5 px-2">
            L'extention de fichier doit etre .snk
          </div>
        )
      ) : (
        <></>
      )}
    </Tabs>
  );
};

export default Terminal;
