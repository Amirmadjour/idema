import React from "react";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import LogoSVG from "@/Assets/svg/LogoSVG";
import { Moon, Play, Sun } from "lucide-react";
import { useEditor } from "@/components/Context/EditorContext";
import { useEffect } from "react";
import { useTheme } from "@/components/Context/ThemeContext";
import { FileDropDown } from "@/components/FileDropDown";

const NavItems = [
  { id: uuidv4(), title: "Edit" },
  { id: uuidv4(), title: "Selection" },
  { id: uuidv4(), title: "Terminal" },
  { id: uuidv4(), title: "Help" },
];

const NavBar = () => {
  const { analyzeCode } = useEditor();
  const { theme, toggleTheme } = useTheme();

  const handleKeyPress = (event) => {
    if (event.ctrlKey && event.key === "Enter") {
      analyzeCode();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [analyzeCode]);

  return (
    <nav className="w-full flex items-center justify-between px-2.5 py-1 ">
      <div className="flex items-center justify-center gap-1">
        <LogoSVG />
        <div className="flex items-center justify-center">
          <FileDropDown />
          {NavItems.map((n) => (
            <Button variant="ghost" key={n.id} className="text-">
              {n.title}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center gap-1">
        <Button
          onClick={() => {
            analyzeCode();
          }}
          variant="ghost"
          className="w-10"
        >
          <Play />
        </Button>
        <Button variant="ghost" className="w-10" onClick={toggleTheme}>
          {theme === "light" ? (
            <Moon className="text-foreground-secondary" />
          ) : (
            <Sun className="text-foreground-secondary" />
          )}
        </Button>
      </div>
    </nav>
  );
};

export default NavBar;
