import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  divisionId: number;
  divisionName?: string;
  batchYear?: number;
  courseName?: string;
  courseAbbr?: string;
}

const DivisionCard = ({ divisionId, batchYear, courseName, courseAbbr, divisionName }: Props) => {
  const router = useRouter();

  return (
    <div
      className="h-[30rem] rounded-xl overflow-hidden flex flex-col bg-secondary gap-2 cursor-pointer"
      onClick={() => router.push(`/teacher/batches/${divisionId}`)}
    >
      <div className="h-3/4 w-full shadow-lg bg-primary flex flex-col items-center justify-center rounded-xl rounded-b-none">
        <h1 className="text-[12rem] h-[15rem] font-extrabold text-white">{divisionName}</h1>
        <h1 className="text-3xl font-extrabold text-white">{courseAbbr}</h1>
      </div>
      <div className="h-1/4 w-full rounded-lg flex flex-col justify-center items-center">
        <h1 className="text-2xl font-extrabold">{batchYear}</h1>
        <h1 className="text-center px-8">{courseName}</h1>
      </div>
    </div>
  );
};

export default DivisionCard;
