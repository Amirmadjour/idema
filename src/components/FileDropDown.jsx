import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import clsx from "clsx";
import { useState } from "react";
import { useEditor } from "./Context/EditorContext";

export function FileDropDown() {
  const [open, setOpen] = useState(false);
  const { editor, setEditor } = useEditor();

  const handleFileChange = async (event) => {
    setOpen(false);
    console.log("file was selected");
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file.name);
      const fileName = file.name; // e.g., "example.txt"
      const fileExtension = fileName.split(".").pop(); // e.g., "txt"
      const fileType = file.type; // e.g., "text/plain"
      const fileSize = file.size; // size in bytes

      console.log("File Name:", fileName);
      console.log("File Extension:", fileExtension);
      console.log("File Type:", fileType);
      console.log("File Size:", fileSize);

      const fileContent = await readFileContent(file);
      console.log("File Content:", fileContent);
      setEditor((prev) => ({ ...prev, code: fileContent }));

      event.target.value = "";
    }
  };

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">File</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-background" align="start">
        <DropdownMenuLabel>Files</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <label
            className={clsx(
              "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
              "transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none",
              "data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-foreground/5"
            )}
          >
            New File
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            <input type="file" className="hidden" onChange={handleFileChange} />
          </label>
          <DropdownMenuItem>
            Import File
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
