"use client";

import StandardErrorToast from "@/app/extras/StandardErrorToast";
import { DivisionSubjectTeacher } from "@/app/interfaces/DivisionSubejctTeacherInterface";
import GoBack from "@/app/my-components/GoBack";
import TeacherServices from "@/app/Services/TeacherServices";
import { LibraryBigIcon } from "lucide-react";
import { useEffect, useState } from "react";
import DivisionCard from "./DivisionCard";
import { Division } from "@/app/interfaces/DivisionInterface";

const page = () => {
  const [myDivisions, setMyDivisions] = useState<Division[]>([]);

  const getMyDivisions = async () => {
    try {
      const res = await TeacherServices.getAllTeacherDivisions();
      if (res.data.status) {
        setMyDivisions(res.data.data);
        return;
      }
      StandardErrorToast();
    } catch (error) {}
  };

  useEffect(() => {
    getMyDivisions();
  }, []);

  return (
    <div className="h-full flex flex-col gap-2 p-2">
      <div className="pt-5 pb-5 flex items-center gap-2">
        <GoBack />
        <div className="flex gap-1">
          <LibraryBigIcon height={25} width={25} />
          <h1 className="text-2xl font-extrabold">Batches</h1>
        </div>
      </div>
      <div className="border h-full rounded-xl overflow-hidden overflow-y-auto">
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-2 p-2">
          {myDivisions.map((d) => (
            <DivisionCard
              divisionId={d.id}
              divisionName={d.name}
              courseAbbr={d.batch.course.abbr}
              key={d.id}
              batchYear={d.batch.year}
              courseName={d.batch.course.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
