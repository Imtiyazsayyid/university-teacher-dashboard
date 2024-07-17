import { toast } from "@/components/ui/use-toast";
import { AlertCircleIcon } from "lucide-react";

export default function StandardErrorToast(title?: string, message?: string) {
  toast({
    title: title || "Uh oh! Something went wrong.",
    description: message || "There was a problem with your request.",
    action: <AlertCircleIcon className="text-red-500" />,
  });
}
