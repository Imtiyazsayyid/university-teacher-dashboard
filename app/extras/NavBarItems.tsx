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
    route: "/teacher",
    title: "Home",
    key: "teacher",
    icon: HomeIcon,
    isOpen: false,
  },
  {
    route: "/teacher/courses",
    title: "Courses",
    icon: LibraryBigIcon,
    key: "courses",
    isOpen: false,
  },
];
