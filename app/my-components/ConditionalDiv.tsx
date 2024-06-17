import React, { ReactNode } from "react";

interface Props {
  show: boolean;
  className?: string;
  children?: ReactNode;
}

const ConditionalDiv = ({ show, className, children }: Props) => {
  if (!show) return null;

  return <div className={className}>{children}</div>;
};

export default ConditionalDiv;
