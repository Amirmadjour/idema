import SnakeSVG from "@/Assets/svg/SnakeSVG";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "./ui/button";

const TabBar = () => {
  return (
    <div className="flex items-center justify-start w-full h-10 gap-4 px-2.5">
      <div className="flex items-center justify-center gap-2.5">
        <Button variant="ghost" className="w-8 h-8 p-0">
          <ChevronLeft
            className="text-foreground-secondary"
            style={{ width: "20px", height: "20px" }}
          />
        </Button>
        <Button variant="ghost" className="w-8 h-8 p-0">
          <ChevronRight
            className="text-foreground-secondary"
            style={{ width: "20px", height: "20px" }}
          />
        </Button>
      </div>
      <div className="h-6">
        <Separator orientation="vertical" />
      </div>
      <div className="flex items-center justify-center gap-2.5 p-1.5 bg-background rounded-md">
        <SnakeSVG />
        <p>amir.snk</p>
        <Button className="w-5 h-5 p-0 text-foreground-secondary" variant="ghost">
          <X className="text-foreground-secondary" size={11} strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
};

export default TabBar;
