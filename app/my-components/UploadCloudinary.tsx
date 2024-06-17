"use client";

import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface CloudinaryResult {
  url: string;
  public_id: string;
}

interface Props {
  setLink: (link: string) => void;
  btnClasses?: string;
}

const UploadProfileCloudinary = ({ setLink, btnClasses }: Props) => {
  return (
    <>
      <div className="hidden dark:block">
        <CldUploadWidget
          options={{
            sources: ["local", "url"],
            multiple: false,
            cropping: true,
            styles: {
              palette: {
                window: "#111111",
                sourceBg: "#111111",
                windowBorder: "#e11d47",
                tabIcon: "#ffffff",
                inactiveTabIcon: "#555a5f",
                menuIcons: "#555a5f",
                link: "#e11d47",
                action: "#339933",
                inProgress: "#e11d47",
                complete: "#339933",
                error: "#cc0000",
                textDark: "#000000",
                textLight: "#fcfffd",
              },
              fonts: {
                default: null,
                "sans-serif": {
                  url: null,
                  active: true,
                },
              },
            },
          }}
          uploadPreset="oekh1dfb"
          onUpload={(result) => {
            console.log({ result });
            if (result.event !== "success") return;
            const info = result.info as CloudinaryResult;
            if (info.url) {
              setLink(info.url);
            }
          }}
        >
          {({ open }) => {
            if (!open) return <></>;
            return (
              <Button
                className={`bg-violet-600 hover:bg-violet-700 w-full ${btnClasses}`}
                onClick={(e) => {
                  open();
                }}
              >
                <UploadIcon height={14} width={14} className="mr-2" />
                Upload
              </Button>
            );
          }}
        </CldUploadWidget>
      </div>
      <div className="dark:hidden">
        <CldUploadWidget
          options={{
            sources: ["local", "url"],
            multiple: false,
            cropping: true,
            styles: {
              palette: {
                window: "#fff",
                sourceBg: "f4f4f5",
                windowBorder: "#e11d47",
                tabIcon: "#000000",
                inactiveTabIcon: "#555a5f",
                menuIcons: "#555a5f",
                link: "#e11d47",
                action: "#339933",
                inProgress: "#e11d47",
                complete: "#339933",
                error: "#cc0000",
                textDark: "#000000",
                textLight: "#fcfffd",
              },
              fonts: {
                default: null,
                "sans-serif": {
                  url: null,
                  active: true,
                },
              },
            },
          }}
          uploadPreset="oekh1dfb"
          onUpload={(result) => {
            console.log({ result });
            if (result.event !== "success") return;
            const info = result.info as CloudinaryResult;
            if (info.url) {
              setLink(info.url);
            }
          }}
        >
          {({ open }) => {
            if (!open) return <></>;
            return (
              <Button
                className={`bg-violet-600 hover:bg-violet-700 w-full ${btnClasses}`}
                onClick={(e) => {
                  open();
                }}
              >
                <UploadIcon height={14} width={14} className="mr-2" />
                Upload Material
              </Button>
            );
          }}
        </CldUploadWidget>
      </div>
    </>
  );
};

export default UploadProfileCloudinary;
