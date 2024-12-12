import React, { useState } from "react";
import { TriangleAlert, CircleX, MessageSquareText } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";

const items = [
  { id: uuidv4(), icon: <TriangleAlert /> },
  { id: uuidv4(), icon: <CircleX /> },
  { id: uuidv4(), icon: <MessageSquareText /> },
];
const StatusBar = () => {
  const [errCount, setErrCount] = useState(0);
  return (
    <div className="w-full h-fit flex items-center justify-start bg-primary px-2.5 py-0.5">
      {items.map((i) => (
        <Button size="sm" variant="ghost" key={i.id} className="text-white hover:text-white hover:bg-white/10">
          {i.icon} {errCount}
        </Button>
      ))}
    </div>
  );
};

export default StatusBar;
