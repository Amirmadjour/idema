import { Files, GitFork, Bolt, Info } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";

const items = [
  {
    id: uuidv4(),
    icon: (
      <Files
        style={{ width: "28px", height: "28px" }}
        className="text-foreground-secondary"
        strokeWidth={1.5}
      />
    ),
  },
  {
    id: uuidv4(),
    icon: (
      <GitFork
        style={{ width: "28px", height: "28px" }}
        className="text-foreground-secondary"
        strokeWidth={1.5}
      />
    ),
  },
  {
    id: uuidv4(),
    icon: (
      <Bolt
        style={{ width: "28px", height: "28px" }}
        className="text-foreground-secondary"
        strokeWidth={1.5}
      />
    ),
  },
  {
    id: uuidv4(),
    icon: (
      <Info
        style={{ width: "28px", height: "28px" }}
        className="text-foreground-secondary"
        strokeWidth={1.5}
      />
    ),
  },
];

const SideBar = () => {
  return (
    <div className="w-fit h-full flex flex-col items-center justify-start gap-2">
      {items.map((i) => (
        <Button variant="ghost" key={i.id} className="w-fit h-fit">
          {i.icon}
        </Button>
      ))}
    </div>
  );
};

export default SideBar;
