"use client";

import React, { useEffect, useState } from "react";
import AssignmentForm from "../Form";
import TeacherServices from "@/app/Services/TeacherServices";
import StandardErrorToast from "@/app/extras/StandardErrorToast";
import { Question } from "../Form";

interface Props {
  searchParams: {
    assignmentId: string;
  };
}

const NewAssignmentPage = ({ searchParams }: Props) => {
  const [assignmentDetails, setAssignmentDetails] = useState({
    name: "",
    description: "",
    divisionId: undefined as number | undefined,
    subjectId: undefined as number | undefined,
    dueDate: new Date() as Date | string | undefined,
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [material, setMaterial] = useState<string[]>([]);
  const [assignmentId, setAssignmentId] = useState<number | undefined>();

  const getSingleAssignment = async () => {
    try {
      const res = await TeacherServices.getSingleAssignment(searchParams.assignmentId);

      if (!res.data.status) {
        StandardErrorToast();
        return;
      }

      const { id, name, divisionId, subjectId, description, dueDate, questions, material } = res.data.data;

      console.log({ id, name, divisionId, subjectId, description, dueDate, questions, material });
      setAssignmentId(id);
      setAssignmentDetails({
        name,
        divisionId,
        subjectId,
        description,
        dueDate,
      });

      if (questions && questions.length) {
        setQuestions(
          questions.map((q: any) => ({
            db_id: q.id,
            id: q.id,
            name: q.question,
          }))
        );
      }

      if (material && material.length) {
        setMaterial(material.map((m: any) => m.material_url));
      }
    } catch (error) {
      StandardErrorToast();
    }
  };

  useEffect(() => {
    if (searchParams.assignmentId) {
      getSingleAssignment();
    }
  }, []);

  return (
    <div>
      <AssignmentForm
        assignmentId={assignmentId}
        assignmentDetailsProp={assignmentDetails}
        questionsProp={questions}
        materialProp={material}
      />
    </div>
  );
};

export default NewAssignmentPage;
