import React from "react";

const SideBar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      {/* desktopSidebar */}
      {/* MobileSidebar */}
      <main className="h-full">{children}</main>
    </div>
  );
};

export default SideBar;
