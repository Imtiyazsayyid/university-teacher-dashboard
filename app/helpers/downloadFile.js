import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import fileDownload from "js-file-download";
import { AlertCircleIcon } from "lucide-react";

function getExtension(url) {
  if (url.includes("//www.youtube.com/")) return "";

  const lastIndex = url.lastIndexOf(".");
  if (lastIndex === -1) {
    return "";
  }
  return url.substring(lastIndex);
}

const downloadFile = (url, filename) => {
  const type = getExtension(url);

  axios
    .get(url, {
      responseType: "blob",
    })
    .then((res) => {
      fileDownload(res.data, filename + type);
    })
    .catch((err) => {
      toast({
        title: "Cannot Download File",
        description: "The requested file is from an external source and cannot be downloaded.",
        action: <AlertCircleIcon className="text-red-500" />,
      });

      return;
    });
};
export default downloadFile;
