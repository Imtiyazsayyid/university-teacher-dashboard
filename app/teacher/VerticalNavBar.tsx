"use client";

import React, { useEffect, useState } from "react";
import { DarkModeToggle } from "../my-components/DarkModeToggle";
import { Separator } from "@/components/ui/separator";
import { navBarItems as InitNavBarItems, VerticalNavBarItem } from "../extras/NavBarItems";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronDownIcon,
  ChevronUpIcon,
  CrossIcon,
  GraduationCapIcon,
  HomeIcon,
  School,
  SchoolIcon,
  XIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

const VerticalNavBar = () => {
  const currentPath = usePathname();
  const router = useRouter();
  const [isActive, setActive] = useState(false);
  const [isHovered, setHovered] = useState(false);
  const [navBarItems, setNavBarItems] = useState<VerticalNavBarItem[]>(InitNavBarItems);

  const handleOpen = (link: string) => {
    const updatedListItems = navBarItems.map((item) =>
      item.route === link ? { ...item, isOpen: !item.isOpen } : item
    );
    setNavBarItems(updatedListItems);
  };

  const isCurrentPath = (item: VerticalNavBarItem) => {
    if (item.route === "/admin" && currentPath === "/admin") {
      return true; // Exact match for home
    } else if (item.route !== "/admin") {
      let items = currentPath.split("/");
      items.splice(0, 2);

      if (items.includes(item.key)) {
        return true;
      }

      return false;
    } else {
      return false;
    }
  };

  const getOpeningStyles = () => {
    if (isActive) {
      return "w-[350px] max-w-[350px]";
    } else if (isHovered) {
      return "fixed w-[350px] max-w-[350px] z-50 bg-[#111]";
    } else {
      return "w-fit max-w-fit";
    }
  };

  const getAnimationStyles = () => {
    if (isActive) {
      return { width: "350px", maxWidth: "350px" };
    } else if (isHovered) {
      return { width: "350px", maxWidth: "350px", display: "fixed", zIndex: "99" };
    } else {
      return { width: "80px", maxWidth: "80px", alignItems: "center" };
    }
  };

  useEffect(() => {
    const isNavOpen = localStorage.getItem("navOpen");
    isNavOpen === "true" ? setActive(true) : setActive(false);
  }, []);

  return (
    <motion.div
      className={`h-full p-5 flex flex-col gap-2 py-14 bg-white dark:bg-[#111] border-r ${getOpeningStyles()}`}
      animate={getAnimationStyles()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {(isHovered || isActive) && (
        <div className="relative left-[92%] bottom-[20px] w-fit cursor-pointer">
          <Checkbox
            checked={isActive}
            className="rounded-full h-5 w-5 border-2"
            onCheckedChange={(val) => {
              console.log(val);
              setActive(val as boolean);
              localStorage.setItem("navOpen", val.toString());
            }}
          />
        </div>
      )}
      <div className={`${!isActive && !isHovered && "flex justify-center w-full"}`}>
        <GraduationCapIcon size={isActive || isHovered ? 100 : 30} />
      </div>
      {(isActive || isHovered) && (
        <div>
          <h1 className="text-4xl font-extrabold">
            Teacher <br /> University
          </h1>
        </div>
      )}

      <Separator className="mt-3" />

      {navBarItems.map((item) => (
        <div key={item.route}>
          <div
            className={`rounded-lg p-3 mb-2 flex justify-between cursor-pointer ${
              isCurrentPath(item) && "bg-primary text-white"
            }`}
            onClick={() => {
              if (item && item.subRoutes) {
                handleOpen(item.route);
                return;
              }

              router.push(item.route);
            }}
          >
            <div className="flex items-center gap-2">
              <item.icon height={"20"} />
              {(isActive || isHovered) && <p>{item.title}</p>}
            </div>
            {(isActive || isHovered) && item.subRoutes && item.subRoutes?.length > 0 && (
              <div className="flex items-center">
                {!item.isOpen ? <ChevronDownIcon height={12} /> : <ChevronUpIcon height={12} />}
              </div>
            )}
          </div>
          <Separator />
          {(isActive || isHovered) && (
            <motion.div className="overflow-hidden" animate={item.isOpen ? { height: "fit-content" } : { height: 0 }}>
              <div
                className={`rounded-lg p-3 flex flex-col justify-center gap-2 cursor-pointer ${
                  ""
                  // isCurrentPath(item) && "bg-primary text-white"
                }`}
              >
                {item.subRoutes &&
                  item.subRoutes?.length > 0 &&
                  item.subRoutes.map((subItem) => (
                    <div
                      className={`rounded-lg p-3 flex items-center gap-2 cursor-pointer ${
                        isCurrentPath(subItem) ? "bg-primary text-white" : ""
                      }`}
                      onClick={() => {
                        router.push(subItem.route);
                      }}
                      key={subItem.route}
                    >
                      <subItem.icon height={"20"} />
                      {(isActive || isHovered) && <p>{subItem.title}</p>}
                    </div>
                  ))}
              </div>
              <Separator />
            </motion.div>
          )}
        </div>
      ))}
    </motion.div>
  );
};

export default VerticalNavBar;
