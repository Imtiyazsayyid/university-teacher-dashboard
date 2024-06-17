"use client";

import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";

interface CloudinaryResult {
  url: string;
  public_id: string;
}

interface Props {
  setLink: (link: string) => void;
}

const UploadCloudinary = ({ setLink }: Props) => {
  return (
    <CldUploadWidget
      options={{
        sources: ["local", "url"],
        multiple: false,
        cropping: true,
        styles: {
          palette: {
            window: "#ffffff",
            sourceBg: "#f4f4f5",
            windowBorder: "#90a0b3",
            tabIcon: "#000000",
            inactiveTabIcon: "#555a5f",
            menuIcons: "#555a5f",
            link: "#0433ff",
            action: "#339933",
            inProgress: "#0433ff",
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
            className="bg-violet-600 hover:bg-violet-700 w-full"
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
  );
};

export default UploadCloudinary;
