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
  link?: string;
  setLink: (link: string) => void;
  divStyle: string;
}

const UploadProfileCloudinary = ({ setLink, divStyle, link }: Props) => {
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
              <button
                onClick={() => {
                  open();
                }}
              >
                <div className={divStyle}>
                  <img
                    className="w-full h-full object-cover rounded-full"
                    src={
                      link ||
                      "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
                    }
                  />
                </div>
              </button>
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
              <button
                onClick={() => {
                  open();
                }}
              >
                <div className={divStyle}>
                  <img
                    className="w-full h-full object-cover rounded-full"
                    src={
                      link ||
                      "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
                    }
                  />
                </div>
              </button>
            );
          }}
        </CldUploadWidget>
      </div>
    </>
  );
};

export default UploadProfileCloudinary;
