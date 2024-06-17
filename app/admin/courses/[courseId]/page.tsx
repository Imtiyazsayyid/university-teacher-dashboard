"use client";

import React, { useEffect, useState } from "react";
import CourseForm from "../Form";
import { Course } from "@/app/interfaces/CourseInterface";
import AdminServices from "@/app/Services/AdminServices";
import StandardErrorToast from "@/app/extras/StandardErrorToast";

interface Props {
  params: {
    courseId: string;
  };
}

const EditCoursePage = ({ params }: Props) => {
  const [courseDetails, setCourseDetails] = useState<Course>();

  const getSingleCourse = async () => {
    const res = await AdminServices.getSingleCourse(params.courseId);

    if (!res.data.status) {
      StandardErrorToast();
      return;
    }

    setCourseDetails(res.data.data);
  };

  useEffect(() => {
    getSingleCourse();
  }, []);

  return <CourseForm currentCourse={courseDetails} />;
};

export default EditCoursePage;
