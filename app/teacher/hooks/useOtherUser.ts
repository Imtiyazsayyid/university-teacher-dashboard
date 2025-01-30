"use client";

import { FullConversationType } from "@/app/interfaces/ChatInterface";
import { useMemo } from "react";
import useTeacherDetails from "@/app/teacher/hooks/useTeacherDetails";
import { Teacher } from "@/app/interfaces/TeacherInterface";

const useOtherUser = (
  conversation:
    | FullConversationType
    | {
        teachers: Teacher[];
      }
) => {
  const currentTeacher = useTeacherDetails();

  const otherUser = useMemo(() => {
    const currentUserEmail = currentTeacher?.email;

    const otherUser = conversation.teachers.filter(
      (teacher) => teacher.email !== currentUserEmail
    );

    return otherUser[0];
  }, [currentTeacher?.email, conversation.teachers]);

  return otherUser;
};

export default useOtherUser;
