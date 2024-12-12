"use client";

import { useState } from "react";
import Editor from "@/components/Editor";
import NavBar from "@/components/NavBar";
import StatusBar from "@/components/StatusBar";
import SideBar from "@/components/SideBar";
import ResizableMain from "@/components/ResizableMain";
import TabBar from "@/components/TabBar";
import { Separator } from "@/components/ui/separator";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-0.5 bg-background-secondary w-full h-full">
      <NavBar />
      <div className="w-full h-full flex items-center justify-center">
        <SideBar />
        <Separator orientation="vertical" />
        <div className="w-full h-full overflow-hidden">
          <Separator />
          <TabBar />
          <ResizableMain />
        </div>
      </div>
      <StatusBar />
    </div>
  );
};

export default Home;
