import {
  BlocksIcon,
  BoxesIcon,
  CircleUserRound,
  FilesIcon,
  GraduationCapIcon,
  HomeIcon,
  LayoutListIcon,
  LibraryBigIcon,
  LucideIcon,
  SlidersHorizontalIcon,
  UsersIcon,
} from "lucide-react";

export interface VerticalNavBarItem {
  route: string;
  title: string;
  icon: LucideIcon;
  key: string;
  isOpen: boolean;
  subRoutes?: VerticalNavBarItem[];
}

export const navBarItems: VerticalNavBarItem[] = [
  {
    route: "/admin",
    title: "Home",
    key: "admin",
    icon: HomeIcon,
    isOpen: false,
  },
  {
    route: "/admin/masters",
    isOpen: false,
    icon: SlidersHorizontalIcon,
    title: "Masters",
    key: "masters",
    subRoutes: [
      {
        route: "/admin/masters/teacher-roles",
        isOpen: false,
        key: "teacher-roles",
        icon: LayoutListIcon,
        title: "Teacher Roles",
      },
      {
        route: "/admin/masters/student-documents",
        isOpen: false,
        key: "student-documents",
        icon: FilesIcon,
        title: "Student Documents",
      },
    ],
  },
  {
    route: "/admin/users",
    isOpen: false,
    icon: UsersIcon,
    title: "Users",
    key: "users",
    subRoutes: [
      {
        route: "/admin/users/teachers",
        isOpen: false,
        icon: CircleUserRound,
        title: "Teachers",
        key: "teachers",
      },
      {
        route: "/admin/users/students",
        isOpen: false,
        icon: GraduationCapIcon,
        title: "Students",
        key: "students",
      },
    ],
  },
  {
    route: "/admin/courses",
    title: "Courses",
    icon: LibraryBigIcon,
    key: "courses",
    isOpen: false,
  },
  {
    route: "/admin/batches",
    title: "Batches",
    key: "batches",
    icon: BlocksIcon,
    isOpen: false,
  },
];
