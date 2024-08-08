"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertCircleIcon, BellIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { navBarItems } from "../extras/NavBarItems";
import { DarkModeToggle } from "../my-components/DarkModeToggle";
import { Teacher } from "../interfaces/TeacherInterface";
import TeacherServices from "../Services/TeacherServices";
import { toast } from "@/components/ui/use-toast";
import { abbreviate } from "../helpers/formatting";
import { ProfileDropdown } from "../my-components/ProfileDropdown";
import { TokenService } from "../Services/StorageService";
import StandardErrorToast from "../extras/StandardErrorToast";
import { useAtom, useStore } from "jotai";
import { setTeacherDetails, teacherDetails } from "../store/Store";

const HorizontalNavBar = () => {
  const router = useRouter();
  const store = useStore();
  const [teacher] = useAtom(teacherDetails);

  useEffect(() => {
    store.set(setTeacherDetails);
  }, []);

  const signOut = () => {
    TokenService.removeAccessToken();
    router.push("/auth/login");
  };

  return (
    <div className="h-[75px] min-h-[75px] max-h-[75px] border rounded-lg shadow-sm flex justify-between items-center p-5 px-7 bg-white dark:bg-[#111]">
      <div className="flex gap-5 items-center">
        {/* <h1 className="font-bold text-2xl">{currentItem?.title || ""}</h1> */}
        <DarkModeToggle />
        <BellIcon height={"20"} className="text-gray-500" cursor={"pointer"} />
      </div>
      <div></div>
      <div className="flex gap-5 items-center">
        <div className="flex gap-4">
          <div>
            <p className="font-bold">
              {teacher?.firstName} {teacher?.lastName}
            </p>
            <p className="text-sm text-gray-500 text-end">Teacher</p>
          </div>
          <ProfileDropdown logoutAction={signOut}>
            <Avatar className="cursor-pointer">
              <AvatarImage src={teacher?.profileImg || ""} alt="@shadcn" className="object-cover" />
              <AvatarFallback>
                {teacher ? abbreviate(teacher?.firstName + " " + teacher?.lastName) : "?"}
              </AvatarFallback>
            </Avatar>
          </ProfileDropdown>
        </div>
      </div>
    </div>
  );
};

export default HorizontalNavBar;
