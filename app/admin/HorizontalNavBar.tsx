"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertCircleIcon, BellIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { navBarItems } from "../extras/NavBarItems";
import { DarkModeToggle } from "../my-components/DarkModeToggle";
import { Admin } from "../interfaces/AdminInterface";
import AdminServices from "../Services/AdminServices";
import { toast } from "@/components/ui/use-toast";
import { abbreviate } from "../helpers/formatting";
import { ProfileDropdown } from "../my-components/ProfileDropdown";
import { TokenService } from "../Services/StorageService";
import StandardErrorToast from "../extras/StandardErrorToast";

const HorizontalNavBar = () => {
  const router = useRouter();
  const currentPath = usePathname();

  const [adminDetails, setAdminDetails] = useState<Admin>();

  const getAdminDetails = async () => {
    const res = await AdminServices.getAdminDetails();

    if (!res.data.status) {
      StandardErrorToast();
    }

    setAdminDetails(res.data.data);
  };

  useEffect(() => {
    getAdminDetails();
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
              {adminDetails?.firstName} {adminDetails?.lastName}
            </p>
            <p className="text-sm text-gray-500 text-end">Admin</p>
          </div>
          <ProfileDropdown logoutAction={signOut}>
            <Avatar className="cursor-pointer">
              <AvatarImage src={adminDetails?.profileImg || ""} alt="@shadcn" className="object-cover" />
              <AvatarFallback>
                {adminDetails ? abbreviate(adminDetails?.firstName + " " + adminDetails?.lastName) : "?"}
              </AvatarFallback>
            </Avatar>
          </ProfileDropdown>
        </div>
      </div>
    </div>
  );
};

export default HorizontalNavBar;
