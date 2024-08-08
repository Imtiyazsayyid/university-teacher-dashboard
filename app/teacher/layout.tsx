import React from "react";
import VerticalNavBar from "./VerticalNavBar";
import HorizontalNavBar from "./HorizontalNavBar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full flex bg-slate-50 dark:bg-stone-950">
      <div className="w-fit h-full">
        <VerticalNavBar />
      </div>
      <div className="w-full h-full flex flex-col p-2 gap-2">
        <HorizontalNavBar />
        <div className="w-full border h-full max-h-full rounded-lg shadow-lg p-4 overflow-hidden overflow-y-auto bg-white dark:bg-[#111]">
          {children}
        </div>
      </div>
    </div>
  );
}
