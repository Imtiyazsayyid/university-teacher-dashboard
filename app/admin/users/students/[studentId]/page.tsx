"use client";

import React, { useEffect, useState } from "react";
import StudentForm from "../Form";
import { Student } from "@/app/interfaces/StudentInterface";
import AdminServices from "@/app/Services/AdminServices";
import StandardErrorToast from "@/app/extras/StandardErrorToast";

interface Props {
  params: {
    studentId: string;
  };
}

const EditStudentPage = ({ params }: Props) => {
  const [studentDetails, setStudentDetails] = useState<Student>();

  const getSingleStudent = async () => {
    const res = await AdminServices.getSingleStudent(params.studentId);

    if (!res.data.status) {
      StandardErrorToast();
      return;
    }

    console.log({ res: res.data.data });

    setStudentDetails(res.data.data);
  };

  useEffect(() => {
    getSingleStudent();
  }, []);

  return <StudentForm currentStudent={studentDetails} />;
};

export default EditStudentPage;
