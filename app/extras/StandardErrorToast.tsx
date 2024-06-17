import { toast } from "@/components/ui/use-toast";
import { AlertCircleIcon } from "lucide-react";

export default function StandardErrorToast() {
  toast({
    title: "Uh oh! Something went wrong.",
    description: "There was a problem with your request.",
    action: <AlertCircleIcon className="text-red-500" />,
  });
}
