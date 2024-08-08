"use client";

import React, { useEffect, useState } from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { StyleSheetManager } from "styled-components";
import StandardErrorToast from "../extras/StandardErrorToast";

interface File {
  uri: string;
  fileName: string;
}

interface Props {
  file: File;
}

const UploadPlaceholderImage = ({ file }: Props) => {
  const [documentFile, setDocumentFile] = useState(file);
  const [show, setShow] = useState(false);

  const testLink = async (file: File) => {
    try {
      const res = await fetch(file.uri);
      setShow(true);
    } catch (err) {
      setShow(false);
    }
  };

  useEffect(() => {
    setDocumentFile(file);
    testLink(file);
  }, [file]);

  if (!file.uri) return null;

  return (
    <StyleSheetManager shouldForwardProp={(prop) => prop !== "mainState"}>
      {show ? (
        <div
          className="border rounded-xl overflow-hidden shadow-md cursor-pointer min-h-72 max-h-72"
          onClick={() => window.open(file.uri, "_blank")}
        >
          <DocViewer
            className="overflow-hidden border-none"
            theme={{
              primary: "#7c3aed",
              secondary: "#5296d8",
              tertiary: "#111",
              textPrimary: "#ffffff",
              textSecondary: "#5296d8",
              textTertiary: "#00000099",
              disableThemeScrollbar: false,
            }}
            documents={[documentFile]}
          />
        </div>
      ) : (
        <div
          className="min-h-32 max-h-32 border flex flex-col justify-center items-center rounded-lg shadow-md cursor-pointer"
          onClick={() => window.open(file.uri, "_blank")}
        >
          <p>No Preview Available.</p>
          <p className="text-stone-500 text-sm">Click to Open in Browser</p>
        </div>
      )}
    </StyleSheetManager>
  );
};

export default UploadPlaceholderImage;
