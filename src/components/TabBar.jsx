import SnakeSVG from "@/Assets/svg/SnakeSVG";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "./ui/button";
import { useEditor } from "./Context/EditorContext";
import clsx from "clsx";

const TabBar = () => {
  const { editor, setEditor } = useEditor();

  const handleDelete = (index) => {
    setEditor((prev) => ({
      ...prev,
      tabs: prev.tabs.filter((_, tabIndex) => tabIndex !== index),
      activeTab: prev.activeTab - 1 < 0 ? 0 : prev.activeTab,
    }));
  };

  const handleNextTab = () => {
    setEditor((prev) => {
      const newActiveTab = (prev.activeTab + 1) % prev.tabs.length;

      return {
        ...prev,
        activeTab: newActiveTab,
      };
    });
  };

  const handlePrevTab = () => {
    setEditor((prev) => {
      const newActiveTab =
        prev.activeTab - 1 < 0 ? prev.tabs.length - 1 : prev.activeTab - 1;

      return {
        ...prev,
        activeTab: newActiveTab,
      };
    });
  };

  return (
    <div className="flex items-center justify-start w-full h-10 gap-4 px-2.5">
      <div className="flex items-center justify-center gap-2.5">
        <Button onClick={handlePrevTab} variant="ghost" className="w-8 h-8 p-0">
          <ChevronLeft
            className="text-foreground-secondary"
            style={{ width: "20px", height: "20px" }}
          />
        </Button>
        <Button onClick={handleNextTab} variant="ghost" className="w-8 h-8 p-0">
          <ChevronRight
            className="text-foreground-secondary"
            style={{ width: "20px", height: "20px" }}
          />
        </Button>
      </div>
      <div className="h-6">
        <Separator orientation="vertical" />
      </div>
      <div className="flex items-center justify-center gap-2">
        {editor.tabs.map((i, index) => (
          <div
            key={index}
            className={clsx(
              "flex items-center cursor-pointer justify-center gap-2.5 p-1.5 bg-background rounded-md",
              index === editor.activeTab && "bg-primary/10"
            )}
            onClick={() => {
              setEditor((prev) => {
                return {
                  ...prev,
                  activeTab: index,
                };
              });
            }}
          >
            <SnakeSVG />
            <p>{i.tabTitle}</p>
            <Button
              className="w-5 h-5 p-0 text-foreground-secondary"
              variant="ghost"
              onClick={() => {
                handleDelete(index);
              }}
            >
              <X
                className="text-foreground-secondary"
                size={11}
                strokeWidth={2}
              />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabBar;
