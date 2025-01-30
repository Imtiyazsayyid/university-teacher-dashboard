"use client";

import {
  Avatar as AvatarShadcn,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import useActiveList from "../../hooks/useActiveList";
import { Teacher } from "@/app/interfaces/TeacherInterface";

interface Props {
  teacher: Teacher;
}

const Avatar = ({ teacher }: Props) => {
  const { members } = useActiveList();

  const isActive = members.indexOf(teacher.email) !== -1;

  // to display the initials as avatar
  const getInitials = () => {
    if (!teacher?.firstName || !teacher?.lastName) {
      return "";
    }

    const firstName = teacher.firstName;
    const lastName = teacher.lastName;
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    return firstInitial + lastInitial;
  };

  return (
    <div className="relative">
      <div className="relative inline-block rounded-full h-9 w-9 md:h-11 md:w-11">
        <AvatarShadcn>
          <AvatarImage
            src={teacher?.profileImg ?? undefined} // Fallback to placeholder if no profile image
            alt={`${teacher?.firstName} ${teacher?.lastName} avatar`} // Fixed alt text to show full name
          />
          <AvatarFallback className="select-none font-semibold text-gray-500 bg-neutral-200">
            {getInitials()}
          </AvatarFallback>
        </AvatarShadcn>
        {isActive && (
          <span className="absolute block rounded-full bg-green-500 ring-2 ring-white top-0 right-0 h-3 w-3 md:h-3 md:w-3" />
        )}
      </div>
    </div>
  );
};

export default Avatar;
