import { EyeIcon } from "lucide-react";
import React from "react";

interface Props {
  action: () => void;
}

const ViewTableAction = ({ action }: Props) => {
  return (
    <div
      className="border w-fit p-1 py-2 rounded-md hover:text-white hover:bg-primary"
      onClick={(e) => {
        e.stopPropagation;
        action();
      }}
    >
      <EyeIcon height={16} />
    </div>
  );
};

export default ViewTableAction;
