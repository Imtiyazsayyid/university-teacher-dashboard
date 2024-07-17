import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";

interface Props {
  link: string;
  extraClassName?: string;
}

const PreviewAnything = ({ link, extraClassName }: Props) => {
  const [linkType, setLinkType] = useState("");
  const [formattedLink, setFormattedLink] = useState("");

  function convertToEmbeddableLink(youtubeLink: string) {
    var regExp =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;
    var match = youtubeLink.match(regExp);
    if (match) {
      var videoId = match[1];
      var embeddableLink = "https://www.youtube.com/embed/" + videoId;
      return embeddableLink;
    } else {
      return "";
    }
  }

  useEffect(() => {
    if (link) {
      setFormattedLink(link);
      if (link.startsWith("https://www.youtube.com/")) {
        setLinkType("embed");
        setFormattedLink(convertToEmbeddableLink(link));
      } else if (link.includes(".pdf")) {
        setLinkType("pdf");
      } else if (
        link.includes(".xlsx") ||
        link.includes(".xls") || // Excel files
        link.includes(".docx") ||
        link.includes(".doc") || // Word files
        link.includes(".pptx") ||
        link.includes(".ppt") || // PowerPoint files
        link.includes(".xlsm") ||
        link.includes(".xltx") || // Excel macro-enabled/template files
        link.includes(".docm") ||
        link.includes(".dotx") || // Word macro-enabled/template files
        link.includes(".pptm") ||
        link.includes(".potx") // PowerPoint macro-enabled/template files
      ) {
        setLinkType("msoffice");
      } else if (
        link.includes(".jpg") ||
        link.includes(".jpeg") ||
        link.includes(".png") ||
        link.includes(".gif") ||
        link.includes(".bmp") ||
        link.includes(".svg") ||
        link.includes(".webp") ||
        link.includes(".tiff")
      ) {
        setLinkType("img");
      } else {
        setLinkType("unknown");
      }
    }
  }, [link]);

  if (!linkType) return;

  // const className = "min-h-[400px] md:min-h-[500px] lg:min-h-[700px] w-full";
  const className = "min-h-[50vh] md:min-h-[60vh] w-full";

  return (
    <div
      className={`min-h-fit rounded-lg overflow-hidden flex flex-col justify-center items-center w-full ${extraClassName}`}
    >
      {linkType === "embed" && <iframe allowFullScreen className={className} src={formattedLink}></iframe>}

      {linkType === "pdf" && <object className={className} data={formattedLink}></object>}

      {linkType === "img" && (
        <div className="w-full">
          <img className={className + " max-h-[400px] object-cover"} src={formattedLink}></img>
        </div>
      )}

      {linkType === "msoffice" && (
        <iframe
          src={`https://view.officeapps.live.com/op/view.aspx?src=${formattedLink}`}
          className={className}
        ></iframe>
      )}

      {linkType === "unknown" && (
        <div className="min-h-[400px] md:min-h-[500px] lg:md:min-h-[700px] w-full flex flex-col justify-center items-center gap-5">
          <p color={"white"}>Could Not Preview Material</p>
          <a href={link} target="_blank">
            <Button>View In Browser</Button>
          </a>
        </div>
      )}
    </div>
  );
};

export default PreviewAnything;
