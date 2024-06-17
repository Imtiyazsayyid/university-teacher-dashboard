"use client";

import React, { useEffect, useState } from "react";
import TeacherForm from "../Form";
import { Teacher } from "@/app/interfaces/TeacherInterface";
import AdminServices from "@/app/Services/AdminServices";
import StandardErrorToast from "@/app/extras/StandardErrorToast";

interface Props {
  params: {
    teacherId: string;
  };
}

const EditTeacherPage = ({ params }: Props) => {
  const [teacherDetails, setTeacherDetails] = useState<Teacher>();

  const getSingleTeacher = async () => {
    const res = await AdminServices.getSingleTeacher(params.teacherId);

    if (!res.data.status) {
      StandardErrorToast();
      return;
    }

    setTeacherDetails(res.data.data);
  };

  useEffect(() => {
    getSingleTeacher();
  }, []);

  return <TeacherForm currentTeacher={teacherDetails} />;
};

export default EditTeacherPage;
