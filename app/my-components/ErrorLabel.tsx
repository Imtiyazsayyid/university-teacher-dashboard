import { Label } from "@/components/ui/label";
import React from "react";

interface Props {
  errorMessage: string;
}

const ErrorLabel = ({ errorMessage }: Props) => {
  if (!errorMessage) return null;
  return <Label className="text-xs text-red-500">{errorMessage}</Label>;
};

export default ErrorLabel;
