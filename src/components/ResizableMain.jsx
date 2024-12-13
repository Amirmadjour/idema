import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Editor from "@/components/Editor";
import Terminal from "./Terminal";

export default function ResizableMain() {

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
        <Terminal />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
