import { Badge } from "@/components/ui/badge";
import { CheckCircleIcon, Clock12, Clock12Icon, XCircleIcon } from "lucide-react";
import moment from "moment";
import React from "react";

interface Props {
  dueDate: Date;
  isSubmitted: boolean;
}

const AssignmentStatusBadge = ({ isSubmitted, dueDate }: Props) => {
  let colorScheme;
  const now = moment();
  const due = moment(dueDate);

  const isLate = now.isSameOrAfter(due);

  return (
    <div>
      {isLate && !isSubmitted ? (
        <Badge className="px-1 pr-4 bg-rose-600 dark:bg-rose-800">
          <XCircleIcon className="mr-2" />
          Not Submitted
        </Badge>
      ) : isSubmitted ? (
        <Badge className="px-1 pr-4 bg-emerald-600 dark:bg-emerald-800">
          <CheckCircleIcon className="mr-2" />
          Turned In
        </Badge>
      ) : (
        <Badge className="px-1 pr-4 bg-indigo-600 dark:bg-indigo-700">
          <Clock12Icon className="mr-2" />
          Pending
        </Badge>
      )}
    </div>
  );
};

export default AssignmentStatusBadge;
