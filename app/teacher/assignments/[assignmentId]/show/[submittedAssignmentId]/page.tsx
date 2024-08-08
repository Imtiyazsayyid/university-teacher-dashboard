"use client";

import { AssignmentsSubmitted } from "@/app/interfaces/AssignmentInterface";
import PreviewAnything from "@/app/my-components/PreviewAnything";
import TeacherServices from "@/app/Services/TeacherServices";
import {
  ChevronDownCircle,
  ChevronDownIcon,
  ChevronUpIcon,
  SquareArrowOutUpLeftIcon,
  SquareArrowOutUpRightIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface Props {
  params: {
    submittedAssignmentId: string;
  };
}

const AssignmentPage = ({ params }: Props) => {
  const [submittedAssignment, setSubmittedAssignment] = useState<AssignmentsSubmitted>();
  const [showUploadedMaterial, setShowUploadedMaterial] = useState(false);

  const getSubmittedAssignment = async () => {
    try {
      const res = await TeacherServices.getSubmittedAssigment(params.submittedAssignmentId);

      if (res.data.status) {
        setSubmittedAssignment(res.data.data);
        console.log({ data: res.data.data });
      }
    } catch (error) {
      console.error({ error });
    }
  };

  useEffect(() => {
    getSubmittedAssignment();
  }, []);

  return (
    <div className="w-full h-full flex flex-col rounded-lg p-10 gap-5">
      <div className="min-h-fit pb-5 flex items-center px-2 gap-5 border-b">
        <div className="h-full w-full flex justify-between items-center">
          <h1 className="text-4xl font-bold mb-2">{submittedAssignment?.assignment.name}</h1>
          <div className="text-end">
            <h3 className="text-xl font-bold">
              {submittedAssignment?.student.firstName} {submittedAssignment?.student.lastName}
            </h3>
            <p className="text-xl font-semibold text-stone-300">{submittedAssignment?.student.rollNumber}</p>
          </div>
        </div>
      </div>
      <div className="h-full flex flex-col gap-5 overflow-hidden overflow-y-auto pb-40 ">
        {submittedAssignment && submittedAssignment.assignment.assignmentUploads.length > 0 && (
          <div className="flex flex-col bg-slate-100 dark:bg-zinc-900 rounded-xl p-10">
            <div className="flex flex-column justify-between">
              <h1 className="text-3xl font-bold">Uploaded Material</h1>
              <div
                className="w-fit bg-violet-800 p-2 rounded-full top-5 right-5 cursor-pointer"
                onClick={() => setShowUploadedMaterial(!showUploadedMaterial)}
              >
                {showUploadedMaterial ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
              </div>
            </div>

            {showUploadedMaterial && (
              <div className="w-full min-h-96 gap-4 flex items-center overflow-hidden overflow-x-auto">
                {submittedAssignment?.assignment.assignmentUploads.map((u, index) => (
                  <div className="relative" key={u.id}>
                    <PreviewAnything link={u.material_url} key={u.id} extraClassName="max-w-96 max-h-80" />
                    <a
                      className="border w-fit absolute bg-violet-800 p-2 rounded-full top-5 right-5"
                      href={u.material_url}
                      target="_blank"
                    >
                      <SquareArrowOutUpRightIcon className="h-5 w-5" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {submittedAssignment?.assignment.responses.map((r, index) => (
          <div className="w-full rounded-xl p-10 bg-slate-100 dark:bg-zinc-900" key={r.id}>
            <h3 className="text-3xl font-bold mb-5">
              Q{index + 1}. {r.assignmentQuestion.question}
            </h3>
            <div dangerouslySetInnerHTML={{ __html: r.answer }}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignmentPage;
