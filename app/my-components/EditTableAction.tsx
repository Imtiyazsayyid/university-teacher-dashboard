import { SquarePenIcon } from "lucide-react";
import React from "react";

interface Props {
  action?: () => void;
}

const EditTableAction = ({ action }: Props) => {
  return (
    <div
      className="border w-fit p-1 py-2 rounded-md hover:text-white hover:bg-violet-700"
      onClick={(e) => {
        if (action) {
          e.stopPropagation();
          action();
        }
      }}
    >
      <SquarePenIcon height={16} />
    </div>
  );
};

export default EditTableAction;
