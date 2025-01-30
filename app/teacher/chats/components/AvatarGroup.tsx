import { Teacher } from "@/app/interfaces/TeacherInterface";
import Image from "next/image";

interface Props {
  teachers: Teacher[];
}

const AvatarGroup = ({ teachers }: Props) => {
  // this retreive the first three users
  console.log("Teachers: ", teachers);
  const slicedUsers = teachers?.slice(0, 3);
  console.log("SlicedUser: ", slicedUsers);

  const positionMap = {
    0: "top-0 left-[12px]",
    1: "bottom-0 ",
    2: "bottom-0 right-0",
  };

  const getInitials = (teacher: Teacher) => {
    const firstNameInitial = teacher.firstName?.[0] ?? "";
    const lastNameInitial = teacher.lastName?.[0] ?? "";
    return (firstNameInitial + lastNameInitial).toUpperCase();
  };

  return (
    <div className="relative h-11 w-11">
      {slicedUsers.map((teacher, i) => (
        <div
          key={i}
          className={`absolute rounded-full overflow-hidden h-[21px] w-[21px] bg-neutral-200 flex items-center justify-center text-sm font-semibold text-gray-500 select-none ${
            positionMap[i as keyof typeof positionMap]
          }`}
        >
          {teacher.profileImg ? (
            <Image
              src={teacher.profileImg}
              alt="Avatar"
              fill
              className="object-cover"
            />
          ) : (
            <span>{getInitials(teacher)}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default AvatarGroup;
